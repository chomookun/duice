import {InputElement} from "./InputElement";

/**
 * Input Radio Element
 */
export class InputRadioElement extends InputElement {

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
     * Sets element value
     * @param value element value
     */
    override setValue(value: any): void {
        this.getHtmlElement().checked = (this.getHtmlElement().value === value);
    }

    /**
     * Gets element value
     */
    override getValue(): any {
        return this.getHtmlElement().value;
    }

    /**
     * Sets readonly
     * @param readonly readonly or not
     */
    override setReadonly(readonly: boolean): void {
        if(readonly){
            this.getHtmlElement().style.pointerEvents = 'none';
        }else{
            this.getHtmlElement().style.pointerEvents = '';
        }
    }

}
