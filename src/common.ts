import {Configuration} from "./Configuration";
import {ObjectProxyHandler} from "./ObjectProxyHandler";
import {ArrayProxyHandler} from "./ArrayProxyHandler";

/**
 * Gets element query selector
 */
export function getElementQuerySelector(): string {
    let namespace = Configuration.getNamespace();
    return `*[data-${namespace}-bind]:not([data-${namespace}-id])`;
}

/**
 * Marks element as initialized
 * @param container container
 */
export function markInitialized(container: any): void {
    container.querySelectorAll(getElementQuerySelector()).forEach(element => {
        setElementAttribute(element, 'id', '_');
    });
}

/**
 * Finds variable in current scope
 * @param context current context
 * @param name variable name
 */
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

/**
 * Runs code
 * @param code
 * @param htmlElement
 * @param context
 */
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

/**
 * Runs if code
 * @param htmlElement html element
 * @param context current context
 */
export function runIfCode(htmlElement: HTMLElement, context: object): boolean {
    let ifClause = getElementAttribute(htmlElement, 'if');
    if(ifClause) {
        let result = runCode(ifClause, htmlElement, context);
        if(!result) {
            htmlElement.hidden = true;
        }else{
            htmlElement.hidden = false;
        }
        return result;
    }
    return true;
}

/**
 * Runs execute code
 * @param htmlElement html element
 * @param context current context
 */
export function runExecuteCode(htmlElement: HTMLElement, context: object): boolean {
    let script = getElementAttribute(htmlElement,'execute');
    if(script) {
        return runCode(script, htmlElement, context);
    }
    return null;
}

/**
 * Checks if element has attribute
 * @param htmlElement html element
 * @param name attribute name
 */
export function hasElementAttribute(htmlElement: HTMLElement, name: string): boolean {
    let namespace = Configuration.getNamespace();
    return htmlElement.hasAttribute(`data-${namespace}-${name}`)
}

/**
 * Gets element attribute
 * @param htmlElement html element
 * @param name attribute name
 */
export function getElementAttribute(htmlElement: HTMLElement, name: string): string {
    let namespace = Configuration.getNamespace();
    return htmlElement.getAttribute(`data-${namespace}-${name}`);
}

/**
 * Sets element attribute
 * @param htmlElement html element
 * @param name attribute name
 * @param value attribute value
 */
export function setElementAttribute(htmlElement: HTMLElement, name: string, value: string): void {
    let namespace = Configuration.getNamespace();
    htmlElement.setAttribute(`data-${namespace}-${name}`, value);
}

/**
 * Asserts condition
 * @param condition condition
 * @param message assertion message
 */
export function assert(condition: any, message?: string): void {
    console.assert(condition, message);
    if(!condition){
        throw new Error(message||'Assertion Failed');
    }
}
