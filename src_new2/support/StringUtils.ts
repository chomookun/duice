export var StringUtils = {

    /**
     * Check if value is empty
     * @param value
     * @return whether value is empty
     */
    isEmpty(value:any):boolean {
        if(value === undefined
        || value === null
        || value === ''
        || this.trim(value) === ''
        ){
            return true;
        }else{
            return false;
        }
    },
    
    /**
     * Check if value is not empty
     * @param value
     * @return whether value is not empty
     */
    isNotEmpty(value:any):boolean {
        return !this.isEmpty(value);
    },

    /**
     * Checks if value is empty and return specified value as default
     * @param value to check
     * @param default value if value is empty
     */
    defaultIfEmpty(value:any, defaultValue:any) {
        if(this.isEmpty(value) === true) {
            return defaultValue;
        }else{
            return value;
        }
    },

    /**
     * converts value to left-padded value
     * @param original value
     * @param length to pad
     * @param pading character
     * @return left-padded value
     */
    lpad(value:string, length:number, padChar:string):string {
        for(var i = 0, size = (length-value.length); i < size; i ++ ) {
            value = padChar + value;
        }
        return value;
    },
    
    /**
     * converts value to right-padded value
     * @param original value
     * @param length to pad
     * @param pading character
     * @return right-padded string
     */
    rpad(value:string, length:number, padChar:string):string {
        for(var i = 0, size = (length-value.length); i < size; i ++ ) {
            value = value + padChar;
        }
        return value;
    },

    /**
     * trim string
     * @param value 
     */
    trim(value:string):string {
        return (value + "").trim();
    }

}