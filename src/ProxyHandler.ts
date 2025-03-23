import {Observable} from "./Observable";
import {Observer} from "./Observer";
import {Event} from "./event/Event";
import {EventDispatcher} from "./event/EventDispatcher";
import {EventType} from "./event/EventType";
import {DisabledAttribute} from "./attribute/DisabledAttribute";
import {ReadonlyAttribute} from "./attribute/ReadonlyAttribute";

/**
 * Proxy Handler
 */
export abstract class ProxyHandler<T> extends Observable implements Observer {

    target: T;

    parent: ProxyHandler<any>;

    readonlyAll: boolean = false;

    readonly: Set<string> = new Set<string>();

    disableAll: boolean = false;

    disable: Set<string> = new Set<string>();

    disabledAttribute: DisabledAttribute;

    readonlyAttribute: ReadonlyAttribute;

    eventEnabled: boolean = true;

    eventDispatcher: EventDispatcher = new EventDispatcher();

    /**
     * Constructor
     * @protected
     */
    protected constructor(target: T, parent?: ProxyHandler<any>) {
        super();
        this.target = target;
        this.parent = parent;
        this.disabledAttribute = new DisabledAttribute(parent?.disabledAttribute??null);
        this.readonlyAttribute = new ReadonlyAttribute(parent?.readonlyAttribute??null);
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
        this.readonlyAttribute.setReadonlyAll(readonly);
        this.notifyObservers();
        // this.readonlyAll = readonly;
        // if(!readonly){
        //     this.readonly.clear();
        // }
        // this.notifyObservers(null);
    }

    /**
     * Returns readonly all
     */
    isReadonlyAll(): boolean {
        return this.readonlyAttribute.isReadonlyAll();
        // return this.readonlyAll;
    }

    /**
     * Sets readonly
     * @param property property
     * @param readonly readonly or not
     */
    setReadonly(property: string, readonly: boolean): void {
        this.readonlyAttribute.setReadonly(property, readonly);
        this.notifyObservers();
        // if(readonly){
        //     this.readonly.add(property);
        // }else{
        //     this.readonly.delete(property);
        // }
        // this.notifyObservers(null);
    }

    /**
     * Returns whether property is readonly
     * @param property property
     */
    isReadonly(property: string): boolean {
        return this.readonlyAttribute.isReadonly(property);
        // return this.readonlyAll || this.readonly.has(property);
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
        this.notifyObservers(null);
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
        this.notifyObservers(null);
    }

    /**
     * Returns whether property is disabled
     * @param property property
     */
    isDisable(property: string): boolean {
        return this.disableAll || this.disable.has(property);
    }

    setDisabledAll(disabledAll: boolean): void {
        this.disabledAttribute.setDisabledAll(disabledAll);
        this.notifyObservers();
    }

    isDisabledAll(): boolean {
        return this.disabledAttribute.isDisabledAll();
    }

    setDisabled(property: string, disabled: boolean): void {
        this.disabledAttribute.setDisabled(property, disabled);
        this.notifyObservers();
    }

    isDisabled(property: string): boolean {
        return this.disabledAttribute.isDisabled(property);
    }

    /**
     * Adds event listener
     * @param eventType event type
     * @param eventListener event listener
     */
    addEventListener(eventType: EventType, eventListener: Function): void {
        this.eventDispatcher.addEventListener(eventType, eventListener);
    }

    /**
     * Removes event listener
     * @param eventType event type
     * @param eventListener event listener
     */
    removeEventListener(eventType: EventType, eventListener: Function): void {
        this.eventDispatcher.removeEventListener(eventType, eventListener);
    }

    /**
     * Clears event listeners
     * @param eventType event type
     */
    clearEventListeners(eventType: EventType): void {
        this.eventDispatcher.clearEventListeners(eventType);
    }

    /**
     * Suspends event
     */
    suspendEvent(): void {
        this.eventEnabled = false;
    }

    /**
     * Resumes event listener
     */
    resumeEvent(): void {
        this.eventEnabled = true;
    }

    /**
     * Calls event listeners
     * @param event
     */
    async dispatchEventListeners(event: Event): Promise<boolean> {
        if (!this.eventEnabled) {
            return null;
        }
        return this.eventDispatcher.dispatchEventListeners(event).then(results => {
            if (results != null && results.length > 0) {
                return !results.some(result => result === false);
            } else {
                return null;
            }
        });
    }

}