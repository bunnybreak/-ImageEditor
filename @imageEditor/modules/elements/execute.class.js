import Layers from "../layers.class.js";
import ElementBase from "./ElementBase.class.js";

export default class Execute extends ElementBase {
    constructor(params = {
        id: Layers.uniqueId('Execute-'),
        fun: (ctx) => {
        }
    }) {
        super(params);
    }

    async render() {
        if (typeof this.fun === 'function')
            this.fun(this.ctx);
        return this;
    }
}