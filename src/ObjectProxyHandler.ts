import {ProxyHandler} from "./ProxyHandler";
import {ObjectElement} from "./ObjectElement";
import {Observable} from "./Observable";
import {Event} from "./event/Event";
import {PropertyChangedEvent} from "./event/PropertyChangedEvent";
import {debug} from "./common";
import {PropertyChangingEvent} from "./event/PropertyChangingEvent";
import {ArrayProxyHandler} from "./ArrayProxyHandler";

/**
 * Object Proxy Handler
 */
export class ObjectProxyHandler extends ProxyHandler<object> {

    /**
     * Constructor
     */
    constructor(object: object) {
        super(object);
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
        this.notifyObservers();
        // returns
        return true;
    }

    /**
     * Updates
     * @param observable observable
     * @param event event
     */
    update(observable: Observable, event: Event): void {
        debug('ObjectProxyHandler.update', observable, event);
        // element
        if (observable instanceof ObjectElement) {
            if (event instanceof PropertyChangingEvent) {
                this.dispatchEventListeners(event).then(result => {
                    // result is false
                    if (result === false) {
                        // rollback and return
                        observable.update(this, event);
                        return;
                    }
                    // updates property value
                    let property = observable.getProperty();
                    let value = observable.getValue();
                    this.setValue(property, value);
                    // property changed event
                    let propertyChangedEvent = new PropertyChangedEvent(event.getElement(), event.getData(), event.getProperty(), event.getValue(), event.getIndex());
                    this.notifyObservers(propertyChangedEvent);
                    this.dispatchEventListeners(propertyChangedEvent).then();
                });
            }
        }
    }

    /**
     * Gets specified property value
     * @param property property
     */
    getValue(property: string): any {
        property = property.replace(/\./g,'?.');
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

    /**
     * Overrides is readonly by property
     * @param property property
     */
    override isReadonly(property: string): boolean {
        let readonly = super.isReadonly(property);
        // parent is ArrayProxyHandler
        if (this.parent && this.parent instanceof ArrayProxyHandler) {
            if (this.parent.isReadonly(property) === true) {
                readonly = true;
            }
            if (this.parent.isReadonly(property) === false) {
                readonly = false;
            }
        }
        return readonly;
    }

    /**
     * Overrides is disabled by property
     * @param property property
     */
    override isDisabled(property: string): boolean {
        let disabled = super.isDisabled(property);
        // parent is ArrayProxyHandler
        if (this.parent && this.parent instanceof ArrayProxyHandler) {
            if (this.parent.isDisabled(property) === true) {
                disabled = true;
            }
            if (this.parent.isDisabled(property) === false) {
                disabled = false;
            }
        }
        return disabled;
    }

}