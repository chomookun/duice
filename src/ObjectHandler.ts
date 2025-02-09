import {DataHandler} from "./DataHandler";
import {ObjectElement} from "./ObjectElement";
import {Observable} from "./Observable";
import {PropertyChangeEvent} from "./event/PropertyChangeEvent";
import {DataEvent} from "./event/DataEvent";

export class ObjectHandler extends DataHandler<object> {

    propertyChangingListener: Function;

    propertyChangedListener: Function;

    constructor() {
        super();
    }

    get(target: object, property: string, receiver: object): any {
        return Reflect.get(target, property, receiver);
    }

    set(target: object, property: string, value: any) {

        // change value
        Reflect.set(target, property, value);

        // notify
        let event = new PropertyChangeEvent(this, property, value);
        this.notifyObservers(event);

        // returns
        return true;
    }

    update(observable: Observable, event: DataEvent): void {
        console.debug("ObjectHandler.update", observable, event);

        // Element
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

    getValue(property: string): any {
        property = property.replace('.','?.');
        return new Function(`return this.${property};`).call(this.getTarget());
    }

    setValue(property: string, value: any): void {
        new Function('value', `this.${property} = value;`).call(this.getTarget(), value);
    }

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