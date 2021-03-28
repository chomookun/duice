import Component from './Component';
import Observable from './Observable';
export default class DataObject extends Observable {
    constructor() {
        super(...arguments);
        this.available = true;
        this.disable = new Object();
        this.disableAll = false;
        this.readonly = new Object();
        this.readonlyAll = false;
        this.visible = true;
    }
    isAvailable() {
        return true;
    }
    setDisable(name, disable) {
        this.disable[name] = disable;
        this.setChanged();
        this.notifyObservers(this);
    }
    setDisableAll(disable) {
        this.disableAll = disable;
        for (var name in this.disable) {
            this.disable[name] = disable;
        }
        this.setChanged();
        this.notifyObservers(this);
    }
    isDisable(name) {
        if (this.disable.hasOwnProperty(name)) {
            return this.disable[name];
        }
        else {
            return this.disableAll;
        }
    }
    setReadonly(name, readonly) {
        this.readonly[name] = readonly;
        this.setChanged();
        this.notifyObservers(this);
    }
    setReadonlyAll(readonly) {
        this.readonlyAll = readonly;
        for (var name in this.readonly) {
            this.readonly[name] = readonly;
        }
        this.setChanged();
        this.notifyObservers(this);
    }
    isReadonly(name) {
        if (this.readonly.hasOwnProperty(name)) {
            return this.readonly[name];
        }
        else {
            return this.readonlyAll;
        }
    }
    setVisible(visible) {
        this.visible = visible;
        for (var i = 0, size = this.observers.length; i < size; i++) {
            try {
                if (this.observers[i] instanceof Component) {
                    var uiComponent = this.observers[i];
                    uiComponent.setVisible(visible);
                }
            }
            catch (e) {
                console.error(e, this.observers[i]);
            }
        }
    }
    isVisible() {
        return this.visible;
    }
}
