/// <reference path="../duice.ts" />

namespace duice {

    export namespace widget {

        /**
         * duice.PaginationFactory
         */
        export class PaginationFactory extends MapComponentFactory {
            getComponent(element:HTMLUListElement):Pagination {
                var pagination = new Pagination(element);
                if(element.dataset.duiceSize){
                    pagination.setSize(Number(element.dataset.duiceSize));
                }
                var bind = element.dataset.duiceBind.split(',');
                pagination.bind(this.getContextProperty(bind[0]), bind[1], bind[2], bind[3]);
                return pagination;
            }
        }

        /**
         * duice.Pagination
         */
        export class Pagination extends MapComponent {
            ul:HTMLUListElement;
            li:HTMLLIElement;
            lis:Array<HTMLLIElement> = new Array<HTMLLIElement>();
            pageName:string;
            rowsName:string;
            totalCountName:string;
            size:number = 1;
            page:number = 1;
            constructor(ul:HTMLUListElement) {
                super(ul);
                this.ul = ul;
                addClass(this.ul, 'duice-widget-pagination');
                
                // clones li
                var li = this.ul.querySelector('li');
                this.li = <HTMLLIElement>li.cloneNode(true);
                li.parentNode.removeChild(li);
            }
            bind(map:duice.Map, pageName:string, rowsName:string, totalCountName:string):void {
                this.pageName = pageName;
                this.rowsName = rowsName;
                this.totalCountName = totalCountName;
                super.bind(map,pageName);
            }
            setSize(size:number):void{
                this.size = size;
            }
            setEnable(enable:boolean):void {
                return;
            }
            update(map:duice.Map, obj:object):void {
                this.page = Number(defaultIfEmpty(map.get(this.pageName),1));
                var rows = Number(defaultIfEmpty(map.get(this.rowsName),1));
                var totalCount = Number(defaultIfEmpty(map.get(this.totalCountName),1));
                var totalPage = Math.max(Math.ceil(totalCount/rows),1);
                var startPage = Math.floor((this.page-1)/this.size)*this.size + 1;
                var endPage = Math.min(startPage+this.size-1, totalPage);
                var _this = this;
                
                // clear lis
                for(var i = this.lis.length-1; i >= 0; i --){
                    this.lis[i].parentNode.removeChild(this.lis[i]);
                }
                this.lis.length = 0;
                
                // creates previous item
                const prevPage = startPage - 1;
                var prevLi = this.createPageItem(prevPage,'');
                prevLi.style.cursor = 'pointer';
                prevLi.classList.add('duice-widget-pagination__li--prev');
                this.ul.appendChild(prevLi);
                this.lis.push(prevLi);
                if(prevPage < 1){
                    prevLi.onclick = null;
                    prevLi.style.pointerEvents = 'none';
                    prevLi.style.opacity = '0.5';
                }
                
                // creates page items
                for(var i = startPage; i <= endPage; i ++ ){
                    const page = i;
                    var li = this.createPageItem(page, String(page));
                    li.style.cursor = 'pointer';
                    this.ul.appendChild(li);
                    this.lis.push(li);
                    if(page === this.page){
                        li.classList.add('duice-widget-pagination__li--current');
                        li.onclick = null;
                        li.style.pointerEvents = 'none';
                    }
                }
                
                // creates next item
                const nextPage = endPage + 1;
                var nextLi = this.createPageItem(nextPage,'');
                nextLi.style.cursor = 'pointer';
                nextLi.classList.add('duice-widget-pagination__li--next');
                this.ul.appendChild(nextLi);
                this.lis.push(nextLi);
                if(nextPage > totalPage){
                    nextLi.onclick = null;
                    nextLi.style.pointerEvents = 'none';
                    nextLi.style.opacity = '0.5';
                }
            }
            getValue():any {
                return this.page;
            } 
            createPageItem(page:number, text:string):HTMLLIElement {
                var li:HTMLLIElement = <HTMLLIElement>this.li.cloneNode(true);
                li.classList.add('duice-widget-pagination__li');
                var _this = this;
                var $context:any = {};
                $context['page'] = Number(page);
                $context['text'] = String(text);
                li = executeExpression(li, $context);
                li.appendChild(document.createTextNode(text));
                return li;
            }
        }

        // Adds components
        ComponentDefinitionRegistry.add(new ComponentDefinition('ul[is="duice-widget-pagination"]', duice.widget.PaginationFactory));
    }

}