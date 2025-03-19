import {Format} from "./Format";
import {StringFormat} from "./StringFormat";
import {NumberFormat} from "./NumberFormat";
import {DateFormat} from "./DateFormat";

/**
 * Format Factory
 */
export class FormatFactory {

    /**
     * Gets format instance
     * @param format format
     */
    static getFormat(format: string): Format {
        let name: string;
        let args: string[];
        const match = format.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\((.*)\)$/);
        if (match) {
            name = match[1];
            args = match[2].split(',').map(arg => arg.trim().replace(/^['"]|['"]$/g, ''));
        } else {
            throw new Error(`Invalid format: ${format}`);
        }
        switch(name) {
            case 'string':
                return new StringFormat(args[0]);
            case 'number':
                return new NumberFormat(parseInt(args[0]));
            case 'date':
                return new DateFormat(args[0]);
            default:
                throw new Error(`Unknown format: ${name}`);
        }
    }

}
