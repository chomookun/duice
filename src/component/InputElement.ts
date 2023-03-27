namespace duice.component {

    /**
     * input element component
     */
    export class InputElement extends ObjectComponent<HTMLInputElement> {

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLInputElement, context: object) {
            super(element, context);

            // adds change listener
            this.getElement().addEventListener('change', e => {
                let event = new duice.event.PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                this.notifyObservers(event);
            }, true);
        }

        /**
         * set value
         * @param value
         */
        override setValue(value: any): void {
            if(value) {
                value = this.getFormat() ? this.getFormat().encode(value) : value;
            }else{
                value = '';
            }
            this.getElement().value = value;
        }

        /**
         * return value
         */
        override getValue(): any {
            let value = this.getElement().value;
            if(value){
                value = this.getFormat() ? this.getFormat().decode(value) : value;
            }else{
                value = null;
            }
            return value;
        }

        /**
         * set readonly
         * @param readonly
         */
        override setReadonly(readonly: boolean): void {
            this.getElement().readOnly = readonly;
        }

    }

}

