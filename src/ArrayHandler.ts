import {DataHandler} from "./DataHandler";
import {ArrayProxy} from "./ArrayProxy";
import {Observable} from "./Observable";
import {ArrayElement} from "./ArrayElement";
import {ItemInsertEvent} from "./event/ItemDeleteEvent";
import {ItemSelectEvent} from "./event/ItemSelectEvent";
import {DataEvent} from "./event/DataEvent";
import {ItemMoveEvent} from "./event/ItemMoveEvent";
import {ObjectProxy} from "./ObjectProxy";
import {ItemDeleteEvent} from "./event/ItemInsertEvent";

export class ArrayHandler extends DataHandler<object[]> {

    propertyChangingListener: Function;

    propertyChangedListener: Function;

    rowInsertingListener: Function;

    rowInsertedListener: Function;

    rowDeletingListener: Function;

    rowDeletedListener: Function;

    selectedItemIndex: number;

    constructor() {
        super();
    }

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
                return async function () {

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
                return async function () {
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

    set(target: ArrayProxy, property: string, value: any): boolean {
        Reflect.set(target, property, value);
        if (property === 'length') {
            this.notifyObservers(new DataEvent(this));
        }
        return true;
    }

    update(observable: Observable, event: DataEvent): Promise<void> {
        console.debug("ArrayHandler.update", observable, event);

        // instance is array component
        if(observable instanceof ArrayElement) {
            // row select event
            if(event instanceof ItemSelectEvent) {
                this.selectedItemIndex = event.getIndex();
                return;
            }
            // row move event
            if (event instanceof ItemMoveEvent) {
                let object = this.getTarget().splice(event.getFromIndex(), 1)[0];
                this.getTarget().splice(event.getToIndex(), 0, object);
            }
        }

        // notify observers
        this.notifyObservers(event);
    }

    insertItem(arrayProxy: object[], index: number, ...rows: object[]): void {
        let arrayHandler = ArrayProxy.getHandler(arrayProxy);
        let proxyTarget = ArrayProxy.getTarget(arrayProxy);
        rows.forEach((object, index) => {
            if (typeof object === 'object') {
                let objectProxy = new ObjectProxy(object);
                let objectHandler = ObjectProxy.getHandler(objectProxy);
                objectHandler.propertyChangingListener = this.propertyChangingListener;
                objectHandler.propertyChangedListener = this.propertyChangedListener;
                rows[index] = objectProxy;
            }
        });
        let event = new ItemInsertEvent(this, index, rows);
        if (arrayHandler.checkListener(arrayHandler.rowInsertingListener, event)) {
            proxyTarget.splice(index, 0, ...rows);
            arrayHandler.checkListener(arrayHandler.rowInsertedListener, event);
            arrayHandler.notifyObservers(event);
        }
    }

    deleteItem(arrayProxy: object[], index: number, size?: number): void {
        let arrayHandler = ArrayProxy.getHandler(arrayProxy);
        let proxyTarget = ArrayProxy.getTarget(arrayProxy);
        let sliceBegin = index;
        let sliceEnd = (size ? index + size : index + 1);
        let rows = proxyTarget.slice(sliceBegin, sliceEnd);
        let event = new ItemDeleteEvent(this, index, rows);
        if (arrayHandler.checkListener(arrayHandler.rowDeletingListener, event)) {
            let spliceStart = index;
            let spliceDeleteCount = (size ? size : 1);
            proxyTarget.splice(spliceStart, spliceDeleteCount);
            arrayHandler.checkListener(arrayHandler.rowDeletedListener, event);
            arrayHandler.notifyObservers(event);
        }
    }

    appendItem(arrayProxy: object[], ...rows: object[]): void {
        let index = arrayProxy.length;
        return this.insertItem(arrayProxy, index, ...rows);
    }

    selectItem(index: number): void {
        this.selectedItemIndex = index;

        // notify row select event
        let rowSelectEvent = new ItemSelectEvent(this, this.selectedItemIndex);
        this.notifyObservers(rowSelectEvent);
    }

    getSelectedItemIndex(): number {
        return this.selectedItemIndex;
    }

}
