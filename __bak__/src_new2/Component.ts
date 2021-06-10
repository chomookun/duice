import DataObject from 'DataObject';
import Observable from 'Observable';
import Observer from 'Observer';

/**
 * duice.Component
 */
export default abstract class Component extends Observable implements Observer {
    element:HTMLElement;
    constructor(element:HTMLElement){
        super();
        this.element = element;
        this.element.dataset.duiceId = this.generateUuid();
    }
        /**
     * Generates random UUID value
     * @return  UUID string
     */
    generateUuid():string {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }

    /**
     * Adds class
     */
    addClass(element:HTMLElement, className:string):void {
        element.classList.add(className);
    }
    
    /**
     * Removes child elements from HTML element.
     * @param element
     */
    removeChildNodes(element:HTMLElement):void {
        // Remove element nodes and prevent memory leaks
        var node, nodes = element.childNodes, i = 0;
        while (node = nodes[i++]) {
            if (node.nodeType === 1 ) {
                element.removeChild(node);
            }
        }

        // Remove any remaining nodes
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }

        // If this is a select, ensure that it displays empty
        if(element instanceof HTMLSelectElement){
            (<HTMLSelectElement>element).options.length = 0;
        }
    }

    abstract bind(...args: any[]):void;
    abstract update(dataObject:DataObject, obj:object):void;
    isAvailable():boolean {
        
        // contains method not support(IE)
        if(!Node.prototype.contains) {
            Node.prototype.contains = function(el){
                while (el = el.parentNode) {
                    if (el === this) return true;
                }
                return false;
            }
        }
        
        // checks contains element
        if(document.contains(this.element)){
            return true;
        }else{
            return false;
        }
    }

    /**
     * Sets element visible
     * @param visible 
     */
    setVisible(visible:boolean){
        this.element.style.display = (visible ? '' : 'none');
    }

    /**
     * Sets element focus
     */
    setFocus(){
        if(this.element.focus){
            this.element.focus();
        }
    }
}