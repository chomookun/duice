import {Observable} from "./Observable";
import {Observer} from "./Observer";
import {Event} from "./event/Event";

/**
 * Proxy Handler
 */
export abstract class ProxyHandler<T> extends Observable implements Observer {

    target: T;

    readonlyAll: boolean = false;

    readonly: Set<string> = new Set<string>();

    disableAll: boolean = false;

    disable: Set<string> = new Set<string>();

    listenerEnabled: boolean = true;

    /**
     * Constructor
     * @protected
     */
    protected constructor() {
        super();
    }

    /**
     * Sets target
     * @param target
     */
    setTarget(target: T): void {
        this.target = target;
    }

    /**
     * Gets target
     */
    getTarget(): T {
        return this.target;
    }

    /**
     * Updates
     * @param observable
     * @param event
     */
    abstract update(observable: Observable, event: Event): void;

    /**
     * Sets readonly all
     * @param readonly readonly all
     */
    setReadonlyAll(readonly: boolean): void {
        this.readonlyAll = readonly;
        if(!readonly){
            this.readonly.clear();
        }
        this.notifyObservers(new Event(this));
    }

    /**
     * Returns readonly all
     */
    isReadonlyAll(): boolean {
        return this.readonlyAll;
    }

    /**
     * Sets readonly
     * @param property property
     * @param readonly readonly or not
     */
    setReadonly(property: string, readonly: boolean): void {
        if(readonly){
            this.readonly.add(property);
        }else{
            this.readonly.delete(property);
        }
        this.notifyObservers(new Event(this));
    }

    /**
     * Returns whether property is readonly
     * @param property property
     */
    isReadonly(property: string): boolean {
        return this.readonlyAll || this.readonly.has(property);
    }

    /**
     * Sets disable all
     * @param disable
     */
    setDisableAll(disable: boolean): void {
        this.disableAll = disable;
        if(!disable) {
            this.disable.clear();
        }
        this.notifyObservers(new Event(this));
    }

    /**
     * Returns whether all properties are disabled
     */
    isDisableAll(): boolean {
        return this.disableAll;
    }

    /**
     * Sets disable
     * @param property property
     * @param disable disable or not
     */
    setDisable(property: string, disable: boolean): void {
        if(disable) {
            this.disable.add(property);
        }else{
            this.disable.delete(property);
        }
        this.notifyObservers(new Event(this));
    }

    /**
     * Returns whether property is disabled
     * @param property property
     */
    isDisable(property: string): boolean {
        return this.disableAll || this.disable.has(property);
    }

    /**
     * Subscribes to property changing
     */
    suspendListener(): void {
        this.listenerEnabled = false;
    }

    /**
     * Resumes to property changing
     */
    resumeListener(): void {
        this.listenerEnabled = true;
    }

    /**
     * Checks listener
     * @param listener listener
     * @param event event
     */
    checkListener(listener: Function, event: Event): boolean {
        if(this.listenerEnabled && listener){
            let result = listener.call(this.getTarget(), event);
            if(result == false){
                return false;
            }
        }
        return true;
    }

}