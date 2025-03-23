import {ArrayProxyHandler} from "./ArrayProxyHandler";
import {
    isObject,
    getProxyHandler,
    setProxyTarget,
    setProxyHandler
} from "./common";
import {ObjectProxy} from "./ObjectProxy";
import {PropertyChangingEvent} from "./event/PropertyChangingEvent";
import {PropertyChangedEvent} from "./event/PropertyChangedEvent";
import {ItemSelectingEvent} from "./event/ItemSelectingEvent";
import {EventType} from "./event/EventType";
import {ItemMovingEvent} from "./event/ItemMovingEvent";
import {ItemMovedEvent} from "./event/ItemMovedEvent";

/**
 * Array Proxy
 */
export class ArrayProxy extends globalThis.Array {

    /**
     * Constructor
     * @param array
     * @param parent
     */
    constructor(array: object[], parent?: ObjectProxy|ArrayProxy) {
        super();
        // is already proxy
        if(array instanceof ArrayProxy) {
            return array;
        }
        // create proxy
        let arrayHandler = new ArrayProxyHandler(array, parent ? getProxyHandler(parent) : null);
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
                let object = array[index];
                if (isObject(object)) {
                    let objectProxy = new ObjectProxy(object, arrayProxy);
                    arrayProxy[index] = objectProxy;
                    // event listener
                    getProxyHandler(objectProxy).eventDispatcher = arrayProxyHandler.eventDispatcher;
                    // readonly
                    ObjectProxy.setReadonlyAll(objectProxy, arrayProxyHandler.isReadonlyAll());
                    arrayProxyHandler.readonly.forEach(property => {
                        ObjectProxy.setReadonly(objectProxy, property, true);
                    });
                    // disable
                    ObjectProxy.setDisableAll(objectProxy, arrayProxyHandler.isDisableAll());
                    arrayProxyHandler.disable.forEach(property => {
                        ObjectProxy.setDisable(objectProxy, property, true);
                    })
                }
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
     * Sets readonly
     * @param arrayProxy array proxy
     * @param property property
     * @param readonly readonly
     */
    static setReadonly(arrayProxy: object[], property: string, readonly: boolean): void {
        getProxyHandler(arrayProxy).setReadonly(property, readonly);
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
        return getProxyHandler(arrayProxy).isReadonly(property);
    }

    /**
     * Checks if all properties are readonly
     * @param arrayProxy array proxy
     * @param readonly readonly
     */
    static setReadonlyAll(arrayProxy: object[], readonly: boolean): void {
        getProxyHandler(arrayProxy).setReadonlyAll(readonly);
        arrayProxy.forEach(objectProxy => {
            ObjectProxy.setReadonlyAll(objectProxy, readonly);
        });
    }

    /**
     * Checks if all properties are readonly
     * @param arrayProxy array proxy
     */
    static isReadonlyAll(arrayProxy: object[]): boolean {
        return getProxyHandler(arrayProxy).isReadonlyAll();
    }

    /**
     * Sets disable
     * @param arrayProxy array proxy
     * @param property property
     * @param disable disable
     */
    static setDisable(arrayProxy: object[], property: string, disable: boolean): void {
        getProxyHandler(arrayProxy).setDisable(property, disable);
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
        return getProxyHandler(arrayProxy).isDisable(property);
    }

    /**
     * Sets all properties to be disabled
     * @param arrayProxy array proxy
     * @param disable disabled
     */
    static setDisableAll(arrayProxy: object[], disable: boolean): void {
        getProxyHandler(arrayProxy).setDisableAll(disable);
        arrayProxy.forEach(objectProxy => {
            ObjectProxy.setDisableAll(objectProxy, disable);
        });
    }

    /**
     * Checks if all properties are disabled
     * @param arrayProxy array proxy
     */
    static isDisableAll(arrayProxy: object[]): boolean {
        return getProxyHandler(arrayProxy).isDisableAll();
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
        let eventType: EventType = ItemSelectingEvent;
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