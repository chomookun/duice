import {TabItem} from "./TabItem";

/**
 * Tab Folder
 */
export class TabFolder {

    items: TabItem[] = [];

    /**
     * Adds tab item
     * @param item
     */
    addItem(item: TabItem): void {
        item.setTabFolder(this);
        item.setTabIndex(this.items.length);
        this.items.push(item);
    }

    /**
     * set Active tab item
     * @param index index
     */
    setActive(index: number): void {
        for(let i = 0; i < this.items.length; i ++ ) {
            this.items[i].setActive(i === index);
        }
    }

}