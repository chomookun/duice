"use strict";
/* =============================================================================
 * DUICE (Data-oriented UI Component Engine)
 * - Anyone can use it freely.
 * - Modify the source or allow re-creation. However, you must state that you have the original creator.
 * - However, we can not grant patents or licenses for reproductives. (Modifications or reproductions must be shared with the public.)
 * Licence: LGPL(GNU Lesser General Public License version 3)
 * Copyright (C) 2017 duice.oopscraft.net
 * ============================================================================= */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
/**
 * project package
 */
var duice;
(function (duice) {
    /**
     * duice.Observable
     * Observable abstract class of Observer Pattern
     */
    var Observable = /** @class */ (function () {
        function Observable() {
            this.observers = new Array();
            this.changed = false;
        }
        /**
         * Adds observer instance
         * @param observer
         */
        Observable.prototype.addObserver = function (observer) {
            for (var i = 0, size = this.observers.length; i < size; i++) {
                if (this.observers[i] === observer) {
                    return;
                }
            }
            this.observers.push(observer);
        };
        /**
         * Removes specified observer instance from observer instances
         * @param observer
         */
        Observable.prototype.removeObserver = function (observer) {
            for (var i = 0, size = this.observers.length; i < size; i++) {
                if (this.observers[i] === observer) {
                    this.observers.splice(i, 1);
                    return;
                }
            }
        };
        /**
         * Notifies changes to observers
         * @param obj object to transfer to observer
         */
        Observable.prototype.notifyObservers = function (obj) {
            if (this.hasChanged()) {
                this.clearUnavailableObservers();
                for (var i = 0, size = this.observers.length; i < size; i++) {
                    try {
                        this.observers[i].update(this, obj);
                    }
                    catch (e) {
                        console.error(e, this.observers[i]);
                    }
                }
                this.clearChanged();
            }
        };
        /**
         * Sets changed flag
         */
        Observable.prototype.setChanged = function () {
            this.changed = true;
        };
        /**
         * Returns changed flag
         */
        Observable.prototype.hasChanged = function () {
            return this.changed;
        };
        /**
         * Clears changed flag
         */
        Observable.prototype.clearChanged = function () {
            this.changed = false;
        };
        /**
         * Clears unavailable observers to prevent memory leak
         */
        Observable.prototype.clearUnavailableObservers = function () {
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
        };
        return Observable;
    }());
    /**
     * Generates random UUID value
     * @return  UUID string
     */
    function generateUUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    /**
     * getObject
     * @param   Scope context in which the variable exists
     * @param   variable name to find
     * @return  found variables(or object)
     */
    function getObject($context, name) {
        if ($context[name]) {
            return $context[name];
        }
        if (window.hasOwnProperty(name)) {
            return window[name];
        }
        try {
            return eval.call($context, name);
        }
        catch (e) {
            console.error(e, $context, name);
            throw e;
        }
    }
    /**
     * Check if value is empty
     * @param value
     * @return whether value is empty
     */
    function isEmpty(value) {
        if (value === undefined
            || value === null
            || value === '') {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Check if value is not empty
     * @param value
     * @return whether value is not empty
     */
    function isNotEmpty(value) {
        if (isEmpty(value)) {
            return false;
        }
        else {
            return true;
        }
    }
    /**
     * Checks if value is empty and return specified value as default
     * @param value to check
     * @param default value if value is empty
     */
    function defaultIfEmpty(value, defaultValue) {
        if (isEmpty(value) === true) {
            return defaultValue;
        }
        else {
            return value;
        }
    }
    /**
     * converts value to left-padded value
     * @param original value
     * @param length to pad
     * @param pading character
     * @return left-padded value
     */
    function lpad(value, length, padChar) {
        for (var i = 0, size = (length - value.length); i < size; i++) {
            value = padChar + value;
        }
        return value;
    }
    /**
     * converts value to right-padded value
     * @param original value
     * @param length to pad
     * @param pading character
     * @return right-padded string
     */
    function rpad(value, length, padChar) {
        for (var i = 0, size = (length - value.length); i < size; i++) {
            value = value + padChar;
        }
        return value;
    }
    /**
     * Converts value to masked value.
     * @param value
     * @param type
     * @param format
     */
    function mask(value, type, format) {
        switch (type) {
            // string type
            case 'string':
                var string = '';
                var index = -1;
                for (var i = 0, size = format.length; i < size; i++) {
                    var formatChar = format.charAt(i);
                    if (formatChar === '#') {
                        index++;
                        string += value.charAt(index);
                    }
                    else {
                        string += formatChar;
                    }
                }
                return string;
            // number
            case 'number':
                var number;
                if (typeof value === 'number') {
                    number = value;
                }
                else if (typeof value === 'string') {
                    value = value.replace(/\,/gi, '');
                    number = Number(value);
                }
                else {
                    number = Number(value);
                }
                if (isNaN(number)) {
                    throw 'NaN';
                }
                var scale = parseInt(format);
                var maskValue = String(number.toFixed(scale));
                var reg = /(^[+-]?\d+)(\d{3})/;
                while (reg.test(maskValue)) {
                    maskValue = maskValue.replace(reg, '$1' + ',' + '$2');
                }
                return maskValue;
            // date
            case 'date':
                var date;
                if (value instanceof Date) {
                    date = value;
                }
                else if (typeof value === 'number') {
                    date = new Date(value);
                }
                else {
                    throw 'Not Date Type';
                }
                var formatRex = /yyyy|yy|MM|dd|HH|hh|mm|ss/gi;
                var maskValue = format.replace(formatRex, function ($1) {
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
                return maskValue;
            // default
            default:
                throw 'encodeMask-type must be string|number|date';
        }
    }
    /**
     * Converts masked value to original value.
     * @param value
     * @param type
     * @param format
     */
    function unmask(value, type, format) {
        switch (type) {
            // string type
            case 'string':
                if (isEmpty(value)) {
                    return null;
                }
                // TODO
                return value;
            // number type
            case 'number':
                if (isEmpty(value)) {
                    return null;
                }
                var number;
                if (typeof value === 'number') {
                    number = value;
                }
                else if (typeof value === 'string') {
                    value = value.replace(/,/g, '');
                    number = Number(value);
                }
                else {
                    number = Number(value);
                }
                if (isNaN(number)) {
                    throw 'NaN';
                }
                var scale = parseInt(format);
                return number.toFixed(scale);
            // date type
            case 'date':
                if (isEmpty(value)) {
                    return null;
                }
                if (value.length !== format.length) {
                    throw 'value length is mismatch:' + value;
                }
                var date = new Date();
                date.setFullYear(0);
                date.setMonth(0);
                date.setDate(1);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                var formatRex = /yyyy|yy|MM|dd|HH|hh|mm|ss/gi;
                var match;
                while ((match = formatRex.exec(format)) != null) {
                    var formatStr = match[0];
                    var formatIndex = match.index;
                    var formatLength = formatStr.length;
                    var matchValue = value.substr(formatIndex, formatLength);
                    matchValue = lpad(matchValue, formatLength, '0');
                    if (isNaN(Number(matchValue))) {
                        throw 'Not a Date - ' + formatStr + ':' + matchValue;
                    }
                    switch (formatStr) {
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
                return date;
            // default 
            default:
                throw 'encodeMask-type must be string|number|date';
        }
    }
    /**
     * Executes custom expression in HTML element and returns.
     * @param element
     * @param $context
     * @return converted HTML element
     */
    function executeExpression(element, $context) {
        var string = element.outerHTML;
        string = string.replace(/\[\[([\s\S]*?)\]\]/mgi, function (match, command) {
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
    /**
     * Escapes HTML tag from string value
     * @param value
     * @return escaped string value
     */
    function escapeHTML(value) {
        // checks value is valid.
        if (!value || typeof value !== 'string') {
            return value;
        }
        // replace tag
        var htmlMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        // replace and returns
        return value.replace(/[&<>"']/g, function (m) {
            return htmlMap[m];
        });
    }
    /**
     * Removes child elements from HTML element.
     * @param element
     */
    function removeChildNodes(element) {
        // Remove element nodes and prevent memory leaks
        var node, nodes = element.childNodes, i = 0;
        while (node = nodes[i++]) {
            if (node.nodeType === 1) {
                element.removeChild(node);
            }
        }
        // Remove any remaining nodes
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        // If this is a select, ensure that it displays empty
        if (element instanceof HTMLSelectElement) {
            element.options.length = 0;
        }
    }
    /**
     * Returns current upper window object.
     * @return window object
     */
    function getCurrentWindow() {
        if (window.frameElement) {
            return window.parent;
        }
        else {
            return window;
        }
    }
    /**
     * Sets element position to be centered
     * @param element
     */
    function setPositionCentered(element) {
        var win = getCurrentWindow();
        var computedStyle = win.getComputedStyle(element);
        var computedWidth = parseInt(computedStyle.getPropertyValue('width').replace(/px/gi, ''));
        var computedHeight = parseInt(computedStyle.getPropertyValue('height').replace(/px/gi, ''));
        element.style.left = Math.max(0, win.innerWidth / 2 - computedWidth / 2) + win.scrollX + 'px';
        element.style.top = Math.max(0, win.innerHeight / 2 - computedHeight / 2) + win.scrollY + 'px';
    }
    /**
     * Returns position info of specified element
     * @param element
     */
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
    /**
     * Delays specified milliseconds and calls specified function
     * @param callback
     */
    function delayCall(millis, callback, $this) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        var interval = setInterval(function () {
            try {
                callback.call.apply(callback, __spreadArrays([$this], args));
            }
            catch (e) {
                throw e;
            }
            finally {
                clearInterval(interval);
            }
        }, millis);
    }
    /**
     * Returns current max z-index value.
     * @return max z-index value
     */
    function getCurrentMaxZIndex() {
        var zIndex, z = 0, all = document.getElementsByTagName('*');
        for (var i = 0, n = all.length; i < n; i++) {
            zIndex = document.defaultView.getComputedStyle(all[i], null).getPropertyValue("z-index");
            zIndex = parseInt(zIndex, 10);
            z = (zIndex) ? Math.max(z, zIndex) : z;
        }
        return z;
    }
    /**
     * duice.StringMask
     * @param string format to mask
     */
    var StringMask = /** @class */ (function () {
        function StringMask() {
        }
        StringMask.prototype.setFormat = function (format) {
            this.format = format;
        };
        StringMask.prototype.encode = function (value) {
            return value;
        };
        StringMask.prototype.validate = function (value) {
            return true;
        };
        StringMask.prototype.decode = function (value) {
            return value;
        };
        return StringMask;
    }());
    duice.StringMask = StringMask;
    /**
     * duice.NumberMask
     * @param scale number scale
     */
    var NumberMask = /** @class */ (function () {
        function NumberMask() {
            this.scale = 0;
        }
        NumberMask.prototype.setScale = function (scale) {
            this.scale = scale;
        };
        NumberMask.prototype.encode = function (number) {
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
        };
        NumberMask.prototype.validate = function (string) {
            string = this.decode(string);
            if (isEmpty(string)) {
                return false;
            }
            else {
                return true;
            }
        };
        NumberMask.prototype.decode = function (string) {
            if (isEmpty(string)) {
                return null;
            }
            string = string.replace(/\,/gi, '');
            if (isNaN(Number(string))) {
                return null;
            }
            var number = Number(string);
            number = Number(number.toFixed(this.scale));
            return number;
        };
        return NumberMask;
    }());
    duice.NumberMask = NumberMask;
    /**
     * duice.DateMask
     */
    var DateMask = /** @class */ (function () {
        function DateMask() {
        }
        DateMask.prototype.setFormat = function (format) {
            this.format = format;
        };
        DateMask.prototype.encode = function (number) {
            if (isEmpty(number)) {
                return '';
            }
            if (isEmpty(this.format)) {
                return new Date(number).toString();
            }
            var date = new Date(number);
            var formatRex = /yyyy|yy|MM|dd|HH|hh|mm|ss/gi;
            var string = this.format.replace(formatRex, function ($1) {
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
        };
        DateMask.prototype.validate = function (value) {
            return true;
        };
        DateMask.prototype.decode = function (string) {
            if (isEmpty(string)) {
                return null;
            }
            if (isEmpty(this.format)) {
                return new Date(string).getTime();
            }
            var date = new Date();
            date.setFullYear(0);
            date.setMonth(0);
            date.setDate(1);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            var formatRex = /yyyy|yy|MM|dd|HH|hh|mm|ss/gi;
            var match;
            while ((match = formatRex.exec(this.format)) != null) {
                var formatStr = match[0];
                var formatIndex = match.index;
                var formatLength = formatStr.length;
                var matchValue = string.substr(formatIndex, formatLength);
                matchValue = lpad(matchValue, formatLength, '0');
                if (isNaN(Number(matchValue))) {
                    throw 'Not a Date - ' + formatStr + ':' + matchValue;
                }
                switch (formatStr) {
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
            var number = date.getTime();
            return number;
        };
        return DateMask;
    }());
    duice.DateMask = DateMask;
    /**
     * duice.data
     * package of Data structure
     */
    var data;
    (function (data) {
        /**
         * Abstract data object
         * extends from Observable and implements Observer interface.
         */
        var DataObject = /** @class */ (function (_super) {
            __extends(DataObject, _super);
            function DataObject() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            /**
             * Returns whether instance is active
             */
            DataObject.prototype.isAvailable = function () {
                return true;
            };
            return DataObject;
        }(Observable));
        data.DataObject = DataObject;
        /**
         * Map data structure
         * @param JSON object
         */
        var Map = /** @class */ (function (_super) {
            __extends(Map, _super);
            /**
             * constructor
             * @param json
             */
            function Map(json) {
                var _this = _super.call(this) || this;
                _this.data = new Object(); // internal data object
                _this.enable = true; // enable
                _this.readonly = new Array(); // read only names
                if (json) {
                    _this.fromJson(json);
                }
                return _this;
            }
            /**
             * Updates data from observable instance
             * @param uiElement
             * @param obj
             */
            Map.prototype.update = function (uiElement, obj) {
                console.info('Map.update', uiElement, obj);
                var name = uiElement.getName();
                var value = uiElement.getValue();
                this.set(name, value);
            };
            /**
             * Loads data from JSON object.
             * @param json
             */
            Map.prototype.fromJson = function (json) {
                // sets data
                this.data = new Object();
                for (var name in json) {
                    this.data[name] = json[name];
                }
                // saves original data.
                this.originData = JSON.stringify(this.toJson());
                // notify to observers
                this.setChanged();
                this.notifyObservers(this);
            };
            /**
             * Convert data to JSON object
             * @return JSON object
             */
            Map.prototype.toJson = function () {
                var json = new Object();
                for (var name in this.data) {
                    json[name] = this.data[name];
                }
                return json;
            };
            /**
             * Checks original data is changed
             * @return whether original data is changed or not
             */
            Map.prototype.isDirty = function () {
                if (JSON.stringify(this.toJson()) === this.originData) {
                    return false;
                }
                else {
                    return true;
                }
            };
            /**
             * Restores instance as original data
             */
            Map.prototype.reset = function () {
                var originJson = JSON.parse(this.originData);
                this.fromJson(originJson);
            };
            /**
             * Sets property as input value
             * @param name
             * @param value
             */
            Map.prototype.set = function (name, value) {
                this.data[name] = value;
                this.setChanged();
                this.notifyObservers(this);
            };
            /**
             * Gets specified property value.
             * @param name
             */
            Map.prototype.get = function (name) {
                return this.data[name];
            };
            /**
             * Returns properties names as array.
             * @return array of names
             */
            Map.prototype.getNames = function () {
                var names = new Array();
                for (var name in this.data) {
                    names.push(name);
                }
                return names;
            };
            /**
             * Sets instance to be enabled.
             * @param whether enable or not
             */
            Map.prototype.setEnable = function (enable) {
                this.enable = enable;
                this.setChanged();
                this.notifyObservers(this);
            };
            /**
             * Returns instance is enabled.
             * @return whether enable or not
             */
            Map.prototype.isEnable = function () {
                return this.enable;
            };
            /**
             * Sets read-only specified name
             * @param name
             * @param readonly
             */
            Map.prototype.setReadonly = function (name, readonly) {
                if (this.readonly.indexOf(name) == -1) {
                    this.readonly.push(name);
                }
                this.setChanged();
                this.notifyObservers(this);
            };
            /**
             * Returns specified name is read-only
             * @param name
             * @return whether specified property is read-only or not
             */
            Map.prototype.isReadonly = function (name) {
                if (this.readonly.indexOf(name) >= 0) {
                    return true;
                }
                else {
                    return false;
                }
            };
            return Map;
        }(DataObject));
        data.Map = Map;
        /**
         * duice.data.List
         */
        var List = /** @class */ (function (_super) {
            __extends(List, _super);
            function List(jsonArray, __childName) {
                var _this = _super.call(this) || this;
                _this.data = new Array();
                _this.index = -1;
                if (jsonArray) {
                    _this.fromJson(jsonArray);
                }
                return _this;
            }
            List.prototype.update = function (observable, obj) {
                console.log('List.update', observable, obj);
                this.setChanged();
                this.notifyObservers(obj);
            };
            List.prototype.fromJson = function (jsonArray) {
                this.data = new Array();
                for (var i = 0; i < jsonArray.length; i++) {
                    var map = new duice.data.Map(jsonArray[i]);
                    map.addObserver(this);
                    this.data.push(map);
                }
                this.originData = JSON.stringify(this.toJson());
                this.clearIndex();
                this.setChanged();
                this.notifyObservers(this);
            };
            List.prototype.toJson = function (__childName) {
                var jsonArray = new Array();
                for (var i = 0; i < this.data.length; i++) {
                    jsonArray.push(this.data[i].toJson());
                }
                return jsonArray;
            };
            List.prototype.isDirty = function () {
                if (JSON.stringify(this.toJson()) === this.originData) {
                    return false;
                }
                else {
                    return true;
                }
            };
            List.prototype.reset = function () {
                var originJson = JSON.parse(this.originData);
                this.fromJson(originJson);
            };
            List.prototype.setIndex = function (index) {
                this.index = index;
                this.setChanged();
                this.notifyObservers(this);
            };
            List.prototype.getIndex = function () {
                return this.index;
            };
            List.prototype.clearIndex = function () {
                this.index = -1;
                this.setChanged();
                this.notifyObservers(this);
            };
            List.prototype.getSize = function () {
                return this.data.length;
            };
            List.prototype.get = function (index) {
                return this.data[index];
            };
            List.prototype.add = function (map) {
                map.addObserver(this);
                this.data.push(map);
                this.index = this.getSize() - 1;
                this.setChanged();
                this.notifyObservers(this);
            };
            List.prototype.insert = function (index, map) {
                if (0 <= index && index < this.data.length) {
                    map.addObserver(this);
                    this.data.splice(index, 0, map);
                    this.index = index;
                    this.setChanged();
                    this.notifyObservers(this);
                }
            };
            List.prototype.remove = function (index) {
                if (0 <= index && index < this.data.length) {
                    this.data.splice(index, 1);
                    this.index = Math.min(this.index, this.data.length - 1);
                    this.setChanged();
                    this.notifyObservers(this);
                }
            };
            List.prototype.move = function (fromIndex, toIndex) {
                this.index = fromIndex;
                this.data.splice(toIndex, 0, this.data.splice(fromIndex, 1)[0]);
                this.index = toIndex;
                this.setChanged();
                this.notifyObservers(this);
            };
            List.prototype.forEach = function (handler) {
                for (var i = 0, size = this.data.length; i < size; i++) {
                    handler.call(this, this.data[i]);
                }
            };
            List.prototype.sort = function (name, ascending) {
                this.data.sort(function (a, b) {
                    var aValue = a.get(name);
                    var bValue = b.get(name);
                    return (aValue > bValue ? 1 : aValue < bValue ? -1 : 0) * (ascending == false ? -1 : 1);
                });
                this.setChanged();
                this.notifyObservers(this);
            };
            return List;
        }(DataObject));
        data.List = List;
    })(data = duice.data || (duice.data = {}));
    /**
     * duice.ui
     */
    var ui;
    (function (ui) {
        /**
         * duice.initialize
         * @param container
         * @param $context
         */
        function initialize(container, $context) {
            // ul
            var ulElements = container.querySelectorAll('ul[is="duice-ui-ul"][data-duice-bind]:not([data-duice-id])');
            for (var i = 0; i < ulElements.length; i++) {
                try {
                    var element = ulElements[i];
                    duice.ui.UListFactory.getUList(element, $context);
                }
                catch (e) {
                    console.error(e, element);
                    throw e;
                }
            }
            // table
            var tableElements = container.querySelectorAll('table[is="duice-ui-table"][data-duice-bind]:not([data-duice-id])');
            for (var i = 0; i < tableElements.length; i++) {
                try {
                    var element = tableElements[i];
                    duice.ui.TableFactory.getTable(element, $context);
                }
                catch (e) {
                    console.error(e, element);
                    throw e;
                }
            }
            // creates unit elements
            var elementTags = [
                '*[is="duice-ui-scriptlet"]:not([data-duice-id])',
                'span[is="duice-ui-span"][data-duice-bind]:not([data-duice-id])',
                'input[is="duice-ui-input"][data-duice-bind]:not([data-duice-id])',
                'select[is="duice-ui-select"][data-duice-bind]:not([data-duice-id])',
                'textarea[is="duice-ui-textarea"][data-duice-bind]:not([data-duice-id])',
                'img[is="duice-ui-img"][data-duice-bind]:not([data-duice-id])'
            ];
            var elements = container.querySelectorAll(elementTags.join(','));
            for (var i = 0; i < elements.length; i++) {
                try {
                    var element = elements[i];
                    var is = element.getAttribute('is');
                    switch (is) {
                        case 'duice-ui-span':
                            duice.ui.SpanFactory.getSpan(element, $context);
                            break;
                        case 'duice-ui-input':
                            duice.ui.InputFactory.getInput(element, $context);
                            break;
                        case 'duice-ui-select':
                            duice.ui.SelectFactory.getSelect(element, $context);
                            break;
                        case 'duice-ui-textarea':
                            duice.ui.TextareaFactory.getTextarea(element, $context);
                            break;
                        case 'duice-ui-img':
                            duice.ui.ImageFactory.getImage(element, $context);
                            break;
                        case 'duice-ui-scriptlet':
                            duice.ui.ScriptletFactory.getScriptlet(element, $context);
                            break;
                    }
                }
                catch (e) {
                    console.error(e, elements[i]);
                    throw e;
                }
            }
        }
        ui.initialize = initialize;
        /**
         * duice.ui.UIElement
         */
        var UIElement = /** @class */ (function (_super) {
            __extends(UIElement, _super);
            function UIElement(element) {
                var _this = _super.call(this) || this;
                _this.element = element;
                _this.element.dataset.duiceId = generateUUID();
                return _this;
            }
            UIElement.prototype.isAvailable = function () {
                // contains method not support(IE)
                if (!Node.prototype.contains) {
                    Node.prototype.contains = function (el) {
                        while (el = el.parentNode) {
                            if (el === this)
                                return true;
                        }
                        return false;
                    };
                }
                // checks contains element
                if (document.contains(this.element)) {
                    return true;
                }
                else {
                    return false;
                }
            };
            return UIElement;
        }(Observable));
        ui.UIElement = UIElement;
        /**
         * duice.ui.SpanFactory
         */
        ui.ScriptletFactory = {
            getScriptlet: function (element, $context) {
                var expression = new Scriptlet(element);
                var context;
                if ($context !== window) {
                    context = $context;
                }
                else {
                    context = {};
                }
                if (element.dataset.duiceBind) {
                    var bind = element.dataset.duiceBind.split(',');
                    bind.forEach(function (name) {
                        context[name] = getObject($context, name);
                    });
                }
                expression.bind(context);
                return expression;
            }
        };
        /**
         * duice.ui.Scriptlet
         */
        var Scriptlet = /** @class */ (function (_super) {
            __extends(Scriptlet, _super);
            function Scriptlet(element) {
                var _this = _super.call(this, element) || this;
                _this.expression = element.innerHTML;
                return _this;
            }
            ;
            Scriptlet.prototype.bind = function (context) {
                this.context = context;
                for (var name in this.context) {
                    var obj = this.context[name];
                    if (typeof obj === 'object'
                        && obj instanceof duice.data.DataObject) {
                        obj.addObserver(this);
                        this.addObserver(obj);
                        this.update(obj, obj);
                    }
                }
            };
            Scriptlet.prototype.update = function (dataObject, obj) {
                var func = Function('$context', '"use strict";' + this.expression + '');
                var result = func(this.context);
                this.element.innerHTML = '';
                this.element.appendChild(document.createTextNode(result));
                this.element.style.display = 'inline-block';
            };
            return Scriptlet;
        }(UIElement));
        ui.Scriptlet = Scriptlet;
        var MapUIElement = /** @class */ (function (_super) {
            __extends(MapUIElement, _super);
            function MapUIElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MapUIElement.prototype.bind = function (map, name) {
                this.map = map;
                this.name = name;
                this.map.addObserver(this);
                this.addObserver(this.map);
                this.update(this.map, this.map);
            };
            MapUIElement.prototype.getMap = function () {
                return this.map;
            };
            MapUIElement.prototype.getName = function () {
                return this.name;
            };
            return MapUIElement;
        }(UIElement));
        ui.MapUIElement = MapUIElement;
        /**
         * duice.ui.SpanFactory
         */
        ui.SpanFactory = {
            getSpan: function (element, $context) {
                var span = new Span(element);
                // sets mask
                if (element.dataset.duiceMask) {
                    var duiceMask = element.dataset.duiceMask.split(',');
                    var type = duiceMask[0];
                    var mask;
                    switch (type) {
                        case 'string':
                            mask = new StringMask();
                            mask.setFormat(duiceMask[1]);
                            break;
                        case 'number':
                            mask = new NumberMask();
                            mask.setScale(parseInt(duiceMask[1]));
                            break;
                        case 'date':
                            mask = new DateMask();
                            mask.setFormat(duiceMask[1]);
                            break;
                        default:
                            throw 'mask type[' + type + '] is invalid';
                    }
                    span.setMask(mask);
                }
                // binds
                var bind = element.dataset.duiceBind.split(',');
                span.bind(getObject($context, bind[0]), bind[1]);
                return span;
            }
        };
        /**
         * duice.ui.Span
         */
        var Span = /** @class */ (function (_super) {
            __extends(Span, _super);
            function Span(span) {
                var _this = _super.call(this, span) || this;
                _this.span = span;
                _this.span.classList.add('duice-ui-span');
                return _this;
            }
            Span.prototype.setMask = function (mask) {
                this.mask = mask;
            };
            Span.prototype.update = function (map, obj) {
                removeChildNodes(this.span);
                var value = map.get(this.name);
                value = defaultIfEmpty(value, '');
                if (this.mask) {
                    value = this.mask.encode(value);
                }
                this.span.appendChild(document.createTextNode(value));
            };
            Span.prototype.getValue = function () {
                var value = this.span.innerHTML;
                value = defaultIfEmpty(value, null);
                if (this.mask) {
                    value = this.mask.decode(value);
                }
                return value;
            };
            return Span;
        }(MapUIElement));
        ui.Span = Span;
        /**
         * duice.ui.InputFactory
         */
        ui.InputFactory = {
            getInput: function (element, $context) {
                var input;
                switch (element.getAttribute('type')) {
                    case 'text':
                        input = new TextInput(element);
                        if (element.dataset.duiceFormat) {
                            input.setFormat(element.dataset.duiceFormat);
                        }
                        break;
                    case 'number':
                        input = new NumberInput(element);
                        if (element.dataset.duiceScale) {
                            input.setScale(parseInt(element.dataset.duiceScale));
                        }
                        break;
                    case 'checkbox':
                        input = new CheckboxInput(element);
                        break;
                    case 'radio':
                        input = new RadioInput(element);
                        break;
                    case 'date':
                    case 'datetime':
                        input = new DateInput(element);
                        if (element.dataset.duiceFormat) {
                            input.setFormat(element.dataset.duiceFormat);
                        }
                        break;
                    default:
                        input = new GenericInput(element);
                }
                // bind
                var bind = element.dataset.duiceBind.split(',');
                input.bind(getObject($context, bind[0]), bind[1]);
                return input;
            }
        };
        /**
         * duice.ui.Input
         */
        var Input = /** @class */ (function (_super) {
            __extends(Input, _super);
            function Input(input) {
                var _this = _super.call(this, input) || this;
                _this.input = input;
                var $this = _this;
                _this.input.addEventListener('change', function (event) {
                    $this.setChanged();
                    $this.notifyObservers(this);
                });
                return _this;
            }
            return Input;
        }(MapUIElement));
        ui.Input = Input;
        /**
         * duice.ui.GenericInput
         */
        var GenericInput = /** @class */ (function (_super) {
            __extends(GenericInput, _super);
            function GenericInput(input) {
                var _this = _super.call(this, input) || this;
                _this.input.classList.add('duice-ui-genericInput');
                return _this;
            }
            GenericInput.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                this.input.value = defaultIfEmpty(value, '');
            };
            GenericInput.prototype.getValue = function () {
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
            };
            return GenericInput;
        }(Input));
        ui.GenericInput = GenericInput;
        /**
         * duice.ui.TextInput
         */
        var TextInput = /** @class */ (function (_super) {
            __extends(TextInput, _super);
            function TextInput(input) {
                var _this = _super.call(this, input) || this;
                _this.input.classList.add('duice-ui-textInput');
                _this.mask = new StringMask();
                return _this;
            }
            TextInput.prototype.setFormat = function (format) {
                this.mask.setFormat(format);
            };
            TextInput.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                value = defaultIfEmpty(value, '');
                value = this.mask.encode(value);
                this.input.value = value;
            };
            TextInput.prototype.getValue = function () {
                var value = this.input.value;
                value = defaultIfEmpty(value, null);
                value = this.mask.decode(value);
                return value;
            };
            return TextInput;
        }(Input));
        ui.TextInput = TextInput;
        /**
         * duice.ui.NumberInput
         */
        var NumberInput = /** @class */ (function (_super) {
            __extends(NumberInput, _super);
            function NumberInput(input) {
                var _this = _super.call(this, input) || this;
                _this.input.classList.add('duice-ui-numberInput');
                _this.input.setAttribute('type', 'text');
                // key press event
                var $this = _this;
                _this.mask = new NumberMask();
                _this.input.addEventListener('keypress', function (event) {
                    var inputChars = String.fromCharCode(event.keyCode);
                    var newValue = this.value.substr(0, this.selectionStart) + inputChars + this.value.substr(this.selectionEnd);
                    if ($this.mask.validate(newValue) === false) {
                        event.preventDefault();
                    }
                }, true);
                _this.input.addEventListener('paste', function (event) {
                    var inputChars = event.clipboardData.getData('text/plain');
                    var newValue = this.value.substr(0, this.selectionStart) + inputChars + this.value.substr(this.selectionEnd);
                    if ($this.mask.validate(newValue) === false) {
                        event.preventDefault();
                    }
                }, true);
                return _this;
            }
            NumberInput.prototype.setScale = function (scale) {
                this.mask.setScale(scale);
            };
            NumberInput.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                value = this.mask.encode(value);
                this.input.value = value;
            };
            NumberInput.prototype.getValue = function () {
                var value = this.input.value;
                value = this.mask.decode(value);
                console.log('@@@@@@@@@@@@', typeof value);
                return value;
            };
            return NumberInput;
        }(Input));
        ui.NumberInput = NumberInput;
        /**
         * duice.ui.CheckboxInput
         */
        var CheckboxInput = /** @class */ (function (_super) {
            __extends(CheckboxInput, _super);
            function CheckboxInput(input) {
                var _this = _super.call(this, input) || this;
                _this.input.classList.add('duice-ui-checkboxInput');
                // stop click event propagation
                _this.input.addEventListener('click', function (event) {
                    event.stopPropagation();
                });
                return _this;
            }
            CheckboxInput.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                if (value === true) {
                    this.input.checked = true;
                }
                else {
                    this.input.checked = false;
                }
            };
            CheckboxInput.prototype.getValue = function () {
                return this.input.checked;
            };
            return CheckboxInput;
        }(Input));
        ui.CheckboxInput = CheckboxInput;
        /**
         * duice.ui.RadioInput
         */
        var RadioInput = /** @class */ (function (_super) {
            __extends(RadioInput, _super);
            function RadioInput(input) {
                var _this = _super.call(this, input) || this;
                _this.input.classList.add('duice-ui-radioInput');
                return _this;
            }
            RadioInput.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                if (value === this.input.value) {
                    this.input.checked = true;
                }
                else {
                    this.input.checked = false;
                }
            };
            RadioInput.prototype.getValue = function () {
                return this.input.value;
            };
            return RadioInput;
        }(Input));
        ui.RadioInput = RadioInput;
        /**
         * duice.ui.DateInput
         */
        var DateInput = /** @class */ (function (_super) {
            __extends(DateInput, _super);
            function DateInput(input) {
                var _this = _super.call(this, input) || this;
                _this.type = _this.input.getAttribute('type').toLowerCase();
                _this.input.setAttribute('type', 'text');
                _this.input.classList.add('duice-ui-dateInput');
                // adds click event listener
                var $this = _this;
                _this.input.addEventListener('click', function (event) {
                    $this.openPicker();
                }, true);
                // sets default mask
                _this.mask = new DateMask();
                if (_this.type === 'date') {
                    _this.mask.setFormat('yyyy-MM-dd');
                }
                else {
                    _this.mask.setFormat('yyyy-MM-dd HH:mm:ss');
                }
                return _this;
            }
            DateInput.prototype.setFormat = function (format) {
                this.mask.setFormat(format);
            };
            DateInput.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                value = defaultIfEmpty(value, '');
                value = this.mask.encode(value);
                this.input.value = value;
            };
            DateInput.prototype.getValue = function () {
                var value = this.input.value;
                value = defaultIfEmpty(value, null);
                value = this.mask.decode(value);
                return value;
            };
            DateInput.prototype.openPicker = function () {
                // checks pickerDiv is open.
                if (this.pickerDiv) {
                    return;
                }
                var $this = this;
                this.pickerDiv = document.createElement('div');
                this.pickerDiv.classList.add('duice-ui-dateInput__pickerDiv');
                // parses parts
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
                // click event listener
                this.clickListener = function (event) {
                    if (!$this.input.contains(event.target) && !$this.pickerDiv.contains(event.target)) {
                        $this.closePicker();
                    }
                };
                window.addEventListener('click', this.clickListener);
                // header
                var headerDiv = document.createElement('div');
                headerDiv.classList.add('duice-ui-dateInput__pickerDiv-headerDiv');
                this.pickerDiv.appendChild(headerDiv);
                // titleIcon
                var titleSpan = document.createElement('span');
                titleSpan.classList.add('duice-ui-dateInput__pickerDiv-headerDiv-titleSpan');
                headerDiv.appendChild(titleSpan);
                // closeButton
                var closeButton = document.createElement('button');
                closeButton.classList.add('duice-ui-dateInput__pickerDiv-headerDiv-closeButton');
                headerDiv.appendChild(closeButton);
                closeButton.addEventListener('click', function (event) {
                    $this.closePicker();
                });
                // bodyDiv
                var bodyDiv = document.createElement('div');
                bodyDiv.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv');
                this.pickerDiv.appendChild(bodyDiv);
                // daySelector
                var dateDiv = document.createElement('div');
                dateDiv.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-dateDiv');
                bodyDiv.appendChild(dateDiv);
                // previous month button
                var prevMonthButton = document.createElement('button');
                prevMonthButton.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-dateDiv-prevMonthButton');
                dateDiv.appendChild(prevMonthButton);
                prevMonthButton.addEventListener('click', function (event) {
                    date.setMonth(date.getMonth() - 1);
                    updateDate(date);
                });
                // todayButton
                var todayButton = document.createElement('button');
                todayButton.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-dateDiv-todayButton');
                dateDiv.appendChild(todayButton);
                todayButton.addEventListener('click', function (event) {
                    var newDate = new Date();
                    date.setFullYear(newDate.getFullYear());
                    date.setMonth(newDate.getMonth());
                    date.setDate(newDate.getDate());
                    updateDate(date);
                });
                // year select
                var yearSelect = document.createElement('select');
                yearSelect.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-dateDiv-yearSelect');
                dateDiv.appendChild(yearSelect);
                yearSelect.addEventListener('change', function (event) {
                    date.setFullYear(parseInt(this.value));
                    updateDate(date);
                });
                // divider
                dateDiv.appendChild(document.createTextNode('-'));
                // month select
                var monthSelect = document.createElement('select');
                monthSelect.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-dateDiv-monthSelect');
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
                // next month button
                var nextMonthButton = document.createElement('button');
                nextMonthButton.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-dateDiv-nextMonthButton');
                dateDiv.appendChild(nextMonthButton);
                nextMonthButton.addEventListener('click', function (event) {
                    date.setMonth(date.getMonth() + 1);
                    updateDate(date);
                });
                // calendar table
                var calendarTable = document.createElement('table');
                calendarTable.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable');
                bodyDiv.appendChild(calendarTable);
                var calendarThead = document.createElement('thead');
                calendarTable.appendChild(calendarThead);
                var weekTr = document.createElement('tr');
                weekTr.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable-weekTr');
                calendarThead.appendChild(weekTr);
                ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(function (element) {
                    var weekTh = document.createElement('th');
                    weekTh.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable-weekTh');
                    weekTh.appendChild(document.createTextNode(element));
                    weekTr.appendChild(weekTh);
                });
                var calendarTbody = document.createElement('tbody');
                calendarTable.appendChild(calendarTbody);
                // timeDiv
                var timeDiv = document.createElement('div');
                timeDiv.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-timeDiv');
                bodyDiv.appendChild(timeDiv);
                // check input type is date
                if (this.type === 'date') {
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    timeDiv.style.display = 'none';
                }
                // now
                var nowButton = document.createElement('button');
                nowButton.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-timeDiv-nowButton');
                timeDiv.appendChild(nowButton);
                nowButton.addEventListener('click', function (event) {
                    var newDate = new Date();
                    date.setHours(newDate.getHours());
                    date.setMinutes(newDate.getMinutes());
                    date.setSeconds(newDate.getSeconds());
                    updateDate(date);
                });
                // hourSelect
                var hourSelect = document.createElement('select');
                hourSelect.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-timeDiv-hourSelect');
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
                // divider
                timeDiv.appendChild(document.createTextNode(':'));
                // minuteSelect
                var minuteSelect = document.createElement('select');
                minuteSelect.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-timeDiv-minuteSelect');
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
                // divider
                timeDiv.appendChild(document.createTextNode(':'));
                // secondsSelect
                var secondSelect = document.createElement('select');
                secondSelect.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-timeDiv-secondSelect');
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
                // footer
                var footerDiv = document.createElement('div');
                footerDiv.classList.add('duice-ui-dateInput__pickerDiv-footerDiv');
                this.pickerDiv.appendChild(footerDiv);
                // confirm
                var confirmButton = document.createElement('button');
                confirmButton.classList.add('duice-ui-dateInput__pickerDiv-footerDiv-confirmButton');
                footerDiv.appendChild(confirmButton);
                confirmButton.addEventListener('click', function (event) {
                    $this.input.value = $this.mask.encode(date.getTime());
                    $this.setChanged();
                    $this.notifyObservers(this);
                    $this.closePicker();
                });
                // show
                this.input.parentNode.insertBefore(this.pickerDiv, this.input.nextSibling);
                this.pickerDiv.style.position = 'absolute';
                this.pickerDiv.style.zIndex = String(getCurrentMaxZIndex() + 1);
                this.pickerDiv.style.left = getElementPosition(this.input).left + 'px';
                this.pickerDiv.style.margin = '0px';
                // updates date
                function updateDate(date) {
                    var yyyy = date.getFullYear();
                    var mm = date.getMonth();
                    var dd = date.getDate();
                    var hh = date.getHours();
                    var mi = date.getMinutes();
                    var ss = date.getSeconds();
                    // updates yearSelect
                    for (var i = yyyy - 5, end = yyyy + 5; i <= end; i++) {
                        var option = document.createElement('option');
                        option.value = String(i);
                        option.text = String(i);
                        yearSelect.appendChild(option);
                    }
                    yearSelect.value = String(yyyy);
                    // updates monthSelect
                    monthSelect.value = String(mm);
                    // updates dateTbody
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
                        dateTr.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable-dateTr');
                        for (var k = 1; k <= 7; k++) {
                            var dateTd = document.createElement('td');
                            dateTd.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable-dateTd');
                            if ((i === 1 && k < startDay)
                                || (i === rowNum && dNum >= lastDate)) {
                                dateTd.appendChild(document.createTextNode(''));
                            }
                            else {
                                dNum++;
                                dateTd.appendChild(document.createTextNode(String(dNum)));
                                dateTd.dataset.date = String(dNum);
                                // checks selected
                                if (currentDate.getFullYear() === yyyy
                                    && currentDate.getMonth() === mm
                                    && currentDate.getDate() === dNum) {
                                    dateTd.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable-dateTd--today');
                                }
                                if (dd === dNum) {
                                    dateTd.classList.add('duice-ui-dateInput__pickerDiv-bodyDiv-calendarTable-dateTd--selected');
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
                    // updates times
                    hourSelect.value = String(hh);
                    minuteSelect.value = String(mi);
                    secondSelect.value = String(ss);
                }
                updateDate(date);
            };
            DateInput.prototype.closePicker = function () {
                this.pickerDiv.parentNode.removeChild(this.pickerDiv);
                this.pickerDiv = null;
                window.removeEventListener('click', this.clickListener);
            };
            return DateInput;
        }(Input));
        ui.DateInput = DateInput;
        /**
         * duice.ui.ImageFactory
         */
        ui.ImageFactory = {
            getImage: function (element, $context) {
                var image = new Image(element);
                var bind = element.dataset.duiceBind.split(',');
                image.bind(getObject($context, bind[0]), bind[1]);
                return image;
            }
        };
        /**
         * duice.ui.Image
         */
        var Image = /** @class */ (function (_super) {
            __extends(Image, _super);
            function Image(img) {
                var _this = _super.call(this, img) || this;
                _this.img = img;
                _this.img.classList.add('duice-ui-img');
                _this.img.addEventListener('error', function () {
                    console.log('error');
                });
                // creates file input
                _this.input = document.createElement('input');
                _this.input = document.createElement('input');
                _this.input.setAttribute("type", "file");
                _this.input.setAttribute("accept", "image/gif, image/jpeg, image/png");
                return _this;
            }
            Image.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                this.img.src = value;
            };
            Image.prototype.getValue = function () {
                return this.img.src;
            };
            return Image;
        }(MapUIElement));
        ui.Image = Image;
        /**
         * duice.ui.SpanFactory
         */
        ui.SelectFactory = {
            getSelect: function (element, $context) {
                var select = new Select(element);
                var option = element.dataset.duiceOption.split(',');
                var optionList = getObject($context, option[0]);
                var optionValue = option[1];
                var optionText = option[2];
                select.setOption(optionList, optionValue, optionText);
                var bind = element.dataset.duiceBind.split(',');
                select.bind(getObject($context, bind[0]), bind[1]);
                return select;
            }
        };
        /**
         * duice.ui.Select
         */
        var Select = /** @class */ (function (_super) {
            __extends(Select, _super);
            function Select(select) {
                var _this = _super.call(this, select) || this;
                _this.defaultOptions = new Array();
                _this.select = select;
                _this.select.classList.add('duice-ui-select');
                var $this = _this;
                _this.select.addEventListener('change', function (event) {
                    $this.setChanged();
                    $this.notifyObservers(this);
                });
                // stores default options
                for (var i = 0, size = _this.select.options.length; i < size; i++) {
                    _this.defaultOptions.push(_this.select.options[i]);
                }
                return _this;
            }
            Select.prototype.setOption = function (list, value, text) {
                this.optionList = list;
                this.optionValue = value;
                this.optionText = text;
                var $this = this;
                function updateOption(optionList) {
                    // removes all options
                    removeChildNodes($this.select);
                    // adds default options
                    for (var i = 0, size = $this.defaultOptions.length; i < size; i++) {
                        $this.select.appendChild($this.defaultOptions[i]);
                    }
                    // update data options
                    for (var i = 0, size = optionList.getSize(); i < size; i++) {
                        var optionMap = optionList.get(i);
                        var option = document.createElement('option');
                        option.value = optionMap.get($this.optionValue);
                        option.appendChild(document.createTextNode(optionMap.get($this.optionText)));
                        $this.select.appendChild(option);
                    }
                }
                updateOption(this.optionList);
            };
            Select.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                this.select.value = defaultIfEmpty(value, '');
            };
            Select.prototype.getValue = function () {
                var value = this.select.value;
                return defaultIfEmpty(value, null);
            };
            return Select;
        }(MapUIElement));
        ui.Select = Select;
        /**
         * duice.ui.TextareaFactory
         */
        ui.TextareaFactory = {
            getTextarea: function (element, $context) {
                var textarea = new Textarea(element);
                var bind = element.dataset.duiceBind.split(',');
                textarea.bind(getObject($context, bind[0]), bind[1]);
                return textarea;
            }
        };
        /**
         * duice.ui.Textarea
         */
        var Textarea = /** @class */ (function (_super) {
            __extends(Textarea, _super);
            function Textarea(textarea) {
                var _this = _super.call(this, textarea) || this;
                _this.textarea = textarea;
                _this.textarea.classList.add('duice-ui-textarea');
                var $this = _this;
                _this.textarea.addEventListener('change', function (event) {
                    $this.setChanged();
                    $this.notifyObservers(this);
                });
                return _this;
            }
            Textarea.prototype.update = function (map, obj) {
                var value = map.get(this.getName());
                this.textarea.value = defaultIfEmpty(value, '');
            };
            Textarea.prototype.getValue = function () {
                return defaultIfEmpty(this.textarea.value, null);
            };
            return Textarea;
        }(MapUIElement));
        ui.Textarea = Textarea;
        /**
         * duice.ui.ListUIElement
         */
        var ListUIElement = /** @class */ (function (_super) {
            __extends(ListUIElement, _super);
            function ListUIElement() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ListUIElement.prototype.bind = function (list, item) {
                this.list = list;
                this.item = item;
                this.list.addObserver(this);
                this.addObserver(this.list);
                this.update(this.list, this.list);
            };
            ListUIElement.prototype.getList = function () {
                return this.list;
            };
            ListUIElement.prototype.getItem = function () {
                return this.item;
            };
            return ListUIElement;
        }(UIElement));
        ui.ListUIElement = ListUIElement;
        /**
         * duice.ui.TableFactory
         */
        ui.TableFactory = {
            getTable: function (element, $context) {
                var table = new Table(element);
                if (element.dataset.duiceEditable) {
                    table.setEditable(element.dataset.duiceEditable === 'true');
                }
                var bind = element.dataset.duiceBind.split(',');
                table.bind(getObject($context, bind[0]), bind[1]);
                return table;
            }
        };
        /**
         * duice.ui.Table
         */
        var Table = /** @class */ (function (_super) {
            __extends(Table, _super);
            /**
             * constructor table
             * @param table
             */
            function Table(table) {
                var _this = _super.call(this, table) || this;
                _this.tbodies = new Array();
                _this.table = table;
                _this.table.classList.add('duice-ui-table');
                // initializes caption
                var caption = _this.table.querySelector('caption');
                if (caption) {
                    caption.classList.add('duice-ui-table__caption');
                    caption = executeExpression(caption, new Object());
                    initialize(caption, new Object());
                }
                // initializes head
                var thead = _this.table.querySelector('thead');
                if (thead) {
                    thead.classList.add('duice-ui-table__thead');
                    thead = executeExpression(thead, new Object());
                    initialize(thead, new Object());
                }
                // clones body
                var tbody = _this.table.querySelector('tbody');
                _this.tbody = tbody.cloneNode(true);
                _this.tbody.classList.add('duice-ui-table__tbody');
                _this.table.removeChild(tbody);
                // initializes foot
                var tfoot = _this.table.querySelector('tfoot');
                if (tfoot) {
                    tfoot.classList.add('duice-ui-table__tfoot');
                    tfoot = executeExpression(tfoot, new Object());
                    initialize(tfoot, new Object());
                }
                return _this;
            }
            /**
             * Sets enable flag
             * @param editable
             */
            Table.prototype.setEditable = function (editable) {
                this.editable = editable;
            };
            /**
             * Updates table
             * @param list
             * @param obj
             */
            Table.prototype.update = function (list, obj) {
                // checks changed source instance
                if (obj instanceof duice.data.Map) {
                    return;
                }
                var $this = this;
                // remove previous rows
                for (var i = 0; i < this.tbodies.length; i++) {
                    this.table.removeChild(this.tbodies[i]);
                }
                this.tbodies.length = 0;
                // creates new rows
                for (var index = 0; index < list.getSize(); index++) {
                    var map = list.get(index);
                    var tbody = this.createTbody(index, map);
                    tbody.dataset.duiceIndex = String(index);
                    // select index
                    if (index === list.getIndex()) {
                        tbody.classList.add('duice-ui-table__tbody--index');
                    }
                    tbody.addEventListener('click', function (event) {
                        for (var i = 0; i < $this.tbodies.length; i++) {
                            $this.tbodies[i].classList.remove('duice-ui-table__tbody--index');
                        }
                        this.classList.add('duice-ui-table__tbody--index');
                        list.index = Number(this.dataset.duiceIndex);
                        console.log(list.getIndex(), list);
                    }, true);
                    // drag and drop event
                    if (this.editable === true) {
                        tbody.setAttribute('draggable', 'true');
                        tbody.addEventListener('dragstart', function (event) {
                            event.dataTransfer.setData("text", this.dataset.duiceIndex);
                        });
                        tbody.addEventListener('dragover', function (event) {
                            event.preventDefault();
                            event.stopPropagation();
                        });
                        tbody.addEventListener('drop', function (event) {
                            event.preventDefault();
                            event.stopPropagation();
                            var fromIndex = parseInt(event.dataTransfer.getData('text'));
                            var toIndex = parseInt(this.dataset.duiceIndex);
                            list.move(fromIndex, toIndex);
                        });
                    }
                    // appends body
                    this.table.appendChild(tbody);
                    this.tbodies.push(tbody);
                    // not found row
                    if (list.getSize() < 1) {
                        var emptyTbody = this.createEmptyTbody();
                        this.table.appendChild(emptyTbody);
                        this.tbodies.push(emptyTbody);
                    }
                }
            };
            /**
             * Creates table body element
             * @param index
             * @param map
             */
            Table.prototype.createTbody = function (index, map) {
                var $this = this;
                var tbody = this.tbody.cloneNode(true);
                tbody.classList.add('duice-ui-table__tbody');
                var $context = new Object;
                $context['index'] = index;
                $context[this.item] = map;
                tbody = executeExpression(tbody, $context);
                initialize(tbody, $context);
                return tbody;
            };
            /**
             * Creates empty table body element
             */
            Table.prototype.createEmptyTbody = function () {
                var emptyTbody = this.tbody.cloneNode(true);
                removeChildNodes(emptyTbody);
                emptyTbody.classList.add('duice-ui-table__tbody--empty');
                var tr = document.createElement('tr');
                var td = document.createElement('td');
                var colspan = this.tbody.querySelectorAll('tr > td').length;
                td.setAttribute('colspan', String(colspan));
                var emptyMessage = document.createElement('div');
                emptyMessage.classList.add('duice-ui-table__tbody--empty-message');
                td.appendChild(emptyMessage);
                tr.appendChild(td);
                emptyTbody.appendChild(tr);
                return emptyTbody;
            };
            return Table;
        }(ListUIElement));
        ui.Table = Table;
        /**
         * duice.ui.UListFactory
         */
        ui.UListFactory = {
            getUList: function (element, $context) {
                var uList = new UList(element);
                if (element.dataset.duiceHierarchy) {
                    var hirearchy = element.dataset.duiceHierarchy.split(',');
                    uList.setHierarchy(hirearchy[0], hirearchy[1]);
                }
                if (element.dataset.duiceFoldable) {
                    uList.setFoldable(Boolean(element.dataset.duiceFoldable));
                }
                if (element.dataset.duiceEditable) {
                    uList.setEditable(Boolean(element.dataset.duiceEditable));
                }
                var bind = element.dataset.duiceBind.split(',');
                uList.bind(getObject($context, bind[0]), bind[1]);
                return uList;
            }
        };
        /**
         * duice.ui.UList
         */
        var UList = /** @class */ (function (_super) {
            __extends(UList, _super);
            function UList(ul) {
                var _this = _super.call(this, ul) || this;
                _this.lis = new Array();
                _this.foldName = {};
                _this.ul = ul;
                _this.ul.classList.add('duice-ui-ul');
                var li = _this.ul.querySelector('li');
                _this.li = li.cloneNode(true);
                return _this;
            }
            UList.prototype.setHierarchy = function (name, parentName) {
                this.hierarchy = { name: name, parentName: parentName };
                this.ul.classList.add('duice-ui-ul--hierarchy');
                // add root event
                var $this = this;
                this.ul.addEventListener('dragover', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $this.ul.classList.add('duice-ui-ul--hierarchy-dragover');
                });
                this.ul.addEventListener('dragleave', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $this.ul.classList.remove('duice-ui-ul--hierarchy-dragover');
                });
                this.ul.addEventListener('drop', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var fromIndex = parseInt(event.dataTransfer.getData('text'));
                    var fromMap = $this.list.get(fromIndex);
                    fromMap.set($this.hierarchy.parentName, null);
                    $this.ul.classList.remove('duice-ui-ul--hierarchy-dragover');
                    $this.setChanged();
                    $this.notifyObservers(this);
                });
            };
            UList.prototype.setFoldable = function (foldable) {
                this.foldable = foldable;
            };
            UList.prototype.setEditable = function (editable) {
                this.editable = editable;
            };
            UList.prototype.update = function (list, obj) {
                // checks changed source instance
                if (obj instanceof duice.data.Map) {
                    return;
                }
                // initiates
                var $this = this;
                this.ul.innerHTML = '';
                this.lis.length = 0;
                // creates new rows
                for (var index = 0; index < list.getSize(); index++) {
                    var map = list.get(index);
                    var path = [];
                    // checks hierarchy
                    if (this.hierarchy) {
                        if (isNotEmpty(map.get(this.hierarchy.parentName))) {
                            continue;
                        }
                    }
                    // creates LI element
                    var li = this.createLi(index, map);
                    this.ul.appendChild(li);
                }
                // creates orphans
                if (this.hierarchy) {
                    for (var index = 0, size = list.getSize(); index < size; index++) {
                        if (this.isLiCreated(index) === false) {
                            var orphanLi = this.createLi(index, list.get(index));
                            orphanLi.classList.add('duice-ui-ul__li--orphan');
                            this.ul.appendChild(orphanLi);
                        }
                    }
                }
            };
            UList.prototype.createLi = function (index, map) {
                var $this = this;
                var li = this.li.cloneNode(true);
                li.classList.add('duice-ui-ul__li');
                var $context = new Object;
                $context['index'] = index;
                $context[this.item] = map;
                li = executeExpression(li, $context);
                initialize(li, $context);
                this.lis.push(li);
                li.dataset.duiceIndex = String(index);
                // sets index
                li.addEventListener('mousedown', function (event) {
                    event.stopPropagation();
                    for (var i = 0; i < $this.lis.length; i++) {
                        $this.lis[i].classList.remove('duice-ui-ul__li--index');
                    }
                    this.classList.add('duice-ui-ul__li--index');
                    $this.list.index = Number(this.dataset.duiceIndex);
                    console.log($this.list.getIndex(), $this.list);
                });
                // editable
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
                        event.preventDefault();
                        event.stopPropagation();
                        var fromIndex = parseInt(event.dataTransfer.getData('text'));
                        var toIndex = parseInt(this.dataset.duiceIndex);
                        $this.moveLi(fromIndex, toIndex);
                    });
                }
                // creates child node
                if (this.hierarchy) {
                    var childUl = document.createElement('ul');
                    childUl.classList.add('duice-ui-ul');
                    var hasChild = false;
                    var hierarchyValue = map.get(this.hierarchy.name);
                    for (var i = 0, size = this.list.getSize(); i < size; i++) {
                        var element = this.list.get(i);
                        var hierarchyParentValue = element.get(this.hierarchy.parentName);
                        if (isEmpty(hierarchyParentValue) === true) {
                            continue;
                        }
                        if (hierarchyParentValue === hierarchyValue) {
                            var childLi = this.createLi(i, element);
                            childLi.classList.add('duice-ui-ul__li--indent');
                            childUl.appendChild(childLi);
                            hasChild = true;
                        }
                    }
                    li.appendChild(childUl);
                    // sets fold 
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
                                    if ($this.isFoldLi(map)) {
                                        $this.foldLi(map, this, false);
                                    }
                                    else {
                                        $this.foldLi(map, this, true);
                                    }
                                }
                            });
                        }
                        else {
                            this.foldLi(map, li, false);
                        }
                    }
                }
                // return node element
                return li;
            };
            UList.prototype.isLiCreated = function (index) {
                for (var i = 0, size = this.lis.length; i < size; i++) {
                    if (parseInt(this.lis[i].dataset.duiceIndex) === index) {
                        return true;
                    }
                }
                return false;
            };
            UList.prototype.isFoldLi = function (map) {
                if (this.foldName[map.get(this.hierarchy.name)] === true) {
                    return true;
                }
                else {
                    return false;
                }
            };
            UList.prototype.foldLi = function (map, li, fold) {
                if (fold) {
                    this.foldName[map.get(this.hierarchy.name)] = true;
                    li.classList.remove('duice-ui-ul__li--unfold');
                    li.classList.add('duice-ui-ul__li--fold');
                }
                else {
                    this.foldName[map.get(this.hierarchy.name)] = false;
                    li.classList.remove('duice-ui-ul__li--fold');
                    li.classList.add('duice-ui-ul__li--unfold');
                }
            };
            UList.prototype.moveLi = function (fromIndex, toIndex) {
                // checks same index
                if (fromIndex === toIndex) {
                    return;
                }
                //defines map
                var fromMap = this.list.get(fromIndex);
                var toMap = this.list.get(toIndex);
                // moving action
                if (this.hierarchy) {
                    // change parents
                    fromMap.set(this.hierarchy.parentName, toMap.get(this.hierarchy.name));
                    // notifies observers.
                    this.setChanged();
                    this.notifyObservers(this);
                }
                else {
                    // changes row position
                    this.list.move(fromIndex, toIndex);
                }
            };
            return UList;
        }(ListUIElement));
        ui.UList = UList;
        /**
         * new duice.dialog.Blocker(this.div).block().unblock();
         *
         */
        var Blocker = /** @class */ (function () {
            function Blocker(element) {
                this.element = element;
                this.div = document.createElement('div');
                this.div.classList.add('duice-ui-blocker');
            }
            Blocker.prototype.block = function () {
                // adjusting position
                this.div.style.position = 'fixed';
                this.div.style.zIndex = String(getCurrentMaxZIndex() + 1);
                // full blocking in case of BODY
                if (this.element.tagName == 'BODY') {
                    this.div.style.width = '100%';
                    this.div.style.height = '100%';
                    this.div.style.top = '0px';
                    this.div.style.left = '0px';
                }
                // otherwise adjusting to parent element
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
                // append
                this.element.appendChild(this.div);
            };
            Blocker.prototype.unblock = function () {
                this.element.removeChild(this.div);
            };
            return Blocker;
        }());
        ui.Blocker = Blocker;
        /**
         * duice.ui.Modal
         */
        var Modal = /** @class */ (function () {
            function Modal() {
                this.listener = {};
                var $this = this;
                this.container = document.createElement('div');
                this.container.classList.add('duice-ui-model');
                this.headerDiv = document.createElement('div');
                this.headerDiv.classList.add('duice-ui-modal__headerDiv');
                this.container.appendChild(this.headerDiv);
                // drag
                this.headerDiv.style.cursor = 'move';
                this.headerDiv.onmousedown = function (ev) {
                    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                    pos3 = ev.clientX;
                    pos4 = ev.clientY;
                    getCurrentWindow().document.onmouseup = function (ev) {
                        getCurrentWindow().document.onmousemove = null;
                        getCurrentWindow().document.onmouseup = null;
                    };
                    getCurrentWindow().document.onmousemove = function (ev) {
                        pos1 = pos3 - ev.clientX;
                        pos2 = pos4 - ev.clientY;
                        pos3 = ev.clientX;
                        pos4 = ev.clientY;
                        $this.container.style.left = ($this.container.offsetLeft - pos1) + 'px';
                        $this.container.style.top = ($this.container.offsetTop - pos2) + 'px';
                    };
                };
                var titleIcon = document.createElement('span');
                titleIcon.classList.add('duice-ui-modal__headerDiv-titleIcon');
                this.headerDiv.appendChild(titleIcon);
                var closeButton = document.createElement('span');
                closeButton.classList.add('duice-ui-modal__headerDiv-closeButton');
                closeButton.addEventListener('click', function (event) {
                    $this.close();
                });
                this.headerDiv.appendChild(closeButton);
                // creates body
                this.bodyDiv = document.createElement('div');
                this.container.appendChild(this.bodyDiv);
                // adds blocker
                this.blocker = new Blocker(getCurrentWindow().document.body);
            }
            Modal.prototype.addContent = function (content) {
                this.bodyDiv.appendChild(content);
            };
            Modal.prototype.createButton = function (type) {
                var button = document.createElement('button');
                button.classList.add('duice-ui-modal__button--' + type);
                return button;
            };
            Modal.prototype.show = function () {
                // block
                this.blocker.block();
                // opens modal
                this.container.style.display = 'block';
                this.container.style.position = 'absolute';
                this.container.style.zIndex = String(getCurrentMaxZIndex() + 1);
                getCurrentWindow().document.body.appendChild(this.container);
                setPositionCentered(this.container);
            };
            Modal.prototype.hide = function () {
                // closes modal
                this.container.style.display = 'none';
                getCurrentWindow().document.body.removeChild(this.container);
                // unblock
                this.blocker.unblock();
            };
            Modal.prototype.open = function () {
                if (this.listener.beforeOpen) {
                    if (this.listener.beforeOpen.call(this) === false) {
                        return false;
                    }
                }
                this.show();
                if (this.listener.afterOpen) {
                    delayCall(200, this.listener.afterOpen, this);
                }
                return true;
            };
            Modal.prototype.beforeOpen = function (listener) {
                this.listener.beforeOpen = listener;
                return this;
            };
            Modal.prototype.afterOpen = function (listener) {
                this.listener.afterOpen = listener;
                return this;
            };
            Modal.prototype.close = function () {
                if (this.listener.beforeClose) {
                    if (this.listener.beforeClose.call(this) === false) {
                        return false;
                    }
                }
                this.hide();
                if (this.listener.afterClose) {
                    delayCall(200, this.listener.afterClose, this);
                }
                return true;
            };
            Modal.prototype.beforeClose = function (listener) {
                this.listener.beforeClose = listener;
                return this;
            };
            Modal.prototype.afterClose = function (listener) {
                this.listener.afterClose = listener;
                return this;
            };
            Modal.prototype.confirm = function () {
                if (this.listener.beforeConfirm) {
                    if (this.listener.beforeConfirm.call(this) === false) {
                        return false;
                    }
                }
                this.hide();
                if (this.listener.afterConfirm) {
                    delayCall(200, this.listener.afterConfirm, this);
                }
                return true;
            };
            Modal.prototype.beforeConfirm = function (listener) {
                this.listener.beforeConfirm = listener;
                return this;
            };
            Modal.prototype.afterConfirm = function (listener) {
                this.listener.afterConfirm = listener;
                return this;
            };
            return Modal;
        }());
        ui.Modal = Modal;
        /**
         * duice.ui.Alert
         */
        var Alert = /** @class */ (function (_super) {
            __extends(Alert, _super);
            function Alert(message) {
                var _this = _super.call(this) || this;
                _this.message = message;
                var $this = _this;
                _this.iconDiv = document.createElement('div');
                _this.iconDiv.classList.add('duice-ui-alert__iconDiv');
                _this.messageDiv = document.createElement('div');
                _this.messageDiv.classList.add('duice-ui-alert__messageDiv');
                _this.messageDiv.appendChild(document.createTextNode(_this.message));
                _this.buttonDiv = document.createElement('div');
                _this.buttonDiv.classList.add('duice-ui-alert__buttonDiv');
                _this.confirmButton = _this.createButton('confirm');
                _this.confirmButton.addEventListener('click', function (event) {
                    console.log(this);
                    $this.close();
                });
                _this.buttonDiv.appendChild(_this.confirmButton);
                // appends parts to bodyDiv
                _this.addContent(_this.iconDiv);
                _this.addContent(_this.messageDiv);
                _this.addContent(_this.buttonDiv);
                return _this;
            }
            Alert.prototype.open = function () {
                if (_super.prototype.open.call(this)) {
                    this.confirmButton.focus();
                    return true;
                }
                else {
                    return false;
                }
            };
            return Alert;
        }(Modal));
        ui.Alert = Alert;
        /**
         * duice.ui.Confirm
         */
        var Confirm = /** @class */ (function (_super) {
            __extends(Confirm, _super);
            function Confirm(message) {
                var _this = _super.call(this) || this;
                _this.message = message;
                var $this = _this;
                _this.iconDiv = document.createElement('div');
                _this.iconDiv.classList.add('duice-ui-confirm__iconDiv');
                _this.messageDiv = document.createElement('div');
                _this.messageDiv.classList.add('duice-ui-confirm__messageDiv');
                _this.messageDiv.appendChild(document.createTextNode(_this.message));
                _this.buttonDiv = document.createElement('div');
                _this.buttonDiv.classList.add('duice-ui-confirm__buttonDiv');
                // cancel button
                _this.cancelButton = _this.createButton('cancel');
                _this.cancelButton.addEventListener('click', function (event) {
                    $this.close();
                });
                _this.buttonDiv.appendChild(_this.cancelButton);
                // confirm button
                _this.confirmButton = _this.createButton('confirm');
                _this.confirmButton.addEventListener('click', function (event) {
                    $this.confirm();
                });
                _this.buttonDiv.appendChild(_this.confirmButton);
                // appends parts to bodyDiv
                _this.addContent(_this.iconDiv);
                _this.addContent(_this.messageDiv);
                _this.addContent(_this.buttonDiv);
                return _this;
            }
            Confirm.prototype.open = function () {
                if (_super.prototype.open.call(this)) {
                    this.cancelButton.focus();
                }
                else {
                    return false;
                }
            };
            return Confirm;
        }(Modal));
        ui.Confirm = Confirm;
        /**
         * duice.ui.Prompt
         */
        var Prompt = /** @class */ (function (_super) {
            __extends(Prompt, _super);
            function Prompt(message) {
                var _this = _super.call(this) || this;
                _this.message = message;
                var $this = _this;
                _this.iconDiv = document.createElement('div');
                _this.iconDiv.classList.add('duice-ui-prompt__iconDiv');
                _this.messageDiv = document.createElement('div');
                _this.messageDiv.classList.add('duice-ui-prompt__messageDiv');
                _this.messageDiv.appendChild(document.createTextNode(_this.message));
                _this.inputDiv = document.createElement('div');
                _this.inputDiv.classList.add('duice-ui-prompt__inputDiv');
                _this.input = document.createElement('input');
                _this.input.classList.add('duice-ui-prompt__inputDiv-input');
                _this.inputDiv.appendChild(_this.input);
                _this.buttonDiv = document.createElement('div');
                _this.buttonDiv.classList.add('duice-ui-prompt__buttonDiv');
                // cancel button
                _this.cancelButton = _this.createButton('cancel');
                _this.cancelButton.addEventListener('click', function (event) {
                    $this.close();
                });
                _this.buttonDiv.appendChild(_this.cancelButton);
                // confirm button
                _this.confirmButton = _this.createButton('confirm');
                _this.confirmButton.addEventListener('click', function (event) {
                    $this.confirm();
                });
                _this.buttonDiv.appendChild(_this.confirmButton);
                // appends parts to bodyDiv
                _this.addContent(_this.iconDiv);
                _this.addContent(_this.messageDiv);
                _this.addContent(_this.inputDiv);
                _this.addContent(_this.buttonDiv);
                return _this;
            }
            Prompt.prototype.open = function () {
                if (_super.prototype.open.call(this)) {
                    this.input.focus();
                    return true;
                }
                else {
                    return false;
                }
            };
            Prompt.prototype.getValue = function () {
                return this.input.value;
            };
            return Prompt;
        }(Modal));
        ui.Prompt = Prompt;
        var Dialog = /** @class */ (function (_super) {
            __extends(Dialog, _super);
            function Dialog(dialog) {
                var _this = _super.call(this) || this;
                _this.dialog = dialog;
                _this.dialog.classList.add('duice-ui-dialog');
                _this.parentNode = _this.dialog.parentNode;
                return _this;
            }
            Dialog.prototype.open = function () {
                this.dialog.style.display = 'block';
                this.addContent(this.dialog);
                if (_super.prototype.open.call(this)) {
                    return true;
                }
                else {
                    this.dialog.style.display = 'none';
                    this.parentNode.appendChild(this.dialog);
                    return false;
                }
            };
            Dialog.prototype.close = function () {
                if (_super.prototype.close.call(this)) {
                    this.dialog.style.display = 'none';
                    this.parentNode.appendChild(this.dialog);
                    return true;
                }
                else {
                    return false;
                }
            };
            return Dialog;
        }(Modal));
        ui.Dialog = Dialog;
    })(ui = duice.ui || (duice.ui = {})); // end of duice.ui
})(duice || (duice = {})); // end
/**
 * DOMContentLoaded event process
 */
document.addEventListener("DOMContentLoaded", function (event) {
    var $context = typeof self !== 'undefined' ? self :
        typeof window !== 'undefined' ? window :
            {};
    duice.ui.initialize(document, $context);
});