export default class Layers {
    static layers = [];

    constructor() {
        console.log('Layers Loaded');
    }

    static async render() {
        for (let layer of this.layers) {
            if (typeof layer.render === 'function') {
                await layer.render();
            } else {
                console.error('No able to render this Layer : ', layer);
            }
        }
    }

    static add(object) {
        this.layers.push(object);
    }
}