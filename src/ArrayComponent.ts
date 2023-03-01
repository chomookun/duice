///<reference path="Component.ts"/>
namespace duice {

    /**
     * ArrayComponent
     */
    export class ArrayComponent extends Component<object[]> {

        loopTemplates: HTMLElement[] = [];

        loopSlots: HTMLSlotElement[] = [];

        /**
         * create
         * @param element
         * @param context
         */
        static create(element: HTMLElement, context: object): ArrayComponent {
            return new ArrayComponent(element, context);
        }

        /**
         * constructor
         * @param element
         * @param context
         * @protected
         */
        constructor(element: HTMLElement, context: object) {
            console.debug("ArrayComponent.constructor", element, context);
            super(element, context);

            // array handler
            let arrayName = this.getAttribute(this.element, 'array');
            let array = this.findObject(arrayName);
            this.handler = array._handler_;
            this.handler.addComponent(this);

            // loop
            let loopElements = this.element.querySelectorAll(`*[${getAlias()}\\:loop]`);
            for(let i = 0; i < loopElements.length; i ++ ){
                let loopElement = loopElements[i] as HTMLElement;
                let loopTemplate = loopElement;
                let loopSlot = document.createElement('slot');
                this.loopTemplates.push(loopTemplate);
                this.loopSlots.push(loopSlot);
                loopElement.replaceWith(loopSlot);
            }
            console.debug("== loopTemplates:", this.loopTemplates);
            console.debug("== loopSlots:", this.loopSlots);
        }

       /**
         * render
         * @param detail
         */
        override doRender(): void {
            console.log("ArrayComponent.render");

            for(let i = 0; i < this.loopTemplates.length; i ++) {
                //let loop = this.loops[i];
                let loopTemplate = this.loopTemplates[i];
                let loopSlot = this.loopSlots[i];
                let loop = this.getAttribute(loopTemplate,'loop');

                // clear
                this.removeChildNodes(loopSlot);

                // create row
                let array = this.handler.getTarget();
                let loopArgs = loop.split(',');
                let objectName = loopArgs[0];
                let statusName = loopArgs[1];
                for(let index = 0, size = array.length; index < size; index ++ ){
                    let item = array[index];
                    console.log('== item:', item);
                    let rowElement = loopTemplate.cloneNode(true) as HTMLElement;
                    let context = {};
                    context[objectName] = item;
                    context[statusName] = Object.create({
                        index: index,
                        number: index + 1,
                        count: array.length,
                        first: (index === 0),
                        last: (index+1 === array.length)
                    });
                    initializeComponent(rowElement, context);
                    loopSlot.appendChild(rowElement);
                }
            }
        }

        /**
         * update
         * @param detail
         */
        doUpdate(detail: object): void {
            console.log("ArrayComponent.update", detail);
        }

    }

}