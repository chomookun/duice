/**
 * Event
 */
export class Event {

    element: HTMLElement;

    data: any;

    /**
     * Constructor
     * @param element html element
     * @param data data
     */
    constructor(element: HTMLElement, data: any) {
        this.element = element;
        this.data = data;
    }

    /**
     * Gets element
     */
    getElement(): HTMLElement {
        return this.element;
    }

    /**
     * Gets data
     */
    getData(): any {
        return this.data;
    }

}
