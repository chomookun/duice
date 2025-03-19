import {Element} from "./Element";

/**
 * Element factory
 */
export abstract class ElementFactory<T extends HTMLElement, V> {

    /**
     * Creates element
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     */
    abstract createElement(htmlElement: T, bindData: V, context: object): Element<HTMLElement, V>;

}
