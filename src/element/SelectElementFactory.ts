import {ObjectElementFactory} from "../ObjectElementFactory";
import {SelectElement} from "./SelectElement";
import {ElementRegistry} from "../ElementRegistry";

/**
 * Select Element Factory
 */
export class SelectElementFactory extends ObjectElementFactory<HTMLSelectElement> {

    /**
     * Static block
     */
    static {
        // register factory instance
        ElementRegistry.register('select', new SelectElementFactory());
    }

    /**
     * Creates element
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     */
    override createElement(htmlElement: HTMLSelectElement, bindData: object, context: object): SelectElement {
        return new SelectElement(htmlElement, bindData, context);
    }

}
