import {ObjectProxyHandler} from "./ObjectProxyHandler";
import {ArrayProxy} from "./ArrayProxy";
import {
    assert,
    isArray,
    isObject,
    isPrimitive,
    setProxyTarget,
    getProxyTarget,
    setProxyHandler,
    getProxyHandler,
    isProxy
} from "./common";
import {Event} from "./event/Event";
import {PropertyChangingEvent} from "./event/PropertyChangingEvent";
import {PropertyChangedEvent} from "./event/PropertyChangedEvent";

/**
 * Object Proxy
 */
export class ObjectProxy extends globalThis.Object {

    /**
     * Constructor
     * @param object
     * @param parent (optional)
     */
    public constructor(object: object, parent?: ObjectProxy|ArrayProxy) {
        super();
        // is already object proxy
        if (object instanceof ObjectProxy) {
            return object;
        }
        // object handler
        let objectProxyHandler = new ObjectProxyHandler(object, parent ? getProxyHandler(parent) : null);
        let objectProxy = new Proxy<object>(object, objectProxyHandler);
        setProxyTarget(objectProxy, object);
        setProxyHandler(objectProxy, objectProxyHandler);
        // assign
        let initialObject = JSON.parse(JSON.stringify(object));
        ObjectProxy.assign(objectProxy, initialObject);
        // save
        ObjectProxy.save(objectProxy);
        // returns
        return objectProxy;
    }

    /**
     * Assign object to object proxy
     * @param objectProxy
     * @param object
     */
    static override assign(objectProxy: object, object: object): void {
        let objectProxyHandler = getProxyHandler<ObjectProxyHandler>(objectProxy);
        try {
            // suspend
            objectProxyHandler.suspendEvent()
            objectProxyHandler.suspendNotify();
            // loop object properties
            for(let name in object) {
                let value = object[name];
                // source value is array
                if (isArray(value)) {
                    if (isProxy(objectProxy[name])) {
                        ArrayProxy.assign(objectProxy[name], value);
                    }else{
                        objectProxy[name] = new ArrayProxy(value, objectProxy);
                        getProxyHandler(objectProxy[name]).addObserver(objectProxyHandler);
                    }
                    continue;
                }
                // source value is object
                if (isObject(value)) {
                    if (isProxy(objectProxy[name])) {
                        ObjectProxy.assign(objectProxy[name], value);
                    }else{
                        objectProxy[name] = new ObjectProxy(value, objectProxy);
                        getProxyHandler(objectProxy[name]).addObserver(objectProxyHandler);
                    }
                    continue;
                }
                // source value is primitive
                if (isPrimitive(value)) {
                    objectProxy[name] = value;
                }
            }
        } finally {
            // resume
            objectProxyHandler.resumeEvent();
            objectProxyHandler.resumeNotify();
        }
        // notify observers
        objectProxyHandler.notifyObservers(null);
    }

    /**
     * Clear object properties
     * @param objectProxy
     */
    static clear(objectProxy: object): void {
        let objectHandler = getProxyHandler(objectProxy);
        try {
            // suspend
            objectHandler.suspendEvent();
            objectHandler.suspendNotify();
            // clear properties
            for(let name in objectProxy) {
                let value = objectProxy[name];
                if(Array.isArray(value)) {
                    ArrayProxy.clear(value as object[]);
                    continue;
                }
                if(value != null && typeof value === 'object') {
                    ObjectProxy.clear(value);
                    continue;
                }
                objectProxy[name] = null;
            }
        } finally {
            // resume
            objectHandler.resumeEvent();
            objectHandler.resumeNotify();
        }
        // notify observers
        objectHandler.notifyObservers(null);
    }

    /**
     * Save object properties
     * @param objectProxy
     */
    static save(objectProxy: object): void {
        let origin = JSON.stringify(objectProxy);
        globalThis.Object.defineProperty(objectProxy, '_origin_', {
            value: origin,
            writable: true
        });
    }

    /**
     * Reset object properties
     * @param objectProxy
     */
    static reset(objectProxy: object): void {
        let origin = JSON.parse(globalThis.Object.getOwnPropertyDescriptor(objectProxy, '_origin_').value);
        this.assign(objectProxy, origin);
    }

    /**
     * Set property to be readonly
     * @param objectProxy
     * @param property
     * @param readonly
     */
    static setReadonly(objectProxy: object, property: string, readonly: boolean): void {
        getProxyHandler(objectProxy).setReadonly(property, readonly);
    }

    /**
     * Get whether property is readonly
     * @param objectProxy
     * @param property
     */
    static isReadonly(objectProxy: object, property: string): boolean {
        return getProxyHandler(objectProxy).isReadonly(property);
    }

    /**
     * Set all properties to be readonly
     * @param objectProxy
     * @param readonly
     */
    static setReadonlyAll(objectProxy: object, readonly: boolean): void {
        getProxyHandler(objectProxy).setReadonlyAll(readonly);
    }

    /**
     * Get whether all properties are readonly
     * @param objectProxy
     */
    static isReadonlyAll(objectProxy: object): boolean {
        return getProxyHandler(objectProxy).isReadonlyAll();
    }

    /**
     * Set object to be disabled
     * @param objectProxy
     * @param property
     * @param disable
     */
    static setDisable(objectProxy: object, property: string, disable: boolean): void {
        getProxyHandler(objectProxy).setDisable(property, disable);
    }

    /**
     * Get whether property is disabled
     * @param objectProxy
     * @param property
     */
    static isDisable(objectProxy: object, property: string): boolean {
        return getProxyHandler(objectProxy).isDisable(property);
    }

    /**
     * Set all properties to be disabled
     * @param objectProxy
     * @param disable
     */
    static setDisableAll(objectProxy: object, disable: boolean): void {
        getProxyHandler(objectProxy).setDisableAll(disable);
    }

    /**
     * Get whether all properties are disabled
     * @param objectProxy
     */
    static isDisableAll(objectProxy: object): boolean {
        return getProxyHandler(objectProxy).isDisableAll();
    }



    static setDisabledAll(objectProxy: ObjectProxy, disabledAll: boolean): void {
        getProxyHandler(objectProxy).setDisabledAll(disabledAll);
    }

    static isDisabledAll(objectProxy: ObjectProxy): boolean {
        return getProxyHandler(objectProxy).isDisabledAll();
    }

    static setDisabled(objectProxy: ObjectProxy, property: string, disabled: boolean): void {
        getProxyHandler(objectProxy).setDisabled(property, disabled);
    }

    static isDisabled(objectProxy: ObjectProxy, property: string): boolean {
        return getProxyHandler(objectProxy).isDisabled(property);
    }




    /**
     * Set property to be focused
     * @param objectProxy
     * @param property
     */
    static focus(objectProxy: object, property: string): void {
        getProxyHandler<ObjectProxyHandler>(objectProxy).focus(property);
    }

    /**
     * On property changing
     * @param objectProxy object proxy
     * @param eventListener event listener
     */
    static onPropertyChanging(objectProxy : ObjectProxy, eventListener: Function): void {
        let proxyHandler = getProxyHandler(objectProxy);
        proxyHandler.clearEventListeners(PropertyChangingEvent);
        proxyHandler.addEventListener(PropertyChangingEvent, eventListener);
    }

    /**
     * On property changed
     * @param objectProxy object proxy
     * @param eventListener event listener
     */
    static onPropertyChanged(objectProxy : ObjectProxy, eventListener: Function): void {
        let proxyHandler = getProxyHandler(objectProxy);
        proxyHandler.clearEventListeners(PropertyChangedEvent);
        proxyHandler.addEventListener(PropertyChangedEvent, eventListener);
    }

}