import CanvasResizer from "./modules/canvasResizer.class.js";
import DragDrop from "./modules/DragDrop.class.js";
import MenuBar from "./modules/menuBar.class.js";
import LayerBar from "./modules/layerBar.class.js";

export default class ImageEditor {
    constructor(props) {
        console.log('ImageEditor Loaded');
        this.initKeyboardSpaceBarDetectEvents();
        this.navbar = new MenuBar(props);
        this.resizer = new CanvasResizer(props);
        this.layerBar = new LayerBar(props);
        this.dragDrop = new DragDrop(props);
    }

    initKeyboardSpaceBarDetectEvents() {
        window.onkeyup = (e) => {
            if (e.code === 'Space') {
                document.body.style.cursor = 'default';
                KeyboardEvent.prototype.spaceKey = MouseEvent.prototype.spaceKey = TouchEvent.prototype.spaceKey = false;
            }
        };
        window.onkeydown = (e) => {
            if (e.code === 'Space') {
                document.body.style.cursor = 'grabbing';
                KeyboardEvent.prototype.spaceKey = MouseEvent.prototype.spaceKey = TouchEvent.prototype.spaceKey = true;
            }
        }
    }
}