namespace duice {

    /**
     * Component
     */
    export abstract class Component extends Observable implements Observer {

        id: string;

        element: HTMLElement;

        protected constructor(element: HTMLElement) {
            super();
            this.element = element;
            this.id = generateUuid();
            this.setAttribute("id", this.id);
        }

        /**
         * initialize
         */
        initialize(context: object): void {
            console.debug("Component.initialize", this);

            // bind
            let bind = findObject(context, this.getAttribute("bind"));
            this.addObserver(bind._handler_);
            bind._handler_.addObserver(this);

            // initialize
            this.doInitialize(context);

            // update
            this.doUpdate(bind._handler_, null);
        }

        /**
         * doInitialize
         * @param context
         */
        abstract doInitialize(context: object): void;

        /**
         * update
         * @param observable
         * @param event
         */
        update(observable: Observable, event: Event): void {
            this.doUpdate(observable, event);
        }

        /**
         * doUpdate
         * @param handler
         * @param event
         */
        abstract doUpdate(handler: Observable, event: Event): void;

        /**
         * destroy
         */
        destroy(): void {
            console.debug("Component.destroy", this);
            this.doDestroy();
        }

        /**
         *
         */
        abstract doDestroy(): void;

        /**
         * hasAttribute
         * @param name
         */
        hasAttribute(name: string): boolean {
            return this.element.hasAttribute(`${getAlias()}:${name}`)
        }

        /**
         * getAttribute
         * @param name
         */
        getAttribute(name: string): string {
            return this.element.getAttribute(`${getAlias()}:${name}`);
        }

        /**
         * setAttribute
         * @param name
         * @param value
         */
        setAttribute(name: string, value: string): void {
            console.log(this.element, name, value);
            this.element.setAttribute(`${getAlias()}:${name}`, value);
        }

    }

}