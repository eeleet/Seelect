class Utils {
    constructor() {

    }

    // use this method instead of es6 [...nodeList].forEach
    // which requires polyfill for IE
    iterateNodeList(nodeList, fn) {
        for(let i = 0; i < nodeList.length; i++) {
            const node = nodeList[i];
            fn(node, i);
        }
    }

    hasClass(el,cls) {
        return !!el.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    addClass(el,cls) {
        if (!this.hasClass(el,cls)) el.className += " "+cls;
    }

    removeClass(el,cls) {
        if (this.hasClass(el,cls)) {
            let reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
            el.className=el.className.replace(reg,' ');
        }
    }
    toggleClass(el, cls) {
        if(this.hasClass(el, cls)) {
            this.removeClass(el, cls);
        } else {
            this.addClass(el, cls);
        }
    }
}

export default new Utils();