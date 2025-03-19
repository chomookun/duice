import {Event} from "./Event";

export class ItemDeleteEvent extends Event {

    index: number;

    items: object[] = [];

    /**
     * Constructor
     * @param source source
     * @param index deleted item index
     * @param items delete items
     */
    constructor(source: any, index: number, items: object[]){
        super(source);
        this.index = index;
        this.items = items;
    }

    /**
     * Gets deleted item index
     */
    getIndex(): number {
        return this.index;
    }

    /**
     * Gets deleted items
     */
    getItems(): object[] {
        return this.items;
    }

}