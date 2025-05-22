import {ObjectElement} from "../ObjectElement";
import {PropertyChangingEvent} from "../event/PropertyChangingEvent";
import {getProxyHandler, getProxyTarget} from "../common";

/**
 * Input Element
 */
export class InputElement extends ObjectElement<HTMLInputElement> {

    readonly: boolean = false;

    disabled: boolean = false;

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
        this.readonly = readonly;
        this.getHtmlElement().readOnly = readonly;

        // exceptional type (mobile browser does not support readonly)
        let type: string = this.getHtmlElement().getAttribute('type');
        if (['datetime-local', 'date', 'time'].includes(type)) {
            if (this.readonly || this.disabled) {
                this.getHtmlElement().setAttribute('disabled', 'disabled');
            }
        }
    }

    /**
     * Sets disabled
     * @param disabled disabled or not
     */
    override setDisabled(disabled: boolean): void {
        this.disabled = disabled;
        if(disabled) {
            this.getHtmlElement().setAttribute('disabled', 'disabled');
        }else{
            this.getHtmlElement().removeAttribute('disabled');
        }

        // exceptional type (mobile browser does not support readonly)
        let type: string = this.getHtmlElement().getAttribute('type');
        if (['datetime-local', 'date', 'time'].includes(type)) {
            if (this.disabled || this.readonly) {
                this.getHtmlElement().setAttribute('disabled', 'disabled');
            }
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
