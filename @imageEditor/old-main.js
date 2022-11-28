class ImageEditor {
    constructor(settings) {
        this.current_shape_key = null;
        this.current_shape_index = null;
        this.is_dragging = false;
        this.isSomethingSelected = false;
        this.fonts = [];
        document.addEventListener("DOMContentLoaded", () => {
            this.loadAllFonts().then(() => {
                this.settings = settings;
                this.canvasContainer = settings.container;
                this.controlsContainer = settings.controls;
                this.stackContainer = settings.stacks;
                this.elementContainer = settings.elements;
                this.textElementContainer = settings.textElementContainer;
                this.imageElementContainer = settings.imageElementContainer;
                this.canvasWidth = null;
                this.canvasHeight = null;
                this.init();
                this.initLibraries();
                this.initEvents();

                if (settings.data !== undefined && settings.data !== null) {
                    if (typeof settings.data === 'object') {
                        this.data.stack = settings.data;
                        for (let stack of settings.data) {
                            this.updateStack(stack);
                        }
                    }
                } else {
                    this.setBackground();
                }
                console.log('Editor Loaded');
            });
        });
        return this;
    }

    async loadAllFonts() {
        let fonts = document.querySelector('select[data-value="family"]');
        let options = fonts.options;
        for (let font of options) {
            let result = await this.loadFont(font.value, font.dataset.url);
            //console.log(result);
        }
        console.log('Fonts Loaded');
    }

    init() {
        this.canvasContainer.innerHTML = '';
        this.canvas = document.createElement('canvas');
        this.canvasContainer.append(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }

    setBackground() {
        if (this.settings.background !== undefined) {
            this.data.background({
                background: true,
                key: 'background',
                type: 'background',
                name: 'Background',
                src: this.settings.background
            });
        }
    }

    initLibraries() {

        const that = this;

        this.draw = {
            image: (obj, updateObj = null) => {

                let sample = {
                    key: 'image-' + this.random(),
                    src: null,
                    toDataUrl: null,
                    image: undefined,
                    type: 'image',
                    draggable: true,
                    x: 0,
                    y: 0,
                    width: undefined,
                    height: undefined,
                    callback: undefined,
                    editable: true
                };

                if (updateObj !== null) {
                    return {...sample, ...obj, ...updateObj};
                } else {
                    return {...sample, ...obj};
                }
            },
            text: (obj, updateObj = null) => {

                let sample = {
                    key: 'text-' + this.random(),
                    type: 'text',
                    text: 'Text',
                    draggable: true,
                    color: '#000000',
                    x: 100,
                    y: 100,
                    width: undefined,
                    height: undefined,
                    lines: 1,
                    font: '22px serif',
                    size: '22px',
                    textAlign: 'none',
                    family: 'serif',
                    url: undefined,
                    style: 'normal',
                    weight: 'normal',
                    variant: 'normal',
                    name: 'Text',
                    maxWidth: undefined,
                    callback: undefined,
                    editable: true
                };

                if (updateObj !== null) {
                    return {...sample, ...obj, ...updateObj};
                } else {
                    return {...sample, ...obj};
                }
            },
        };

        this.data = {
            stack: [],
            background: function (obj) {
                let image = new Image();
                image.src = obj.src;
                image.onload = () => {
                    obj = that.draw.image(obj);
                    that.canvas.width = that.canvasWidth = obj.width = image.width;
                    that.canvas.height = that.canvasHeight = obj.height = image.height;
                    obj.draggable = false;
                    obj.type = "image";
                    this.image(obj);
                };
                image.onerror = (e) => {
                    console.error(e);
                    that.setBackground();
                };
            },
            watermark: function (obj) {
                let image = new Image();
                image.src = obj.src;
                image.onload = () => {
                    obj = that.draw.image(obj);

                    obj.width = that.canvasWidth;
                    obj.height = that.canvasHeight;

                    obj.draggable = false;
                    obj.type = "image";
                    this.image(obj);
                };
                image.onerror = (e) => {
                    console.error(e);
                    this.remove(obj);
                };
            },
            image: function (obj) {
                let index = this.stack.findIndex((element => element.key === obj.key));
                if (index >= 0) {
                    obj = that.draw.image(this.stack[index], obj);
                } else {
                    obj = that.draw.image(obj);
                }
                if (obj.src !== null) {
                    let image = new Image();
                    image.onload = () => {
                        if (obj.callback !== undefined) {
                            if (typeof (obj.callback) === 'function') {
                                obj.callback(image, obj);
                            }
                        }
                        if (obj.name == null)
                            obj.name = 'Image';
                        obj.image = image;
                        if (index >= 0) {
                            this.stack[index] = obj;
                        } else {
                            this.stack.push(obj);
                        }
                        this.render();
                    };
                    image.onerror = (e) => {
                        console.error(e);
                        this.remove(obj);
                    };
                    image.src = obj.src;
                }

            },
            text: function (obj) {
                let index = this.stack.findIndex((element => element.key === obj.key));
                if (index >= 0) {
                    obj = that.draw.text(this.stack[index], obj);
                } else {
                    obj = that.draw.text(obj);
                }

                //that.loadFont(obj.family, obj.url);

                if (obj.callback !== undefined) {
                    if (typeof (obj.callback) === 'function') {
                        obj.callback(obj);
                    }
                }
                if (index >= 0) {
                    this.stack[index] = obj;
                } else {
                    this.stack.push(obj);
                }
                this.render();
            },
            showStack: function () {
                //console.log(this.stack);
            },
            remove: function (obj) {
                let key = null;
                if (typeof obj === 'object') {
                    key = obj.key;
                } else {
                    key = obj;
                }
                let index = this.stack.findIndex((element => element.key === key));
                if (index > -1) {
                    let stack = this.stack.splice(index, 1);
                    this.render();
                    return stack;
                }
                return undefined;
            },
            render: function () {
                this.showStack();
                const stacks = this.stack;
                that.stackContainer.innerHTML = '';
                for (let index in stacks) {
                    let stack = stacks[index];
                    try {
                        switch (stack.type) {
                            case 'image':
                                if (stack.image instanceof Image) {
                                    if (stack.width !== undefined)
                                        that.ctx.drawImage(stack.image, stack.x, stack.y, stack.width, stack.height);
                                    else
                                        that.ctx.drawImage(stack.image, stack.x, stack.y);

                                    that.stackContainer.innerHTML += '<li class="dd-item" data-index="' + index + '" data-key="' + stack.key + '"><div class="dd-handle"><i class="far fa-image"></i></div><div class="dd3-content">' + stack.name + '</div><div class="dd-handle" data-remove="' + stack.key + '"><i class="fa fa-times"></i></div</li>';
                                }
                                break;
                            case 'text':
                                stack.font = stack.style + ' ' + stack.variant + ' ' + stack.weight + ' ' + stack.size + ' ' + stack.family;
                                that.ctx.font = stack.font;
                                that.ctx.fillStyle = stack.color;
                                if (stack.textAlign !== 'none') {
                                    that.ctx.textAlign = stack.textAlign;
                                }

                                let lines = String(stack.text).split('\n');
                                stack.height = stack.width = 0;


                                if (lines.length > 0) {

                                    stack.lines = lines.length;
                                    let line_height = parseInt(stack.size);
                                    stack.height = line_height * stack.lines;

                                    for (let i in lines) {
                                        let line = lines[i];
                                        let measureText = that.ctx.measureText(line);
                                        if (measureText.width > stack.width)
                                            stack.width = measureText.width;

                                        if (stack.maxWidth !== undefined)
                                            that.ctx.fillText(line, stack.x, stack.y + (i * line_height), stack.maxWidth);
                                        else
                                            that.ctx.fillText(line, stack.x, stack.y + (i * line_height), stack.width);
                                    }
                                }
                                that.stackContainer.innerHTML += '<li class="dd-item" data-index="' + index + '" data-key="' + stack.key + '"><div class="dd-handle"><i class="fas fa-text-height"></i></div><div class="dd3-content">' + stack.name + '</div><div class="dd-handle" data-remove="' + stack.key + '"><i class="fa fa-times"></i></div</li>';
                                break;
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
                that.afterRenderEvents();
            }
        };
        this.random = function (length = 5) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        };
    }

    initEvents() {
        const that = this;

        const downloadImage = document.getElementById('downloadImage');
        downloadImage.addEventListener('click', () => {
            console.log('download');
            that.downloadCanvas(that.settings.filename + "-" + that.random());
        });

        const saveData = document.getElementById('saveData');
        saveData.addEventListener('click', () => {
            const form_data = new FormData();
            form_data.append('data', JSON.stringify(that.data.stack));
            form_data.append('toDataURL', that.canvas.toDataURL("image/jpeg"));
            /*for (let stack of that.data.stack) {
                if (stack.type === 'image')
                    form_data.append('images[' + stack.key + ']', '');
            }*/
            const http = new Http();
            http.ajax({
                processData: false,
                cache: false,
                contentType: false,
                url: that.settings.saveUrl,
                data: form_data,
                success: function (e) {
                    if (e.status === 200) {
                        swal({
                            title: 'Good job!',
                            text: e.message,
                            type: 'success',
                            padding: '2em'
                        });
                    } else {
                        swal({
                            title: 'Error !',
                            text: e.message,
                            type: 'error',
                            padding: '2em'
                        });
                    }
                },
            });

        });

        const textInput = document.getElementById('addNewText');
        textInput.addEventListener('click', () => {
            this.data.text({
                text: 'Text',
                x: 10,
                y: 50,
                font: '50px serif',
                size: '50px',
                family: 'serif',
                name: 'Text',
                callback: function (stack) {
                    let measure = that.ctx.measureText(stack.text);
                    stack.x = that.canvasWidth / 2 - measure.width;
                    stack.y = that.canvasHeight / 2 - measure.actualBoundingBoxAscent;
                }
            });
        });

        const imageInput = document.getElementById('addNewImage');
        imageInput.addEventListener('click', () => {
            this.data.image({
                src: './assets/editor/sample.jpeg',
                callback: function (image, stack) {
                    stack.width = image.width / 10;
                    stack.height = image.height / 10;

                    stack.x = that.canvasWidth / 2 - stack.width;
                    stack.y = that.canvasHeight / 2 - stack.height;
                }
            });
        });

        const toggleWaterMark = document.getElementById('toggleWaterMark');
        toggleWaterMark.addEventListener('click', () => {

            if (that.settings.watermark !== undefined) {
                console.log(that.watermark);
                if (that.watermark) {
                    that.watermark = false;
                    that.data.remove('watermark');
                } else {
                    that.watermark = true;
                    that.data.watermark({
                        key: 'watermark',
                        type: 'watermark',
                        name: 'Watermark',
                        src: that.settings.watermark
                    });
                }
            }
        });

        let startX, startY;

        this.canvas.onmousedown = function (event) {
            event.preventDefault();
            let pos = that.getMouseCoordinates(event);
            startX = pos.x;
            startY = pos.y;
            let index = 0;
            for (let stack of that.data.stack) {
                if (stack.draggable) {
                    if (that.isMouseInElement(startX, startY, stack)) {
                        that.current_shape_key = stack.key;
                        that.current_shape_index = index;
                        that.setElementContainer(stack);
                        that.setElementEditValue(stack);
                        that.is_dragging = true;
                        return;
                    }
                }
                index++;
            }

            that.textElementContainer.style.display = "none";
            that.imageElementContainer.style.display = "none";
            that.isSomethingSelected = false;
        };

        this.canvas.onmouseup = function (event) {
            if (!that.is_dragging) {
                return;
            }
            event.preventDefault();
            that.is_dragging = false;
        };

        this.canvas.onmouseout = function (event) {
            if (!that.is_dragging) {
                return;
            }
            event.preventDefault();
            that.is_dragging = false;
        };

        this.canvas.onmousemove = function (event) {
            if (that.is_dragging) {
                event.preventDefault();
                let pos = that.getMouseCoordinates(event);
                let dx = pos.x - startX;
                let dy = pos.y - startY;
                let stack = that.data.stack[that.current_shape_index];
                stack.x += dx;
                stack.y += dy;
                that.data.render();

                that.setElementEditValue(stack);

                startX = pos.x;
                startY = pos.y;
            }
        };

        document.addEventListener('mousedown', function (event) {
            that.lastDownTarget = event.target;
        }, false);

        document.addEventListener("keydown", function (e) {
            if (that.lastDownTarget !== undefined && that.lastDownTarget.matches('canvas')) {
                e.preventDefault();
                if (that.isSomethingSelected && ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key) && that.current_shape_index !== null) {
                    let stack = that.data.stack[that.current_shape_index];
                    let cords = 2;
                    if (e.shiftKey) {
                        cords = 20;
                    }
                    switch (e.key) {
                        case 'ArrowLeft':
                            // left key pressed
                            stack.x -= cords;
                            break;
                        case 'ArrowUp':
                            // up key pressed
                            stack.y -= cords;
                            break;
                        case 'ArrowRight':
                            // right key pressed
                            stack.x += cords;
                            break;
                        case 'ArrowDown':
                            // down key pressed
                            stack.y += cords;
                            break;
                    }
                    let targetX, targetY = null;
                    switch (stack.type) {
                        case 'text':
                            targetX = that.textElementContainer.querySelector('[data-value="x"]');
                            targetY = that.textElementContainer.querySelector('[data-value="y"]');
                            break;
                        case 'image':
                            targetX = that.imageElementContainer.querySelector('[data-value="x"]');
                            targetY = that.imageElementContainer.querySelector('[data-value="y"]');
                            break;
                    }

                    targetX.value = stack.x;
                    targetY.value = stack.y;

                    that.data.render();
                } else if ((e.ctrlKey || e.metaKey) && e.key === 'd' && that.current_shape_index !== null) {
                    that.duplicateSelectedElement()
                } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                    saveData.click();
                } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
                    console.log('Redo Trigger');
                } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                    console.log('Undo Trigger');
                }
            }
        }, false);


        let logos = document.querySelectorAll('.select-logo')

        for (let el of logos) {
            el.addEventListener('click', function (e) {
                let ele = e.currentTarget.querySelector('img');
                that.data.image({
                    name: ele.alt,
                    src: ele.dataset.path,
                    callback: function (image, stack) {
                        stack.width = image.width / 2;
                        stack.height = image.height / 2;

                        stack.x = that.canvasWidth / 2 - stack.width;
                        stack.y = that.canvasHeight / 2 - stack.height;
                    }
                });
            });
        }


        let duplicate = this.textElementContainer.querySelectorAll('button.duplicate')
        for (let el of duplicate) {
            el.addEventListener('click', function (e) {
                that.duplicateSelectedElement()
            });
        }

        let text_elements = this.textElementContainer.querySelectorAll('[data-value]')

        for (let el of text_elements) {
            el.addEventListener('change', function (e) {
                let key = e.currentTarget.dataset.value;
                let value = e.currentTarget.value;
                let stack = that.data.stack[that.current_shape_index];

                if (['x', 'y'].includes(key)) {
                    value = parseInt(value);
                } else if (['family'].includes(key)) {
                    let url = e.currentTarget.options[e.currentTarget.selectedIndex].dataset.url;
                    if (url !== null && url !== '') {
                        stack.url = url;
                        //that.loadFont(stack.family, url);
                    }
                } else if (['editable'].includes(key)) {
                    value = e.currentTarget.checked;
                } else if (['elementAlign'].includes(key)) {
                    return that.elementAlign(stack, value);
                }
                stack[key] = value;
                //that.data.stack[that.current_shape_index] = stack;
                that.data.render();
            });
        }

        let image_elements = this.imageElementContainer.querySelectorAll('[data-value]')

        for (let el of image_elements) {
            el.addEventListener('change', function (e) {
                let key = e.currentTarget.dataset.value;
                let value = e.currentTarget.value;
                let stack = that.data.stack[that.current_shape_index];
                if (['x', 'y', 'width', 'height'].includes(key)) {
                    value = parseInt(value);
                } else if (['src'].includes(key)) {
                    let image = new Image();
                    let reader = new FileReader();

                    reader.onload = () => {
                        stack.toDataUrl = reader.result;
                    };
                    reader.readAsDataURL(e.currentTarget.files[0]);

                    image.onload = () => {
                        stack.width = image.width / 10;
                        stack.height = image.height / 10;

                        stack.image = image;
                        stack.src = image.src;
                        that.data.render();
                    };

                    image.src = URL.createObjectURL(e.currentTarget.files[0]);
                } else if (['editable'].includes(key)) {
                    value = e.currentTarget.checked;
                } else if (['elementAlign'].includes(key)) {
                    return that.elementAlign(stack, value);
                }
                if (!['src'].includes(key)) {
                    stack[key] = value;
                    that.data.render();
                }
            });
        }


    }

    duplicateSelectedElement() {
        if (this.current_shape_index !== null) {
            const clone = Object.assign({}, this.data.stack[this.current_shape_index]);
            clone.name += ' clone';
            clone.key = clone.type + '-' + this.random();
            clone.x += 10;
            clone.y += 10;
            this.data.stack.push(clone);
            this.data.render();
        }
    }

    afterRenderEvents() {
        const that = this;

        let removeLayers = this.stackContainer.querySelectorAll('[data-remove]');
        for (let removeLayer of removeLayers) {
            removeLayer.addEventListener('click', function (e) {
                let li = e.target.closest('li[data-key]');
                let key = li.dataset.key;
                let ele = that.data.remove(key);
                if (ele !== undefined) {
                    li.remove();
                }
            });
        }

        let editElements = this.stackContainer.querySelectorAll('[data-key]');
        for (let editElement of editElements) {
            editElement.addEventListener('click', function (e) {
                let key = e.currentTarget.dataset.key;
                let index = e.currentTarget.dataset.index;
                let stack = that.data.stack[index];
                if (stack.draggable) {
                    that.current_shape_key = key;
                    that.current_shape_index = index;
                    that.setElementContainer(stack);
                    that.setElementEditValue(stack);
                    that.is_dragging = false;
                }
            });
        }
    }

    isMouseInElement(x, y, stack) {
        let coordsX = stack.x;
        let coordsY = stack.y;
        if (stack.type === 'text') {
            switch (stack.textAlign) {
                case 'start':
                case 'left':
                    coordsY -= stack.height / stack.lines;
                    break;
                case 'end':
                case 'right':
                    coordsX -= stack.width;
                    coordsY -= stack.height / stack.lines;
                    break;
                case 'center':
                    coordsX -= stack.width / 2;
                    coordsY -= stack.height / stack.lines;
                    break;
                default:
                    coordsY -= stack.height / stack.lines;
                    break;
            }
        }
        let element_left = coordsX;
        let element_right = coordsX + stack.width;
        let element_top = coordsY;
        let element_bottom = coordsY + stack.height;

        /*this.ctx.beginPath();
        this.ctx.rect(element_left, element_top, stack.width, stack.height);
        this.ctx.stroke();*/

        /*console.log(stack);
        console.log(x, y);
        console.log(element_left, element_right, element_top, element_bottom);
        console.log(x > element_left, x < element_right, y > element_top, y < element_bottom);*/
        return (x > element_left && x < element_right && y > element_top && y < element_bottom);

    }

    getMouseCoordinates(evt) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * this.canvas.width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.height
        };

    }

    setElementContainer(stack) {
        this.textElementContainer.style.display = "none";
        this.imageElementContainer.style.display = "none";

        switch (stack.type) {
            case 'text':
                this.textElementContainer.style.display = "block";
                this.isSomethingSelected = true;
                break;
            case 'image':
                this.imageElementContainer.style.display = "block";
                this.isSomethingSelected = true;
                break;
            default:
                this.isSomethingSelected = false;
                break;
        }
    }

    setElementEditValue(stack) {
        switch (stack.type) {
            case 'text':
                this.textElementContainer.style.display = "block";
                let textValues = this.textElementContainer.querySelectorAll('[data-value]');
                for (let value of textValues) {
                    try {
                        if (value.type === 'checkbox') {
                            value.checked = stack[value.dataset.value];
                        } else {
                            value.value = stack[value.dataset.value];
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
                break;
            case 'image':
                this.imageElementContainer.style.display = "block";
                let imageValues = this.imageElementContainer.querySelectorAll('[data-value]');
                for (let value of imageValues) {
                    try {
                        if (value.type === 'checkbox') {
                            value.checked = stack[value.dataset.value];
                        } else if (value.type === 'file') {

                        } else {
                            value.value = stack[value.dataset.value];
                        }

                    } catch (e) {
                        console.error(e);
                    }
                }
                break;
        }
    }

    elementAlign(stack, value) {

        let coordsX = 0;
        let coordsY = 0;

        if (stack.type === 'text') {
            switch (stack.textAlign) {
                case 'start':
                case 'left':
                    coordsY = stack.height / stack.lines;
                    break;
                case 'end':
                case 'right':
                    coordsX = stack.width;
                    coordsY = stack.height / stack.lines;
                    break;
                case 'center':
                    coordsX = stack.width / 2;
                    coordsY = stack.height / stack.lines;
                    break;
                default:
                    coordsY = parseInt(stack.size);
                    break;
            }

        }

        switch (value) {
            case 'top-left':
                stack.x = 10 + coordsX;
                stack.y = 10 + coordsY;
                break;
            case 'top-right':
                stack.x = (this.canvasWidth - (stack.width + 10)) + coordsX;
                stack.y = 10 + coordsY;
                break;
            case 'top-center':
                stack.x = ((this.canvasWidth - stack.width) / 2) + coordsX;
                stack.y = 10 + coordsY;
                break;
            case 'left-center':
                stack.x = 10 + coordsX;
                stack.y = ((this.canvasHeight - stack.height) / 2) + coordsY;
                break;
            case 'center':
                stack.x = ((this.canvasWidth - stack.width) / 2) + coordsX;
                stack.y = ((this.canvasHeight - stack.height) / 2) + coordsY;
                break;
            case 'right-center':
                stack.x = (this.canvasWidth - (stack.width + 10)) + coordsX;
                stack.y = ((this.canvasHeight - stack.height) / 2) + coordsY;
                break;
            case 'bottom-left':
                stack.x = 10 + coordsX;
                stack.y = (this.canvasHeight - (stack.height + 10)) + coordsY;
                break;
            case 'bottom-right':
                stack.x = (this.canvasWidth - (stack.width + 10)) + coordsX;
                stack.y = (this.canvasHeight - (stack.height + 10)) + coordsY;
                break;
            case 'bottom-center':
                stack.x = ((this.canvasWidth - stack.width) / 2) + coordsX;
                stack.y = (this.canvasHeight - (stack.height + 10)) + coordsY;
                break;
        }

        this.data.render();
    }

    updateStack(obj) {
        switch (obj.type) {
            case 'image':
                if (obj.background)
                    this.data.background(obj);
                else
                    this.data.image(obj);
                break;
            case 'text':
                this.data.text(obj);
                break;
        }
    }

    loadFont(family, url) {
        let that = this;
        return new Promise(resolve => {
            if ((url !== 'null') && (url != null)) {
                if (!that.fonts.includes(family)) {
                    that.fonts.push(family);
                    var myFont = new FontFace(family, 'url(' + url + ')');
                    myFont.load().then(function (font) {
                        resolve(family + ' Font Loaded');
                        document.fonts.add(font);
                    });
                } else {
                    resolve('Font already Loaded')
                }
            } else {
                resolve(family + ' Font Loaded')
            }
        });
    }

    downloadCanvas(filename) {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = this.canvas.toDataURL("image/jpeg");
        a.download = filename + ".jpeg";
        a.click();
        document.body.removeChild(a);
    }
}

