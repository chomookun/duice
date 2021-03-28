import Dialog from "./Dialog";

/**
 * Alert
 */
export default class Alert extends Dialog {
    message:string;
    iconDiv:HTMLDivElement;
    messageDiv:HTMLDivElement;
    buttonDiv:HTMLDivElement;
    confirmButton:HTMLButtonElement;
    constructor(message:string) {
        let contentDiv = document.createElement('div');
        super(contentDiv);
        this.message = message;
        var _this = this;

        // creates icon div
        this.iconDiv = document.createElement('div');
        this.iconDiv.classList.add('duice-alert__iconDiv');

        // creates message div
        this.messageDiv = document.createElement('div');
        this.messageDiv.classList.add('duice-alert__messageDiv');
        this.messageDiv.innerHTML = this.message;

        // creates button div
        this.buttonDiv = document.createElement('div');
        this.buttonDiv.classList.add('duice-alert__buttonDiv');
        
        // creates confirm button
        this.confirmButton = document.createElement('button');
        this.confirmButton.classList.add('duice-alert__buttonDiv-button');
        this.confirmButton.classList.add('duice-alert__buttonDiv-button--confirm');
        this.confirmButton.addEventListener('click', function(event){
            _this.close(); 
        });
        this.buttonDiv.appendChild(this.confirmButton);

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