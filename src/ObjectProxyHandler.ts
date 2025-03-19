import {ProxyHandler} from "./ProxyHandler";
import {ObjectElement} from "./ObjectElement";
import {Observable} from "./Observable";
import {PropertyChangeEvent} from "./event/PropertyChangeEvent";
import {Event} from "./event/Event";

/**
 * Object Proxy Handler
 */
export class ObjectProxyHandler extends ProxyHandler<object> {

    propertyChangingListener: Function;

    propertyChangedListener: Function;

    /**
     * Constructor
     */
    constructor() {
        super();
    }

    /**
     * Gets target property value
     * @param target target
     * @param property property
     * @param receiver receiver
     */
    get(target: object, property: string, receiver: object): any {
        return Reflect.get(target, property, receiver);
    }

    /**
     * Sets target property value
     * @param target
     * @param property
     * @param value
     */
    set(target: object, property: string, value: any) {
        // change value
        Reflect.set(target, property, value);
        // notify
        let event = new PropertyChangeEvent(this, property, value);
        this.notifyObservers(event);
        // returns
        return true;
    }

    /**
     * Updates
     * @param observable observable
     * @param event event
     */
    update(observable: Observable, event: Event): void {
        // element
        if (observable instanceof ObjectElement) {
            let property = observable.getProperty();
            let value = observable.getValue();
            if(this.checkListener(this.propertyChangingListener, event)){
                this.setValue(property, value);
                this.checkListener(this.propertyChangedListener, event);
            }
        }
        // notify
        this.notifyObservers(event);
    }

    /**
     * Gets specified property value
     * @param property property
     */
    getValue(property: string): any {
        property = property.replace('.','?.');
        return new Function(`return this.${property};`).call(this.getTarget());
    }

    /**
     * Sets specified property value
     * @param property property
     * @param value value
     */
    setValue(property: string, value: any): void {
        new Function('value', `this.${property} = value;`).call(this.getTarget(), value);
    }

    /**
     * Sets focus on property element
     * @param property
     */
    focus(property: string) {
        this.observers.forEach(observer => {
            if(observer instanceof ObjectElement) {
                if(observer.getProperty() === property) {
                    if(observer.focus()) {
                        return false;
                    }
                }
            }
        });
    }

}