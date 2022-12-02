import ElementBase from "./ElementBase.class.js";

export default class Stack {
    #stacks = [];

    constructor() {
        console.log('Stack Loaded');
    }

    async render() {
        for (let stack of this.#stacks) {
            if (stack instanceof ElementBase) {
                await stack.render();
            } else if (typeof stack === 'function') {
                await stack(window.ImageEditor.ctx);
            } else {
                console.error('No able to render this Layer : ', stack);
            }
        }
    }

    getStack() {
        return this.#stacks;
    }

    add(object) {
        let index = this.#stacks.push(object) - 1;
        return this.#stacks[index];
    }

    update(key, object) {
        this.#stacks[key] = object;
    }

    get(index) {
        return this.#stacks[index];
    }

    count(object) {
        let count = 0;
        for (let stack of this.#stacks) {
            if (stack instanceof object)
                count++;
        }
        return count;
    }

    last(object) {
        let index = null;
        for (let i = this.#stacks.length; i >= 0; i--) {
            if (this.#stacks[i] instanceof object) {
                index = i;
                break;
            }
        }
        if (index !== null)
            return this.#stacks[index];
        else
            return false;
    }

    uniqueId(prefix = '') {
        let r = prefix + (Math.random() + 1).toString(36).substring(2);
        if (this.#stacks.findIndex((e) => r === e.id) === -1) {
            return r;
        } else {
            return this.uniqueId(prefix);
        }
    }
}