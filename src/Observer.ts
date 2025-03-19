import {Event} from "./event/Event";
import {Observable} from "./Observable";

/**
 * Observer interface
 */
export interface Observer {

    /**
     * Updates observer
     * @param observable observable
     * @param event event
     */
    update(observable: Observable, event: Event): void;

}