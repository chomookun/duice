/**
 * Dialog
 */
export class Dialog {

    protected dialogElement: HTMLDialogElement;

    protected header: HTMLSpanElement;

    protected closeButton: HTMLSpanElement;

    protected promise: Promise<any>;

    protected promiseResolve: Function;

    protected promiseReject: Function;

    openingListener: Function;

    openedListener: Function;

    closingListener: Function;

    closedListener: Function;

    /**
     * Constructor
     * @param dialogElement dialog element
     */
    constructor(dialogElement: HTMLDialogElement) {
        this.dialogElement = dialogElement;
        let _this = this;
        // dialog fixed style
        this.dialogElement.style.position = 'absolute';
        this.dialogElement.style.left = '0';
        this.dialogElement.style.right = '0';
        this.dialogElement.style.overflowX = 'hidden';
        this.dialogElement.style.boxSizing = 'border-box';
        this.dialogElement.style.maxWidth = '100%';
        // header
        this.header = document.createElement('div');
        this.dialogElement.appendChild(this.header);
        this.header.style.display = 'flex';
        this.header.style.justifyContent = 'end';
        this.header.style.lineHeight = '2rem';
        this.header.style.position = 'absolute';
        this.header.style.left = '0';
        this.header.style.top = '0';
        this.header.style.width = '100%';
        this.header.style.cursor = 'pointer';
        // drag
        this.header.onmousedown = function (event) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            pos3 = event.clientX;
            pos4 = event.clientY;
            window.document.onmouseup = function (event) {
                window.document.onmousemove = null;
                window.document.onmouseup = null;

            };
            window.document.onmousemove = function (event) {
                pos1 = pos3 - event.clientX;
                pos2 = pos4 - event.clientY;
                pos3 = event.clientX;
                pos4 = event.clientY;
                _this.dialogElement.style.left = (_this.dialogElement.offsetLeft - pos1) + 'px';
                _this.dialogElement.style.top = (_this.dialogElement.offsetTop - pos2) + 'px';
            };
        };
        // creates close button
        this.closeButton = document.createElement('span');
        this.closeButton.innerHTML = '&#10005;';
        this.closeButton.style.fontFamily = 'monospace';
        this.closeButton.style.fontSize = 'large';
        this.closeButton.style.marginLeft = '0.5rem';
        this.closeButton.style.marginRight = '0.5rem';
        this.closeButton.addEventListener('click', event => {
            _this.hide();
            _this.close();
        });
        this.dialogElement.addEventListener('scroll', () => {
            const scrollTop = this.dialogElement.scrollTop;
            this.header.style.top = `${scrollTop}px`;
        });
        this.header.appendChild(this.closeButton);
        // on resize event
        window.addEventListener('resize', function (event) {
            _this.movePositionToCenter();
        });
    }

    /**
     * Sets opening listener
     * @param listener listener
     */
    onOpening(listener: Function): Dialog {
        this.openingListener = listener;
        return this;
    }

    /**
     * Sets opened listener
     * @param listener listener
     */
    onOpened(listener: Function): Dialog {
        this.openedListener = listener;
        return this;
    }

    /**
     * Sets closing listener
     * @param listener listener
     */
    onClosing(listener: Function): Dialog {
        this.closingListener = listener;
        return this;
    }

    /**
     * Sets closed listener
     * @param listener listener
     */
    onClosed(listener: Function): Dialog {
        this.closedListener = listener;
        return this;
    }

    /**
     * Moves position to center
     */
    movePositionToCenter() {
        let computedStyle = window.getComputedStyle(this.dialogElement);
        this.dialogElement.style.boxSizing = 'border-box';
        let computedWidth = this.dialogElement.offsetWidth;
        let computedHeight = this.dialogElement.offsetHeight;
        let scrollX = window.scrollX;
        let scrollY = window.scrollY;
        this.dialogElement.style.left = Math.max(0, window.innerWidth / 2 - computedWidth / 2) + scrollX + 'px';
        this.dialogElement.style.top = Math.max(0, window.innerHeight / 3 - computedHeight / 3) + scrollY + 'px';
    }

    /**
     * Gets dialog element
     * @protected
     */
    protected getDialogElement(): HTMLDialogElement {
        return this.dialogElement;
    }

    /**
     * Shows dialog
     * @protected
     */
    protected show(): void {
        // saves current scroll position
        let scrollX = window.scrollX;
        let scrollY = window.scrollY;
        // show dialog modal
        window.document.body.appendChild(this.dialogElement);
        this.dialogElement.showModal();
        // restore previous scroll position
        window.scrollTo(scrollX, scrollY);
        // adjusting position
        this.movePositionToCenter();
    }

    /**
     * Hides dialog
     * @protected
     */
    protected hide(): void {
        this.dialogElement.close();
    }

    /**
     * Opens dialog
     */
    async open() {
        // opening listener
        if (this.openingListener) {
            if (this.openingListener.call(this) == false) {
                return;
            }
        }
        // show modal
        this.show();
        // opened listener
        if (this.openedListener) {
            this.openedListener.call(this);
        }
        // creates promise
        let _this = this;
        this.promise = new Promise(function (resolve, reject) {
            _this.promiseResolve = resolve;
            _this.promiseReject = reject;
        });
        return this.promise;
    }

    /**
     * Closes dialog
     * @param args args
     * @protected
     */
    protected close(...args: any[]) {
        // closing listener
        if (this.closingListener) {
            if (this.closingListener.call(this) == false) {
                return;
            }
        }
        // closed listener
        if (this.closedListener) {
            this.closedListener.call(this);
        }
        // resolve
        this.hide();
        this.promiseResolve(...args);
    }

}
