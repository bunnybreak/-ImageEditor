import ImageEditor from "./ImageEditor.class.js";

let $editor;
$editor = new ImageEditor({
    navbar: document.getElementById('navbar'),
    dropArea: document.getElementById('drop-area'),
    layer: document.getElementById('layers'),
    controller: document.getElementById('controller'),
});