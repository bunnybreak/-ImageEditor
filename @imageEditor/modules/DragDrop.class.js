export default class DragDrop {
    constructor(props) {
        console.log('Drag and Drop loaded');
        this.props = props;
        this.dropArea = props.dropArea;
        this.setDropAreaEvents();
    }

    setDropAreaEvents() {
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
}