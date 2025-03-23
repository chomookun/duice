import {Event} from "./Event";
import {EventType} from "./EventType";

/**
 * Event Dispatcher
 */
export class EventDispatcher {

    eventListeners: Map<EventType, Function[]> = new Map();

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
    dispatchEventListeners(event: Event): Promise<any> {
        let listeners = this.eventListeners.get(event.constructor as EventType);
        if (listeners) {
            return Promise.all(listeners.map(listener => listener.call(this, event)));
        }
        return Promise.resolve();
    }

}