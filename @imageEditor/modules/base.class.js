import Layers from "./layers.class.js";
import ElementBase from "./elements/ElementBase.class.js";

export default class Base {
    props = {};
    dropArea = null;
    canvas = null;
    ctx = null;
    canvasHeight = 0;
    canvasWidth = 0;
    startX = 0;
    startY = 0;

    constructor(props) {
        //console.log("Base loaded");
        this.props = props;
        this.container = props.container;
        this.container.style.height = (window.innerHeight - this.props.navbar.clientHeight) + 'px';
    }

    async load() {
        await this.createCanvas();
        await this.globalEvents();
    }

    async createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute("id", "canvas");
        //this.canvas.setAttribute("style", "width:" + this.container.clientWidth + 'px;height:' + this.container.clientHeight + 'px');
        this.canvas.width = this.canvasWidth = window.screen.width;
        this.canvas.height = this.canvasHeight = window.screen.height;
        this.ctx = this.canvas.getContext('2d');
        window.ImageEditor = {
            canvas: this.canvas,
            ctx: this.ctx
        };
        this.container.append(this.canvas);
        return this;
    }

    async globalEvents() {
        this.canvas.classList.add('deactivate-active-layer');
        this.canvas.addEventListener('click', (e) => {
            //deactivate active Layer
            let activeLayer = this.props.layersHolder.querySelectorAll('.active.layer');
            if (activeLayer.length > 0)
                activeLayer.forEach((node) => node.classList.remove('active'));
            //end deactivate active Layer
        });
        this.canvas.addEventListener('mousemove', (e) => {
            e.preventDefault();
            const {x, y} = this.getMouseCoordinates(e);
            this.isMouseInElement(x, y).then((ref) => {
                ref.onmousemove();
            });
        });
        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const {x, y} = this.getMouseCoordinates(e);
            this.isMouseInElement(x, y).then((ref) => {
                ref.onmousedown();
                Layers.select(ref);
            });
        });
        this.canvas.addEventListener('mouseup', (e) => {
            e.preventDefault();
            const {x, y} = this.getMouseCoordinates(e);
            this.isMouseInElement(x, y).then((ref) => {
                ref.onmouseup();
            });
        });
    }

    getMouseCoordinates(event) {
        let newX, newY;
        if (['touchstart', 'touchmove'].includes(event.type)) {
            newX = event.touches[0].pageX - this.canvas.offsetLeft;
            newY = event.touches[0].pageY - this.canvas.offsetTop;
        } else {
            newX = event.offsetX;
            newY = event.offsetY;
        }
        const transform = this.ctx.getTransform();
        const inverseZoom = 1 / transform.a;

        const transformedX = inverseZoom * newX - inverseZoom * transform.e;
        const transformedY = inverseZoom * newY - inverseZoom * transform.f;

        //console.log(`Original &nbsp;&nbsp;  x: ${event.offsetX}, y: ${event.offsetY}`)
        //console.log(`Transformed x: ${transformedX}, y: ${transformedY}`)
        return {x: transformedX, y: transformedY};
    }

    async isMouseInElement(cx, cy) {
        return new Promise(((resolve, reject) => {
            Layers.checkElementIntersect(cx, cy, resolve, reject);
            //reject("Nothing found in this area.");
        }))
    }
}