import {assert, getProxyHandler, setElementAttribute} from "./common";
import {Observable} from "./Observable";
import {Observer} from "./Observer";
import {Event} from "./event/Event";

/**
 * Element
 */
export abstract class Element<T extends HTMLElement, V extends object> extends Observable implements Observer {

    htmlElement: T;

    bindData: V;

    context: object;

    /**
     * Constructor
     * @param htmlElement html element
     * @param bindData bind data
     * @param context context
     * @protected
     */
    protected constructor(htmlElement: T, bindData: V, context: object) {
        super();
        this.htmlElement = htmlElement;
        this.bindData = bindData;
        this.context = context;
        setElementAttribute(this.htmlElement, 'id', this.generateId());
        // bind data
        let proxyHandler = getProxyHandler(bindData);
        assert(proxyHandler, 'ProxyHandler is not found');
        this.addObserver(proxyHandler);
        proxyHandler.addObserver(this);
    }

    /**
     * Generate id
     * @private
     */
    private generateId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Gets html element
     */
    getHtmlElement(): T {
        return this.htmlElement;
    }

    /**
     * Gets context
     */
    getContext(): object {
        return this.context;
    }

    /**
     * Gets bind data
     */
    getBindData(): V {
        return this.bindData;
    }

    /**
     * Render
     */
    abstract render(): void;

    /**
     * Updates
     * @param observable
     * @param event
     */
    abstract update(observable: object, event: Event): void;

}