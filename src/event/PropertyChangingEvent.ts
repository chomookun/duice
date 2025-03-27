import {Event} from "./Event";

/**
 * Property Change Event
 */
export class PropertyChangingEvent extends Event {

    property: string;

    value: any;

    index: number;

    /**
     * Constructor
     * @param element element
     * @param data data
     * @param property property
     * @param value value
     * @param index index (optional)
     */
    constructor(element: HTMLElement, data: object, property: string, value: any, index?: number){
        super(element, data);
        this.property = property;
        this.value = value;
        this.index = index;
    }

    /**
     * Gets property name
     */
    getProperty(): string {
        return this.property;
    }

    /**
     * Gets property value
     */
    getValue(): any {
        return this.value;
    }

    /**
     * Gets index in array if object is in array
     */
    getIndex(): number {
        return this.index;
    }

}