import Base from "./base.class.js";
import Layers from "./layers.class.js";

export default class CanvasResizer extends Base {
    currentTransformedCursor = {x: 250, y: 250}
    cameraOffset = {x: this.canvasWidth / 2, y: this.canvasWidth / 2}
    cameraZoom = 0.5
    MAX_ZOOM = 5
    MIN_ZOOM = 0.1
    SCROLL_SENSITIVITY = 0.0010

    isDragging = false
    dragStart = {x: 0, y: 0}

    globalId = null;

    constructor(props) {
        super(props);
        //console.log('CanvasResizer Loaded');
        super.load().then(() => {
            this.recursion();
            this.setEvents();
        });
    }

    recursion() {
        let infinityRender = async () => {
            this.canvas.width = this.canvasWidth = window.screen.width;
            this.canvas.height = this.canvasHeight = window.screen.height;

            this.ctx.translate(this.currentTransformedCursor.x, this.currentTransformedCursor.y)
            this.ctx.scale(this.cameraZoom, this.cameraZoom)
            this.ctx.translate(-this.currentTransformedCursor.x + this.cameraOffset.x, -this.currentTransformedCursor.y + this.cameraOffset.y)

            await Layers.render();
            this.globalId = requestAnimationFrame(infinityRender);
        };
        infinityRender();
    }

    stopRecursion() {
        cancelAnimationFrame(this.globalId);
    }

    getEventLocation(e) {
        if (e.touches && e.touches.length === 1) {
            return {x: e.touches[0].clientX, y: e.touches[0].clientY}
        } else if (e.clientX && e.clientY) {
            return {x: e.clientX, y: e.clientY}
        }
    }

    onPointerDown(e) {
        if (e.spaceKey) {
            this.isDragging = true;
            let coordinates = this.getEventLocation(e);
            this.dragStart = {
                x: coordinates.x / this.cameraZoom - this.cameraOffset.x,
                y: coordinates.y / this.cameraZoom - this.cameraOffset.y
            };
        }
    }

    onPointerUp(e) {
        if (e.spaceKey) {
            this.isDragging = false
        }
    }

    onPointerMove(e) {
        if (this.isDragging && e.spaceKey) {
            let coordinates = this.getEventLocation(e);
            this.cameraOffset = {
                x: coordinates.x / this.cameraZoom - this.dragStart.x,
                y: coordinates.y / this.cameraZoom - this.dragStart.y
            };
        }
    }

    adjustZoom(zoomAmount) {
        if (!this.isDragging) {
            if (zoomAmount) {
                this.cameraZoom -= zoomAmount;
            }
            this.cameraZoom = Math.min(this.cameraZoom, this.MAX_ZOOM)
            this.cameraZoom = Math.max(this.cameraZoom, this.MIN_ZOOM)
        }
    }

    setEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.onPointerDown(e))
        this.canvas.addEventListener('mouseup', (e) => this.onPointerUp(e))
        this.canvas.addEventListener('mousemove', (e) => this.onPointerMove(e))
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.ctrlKey || e.metaKey)
                this.adjustZoom(e.deltaY * this.SCROLL_SENSITIVITY);
        })

        //pinch
        this.canvas.addEventListener('touchstart', (e) => this.onPointerDown(e))
        this.canvas.addEventListener('touchend', (e) => this.onPointerUp(e))
        this.canvas.addEventListener('touchmove', (e) => this.onPointerMove(e))
    }

}