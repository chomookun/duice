import {
    trace,
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

/**
 * Array Element
 */
export class ArrayElement<T extends HTMLElement> extends Element<T, object[]> {

    loop: string;

    hierarchy: string;

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
        this.loop = getElementAttribute(htmlElement, 'loop');
        this.hierarchy = getElementAttribute(htmlElement, 'hierarchy');
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
        // loop
        if(this.loop){
            let loopArgs = this.loop.split(',');
            let itemName = loopArgs[0].trim();
            let statusName = loopArgs[1]?.trim();
            // hierarchy loop
            if(this.hierarchy) {
                let hierarchyArray = this.hierarchy.split(',');
                let idName = hierarchyArray[0];
                let parentIdName = hierarchyArray[1];
                //let index = -1;
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
            // default loop
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
        // not loop
        else {
            // initialize
            let itemHtmlElement = this.getHtmlElement().cloneNode(true) as HTMLElement;
            let context = Object.assign({}, this.getContext());
            Initializer.initialize(itemHtmlElement, this.getContext());
            this.itemHtmlElements.push(itemHtmlElement);
            // append to slot
            this.slot.parentNode.insertBefore(itemHtmlElement, this.slot);
            // check if
            runIfCode(itemHtmlElement, context);
            // execute script
            runExecuteCode(itemHtmlElement, context);
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
                // Prevent default
                e.preventDefault();
                e.stopPropagation();
                // Checks item moving listener
                // if (runOnEventCode(itemHtmlElement, context, 'item-moving') === false) {
                //     return;
                // }
                // Notifies item move event
                let element = this.getHtmlElement();
                let data = getProxyTarget(this.getBindData());
                let fromIndex = parseInt(e.dataTransfer.getData('text'));
                let toIndex = parseInt(getElementAttribute(e.currentTarget as HTMLElement, 'index'));
                let itemMoveEvent = new ItemMovingEvent(element, data, fromIndex, toIndex);
                _this.notifyObservers(itemMoveEvent);
                // Calls item moved listener
                // runOnEventCode(itemHtmlElement, context, 'item-moved');
            });
        }
        // initializes row element
        Initializer.initialize(itemHtmlElement, context, index);
        this.itemHtmlElements.push(itemHtmlElement);
        // insert into slot
        this.slot.parentNode.insertBefore(itemHtmlElement, this.slot);
        // check if code
        runIfCode(itemHtmlElement, context).then();
        // execute script
        runExecuteCode(itemHtmlElement, context).then();
        // selectable
        itemHtmlElement.addEventListener('click', e => {
            // // on item selecting
            // if (runOnEventCode(itemHtmlElement, context, 'item-selecting') === false) {
            //     return;
            // }
            // selected class
            if(this.selectedItemClass) {
                this.itemHtmlElements.forEach(element => {
                    element.classList.remove(this.selectedItemClass);
                });
                (e.currentTarget as HTMLElement).classList.add(this.selectedItemClass);
                e.stopPropagation();
            }
            // trigger row select event
            let element = this.getHtmlElement();
            let data = getProxyTarget(this.getBindData());
            let rowSelectingEvent = new ItemSelectingEvent(element, data, index);
            this.notifyObservers(rowSelectingEvent);
            // on item selected
            // runOnEventCode(itemHtmlElement, context, 'item-selected');
        });
    }

    /**
     * Updates
     * @param observable observable
     * @param event event
     */
    override update(observable: Observable, event: Event): void {
        trace('ArrayElement.update', observable, event);
        if(observable instanceof ArrayProxyHandler){
            // row select event
            if(event instanceof ItemSelectingEvent) {
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
                return;
            }
            // render
            this.render();
        }
    }

}