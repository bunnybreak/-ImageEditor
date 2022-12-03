import Layers from "./layers.class.js";
import ElementBase from "./elements/ElementBase.class.js";

export default class LayerBar {
    static layersHolder;

    constructor(props) {
        console.log("Layer Bar Loaded");
        this.props = props
        LayerBar.layersHolder = props.layersHolder;
    }

    static addLayerBarElement(index, layer) {
        if (!(layer instanceof ElementBase)) {
            return;
        }
        console.log('Layer Added', layer);
        let div = document.createElement('div');
        div.classList.add('layer');
        div.dataset.index = index;

        /*let icon = document.createElement('img');
        icon.classList.add('icon');
        icon.width = 30;
        icon.height = 24;
        icon.src = layer.props.icon;
        span.append(icon);*/

        div.innerHTML = layer.props.icon;

        let span = document.createElement('span');
        span.innerText = layer.label;
        span.addEventListener('dblclick', (e) => {
            if (!span.classList.contains('editing')) {
                span.classList.add('editing');
                let text = e.target.innerText;
                let input = document.createElement('input');
                input.type = 'text';
                input.value = text;
                input.onblur = (e1) => {
                    e1.stopPropagation();
                    span.classList.remove('editing');
                    layer.label = input.value;
                    span.innerText = layer.label;
                };
                input.onkeydown = (e1) => {
                    if (e1.enterKey) {
                        input.blur()
                    }
                };
                span.innerHTML = '';
                span.append(input);
                input.focus();
            }
        });
        div.append(span)

        /*let icon1 = document.createElement('img');
        icon1.classList.add('icon');
        icon1.width = 30;
        icon1.height = 24;
        icon1.src = '@imageEditor/icons/eye-open.svg';
        span.append(icon1)*/

        let div2 = document.createElement('div');
        div2.classList.add('ms-auto');
        div2.classList.add('tools');
        let span1 = document.createElement('span');
        if (layer.visibility)
            span1.classList.add('visibility');
        else
            span1.classList.add('hidden');

        span1.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" class="eye-open" viewBox="0 0 512 512"><title>Eye</title><path d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 00-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 000-17.47C428.89 172.28 347.8 112 255.66 112z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="256" cy="256" r="80" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/></svg>';
        span1.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" class="eye-close" viewBox="0 0 512 512"><title>Eye Off</title><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M432 448a15.92 15.92 0 01-11.31-4.69l-352-352a16 16 0 0122.62-22.62l352 352A16 16 0 01432 448zM255.66 384c-41.49 0-81.5-12.28-118.92-36.5-34.07-22-64.74-53.51-88.7-91v-.08c19.94-28.57 41.78-52.73 65.24-72.21a2 2 0 00.14-2.94L93.5 161.38a2 2 0 00-2.71-.12c-24.92 21-48.05 46.76-69.08 76.92a31.92 31.92 0 00-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416a239.13 239.13 0 0075.8-12.58 2 2 0 00.77-3.31l-21.58-21.58a4 4 0 00-3.83-1 204.8 204.8 0 01-51.16 6.47zM490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96a227.34 227.34 0 00-74.89 12.83 2 2 0 00-.75 3.31l21.55 21.55a4 4 0 003.88 1 192.82 192.82 0 0150.21-6.69c40.69 0 80.58 12.43 118.55 37 34.71 22.4 65.74 53.88 89.76 91a.13.13 0 010 .16 310.72 310.72 0 01-64.12 72.73 2 2 0 00-.15 2.95l19.9 19.89a2 2 0 002.7.13 343.49 343.49 0 0068.64-78.48 32.2 32.2 0 00-.1-34.78z"/><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M256 160a95.88 95.88 0 00-21.37 2.4 2 2 0 00-1 3.38l112.59 112.56a2 2 0 003.38-1A96 96 0 00256 160zM165.78 233.66a2 2 0 00-3.38 1 96 96 0 00115 115 2 2 0 001-3.38z"/></svg>';
        span1.onclick = (e) => {
            e.stopPropagation();
            let add, remove;
            layer.visibility = !layer.visibility;
            if (layer.visibility) {
                add = 'visibility';
                remove = 'hidden';
            } else {
                add = 'hidden';
                remove = 'visibility';
            }
            span1.classList.remove(remove);
            span1.classList.add(add);
        };

        let span2 = document.createElement('span');
        if (layer.lock)
            span2.classList.add('locked');
        else
            span2.classList.add('unlocked');

        span2.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" class="lock-open" viewBox="0 0 512 512"><title>Lock Open</title><path d="M336 112a80 80 0 00-160 0v96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><rect x="96" y="208" width="320" height="272" rx="48" ry="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>';
        span2.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" class="lock-close" viewBox="0 0 512 512"><title>Lock Closed</title><path d="M336 208v-95a80 80 0 00-160 0v95" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><rect x="96" y="208" width="320" height="272" rx="48" ry="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>';
        span2.onclick = (e) => {
            e.stopPropagation();
            let add, remove;
            layer.lock = !layer.lock;
            if (layer.lock) {
                add = 'locked';
                remove = 'unlocked';
            } else {
                add = 'unlocked';
                remove = 'locked';
            }
            span2.classList.remove(remove);
            span2.classList.add(add);
        };
        div2.append(span2);
        div2.append(span1);
        div.append(div2)

        div.addEventListener('click', (e) => {
            let activeLayer = this.layersHolder.querySelectorAll('.active.layer');
            activeLayer.forEach((node) => node.classList.remove('active'));
            div.classList.add('active');
            Layers.select(index);
        });
        this.layersHolder.append(div)
    }
}