import Mask from './Mask';
import {StringUtils} from '../support/StringUtils'


/**
 * DateMask
 */
export class DateMask implements Mask {
    pattern:string;
    patternRex = /yyyy|yy|MM|dd|HH|hh|mm|ss/gi;
    
    /**
     * Constructor
     * @param pattern
     */
    constructor(pattern?:string){
        this.pattern = pattern;
    }
    
    /**
     * Encodes date string
     * @param string
     */
    encode(string:string):string{
        if(!string){
            return '';
        }
        if(!this.pattern){
            return new Date(string).toString();
        }
        var date = new Date(string);
        string = this.pattern.replace(this.patternRex, function($1:any) {
            switch ($1) {
                case "yyyy": return date.getFullYear();
                case "yy": return StringUtils.lpad(String(date.getFullYear()%1000), 2, '0');
                case "MM": return StringUtils.lpad(String(date.getMonth() + 1), 2, '0');
                case "dd": return StringUtils.lpad(String(date.getDate()), 2, '0');
                case "HH": return StringUtils.lpad(String(date.getHours()), 2, '0');
                case "hh": return StringUtils.lpad(String(date.getHours() <= 12 ? date.getHours() : date.getHours()%12), 2, '0');
                case "mm": return StringUtils.lpad(String(date.getMinutes()), 2, '0');
                case "ss": return StringUtils.lpad(String(date.getSeconds()), 2, '0');
                default: return $1;
            }
        });
        return string;
    }
    
    /**
     * Decodes formatted date string to ISO date string.
     * @param string
     */
    decode(string:string):string{
        if(StringUtils.isEmpty(string)){
            return null;
        }
        if(StringUtils.isEmpty(this.pattern)){
            return new Date(string).toISOString();
        }
        var date = new Date(0,0,0,0,0,0);
        var match;
        while ((match = this.patternRex.exec(this.pattern)) != null) {
            var formatString = match[0];
            var formatIndex = match.index;
            var formatLength = formatString.length;
            var matchValue = string.substr(formatIndex, formatLength);
            matchValue = StringUtils.rpad(matchValue, formatLength,'0');
            switch (formatString) {
            case 'yyyy':
                var fullYear = parseInt(matchValue);
                date.setFullYear(fullYear);
                break;
            case 'yy':
                var yyValue = parseInt(matchValue);
                var yearPrefix = Math.floor(new Date().getFullYear() / 100);
                var fullYear = yearPrefix * 100 + yyValue;
                date.setFullYear(fullYear);
                break;
            case 'MM':
                var monthValue = parseInt(matchValue);
                date.setMonth(monthValue-1);
                break;
            case 'dd':
                var dateValue = parseInt(matchValue);
                date.setDate(dateValue);
                break;
            case 'HH':
                var hoursValue = parseInt(matchValue);
                date.setHours(hoursValue);
                break;
            case 'hh':
                var hoursValue = parseInt(matchValue);
                date.setHours(hoursValue > 12 ? (hoursValue + 12) : hoursValue);
                break;
            case 'mm':
                var minutesValue = parseInt(matchValue);
                date.setMinutes(minutesValue);
                break;
            case 'ss':
                var secondsValue = parseInt(matchValue);
                date.setSeconds(secondsValue);
                break;
            }
        }
        return date.toISOString();
    }
}
