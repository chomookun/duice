import {ObjectElement} from "../ObjectElement";
import {findVariable, getElementAttribute, getProxyTarget} from "../common";
import {PropertyChangingEvent} from "../event/PropertyChangingEvent";

/**
 * Select Element
 */
export class SelectElement extends ObjectElement<HTMLSelectElement> {

    option: string;

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
        // stores default option
        for(let i = 0; i < this.getHtmlElement().options.length; i ++){
            this.defaultOptions.push(this.getHtmlElement().options[i])
        }
        // option property
        this.option = getElementAttribute(this.getHtmlElement(),'option');
        this.optionValueProperty = getElementAttribute(this.getHtmlElement(), 'option-value-property');
        this.optionTextProperty = getElementAttribute(this.getHtmlElement(), 'option-text-property');
        // adds event listener
        this.getHtmlElement().addEventListener('change', e => {
            e.stopPropagation();
            let element = this.getHtmlElement();
            let data = getProxyTarget(this.getBindData());
            let propertyChangingEvent = new PropertyChangingEvent(element, data, this.getProperty(), this.getValue(), this.getIndex());
            this.notifyObservers(propertyChangingEvent);
        }, true);
    }

    /**
     * Overrides render
     */
    override render(): void {
        this.createOptions();
        super.render();
    }

    /**
     * Updates options
     */
    createOptions(): void {
        let value = this.getHtmlElement().value;
        this.getHtmlElement().innerHTML = '';
        this.defaultOptions.forEach(defaultOption => {
            this.getHtmlElement().appendChild(defaultOption);
        });
        if (this.option) {
            let optionArray = findVariable(this.getContext(), this.option);
            if (optionArray) {
                optionArray.forEach(it => {
                    let option = document.createElement('option');
                    option.value = it[this.optionValueProperty];
                    option.appendChild(document.createTextNode(it[this.optionTextProperty]));
                    this.getHtmlElement().appendChild(option);
                });
            }
        }
        this.getHtmlElement().value = value;
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
     * Sets disabled
     * @param disabled disable or not
     */
    override setDisabled(disabled: boolean): void {
        if(disabled) {
            this.getHtmlElement().setAttribute('disabled', 'disabled');
        }else{
            this.getHtmlElement().removeAttribute('disabled');
        }
    }

}
