import Dialog from './Dialog'

/**
 * Prompt
 */
export default class Prompt extends Dialog {
    message:string;
    defaultValue:string;
    iconDiv:HTMLDivElement;
    messageDiv:HTMLDivElement;
    inputDiv:HTMLDivElement;
    input:HTMLInputElement;
    buttonDiv:HTMLDivElement;
    cancelButton:HTMLButtonElement;
    confirmButton:HTMLButtonElement;
    constructor(message:string, defaultValue:string) {
        let contentDiv = document.createElement('div');
        super(contentDiv);
        this.message = message;
        this.defaultValue = defaultValue;
        var _this = this;
        
        // creates icon div
        this.iconDiv = document.createElement('div');
        this.iconDiv.classList.add('duice-prompt__iconDiv');
        
        // creates message div
        this.messageDiv = document.createElement('div');
        this.messageDiv.classList.add('duice-prompt__messageDiv');
        this.messageDiv.innerHTML = this.message;
        
        // creates input div
        this.inputDiv = document.createElement('div');
        this.inputDiv.classList.add('duice-prompt__inputDiv');
        this.input = document.createElement('input');
        this.input.classList.add('duice-prompt__inputDiv-input');
        if(this.defaultValue){
            this.input.value = this.defaultValue;
        }
        this.inputDiv.appendChild(this.input);

        // creates button div
        this.buttonDiv = document.createElement('div');
        this.buttonDiv.classList.add('duice-prompt__buttonDiv');
        
        // confirm button
        this.confirmButton = document.createElement('button');
        this.confirmButton.classList.add('duice-prompt__buttonDiv-button');
        this.confirmButton.classList.add('duice-prompt__buttonDiv-button--confirm');
        this.confirmButton.addEventListener('click', function(event){
            _this.confirm(_this.getValue()); 
        });
        this.buttonDiv.appendChild(this.confirmButton);

        // cancel button
        this.cancelButton = document.createElement('button');
        this.cancelButton.classList.add('duice-prompt__buttonDiv-button');
        this.cancelButton.classList.add('duice-prompt__buttonDiv-button--cancel');
        this.cancelButton.addEventListener('click', function(event){
            _this.close(false);
        });
        this.buttonDiv.appendChild(this.cancelButton);
        
        // appends parts to bodyDiv
        contentDiv.appendChild(this.iconDiv);
        contentDiv.appendChild(this.messageDiv);
        contentDiv.appendChild(this.inputDiv);
        contentDiv.appendChild(this.buttonDiv);
    }
    open() {
        var promise = super.open();
        this.input.focus();
        return promise;
    }
    getValue():string {
        return this.input.value;
    }
}
