import {Event} from "./Event";

/**
 * Item Selecting Event
 */
export class ItemSelectingEvent extends Event {

    index: number;

    /**
     * Constructor
     * @param element element
     * @param data data
     * @param index index
     */
    constructor(element: HTMLElement, data: object[], index: number){
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