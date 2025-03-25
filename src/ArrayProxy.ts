import {ArrayProxyHandler} from "./ArrayProxyHandler";
import {
    isObject,
    getProxyHandler,
    setProxyTarget,
    setProxyHandler, isPrimitive
} from "./common";
import {ObjectProxy} from "./ObjectProxy";
import {PropertyChangingEvent} from "./event/PropertyChangingEvent";
import {PropertyChangedEvent} from "./event/PropertyChangedEvent";
import {ItemSelectingEvent} from "./event/ItemSelectingEvent";
import {EventType} from "./event/EventType";
import {ItemMovingEvent} from "./event/ItemMovingEvent";
import {ItemMovedEvent} from "./event/ItemMovedEvent";
import {ItemSelectedEvent} from "./event/ItemSelectedEvent";

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
        if(array instanceof ArrayProxy) {
            return array;
        }
        // create proxy
        let arrayHandler = new ArrayProxyHandler(array);
        let arrayProxy = new Proxy<object[]>(array, arrayHandler);
        setProxyTarget(arrayProxy, array);
        setProxyHandler(arrayProxy, arrayHandler);
        // assign
        let initialArray = JSON.parse(JSON.stringify(array));
        ArrayProxy.assign(arrayProxy, initialArray);
        // save
        ArrayProxy.save(arrayProxy);
        // returns
        return arrayProxy;
    }

    /**
     * Assigns array to array proxy
     * @param arrayProxy
     * @param array
     */
    static assign(arrayProxy: object[], array: object[]): void {
        let arrayProxyHandler = getProxyHandler<ArrayProxyHandler>(arrayProxy);
        try {
            // suspend
            arrayProxyHandler.suspendEvent()
            arrayProxyHandler.suspendNotify();
            // clears elements
            arrayProxy.length = 0;
            // creates elements
            for (let index = 0; index < array.length; index ++) {
                let value = array[index];
                // source value is object
                if (isObject(value)) {
                    let objectProxy = new ObjectProxy(value);
                    getProxyHandler(objectProxy).setParent(arrayProxyHandler);
                    arrayProxy[index] = objectProxy;
                    continue;
                }
                // default
                arrayProxy[index] = value;
            }
        } finally {
            // resume
            arrayProxyHandler.resumeEvent();
            arrayProxyHandler.resumeNotify();
        }
        // notify observers
        arrayProxyHandler.notifyObservers();
    }

    /**
     * Clears array elements
     * @param arrayProxy
     */
    static clear(arrayProxy: object[]): void {
        let arrayHandler = getProxyHandler(arrayProxy);
        try {
            // suspend
            arrayHandler.suspendEvent();
            arrayHandler.suspendNotify();
            // clear element
            arrayProxy.length = 0;
        } finally {
            // resume
            arrayHandler.resumeEvent();
            arrayHandler.resumeNotify();
        }
        // notify observers
        arrayHandler.notifyObservers();
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
     * Checks if all properties are readonly
     * @param arrayProxy array proxy
     * @param readonly readonly
     */
    static setReadonlyAll(arrayProxy: object[], readonly: boolean): void {
        getProxyHandler(arrayProxy).setReadonlyAll(readonly);
    }

    /**
     * Checks if all properties are readonly
     * @param arrayProxy array proxy
     */
    static isReadonlyAll(arrayProxy: object[]): boolean {
        return getProxyHandler(arrayProxy).isReadonlyAll();
    }

    /**
     * Sets readonly
     * @param arrayProxy array proxy
     * @param property property
     * @param readonly readonly
     */
    static setReadonly(arrayProxy: object[], property: string, readonly: boolean): void {
        getProxyHandler(arrayProxy).setReadonly(property, readonly);
    }

    /**
     * Checks if property is readonly
     * @param arrayProxy array proxy
     * @param property property
     */
    static isReadonly(arrayProxy: object[], property: string): boolean {
        return getProxyHandler(arrayProxy).isReadonly(property);
    }

    /**
     * Sets all properties to be disabled
     * @param arrayProxy array proxy
     * @param disable disabled
     */
    static setDisabledAll(arrayProxy: object[], disable: boolean): void {
        getProxyHandler(arrayProxy).setDisabledAll(disable);
    }

    /**
     * Checks if all properties are disabled
     * @param arrayProxy array proxy
     */
    static isDisabledAll(arrayProxy: object[]): boolean {
        return getProxyHandler(arrayProxy).isDisabledAll();
    }

    /**
     * Sets disable
     * @param arrayProxy array proxy
     * @param property property
     * @param disable disable
     */
    static setDisabled(arrayProxy: object[], property: string, disable: boolean): void {
        getProxyHandler(arrayProxy).setDisabled(property, disable);
    }

    /**
     * Checks if property is disabled
     * @param arrayProxy array proxy
     * @param property property
     */
    static isDisabled(arrayProxy: object[], property): boolean {
        return getProxyHandler(arrayProxy).isDisabled(property);
    }

    /**
     * Inserts item
     * @param arrayProxy
     * @param index
     */
    static selectItem(arrayProxy: object[], index: number): void {
        return getProxyHandler<ArrayProxyHandler>(arrayProxy).selectItem(index);
    }

    /**
     * Gets selected item index
     * @param arrayProxy array proxy
     */
    static getSelectedItemIndex(arrayProxy: object[]): number {
        return getProxyHandler<ArrayProxyHandler>(arrayProxy).getSelectedItemIndex();
    }

    /**
     * On item selecting
     * @param arrayProxy array proxy
     * @param eventListener event listener
     */
    static onItemSelecting(arrayProxy: ArrayProxy, eventListener: Function): void {
        let proxyHandler = getProxyHandler(arrayProxy);
        let eventType: EventType = ItemSelectingEvent;
        proxyHandler.clearEventListeners(eventType);
        proxyHandler.addEventListener(eventType, eventListener);
    }

    /**
     * On item selected
     * @param arrayProxy array proxy
     * @param eventListener event listener
     */
    static onItemSelected(arrayProxy : ArrayProxy, eventListener: Function): void {
        let proxyHandler = getProxyHandler(arrayProxy);
        let eventType: EventType = ItemSelectedEvent;
        proxyHandler.clearEventListeners(eventType);
        proxyHandler.addEventListener(eventType, eventListener);
    }

    /**
     * On item moving
     * @param arrayProxy array proxy
     * @param eventListener event listener
     */
    static onItemMoving(arrayProxy: ArrayProxy, eventListener: Function): void {
        let proxyHandler = getProxyHandler(arrayProxy);
        let eventType: EventType = ItemMovingEvent;
        proxyHandler.clearEventListeners(eventType);
        proxyHandler.addEventListener(eventType, eventListener);
    }

    /**
     * On item moved
     * @param arrayProxy array proxy
     * @param eventListener event listener
     */
    static onItemMoved(arrayProxy : ArrayProxy, eventListener: Function): void {
        let proxyHandler = getProxyHandler(arrayProxy);
        let eventType: EventType = ItemMovedEvent;
        proxyHandler.clearEventListeners(eventType);
        proxyHandler.addEventListener(eventType, eventListener);
    }

    /**
     * On property changing
     * @param objectProxy object proxy
     * @param eventListener event listener
     */
    static onPropertyChanging(objectProxy : ObjectProxy, eventListener: Function): void {
        let proxyHandler = getProxyHandler(objectProxy);
        let eventType = PropertyChangingEvent;
        proxyHandler.clearEventListeners(eventType);
        proxyHandler.addEventListener(eventType, eventListener);
    }

    /**
     * On property changed
     * @param objectProxy object proxy
     * @param eventListener event listener
     */
    static onPropertyChanged(objectProxy : ObjectProxy, eventListener: Function): void {
        let proxyHandler = getProxyHandler(objectProxy);
        let eventType = PropertyChangedEvent;
        proxyHandler.clearEventListeners(eventType);
        proxyHandler.addEventListener(eventType, eventListener);
    }

}