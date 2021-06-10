/**
 * ComponentFactory
 */
export default abstract class ComponentFactory {
    context:any;
    constructor(context:any){
        if(context){
            this.setContext(context);
        }
    }
    setContext(context:any){
        this.context = context;
    }
    getContext():any {
        return this.context;
    }
    getContextProperty(name:string) {
        if(this.context[name]){
            return this.context[name];
        }
        if((<any>window).hasOwnProperty(name)){
            return (<any>window)[name];
        }
        try {
            return eval.call(this.context, name);
        }catch(e){
            console.error(e,this.context, name);
            throw e;
        }
    }
}
