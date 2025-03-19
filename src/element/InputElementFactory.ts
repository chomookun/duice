import {ObjectElementFactory} from "../ObjectElementFactory";
import {InputElement} from "./InputElement";
import {InputNumberElement} from "./InputNumberElement";
import {InputCheckboxElement} from "./InputCheckboxElement";
import {InputDatetimeLocalElement} from "./InputDatetimeLocalElement";
import {ElementRegistry} from "../ElementRegistry";
import {InputRadioElement} from "./InputRadioElement";

/**
 * Input Element Factory
 */
export class InputElementFactory extends ObjectElementFactory<HTMLInputElement> {

    /**
     * Static block
     */
    static {
        // register factory instance
        ElementRegistry.register('input', new InputElementFactory());
    }

    /**
     * Creates element
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     */
    override createElement(htmlElement: HTMLInputElement, bindData: object, context: object): InputElement {
        let type = htmlElement.getAttribute('type');
        switch(type) {
            case 'number':
                return new InputNumberElement(htmlElement, bindData, context);
            case 'checkbox':
                return new InputCheckboxElement(htmlElement, bindData, context);
            case 'radio':
                return new InputRadioElement(htmlElement, bindData, context);
            case 'datetime-local':
                return new InputDatetimeLocalElement(htmlElement, bindData, context);
            default:
                return new InputElement(htmlElement, bindData, context);
        }
    }

}

