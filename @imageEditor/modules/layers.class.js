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
        this.#layers.push(object);
        window.ImageEditor.Layers = this.#layers;
        LayerBar.addLayerBarElement(object);
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

    static select(object) {
        this.#current = object;
    }
}