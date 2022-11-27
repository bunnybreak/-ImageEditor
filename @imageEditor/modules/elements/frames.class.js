export default class Frame {
    width;
    height;
    x;
    y;
    ctx;

    constructor(params = {
        x: 0,
        y: 0,
        backgroundColor: '#FFF',
        width: 1920,
        height: 1080
    }) {
        this.x = params.x;
        this.y = params.y;
        this.backgroundColor = params.backgroundColor;
        this.width = params.width;
        this.height = params.height;
        //get Global CTX
        this.ctx = window.ImageEditor.ctx;
    }

    async render() {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        return this;
    }
}