import {Event} from "./Event";

export class ItemInsertEvent extends Event {

    index: number;

    items: object[] = [];

    constructor(source: any, index: number, items: object[]){
        super(source);
        this.index = index;
        this.items = items;
    }

    getIndex(): number {
        return this.index;
    }

    getItems(): object[] {
        return this.items;
    }

}