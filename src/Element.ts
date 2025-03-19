import {assert, setElementAttribute} from "./common";
import {Observable} from "./Observable";
import {Observer} from "./Observer";
import {Event} from "./event/Event";
import {ObjectProxy} from "./ObjectProxy";

/**
 * Element
 */
export abstract class Element<T extends HTMLElement, V> extends Observable implements Observer {

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
        let dataHandler = globalThis.Object.getOwnPropertyDescriptor(this.bindData, '_proxy_handler_')?.value;
        assert(dataHandler, 'DataHandler is not found');
        this.addObserver(dataHandler);
        dataHandler.addObserver(this);
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