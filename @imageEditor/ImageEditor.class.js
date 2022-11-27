import CanvasResizer from "./modules/canvasResizer.class.js";

export default class ImageEditor {
    constructor(props) {
        console.log('ImageEditor Loaded');
        this.resizer = new CanvasResizer(props);
    }
}