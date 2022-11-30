import Frame from "./elements/frames.class.js";
import Layers from "./layers.class.js";

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
        console.log("Base loaded");
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
        this.canvas.setAttribute("style", "width:" + this.container.clientWidth + 'px;height:' + this.container.clientHeight + 'px');
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

        });
        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const pos = this.getMouseCoordinates(e);
            this.isMouseInElement(pos.x, pos.y).then((index) => {
                console.log(index);
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

        console.log(`Original &nbsp;&nbsp;  x: ${event.offsetX}, y: ${event.offsetY}`)
        console.log(`Transformed x: ${transformedX}, y: ${transformedY}`)
        return {x: transformedX, y: transformedY};
    }

    async isMouseInElement(x, y) {
        return new Promise(((resolve, reject) => {
            Layers.getLayers().forEach((layer, index) => {
                let coordsX = layer.x;
                let coordsY = layer.y;
                let element_left = coordsX;
                let element_right = coordsX + layer.width;
                let element_top = coordsY;
                let element_bottom = coordsY + layer.height;

                /*console.log(layer);
                console.log(x, y);
                console.log(element_left, element_right, element_top, element_bottom);
                console.log(x > element_left, x < element_right, y > element_top, y < element_bottom);*/

                if (x > element_left && x < element_right && y > element_top && y < element_bottom) {
                    console.log('FOUND');
                    Layers.update(1, (ctx) => {
                        ctx.beginPath();
                        ctx.strokeStyle = "red";
                        ctx.rect(element_left, element_top, layer.width, layer.height);
                        ctx.stroke();
                    });
                    resolve(index);
                }
            });
            resolve(false);
        }))
    }
}