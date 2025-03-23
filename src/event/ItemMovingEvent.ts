import {Event} from "./Event";

/**
 * Item Moving Event
 */
export class ItemMovingEvent extends Event {

    fromIndex: number;

    toIndex: number;

    /**
     * Constructor
     * @param element element
     * @param data data
     * @param fromIndex from index
     * @param toIndex to index
     */
    constructor(element: HTMLElement, data: object[], fromIndex: number, toIndex: number){
        super(element, data);
        this.fromIndex = fromIndex;
        this.toIndex = toIndex;
    }

    /**
     * Gets from index
     */
    getFromIndex(): number {
        return this.fromIndex;
    }

    /**
     * Gets to index
     */
    getToIndex(): number {
        return this.toIndex;
    }

}