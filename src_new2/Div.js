import MapComponent from './MapComponent';
import { StringUtils } from './support/StringUtils';
export default class Div extends MapComponent {
    constructor(div) {
        super(div);
        this.div = div;
        this.addClass(this.div, 'duice-div');
    }
    update(map, obj) {
        this.removeChildNodes(this.div);
        var value = map.get(this.name);
        value = StringUtils.defaultIfEmpty(value, '');
        this.div.innerHTML = value;
    }
    getValue() {
        var value = this.div.innerHTML;
        return value;
    }
}
