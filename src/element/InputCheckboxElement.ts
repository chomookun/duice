import {getElementAttribute} from "../common";
import {InputElement} from "./InputElement";

/**
 * Input Checkbox Element
 */
export class InputCheckboxElement extends InputElement {

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
        // true false value
        let trueValue = getElementAttribute(this.getHtmlElement(), 'true-value');
        this.trueValue = trueValue ? trueValue : this.trueValue;
        let falseValue = getElementAttribute(this.getHtmlElement(), 'false-value');
        this.falseValue = falseValue ? falseValue : this.falseValue;
    }

    /**
     * Sets element value
     * @param value element value
     */
    override setValue(value: any): void {
        if (value === this.trueValue) {
            this.getHtmlElement().checked = true;
        } else {
            this.htmlElement.checked = false;
        }
    }

    /**
     * Gets value
     */
    override getValue(): any {
        if(this.htmlElement.checked){
            return this.trueValue;
        }else{
            return this.falseValue;
        }
    }

    /**
     * Disable click
     * @param event event
     */
    disableClick(event: globalThis.Event): void {
        event.preventDefault();
    }

    /**
     * Sets readonly
     * @param readonly readonly or not
     */
    override setReadonly(readonly: boolean): void {
        if(readonly){
            this.getHtmlElement().addEventListener('click', this.disableClick);
        }else{
            this.getHtmlElement().removeEventListener('click', this.disableClick);
        }
    }

}
