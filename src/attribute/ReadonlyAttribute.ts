import {Attribute} from "./Attribute";

export class ReadonlyAttribute extends Attribute<ReadonlyAttribute> {

    readonlyAll: boolean;

    readonlyProperties: Map<string, boolean> = new Map<string, boolean>();

    /**
     * Constructor
     * @param parentAttribute parent attribute
     */
    constructor(parentAttribute: ReadonlyAttribute) {
        super(parentAttribute);
    }

    setReadonlyAll(readonlyAll: boolean): void {
        this.readonlyAll = readonlyAll;
    }

    isReadonlyAll(): boolean {
        return this.readonlyAll;
    }

    setReadonly(property: string, readonly: boolean): void {
        this.readonlyProperties.set(property, readonly);
    }

    isReadonly(property: string): boolean {
        if (this.readonlyAll) {
            return true;
        }
        if (this.readonlyProperties.has(property)) {
            return this.readonlyProperties.get(property);
        }
        // find parent
        if (this.parentAttribute) {
            return this.parentAttribute.isReadonly(property);
        }
    }

}