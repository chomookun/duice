import {Dialog} from "./Dialog";

export class AlertDialog extends Dialog {

    messagePre: HTMLPreElement;

    confirmButton: HTMLButtonElement;

    constructor(message: string) {
        super(document.createElement('dialog'));
        this.getDialogElement().style.padding = '1rem';
        this.getDialogElement().style.minWidth = '20rem';
        this.getDialogElement().style.textAlign = 'center';

        // message pre
        this.messagePre = document.createElement('pre');
        this.messagePre.style.whiteSpace = 'pre-wrap';
        this.messagePre.style.marginTop = '1rem';
        this.messagePre.style.marginBottom = '1rem';
        this.messagePre.innerHTML = message;
        this.getDialogElement().appendChild(this.messagePre);

        // confirm button
        this.confirmButton = document.createElement('button');
        this.confirmButton.appendChild(document.createTextNode('Yes'));
        this.confirmButton.style.width = '4rem';
        this.confirmButton.style.cursor = 'pointer';
        this.confirmButton.addEventListener('click', event => {
            this.confirm();
        });
        this.getDialogElement().appendChild(this.confirmButton);
    }

    override open() {
        let promise = super.open();
        this.confirmButton.focus();
        return promise;
    }

    confirm() {
        super.close();
        this.getDialogElement().parentNode.removeChild(this.getDialogElement());
    }

    override close() {
        super.close();
        this.getDialogElement().parentNode.removeChild(this.getDialogElement());
    }
}