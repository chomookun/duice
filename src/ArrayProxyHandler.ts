import {ProxyHandler} from "./ProxyHandler";
import {ArrayProxy} from "./ArrayProxy";
import {Observable} from "./Observable";
import {ArrayElement} from "./ArrayElement";
import {ItemDeleteEvent} from "./event/ItemDeleteEvent";
import {ItemSelectEvent} from "./event/ItemSelectEvent";
import {Event} from "./event/Event";
import {ItemMoveEvent} from "./event/ItemMoveEvent";
import {ObjectProxy} from "./ObjectProxy";
import {ItemInsertEvent} from "./event/ItemInsertEvent";

/**
 * Array Proxy Handler
 */
export class ArrayProxyHandler extends ProxyHandler<object[]> {

    propertyChangingListener: Function;

    propertyChangedListener: Function;

    itemInsertingListener: Function;

    itemInsertedListener: Function;

    itemDeletingListener: Function;

    itemDeletedListener: Function;

    itemMovingListener: Function;

    itemMovedListener: Function;

    selectedItemIndex: number;

    /**
     * Constructor
     */
    constructor() {
        super();
    }

    /**
     * Get trap
     * @param target target
     * @param property property
     * @param receiver receiver
     */
    get(target: object[], property: string, receiver: object): any {
        let _this = this;
        const value = target[property];
        if (typeof value === 'function') {
            // push, unshift
            if (['push', 'unshift'].includes(property)) {
                return function () {
                    let index;
                    if (property === 'push') {
                        index = receiver['length'];
                    } else if (property === 'unshift') {
                        index = 0;
                    }
                    let rows = [];
                    for (let i in arguments) {
                        rows.push(arguments[i]);
                    }
                    _this.insertItem(target, index, ...rows);
                    return target.length;
                }
            }
            // splice
            if (['splice'].includes(property)) {
                return function () {
                    // parse arguments
                    let start = arguments[0];
                    let deleteCount = arguments[1];
                    let deleteRows = [];
                    for (let i = start; i < (start + deleteCount); i++) {
                        deleteRows.push(target[i]);
                    }
                    let insertRows = [];
                    for (let i = 2; i < arguments.length; i++) {
                        insertRows.push(arguments[i]);
                    }
                    // delete rows
                    if(deleteCount > 0) {
                        _this.deleteItem(target, start, deleteCount);
                    }
                    // insert rows
                    if(insertRows.length > 0){
                        _this.insertItem(target, start, ...insertRows);
                    }
                    // returns deleted rows
                    return deleteRows;
                }
            }
            // pop, shift
            if (['pop', 'shift'].includes(property)) {
                return function () {
                    let index;
                    if (property === 'pop') {
                        index = receiver['length'] - 1;
                    } else if (property === 'shift') {
                        index = 0;
                    }
                    let rows = [target[index]];
                    _this.deleteItem(target, index);
                    return rows;
                }
            }
            // bind
            return value.bind(target);
        }
        // return
        return value;
    }

    /**
     * Set trap
     * @param target target
     * @param property property
     * @param value value
     */
    set(target: ArrayProxy, property: string, value: any): boolean {
        Reflect.set(target, property, value);
        if (property === 'length') {
            this.notifyObservers(new Event(this));
        }
        return true;
    }

    /**
     * Updates
     * @param observable observable
     * @param event event
     */
    update(observable: Observable, event: Event): Promise<void> {
        // instance is array component
        if(observable instanceof ArrayElement) {
            // row select event
            if(event instanceof ItemSelectEvent) {
                this.selectedItemIndex = event.getIndex();
                return;
            }
            // row move event
            if (event instanceof ItemMoveEvent) {
                if (this.checkListener(this.itemMovingListener, event)) {
                    let object = this.getTarget().splice(event.getFromIndex(), 1)[0];
                    this.getTarget().splice(event.getToIndex(), 0, object);
                    this.checkListener(this.itemMovedListener, event);
                }
            }
        }
        // notify observers
        this.notifyObservers(event);
    }

    /**
     * Inserts items
     * @param arrayProxy array proxy
     * @param index index
     * @param items items
     */
    insertItem(arrayProxy: object[], index: number, ...items: object[]): void {
        let arrayHandler = ArrayProxy.getProxyHandler(arrayProxy);
        let proxyTarget = ArrayProxy.getTarget(arrayProxy);
        items.forEach((object, index) => {
            if (typeof object === 'object') {
                let objectProxy = new ObjectProxy(object);
                let objectHandler = ObjectProxy.getProxyHandler(objectProxy);
                objectHandler.propertyChangingListener = this.propertyChangingListener;
                objectHandler.propertyChangedListener = this.propertyChangedListener;
                items[index] = objectProxy;
            }
        });
        let event = new ItemInsertEvent(this, index, items);
        if (arrayHandler.checkListener(arrayHandler.itemInsertingListener, event)) {
            proxyTarget.splice(index, 0, ...items);
            arrayHandler.checkListener(arrayHandler.itemInsertedListener, event);
            arrayHandler.notifyObservers(event);
        }
    }

    /**
     * Deletes items from array proxy
     * @param arrayProxy array proxy to delete
     * @param index index to delete
     * @param size size for delete
     */
    deleteItem(arrayProxy: object[], index: number, size?: number): void {
        let arrayHandler = ArrayProxy.getProxyHandler(arrayProxy);
        let proxyTarget = ArrayProxy.getTarget(arrayProxy);
        let sliceBegin = index;
        let sliceEnd = (size ? index + size : index + 1);
        let rows = proxyTarget.slice(sliceBegin, sliceEnd);
        let event = new ItemDeleteEvent(this, index, rows);
        if (arrayHandler.checkListener(arrayHandler.itemDeletingListener, event)) {
            let spliceStart = index;
            let spliceDeleteCount = (size ? size : 1);
            proxyTarget.splice(spliceStart, spliceDeleteCount);
            arrayHandler.checkListener(arrayHandler.itemDeletedListener, event);
            arrayHandler.notifyObservers(event);
        }
    }

    /**
     * Selects item by index
     * @param index index
     */
    selectItem(index: number): void {
        this.selectedItemIndex = index;
        // notify row select event
        let rowSelectEvent = new ItemSelectEvent(this, this.selectedItemIndex);
        this.notifyObservers(rowSelectEvent);
    }

    /**
     * Gets selected item index
     */
    getSelectedItemIndex(): number {
        return this.selectedItemIndex;
    }

}
