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
            const input = this.getHtmlElement();
            const key = event.key;
            // allows minus sign only at the first position
            if (key === '-') {
                if (input.selectionStart !== 0) {
                    event.preventDefault();
                }
                return;
            }
            // blocks characters other than digits, dots, and commas
            if (/[\d.,]/.test(key) === false) {
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
