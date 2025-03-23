import {ObjectElement} from "../ObjectElement";
import {PropertyChangingEvent} from "../event/PropertyChangingEvent";
import {getProxyTarget} from "../common";

/**
 * Textarea Element
 */
export class TextareaElement extends ObjectElement<HTMLTextAreaElement> {

    /**
     * Constructor
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     */
    constructor(htmlElement: HTMLTextAreaElement, bindData: object, context: object) {
        super(htmlElement, bindData, context);
        // adds change event listener
        this.getHtmlElement().addEventListener('change', e => {
            let element = this.getHtmlElement();
            let data = getProxyTarget(this.getBindData());
            let propertyChangingEvent = new PropertyChangingEvent(element, data, this.getProperty(), this.getValue(), this.getIndex());
            this.notifyObservers(propertyChangingEvent);
        }, true);
    }

    /**
     * Sets element value
     * @param value property value
     */
    override setValue(value: any): void {
        if(value != null) {
            this.getHtmlElement().value = value;
        }else{
            this.getHtmlElement().value = '';
        }
    }

    /**
     * Gets element value
     */
    override getValue(): any {
        let value = this.getHtmlElement().value;
        if(value != null && value.length > 0) {
            return value;
        }else{
            return null;
        }
    }

    /**
     * Sets readonly
     * @param readonly readonly or not
     */
    override setReadonly(readonly: boolean): void {
        if(readonly){
            this.getHtmlElement().setAttribute('readonly', 'readonly');
        }else {
            this.getHtmlElement().removeAttribute('readonly');
        }
    }

    /**
     * Sets disable
     * @param disable disable or not
     */
    override setDisable(disable: boolean): void {
        if(disable) {
            this.getHtmlElement().setAttribute('disabled', 'disabled');
        }else{
            this.getHtmlElement().removeAttribute('disabled');
        }
    }

}
