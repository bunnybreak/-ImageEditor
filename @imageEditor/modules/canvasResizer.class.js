import Base from "./base.class.js";
import Layers from "./layers.class.js";

export default class CanvasResizer extends Base {
    cameraOffset = {x: window.innerWidth / 2, y: window.innerHeight / 2}
    cameraZoom = 1
    MAX_ZOOM = 5
    MIN_ZOOM = 0.1
    SCROLL_SENSITIVITY = 0.0005

    isDragging = false
    dragStart = {x: 0, y: 0}

    initialPinchDistance = null
    lastZoom = this.cameraZoom


    constructor(props) {
        super(props);
        console.log('CanvasResizer Loaded');
        super.load().then(() => {
            this.recurrence();
            this.setEvents();
        });
    }

    recurrence() {
        let infinityRender = async () => {
            this.canvas.width = this.canvasWidth = window.screen.width;
            this.canvas.height = this.canvasHeight = window.screen.height;
            this.ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2)
            this.ctx.scale(this.cameraZoom, this.cameraZoom)
            this.ctx.translate(-this.canvasWidth / 2 + this.cameraOffset.x, -this.canvasHeight / 2 + this.cameraOffset.y)
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
            await Layers.render();
            requestAnimationFrame(infinityRender);
        };
        infinityRender();
    }


    getEventLocation(e) {
        if (e.touches && e.touches.length === 1) {
            return {x: e.touches[0].clientX, y: e.touches[0].clientY}
        } else if (e.clientX && e.clientY) {
            return {x: e.clientX, y: e.clientY}
        }
    }


    onPointerDown(e) {
        this.isDragging = true
        this.dragStart.x = this.getEventLocation(e).x / this.cameraZoom - this.cameraOffset.x
        this.dragStart.y = this.getEventLocation(e).y / this.cameraZoom - this.cameraOffset.y
    }

    onPointerUp(e) {
        this.isDragging = false
        this.initialPinchDistance = null
        this.lastZoom = this.cameraZoom
    }

    onPointerMove(e) {
        if (this.isDragging) {
            this.cameraOffset.x = this.getEventLocation(e).x / this.cameraZoom - this.dragStart.x
            this.cameraOffset.y = this.getEventLocation(e).y / this.cameraZoom - this.dragStart.y
        }
    }

    handleTouch(e, singleTouchHandler) {
        if (e.touches.length === 1) {
            singleTouchHandler(e)
        } else if (e.type === "touchmove" && e.touches.length === 2) {
            this.isDragging = false
            this.handlePinch(e)
        }
    }

    handlePinch(e) {
        e.preventDefault();

        let touch1 = {x: e.touches[0].clientX, y: e.touches[0].clientY}
        let touch2 = {x: e.touches[1].clientX, y: e.touches[1].clientY}

        // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
        let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2

        if (this.initialPinchDistance == null) {
            this.initialPinchDistance = currentDistance
        } else {
            this.adjustZoom(null, currentDistance / this.initialPinchDistance)
        }
    }

    adjustZoom(zoomAmount, zoomFactor) {
        if (!this.isDragging) {
            if (zoomAmount) {
                this.cameraZoom += zoomAmount;
            } else if (zoomFactor) {
                this.cameraZoom = zoomFactor * this.lastZoom;
            }
            this.cameraZoom = Math.min(this.cameraZoom, this.MAX_ZOOM)
            this.cameraZoom = Math.max(this.cameraZoom, this.MIN_ZOOM)

        }
    }

    setEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.onPointerDown(e))
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e, this.onPointerDown))
        this.canvas.addEventListener('mouseup', (e) => this.onPointerUp(e))
        this.canvas.addEventListener('touchend', (e) => this.handleTouch(e, this.onPointerUp))
        this.canvas.addEventListener('mousemove', (e) => this.onPointerMove(e))
        this.canvas.addEventListener('touchmove', (e) => this.handleTouch(e, this.onPointerMove))
        this.canvas.addEventListener('wheel', (e) => this.adjustZoom(e.deltaY * this.SCROLL_SENSITIVITY))
    }

}