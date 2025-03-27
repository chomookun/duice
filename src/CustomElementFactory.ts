import {ElementFactory} from "./ElementFactory";
import {CustomElement} from "./CustomElement";

/**
 * Custom Element Factory
 */
export abstract class CustomElementFactory<V extends object> extends ElementFactory<HTMLElement, V> {

    /**
     * Creates element
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     */
    override createElement(htmlElement: HTMLElement, bindData: V, context: object): CustomElement<V> {
        return this.doCreateElement(htmlElement, bindData, context);
    }

    /**
     * Do create element
     * @param htmlElement html element
     * @param bindData bind data
     * @param context conntext
     */
    abstract doCreateElement(htmlElement: HTMLElement, bindData: V, context: object): CustomElement<V>;

}
