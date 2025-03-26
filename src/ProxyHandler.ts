import {Observable} from "./Observable";
import {Observer} from "./Observer";
import {Event} from "./event/Event";
import {EventDispatcher} from "./event/EventDispatcher";
import {EventType} from "./event/EventType";

/**
 * Proxy Handler
 */
export abstract class ProxyHandler<T> extends Observable implements Observer {

    target: T;

    parent: ProxyHandler<any>;

    readonlyAll: boolean;

    readonlyProperties: Map<string, boolean> = new Map<string, boolean>();

    disabledAll: boolean;

    disabledProperties: Map<string, boolean> = new Map<string, boolean>();

    eventDispatcher: EventDispatcher = new EventDispatcher();

    eventEnabled: boolean = true;

    /**
     * Constructor
     * @protected
     */
    protected constructor(target: T) {
        super();
        this.target = target;
    }

    /**
     * Sets parent
     * @param parent parent
     */
    setParent(parent: ProxyHandler<any>): void {
        this.parent = parent;
        this.addObserver(parent);
        parent.addObserver(this);
        this.eventDispatcher.setParent(parent.eventDispatcher);
    }

    /**
     * Gets parent
     */
    getParent(): ProxyHandler<any> {
        return this.parent;
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
        this.readonlyProperties.forEach((value, key) => {
            this.readonlyProperties.set(key, readonly);
        });
        this.notifyObservers();
    }

    /**
     * Returns readonly all
     */
    isReadonlyAll(): boolean {
        let readonlyAll = false;
        if (this.parent) {
            readonlyAll = (this.parent.isReadonlyAll() === true);
        }
        if (this.readonlyAll === true) {
            readonlyAll = true;
        }
        if (this.readonlyAll === false) {
            readonlyAll = false;
        }
        return readonlyAll;
    }

    /**
     * Sets readonly
     * @param property property
     * @param readonly readonly or not
     */
    setReadonly(property: string, readonly: boolean): void {
        this.readonlyProperties.set(property, readonly);
        this.notifyObservers();
    }

    /**
     * Returns whether property is readonly
     * @param property property
     */
    isReadonly(property: string): boolean {
        let readonly = false;
        readonly = (this.isReadonlyAll() === true);
        if (this.readonlyProperties.has(property)) {
            readonly = (this.readonlyProperties.get(property) === true);
        }
        // returns
        return readonly;
    }

    /**
     * Sets disabled all
     * @param disabledAll
     */
    setDisabledAll(disabledAll: boolean): void {
        this.disabledAll = disabledAll;
        this.disabledProperties.forEach((value, key) => {
            this.disabledProperties.set(key, disabledAll);
        });
        this.notifyObservers();
    }

    /**
     * Returns disabled all
     */
    isDisabledAll(): boolean {
        let disabledAll = false;
        if (this.parent) {
            disabledAll = (this.parent.isDisabledAll() === true);
        }
        if (this.disabledAll === true) {
            disabledAll = true;
        }
        if (this.disabledAll === false) {
            disabledAll = false;
        }
        return disabledAll;
    }

    /**
     * Sets disabled
     * @param property property
     * @param disabled
     */
    setDisabled(property: string, disabled: boolean): void {
        this.disabledProperties.set(property, disabled);
        this.notifyObservers();
    }

    /**
     * Returns whether property is disabled
     * @param property
     */
    isDisabled(property: string): boolean {
        let disabled = false;
        disabled = (this.isDisabledAll() === true);
        // check property is disabled
        if (this.disabledProperties.has(property)) {
            disabled = (this.disabledProperties.get(property) === true);
        }
        // returns
        return disabled;
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