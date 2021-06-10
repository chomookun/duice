import Component from './Component';
import Observable from './Observable';
import Observer from './Observer';

/**
 * Abstract data object
 * extends from Observable and implements Observer interface.
 */
export default abstract class DataObject extends Observable implements Observer {

    available:boolean = true;
    disable:any = new Object();
    disableAll:boolean = false;
    readonly:any = new Object();
    readonlyAll:boolean = false;
    visible:boolean = true;

    /**
     * Updates self data object from observable instance 
     * @param observable
     * @param obj
     */
    abstract update(observable:Observable, obj:object):void;
    
    /**
     * Loads data from JSON object 
     * @param args
     */
    abstract fromJson(...args: any[]):void;
    
    /**
     * Converts data into JSON object.
     * @param args
     * @return JSON object
     */
    abstract toJson(...args: any[]):object;

    /**
     * Clears data
     */
    abstract clear():void;

    /**
     * save point
     */
    abstract save():void;

    /**
     * Restores data as original data.
     */
    abstract reset():void;

    /**
     * Checks original data is changed.
     * @return whether original data is changed
     */
    abstract isDirty():boolean;

    /**
     * Returns whether instance is active 
     */
    isAvailable():boolean {
        return true;
    }

    setDisable(name:string, disable:boolean):void {
        this.disable[name] = disable;
        this.setChanged();
        this.notifyObservers(this);
    }

    /**
     * Sets disable all
     * @param disable 
     */
    setDisableAll(disable:boolean):void {
        this.disableAll = disable;
        for(var name in this.disable){
            this.disable[name] = disable;
        }
        this.setChanged();
        this.notifyObservers(this);
    }

    /**
     * Returns if disabled
     */
    isDisable(name:string):boolean {
        if(this.disable.hasOwnProperty(name)){
            return this.disable[name];
        }else{
            return this.disableAll;
        }
    }

    /**
     * Sets read-only
     * @param name 
     */
    setReadonly(name:string, readonly:boolean):void {
        this.readonly[name] = readonly;
        this.setChanged();
        this.notifyObservers(this);
    }

    /**
     * Sets read-only all
     * @param readonly
     */
    setReadonlyAll(readonly:boolean):void {
        this.readonlyAll = readonly;
        for(var name in this.readonly){
            this.readonly[name] = readonly;
        }
        this.setChanged();
        this.notifyObservers(this);
    }

    /**
     * Returns read-only
     * @param name 
     */
    isReadonly(name:string):boolean {
        if(this.readonly.hasOwnProperty(name)){
            return this.readonly[name];
        }else{
            return this.readonlyAll;
        }
    }

    /**
     * Sets visible flag
     * @param visible 
     */
    setVisible(visible:boolean):void {
        this.visible = visible;
        for(var i = 0, size = this.observers.length; i < size; i++){
            try {
                if(this.observers[i] instanceof Component){
                    var uiComponent = <Component>this.observers[i];
                    uiComponent.setVisible(visible);
                }
            }catch(e){
                console.error(e, this.observers[i]);
            }
        }
    }

    /**
     * Returns is visible.
     */
    isVisible():boolean {
        return this.visible;
    }

}