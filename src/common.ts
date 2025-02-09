import {Configuration} from "./Configuration";
import {ObjectHandler} from "./ObjectHandler";
import {ArrayHandler} from "./ArrayHandler";

export function getElementQuerySelector(): string {
    let namespace = Configuration.getNamespace();
    return `*[data-${namespace}-bind]:not([data-${namespace}-id])`;
}

export function markInitialized(container: any): void {
    container.querySelectorAll(getElementQuerySelector()).forEach(element => {
        setElementAttribute(element, 'id', '_');
    });
}

export function findVariable(context: object, name: string): any {
    // find in context
    try {
        let object = new Function(`return this.${name};`).call(context);
        if(object) {
            return object;
        }
    }catch(ignore){}

    // find in global
    try {
        let object = new Function(`return ${name};`).call(null);
        if(object){
            return object;
        }
    }catch(ignore){}

    // throw error
    console.warn(`Object[${name}] is not found`);
    return undefined;
}

export function runCode(code: string, htmlElement: HTMLElement, context: object): boolean {
    try {
        let args = [];
        let values = [];
        for(let property in context){
            args.push(property);
            values.push(context[property]);
        }
        return Function(...args, code).call(htmlElement, ...values);
    }catch(e){
        console.error(code, e);
        throw e;
    }
}

export function runIfCode(htmlElement: HTMLElement, context: object): void {
    let ifClause = getElementAttribute(htmlElement, 'if');
    if(ifClause) {
        let result = runCode(ifClause, htmlElement, context);
        if(!result) {
            htmlElement.hidden = true;
        }else{
            htmlElement.hidden = false;
        }
    }
}

export function runExecuteCode(htmlElement: HTMLElement, context: object): void {
    let script = getElementAttribute(htmlElement,'execute');
    if(script) {
        runCode(script, htmlElement, context);
    }
}

export function hasElementAttribute(htmlElement: HTMLElement, name: string): boolean {
    let namespace = Configuration.getNamespace();
    return htmlElement.hasAttribute(`data-${namespace}-${name}`)
}

export function getElementAttribute(htmlElement: HTMLElement, name: string): string {
    let namespace = Configuration.getNamespace();
    return htmlElement.getAttribute(`data-${namespace}-${name}`);
}

export function setElementAttribute(htmlElement: HTMLElement, name: string, value: string): void {
    let namespace = Configuration.getNamespace();
    htmlElement.setAttribute(`data-${namespace}-${name}`, value);
}

export function assert(condition: any, message?: string): void {
    console.assert(condition, message);
    if(!condition){
        throw new Error(message||'Assertion Failed');
    }
}
