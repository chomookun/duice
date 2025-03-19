/**
 * Format interface
 */
export interface Format {

    /**
     * Formats value
     * @param value origin value
     */
    format(value: any): any;

    /**
     * Parses value
     * @param value formatted value
     */
    parse(value: any): any;

}