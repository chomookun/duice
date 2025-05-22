import {Dialog} from "./Dialog";

/**
 * Confirm Dialog
 */
export class ConfirmDialog extends Dialog {

    messageArea: HTMLPreElement;

    buttonArea: HTMLDivElement;

    cancelButton: HTMLButtonElement;

    confirmButton: HTMLButtonElement;

    /**
     * Constructor
     * @param message message
     */
    constructor(message: string) {
        super(document.createElement('dialog'));
        this.getDialogElement().style.padding = '1rem';
        this.getDialogElement().style.minWidth = '20rem';
        this.getDialogElement().style.textAlign = 'center';

        // message area
        this.messageArea = document.createElement('pre');
        this.messageArea.style.whiteSpace = 'pre-wrap';
        this.messageArea.style.marginTop = '1rem';
        this.messageArea.style.marginBottom = '1rem';
        this.messageArea.innerHTML = message;
        this.getDialogElement().appendChild(this.messageArea);

        // button area
        this.buttonArea = document.createElement('div');
        this.buttonArea.style.display = 'inline-flex';
        this.buttonArea.style.justifyContent = 'center';
        this.buttonArea.style.gap = '1px';
        this.getDialogElement().appendChild(this.buttonArea);

        // cancel button
        this.cancelButton = document.createElement('button');
        this.cancelButton.appendChild(document.createTextNode('Cancel'));
        this.cancelButton.style.width = '5em';
        this.cancelButton.style.cursor = 'pointer';
        this.cancelButton.addEventListener('click', event => {
            this.cancel();
        });
        this.buttonArea.appendChild(this.cancelButton);

        // confirm button
        this.confirmButton = document.createElement('button');
        this.confirmButton.appendChild(document.createTextNode('OK'));
        this.confirmButton.style.width = '5em';
        this.confirmButton.style.cursor = 'pointer';
        this.confirmButton.addEventListener('click', event => {
            this.confirm();
        });
        this.buttonArea.appendChild(this.confirmButton);
    }

    /**
     * Opens dialog
     */
    override open() {
        let promise = super.open();
        this.confirmButton.focus();
        return promise;
    }

    /**
     * Closes dialog
     * @param args args
     */
    override close(...args: any[]) {
        super.close(false);
        this.getDialogElement().parentNode.removeChild(this.getDialogElement());
    }

    /**
     * Confirm
     */
    confirm() {
        super.close(true);
        this.getDialogElement().parentNode.removeChild(this.getDialogElement());
    }

    /**
     * Cancel
     */
    cancel() {
        super.close(false);
        this.getDialogElement().parentNode.removeChild(this.getDialogElement());
    }

}