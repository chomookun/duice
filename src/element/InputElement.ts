import {ObjectElement} from "../ObjectElement";
import {PropertyChangingEvent} from "../event/PropertyChangingEvent";
import {getProxyHandler, getProxyTarget} from "../common";

/**
 * Input Element
 */
export class InputElement extends ObjectElement<HTMLInputElement> {

    /**
     * Constructor
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     */
    constructor(htmlElement: HTMLInputElement, bindData: object, context: object) {
        super(htmlElement, bindData, context);
        // Adds change event listener
        this.getHtmlElement().addEventListener('change', e => {
            let element = this.getHtmlElement();
            let data = getProxyTarget(this.getBindData());
            let propertyChangingEvent = new PropertyChangingEvent(element, data, this.getProperty(), this.getValue(), this.getIndex());
            this.notifyObservers(propertyChangingEvent);
        }, true);
        // turn off autocomplete
        this.getHtmlElement().setAttribute('autocomplete','off');
    }

    /**
     * Sets element value
     * @param value element value
     */
    override setValue(value: any): void {
        if(value != null) {
            value = this.getFormat() ? this.getFormat().format(value) : value;
        }else{
            value = '';
        }
        this.getHtmlElement().value = value;
    }

    /**
     * Gets element value
     */
    override getValue(): any {
        let value = this.getHtmlElement().value;
        if(value){
            value = this.getFormat() ? this.getFormat().parse(value) : value;
        }else{
            value = null;
        }
        return value;
    }

    /**
     * Sets readonly
     * @param readonly readonly or not
     */
    override setReadonly(readonly: boolean): void {
        this.getHtmlElement().readOnly = readonly;
    }

    /**
     * Sets disabled
     * @param disabled disabled or not
     */
    override setDisabled(disabled: boolean): void {
        if(disabled) {
            this.getHtmlElement().setAttribute('disabled', 'disabled');
        }else{
            this.getHtmlElement().removeAttribute('disabled');
        }
    }

    /**
     * Focus element
     */
    override focus(): boolean {
        this.getHtmlElement().focus();
        return true;
    }

}
