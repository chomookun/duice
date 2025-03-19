import {Element} from "./Element";
import {runExecuteCode, runIfCode} from "./common";
import {Initializer} from "./Initializer";
import {Observable} from "./Observable";
import {ProxyHandler} from "./ProxyHandler";
import {Event} from "./event/Event";

/**
 * Custom Element
 */
export abstract class CustomElement<V> extends Element<HTMLElement, V> {

    protected constructor(htmlElement: HTMLElement, bindData: V, context: object) {
        super(htmlElement, bindData, context);
    }

    /**
     * Renders element
     */
    override render(): void {
        // do render
        this.doRender(this.getBindData());
        // check if
        runIfCode(this.getHtmlElement(), this.getContext());
        // initialize
        Initializer.initialize(this.getHtmlElement(), this.getContext());
        // execute script
        runExecuteCode(this.getHtmlElement(), this.getContext());
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
