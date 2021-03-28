/**
 * Dialog
 */
export default abstract class Dialog {
    dialog:HTMLDialogElement;
    contentDiv:HTMLDivElement;
    contentParentNode:Node;
    eventListener:DialogEventListener = new DialogEventListener();
    promise:Promise<any>;
    promiseResolve:Function;
    promiseReject:Function;
    constructor(contentDiv:HTMLDivElement){
        var _this = this;
        this.contentDiv = contentDiv;

        this.dialog = document.createElement('dialog');
        this.dialog.classList.add('duice-dialog');

        // creates close button
        var closeButton = document.createElement('span');
        closeButton.classList.add('duice-dialog__closeButton');
        closeButton.addEventListener('click', function(event){
            _this.close();
        });
        this.dialog.appendChild(closeButton);
    }

    /**
     * Returns current upper window object.
     * @return window object
     */
    getCurrentWindow():Window {
        if(window.frameElement){
            return window.parent;
        }else{
            return window;
        }
    }

    /**
     * Shows modal
     */
    show() {
        // set content parent node
        if(this.contentDiv.parentNode){
            this.contentParentNode = this.contentDiv.parentNode;
        }

        // adds contents
        this.dialog.appendChild(this.contentDiv);

        // show dialog modal
        this.getCurrentWindow().document.body.appendChild(this.dialog);
        this.contentDiv.style.display = 'block';
        this.dialog.showModal();

        //return promise to delay
        return new Promise(function(resolve,reject){
            setTimeout(function(){
                resolve(true);
            }, 100);
        });
    }

    /**
     * Hides modal
     */
    hide() {
        // restore parent node
        if(this.contentParentNode){
            this.contentParentNode.appendChild(this.contentDiv);
        }

        // closes modal
        this.dialog.close();
        this.contentDiv.style.display = 'none';

        // return promise to delay
        return new Promise(function(resolve,reject){
            setTimeout(function(){
                resolve(true);
            }, 100);
        });
    }

    /**
     * open
     * @param args 
     */
    async open(...args:any[]) {
        if(this.eventListener.onBeforeOpen){
            if(await this.eventListener.onBeforeOpen.call(this, ...args) === false){
                return;
            }
        }
        await this.show();
        if(this.eventListener.onAfterOpen){
            await this.eventListener.onAfterOpen.call(this, ...args);
        }

        // creates promise
        var _this = this;
        this.promise = new Promise(function(resolve,reject){
            _this.promiseResolve = resolve;
            _this.promiseReject = reject;
        });
        return this.promise;
    }

    /**
     * close
     * @param args 
     */
    async close(...args:any[]) {
        if(this.eventListener.onBeforeClose){
            if(await this.eventListener.onBeforeClose.call(this, ...args) === false){
                return;
            }
        }
        await this.hide();
        if(this.eventListener.onAfterClose){
            await this.eventListener.onAfterClose.call(this, ...args);
        }

        // resolves promise
        this.promiseResolve(...args);
    }

    /**
     * confirm
     * @param args 
     */
    async confirm(...args: any[]) {
        if(this.eventListener.onBeforeConfirm){
            if(await this.eventListener.onBeforeConfirm.call(this, ...args) === false){
                return;
            }
        }
        await this.hide();
        if(this.eventListener.onAfterConfirm){
            await this.eventListener.onAfterConfirm.call(this, ...args);
        }

        // resolves promise
        this.promiseResolve(...args);
    }

    /**
     * Adds onBeforeOpen event listener
     * @param listener 
     */
    onBeforeOpen(listener:Function):any {
        this.eventListener.onBeforeOpen = listener;
        return this;
    }
    
    /**
     * Adds onAfterOpen even listener
     * @param listener 
     */
    onAfterOpen(listener:Function):any {
        this.eventListener.onAfterOpen = listener;
        return this;
    }

    /**
     * Adds onBeforeClose event listener
     * @param listener
     */
    onBeforeClose(listener:Function):any{
        this.eventListener.onBeforeClose = listener;
        return this;
    }

    /**
     * Adds onAfterClose event listener
     * @param listener 
     */
    onAfterClose(listener:Function):any {
        this.eventListener.onAfterClose = listener;
        return this;
    }

    /**
     * Adds onBeforeConfirm event listener
     * @param listener 
     */
    onBeforeConfirm(listener:Function):any {
        this.eventListener.onBeforeConfirm = listener;
        return this;
    }

    /**
     * Adds onAfterConfirm event listener
     * @param listener 
     */
    onAfterConfirm(listener:Function):any {
        this.eventListener.onAfterConfirm = listener;
        return this;
    }
}