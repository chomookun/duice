import {ElementFactory} from "./ElementFactory";
import {ObjectElement} from "./ObjectElement";

/**
 * Object Element Factory
 */
export class ObjectElementFactory<T extends HTMLElement> extends ElementFactory<T, object> {

    /**
     * Creates element
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     */
    override createElement(htmlElement: T, bindData: object, context: object): ObjectElement<T> {
        return new ObjectElement(htmlElement, bindData, context);
    }

}