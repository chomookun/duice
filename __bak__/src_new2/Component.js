import Observable from 'Observable';
export default class Component extends Observable {
    constructor(element) {
        super();
        this.element = element;
        this.element.dataset.duiceId = this.generateUuid();
    }
    generateUuid() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    addClass(element, className) {
        element.classList.add(className);
    }
    removeChildNodes(element) {
        var node, nodes = element.childNodes, i = 0;
        while (node = nodes[i++]) {
            if (node.nodeType === 1) {
                element.removeChild(node);
            }
        }
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        if (element instanceof HTMLSelectElement) {
            element.options.length = 0;
        }
    }
    isAvailable() {
        if (!Node.prototype.contains) {
            Node.prototype.contains = function (el) {
                while (el = el.parentNode) {
                    if (el === this)
                        return true;
                }
                return false;
            };
        }
        if (document.contains(this.element)) {
            return true;
        }
        else {
            return false;
        }
    }
    setVisible(visible) {
        this.element.style.display = (visible ? '' : 'none');
    }
    setFocus() {
        if (this.element.focus) {
            this.element.focus();
        }
    }
}
