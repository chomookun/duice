import {ObjectElement} from "../ObjectElement";
import {PropertyChangeEvent} from "../event/PropertyChangeEvent";

export class TextareaElement extends ObjectElement<HTMLTextAreaElement> {

    constructor(element: HTMLTextAreaElement, bindData: object, context: object) {
        super(element, bindData, context);

        // adds change event listener
        this.getHtmlElement().addEventListener('change', e => {
            let event = new PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
            this.notifyObservers(event);
        }, true);
    }

    override setValue(value: any): void {
        if(value != null) {
            this.getHtmlElement().value = value;
        }else{
            this.getHtmlElement().value = '';
        }
    }

    override getValue(): any {
        let value = this.getHtmlElement().value;
        if(value != null && value.length > 0) {
            return value;
        }else{
            return null;
        }
    }

    override setReadonly(readonly: boolean): void {
        if(readonly){
            this.getHtmlElement().setAttribute('readonly', 'readonly');
        }else {
            this.getHtmlElement().removeAttribute('readonly');
        }
    }

    override setDisable(disable: boolean): void {
        if(disable) {
            this.getHtmlElement().setAttribute('disabled', 'disabled');
        }else{
            this.getHtmlElement().removeAttribute('disabled');
        }
    }

}
