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
        console.log("Base loaded", props);
        this.props = props;
    }

    async load() {
        await this.setDropArea();
        await this.createNavbar();
        await this.createCanvas();
    }

    async setDropArea() {
        this.dropArea = this.props.dropArea;
        this.dropArea.style.height = (window.innerHeight - this.props.navbar.clientHeight) + 'px';
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dropArea.addEventListener(eventName, function (e) {
                e.stopPropagation();
                e.preventDefault();
            }, false)
        });
        ['dragenter', 'dragover'].forEach(eventName => {
            this.dropArea.addEventListener(eventName, (e) => {
                this.dropArea.classList.add('highlight')
            }, false)
        });
        this.dropArea.addEventListener('dragleave', (e) => {
            this.dropArea.classList.remove('highlight')
        }, false);

        this.dropArea.addEventListener('drop', (e) => {
            this.dropArea.classList.remove('highlight')
            const fileList = e.dataTransfer.files;
        }, false);
    }

    async createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute("id", "canvas");
        this.canvas.setAttribute("style", "width:" + this.dropArea.clientWidth + 'px;height:' + this.dropArea.clientHeight + 'px');
        this.canvas.width = this.canvasWidth = window.screen.width;
        this.canvas.height = this.canvasHeight = window.screen.height;
        this.ctx = this.canvas.getContext('2d');
        window.ImageEditor = {
            canvas: this.canvas,
            ctx: this.ctx
        };
        this.dropArea.append(this.canvas);
        return this;
    }

    async createNavbar() {
        let elements = [
            {
                icon: '@imageEditor/icons/frame.svg',
                name: 'Frame',
                event: (e) => {
                    Layers.add(new Frame())
                }
            }
        ];
        let container = document.createElement('div');
        container.classList.add('container');
        for (let element of elements) {
            let anchor = document.createElement('a');
            anchor.title = element.name;
            let icon = document.createElement('img');
            icon.classList.add('icon');
            icon.width = 30;
            icon.height = 24;
            icon.src = element.icon;
            anchor.append(icon);
            anchor.addEventListener('click', element.event)
            container.append(anchor);
        }
        this.props.navbar.append(container);
    }

}