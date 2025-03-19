import {ObjectElementFactory} from "../ObjectElementFactory";
import {TextareaElement} from "./TextareaElement";
import {ElementRegistry} from "../ElementRegistry";

/**
 * Textarea Element Factory
 */
export class TextareaElementFactory extends ObjectElementFactory<HTMLTextAreaElement> {

    /**
     * Static block
     */
    static {
        // register
        ElementRegistry.register('textarea', new TextareaElementFactory());
    }

    /**
     * Creates element
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     */
    override createElement(htmlElement: HTMLTextAreaElement, bindData: object, context: object): TextareaElement {
        return new TextareaElement(htmlElement, bindData, context);
    }

}
