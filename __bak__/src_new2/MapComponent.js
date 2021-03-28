import Component from './Component';
export default class MapComponent extends Component {
    bind(map, name, ...args) {
        this.map = map;
        this.name = name;
        this.map.addObserver(this);
        this.addObserver(this.map);
        this.update(this.map, this.map);
    }
    getMap() {
        return this.map;
    }
    getName() {
        return this.name;
    }
}
