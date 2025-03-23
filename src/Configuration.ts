/**
 * Configuration
 */
export class Configuration {

    static namespace: string = 'duice';

    /**
     * Sets namespace
     * @param value namespace value
     */
    static setNamespace(value:string): void {
        this.namespace = value;
    }

    /**
     * Gets namespace
     */
    static getNamespace(): string {
        return this.namespace;
    }

    /**
     * Sets debug enabled
     * @param value
     */
    static setTraceEnabled(value: boolean): void {
        sessionStorage.setItem(`${this.namespace}.traceEnabled`, JSON.stringify(value));
    }

    /**
     * Checks if debug is enabled
     */
    static isTraceEnabled(): boolean {
        const value = sessionStorage.getItem(`${this.namespace}.traceEnabled`);
        return value ? JSON.parse(value) : false;
    }

}