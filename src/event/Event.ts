/**
 * Event
 */
export class Event {

    element: HTMLElement;

    data: object | object[];

    constructor(element: HTMLElement, data: object | object[]) {
        this.element = element;
        this.data = data;
    }

    getElement(): HTMLElement {
        return this.element;
    }

    getData(): object | object[] {
        return this.data;
    }

}
