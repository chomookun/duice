import {ObjectElement} from "../ObjectElement";
import {getElementAttribute} from "../common";
import {PropertyChangeEvent} from "../event/PropertyChangeEvent";

/**
 * Img Element
 */
export class ImgElement extends ObjectElement<HTMLImageElement> {

    originSrc: string;

    editable: boolean = false;

    width: number;

    height: number;

    clearButton: HTMLImageElement;

    closeButtonImg = 'data:image/svg+xml;base64,' + window.btoa('<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#292D32"></path> <path d="M13.0594 12.0001L15.3594 9.70011C15.6494 9.41011 15.6494 8.93011 15.3594 8.64011C15.0694 8.35011 14.5894 8.35011 14.2994 8.64011L11.9994 10.9401L9.69937 8.64011C9.40937 8.35011 8.92937 8.35011 8.63938 8.64011C8.34938 8.93011 8.34938 9.41011 8.63938 9.70011L10.9394 12.0001L8.63938 14.3001C8.34938 14.5901 8.34938 15.0701 8.63938 15.3601C8.78938 15.5101 8.97937 15.5801 9.16937 15.5801C9.35937 15.5801 9.54937 15.5101 9.69937 15.3601L11.9994 13.0601L14.2994 15.3601C14.4494 15.5101 14.6394 15.5801 14.8294 15.5801C15.0194 15.5801 15.2094 15.5101 15.3594 15.3601C15.6494 15.0701 15.6494 14.5901 15.3594 14.3001L13.0594 12.0001Z" fill="#292D32"></path> </g></svg>');

    /**
     * Constructor
     * @param htmlElement img html element
     * @param bindData bind data
     * @param context context
     */
    constructor(htmlElement: HTMLImageElement, bindData: object, context: object) {
        super(htmlElement, bindData, context);
        this.originSrc = String(this.getHtmlElement().src);
        // editable
        this.editable = (getElementAttribute(this.getHtmlElement(), 'editable') === 'true');
        if(this.editable) {
            // add click event listener
            this.getHtmlElement().style.cursor = 'pointer';
            this.getHtmlElement().addEventListener('click', event => {
                this.changeImage();
            });
            // create clear button
            this.clearButton = document.createElement('img');
            this.clearButton.src = this.closeButtonImg;
            this.clearButton.style.cursor = 'pointer';
            this.clearButton.style.width = '16px';
            this.clearButton.style.height = '16px';
            this.clearButton.addEventListener('mouseout', event => {
                this.hideClearImageButton();
            },true);
            this.clearButton.addEventListener('click', event => {
                this.clearImage();
            });
            // mouse over
            this.getHtmlElement().addEventListener('mouseover', event => {
                this.showClearImageButton();
            }, true);
            // mouse over
            this.getHtmlElement().addEventListener('mouseout', event => {
                // related target is overlay button
                if(event.relatedTarget === this.clearButton) {
                    return;
                }
                this.hideClearImageButton();
            },true);
        }
        // size
        let size = getElementAttribute(this.getHtmlElement(), 'size');
        if(size) {
            let sizeArgs = size.split(',');
            this.width = parseInt(sizeArgs[0].trim());
            this.height = parseInt(sizeArgs[1].trim());
        }
    }

    /**
     * Shows clear image button
     */
    showClearImageButton(): void {
        this.getHtmlElement().parentNode.insertBefore(this.clearButton, this.getHtmlElement().nextSibling);
        this.clearButton.style.position = 'absolute';
        this.clearButton.style.zIndex = '100';
    }

    /**
     * Hides clear image button
     */
    hideClearImageButton(): void {
        this.getHtmlElement().parentNode.removeChild(this.clearButton);
    }

    /**
     * Clears image
     */
    clearImage(): void {
        if(this.originSrc) {
            this.getHtmlElement().src = this.originSrc;
        }else{
            this.getHtmlElement().src = null;
        }
        // notify observers
        let event = new PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
        this.notifyObservers(event);
    }

    /**
     * Changes image
     */
    changeImage(): void {
        let input = document.createElement('input');
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/gif, image/jpeg, image/png");
        let _this = this;
        input.addEventListener('change', function(e){
            let fileReader = new FileReader();
            if (this.files && this.files[0]) {
                fileReader.addEventListener("load",async e => {
                    let image = e.target.result;
                    let value: unknown;
                    if(_this.width && _this.height) {
                        value = await _this.convertImage(image, _this.width, _this.height);
                    }else{
                        value = await _this.convertImage(image);
                    }
                    _this.setValue(value);

                    // notify observers
                    let event = new PropertyChangeEvent(_this, _this.getProperty(), _this.getValue(), _this.getIndex());
                    _this.notifyObservers(event);
                });
                fileReader.readAsDataURL(this.files[0]);
            }
            e.preventDefault();
            e.stopPropagation();
        });
        input.click();
    }

    /**
     * Converts image
     * @param dataUrl data url
     * @param width width
     * @param height height
     */
    convertImage(dataUrl:any, width?:number, height?:number) {
        return new Promise(function(resolve, reject){
            try {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                let image = new Image();
                image.onload = function(){
                    if(width && height){
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(image, 0, 0, width, height);
                    }else{
                        canvas.width = image.naturalWidth;
                        canvas.height = image.naturalHeight;
                        ctx.drawImage(image, 0, 0);
                    }
                    let dataUrl = canvas.toDataURL("image/png");
                    resolve(dataUrl);
                };
                image.src = dataUrl;
            }catch(e){
                reject(e);
            }
        });
    }

    /**
     * Sets value
     * @param value value
     */
    override setValue(value: any): void {
        if(value) {
            this.getHtmlElement().src = value;
        }else{
            this.getHtmlElement().src = this.originSrc;
        }
    }

    /**
     * Gets value
     */
    override getValue(): any {
        let value = this.getHtmlElement().src;
        if(value === this.originSrc) {
            return null;
        }else{
            return value;
        }
    }

    /**
     * Sets readonly
     * @param readonly readonly or not
     */
    override setReadonly(readonly: boolean): void {
        this.getHtmlElement().style.pointerEvents = (readonly ? 'none' : 'unset');
    }

    /**
     * Sets disable
     * @param disable disable or not
     */
    override setDisable(disable: boolean): void {
        this.getHtmlElement().style.pointerEvents = (disable ? 'none' : 'unset');
    }

}
