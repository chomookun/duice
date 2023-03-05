namespace duice.mask {

    /**
     * NumberFormat
     * @param scale number
     */
    export class NumberMask implements Mask {

        scale:number = 0;

        /**
         * Constructor
         * @param scale
         */
        constructor(scale?: number){
            this.scale = scale;
        }

        /**
         * Encodes number as format
         * @param number
         */
        encode(number: number): string {
            if(!number || isNaN(Number(number))){
                return '';
            }
            number = Number(number);
            let string = String(number.toFixed(this.scale));
            let reg = /(^[+-]?\d+)(\d{3})/;
            while (reg.test(string)) {
                string = string.replace(reg, '$1' + ',' + '$2');
            }
            return string;
        }

        /**
         * Decodes formatted value as original value
         * @param string
         */
        decode(string: string): number{
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
            number = Number(number.toFixed(this.scale));
            return number;
        }
    }

}

