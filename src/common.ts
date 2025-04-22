import {Configuration} from "./Configuration";
import {ProxyHandler} from "./ProxyHandler";

/**
 * Checks value is Array
 */
export function isArray(value: any): boolean {
    return Array.isArray(value);
}

/**
 * Checks value is Object
 */
export function isObject(value: any): boolean {
    return value != null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Checks value is primitive
 */
export function isPrimitive(value: any): boolean {
    return value !== Object(value);
}

/**
 * Checks object is proxy
 * @param object
 */
export function isProxy(object: any): boolean {
    if (object == null) {
        return false;
    }
    return globalThis.Object.getOwnPropertyDescriptor(object, '_proxy_target_') != null;
}

/**
 * Sets proxy target
 * @param proxy
 * @param target
 */
export function setProxyTarget(proxy: object, target: object): void {
    globalThis.Object.defineProperty(proxy, '_proxy_target_', {
        value: target,
        writable: true
    });
}

/**
 * Gets proxy target
 * @param proxy
 */
export function getProxyTarget(proxy: object): any {
    return globalThis.Object.getOwnPropertyDescriptor(proxy, '_proxy_target_').value;
}

/**
 * Sets proxy handler
 * @param proxy proxy
 * @param proxyHandler proxy handler
 */
export function setProxyHandler(proxy: object, proxyHandler: ProxyHandler<any>): void {
    globalThis.Object.defineProperty(proxy, '_proxy_handler_', {
        value: proxyHandler,
        writable: true
    });
}

/**
 * Gets proxy handler
 * @param proxy proxy
 */
export function getProxyHandler<T extends ProxyHandler<any>>(proxy: object): T {
    return globalThis.Object.getOwnPropertyDescriptor(proxy, '_proxy_handler_').value;
}

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
    // return default
    return undefined;
}

/**
 * Calls function
 * @param fn function
 * @param context context
 * @param args arguments
 */
export function callFunction (fn: Function, context: any, ...args: any[]) {
    try {
        const result = fn.call(context, ...args);
        return (result && typeof result.then === 'function')
            ? result
            : Promise.resolve(result);
    } catch (e) {
        return Promise.reject(e);
    }
}

/**
 * Runs code
 * @param code
 * @param htmlElement
 * @param context
 */
export async function runCode(code: string, htmlElement: HTMLElement, context: object): Promise<boolean> {
    try {
        let args = [];
        let values = [];
        for(let property in context){
            args.push(property);
            values.push(context[property]);
        }
        return await Function(...args, code).call(htmlElement, ...values);
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
export async function runIfCode(htmlElement: HTMLElement, context: object): Promise<boolean> {
    let ifClause = getElementAttribute(htmlElement, 'if');
    if(ifClause) {
        let result = await runCode(ifClause, htmlElement, context);
        if (!result) {
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
export async function runExecuteCode(htmlElement: HTMLElement, context: object): Promise<boolean> {
    let script = getElementAttribute(htmlElement,'execute');
    if(script) {
        return await runCode(script, htmlElement, context);
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
 * Prints debug message
 */
export function debug(...args: any[]): void {
    if(Configuration.isDebugEnabled()){
        console.trace(args);
    }
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
