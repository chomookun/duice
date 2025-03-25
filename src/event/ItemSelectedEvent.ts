import {Event} from "./Event";

/**
 * Item Selected Event
 */
export class ItemSelectedEvent extends Event {

    index: number;

    /**
     * Constructor
     * @param element element
     * @param data data
     * @param index index (optional)
     */
    constructor(element: HTMLElement, data: any, index: number){
        super(element, data);
        this.index = index;
    }

    /**
     * Gets index
     */
    getIndex(): number {
        return this.index;
    }

}