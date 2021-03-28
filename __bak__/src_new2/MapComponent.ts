import Component from './Component';
import Map from './Map';

/**
 * MapComponent
 */
export default abstract class MapComponent extends Component {
    map:Map;
    name:string;
    bind(map:Map, name:string, ...args:any[]):void {
        this.map = map;
        this.name = name;
        this.map.addObserver(this);
        this.addObserver(this.map);
        this.update(this.map, this.map);
    }
    getMap():Map {
        return this.map;
    }
    getName():string {
        return this.name;
    }
    abstract update(map:Map, obj:object):void;
    abstract getValue():any;
}

