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

}