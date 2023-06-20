///<reference path="DataHandler.ts"/>
///<reference path="event/ItemMoveEvent.ts"/>
namespace duice {

    /**
     * array handler class
     */
    export class ArrayHandler extends DataHandler<object[]> {

        propertyChangingListener: Function;

        propertyChangedListener: Function;

        rowInsertingListener: Function;

        rowInsertedListener: Function;

        rowDeletingListener: Function;

        rowDeletedListener: Function;

        selectedItemIndex: number;

        /**
         * constructor
         */
        constructor() {
            super();
        }

        /**
         * get
         * @param target
         * @param property
         * @param receiver
         */
        get(target: object[], property: string, receiver: object): any {
            let _this = this;
            const value = target[property];
            if (typeof value === 'function') {

                // push, unshift
                if (['push', 'unshift'].includes(property)) {
                    return async function () {
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
                        await _this.insertItem(target, index, ...rows);
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
                            await _this.deleteItem(target, start, deleteCount);
                        }

                        // insert rows
                        if(insertRows.length > 0){
                            await _this.insertItem(target, start, ...insertRows);
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
                        await _this.deleteItem(target, index);
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
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target: ArrayProxy, property: string, value: any): boolean {
            Reflect.set(target, property, value);
            if (property === 'length') {
                this.notifyObservers(new event.Event(this));
            }
            return true;
        }

        /**
         * update
         * @param observable
         * @param event
         */
        async update(observable: Observable, event: event.Event): Promise<void> {
            console.debug("ArrayHandler.update", observable, event);

            // instance is array component
            if(observable instanceof ArrayElement) {

                // row select event
                if(event instanceof duice.event.ItemSelectEvent) {
                    this.selectedItemIndex = event.getIndex();
                    return;
                }

                // row move event
                if (event instanceof duice.event.ItemMoveEvent) {
                    let object = this.getTarget().splice(event.getFromIndex(), 1)[0];
                    this.getTarget().splice(event.getToIndex(), 0, object);
                }
            }

            // notify observers
            this.notifyObservers(event);
        }

        /**
         * insert item
         * @param arrayProxy
         * @param index
         * @param rows
         */
        async insertItem(arrayProxy: object[], index: number, ...rows: object[]): Promise<void> {
            let arrayHandler = ArrayProxy.getHandler(arrayProxy);
            let proxyTarget = ArrayProxy.getTarget(arrayProxy);
            rows.forEach((object, index) => {
                rows[index] = new ObjectProxy(object);
            });
            let event = new duice.event.ItemInsertEvent(this, index, rows);
            if (await arrayHandler.checkListener(arrayHandler.rowInsertingListener, event)) {
                proxyTarget.splice(index, 0, ...rows);
                await arrayHandler.checkListener(arrayHandler.rowInsertedListener, event);
                arrayHandler.notifyObservers(event);
            }
        }

        /**
         * delete item
         * @param arrayProxy
         * @param index
         * @param size
         */
        async deleteItem(arrayProxy: object[], index: number, size?: number): Promise<void> {
            let arrayHandler = ArrayProxy.getHandler(arrayProxy);
            let proxyTarget = ArrayProxy.getTarget(arrayProxy);
            let sliceBegin = index;
            let sliceEnd = (size ? index + size : index + 1);
            let rows = proxyTarget.slice(sliceBegin, sliceEnd);
            let event = new duice.event.ItemDeleteEvent(this, index, rows);
            if (await arrayHandler.checkListener(arrayHandler.rowDeletingListener, event)) {
                let spliceStart = index;
                let spliceDeleteCount = (size ? size : 1);
                proxyTarget.splice(spliceStart, spliceDeleteCount);
                await arrayHandler.checkListener(arrayHandler.rowDeletedListener, event);
                arrayHandler.notifyObservers(event);
            }
        }

        /**
         * append item
         * @param arrayProxy
         * @param rows
         */
        async appendItem(arrayProxy: object[], ...rows: object[]): Promise<void> {
            let index = arrayProxy.length;
            return this.insertItem(arrayProxy, index, ...rows);
        }

        /**
         * select item
         * @param index
         */
        selectItem(index: number): void {
            this.selectedItemIndex = index;

            // notify row select event
            let rowSelectEvent = new event.ItemSelectEvent(this, this.selectedItemIndex);
            this.notifyObservers(rowSelectEvent);
        }

        /**
         * return selected item index
         */
        getSelectedItemIndex(): number {
            return this.selectedItemIndex;
        }

    }

}