import {findVariable, getElementAttribute, getProxyHandler, runExecuteCode, runIfCode, debug} from "./common";
import {Element} from "./Element";
import {ObjectProxy} from "./ObjectProxy";
import {Observable} from "./Observable";
import {ObjectProxyHandler} from "./ObjectProxyHandler";
import {Format} from "./format/Format";
import {FormatFactory} from "./format/FormatFactory";
import {Event} from "./event/Event";
import {Configuration} from "./Configuration";
import {PropertyChangingEvent} from "./event/PropertyChangingEvent";
import {PropertyChangedEvent} from "./event/PropertyChangedEvent";

/**
 * Object Element
 */
export class ObjectElement<T extends HTMLElement> extends Element<T, object> {

    property: string;

    format: Format;

    /**
     * Constructor
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     */
    constructor(htmlElement: T, bindData: object, context: object) {
        super(htmlElement, bindData, context);
        // attributes
        this.property = getElementAttribute(htmlElement,'property')
        let format = getElementAttribute(htmlElement, 'format');
        if(format) {
            this.format = FormatFactory.getFormat(format);
        }
    }

    /**
     * Gets property
     */
    getProperty(): string {
        return this.property;
    }

    /**
     * Gets format
     */
    getFormat(): Format {
        return this.format;
    }

    /**
     * Overrides render
     */
    override render(): void {
        // context
        let context = Object.assign({}, this.getContext());
        let bind = getElementAttribute(this.getHtmlElement(), 'bind');
        let bindSplit = bind.split('.');
        if(bindSplit.length > 1) {
            context[bindSplit[0]] = findVariable(context, bindSplit[0]);
        }else{
            context[bind] = this.getBindData();
        }
        // run if code
        runIfCode(this.htmlElement, context).then(result => {
            // checks result
            if (result === false) {
                return;
            }
            let objectProxyHandler = getProxyHandler<ObjectProxyHandler>(this.getBindData());
            // set value
            if (this.property) {
                let value = objectProxyHandler.getValue(this.property);
                this.setValue(value);
            }
            // sets readonly
            let readonly = objectProxyHandler.isReadonly(this.property);
            this.setReadonly(readonly);
            // sets disabled
            let disabled = objectProxyHandler.isDisabled(this.property);
            this.setDisable(disabled);
            // run execute code
            runExecuteCode(this.htmlElement, context).then();
        });
    }

    /**
     * Updates
     * @param observable observable
     * @param event event
     */
    override update(observable: Observable, event: Event): void {
        debug('ObjectElement.update', observable, event);
        // ObjectHandler
        if(observable instanceof ObjectProxyHandler) {
            // property changed event
            if (event instanceof PropertyChangedEvent) {
                this.render();
                return;
            }
        }
        // default
        this.render();
    }

    /**
     * Sets property value
     * @param value property value
     */
    setValue(value: any): void {
        if(value != null) {
            value = this.getFormat() ? this.getFormat().format(value) : value;
            this.htmlElement.innerText = value;
        }else{
            this.htmlElement.innerText = '';
        }
    }

    /**
     * Gets property value
     */
    getValue(): any {
        let value = this.htmlElement.innerText;
        if(value && value.trim().length > 0) {
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
    setReadonly(readonly: boolean): void {
        // no-op
    }

    /**
     * Sets disable
     * @param disable disable or not
     */
    setDisable(disable: boolean): void {
        // no-op
    }

    /**
     * Gets index
     */
    getIndex(): number {
        let index = getElementAttribute(this.htmlElement, 'index');
        if(index){
            return Number(index);
        }
    }

    /**
     * Focus
     */
    focus(): boolean {
        // no-ops
        return false;
    }

}