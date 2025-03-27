import {TabFolder} from "./TabFolder";

/**
 * Tab Item
 */
export class TabItem {

    button: HTMLElement;

    content: HTMLElement;

    listener: Function;

    tabFolder: TabFolder;

    tabIndex: number;

    /**
     * Constructor
     * @param button button
     * @param content content
     * @param listener listener
     */
    constructor(button: HTMLElement, content: HTMLElement, listener: Function) {
        this.button = button;
        this.content = content;
        this.listener = listener;
        // default style
        button.style.cursor = 'pointer';
        // add listener
        let _this = this;
        button.addEventListener('click', () => {
            _this.tabFolder.setActive(_this.tabIndex);
        });
        // set de-active
        this.setActive(false);
    }

    /**
     * Sets tab folder
     * @param tabFolder tab folder
     */
    setTabFolder(tabFolder: TabFolder): void {
        this.tabFolder = tabFolder;
    }

    /**
     * Sets tab index
     * @param tabIndex tab index
     */
    setTabIndex(tabIndex: number): void {
        this.tabIndex = tabIndex;
    }

    /**
     * Sets active
     * @param active active or not
     */
    setActive(active: boolean): void {
        if(active) {
            this.button.style.opacity = 'unset';
            this.content.removeAttribute('hidden');
            this.listener.call(this);
        }else{
            this.button.style.opacity = '0.5';
            this.content.setAttribute('hidden', String(true));
        }
    }

}