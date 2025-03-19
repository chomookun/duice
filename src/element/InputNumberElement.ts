import {InputElement} from "./InputElement";

/**
 * Input Number Element
 */
export class InputNumberElement extends InputElement {

    /**
     * Constructor
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     */
    constructor(htmlElement: HTMLInputElement, bindData: object, context: object) {
        super(htmlElement, bindData, context);
        // changes type and style
        this.getHtmlElement().setAttribute('type', 'text');
        this.getHtmlElement().style.textAlign = 'right';
        // prevents invalid key press
        this.getHtmlElement().addEventListener('keypress', event => {
            if(/[\d|\.|,]/.test(event.key) === false) {
                event.preventDefault();
            }
        });
    }

    /**
     * Gets element value
     */
    override getValue(): any {
        let value = super.getValue();
        return Number(value);
    }

}
