"use strict";
var duice;
(function (duice) {
    let plugin;
    (function (plugin) {
        class MarkedFactory extends duice.MapComponentFactory {
            getComponent(element) {
                var marked = new Marked(element);
                var bind = element.dataset.duiceBind.split(',');
                marked.bind(this.getContextProperty(bind[0]), bind[1]);
                return marked;
            }
        }
        plugin.MarkedFactory = MarkedFactory;
        class Marked extends duice.MapComponent {
            constructor(div) {
                super(div);
                this.div = div;
            }
            update(map, obj) {
                this.value = map.get(this.getName());
                this.div.innerHTML = marked(duice.defaultIfEmpty(this.value, ''));
                this.div.querySelectorAll('[class^=language-]').forEach(function (pre) {
                    pre.classList.add('line-numbers');
                });
                Prism.highlightAll();
            }
            getValue() {
                return this.value;
            }
        }
        plugin.Marked = Marked;
        duice.ComponentDefinitionRegistry.add(new duice.ComponentDefinition('div[is="duice-plugin-marked"]', duice.plugin.MarkedFactory));
    })(plugin = duice.plugin || (duice.plugin = {}));
})(duice || (duice = {}));
