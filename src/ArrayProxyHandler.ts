import {ProxyHandler} from "./ProxyHandler";
import {ArrayProxy} from "./ArrayProxy";
import {Observable} from "./Observable";
import {ArrayElement} from "./ArrayElement";
import {ItemSelectingEvent} from "./event/ItemSelectingEvent";
import {Event} from "./event/Event";
import {ItemMovingEvent} from "./event/ItemMovingEvent";
import {ObjectProxy} from "./ObjectProxy";
import {getProxyHandler, getProxyTarget} from "./common";
import {ObjectProxyHandler} from "./ObjectProxyHandler";

/**
 * Array Proxy Handler
 */
export class ArrayProxyHandler extends ProxyHandler<object[]> {

    selectedItemIndex: number;

    /**
     * Constructor
     */
    constructor(array: object[], parent?: ProxyHandler<any>) {
        super(array, parent);
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
            this.notifyObservers(null);
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
            if(event instanceof ItemSelectingEvent) {
                this.selectedItemIndex = event.getIndex();
                return;
            }
            // row move event
            if (event instanceof ItemMovingEvent) {
                let object = this.getTarget().splice(event.getFromIndex(), 1)[0];
                this.getTarget().splice(event.getToIndex(), 0, object);
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
        let arrayHandler = getProxyHandler<ArrayProxyHandler>(arrayProxy);
        let proxyTarget = getProxyTarget(arrayProxy);
        items.forEach((object, index) => {
            if (typeof object === 'object') {
                let objectProxy = new ObjectProxy(object);
                let objectHandler = getProxyHandler<ObjectProxyHandler>(objectProxy);
                items[index] = objectProxy;
            }
        });
        proxyTarget.splice(index, 0, ...items);
        arrayHandler.notifyObservers();
    }

    /**
     * Deletes items from array proxy
     * @param arrayProxy array proxy to delete
     * @param index index to delete
     * @param size size for delete
     */
    deleteItem(arrayProxy: object[], index: number, size?: number): void {
        let arrayHandler = getProxyHandler<ArrayProxyHandler>(arrayProxy);
        let proxyTarget = getProxyTarget(arrayProxy);
        let sliceBegin = index;
        let sliceEnd = (size ? index + size : index + 1);
        let rows = proxyTarget.slice(sliceBegin, sliceEnd);
        let spliceStart = index;
        let spliceDeleteCount = (size ? size : 1);
        proxyTarget.splice(spliceStart, spliceDeleteCount);
        arrayHandler.notifyObservers();
    }

    /**
     * Selects item by index
     * @param index index
     */
    selectItem(index: number): void {
        this.selectedItemIndex = index;
        // notify row select event
        this.notifyObservers();
    }

    /**
     * Gets selected item index
     */
    getSelectedItemIndex(): number {
        return this.selectedItemIndex;
    }

}
