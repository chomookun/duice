import {Event} from "./Event";

/**
 * Property Change Event
 */
export class PropertyChangeEvent extends Event {

    property: string;

    value: any;

    index: number;

    /**
     * Constructor
     * @param source source
     * @param property property
     * @param value value
     * @param index index (optional)
     */
    constructor(source: any, property: string, value: any, index?: number){
        super(source);
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