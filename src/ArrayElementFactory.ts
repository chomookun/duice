import {ElementFactory} from "./ElementFactory";
import {ArrayElement} from "./ArrayElement";

/**
 * Array Element Factory
 */
export class ArrayElementFactory<T extends HTMLElement> extends ElementFactory<HTMLElement, object[]> {

    /**
     * Creates element
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     */
    override createElement(htmlElement: T, bindData: object[], context: object): ArrayElement<T> {
        return new ArrayElement(htmlElement, bindData, context);
    }

}
