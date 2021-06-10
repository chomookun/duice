namespace duice {
    
    /**
     * duice.initialize
     * @param container
     * @param $context
     */
    export function initialize(container:any, $context:any):void {
        
//        // creates ListView 
//        var listViewerElements = container.querySelectorAll('ul[data-duice="ListViewer"]');
//        for(var i = 0; i < listViewerElements.length; i++ ) {
//            try {
//                var listViewerElement = listViewerElements[i];
//                var listViewer = new duice.ui.ListViewer(listViewerElement);
//                var bind = listViewerElement.dataset.duiceBind;
//                listViewer.setBind(getObject($context,bind));
//                var item = listViewerElement.dataset.duiceItem;
//                listViewer.setItem(item);
//                listViewer.setEditable((listViewerElement.dataset.duiceEditable === 'true'));
//                listViewer.update();
//                listViewerElement.dataset.duice += generateUUID();
//                console.log(listViewer);
//            }catch(e){
//                console.error(e,listViewerElement);
//                throw e;
//            }
//        }
//        
        // creates TableViewer
        var tableViewerElements = container.querySelectorAll('table[data-duice="TableView"]');
        for(var i = 0; i < tableViewerElements.length; i++ ) {
            try {
                var tableViewerElement = tableViewerElements[i];
                var tableViewer = new duice.ui.TableViewer(tableViewerElement);
                var bind = tableViewerElement.dataset.duiceBind;
                var bindList = getObject($context,bind)
                tableViewer.setBind(bindList);
                var item = tableViewerElement.dataset.duiceItem;
                tableViewer.setItem(item);
                tableViewer.setEditable((tableViewerElement.dataset.duiceEditable === 'true'));
                tableViewer.build();
                tableViewerElement.dataset.duice += generateUUID();
            }catch(e){
                console.error(e,tableViewerElement);
                throw e;
            }
        }
        
        // creates unit elements
        var elementTags = [
             'div[data-duice="Text"]'
            ,'input[data-duice="TextField"]'
            ,'textarea[data-duice="TextArea"]'
            ,'select[data-duice="ComboBox"]'
            ,'input[data-duice="CheckBox"]'
            ,'input[data-duice="Radio"]'
            ,'input[data-duice="Calendar"]'
            ,'input[data-duice="CronExpression"]'
            ,'img[data-duice="Image"]'
            ,'div[data-duice="HtmlEditor"]'
            ,'div[data-duice="MarkdownEditor"]'
        ];
        var elements = container.querySelectorAll(elementTags.join(','));
        for(var i = 0; i < elements.length; i ++ ) {
            try {
                var element:any = elements[i];
                var type:string = element.dataset.duice;
                var bind = element.dataset.duiceBind.split(',');
                switch(type) {
                    case 'Text':
                        var text:duice.ui.Text = new duice.ui.Text(element);
                        text.setMode(element.dataset.duiceMode);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        text.setBind(bindMap, bindName);
                        if(element.dataset.duiceMask){
                            var mask = element.dataset.duiceMask.split(',');
                            text.setMask(mask[0], mask[1]);
                        }
                        text.build();
                    break;
                    case 'TextField':
                        var textField = new duice.ui.TextField(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        textField.setBind(bindMap, bindName);
                        if(element.dataset.duiceMask){
                            var mask = element.dataset.duiceMask.split(',');
                            textField.setMask(mask[0],mask[1]);
                        }
                        textField.build();
                    break;
                    case 'TextArea':
                        var textArea = new duice.ui.TextArea(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        textArea.setBind(bindMap, bindName);
                        textArea.build();
                    break;
                    case 'ComboBox':
                        var comboBox = new duice.ui.ComboBox(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        comboBox.setBind(bindMap, bindName);
                        var option = element.dataset.duiceOption.split(',');
                        var optionList = getObject($context, option[0]);
                        var optionValue = option[1];
                        var optionText = option[2];
                        comboBox.setOption(optionList, optionValue, optionText);
                        comboBox.build();
                    break;
                    case 'CheckBox':
                        var checkBox = new duice.ui.CheckBox(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        checkBox.setBind(bindMap, bindName);
                        checkBox.build();
                    break;
                    case 'Radio':
                        var radio = new duice.ui.Radio(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        radio.setBind(bindMap, bindName);
                        radio.build();
                    break;
                    case 'Calendar':
                        var calendar = new duice.ui.Calendar(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        calendar.setBind(bindMap, bindName);
                        if(element.dataset.duiceMask){
                            var mask = element.dataset.duiceMask.split(',');
                            calendar.setMask(mask[0],mask[1]);
                        }
                        calendar.build();
                    break;
                    case 'CronExpression':
                        var cronExpression = new duice.ui.CronExpression(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        cronExpression.setBind(bindMap, bindName);
                        cronExpression.build();
                    break;
                    case 'Image':
                        var image = new duice.ui.Image(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        image.setBind(bindMap, bindName);
                        image.build();
                    break;
                    case 'HtmlEditor':
                        var htmlEditor = new duice.ui.HtmlEditor(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        htmlEditor.setBind(bindMap, bindName);
                        htmlEditor.build();
                    break;
                    case 'MarkdownEditor':
                        var markdownEditor = new duice.ui.MarkdownEditor(element);
                        var bindMap = getObject($context, bind[0]);
                        var bindName = bind[1];
                        markdownEditor.setBind(bindMap, bindName);
                        markdownEditor.build();
                    break;
                }
                element.dataset.duice += generateUUID();
            }catch(e){
                console.error(e, elements[i]);
                throw e;
            }
        }
    }

    /**
     * generateObjectID
     */
    function generateUUID():string {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }
    
    /**
     * getObject
     * @param $context
     * @param name
     */
    function getObject($context:any, name:string) {
        if($context.hasOwnProperty(name)){
            return $context[name];
        }
        if((<any>window).hasOwnProperty(name)){
            return (<any>window)[name];
        }
        try {
            return eval(name);
        }catch(e){
            console.error(e,$context, name);
            throw e;
        }
    };
    
    
    /**
     * isEmpty
     * @param value
     */
    function isEmpty(value:any){
        if(value === undefined
        || value === null
        || value === ''
        ){
            return true;
        }else{
            return false;
        }
    }
    
    /**
     * defaultIfEmpty
     * @param value
     * @param defaultValue
     */
    function defaultIfEmpty(value:any, defaultValue:any) {
        if(isEmpty(value) === true) {
            return defaultValue;
        }else{
            return value;
        }
    }
    
    
    /**
     * lpad
     * @param value
     * @param length
     * @param padChar
     */
    function lpad(value:string, length:number, padChar:string) {
        for(var i = 0, size = (length-value.length); i < size; i ++ ) {
            value = padChar + value;
        }
        return value;
    }
    
    /**
     * rpad
     * @param value
     * @param length
     * @param padChar
     */
    function rpad(value:string, length:number, padChar:string) {
        for(var i = 0, size = (length-value.length); i < size; i ++ ) {
            value = value + padChar;
        }
        return value;
    }
    
//    /**
//     * isMaskChar
//     * @param value
//     * @param type
//     * @param format
//     */
//    function isValidMaskValue(value:any, type:string, format:any):boolean {
//        switch (type) {
//            case 'string' :
//                return true;
//            case 'number' :
//                console.log('fdsafdsafdsa', isNaN(value));
//                value = value.replace(/\+|\-|,|\./g,'');
//                return (isNaN(value) ? false : true);
//            case 'date' :
//                return (isNaN(value) ? true : false);
//            default:
//                throw 'encodeMask-type must be string|number|date';
//        }
//    }
    
    function mask(value: any, type: string, format: any):string {
        switch (type) {
        
            // string type
            case 'string' :
                var string = '';
                var index = -1;
                for(var i = 0, size = format.length; i < size; i ++){
                    var formatChar = format.charAt(i);
                    if(formatChar === '#'){
                        index ++;
                        string += value.charAt(index);
                    }else{
                        string += formatChar;
                    }
                }
                return string;
                    
            // number
            case 'number':
                var number;
                if(typeof value === 'number'){
                    number = value;
                }else if(typeof value === 'string'){
                    value = value.replace(/\,/gi,'');
                    number = Number(value);
                }else{
                    number = Number(value);
                }
                if(isNaN(number)){
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
                var date:Date;
                if(value instanceof Date){
                    date = value;
                }else if (typeof value === 'number'){
                    date = new Date(value);
                } else {
                    throw 'Not Date Type';
                }
                var formatRex = /yyyy|yy|MM|dd|HH|hh|mm|ss/gi;
                var maskValue:string = format.replace(formatRex, function($1:string) {
                    switch ($1) {
                        case "yyyy": return date.getFullYear();
                        case "yy": return lpad(String(date.getFullYear()%1000), 2, '0');
                        case "MM": return lpad(String(date.getMonth() + 1), 2, '0');
                        case "dd": return lpad(String(date.getDate()), 2, '0');
                        case "HH": return lpad(String(date.getHours()), 2, '0');
                        case "hh": return lpad(String(date.getHours() <= 12 ? date.getHours() : date.getHours()%12), 2, '0');
                        case "mm": return lpad(String(date.getMinutes()), 2, '0');
                        case "ss": return lpad(String(date.getSeconds()), 2, '0');
                        default: return $1;
                    }
                });
                return maskValue;
    
            // default
            default :
                throw 'encodeMask-type must be string|number|date';
        }
    }
    
//    function validateMask(value:string, type:string, format:any):boolean {
//        
//        return false;
//    }
    
    /**
     * unmask
     * @param value
     * @param type
     * @param format
     */
    function unmask(value:string, type:string, format:any):any {
        switch (type) {
        
            // string type
            case 'string' :
                if(isEmpty(value)){
                    return null;
                }
                // TODO
                
                return value;
                
            // number type
            case 'number' :
                if(isEmpty(value)){
                    return null;
                }
                var number;
                if(typeof value === 'number'){
                    number = value;
                }else if(typeof value === 'string'){
                    value = value.replace(/,/g,'');
                    number = Number(value);
                }else{
                    number = Number(value);
                }
                if(isNaN(number)){
                    throw 'NaN';
                }
                var scale = parseInt(format);
                return number.toFixed(scale);
                
            // date type
            case 'date' :
                if(isEmpty(value)){
                    return null;
                }
                if(value.length !== format.length){
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
                    matchValue = lpad(matchValue, formatLength,'0');
                    if(isNaN(Number(matchValue))){
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
                            date.setMonth(monthValue-1);
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
     * duice.data
     */
    export namespace data {

        /**
         * Super prototype of duice.data
         */
        export abstract class DataObject {
            observers:Array<duice.ui.UIComponent> = new Array<duice.ui.UIComponent>();
            addObserver(observer:duice.ui.UIComponent):void {
                for(var i = 0, size = this.observers.length; i < size; i++){
                    if(this.observers[i] === observer){
                        return;
                    }
                }
                this.observers.push(observer);
            }
            notifyObservers():void {
                for(var i = 0, size = this.observers.length; i < size; i++){
                    this.observers[i].update(this);
                }
            }
        }
        
        /**
         * Map data structure
         */
        export class Map extends DataObject {
            values:any = new Object();
            parentNode:Map;
            childNodes:Array<Map> = new Array<Map>();
            enable:boolean = true;
            readonlyNames:Array<string> = new Array<string>();
            constructor(json:any) {
                super();
                this.fromJson(json);
            }
            fromJson(json: any): void {
                this.values = new Object();
                for(var name in json){
                    this.values[name] = json[name];
                }
                this.notifyObservers();
            }
            toJson():object {
                var json: any = new Object();
                for(var name in this.values){
                    json[name] = this.values[name];
                }
                return json;
            }
            set(name:string, value:any):void {
                this.values[name] = value;
                this.notifyObservers();
            }
            get(name:string):any {
                return this.values[name];
            }
            getNames():string[]{
                var names = new Array();
                for(var name in this.values){
                    names.push(name);
                }
                return names;
            }
            setParentNode(parentNode:Map):void {
                this.parentNode = parentNode;
            }
            getParentNode():Map {
                return this.parentNode;
            }
            getChildNodes():Array<Map> {
                return this.childNodes;
            }
            getChildNode(index:number):Map {
                return this.childNodes[index];
            }
            addChildNode(node:Map):void {
                node.setParentNode(this);
                this.childNodes.push(node);
            }
            insertChildNode(index:number, node:Map):void {
                node.setParentNode(this);
                this.childNodes.splice(index, 0, node);
            }
            removeChildNode(index:number):void {
                this.childNodes.splice(index,1);
            }
            setEnable(enable:boolean):void {
                this.enable = enable;
                this.notifyObservers();
            }
            isEnable():boolean {
                return this.enable;
            }
            setReadonly(name:string, readonly:boolean):void {
                if(this.readonlyNames.indexOf(name) == -1){
                    this.readonlyNames.push(name);
                }
                this.notifyObservers();
            }
            isReadonly(name:string):boolean {
                if(this.readonlyNames.indexOf(name) >= 0){
                    return true;
                }else{
                    return false;
                }
            }
        }
        
        /**
         * List data structure
         */
        export class List extends DataObject {
            mapList:Array<Map> = new Array<Map>();
            index:number = -1;
            constructor(jsonArray:Array<any>) {
                super();
                this.fromJson(jsonArray);
            }
            update(ui:duice.ui.UIComponent):void {
                
            }
            fromJson(jsonArray:Array<any>):void {
                this.mapList = new Array<Map>();
                for(var i = 0; i < jsonArray.length; i ++ ) {
                    var map = new duice.data.Map(jsonArray[i]);
                    this.mapList.push(map);
                }
                this.index = -1;
                this.notifyObservers();
            }
            toJson():Array<object> {
                var jsonArray = new Array();
                for(var i = 0; i < this.mapList.length; i ++){
                    jsonArray.push(this.mapList[i].toJson());
                }
                return jsonArray;
            }
            setIndex(index:number):void {
                this.index = index;
                this.notifyObservers();
            }
            getIndex():number {
                return this.index;
            }
            clearIndex():void {
                this.index = -1;
                this.notifyObservers();
            }
            getRowCount():number {
                return this.mapList.length;
            }
            getRow(index:number):Map {
                return this.mapList[index];
            }
            addRow(map:Map):void {
                this.mapList.push(map);
                this.index = this.getRowCount();
                this.notifyObservers();
            }
            insertRow(index:number, map:Map):void {
                this.mapList.splice(index, 0, map);
                this.index = index;
                this.notifyObservers();
            }
            removeRow(index:number):void {
                this.mapList.splice(index, 1);
                this.notifyObservers();
            }
            moveRow(fromIndex:number, toIndex:number):void {
                this.index = fromIndex;
                this.mapList.splice(toIndex, 0, this.mapList.splice(fromIndex, 1)[0]);
                this.index = toIndex;
                this.notifyObservers();
            }
            sortRow(name:string, ascending:boolean):void {
                this.mapList.sort(function(a:duice.data.Map,b:duice.data.Map):number {
                    var aValue = a.get(name);
                    var bValue = b.get(name);
                    return (aValue > bValue ? 1 : aValue < bValue ? -1 : 0) * (ascending == false ? -1 : 1);
                });
                this.notifyObservers();
            }
            forEach(handler:Function):void {
                for(var i = 0, size = this.mapList.length; i < size; i ++){
                    handler.call(this, this.mapList[i]);
                }
            }
            findIndex(handler:Function):number {
                for(var i = 0, size = this.mapList.length; i < size; i ++){
                    if(handler.call(this, this.mapList[i]) === true){
                        return i;
                    }
                }
                return -1;
            }
            findIndexes(handler:Function):Array<number> {
                var indexes = [];
                for(var i = 0, size = this.mapList.length; i < size; i ++){
                    if(handler.call(this, this.mapList[i]) === true){
                        indexes.push(i);
                    }
                }
                return indexes;
            }
            findRow(handler:Function):Map {
                var index = this.findIndex(handler);
                return this.getRow(index);
            }
            findRows(handler:Function):Array<Map> {
                var indexes = this.findIndexes(handler);
                var rows = new Array();
                for(var i = 0, size = indexes.length; i < size; i ++){
                    var node = this.getRow(indexes[i]);
                    rows.push(node);
                }
                return rows;
            }
        }
        
//        /**
//         * Tree data structure
//         */
//        export class Tree extends __ {
//            index:Array<number> = [];
//            rootNode:Map = new Map({});
//            Tree(jsonArray:Array<any>, childNodeName:string):void {
//                if(jsonArray) {
//                    this.fromJson(jsonArray, childNodeName);
//                }
//            }
//            fromJson(jsonArray:Array<Map>, childNodeName:string) {
//                this.rootNode = new Map({});
//            }
//            toJson():any {
//                return null;
//            }
//        }
    }
    
    /**
     * duice.data
     */
    export namespace ui {
        
        /**
         * executeExpression
         * @param element
         * @param $context
         */
        function executeExpression(element:HTMLElement, $context:any):any {
            var string = element.outerHTML;
            string = string.replace(/\[\[(.*?)\]\]/mgi,function(match, command){
                try {
                    command = command.replace('&amp;', '&');
                    command = command.replace('&lt;', '<');
                    command = command.replace('&gt;', '>');
                    var result = eval(command);
                    return result;
                }catch(e){
                    console.error(e,command);
                    throw e;
                }
            });
            var template = document.createElement('template');
            template.innerHTML = string;
            return template.content.firstChild;
        }
        
        /**
         * escapeHtml
         * @param value
         */
        function escapeHtml(value:string):string {
            
            // checks value is valid.
            if(!value || typeof value !== 'string'){
                return value;
            }
            
            // replace tag
            var htmlMap:any = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return value.replace(/[&<>"']/g, function(m:string) {return htmlMap[m];});
        }
        
        /**
         * parseMarkdown
         * @param value
         */
        function parseMarkdown(value:string):string {
            
            // checks value is valid.
            if(!value){
                return value;
            }
            
            // code
            value = value.replace(/[\`]{3}([\w]*)\n([^\`]+)\n[\`]{3}/g, function(match,language,code){
                var codeHtml = new Array();
                codeHtml.push('<code data-langhage="' + language + '">');
                var lines = code.split('\n');
                for(var i = 0; i < lines.length; i++){
                    var line = lines[i];

                    // replace tag
                    line = line.replace(/\</g, '&lt');
                    line = line.replace(/\>/g, '&gt');

                    // comment
                    line = line.replace(/(^|[\s])(\/\/[\s]*.+)/gm,'<span class="comment">$2</span>');
                    line = line.replace(/(\/\*)/gm,'<span class="comment">$1');
                    line = line.replace(/(\*\/)/gm,'$1</span>');
                    line = line.replace(/(\s*)(#+.*)/gm,'$1<span class="comment">$2</span>');

                    // append 
                    codeHtml.push(line);
                }
                codeHtml.push('</code>');
                return codeHtml.join('\n') + '\n';
            });
            
            //ul
            value = value.replace(/(^[ \t]*[\*\-]\s+.+\n)+/gm, function(match) {
                var ulHtml = new Array();
                ulHtml.push('<ul>');
                var lines = match.split('\n');
                for(var i = 0; i < lines.length; i++){
                    var line = lines[i];
                    if(line.trim().length < 1){
                        continue;
                    }
                    line = line.replace(/^[ \t]*[\*\-]\s+(.+)/gm,'<li>$1</li>');
                    ulHtml.push(line);
                }
                ulHtml.push('</ul>');
                return ulHtml.join('\n') + '\n';
            });
            
            //ol
            value = value.replace(/(^[ \t]*[\d]+[\.]?\s+.+\n)+/gm, function(match) {
                var olHtml = new Array();
                olHtml.push('<ol>');
                var lines = match.split('\n');
                for(var i = 0; i < lines.length; i++){
                    var line = lines[i];
                    if(line.trim().length < 1){
                        continue;
                    }
                    line = line.replace(/^[ \t]*[\d]+[\.]?\s+(.+)/gm,'<li>$1</li>');
                    olHtml.push(line);
                }
                olHtml.push('</ol>');
                return olHtml.join('\n') + '\n';
            });

            // title
            value = value.replace(/^[\#]{6}\s(.+)/gm, '<h6>$1</h6>');
            value = value.replace(/^[\#]{5}\s(.+)/gm, '<h5>$1</h5>');
            value = value.replace(/^[\#]{4}\s(.+)/gm, '<h4>$1</h4>');
            value = value.replace(/^[\#]{3}\s(.+)/gm, '<h3>$1</h3>');
            value = value.replace(/^[\#]{2}\s(.+)/gm, '<h2>$1</h2>');
            value = value.replace(/^[\#]{1}\s(.+)/gm, '<h1>$1</h1>');

            // hr
            value = value.replace(/(^[\-\=]{5,}\n)/gm, function(match){
                return '<hr/>';
            });
            
            // parses in-line element
            var lines = value.split('\n');
            for(var i = 0, size = lines.length; i < size; i ++){
                var line = lines[i];

                // font style
                line = line.replace(/\*{2}([^\*].+)\*{2}/gm, '<b>$1</b>');
                line = line.replace(/\_{2}([^\_].+)\_{2}/gm, '<em>$1</em>');
                line = line.replace(/\~{2}([^\~].+)\~{2}/gm, '<del>$1</del>');

                // image
                line = line.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />');

                // link
                line = line.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4">$1</a>');
                
                // replace line
                lines[i] = line;
            }
            value = lines.join('\n');

            // return parsed value
            return value;
        }
        
        /**
         * removeChildNodes
         * @param element
         */
        function removeChildNodes(element:HTMLElement):void {
            // Remove element nodes and prevent memory leaks
            var node, nodes = element.childNodes, i = 0;
            while (node = nodes[i++]) {
                if (node.nodeType === 1 ) {
                    element.removeChild(node);
                }
            }

            // Remove any remaining nodes
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }

            // If this is a select, ensure that it displays empty
            if(element instanceof HTMLSelectElement){
                (<HTMLSelectElement>element).options.length = 0;
            }
        }
        
        /**
         * enableElement
         * @param element
         * @param enable
         */
        function enableElement(element:HTMLElement, enable:boolean):void {
            if(element.tagName === 'SELECT'){
                (<HTMLSelectElement>element).disabled = (enable === true ? false : true);
            }else if(element.tagName === 'BUTTON'){
                (<HTMLButtonElement>element).disabled = (enable === true ? false : true);
            }
            var childNodes = element.childNodes, i = 0;
            for(var i = 0, size = childNodes.length; i < size; i ++ ){
                var element:HTMLElement = <HTMLElement>childNodes[i];
                this.enableElement(element, enable);
            }
        }
        
        /**
         * createDocumentFragment
         * @param html
         */
        function createDocumentFragment(html:string):DocumentFragment {
            var template = document.createElement('template');
            template.innerHTML = html;
            return template.content;
        }
        
        /**
         * getCurrentWindow
         */
        function getCurrentWindow():Window {
            if(window.frameElement){
                return window.parent;
            }else{
                return window;
            }
        }
        
        /**
         * getParentNode
         * @param element
         */
        function getParentNode(element:HTMLElement):Node {
            var parentNode = element.parentNode;
            return parentNode;
        }
        
        /**
         * setPositionCentered
         * @param element
         */
        function setPositionCentered(element:HTMLElement):void {
            var window = this.getCurrentWindow();
            var computedStyle = window.getComputedStyle(element);
            var computedWidth = parseInt(computedStyle.getPropertyValue('width').replace(/px/gi, ''));
            var computedHeight = parseInt(computedStyle.getPropertyValue('height').replace(/px/gi, ''));
            element.style.width = Math.min(window.screen.width-20, computedWidth) + 'px';
            element.style.height = Math.min(window.screen.height, computedHeight) + 'px';
            element.style.left = Math.max(10,window.innerWidth/2 - computedWidth/2) + 'px';
            element.style.top = Math.max(0,window.innerHeight/2 - computedHeight/2) + 'px';
        }
        
        /**
         * delay
         * @param callback
         */
        function delay(callback:Function){
            var interval = setInterval(function() {
                try {
                    callback.call(callback);
                }catch(ignore){
                    console.log(ignore, callback);
                }finally{
                    clearInterval(interval);
                }
            },200); 
        }
        
        /**
         * fadeIn
         * @param element
         */
        function fadeIn(element:HTMLElement):void {
            element.classList.remove('duice-ui-fadeOut');
            element.classList.add('duice-ui-fadeIn');
        }
        
        /**
         * fadeOut
         * @param element
         */
        function fadeOut(element:HTMLElement):void {
            element.classList.remove('duice-ui-fadeIn');
            element.classList.add('duice-ui-fadeOut');
        }
        
        /**
         * getCurrentMaxZIndex
         */
        function getCurrentMaxZIndex():number {
            var zIndex,
            z = 0,
            all = document.getElementsByTagName('*');
            for (var i = 0, n = all.length; i < n; i++) {
                zIndex = document.defaultView.getComputedStyle(all[i],null).getPropertyValue("z-index");
                zIndex = parseInt(zIndex, 10);
                z = (zIndex) ? Math.max(z, zIndex) : z;
            }
            return z;
        }
        
        /**
         * block
         * @param element
         */
        function block(element:HTMLElement):object {
            
            var div = document.createElement('div');
            div.classList.add('duice-ui-block');
            
            // defines maxZIndex
            var zIndex = this.getCurrentMaxZIndex() + 1;
            
            // adjusting position
            div.style.position = 'fixed';
            div.style.zIndex = String(zIndex);
            
            // full blocking in case of BODY
            if(element.tagName == 'BODY'){
                div.style.width = '100%';
                div.style.height = '100%';
                div.style.top = '0px';
                div.style.left = '0px';
            }
            // otherwise adjusting to parent element
            else{
                var boundingClientRect = element.getBoundingClientRect();
                var width = boundingClientRect.width;
                var height = boundingClientRect.height;
                var left = boundingClientRect.left;
                var top = boundingClientRect.top;
                div.style.width = width + "px";
                div.style.height = height + "px";
                div.style.top = top + 'px';
                div.style.left = left + 'px';
            }
            
            // append
            element.appendChild(div);
            this.fadeIn(div);
            
            // return handler
            var $this = this;
            return {
                getZIndex: function(){
                    return zIndex;
                },
                release: function() {
                    $this.fadeOut(div);
                    $this.delay(function(){
                        element.removeChild(div);
                    });
                }
            }
        }
        
        /**
         * load
         * @param element
         */
        function load(element:HTMLElement):object {
            var $this = this;
            var div = document.createElement('div');
            div.classList.add('duice-ui-load');
            div.style.position = 'fixed';
            div.style.opacity = '0';
            div.style.zIndex = String(this.getCurrentMaxZIndex() + 1);

            // on resize event
            this.getCurrentWindow().addEventListener('resize', function(event:any) {
                if(div){
                    $this.setPositionCentered(div);
                    div.style.top = '30vh';   // adjust top
                }
            });
            
            // start
            element.appendChild(div);
            this.setPositionCentered(div);
            div.style.top = '30vh'; // adjust top   
            this.fadeIn(div);
            
            // return handler
            return {
                release: function() {
                    $this.fadeOut(div);
                    $this.delay(function(){
                        element.removeChild(div);
                    });
                }
            }
        }
        
        /**
         * Super prototype of duice.ui
         */
        export abstract class UIComponent {
//            mask:{type:string, format:any};
            abstract setBind(...args: any[]):void;
            abstract build():void;
            abstract update(observable:duice.data.DataObject):void;
//            setMask(type:string, format:any):void {
//                this.mask = { type: type, format: format };
//            }
//            hasMask():boolean {
//                return (this.mask ? true : false);
//            }
        }
        
        /**
         * duice.ui.Text
         */
        export class Text extends UIComponent {
            div:HTMLDivElement;
            bindMap:duice.data.Map;
            bindName:string;
            mode:string;
            constructor(span:HTMLDivElement){
                super();
                this.div = span;
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
            }
            setMode(mode:string):void {
                this.mode = mode;
            }
            build():void {
                this.div.classList.add('duice-ui-text');
                this.bindMap.addObserver(this);
                this.update(null);
            }
            update(observable:duice.data.DataObject):void {
                var value = this.bindMap.get(this.bindName);
                
                // adjust mode
                if(this.mode === 'html') {
                    value = value;
                }else if(this.mode === 'markdown'){
                    value = parseMarkdown(value);
                }else{
                    value = escapeHtml(value);
                }
                
                // sets mask
                if(this.hasMask()){
                    value = mask(value, this.mask.type, this.mask.format);
                }

                // create child nodes
                removeChildNodes(this.div);
                this.div.appendChild(createDocumentFragment(value));
            }
        }
        
        /**
         * duice.ui.TextField
         */
        export class TextField extends UIComponent {
            input:HTMLInputElement;
            bindMap:duice.data.Map;
            bindName:string;
            constructor(input:HTMLInputElement){
                super();
                this.input = input;
                this.input.classList.add('duice-ui-textField');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
            }
            build():void {
                var $this = this;
                this.bindMap.addObserver(this);
                this.input.addEventListener('change', function(){
                    var value = this.value;
                    if($this.hasMask()){
                        value = unmask(this.value, $this.mask.type, $this.mask.format);
                    }
                    $this.bindMap.set($this.bindName, value);
                });
                if(this.hasMask()){
                    this.input.addEventListener('keypress', function(event){
                        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                        var selectionLength = this.selectionEnd - this.selectionStart;
                        var value = this.value.substr(0,this.selectionStart) + key + this.value.substr(this.selectionStart + selectionLength);
                        try {
                            unmask(value, $this.mask.type, $this.mask.format);
                        }catch(e){
                            event.preventDefault();
                            return false;
                        }
                    });
                    this.input.addEventListener('paste', function(event){
                        var pasteValue = (event.clipboardData).getData('text');
                        var selectionLength = this.selectionEnd - this.selectionStart;
                        var value = this.value.substr(0,this.selectionStart) + pasteValue + this.value.substr(this.selectionStart + selectionLength);
                        try {
                            unmask(value, $this.mask.type, $this.mask.format);
                        }catch(e){
                            event.preventDefault();
                            return false;
                        }
                    });
                }
                this.update(null);
            }
            update(observable:duice.data.DataObject):void {
                var value = this.bindMap.get(this.bindName);
                if(this.hasMask()){
                    try {
                        value = mask(value, this.mask.type, this.mask.format);
                    }catch(e){
                        value = e;
                    }
                }
                this.input.value = value;
                
                // checks enable
                if(this.bindMap.isEnable()){
                    this.input.disabled = false;
                }else{
                    this.input.disabled = true;
                }
                
                // checks read-only
                if(this.bindMap.isReadonly(this.bindName)){
                    this.input.setAttribute('readOnly','readOnly');
                }else{
                    this.input.removeAttribute('readOnly');
                }
            }
        }
        
        /**
         * duice.ui.TextArea
         */
        export class TextArea extends UIComponent {
            textarea:HTMLTextAreaElement;
            bindMap:duice.data.Map;
            bindName:string;
            constructor(textarea:HTMLTextAreaElement){
                super();
                this.textarea = textarea;
                this.textarea.classList.add('duice-ui-textArea');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
            }
            build():void {
                var $this = this;
                this.bindMap.addObserver(this);
                this.textarea.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.value);
                });
                this.update(null);
            }
            update(observable:duice.data.DataObject):void {
                this.textarea.value = this.bindMap.get(this.bindName);
            }
        }
        
        /**
         * duice.ui.ComboBox
         */
        export class ComboBox extends UIComponent {
            select:HTMLSelectElement;
            bindMap:duice.data.Map;
            bindName:string;
            optionList:duice.data.List;
            optionText:string;
            optionValue:string;
            constructor(select:HTMLSelectElement) {
                super();
                this.select = select;
                this.select.classList.add('duice-ui-comboBox');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
            }
            setOption(list:duice.data.List, value:string, text:string):void {
                this.optionList = list;
                this.optionValue = value;
                this.optionText = text;
            }
            build():void {
                var $this = this;
                this.bindMap.addObserver(this);
                this.select.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.value);
                });
                this.update(this.bindMap);
                this.optionList.addObserver(this);
                this.update(this.optionList);
            }
            update(observable:duice.data.DataObject):void {
                if(observable === this.optionList){
                    removeChildNodes(this.select);
                    for(var i = 0, size = this.optionList.getRowCount(); i < size; i ++){
                        var optionMap = this.optionList.getRow(i);
                        var option = document.createElement('option');
                        option.appendChild(document.createTextNode(optionMap.get(this.optionText)));
                        option.value = optionMap.get(this.optionValue);
                        this.select.appendChild(option);
                    }
                }
                if(observable === this.bindMap){
                    var value = this.bindMap.get(this.bindName);
                    this.select.value = value;
                }
            }
        }
        
        /**
         * duice.ui.CheckBox
         */
        export class CheckBox extends UIComponent {
            input:HTMLInputElement;
            bindMap:duice.data.Map;
            bindName:string;
            constructor(input:HTMLInputElement) {
                super();
                this.input = input;
                this.input.classList.add('duice-ui-checkBox');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
            }
            build():void {
                var $this = this;
                this.bindMap.addObserver(this);
                this.input.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.checked);
                });
                this.update(null);
            }
            update(observable:duice.data.DataObject):void {
                var value = this.bindMap.get(this.bindName);
                if(value === true){
                    this.input.checked = true;
                }else{
                    this.input.checked = false;
                }
            }
        }
        
        /**
         * duice.ui.Radio
         */
        export class Radio extends UIComponent {
            input:HTMLInputElement;
            bindMap:duice.data.Map;
            bindName:string;
            constructor(input:HTMLInputElement){
                super();
                this.input = input;
                this.input.classList.add('duice-ui-radio');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
            }
            build():void {
                var $this = this;
                this.bindMap.addObserver(this);
                this.input.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.value);
                });
                this.update(null);
            }
            update(observable:duice.data.DataObject):void {
                var value = this.bindMap.get(this.bindName);
                if(value === this.input.value){
                    this.input.checked = true;
                }else{
                    this.input.checked = false;
                }
            }
        }
        
        /**
         * duice.ui.Calendar
         */
        export class Calendar extends UIComponent {
            input:HTMLInputElement;
            bindMap:duice.data.Map;
            bindName:string;
            pickerDiv:HTMLDivElement;
            clickListener:any;
            constructor(input:HTMLInputElement){
                super();
                this.input = input;
                this.input.classList.add('duice-ui-calendar');
                this.setMask('date', 'yyyy-MM-dd HH:mm:ss');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
            }
            build():void {
                var $this = this;
                
                // sets placeholder
                this.input.setAttribute('placeholder', this.mask.format);
                
                // bind
                this.bindMap.addObserver(this);
                this.input.addEventListener('change', function(event){
                    var value;
                    try {
                        value = unmask(this.value, $this.mask.type, $this.mask.format).getTime();
                    }catch(e){
                        value = null;
                    }
                    $this.bindMap.set($this.bindName, value);
                });
                
                // date picker
                this.input.addEventListener('click', function(){
                    $this.openPicker();
                });
                
                // validates input event
                this.input.addEventListener('keypress', function(event){
                    try {
                        // unmask(value, $this.mask.type, $this.mask.format);
                    }catch(e){
                        console.log('keypress', e);
                        event.preventDefault();
                        return false;
                    }
                });
                this.input.addEventListener('paste', function(event){
                    try {
                        // unmask(value, $this.mask.type, $this.mask.format);
                    }catch(e){
                        console.log('keypress', e);
                        event.preventDefault();
                        return false;
                    }
                });
                
                // update
                this.update(null);
            }
            update(observable:duice.data.DataObject):void {
                var value = this.bindMap.get(this.bindName);
                try {
                    value = mask(value, this.mask.type, this.mask.format);
                }catch(e){
                    value = '';
                }
                this.input.value = value;
                
                // re-open picker picker is already open.
                if(this.pickerDiv){
                    this.closePicker();
                    this.openPicker();
                }
            }
            openPicker():void {
                
                // checks pickerDiv is open.
                if(this.pickerDiv){
                    return;
                }
                
                var $this = this;
                this.pickerDiv = document.createElement('div');
                this.pickerDiv.classList.add('duice-ui-calendar__pickerDiv');

                // parses parts
                var date = new Date(this.bindMap.get(this.bindName));
                var yyyy = date.getFullYear();
                var mm = date.getMonth();
                var dd = date.getDate();
                var hh = date.getHours();
                var mi = date.getMinutes();
                var ss = date.getSeconds();
                
                // click event listener
                this.clickListener = function(event:any){
                    if(!$this.input.contains(event.target) && !$this.pickerDiv.contains(event.target)){
                        $this.closePicker();
                    }
                }
                window.addEventListener('click', this.clickListener);
                
                // header
                var headerDiv = document.createElement('div');
                headerDiv.classList.add('duice-ui-calendar__pickerDiv-headerDiv');
                this.pickerDiv.appendChild(headerDiv);
                
                // titleIcon
                var titleSpan = document.createElement('span');
                titleSpan.classList.add('duice-ui-calendar__pickerDiv-headerDiv-titleSpan');
                headerDiv.appendChild(titleSpan);
                
                // closeButton
                var closeButton = document.createElement('button');
                closeButton.classList.add('duice-ui-calendar__pickerDiv-headerDiv-closeButton');
                headerDiv.appendChild(closeButton);
                closeButton.addEventListener('click', function(event){
                    $this.closePicker();
                });
                
                // bodyDiv
                var bodyDiv = document.createElement('div');
                bodyDiv.classList.add('duice-ui-calendar__pickerDiv-bodyDiv');
                this.pickerDiv.appendChild(bodyDiv);
                
                // daySelector
                var dateDiv = document.createElement('div');
                dateDiv.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-dateDiv');
                bodyDiv.appendChild(dateDiv);
                
                // previous month button
                var prevMonthButton = document.createElement('button');
                prevMonthButton.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-dateDiv-prevMonthButton');
                dateDiv.appendChild(prevMonthButton);
                prevMonthButton.addEventListener('click', function(event){
                    date.setMonth(date.getMonth() - 1);
                    updateDate(date);
                });
                
                // todayButton
                var todayButton = document.createElement('button');
                todayButton.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-dateDiv-todayButton');
                dateDiv.appendChild(todayButton);
                todayButton.addEventListener('click', function(event){
                    var newDate = new Date();
                    date.setFullYear(newDate.getFullYear());
                    date.setMonth(newDate.getMonth());
                    date.setDate(newDate.getDate());
                    updateDate(date);
                });
                
                // year select
                var yearSelect = document.createElement('select');
                yearSelect.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-dateDiv-yearSelect');
                dateDiv.appendChild(yearSelect);
                yearSelect.addEventListener('change', function(event){
                    date.setFullYear(parseInt(this.value));
                    updateDate(date);
                });
                
                // divider
                dateDiv.appendChild(document.createTextNode('-'));
                
                // month select
                var monthSelect = document.createElement('select');
                monthSelect.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-dateDiv-monthSelect');
                dateDiv.appendChild(monthSelect);
                for(var i = 0, end = 11; i <= end; i ++ ) {
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = String(i + 1);
                    monthSelect.appendChild(option);
                }
                monthSelect.addEventListener('change', function(event){
                    date.setMonth(parseInt(this.value));
                    updateDate(date);
                });
               
                // next month button
                var nextMonthButton = document.createElement('button');
                nextMonthButton.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-dateDiv-nextMonthButton');
                dateDiv.appendChild(nextMonthButton);
                nextMonthButton.addEventListener('click', function(event){
                   date.setMonth(date.getMonth() + 1);
                   updateDate(date);
                });
                
                // calendar table
                var calendarTable = document.createElement('table');
                calendarTable.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-calendarTable');
                bodyDiv.appendChild(calendarTable);
                var calendarThead = document.createElement('thead');
                calendarTable.appendChild(calendarThead);
                var weekTr = document.createElement('tr');
                weekTr.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-calendarTable-weekTr');
                calendarThead.appendChild(weekTr);
                ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(function(element){
                    var weekTh = document.createElement('th');
                    weekTh.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-calendarTable-weekTh');
                    weekTh.appendChild(document.createTextNode(element));
                    weekTr.appendChild(weekTh);
                });
                var calendarTbody = document.createElement('tbody');
                calendarTable.appendChild(calendarTbody);
                
                // timeDiv
                var timeDiv = document.createElement('div');
                timeDiv.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-timeDiv');
                bodyDiv.appendChild(timeDiv);
                
                // now
                var nowButton = document.createElement('button');
                nowButton.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-timeDiv-nowButton');
                timeDiv.appendChild(nowButton);
                nowButton.addEventListener('click', function(event){
                    var newDate = new Date();
                    date.setHours(newDate.getHours());
                    date.setMinutes(newDate.getMinutes());
                    date.setSeconds(newDate.getSeconds());
                    updateDate(date);
                });

                // hourSelect
                var hourSelect = document.createElement('select');
                hourSelect.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-timeDiv-hourSelect');
                for(var i = 0; i <= 23; i ++){
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = lpad(String(i), 2, '0');
                    hourSelect.appendChild(option);
                }
                timeDiv.appendChild(hourSelect);
                hourSelect.addEventListener('change', function(event){
                    date.setHours(parseInt(this.value)); 
                });
                
                // divider
                timeDiv.appendChild(document.createTextNode(':'));
                
                // minuteSelect
                var minuteSelect = document.createElement('select');
                minuteSelect.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-timeDiv-minuteSelect');
                for(var i = 0; i <= 59; i ++){
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = lpad(String(i), 2, '0');
                    minuteSelect.appendChild(option);
                }
                timeDiv.appendChild(minuteSelect);
                minuteSelect.addEventListener('change', function(event){
                    date.setMinutes(parseInt(this.value)); 
                });
                
                // divider
                timeDiv.appendChild(document.createTextNode(':'));
                
                // secondsSelect
                var secondSelect = document.createElement('select');
                secondSelect.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-timeDiv-secondSelect');
                for(var i = 0; i <= 59; i ++){
                    var option = document.createElement('option');
                    option.value = String(i);
                    option.text = lpad(String(i), 2, '0');
                    secondSelect.appendChild(option);
                }
                timeDiv.appendChild(secondSelect);
                secondSelect.addEventListener('change', function(event){
                    date.setSeconds(parseInt(this.value)); 
                });
                
                // footer
                var footerDiv = document.createElement('div');
                footerDiv.classList.add('duice-ui-calendar__pickerDiv-footerDiv');
                this.pickerDiv.appendChild(footerDiv);
                
                // confirm
                var confirmButton = document.createElement('button');
                confirmButton.classList.add('duice-ui-calendar__pickerDiv-footerDiv-confirmButton');
                footerDiv.appendChild(confirmButton);
                confirmButton.addEventListener('click', function(event){
                    date.setTime(date.getTime());
                    $this.bindMap.set($this.bindName, date.getTime());
                    $this.closePicker();
                });
                
                // show
                this.pickerDiv.style.position = 'absolute';
                this.pickerDiv.style.zIndex = String(getCurrentMaxZIndex() + 1);
                this.input.parentNode.appendChild(this.pickerDiv);
                
                // updates date
                function updateDate(date:Date):void {
                    var yyyy = date.getFullYear();
                    var mm = date.getMonth();
                    var dd = date.getDate();
                    var hh = date.getHours();
                    var mi = date.getMinutes();
                    var ss = date.getSeconds();
                    
                    // updates yearSelect
                    for(var i = yyyy - 5, end = yyyy + 5; i <= end; i ++ ) {
                        var option = document.createElement('option');
                        option.value = String(i);
                        option.text = String(i);
                        yearSelect.appendChild(option);
                    }
                    yearSelect.value = String(yyyy);
                    
                    // updates monthSelect
                    monthSelect.value = String(mm);
                    
                    // updates dateTbody
                    var startDay = new Date(yyyy,mm,1).getDay();
                    var lastDates = [31,28,31,30,31,30,31,31,30,31,30,31];
                    if (yyyy%4 && yyyy%100!=0 || yyyy%400===0) {
                        lastDates[1] = 29;
                    }
                    var lastDate = lastDates[mm];
                    var rowNum = Math.ceil((startDay + lastDate - 1)/7);
                    var dNum = 0;
                    var currentDate = new Date();
                    removeChildNodes(calendarTbody);
                    for (var i=1; i<=rowNum; i++) {
                        var dateTr = document.createElement('tr');
                        dateTr.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-calendarTable-dateTr');
                        for (var k=1; k<=7; k++) {
                            var dateTd = document.createElement('td');
                            dateTd.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-calendarTable-dateTd');
                            if((i === 1 && k < startDay) 
                            || (i === rowNum && dNum >= lastDate)
                            ){
                                dateTd.appendChild(document.createTextNode(''));
                            }else{
                                dNum++;
                                dateTd.appendChild(document.createTextNode(String(dNum)));
                                dateTd.dataset.date = String(dNum);
                                
                                // checks selected
                                if(currentDate.getFullYear() === yyyy
                                && currentDate.getMonth() === mm
                                && currentDate.getDate() === dNum){
                                    dateTd.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-calendarTable-dateTd--today');
                                }
                                if(dd === dNum){
                                    dateTd.classList.add('duice-ui-calendar__pickerDiv-bodyDiv-calendarTable-dateTd--selected');
                                }
                                dateTd.addEventListener('click', function(event){
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
            }
            closePicker():void {
                this.pickerDiv.remove();
                this.pickerDiv = null;
                window.removeEventListener('click', this.clickListener);
            }
        }
        
        /**
         * duice.ui.CronExpression
         */
        export class CronExpression extends UIComponent {
            input:HTMLInputElement;
            bindMap:duice.data.Map;
            bindName:string;
            pickerDiv:HTMLDivElement;
            clickListener:any;
            constructor(input:HTMLInputElement){
                super();
                this.input = input;
                this.input.classList.add('duice-ui-cronExpression');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
            }
            build():void {
                var $this = this;
                this.bindMap.addObserver(this);
                this.input.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.value);
                });
                
                // date picker
                this.input.addEventListener('click', function(){
                    $this.openPicker();
                });
                
                // update
                this.update(null);
            }
            update(observable:duice.data.DataObject):void {
                var value = this.bindMap.get(this.bindName);
                this.input.value = value;
            }
            openPicker():void {
                
                // checks pickerDiv is open.
                if(this.pickerDiv){
                    return;
                }
                
                var $this = this;
                this.pickerDiv = document.createElement('div');
                this.pickerDiv.classList.add('duice-ui-cronExpression__pickerDiv');
                var cronExpression = this.decodeCronExpression(this.input.value);
                
                // click event listener
                this.clickListener = function(event:any){
                    if(!$this.input.contains(event.target) && !$this.pickerDiv.contains(event.target)){
                        $this.closePicker();
                    }
                }
                window.addEventListener('click', this.clickListener);
                
                // header
                var headerDiv = document.createElement('div');
                headerDiv.classList.add('duice-ui-cronExpression__pickerDiv-headerDiv');
                this.pickerDiv.appendChild(headerDiv);
                
                // titleIcon
                var titleSpan = document.createElement('span');
                titleSpan.classList.add('duice-ui-cronExpression__pickerDiv-headerDiv-titleSpan');
                headerDiv.appendChild(titleSpan);
                
                // closeButton
                var closeButton = document.createElement('button');
                closeButton.classList.add('duice-ui-cronExpression__pickerDiv-headerDiv-closeButton');
                headerDiv.appendChild(closeButton);
                closeButton.addEventListener('click', function(event){
                    $this.closePicker();
                });
                
                // bodyDiv
                var bodyDiv = document.createElement('div');
                bodyDiv.classList.add('duice-ui-cronExpression__pickerDiv-bodyDiv');
                this.pickerDiv.appendChild(bodyDiv);
                
                // secondSelectorDiv
                var secondOptions = new Array();
                secondOptions.push({value:'*', text:'Every'});
                for(var i = 0; i <= 59; i ++){
                    secondOptions.push({value:String(i), text:String(i)})
                }
                var secondSelectorDiv = this.createSelectorDiv('Second', secondOptions, cronExpression.second);
                bodyDiv.appendChild(secondSelectorDiv);

                // minuteSelectorDiv
                var minuteOptions = new Array();
                minuteOptions.push({value:'*', text:'Every'});
                for(var i = 0; i <= 59; i ++){
                    minuteOptions.push({value:String(i), text:String(i)})
                }
                var minuteSelectorDiv = this.createSelectorDiv('Minute', minuteOptions, cronExpression.minute);
                bodyDiv.appendChild(minuteSelectorDiv);
                
                // hourSelectorDiv
                var hourOptions = new Array();
                hourOptions.push({value:'*', text:'Every'});
                for(var i = 0; i <= 23; i ++){
                    hourOptions.push({value:String(i), text:String(i)})
                }
                var hourSelectorDiv = this.createSelectorDiv('Hour', hourOptions, cronExpression.hour);
                bodyDiv.appendChild(hourSelectorDiv);
                
                // daySelectorDiv
                var dayOptions = new Array();
                dayOptions.push({value:'?', text:'-'});
                dayOptions.push({value:'*', text:'Every'});
                dayOptions.push({value:'L', text:'Last Day'});
                dayOptions.push({value:'LW', text:'Last Weekday'});
                for(var i = 1; i <= 31; i ++){
                    dayOptions.push({value:String(i), text:String(i)})
                }
                var daySelectorDiv = this.createSelectorDiv('Day', dayOptions, cronExpression.day);
                bodyDiv.appendChild(daySelectorDiv);
                
                // monthSelectorDiv
                var monthOptions = new Array();
                monthOptions.push({value:'*', text:'Every'});
                for(var i = 1; i <= 12; i ++){
                    monthOptions.push({value:String(i), text:String(i)})
                }
                var monthSelectorDiv = this.createSelectorDiv('Month', monthOptions, cronExpression.month);
                bodyDiv.appendChild(monthSelectorDiv);
                
                // weekSelectorDiv
                var weekOptions = new Array();
                weekOptions.push({value:'?', text:'-'});
                weekOptions.push({value:'1-5', text:'Weekday'});
                weekOptions.push({value:'6-7', text:'Weekend'});
                weekOptions.push({value:'1', text:'MON'});
                weekOptions.push({value:'2', text:'TUE'});
                weekOptions.push({value:'3', text:'WED'});
                weekOptions.push({value:'4', text:'THU'});
                weekOptions.push({value:'5', text:'FRI'});
                weekOptions.push({value:'6', text:'SAT'});
                weekOptions.push({value:'7', text:'SUN'});
                var weekSelectorDiv = this.createSelectorDiv('Week', weekOptions, cronExpression.week);
                bodyDiv.appendChild(weekSelectorDiv);
                
                // yearSelectorDiv
                var yearOptions = new Array();
                yearOptions.push({value:'', text:'(Optional)'});
                yearOptions.push({value:'*', text:'Every'});
                for(var i = 1; i <= 12; i ++){
                    monthOptions.push({value:String(i), text:String(i)})
                }
                var yearSelectorDiv = this.createSelectorDiv('Year', yearOptions, cronExpression.year);
                bodyDiv.appendChild(yearSelectorDiv);

                // footer
                var footerDiv = document.createElement('div');
                footerDiv.classList.add('duice-ui-calendar__pickerDiv-footerDiv');
                this.pickerDiv.appendChild(footerDiv);
                
                // confirm
                var confirmButton = document.createElement('button');
                confirmButton.classList.add('duice-ui-calendar__pickerDiv-footerDiv-confirmButton');
                footerDiv.appendChild(confirmButton);
                confirmButton.addEventListener('click', function(event){
                    var cronExpression = {
                        second: secondSelectorDiv.querySelector('input').value,
                        minute: minuteSelectorDiv.querySelector('input').value,
                        hour: hourSelectorDiv.querySelector('input').value,
                        day: daySelectorDiv.querySelector('input').value,
                        month: monthSelectorDiv.querySelector('input').value,
                        week: weekSelectorDiv.querySelector('input').value,
                        year: yearSelectorDiv.querySelector('input').value
                    }
                    $this.bindMap.set($this.bindName, $this.encodeCronExpression(cronExpression));
                    $this.closePicker();
                });
                
                // show
                this.pickerDiv.style.position = 'absolute';
                this.pickerDiv.style.zIndex = String(getCurrentMaxZIndex() + 1);
                this.input.parentNode.appendChild(this.pickerDiv);
            }
            decodeCronExpression(value:string) {
                var values = value.split(/[\s]{1}/);
                return {
                    second: defaultIfEmpty(values[0],'0'),
                    minute: defaultIfEmpty(values[1],'0'),
                    hour: defaultIfEmpty(values[2],'0'),
                    day: defaultIfEmpty(values[3],'*'),
                    month: defaultIfEmpty(values[4],'*'),
                    week: defaultIfEmpty(values[5],'?'),
                    year: defaultIfEmpty(values[6],'')      // optional
                }
            }
            encodeCronExpression(cronExpression:any):string {
                return  defaultIfEmpty(cronExpression.second,' ')
                + ' ' + defaultIfEmpty(cronExpression.minute,' ')
                + ' ' + defaultIfEmpty(cronExpression.hour,' ')
                + ' ' + defaultIfEmpty(cronExpression.day,' ')
                + ' ' + defaultIfEmpty(cronExpression.month,' ')
                + ' ' + defaultIfEmpty(cronExpression.week,' ')
                + (isEmpty(cronExpression.year) ? '' : ' ' + cronExpression.year)  // optional
                ;
            }
            createSelectorDiv(title:string, options:Array<any>, value:string):HTMLDivElement {
                var selectorDiv = document.createElement('div');
                selectorDiv.classList.add('duice-ui-cronExpression__pickerDiv-bodyDiv-selectorDiv');
                var label = document.createElement('label');
                label.appendChild(document.createTextNode(title));
                selectorDiv.appendChild(label);
                var select = document.createElement('select');
                options.forEach(function(item){
                    var option = document.createElement('option');
                    option.value = item.value;
                    option.text = item.text;
                    select.appendChild(option);
                });
                select.value = value;
                select.addEventListener('change', function(event){
                    input.value = this.value;
                });
                selectorDiv.appendChild(select);
                var input = document.createElement('input');
                input.value = value;
                input.addEventListener('keyup', function(event){
                    select.value = this.value;
                });
                selectorDiv.appendChild(input);
                return selectorDiv;
            }
            closePicker():void {
                this.pickerDiv.remove();
                this.pickerDiv = null;
                window.removeEventListener('click', this.clickListener);
            }
        }
        
        /**
         * duice.ui.Image
         */
        export class Image extends UIComponent {
            img:HTMLImageElement;
            bindMap:duice.data.Map;
            bindName:string;
            input:HTMLInputElement;
            blank:string;
            limitSize:number = 1024 * 1024;
            constructor(img:HTMLImageElement) {
                super();
                this.img = img;
                this.img.classList.add('duice-ui-image');

            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;

            }
            build():void {
                var $this = this;
                this.input = document.createElement('input');
                this.input.setAttribute("type", "file");
                this.input.setAttribute("accept", "image/gif, image/jpeg, image/png");
                this.blank = this.img.src;
                
                // adds event listener for change
                this.img.addEventListener('click', function(e:any){
                    if($this.bindMap.isEnable() && $this.bindMap.isReadonly($this.bindName) == false){
                        $this.input.click();
                    }
                });
                this.input.addEventListener('change', function(e:any){
                    var fileReader = new FileReader();
                    if (this.files && this.files[0]) {
                        fileReader.addEventListener("load", function(e:any) {
                            var value = e.target.result;
                            var canvas = document.createElement("canvas");
                            var ctx = canvas.getContext("2d");
                            var image = document.createElement('img');
                            image.onload = function(){
                                ctx.drawImage(image, 0, 0);
                                value = canvas.toDataURL("image/png");
                                $this.bindMap.set($this.bindName, value);
                            };
                            image.src = value;
                        });
                        fileReader.readAsDataURL(this.files[0]);
                    }
                });
                
                // bind data
                this.bindMap.addObserver(this);
                this.img.addEventListener('error', function() {
                    console.log('error',this);
                });
                
                // update
                this.update(null);
            }
            update(observable:duice.data.DataObject):void {
                if(this.bindMap.get(this.bindName)) {
                    var src = this.bindMap.get(this.bindName);
                    this.img.src = src; 
                }else{
                    this.img.src = this.blank;
                }
                if(this.bindMap.isEnable() && this.bindMap.isReadonly(this.bindName) == false){
                    this.img.style.cursor = 'pointer';
                }else{
                    this.img.style.cursor = '';
                }
            }
        }
        
        /**
         * duice.ui.HtmlEditor
         */
        export class HtmlEditor extends UIComponent {
            div:HTMLDivElement;
            bindMap:duice.data.Map;
            bindName:string;
            toolBar:HTMLDivElement;
            content:HTMLDivElement;
            contentHtml:HTMLDivElement;
            contentText:HTMLTextAreaElement;
            mode:string = 'html';
            modeButton:HTMLButtonElement;
            constructor(div:HTMLDivElement) {
                super();
                this.div = div;
                this.div.classList.add('duice-ui-htmlEditor');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
            }
            build():void {
                var $this = this;
                
                // create tool bar
                this.toolBar = document.createElement('div');
                this.toolBar.classList.add('duice-ui-htmlEditor-toolBar');
                this.div.appendChild(this.toolBar);

                // font family
                var fontfamily = document.createElement('select');
                fontfamily.classList.add('duice-ui-htmlEditor-toolBar-fontfamily');
                var defaultFont = window.getComputedStyle(this.div,null).getPropertyValue('font-family');
                defaultFont = defaultFont.replace(/"/gi, '');
                var fonts = defaultFont.split(',');
                var additionalFonts = ['Arial','Arial Black','Times New Roman','Courier New','Impact'];
                for(var i = 0; i < additionalFonts.length; i ++ ) {
                    var font = additionalFonts[i];
                    if(fonts.indexOf(font) < 0) {
                        fonts.push(font);
                    }
                }
                for(var i = 0; i < fonts.length; i++){
                    var option = document.createElement('option');
                    option.value = fonts[i];
                    option.appendChild(document.createTextNode(fonts[i]));
                    fontfamily.appendChild(option);
                }
                fontfamily.addEventListener('change',function(){
                    document.execCommand('fontName', null, this.value);
                });
                this.toolBar.appendChild(fontfamily);
                
                // font size
                var fontsize = document.createElement('select');
                fontsize.classList.add('duice-ui-htmlEditor-toolBar-fontsize');
                for(var i = 1; i <= 7; i++){
                    var option = document.createElement('option');
                    option.value = String(i);
                    if(i == 3){
                        option.selected = true;     //  default font size
                    }
                    option.appendChild(document.createTextNode(String(i)));
                    fontsize.appendChild(option);
                }
                fontsize.addEventListener('change',function(){
                    document.execCommand('fontSize', null, this.value);
                });
                this.toolBar.appendChild(fontsize);

                // bold
                var bold = document.createElement('button');
                bold.title = 'Bold';
                bold.classList.add('duice-ui-htmlEditor-toolBar-bold');
                bold.addEventListener('click', function(){
                    document.execCommand('bold', null, null);
                });
                this.toolBar.appendChild(bold);
                
                // italic
                var italic = document.createElement('button');
                italic.title = 'Italic';
                italic.classList.add('duice-ui-htmlEditor-toolBar-italic');
                italic.addEventListener('click',function(){
                    document.execCommand('italic',null,null);
                });
                this.toolBar.appendChild(italic);
                
                // underline
                var underline = document.createElement('button');
                underline.title = 'Underline';
                underline.classList.add('duice-ui-htmlEditor-toolBar-underline');
                underline.addEventListener('click',function() {
                    document.execCommand('underline',null,null);
                });
                this.toolBar.appendChild(underline);

                // align left
                var alignleft = document.createElement('button');
                alignleft.title = 'Align Left';
                alignleft.classList.add('duice-ui-htmlEditor-toolBar-alignleft');
                alignleft.addEventListener('click',function() {
                    document.execCommand('justifyLeft',null,null);
                });
                this.toolBar.appendChild(alignleft);
                
                // align center
                var aligncenter = document.createElement('button');
                aligncenter.title = 'Align Center';
                aligncenter.classList.add('duice-ui-htmlEditor-toolBar-aligncenter');
                aligncenter.addEventListener('click',function() {
                    document.execCommand('justifyCenter',null,null);
                });
                this.toolBar.appendChild(aligncenter);
                
                // align right
                var alignright = document.createElement('button');
                alignright.title = 'Align Right';
                alignright.classList.add('duice-ui-htmlEditor-toolBar-alignright');
                alignright.addEventListener('click',function() {
                    document.execCommand('justifyRight',null,null);
                });
                this.toolBar.appendChild(alignright);
                
                // indent increase
                var indentincrease = document.createElement('button');
                indentincrease.title = 'Indent';
                indentincrease.classList.add('duice-ui-htmlEditor-toolBar-indentincrease');
                indentincrease.addEventListener('click',function() {
                    document.execCommand('indent',null,null);
                });
                this.toolBar.appendChild(indentincrease);
                
                // indent decrease
                var indentdecrease = document.createElement('button');
                indentdecrease.title = 'Outdent';
                indentdecrease.classList.add('duice-ui-htmlEditor-toolBar-indentdecrease');
                indentdecrease.addEventListener('click',function() {
                    document.execCommand('outdent',null,null);
                });
                this.toolBar.appendChild(indentdecrease);
                
                // list order
                var listorder = document.createElement('button');
                listorder.title = 'Orderd List';
                listorder.classList.add('duice-ui-htmlEditor-toolBar-listorder');
                listorder.addEventListener('click',function() {
                    document.execCommand('insertorderedlist',null,null);
                });
                this.toolBar.appendChild(listorder);
                
                // list unorder
                var listunorder = document.createElement('button');
                listunorder.title = 'Unorderd List';
                listunorder.classList.add('duice-ui-htmlEditor-toolBar-listunorder');
                listunorder.addEventListener('click',function() {
                    document.execCommand('insertUnorderedList',null,null);
                });
                this.toolBar.appendChild(listunorder);
                
                // mode
                var mode = document.createElement('button');
                mode.title = 'Change Mode';
                mode.classList.add('duice-ui-htmlEditor-toolBar-mode');
                var $this = this;
                mode.addEventListener('click', function() {
                    $this.toggleMode();
                });
                this.toolBar.appendChild(mode);
                this.modeButton = mode;
                
                // create content
                this.content = document.createElement('div');
                this.content.classList.add('duice-ui-htmlEditor-content');
                this.contentHtml = document.createElement('div');
                this.contentHtml.contentEditable = 'true';
                this.content.appendChild(this.contentHtml);
                this.contentText = document.createElement('textarea');
                this.contentText.style.display = 'none';
                this.content.appendChild(this.contentText);
                this.div.appendChild(this.content);

                // bind element
                this.bindMap.addObserver(this);
                this.contentHtml.addEventListener('DOMSubtreeModified', function(){
                    if($this.bindMap.get($this.bindName) !== this.innerHTML){
                        $this.bindMap.set($this.bindName, this.innerHTML);
                    }
                });
                this.contentText.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.value);
                });
                
                // update
                this.update(null);
            }
            update(observable:duice.data.DataObject):void {
                if(this.contentHtml.innerHTML !== this.bindMap.get(this.bindName)) {
                    this.contentHtml.innerHTML = this.bindMap.get(this.bindName);
                }
                if(this.contentText.value !== this.bindMap.get(this.bindName)){
                    this.contentText.value = this.bindMap.get(this.bindName);
                }
            }
            toggleMode():void {
                if(this.mode === 'html'){
                    this.mode = 'text';
                    this.contentHtml.style.display = 'none';
                    this.contentText.style.display = 'block';
                }else{
                    this.mode = 'html';
                    this.contentText.style.display = 'none';
                    this.contentHtml.style.display = 'block';
                }
                enableElement(this.toolBar, this.mode === 'html' ? true : false);
                this.modeButton.disabled = false;
            }
        }
        
        /**
         * duice.ui.MarkdownEditor
         */
        export class MarkdownEditor extends UIComponent {
            div:HTMLDivElement;
            bindMap:duice.data.Map;
            bindName:string;
            toolBar:HTMLDivElement;
            content:HTMLDivElement;
            contentMarkdown:HTMLTextAreaElement;
            contentHtml:HTMLDivElement;
            mode:string = 'markdown';
            modeButton:HTMLButtonElement;
            selectionStart:number;
            selectionEnd:number;
            constructor(div:HTMLDivElement){
                super();
                this.div = div;
                this.div.classList.add('duice-ui-markdownEditor');
            }
            setBind(map:duice.data.Map, name:string):void {
                this.bindMap = map;
                this.bindName = name;
            }
            build():void {
                var $this = this;
                
                // create tool bar
                this.toolBar = document.createElement('div');
                this.toolBar.classList.add('duice-ui-markdownEditor-toolBar');
                this.div.appendChild(this.toolBar);
                
                // header
                var header = document.createElement('button');
                header.title = 'Header';
                header.classList.add('duice-ui-markdownEditor-toolBar-header');
                header.addEventListener('click', function(event){
                    $this.insertMarkdown('#', '');
                });
                this.toolBar.appendChild(header);
                
                // bold
                var bold = document.createElement('button');
                bold.title = 'Bold';
                bold.classList.add('duice-ui-markdownEditor-toolBar-bold');
                bold.addEventListener('click', function(event){
                    $this.insertMarkdown('**', '**');
                });
                this.toolBar.appendChild(bold);
                
                // italic
                var italic = document.createElement('button');
                italic.title = 'Italic';
                italic.classList.add('duice-ui-markdownEditor-toolBar-italic');
                italic.addEventListener('click', function(){
                    $this.insertMarkdown('__', '__');
                });
                this.toolBar.appendChild(italic);
                
                // cancel
                var cancel = document.createElement('button');
                cancel.title = 'Cancel';
                cancel.classList.add('duice-ui-markdownEditor-toolBar-cancel');
                cancel.addEventListener('click', function(){
                    $this.insertMarkdown('~~', '~~');
                });
                this.toolBar.appendChild(cancel);
                
                // list order
                var listorder = document.createElement('button');
                listorder.title = 'Orderd List';
                listorder.classList.add('duice-ui-markdownEditor-toolBar-listorder');
                listorder.addEventListener('click',function() {
                    $this.insertMarkdown('* ', '');
                });
                this.toolBar.appendChild(listorder);
                
                // list unorder
                var listunorder = document.createElement('button');
                listunorder.title = 'Unorderd List';
                listunorder.classList.add('duice-ui-markdownEditor-toolBar-listunorder');
                listunorder.addEventListener('click',function() {
                    $this.insertMarkdown('1. ', '');
                });
                this.toolBar.appendChild(listunorder);
                
                // line
                var line = document.createElement('button');
                line.title = 'Line';
                line.classList.add('duice-ui-markdownEditor-toolBar-line');
                line.addEventListener('click',function() {
                    $this.insertMarkdown('==========', '');
                });
                this.toolBar.appendChild(line);
                
                // code
                var code = document.createElement('button');
                code.title = 'Code Block';
                code.classList.add('duice-ui-markdownEditor-toolBar-code');
                code.addEventListener('click',function() {
                    $this.insertMarkdown('\n```\n', '\n```\n');
                });
                this.toolBar.appendChild(code);
                
                // image
                var image = document.createElement('button');
                image.title = 'Image Link';
                image.classList.add('duice-ui-markdownEditor-toolBar-image');
                image.addEventListener('click',function() {
                    //
                    $this.insertMarkdown(' ![Alt text](', ') ');
                });
                this.toolBar.appendChild(image);
                
                // link
                var link = document.createElement('button');
                link.title = 'URL Link';
                link.classList.add('duice-ui-markdownEditor-toolBar-link');
                link.addEventListener('click',function() {
                    $this.insertMarkdown(' [Title](', ') ');
                });
                this.toolBar.appendChild(link);
                
                // mode
                var $this = this;
                var mode = document.createElement('button');
                mode.title = 'Change Mode';
                mode.classList.add('duice-ui-markdownEditor-toolBar-mode');
                mode.addEventListener('click', function(){
                    $this.toggleMode();
                });
                this.toolBar.appendChild(mode);
                this.modeButton = mode;
                
                // create content
                this.content = document.createElement('div');
                this.content.classList.add('duice-ui-markdownEditor-content');
                this.contentMarkdown = document.createElement('textarea');
                this.contentMarkdown.addEventListener('keydown', function(){
                    $this.selectionStart = this.selectionStart;
                    $this.selectionEnd = this.selectionEnd;
                });
                this.content.appendChild(this.contentMarkdown);
                this.contentHtml = document.createElement('div');
                this.contentHtml.style.whiteSpace = 'normal';
                this.contentHtml.style.display = 'none';
                this.content.appendChild(this.contentHtml);
                this.div.appendChild(this.content);
                
                // bind data object
                this.bindMap.addObserver(this);
                this.contentMarkdown.addEventListener('change', function(){
                    $this.bindMap.set($this.bindName, this.value);
                });
                
                // updates data
                this.update(null);
            }
            update(observable:duice.data.DataObject):void {
                if(this.contentMarkdown.value !== this.bindMap.get(this.bindName)){
                    this.contentMarkdown.value = this.bindMap.get(this.bindName);
                    this.contentMarkdown.setSelectionRange(this.selectionStart,this.selectionEnd);
                    this.contentHtml.innerHTML = parseMarkdown(this.bindMap.get(this.bindName));
                }
            }
            insertMarkdown(startTag:string, endTag:string) {
                var selectionStart = this.contentMarkdown.selectionStart;
                var selectionEnd = this.contentMarkdown.selectionEnd;
                var selectionLength = selectionEnd - selectionStart;
                var value  = this.contentMarkdown.value.substring(0, selectionStart)
                            + startTag
                            + this.contentMarkdown.value.substring(selectionStart, selectionEnd)
                            + endTag
                            + this.contentMarkdown.value.substring(selectionEnd);
                this.contentMarkdown.value = value;
                this.selectionStart = selectionStart + startTag.length;
                this.selectionEnd = selectionStart + startTag.length + selectionLength;
                this.contentMarkdown.setSelectionRange(this.selectionStart,this.selectionEnd);
                this.contentMarkdown.focus();
            }
            toggleMode():void {
                if(this.mode === 'markdown' ){
                    this.mode = 'html';
                    this.contentHtml.style.display = 'block';
                    this.contentMarkdown.style.display = 'none';
                }else{
                    this.mode = 'markdown';
                    this.contentMarkdown.style.display = 'block';
                    this.contentHtml.style.display = 'none';
                }
                enableElement(this.toolBar, this.mode === 'markdown' ? true : false);
                this.modeButton.disabled = false;
            }
        }

//        /**
//         * duice.ui.ListViewer
//         */
//        export class ListViewer extends __ {
//            ul:HTMLUListElement;
//            li:HTMLLIElement;
//            bindList:duice.data.List;
//            item:string;
//            rows:Array<HTMLLIElement> = new Array<HTMLLIElement>();
//            editable:boolean;
//            constructor(ul:HTMLUListElement){
//                super();
//                this.ul = ul;
//                this.ul.classList.add('duice-ui-listViewer');
//                var li = this.ul.querySelector('li');
//                this.li = <HTMLLIElement>li.cloneNode(true);
//                this.ul.innerHTML = '';
//            }
//            setBind(list:duice.data.List):void {
//                this.bindList = list;
//                this.bindList.addObserver(this);   
//            }
//            setItem(item:string):void {
//                this.item = item;
//            }
//            setEditable(editable:boolean):void {
//                this.editable = editable;
//            }
//            update():void {
//                var $this = this;
//                
//                // remove previous rows
//                for(var i = 0; i < this.rows.length; i ++ ) {
//                    this.ul.removeChild(this.rows[i]);
//                }
//                this.rows.length = 0;
//                
//                // creates new rows
//                for(var index = 0; index < this.bindList.getRowCount(); index ++ ) {
//                    var map = this.bindList.getRow(index);
//                    var row = this.createRow(index,map);
//                    this.ul.appendChild(row);
//                    this.rows.push(row);
//                }
//            }
//            createRow(index:number, bindMap:duice.data.Map):HTMLLIElement {
//                var $this = this;
//                var row:HTMLLIElement = <HTMLLIElement>this.li.cloneNode(true);
//                var $context:any = new Object;
//                $context['index'] = index;
//                $context[this.item] = bindMap;
//                row = this.executeExpression(<HTMLElement>row, $context);
//                initialize(row,$context);
//                return row;
//            }
//        }
        
        /**
         * duice.ui.TableViewer
         */
        export class TableViewer extends UIComponent {
            table:HTMLTableElement;
            thead:HTMLTableSectionElement;
            tbody:HTMLTableSectionElement;
            bindList:duice.data.List;
            item:string;
            rows:Array<HTMLTableSectionElement> = new Array<HTMLTableSectionElement>();
            editable:boolean;
            constructor(table:HTMLTableElement) {
                super();
                this.table = table;
                this.table.classList.add('duice-ui-tableViewer');
                this.thead = <HTMLTableSectionElement>this.table.querySelector('thead');
                var tbody = this.table.querySelector('tbody');
                this.tbody = <HTMLTableSectionElement>tbody.cloneNode(true);
                this.table.removeChild(tbody);
            }
            setBind(list:duice.data.List):void {
                this.bindList = list;
            }
            setItem(item:string):void {
                this.item = item;
            }
            setEditable(editable:boolean):void {
                this.editable = editable;
            }
            build():void {
                this.bindList.addObserver(this);
                this.update();
            }
            update():void {
                var $this = this;
                
                // remove previous rows
                for(var i = 0; i < this.rows.length; i ++ ) {
                    this.table.removeChild(this.rows[i]);
                }
                this.rows.length = 0;
                
                // creates new rows
                for(var index = 0; index < this.bindList.getRowCount(); index ++ ) {
                    var map = this.bindList.getRow(index);
                    var row = this.createRow(index,map);
                    this.table.appendChild(row);
                    this.rows.push(row);
                }
                
                // not found row
                if(this.bindList.getRowCount() < 1) {
                    var emptyRow = this.createEmptyRow();
                    this.table.appendChild(emptyRow);
                    this.rows.push(emptyRow);
                }
            }
            createRow(index:number, bindMap:duice.data.Map):HTMLTableSectionElement {
                var $this = this;
                var row:HTMLTableSectionElement = <HTMLTableSectionElement>this.tbody.cloneNode(true);
                var $context:any = new Object;
                $context['index'] = index;
                $context[this.item] = bindMap;
                row = executeExpression(<HTMLElement>row, $context);
                initialize(row,$context);
                
                // select index
                if(index == this.bindList.index){
                    row.classList.add('duice-ui-tableViewer-index');
                }
                row.addEventListener('mousedown', function(event){
                    for(var i = 0; i < $this.rows.length; i ++ ) {
                        $this.rows[i].classList.remove('duice-ui-tableViewer-index');
                    }
                    row.classList.add('duice-ui-tableViewer-index');
                    $this.bindList.index = index;
                });
                
                // drag and drop event
                if(this.editable === true) {
                    row.setAttribute('draggable', 'true');
                    row.addEventListener('dragstart', function(event){
                        console.log('dragstart',index);
                        event.dataTransfer.setData("index", String(index));
                    });
                    row.addEventListener('dragover', function(event){
                        event.preventDefault();
                        console.log('dragover');
                    });
                    row.addEventListener('drop', function(event){
                        event.preventDefault();
                        var fromIndex = parseInt(event.dataTransfer.getData('index'));
                        var toIndex = index;
                        $this.bindList.moveRow(fromIndex, toIndex);
                        $this.bindList.index = toIndex;
                        row.click();
                    });
                }
                
                // return
                return row;
            }
            createEmptyRow():HTMLTableSectionElement {
                var emptyRow:HTMLTableSectionElement = <HTMLTableSectionElement>this.tbody.cloneNode(true);
                removeChildNodes(emptyRow);
                emptyRow.classList.add('duice-ui-tableViewer-empty')
                var tr = document.createElement('tr');
                var td = document.createElement('td');
                var colspan = this.tbody.querySelectorAll('tr > td').length;
                td.setAttribute('colspan',String(colspan));
                var emptyMessage = document.createElement('div');
                emptyMessage.classList.add('duice-ui-tableViewer-empty-message');
                td.appendChild(emptyMessage);
                tr.appendChild(td);
                emptyRow.appendChild(tr);
                return emptyRow;
            }
        }
//        
//        /**
//         * duice.ui.TreeViewer
//         */
//        export class TreeViewer extends __ {
//            setBind(list:duice.data.List):void {
//            }
//            update():void {
//            }
//        }
    }

}

//DOMContentLoaded event process
document.addEventListener("DOMContentLoaded", function(event) {
    var $context:any = typeof self !== 'undefined' ? self : 
                        typeof window !== 'undefined' ? window :
                        {};
    duice.initialize(document, $context);
});



