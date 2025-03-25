import {Event} from "./Event";
import {EventType} from "./EventType";

/**
 * Event Dispatcher
 */
export class EventDispatcher {

    parent: EventDispatcher;

    eventListeners: Map<EventType, Function[]> = new Map();

    /**
     * Sets parent
     * @param parent parent
     */
    setParent(parent: EventDispatcher): void {
        this.parent = parent;
    }

    /**
     * Gets parent
     */
    getParent(): EventDispatcher {
        return this.parent;
    }

    /**
     * Adds event listener
     * @param eventType event type
     * @param eventListener event listener
     */
    addEventListener(eventType: EventType, eventListener: Function): void {
        let listeners = this.eventListeners.get(eventType);
        if (!listeners) {
            listeners = [];
            this.eventListeners.set(eventType, listeners);
        }
        listeners.push(eventListener);
    }

    /**
     * Removes event listener
     * @param eventType event type
     * @param eventListener event listener
     */
    removeEventListener(eventType: EventType, eventListener: Function): void {
        let listeners = this.eventListeners.get(eventType);
        if (listeners) {
            let index = listeners.indexOf(eventListener);
            if (index >= 0) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Clears event listeners
     * @param eventType event type
     */
    clearEventListeners(eventType: EventType): void {
        this.eventListeners.delete(eventType);
    }

    /**
     * Dispatches event listeners
     * @param event event
     */
    async dispatchEventListeners(event: Event): Promise<any> {
        let listeners = this.eventListeners.get(event.constructor as EventType);
        let results = [];
        if (listeners) {
            for (let listener of listeners) {
                results.push(await listener.call(this, event));
            }
        }
        // calls parent
        if (this.parent) {
            let parentResults = await this.parent.dispatchEventListeners(event);
            results = results.concat(parentResults);
        }
        // returns results
        return results;
    }

}