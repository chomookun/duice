import {ArrayElementFactory} from "./ArrayElementFactory";
import {ElementFactory} from "./ElementFactory";
import {CustomElementFactory} from "./CustomElementFactory";
import {ObjectElementFactory} from "./ObjectElementFactory";

/**
 * Element Registry
 */
export class ElementRegistry {

    static defaultObjectElementFactory = new ObjectElementFactory();

    static defaultArrayElementFactory = new ArrayElementFactory();

    static objectElementFactories = new Map<string, ObjectElementFactory<HTMLElement>>();

    static arrayElementFactories = new Map<string, ArrayElementFactory<HTMLElement>>();

    static customElementFactories = new Map<string, CustomElementFactory<any>>();

    /**
     * Registers element factory
     * @param tagName tag name
     * @param elementFactory element factory
     */
    static register(tagName: string, elementFactory: ElementFactory<HTMLElement, any>) {
        if(elementFactory instanceof ArrayElementFactory) {
            this.arrayElementFactories.set(tagName, elementFactory);
        }else if(elementFactory instanceof ObjectElementFactory) {
            this.objectElementFactories.set(tagName, elementFactory);
        }else if(elementFactory instanceof CustomElementFactory) {
            this.customElementFactories.set(tagName, elementFactory);
        }
        // register custom html element
        if(tagName.includes('-')) {
            globalThis.customElements.define(tagName, class extends HTMLElement {});
        }
    }

    /**
     * Gets factory
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     */
    static getFactory(htmlElement: HTMLElement, bindData: any, context: object): ElementFactory<HTMLElement, any> {
        let tagName = htmlElement.tagName.toLowerCase();
        // custom element
        if(this.customElementFactories.has(tagName)) {
            return this.customElementFactories.get(tagName);
        }
        // array element
        if(Array.isArray(bindData)) {
            if(this.arrayElementFactories.has(tagName)) {
                return this.arrayElementFactories.get(tagName);
            }
            return this.defaultArrayElementFactory;
        }
        // object element
        else{
            if(this.objectElementFactories.has(tagName)) {
                return this.objectElementFactories.get(tagName);
            }
            return this.defaultObjectElementFactory;
        }
    }

}