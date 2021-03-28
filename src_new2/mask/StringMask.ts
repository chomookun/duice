import Mask from './Mask';
import {StringUtils} from '../support/StringUtils';

/**
 * duice.StringFormat
 * @param string format
 */
export class StringMask implements Mask {
    pattern:string;

    /**
     * Constructor
     * @param pattern
     */
    constructor(pattern?:string){
        this.pattern = pattern;
    }

    /**
     * encode string as format
     * @param value
     */
    encode(value:any):any{
        if(StringUtils.isEmpty(this.pattern)){
            return value;
        }
        var encodedValue = '';
        var patternChars = this.pattern.split('');
        var valueChars = value.split('');
        var valueCharsPosition = 0;
        for(var i = 0, size = patternChars.length; i < size; i ++ ){
            var patternChar = patternChars[i];
            if(patternChar === '#'){
                encodedValue += StringUtils.defaultIfEmpty(valueChars[valueCharsPosition++], '');
            } else {
                encodedValue += patternChar;
            }
        }
        return encodedValue;
    }
    
    /**
     * decodes string as format
     * @param value
     */
    decode(value:any):any{
        if(StringUtils.isEmpty(this.pattern)){
            return value;
        }
        var decodedValue = '';
        var patternChars = this.pattern.split('');
        var valueChars = value.split('');
        var valueCharsPosition = 0;
        for(var i = 0, size = patternChars.length; i < size; i ++ ){
            var patternChar = patternChars[i];
            if (patternChar === '#') {
                decodedValue += StringUtils.defaultIfEmpty(valueChars[valueCharsPosition++], '');
            } else {
                valueCharsPosition++;
            }
        }
        return decodedValue;
    }
}