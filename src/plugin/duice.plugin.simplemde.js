"use strict";
var duice;
(function (duice) {
    let plugin;
    (function (plugin) {
        class SimplemdeFactory extends duice.MapComponentFactory {
            getComponent(element) {
                var config = null;
                if (element.dataset.duiceConfig) {
                    config = JSON.parse(element.dataset.duiceConfig.replace(/\'/g, '"'));
                }
                console.log(element);
                var simplemde = new Simplemde(element, config);
                var bind = element.dataset.duiceBind.split(',');
                simplemde.bind(this.getContextProperty(bind[0]), bind[1]);
                return simplemde;
            }
        }
        plugin.SimplemdeFactory = SimplemdeFactory;
        class Simplemde extends duice.MapComponent {
            constructor(div, config) {
                super(div);
                this.div = div;
                this.div.classList.add('duice-plugin-simplemde');
                this.textarea = document.createElement('textarea');
                this.div.appendChild(this.textarea);
                this.config = {
                    element: this.textarea,
                    autoDownloadFontAwesome: false,
                    previewRender: function (plainText, preview) {
                        preview.innerHTML = marked(plainText);
                        preview.querySelectorAll('[class^=language-]').forEach(function (pre) {
                            console.debug(pre);
                            pre.classList.add('line-numbers');
                        });
                        Prism.highlightAll();
                        return preview.innerHTML;
                    },
                    tabSize: 4,
                    renderingConfig: {
                        insertTexts: {
                            horizontalRule: ["", "\n\n-----\n\n"],
                            image: ["![](http://", ")"],
                            link: ["[", "](http://)"],
                            table: ["", "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n"],
                        },
                    }
                };
                if (config) {
                    for (var property in config) {
                        this.config[property] = config[property];
                    }
                }
                this.simpleMDE = new SimpleMDE(this.config);
                var _this = this;
                this.simpleMDE.codemirror.on("blur", function () {
                    console.debug(_this.simpleMDE.value());
                    _this.setChanged();
                    _this.notifyObservers(_this);
                });
            }
            update(map, obj) {
                var value = map.get(this.getName());
                if (!value) {
                    value = '';
                }
                if (value !== this.simpleMDE.value()) {
                    this.simpleMDE.value(value);
                    var codemirror = this.simpleMDE.codemirror;
                    setTimeout(function () {
                        codemirror.refresh();
                    }.bind(codemirror), 0);
                }
                this.setDisable(map.isDisable(this.getName()));
                this.setReadonly(map.isReadonly(this.getName()));
            }
            getValue() {
                var value = this.simpleMDE.value();
                return value;
            }
            setDisable(disable) {
                if (disable) {
                    this.simpleMDE.codemirror.options.readOnly = true;
                }
                else {
                    this.simpleMDE.codemirror.options.readOnly = false;
                }
            }
            setReadonly(readonly) {
                this.simpleMDE.codemirror.options.readOnly = readonly;
            }
        }
        plugin.Simplemde = Simplemde;
        duice.ComponentDefinitionRegistry.add(new duice.ComponentDefinition('div[is="duice-plugin-simplemde"]', duice.plugin.SimplemdeFactory));
    })(plugin = duice.plugin || (duice.plugin = {}));
})(duice || (duice = {}));
