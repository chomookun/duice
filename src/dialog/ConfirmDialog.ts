///<reference path="Dialog.ts"/>
namespace duice.dialog {

    /**
     * Confirm
     */
    export class ConfirmDialog extends Dialog {

        messagePre: HTMLPreElement;

        confirmButton: HTMLButtonElement;

        cancelButton: HTMLButtonElement;

        /**
         * constructor
         * @param message
         */
        constructor(message: string) {
            super(document.createElement('dialog'));
            this.getDialogElement().style.padding = '1rem';
            this.getDialogElement().style.minWidth = '15rem';
            this.getDialogElement().style.textAlign = 'center';

            // message pre
            this.messagePre = document.createElement('pre');
            this.messagePre.innerHTML = message;
            this.getDialogElement().appendChild(this.messagePre);

            // confirm button
            this.confirmButton = document.createElement('button');
            this.confirmButton.appendChild(document.createTextNode('Yes'));
            this.confirmButton.style.width = '3rem';
            this.confirmButton.addEventListener('click', event => {
                this.confirm();
            });
            this.getDialogElement().appendChild(this.confirmButton);

            // cancel button
            this.cancelButton = document.createElement('button');
            this.cancelButton.appendChild(document.createTextNode('No'));
            this.cancelButton.style.width = '3rem';
            this.cancelButton.addEventListener('click', event => {
                this.cancel();
            });
            this.getDialogElement().appendChild(this.cancelButton);
        }

        /**
         * open
         */
        override open() {
            let promise = super.open();
            this.confirmButton.focus();
            return promise;
        }

        /**
         * confirm
         */
        confirm() {
           this.resolve(true);
           this.getDialogElement().parentNode.removeChild(this.getDialogElement());
        }

        /**
         * cancel
         */
        cancel() {
           this.resolve(false);
           this.getDialogElement().parentNode.removeChild(this.getDialogElement());
        }

        /**
         * close
         */
        override close() {
           this.resolve(false);
           this.getDialogElement().parentNode.removeChild(this.getDialogElement());
        }

    }

}