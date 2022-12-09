import Group from "./group.class.js";

export default class ElementBase extends Group {
    static props = {
        name: 'Element',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><g><rect fill="none" height="24" width="24"/><path d="M22,9v6c0,1.1-0.9,2-2,2h-1l0-2h1V9H4v6h6v2H4c-1.1,0-2-0.9-2-2V9c0-1.1,0.9-2,2-2h16C21.1,7,22,7.9,22,9z M14.5,19 l1.09-2.41L18,15.5l-2.41-1.09L14.5,12l-1.09,2.41L11,15.5l2.41,1.09L14.5,19z M17,14l0.62-1.38L19,12l-1.38-0.62L17,10l-0.62,1.38 L15,12l1.38,0.62L17,14z M14.5,19l1.09-2.41L18,15.5l-2.41-1.09L14.5,12l-1.09,2.41L11,15.5l2.41,1.09L14.5,19z M17,14l0.62-1.38 L19,12l-1.38-0.62L17,10l-0.62,1.38L15,12l1.38,0.62L17,14z"/></g></svg>'
    };
    props = ElementBase.props;
    //default values
    x;
    y;
    width;
    height;
    lock;
    visibility;
    id;
    label;
    name;
    ctx;
    intersectionPoints = null;
    _default = {
        type: 'default',
        id: this.uniqueId('Element-'),
        lock: false,
        visibility: true,
        x: 0,
        y: 0,
        backgroundColor: undefined,
        foregroundColor: undefined,
        width: 1920,
        height: 1080,
        name: 'Element',
        label: 'Element',
    };

    constructor(_params = {}) {
        super();
        this.config = this.extend(this._default, _params);
        //console.log("Element Base Loaded", this.config);
        for (let param in this.config) {
            if (this.config.hasOwnProperty(param))
                this[param] = this.config[param];
        }
        //get Global CTX
        this.ctx = window.ImageEditor.ctx;
    }

    extend(_default = {}, _params = {}) {
        return {..._default, ..._params};
    }

    getElementBounds() {
        return {x: this.x, y: this.y, w: this.width, h: this.height};
    }

    get isLock() {
        return this.lock;
    }

    isIntersect(cx, cy) {
        const {x, y, w, h} = this.getElementBounds();
        let element_left = x;
        let element_right = x + w;
        let element_top = y;
        let element_bottom = y + h;
        let isIntersect = (cx > element_left && cx < element_right && cy > element_top && cy < element_bottom);
        this.intersectionPoints = {
            isIntersect: isIntersect,
            left: element_left,
            right: element_right,
            top: element_top,
            bottom: element_bottom,
            width: w,
            height: h,
            x: x,
            y: y
        }
        this.onIntersect(this.intersectionPoints);
        return this.intersectionPoints;
    }

    onIntersect(_intersect) {

    }

    hasChild() {
        return (this.child().count() > 0);
    }

    onmouseup() {
        throw new Error("onmousedown event not defined");
    }

    onmousedown() {
        throw new Error("onmousedown event not defined");
    }

    onmousemove() {
        throw new Error("onmousemove event not defined");
    }
}