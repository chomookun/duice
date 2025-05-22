import {Dialog} from "./Dialog";

/**
 * Alert Dialog
 */
export class AlertDialog extends Dialog {

    messageArea: HTMLPreElement;

    buttonArea: HTMLDivElement;

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
     * Overrides open
     */
    override open() {
        let promise = super.open();
        this.confirmButton.focus();
        return promise;
    }

    /**
     * Confirm
     */
    confirm() {
        super.close();
        this.getDialogElement().parentNode.removeChild(this.getDialogElement());
    }

    /**
     * Overrides close
     */
    override close() {
        super.close();
        this.getDialogElement().parentNode.removeChild(this.getDialogElement());
    }
}