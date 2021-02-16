/// <reference path="../duice.ts" />
declare var CKEDITOR:any;

namespace duice {

    export namespace plugin {

        /**
         * duice.plugin.CkeditorFactory
         */
        export class CkeditorFactory extends duice.MapComponentFactory {
            getComponent(element:HTMLDivElement):Ckeditor {
                var config = null;
                if(element.dataset.duiceConfig){
                    config = JSON.parse(element.dataset.duiceConfig.replace(/\'/g, '"'));
                }
                var ckEditor = new Ckeditor(element, config);
                var bind = element.dataset.duiceBind.split(',');
                ckEditor.bind(this.getContextProperty(bind[0]), bind[1]);
                return ckEditor;
            }
        }

        /**
         * duice.plugin.Ckeditor
         */
        export class Ckeditor extends duice.MapComponent {
            div:HTMLDivElement;
            config:object;
            textarea:HTMLTextAreaElement;
            ckeditor:any;
            constructor(div:HTMLDivElement, config:any){
                super(div);
                this.div = div;
                this.div.classList.add('duice-plugin-ckeditor');
                this.config = config;
                this.textarea = document.createElement('textarea');
                this.div.appendChild(this.textarea);
                this.ckeditor = CKEDITOR.replace(this.textarea, this.config);
                var _this = this;
                this.ckeditor.on('blur', function(event:any){
                    if(_this.map.get(_this.getName()) !== _this.getValue()){
                        _this.setChanged();
                        _this.notifyObservers(_this);
                    }
                });
            }
            update(map:duice.Map, obj:object){
                var value = map.get(this.getName());

                // check value is empty
                if(!value){
                    value = '';
                }
                
                // sets value
                if(value !== this.ckeditor.getData()){
                    this.ckeditor.setData(value);
                }
            }
            getValue():any {
                var value = this.ckeditor.getData();
                return value;
            }
        }

        // Adds component definition
        duice.ComponentDefinitionRegistry.add(new duice.ComponentDefinition('div[is="duice-plugin-ckeditor"]', duice.plugin.CkeditorFactory));

    }

}
