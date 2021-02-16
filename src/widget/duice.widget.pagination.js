"use strict";
var duice;
(function (duice) {
    let widget;
    (function (widget) {
        class PaginationFactory extends duice.MapComponentFactory {
            getComponent(element) {
                var pagination = new Pagination(element);
                if (element.dataset.duiceSize) {
                    pagination.setSize(Number(element.dataset.duiceSize));
                }
                var bind = element.dataset.duiceBind.split(',');
                pagination.bind(this.getContextProperty(bind[0]), bind[1], bind[2], bind[3]);
                return pagination;
            }
        }
        widget.PaginationFactory = PaginationFactory;
        class Pagination extends duice.MapComponent {
            constructor(ul) {
                super(ul);
                this.lis = new Array();
                this.size = 1;
                this.page = 1;
                this.ul = ul;
                duice.addClass(this.ul, 'duice-widget-pagination');
                var li = this.ul.querySelector('li');
                this.li = li.cloneNode(true);
                li.parentNode.removeChild(li);
            }
            bind(map, pageName, rowsName, totalCountName) {
                this.pageName = pageName;
                this.rowsName = rowsName;
                this.totalCountName = totalCountName;
                super.bind(map, pageName);
            }
            setSize(size) {
                this.size = size;
            }
            setEnable(enable) {
                return;
            }
            update(map, obj) {
                this.page = Number(duice.defaultIfEmpty(map.get(this.pageName), 1));
                var rows = Number(duice.defaultIfEmpty(map.get(this.rowsName), 1));
                var totalCount = Number(duice.defaultIfEmpty(map.get(this.totalCountName), 1));
                var totalPage = Math.max(Math.ceil(totalCount / rows), 1);
                var startPage = Math.floor((this.page - 1) / this.size) * this.size + 1;
                var endPage = Math.min(startPage + this.size - 1, totalPage);
                var _this = this;
                for (var i = this.lis.length - 1; i >= 0; i--) {
                    this.lis[i].parentNode.removeChild(this.lis[i]);
                }
                this.lis.length = 0;
                const prevPage = startPage - 1;
                var prevLi = this.createPageItem(prevPage, '');
                prevLi.style.cursor = 'pointer';
                prevLi.classList.add('duice-widget-pagination__li--prev');
                this.ul.appendChild(prevLi);
                this.lis.push(prevLi);
                if (prevPage < 1) {
                    prevLi.onclick = null;
                    prevLi.style.pointerEvents = 'none';
                    prevLi.style.opacity = '0.5';
                }
                for (var i = startPage; i <= endPage; i++) {
                    const page = i;
                    var li = this.createPageItem(page, String(page));
                    li.style.cursor = 'pointer';
                    this.ul.appendChild(li);
                    this.lis.push(li);
                    if (page === this.page) {
                        li.classList.add('duice-widget-pagination__li--current');
                        li.onclick = null;
                        li.style.pointerEvents = 'none';
                    }
                }
                const nextPage = endPage + 1;
                var nextLi = this.createPageItem(nextPage, '');
                nextLi.style.cursor = 'pointer';
                nextLi.classList.add('duice-widget-pagination__li--next');
                this.ul.appendChild(nextLi);
                this.lis.push(nextLi);
                if (nextPage > totalPage) {
                    nextLi.onclick = null;
                    nextLi.style.pointerEvents = 'none';
                    nextLi.style.opacity = '0.5';
                }
            }
            getValue() {
                return this.page;
            }
            createPageItem(page, text) {
                var li = this.li.cloneNode(true);
                li.classList.add('duice-widget-pagination__li');
                var _this = this;
                var $context = {};
                $context['page'] = Number(page);
                $context['text'] = String(text);
                li = duice.executeExpression(li, $context);
                li.appendChild(document.createTextNode(text));
                return li;
            }
        }
        widget.Pagination = Pagination;
        duice.ComponentDefinitionRegistry.add(new duice.ComponentDefinition('ul[is="duice-widget-pagination"]', duice.widget.PaginationFactory));
    })(widget = duice.widget || (duice.widget = {}));
})(duice || (duice = {}));
