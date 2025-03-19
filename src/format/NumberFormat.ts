import {Format} from "./Format";

export class NumberFormat implements Format {

    scale?:number = 0;

    /**
     * Constructor
     * @param scale scale
     */
    constructor(scale?: number){
        this.scale = scale;
    }

    /**
     * Implements format
     * @param number number
     */
    format(number: number): string {
        if(isNaN(Number(number))){
            return '';
        }
        number = Number(number);
        let string: string;
        if(this.scale > 0) {
            string = String(number.toFixed(this.scale)) as string;
        }else{
            string = String(number) as string;
        }
        let reg = /(^[+-]?\d+)(\d{3})/;
        while (reg.test(string)) {
            string = string.replace(reg, '$1' + ',' + '$2');
        }
        return string;
    }

    /**
     * Implements parse
     * @param string string
     */
    parse(string: string): number|null {
        if(!string) {
            return null;
        }
        if(string.length === 1 && /[+-]/.test(string)){
            string += '0';
        }
        string = string.replace(/,/gi,'');
        if(isNaN(Number(string))){
            throw 'NaN';
        }
        let number = Number(string);
        if(this.scale > 0) {
            number = Number(number.toFixed(this.scale));
        }
        return number;
    }

}