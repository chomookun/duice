
export class Attribute<T> {

    parentAttribute: T;

    /**
     * Constructor
     * @param parentAttribute
     * @protected
     */
    protected constructor(parentAttribute: T) {
        this.parentAttribute = parentAttribute;
    }

}