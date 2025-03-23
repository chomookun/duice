import {Dialog} from "./Dialog";

/**
 * Prompt Dialog
 */
export class PromptDialog extends Dialog {

    messagePre: HTMLPreElement;

    promptInput: HTMLInputElement;

    confirmButton: HTMLButtonElement;

    cancelButton: HTMLButtonElement;

    /**
     * Constructor
     * @param message message
     * @param type type
     */
    constructor(message: string, type?: string) {
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
        // prompt input
        this.promptInput = document.createElement('input');
        this.promptInput.style.textAlign = 'center';
        this.promptInput.style.marginBottom = '1rem';
        this.promptInput.style.width = '100%';
        if(type) {
            this.promptInput.type = type;
        }
        this.getDialogElement().appendChild(this.promptInput);
        // cancel button
        this.cancelButton = document.createElement('button');
        this.cancelButton.appendChild(document.createTextNode('Cancel'));
        this.cancelButton.style.width = '5em';
        this.cancelButton.style.cursor = 'pointer';
        this.cancelButton.addEventListener('click', event => {
            this.cancel();
        });
        this.getDialogElement().appendChild(this.cancelButton);
        // divider
        this.getDialogElement().appendChild(document.createTextNode(' '));
        // confirm button
        this.confirmButton = document.createElement('button');
        this.confirmButton.appendChild(document.createTextNode('OK'));
        this.confirmButton.style.width = '5em';
        this.confirmButton.style.cursor = 'pointer';
        this.confirmButton.addEventListener('click', event => {
            this.confirm(this.promptInput.value);
        });
        this.getDialogElement().appendChild(this.confirmButton);
    }

    /**
     * Overrides open
     */
    override open() {
        let promise = super.open();
        this.promptInput.focus();
        return promise;
    }

    /**
     * Overrides close
     * @param args
     */
    override close(...args: any[]) {
        super.close();
        this.getDialogElement().parentNode.removeChild(this.getDialogElement());
    }

    /**
     * Confirm
     * @param value
     */
    confirm(value: string) {
        super.close(value);
        this.getDialogElement().parentNode.removeChild(this.getDialogElement());
    }

    /**
     * Cancel
     */
    cancel() {
        super.close();
        this.getDialogElement().parentNode.removeChild(this.getDialogElement());
    }

}
