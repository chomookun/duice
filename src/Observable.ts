import {Event} from "./event/Event";
import {Observer} from "./Observer";

/**
 * Observable
 */
export class Observable {

    observers: Observer[] = [];

    notifyEnabled: boolean = true;

    /**
     * Adds observer
     * @param observer observer
     */
    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    /**
     * Removes observer
     * @param observer observer
     */
    removeObserver(observer: Observer): void {
        for(let i = 0, size = this.observers.length; i < size; i++){
            if(this.observers[i] === observer){
                this.observers.splice(i,1);
                return;
            }
        }
    }

    /**
     * Suspends notify
     */
    suspendNotify(): void {
        this.notifyEnabled = false;
    }

    /**
     * Resumes notify
     */
    resumeNotify(): void {
        this.notifyEnabled = true;
    }

    /**
     * Notifies to observers
     * @param event event
     */
    notifyObservers(event: Event): void {
        if(this.notifyEnabled){
            this.observers.forEach(observer => {
                observer.update(this, event);
            });
        }
    }

}
