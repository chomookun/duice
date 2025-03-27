import {debug, getElementAttribute} from "../common";
import {InputElement} from "./InputElement";
import {read} from "node:fs";

/**
 * Input Range Element
 */
export class InputRangeElement extends InputElement {

    trueValue: any = true;

    falseValue: any = false;

    /**
     * Constructor
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     */
    constructor(htmlElement: HTMLInputElement, bindData: object, context: object) {
        super(htmlElement, bindData, context);
    }

    /**
     * Sets readonly
     * @param readonly readonly or not
     */
    override setReadonly(readonly: boolean): void {
        debug('InputRangeElement.setReadonly', readonly);
        this.getHtmlElement().readOnly = readonly;
        if (readonly) {
            this.getHtmlElement().addEventListener('mousedown', this.disableEvent);
            this.getHtmlElement().addEventListener('touchstart', this.disableEvent);
        } else {
            this.getHtmlElement().removeEventListener('mousedown', this.disableEvent);
            this.getHtmlElement().removeEventListener('touchstart', this.disableEvent);
        }
    }

    /**
     * Disable event
     * @param event event
     */
    disableEvent(event: globalThis.Event): boolean {
        event.preventDefault();
        return false;
    }

}
