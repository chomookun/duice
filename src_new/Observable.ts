import Observer from './Observer';

/**
 * Observable
 * Observable abstract class of Observer Pattern
 */
export default abstract class Observable {
    
    observers:Array<Observer> = new Array<Observer>();
    
    changed:boolean = false;
    
    notifyEnable:boolean = true;

    /**
     * Adds observer instance
     * @param observer
     */
    addObserver(observer:Observer):void {
        for(var i = 0, size = this.observers.length; i < size; i++){
            if(this.observers[i] === observer){
                return;
            }
        }
        this.observers.push(observer);
    }
    /**
     * Removes specified observer instance from observer instances
     * @param observer
     */
    removeObserver(observer:Observer):void {
        for(var i = 0, size = this.observers.length; i < size; i++){
            if(this.observers[i] === observer){
                this.observers.splice(i,1);
                return;
            }
        }
    }
    /**
     * Notifies changes to observers
     * @param obj object to transfer to observer
     */
    notifyObservers(obj:object):void {
        if(this.notifyEnable && this.hasChanged()){
            this.clearUnavailableObservers();
            for(var i = 0, size = this.observers.length; i < size; i++){
                if(this.observers[i] !== obj){
                    try {
                        this.observers[i].update(this, obj);
                    }catch(e){
                        console.error(e, this.observers[i]);
                    }
                }
            }
            this.clearChanged();
        }
    }

    /**
     * Suspends notify
     */
    suspendNotify():void {
        this.notifyEnable = false;
    }

    /**
     * Resumes notify
     */
    resumeNotify():void {
        this.notifyEnable = true;
    }

    /**
     * Sets changed flag 
     */
    setChanged():void {
        this.changed = true;
    }
    /**
     * Returns changed flag
     */
    hasChanged():boolean {
        return this.changed;
    }
    /**
     * Clears changed flag
     */
    clearChanged():void {
        this.changed = false;
    }
    /**
     * Clears unavailable observers to prevent memory leak
     */
    clearUnavailableObservers():void {
        for(var i = this.observers.length - 1; i >= 0; i--){
            try {
                if(this.observers[i].isAvailable() === false){
                    this.observers.splice(i,1);
                }
            }catch(e){
                console.error(e, this.observers[i]);
            }
        }
    }
}