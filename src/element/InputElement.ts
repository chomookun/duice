import {ObjectElement} from "../ObjectElement";
import {PropertyChangeEvent} from "../event/PropertyChangeEvent";

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
        // adds change listener
        this.getHtmlElement().addEventListener('change', e => {
            let event = new PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
            this.notifyObservers(event);
        }, true);
        // turn off autocomplete
        this.getHtmlElement().setAttribute('autocomplete','off');
    }

    /**
     * Gets element value
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

    /**
     * Focus element
     */
    override focus(): boolean {
        this.getHtmlElement().focus();
        return true;
    }

}
