import {ObjectProxyHandler} from "./ObjectProxyHandler";
import {ArrayProxy} from "./ArrayProxy";
import {
    isArray,
    isObject,
    setProxyTarget,
    setProxyHandler,
    getProxyHandler,
    isProxy
} from "./common";
import {PropertyChangingEvent} from "./event/PropertyChangingEvent";
import {PropertyChangedEvent} from "./event/PropertyChangedEvent";

/**
 * Object Proxy
 */
export class ObjectProxy extends globalThis.Object {

    /**
     * Constructor
     * @param object
     */
    public constructor(object: object) {
        super();
        // is already object proxy
        if (object instanceof ObjectProxy) {
            return object;
        }
        // object handler
        let objectProxyHandler = new ObjectProxyHandler(object);
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
                let source = object[name];
                let target= objectProxy[name];
                // source is array
                if (isArray(source)) {
                    if (isProxy(target)) {
                        ArrayProxy.assign(target, source);
                    } else {
                        objectProxy[name] =  new ArrayProxy(source);
                        getProxyHandler(objectProxy[name]).setParent(objectProxyHandler);
                    }
                    continue;
                }
                // source is object
                if (isObject(source)) {
                    if (isProxy(target)) {
                        ObjectProxy.assign(target, source);
                    } else {
                        objectProxy[name] = new ObjectProxy(source);
                        getProxyHandler(objectProxy[name]).setParent(objectProxyHandler);
                    }
                    continue;
                }
                // default
                objectProxy[name] = source;
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
                // source value is array
                if(isArray(value)) {
                    if (isProxy(value)) {
                        ArrayProxy.clear(value as object[]);
                    } else {
                        objectProxy[name] = [];
                    }
                    continue;
                }
                // source value is object
                if(isObject(value)) {
                    if (isProxy(value)) {
                        ObjectProxy.clear(value);
                    } else {
                        objectProxy[name] = null;
                    }
                    continue;
                }
                // default
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
     * Set all properties to be disabled
     * @param objectProxy
     * @param disable
     */
    static setDisabledAll(objectProxy: object, disable: boolean): void {
        getProxyHandler(objectProxy).setDisabledAll(disable);
    }

    /**
     * Get whether all properties are disabled
     * @param objectProxy
     */
    static isDisabledAll(objectProxy: object): boolean {
        return getProxyHandler(objectProxy).isDisabledAll();
    }

    /**
     * Set object to be disabled
     * @param objectProxy
     * @param property
     * @param disable
     */
    static setDisabled(objectProxy: object, property: string, disable: boolean): void {
        getProxyHandler(objectProxy).setDisabled(property, disable);
    }

    /**
     * Get whether property is disabled
     * @param objectProxy
     * @param property
     */
    static isDisabled(objectProxy: object, property: string): boolean {
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