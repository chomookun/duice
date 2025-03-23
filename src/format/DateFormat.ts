import {Format} from "./Format";

/**
 * Date Format
 */
export class DateFormat implements Format {

    pattern:string;

    patternRex = /yyyy|yy|MM|dd|HH|hh|mm|ss/gi;

    /**
     * Constructor
     * @param pattern pattern
     */
    constructor(pattern: string){
        this.pattern = pattern;
    }

    /**
     * Implements format
     * @param string origin value
     */
    format(string: string): string {
        if (!string) {
            return '';
        }
        let date = new Date(string);
        string = this.pattern.replace(this.patternRex, function ($1: any) {
            switch ($1) {
                case "yyyy":
                    return date.getFullYear();
                case "yy":
                    return String(date.getFullYear() % 1000).padStart(2, '0');
                case "MM":
                    return String(date.getMonth() + 1).padStart(2, '0');
                case "dd":
                    return String(date.getDate()).padStart(2, '0');
                case "HH":
                    return String(date.getHours()).padStart(2, '0');
                case "hh":
                    return String(date.getHours() <= 12 ? date.getHours() : date.getHours() % 12).padStart(2, '0');
                case "mm":
                    return String(date.getMinutes()).padStart(2, '0');
                case "ss":
                    return String(date.getSeconds()).padStart(2, '0');
                default:
                    return $1;
            }
        });
        return string;
    }

    /**
     * Implements parse
     * @param string formatted value
     */
    parse(string:string):string{
        if(!string){
            return null;
        }
        let date: Date = new Date(0,0,0,0,0,0);
        let match: RegExpExecArray;
        while ((match = this.patternRex.exec(this.pattern)) != null) {
            let formatString = match[0];
            let formatIndex = match.index;
            let formatLength = formatString.length;
            let matchValue = string.substr(formatIndex, formatLength);
            matchValue = matchValue.padEnd(formatLength,'0');
            switch (formatString) {
                case 'yyyy': {
                    let fullYear = parseInt(matchValue);
                    date.setFullYear(fullYear);
                    break;
                }
                case 'yy': {
                    let yyValue = parseInt(matchValue);
                    let yearPrefix = Math.floor(new Date().getFullYear() / 100);
                    let fullYear = yearPrefix * 100 + yyValue;
                    date.setFullYear(fullYear);
                    break;
                }
                case 'MM': {
                    let monthValue = parseInt(matchValue);
                    date.setMonth(monthValue - 1);
                    break;
                }
                case 'dd': {
                    let dateValue = parseInt(matchValue);
                    date.setDate(dateValue);
                    break;
                }
                case 'HH': {
                    let hoursValue = parseInt(matchValue);
                    date.setHours(hoursValue);
                    break;
                }
                case 'hh': {
                    let hoursValue = parseInt(matchValue);
                    date.setHours(hoursValue > 12 ? (hoursValue + 12) : hoursValue);
                    break;
                }
                case 'mm': {
                    let minutesValue = parseInt(matchValue);
                    date.setMinutes(minutesValue);
                    break;
                }
                case 'ss': {
                    let secondsValue = parseInt(matchValue);
                    date.setSeconds(secondsValue);
                    break;
                }
            }
        }
        // timezone offset
        let tzo = new Date().getTimezoneOffset() * -1,
            dif = tzo >= 0 ? '+' : '-',
            pad = function(num) {
                return (num < 10 ? '0' : '') + num;
            };
        // return iso string
        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            dif + pad(Math.floor(Math.abs(tzo) / 60)) +
            ':' + pad(Math.abs(tzo) % 60);
    }
}