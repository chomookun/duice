import {Observable} from "./Observable";
import {Observer} from "./Observer";
import {DataEvent} from "./event/DataEvent";

export abstract class DataHandler<T> extends Observable implements Observer {

    target: T;

    readonlyAll: boolean = false;

    readonly: Set<string> = new Set<string>();

    disableAll: boolean = false;

    disable: Set<string> = new Set<string>();

    listenerEnabled: boolean = true;

    protected constructor() {
        super();
    }

    setTarget(target: T): void {
        this.target = target;
    }

    getTarget(): T {
        return this.target;
    }

    abstract update(observable: Observable, event: DataEvent): void;

    setReadonlyAll(readonly: boolean): void {
        this.readonlyAll = readonly;
        if(!readonly){
            this.readonly.clear();
        }
        this.notifyObservers(new DataEvent(this));
    }

    isReadonlyAll(): boolean {
        return this.readonlyAll;
    }

    setReadonly(property: string, readonly: boolean): void {
        if(readonly){
            this.readonly.add(property);
        }else{
            this.readonly.delete(property);
        }
        this.notifyObservers(new DataEvent(this));
    }

    isReadonly(property: string): boolean {
        return this.readonlyAll || this.readonly.has(property);
    }

    setDisableAll(disable: boolean): void {
        this.disableAll = disable;
        if(!disable) {
            this.disable.clear();
        }
        this.notifyObservers(new DataEvent(this));
    }

    isDisableAll(): boolean {
        return this.disableAll;
    }

    setDisable(property: string, disable: boolean): void {
        if(disable) {
            this.disable.add(property);
        }else{
            this.disable.delete(property);
        }
        this.notifyObservers(new DataEvent(this));
    }

    isDisable(property: string): boolean {
        return this.disableAll || this.disable.has(property);
    }

    suspendListener(): void {
        this.listenerEnabled = false;
    }

    resumeListener(): void {
        this.listenerEnabled = true;
    }

    checkListener(listener: Function, event: DataEvent): boolean {
        if(this.listenerEnabled && listener){
            let result = listener.call(this.getTarget(), event);
            if(result == false){
                return false;
            }
        }
        return true;
    }

}