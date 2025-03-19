import {
    findVariable,
    getElementAttribute,
    getElementQuerySelector,
    hasElementAttribute,
    setElementAttribute
} from "./common";
import {ElementRegistry} from "./ElementRegistry";

/**
 * Initializer
 */
export class Initializer {

    /**
     * Initialize the container with the context
     * @param container container
     * @param context context
     * @param index index (optional)
     */
    static initialize(container: HTMLElement, context: object, index?: number): void {
        // scan DOM tree
        container.querySelectorAll(getElementQuerySelector()).forEach(element => {
            if (element instanceof HTMLElement) {
                const htmlElement = element as HTMLElement;
                if(!hasElementAttribute(htmlElement, 'id')) {
                    try {
                        let bindName = getElementAttribute(htmlElement, 'bind');
                        let bindData = findVariable(context, bindName);
                        ElementRegistry.getFactory(htmlElement, bindData, context)
                            ?.createElement(htmlElement, bindData, context)
                            ?.render();
                        // index
                        if(index !== undefined) {
                            setElementAttribute(htmlElement, "index", index.toString());
                        }
                    }catch(e){
                        console.error(e, htmlElement, container, JSON.stringify(context));
                    }
                }
            }
        });
    }

}