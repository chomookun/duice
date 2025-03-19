import {ObjectElement} from "../ObjectElement";
import {findVariable, getElementAttribute} from "../common";
import {Observable} from "../Observable";
import {Event} from "../event/Event";
import {PropertyChangeEvent} from "../event/PropertyChangeEvent";
import {ArrayProxy} from "../ArrayProxy";

/**
 * Select Element
 */
export class SelectElement extends ObjectElement<HTMLSelectElement> {

    option: object[];

    optionValueProperty: string;

    optionTextProperty: string;

    defaultOptions: HTMLOptionElement[] = [];

    /**
     * Constructor
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     */
    constructor(htmlElement: HTMLSelectElement, bindData: object, context: object){
        super(htmlElement, bindData, context);
        // checks if
        if (!this.checkIf()) {
            return;
        }
        // adds event listener
        this.getHtmlElement().addEventListener('change', () => {
            let event = new PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
            this.notifyObservers(event);
        }, true);
        // stores default option
        for(let i = 0; i < this.getHtmlElement().options.length; i ++){
            this.defaultOptions.push(this.getHtmlElement().options[i])
        }
        // option property
        let optionName = getElementAttribute(this.getHtmlElement(),'option');
        if(optionName) {
            this.option = findVariable(this.getContext(), optionName);
            this.optionValueProperty = getElementAttribute(this.getHtmlElement(), 'option-value-property');
            this.optionTextProperty = getElementAttribute(this.getHtmlElement(), 'option-text-property');
            ArrayProxy.getProxyHandler(this.option).addObserver(this);
            this.updateOptions();
        }
    }

    /**
     * Updates options
     */
    updateOptions(): void {
        let value = this.getHtmlElement().value;
        this.getHtmlElement().innerHTML = '';
        this.defaultOptions.forEach(defaultOption => {
            this.getHtmlElement().appendChild(defaultOption);
        });
        this.option.forEach(data => {
            let option = document.createElement('option');
            option.value = data[this.optionValueProperty];
            option.appendChild(document.createTextNode(data[this.optionTextProperty]));
            this.getHtmlElement().appendChild(option);
        });
        this.getHtmlElement().value = value;
    }

    /**
     * Overrides update
     * @param observable observable
     * @param event event
     */
    override update(observable: Observable, event: Event): void {
        super.update(observable, event);
        // checks if
        if (!this.checkIf()) {
            return;
        }
        if(this.option) {
            this.updateOptions();
        }
    }

    /**
     * Sets element value
     * @param value value
     */
    override setValue(value: any): void {
        this.getHtmlElement().value = value;
        // force select option
        if(!value) {
            for(let i = 0; i < this.getHtmlElement().options.length; i++){
                let option = this.getHtmlElement().options[i];
                if(!option.nodeValue){
                    option.selected = true;
                    break;
                }
            }
        }
    }

    /**
     * Gets element value
     */
    override getValue(): any {
        let value = this.getHtmlElement().value;
        if(!value || value.trim().length < 1) {
            value = null;
        }
        return value;
    }

    /**
     * Sets readonly
     * @param readonly readonly or not
     */
    override setReadonly(readonly: boolean): void {
        if(readonly){
            this.getHtmlElement().style.pointerEvents = 'none';
        }else{
            this.getHtmlElement().style.pointerEvents = '';
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
