import {Element} from "./Element";
import {debug, runExecuteCode, runIfCode} from "./common";
import {Initializer} from "./Initializer";
import {Observable} from "./Observable";
import {ProxyHandler} from "./ProxyHandler";
import {Event} from "./event/Event";

/**
 * Custom Element
 */
export abstract class CustomElement<V extends object> extends Element<HTMLElement, V> {

    /**
     * Constructor
     * @param htmlElement html element
     * @param bindData bind data
     * @param context contxt
     * @protected
     */
    protected constructor(htmlElement: HTMLElement, bindData: V, context: object) {
        super(htmlElement, bindData, context);
    }

    /**
     * Renders element
     */
    override render(): void {
        runIfCode(this.getHtmlElement(), this.getContext()).then(result => {
            if (result == false) {
                return;
            }
            this.doRender(this.getBindData());
            Initializer.initialize(this.getHtmlElement(), this.getContext());
            runExecuteCode(this.getHtmlElement(), this.getContext()).then();
        })
    }

    /**
     * Abstract do Render method
     * @param data data
     */
    abstract doRender(data: V): void;

    /**
     * Implements update method
     * @param observable observable
     * @param event event
     */
    override update(observable: Observable, event: Event): void {
        debug('ObjectElement.update', observable, event);
        if(observable instanceof ProxyHandler) {
            this.doUpdate(observable.getTarget() as V);
        }
    }

    /**
     * Abstract do update method
     * @param data data
     */
    abstract doUpdate(data: V): void;

}
