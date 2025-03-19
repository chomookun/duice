import {ObjectElementFactory} from "../ObjectElementFactory";
import {ElementRegistry} from "../ElementRegistry";
import {ImgElement} from "./ImgElement";

/**
 * Img Element Factory
 */
export class ImgElementFactory extends ObjectElementFactory<HTMLImageElement> {

    /**
     * Static block
     */
    static {
        // register factory instance
        ElementRegistry.register('img', new ImgElementFactory());
    }

    /**
     * Creates element
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     */
    override createElement(htmlElement: HTMLImageElement, bindData: object, context: object): ImgElement {
        return new ImgElement(htmlElement, bindData, context);
    }

}
