import Dialog from "./Dialog";

/**
 * Confirm
 */
export default class Confirm extends Dialog {
    message:string;
    iconDiv:HTMLDivElement;
    messageDiv:HTMLDivElement;
    buttonDiv:HTMLDivElement;
    cancelButton:HTMLButtonElement;
    confirmButton:HTMLButtonElement;
    constructor(message:string) {
        let contentDiv = document.createElement('div');
        super(contentDiv);
        this.message = message;
        var _this = this;
        
        // creates icon div
        this.iconDiv = document.createElement('div');
        this.iconDiv.classList.add('duice-confirm__iconDiv');

        // creates message div
        this.messageDiv = document.createElement('div');
        this.messageDiv.classList.add('duice-confirm__messageDiv');
        this.messageDiv.innerHTML = this.message;

        // creates button div
        this.buttonDiv = document.createElement('div');
        this.buttonDiv.classList.add('duice-confirm__buttonDiv');
        
        // confirm button
        this.confirmButton = document.createElement('button');
        this.confirmButton.classList.add('duice-confirm__buttonDiv-button');
        this.confirmButton.classList.add('duice-confirm__buttonDiv-button--confirm');
        this.confirmButton.addEventListener('click', function(event){
            _this.confirm(true); 
        });
        this.buttonDiv.appendChild(this.confirmButton);

        // cancel button
        this.cancelButton = document.createElement('button');
        this.cancelButton.classList.add('duice-confirm__buttonDiv-button');
        this.cancelButton.classList.add('duice-confirm__buttonDiv-button--cancel');
        this.cancelButton.addEventListener('click', function(event){
            _this.close(false); 
        });
        this.buttonDiv.appendChild(this.cancelButton);
        
        // appends parts to bodyDiv
        contentDiv.appendChild(this.iconDiv);
        contentDiv.appendChild(this.messageDiv);
        contentDiv.appendChild(this.buttonDiv);
    }
    open() {
        var promise = super.open();
        this.confirmButton.focus();
        return promise;
    }
}