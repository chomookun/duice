var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var duice;
(function (duice) {
    /**
     * Observable
     */
    class Observable {
        constructor() {
            this.observers = [];
            this.notifyEnabled = true;
        }
        /**
         * addObserver
         * @param observer
         */
        addObserver(observer) {
            this.observers.push(observer);
        }
        /**
         * removeObserver
         * @param observer
         */
        removeObserver(observer) {
            for (let i = 0, size = this.observers.length; i < size; i++) {
                if (this.observers[i] === observer) {
                    this.observers.splice(i, 1);
                    return;
                }
            }
        }
        /**
         * suspend notify
         */
        suspendNotify() {
            this.notifyEnabled = false;
        }
        /**
         * resume notify
         */
        resumeNotify() {
            this.notifyEnabled = true;
        }
        /**
         * notifyObservers
         * @param event
         */
        notifyObservers(event) {
            if (this.notifyEnabled) {
                this.observers.forEach(observer => {
                    observer.update(this, event);
                });
            }
        }
    }
    duice.Observable = Observable;
})(duice || (duice = {}));
///<reference path="Observable.ts"/>
var duice;
(function (duice) {
    /**
     * element abstract class
     */
    class Element extends duice.Observable {
        /**
         * constructor
         * @param htmlElement
         * @param context
         * @protected
         */
        constructor(htmlElement, context) {
            super();
            this.htmlElement = htmlElement;
            this.context = context;
            duice.setElementAttribute(this.htmlElement, 'id', duice.generateId());
        }
        /**
         * return HTML element
         */
        getHtmlElement() {
            return this.htmlElement;
        }
        /**
         * return context
         */
        getContext() {
            return this.context;
        }
        /**
         * set data
         * @param dataName
         */
        setData(dataName) {
            var _a;
            this.data = duice.findVariable(this.context, dataName);
            let dataHandler = (_a = globalThis.Object.getOwnPropertyDescriptor(this.data, '_handler_')) === null || _a === void 0 ? void 0 : _a.value;
            duice.assert(dataHandler, 'DataHandler is not found');
            this.addObserver(dataHandler);
            dataHandler.addObserver(this);
        }
        /**
         * return data
         */
        getData() {
            return this.data;
        }
        /**
         * executes script if exists
         */
        executeScript() {
            let script = duice.getElementAttribute(this.htmlElement, 'script');
            if (script) {
                duice.executeScript(script, this.htmlElement, this.context);
            }
        }
    }
    duice.Element = Element;
})(duice || (duice = {}));
///<reference path="Element.ts"/>
var duice;
(function (duice) {
    /**
     * array element class
     */
    class ArrayElement extends duice.Element {
        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement, context) {
            super(htmlElement.cloneNode(true), context);
            this.slot = document.createElement('slot');
            this.editable = false;
            this.rowHtmlElements = [];
            // replace with slot for position
            htmlElement.replaceWith(this.slot);
            // mark initialized (not using after clone as templates)
            duice.markInitialized(htmlElement);
        }
        /**
         * set array
         * @param arrayName
         */
        setArray(arrayName) {
            this.setData(arrayName);
        }
        /**
         * set loop
         * @param loop
         */
        setLoop(loop) {
            this.loop = loop;
        }
        /**
         * set editable
         * @param editable
         */
        setEditable(editable) {
            this.editable = editable;
        }
        /**
         * render
         */
        render() {
            var _a;
            let _this = this;
            let arrayProxy = this.getData();
            // reset row elements
            this.rowHtmlElements.forEach(rowElement => {
                rowElement.parentNode.removeChild(rowElement);
            });
            this.rowHtmlElements.length = 0;
            // loop
            if (this.loop) {
                let loopArgs = this.loop.split(',');
                let itemName = loopArgs[0].trim();
                let statusName = (_a = loopArgs[1]) === null || _a === void 0 ? void 0 : _a.trim();
                for (let index = 0; index < arrayProxy.length; index++) {
                    // context
                    let context = globalThis.Object.assign({}, this.context);
                    context[itemName] = arrayProxy[index];
                    context[statusName] = new duice.ObjectProxy({
                        index: index,
                        count: index + 1,
                        size: arrayProxy.length,
                        first: (index === 0),
                        last: (arrayProxy.length == index + 1)
                    });
                    // clones row elements
                    let rowHtmlElement = this.getHtmlElement().cloneNode(true);
                    duice.setElementAttribute(rowHtmlElement, 'index', index.toString());
                    // editable
                    if (this.editable) {
                        rowHtmlElement.setAttribute('draggable', 'true');
                        rowHtmlElement.addEventListener('dragstart', function (e) {
                            let fromIndex = duice.getElementAttribute(this, 'index');
                            e.dataTransfer.setData("text", fromIndex);
                        });
                        rowHtmlElement.addEventListener('dragover', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        });
                        rowHtmlElement.addEventListener('drop', function (e) {
                            return __awaiter(this, void 0, void 0, function* () {
                                e.preventDefault();
                                e.stopPropagation();
                                let fromIndex = parseInt(e.dataTransfer.getData('text'));
                                let toIndex = parseInt(duice.getElementAttribute(this, 'index'));
                                let rowIndexChangeEvent = new duice.event.RowMoveEvent(_this, fromIndex, toIndex);
                                _this.notifyObservers(rowIndexChangeEvent);
                            });
                        });
                    }
                    // initializes row element
                    duice.initialize(rowHtmlElement, context);
                    this.rowHtmlElements.push(rowHtmlElement);
                    // insert before slot
                    this.slot.parentNode.insertBefore(rowHtmlElement, this.slot);
                }
            }
            // execute script
            this.executeScript();
        }
        /**
         * update
         * @param observable
         * @param event
         */
        update(observable, event) {
            console.debug('ArrayElement.update', observable, event);
            if (observable instanceof duice.ArrayHandler) {
                this.render();
            }
        }
    }
    duice.ArrayElement = ArrayElement;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * element factory abstract class
     */
    class ElementFactory {
    }
    duice.ElementFactory = ElementFactory;
})(duice || (duice = {}));
///<reference path="ElementFactory.ts"/>
var duice;
(function (duice) {
    /**
     * array element factory class
     */
    class ArrayElementFactory extends duice.ElementFactory {
        /**
         * adds factory instance
         * @param elementFactory
         */
        static addInstance(elementFactory) {
            this.instances.push(elementFactory);
        }
        /**
         * return factory instance
         * @param htmlElement
         */
        static getInstance(htmlElement) {
            for (let componentFactory of this.instances) {
                if (componentFactory.support(htmlElement)) {
                    return componentFactory;
                }
            }
            if (this.defaultInstance.support(htmlElement)) {
                return this.defaultInstance;
            }
            return null;
        }
        /**
         * check support
         * @param htmlElement
         */
        support(htmlElement) {
            if (duice.hasElementAttribute(htmlElement, 'array')) {
                if (this.doSupport(htmlElement)) {
                    return true;
                }
            }
            return false;
        }
        /**
         * support template method
         * @param htmlElement
         */
        doSupport(htmlElement) {
            return true;
        }
        /**
         * creates array component
         * @param htmlElement
         * @param context
         */
        createElement(htmlElement, context) {
            let component = new duice.ArrayElement(htmlElement, context);
            // array
            let array = duice.getElementAttribute(htmlElement, 'array');
            component.setArray(array);
            // loop
            let loop = duice.getElementAttribute(htmlElement, 'loop');
            if (loop) {
                component.setLoop(loop);
            }
            // editable
            let editable = duice.getElementAttribute(htmlElement, 'editable');
            if (editable) {
                component.setEditable(editable.toLowerCase() === 'true');
            }
            // returns
            return component;
        }
    }
    ArrayElementFactory.defaultInstance = new ArrayElementFactory();
    ArrayElementFactory.instances = [];
    duice.ArrayElementFactory = ArrayElementFactory;
})(duice || (duice = {}));
///<Reference path="Observable.ts"/>
///<Reference path="Observer.ts"/>
var duice;
(function (duice) {
    /**
     * data handler class
     */
    class DataHandler extends duice.Observable {
        /**
         * constructor
         * @protected
         */
        constructor() {
            super();
            this.readonlyAll = false;
            this.readonly = new Set();
            this.listenerEnabled = true;
        }
        /**
         * set target
         * @param target
         */
        setTarget(target) {
            this.target = target;
        }
        /**
         * return target
         */
        getTarget() {
            return this.target;
        }
        /**
         * set readonly all
         * @param readonly
         */
        setReadonlyAll(readonly) {
            this.readonlyAll = readonly;
            if (readonly === false) {
                this.readonly.clear();
            }
            this.notifyObservers(new duice.event.Event(this));
        }
        /**
         * set readonly
         * @param property
         * @param readonly
         */
        setReadonly(property, readonly) {
            if (readonly) {
                this.readonly.add(property);
            }
            else {
                this.readonly.delete(property);
            }
            this.notifyObservers(new duice.event.Event(this));
        }
        /**
         * return whether readonly is
         * @param property
         */
        isReadonly(property) {
            return this.readonlyAll || this.readonly.has(property);
        }
        /**
         * suspends listener
         */
        suspendListener() {
            this.listenerEnabled = false;
        }
        /**
         * resumes listener
         */
        resumeListener() {
            this.listenerEnabled = true;
        }
        /**
         * executes listener
         * @param listener
         * @param event
         */
        checkListener(listener, event) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.listenerEnabled && listener) {
                    let result = yield listener.call(this.getTarget(), event);
                    if (result == false) {
                        return false;
                    }
                }
                return true;
            });
        }
    }
    duice.DataHandler = DataHandler;
})(duice || (duice = {}));
var duice;
(function (duice) {
    var event;
    (function (event) {
        /**
         * Event
         */
        class Event {
            /**
             * constructor
             * @param source
             */
            constructor(source) {
                this.source = source;
            }
        }
        event.Event = Event;
    })(event = duice.event || (duice.event = {}));
})(duice || (duice = {}));
///<reference path="Event.ts"/>
var duice;
(function (duice) {
    var event;
    (function (event) {
        /**
         * RowMoveEvent
         */
        class RowMoveEvent extends event.Event {
            /**
             * constructor
             * @param source
             * @param fromIndex
             * @param toIndex
             */
            constructor(source, fromIndex, toIndex) {
                super(source);
                this.fromIndex = fromIndex;
                this.toIndex = toIndex;
            }
            /**
             * getFromIndex
             */
            getFromIndex() {
                return this.fromIndex;
            }
            /**
             * getToIndex
             */
            getToIndex() {
                return this.toIndex;
            }
        }
        event.RowMoveEvent = RowMoveEvent;
    })(event = duice.event || (duice.event = {}));
})(duice || (duice = {}));
///<reference path="DataHandler.ts"/>
///<reference path="event/RowMoveEvent.ts"/>
var duice;
(function (duice) {
    /**
     * array handler class
     */
    class ArrayHandler extends duice.DataHandler {
        /**
         * constructor
         */
        constructor() {
            super();
        }
        /**
         * get
         * @param target
         * @param property
         * @param receiver
         */
        get(target, property, receiver) {
            console.debug("ArrayHandler.get", '|', target, '|', property, '|', receiver);
            let _this = this;
            const value = target[property];
            if (typeof value === 'function') {
                // push, unshift
                if (['push', 'unshift'].includes(property)) {
                    return function () {
                        return __awaiter(this, arguments, void 0, function* () {
                            let index;
                            if (property === 'push') {
                                index = receiver['length'];
                            }
                            else if (property === 'unshift') {
                                index = 0;
                            }
                            let rows = [];
                            for (let i in arguments) {
                                rows.push(arguments[i]);
                            }
                            yield target.insertRow(index, ...rows);
                            return _this.target.length;
                        });
                    };
                }
                // splice
                if (['splice'].includes(property)) {
                    return function () {
                        return __awaiter(this, arguments, void 0, function* () {
                            // parse arguments
                            let start = arguments[0];
                            let deleteCount = arguments[1];
                            let deleteRows = [];
                            for (let i = start; i < (start + deleteCount); i++) {
                                deleteRows.push(target[i]);
                            }
                            let insertRows = [];
                            for (let i = 2; i < arguments.length; i++) {
                                insertRows.push(arguments[i]);
                            }
                            // delete rows
                            if (deleteCount > 0) {
                                yield target.deleteRow(start, deleteCount);
                            }
                            // insert rows
                            if (insertRows.length > 0) {
                                yield target.insertRow(start, ...insertRows);
                            }
                            // returns deleted rows
                            return deleteRows;
                        });
                    };
                }
                // pop, shift
                if (['pop', 'shift'].includes(property)) {
                    return function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            let index;
                            if (property === 'pop') {
                                index = receiver['length'] - 1;
                            }
                            else if (property === 'shift') {
                                index = 0;
                            }
                            let rows = [target[index]];
                            yield target.deleteRow(index);
                            return rows;
                        });
                    };
                }
                // bind
                return value.bind(target);
            }
            // return
            return value;
        }
        /**
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target, property, value) {
            console.debug("ArrayHandler.set", '|', target, '|', property, '|', value);
            Reflect.set(target, property, value);
            if (property === 'length') {
                this.notifyObservers(new duice.event.Event(this));
            }
            return true;
        }
        /**
         * update
         * @param observable
         * @param event
         */
        update(observable, event) {
            return __awaiter(this, void 0, void 0, function* () {
                console.debug("ArrayHandler.update", observable, event);
                // instance is array component
                if (observable instanceof duice.ArrayElement) {
                    if (event instanceof duice.event.RowMoveEvent) {
                        let object = this.getTarget().splice(event.getFromIndex(), 1)[0];
                        this.getTarget().splice(event.getToIndex(), 0, object);
                    }
                }
                // notify observers
                this.notifyObservers(event);
            });
        }
    }
    duice.ArrayHandler = ArrayHandler;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * array proxy class
     */
    class ArrayProxy extends Array {
        /**
         * constructor
         */
        constructor(array) {
            super();
            // array handler
            let arrayHandler = new duice.ArrayHandler();
            // copy array elements
            if (globalThis.Array.isArray(array)) {
                array.forEach((object, index) => {
                    let objectProxy = new duice.ObjectProxy(object);
                    duice.ObjectProxy.getHandler(objectProxy).addObserver(arrayHandler);
                    this[index] = objectProxy;
                });
            }
            // create proxy
            let arrayProxy = new Proxy(this, arrayHandler);
            arrayHandler.setTarget(arrayProxy);
            // set property
            ArrayProxy.setHandler(arrayProxy, arrayHandler);
            ArrayProxy.setTarget(arrayProxy, this);
            // returns
            return arrayProxy;
        }
        /**
         * assign
         * @param arrayProxy
         * @param array
         */
        static assign(arrayProxy, array) {
            console.log('ArrayProxy.assign', arrayProxy, array);
            let arrayHandler = this.getHandler(arrayProxy);
            try {
                // suspend
                arrayHandler.suspendListener();
                arrayHandler.suspendNotify();
                // clears elements
                arrayProxy.length = 0;
                // creates elements
                array.forEach((object, index) => {
                    let objectProxy = new duice.ObjectProxy(object);
                    duice.ObjectProxy.getHandler(objectProxy).addObserver(arrayHandler);
                    arrayProxy[index] = objectProxy;
                    // add listener
                    duice.ObjectProxy.onPropertyChanging(objectProxy, arrayHandler.propertyChangingListener);
                    duice.ObjectProxy.onPropertyChanged(objectProxy, arrayHandler.propertyChangedListener);
                });
            }
            finally {
                // resume
                arrayHandler.resumeListener();
                arrayHandler.resumeNotify();
            }
            // notify observers
            arrayHandler.notifyObservers(new duice.event.Event(this));
        }
        /**
         * setTarget
         * @param arrayProxy
         * @param target
         */
        static setTarget(arrayProxy, target) {
            globalThis.Object.defineProperty(arrayProxy, '_target_', {
                value: target,
                writable: true
            });
        }
        /**
         * getTarget
         * @param arrayProxy
         */
        static getTarget(arrayProxy) {
            return globalThis.Object.getOwnPropertyDescriptor(arrayProxy, '_target_').value;
        }
        /**
         * setHandler
         * @param arrayProxy
         * @param arrayHandler
         */
        static setHandler(arrayProxy, arrayHandler) {
            globalThis.Object.defineProperty(arrayProxy, '_handler_', {
                value: arrayHandler,
                writable: true
            });
        }
        /**
         * getHandler
         * @param arrayProxy
         */
        static getHandler(arrayProxy) {
            let handler = globalThis.Object.getOwnPropertyDescriptor(arrayProxy, '_handler_').value;
            duice.assert(handler, 'handler is not found');
            return handler;
        }
        /**
         * onPropertyChanging
         * @param arrayProxy
         * @param listener
         */
        static onPropertyChanging(arrayProxy, listener) {
            this.getHandler(arrayProxy).propertyChangingListener = listener;
            arrayProxy.forEach(objectProxy => {
                duice.ObjectProxy.getHandler(objectProxy).propertyChangingListener = listener;
            });
        }
        /**
         * onPropertyChanged
         * @param arrayProxy
         * @param listener
         */
        static onPropertyChanged(arrayProxy, listener) {
            this.getHandler(arrayProxy).propertyChangedListener = listener;
            arrayProxy.forEach(objectProxy => {
                duice.ObjectProxy.getHandler(objectProxy).propertyChangedListener = listener;
            });
        }
        /**
         * onRowInserting
         * @param arrayProxy
         * @param listener
         */
        static onRowInserting(arrayProxy, listener) {
            this.getHandler(arrayProxy).rowInsertingListener = listener;
        }
        /**
         * onRowInserted
         * @param arrayProxy
         * @param listener
         */
        static onRowInserted(arrayProxy, listener) {
            this.getHandler(arrayProxy).rowInsertedListener = listener;
        }
        /**
         * onRowDeleting
         * @param arrayProxy
         * @param listener
         */
        static onRowDeleting(arrayProxy, listener) {
            this.getHandler(arrayProxy).rowDeletingListener = listener;
        }
        /**
         * onRowDeleted
         * @param arrayProxy
         * @param listener
         */
        static onRowDeleted(arrayProxy, listener) {
            this.getHandler(arrayProxy).rowDeletedListener = listener;
        }
        /**
         * setReadonly
         * @param arrayProxy
         * @param property
         * @param readonly
         */
        static setReadonly(arrayProxy, property, readonly) {
            this.getHandler(arrayProxy).setReadonly(property, readonly);
        }
        /**
         * isReadonly
         * @param arrayProxy
         * @param property
         */
        static isReadonly(arrayProxy, property) {
            return this.getHandler(arrayProxy).isReadonly(property);
        }
        /**
         * setReadonlyAll
         * @param arrayProxy
         * @param readonly
         */
        static setReadonlyAll(arrayProxy, readonly) {
            this.getHandler(arrayProxy).setReadonlyAll(readonly);
            for (let index = 0; index >= this.length; index++) {
                duice.ObjectProxy.setReadonlyAll(this[index], readonly);
            }
        }
        /**
         * insertRow
         * @param index
         * @param rows
         */
        insertRow(index, ...rows) {
            return __awaiter(this, void 0, void 0, function* () {
                let arrayHandler = ArrayProxy.getHandler(this);
                let proxyTarget = ArrayProxy.getTarget(this);
                rows.forEach((object, index) => {
                    rows[index] = new duice.ObjectProxy(object);
                });
                let event = new duice.event.RowInsertEvent(this, index, rows);
                if (yield arrayHandler.checkListener(arrayHandler.rowInsertingListener, event)) {
                    proxyTarget.splice(index, 0, ...rows);
                    yield arrayHandler.checkListener(arrayHandler.rowInsertedListener, event);
                    arrayHandler.notifyObservers(event);
                }
            });
        }
        /**
         * deleteRow
         * @param index
         * @param size
         */
        deleteRow(index, size) {
            return __awaiter(this, void 0, void 0, function* () {
                let arrayHandler = ArrayProxy.getHandler(this);
                let proxyTarget = ArrayProxy.getTarget(this);
                let sliceBegin = index;
                let sliceEnd = (size ? index + size : index + 1);
                let rows = proxyTarget.slice(sliceBegin, sliceEnd);
                let event = new duice.event.RowDeleteEvent(this, index, rows);
                if (yield arrayHandler.checkListener(arrayHandler.rowDeletingListener, event)) {
                    let spliceStart = index;
                    let spliceDeleteCount = (size ? size : 1);
                    proxyTarget.splice(spliceStart, spliceDeleteCount);
                    yield arrayHandler.checkListener(arrayHandler.rowDeletedListener, event);
                    arrayHandler.notifyObservers(event);
                }
            });
        }
        /**
         * appendRow
         * @param rows
         */
        appendRow(...rows) {
            return __awaiter(this, void 0, void 0, function* () {
                let index = this.length;
                return this.insertRow(index, ...rows);
            });
        }
    }
    duice.ArrayProxy = ArrayProxy;
})(duice || (duice = {}));
///<reference path="Observable.ts"/>
var duice;
(function (duice) {
    /**
     * custom element
     */
    class CustomElement extends duice.Element {
        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement, context) {
            super(htmlElement, context);
        }
        /**
         * set object data
         * @param objectName
         */
        setObject(objectName) {
            this.setData(objectName);
        }
        /**
         * set array data
         * @param arrayName
         */
        setArray(arrayName) {
            this.setData(arrayName);
        }
        /**
         * render
         */
        render() {
            // removes child
            this.htmlElement.innerHTML = '';
            // create template element
            let templateLiteral = this.doRender(this.getData()).trim();
            let templateElement = document.createElement('template');
            templateElement.innerHTML = templateLiteral;
            let htmlElement = templateElement.content.firstChild.cloneNode(true);
            if (this.htmlElement.shadowRoot) {
                this.htmlElement.shadowRoot.appendChild(htmlElement);
            }
            else {
                this.htmlElement.appendChild(htmlElement);
            }
            // add style if exists
            let styleLiteral = this.doStyle(this.getData());
            if (styleLiteral) {
                let style = document.createElement('style');
                style.textContent = styleLiteral.trim();
                this.htmlElement.appendChild(style);
            }
            // initializes
            let context = {};
            Object.assign(context, this.context);
            context['object'] = this.data;
            context['array'] = this.data;
            duice.initialize(this.htmlElement, context);
            // execute script
            this.executeScript();
        }
        /**
         * setting style
         * @param data
         */
        doStyle(data) {
            return null;
        }
        /**
         * update
         * @param observable
         * @param event
         */
        update(observable, event) {
            if (observable instanceof duice.DataHandler) {
                this.render();
            }
        }
    }
    duice.CustomElement = CustomElement;
})(duice || (duice = {}));
///<reference path="ElementFactory.ts"/>
var duice;
(function (duice) {
    /**
     * custom component factory
     */
    class CustomElementFactory extends duice.ElementFactory {
        /**
         * constructor
         * @param tagName
         * @param elementType
         */
        constructor(tagName, elementType) {
            super();
            this.tagName = tagName;
            this.elementType = elementType;
        }
        /**
         * adds factory instance
         * @param elementFactory
         */
        static addInstance(elementFactory) {
            // register custom html element
            customElements.define(elementFactory.tagName, class extends HTMLElement {
            });
            // register instance
            this.instances.push(elementFactory);
        }
        /**
         * returns factory instance to be supported
         * @param htmlElement
         */
        static getInstance(htmlElement) {
            for (let componentFactory of this.instances) {
                if (componentFactory.support(htmlElement)) {
                    return componentFactory;
                }
            }
            return null;
        }
        /**
         * creates component
         * @param htmlElement
         * @param context
         */
        createElement(htmlElement, context) {
            // creates instance
            let element = Reflect.construct(this.elementType, [htmlElement, context]);
            // set object
            let objectName = duice.getElementAttribute(htmlElement, 'object');
            if (objectName) {
                element.setObject(objectName);
            }
            // set array
            let arrayName = duice.getElementAttribute(htmlElement, 'array');
            if (arrayName) {
                element.setArray(arrayName);
            }
            // returns
            return element;
        }
        /**
         * checks supported elements
         * @param htmlElement
         */
        support(htmlElement) {
            return (htmlElement.tagName.toLowerCase() === this.tagName);
        }
    }
    CustomElementFactory.instances = [];
    duice.CustomElementFactory = CustomElementFactory;
})(duice || (duice = {}));
var duice;
(function (duice) {
    var format;
    (function (format_1) {
        class FormatFactory {
            /**
             * return format instance
             * @param format
             */
            static getFormat(format) {
                if (format.startsWith('string')) {
                    format = format.replace('string', 'StringFormat');
                }
                if (format.startsWith('number')) {
                    format = format.replace('number', 'NumberFormat');
                }
                if (format.startsWith('date')) {
                    format = format.replace('date', 'DateFormat');
                }
                return Function(`return new duice.format.${format};`).call(null);
            }
        }
        format_1.FormatFactory = FormatFactory;
    })(format = duice.format || (duice.format = {}));
})(duice || (duice = {}));
///<reference path="Observable.ts"/>
///<reference path="./format/FormatFactory.ts"/>
///<reference path="Element.ts"/>
var duice;
(function (duice) {
    /**
     * object element class
     */
    class ObjectElement extends duice.Element {
        /**
         * constructor
         * @param htmlElement
         * @param context
         */
        constructor(htmlElement, context) {
            super(htmlElement, context);
        }
        /**
         * set object
         * @param objectName
         */
        setObject(objectName) {
            this.setData(objectName);
        }
        /**
         * set property
         * @param property
         */
        setProperty(property) {
            this.property = property;
        }
        /**
         * return property
         */
        getProperty() {
            return this.property;
        }
        /**
         * set format
         * @param format
         */
        setFormat(format) {
            this.format = duice.format.FormatFactory.getFormat(format);
        }
        /**
         * return format
         */
        getFormat() {
            return this.format;
        }
        /**
         * render
         */
        render() {
            if (this.property) {
                let objectHandler = duice.ObjectProxy.getHandler(this.getData());
                // set value
                let value = objectHandler.getValue(this.property);
                this.setValue(value);
                // set readonly
                let readonly = objectHandler.isReadonly(this.property);
                this.setReadonly(readonly);
            }
            // executes script
            this.executeScript();
        }
        /**
         * update event received
         * @param observable
         * @param event
         */
        update(observable, event) {
            console.debug('ObjectElement.update', observable, event);
            // ObjectHandler
            if (observable instanceof duice.ObjectHandler) {
                if (this.property) {
                    // set value
                    this.setValue(observable.getValue(this.property));
                    // set readonly
                    this.setReadonly(observable.isReadonly(this.property));
                }
                // executes script
                this.executeScript();
            }
        }
        /**
         * set value
         * @param value
         */
        setValue(value) {
            value = this.getFormat() ? this.getFormat().encode(value) : value;
            this.htmlElement.innerText = value;
        }
        /**
         * return value
         */
        getValue() {
            let value = this.htmlElement.innerText;
            value = this.getFormat() ? this.getFormat().decode(value) : value;
            return value;
        }
        /**
         * set readonly
         * @param readonly
         */
        setReadonly(readonly) {
            // no-op
        }
        /**
         * return index
         */
        getIndex() {
            let index = duice.getElementAttribute(this.htmlElement, 'index');
            if (index) {
                return Number(index);
            }
        }
    }
    duice.ObjectElement = ObjectElement;
})(duice || (duice = {}));
///<reference path="ElementFactory.ts"/>
var duice;
(function (duice) {
    /**
     * object element factory class
     */
    class ObjectElementFactory extends duice.ElementFactory {
        /**
         * adds factory instance to registry
         * @param elementFactory
         */
        static addInstance(elementFactory) {
            this.instances.push(elementFactory);
        }
        /**
         * returns supported instance
         * @param htmlElement
         */
        static getInstance(htmlElement) {
            for (let componentFactory of this.instances) {
                if (componentFactory.support(htmlElement)) {
                    return componentFactory;
                }
            }
            if (this.defaultInstance.support(htmlElement)) {
                return this.defaultInstance;
            }
            return null;
        }
        /**
         * check support
         * @param htmlElement
         */
        support(htmlElement) {
            if (duice.hasElementAttribute(htmlElement, 'object')) {
                if (this.doSupport(htmlElement)) {
                    return true;
                }
            }
            return false;
        }
        /**
         * support template method
         * @param htmlElement
         */
        doSupport(htmlElement) {
            return true;
        }
        /**
         * create component
         * @param element
         * @param context
         */
        createElement(element, context) {
            // creates element
            let component = this.doCreateElement(element, context);
            // object
            let object = duice.getElementAttribute(element, 'object');
            component.setObject(object);
            // property
            let property = duice.getElementAttribute(element, 'property');
            if (property) {
                component.setProperty(property);
            }
            // format
            let format = duice.getElementAttribute(element, 'format');
            if (format) {
                component.setFormat(format);
            }
            // returns
            return component;
        }
        /**
         * template method to create component
         * @param htmlElement
         * @param context
         */
        doCreateElement(htmlElement, context) {
            return new duice.ObjectElement(htmlElement, context);
        }
    }
    ObjectElementFactory.defaultInstance = new ObjectElementFactory();
    ObjectElementFactory.instances = [];
    duice.ObjectElementFactory = ObjectElementFactory;
})(duice || (duice = {}));
var duice;
(function (duice) {
    var event;
    (function (event) {
        /**
         * PropertyChangeEvent
         */
        class PropertyChangeEvent extends event.Event {
            /**
             * constructor
             * @param source
             * @param property
             * @param value
             * @param index
             */
            constructor(source, property, value, index) {
                super(source);
                this.property = property;
                this.value = value;
                this.index = index;
            }
            /**
             * getProperty
             */
            getProperty() {
                return this.property;
            }
            /**
             * getValue
             */
            getValue() {
                return this.value;
            }
            /**
             * getIndex
             */
            getIndex() {
                return this.index;
            }
        }
        event.PropertyChangeEvent = PropertyChangeEvent;
    })(event = duice.event || (duice.event = {}));
})(duice || (duice = {}));
///<reference path="Observable.ts"/>
///<reference path="Observer.ts"/>
///<reference path="DataHandler.ts"/>
///<reference path="event/PropertyChangeEvent.ts"/>
var duice;
(function (duice) {
    /**
     * object handler class
     */
    class ObjectHandler extends duice.DataHandler {
        /**
         * constructor
         */
        constructor() {
            super();
        }
        /**
         * get
         * @param target
         * @param property
         * @param receiver
         */
        get(target, property, receiver) {
            console.debug("ObjectHandler.get", target, property, receiver);
            return Reflect.get(target, property, receiver);
        }
        /**
         * set
         * @param target
         * @param property
         * @param value
         */
        set(target, property, value) {
            console.debug("ObjectHandler.set", target, property, value);
            // change value
            Reflect.set(target, property, value);
            // notify
            let event = new duice.event.PropertyChangeEvent(this, property, value);
            this.notifyObservers(event);
            // returns
            return true;
        }
        /**
         * update
         * @param observable
         * @param event
         */
        update(observable, event) {
            return __awaiter(this, void 0, void 0, function* () {
                console.debug("ObjectHandler.update", observable, event);
                // Element
                if (observable instanceof duice.ObjectElement) {
                    let property = observable.getProperty();
                    let value = observable.getValue();
                    if (yield this.checkListener(this.propertyChangingListener, event)) {
                        this.setValue(property, value);
                        yield this.checkListener(this.propertyChangedListener, event);
                    }
                }
                // notify
                this.notifyObservers(event);
            });
        }
        /**
         * getValue
         * @param property
         */
        getValue(property) {
            property = property.replace('.', '?.');
            return new Function(`return this.${property};`).call(this.getTarget());
        }
        /**
         * setValue
         * @param property
         * @param value
         */
        setValue(property, value) {
            new Function('value', `this.${property} = value;`).call(this.getTarget(), value);
        }
    }
    duice.ObjectHandler = ObjectHandler;
})(duice || (duice = {}));
var duice;
(function (duice) {
    /**
     * object proxy class
     */
    class ObjectProxy extends Object {
        /**
         * constructor
         */
        constructor(object) {
            super();
            // object handler
            let objectHandler = new duice.ObjectHandler();
            // copy property
            for (let name in object) {
                let value = object[name];
                // value is array
                if (duice.ArrayProxy.isArray(value)) {
                    let arrayProxy = new duice.ArrayProxy(value);
                    duice.ArrayProxy.getHandler(arrayProxy).addObserver(objectHandler);
                    this[name] = arrayProxy;
                    continue;
                }
                // value is object
                if (value != null && typeof value === 'object') {
                    let objectProxy = new ObjectProxy(value);
                    ObjectProxy.getHandler(objectProxy).addObserver(objectHandler);
                    this[name] = objectProxy;
                    continue;
                }
                // value is primitive
                this[name] = value;
            }
            // delete not exists property
            for (let name in this) {
                if (!ObjectProxy.keys(object).includes(name)) {
                    delete this[name];
                }
            }
            // creates proxy
            let objectProxy = new Proxy(this, objectHandler);
            objectHandler.setTarget(objectProxy);
            // set property
            ObjectProxy.setHandler(objectProxy, objectHandler);
            ObjectProxy.setTarget(objectProxy, this);
            // returns
            return objectProxy;
        }
        /**
         * assign
         * @param objectProxy
         * @param object
         */
        static assign(objectProxy, object) {
            let objectHandler = this.getHandler(objectProxy);
            try {
                // suspend
                objectHandler.suspendListener();
                objectHandler.suspendNotify();
                // loop object properties
                for (let name in object) {
                    let value = object[name];
                    // source value is array
                    if (duice.ArrayProxy.isArray(value)) {
                        if (duice.ArrayProxy.isArray(objectProxy[name])) {
                            duice.ArrayProxy.assign(objectProxy[name], value);
                        }
                        else {
                            objectProxy[name] = new duice.ArrayProxy(value);
                        }
                        continue;
                    }
                    // source value is object
                    if (typeof value === 'object') {
                        if (typeof objectProxy[name] === 'object') {
                            ObjectProxy.assign(objectProxy[name], value);
                        }
                        else {
                            let objectProxy = new ObjectProxy(value);
                            ObjectProxy.getHandler(objectProxy).addObserver(objectHandler);
                            objectProxy[name] = objectProxy;
                        }
                        continue;
                    }
                    // source value is primitive
                    objectProxy[name] = value;
                }
            }
            finally {
                // resume
                objectHandler.resumeListener();
                objectHandler.resumeNotify();
            }
            // notify observers
            objectHandler.notifyObservers(new duice.event.Event(this));
        }
        /**
         * setTarget
         * @param objectProxy
         * @param target
         */
        static setTarget(objectProxy, target) {
            globalThis.Object.defineProperty(objectProxy, '_target_', {
                value: target,
                writable: true
            });
        }
        /**
         * getTarget
         * @param objectProxy
         */
        static getTarget(objectProxy) {
            return globalThis.Object.getOwnPropertyDescriptor(objectProxy, '_target_').value;
        }
        /**
         * setHandler
         * @param objectProxy
         * @param objectHandler
         */
        static setHandler(objectProxy, objectHandler) {
            globalThis.Object.defineProperty(objectProxy, '_handler_', {
                value: objectHandler,
                writable: true
            });
        }
        /**
         * getHandler
         * @param objectProxy
         */
        static getHandler(objectProxy) {
            let handler = globalThis.Object.getOwnPropertyDescriptor(objectProxy, '_handler_').value;
            duice.assert(handler, 'handler is not found');
            return handler;
        }
        /**
         * onPropertyChanging
         * @param objectProxy
         * @param listener
         */
        static onPropertyChanging(objectProxy, listener) {
            this.getHandler(objectProxy).propertyChangingListener = listener;
        }
        /**
         * onPropertyChanged
         * @param objectProxy
         * @param listener
         */
        static onPropertyChanged(objectProxy, listener) {
            this.getHandler(objectProxy).propertyChangedListener = listener;
        }
        /**
         * setReadonly
         * @param objectProxy
         * @param property
         * @param readonly
         */
        static setReadonly(objectProxy, property, readonly) {
            this.getHandler(objectProxy).setReadonly(property, readonly);
        }
        /**
         * isReadonly
         * @param objectProxy
         * @param property
         */
        static isReadonly(objectProxy, property) {
            return this.getHandler(objectProxy).isReadonly(property);
        }
        /**
         * setReadonlyAll
         * @param objectProxy
         * @param readonly
         */
        static setReadonlyAll(objectProxy, readonly) {
            let objectHandler = this.getHandler(objectProxy);
            objectHandler.setReadonlyAll(readonly);
            for (let property in this) {
                objectHandler.setReadonly(property, readonly);
            }
        }
    }
    duice.ObjectProxy = ObjectProxy;
})(duice || (duice = {}));
///<reference path="CustomElementFactory.ts"/>
var duice;
(function (duice) {
    let namespace = 'duice';
    /**
     * sets namespace
     * @param value
     */
    function setNamespace(value) {
        globalThis[value] = value;
        namespace = value;
    }
    duice.setNamespace = setNamespace;
    /**
     * returns alias of namespace
     */
    function getNamespace() {
        return namespace;
    }
    duice.getNamespace = getNamespace;
    /**
     * returns query selector for element scan
     */
    function getElementQuerySelector() {
        return [
            `*[data-${getNamespace()}-object]:not([data-${getNamespace()}-id])`,
            `*[data-${getNamespace()}-array]:not([data-${getNamespace()}-id])`,
        ].join(',');
    }
    duice.getElementQuerySelector = getElementQuerySelector;
    /**
     * initializes
     * @param container
     * @param context
     */
    function initialize(container, context) {
        // scan DOM tree
        container.querySelectorAll(getElementQuerySelector()).forEach(htmlElement => {
            var _a, _b, _c, _d, _e;
            if (!hasElementAttribute(htmlElement, 'id')) {
                try {
                    // custom element
                    let customElementFactory = duice.CustomElementFactory.getInstance(htmlElement);
                    if (customElementFactory) {
                        (_a = customElementFactory.createElement(htmlElement, context)) === null || _a === void 0 ? void 0 : _a.render();
                        return;
                    }
                    // array element
                    if (hasElementAttribute(htmlElement, 'array')) {
                        (_c = (_b = duice.ArrayElementFactory.getInstance(htmlElement)) === null || _b === void 0 ? void 0 : _b.createElement(htmlElement, context)) === null || _c === void 0 ? void 0 : _c.render();
                        return;
                    }
                    // object element
                    if (hasElementAttribute(htmlElement, 'object')) {
                        (_e = (_d = duice.ObjectElementFactory.getInstance(htmlElement)) === null || _d === void 0 ? void 0 : _d.createElement(htmlElement, context)) === null || _e === void 0 ? void 0 : _e.render();
                        return;
                    }
                }
                catch (e) {
                    console.error(e, htmlElement, container, JSON.stringify(context));
                }
            }
        });
    }
    duice.initialize = initialize;
    /**
     * markInitialized
     * @param container
     */
    function markInitialized(container) {
        container.querySelectorAll(getElementQuerySelector()).forEach(element => {
            setElementAttribute(element, 'id', generateId());
        });
    }
    duice.markInitialized = markInitialized;
    /**
     * finds variable by name
     * @param context
     * @param name
     */
    function findVariable(context, name) {
        // find in context
        try {
            let object = new Function(`return this.${name};`).call(context);
            if (object) {
                return object;
            }
        }
        catch (ignore) { }
        // find in global
        try {
            let object = new Function(`return ${name};`).call(null);
            if (object) {
                return object;
            }
        }
        catch (ignore) { }
        // throw error
        console.warn(`Object[${name}] is not found`);
        return undefined;
    }
    duice.findVariable = findVariable;
    /**
     * generates component ID
     */
    function generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    duice.generateId = generateId;
    /**
     * checks has component attribute
     * @param htmlElement
     * @param name
     */
    function hasElementAttribute(htmlElement, name) {
        return htmlElement.hasAttribute(`data-${getNamespace()}-${name}`);
    }
    duice.hasElementAttribute = hasElementAttribute;
    /**
     * returns element attribute
     * @param htmlElement
     * @param name
     */
    function getElementAttribute(htmlElement, name) {
        return htmlElement.getAttribute(`data-${getNamespace()}-${name}`);
    }
    duice.getElementAttribute = getElementAttribute;
    /**
     * set component attribute
     * @param htmlElement
     * @param name
     * @param value
     */
    function setElementAttribute(htmlElement, name, value) {
        htmlElement.setAttribute(`data-${getNamespace()}-${name}`, value);
    }
    duice.setElementAttribute = setElementAttribute;
    /**
     * execute script
     * @param script
     * @param thisArg
     * @param context
     */
    function executeScript(script, thisArg, context) {
        try {
            let args = [];
            let values = [];
            for (let property in context) {
                args.push(property);
                values.push(context[property]);
            }
            return Function(...args, script).call(thisArg, ...values);
        }
        catch (e) {
            console.error(script, e);
            throw e;
        }
    }
    duice.executeScript = executeScript;
    /**
     * assert
     * @param condition
     * @param message
     */
    function assert(condition, message) {
        console.assert(condition, message);
        if (!condition) {
            throw new Error(message || 'Assertion Failed');
        }
    }
    duice.assert = assert;
    /**
     * alert
     * @param message
     */
    function alert(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new duice.dialog.AlertDialog(message).open();
        });
    }
    duice.alert = alert;
    /**
     * confirm
     * @param message
     */
    function confirm(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new duice.dialog.ConfirmDialog(message).open();
        });
    }
    duice.confirm = confirm;
    /**
     * prompt
     * @param message
     */
    function prompt(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new duice.dialog.PromptDialog(message).open();
        });
    }
    duice.prompt = prompt;
    /**
     * open dialog
     * @param dialogElement
     */
    function openDialog(dialogElement) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new duice.dialog.Dialog(dialogElement).open();
        });
    }
    duice.openDialog = openDialog;
    /**
     * Gets cookie value
     * @param name
     */
    function getCookie(name) {
        let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value ? value[2] : null;
    }
    duice.getCookie = getCookie;
    /**
     * Sets cookie value
     * @param name
     * @param value
     * @param day
     */
    function setCookie(name, value, day) {
        let date = new Date();
        date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000);
        document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
    }
    duice.setCookie = setCookie;
    /**
     * Deletes cookie
     * @param name
     */
    function deleteCookie(name) {
        setCookie(name, '', -1);
    }
    duice.deleteCookie = deleteCookie;
    /**
     * fetch
     * @param url
     * @param options
     * @param _bypass
     */
    function fetch(url, options, _bypass) {
        if (!options) {
            options = {};
        }
        if (!options.headers) {
            options.headers = {};
        }
        // csrf token
        ['XSRF-TOKEN', 'CSRF-TOKEN'].forEach(tokenName => {
            let tokenValue = getCookie(tokenName);
            if (tokenValue) {
                options.headers[`X-${tokenName}`] = tokenValue;
            }
        });
        options.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        options.headers['Pragma'] = 'no-cache';
        options.headers['Expires'] = '0';
        return globalThis.fetch(url, options)
            .then(function (response) {
            return __awaiter(this, void 0, void 0, function* () {
                console.debug(response);
                // bypass
                if (_bypass) {
                    return response;
                }
                // checks response
                if (response.ok) {
                    return response;
                }
                else {
                    let responseJson = yield response.json();
                    console.warn(responseJson);
                    let message = responseJson.message;
                    alert(message).then();
                    throw Error(message);
                }
            });
        })
            .catch((error) => {
            throw Error(error);
        });
    }
    duice.fetch = fetch;
    /**
     * defines custom element
     * @param tagName
     * @param elementType
     */
    function defineElement(tagName, elementType) {
        let customElementFactory = new duice.CustomElementFactory(tagName, elementType);
        duice.CustomElementFactory.addInstance(customElementFactory);
    }
    duice.defineElement = defineElement;
    /**
     * listens DOMContentLoaded event
     */
    if (globalThis.document) {
        // initialize elements
        document.addEventListener("DOMContentLoaded", event => {
            initialize(document.documentElement, {});
        });
    }
})(duice || (duice = {}));
var duice;
(function (duice) {
    var dialog;
    (function (dialog) {
        /**
         * Dialog
         */
        class Dialog {
            /**
             * constructor
             * @param dialogElement
             */
            constructor(dialogElement) {
                this.dialogElement = dialogElement;
                let _this = this;
                // dialog fixed style
                this.dialogElement.style.position = 'absolute';
                this.dialogElement.style.left = '0';
                this.dialogElement.style.right = '0';
                this.dialogElement.style.margin = 'auto';
                this.dialogElement.style.height = 'fit-content';
                this.dialogElement.style.borderStyle = 'solid';
                this.dialogElement.style.borderWidth = '1px';
                // header
                this.header = document.createElement('span');
                this.dialogElement.appendChild(this.header);
                this.header.style.display = 'block';
                this.header.style.position = 'absolute';
                this.header.style.left = '0';
                this.header.style.top = '0';
                this.header.style.width = '100%';
                this.header.style.height = '1rem';
                this.header.style.cursor = 'pointer';
                // drag
                this.dialogElement.style.margin = '0px';
                this.header.onmousedown = function (event) {
                    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                    pos3 = event.clientX;
                    pos4 = event.clientY;
                    window.document.onmouseup = function (event) {
                        window.document.onmousemove = null;
                        window.document.onmouseup = null;
                    };
                    window.document.onmousemove = function (event) {
                        pos1 = pos3 - event.clientX;
                        pos2 = pos4 - event.clientY;
                        pos3 = event.clientX;
                        pos4 = event.clientY;
                        _this.dialogElement.style.left = (_this.dialogElement.offsetLeft - pos1) + 'px';
                        _this.dialogElement.style.top = (_this.dialogElement.offsetTop - pos2) + 'px';
                    };
                };
                // creates close button
                this.closeButton = document.createElement('span');
                this.closeButton.style.position = 'absolute';
                this.closeButton.style.top = '0';
                this.closeButton.style.right = '0';
                this.closeButton.style.cursor = 'pointer';
                this.closeButton.style.width = '1rem';
                this.closeButton.style.height = '1rem';
                this.closeButton.style.lineHeight = '1rem';
                this.closeButton.style.margin = '1px';
                this.closeButton.style.textAlign = 'center';
                this.closeButton.style.fontFamily = 'sans-serif';
                this.closeButton.style.fontSize = '0.75rem';
                this.closeButton.appendChild(document.createTextNode('X'));
                this.closeButton.addEventListener('click', event => {
                    _this.close();
                });
                this.dialogElement.appendChild(this.closeButton);
                // on resize event
                window.addEventListener('resize', function (event) {
                    _this.moveToCenterPosition();
                });
            }
            /**
             * moveToCenterPosition
             */
            moveToCenterPosition() {
                let computedStyle = window.getComputedStyle(this.dialogElement);
                let computedWidth = parseInt(computedStyle.getPropertyValue('width').replace(/px/gi, ''));
                let computedHeight = parseInt(computedStyle.getPropertyValue('height').replace(/px/gi, ''));
                let scrollX = window.scrollX;
                let scrollY = window.scrollY;
                this.dialogElement.style.left = Math.max(0, window.innerWidth / 2 - computedWidth / 2) + scrollX + 'px';
                this.dialogElement.style.top = Math.max(0, window.innerHeight / 3 - computedHeight / 3) + scrollY + 'px';
            }
            /**
             * getDialogElement
             */
            getDialogElement() {
                return this.dialogElement;
            }
            /**
             * Shows modal
             */
            show() {
                // saves current scroll position
                let scrollX = window.scrollX;
                let scrollY = window.scrollY;
                // show dialog modal
                window.document.body.appendChild(this.dialogElement);
                this.dialogElement.showModal();
                // restore previous scroll position
                window.scrollTo(scrollX, scrollY);
                // adjusting position
                this.moveToCenterPosition();
            }
            /**
             * Hides modal
             */
            hide() {
                // closes modal
                this.dialogElement.close();
            }
            /**
             * open
             */
            open() {
                return __awaiter(this, void 0, void 0, function* () {
                    // show modal
                    this.show();
                    // creates promise
                    let _this = this;
                    this.promise = new Promise(function (resolve, reject) {
                        _this.promiseResolve = resolve;
                        _this.promiseReject = reject;
                    });
                    return this.promise;
                });
            }
            /**
             * close
             */
            close() {
                this.reject();
            }
            /**
             * confirm
             * @param args
             */
            resolve(...args) {
                this.hide();
                this.promiseResolve(...args);
            }
            /**
             * close
             * @param args
             */
            reject(...args) {
                this.hide();
                this.promiseReject(...args);
            }
        }
        dialog.Dialog = Dialog;
    })(dialog = duice.dialog || (duice.dialog = {}));
})(duice || (duice = {}));
///<reference path="Dialog.ts"/>
var duice;
(function (duice) {
    var dialog;
    (function (dialog) {
        /**
         * AlertDialog
         */
        class AlertDialog extends dialog.Dialog {
            /**
             * constructor
             * @param message
             */
            constructor(message) {
                super(document.createElement('dialog'));
                this.getDialogElement().style.padding = '1rem';
                this.getDialogElement().style.minWidth = '15rem';
                this.getDialogElement().style.textAlign = 'center';
                // message pre
                this.messagePre = document.createElement('pre');
                this.messagePre.innerHTML = message;
                this.getDialogElement().appendChild(this.messagePre);
                // confirm button
                this.confirmButton = document.createElement('button');
                this.confirmButton.appendChild(document.createTextNode('Yes'));
                this.confirmButton.style.width = '3rem';
                this.confirmButton.addEventListener('click', event => {
                    this.confirm();
                });
                this.getDialogElement().appendChild(this.confirmButton);
            }
            /**
             * open
             */
            open() {
                let promise = super.open();
                this.confirmButton.focus();
                return promise;
            }
            /**
             * confirm
             */
            confirm() {
                this.resolve();
                this.getDialogElement().parentNode.removeChild(this.getDialogElement());
            }
            /**
             * close
             */
            close() {
                this.resolve();
                this.getDialogElement().parentNode.removeChild(this.getDialogElement());
            }
        }
        dialog.AlertDialog = AlertDialog;
    })(dialog = duice.dialog || (duice.dialog = {}));
})(duice || (duice = {}));
///<reference path="Dialog.ts"/>
var duice;
(function (duice) {
    var dialog;
    (function (dialog) {
        /**
         * Confirm
         */
        class ConfirmDialog extends dialog.Dialog {
            /**
             * constructor
             * @param message
             */
            constructor(message) {
                super(document.createElement('dialog'));
                this.getDialogElement().style.padding = '1rem';
                this.getDialogElement().style.minWidth = '15rem';
                this.getDialogElement().style.textAlign = 'center';
                // message pre
                this.messagePre = document.createElement('pre');
                this.messagePre.innerHTML = message;
                this.getDialogElement().appendChild(this.messagePre);
                // confirm button
                this.confirmButton = document.createElement('button');
                this.confirmButton.appendChild(document.createTextNode('Yes'));
                this.confirmButton.style.width = '3rem';
                this.confirmButton.addEventListener('click', event => {
                    this.confirm();
                });
                this.getDialogElement().appendChild(this.confirmButton);
                // cancel button
                this.cancelButton = document.createElement('button');
                this.cancelButton.appendChild(document.createTextNode('No'));
                this.cancelButton.style.width = '3rem';
                this.cancelButton.addEventListener('click', event => {
                    this.cancel();
                });
                this.getDialogElement().appendChild(this.cancelButton);
            }
            /**
             * open
             */
            open() {
                let promise = super.open();
                this.confirmButton.focus();
                return promise;
            }
            /**
             * confirm
             */
            confirm() {
                this.resolve(true);
                this.getDialogElement().parentNode.removeChild(this.getDialogElement());
            }
            /**
             * cancel
             */
            cancel() {
                this.resolve(false);
                this.getDialogElement().parentNode.removeChild(this.getDialogElement());
            }
            /**
             * close
             */
            close() {
                this.resolve(false);
                this.getDialogElement().parentNode.removeChild(this.getDialogElement());
            }
        }
        dialog.ConfirmDialog = ConfirmDialog;
    })(dialog = duice.dialog || (duice.dialog = {}));
})(duice || (duice = {}));
///<reference path="Dialog.ts"/>
var duice;
(function (duice) {
    var dialog;
    (function (dialog) {
        /**
         * PromptDialog
         */
        class PromptDialog extends dialog.Dialog {
            /**
             * constructor
             * @param message
             */
            constructor(message) {
                super(document.createElement('dialog'));
                this.getDialogElement().style.padding = '1rem';
                this.getDialogElement().style.minWidth = '15rem';
                this.getDialogElement().style.textAlign = 'center';
                // message pre
                this.messagePre = document.createElement('pre');
                this.messagePre.innerHTML = message;
                this.getDialogElement().appendChild(this.messagePre);
                // prompt input
                this.promptInput = document.createElement('input');
                this.promptInput.style.display = 'block';
                this.promptInput.style.textAlign = 'center';
                this.promptInput.style.margin = '0.75rem 0';
                this.promptInput.style.width = '100%';
                this.getDialogElement().appendChild(this.promptInput);
                // confirm button
                this.confirmButton = document.createElement('button');
                this.confirmButton.appendChild(document.createTextNode('Yes'));
                this.confirmButton.style.width = '3rem';
                this.confirmButton.addEventListener('click', event => {
                    this.confirm(this.promptInput.value);
                });
                this.getDialogElement().appendChild(this.confirmButton);
                // cancel button
                this.cancelButton = document.createElement('button');
                this.cancelButton.appendChild(document.createTextNode('No'));
                this.cancelButton.style.width = '3rem';
                this.cancelButton.addEventListener('click', event => {
                    this.cancel();
                });
                this.getDialogElement().appendChild(this.cancelButton);
            }
            /**
             * open
             */
            open() {
                let promise = super.open();
                this.promptInput.focus();
                return promise;
            }
            /**
             * confirm
             */
            confirm(value) {
                this.resolve(value);
                this.getDialogElement().parentNode.removeChild(this.getDialogElement());
            }
            /**
             * cancel
             */
            cancel() {
                this.resolve();
                this.getDialogElement().parentNode.removeChild(this.getDialogElement());
            }
            /**
             * close
             */
            close() {
                this.resolve();
                this.getDialogElement().parentNode.removeChild(this.getDialogElement());
            }
        }
        dialog.PromptDialog = PromptDialog;
    })(dialog = duice.dialog || (duice.dialog = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var component;
    (function (component) {
        /**
         * input element component
         */
        class InputElement extends duice.ObjectElement {
            /**
             * constructor
             * @param element
             * @param context
             */
            constructor(element, context) {
                super(element, context);
                // adds change listener
                this.getHtmlElement().addEventListener('change', e => {
                    let event = new duice.event.PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                    this.notifyObservers(event);
                }, true);
            }
            /**
             * set value
             * @param value
             */
            setValue(value) {
                if (value) {
                    value = this.getFormat() ? this.getFormat().encode(value) : value;
                }
                else {
                    value = '';
                }
                this.getHtmlElement().value = value;
            }
            /**
             * return value
             */
            getValue() {
                let value = this.getHtmlElement().value;
                if (value) {
                    value = this.getFormat() ? this.getFormat().decode(value) : value;
                }
                else {
                    value = null;
                }
                return value;
            }
            /**
             * set readonly
             * @param readonly
             */
            setReadonly(readonly) {
                this.getHtmlElement().readOnly = readonly;
            }
        }
        component.InputElement = InputElement;
    })(component = duice.component || (duice.component = {}));
})(duice || (duice = {}));
///<reference path="InputElement.ts"/>
var duice;
(function (duice) {
    var component;
    (function (component) {
        /**
         * InputCheckboxElement
         */
        class InputCheckboxElement extends component.InputElement {
            /**
             * constructor
             * @param element
             * @param context
             */
            constructor(element, context) {
                super(element, context);
                this.trueValue = true;
                this.falseValue = false;
                // true false value
                let trueValue = duice.getElementAttribute(this.getHtmlElement(), 'true-value');
                this.trueValue = trueValue ? trueValue : this.trueValue;
                let falseValue = duice.getElementAttribute(this.getHtmlElement(), 'false-value');
                this.falseValue = falseValue ? falseValue : this.falseValue;
            }
            /**
             * set value
             * @param value
             */
            setValue(value) {
                if (value === this.trueValue) {
                    this.getHtmlElement().checked = true;
                }
                else {
                    this.htmlElement.checked = false;
                }
            }
            /**
             * get value
             */
            getValue() {
                if (this.htmlElement.checked) {
                    return this.trueValue;
                }
                else {
                    return this.falseValue;
                }
            }
            /**
             * set readonly
             * @param readonly
             */
            setReadonly(readonly) {
                if (readonly) {
                    this.getHtmlElement().style.pointerEvents = 'none';
                }
                else {
                    this.getHtmlElement().style.pointerEvents = '';
                }
            }
        }
        component.InputCheckboxElement = InputCheckboxElement;
    })(component = duice.component || (duice.component = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var component;
    (function (component) {
        /**
         * input element factory class
         */
        class InputElementFactory extends duice.ObjectElementFactory {
            /**
             * creates component
             * @param element
             * @param context
             */
            doCreateElement(element, context) {
                let type = element.getAttribute('type');
                switch (type) {
                    case 'number':
                        return new component.InputNumberElement(element, context);
                    case 'checkbox':
                        return new component.InputCheckboxElement(element, context);
                    case 'radio':
                        return new component.InputRadioElement(element, context);
                    default:
                        return new component.InputElement(element, context);
                }
            }
            /**
             * check supported
             * @param element
             */
            doSupport(element) {
                return (element.tagName.toLowerCase() === 'input');
            }
        }
        component.InputElementFactory = InputElementFactory;
        // register factory instance
        duice.ObjectElementFactory.addInstance(new InputElementFactory());
    })(component = duice.component || (duice.component = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var format;
    (function (format) {
        /**
         * NumberFormat
         * @param scale number
         */
        class NumberFormat {
            /**
             * Constructor
             * @param scale
             */
            constructor(scale) {
                this.scale = 0;
                this.scale = scale;
            }
            /**
             * Encodes number as format
             * @param number
             */
            encode(number) {
                if (!number || isNaN(Number(number))) {
                    return '';
                }
                number = Number(number);
                let string = String(number.toFixed(this.scale));
                let reg = /(^[+-]?\d+)(\d{3})/;
                while (reg.test(string)) {
                    string = string.replace(reg, '$1' + ',' + '$2');
                }
                return string;
            }
            /**
             * Decodes formatted value as original value
             * @param string
             */
            decode(string) {
                if (!string) {
                    return null;
                }
                if (string.length === 1 && /[+-]/.test(string)) {
                    string += '0';
                }
                string = string.replace(/,/gi, '');
                if (isNaN(Number(string))) {
                    throw 'NaN';
                }
                let number = Number(string);
                number = Number(number.toFixed(this.scale));
                return number;
            }
        }
        format.NumberFormat = NumberFormat;
    })(format = duice.format || (duice.format = {}));
})(duice || (duice = {}));
///<reference path="../format/NumberFormat.ts"/>
///<reference path="InputElement.ts"/>
var duice;
(function (duice) {
    var component;
    (function (component) {
        /**
         * input number element component
         */
        class InputNumberElement extends component.InputElement {
            /**
             * constructor
             * @param element
             * @param context
             */
            constructor(element, context) {
                super(element, context);
                // changes type and style
                this.getHtmlElement().removeAttribute('type');
                this.getHtmlElement().style.textAlign = 'right';
                // prevents invalid key press
                this.getHtmlElement().addEventListener('keypress', event => {
                    if (/[\d|\.|,]/.test(event.key) === false) {
                        event.preventDefault();
                    }
                });
            }
            /**
             * return value
             */
            getValue() {
                let value = super.getValue();
                return Number(value);
            }
        }
        component.InputNumberElement = InputNumberElement;
    })(component = duice.component || (duice.component = {}));
})(duice || (duice = {}));
///<reference path="InputElement.ts"/>
var duice;
(function (duice) {
    var component;
    (function (component) {
        /**
         * input radio element component
         */
        class InputRadioElement extends component.InputElement {
            /**
             * constructor
             * @param element
             * @param context
             */
            constructor(element, context) {
                super(element, context);
            }
            /**
             * set value
             * @param value
             */
            setValue(value) {
                this.getHtmlElement().checked = (this.getHtmlElement().value === value);
            }
            /**
             * return value
             */
            getValue() {
                return this.getHtmlElement().value;
            }
            /**
             * set readonly
             * @param readonly
             */
            setReadonly(readonly) {
                if (readonly) {
                    this.getHtmlElement().style.pointerEvents = 'none';
                }
                else {
                    this.getHtmlElement().style.pointerEvents = '';
                }
            }
        }
        component.InputRadioElement = InputRadioElement;
    })(component = duice.component || (duice.component = {}));
})(duice || (duice = {}));
// namespace duice.component {
//
//     export class Pagination extends duice.CustomElement {
//
//         public constructor() {
//             super();
//         }
//
//         doRender(object: any): string {
//
//             // prev
//             let template = `<div><span>Prev</span>`;
//
//             // pages
//             for(let index = 0; index < 10; index ++) {
//                 template += `<span>${index}</span>`;
//             }
//
//             // next
//             template += `<span>Next</span></div>`;
//
//             // returns
//             console.warn("=========", template);
//             return template;
//         }
//
//     }
//
//     ObjectComponentFactory.addInstance(new CustomComponentFactory("duice-name"));
//
//     // defines component
//     duice.defineComponent(`${duice.getNamespace()}-pagination`, Pagination);
//
// }
// namespace duice.component {
//
//     /**
//      * textarea element factory class
//       */
//     export class PaginationFactory extends ObjectComponentFactory<HTMLTextAreaElement> {
//
//         /**
//          * creates component
//          * @param element
//          * @param context
//          */
//         override doCreateComponent(element: HTMLTextAreaElement, context: object): TextareaElement {
//             return new TextareaElement(element, context);
//         }
//
//         /**
//          * returns supported
//          * @param element
//          */
//         override doSupport(element: HTMLElement): boolean {
//             return (element.tagName.toLowerCase() === 'textarea');
//         }
//
//     }
//
//     // register factory instance
//     ObjectComponentFactory.addInstance(new TextareaElementFactory());
//
// }
var duice;
(function (duice) {
    var component;
    (function (component) {
        /**
         * select element component
         */
        class SelectElement extends duice.ObjectElement {
            /**
             * constructor
             * @param element
             * @param context
             */
            constructor(element, context) {
                super(element, context);
                // adds event listener
                this.getHtmlElement().addEventListener('change', (e) => {
                    let event = new duice.event.PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                    this.notifyObservers(event);
                }, true);
            }
            /**
             * set value
             * @param value
             */
            setValue(value) {
                this.getHtmlElement().value = value;
                // force select option
                if (!value) {
                    for (let i = 0; i < this.getHtmlElement().options.length; i++) {
                        let option = this.getHtmlElement().options[i];
                        if (!option.nodeValue) {
                            option.selected = true;
                            break;
                        }
                    }
                }
            }
            /**
             * return value
             */
            getValue() {
                return this.getHtmlElement().value;
            }
            /**
             * set readonly
             * @param readonly
             */
            setReadonly(readonly) {
                if (readonly) {
                    console.warn("==ok");
                    this.getHtmlElement().style.pointerEvents = 'none';
                }
                else {
                    this.getHtmlElement().style.pointerEvents = '';
                }
            }
        }
        component.SelectElement = SelectElement;
    })(component = duice.component || (duice.component = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var component;
    (function (component) {
        /**
         * select element factory class
         */
        class SelectElementFactory extends duice.ObjectElementFactory {
            /**
             * create component
             * @param element
             * @param context
             */
            doCreateElement(element, context) {
                return new component.SelectElement(element, context);
            }
            /**
             * return supported
             * @param element
             */
            doSupport(element) {
                return (element.tagName.toLowerCase() === 'select');
            }
        }
        component.SelectElementFactory = SelectElementFactory;
        // register factory instance
        duice.ObjectElementFactory.addInstance(new SelectElementFactory());
    })(component = duice.component || (duice.component = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var component;
    (function (component) {
        /**
         * textarea element component
         */
        class TextareaElement extends duice.ObjectElement {
            /**
             * constructor
             * @param element
             * @param context
             */
            constructor(element, context) {
                super(element, context);
                // adds change event listener
                this.getHtmlElement().addEventListener('change', e => {
                    let event = new duice.event.PropertyChangeEvent(this, this.getProperty(), this.getValue(), this.getIndex());
                    this.notifyObservers(event);
                }, true);
            }
            /**
             * set value
             * @param value
             */
            setValue(value) {
                this.getHtmlElement().value = value;
            }
            /**
             * return value
             */
            getValue() {
                return this.getHtmlElement().value;
            }
            /**
             * set readonly
             * @param readonly
             */
            setReadonly(readonly) {
                if (readonly) {
                    this.getHtmlElement().setAttribute('readonly', 'readonly');
                }
                else {
                    this.getHtmlElement().removeAttribute('readonly');
                }
            }
        }
        component.TextareaElement = TextareaElement;
    })(component = duice.component || (duice.component = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var component;
    (function (component) {
        /**
         * textarea element factory class
          */
        class TextareaElementFactory extends duice.ObjectElementFactory {
            /**
             * creates component
             * @param element
             * @param context
             */
            doCreateElement(element, context) {
                return new component.TextareaElement(element, context);
            }
            /**
             * returns supported
             * @param element
             */
            doSupport(element) {
                return (element.tagName.toLowerCase() === 'textarea');
            }
        }
        component.TextareaElementFactory = TextareaElementFactory;
        // register factory instance
        duice.ObjectElementFactory.addInstance(new TextareaElementFactory());
    })(component = duice.component || (duice.component = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var event;
    (function (event) {
        /**
         * RowInsertEvent
         */
        class RowInsertEvent extends event.Event {
            /**
             * constructor
             * @param source
             * @param index
             */
            constructor(source, index, rows) {
                super(source);
                this.rows = [];
                this.index = index;
                this.rows = rows;
            }
            /**
             * return index
             */
            getIndex() {
                return this.index;
            }
            /**
             * getRows
             */
            getRows() {
                return this.rows;
            }
        }
        event.RowInsertEvent = RowInsertEvent;
    })(event = duice.event || (duice.event = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var event;
    (function (event) {
        /**
         * RowDeleteEvent
         */
        class RowDeleteEvent extends event.Event {
            /**
             * constructor
             * @param source
             * @param index
             */
            constructor(source, index, rows) {
                super(source);
                this.rows = [];
                this.index = index;
                this.rows = rows;
            }
            /**
             * return index
             */
            getIndex() {
                return this.index;
            }
            /**
             * getRows
             */
            getRows() {
                return this.rows;
            }
        }
        event.RowDeleteEvent = RowDeleteEvent;
    })(event = duice.event || (duice.event = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var format;
    (function (format) {
        /**
         * date format
         */
        class DateFormat {
            /**
             * Constructor
             * @param pattern
             */
            constructor(pattern) {
                this.patternRex = /yyyy|yy|MM|dd|HH|hh|mm|ss/gi;
                this.pattern = pattern;
            }
            /**
             * Encodes date string
             * @param string
             */
            encode(string) {
                if (!string) {
                    return '';
                }
                if (!this.pattern) {
                    return new Date(string).toString();
                }
                let date = new Date(string);
                string = this.pattern.replace(this.patternRex, function ($1) {
                    switch ($1) {
                        case "yyyy":
                            return date.getFullYear();
                        case "yy":
                            return String(date.getFullYear() % 1000).padStart(2, '0');
                        case "MM":
                            return String(date.getMonth() + 1).padStart(2, '0');
                        case "dd":
                            return String(date.getDate()).padStart(2, '0');
                        case "HH":
                            return String(date.getHours()).padStart(2, '0');
                        case "hh":
                            return String(date.getHours() <= 12 ? date.getHours() : date.getHours() % 12).padStart(2, '0');
                        case "mm":
                            return String(date.getMinutes()).padStart(2, '0');
                        case "ss":
                            return String(date.getSeconds()).padStart(2, '0');
                        default:
                            return $1;
                    }
                });
                return string;
            }
            /**
             * Decodes formatted date string to ISO date string.
             * @param string
             */
            decode(string) {
                if (!string) {
                    return null;
                }
                if (!this.pattern) {
                    return new Date(string).toISOString();
                }
                let date = new Date(0, 0, 0, 0, 0, 0);
                let match;
                while ((match = this.patternRex.exec(this.pattern)) != null) {
                    let formatString = match[0];
                    let formatIndex = match.index;
                    let formatLength = formatString.length;
                    let matchValue = string.substr(formatIndex, formatLength);
                    matchValue = matchValue.padEnd(formatLength, '0');
                    switch (formatString) {
                        case 'yyyy': {
                            let fullYear = parseInt(matchValue);
                            date.setFullYear(fullYear);
                            break;
                        }
                        case 'yy': {
                            let yyValue = parseInt(matchValue);
                            let yearPrefix = Math.floor(new Date().getFullYear() / 100);
                            let fullYear = yearPrefix * 100 + yyValue;
                            date.setFullYear(fullYear);
                            break;
                        }
                        case 'MM': {
                            let monthValue = parseInt(matchValue);
                            date.setMonth(monthValue - 1);
                            break;
                        }
                        case 'dd': {
                            let dateValue = parseInt(matchValue);
                            date.setDate(dateValue);
                            break;
                        }
                        case 'HH': {
                            let hoursValue = parseInt(matchValue);
                            date.setHours(hoursValue);
                            break;
                        }
                        case 'hh': {
                            let hoursValue = parseInt(matchValue);
                            date.setHours(hoursValue > 12 ? (hoursValue + 12) : hoursValue);
                            break;
                        }
                        case 'mm': {
                            let minutesValue = parseInt(matchValue);
                            date.setMinutes(minutesValue);
                            break;
                        }
                        case 'ss': {
                            let secondsValue = parseInt(matchValue);
                            date.setSeconds(secondsValue);
                            break;
                        }
                    }
                }
                return date.toISOString();
            }
        }
        format.DateFormat = DateFormat;
    })(format = duice.format || (duice.format = {}));
})(duice || (duice = {}));
var duice;
(function (duice) {
    var format;
    (function (format) {
        /**
         * StringFormat
         * @param string format
         */
        class StringFormat {
            /**
             * Constructor
             * @param pattern
             */
            constructor(pattern) {
                this.pattern = pattern;
            }
            /**
             * encode string as format
             * @param value
             */
            encode(value) {
                if (!value) {
                    return value;
                }
                let encodedValue = '';
                let patternChars = this.pattern.split('');
                let valueChars = value.split('');
                let valueCharsPosition = 0;
                for (let i = 0, size = patternChars.length; i < size; i++) {
                    let patternChar = patternChars[i];
                    if (patternChar === '#') {
                        encodedValue += valueChars[valueCharsPosition++] || '';
                    }
                    else {
                        encodedValue += patternChar;
                    }
                    if (valueCharsPosition >= valueChars.length) {
                        break;
                    }
                }
                return encodedValue;
            }
            /**
             * decodes string as format
             * @param value
             */
            decode(value) {
                if (!value) {
                    return value;
                }
                let decodedValue = '';
                let patternChars = this.pattern.split('');
                let valueChars = value.split('');
                let valueCharsPosition = 0;
                for (let i = 0, size = patternChars.length; i < size; i++) {
                    let patternChar = patternChars[i];
                    if (patternChar === '#') {
                        decodedValue += valueChars[valueCharsPosition++] || '';
                    }
                    else {
                        valueCharsPosition++;
                    }
                }
                return decodedValue;
            }
        }
        format.StringFormat = StringFormat;
    })(format = duice.format || (duice.format = {}));
})(duice || (duice = {}));
//# sourceMappingURL=duice.js.map