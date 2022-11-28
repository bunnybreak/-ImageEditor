import ImageEditor from "./ImageEditor.class.js";

let $editor;
$editor = new ImageEditor({
    navbar: document.getElementById('navbar'),
    dropArea: document.getElementById('drop-area'),
    container: document.getElementById('canvas-container'),
    layersHolder: document.getElementById('layers'),
    layerController: document.getElementById('controller'),
});