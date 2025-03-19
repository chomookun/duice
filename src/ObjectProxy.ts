import {ObjectProxyHandler} from "./ObjectProxyHandler";
import {ArrayProxy} from "./ArrayProxy";
import {assert} from "./common";
import {Event} from "./event/Event";

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
        let objectHandler = new ObjectProxyHandler();
        // copy property
        for (let name in object) {
            let value = object[name];
            // value is array
            if(Array.isArray(value)){
                let arrayProxy = new ArrayProxy(value);
                ArrayProxy.getProxyHandler(arrayProxy as object[]).addObserver(objectHandler);
                object[name] = arrayProxy;
                continue;
            }
            // value is object
            if(value != null && typeof value === 'object'){
                let objectProxy = new ObjectProxy(value);
                ObjectProxy.getProxyHandler(objectProxy).addObserver(objectHandler);
                object[name] = objectProxy;
                continue;
            }
            // value is primitive
            object[name] = value;
        }
        // delete not exists property
        for(let name in object){
            if(!Object.keys(object).includes(name)){
                delete this[name];
            }
        }
        // creates proxy
        let objectProxy = new Proxy<object>(object, objectHandler);
        objectHandler.setTarget(object);
        // set property
        ObjectProxy.setProxyHandler(objectProxy, objectHandler);
        ObjectProxy.setTarget(objectProxy, object);
        // save
        ObjectProxy.save(objectProxy);
        // returns
        return objectProxy;
    }

    /**
     * Gets target
     * @param objectProxy
     * @param target
     */
    static setTarget(objectProxy: object, target: object): void {
        globalThis.Object.defineProperty(objectProxy, '_target_', {
            value: target,
            writable: true
        });
    }

    /**
     * Sets target
     * @param objectProxy
     */
    static getTarget(objectProxy: object): any {
        return globalThis.Object.getOwnPropertyDescriptor(objectProxy, '_target_').value;
    }

    /**
     * Sets proxy handler
     * @param objectProxy object proxy
     * @param objectProxyHandler object proxy handler
     */
    static setProxyHandler(objectProxy: object, objectProxyHandler: ObjectProxyHandler): void {
        globalThis.Object.defineProperty(objectProxy, '_proxy_handler_', {
            value: objectProxyHandler,
            writable: true
        });
    }

    /**
     * Gets proxy handler
     * @param objectProxy object proxy handler
     */
    static getProxyHandler(objectProxy: object): ObjectProxyHandler {
        let handler = globalThis.Object.getOwnPropertyDescriptor(objectProxy, '_proxy_handler_').value;
        assert(handler, 'handler is not found');
        return handler;
    }

    /**
     * Assign object to object proxy
     * @param objectProxy
     * @param object
     */
    static override assign(objectProxy: object, object: object): void {
        let objectHandler = this.getProxyHandler(objectProxy);
        try {
            // suspend
            objectHandler.suspendListener()
            objectHandler.suspendNotify();
            // loop object properties
            for(let name in object) {
                let value = object[name];
                // source value is array
                if(Array.isArray(value)){
                    if(Array.isArray(objectProxy[name])){
                        ArrayProxy.assign(objectProxy[name], value);
                    }else{
                        objectProxy[name] = new ArrayProxy(value);
                    }
                    continue;
                }
                // source value is object
                if(value != null && typeof value === 'object'){
                    if(objectProxy[name] != null && typeof objectProxy[name] === 'object'){
                        ObjectProxy.assign(objectProxy[name], value);
                    }else{
                        let objectProxy = new ObjectProxy(value);
                        ObjectProxy.getProxyHandler(objectProxy).addObserver(objectHandler);
                        objectProxy[name] = objectProxy;
                    }
                    continue;
                }
                // source value is primitive
                objectProxy[name] = value;
            }
        } finally {
            // resume
            objectHandler.resumeListener();
            objectHandler.resumeNotify();
        }
        // notify observers
        objectHandler.notifyObservers(new Event(this));
    }

    /**
     * Clear object properties
     * @param objectProxy
     */
    static clear(objectProxy: object): void {
        let objectHandler = this.getProxyHandler(objectProxy);
        try {
            // suspend
            objectHandler.suspendListener();
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
            objectHandler.resumeListener();
            objectHandler.resumeNotify();
        }
        // notify observers
        objectHandler.notifyObservers(new Event(this));
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
        this.getProxyHandler(objectProxy).setReadonly(property, readonly);
    }

    /**
     * Get whether property is readonly
     * @param objectProxy
     * @param property
     */
    static isReadonly(objectProxy: object, property: string): boolean {
        return this.getProxyHandler(objectProxy).isReadonly(property);
    }

    /**
     * Set all properties to be readonly
     * @param objectProxy
     * @param readonly
     */
    static setReadonlyAll(objectProxy: object, readonly: boolean): void {
        this.getProxyHandler(objectProxy).setReadonlyAll(readonly);
    }

    /**
     * Get whether all properties are readonly
     * @param objectProxy
     */
    static isReadonlyAll(objectProxy: object): boolean {
        return this.getProxyHandler(objectProxy).isReadonlyAll();
    }

    /**
     * Set object to be disabled
     * @param objectProxy
     * @param property
     * @param disable
     */
    static setDisable(objectProxy: object, property: string, disable: boolean): void {
        this.getProxyHandler(objectProxy).setDisable(property, disable);
    }

    /**
     * Get whether property is disabled
     * @param objectProxy
     * @param property
     */
    static isDisable(objectProxy: object, property: string): boolean {
        return this.getProxyHandler(objectProxy).isDisable(property);
    }

    /**
     * Set all properties to be disabled
     * @param objectProxy
     * @param disable
     */
    static setDisableAll(objectProxy: object, disable: boolean): void {
        this.getProxyHandler(objectProxy).setDisableAll(disable);
    }

    /**
     * Get whether all properties are disabled
     * @param objectProxy
     */
    static isDisableAll(objectProxy: object): boolean {
        return this.getProxyHandler(objectProxy).isDisableAll();
    }

    /**
     * Set property to be focused
     * @param objectProxy
     * @param property
     */
    static focus(objectProxy: object, property: string): void {
        this.getProxyHandler(objectProxy).focus(property);
    }

    /**
     * Set readonly before changing event listener
     * @param objectProxy
     * @param listener
     */
    static onPropertyChanging(objectProxy: object, listener: Function): void {
        this.getProxyHandler(objectProxy).propertyChangingListener = listener;
    }

    /**
     * Set property after changed event listener
     * @param objectProxy
     * @param listener
     */
    static onPropertyChanged(objectProxy: object, listener: Function): void {
        this.getProxyHandler(objectProxy).propertyChangedListener = listener;
    }

}