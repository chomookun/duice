"use strict";
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
    duice.Configuration = {
        version: '0.9',
        cssEnable: true
    };
    function addClass(element, className) {
        if (duice.Configuration.cssEnable) {
            element.classList.add(className);
        }
    }
    duice.addClass = addClass;
    duice.ComponentDefinitionRegistry = {
        componentDefinitions: new Array(),
        add(componentDefinition) {
            this.componentDefinitions.push(componentDefinition);
        },
        getComponentDefinitions() {
            return this.componentDefinitions;
        }
    };
    class ComponentDefinition {
        constructor(selector, factoryClass) {
            this.selector = selector;
            this.factoryClass = factoryClass;
        }
        getSelector() {
            return this.selector;
        }
        getFactoryClass() {
            return this.factoryClass;
        }
    }
    duice.ComponentDefinition = ComponentDefinition;
    function initializeComponent(container, $context) {
        [ListComponentFactory, MapComponentFactory]
            .forEach(function (factoryType) {
            duice.ComponentDefinitionRegistry.getComponentDefinitions().forEach(function (componentDefinition) {
                var elements = container.querySelectorAll(componentDefinition.getSelector() + '[data-duice-bind]:not([data-duice-id])');
                for (var i = 0, size = elements.length; i < size; i++) {
                    var element = elements[i];
                    if (componentDefinition.getFactoryClass().prototype instanceof factoryType) {
                        var factoryInstance = Object.create(componentDefinition.getFactoryClass().prototype);
                        factoryInstance.setContext($context);
                        factoryInstance.getComponent(element);
                    }
                }
            });
        });
    }
    duice.initializeComponent = initializeComponent;
    function loadExternalStyle(href) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
    duice.loadExternalStyle = loadExternalStyle;
    function loadExternalScript(src) {
        var script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
    }
    duice.loadExternalScript = loadExternalScript;
    function generateUuid() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    function isMobile() {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        }
        else {
            return false;
        }
    }
    duice.isMobile = isMobile;
    function parseQueryString() {
        var queryVariables = new Object();
        var queryString = window.location.search.substring(1);
        var vars = queryString.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            var key = decodeURIComponent(pair[0]);
            var value = decodeURIComponent(pair[1]);
            queryVariables[key] = value;
        }
        return queryVariables;
    }
    duice.parseQueryString = parseQueryString;
    function isEmpty(value) {
        if (value === undefined
            || value === null
            || value === ''
            || trim(value) === '') {
            return true;
        }
        else {
            return false;
        }
    }
    duice.isEmpty = isEmpty;
    function isNotEmpty(value) {
        return !isEmpty(value);
    }
    duice.isNotEmpty = isNotEmpty;
    function defaultIfEmpty(value, defaultValue) {
        if (isEmpty(value) === true) {
            return defaultValue;
        }
        else {
            return value;
        }
    }
    duice.defaultIfEmpty = defaultIfEmpty;
    function isNumeric(value) {
        return !Array.isArray(value) && (value - parseFloat(value) + 1) >= 0;
    }
    duice.isNumeric = isNumeric;
    function isIdFormat(value) {
        if (value) {
            var pattern = /^[a-zA-Z0-9\-\_]{1,}$/;
            return pattern.test(value);
        }
        return false;
    }
    duice.isIdFormat = isIdFormat;
    function isPasswordFormat(value) {
        if (value) {
            var pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
            return pattern.test(value);
        }
        return false;
    }
    duice.isPasswordFormat = isPasswordFormat;
    function isEmailFormat(value) {
        if (value) {
            var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return pattern.test(value);
        }
        return false;
    }
    duice.isEmailFormat = isEmailFormat;
    function isUrlFormat(value) {
        if (value) {
            var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            return pattern.test(value);
        }
        return false;
    }
    duice.isUrlFormat = isUrlFormat;
    function trim(value) {
        return (value + "").trim();
    }
    duice.trim = trim;
    function lpad(value, length, padChar) {
        for (var i = 0, size = (length - value.length); i < size; i++) {
            value = padChar + value;
        }
        return value;
    }
    duice.lpad = lpad;
    function rpad(value, length, padChar) {
        for (var i = 0, size = (length - value.length); i < size; i++) {
            value = value + padChar;
        }
        return value;
    }
    duice.rpad = rpad;
    function getCookie(name) {
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value ? value[2] : null;
    }
    duice.getCookie = getCookie;
    ;
    function setCookie(name, value, day) {
        var date = new Date();
        date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000);
        document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
    }
    duice.setCookie = setCookie;
    ;
    function deleteCookie(name) {
        var date = new Date();
        document.cookie = name + "= " + "; expires=" + date.toUTCString() + "; path=/";
    }
    duice.deleteCookie = deleteCookie;
    function executeExpression(element, $context) {
        var string = element.outerHTML;
        string = string.replace(/\[@duice\[([\s\S]*?)\]\]/mgi, function (match, command) {
            try {
                command = command.replace('&amp;', '&');
                command = command.replace('&lt;', '<');
                command = command.replace('&gt;', '>');
                var result = eval(command);
                return result;
            }
            catch (e) {
                console.error(e, command);
                throw e;
            }
        });
        try {
            var template = document.createElement('template');
            template.innerHTML = string;
            return template.content.firstChild;
        }
        catch (e) {
            removeChildNodes(element);
            element.innerHTML = string;
            return element;
        }
    }
    duice.executeExpression = executeExpression;
    function executeFunction(code, $context) {
        try {
            const func = Function('$context', '"use strict";' + code + '');
            var result = func($context);
            return result;
        }
        catch (e) {
            console.error(code);
            throw e;
        }
    }
    duice.executeFunction = executeFunction;
    function escapeHtml(value) {
        if (!value || typeof value !== 'string') {
            return value;
        }
        var htmlMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return value.replace(/[&<>"']/g, function (m) {
            return htmlMap[m];
        });
    }
    duice.escapeHtml = escapeHtml;
    function removeChildNodes(element) {
        var node, nodes = element.childNodes, i = 0;
        while (node = nodes[i++]) {
            if (node.nodeType === 1) {
                element.removeChild(node);
            }
        }
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        if (element instanceof HTMLSelectElement) {
            element.options.length = 0;
        }
    }
    function getCurrentWindow() {
        if (window.frameElement) {
            return window.parent;
        }
        else {
            return window;
        }
    }
    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    function setPositionCentered(element) {
        var win = getCurrentWindow();
        var computedStyle = win.getComputedStyle(element);
        var computedWidth = parseInt(computedStyle.getPropertyValue('width').replace(/px/gi, ''));
        var computedHeight = parseInt(computedStyle.getPropertyValue('height').replace(/px/gi, ''));
        var computedLeft = Math.max(0, win.innerWidth / 2 - computedWidth / 2) + win.scrollX;
        var computedTop = Math.max(0, win.innerHeight / 2 - computedHeight / 2) + win.scrollY;
        computedTop = computedTop - 100;
        computedTop = Math.max(10, computedTop);
        element.style.left = computedLeft + 'px';
        element.style.top = computedTop + 'px';
    }
    duice.setPositionCentered = setPositionCentered;
    function getElementPosition(element) {
        var pos = ('absolute relative').indexOf(getComputedStyle(element).position) == -1;
        var rect1 = { top: element.offsetTop * pos, left: element.offsetLeft * pos };
        var rect2 = element.offsetParent ? getElementPosition(element.offsetParent) : { top: 0, left: 0 };
        return {
            top: rect1.top + rect2.top,
            left: rect1.left + rect2.left,
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    }
    duice.getElementPosition = getElementPosition;
    function delayCall(millis, callback, _this, ...args) {
        var interval = setInterval(function () {
            try {
                callback.call(_this, ...args);
            }
            catch (e) {
                throw e;
            }
            finally {
                clearInterval(interval);
            }
        }, millis);
    }
    function getCurrentMaxZIndex() {
        var zIndex, z = 0, all = document.getElementsByTagName('*');
        for (var i = 0, n = all.length; i < n; i++) {
            zIndex = document.defaultView.getComputedStyle(all[i], null).getPropertyValue("z-index");
            zIndex = parseInt(zIndex, 10);
            z = (zIndex) ? Math.max(z, zIndex) : z;
        }
        return z;
    }
    class StringMask {
        constructor(pattern) {
            this.pattern = pattern;
        }
        encode(value) {
            if (isEmpty(this.pattern)) {
                return value;
            }
            var encodedValue = '';
            var patternChars = this.pattern.split('');
            var valueChars = value.split('');
            var valueCharsPosition = 0;
            for (var i = 0, size = patternChars.length; i < size; i++) {
                var patternChar = patternChars[i];
                if (patternChar === '#') {
                    encodedValue += defaultIfEmpty(valueChars[valueCharsPosition++], '');
                }
                else {
                    encodedValue += patternChar;
                }
            }
            return encodedValue;
        }
        decode(value) {
            if (isEmpty(this.pattern)) {
                return value;
            }
            var decodedValue = '';
            var patternChars = this.pattern.split('');
            var valueChars = value.split('');
            var valueCharsPosition = 0;
            for (var i = 0, size = patternChars.length; i < size; i++) {
                var patternChar = patternChars[i];
                if (patternChar === '#') {
                    decodedValue += defaultIfEmpty(valueChars[valueCharsPosition++], '');
                }
                else {
                    valueCharsPosition++;
                }
            }
            return decodedValue;
        }
    }
    duice.StringMask = StringMask;
    class NumberMask {
        constructor(scale) {
            this.scale = 0;
            this.scale = scale;
        }
        encode(number) {
            if (isEmpty(number) || isNaN(Number(number))) {
                return '';
            }
            number = Number(number);
            var string = String(number.toFixed(this.scale));
            var reg = /(^[+-]?\d+)(\d{3})/;
            while (reg.test(string)) {
                string = string.replace(reg, '$1' + ',' + '$2');
            }
            return string;
        }
        decode(string) {
            if (isEmpty(string)) {
                return null;
            }
            if (string.length === 1 && /[+-]/.test(string)) {
                string += '0';
            }
            string = string.replace(/\,/gi, '');
            if (isNaN(Number(string))) {
                throw 'NaN';
            }
            var number = Number(string);
            number = Number(number.toFixed(this.scale));
            return number;
        }
    }
    duice.NumberMask = NumberMask;
    class DateMask {
        constructor(pattern) {
            this.patternRex = /yyyy|yy|MM|dd|HH|hh|mm|ss/gi;
            this.pattern = pattern;
        }
        encode(string) {
            if (isEmpty(string)) {
                return '';
            }
            if (isEmpty(this.pattern)) {
                return new Date(string).toString();
            }
            var date = new Date(string);
            string = this.pattern.replace(this.patternRex, function ($1) {
                switch ($1) {
                    case "yyyy": return date.getFullYear();
                    case "yy": return lpad(String(date.getFullYear() % 1000), 2, '0');
                    case "MM": return lpad(String(date.getMonth() + 1), 2, '0');
                    case "dd": return lpad(String(date.getDate()), 2, '0');
                    case "HH": return lpad(String(date.getHours()), 2, '0');
                    case "hh": return lpad(String(date.getHours() <= 12 ? date.getHours() : date.getHours() % 12), 2, '0');
                    case "mm": return lpad(String(date.getMinutes()), 2, '0');
                    case "ss": return lpad(String(date.getSeconds()), 2, '0');
                    default: return $1;
                }
            });
            return string;
        }
        decode(string) {
            if (isEmpty(string)) {
                return null;
            }
            if (isEmpty(this.pattern)) {
                return new Date(string).toISOString();
            }
            var date = new Date(0, 0, 0, 0, 0, 0);
            var match;
            while ((match = this.patternRex.exec(this.pattern)) != null) {
                var formatString = match[0];
                var formatIndex = match.index;
                var formatLength = formatString.length;
                var matchValue = string.substr(formatIndex, formatLength);
                matchValue = rpad(matchValue, formatLength, '0');
                switch (formatString) {
                    case 'yyyy':
                        var fullYear = parseInt(matchValue);
                        date.setFullYear(fullYear);
                        break;
                    case 'yy':
                        var yyValue = parseInt(matchValue);
                        var yearPrefix = Math.floor(new Date().getFullYear() / 100);
                        var fullYear = yearPrefix * 100 + yyValue;
                        date.setFullYear(fullYear);
                        break;
                    case 'MM':
                        var monthValue = parseInt(matchValue);
                        date.setMonth(monthValue - 1);
                        break;
                    case 'dd':
                        var dateValue = parseInt(matchValue);
                        date.setDate(dateValue);
                        break;
                    case 'HH':
                        var hoursValue = parseInt(matchValue);
                        date.setHours(hoursValue);
                        break;
                    case 'hh':
                        var hoursValue = parseInt(matchValue);
                        date.setHours(hoursValue > 12 ? (hoursValue + 12) : hoursValue);
                        break;
                    case 'mm':
                        var minutesValue = parseInt(matchValue);
                        date.setMinutes(minutesValue);
                        break;
                    case 'ss':
                        var secondsValue = parseInt(matchValue);
                        date.setSeconds(secondsValue);
                        break;
                }
            }
            return date.toISOString();
        }
    }
    duice.DateMask = DateMask;
    class Blocker {
        constructor(element) {
            this.opacity = 0.2;
            this.element = element;
            this.div = document.createElement('div');
            this.div.classList.add('duice-blocker');
        }
        setOpacity(opacity) {
            this.opacity = opacity;
        }
        block() {
            this.div.style.position = 'fixed';
            this.div.style.zIndex = String(getCurrentMaxZIndex() + 1);
            this.div.style.background = 'rgba(0, 0, 0, ' + this.opacity + ')';
            this.takePosition();
            var _this = this;
            getCurrentWindow().addEventListener('scroll', function () {
                _this.takePosition();
            });
            this.element.appendChild(this.div);
        }
        unblock() {
            this.element.removeChild(this.div);
        }
        takePosition() {
            if (this.element.tagName == 'BODY') {
                this.div.style.width = '100%';
                this.div.style.height = '100%';
                this.div.style.top = '0px';
                this.div.style.left = '0px';
            }
            else {
                var boundingClientRect = this.element.getBoundingClientRect();
                var width = boundingClientRect.width;
                var height = boundingClientRect.height;
                var left = boundingClientRect.left;
                var top = boundingClientRect.top;
                this.div.style.width = width + "px";
                this.div.style.height = height + "px";
                this.div.style.top = top + 'px';
                this.div.style.left = left + 'px';
            }
        }
        getBlockDiv() {
            return this.div;
        }
    }
    duice.Blocker = Blocker;
    class Progress {
        constructor(element) {
            this.blocker = new Blocker(element);
            this.blocker.setOpacity(0.0);
        }
        start() {
            this.blocker.block();
            this.div = document.createElement('div');
            this.div.classList.add('duice-progress');
            this.blocker.getBlockDiv().appendChild(this.div);
        }
        stop() {
            this.blocker.getBlockDiv().removeChild(this.div);
            this.blocker.unblock();
        }
    }
    duice.Progress = Progress;
    class DialogEventListener {
    }
    class Dialog {
        constructor(contentDiv) {
            this.eventListener = new DialogEventListener();
            var _this = this;
            this.contentDiv = contentDiv;
            this.dialog = document.createElement('dialog');
            this.dialog.classList.add('duice-dialog');
            var closeButton = document.createElement('span');
            closeButton.classList.add('duice-dialog__closeButton');
            closeButton.addEventListener('click', function (event) {
                _this.close();
            });
            this.dialog.appendChild(closeButton);
        }
        show() {
            if (this.contentDiv.parentNode) {
                this.contentParentNode = this.contentDiv.parentNode;
            }
            this.dialog.appendChild(this.contentDiv);
            getCurrentWindow().document.body.appendChild(this.dialog);
            this.contentDiv.style.display = 'block';
            this.dialog.showModal();
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(true);
                }, 100);
            });
        }
        hide() {
            if (this.contentParentNode) {
                this.contentParentNode.appendChild(this.contentDiv);
            }
            this.dialog.close();
            this.contentDiv.style.display = 'none';
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(true);
                }, 100);
            });
        }
        open(...args) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.eventListener.onBeforeOpen) {
                    if ((yield this.eventListener.onBeforeOpen.call(this, ...args)) === false) {
                        return;
                    }
                }
                yield this.show();
                if (this.eventListener.onAfterOpen) {
                    yield this.eventListener.onAfterOpen.call(this, ...args);
                }
                var _this = this;
                this.promise = new Promise(function (resolve, reject) {
                    _this.promiseResolve = resolve;
                    _this.promiseReject = reject;
                });
                return this.promise;
            });
        }
        close(...args) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.eventListener.onBeforeClose) {
                    if ((yield this.eventListener.onBeforeClose.call(this, ...args)) === false) {
                        return;
                    }
                }
                yield this.hide();
                if (this.eventListener.onAfterClose) {
                    yield this.eventListener.onAfterClose.call(this, ...args);
                }
                this.promiseResolve(...args);
            });
        }
        confirm(...args) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.eventListener.onBeforeConfirm) {
                    if ((yield this.eventListener.onBeforeConfirm.call(this, ...args)) === false) {
                        return;
                    }
                }
                yield this.hide();
                if (this.eventListener.onAfterConfirm) {
                    yield this.eventListener.onAfterConfirm.call(this, ...args);
                }
                this.promiseResolve(...args);
            });
        }
        onBeforeOpen(listener) {
            this.eventListener.onBeforeOpen = listener;
            return this;
        }
        onAfterOpen(listener) {
            this.eventListener.onAfterOpen = listener;
            return this;
        }
        onBeforeClose(listener) {
            this.eventListener.onBeforeClose = listener;
            return this;
        }
        onAfterClose(listener) {
            this.eventListener.onAfterClose = listener;
            return this;
        }
        onBeforeConfirm(listener) {
            this.eventListener.onBeforeConfirm = listener;
            return this;
        }
        onAfterConfirm(listener) {
            this.eventListener.onAfterConfirm = listener;
            return this;
        }
    }
    duice.Dialog = Dialog;
    class Alert extends Dialog {
        constructor(message) {
            let contentDiv = document.createElement('div');
            super(contentDiv);
            this.message = message;
            var _this = this;
            this.iconDiv = document.createElement('div');
            this.iconDiv.classList.add('duice-alert__iconDiv');
            this.messageDiv = document.createElement('div');
            this.messageDiv.classList.add('duice-alert__messageDiv');
            this.messageDiv.innerHTML = this.message;
            this.buttonDiv = document.createElement('div');
            this.buttonDiv.classList.add('duice-alert__buttonDiv');
            this.confirmButton = document.createElement('button');
            this.confirmButton.classList.add('duice-alert__buttonDiv-button');
            this.confirmButton.classList.add('duice-alert__buttonDiv-button--confirm');
            this.confirmButton.addEventListener('click', function (event) {
                _this.close();
            });
            this.buttonDiv.appendChild(this.confirmButton);
            contentDiv.appendChild(this.iconDiv);
            contentDiv.appendChild(this.messageDiv);
            contentDiv.appendChild(this.buttonDiv);
        }
        open() {
            var promise = super.open();
            this.confirmButton.focus();
            return promise;
        }
    }
    duice.Alert = Alert;
    function alert(message) {
        return new duice.Alert(message).open();
    }
    duice.alert = alert;
    class Confirm extends Dialog {
        constructor(message) {
            let contentDiv = document.createElement('div');
            super(contentDiv);
            this.message = message;
            var _this = this;
            this.iconDiv = document.createElement('div');
            this.iconDiv.classList.add('duice-confirm__iconDiv');
            this.messageDiv = document.createElement('div');
            this.messageDiv.classList.add('duice-confirm__messageDiv');
            this.messageDiv.innerHTML = this.message;
            this.buttonDiv = document.createElement('div');
            this.buttonDiv.classList.add('duice-confirm__buttonDiv');
            this.confirmButton = document.createElement('button');
            this.confirmButton.classList.add('duice-confirm__buttonDiv-button');
            this.confirmButton.classList.add('duice-confirm__buttonDiv-button--confirm');
            this.confirmButton.addEventListener('click', function (event) {
                _this.confirm(true);
            });
            this.buttonDiv.appendChild(this.confirmButton);
            this.cancelButton = document.createElement('button');
            this.cancelButton.classList.add('duice-confirm__buttonDiv-button');
            this.cancelButton.classList.add('duice-confirm__buttonDiv-button--cancel');
            this.cancelButton.addEventListener('click', function (event) {
                _this.close(false);
            });
            this.buttonDiv.appendChild(this.cancelButton);
            contentDiv.appendChild(this.iconDiv);
            contentDiv.appendChild(this.messageDiv);
            contentDiv.appendChild(this.buttonDiv);
        }
        open() {
            var promise = super.open();
            this.confirmButton.focus();
            return promise;
        }
    }
    duice.Confirm = Confirm;
    function confirm(message) {
        return new duice.Confirm(message).open();
    }
    duice.confirm = confirm;
    class Prompt extends Dialog {
        constructor(message, defaultValue) {
            let contentDiv = document.createElement('div');
            super(contentDiv);
            this.message = message;
            this.defaultValue = defaultValue;
            var _this = this;
            this.iconDiv = document.createElement('div');
            this.iconDiv.classList.add('duice-prompt__iconDiv');
            this.messageDiv = document.createElement('div');
            this.messageDiv.classList.add('duice-prompt__messageDiv');
            this.messageDiv.innerHTML = this.message;
            this.inputDiv = document.createElement('div');
            this.inputDiv.classList.add('duice-prompt__inputDiv');
            this.input = document.createElement('input');
            this.input.classList.add('duice-prompt__inputDiv-input');
            if (this.defaultValue) {
                this.input.value = this.defaultValue;
            }
            this.inputDiv.appendChild(this.input);
            this.buttonDiv = document.createElement('div');
            this.buttonDiv.classList.add('duice-prompt__buttonDiv');
            this.confirmButton = document.createElement('button');
            this.confirmButton.classList.add('duice-prompt__buttonDiv-button');
            this.confirmButton.classList.add('duice-prompt__buttonDiv-button--confirm');
            this.confirmButton.addEventListener('click', function (event) {
                _this.confirm(_this.getValue());
            });
            this.buttonDiv.appendChild(this.confirmButton);
            this.cancelButton = document.createElement('button');
            this.cancelButton.classList.add('duice-prompt__buttonDiv-button');
            this.cancelButton.classList.add('duice-prompt__buttonDiv-button--cancel');
            this.cancelButton.addEventListener('click', function (event) {
                _this.close(false);
            });
            this.buttonDiv.appendChild(this.cancelButton);
            contentDiv.appendChild(this.iconDiv);
            contentDiv.appendChild(this.messageDiv);
            contentDiv.appendChild(this.inputDiv);
            contentDiv.appendChild(this.buttonDiv);
        }
        open() {
            var promise = super.open();
            this.input.focus();
            return promise;
        }
        getValue() {
            return this.input.value;
        }
    }
    duice.Prompt = Prompt;
    function prompt(message, defaultValue) {
        return new duice.Prompt(message, defaultValue).open();
    }
    duice.prompt = prompt;
    class TabFolderEventListener {
    }
    class TabFolder {
        constructor() {
            this.tabs = new Array();
            this.eventListener = new TabFolderEventListener();
        }
        addTab(tab) {
            var _this = this;
            const index = Number(this.tabs.length);
            tab.getButton().addEventListener('click', function (event) {
                _this.selectTab(index);
            });
            this.tabs.push(tab);
        }
        selectTab(index) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.eventListener.onBeforeSelectTab) {
                    if ((yield this.eventListener.onBeforeSelectTab.call(this, this.tabs[index])) === false) {
                        throw 'canceled';
                    }
                }
                for (var i = 0, size = this.tabs.length; i < size; i++) {
                    var tab = this.tabs[i];
                    if (i === index) {
                        tab.setActive(true);
                    }
                    else {
                        tab.setActive(false);
                    }
                }
                if (this.eventListener.onAfterSelectTab) {
                    this.eventListener.onAfterSelectTab.call(this, this.tabs[index]);
                }
            });
        }
        onBeforeSelectTab(listener) {
            this.eventListener.onBeforeSelectTab = listener;
            return this;
        }
        onAfterSelectTab(listener) {
            this.eventListener.onAfterSelectTab = listener;
            return this;
        }
    }
    duice.TabFolder = TabFolder;
    class Tab {
        constructor(button, content) {
            this.button = button;
            this.content = content;
        }
        getButton() {
            return this.button;
        }
        getContent() {
            return this.content;
        }
        setActive(active) {
            if (active === true) {
                this.button.style.opacity = 'unset';
                this.content.style.display = null;
            }
            else {
                this.button.style.opacity = '0.5';
                this.content.style.display = 'none';
            }
        }
    }
    duice.Tab = Tab;
    class WebSocketClientEventListener {
    }
    class WebSocketClient {
        constructor() {
            this.eventListener = new WebSocketClientEventListener();
        }
        open(url) {
            this.webSocket = new WebSocket(url);
            var _this = this;
            this.webSocket.onopen = function (event) {
                if (_this.eventListener.onOpen) {
                    _this.eventListener.onOpen.call(_this, event);
                }
            };
            this.webSocket.onmessage = function (event) {
                if (_this.eventListener.onMessage) {
                    _this.eventListener.onMessage.call(_this, event);
                }
            };
            this.webSocket.onerror = function (event) {
                if (_this.eventListener.onError) {
                    _this.eventListener.onError.call(_this, event);
                }
            };
            this.webSocket.onclose = function (event) {
                if (_this.eventListener.onClose) {
                    _this.eventListener.onClose.call(_this, event);
                }
                setTimeout(function () {
                    _this.open(url);
                }, 1000);
            };
        }
        onOpen(listener) {
            this.eventListener.onOpen = listener;
        }
        onMessage(listener) {
            this.eventListener.onMessage = listener;
        }
        onError(listener) {
            this.eventListener.onError = listener;
        }
        onClose(listener) {
            this.eventListener.onClose = listener;
        }
    }
    duice.WebSocketClient = WebSocketClient;
    class Observable {
        constructor() {
            this.observers = new Array();
            this.changed = false;
            this.notifyEnable = true;
        }
        addObserver(observer) {
            for (var i = 0, size = this.observers.length; i < size; i++) {
                if (this.observers[i] === observer) {
                    return;
                }
            }
            this.observers.push(observer);
        }
        removeObserver(observer) {
            for (var i = 0, size = this.observers.length; i < size; i++) {
                if (this.observers[i] === observer) {
                    this.observers.splice(i, 1);
                    return;
                }
            }
        }
        notifyObservers(obj) {
            if (this.notifyEnable && this.hasChanged()) {
                this.clearUnavailableObservers();
                for (var i = 0, size = this.observers.length; i < size; i++) {
                    if (this.observers[i] !== obj) {
                        try {
                            this.observers[i].update(this, obj);
                        }
                        catch (e) {
                            console.error(e, this.observers[i]);
                        }
                    }
                }
                this.clearChanged();
            }
        }
        suspendNotify() {
            this.notifyEnable = false;
        }
        resumeNotify() {
            this.notifyEnable = true;
        }
        setChanged() {
            this.changed = true;
        }
        hasChanged() {
            return this.changed;
        }
        clearChanged() {
            this.changed = false;
        }
        clearUnavailableObservers() {
            for (var i = this.observers.length - 1; i >= 0; i--) {
                try {
                    if (this.observers[i].isAvailable() === false) {
                        this.observers.splice(i, 1);
                    }
                }
                catch (e) {
                    console.error(e, this.observers[i]);
                }
            }
        }
    }
    class DataObject extends Observable {
        constructor() {
            super(...arguments);
            this.available = true;
            this.disable = new Object();
            this.disableAll = false;
            this.readonly = new Object();
            this.readonlyAll = false;
            this.visible = true;
        }
        isAvailable() {
            return true;
        }
        setDisable(name, disable) {
            this.disable[name] = disable;
            this.setChanged();
            this.notifyObservers(this);
        }
        setDisableAll(disable) {
            this.disableAll = disable;
            for (var name in this.disable) {
                this.disable[name] = disable;
            }
            this.setChanged();
            this.notifyObservers(this);
        }
        isDisable(name) {
            if (this.disable.hasOwnProperty(name)) {
                return this.disable[name];
            }
            else {
                return this.disableAll;
            }
        }
        setReadonly(name, readonly) {
            this.readonly[name] = readonly;
            this.setChanged();
            this.notifyObservers(this);
        }
        setReadonlyAll(readonly) {
            this.readonlyAll = readonly;
            for (var name in this.readonly) {
                this.readonly[name] = readonly;
            }
            this.setChanged();
            this.notifyObservers(this);
        }
        isReadonly(name) {
            if (this.readonly.hasOwnProperty(name)) {
                return this.readonly[name];
            }
            else {
                return this.readonlyAll;
            }
        }
        setVisible(visible) {
            this.visible = visible;
            for (var i = 0, size = this.observers.length; i < size; i++) {
                try {
                    if (this.observers[i] instanceof Component) {
                        var uiComponent = this.observers[i];
                        uiComponent.setVisible(visible);
                    }
                }
                catch (e) {
                    console.error(e, this.observers[i]);
                }
            }
        }
        isVisible() {
            return this.visible;
        }
    }
    duice.DataObject = DataObject;
    class MapEventListener {
    }
    class Map extends DataObject {
        constructor(json) {
            super();
            this.data = new Object();
            this.originData = JSON.stringify(this.data);
            this.eventListener = new MapEventListener();
            this.fromJson(json || {});
        }
        update(mapComponent, obj) {
            console.debug('Map.update', mapComponent, obj);
            var name = mapComponent.getName();
            var value = mapComponent.getValue();
            this.set(name, value);
        }
        fromJson(json) {
            this.data = new Object();
            for (var name in json) {
                this.data[name] = json[name];
            }
            this.save();
            this.setChanged();
            this.notifyObservers(this);
        }
        toJson() {
            var json = new Object();
            for (var name in this.data) {
                json[name] = this.data[name];
            }
            return json;
        }
        clear() {
            this.data = new Object();
            this.setChanged();
            this.notifyObservers(this);
        }
        save() {
            this.originData = JSON.stringify(this.toJson());
        }
        reset() {
            this.fromJson(JSON.parse(this.originData));
        }
        isDirty() {
            if (JSON.stringify(this.toJson()) === this.originData) {
                return false;
            }
            else {
                return true;
            }
        }
        set(name, value) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.eventListener.onBeforeChange) {
                    try {
                        if ((yield this.eventListener.onBeforeChange.call(this, name, value)) === false) {
                            throw 'Map.set is canceled';
                        }
                    }
                    catch (e) {
                        this.setChanged();
                        this.notifyObservers(this);
                        throw e;
                    }
                }
                this.data[name] = value;
                this.setChanged();
                this.notifyObservers(this);
                if (this.eventListener.onAfterChange) {
                    this.eventListener.onAfterChange.call(this, name, value);
                }
                return true;
            });
        }
        get(name) {
            return this.data[name];
        }
        getNames() {
            var names = new Array();
            for (var name in this.data) {
                names.push(name);
            }
            return names;
        }
        setFocus(name) {
            for (var i = 0, size = this.observers.length; i < size; i++) {
                var observer = this.observers[i];
                if (observer instanceof MapComponent) {
                    var mapUiComponent = this.observers[i];
                    if (observer.getName() === name) {
                        mapUiComponent.setFocus();
                        break;
                    }
                }
            }
        }
        onBeforeChange(listener) {
            this.eventListener.onBeforeChange = listener;
        }
        onAfterChange(listener) {
            this.eventListener.onAfterChange = listener;
        }
    }
    duice.Map = Map;
    class ListEventListener {
    }
    class List extends DataObject {
        constructor(jsonArray) {
            super();
            this.data = new Array();
            this.originData = JSON.stringify(this.data);
            this.index = -1;
            this.eventListener = new ListEventListener();
            this.fromJson(jsonArray || []);
        }
        update(listComponent, obj) {
            console.debug('List.update', listComponent, obj);
            this.setChanged();
            this.notifyObservers(obj);
        }
        fromJson(jsonArray) {
            this.clear();
            for (var i = 0; i < jsonArray.length; i++) {
                var map = new duice.Map(jsonArray[i]);
                map.disable = clone(this.disable);
                map.disableAll = this.disableAll;
                map.readonly = clone(this.readonly);
                map.readonlyAll = this.readonlyAll;
                map.onBeforeChange(this.eventListener.onBeforeChangeRow);
                map.onAfterChange(this.eventListener.onAfterChangeRow);
                map.addObserver(this);
                this.data.push(map);
            }
            this.save();
            this.setIndex(-1);
        }
        toJson() {
            var jsonArray = new Array();
            for (var i = 0; i < this.data.length; i++) {
                jsonArray.push(this.data[i].toJson());
            }
            return jsonArray;
        }
        clear() {
            for (var i = 0, size = this.data.length; i < size; i++) {
                this.data[i].removeObserver(this);
            }
            this.data = new Array();
            this.setIndex(-1);
        }
        save() {
            this.originData = JSON.stringify(this.toJson());
        }
        reset() {
            this.fromJson(JSON.parse(this.originData));
        }
        isDirty() {
            if (JSON.stringify(this.toJson()) === this.originData) {
                return false;
            }
            else {
                return true;
            }
        }
        setIndex(index) {
            this.index = index;
            this.setChanged();
            this.notifyObservers(this);
        }
        getIndex() {
            return this.index;
        }
        getRowCount() {
            return this.data.length;
        }
        getRow(index) {
            return this.data[index];
        }
        selectRow(index) {
            return __awaiter(this, void 0, void 0, function* () {
                var selectedRow = this.getRow(index);
                if (this.eventListener.onBeforeSelectRow) {
                    if ((yield this.eventListener.onBeforeSelectRow.call(this, selectedRow)) === false) {
                        throw 'canceled';
                    }
                }
                this.setIndex(index);
                if (this.eventListener.onAfterSelectRow) {
                    this.eventListener.onAfterSelectRow.call(this, selectedRow);
                }
                return true;
            });
        }
        moveRow(fromIndex, toIndex) {
            return __awaiter(this, void 0, void 0, function* () {
                var sourceMap = this.getRow(fromIndex);
                var targetMap = this.getRow(toIndex);
                if (this.eventListener.onBeforeMoveRow) {
                    if ((yield this.eventListener.onBeforeMoveRow.call(this, sourceMap, targetMap)) === false) {
                        throw 'canceled';
                    }
                }
                this.index = fromIndex;
                this.data.splice(toIndex, 0, this.data.splice(fromIndex, 1)[0]);
                this.setIndex(toIndex);
                if (this.eventListener.onAfterMoveRow) {
                    yield this.eventListener.onAfterMoveRow.call(this, sourceMap, targetMap);
                }
            });
        }
        addRow(map) {
            map.disableAll = this.disableAll;
            map.disable = clone(this.disable);
            map.readonlyAll = this.readonlyAll;
            map.readonly = clone(this.readonly);
            map.onBeforeChange(this.eventListener.onBeforeChangeRow);
            map.onAfterChange(this.eventListener.onAfterChangeRow);
            map.addObserver(this);
            this.data.push(map);
            this.setIndex(this.getRowCount() - 1);
        }
        insertRow(index, map) {
            if (0 <= index && index < this.data.length) {
                map.disableAll = this.disableAll;
                map.disable = clone(this.disable);
                map.readonlyAll = this.readonlyAll;
                map.readonly = clone(this.readonly);
                map.onBeforeChange(this.eventListener.onBeforeChangeRow);
                map.onAfterChange(this.eventListener.onAfterChangeRow);
                map.addObserver(this);
                this.data.splice(index, 0, map);
                this.setIndex(index);
            }
        }
        removeRow(index) {
            if (0 <= index && index < this.data.length) {
                this.data.splice(index, 1);
                var index = Math.min(this.index, this.data.length - 1);
                this.setIndex(index);
            }
        }
        indexOf(handler) {
            for (var i = 0, size = this.data.length; i < size; i++) {
                if (handler.call(this, this.data[i]) === true) {
                    return i;
                }
            }
            return -1;
        }
        contains(handler) {
            if (this.indexOf(handler) > -1) {
                return true;
            }
            else {
                return false;
            }
        }
        forEach(handler) {
            for (var i = 0, size = this.data.length; i < size; i++) {
                if (handler.call(this, this.data[i], i) === false) {
                    break;
                }
            }
        }
        setDisable(name, disable) {
            this.data.forEach(function (map) {
                map.setDisable(name, disable);
            });
            super.setDisable(name, disable);
        }
        setDisableAll(disable) {
            this.data.forEach(function (map) {
                map.setDisableAll(disable);
            });
            super.setDisableAll(disable);
        }
        setReadonly(name, readonly) {
            this.data.forEach(function (map) {
                map.setReadonly(name, readonly);
            });
            super.setReadonly(name, readonly);
        }
        setReadonlyAll(readonly) {
            this.data.forEach(function (map) {
                map.setReadonlyAll(readonly);
            });
            super.setReadonlyAll(readonly);
        }
        onBeforeSelectRow(listener) {
            this.eventListener.onBeforeSelectRow = listener;
        }
        onAfterSelectRow(listener) {
            this.eventListener.onAfterSelectRow = listener;
        }
        onBeforeMoveRow(listener) {
            this.eventListener.onBeforeMoveRow = listener;
        }
        onAfterMoveRow(listener) {
            this.eventListener.onAfterMoveRow = listener;
        }
        onBeforeChangeRow(listener) {
            this.eventListener.onBeforeChangeRow = listener;
            this.data.forEach(function (map) {
                map.onBeforeChange(listener);
            });
        }
        onAfterChangeRow(listener) {
            this.eventListener.onAfterChangeRow = listener;
            this.data.forEach(function (map) {
                map.onAfterChange(listener);
            });
        }
    }
    duice.List = List;
    class ComponentFactory {
        constructor(context) {
            if (context) {
                this.setContext(context);
            }
        }
        setContext(context) {
            this.context = context;
        }
        getContext() {
            return this.context;
        }
        getContextProperty(name) {
            if (this.context[name]) {
                return this.context[name];
            }
            if (window.hasOwnProperty(name)) {
                return window[name];
            }
            try {
                return eval.call(this.context, name);
            }
            catch (e) {
                console.error(e, this.context, name);
                throw e;
            }
        }
    }
    class Component extends Observable {
        constructor(element) {
            super();
            this.element = element;
            this.element.dataset.duiceId = generateUuid();
        }
        isAvailable() {
            if (!Node.prototype.contains) {
                Node.prototype.contains = function (el) {
                    while (el = el.parentNode) {
                        if (el === this)
                            return true;
                    }
                    return false;
                };
            }
            if (document.contains(this.element)) {
                return true;
            }
            else {
                return false;
            }
        }
        setVisible(visible) {
            this.element.style.display = (visible ? '' : 'none');
        }
        setFocus() {
            if (this.element.focus) {
                this.element.focus();
            }
        }
    }
    class MapComponentFactory extends ComponentFactory {
    }
    duice.MapComponentFactory = MapComponentFactory;
    class MapComponent extends Component {
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
    duice.MapComponent = MapComponent;
    class ListComponentFactory extends ComponentFactory {
    }
    duice.ListComponentFactory = ListComponentFactory;
    class ListComponent extends Component {
        bind(list, item) {
            this.list = list;
            this.item = item;
            this.list.addObserver(this);
            this.addObserver(this.list);
            this.update(this.list, this.list);
        }
        getList() {
            return this.list;
        }
        getItem() {
            return this.item;
        }
    }
    duice.ListComponent = ListComponent;
    class ScriptletFactory extends MapComponentFactory {
        getComponent(element) {
            var scriptlet = new Scriptlet(element);
            var context;
            if (this.getContext() !== window) {
                context = this.getContext();
            }
            else {
                context = {};
            }
            if (element.dataset.duiceBind) {
                var bind = element.dataset.duiceBind.split(',');
                var _this = this;
                bind.forEach(function (name) {
                    context[name] = _this.getContextProperty(name);
                });
            }
            scriptlet.bind(context);
            return scriptlet;
        }
    }
    duice.ScriptletFactory = ScriptletFactory;
    class Scriptlet extends MapComponent {
        constructor(element) {
            super(element);
            addClass(element, 'duice-scriptlet');
            this.expression = element.dataset.duiceValue;
        }
        bind(context) {
            this.context = context;
            for (var name in this.context) {
                var obj = this.context[name];
                if (typeof obj === 'object' && obj instanceof duice.DataObject) {
                    obj.addObserver(this);
                    this.addObserver(obj);
                    this.update(obj, obj);
                }
            }
        }
        update(dataObject, obj) {
            var result = executeFunction(this.expression, this.context);
            this.element.innerHTML = '';
            this.element.appendChild(document.createTextNode(result));
            this.element.style.display = 'unset';
        }
        getValue() {
            return null;
        }
    }
    duice.Scriptlet = Scriptlet;
    class SpanFactory extends MapComponentFactory {
        getComponent(element) {
            var span = new Span(element);
            if (element.dataset.duiceMask) {
                var duiceMask = element.dataset.duiceMask.split(',');
                var maskType = duiceMask[0];
                var mask;
                switch (maskType) {
                    case 'string':
                        mask = new StringMask(duiceMask[1]);
                        break;
                    case 'number':
                        mask = new NumberMask(parseInt(duiceMask[1]));
                        break;
                    case 'date':
                        mask = new DateMask(duiceMask[1]);
                        break;
                    default:
                        throw 'format type[' + maskType + '] is invalid';
                }
                span.setMask(mask);
            }
            var bind = element.dataset.duiceBind.split(',');
            span.bind(this.getContextProperty(bind[0]), bind[1]);
            return span;
        }
    }
    duice.SpanFactory = SpanFactory;
    class Span extends MapComponent {
        constructor(span) {
            super(span);
            this.span = span;
            addClass(this.span, 'duice-span');
        }
        setMask(mask) {
            this.mask = mask;
        }
        update(map, obj) {
            removeChildNodes(this.span);
            var value = map.get(this.name);
            value = defaultIfEmpty(value, '');
            if (this.mask) {
                value = this.mask.encode(value);
            }
            this.span.appendChild(document.createTextNode(value));
        }
        getValue() {
            var value = this.span.innerHTML;
            value = defaultIfEmpty(value, null);
            if (this.mask) {
                value = this.mask.decode(value);
            }
            return value;
        }
    }
    duice.Span = Span;
    class DivFactory extends MapComponentFactory {
        getComponent(element) {
            var div = new Div(element);
            var bind = element.dataset.duiceBind.split(',');
            div.bind(this.getContextProperty(bind[0]), bind[1]);
            return div;
        }
    }
    duice.DivFactory = DivFactory;
    class Div extends MapComponent {
        constructor(div) {
            super(div);
            this.div = div;
            addClass(this.div, 'duice-div');
        }
        update(map, obj) {
            removeChildNodes(this.div);
            var value = map.get(this.name);
            value = defaultIfEmpty(value, '');
            this.div.innerHTML = value;
        }
        getValue() {
            var value = this.div.innerHTML;
            return value;
        }
    }
    duice.Div = Div;
    class InputFactory extends MapComponentFactory {
        getComponent(element) {
            let input = null;
            let type = element.getAttribute('type');
            switch (type) {
                case 'text':
                    input = new InputText(element);
                    if (element.dataset.duiceMask) {
                        input.setMask(element.dataset.duiceMask);
                    }
                    break;
                case 'number':
                    input = new InputNumber(element);
                    if (element.dataset.duiceMask) {
                        input.setMask(parseInt(element.dataset.duiceMask));
                    }
                    break;
                case 'checkbox':
                    input = new InputCheckbox(element);
                    break;
                case 'radio':
                    input = new InputRadio(element);
                    break;
                case 'date':
                case 'datetime-local':
                    input = new InputDate(element);
                    if (element.dataset.duiceMask) {
                        input.setMask(element.dataset.duiceMask);
                    }
                    break;
                case 'cron':
                    input = new InputCron(element);
                    break;
                default:
                    input = new InputGeneric(element);
            }
            let bind = element.dataset.duiceBind.split(',');
            input.bind(this.getContextProperty(bind[0]), bind[1]);
            return input;
        }
    }
    duice.InputFactory = InputFactory;
    class Input extends MapComponent {
        constructor(input) {
            super(input);
            this.input = input;
            var _this = this;
            this.input.addEventListener('keypress', function (event) {
                var inputChars = String.fromCharCode(event.keyCode);
                var newValue = this.value.substr(0, this.selectionStart) + inputChars + this.value.substr(this.selectionEnd);
                if (_this.checkValue(newValue) === false) {
                    event.preventDefault();
                }
            }, true);
            this.input.addEventListener('paste', function (event) {
                var inputChars = event.clipboardData.getData('text/plain');
                var newValue = this.value.substr(0, this.selectionStart) + inputChars + this.value.substr(this.selectionEnd);
                if (_this.checkValue(newValue) === false) {
                    event.preventDefault();
                }
            }, true);
            this.input.addEventListener('change', function (event) {
                _this.setChanged();
                _this.notifyObservers(this);
            }, true);
            _this.input.setAttribute('autocomplete', 'off');
        }
        checkValue(value) {
            return true;
        }
        setDisable(disable) {
            if (disable) {
                this.input.setAttribute('disabled', 'true');
            }
            else {
                this.input.removeAttribute('disabled');
            }
        }
        setReadonly(readonly) {
            if (readonly === true) {
                this.input.setAttribute('readonly', 'readonly');
            }
            else {
                this.input.removeAttribute('readonly');
            }
        }
    }
    duice.Input = Input;
    class InputGeneric extends Input {
        constructor(input) {
            super(input);
            addClass(this.input, 'duice-input-generic');
        }
        update(map, obj) {
            var value = map.get(this.getName());
            this.input.value = defaultIfEmpty(value, '');
            this.setDisable(map.isDisable(this.getName()));
            this.setReadonly(map.isReadonly(this.getName()));
        }
        getValue() {
            var value = this.input.value;
            if (isEmpty(value)) {
                return null;
            }
            else {
                if (isNaN(value)) {
                    return String(value);
                }
                else {
                    return Number(value);
                }
            }
        }
    }
    duice.InputGeneric = InputGeneric;
    class InputText extends Input {
        constructor(input) {
            super(input);
            addClass(this.input, 'duice-input-text');
        }
        setMask(format) {
            this.mask = new StringMask(format);
        }
        update(map, obj) {
            var value = map.get(this.getName());
            value = defaultIfEmpty(value, '');
            if (this.mask) {
                value = this.mask.encode(value);
            }
            this.input.value = value;
            this.setDisable(map.isDisable(this.getName()));
            this.setReadonly(map.isReadonly(this.getName()));
        }
        getValue() {
            var value = this.input.value;
            value = defaultIfEmpty(value, null);
            if (this.mask) {
                value = this.mask.decode(value);
            }
            return value;
        }
        checkValue(value) {
            var pattern = this.input.getAttribute('pattern');
            if (pattern) {
                var regExp = new RegExp(pattern);
                if (!regExp.test(value)) {
                    return false;
                }
            }
            if (this.mask) {
                try {
                    this.mask.decode(value);
                }
                catch (e) {
                    return false;
                }
            }
            return true;
        }
    }
    duice.InputText = InputText;
    class InputNumber extends Input {
        constructor(input) {
            super(input);
            addClass(this.input, 'duice-input-number');
            this.input.removeAttribute('type');
            this.mask = new NumberMask(0);
        }
        setMask(scale) {
            this.mask = new NumberMask(scale);
        }
        update(map, obj) {
            var value = map.get(this.getName());
            if (this.mask) {
                value = this.mask.encode(value);
            }
            this.input.value = value;
            this.setDisable(map.isDisable(this.getName()));
            this.setReadonly(map.isReadonly(this.getName()));
        }
        getValue() {
            var value = this.input.value;
            value = this.mask.decode(value);
            return value;
        }
        checkValue(value) {
            try {
                this.mask.decode(value);
            }
            catch (e) {
                return false;
            }
            return true;
        }
    }
    duice.InputNumber = InputNumber;
    class InputCheckbox extends Input {
        constructor(input) {
            super(input);
            addClass(this.input, 'duice-input-checkbox');
            this.input.addEventListener('click', function (event) {
                event.stopPropagation();
            }, true);
        }
        update(map, obj) {
            var value = map.get(this.getName());
            if (value === true) {
                this.input.checked = true;
            }
            else {
                this.input.checked = false;
            }
            this.setDisable(map.isDisable(this.getName()));
            this.setReadonly(map.isReadonly(this.getName()));
        }
        getValue() {
            return this.input.checked;
        }
        setReadonly(readonly) {
            if (readonly) {
                this.input.style.pointerEvents = 'none';
            }
            else {
                this.input.style.pointerEvents = '';
            }
        }
    }
    duice.InputCheckbox = InputCheckbox;
    class InputRadio extends Input {
        constructor(input) {
            super(input);
            addClass(this.input, 'duice-input-radio');
        }
        update(map, obj) {
            var value = map.get(this.getName());
            if (value === this.input.value) {
                this.input.checked = true;
            }
            else {
                this.input.checked = false;
            }
            this.setDisable(map.isDisable(this.getName()));
            this.setReadonly(map.isReadonly(this.getName()));
        }
        getValue() {
            return this.input.value;
        }
        setReadonly(readonly) {
            if (readonly) {
                this.input.style.pointerEvents = 'none';
            }
            else {
                this.input.style.pointerEvents = '';
            }
        }
    }
    duice.InputRadio = InputRadio;
    class InputDate extends Input {
        constructor(input) {
            super(input);
            this.readonly = false;
            addClass(this.input, 'duice-input-date');
            this.type = this.input.getAttribute('type').toLowerCase();
            this.input.removeAttribute('type');
            var _this = this;
            this.input.addEventListener('click', function (event) {
                if (_this.readonly !== true) {
                    _this.openPicker();
                }
            }, true);
            if (this.type === 'date') {
                this.mask = new DateMask('yyyy-MM-dd');
            }
            else {
                this.mask = new DateMask('yyyy-MM-dd HH:mm:ss');
            }
        }
        setMask(format) {
            this.mask = new DateMask(format);
        }
        update(map, obj) {
            var value = map.get(this.getName());
            value = defaultIfEmpty(value, '');
            if (this.mask) {
                value = this.mask.encode(value);
            }
            this.input.value = value;
            this.setDisable(map.isDisable(this.getName()));
            this.setReadonly(map.isReadonly(this.getName()));
        }
        getValue() {
            var value = this.input.value;
            value = defaultIfEmpty(value, null);
            if (this.mask) {
                value = this.mask.decode(value);
            }
            if (this.type === 'date') {
                value = new DateMask('yyyy-MM-dd').encode(new Date(value).toISOString());
            }
            return value;
        }
        checkValue(value) {
            try {
                var s = this.mask.decode(value);
            }
            catch (e) {
                return false;
            }
            return true;
        }
        setReadonly(readonly) {
            this.readonly = readonly;
            super.setReadonly(readonly);
        }
        openPicker() {
            if (this.pickerDiv) {
                return;
            }
            var _this = this;
            this.pickerDiv = document.createElement('div');
            this.pickerDiv.classList.add('duice-input-date__pickerDiv');
            var date;
            if (isEmpty(this.getValue)) {
                date = new Date();
            }
            else {
                date = new Date(this.getValue());
            }
            var yyyy = date.getFullYear();
            var mm = date.getMonth();
            var dd = date.getDate();
            var hh = date.getHours();
            var mi = date.getMinutes();
            var ss = date.getSeconds();
            this.clickListener = function (event) {
                if (!_this.input.contains(event.target) && !_this.pickerDiv.contains(event.target)) {
                    _this.closePicker();
                }
            };
            window.addEventListener('click', this.clickListener);
            var headerDiv = document.createElement('div');
            headerDiv.classList.add('duice-input-date__pickerDiv-headerDiv');
            this.pickerDiv.appendChild(headerDiv);
            var titleSpan = document.createElement('span');
            titleSpan.classList.add('duice-input-date__pickerDiv-headerDiv-titleSpan');
            headerDiv.appendChild(titleSpan);
            var closeButton = document.createElement('button');
            closeButton.classList.add('duice-input-date__pickerDiv-headerDiv-closeButton');
            headerDiv.appendChild(closeButton);
            closeButton.addEventListener('click', function (event) {
                _this.closePicker();
            });
            var bodyDiv = document.createElement('div');
            bodyDiv.classList.add('duice-input-date__pickerDiv-bodyDiv');
            this.pickerDiv.appendChild(bodyDiv);
            var dateDiv = document.createElement('div');
            dateDiv.classList.add('duice-input-date__pickerDiv-bodyDiv-dateDiv');
            bodyDiv.appendChild(dateDiv);
            var prevMonthButton = document.createElement('button');
            prevMonthButton.classList.add('duice-input-date__pickerDiv-bodyDiv-dateDiv-prevMonthButton');
            dateDiv.appendChild(prevMonthButton);
            prevMonthButton.addEventListener('click', function (event) {
                date.setMonth(date.getMonth() - 1);
                updateDate(date);
            });
            var todayButton = document.createElement('button');
            todayButton.classList.add('duice-input-date__pickerDiv-bodyDiv-dateDiv-todayButton');
            dateDiv.appendChild(todayButton);
            todayButton.addEventListener('click', function (event) {
                var newDate = new Date();
                date.setFullYear(newDate.getFullYear());
                date.setMonth(newDate.getMonth());
                date.setDate(newDate.getDate());
                updateDate(date);
            });
            var yearSelect = document.createElement('select');
            yearSelect.classList.add('duice-input-date__pickerDiv-bodyDiv-dateDiv-yearSelect');
            dateDiv.appendChild(yearSelect);
            yearSelect.addEventListener('change', function (event) {
                date.setFullYear(parseInt(this.value));
                updateDate(date);
            });
            dateDiv.appendChild(document.createTextNode('-'));
            var monthSelect = document.createElement('select');
            monthSelect.classList.add('duice-input-date__pickerDiv-bodyDiv-dateDiv-monthSelect');
            dateDiv.appendChild(monthSelect);
            for (var i = 0, end = 11; i <= end; i++) {
                var option = document.createElement('option');
                option.value = String(i);
                option.text = String(i + 1);
                monthSelect.appendChild(option);
            }
            monthSelect.addEventListener('change', function (event) {
                date.setMonth(parseInt(this.value));
                updateDate(date);
            });
            var nextMonthButton = document.createElement('button');
            nextMonthButton.classList.add('duice-input-date__pickerDiv-bodyDiv-dateDiv-nextMonthButton');
            dateDiv.appendChild(nextMonthButton);
            nextMonthButton.addEventListener('click', function (event) {
                date.setMonth(date.getMonth() + 1);
                updateDate(date);
            });
            var calendarTable = document.createElement('table');
            calendarTable.classList.add('duice-input-date__pickerDiv-bodyDiv-calendarTable');
            bodyDiv.appendChild(calendarTable);
            var calendarThead = document.createElement('thead');
            calendarTable.appendChild(calendarThead);
            var weekTr = document.createElement('tr');
            weekTr.classList.add('.duice-input-date__pickerDiv-bodyDiv-calendarTable-weekTr');
            calendarThead.appendChild(weekTr);
            ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(function (element) {
                var weekTh = document.createElement('th');
                weekTh.classList.add('duice-input-date__pickerDiv-bodyDiv-calendarTable-weekTh');
                weekTh.appendChild(document.createTextNode(element));
                weekTr.appendChild(weekTh);
            });
            var calendarTbody = document.createElement('tbody');
            calendarTable.appendChild(calendarTbody);
            var timeDiv = document.createElement('div');
            timeDiv.classList.add('duice-input-date__pickerDiv-bodyDiv-timeDiv');
            bodyDiv.appendChild(timeDiv);
            if (this.type === 'date') {
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                timeDiv.style.display = 'none';
            }
            var nowButton = document.createElement('button');
            nowButton.classList.add('duice-input-date__pickerDiv-bodyDiv-timeDiv-nowButton');
            timeDiv.appendChild(nowButton);
            nowButton.addEventListener('click', function (event) {
                var newDate = new Date();
                date.setHours(newDate.getHours());
                date.setMinutes(newDate.getMinutes());
                date.setSeconds(newDate.getSeconds());
                updateDate(date);
            });
            var hourSelect = document.createElement('select');
            hourSelect.classList.add('duice-input-date__pickerDiv-bodyDiv-timeDiv-hourSelect');
            for (var i = 0; i <= 23; i++) {
                var option = document.createElement('option');
                option.value = String(i);
                option.text = lpad(String(i), 2, '0');
                hourSelect.appendChild(option);
            }
            timeDiv.appendChild(hourSelect);
            hourSelect.addEventListener('change', function (event) {
                date.setHours(parseInt(this.value));
            });
            timeDiv.appendChild(document.createTextNode(':'));
            var minuteSelect = document.createElement('select');
            minuteSelect.classList.add('duice-input-date__pickerDiv-bodyDiv-timeDiv-minuteSelect');
            for (var i = 0; i <= 59; i++) {
                var option = document.createElement('option');
                option.value = String(i);
                option.text = lpad(String(i), 2, '0');
                minuteSelect.appendChild(option);
            }
            timeDiv.appendChild(minuteSelect);
            minuteSelect.addEventListener('change', function (event) {
                date.setMinutes(parseInt(this.value));
            });
            timeDiv.appendChild(document.createTextNode(':'));
            var secondSelect = document.createElement('select');
            secondSelect.classList.add('duice-input-date__pickerDiv-bodyDiv-timeDiv-secondSelect');
            for (var i = 0; i <= 59; i++) {
                var option = document.createElement('option');
                option.value = String(i);
                option.text = lpad(String(i), 2, '0');
                secondSelect.appendChild(option);
            }
            timeDiv.appendChild(secondSelect);
            secondSelect.addEventListener('change', function (event) {
                date.setSeconds(parseInt(this.value));
            });
            var footerDiv = document.createElement('div');
            footerDiv.classList.add('duice-input-date__pickerDiv-footerDiv');
            this.pickerDiv.appendChild(footerDiv);
            var confirmButton = document.createElement('button');
            confirmButton.classList.add('duice-input-date__pickerDiv-footerDiv-confirmButton');
            footerDiv.appendChild(confirmButton);
            confirmButton.addEventListener('click', function (event) {
                _this.input.value = _this.mask.encode(date.toISOString());
                _this.setChanged();
                _this.notifyObservers(this);
                _this.closePicker();
            });
            this.input.parentNode.insertBefore(this.pickerDiv, this.input.nextSibling);
            this.pickerDiv.style.position = 'absolute';
            this.pickerDiv.style.zIndex = String(getCurrentMaxZIndex() + 1);
            this.pickerDiv.style.left = getElementPosition(this.input).left + 'px';
            function updateDate(date) {
                var yyyy = date.getFullYear();
                var mm = date.getMonth();
                var dd = date.getDate();
                var hh = date.getHours();
                var mi = date.getMinutes();
                var ss = date.getSeconds();
                for (var i = yyyy - 5, end = yyyy + 5; i <= end; i++) {
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = String(i);
                    yearSelect.appendChild(option);
                }
                yearSelect.value = String(yyyy);
                monthSelect.value = String(mm);
                var startDay = new Date(yyyy, mm, 1).getDay();
                var lastDates = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                if (yyyy % 4 && yyyy % 100 != 0 || yyyy % 400 === 0) {
                    lastDates[1] = 29;
                }
                var lastDate = lastDates[mm];
                var rowNum = Math.ceil((startDay + lastDate - 1) / 7);
                var dNum = 0;
                var currentDate = new Date();
                removeChildNodes(calendarTbody);
                for (var i = 1; i <= rowNum; i++) {
                    var dateTr = document.createElement('tr');
                    dateTr.classList.add('duice-input-date__pickerDiv-bodyDiv-calendarTable-dateTr');
                    for (var k = 1; k <= 7; k++) {
                        var dateTd = document.createElement('td');
                        dateTd.classList.add('duice-input-date__pickerDiv-bodyDiv-calendarTable-dateTd');
                        if ((i === 1 && k < startDay)
                            || (i === rowNum && dNum >= lastDate)) {
                            dateTd.appendChild(document.createTextNode(''));
                        }
                        else {
                            dNum++;
                            dateTd.appendChild(document.createTextNode(String(dNum)));
                            dateTd.dataset.date = String(dNum);
                            if (currentDate.getFullYear() === yyyy
                                && currentDate.getMonth() === mm
                                && currentDate.getDate() === dNum) {
                                dateTd.classList.add('duice-input-date__pickerDiv-bodyDiv-calendarTable-dateTd--today');
                            }
                            if (dd === dNum) {
                                dateTd.classList.add('duice-input-date__pickerDiv-bodyDiv-calendarTable-dateTd--selected');
                            }
                            dateTd.addEventListener('click', function (event) {
                                date.setDate(parseInt(this.dataset.date));
                                updateDate(date);
                                event.preventDefault();
                                event.stopPropagation();
                            });
                        }
                        dateTr.appendChild(dateTd);
                    }
                    calendarTbody.appendChild(dateTr);
                }
                hourSelect.value = String(hh);
                minuteSelect.value = String(mi);
                secondSelect.value = String(ss);
            }
            updateDate(date);
        }
        closePicker() {
            this.pickerDiv.parentNode.removeChild(this.pickerDiv);
            this.pickerDiv = null;
            window.removeEventListener('click', this.clickListener);
        }
    }
    duice.InputDate = InputDate;
    class InputCron extends Input {
        constructor(input) {
            super(input);
            this.readonly = false;
            addClass(this.input, 'duice-input-cron');
            this.input.removeAttribute('type');
            var _this = this;
            this.input.addEventListener('click', function (event) {
                if (_this.readonly !== true) {
                    _this.openPicker();
                }
            }, true);
        }
        update(map, obj) {
            var value = map.get(this.getName());
            value = defaultIfEmpty(value, '');
            this.input.value = value;
            this.setDisable(map.isDisable(this.getName()));
            this.setReadonly(map.isReadonly(this.getName()));
        }
        getValue() {
            var value = this.input.value;
            value = defaultIfEmpty(value, null);
            return value;
        }
        setReadonly(readonly) {
            this.readonly = readonly;
            super.setReadonly(readonly);
        }
        openPicker() {
            if (this.pickerDiv) {
                return;
            }
            var _this = this;
            this.pickerDiv = document.createElement('div');
            this.pickerDiv.classList.add('duice-input-cron__pickerDiv');
            var cronExpression = this.decodeCronExpression(this.input.value);
            this.clickListener = function (event) {
                if (!_this.input.contains(event.target) && !_this.pickerDiv.contains(event.target)) {
                    _this.closePicker();
                }
            };
            window.addEventListener('click', this.clickListener);
            var headerDiv = document.createElement('div');
            headerDiv.classList.add('duice-input-cron__pickerDiv-headerDiv');
            this.pickerDiv.appendChild(headerDiv);
            var titleSpan = document.createElement('span');
            titleSpan.classList.add('duice-input-cron__pickerDiv-headerDiv-titleSpan');
            headerDiv.appendChild(titleSpan);
            var closeButton = document.createElement('button');
            closeButton.classList.add('duice-input-cron__pickerDiv-headerDiv-closeButton');
            headerDiv.appendChild(closeButton);
            closeButton.addEventListener('click', function (event) {
                _this.closePicker();
            });
            var bodyDiv = document.createElement('div');
            bodyDiv.classList.add('duice-input-cron__pickerDiv-bodyDiv');
            this.pickerDiv.appendChild(bodyDiv);
            var minuteOptions = new Array();
            minuteOptions.push({ value: '*', text: 'Every' });
            for (var i = 0; i <= 59; i++) {
                minuteOptions.push({ value: String(i), text: String(i) });
            }
            var minuteSelectorPart = this.createSelectorPart('Minute | ', minuteOptions, cronExpression.minute);
            bodyDiv.appendChild(minuteSelectorPart);
            var hourOptions = new Array();
            hourOptions.push({ value: '*', text: 'Every' });
            for (var i = 0; i <= 23; i++) {
                hourOptions.push({ value: String(i), text: String(i) });
            }
            var hourSelectorPart = this.createSelectorPart('Hour | ', hourOptions, cronExpression.hour);
            bodyDiv.appendChild(hourSelectorPart);
            var dayOptions = new Array();
            dayOptions.push({ value: '*', text: 'Every' });
            dayOptions.push({ value: 'L', text: 'Last Day' });
            for (var i = 1; i <= 31; i++) {
                dayOptions.push({ value: String(i), text: String(i) });
            }
            var daySelectorPart = this.createSelectorPart('Day | ', dayOptions, cronExpression.day);
            bodyDiv.appendChild(daySelectorPart);
            var monthOptions = new Array();
            monthOptions.push({ value: '*', text: 'Every' });
            for (var i = 1; i <= 12; i++) {
                monthOptions.push({ value: String(i), text: String(i) });
            }
            var monthSelectorPart = this.createSelectorPart('Month | ', monthOptions, cronExpression.month);
            bodyDiv.appendChild(monthSelectorPart);
            var weekOptions = new Array();
            weekOptions.push({ value: '*', text: 'Every' });
            weekOptions.push({ value: '1-5', text: 'Weekday' });
            weekOptions.push({ value: '0', text: 'SUN' });
            weekOptions.push({ value: '1', text: 'MON' });
            weekOptions.push({ value: '2', text: 'TUE' });
            weekOptions.push({ value: '3', text: 'WED' });
            weekOptions.push({ value: '4', text: 'THU' });
            weekOptions.push({ value: '5', text: 'FRI' });
            weekOptions.push({ value: '6', text: 'SAT' });
            var weekSelectorPart = this.createSelectorPart('Week', weekOptions, cronExpression.week);
            bodyDiv.appendChild(weekSelectorPart);
            var footerDiv = document.createElement('div');
            footerDiv.classList.add('duice-input-cron__pickerDiv-footerDiv');
            this.pickerDiv.appendChild(footerDiv);
            var confirmButton = document.createElement('button');
            confirmButton.classList.add('duice-input-cron__pickerDiv-footerDiv-confirmButton');
            footerDiv.appendChild(confirmButton);
            confirmButton.addEventListener('click', function (event) {
                var cronExpression = {
                    minute: minuteSelectorPart.querySelector('select').value,
                    hour: hourSelectorPart.querySelector('select').value,
                    day: daySelectorPart.querySelector('select').value,
                    month: monthSelectorPart.querySelector('select').value,
                    week: weekSelectorPart.querySelector('select').value
                };
                _this.input.value = _this.encodeCronExpression(cronExpression);
                _this.setChanged();
                _this.notifyObservers(this);
                _this.closePicker();
            });
            this.input.parentNode.insertBefore(this.pickerDiv, this.input.nextSibling);
            this.pickerDiv.style.position = 'absolute';
            this.pickerDiv.style.zIndex = String(getCurrentMaxZIndex() + 1);
            this.pickerDiv.style.left = getElementPosition(this.input).left + 'px';
        }
        decodeCronExpression(value) {
            var values = value.split(/[\s]{1}/);
            return {
                minute: defaultIfEmpty(values[0], '0'),
                hour: defaultIfEmpty(values[1], '0'),
                day: defaultIfEmpty(values[2], '*'),
                month: defaultIfEmpty(values[3], '*'),
                week: defaultIfEmpty(values[4], '*')
            };
        }
        encodeCronExpression(cronExpression) {
            return defaultIfEmpty(cronExpression.minute, ' ')
                + ' ' + defaultIfEmpty(cronExpression.hour, ' ')
                + ' ' + defaultIfEmpty(cronExpression.day, ' ')
                + ' ' + defaultIfEmpty(cronExpression.month, ' ')
                + ' ' + defaultIfEmpty(cronExpression.week, ' ');
        }
        createSelectorPart(title, options, value) {
            let selectorPart = document.createElement('span');
            selectorPart.classList.add('duice-input-cron__pickerDiv-bodyDiv-selectorPart');
            var select = document.createElement('select');
            options.forEach(function (item) {
                var option = document.createElement('option');
                option.value = item.value;
                option.text = item.text;
                select.appendChild(option);
            });
            select.value = value;
            selectorPart.appendChild(select);
            var label = document.createElement('label');
            label.appendChild(document.createTextNode(title));
            selectorPart.appendChild(label);
            return selectorPart;
        }
        closePicker() {
            this.pickerDiv.parentNode.removeChild(this.pickerDiv);
            this.pickerDiv = null;
            window.removeEventListener('click', this.clickListener);
        }
    }
    duice.InputCron = InputCron;
    class SelectFactory extends MapComponentFactory {
        getComponent(element) {
            var select = new Select(element);
            if (element.dataset.duiceOption) {
                var option = element.dataset.duiceOption.split(',');
                var optionList = this.getContextProperty(option[0]);
                var optionValue = option[1];
                var optionText = option[2];
                select.setOption(optionList, optionValue, optionText);
            }
            var bind = element.dataset.duiceBind.split(',');
            select.bind(this.getContextProperty(bind[0]), bind[1]);
            return select;
        }
    }
    duice.SelectFactory = SelectFactory;
    class Select extends MapComponent {
        constructor(select) {
            super(select);
            this.defaultOptions = new Array();
            this.select = select;
            addClass(this.select, 'duice-select');
            var _this = this;
            this.select.addEventListener('change', function (event) {
                _this.setChanged();
                _this.notifyObservers(this);
            });
            for (var i = 0, size = this.select.options.length; i < size; i++) {
                this.defaultOptions.push(this.select.options[i]);
            }
        }
        setOption(list, value, text) {
            this.optionList = list;
            this.optionValue = value;
            this.optionText = text;
            var _this = this;
            function updateOption(optionList) {
                removeChildNodes(_this.select);
                for (var i = 0, size = _this.defaultOptions.length; i < size; i++) {
                    _this.select.appendChild(_this.defaultOptions[i]);
                }
                for (var i = 0, size = optionList.getRowCount(); i < size; i++) {
                    var optionMap = optionList.getRow(i);
                    var option = document.createElement('option');
                    option.value = optionMap.get(_this.optionValue);
                    option.appendChild(document.createTextNode(optionMap.get(_this.optionText)));
                    _this.select.appendChild(option);
                }
            }
            updateOption(this.optionList);
        }
        update(map, obj) {
            var value = map.get(this.getName());
            this.select.value = defaultIfEmpty(value, '');
            if (this.select.selectedIndex < 0) {
                if (this.defaultOptions.length > 0) {
                    this.defaultOptions[0].selected = true;
                }
            }
            this.setDisable(map.isDisable(this.getName()));
            this.setReadonly(map.isReadonly(this.getName()));
        }
        getValue() {
            var value = this.select.value;
            return defaultIfEmpty(value, null);
        }
        setDisable(disable) {
            if (disable) {
                this.select.setAttribute('disabled', 'true');
            }
            else {
                this.select.removeAttribute('disabled');
            }
        }
        setReadonly(readonly) {
            if (readonly === true) {
                this.select.style.pointerEvents = 'none';
                this.select.classList.add('duice-select--readonly');
            }
            else {
                this.select.style.pointerEvents = '';
                this.select.classList.remove('duice-select--readonly');
            }
        }
    }
    duice.Select = Select;
    class TextareaFactory extends MapComponentFactory {
        getComponent(element) {
            var textarea = new Textarea(element);
            var bind = element.dataset.duiceBind.split(',');
            textarea.bind(this.getContextProperty(bind[0]), bind[1]);
            return textarea;
        }
    }
    duice.TextareaFactory = TextareaFactory;
    class Textarea extends MapComponent {
        constructor(textarea) {
            super(textarea);
            this.textarea = textarea;
            addClass(this.textarea, 'duice-textarea');
            var _this = this;
            this.textarea.addEventListener('change', function (event) {
                _this.setChanged();
                _this.notifyObservers(this);
            });
        }
        update(map, obj) {
            var value = map.get(this.getName());
            this.textarea.value = defaultIfEmpty(value, '');
            this.setDisable(map.isDisable(this.getName()));
            this.setReadonly(map.isReadonly(this.getName()));
        }
        getValue() {
            return defaultIfEmpty(this.textarea.value, null);
        }
        setDisable(disable) {
            if (disable) {
                this.textarea.setAttribute('disabled', 'true');
            }
            else {
                this.textarea.removeAttribute('disabled');
            }
        }
        setReadonly(readonly) {
            if (readonly) {
                this.textarea.setAttribute('readonly', 'readonly');
            }
            else {
                this.textarea.removeAttribute('readonly');
            }
        }
    }
    duice.Textarea = Textarea;
    class ImgFactory extends MapComponentFactory {
        getComponent(element) {
            var img = new Img(element);
            var bind = element.dataset.duiceBind.split(',');
            img.bind(this.getContextProperty(bind[0]), bind[1]);
            if (element.dataset.duiceSize) {
                var size = element.dataset.duiceSize.split(',');
                img.setSize(parseInt(size[0]), parseInt(size[1]));
            }
            return img;
        }
    }
    duice.ImgFactory = ImgFactory;
    class Img extends MapComponent {
        constructor(img) {
            super(img);
            this.img = img;
            addClass(this.img, 'duice-img');
            this.originSrc = this.img.src;
            var _this = this;
            this.img.addEventListener('click', function (event) {
                if (_this.disable || _this.readonly) {
                    return false;
                }
                var imgPosition = getElementPosition(this);
                _this.openMenuDiv(imgPosition.top, imgPosition.left);
                event.stopPropagation();
            });
        }
        setSize(width, height) {
            this.size = { width: width, height: height };
            this.img.style.width = width + 'px';
            this.img.style.height = height + 'px';
        }
        update(map, obj) {
            var value = map.get(this.getName());
            this.value = defaultIfEmpty(value, this.originSrc);
            this.img.src = this.value;
            this.disable = map.isDisable(this.getName());
            this.readonly = map.isReadonly(this.getName());
            if (this.disable) {
                this.img.classList.add('duice-img--disable');
            }
            else {
                this.img.classList.remove('duice-img--disable');
            }
            if (this.readonly) {
                this.img.classList.add('duice-img--readonly');
            }
            else {
                this.img.classList.remove('duice-img--readonly');
            }
        }
        getValue() {
            return this.value;
        }
        openMenuDiv(top, left) {
            if (this.menuDiv) {
                return;
            }
            var _this = this;
            this.menuDiv = document.createElement('div');
            this.menuDiv.classList.add('duice-img__menuDiv');
            if (!this.disable) {
                var previewButton = document.createElement('button');
                previewButton.classList.add('duice-img__menuDiv-previewButton');
                previewButton.addEventListener('click', function (event) {
                    _this.openPreview();
                }, true);
                this.menuDiv.appendChild(previewButton);
            }
            if (!this.disable && !this.readonly) {
                var changeButton = document.createElement('button');
                changeButton.classList.add('duice-img__menuDiv-changeButton');
                changeButton.addEventListener('click', function (event) {
                    _this.changeImage();
                }, true);
                this.menuDiv.appendChild(changeButton);
                var clearButton = document.createElement('button');
                clearButton.classList.add('duice-img__menuDiv-clearButton');
                clearButton.addEventListener('click', function (event) {
                    _this.clearImage();
                }, true);
                this.menuDiv.appendChild(clearButton);
            }
            this.img.parentNode.insertBefore(this.menuDiv, this.img.nextSibling);
            this.menuDiv.style.position = 'absolute';
            this.menuDiv.style.zIndex = String(getCurrentMaxZIndex() + 1);
            this.menuDiv.style.top = top + 'px';
            this.menuDiv.style.left = left + 'px';
            window.addEventListener('click', function (event) {
                _this.closeMenuDiv();
            }, { once: true });
        }
        closeMenuDiv() {
            if (this.menuDiv) {
                this.menuDiv.parentNode.removeChild(this.menuDiv);
                this.menuDiv = null;
            }
        }
        openPreview() {
            var _this = this;
            var parentNode = getCurrentWindow().document.body;
            this.preview = document.createElement('img');
            this.preview.src = this.img.src;
            this.preview.addEventListener('click', function (event) {
                _this.closePreview();
            });
            this.blocker = new duice.Blocker(parentNode);
            this.blocker.getBlockDiv().addEventListener('click', function (event) {
                _this.closePreview();
            });
            this.blocker.block();
            this.preview.style.position = 'absolute';
            this.preview.style.zIndex = String(getCurrentMaxZIndex() + 2);
            parentNode.appendChild(this.preview);
            setPositionCentered(this.preview);
        }
        closePreview() {
            if (this.preview) {
                this.blocker.unblock();
                this.preview.parentNode.removeChild(this.preview);
                this.preview = null;
            }
        }
        changeImage() {
            var _this = this;
            var input = document.createElement('input');
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/gif, image/jpeg, image/png");
            input.addEventListener('change', function (e) {
                var fileReader = new FileReader();
                if (this.files && this.files[0]) {
                    fileReader.addEventListener("load", function (event) {
                        return __awaiter(this, void 0, void 0, function* () {
                            var value = event.target.result;
                            if (_this.size) {
                                value = yield _this.convertImage(value, _this.size.width, _this.size.height);
                            }
                            else {
                                value = yield _this.convertImage(value);
                            }
                            _this.value = value;
                            _this.img.src = value;
                            _this.setChanged();
                            _this.notifyObservers(_this);
                        });
                    });
                    fileReader.readAsDataURL(this.files[0]);
                }
                e.preventDefault();
                e.stopPropagation();
            });
            input.click();
        }
        convertImage(dataUrl, width, height) {
            return new Promise(function (resolve, reject) {
                try {
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    var image = new Image();
                    image.onload = function () {
                        if (width && height) {
                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(image, 0, 0, width, height);
                        }
                        else {
                            canvas.width = image.naturalWidth;
                            canvas.height = image.naturalHeight;
                            ctx.drawImage(image, 0, 0);
                        }
                        var dataUrl = canvas.toDataURL("image/png");
                        resolve(dataUrl);
                    };
                    image.src = dataUrl;
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        clearImage() {
            this.value = null;
            this.setChanged();
            this.notifyObservers(this);
        }
    }
    duice.Img = Img;
    class TableFactory extends ListComponentFactory {
        getComponent(element) {
            var table = new Table(element);
            table.setSelectable(element.dataset.duiceSelectable === 'true');
            table.setEditable(element.dataset.duiceEditable === 'true');
            var bind = element.dataset.duiceBind.split(',');
            table.bind(this.getContextProperty(bind[0]), bind[1]);
            return table;
        }
    }
    duice.TableFactory = TableFactory;
    class Table extends ListComponent {
        constructor(table) {
            super(table);
            this.tbodies = new Array();
            this.table = table;
            addClass(this.table, 'duice-table');
            var caption = this.table.querySelector('caption');
            if (caption) {
                caption = executeExpression(caption, new Object());
                duice.initializeComponent(caption, new Object());
            }
            var thead = this.table.querySelector('thead');
            if (thead) {
                thead.classList.add('duice-table__thead');
                thead.querySelectorAll('tr').forEach(function (tr) {
                    tr.classList.add('duice-table__thead-tr');
                });
                thead.querySelectorAll('th').forEach(function (th) {
                    th.classList.add('duice-table__thead-tr-th');
                });
                thead = executeExpression(thead, new Object());
                duice.initializeComponent(thead, new Object());
            }
            var tbody = this.table.querySelector('tbody');
            this.tbody = tbody.cloneNode(true);
            this.tbody.classList.add('duice-table__tbody');
            this.tbody.querySelectorAll('tr').forEach(function (tr) {
                tr.classList.add('duice-table__tbody-tr');
            });
            this.tbody.querySelectorAll('td').forEach(function (th) {
                th.classList.add('duice-table__tbody-tr-td');
            });
            this.table.removeChild(tbody);
            var tfoot = this.table.querySelector('tfoot');
            if (tfoot) {
                tfoot.classList.add('duice-table__tfoot');
                tfoot.querySelectorAll('tr').forEach(function (tr) {
                    tr.classList.add('duice-table__tfoot-tr');
                });
                tfoot.querySelectorAll('td').forEach(function (td) {
                    td.classList.add('duice-table__tfoot-tr-td');
                });
                tfoot = executeExpression(tfoot, new Object());
                duice.initializeComponent(tfoot, new Object());
            }
        }
        setSelectable(selectable) {
            this.selectable = selectable;
        }
        setEditable(editable) {
            this.editable = editable;
        }
        update(list, obj) {
            if (obj instanceof duice.Map) {
                return;
            }
            var _this = this;
            for (var i = 0; i < this.tbodies.length; i++) {
                this.table.removeChild(this.tbodies[i]);
            }
            this.tbodies.length = 0;
            for (var index = 0; index < list.getRowCount(); index++) {
                var map = list.getRow(index);
                var tbody = this.createTbody(index, map);
                tbody.dataset.duiceIndex = String(index);
                if (this.selectable) {
                    tbody.classList.add('duice-table__tbody--selectable');
                    if (index === list.getIndex()) {
                        tbody.classList.add('duice-table__tbody--index');
                    }
                    tbody.addEventListener('click', function (event) {
                        return __awaiter(this, void 0, void 0, function* () {
                            var index = Number(this.dataset.duiceIndex);
                            yield _this.selectTbody(index);
                        });
                    }, true);
                }
                if (this.editable) {
                    tbody.setAttribute('draggable', 'true');
                    tbody.addEventListener('dragstart', function (event) {
                        event.dataTransfer.setData("text", this.dataset.duiceIndex);
                    });
                    tbody.addEventListener('dragover', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    });
                    tbody.addEventListener('drop', function (event) {
                        return __awaiter(this, void 0, void 0, function* () {
                            event.preventDefault();
                            event.stopPropagation();
                            var fromIndex = parseInt(event.dataTransfer.getData('text'));
                            var toIndex = parseInt(this.dataset.duiceIndex);
                            yield list.moveRow(fromIndex, toIndex);
                        });
                    });
                }
                this.table.appendChild(tbody);
                this.tbodies.push(tbody);
            }
            if (list.getRowCount() < 1) {
                var emptyTbody = this.createEmptyTbody();
                emptyTbody.style.pointerEvents = 'none';
                this.table.appendChild(emptyTbody);
                this.tbodies.push(emptyTbody);
            }
        }
        selectTbody(index) {
            return __awaiter(this, void 0, void 0, function* () {
                this.getList().suspendNotify();
                yield this.getList().selectRow(index);
                for (var i = 0; i < this.tbodies.length; i++) {
                    if (i === index) {
                        this.tbodies[i].classList.add('duice-table__tbody--index');
                    }
                    else {
                        this.tbodies[i].classList.remove('duice-table__tbody--index');
                    }
                }
                this.getList().resumeNotify();
            });
        }
        createTbody(index, map) {
            var _this = this;
            var tbody = this.tbody.cloneNode(true);
            tbody.classList.add('duice-table__tbody');
            var $context = new Object;
            $context['index'] = index;
            $context[this.item] = map;
            tbody = executeExpression(tbody, $context);
            duice.initializeComponent(tbody, $context);
            return tbody;
        }
        createEmptyTbody() {
            var emptyTbody = this.tbody.cloneNode(true);
            removeChildNodes(emptyTbody);
            emptyTbody.classList.add('duice-table__tbody--empty');
            var tr = document.createElement('tr');
            tr.classList.add('duice-table__tbody-tr');
            var td = document.createElement('td');
            td.classList.add('duice-table__tbody-tr-td');
            var colspan = 0;
            var childNodes = this.tbody.querySelector('tr').children;
            for (var i = 0; i < childNodes.length; i++) {
                if (childNodes[i].tagName === 'TH' || childNodes[i].tagName === 'TD') {
                    colspan++;
                }
            }
            td.setAttribute('colspan', String(colspan));
            var emptyMessage = document.createElement('div');
            emptyMessage.style.textAlign = 'center';
            emptyMessage.classList.add('duice-table__tbody--empty-message');
            td.appendChild(emptyMessage);
            tr.appendChild(td);
            emptyTbody.appendChild(tr);
            return emptyTbody;
        }
    }
    duice.Table = Table;
    class UlFactory extends ListComponentFactory {
        getComponent(element) {
            var ul = new Ul(element);
            ul.setSelectable(element.dataset.duiceSelectable === 'true');
            ul.setEditable(element.dataset.duiceEditable === 'true');
            if (element.dataset.duiceHierarchy) {
                var hirearchy = element.dataset.duiceHierarchy.split(',');
                ul.setHierarchy(hirearchy[0], hirearchy[1]);
            }
            ul.setFoldable(element.dataset.duiceFoldable === 'true');
            var bind = element.dataset.duiceBind.split(',');
            ul.bind(this.getContextProperty(bind[0]), bind[1]);
            return ul;
        }
    }
    duice.UlFactory = UlFactory;
    class Ul extends ListComponent {
        constructor(ul) {
            super(ul);
            this.lis = new Array();
            this.foldName = {};
            this.ul = ul;
            addClass(this.ul, 'duice-ul');
            var li = ul.querySelector('li');
            var childUl = li.querySelector('li > ul');
            if (childUl) {
                this.childUl = li.removeChild(childUl);
            }
            else {
                this.childUl = document.createElement('ul');
            }
            this.li = li.cloneNode(true);
        }
        setSelectable(selectable) {
            this.selectable = selectable;
        }
        setEditable(editable) {
            this.editable = editable;
        }
        setHierarchy(idName, parentIdName) {
            this.hierarchy = { idName: idName, parentIdName: parentIdName };
        }
        setFoldable(foldable) {
            this.foldable = foldable;
        }
        update(list, obj) {
            if (obj instanceof duice.Map) {
                return;
            }
            var _this = this;
            this.ul.innerHTML = '';
            this.lis.length = 0;
            this.ul.style.listStyle = 'none';
            this.ul.style.paddingLeft = '0px';
            if (this.hierarchy) {
                this.createHierarchyRoot();
            }
            for (var index = 0; index < list.getRowCount(); index++) {
                var map = list.getRow(index);
                var path = [];
                if (this.hierarchy) {
                    if (isNotEmpty(map.get(this.hierarchy.parentIdName))) {
                        continue;
                    }
                }
                var li = this.createLi(index, map, Number(0));
                if (this.selectable) {
                    li.classList.add('duice-ul__li--selectable');
                }
                this.ul.appendChild(li);
            }
            if (this.hierarchy) {
                for (var index = 0, size = list.getRowCount(); index < size; index++) {
                    if (this.isLiCreated(index) === false) {
                        var orphanLi = this.createLi(index, list.getRow(index), Number(0));
                        orphanLi.classList.add('duice-ul__li--orphan');
                        this.ul.appendChild(orphanLi);
                    }
                }
            }
        }
        createHierarchyRoot() {
            var depth = 0;
            if (this.editable)
                depth += 24;
            if (this.foldable)
                depth += 24;
            if (depth > 0) {
                this.ul.style.paddingLeft = depth + 'px';
            }
            if (this.editable) {
                var _this = this;
                if (this.ul.classList.contains('duice-ul--root')) {
                    return;
                }
                this.ul.classList.add('duice-ul--root');
                this.ul.addEventListener('dragover', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    _this.ul.classList.add('duice-ul--root-dragover');
                });
                this.ul.addEventListener('dragleave', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    _this.ul.classList.remove('duice-ul--root-dragover');
                });
                this.ul.addEventListener('drop', function (event) {
                    return __awaiter(this, void 0, void 0, function* () {
                        event.preventDefault();
                        event.stopPropagation();
                        var fromIndex = parseInt(event.dataTransfer.getData('text'));
                        yield _this.moveLi(fromIndex, -1);
                    });
                });
            }
        }
        createLi(index, map, depth) {
            var _this = this;
            var li = this.li.cloneNode(true);
            li.classList.add('duice-ui-ul__li');
            var $context = new Object;
            $context['index'] = index;
            $context['depth'] = Number(depth);
            $context['hasChild'] = (this.hierarchy ? this.hasChild(map) : false);
            $context[this.item] = map;
            li = executeExpression(li, $context);
            duice.initializeComponent(li, $context);
            this.lis.push(li);
            li.dataset.duiceIndex = String(index);
            if (this.selectable) {
                if (index === this.getList().getIndex()) {
                    li.classList.add('duice-ul__li--index');
                }
                li.addEventListener('click', function (event) {
                    return __awaiter(this, void 0, void 0, function* () {
                        var index = Number(this.dataset.duiceIndex);
                        event.stopPropagation();
                        yield _this.selectLi(index, this);
                    });
                });
            }
            if (this.editable) {
                li.setAttribute('draggable', 'true');
                li.addEventListener('dragstart', function (event) {
                    event.stopPropagation();
                    event.dataTransfer.setData("text", this.dataset.duiceIndex);
                });
                li.addEventListener('dragover', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
                li.addEventListener('drop', function (event) {
                    return __awaiter(this, void 0, void 0, function* () {
                        event.preventDefault();
                        event.stopPropagation();
                        var fromIndex = parseInt(event.dataTransfer.getData('text'));
                        var toIndex = parseInt(this.dataset.duiceIndex);
                        yield _this.moveLi(fromIndex, toIndex);
                    });
                });
            }
            if (this.hierarchy) {
                depth++;
                var childUl = this.childUl.cloneNode(true);
                childUl.classList.add('duice-ul');
                $context['depth'] = Number(depth);
                childUl = executeExpression(childUl, $context);
                var hasChild = false;
                var hierarchyIdValue = map.get(this.hierarchy.idName);
                for (var i = 0, size = this.list.getRowCount(); i < size; i++) {
                    var element = this.list.getRow(i);
                    var hierarchyParentIdValue = element.get(this.hierarchy.parentIdName);
                    if (!isEmpty(hierarchyParentIdValue)
                        && hierarchyParentIdValue === hierarchyIdValue) {
                        var childLi = this.createLi(i, element, Number(depth));
                        childUl.appendChild(childLi);
                        hasChild = true;
                    }
                }
                if (hasChild) {
                    li.appendChild(childUl);
                }
                if (this.foldable === true) {
                    if (hasChild) {
                        if (this.isFoldLi(map)) {
                            this.foldLi(map, li, true);
                        }
                        else {
                            this.foldLi(map, li, false);
                        }
                        li.addEventListener('click', function (event) {
                            event.preventDefault();
                            event.stopPropagation();
                            if (event.target === this) {
                                if (_this.isFoldLi(map)) {
                                    _this.foldLi(map, this, false);
                                }
                                else {
                                    _this.foldLi(map, this, true);
                                }
                            }
                        });
                    }
                    else {
                        this.foldLi(map, li, false);
                    }
                }
            }
            return li;
        }
        selectLi(index, li) {
            return __awaiter(this, void 0, void 0, function* () {
                this.getList().suspendNotify();
                yield this.getList().selectRow(index);
                for (var i = 0; i < this.lis.length; i++) {
                    this.lis[i].classList.remove('duice-ul__li--index');
                }
                li.classList.add('duice-ul__li--index');
                this.getList().resumeNotify();
            });
        }
        hasChild(map) {
            var hierarchyIdValue = map.get(this.hierarchy.idName);
            for (var i = 0, size = this.list.getRowCount(); i < size; i++) {
                var element = this.list.getRow(i);
                var hierarchyParentIdValue = element.get(this.hierarchy.parentIdName);
                if (!isEmpty(hierarchyParentIdValue)
                    && hierarchyParentIdValue === hierarchyIdValue) {
                    return true;
                }
            }
            return false;
        }
        isLiCreated(index) {
            for (var i = 0, size = this.lis.length; i < size; i++) {
                if (parseInt(this.lis[i].dataset.duiceIndex) === index) {
                    return true;
                }
            }
            return false;
        }
        isFoldLi(map) {
            if (this.foldName[map.get(this.hierarchy.idName)] === true) {
                return true;
            }
            else {
                return false;
            }
        }
        foldLi(map, li, fold) {
            if (fold) {
                this.foldName[map.get(this.hierarchy.idName)] = true;
                li.classList.remove('duice-ul__li--unfold');
                li.classList.add('duice-ul__li--fold');
            }
            else {
                this.foldName[map.get(this.hierarchy.idName)] = false;
                li.classList.remove('duice-ul__li--fold');
                li.classList.add('duice-ul__li--unfold');
            }
        }
        moveLi(fromIndex, toIndex) {
            return __awaiter(this, void 0, void 0, function* () {
                if (fromIndex === toIndex) {
                    return;
                }
                var sourceRow = this.list.getRow(fromIndex);
                var targetRow = this.list.getRow(toIndex) || null;
                if (this.hierarchy) {
                    if (this.isCircularReference(targetRow, sourceRow.get(this.hierarchy.idName))) {
                        throw 'Not allow to movem, becuase of Circular Reference.';
                    }
                    if (this.list.eventListener.onBeforeMoveRow) {
                        if ((yield this.list.eventListener.onBeforeMoveRow.call(this.list, sourceRow, targetRow)) === false) {
                            throw 'canceled';
                        }
                    }
                    yield sourceRow.set(this.hierarchy.parentIdName, targetRow === null ? null : targetRow.get(this.hierarchy.idName));
                    if (this.list.eventListener.onAfterMoveRow) {
                        yield this.list.eventListener.onAfterMoveRow.call(this.list, sourceRow, targetRow);
                    }
                    this.setChanged();
                    this.notifyObservers(null);
                }
                else {
                    yield this.list.moveRow(fromIndex, toIndex);
                }
            });
        }
        getParentMap(map) {
            var parentIdValue = map.get(this.hierarchy.parentIdName);
            for (var i = 0, size = this.list.getRowCount(); i < size; i++) {
                var element = this.list.getRow(i);
                if (element.get(this.hierarchy.idName) === parentIdValue) {
                    return element;
                }
            }
            return null;
        }
        isCircularReference(map, idValue) {
            var parentMap = map;
            while (parentMap !== null) {
                parentMap = this.getParentMap(parentMap);
                if (parentMap === null) {
                    return false;
                }
                if (parentMap.get(this.hierarchy.idName) === idValue) {
                    return true;
                }
            }
        }
    }
    duice.Ul = Ul;
    duice.ComponentDefinitionRegistry.add(new ComponentDefinition('table[is="duice-table"]', duice.TableFactory));
    duice.ComponentDefinitionRegistry.add(new ComponentDefinition('ul[is="duice-ul"]', duice.UlFactory));
    duice.ComponentDefinitionRegistry.add(new ComponentDefinition('input[is="duice-input"]', duice.InputFactory));
    duice.ComponentDefinitionRegistry.add(new ComponentDefinition('select[is="duice-select"]', duice.SelectFactory));
    duice.ComponentDefinitionRegistry.add(new ComponentDefinition('textarea[is="duice-textarea"]', duice.TextareaFactory));
    duice.ComponentDefinitionRegistry.add(new ComponentDefinition('img[is="duice-img"]', duice.ImgFactory));
    duice.ComponentDefinitionRegistry.add(new ComponentDefinition('span[is="duice-span"]', duice.SpanFactory));
    duice.ComponentDefinitionRegistry.add(new ComponentDefinition('div[is="duice-div"]', duice.DivFactory));
    duice.ComponentDefinitionRegistry.add(new ComponentDefinition('*[is="duice-scriptlet"]', duice.ScriptletFactory));
})(duice || (duice = {}));
document.addEventListener("DOMContentLoaded", function (event) {
    duice.initializeComponent(document, {});
});
