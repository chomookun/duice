import {InputElement} from "./InputElement";
import {DateFormat} from "../format/DateFormat";

/**
 * Input Datetime Local Element
 */
export class InputDatetimeLocalElement extends InputElement {

    dateFormat: DateFormat = new DateFormat('yyyy-MM-ddTHH:mm');

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
     * @param value
     */
    override setValue(value: string): void {
        if(value) {
            this.getHtmlElement().value = this.dateFormat.format(value);
        }else{
            this.getHtmlElement().value = '';
        }
    }

    /**
     * Gets element value
     */
    override getValue(): any {
        let value = this.getHtmlElement().value;
        if(value) {
            return new Date(value).toISOString();
        }else{
            return null;
        }
    }

}
