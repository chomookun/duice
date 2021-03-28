import MapComponent from './MapComponent';
import {StringUtils} from './support/StringUtils';
import Map from './Map';

/**
 * Div
 */
export default class Div extends MapComponent {
    div:HTMLDivElement;

    /**
     * constructor
     * @param div 
     */
    constructor(div:HTMLDivElement){
        super(div);
        this.div = div;
        this.addClass(this.div, 'duice-div');
    }

    /**
     * update
     * @param map 
     * @param obj 
     */
    update(map:Map, obj:object):void {
        this.removeChildNodes(this.div);
        var value = map.get(this.name);
        value = StringUtils.defaultIfEmpty(value,'');
        this.div.innerHTML = value;
    }
    
    /**
     * getValue
     */
    getValue():string {
        var value = this.div.innerHTML;
        return value;
    }
}

