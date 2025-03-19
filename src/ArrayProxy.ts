import {ArrayProxyHandler} from "./ArrayProxyHandler";
import {assert} from "./common";
import {ObjectProxy} from "./ObjectProxy";
import {Event} from "./event/Event";

/**
 * Array Proxy
 */
export class ArrayProxy extends globalThis.Array {

    /**
     * Constructor
     * @param array
     */
    constructor(array: object[]) {
        super();
        // is already proxy
        if(ArrayProxy.isProxy(array)) {
            return array;
        }
        // array handler
        let arrayHandler = new ArrayProxyHandler();
        // copy array elements
        if(globalThis.Array.isArray(array)){
            for(let i = 0; i < array.length; i++ ){
                if (typeof array[i] === 'object') {
                    array[i] = new ObjectProxy(array[i]);
                }
            }
        }
        // create proxy
        let arrayProxy = new Proxy<object[]>(array, arrayHandler);
        arrayHandler.setTarget(array);
        // set property
        ArrayProxy.setProxyHandler(arrayProxy, arrayHandler);
        ArrayProxy.setTarget(arrayProxy, array);
        // save
        ArrayProxy.save(arrayProxy);
        // returns
        return arrayProxy;
    }

    /**
     * Checks if array is proxy
     * @param array array
     */
    static isProxy(array: object[]): boolean {
        return array.hasOwnProperty('_target_');
    }

    /**
     * Sets target to array proxy
     * @param arrayProxy array proxy
     * @param target target
     */
    static setTarget(arrayProxy: object[], target: object[]): void {
        globalThis.Object.defineProperty(arrayProxy, '_target_', {
            value: target,
            writable: true
        });
    }

    /**
     * Gets target from array proxy
     * @param arrayProxy
     */
    static getTarget(arrayProxy: object[]): any {
        return globalThis.Object.getOwnPropertyDescriptor(arrayProxy, '_target_').value;
    }

    /**
     * Sets array proxy handler
     * @param arrayProxy
     * @param arrayHandler
     */
    static setProxyHandler(arrayProxy: object[], arrayHandler: ArrayProxyHandler): void {
        globalThis.Object.defineProperty(arrayProxy, '_proxy_handler_', {
            value: arrayHandler,
            writable: true
        });
    }

    /**
     * Gets array proxy handler
     * @param arrayProxy array proxy
     */
    static getProxyHandler(arrayProxy: object[]): ArrayProxyHandler {
        let handler = globalThis.Object.getOwnPropertyDescriptor(arrayProxy, '_proxy_handler_').value;
        assert(handler, 'handler is not found');
        return handler;
    }

    /**
     * Assigns array to array proxy
     * @param arrayProxy
     * @param array
     */
    static assign(arrayProxy: object[], array: object[]): void {
        let arrayHandler = this.getProxyHandler(arrayProxy);
        try {
            // suspend
            arrayHandler.suspendListener()
            arrayHandler.suspendNotify();
            // clears elements
            arrayProxy.length = 0;
            // creates elements
            for (let index = 0; index < array.length; index ++) {
                let object = array[index];
                // if not object, skip
                if (typeof object !== 'object') {
                    continue;
                }
                let objectProxy = new ObjectProxy(object);
                arrayProxy[index] = objectProxy;
                // readonly
                ObjectProxy.setReadonlyAll(objectProxy, arrayHandler.isReadonlyAll());
                arrayHandler.readonly.forEach(property => {
                    ObjectProxy.setReadonly(objectProxy, property, true);
                });
                // disable
                ObjectProxy.setDisableAll(objectProxy, arrayHandler.isDisableAll());
                arrayHandler.disable.forEach(property => {
                    ObjectProxy.setDisable(objectProxy, property, true);
                })
                // add listener
                ObjectProxy.onPropertyChanging(objectProxy, arrayHandler.propertyChangingListener);
                ObjectProxy.onPropertyChanged(objectProxy, arrayHandler.propertyChangedListener);
            }
        } finally {
            // resume
            arrayHandler.resumeListener();
            arrayHandler.resumeNotify();
        }
        // notify observers
        arrayHandler.notifyObservers(new Event(this));
    }

    /**
     * Clears array elements
     * @param arrayProxy
     */
    static clear(arrayProxy: object[]): void {
        let arrayHandler = this.getProxyHandler(arrayProxy);
        try {
            // suspend
            arrayHandler.suspendListener();
            arrayHandler.suspendNotify();
            // clear element
            arrayProxy.length = 0;
        } finally {
            // resume
            arrayHandler.resumeListener();
            arrayHandler.resumeNotify();
        }
        // notify observers
        arrayHandler.notifyObservers(new Event(this));
    }

    /**
     * Save array proxy
     * @param arrayProxy
     */
    static save(arrayProxy: object[]): void {
        let origin = JSON.stringify(arrayProxy);
        globalThis.Object.defineProperty(arrayProxy, '_origin_', {
            value: origin,
            writable: true
        });
    }

    /**
     * Reset array proxy
     * @param arrayProxy
     */
    static reset(arrayProxy: object[]): void {
        let origin = JSON.parse(globalThis.Object.getOwnPropertyDescriptor(arrayProxy,'_origin_').value);
        this.assign(arrayProxy, origin);
    }

    /**
     * Sets readonly
     * @param arrayProxy array proxy
     * @param property property
     * @param readonly readonly
     */
    static setReadonly(arrayProxy: object[], property: string, readonly: boolean): void {
        this.getProxyHandler(arrayProxy).setReadonly(property, readonly);
        arrayProxy.forEach(objectProxy => {
            ObjectProxy.setReadonly(objectProxy, property, readonly);
        });
    }

    /**
     * Checks if property is readonly
     * @param arrayProxy array proxy
     * @param property property
     */
    static isReadonly(arrayProxy: object[], property: string): boolean {
        return this.getProxyHandler(arrayProxy).isReadonly(property);
    }

    /**
     * Checks if all properties are readonly
     * @param arrayProxy array proxy
     * @param readonly readonly
     */
    static setReadonlyAll(arrayProxy: object[], readonly: boolean): void {
        this.getProxyHandler(arrayProxy).setReadonlyAll(readonly);
        arrayProxy.forEach(objectProxy => {
            ObjectProxy.setReadonlyAll(objectProxy, readonly);
        });
    }

    /**
     * Checks if all properties are readonly
     * @param arrayProxy array proxy
     */
    static isReadonlyAll(arrayProxy: object[]): boolean {
        return this.getProxyHandler(arrayProxy).isReadonlyAll();
    }

    /**
     * Sets disable
     * @param arrayProxy array proxy
     * @param property property
     * @param disable disable
     */
    static setDisable(arrayProxy: object[], property: string, disable: boolean): void {
        this.getProxyHandler(arrayProxy).setDisable(property, disable);
        arrayProxy.forEach(objectProxy => {
            ObjectProxy.setDisable(objectProxy, property, disable);
        });
    }

    /**
     * Checks if property is disabled
     * @param arrayProxy array proxy
     * @param property property
     */
    static isDisable(arrayProxy: object[], property): boolean {
        return this.getProxyHandler(arrayProxy).isDisable(property);
    }

    /**
     * Sets all properties to be disabled
     * @param arrayProxy array proxy
     * @param disable disabled
     */
    static setDisableAll(arrayProxy: object[], disable: boolean): void {
        this.getProxyHandler(arrayProxy).setDisableAll(disable);
        arrayProxy.forEach(objectProxy => {
            ObjectProxy.setDisableAll(objectProxy, disable);
        });
    }

    /**
     * Checks if all properties are disabled
     * @param arrayProxy array proxy
     */
    static isDisableAll(arrayProxy: object[]): boolean {
        return this.getProxyHandler(arrayProxy).isDisableAll();
    }

    /**
     * Inserts item
     * @param arrayProxy
     * @param index
     */
    static selectItem(arrayProxy: object[], index: number): void {
        return this.getProxyHandler(arrayProxy).selectItem(index);
    }

    /**
     * Gets selected item index
     * @param arrayProxy array proxy
     */
    static getSelectedItemIndex(arrayProxy: object[]): number {
        return this.getProxyHandler(arrayProxy).getSelectedItemIndex();
    }

    /**
     * Adds property changing listener
     * @param arrayProxy array proxy
     * @param listener listener
     */
    static onPropertyChanging(arrayProxy: object[], listener: Function): void {
        this.getProxyHandler(arrayProxy).propertyChangingListener = listener;
        arrayProxy.forEach(objectProxy => {
            ObjectProxy.getProxyHandler(objectProxy).propertyChangingListener = listener;
        });
    }

    /**
     * Adds property changed listener
     * @param arrayProxy array proxy
     * @param listener listener
     */
    static onPropertyChanged(arrayProxy: object[], listener: Function): void {
        this.getProxyHandler(arrayProxy).propertyChangedListener = listener;
        arrayProxy.forEach(objectProxy => {
            ObjectProxy.getProxyHandler(objectProxy).propertyChangedListener = listener;
        });
    }

    /**
     * Adds item inserting listener
     * @param arrayProxy array proxy
     * @param listener listener
     */
    static onItemInserting(arrayProxy: object[], listener: Function): void {
        this.getProxyHandler(arrayProxy).itemInsertingListener = listener;
    }

    /**
     * Adds item inserted listener
     * @param arrayProxy array proxy
     * @param listener listener
     */
    static onItemInserted(arrayProxy: object[], listener: Function): void {
        this.getProxyHandler(arrayProxy).itemInsertedListener = listener;
    }

    /**
     * Adds item deleting listener
     * @param arrayProxy array proxy
     * @param listener listener
     */
    static onItemDeleting(arrayProxy: object[], listener: Function): void {
        this.getProxyHandler(arrayProxy).itemDeletingListener = listener;
    }

    /**
     * Adds item deleted listener
     * @param arrayProxy array proxy
     * @param listener listener
     */
    static onItemDeleted(arrayProxy: object[], listener: Function): void {
        this.getProxyHandler(arrayProxy).itemDeletedListener = listener;
    }

    /**
     * Adds item moving listener
     * @param arrayProxy array proxy
     * @param listener listener
     */
    static onItemMoving(arrayProxy: object[], listener: Function): void {
        this.getProxyHandler(arrayProxy).itemMovingListener = listener;
    }

    /**
     * Adds item moved listener
     * @param arrayProxy array proxy
     * @param listener listener
     */
    static onItemMoved(arrayProxy: object[], listener: Function): void {
        this.getProxyHandler(arrayProxy).itemMovedListener = listener;
    }

}