import Frame from "./elements/frames.class.js";
import Layers from "./layers.class.js";

export default class Base {
    props = {};
    dropArea = null;
    canvas = null;
    ctx = null;
    canvasHeight = 0;
    canvasWidth = 0;

    constructor(props) {
        console.log("Base loaded");
        this.props = props;
        this.container = props.container;
        this.container.style.height = (window.innerHeight - this.props.navbar.clientHeight) + 'px';
    }

    async load() {
        await this.createCanvas();
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
}