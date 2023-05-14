///<reference path="Observable.ts"/>
namespace duice {

    /**
     * element abstract class
     */
    export abstract class DataElement<T extends HTMLElement, V> extends Observable implements Observer {

        htmlElement: T;

        context: object;

        data: V;

        /**
         * constructor
         * @param htmlElement
         * @param context
         * @protected
         */
        protected constructor(htmlElement: T, context: object) {
            super();
            this.htmlElement = htmlElement;
            this.context = context;
            setElementAttribute(this.htmlElement, 'id', generateId());
        }

        /**
         * return HTML element
         */
        getHtmlElement(): T {
            return this.htmlElement;
        }

        /**
         * return context
         */
        getContext(): object {
            return this.context;
        }

        /**
         * set data
         * @param dataName
         */
        setData(dataName: string): void {

            // finds proxy data
            let data = findVariable(this.context, dataName);

            // bind with data handler
            let dataHandler = globalThis.Object.getOwnPropertyDescriptor(data, '_handler_')?.value;
            assert(dataHandler, 'DataHandler is not found');
            this.addObserver(dataHandler);
            dataHandler.addObserver(this);

            // set data
            this.data = dataHandler.getTarget();
        }

        /**
         * return data
         */
        getData(): V {
            return this.data;
        }

        /**
         * execute script if exists
         * @param htmlElement
         * @param context
         */
        executeScript(htmlElement: HTMLElement, context: object): void {
            let script = getElementAttribute(htmlElement, 'script');
            if(script) {
                executeScript(script, htmlElement, context);
            }
        }

        /**
         * render abstract method
         */
        abstract render(): void;

        /**
         * update abstract method
         * @param observable
         * @param event
         */
        abstract update(observable: object, event: event.Event): void;

    }

}