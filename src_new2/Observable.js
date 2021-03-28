export default class Observable {
    constructor() {
        this.observers = new Array();
        this.changed = false;
        this.notifyEnable = true;
    }
    addObserver(observer) {
        for (var i = 0, size = this.observers.length; i < size; i++) {
            if (this.observers[i] === observer) {
                return;
            }
        }
        this.observers.push(observer);
    }
    removeObserver(observer) {
        for (var i = 0, size = this.observers.length; i < size; i++) {
            if (this.observers[i] === observer) {
                this.observers.splice(i, 1);
                return;
            }
        }
    }
    notifyObservers(obj) {
        if (this.notifyEnable && this.hasChanged()) {
            this.clearUnavailableObservers();
            for (var i = 0, size = this.observers.length; i < size; i++) {
                if (this.observers[i] !== obj) {
                    try {
                        this.observers[i].update(this, obj);
                    }
                    catch (e) {
                        console.error(e, this.observers[i]);
                    }
                }
            }
            this.clearChanged();
        }
    }
    suspendNotify() {
        this.notifyEnable = false;
    }
    resumeNotify() {
        this.notifyEnable = true;
    }
    setChanged() {
        this.changed = true;
    }
    hasChanged() {
        return this.changed;
    }
    clearChanged() {
        this.changed = false;
    }
    clearUnavailableObservers() {
        for (var i = this.observers.length - 1; i >= 0; i--) {
            try {
                if (this.observers[i].isAvailable() === false) {
                    this.observers.splice(i, 1);
                }
            }
            catch (e) {
                console.error(e, this.observers[i]);
            }
        }
    }
}
