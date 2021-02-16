"use strict";
var duice;
(function (duice) {
    let plugin;
    (function (plugin) {
        class CkeditorFactory extends duice.MapComponentFactory {
            getComponent(element) {
                var config = null;
                if (element.dataset.duiceConfig) {
                    config = JSON.parse(element.dataset.duiceConfig.replace(/\'/g, '"'));
                }
                var ckEditor = new Ckeditor(element, config);
                var bind = element.dataset.duiceBind.split(',');
                ckEditor.bind(this.getContextProperty(bind[0]), bind[1]);
                return ckEditor;
            }
        }
        plugin.CkeditorFactory = CkeditorFactory;
        class Ckeditor extends duice.MapComponent {
            constructor(div, config) {
                super(div);
                this.div = div;
                this.div.classList.add('duice-plugin-ckeditor');
                this.config = config;
                this.textarea = document.createElement('textarea');
                this.div.appendChild(this.textarea);
                this.ckeditor = CKEDITOR.replace(this.textarea, this.config);
                var _this = this;
                this.ckeditor.on('blur', function (event) {
                    if (_this.map.get(_this.getName()) !== _this.getValue()) {
                        _this.setChanged();
                        _this.notifyObservers(_this);
                    }
                });
            }
            update(map, obj) {
                var value = map.get(this.getName());
                if (!value) {
                    value = '';
                }
                if (value !== this.ckeditor.getData()) {
                    this.ckeditor.setData(value);
                }
            }
            getValue() {
                var value = this.ckeditor.getData();
                return value;
            }
        }
        plugin.Ckeditor = Ckeditor;
        duice.ComponentDefinitionRegistry.add(new duice.ComponentDefinition('div[is="duice-plugin-ckeditor"]', duice.plugin.CkeditorFactory));
    })(plugin = duice.plugin || (duice.plugin = {}));
})(duice || (duice = {}));
