import LayerBar from "./layerBar.class.js";

export default class Layers {
    static #current = null;
    static #layers = [];

    constructor() {
        console.log('Layers Loaded');
    }

    static async render() {
        for (let layer of this.#layers) {
            if (typeof layer.render === 'function') {
                await layer.render();
            } else {
                console.error('No able to render this Layer : ', layer);
            }
        }
    }

    static getLayers() {
        return this.#layers;
    }

    static add(object) {
        let index = this.#layers.push(object) - 1;
        window.ImageEditor.Layers = this.#layers;
        LayerBar.addLayerBarElement(index, object);
    }

    static get(index) {
        return this.#layers[index];
    }

    static count(object) {
        let count = 0;
        for (let layer of this.#layers) {
            if (layer instanceof object)
                count++;
        }
        return count;
    }

    static last(object) {
        let index = null;
        for (let i = this.#layers.length; i >= 0; i--) {
            if (this.#layers[i] instanceof object) {
                index = i;
                break;
            }
        }
        if (index !== null)
            return this.#layers[index];
        else
            return false;
    }

    static select(index) {
        this.#current = index;
    }

    static uniqueId(prefix = '') {
        let r = prefix + (Math.random() + 1).toString(36).substring(2);
        if (this.#layers.findIndex((e) => r === e.id) === -1) {
            return r;
        } else {
            return Layers.uniqueId(prefix);
        }
    }
}