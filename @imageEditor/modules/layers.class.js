import LayerBar from "./layerBar.class.js";
import ElementBase from "./elements/ElementBase.class.js";
import Execute from "./elements/execute.class.js";

export default class Layers {
    static #current = null;
    static #layers = [];

    constructor() {
        console.log('Layers Loaded');
    }

    static async render() {
        for (let layer of this.#layers) {
            if (layer instanceof ElementBase) {
                await layer.render();
            } else {
                console.error('No able to render this Layer : ', layer);
            }
        }
    }

    static get elements() {
        return this.#layers;
    }

    static add(object) {
        let index = this.#layers.push(object) - 1;
        window.ImageEditor.Layers = this.#layers;
        LayerBar.addLayerBarElement(index, object);
        return this.#layers[index];
    }

    static update(key, object) {
        this.#layers[key] = object;
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

    static getSelect(index) {
        return this.#current;
    }

    static uniqueId(prefix = '') {
        let r = prefix + (Math.random() + 1).toString(36).substring(2);
        if (this.#layers.findIndex((e) => r === e.id) === -1) {
            return r;
        } else {
            return Layers.uniqueId(prefix);
        }
    }

    static checkElementIntersect(cx, cy, resolve, reject) {
        this.#layers.forEach((layer) => {
            if(layer instanceof Execute){
                return;
            }
            if (layer instanceof ElementBase) {
                const intersection = layer.isIntersect(cx, cy);
                if (intersection.isIntersect) {
                    if (!layer.isLock) {
                        Layers.updateOrCreate(new Execute({
                            id: "check-main-intersection",
                            fun: (ctx) => {
                                ctx.beginPath();
                                ctx.strokeStyle = "red";
                                ctx.rect(intersection.x, intersection.y, intersection.width, intersection.height);
                                ctx.stroke();
                            }
                        }));
                        resolve(layer);
                    } else {
                        reject("Layer is lock.");
                    }
                }
            } else {
                reject("Not an element of element base.");
            }
        });
    }

    static updateOrCreate(param) {
        let index = this.#layers.findIndex((e) => param.id === e.id);
        if (index === -1) {
            return this.#layers.push(param) - 1;
        } else {
            this.#layers[index] = param;
            return index;
        }
    }
}