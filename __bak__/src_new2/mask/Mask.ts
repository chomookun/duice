/**
 * interface Mask
 */
export default interface Mask {
    
    /**
     * Encodes original value as formatted value
     * @param original value
     * @return formatted value
     */
    encode(value:any):any;
    
    /**
     * Decodes formatted value to original value
     * @param formatted value
     * @return original value
     */
    decode(value:any):any;
}