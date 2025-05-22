import {Dialog} from "./Dialog";

/**
 * Prompt Dialog
 */
export class PromptDialog extends Dialog {

    messageArea: HTMLPreElement;

    promptInput: HTMLInputElement;

    buttonArea: HTMLDivElement;

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

        // message area
        this.messageArea = document.createElement('pre');
        this.messageArea.style.whiteSpace = 'pre-wrap';
        this.messageArea.style.marginTop = '1rem';
        this.messageArea.style.marginBottom = '1rem';
        this.messageArea.innerHTML = message;
        this.getDialogElement().appendChild(this.messageArea);

        // prompt input
        this.promptInput = document.createElement('input');
        this.promptInput.style.textAlign = 'center';
        this.promptInput.style.marginBottom = '1rem';
        this.promptInput.style.width = '100%';
        if(type) {
            this.promptInput.type = type;
        }
        this.getDialogElement().appendChild(this.promptInput);

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
            this.confirm(this.promptInput.value);
        });
        this.buttonArea.appendChild(this.confirmButton);
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
