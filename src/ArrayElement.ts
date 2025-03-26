import {
    debug,
    getElementAttribute,
    markInitialized,
    runExecuteCode,
    runIfCode,
    setElementAttribute,
    getProxyTarget
} from "./common";
import {Element} from "./Element";
import {ObjectProxy} from "./ObjectProxy";
import {Initializer} from "./Initializer";
import {Observable} from "./Observable";
import {ArrayProxyHandler} from "./ArrayProxyHandler";
import {ItemSelectingEvent} from "./event/ItemSelectingEvent";
import {ItemMovingEvent} from "./event/ItemMovingEvent";
import {Event} from "./event/Event";
import {ItemSelectedEvent} from "./event/ItemSelectedEvent";
import {ItemMovedEvent} from "./event/ItemMovedEvent";
import {PropertyChangedEvent} from "./event/PropertyChangedEvent";

/**
 * Array Element
 */
export class ArrayElement<T extends HTMLElement> extends Element<T, object[]> {

    foreach: string;

    recursive: string;

    editable: boolean = false;

    selectedItemClass: string;

    slot: HTMLSlotElement = document.createElement('slot');

    itemHtmlElements: HTMLElement[] = [];

    /**
     * Constructor
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     */
    constructor(htmlElement: T, bindData: object[], context: object) {
        super(htmlElement.cloneNode(true) as T, bindData, context);
        // attributes
        this.foreach = getElementAttribute(htmlElement, 'foreach');
        this.recursive = getElementAttribute(htmlElement, 'recursive');
        this.editable = (getElementAttribute(htmlElement, 'editable') === 'true');
        this.selectedItemClass = getElementAttribute(htmlElement, 'selected-item-class');
        // replace with slot for position
        htmlElement.replaceWith(this.slot);
        // mark initialized (not using after clone as templates)
        markInitialized(htmlElement);
    }

    /**
     * Renders
     */
    override render(): void {
        let arrayProxy = this.getBindData() as Array<object>;
        // reset row elements
        this.itemHtmlElements.forEach(rowElement => {
            rowElement.parentNode.removeChild(rowElement);
        });
        this.itemHtmlElements.length = 0;
        // foreach
        if(this.foreach){
            let foreachArgs = this.foreach.split(',');
            let itemName = foreachArgs[0].trim();
            let statusName = foreachArgs[1]?.trim();
            // recursive loop
            if(this.recursive) {
                let recursiveArgs = this.recursive.split(',');
                let idName = recursiveArgs[0].trim();
                let parentIdName = recursiveArgs[1]?.trim();
                const _this = this;
                // visit function
                let visit = function(array: object[], parentId: object, depth: number) {
                    for(let index = 0; index < array.length; index ++) {
                        const object = array[index];
                        if(object[parentIdName] === parentId) {
                            // context
                            let context = Object.assign({}, _this.getContext());
                            context[itemName] = object;
                            context[statusName] = new ObjectProxy({
                                index: index,
                                count: index + 1,
                                size: arrayProxy.length,
                                first: (index === 0),
                                last: (arrayProxy.length == index + 1),
                                depth: depth
                            });
                            // create row element
                            _this.createItemHtmlElement(index, object, context);
                            // visit child elements
                            let id = object[idName];
                            visit(array, id, depth + 1);
                        }
                    }
                }
                // start visit
                visit(arrayProxy, null, 0);
            }
            // default foreach
            else{
                // normal
                for (let index = 0; index < arrayProxy.length; index++) {
                    // element data
                    let object = arrayProxy[index];
                    // context
                    let context = Object.assign({}, this.getContext());
                    context[itemName] = object;
                    context[statusName] = new ObjectProxy({
                        index: index,
                        count: index + 1,
                        size: arrayProxy.length,
                        first: (index === 0),
                        last: (arrayProxy.length == index + 1)
                    });
                    // create row element
                    this.createItemHtmlElement(index, object, context);
                }
            }
        }
        // not foreach
        else {
            // initialize
            let itemHtmlElement = this.getHtmlElement().cloneNode(true) as HTMLElement;
            let context = Object.assign({}, this.getContext());
            Initializer.initialize(itemHtmlElement, this.getContext());
            this.itemHtmlElements.push(itemHtmlElement);
            // append to slot
            this.slot.parentNode.insertBefore(itemHtmlElement, this.slot);
            // check if
            runIfCode(itemHtmlElement, context).then(result => {
                if (result === false) {
                    return;
                }
                runExecuteCode(itemHtmlElement, context).then();
            });
        }
    }

    /**
     * Creates item html element
     * @param index index
     * @param object object
     * @param context context
     */
    createItemHtmlElement(index: number, object: object, context: object): void {
        // clones row elements
        let itemHtmlElement = this.getHtmlElement().cloneNode(true) as HTMLElement;
        // adds embedded attribute
        setElementAttribute(itemHtmlElement, 'index', index.toString());
        // editable
        let _this = this;
        if(this.editable){
            itemHtmlElement.setAttribute('draggable', 'true');
            itemHtmlElement.addEventListener('dragstart', e => {
                let fromIndex = getElementAttribute(e.currentTarget as HTMLElement, 'index');
                e.dataTransfer.setData("text", fromIndex);
            });
            itemHtmlElement.addEventListener('dragover', e => {
                e.preventDefault();
                e.stopPropagation();
            });
            itemHtmlElement.addEventListener('drop', e => {
                e.preventDefault();
                e.stopPropagation();
                // Notifies item move event
                let element = this.getHtmlElement();
                let data = getProxyTarget(this.getBindData());
                let fromIndex = parseInt(e.dataTransfer.getData('text'));
                let toIndex = parseInt(getElementAttribute(e.currentTarget as HTMLElement, 'index'));
                let itemMoveEvent = new ItemMovingEvent(element, data, fromIndex, toIndex);
                _this.notifyObservers(itemMoveEvent);
            });
        }
        // initializes row element
        Initializer.initialize(itemHtmlElement, context, index);
        this.itemHtmlElements.push(itemHtmlElement);
        // insert into slot
        this.slot.parentNode.insertBefore(itemHtmlElement, this.slot);
        // trigger item selecting event
        itemHtmlElement.addEventListener('click', e => {
            e.stopPropagation();
            let element = this.getHtmlElement();
            let data = getProxyTarget(this.getBindData());
            let itemSelectingEvent = new ItemSelectingEvent(element, data, index);
            this.notifyObservers(itemSelectingEvent);
        });
        // check if code
        runIfCode(itemHtmlElement, context).then(result => {
            if (result === false) {
                return;
            }
            runExecuteCode(itemHtmlElement, context).then();
        });
    }

    /**
     * Updates
     * @param observable observable
     * @param event event
     */
    override update(observable: Observable, event: Event): void {
        debug('ArrayElement.update', observable, event);
        // if observable is array proxy handler
        if(observable instanceof ArrayProxyHandler){
            // item selected event
            if(event instanceof ItemSelectedEvent) {
                if(this.selectedItemClass) {
                    this.itemHtmlElements.forEach(el => el.classList.remove(this.selectedItemClass));
                    let index = event.getIndex();
                    if(index >= 0) {
                        this.itemHtmlElements.forEach(itemHtmlElement => {
                            if(itemHtmlElement.dataset.duiceIndex === event.getIndex().toString()) {
                                itemHtmlElement.classList.add(this.selectedItemClass);
                            }
                        });
                    }
                }
                // no render
                return;
            }
            // item moved event
            if (event instanceof ItemMovedEvent) {
                this.render();
                return;
            }
            // property change event
            if (event instanceof PropertyChangedEvent) {
                // if recursive and parent is changed, render array element
                if (this.recursive) {
                    let parentId = this.recursive.split(',')[1]?.trim();
                    if (event.getProperty() === parentId) {
                        this.render();
                        return;
                    }
                }
                // default is no-op
                else {
                    return;
                }
            }
        }
        // default
        this.render();
    }

}