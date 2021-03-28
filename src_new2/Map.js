var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import DataObject from './DataObject';
import MapEventListener from './MapEventListener';
import MapComponent from './MapComponent';
export default class Map extends DataObject {
    constructor(json) {
        super();
        this.data = new Object();
        this.originData = JSON.stringify(this.data);
        this.eventListener = new MapEventListener();
        this.fromJson(json || {});
    }
    update(mapComponent, obj) {
        console.debug('Map.update', mapComponent, obj);
        var name = mapComponent.getName();
        var value = mapComponent.getValue();
        this.set(name, value);
    }
    fromJson(json) {
        this.data = new Object();
        for (var name in json) {
            this.data[name] = json[name];
        }
        this.save();
        this.setChanged();
        this.notifyObservers(this);
    }
    toJson() {
        var json = new Object();
        for (var name in this.data) {
            json[name] = this.data[name];
        }
        return json;
    }
    clear() {
        this.data = new Object();
        this.setChanged();
        this.notifyObservers(this);
    }
    save() {
        this.originData = JSON.stringify(this.toJson());
    }
    reset() {
        this.fromJson(JSON.parse(this.originData));
    }
    isDirty() {
        if (JSON.stringify(this.toJson()) === this.originData) {
            return false;
        }
        else {
            return true;
        }
    }
    set(name, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.eventListener.onBeforeChange) {
                try {
                    if ((yield this.eventListener.onBeforeChange.call(this, name, value)) === false) {
                        throw 'Map.set is canceled';
                    }
                }
                catch (e) {
                    this.setChanged();
                    this.notifyObservers(this);
                    throw e;
                }
            }
            this.data[name] = value;
            this.setChanged();
            this.notifyObservers(this);
            if (this.eventListener.onAfterChange) {
                this.eventListener.onAfterChange.call(this, name, value);
            }
            return true;
        });
    }
    get(name) {
        return this.data[name];
    }
    getNames() {
        var names = new Array();
        for (var name in this.data) {
            names.push(name);
        }
        return names;
    }
    setFocus(name) {
        for (var i = 0, size = this.observers.length; i < size; i++) {
            var observer = this.observers[i];
            if (observer instanceof MapComponent) {
                var mapUiComponent = this.observers[i];
                if (observer.getName() === name) {
                    mapUiComponent.setFocus();
                    break;
                }
            }
        }
    }
    onBeforeChange(listener) {
        this.eventListener.onBeforeChange = listener;
    }
    onAfterChange(listener) {
        this.eventListener.onAfterChange = listener;
    }
}
