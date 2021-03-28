import DataObject from './DataObject';
import MapEventListener from './MapEventListener';
import MapComponent from './MapComponent';

/**
 * Map data structure
 * @param JSON object
 */
export default class Map extends DataObject {
    data:any = new Object();                            // internal data object
    originData:string = JSON.stringify(this.data);      // original string JSON data
    eventListener:MapEventListener = new MapEventListener();

    /**
     * constructor 
     * @param json
     */
    constructor(json?:any) {
        super();
        this.fromJson(json || {});
    }
    
    /**
     * Updates data from observable instance
     * @param mapComponent
     * @param obj
     */
    update(mapComponent:MapComponent, obj:object):void {
        console.debug('Map.update', mapComponent, obj);
        var name = mapComponent.getName();
        var value = mapComponent.getValue();
        this.set(name, value);
    }
    
    /**
     * Loads data from JSON object.
     * @param json
     */
    fromJson(json:any): void {
        // sets data
        this.data = new Object();
        for(var name in json){
            this.data[name] = json[name];
        }

        // save point
        this.save();
        
        // notify to observers
        this.setChanged();
        this.notifyObservers(this);
    }
    
    /**
     * Convert data to JSON object
     * @return JSON object
     */
    toJson():object {
        var json: any = new Object();
        for(var name in this.data){
            json[name] = this.data[name];
        }
        return json;
    }

    /**
     * Clears data
     */
    clear():void {
        this.data = new Object();
        this.setChanged();
        this.notifyObservers(this);
    }

    /**
     * Save point
     */
    save():void {
        this.originData = JSON.stringify(this.toJson());
    }

    /**
     * Restores instance as original data
     */
    reset():void {
        this.fromJson(JSON.parse(this.originData));
    }
    
    /**
     * Checks original data is changed
     * @return whether original data is changed or not
     */
    isDirty():boolean {
        if(JSON.stringify(this.toJson()) === this.originData){
            return false;
        }else{
            return true;
        }
    }
    
    /**
     * Sets property as input value
     * @param name
     * @param value
     */
    async set(name:string, value:any) {

        // calls beforeChange
        if(this.eventListener.onBeforeChange){
            try {
                if(await this.eventListener.onBeforeChange.call(this,name,value) === false){
                    throw 'Map.set is canceled';
                }
            }catch(e){
                this.setChanged();
                this.notifyObservers(this);
                throw e;
            }
        }

        // changes value
        this.data[name] = value;
        this.setChanged();
        this.notifyObservers(this);

        // calls 
        if(this.eventListener.onAfterChange){
            this.eventListener.onAfterChange.call(this,name,value);
        }

        // return true
        return true;
    }
    
    /**
     * Gets specified property value.
     * @param name
     */
    get(name:string):any {
        return this.data[name];
    }

    /**
     * Returns properties names as array.
     * @return array of names
     */
    getNames():string[]{
        var names = new Array();
        for(var name in this.data){
            names.push(name);
        }
        return names;
    }

    /**
     * Sets focus with message
     * @param name 
     */
    setFocus(name:string):void {
        for(var i = 0, size = this.observers.length; i < size; i++){
            var observer = this.observers[i];
            if(observer instanceof MapComponent){
                var mapUiComponent = <MapComponent>this.observers[i];
                if(observer.getName() === name){
                    mapUiComponent.setFocus();
                    break;
                }
            }
        }
    }

    /**
     * Sets listener before change
     * @param listener 
     */
    onBeforeChange(listener:Function):void {
        this.eventListener.onBeforeChange = listener;
    }

    /**
     * Sets listener after change
     * @param listener 
     */
    onAfterChange(listener:Function):void {
        this.eventListener.onAfterChange = listener;
    }

}
