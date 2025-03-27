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
    static setDebugEnabled(value: boolean): void {
        sessionStorage.setItem(`${this.namespace}.traceEnabled`, JSON.stringify(value));
    }

    /**
     * Checks if debug is enabled
     */
    static isDebugEnabled(): boolean {
        const value = sessionStorage.getItem(`${this.namespace}.debugEnabled`);
        return value ? JSON.parse(value) : false;
    }

}