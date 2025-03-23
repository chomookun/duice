import {Attribute} from "./Attribute";
import {ReadonlyAttribute} from "./ReadonlyAttribute";

export class DisabledAttribute extends Attribute<DisabledAttribute> {

    disabledAll: boolean;

    disabledProperties: Map<string, boolean> = new Map<string, boolean>();

    constructor(parentDisabledAttribute: DisabledAttribute) {
        super(parentDisabledAttribute);
    }

    setDisabledAll(disabledAll: boolean): void {
        this.disabledAll = disabledAll;
    }

    isDisabledAll(): boolean {
        return this.disabledAll;
    }

    setDisabled(property: string, disabled: boolean): void {
        this.disabledProperties.set(property, disabled);
    }

    isDisabled(property: string): boolean {
        if (this.disabledAll) {
            return true;
        }
        if (this.disabledProperties.has(property)) {
            return this.disabledProperties.get(property);
        }
        // find parent
        if (this.parentAttribute) {
            return this.parentAttribute.isDisabled(property);
        }
    }

}