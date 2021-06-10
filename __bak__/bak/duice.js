// =============================================================================
// DUICE (Javascript UI Component Engine)
// - Anyone can use it freely.
// - Modify the source or allow re-creation. However, you must state that you have the original creator.
// - However, we can not grant patents or licenses for reproductives. (Modifications or reproductions must be shared with the public.)
// Licence: LGPL(GNU Lesser General Public License version 3)
// Copyright (C) 2017 duice.oopscraft.net
// =============================================================================
"use strict";
if(!console.debug){
	console.debug = console.log;
}

/**
 * duice component package package.
 * @namespace
 * @startuml duice.png
   scale 900 width
   skinparam handwritten true 
   skinparam monochrome true
   skinparam ParticipantPadding 30
   skinparam classFontSize 8
   skinparam sequenceArrowThickness 1
   skinparam sequenceMessageAlign center
   skinparam roundcorner 3
   skinparam maxmessagesize 100
   hide footbox
   
   title 
    DUICE(Data-orientied javascript UI Component Engine)
   end title
   
   actor "User" as user
   participant "<b>HTML + Javascript</b>\n(data-duice-* Attributes)" as ui
   box #eee
    participant "**DUICE**(duice.*)\nduice.js" as duice  #LightBlue 
    participant "**Virtual UI Component**(duice.ui.*)\nText,TextField,...,Grid,TreeView..." as duice.ui #LightBlue 
    participant "**Data Structure**(duice.data.*)\nMap,List,Data..." as duice.data #LightBlue 
   end box
   
   == on document loading ==
   ui --> duice.data : create data object
   activate duice.data
   ui --> duice : fires OnLoadCompelte event
   activate duice
   duice --> ui: reads data-duice* attributes
   duice --> duice.ui : creates UI component
   activate duice.ui
   duice.ui --> ui : apply to HTML element
   
   == on user change html page ==
   user -> ui: changes html element
   ui--> duice.ui : fires event
   duice.ui --> duice.data : changes data
   
   == on data is changed by script ==
   duice--> duice.data : change data
   duice.data --> duice.ui : update
   duice.ui --> ui: change html element
 * @enduml
 */
var duice = {};

/**
 * initialize duice component
 * @method
 * @param {HTMLElement} - container
 * @param {Object} - context
 */
duice.initialize = function(container, $context) {
	
	// getObject
	function getObject($context, name) {
		try {
			var obj = eval("$context." + name);
			if(!obj) {
				obj = eval(name);
			}
			return obj;
		}catch(e){
			console.error(e,$context, name);
			throw e;
		}
	};
	
	// creates ListView 
	var listViewElements = container.querySelectorAll('ul[data-duice="ListView"]');
	for(var i = 0; i < listViewElements.length; i++ ) {
		try {
			var element = listViewElements[i];
			var listView = new duice.ui.ListView(element);
			var bind = element.dataset.duiceBind;
			var list = getObject($context,bind);
			listView.bind(list);
			listView.setItem(element.dataset.duiceItem);
			listView.update();
			var id = duice.util.RandomUtils.generateUUID();
			element.dataset.duice += id;
		}catch(e){
			console.error(e,listViewElements[i]);
			throw e;
		}
	}

	// creates TreeView 
	var treeViewElements = container.querySelectorAll('ul[data-duice="TreeView"]');
	for(var i = 0; i < treeViewElements.length; i++ ) {
		try {
			var element = treeViewElements[i];
			var treeView = new duice.ui.TreeView(element);
			var bind = element.dataset.duiceBind;
			var list = getObject($context,bind);
			treeView.bind(list);
			treeView.setItem(element.dataset.duiceItem);
			element.dataset.duiceEditable && treeView.setEditable(eval(element.dataset.duiceEditable));
			treeView.update();
			var id = duice.util.RandomUtils.generateUUID();
			element.dataset.duice += id;
		}catch(e){
			console.error(e,treeViewElements[i]);
			throw e;
		}
	}
	
	// creates Grid
	var gridElements = container.querySelectorAll('table[data-duice="Grid"]');
	for(var i = 0; i < gridElements.length; i++ ) {
		try {
			var element = gridElements[i];
			var grid = new duice.ui.Grid(element);
			var bind = element.dataset.duiceBind;
			var list = getObject($context,bind);
			grid.bind(list);
			grid.setItem(element.dataset.duiceItem);
			element.dataset.duiceEditable && grid.setEditable(eval(element.dataset.duiceEditable));
			element.dataset.duiceFilter && grid.setFilter(eval(element.dataset.duiceFilter));
			grid.update();
			var id = duice.util.RandomUtils.generateUUID();
			element.dataset.duice += id;
		}catch(e){
			console.error(e,gridElements[i]);
			throw e;
		}
	}
	
	// creates Flow
	var flowElements = container.querySelectorAll('ul[data-duice="Flow"]');
	for(var i = 0; i < flowElements.length; i++ ) {
		try {
			var element = flowElements[i];
			var flow = new duice.ui.Flow(element);
			var bind = element.dataset.duiceBind.split(',');
			var nodeList = getObject($context,bind[0]);
			var linkList = getObject($context,bind[1]);
			flow.bind(nodeList,linkList);
			flow.setItem(element.dataset.duiceItem);
			flow.setNodeId(element.dataset.duiceNodeId);
			flow.setNodeX(element.dataset.duiceNodeX);
			flow.setNodeY(element.dataset.duiceNodeY);
			flow.setLinkFrom(element.dataset.duiceLinkFrom);
			flow.setLinkTo(element.dataset.duiceLinkTo);
			element.dataset.duiceLinkText && flow.setLinkText(element.dataset.duiceLinkText);
			flow.update();
			var id = duice.util.RandomUtils.generateUUID();
			element.dataset.duice = +id;
		}catch(e){
			console.error(e,flowElements[i]);
			throw e;
		}
	}

	// creates Pagination
	var paginationElements = container.querySelectorAll('ul[data-duice="Pagination"]');
	for(var i = 0; i < paginationElements.length; i++ ) {
		try {
			var element = paginationElements[i];
			var pagination = new duice.ui.Pagination(element);
			pagination.bind(getObject($context,element.dataset.duiceBind));
			pagination.setRows(element.dataset.duiceRows);
			pagination.setPage(element.dataset.duicePage);
			pagination.setTotalCount(element.dataset.duiceTotalCount);
			pagination.setPageSize(element.dataset.duicePageSize);
			pagination.update();
			var id = duice.util.RandomUtils.generateUUID();
			element.dataset.duice += id;
		}catch(e){
			console.error(e,paginationElements[i]);
			throw e;
		}
	}
		
	// creates unit elements
	var elementTags = [
		 'span[data-duice="Text"]'
		,'input[data-duice="TextField"]'
		,'select[data-duice="ComboBox"]'
		,'input[data-duice="CheckBox"]'
		,'input[data-duice="Radio"]'
		,'div[data-duice="TextView"]'
		,'textarea[data-duice="TextArea"]'
		,'div[data-duice="HtmlEditor"]'
		,'input[data-duice="CronExpression"]'
		,'img[data-duice="Image"]'
	];
	var elements = container.querySelectorAll(elementTags.join(','));
	for(var i = 0; i < elements.length; i ++ ) {
		try {
			var element = elements[i];
			var type = element.dataset.duice;
			var bind = element.dataset.duiceBind.split('.');
			var name = bind.pop();
			var map = getObject($context,bind.join('.'));
			var id = duice.util.RandomUtils.generateUUID();
			switch(type) {
				case 'Text':
					var text = new duice.ui.Text(element);
					var format = element.dataset.duiceFormat;
					format && text.setFormat(format);
					text.bind(map,name);
					text.update();
				break;
				case 'TextField':
					var textField = new duice.ui.TextField(element);
					textField.bind(map,name);
					textField.update();
				break;
				case 'ComboBox':
					var comboBox = new duice.ui.ComboBox(element);
					var options = element.dataset.duiceOptions;
					var optionValue = element.dataset.duiceOptionValue;
					var optionText = element.dataset.duiceOptionText;
					comboBox.bind(map, name);
					comboBox.setOptions(getObject($context,options));
					optionValue && comboBox.setOptionValue(optionValue);
					optionText && comboBox.setOptionText(optionText);
					comboBox.update();
				break;
				case 'CheckBox':
					var checkBox = new duice.ui.CheckBox(element);
					checkBox.bind(map, name);
					checkBox.update();
				break;
				case 'Radio':
					var radio = new duice.ui.Radio(element);
					radio.bind(map, name);
					radio.update();
				break;
				case 'TextView':
					var textView = new duice.ui.TextView(element);
					var format = element.dataset.duiceFormat;
					format && textView.setFormat(format);	
					textView.bind(map,name);
					textView.update();
				break;
				case 'TextArea':
					var textArea = new duice.ui.TextArea(element);
					textArea.bind(map, name);
					textArea.update();
				break;
				case 'HtmlEditor':
					var htmlEditor = new duice.ui.HtmlEditor(element);
					htmlEditor.bind(map, name);
					htmlEditor.update();
				break;
				case 'CronExpression':
					var cronExpression = new duice.ui.CronExpression(element);
					cronExpression.bind(map, name);
					cronExpression.update();				
				break;
				case 'Image':
					var thumbnail = new duice.ui.Image(element);
					var width = element.dataset.duiceWidth;
					var height = element.dataset.duiceHeight;
					thumbnail.bind(map, name);
					thumbnail.setWidth(width);
					thumbnail.setHeight(height);
					thumbnail.update();
				break;
			}
			element.dataset.duice += id;
		}catch(e){
			console.error(e, elements[i]);
			throw e;
		}
	}
}

/**
 * data structure package
 * @namespace
 */
duice.data = {};

/**
 * Super prototype of duice.data
 * @abstract
 * @protected
 * @constructor
 */
duice.data.__ = function(){
	this.observers = new Array();
	this.fireEvent = true;
}
/**
 * Adds observer
 * @method
 * @protected
 * @param {Object} observer for adding
 * @return {void}
 */
duice.data.__.prototype.addObserver = function(observer){
	for(var i = 0, size=this.observers.length; i < size; i++){
		if(this.observers[i] === observer){
			return;
		}
	}
	this.observers.push(observer);
}
/**
 * Notifies all observer
 * @method
 * @protected
 * @param {Object} caller observer
 * @return {void}
 */
duice.data.__.prototype.notifyObservers = function(observer) {
	if(this.fireEvent = false){
		return;
	}
	for(var i = 0, size = this.observers.length; i < size; i++){
		if(this.observers[i] === observer){
			continue;
		}
		this.observers[i].update();
	}
}
/**
 * Updates
 * @method
 * @protected
 * @return {void}
 */
duice.data.__.prototype.update = function() {
	if(this.fireEvent == true){
		this.notifyObservers(this);
	}
}
/**
 * Sets fireEvent flag
 * @method
 * @protected
 * @param {boolean} fire event or not
 * @return {void}
 */
duice.data.__.prototype.setFireEvent = function(fireEvent) {
	this.fireEvent = fireEvent;
	if(fireEvent == true){
		this.notifyObservers(this);
	}
}

// Prevents prototype changed.
Object.freeze(duice.data.__.prototype);

/**
 * Map data structure
 * @class
 * @classdesc
 * Key-Value Map data structure.
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/486o0ewf/embedded/js,html,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {Object} JSON data
 */
duice.data.Map = function(json) {
	duice.data.__.call(this);
	this.data = {};
	this.listener = {};
	this.parentNode = null;
	this.childNodes = new Array();
	if(json) {
		this.fromJson(json);
	}
	this.enable = true;
	this.readonly = {};
}
duice.data.Map.prototype = Object.create(duice.data.__.prototype);

/**
 * Creates data from JSON object
 * @method
 * @param {Object} JSON data
 */
duice.data.Map.prototype.fromJson = function(json) {
	this.data = {};
	for(var name in json){
		var value = json[name];
		this.data[name] = value;
	}
	this.notifyObservers();
}

/**
 * Convert map to JSON object
 * @method
 * @return {Object} JSON data
 */
duice.data.Map.prototype.toJson = function() {
	var json = {};
	for(var name in this.data){
		var value = this.data[name];
		json[name] = value;
	}
	return json;
}

/**
 * Sets value by name
 * @method
 * @param {String} name - map key name
 * @param {String} value - map value for setting
 */
duice.data.Map.prototype.set = function(name,value) {
	if(this.listener.beforeChange){
		if(this.listener.beforeChange.call(this,{name:name, value:value}) == false){
			this.notifyObservers();
			return false;
		}
	}
	this.data[name] = value;
	if(this.listener.afterChange){
		this.listener.afterChange.call(this,{name:name, value:this.get(name)});
	}
	this.notifyObservers();
}

/**
 * Gets specified name's value.
 * @method
 * @param {String} name - key name
 * @return {String} value - map value
 */ 
duice.data.Map.prototype.get = function(name){
	return this.data[name];
}

/**
 * Gets column names
 * @method
 * @return {Array} names of columns as string array.
 */
duice.data.Map.prototype.getNames = function() {
	var names = new Array();
	for(var name in this.data){
		names.push(name);
	}
	return names;
}

/**
 * Gets parent node for tree map
 * @method
 * @protected
 * @return {duice.data.Map} parent node.
 */
duice.data.Map.prototype.getParentNode = function(){
	return this.parentNode;
}

/**
 * Gets child node list
 * @method
 * @protected
 * @return {Array(duice.data.Map)} child node array.
 */
duice.data.Map.prototype.getChildNodes = function(){
	return this.childNodes;
}

/**
 * Returns specified child node
 * @method
 * @protected
 * @param {number} index - index number of child node array.
 * @return {duice.data.Map} specified indexed node
 */
duice.data.Map.prototype.getChildNode = function(index){
	return this.childNodes[index];
}

/**
 * Adds node into child nodes
 * @method
 * @protected
 * @param {duice.data.Map} map - duice.data.Map Object to insert into child nodes.
 */
duice.data.Map.prototype.addChildNode = function(map){
	map.parentNode = this;
	this.childNodes.push(map);
	map.addObserver(this);
}

/**
 * Inserts child node into specified child index.
 * @method
 * @protected
 * @param {number} index - inserting index position in child node array.
 * @param {juicd.data.Map} map - child node object to insert.
 */
duice.data.Map.prototype.insertChildNode = function(index,map){
	map.parentNode = this;
	this.childNodes.splice(index,0,map);
	map.addObserver(this);
}

/**
 * Remove specified child node
 * @method
 * @protected
 * @param {number} index - child array index to remove.
 */
duice.data.Map.prototype.removeChildNode = function(index){
	this.childNodes.splice(index,1);
}

/**
 * Enables data changes.
 * if set true, can changes data values. default is true.
 * @method
 * @param {boolean} enable or not
 */
duice.data.Map.prototype.setEnable = function(enable){
	this.enable = enable;
	this.notifyObservers();
}

/**
 * Gets data change is enable or not
 * @method
 * @return {boolean} change of data is enable or not
 */
duice.data.Map.prototype.isEnable = function() {
	return this.enable;
}

/**
 * Sets specified column is read-only or not/
 * If read-only value is true, specified column data is disabled in bind UI component.
 * Default is false.
 * @method
 * @param {string} name - Name of the column to disable.
 * @param {string} readonly - Whether or not to use
 */
duice.data.Map.prototype.setReadonly = function(name, readonly){
	this.readonly[name] = readonly;
	this.notifyObservers();
}

/**
 * Returns whether the column is read-only
 * @method
 * @param {string} name - column name to check.
 * @Return {boolean} whether the column is read-only 
 */
duice.data.Map.prototype.isReadonly = function(name){
	return this.readonly[name] || false;
}

/**
 * Defines before change event listener
 * @method
 * @param {function} listener - Event listener function before data change
 */
duice.data.Map.prototype.beforeChange = function(listener){
	this.listener.beforeChange = listener;
}

/**
 * Defines after change event listener
 * @method
 * @param {function} listener - Event listener function after data change
 */
duice.data.Map.prototype.afterChange = function(listener){
	this.listener.afterChange = listener;
}

//Prevents prototype changed.
Object.freeze(duice.data.Map.prototype);

/**
 * List data structure
 * @class
 * @classdesc
 * List data structure.
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/6snkq5dw/embedded/js,html,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {Object[]} jsonArray - JSON Array data
 */
duice.data.List = function(jsonArray) {
	duice.data.__.call(this);
	this.mapList = new Array();
	this.index = -1;
	this.enable = true;
	this.readonly = {};
	if(jsonArray) {
		this.fromJson(jsonArray);
	}
}
duice.data.List.prototype = Object.create(duice.data.__.prototype);

/**
 * Sets data from JSON Array 
 * @method
 * @param {Object[]} jsonArray - JSON Array data
 */
duice.data.List.prototype.fromJson = function(jsonArray){
	this.mapList = new Array();
	for(var i = 0; i < jsonArray.length; i ++ ) {
		var map = new duice.data.Map();
		map.fromJson(jsonArray[i]);
		map.enable = this.enable;
		map.readonly = this.readonly;
		map.addObserver(this);
		this.mapList.push(map);
	}
	this.index = -1;
	this.notifyObservers();
}

/**
 * Converts to JSON object
 * @method
 * @return {Object[]} JSON Array
 */
duice.data.List.prototype.toJson = function() {
	var json = new Array();
	for(var i = 0; i < this.mapList.length; i ++){
		json.push(this.mapList[i].toJson());
	}
	return json;
}

/**
 * Sets current index
 * @method
 * @param {number[]} index - current positioned index
 */
duice.data.List.prototype.setIndex = function(index) {
	this.index = index;
	this.notifyObservers();
}

/**
 * Gets current select row index 
 * @method
 * @return {number[]} current positioned index.
 */
duice.data.List.prototype.getIndex = function() {
	return this.index;
}
// clear current select row index 
duice.data.List.prototype.clearIndex = function() {
	this.index = -1;
	this.notifyObservers();
}
// returns current row count
duice.data.List.prototype.getRowCount = function() {
	return this.mapList.length;
}
// returns specified row
duice.data.List.prototype.getRow = function(index) {
	return this.mapList[index];
}
// adds new row map into list
duice.data.List.prototype.addRow = function(map){
	map.addObserver(this);
	this.mapList.push(map);
	this.index = this.getRowCount();
	this.notifyObservers();
}
/**
 * Adds all rows
 * @Param {duice.data.List}
 * @Return {void}
 */
duice.data.List.prototype.addRows = function(list){
	for(var i = 0, size = list.getRowCount(); i < size; i ++){
		var map = list.getRow(i);
		this.addRow(map);
	}
	this.notifyObservers();
}
// moves from row into to row
duice.data.List.prototype.moveRow = function(from, to) {
	this.index = from;
	this.mapList.splice(to, 0, this.mapList.splice(from, 1)[0]);
	this.index = to;
	this.notifyObservers();
}
// insert row map into specified position 
duice.data.List.prototype.insertRow = function(index, map){
	map.addObserver(this);
	this.mapList.splice(index, 0, map);
	this.index = index;
	this.notifyObservers();
}
// removes specified row map
duice.data.List.prototype.removeRow = function(index){
	this.mapList.splice(index, 1);
	this.notifyObservers();
}
/**
 * Loop forEach function
 */
duice.data.List.prototype.forEach = function(handler) {
	this.setFireEvent(false);
	for(var i = 0, size = this.mapList.length; i < size; i ++){
		handler.call(this, this.mapList[i]);
	}
	this.setFireEvent(true);
}
/**
 * Finds first index by handler
 * @Param {function}	handler - searching handler function
 * @Return {Number}	-  first index of searching
 */
duice.data.List.prototype.indexOf = function(handler){
	for(var i = 0, size = this.mapList.length; i < size; i ++){
		if(handler.call(this, this.mapList[i]) == true){
			return i;
		}
	}
	return -1;
}
/**
 * Finds indexes by handler
 * @Param {function} handler - handler function for searching.
 * @return {Array} - founded indexes array.
 */
duice.data.List.prototype.findIndexes = function(handler){
	var indexes = [];
	for(var i = 0, size = this.mapList.length; i < size; i ++){
		if(handler.call(this, this.mapList[i]) == true){
			indexes.push(i);
		}
	}
	return indexes;
}
/**
 * Checks contains by handler
 * @Param {function} handler
 * @Return {Boolean}
 */
duice.data.List.prototype.contains = function(handler){
	var index = this.indexOf(handler);
	return (index > -1);
}
/**
 * Finds row with handler
 * @Param {function} handler
 * @Return {duice.data.Map}
 */
duice.data.List.prototype.findRow = function(handler) {
	var index = this.indexOf(handler);
	return this.getRow(index);
}
/**
 * Finds rows with handler
 * @Param {function} handler
 * @Return {Array<duice.data.Map>}
 */
duice.data.List.prototype.findRows = function(handler) {
	var indexes = this.findIndexes(handler);
	var rows = new Array();
	for(var i = 0, size = indexes.length; i < size; i ++){
		var node = this.getRow(indexes[i]);
		rows.push(node);
	}
	return rows;
}
duice.data.List.prototype.setEnable = function(enable){
	this.enable = enable;
	this.mapList.forEach(function(element){
		element.setEnable(enable);
	})
	this.notifyObservers();
}
duice.data.List.prototype.isEnable = function(){
	return this.enable;
}
/* beforeChange */
duice.data.List.prototype.beforeChange = function(beforeChangeListener){
	// TODO
}
/* afterChange */
duice.data.List.prototype.afterChange = function(afterChangeListener){
	// TODO
}

/**
 * duice.data.Tree prototype
 * @class
 * @classdesc
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/v9cx57hz/embedded/js,html,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {Array<Object>} jsonArray - JSON Array data has tree nodes.
 * @param {string} childNodeName - name of child node elements.
 */
duice.data.Tree = function(jsonArray,childNodeName) {
	duice.data.__.call(this);
	this.index = [];
	this.rootNode = new duice.data.Map();
	this.enable = true;
	this.readonly = {};
	if(jsonArray) {
		this.fromJson(jsonArray,childNodeName);
	}
}

// Extends data prototype
duice.data.Tree.prototype = Object.create(duice.data.__.prototype);

/**
 * Loads data from JSON Array 
 * @method
 * @param {Array<Object>} jsonArray - JSON Array data has tree nodes.
 * @param {string} childNodeName - name of child node elements.
 */
duice.data.Tree.prototype.fromJson = function(jsonArray,childNodeName){
	var $this = this;
	this.rootNode = new duice.data.Map();
	this.rootNode.addObserver(this);
	for(var i = 0; i < jsonArray.length; i ++){
		var node = new duice.data.Map();
		node.fromJson(jsonArray[i]);
		node.enable = this.enable;
		node.readonly = this.readonly;
		makeTree(node);
		this.rootNode.addChildNode(node);
	}
	function makeTree(node) {
		var childNodes = node.get(childNodeName);
		if(childNodes){
			for(var i = 0; i < childNodes.length; i ++){
				var childNode = new duice.data.Map();
				childNode.fromJson(childNodes[i]);
				childNode.enable = node.enable;
				childNode.readonly = node.readonly;
				makeTree(childNode);
				node.addChildNode(childNode);
			}
		}
	}
	this.index = [];
	this.notifyObservers();
}

/**
 * Converts into JSON Array 
 * @method
 * @param {string} childNodeName
 * @return {Array<Object>} returns converted tree object array.
 */
duice.data.Tree.prototype.toJson = function(childNodeName){
	var json = new Array();
	var childNodes = this.rootNode.getChildNodes();
	for(var i = 0; i < childNodes.length; i ++){
		var childNode = childNodes[i];
		var childJson = makeJson(childNode);
		json.push(childJson);
	}
	function makeJson(node) {
		var json = node.toJson();
		var childNodes = node.getChildNodes();
		if(childNodes){
			json[childNodeName] = new Array();
			for(var i = 0; i < childNodes.length; i ++){
				var childNode = childNodes[i];
				var childJson = makeJson(childNode);
				json[childNodeName].push(childJson);
			}
		}
		return json;
	}
	return json;
}

/**
 * Sets index 
 * @method
 * @param {Array<number>} index - index array to set. ex)[0,1],[0,2]...
 */
duice.data.Tree.prototype.setIndex = function(index) {
	this.index = index;
	this.notifyObservers();
}

/**
 * Gets current select row index 
 * @method
 * @return {Array<number>} returns current index array ex) [0,1],[0,2]...
 */
duice.data.Tree.prototype.getIndex = function() {
	return this.index;
}

/**
 * Clears current select row index 
 * @method
 */
duice.data.Tree.prototype.clearIndex = function() {
	this.index = [];
	this.notifyObservers();
}

/**
 * Gets rootNode 
 * @method
 * @return {Object} returns root node.
 */
duice.data.Tree.prototype.getRootNode = function() {
	return this.rootNode;
}

/**
 * Gets tree node specified.
 * @method
 * @param {Array<number>} index - index array of node to get
 * @return {duice.data.Map} return specifed index node.
 */
duice.data.Tree.prototype.getNode = function(index){
	var node = this.rootNode;
	for(var i = 0; i < index.length; i ++){
		var childNodes = node.getChildNodes();
		node = childNodes[index[i]];
	}
	return node;
}

/**
 * Removes specifed node.
 * @method
 * @param {Array<number>} index - index array to remove.
 */
duice.data.Tree.prototype.removeNode = function(index){
	var node = this.getNode(index);
	var parentNode = node.getParentNode();
	parentNode.removeChildNode(index[index.length-1]);
	this.index = -1;
	this.notifyObservers();
}

/**
 * Adds new child node
 * @method
 * @param {number} parentIndex - parent index to add
 * @param {duice.data.Map} map - node map to insert
 */
duice.data.Tree.prototype.addChildNode = function(parentIndex, map){
	var parentNode = this.getNode(parentIndex);
	parentNode.addChildNode(map);
	this.index = parentIndex;
	this.index.push(parentNode.getChildNodes().length-1);
	this.notifyObservers();
}

/**
 * Moves node from index1 to index2
 * @method
 * @param {Array<number>} fromIndex - node index array to move
 * @param {Array<number>} toIndex - target index array to move
 */
duice.data.Tree.prototype.moveNode = function(fromIndex, toIndex){
	var fromNode = this.getNode(fromIndex);
	var toNode = this.getNode(toIndex);
	
	//remove
	var fromParentNode = fromNode.getParentNode();
	fromParentNode.removeChildNode(fromIndex[fromIndex.length-1]);
	
	// insert
	var toParentNode = toNode.getParentNode();
	toParentNode.insertChildNode(toIndex[toIndex.length-1],fromNode);
	
	// notify 
	this.index = toIndex;
	this.notifyObservers();
}

/**
 * Loop forEach
 * @method
 * @param {function} handler
 */
duice.data.Tree.prototype.forEach = function(handler) {
	this.setFireEvent(false);
	findChild(this.rootNode);
	var $this = this;
	function findChild(node) {
		var childNodes = node.getChildNodes();
		for(var i = 0, size = childNodes.length; i < size; i ++){
			var childNode = childNodes[i];
			handler.call($this,childNode);
			findChild(childNode);
		}
	}
	this.setFireEvent(true);
}

/**
 * Finds indexes by handler
 * @method
 * @param {function} handler
 * @return {Array<Array<number>>} - result of finding as array containing index.
 */
duice.data.Tree.prototype.findIndexes = function(handler){
	var indexes = [];
	var depth = -1;
	var cursor = [];
	findChild(this.rootNode);
	var $this = this;
	function findChild(node) {
		depth ++;
		cursor.push(-1);
		var childNodes = node.getChildNodes();
		for(var i = 0, size = childNodes.length; i < size; i ++){
			var childNode = childNodes[i];
			cursor[depth] = i;
			if(handler.call($this,childNode) == true){
				indexes.push(JSON.parse(JSON.stringify(cursor)));
			}
			findChild(childNode);
		}
		depth --;
		cursor.pop();
	}
	return indexes;
}

/**
 * Find first index by handler
 * @param {function} handler - function(node){...}
 * @return {Array<number>} - result of finding result index
 */
duice.data.Tree.prototype.indexOf = function(handler){
	var indexes = this.findIndexes(handler);
	if(indexes.length > 0){
		return indexes[0];
	}else{
		return [];
	}
}

/**
 * Checks contains node by handler
 * @param {function} handler - function(node){...}
 * @return {boolean} returns matching node is exists.
 */
duice.data.Tree.prototype.contains = function(handler) {
	var indexes = this.findIndexes(handler);
	return (indexes.length > 0);
}

/**
 * Find node
 * @param {function} handler - function(node){...}
 * @return {duice.data.Map} returns matched node with handler function
 */
duice.data.Tree.prototype.findNode = function(handler) {
	var index = this.indexOf(handler);
	return this.getNode(index);
}

/**
 * Finds nodes
 * @param {function} handler - function(node){...}
 * @return {Array<duice.data.Map>} returns mated node map array
 */
duice.data.Tree.prototype.findNodes = function(handler){
	var indexes = this.findIndexes(handler);
	var nodes = new Array();
	for(var i = 0, size = indexes.length; i < size; i ++){
		var node = this.getNode(indexes[i]);
		nodes.push(node);
	}
	return nodes;
}

/**
 * Sets enable flag
 * @param {boolean} enable - whether enable or nott
 */
duice.data.Tree.prototype.setEnable = function(enable){
	this.enable = enable;
	this.forEach(function(node){
		node.setEnable(enable);
	});
	this.notifyObservers();
}

/**
 * Gets enable flag
 * @return {boolean} returns whether enable or not.
 */
duice.data.Tree.prototype.isEnable = function(){
	return this.enable;
}

/**
 * Sets read only in child node by name
 * @param {string} name - column name
 * @param {boolean} readonly - read-only or not flag
 */
duice.data.Tree.prototype.setReadonly = function(name, readonly){
	this.readonly[name] = readonly;
	this.forEach(function(node){
		node.setReadonly(name, readonly);
	});
}

/**
 * Returns current name of column is read only or not.
 * @param {string] name - column name to checks
 * @return {boolean} returns whether read-only or not
 */
duice.data.Tree.prototype.isReadonly = function(name){
	return this.readonly[name] || false;
}

duice.data.Tree.prototype.beforeNodeChange = function(listener){
	// TODO
}

duice.data.Tree.prototype.afterNodeChange = function(listener){
	// TODO
}

duice.data.Tree.prototype.beforeIndexChange = function(listener){
	// TODO
}

duice.data.Tree.prototype.afterIndexChange = function(listener){
	// TODO
}


/**
 * UI Component package
 * @namespace
 */
duice.ui = {};

/**
 *  UI Component abstract class
 *  @abstract
 *  @protected
 *  @constructor
 */
duice.ui.__ = function(){}

/**
 * Executes expression
 * @method
 * @protected
 * @param {HTMLElement} element - target container element
 * @param {Object} $context - context parameter object
 * @return {HTMLElement} result container element
 */
duice.ui.__.prototype.executeExpression = function(element,$context) {
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
	console.debug('executeExpression', template.content.firstChild);
	return template.content.firstChild;
}

/**
 * Removes all child elements
 * @method
 * @protected
 * @param {HTMLElement} element - target parent element
 */
duice.ui.__.prototype.removeChildNodes = function(element){
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
    if (element.options && element.nodeName === "select") {
    	element.options.length = 0;
    }
}

/**
 * Converts string to HTML element
 * @method 
 * @protected
 * @param {string} string - HTML string to convert
 * @return {HTMLElement} converted HTML element
 */
duice.ui.__.prototype.createHtml = function(string){
	var template = document.createElement('template');
	template.innerHTML = string;
	return template.content;
}

/**
 * Returns current window
 * @method
 * @protected
 * @return {HTMLWindowElement} window element
 */
duice.ui.__.prototype.getWindow = function() {
	if(window.frameElement){
		return window.parent;
	}else{
		return window;
	}
}

/**
 * Gets parent node
 * @method
 * @protected
 * @param {HTMLElement} element
 */
duice.ui.__.prototype.getParentNode = function(element){
	var parentNode = element.parentNode;
	return parentNode;
}

/**
 * Sets position to be centered.
 * @method
 * @protected
 * @param {HTMLElement} element - element to be centered.
 */
duice.ui.__.prototype.setPosition = function(element){
	var window = this.getWindow();
	var computedStyle = window.getComputedStyle(element);
	var computedWidth = computedStyle.getPropertyValue('width').replace(/px/gi, '');
	var computedHeight = computedStyle.getPropertyValue('height').replace(/px/gi, '');
	element.style.width = Math.min(window.screen.width-20, computedWidth) + 'px';
	element.style.height = Math.min(window.screen.height, computedHeight) + 'px';
	element.style.left = Math.max(10,window.innerWidth/2 - computedWidth/2) + 'px';
	element.style.top = Math.max(0,window.innerHeight/2 - computedHeight/2) + 'px';
}

/**
 * Parses format string to format type and format body
 * @method
 * @protected
 * @param {string} format - format string (type + ":" + body)
 * @return {Object} converted formatType and formatBody values
 */
duice.ui.__.prototype.parseFormat = function(format){
	var splitedFormat = format.split(':');
	var type = splitedFormat.shift();
	var option = splitedFormat.join(':');
	return { type: type, option: option };
}

/**
 * Delays execution
 * @method
 * @protected
 * @param {function} callback - function to defer
 */
duice.ui.__.prototype.delay = function(callback){
	var interval = setInterval(function() {
		try {
			callback.call();
		}catch(ignore){
			console.log(ignore, callback);
		}finally{
			clearInterval(interval);
		}
	},200);	
}

/**
 * Executes fade in animation.
 * @method
 * @protected
 * @param {HTMLElement} element - HTML element to animate fade in
 */
duice.ui.__.prototype.fadeIn = function(element){
	element.classList.remove('duice-ui-fadeOut');
	element.classList.add('duice-ui-fadeIn');
}

/**
 * Executes fade out animation.
 * @method
 * @protected
 * @param {HTMLElement} element - HTML element to animate fade out
 */
duice.ui.__.prototype.fadeOut = function(element) {
	element.classList.remove('duice-ui-fadeIn');
	element.classList.add('duice-ui-fadeOut');
}

/**
 * Gets current max z-index value
 * @method
 * @protected
 * @return {number} current max z-index
 */
duice.ui.__.prototype.getMaxZIndex = function(){
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
 * Blocks specified element
 * @method
 * @protected
 * @param {HTMLElement} element - HTML element to block
 * @return {Object} block handler
 */
duice.ui.__.prototype.block = function(element){
	var $this = this;
	
	var div = document.createElement('div');
	div.classList.add('duice-ui-block');
	
	// defines maxZIndex
	var zIndex = this.getMaxZIndex() + 1;
	
	// adjusting position
	div.style.position = 'fixed';
	div.style.zIndex = zIndex;
	
	// full blocking in case of BODY
	if(element.tagName == 'BODY'){
		div.style.width = '100%';
		div.style.height = '100%';
		div.style.top = '0px';
		div.style.left = '0px';
	}
	// otherwise adjusting to parent element
	else{
		var boundingClientRect = this.element.getBoundingClientRect();
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
 * Does loading effect.
 * @method
 * @protected
 * @param {HTMLElement} element - target HTML element to block.
 * @return {Object} release handler object
 */
// progress
duice.ui.__.prototype.load = function(element){
	var $this = this;
	
	// creates div
	var div = document.createElement('div');
	div.classList.add('duice-ui-load');
	div.style.position = 'fixed';
	div.style.opacity = 0;
	div.style.zIndex = this.getMaxZIndex() + 1;

	// on resize event
	this.getWindow().addEventListener('resize', function(ev) {
		if($this.div){
			$this.setPosition(div);
			$this.div.style.top = '30vh';	// adjust top
		}
	});
	
	// start
	element.appendChild(div);
	this.setPosition(div);
	div.style.top = '30vh';	// adjust top	
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

// Freezes prototype of super class.
Object.freeze(duice.ui.__.prototype);

/**
 * duice.ui.Text prototype
 * @class
 * @classdesc
 * Prints the value of the binded data map object on the screen.
 * ## HTML5 Tag and Attribute
 * | HTML Tag   	| data-* Attribute 										| Description  							|
 * | ------------- 	| -----------------------------------------------------	| -----------------------------------	|
 * | span  	   		| data-duice="Text" 									| component Type						|
 * | span		    | data-duice-bind="(duice.data.Map).(column name)"    	| specify binding Map and column name	|
 * | span		    | data-duice-format="(type):(options)"    				| defines display type and options		|
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/ogtf6vh9/embedded/html,js,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {HTMLTextElement} span - span HTML element
 */
duice.ui.Text = function(span) {
	duice.ui.__.call(this);
	this.span = span;
	this.span.classList.add('duice-ui-text');
}

// extends __ prototype
duice.ui.Text.prototype = Object.create(duice.ui.__.prototype);

/**
 * Binds with specified column in map
 * @method
 * @param {string} map - map name to bind
 * @param {string} name - column name to bind
 */
duice.ui.Text.prototype.bind = function(map, name) {
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
}

/**
 * Updates self from binded data map.
 * @method
 */
duice.ui.Text.prototype.update = function() {
	
	// removes child nodes
	this.removeChildNodes(this.span);

	// defines value
	var value = this.map.get(this.name) ? this.map.get(this.name) : '';

	// converted formatted value.
	if(this.format){
		var parsedFormat = this.parseFormat(this.format);
		if(parsedFormat.type === 'date'){
			value = duice.util.FormatUtils.toDateFormat(value, parsedFormat.option);
		}else if(parsedFormat.type === 'number'){
			value = duice.util.FormatUtils.toNumberFormat(value, parsedFormat.option);
		}
	}

	// append value.
	this.span.appendChild(this.createHtml(value));
}

/**
 * Sets display format
 * @method
 * @param {string} format - display format {type:format}
 * @example
 * // number format - number:(scale)
 * <span data-juice="Text" data-juice-bind="user.point" data-juice-format="number:2"></span>
 * // date format - date:(format)
 * <span data-duice="Text" data-juice-bind="user.birthDate" data-juice-format="date:yyyy-MM-dd hh:mm:ss"></span>
 */
duice.ui.Text.prototype.setFormat = function(format) {
	this.format = format;
}

/**
 * duice.ui.TextField prototype
 * @class
 * @classdesc
 * Prints value in input text element.
 * ## HTML5 Tag and Attribute
 * | HTML Tag   	| data-* Attribute 										| Description  							|
 * | ------------- 	| -----------------------------------------------------	| -----------------------------------	|
 * | input  	   	| data-duice="TextField" 								| component Type					|
 * | input		    | data-duice-bind="{duice.data.Map}.{column name}"    	| specify binding Map and column name	|
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/0hpgvzy5/embedded/html,js,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {HTMLInputElement} input - input HTML element.
 */
duice.ui.TextField = function(input){
	duice.ui.__.call(this);
	this.input = input;
	this.input.classList.add('duice-ui-textField');
}

// Extends super class
duice.ui.TextField.prototype = Object.create(duice.ui.TextField.prototype);

/**
 * Binds element to data object
 * @method
 * @param {string} name of map - map name to bind.
 * @param {string} column name of map - column name of map to bind. 
 */
duice.ui.TextField.prototype.bind = function(map, name) {
	var $this = this;
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
	this.input.addEventListener('change',function(){
		map.set(name, this.value);
	});
}

/**
 * Updates and redraw element from data object
 * @method
 */
duice.ui.TextField.prototype.update = function() {
	
	// sets value
	var value = this.map.get(this.name) ? this.map.get(this.name) : '';
	this.input.value = value;

	// checks read-only
	if(this.map.isEnable() == false || this.map.isReadonly(this.name) == true){
		this.setReadonly(true);
	}else{
		this.setReadonly(false);
	}
}

/**
 * Sets read-only attribute
 * @method
 * @param {boolean} readonly - whether element readonly or not
 */
duice.ui.TextField.prototype.setReadonly = function(readonly){
	if(readonly){
		this.input.setAttribute('readOnly',true);
	}else{
		this.input.removeAttribute('readOnly');
	}
}

/**
 * duice.ui.ComboBox prototype
 * @class
 * @classdesc
 * Creates ComboBox UI element binded with data object.
 * ## HTML5 Tag and Attribute
 * | HTML Tag   	| data-* Attribute 																| Description  							|
 * | ------------- 	| ---------------------------------------------------------------------			| -----------------------------------	|
 * | select  	   	| data-duice="ComboBox" 														| component Type						|
 * | select		    | data-duice-bind="(map).(column)"    											| specify binding Map and column name	|
 * | select		    | data-duice-options="(name of options array)"  								| options data array					|
 * | select		    | data-duice-option-value="(column of value)"  									| column name of option value			|
 * | select		    | data-duice-option-text="(column of text)"										| column name of option text			|
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/5dta4vub/embedded/html,js,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {HTMLInputElement} select - select HTML element.
 */
duice.ui.ComboBox = function(select) {
	duice.ui.__.call(this);
	this.select = select;
	this.select.classList.add('duice-ui-comboBox');
	this.options = [];
	this.optionValue = 'value';
	this.optionText = 'text';
	this.optionDisabled = null;
}

// Freezes ComboBox prototype
duice.ui.ComboBox.prototype = Object.create(duice.ui.__.prototype);

/**
 * Binds UI component to data object
 * @method
 * @param {duice.data.Map} map - data map object to bind
 * @param {string} name - column name to bind
 */
duice.ui.ComboBox.prototype.bind = function(map, name) {
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
	this.select.addEventListener('change',function(){
		map.set(name, this.value);	
	});
}

/**
 * Updates UI component and redraw.
 * @method
 */
duice.ui.ComboBox.prototype.update = function() {
	// removes all options
	this.removeChildNodes(this.select);
	
	// creates options
	for(var i = 0; i < this.options.length; i++){
		var option = document.createElement('option');

		// sets value and text
		var value = null;
		var text = null;
		
		// options array element is object
		if(typeof this.options[i] == 'object') {
			value = this.options[i][this.optionValue];
			text = this.options[i][this.optionText];
		}
		// else else string,number ...
		else{
			value = this.options[i];
			text = this.options[i];
		}
		
		// sets value and text node.
		option.value = value;
		option.appendChild(document.createTextNode(text));
		
		// sets disbaled option
		if(this.optionDisabled){
			option.disabled = this.options[i][this.optionDisabled];
		}
		
		// appends
		this.select.appendChild(option);
	}
	
	// sets value
	this.select.value = this.map.get(this.name) || '';
	
	// set read only
	if(this.map.enable == false){
		this.setReadonly(true);
	}else{
		this.setReadonly(this.map.readonly[this.name]);	
	}
}

/**
 * Sets options data object
 * @method
 * @param {Array<Object>|Array<string>} options data
 */
duice.ui.ComboBox.prototype.setOptions = function(options){
	this.options = options;
}

/**
 * Sets option value name
 * @method
 * @param {string} optionValue - column name of value in options data object
 */
duice.ui.ComboBox.prototype.setOptionValue = function(optionValue){
	this.optionValue = optionValue;
}

/**
 * Sets column name of text
 * @method
 * @param {string} optionText - column name of text in options data object
 */
duice.ui.ComboBox.prototype.setOptionText = function(optionText){
	this.optionText = optionText;
}

/**
 * Sets read-only
 * @method
 * @param {boolean} readonly - whether read-only or not 
 */
duice.ui.ComboBox.prototype.setReadonly = function(readonly){
	if(readonly){
		this.select.setAttribute('disabled',true);
	}else{
		this.select.removeAttribute('disabled');
	}
}

/**
 * duice.ui.CheckBox prototype
 * @class
 * @classdesc
 * CheckBox UI component
 * ## HTML5 Tag and Attribute
 * | HTML Tag   	| data-* Attribute 										| Description  							|
 * | ------------- 	| -----------------------------------------------------	| -----------------------------------	|
 * | input  	   	| data-duice="CheckBox"									| component Type						|
 * | input		    | data-duice-bind="(duice.data.Map).(column name)"    	| specify binding Map and column name	|
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/yftexL63/embedded/html,js,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {HTMLInputElement} input - input HTML element
 */
duice.ui.CheckBox = function(input) {
	duice.ui.__.call(this);
	this.input = input;
	this.input.type = 'checkbox';
	this.input.classList.add('duice-ui-checkBox');
}

// Extends UI prototype
duice.ui.CheckBox.prototype = Object.create(duice.ui.__.prototype);

/**
 * Binds component to data object
 * @method
 * @param {string} map - name of map object
 * @param {string} name - name of column in map
 */
duice.ui.CheckBox.prototype.bind = function(map,name) {
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
	this.input.addEventListener('change', function() {
		map.set(name, this.checked);
	});
}

/**
 * Updates component
 * @method
 */
duice.ui.CheckBox.prototype.update = function() {
	if(this.map.get(this.name) == true) {
		this.input.checked = true;
	}else{
		this.input.checked = false;
	}
	this.setReadonly(this.map.readonly[this.name]);
	if(this.map.enable == false){
		this.setReadonly(true);
	}
}

/**
 * Sets read-only or not
 * @method
 * @param {boolean} readonly - whether readonly or not
 */
duice.ui.CheckBox.prototype.setReadonly = function(readonly){
	if(readonly == true){
		this.input.disabled = true;
	}else{
		this.input.disabled = false;
	}
}

/**
 * duice.ui.Radio prototype
 * @class
 * @classdesc
 * Radio UI Component
 * ## HTML5 Tag and Attribute
 * | HTML Tag   	| data-* Attribute 										| Description  							|
 * | ------------- 	| -----------------------------------------------------	| -----------------------------------	|
 * | input  	   	| data-duice="Radio" 									| Radio component Type					|
 * | input		    | data-duice-bind="(duice.data.Map).(column name)"    	| specify binding Map and column name	|
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/zfyh83dn/embedded/html,js,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {HTMLInputElement} input - input HTML element.
 */
duice.ui.Radio = function(input) {
	duice.ui.__.call(this);
	this.input = input;
	this.input.type = 'radio';
	this.input.classList.add('duice-ui-radio');
}

// Freezes Radio prototype
duice.ui.Radio.prototype = Object.create(duice.ui.__.prototype);

/**
 * Binds component to data object
 * @method
 * @param {string} name of map - map name to bind.
 * @param {string} column name of map - column name of map to bind. 
 */
duice.ui.Radio.prototype.bind = function(map,name) {
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
	this.input.addEventListener('change', function() {
		map.set(name, this.value);
	});
}

/**
 * Updates and redraw element from data object
 * @method
 */
duice.ui.Radio.prototype.update = function(){

	// sets value
	if(this.map.get(this.name) == this.input.value) {
		this.input.checked = true;
	}else{
		this.input.checked = false;
	}

	// checks readonly
	if(this.map.readonly[this.name] || this.map.isEnable() == false){
		this.setReadonly(true);
	}else{
		this.setReadonly(false);
	}
}

/**
 * Sets read-only attribute
 * @method
 * @param {boolean} readonly - whether element readonly or not
 */
duice.ui.Radio.prototype.setReadonly = function(readonly){
	if(readonly){
		this.input.setAttribute('disabled',true);
	}else{
		this.input.removeAttribute('disabled');
	}
}

/**
 * duice.ui.TextView prototype
 * @class
 * @classdesc
 * Prints text in pre element.
 * ## HTML Tag and Attribute
 * | HTML Tag   	| data-* Attribute 										| Description  							|
 * | ------------- 	| -----------------------------------------------------	| -----------------------------------	|
 * | div	  	   	| data-duice="TextView" 								| component Type						|
 * | div		    | data-duice-bind="(duice.data.Map).(column name)"    	| specify binding Map and column name	|
 * | div 			| data-duice-format="(html,markdown,text)"				| specify text format(defualt is html)	|
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/adouxg1q/embedded/html,js,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {HTMLDivElement} div - div HTML element
 */
duice.ui.TextView = function(div) {
	duice.ui.__.call(this);
	this.div = div;
	this.div.classList.add('duice-ui-textView');
}

// Freezes prototype
duice.ui.TextView.prototype = Object.create(duice.ui.__.prototype);

/**
 * Binds element to data object
 * @method
 * @param {string} name of map - map name to bind.
 * @param {string} column name of map - column name of map to bind.
 */
duice.ui.TextView.prototype.bind = function(map, name) {
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
}

/**
 * Updates and redraw element from data object
 * @method
 */
duice.ui.TextView.prototype.update = function() {
	var value = this.map.get(this.name) ? this.map.get(this.name) : '';
	if(this.format){
		switch(this.format){
			case "markdown":
				value = duice.util.MarkdownParser.parse(value);
			break;
			case "text":
				// TODO stripHtml or spcializeeHtml
				value = value;
			break;
		}
	}
	this.div.innerHTML = value;
}

duice.ui.TextView.prototype.setFormat = function(format) {
	this.format = format;
}

/**
 * duice.ui.TextArea prototype
 * @class
 * @classdesc
 * Textarea UI component
 * ## HTML Tag and Attribute
 * | HTML Tag   	| data-* Attribute 										| Description  							|
 * | ------------- 	| -----------------------------------------------------	| -----------------------------------	|
 * | label  	   	| data-duice="Textarea" 								| component Type						|
 * | label		    | data-duice-bind="{duice.data.Map}.{column name}"    	| specify binding Map and column name	|
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/4zs6o3kv/embedded/html,js,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {HTMLTextareaElement} textarea - textarea HTML element
 */
duice.ui.TextArea = function(textarea) {
	duice.ui.__.call(this);
	this.textarea = textarea;
	this.textarea.classList.add('duice-ui-textArea');
}

// Freezes prototype
duice.ui.TextArea.prototype = Object.create(duice.ui.__.prototype);

/**
 * Binds component to data object
 * @method
 * @param {duice.data.Map} map - name of data object
 * @param {string} name - name of column in data object
 */
duice.ui.TextArea.prototype.bind = function(map,name) {
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
	this.textarea.name = name;
	this.textarea.value = map.get(name);
	var $this = this;
	this.textarea.addEventListener('change',function(){
		map.set(this.name, this.value);
	});
}

/**
 * Updates and redraws component
 * @method
 */
duice.ui.TextArea.prototype.update = function() {
	this.textarea.value = this.map.get(this.name) || '';
	
	// sets enable and read only
	if(this.map.enable == false){
		this.setReadonly(true);
	}else{
		this.setReadonly(this.map.readonly[this.name]);	
	}
}

/**
 * Sets read-only
 * @method
 * @param {boolean} readonly - whether read-only or not
 */
duice.ui.TextArea.prototype.setReadonly = function(readonly){
	if(readonly){
		this.textarea.setAttribute('readonly','readonly');
	}else{
		this.textarea.removeAttribute('readonly');
	}
}

//-----------------------------------------------------------------------------
// duice.ui.HtmlEditor prototype
//-----------------------------------------------------------------------------
/**
 * duice.ui.HtmlEditor prototype
 * @class
 * @classdesc
 * ## HTML5 Tag and Attribute
 * | HTML Tag   	| data-* Attribute 										| Description  							|
 * | ------------- 	| -----------------------------------------------------	| -----------------------------------	|
 * | label  	   	| data-duice="HtmlEditor" 								| component Type						|
 * | label		    | data-duice-bind="{duice.data.Map}.{column name}"    	| specify binding Map and column name	|
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/329r5jw8/embedded/html,js,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {HTMLDivElement} div - div HTML element
 */
duice.ui.HtmlEditor = function(div) {
	duice.ui.__.call(this);
	var $this = this;
	this.div = div;
	this.div.classList.add('duice-ui-htmlEditor');
	
	// create toolbar
	this.toolbar = this.createToolbar();
	this.toolbar.classList.add('duice-ui-htmlEditor-toolbar');
	this.div.appendChild(this.toolbar);
	
	// create content
	this.content = document.createElement('div');
	this.content.classList.add('duice-ui-htmlEditor-content');
	this.pre = document.createElement('pre');
	this.content.appendChild(this.pre);
	this.textarea = document.createElement('textarea');
	this.textarea.style.display = 'none';
	this.content.appendChild(this.textarea);
	this.div.appendChild(this.content);
	
	// pre element designMode 
	this.pre.contentEditable = 'true';
}

// Freezes component prototype
duice.ui.HtmlEditor.prototype = Object.create(duice.ui.__.prototype);

/**
 * Binds component to data object
 * @method
 * @param {duice.data.Map} map - name of data object to bind
 * @param {string} name - name of column to bind 
 */
duice.ui.HtmlEditor.prototype.bind = function(map,name) {
	var $this = this;
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
	
	// adds event listener to text area element.
	this.pre.addEventListener('DOMSubtreeModified', function(event){
		if(map.get(name) != this.innerHTML){
			map.set(name, this.innerHTML);
		}
	});
	
	// add event listener to pre element.
	this.textarea.addEventListener('change', function(){
		map.set(name, this.value);
	});
}

/**
 * Updates component
 * @method
 */
duice.ui.HtmlEditor.prototype.update = function() {
	if(this.pre.innerHTML != this.map.get(this.name)) {
		this.pre.innerHTML = this.map.get(this.name) || '';
	}
	if(this.textarea.value != this.map.get(this.name)){
		this.textarea.value = this.map.get(this.name) || '';
	}
}

/**
 * Creates toolbar
 * @method
 * @protected
 */
duice.ui.HtmlEditor.prototype.createToolbar = function() {
	var editor = this;
	var toolbar = document.createElement('div');
	
	// font family
	var fontfamily = document.createElement('select');
	fontfamily.classList.add('duice-ui-htmlEditor-toolbar-fontfamily');
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
		editor.execCommand('fontName',null,this.value);
	});
	toolbar.appendChild(fontfamily);
	
	// font size
	var fontsize = document.createElement('select');
	fontsize.classList.add('duice-ui-htmlEditor-toolbar-fontsize');
	for(var i = 1; i <= 7; i++){
		var option = document.createElement('option');
		option.value = i;
		if(i == 3){
			option.selected = true;		//  default font size
		}
		option.appendChild(document.createTextNode(i));
		fontsize.appendChild(option);
	}
	fontsize.addEventListener('change',function(){
		editor.execCommand('fontSize',null,this.value);
	});
	toolbar.appendChild(fontsize);

	// bold
	var bold = document.createElement('button');
	bold.classList.add('duice-ui-htmlEditor-toolbar-bold');
	bold.addEventListener('click', function(){
		editor.execCommand('bold',null,null);
	});
	toolbar.appendChild(bold);
	
	// italic
	var italic = document.createElement('button');
	italic.classList.add('duice-ui-htmlEditor-toolbar-italic');
	italic.addEventListener('click',function(){
		editor.execCommand('italic',null,null);
	});
	toolbar.appendChild(italic);
	
	// underline
	var underline = document.createElement('button');
	underline.classList.add('duice-ui-htmlEditor-toolbar-underline');
	toolbar.appendChild(underline);
	underline.addEventListener('click',function() {
		editor.execCommand('underline',null,null);
	});

	// align left
	var alignleft = document.createElement('button');
	alignleft.classList.add('duice-ui-htmlEditor-toolbar-alignleft');
	alignleft.addEventListener('click',function() {
		editor.execCommand('justifyLeft',null,null);
	});
	toolbar.appendChild(alignleft);
	
	// align center
	var aligncenter = document.createElement('button');
	aligncenter.classList.add('duice-ui-htmlEditor-toolbar-aligncenter');
	aligncenter.addEventListener('click',function() {
		editor.execCommand('justifyCenter',null,null);
	});
	toolbar.appendChild(aligncenter);
	
	// align right
	var alignright = document.createElement('button');
	alignright.classList.add('duice-ui-htmlEditor-toolbar-alignright');
	alignright.addEventListener('click',function() {
		editor.execCommand('justifyRight',null,null);
	});
	toolbar.appendChild(alignright);
	
	// indent increase
	var indentincrease = document.createElement('button');
	indentincrease.classList.add('duice-ui-htmlEditor-toolbar-indentincrease');
	indentincrease.addEventListener('click',function() {
		editor.execCommand('indent',null,null);
	});
	toolbar.appendChild(indentincrease);
	
	// indent decrease
	var indentdecrease = document.createElement('button');
	indentdecrease.classList.add('duice-ui-htmlEditor-toolbar-indentdecrease');
	indentdecrease.addEventListener('click',function() {
		editor.execCommand('outdent',null,null);
	});
	toolbar.appendChild(indentdecrease);
	
	// list order
	var listorder = document.createElement('button');
	listorder.classList.add('duice-ui-htmlEditor-toolbar-listorder');
	listorder.addEventListener('click',function() {
		editor.execCommand('insertorderedlist',null,null);
	});
	toolbar.appendChild(listorder);
	
	// list unorder
	var listunorder = document.createElement('button');
	listunorder.classList.add('duice-ui-htmlEditor-toolbar-listunorder');
	listunorder.addEventListener('click',function() {
		editor.execCommand('insertUnorderedList',null,null);
	});
	toolbar.appendChild(listunorder);
	
	// html
	var html = document.createElement('button');
	html.classList.add('duice-ui-htmlEditor-toolbar-html');
	html.addEventListener('click', function() {
		editor.toggleHtml();
	});
	toolbar.appendChild(html);
	
	return toolbar;
}

/**
 * Executes commands
 * @method
 * @protected
 * @param {string} commandName - name of command to execute
 * @param {boolean} showDefaultUI - A Boolean indicating whether the default user interface should be shown. This is not implemented in Mozilla.
 * @param {string} valueArgument - For commands which require an input argument
 */
duice.ui.HtmlEditor.prototype.execCommand = function(commandName, showDefaultUI, valueArgument) {
	document.execCommand(commandName, showDefaultUI, valueArgument);
}

/**
 * ToggleHtml
 * @method
 * @protected
 */
duice.ui.HtmlEditor.prototype.toggleHtml = function() {
	if(this.html == true){
		this.html = false;
		this.pre.style.display = 'block';
		this.textarea.style.display = 'none';
	}else{
		this.html = true;
		this.pre.style.display = 'none';
		this.textarea.style.display = 'block';
	}
}

/**
 * duice.ui.CronExpression prototype
 * @class
 * @classdesc
 * ## HTML5 Tag and Attribute
 * | HTML Tag   	| data-* Attribute 										| Description  							|
 * | ------------- 	| -----------------------------------------------------	| -----------------------------------	|
 * | label  	   	| data-duice="CronExpression" 							| component Type						|
 * | label		    | data-duice-bind="{duice.data.Map}.{column name}"    	| specify binding Map and column name	|
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/k4dsxywm/embedded/html,js,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {HTMLInputElement} input - input HTML element
 */
duice.ui.CronExpression = function(input) {
	duice.ui.__.call(this);
	this.input = input;
	
	this.second = this.createSelectSecond();
	this.minute = this.createSelectMinute();
	this.hour = this.createSelectHour();
	this.day = this.createSelectDay();
	this.month = this.createSelectMonth();
	this.week = this.createSelectWeek();
	
	this.editor = document.createElement('span');
	this.editor.classList.add('duice-ui-cronExpression-editor');
	
	// seconds
	var secondSpan = document.createElement('span');
	secondSpan.classList.add('duice-ui-cronExpression-editor-second');
	secondSpan.appendChild(this.second);
	this.editor.appendChild(secondSpan);
	
	// minute
	var minuteSpan = document.createElement('span');
	minuteSpan.classList.add('duice-ui-cronExpression-editor-minute');
	minuteSpan.appendChild(this.minute);
	this.editor.appendChild(minuteSpan);
	
	// hour
	var hourSpan = document.createElement('span');
	hourSpan.classList.add('duice-ui-cronExpression-editor-hour');
	hourSpan.appendChild(this.hour);
	this.editor.appendChild(hourSpan);
	
	// day
	var daySpan = document.createElement('span');
	daySpan.classList.add('duice-ui-cronExpression-editor-day');
	daySpan.appendChild(this.day);
	this.editor.appendChild(daySpan);
	
	// month
	var monthSpan = document.createElement('span');
	monthSpan.classList.add('duice-ui-cronExpression-editor-month');
	monthSpan.appendChild(this.month);
	this.editor.appendChild(monthSpan);
	
	// week
	var weekSpan = document.createElement('span');
	weekSpan.classList.add('duice-ui-cronExpression-editor-week');
	weekSpan.appendChild(this.week);
	this.editor.appendChild(weekSpan);
	
	// append editor span to input parent
	this.input.parentNode.appendChild(this.editor);
}

// extends component prototype
duice.ui.CronExpression.prototype = Object.create(duice.ui.__.prototype);

/**
 * Text property
 */
duice.ui.CronExpression.prototype.text = {
	EVERY:'Every',
	LAST_DAY: 'Last Day',
	LAST_WEEKDAY: 'Last Weekday',
	WEEKDAY: 'Weekday',
	WEEKEND: 'Weekend',
	MON: 'Monday',
	TUE: 'Tuesday',
	WED: 'Wednesday',
	THU: 'Thursday',
	FRI: 'Friday',
	SAT: 'Saturday',
	SUN: 'Sunday'
}

/**
 * Binds component to data object
 * @method
 * @param {duice.data.Map} map - Map object to bind
 * @param {string} name - column name of Map to bind
 */
duice.ui.CronExpression.prototype.bind = function(map, name) {
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
	this.input.addEventListener('change',function(){
		map.set(name, this.value);
	});
}

/**
 * Updates component
 * @method
 */
duice.ui.CronExpression.prototype.update = function() {
	var $this = this;
	this.input.value = this.map.get(this.name) || '';
	this.input.classList.add('duice-ui-cronExpression');
	
	// parse cron expression
	var cronExpressionArray = this.input.value.split(' ');
	this.second.value = cronExpressionArray[0];
	this.minute.value = cronExpressionArray[1];
	this.hour.value = cronExpressionArray[2];
	this.day.value = cronExpressionArray[3];
	this.month.value = cronExpressionArray[4];
	this.week.value = cronExpressionArray[5];
}

/**
 * Sets read-only
 * @method
 * @param {boolean} readonly - whether read-only or not
 */
duice.ui.CronExpression.prototype.setReadonly = function(readonly) {
	if(readonly == true) {
		this.input.setAttribute('readonly',true);
		this.second.setAttribute('disabled',true);
		this.minute.setAttribute('disabled',true);
		this.hour.setAttribute('disabled',true);
		this.day.setAttribute('disabled',true);
		this.month.setAttribute('disabled',true);
		this.week.setAttribute('disabled',true);
	}else if(readonly == false){
		this.input.removeAttribute('readonly');
		this.second.removeAttribute('disabled');
		this.minute.removeAttribute('disabled');
		this.hour.removeAttribute('disabled');
		this.day.removeAttribute('disabled');
		this.month.removeAttribute('disabled');
		this.week.removeAttribute('disabled');
	}
}

/**
 * Checks is valid cron expression
 * @method
 * @protected
 */
duice.ui.CronExpression.prototype.isSupprotCronExpression = function() {
	var pattern = /([\d]{1,2}) ([\d]{1,2}) ([\d|\*]{1,2}) ([\d|\*]{1,2}) ([\d|\*]{1,2}) ([\?]{1})$/gi;
	return pattern.test(this.input.value);
}

/**
 * Generates and Sets cron expression
 * @method
 * @protected
 */
duice.ui.CronExpression.prototype.generateCronExpression = function() {
	var cronExpression = this.second.value 
					+ ' ' + this.minute.value 
					+ ' ' + this.hour.value
					+ ' ' + this.day.value 
					+ ' ' + this.month.value
					+ ' ' + this.week.value;
	this.map.set(this.name, cronExpression);
}

/**
 * Creates select element of second
 * @method
 * @protected
 * @return {HTMLSelectElement} second select element
 */
duice.ui.CronExpression.prototype.createSelectSecond = function() {
	var selectSecond = document.createElement('select');
	for(var i = 0; i < 59; i ++){
		var option = document.createElement('option');
		option.value = i;
		option.appendChild(document.createTextNode(i));
		selectSecond.appendChild(option);
	}
	var $this = this;
	selectSecond.onchange = function() {
		$this.generateCronExpression();
	}
	
	// copy class list
	for(var i = 0; i < this.input.classList.length; i ++){
		selectSecond.classList.add(this.input.classList[0]);
	}
	return selectSecond;
}

/**
 * Creates select element of minite
 * @method
 * @protected
 * @return {HTMLSelectElement} minute select element
 */
duice.ui.CronExpression.prototype.createSelectMinute = function() {
	var selectMinute = document.createElement('select');
	for(var i = 0; i <= 59; i ++){
		var option = document.createElement('option');
		option.value = i;
		option.appendChild(document.createTextNode(i));
		selectMinute.appendChild(option);
	}
	
	// add event listener
	var $this = this;
	selectMinute.onchange = function() {
		$this.generateCronExpression();
	}
	
	// copy class list
	for(var i = 0; i < this.input.classList.length; i ++){
		selectMinute.classList.add(this.input.classList[0]);
	}
	return selectMinute;
}

/**
 * Creates select element of hour
 * @method
 * @protected
 * @return {HTMLSelectElement} hour select element
 */
duice.ui.CronExpression.prototype.createSelectHour = function() {
	var selectHour = document.createElement('select');
	var defaultOption = document.createElement('option');
	defaultOption.value = '*';
	defaultOption.appendChild(document.createTextNode(this.text.EVERY));
	selectHour.appendChild(defaultOption);
	for(var i = 0; i <= 23; i ++){
		var option = document.createElement('option');
		option.value = i;
		option.appendChild(document.createTextNode(i));
		selectHour.appendChild(option);
	}
	
	// add event listener
	var $this = this;
	selectHour.onchange = function() {
		$this.generateCronExpression();
	}
	
	// copy class list
	for(var i = 0; i < this.input.classList.length; i ++){
		selectHour.classList.add(this.input.classList[0]);
	}
	return selectHour;
}

/**
 * Creates select element of day
 * @method
 * @protected
 * @return {HTMLSelectElement} day select element
 */
duice.ui.CronExpression.prototype.createSelectDay = function() {
	var selectDay = document.createElement('select');
	
	// default option
	var defaultOption = document.createElement('option');
	defaultOption.value = '?';
	defaultOption.appendChild(document.createTextNode('-'));
	selectDay.appendChild(defaultOption);		
	
	// every option
	var everyOption = document.createElement('option');
	everyOption.value = '*';
	everyOption.appendChild(document.createTextNode(this.text.EVERY));
	selectDay.appendChild(everyOption);
	
	// last day of month
	var lastDayOption = document.createElement('option');
	lastDayOption.value = 'L';
	lastDayOption.appendChild(document.createTextNode(this.text.LAST_DAY));
	selectDay.appendChild(lastDayOption);
	
	// last weekday of month
	var lastWeekdayOption = document.createElement('option');
	lastWeekdayOption.value = 'LW';
	lastWeekdayOption.appendChild(document.createTextNode(this.text.LAST_WEEKDAY));
	selectDay.appendChild(lastWeekdayOption);
	
	// specific day
	for(var i = 1; i <= 31; i ++){
		var option = document.createElement('option');
		option.value = i;
		option.appendChild(document.createTextNode(i));
		selectDay.appendChild(option);
	}
		
	// add event listener
	var $this = this;
	selectDay.onchange = function() {
		if(this.value != '?') {
			$this.week.value = '?';
		}
		$this.generateCronExpression();
	}
	// copy class list
	for(var i = 0; i < this.input.classList.length; i ++){
		selectDay.classList.add(this.input.classList[0]);
	}
	return selectDay;
}

/**
 * Creates select element of month
 * @method
 * @protected
 * @return {HTMLSelectElement} month select element
 */
duice.ui.CronExpression.prototype.createSelectMonth = function() {
	var selectMonth = document.createElement('select');
	var defaultOption = document.createElement('option');
	defaultOption.value = '*';
	defaultOption.appendChild(document.createTextNode(this.text.EVERY));
	selectMonth.appendChild(defaultOption);
	for(var i = 1; i <= 12; i ++){
		var option = document.createElement('option');
		option.value = i;
		option.appendChild(document.createTextNode(i));
		selectMonth.appendChild(option);
	}
	
	// add event listener
	var $this = this;
	selectMonth.onchange = function() {
		$this.generateCronExpression();
	}
	
	// copy class list
	for(var i = 0; i < this.input.classList.length; i ++){
		selectMonth.classList.add(this.input.classList[0]);
	}
	return selectMonth;
}

/**
 * Creates week select element
 * @method
 * @protected
 * @return {HTMLSelectElement} week select element
 */
duice.ui.CronExpression.prototype.createSelectWeek = function() {
	var selectWeek = document.createElement('select');
	var defaultOption = document.createElement('option');
	defaultOption.value = '?';
	defaultOption.appendChild(document.createTextNode('-'));
	selectWeek.appendChild(defaultOption);
	
	// weekday
	var weekdayOption = document.createElement('option');
	weekdayOption.value = '1-5';
	weekdayOption.appendChild(document.createTextNode(this.text.WEEKDAY));
	selectWeek.appendChild(weekdayOption);
	
	// weekend
	var weekendOption = document.createElement('option');
	weekendOption.value = '6-7';
	weekendOption.appendChild(document.createTextNode(this.text.WEEKEND));
	selectWeek.appendChild(weekendOption);
	
	var dayOfWeek = [this.text.MON, this.text.TUE, this.text.WED,this.text.THU, this.text.FRI, this.text.SAT, this.text.SUN];
	for(var i = 0; i < dayOfWeek.length; i ++){
		var option = document.createElement('option');
		option.value = i+1;
		option.appendChild(document.createTextNode(dayOfWeek[i]));
		selectWeek.appendChild(option);
	}
	var $this = this;
	selectWeek.onchange = function() {
		if(this.value != '?') {
			$this.day.value = '?';
		}
		$this.generateCronExpression();
	}
	// copy class list
	for(var i = 0; i < this.input.classList.length; i ++){
		selectWeek.classList.add(this.input.classList[0]);
	}
	return selectWeek;
}

/**
 * duice.ui.Image prototype
 * @class
 * @classdesc
 * Image component with base64 encoded data. 
 * ## HTML5 Tag and Attribute
 * | HTML Tag   	| data-* Attribute 										| Description  							|
 * | ------------- 	| -----------------------------------------------------	| -----------------------------------	|
 * | img	  	   	| data-duice="Text" 									| component Type						|
 * | img		    | data-duice-bind="{duice.data.Map}.{column name}"    	| specify binding Map and column name	|
 * | img			| data-duice-width="{width pixel}						| pixel of img width					|
 * | img 			| data-juice-height="{height pixel}"					| pixel of img height					|
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/bzce5097/embedded/js,html,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 */
duice.ui.Image = function(img) {
	duice.ui.__.call(this);
	this.img = img;
	this.img.classList.add('duice-ui-thumbnail');
	this.input = document.createElement('input');
	this.input.setAttribute("type", "file");
	this.input.setAttribute("accept", "image/gif, image/jpeg, image/png");
	this.blank = img.src;
	this.width = 128;
	this.height = 128;
	this.readonly = false;
}

// Extends prototypes
duice.ui.Image.prototype = Object.create(duice.ui.__.prototype);

/**
 * Binds component to data object
 * @method
 * @param {duice.data.Map} map - map object to bind
 * @param {string} name - name of column to bind
 */
duice.ui.Image.prototype.bind = function(map, name) {
	var $this = this;
	this.map = map;
	this.name = name;
	this.map.addObserver(this);
	
	this.img.addEventListener('error', function() {
		console.log('error');
	});
	
	// if editable 
	if(this.map.isReadonly(this.name) === false && this.map.isEnable() === true){

		// adds click event
		this.img.addEventListener('click', function() {
			$this.input.click();
		});
	
		// add change event listener
		this.input.addEventListener('change', function(e){
			var fileReader = new FileReader();
			if (this.files && this.files[0]) {
				fileReader.addEventListener("load", function(e) {
					var value = e.target.result;
					var width = $this.width;
					var height = $this.height;
				    var canvas = document.createElement("canvas");
				    var ctx = canvas.getContext("2d");
		            canvas.width = width;
		            canvas.height = height;
				    var image = document.createElement('img');
				    image.onload = function(){
						ctx.drawImage(image, 0, 0, width, height);
						value = canvas.toDataURL("image/png");
				    	$this.map.set($this.name, value);
				    };
				    image.src = value;
			    }); 
				fileReader.readAsDataURL(this.files[0]);
			}
		});
	}
}

/**
 * Updates component
 * @method
 */
duice.ui.Image.prototype.update = function() {
	var $this = this;
	if(this.map.get(this.name)) {
		var src = this.map.get(this.name);
		this.img.src = src; 
	}else{
		this.img.src = this.blank;
	}
	
	// setting read only
	if(!this.readonly){
		if(!this.map.isEnable() || this.map.isReadonly(this.name)){
			this.img.style.cursor = '';
		}else{
			this.img.style.cursor = 'pointer';
		}
	}
}

/**
 * Sets image width
 * @method
 * @param {number} width - image width pixel
 */
duice.ui.Image.prototype.setWidth = function(width){
	if(width){
		this.width = width;
	}
}

/**
 * Sets image height
 * @method
 * @param {number} height - image height pixel
 */
duice.ui.Image.prototype.setHeight = function(height){
	if(height){
		this.height = height;
	}
}

/**
 * Sets read-only
 * @method 
 * @param {boolean} readonly - whether read-only or not
 */
duice.ui.Image.prototype.setReadonly = function(readonly){
	this.readonly = readonly;
}

/**
 * duice.ui.ListView prototype
 * @class
 * @classdesc
 * ListView component
 * ## HTML Tag and Attribute
 * | HTML Tag   	| data-* Attribute 										| Description  							|
 * | ------------- 	| -----------------------------------------------------	| -----------------------------------	|
 * | ul		  	   	| data-duice="ListView"									| component Type						|
 * | ul			    | data-duice-bind="{duice.data.List}"    				| specify binding List 					|
 * | ul			    | data-duice-item="(name of row object)"    			| defines name of row object			|
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/nhe60foq/embedded/html,js,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe> 
 * @constructor
 * @param {HTMLUlElement} ul - ul HTML element
 */
duice.ui.ListView = function(ul){
	duice.ui.__.call(this);
	this.ul = ul;
	this.ul.classList.add('duice-ui-listView');
	this.li = this.ul.querySelector('li');
	this.ul.removeChild(this.li);
	this.rows = new Array();
}

// Extends prototype
duice.ui.ListView.prototype = Object.create(duice.ui.__.prototype);

/**
 * Binds component to data object
 * @method
 * @param {duice.data.List} list - list data object to bind
 */
duice.ui.ListView.prototype.bind = function(list){
	this.list = list;
	this.list.addObserver(this);
}

/**
 * Defines row element name
 * @method
 * @param {string} item - name of row element
 */
duice.ui.ListView.prototype.setItem = function(item){
	this.item = item;
}

/**
 * Updates component
 * @method
 */
duice.ui.ListView.prototype.update = function(){
	
	// remove previous rows
	for(var i = 0; i < this.rows.length; i ++ ) {
		this.ul.removeChild(this.rows[i]);
	}
	this.rows.length = 0;
	
	// creates new rows
	for(var index = 0; index < this.list.getRowCount(); index ++ ) {
		var map = this.list.getRow(index);
		var li = this.createRow(index,map);
		this.ul.appendChild(li);
		this.rows.push(li);
	}
}

/**
 * Creates row li element
 * @method
 * @protected
 * @param {number} index - row index
 * @param {duice.data.Map} map - current row Map data object
 */
duice.ui.ListView.prototype.createRow = function(index, map){
	var $this = this;
	var ul = this.ul;
	var li = this.li.cloneNode(true);
	
	// setting index
	li.dataset.duiceIndex = index;
	
	// executes expression
	var $context = {};
	$context['index'] = index;
	$context[this.item] = map;
	li = this.executeExpression(li, $context);
	
	// creates duice element.
	duice.initialize(li, $context);
	
	// returns
	return li;
}

/**
 * duice.ui.TreeView prototype
 * @class
 * @classdesc
 * ## HTML5 Tag and Attribute
 * | HTML Tag   	| data-* Attribute 														| Description  								|
 * | ------------- 	| ---------------------------------------------------------------------	| -----------------------------------		|
 * | ul 	 	   	| data-duice="TreeView" 												| component Type							|
 * | ul			    | data-duice-bind="(duice.data.Tree)"									| specify name of duice.data.List object	|
 * | ul			    | data-duice-item="(node alias)"  										| defines row map object name				|
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/z8djn946/embedded/html,js,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {HTMLUlElement} ul - ul HTML element
 */
duice.ui.TreeView = function(ul){
	duice.ui.__.call(this);
	this.ul = ul;
	this.ul.classList.add('duice-ui-treeView');
	this.li = this.ul.querySelector('li');
	this.ul.removeChild(this.li);
}

// Extends prototype
duice.ui.TreeView.prototype = Object.create(duice.ui.__.prototype);

/**
 * Binds component to tree data object
 * @method
 * @param {duice.data.Tree} tree - duice.data.Tree data object to bind
 */
duice.ui.TreeView.prototype.bind = function(tree) {
	this.tree = tree;
	this.tree.addObserver(this);
}

/**
 * Sets each item(node) name
 * @method
 * @param {string} item - alias name of each tree node
 */
duice.ui.TreeView.prototype.setItem = function(item){
	this.item = item;
}

/**
 * Sets editable
 * @method
 * @param {boolean} editable - whether editable or not
 */
duice.ui.TreeView.prototype.setEditable = function(editable) {
	this.editable = editable;
}

/**
 * Updates component
 * @method
 */
duice.ui.TreeView.prototype.update = function() {

	// remove previous li
	while (this.ul.hasChildNodes()) {
		this.ul.removeChild(this.ul.lastChild);
	}

	// creates new li
	var rootChildNodes = this.tree.getRootNode().getChildNodes();
	for(var i = 0; i < rootChildNodes.length; i ++) {
		var rootChildNode = rootChildNodes[i];
		var index = [i];
		var li = this.createNode(index, rootChildNode);
		this.ul.appendChild(li);
	}
	
	// sets index node to unfold
	var treeIndex = JSON.stringify(this.tree.index);
	treeIndex = treeIndex.substring(1, treeIndex.length-1);
	var lis = this.ul.querySelectorAll('li');
	for(var i = 0, size = lis.length; i < size; i++ ){
		var liIndex = lis[i].dataset.duiceIndex;
		liIndex = liIndex.substring(1, liIndex.length-1);
		if(treeIndex.indexOf(liIndex) == 0 && treeIndex != liIndex){
			lis[i].classList.remove('duice-ui-treeView-fold');
			lis[i].classList.add('duice-ui-treeView-unfold');
		} 
	}
}

/**
 * Creates node
 * @method
 * @protected
 * @param {number} index - tree index array ex)[0,1,3]...
 * @param {duice.data.Map} node - node element map data object
 */
duice.ui.TreeView.prototype.createNode = function(index, node){
	var $this = this;
	var li = this.li.cloneNode(true);
	var index = JSON.parse(JSON.stringify(index)); 	// deep copy
	
	// setting index
	li.dataset.duiceIndex = JSON.stringify(index);
	
	// executes expression
	var $context = {};
	$context['index'] = JSON.stringify(index);
	$context['depth'] = index.length - 1;
	$context[this.item] = node;
	li = this.executeExpression(li, $context);
	
	// creates duice element.
	duice.initialize(li,$context);
	
	// active index item
	if(JSON.stringify(index) == JSON.stringify(this.tree.index)){
		li.classList.add('duice-ui-treeView-index');
	}

	// on click event
	li.addEventListener('click', function(event){
		var prevIndexLi = $this.ul.querySelector('li.duice-ui-treeView-index');
		if(prevIndexLi){
			prevIndexLi.classList.remove('duice-ui-treeView-index');
		}
		li.classList.add('duice-ui-treeView-index');
		$this.tree.index = eval(this.dataset.duiceIndex);
	});

	// child node
	var childNodes = node.getChildNodes();
	if(childNodes && childNodes.length > 0){
	
		// fold & unfold class
		li.classList.add('duice-ui-treeView-unfold');
		li.addEventListener('click', function(event){
			if(event.target == this){
				this.classList.toggle('duice-ui-treeView-fold');
				this.classList.toggle('duice-ui-treeView-unfold');
			}
		});
		
		// creates child node
		index.push(-1);
		var childUl = document.createElement('ul');
		childUl.addEventListener('click', function(event){
			event.stopPropagation();
		});
		for(var i = 0; i < childNodes.length; i ++){
			var childNode = childNodes[i];
			index[index.length-1] = i;
			var childLi = this.createNode(index, childNode);
			childUl.appendChild(childLi);
		}
		li.appendChild(childUl);
	}

	// editable
	if(this.editable){
		var $li = li;
		
		// disable drag
		if(li.dataset.duiceDraggable && eval(li.dataset.duiceDraggable) == false){
			li.setAttribute('draggable', false);
			li.classList.remove('duice-ui-treeView-draggable');
		}
		// enable drag
		else{
			li.setAttribute('draggable', true);
			li.classList.add('duice-ui-treeView-draggable');
			// setting row drag and drop
			li.addEventListener('dragstart', function(ev) {
				ev.stopPropagation();
				ev.target.id = new Date().getMilliseconds();
				ev.dataTransfer.setData("id", ev.target.id);
				this.classList.add('duice-ui-treeView-dragstart');
			});
			li.addEventListener('dragend', function(ev){
				this.classList.remove('duice-ui-treeView-dragstart');
			});
		}

		// disable drop
		if(li.dataset.duiceDroppable && eval(li.dataset.duiceDroppable) == false){
			li.addEventListener('drop', function(ev) {
			    ev.preventDefault();
			    ev.stopPropagation();
			    return false;
			});
			li.addEventListener('dragover', function(ev){
				ev.preventDefault();
				ev.stopPropagation();
				return false;
			});
		}
		// enable drop
		else{
			li.addEventListener('drop', function(ev) {
			    ev.preventDefault();
			    ev.stopPropagation();
			    var dragedLi = document.getElementById(ev.dataTransfer.getData("id"));
			    var dropedLi = ev.target;
			    while(dropedLi){
			    	if(dropedLi.tagName == 'LI'){
			    		break;
			    	}
			    	dropedLi = dropedLi.parentElement;
			    }
			    var fromIndex = eval(dragedLi.dataset.duiceIndex);
			    var toIndex = eval(dropedLi.dataset.duiceIndex);
			    if(fromIndex.toString() == toIndex.toString()) {
			    	return false;
			    }
			    
			    // moves node
			    $this.tree.moveNode(fromIndex, toIndex);
			});
			li.addEventListener('dragover', function(ev){
				ev.preventDefault();
				ev.stopPropagation();
			});
		}
	}
	
	// return li
	return li;
}

/**
 * duice.ui.Grid prototype
 * @class
 * @classdesc
 * Grid based on <Table> element.
 * ## HTML Tag and Attribute
 * | HTML Tag   	| data-* Attribute 										| Description  							|
 * | ------------- 	| -----------------------------------------------------	| -----------------------------------	|
 * | table	  	   	| data-duice="Grid"										| component Type is "Grid"				|
 * | table		    | data-duice-bind="{duice.data.List}"    				| defines binding List 					|
 * | table		    | data-duice-item="(alias of each item)"    			| defines name of row object			|
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/cxp4unka/embedded/html,js,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {HTMLTableElement} table - table HTML element
 */
duice.ui.Grid = function(table) {
	duice.ui.__.call(this);
	this.table = table;
	this.table.classList.add('duice-ui-grid');
	this.tbody = table.querySelector('tbody');
	this.table.removeChild(this.tbody);
	this.rows = new Array();
}

// Extends prototype
duice.ui.Grid.prototype = Object.create(duice.ui.__.prototype);

/**
 * Binds component to list data object
 * @method
 * @param {duice.data.List} list - name of list data object to bind
 */
duice.ui.Grid.prototype.bind = function(list) {
	this.list = list;
	this.list.addObserver(this);
}

/**
 * Sets item map alias
 * @method
 * @param {string} item - alias of item map
 */
duice.ui.Grid.prototype.setItem = function(item) {
	this.item = item;
}

/**
 * Sets whether editable or not
 * @method
 * @param {boolean} editable - whether editable or not
 */
duice.ui.Grid.prototype.setEditable = function(editable){
	this.editable = editable;
}

/**
 * Updates component
 * @method
 */
duice.ui.Grid.prototype.update = function() {
	
	// remove previous rows
	for(var i = 0; i < this.rows.length; i ++ ) {
		this.table.removeChild(this.rows[i]);
	}
	this.rows.length = 0;
	
	// creates new rows
	for(var index = 0; index < this.list.getRowCount(); index ++ ) {
		var map = this.list.getRow(index);
		var tbody = this.createRow(index,map);
		this.table.appendChild(tbody);
		this.rows.push(tbody);
	}

	// not found row
	if(this.list.getRowCount() < 1) {
		var emptyRow = this.createEmptyRow();
		this.table.appendChild(emptyRow);
		this.rows.push(emptyRow);
	}
}

/**
 * Creates row tbody
 * @method
 * @protected
 * @param {number} index - row index
 * @param {duice.data.map} map - row map data object
 */
duice.ui.Grid.prototype.createRow = function(index,map) {
	var $this = this;
	var table = this.table;
	var tbody = this.tbody.cloneNode(true);
	
	// setting index
	tbody.dataset.duiceIndex = index;
	
	// executes expression
	var $context = {};
	$context['index'] = index;
	$context[this.item] = map;
	tbody = this.executeExpression(tbody, $context);
	
	// creates duice element.
	duice.initialize(tbody,$context);
	
	// add current row index event listener
	tbody.addEventListener('mousedown', function(){
		$this.list.index = this.dataset.duiceIndex;
		var elements = table.querySelectorAll('tbody');
		for(var i = 0; i < elements.length; i ++ ) {
			elements[i].classList.remove('duice-ui-grid-index');
		}
		tbody.classList.add('duice-ui-grid-index');
		$this.list.index = index;
		$this.list.notifyObservers($this);
	});
	if(index == this.list.index){
		tbody.classList.add('duice-ui-grid-index');
	}
	
	// Editable 
	if(this.editable){
		
		// disable drag
		if(tbody.dataset.duiceDraggable && eval(tbody.dataset.duiceDraggable) == false){
			tbody.setAttribute('graggable',false);
			tbody.classList.remove('duice-ui-grid-draggable');
		}
		// enable drag
		else{
			tbody.setAttribute('draggable', true);
			tbody.classList.add('duice-ui-grid-draggable');
			
			// setting row drag and drop
			tbody.addEventListener('dragstart', function(ev) {
				ev.target.id = new Date().getMilliseconds();
				ev.dataTransfer.setData("id", ev.target.id);
			});
		}
			
		// disable drop
		if(tbody.dataset.duiceDroppable && eval(tbody.dataset.duiceDroppable) == false){
			tbody.addEventListener('drop',function(ev){
			    ev.preventDefault();
			    ev.stopPropagation();
			    return false;
			});
			tbody.addEventListener('dragover',function(ev){
				ev.preventDefault();
				ev.stopPropagation();
				return false;
			});
		}
		// enable drop 
		else {
			tbody.addEventListener('drop', function(ev) {
				ev.preventDefault();
				var dragedTbody = document.getElementById(ev.dataTransfer.getData("id"));
				var dropedTbody = ev.target;
				while(dropedTbody){
					if(dropedTbody.tagName == 'TBODY'){
						break;
					}
					dropedTbody = dropedTbody.parentElement;
				}
				$this.list.moveRow(dragedTbody.dataset.duiceIndex, dropedTbody.dataset.duiceIndex);
			});
			tbody.addEventListener('dragover', function(ev){
				ev.preventDefault();
			});
		}
	}
	
	// return
	return tbody;
}

/**
 * Creates empty data message row
 * @method 
 * @protected
 */
duice.ui.Grid.prototype.createEmptyRow = function() {
	var tbody = this.tbody.cloneNode(true);
	this.removeChildNodes(tbody);
	
	tbody.dataset.duiceIndex = -1;
	tbody.classList.add('duice-ui-grid-empty')
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	var colspan = this.tbody.querySelectorAll('tr > td').length;
	td.setAttribute('colspan',colspan);
	var emptyMessage = document.createElement('div');
	emptyMessage.classList.add('duice-ui-grid-empty-message');
	td.appendChild(emptyMessage);
	tr.appendChild(td);
	tbody.appendChild(tr);
	return tbody;
}

/**
 * duice.ui.Flow prototype
 * @class
 * @classdesc
 * Flow diagram component
 * ## HTML Tag and Attribute
 * | HTML Tag   	| data-* Attribute 										| Description  							|
 * | ------------- 	| -----------------------------------------------------	| -----------------------------------	|
 * | ul	  		   	| data-duice="Flow"										| component Type is "Flow"				|
 * | ul			    | data-duice-bind="(node list),(link list)" 			| defines binding node nad link list	|
 * | ul			    | data-duice-item="(alias of node item)"    			| defines name of node object			|
 * | ul 			| data-duice-node-id="(node id column)"					| defines name of node ID				|
 * | ul 			| data-duice-node-x="(node x-position column)"			| defiens x-position column in node		|
 * | ul 			| data-duice-node-y="(node y-position column)"			| defines y-position column in node		|
 * | ul 			| data-duice-link-from="(link from column)"				| defines link from column in link		|
 * | ul 			| data-duice-link-to="(link to column)"					| defines link to column in link		|
 * | ul 			| data-duice-link-text="(link text column)"				| defines link text column in link 		|
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/0L8ubpwm/embedded/html,js,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {HTMLUlElement} ul - ul HTML element
 */
duice.ui.Flow = function(ul){
	duice.ui.__.call(this);
	this.ul = ul;
	this.ul.classList.add('duice-ui-flow');
	this.ul.style.listStyleType = 'one';
	this.li = this.ul.querySelector('li');
	this.ul.removeChild(this.li);
	this.ul.style.position = 'relative';
	this.ul.style.overflow = 'scroll';
	
	// option
	this.item = null;
	this.nodeId = null;
	this.nodeX = null;
	this.nodeY = null;
	this.linkItem = null;
	this.linkFrom = null;
	this.linkTo = null;
	this.linkText = null;
}

// Extends UI component prototype
duice.ui.Flow.prototype = Object.create(duice.ui.__.prototype);

/**
 * Binds component to node,link list data object
 * @method
 * @param {duice.data.List} nodeList - list of node data object to bind
 * @param {duice.data.List> linkList - list of link data object to bind
 */
duice.ui.Flow.prototype.bind = function(nodeList,linkList) {
	this.nodeList = nodeList;
	this.linkList = linkList;
	this.nodeList.addObserver(this);
	this.linkList.addObserver(this);
}

/**
 * Sets node item alias
 * @method
 * @param {string} nodeItem - alias of child node items.
 */
duice.ui.Flow.prototype.setItem = function(item){
	this.item = item;
}

/**
 * Sets node id column
 * @method
 * @param {string} nodeId - column name of node id
 */
duice.ui.Flow.prototype.setNodeId = function(nodeId) {
	this.nodeId = nodeId;
}

/**
 * Sets node x position column name
 * @method
 * @param {string} nodeX - column name of x position
 */
duice.ui.Flow.prototype.setNodeX = function(nodeX) {
	this.nodeX = nodeX;
}

/**
 * Sets node y position column name
 * @method
 * @param {string} nodeY - column name of y position
 */
duice.ui.Flow.prototype.setNodeY = function(nodeY) {
	this.nodeY = nodeY;
}

/**
 * Sets link from column name
 * @method
 * @param {string} linkFrom - column name of link from column
 */
duice.ui.Flow.prototype.setLinkFrom = function(linkFrom) {
	this.linkFrom = linkFrom;
}

/**
 * Sets link to column name
 * @method
 * @param {string} linkTo - column name of link to
 */
duice.ui.Flow.prototype.setLinkTo = function(linkTo) {
	this.linkTo = linkTo;
}

/**
 * Sets link text column name
 * @method
 * @param {string} linkText - column name of link text
 */
// setting link text
duice.ui.Flow.prototype.setLinkText = function(linkText) {
	this.linkText = linkText;
}

/**
 * Updates component
 * @method
 */
duice.ui.Flow.prototype.update = function() {
	var $this = this;
	var ul = this.ul;
	
	// remove previous node
	var elements = this.ul.querySelectorAll('.duice-ui-flow-node');
	for(var i = 0; i < elements.length; i ++ ) 
		this.ul.removeChild(elements[i]);
	
	
	// creates node list
	for(var index = 0; index < this.nodeList.getRowCount(); index ++ ) {
		var map = this.nodeList.getRow(index);
		var li = this.createNode(index,map);
		li.dataset.duiceNodeId = map.get(this.nodeId);
		this.ul.appendChild(li);
	}
	
	// remove previous link
	var elements = this.ul.querySelectorAll('.duice-ui-flow-link');
	for(var i = 0; i < elements.length; i ++ ) {
		this.ul.removeChild(elements[i]);
	}
	
	// creates link list
	for(var index = 0; index < this.linkList.getRowCount(); index ++) {
		var map = this.linkList.getRow(index);
		var line = this.createLink(index, map);
		this.ul.appendChild(line);
	}
}

/**
 * Creates node
 * @method
 * @protected
 * @param {number} index - node index to create
 * @param {duice.data.Map} map - node map to create
 * @return {HTMLLiElement} node li HTML element
 */
duice.ui.Flow.prototype.createNode = function(index, map){
	var $this = this;
	var li = this.li.cloneNode(true);
	li.classList.add('duice-ui-flow-node');

	var $context = {};
	$context[this.item] = map;
	li = this.executeExpression(li, $context);
	li.dataset.duiceIndex = index;
	li.dataset.duiceId = map.get(this.nodeId);
	
	// setting index class
	if(index == this.nodeList.index){
		li.classList.add('duice-ui-flow-node-index');
	}
	
	// creates duice element.
	duice.initialize(li,$context);
	
	// drag
	li.style.position = 'absolute';
	li.style.zIndex = 9;
	li.style.left = map.get(this.nodeX) + 'px';
	li.style.top = map.get(this.nodeY) + 'px';
	// mouse down
	li.addEventListener('mousedown', function(ev){
		
		// setting current index
		$this.nodeList.index = index;
		var elements = $this.ul.querySelectorAll('.duice-ui-flow-node');
		for(var i = 0; i < elements.length; i ++ ) {
			elements[i].classList.remove('duice-ui-flow-node-index');
		}
		li.classList.add('duice-ui-flow-node-index');

		// mouse move
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		pos3 = ev.clientX;
		pos4 = ev.clientY;
		document.onmousemove = function(ev){
			pos1 = pos3 - ev.clientX;
			pos2 = pos4 - ev.clientY;
			pos3 = ev.clientX;
			pos4 = ev.clientY;
			li.style.left = (li.offsetLeft - pos1) + 'px';
			li.style.top = (li.offsetTop - pos2) + 'px';
			
			// mouse up
			document.onmouseup = function(ev){ 
				document.onmousemove = null;
				document.onmouseup = null;
				var x = Math.round(li.offsetLeft/10)*10;
				var y = Math.round(li.offsetTop/10)*10;
				map.set($this.nodeX,x);
				map.set($this.nodeY,y);
				$this.update();
				$this.nodeList.notifyObservers($this);
				$this.linkList.notifyObservers($this);
			};
		};
		
		// just mouse up
		document.onmouseup = function(ev){ 
			document.onmousemove = null;
			document.onmouseup = null;
			$this.nodeList.notifyObservers($this);
			$this.linkList.notifyObservers($this);
		};
	});
	return li;
}

/**
 * Creates link element and connect to node element
 * @method
 * @protected
 * @param {number} index - index to create
 * @param {duice.data.Map} map - link node to create
 */
duice.ui.Flow.prototype.createLink = function(index, map) {
	var $this = this;
	var line = document.createElement('div');
	line.style.position = 'absolute';
	line.classList.add('duice-ui-flow-link');
	line.dataset.duiceIndex = index;
	
	// setting current index
	if(index == this.linkList.index){
		line.classList.add('duice-ui-flow-link-index');
	}
	line.addEventListener('mousedown', function() {
		$this.linkList.index = index;
		var elements = $this.ul.querySelectorAll('.duice-ui-flow-link');
		for(var i = 0; i < elements.length; i ++ ) {
			elements[i].classList.remove('duice-ui-flow-link-index');
		}
		line.classList.add('duice-ui-flow-link-index');
		$this.linkList.notifyObservers($this);
	});

	
	// defines line position
	try {
		var from = this.ul.querySelector('[data-duice-node-id="' + map.get(this.linkFrom) + '"]');
		var to = this.ul.querySelector('[data-duice-node-id="' + map.get(this.linkTo) + '"]');

		var fromTop = from.offsetTop  + from.offsetHeight/2;
		var fromLeft = from.offsetLeft + from.offsetWidth/2;
		var toTop = to.offsetTop    + to.offsetHeight/2;
		var toLeft = to.offsetLeft   + to.offsetWidth/2;

		var diffTop   = Math.abs(toTop - fromTop);
		var diffLeft   = Math.abs(toLeft - fromLeft);
		var height    = Math.sqrt(diffTop*diffTop + diffLeft*diffLeft);
		var angle  = 180 / Math.PI * Math.acos( diffTop/height );

		if(toTop > fromTop){
			var top  = (toTop-fromTop)/2 + fromTop;
		}else{
			var top  = (fromTop-toTop)/2 + toTop;
		}
		if(toLeft > fromLeft){
			var left = (toLeft-fromLeft)/2 + fromLeft;
		}else{
			var left = (fromLeft-toLeft)/2 + toLeft;
		}

		if(( fromTop < toTop && fromLeft < toLeft) || ( toTop < fromTop && toLeft < fromLeft) || (fromTop > toTop && fromLeft > toLeft) || (toTop > fromTop && toLeft > fromLeft)){
		  angle *= -1;
		}
		
		// flips angle
		if(fromTop == toTop){
			if(toLeft > fromLeft){
				angle = angle + 180;
			}
		}else if(fromTop > toTop){
			angle = angle + 180;
		}
		
		top-= height/2;
		line.style["-webkit-transform"] = 'rotate('+ angle +'deg)';
		line.style["-moz-transform"] = 'rotate('+ angle +'deg)';
		line.style["-ms-transform"] = 'rotate('+ angle +'deg)';
		line.style["-o-transform"] = 'rotate('+ angle +'deg)';
		line.style["-transform"] = 'rotate('+ angle +'deg)';
		line.style.top    = top+'px';
		line.style.left   = left+'px';
		line.style.height = height + 'px';

		// creates link text
		if(this.linkText){
			var span = document.createElement('span');
			span.classList.add('duice-ui-flow-link-text');
			line.appendChild(span);	
			
			var text = map.get(this.linkText);
			span.appendChild(document.createTextNode(text));
			span.style.position = 'absolute';
			span.style.height = '20px';
			span.style.lineHeight = '20px';
			span.style.padding = '0px';
			span.style.textAlign = 'center';
			span.style.width = '100px';
			
			var textAngle = angle * -1;
			span.style["-webkit-transform"] = 'rotate('+ textAngle +'deg)';
			span.style["-moz-transform"] = 'rotate('+ textAngle +'deg)';
			span.style["-ms-transform"] = 'rotate('+ textAngle +'deg)';
			span.style["-o-transform"] = 'rotate('+ textAngle +'deg)';
			span.style["-transform"] = 'rotate('+ textAngle +'deg)';			
			span.style.top = (height/2)- 10 + 'px';
			span.style.left = -50 + 'px';
		}
		
	}catch(e){
		console.warn(e);
	}

	// return
	return line;
}

/**
 * duice.ui.Pagination prototype
 * @class
 * @classdesc
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/78o4pejk/embedded/html,js,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {HTMLUlElement} ul - ul HTML element
 */
duice.ui.Pagination = function(ul){
	duice.ui.__.call(this);
	this.ul = ul;
	this.ul.classList.add('duice-ui-pagination');
	this.ul.style.listStyleType = 'none';
	this.li = this.ul.querySelector('li');
	this.ul.removeChild(this.li);
	this.pageSize = 1;
}

// Extends UI prototype
duice.ui.Pagination.prototype = Object.create(duice.ui.__.prototype);

/**
 * Binds component to map data object
 * @method 
 * @param {duice.data.Map} map - map data object to bind
 */
duice.ui.Pagination.prototype.bind = function(map) {
	this.map = map;
	this.map.addObserver(this);
}
/**
 * setting column name specified rows value
 * @method
 * @param {number} rows - number of rows per page
 */
duice.ui.Pagination.prototype.setRows = function(rows){
	this.rows = rows;
}

/**
 * Sets current page
 * @method
 * @param {number} page - current page
 */
duice.ui.Pagination.prototype.setPage = function(page){
	this.page = page;
}

/**
 * Sets number of total row count
 * @method
 * @param {number} totalCount - number of total row count
 */
duice.ui.Pagination.prototype.setTotalCount = function(totalCount){
	this.totalCount = totalCount;
}

/**
 * Sets display page size
 * @method
 * @param {number} pageSize - page size to display
 */
duice.ui.Pagination.prototype.setPageSize = function(pageSize) {
	this.pageSize = parseInt(pageSize);
}

/**
 * Updates component
 * @method
 */
duice.ui.Pagination.prototype.update = function() {

	// remove all li element
	while (this.ul.hasChildNodes()) {
		this.ul.removeChild(this.ul.lastChild);
	}
	
	// getting pagination values
	var rows = parseInt(this.map.get(this.rows));
	var page = parseInt(this.map.get(this.page));
	var	totalCount = parseInt(this.map.get(this.totalCount));

	// creates previous item
	var itemPrev = this.createItemPrev(Math.max(page-this.pageSize,1));
	
	this.ul.appendChild(itemPrev);
	if(page == 1){
		itemPrev.onclick = null;
		itemPrev.style.pointerEvents = 'none';
	}

	// create page item
	if(this.pageSize > 1) {
		// creates page item
		var totalPage = Math.max(Math.ceil(totalCount/rows),1);
		var startPage = Math.floor((page-1)/this.pageSize)*this.pageSize + 1;
		var endPage = Math.min(startPage+this.pageSize-1, totalPage);
		for(var i = startPage; i <= endPage; i ++){
			var itemPage = this.createItemPage(i);
			if(i == page){
				itemPage.classList.add('duice-ui-pagination-item-page-index');
				itemPage.onclick = null;
				itemPage.style.pointerEvents = 'none';
			}
			this.ul.appendChild(itemPage);
		}
		
		// create next item
		var itemNext = this.createItemNext(Math.min(page+this.pageSize,totalPage));
		this.ul.appendChild(itemNext);
		if(page == totalPage) {
			itemNext.onclick = null;
			itemNext.style.pointerEvents = 'none';
		}
		
	}else{
		// creates page item
		var itemPage = this.createItemPage(page);
		itemPage.classList.add('duice-ui-pagination-item-page-index');
		itemPage.onclick = null;
		itemPage.style.pointerEvents = 'none';
		this.ul.appendChild(itemPage);
		
		// create next item
		var itemNext = this.createItemNext(page+1);
		this.ul.appendChild(itemNext);
		if(totalCount < rows) {
			itemNext.onclick = null;
			itemNext.style.pointerEvents = 'none';
		}
	}
}

/**
 * Creates item page
 * @method 
 * @protected
 * @param {number} page - page number to create
 */
duice.ui.Pagination.prototype.createItemPage = function(page) {
	var $this = this;
	var ul = this.ul;
	var li = this.li.cloneNode(true);
	li.classList.add('duice-ui-pagination-item-page');
	
	// executes expression
	var $context = {};
	$context['page'] = page;
	li = this.executeExpression(li, $context);
	return li;
}

/**
 * Creates previous page item
 * @method
 * @protected
 * @param {number} page - previous page number
 */
duice.ui.Pagination.prototype.createItemPrev = function(page) {
	var $this = this;
	var ul = this.ul;
	var li = this.li.cloneNode(true);
	li.classList.add('duice-ui-pagination-item-prev');
	
	// remove child element
	while (li.hasChildNodes()) {
		li.removeChild(li.lastChild);
	}
	// executes expression
	var $context = {};
	$context['page'] = page;
	li = this.executeExpression(li, $context);
	return li;
}

/**
 * Creates next page item
 * @method
 * @protected
 * @param {number} page - next page number
 */
duice.ui.Pagination.prototype.createItemNext = function(page) {
	var $this = this;
	var ul = this.ul;
	var li = this.li.cloneNode(true);
	li.classList.add('duice-ui-pagination-item-next');
	
	// remove child element
	while (li.hasChildNodes()) {
		li.removeChild(li.lastChild);
	}
	// executes expression
	var $context = {};
	$context['page'] = page;
	li = this.executeExpression(li, $context);
	return li;
}

/**
 * duice.ui.Dialog prototype
 * @class
 * @classdesc
 * Custom dialog message box. 
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/xphr26bz/embedded/js,html,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {HTMLElement} content - dialog contents element
 */
duice.ui.Dialog = function(content) {
	duice.ui.__.call(this);
	var $this = this;
	
	// event listener
	this.listener = {};

	// defines content
	this.content = content;
	this.parentNode = this.getParentNode(this.content);
	
	// creates dialog 
	this.dialog = document.createElement('div');
	this.dialog.classList.add('duice-ui-dialog');

	// gets parent node of content element
	
	// creates header
	this.header = document.createElement('div');
	this.header.classList.add('duice-ui-dialog-header');
	this.header.style.cursor = 'move';
	this.dialog.appendChild(this.header);
	
	// drag
	this.header.onmousedown = function(ev){
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	    pos3 = ev.clientX;
	    pos4 = ev.clientY;
	    $this.getWindow().document.onmouseup = function(ev){ 
	    	$this.getWindow().document.onmousemove = null;
	    	$this.getWindow().document.onmouseup = null;

	    };
	    $this.getWindow().document.onmousemove = function(ev){
		    pos1 = pos3 - ev.clientX;
		    pos2 = pos4 - ev.clientY;
		    pos3 = ev.clientX;
		    pos4 = ev.clientY;
		    $this.dialog.style.left = ($this.dialog.offsetLeft - pos1) + 'px';
		    $this.dialog.style.top = ($this.dialog.offsetTop - pos2) + 'px';
	    };
	};

	// creates icon
	this.icon = document.createElement('span');
	this.icon.classList.add('duice-ui-dialog-header-icon');
	this.header.appendChild(this.icon);

	// create title
	this.title = document.createElement('span');
	this.title.classList.add('duice-ui-dialog-header-title');
	this.header.appendChild(this.title);
	
	// creates exit
	this.closeButton = document.createElement('span');
	this.closeButton.classList.add('duice-ui-dialog-header-close');
	this.closeButton.addEventListener('click',function(ev){
		$this.close();
	});
	this.header.appendChild(this.closeButton);

	// creates body
	this.body = document.createElement('div');
	this.body.classList.add('duice-ui-dialog-body');
	this.dialog.appendChild(this.body);
	
}

// Extends UI prototype
duice.ui.Dialog.prototype = Object.create(duice.ui.__.prototype);

/**
 * Sets dialog icon
 * @method
 * @param {string} src - image source path
 */
duice.ui.Dialog.prototype.setIcon = function(src) {
	var img  = document.createElement('img');
	img.src = src;
	this.header.insertBefore(img,this.title);
	this.icon.remove();
	return this;
}

/**
 * Sets dialog title
 * @method
 * @param {string} title - dialog title
 */
duice.ui.Dialog.prototype.setTitle = function(title){
	this.title.appendChild(this.createHtml(title));
	return this;
}

/**
 * Opens dialog window 
 * @method
 */
duice.ui.Dialog.prototype.open = function(){

	// check before open listener
	if(this.listener.beforeOpen){
		if(this.listener.beforeOpen.call(this) == false){
			return false;
		}
	}

	// detach content from parent and append to dialog body
	this.body.appendChild(this.content);

	// blocker
	this.blocker = this.block(this.getWindow().document.body);
	
	// setting position
	this.dialog.style.position = 'fixed';
	this.dialog.style.zIndex = this.blocker.getZIndex() + 1;
	
	// adds into document
	this.getWindow().document.body.appendChild(this.dialog);
	this.content.style.display = 'block';

	// adjust top
	this.setPosition(this.dialog);
	this.dialog.style.top = '20vh';

	// display
	this.fadeIn(this.dialog);
	
	// let current active element to be blur.
	try {
		this.getWindow().document.activeElement.blur();
	}catch(ignore){
	}

	// call after close event listener
	var $this = this;
	this.delay(function() {
		if($this.listener.afterOpen){
			$this.listener.afterOpen.call($this);
		}
	});

	// on resize event
	this.getWindow().addEventListener('resize', function(ev) {
		$this.setPosition($this.dialog);
		$this.dialog.style.top = '20vh';	// adjust top
	});
}

/**
 * Closes dialog window 
 * @method
 */
duice.ui.Dialog.prototype.close = function() {
	var $this = this;
		
	// fires close listener
	if(this.listener.beforeClose){
		if(this.listener.beforeClose.call(this) == false){
			return false;
		}
	}
	
	this.fadeOut(this.dialog);
	this.blocker.release();
	
	this.delay(function(){
		
		// restore content element into parent node
		if($this.parentNode){
			$this.parentNode.appendChild($this.content);
		}
	
		// removes dialog from screen
		$this.getWindow().document.body.removeChild($this.dialog);
		$this.content.style.display = 'none';

		// calls callback function
		if($this.listener.afterClose){
			$this.listener.afterClose.call($this);
		}
	});
}

/**
 * Sets listener before open
 * @method
 * @param {function} listener -listener function before open
 * @return {this} returns this
 */
duice.ui.Dialog.prototype.beforeOpen = function(listener) {
	this.listener.beforeOpen = listener;
	return this;
}

/**
 * Sets listener after open
 * @method
 * @param {function} listener - listener function after open
 * @return {this} returns this.
 */
duice.ui.Dialog.prototype.afterOpen = function(listener) {
	this.listener.afterOpen = listener;
	return this;
}

/**
 * Sets listener before close
 * @method
 * @param {function} listener - listener function before dialog closed
 */
duice.ui.Dialog.prototype.beforeClose = function(listener){
	this.listener.beforeClose = listener;
	return this;
}

/**
 * Sets listener after close
 * @method
 * @param {function} listener - listener function after dialog closed
 */
duice.ui.Dialog.prototype.afterClose = function(listener){
	this.listener.afterClose = listener;
	return this;
}

/**
 * duice.ui.Alert prototype
 * @class
 * @classdesc
 * Custom alert dialog
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/zmf6ubn4/embedded/js,html,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {string} message - alert message
 * @return {this} returns this
 */
duice.ui.Alert = function(message){
	duice.ui.__.call(this);
	var $this = this;
	
	// listener
	this.listener = {};

	// contents
	this.content = document.createElement('div');
	this.content.classList.add('duice-ui-alert');
	
	// message
	this.message = document.createElement('div');
	this.message.classList.add('duice-ui-alert-message');
	this.message.appendChild(document.createTextNode(message));
	this.content.appendChild(this.message);
	
	// button
	this.button = document.createElement('div');
	this.button.classList.add('duice-ui-alert-button');
	this.content.appendChild(this.button);
	
	// confirm button
	this.buttonConfirm = document.createElement('button');
	this.buttonConfirm.classList.add('duice-ui-alert-button-confirm');
	this.buttonConfirm.addEventListener('click', function(){
		$this.confirm();
	});
	this.button.appendChild(this.buttonConfirm);

	// creates dialog
	this.dialog = new duice.ui.Dialog(this.content);
	
	// return self
	return this;
}

// Extends UI prototype
duice.ui.Alert.prototype = Object.create(duice.ui.__.prototype);

/**
 * Opens alert message box 
 * @method
 */
duice.ui.Alert.prototype.open = function(){
	this.dialog.open();
	this.buttonConfirm.focus();
}

/**
 * Confirms
 * @method
 */
duice.ui.Alert.prototype.confirm = function(){
	var $this = this;

	// removes dialog close event
	this.dialog.beforeClose(null);
	this.dialog.afterClose(null);
	
	// calls beforeConfirm
	if(this.listener.beforeConfirm){
		if(this.listener.beforeConfirm.call(this) == false){
			return false;
		}
	}

	// closes dialog
	this.dialog.close();
	
	// calls afterConfirm events
	if(this.listener.afterConfirm){
		this.delay(function(){
			$this.listener.afterConfirm.call($this);
		});
	}
}

/**
 * Defines before confirm event listener
 * @method
 * @param {function} listener - listener function before confirm
 * @return {this} returns this
 */
duice.ui.Alert.prototype.beforeConfirm = function(listener){
	this.listener.beforeConfirm = listener;
	this.dialog.beforeClose(listener);
	return this;
}
/**
 * Defines after confirm event listener.
 * @method
 * @param {function} listener - listener function after confirm
 * @return {this} return this
 */
duice.ui.Alert.prototype.afterConfirm = function(listener){
	this.listener.afterConfirm = listener;
	this.dialog.afterClose(listener);
	return this;
}

/**
 * duice.ui.Confirm prototype
 * @class
 * @classdesc
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/Lzd9xs8r/embedded/js,html,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {string} message - confirm message
 * @return {this} returns this
 */
duice.ui.Confirm = function(message){
	duice.ui.__.call(this);
	var $this = this;
	
	// event property
	this.listener = {};

	// contents
	this.content = document.createElement('div');
	this.content.classList.add('duice-ui-confirm');
	
	// message
	this.message = document.createElement('div');
	this.message.classList.add('duice-ui-confirm-message');
	this.message.appendChild(document.createTextNode(message));
	this.content.appendChild(this.message);
	
	// button
	this.button = document.createElement('div');
	this.button.classList.add('duice-ui-confirm-button');
	this.content.appendChild(this.button);
	
	// confirm button
	this.buttonConfirm = document.createElement('button');
	this.buttonConfirm.classList.add('duice-ui-confirm-button-confirm');
	this.buttonConfirm.addEventListener('click', function(){
		$this.confirm();
	});
	this.button.appendChild(this.buttonConfirm);
	
	// confirm button
	this.buttonCancel = document.createElement('button');
	this.buttonCancel.classList.add('duice-ui-confirm-button-cancel');
	this.buttonCancel.addEventListener('click', function(){
		$this.cancel();
	});
	this.button.appendChild(this.buttonCancel);

	// creates dialog
	this.dialog = new duice.ui.Dialog(this.content);
	
	// return self
	return this;
}

// Extends UI component prototype
duice.ui.Confirm.prototype = Object.create(duice.ui.__.prototype);

/**
 * Opens confirm dialog
 * @method
 */
duice.ui.Confirm.prototype.open = function(){
	this.dialog.open();
	this.buttonCancel.focus();
}

/**
 * Confirm
 * @method
 */
duice.ui.Confirm.prototype.confirm = function(){
	var $this = this;
	
	// executes beforeConfirm listener
	if(this.listener.beforeConfirm){
		if(this.listener.beforeConfirm.call(this) == false){
			return false;
		}
	}

	// closes dialog
	this.dialog.close();	
	
	// executes afterConfirm listener.
	if(this.listener.afterConfirm) {
		this.delay(function(){
			$this.listener.afterConfirm.call($this);
		});
	}
}

/**
 * Cancel
 * @method
 */
duice.ui.Confirm.prototype.cancel = function(){
	var $this = this;

	// clear dialog close event
	this.dialog.beforeClose(null);
	this.dialog.afterClose(null);
	
	// executes beforeCancel
	if(this.listener.beforeCancel){
		if(this.listener.beforeCancel.call(this) == false){
			return false;
		}
	}
	
	// closes dialog
	this.dialog.close();
	
	// executes afterCancel listener.
	if(this.listener.afterCancel) {
		this.delay(function(){
			$this.listener.afterCancel.call($this);
		});
	}
}

/**
 * Defines before confirm event listener
 * @method
 * @param {function} listener - listener functon before confirm
 */
duice.ui.Confirm.prototype.beforeConfirm = function(listener){
	this.listener.beforeConfirm = listener;
	return this;
}

/**
 * Defines after confirm event listener.
 * @method
 * @param {function} listener - listener function before confirm
 * @return {this} returns this
 */
duice.ui.Confirm.prototype.afterConfirm = function(listener){
	this.listener.afterConfirm = listener;
	return this;
}

/**
 * Defines before cancel event listener.
 * @method
 * @param {function} listener - listener function before cancel.
 * @return {this} returns this.
 */
duice.ui.Confirm.prototype.beforeCancel = function(listener){
	this.listener.beforeCancel = listener;
	this.dialog.beforeClose(listener);
	return this;
}

/**
 * Defines after cancel event listener.
 * @method
 * @param {function} listener - listener function after cancel
 * @return {this} returns this
 */
duice.ui.Confirm.prototype.afterCancel = function(listener){
	this.listener.afterCancel = listener;
	this.dialog.afterClose(listener);
	return this;
}

/**
 * duice.ui.Prompt prototype
 * @class
 * @classdesc
 * Custom prompt message box
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/75t8kfxs/embedded/js,html,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 * @constructor
 * @param {string} message - prompt dialog message
 */
duice.ui.Prompt = function(message){
	duice.ui.__.call(this);
	var $this = this;

	// event property
	this.listener = {};

	// contents
	this.content = document.createElement('div');
	this.content.classList.add('duice-ui-prompt');
	
	// message
	this.message = document.createElement('div');
	this.message.classList.add('duice-ui-prompt-message');
	this.message.appendChild(document.createTextNode(message));
	this.content.appendChild(this.message);

	// input
	this.input = document.createElement('input');
	this.input.classList.add('duice-ui-prompt-input');
	this.input.type = 'text'
	this.content.appendChild(this.input);

	// button
	this.button = document.createElement('div');
	this.button.classList.add('duice-ui-prompt-button');
	this.content.appendChild(this.button);
	
	// confirm button
	this.buttonConfirm = document.createElement('button');
	this.buttonConfirm.classList.add('duice-ui-prompt-button-confirm');
	this.buttonConfirm.addEventListener('click', function(){
		$this.confirm();
	});
	this.button.appendChild(this.buttonConfirm);
	
	// confirm button
	this.buttonCancel = document.createElement('button');
	this.buttonCancel.classList.add('duice-ui-prompt-button-cancel');
	this.buttonCancel.addEventListener('click', function(){
		$this.cancel();
	});
	this.button.appendChild(this.buttonCancel);

	// creates dialog
	this.dialog = new duice.ui.Dialog(this.content);
	
	return this;
}

// Extends UI component prototype
duice.ui.Prompt.prototype = Object.create(duice.ui.__.prototype);

/**
 * Opens prompt message dialog
 * @method
 */
duice.ui.Prompt.prototype.open = function(){
	this.dialog.open();
	this.input.focus();
	return this;
}

/**
 * Confirm
 * @method
 */
duice.ui.Prompt.prototype.confirm = function() {
	var $this = this;
	
	// removes dialog close event
	this.dialog.beforeClose(null);
	this.dialog.afterClose(null);

	// executes before cancel
	if(this.listener.beforeConfirm){
		if(this.listener.beforeConfirm.call(this, { value: this.input.value }) == false){
			return false;
		}
	}
	
	// closes dialog
	this.dialog.close();
	
	// executes afterConfirm listener.
	if(this.listener.afterConfirm) {
		this.delay(function(){
			$this.listener.afterConfirm.call($this, { value: $this.input.value });
		});
	}
}

/**
 * Cancel
 * @method
 */
duice.ui.Prompt.prototype.cancel = function() {
	var $this = this;

	// removes dialog close event
	this.dialog.beforeClose(null);
	this.dialog.afterClose(null);
	
	// executes before cancel
	if(this.listener.beforeCancel){
		if(this.listener.beforeCancel.call(this, { value: this.input.value }) == false){
			return false;
		}
	}
	
	// closes dialog
	this.dialog.close();	
	
	// executes afterCancel listener.
	if(this.listener.afterCancel) {
		this.delay(function(){
			$this.listener.afterCancel.call($this, { value: $this.input.value });
		});
	}
}

/**
 * Returns input value
 * @method
 * @return {string} input value
 */
duice.ui.Prompt.prototype.getValue = function() {
	return this.input.value;
}

/**
 * Defines before confirm event listener
 * @method
 * @param {function} listener - listener function before confirm
 * @return {this} returns this
 */
duice.ui.Prompt.prototype.beforeConfirm = function(listener){
	this.listener.beforeConfirm = listener;
	return this;
}

/**
 * Defines after confirm event listener.
 * @method
 * @param {function} listener - listener function after confirm
 * @return {this} returns this
 */
duice.ui.Prompt.prototype.afterConfirm = function(listener){
	this.listener.afterConfirm = listener;
	return this;
}

/**
 * Defines before cancel event listener.
 * @method
 * @param {function} listener - listener function before cancel
 * @return {this} returns this
 */
duice.ui.Prompt.prototype.beforeCancel = function(listener){
	this.listener.beforeCancel = listener;
	this.dialog.beforeClose(listener);
	return this;
}

/**
 * Defines after cancel event listener.
 * @method
 * @param {function} listener - listener function after cancel
 * @return {this} returns this
 */
duice.ui.Prompt.prototype.afterCancel = function(listener){
	this.listener.afterCancel = listener;
	this.dialog.afterClose(listener);
	return this;
}

/**
 * Utilities package
 * @namespace
 */
duice.util = {};

/**
 * duice.util.StringUtils
 * @class
 * @classdesc
 * String utiltity object
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/2mds7zw1/embedded/js,html,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 */
duice.util.StringUtils = {
	/**
	 * Checks empty
	 * @method
	 * @param {string} value - value to check
	 * @return {boolean} returns whether emtpry or not
	 */
	isEmpty: function(value) {
		if(value === null || value === undefined || value.trim().length < 1){
			return true;
		}else{
			return false;
		}
	},
	/**
	 * Checks value is number
	 * @method
	 * @param {string} value - value to check
	 * @return {boolean} returns result of check
	 */
	isNumber: function(value){
		var pattern = /^[0-9]{1,}$/;
		return pattern.test(value);
	},
	/**
	 * Checks value is alphabet
	 * @method
	 * @param {string} value - value to check
	 * @return {boolean} returns result of checking
	 */
	isAlphabet: function(value){
		var pattern = /^[a-zA-Z]{1,}$/;
		return pattern.test(value);
	},
	/**
	 * Checks value is alphabet and number
	 * @method
	 * @param {string} value - value to check
	 * @return {boolean} returns result of checking
	 */
	isAlphabetNumber: function(value){
		var pattern = /^[a-zA-Z0-9]{1,}$/;
		return pattern.test(value);
	},
	/**
	 * Checks value string is decimal type
	 * @method
	 * @param {string} value - value to check
	 * @return {boolean} returns whether value is decimal format or not
	 */
	isDecimal: function(value){
		var pattern = /^[0-9\,\.]{1,}$/;
		return pattern.test(value);
	},
	/**
	 * Checks value size
	 * @method
	 * @param {string} value for checking
	 * @param {number} valid minimum length
	 * @param {number} valid maximum length
	 */
	isLengthBetween: function(value, min, max) {
		if(!value) {
			return false;
		}
		var length = value.length;
		if(min <= length && length <= max){
			return true;
		}else{
			return false;
		}
	},
	/**
	 * Checks generic ID (alphabet + number + -,_), but does not check length.
	 * @method
	 * @param {string} value for checking.
	 */
	isGenericId: function(value){
		var pattern = /^[a-zA-Z0-9\-\_]{1,}$/;
		return pattern.test(value);
	},
	/**
	 * Checks generic password (At least 1 alphabet, 1 number, 1 special char)
	 * @method
	 * @param {string} value - value to check
	 * @return {boolean} returns value is generic password format
	 */
	isGenericPassword: function(value){
		var pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
		return pattern.test(value);
	},
	/**
	 * Checks if value is email format
	 * @method
	 * @param {string} value - value to check
	 * @return {boolean} return value is email format.
	 */
	isEmailAddress: function(value){
		var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		return pattern.test(value);
	},
	/**
	 * Check if value is phone number format
	 * @method
	 * @param {string} value - value to check
	 * @return {boolean} return value is phone number format.
	 */
	isPhoneNumber: function(value){
		var pattern =/^[0-9\-]{11,}$/; 
		return pattern.test(value);
	},
	/**
	 * Checks if value is URL address format
	 * @method
	 * @param {string} value - value to check
	 * @return {boolean} return value is URL address format.
	 */
	isUrlAddress: function(value){
		var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		return pattern.test(value);
	}
}

/**
 * duice.util.FormatUtils
 * @class
 * @classdesc
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/7wrzgvd0/embedded/js,html,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 */
duice.util.FormatUtils = {
	/**
	 * Converts date to formatted string.
	 * @method
	 * @param {Date} date - date object to convert.
	 * @param {string} format - date format to convert
	 * @return {string} Returns converted formatted date string.
	 */
	toDateFormat: function(date, format){
		String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
		String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
		Number.prototype.zf = function(len){return this.toString().zf(len);};
		
		var weekName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
		var d = date instanceof Date ? d : new Date(date);
	
		// check date
		if(isNaN(d.getTime())){
			return '';
		}

		var formatRex = /yyyy|yy|MM|dd|E|HH|hh|mm|ss|ap/gi;
		var dateString = format.replace(formatRex, function($1) {
			switch ($1) {
				case "yyyy": return d.getFullYear();
				case "yy": return (d.getFullYear() % 1000).zf(2);
				case "MM": return (d.getMonth() + 1).zf(2);
				case "dd": return d.getDate().zf(2);
				case "E": return weekName[d.getDay()];
				case "HH": return d.getHours().zf(2);
				case "hh": return (d.getHours() <= 12 ? d.getHours() : d.getHours()%12).zf(2);
				case "mm": return d.getMinutes().zf(2);
				case "ss": return d.getSeconds().zf(2);
				case "ap": return d.getHours() < 12 ? 'AM' : 'PM';
				default: return $1;
			}
		});
		return dateString;
	},
	/**
	 * Converts number to formatted number string
	 * @method
	 * @param {number} number - number to convert
	 * @param {string} scale - number scale
	 * @return {string} returns formatted number string.
	 */
	toNumberFormat: function(number, scale){
		if(typeof number !== 'number'){
			number = new Number(0);
		}
	    var reg = /(^[+-]?\d+)(\d{3})/;
	    var n = number.toFixed(scale);
	    while (reg.test(n)) {
	    	n = n.replace(reg, '$1' + ',' + '$2');
	    }
	    return n;
	}
}

/**
 * duice.util.RandomUtils
 * @class
 * @classdesc
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/qL459fxa/embedded/js,html,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 */
duice.util.RandomUtils = {
	/**
	 * Generates UUID
	 * @method
	 * @return {string} returns random UUID
	 */
	generateUUID: function() {
		var dt = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (dt + Math.random()*16)%16 | 0;
			dt = Math.floor(dt/16);
			return (c=='x' ? r :(r&0x3|0x8)).toString(16);
		});
		return uuid;
	}
}

/**
 * duice.util.MarkdownParser
 * @class
 * @classdesc
 * <iframe width="100%" height="600" src="//jsfiddle.net/chomookun/oy8tp094/embedded/js,html,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
 */
duice.util.MarkdownParser = {
	COMPLETE_MARK: "<!--COMPLETE-->",
	/**
	 * parse
	 * @method
	 * @param {string} value - original markdown text
	 * @return {string} HTML string to be parsed
	 */
	parse: function(value) {

		// parses block element
		value = this.parseBlock(value);
		
		// parses in-line element
		var lines = value.split('\n');
		for(var i = 0, size = lines.length; i < size; i ++){

			// parses inline	
			lines[i] = this.parseInline(lines[i]);
			
			// removes compplte mark
			lines[i] = lines[i].replace(this.COMPLETE_MARK,'');
		}
		value = lines.join('\n');

		// return parsed value
		return value;
	},
	/**
	 * Pasres block
	 * @method
	 * @param {string) value - markdown text
	 * @return {string) markdown HTML with parsed table
	 */
	parseBlock: function(value){
		var $this = this;

		// table
		var tableRegx = /(^\|.+\|\n)+/gm;
		value = value.replace(tableRegx, function(match){
			var tableHtml = new Array();
			tableHtml.push($this.COMPLETE_MARK + '<table>');
			var lines = match.split('\n');
			var isHeader = true;
			for(var i = 0; i < lines.length; i ++){
				var line = lines[i];

				// checks valid row
				if(/^\|.+\|$/gm.test(line) == false){
					continue;
				}

				// checks if split row between header and body
				if(/^\|[ \t-:\|]*\|/.test(line) == true){
					isHeader = false;
					continue;
				}

				// repleace header and body
				if(isHeader == true){
					line = $this.COMPLETE_MARK + line.replace(/\|/gm,'</th><th>').replace(/^<\/th>/gm,'<tr>').replace(/<th>$/gm,'</tr>');
				}else{
					line = $this.COMPLETE_MARK + line.replace(/\|/gm,'</td><td>').replace(/^<\/td>/gm,'<tr>').replace(/<td>$/gm,'</tr>');
				}
				tableHtml.push(line);
			}
			tableHtml.push($this.COMPLETE_MARK + '</table>');
			return tableHtml.join('\n') + '\n';
		});

		// code
		value = value.replace(/[\`]{3}([\w]*)\n([^\`]+)\n[\`]{3}/g, function(match,language,code){
			var codeHtml = new Array();
			codeHtml.push($this.COMPLETE_MARK + '<code data-langhage="' + language + '">');
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
				codeHtml.push($this.COMPLETE_MARK + line);
			}
			codeHtml.push($this.COMPLETE_MARK + '</code>');
			return codeHtml.join('\n') + '\n';
		});
		
		//ul
		value = value.replace(/(^[ \t]*[\*\-]\s+.+\n)+/gm, function(match) {
			var ulHtml = new Array();
			ulHtml.push($this.COMPLETE_MARK + '<ul>');
			var lines = match.split('\n');
			for(var i = 0; i < lines.length; i++){
				var line = lines[i];
				if(line.trim().length < 1){
					continue;
				}
				line = line.replace(/^[ \t]*[\*\-]\s+(.+)/gm,'<li>$1</li>');
				ulHtml.push($this.COMPLETE_MARK + line);
			}
			ulHtml.push($this.COMPLETE_MARK + '</ul>');
			return ulHtml.join('\n') + '\n';
		});
		
		//ol
		value = value.replace(/(^[ \t]*[\d]+[\.]?\s+.+\n)+/gm, function(match) {
			var olHtml = new Array();
			olHtml.push($this.COMPLETE_MARK + '<ol>');
			var lines = match.split('\n');
			for(var i = 0; i < lines.length; i++){
				var line = lines[i];
				if(line.trim().length < 1){
					continue;
				}
				line = line.replace(/^[ \t]*[\d]+[\.]?\s+(.+)/gm,'<li>$1</li>');
				olHtml.push($this.COMPLETE_MARK + line);
			}
			olHtml.push($this.COMPLETE_MARK + '</ol>');
			return olHtml.join('\n') + '\n';
		});

		// title
		value = value.replace(/^[\#]{6}\s(.+)/gm, this.COMPLETE_MARK + '<h6>$1</h6>');
		value = value.replace(/^[\#]{5}\s(.+)/gm, this.COMPLETE_MARK + '<h5>$1</h5>');
		value = value.replace(/^[\#]{4}\s(.+)/gm, this.COMPLETE_MARK + '<h4>$1</h4>');
		value = value.replace(/^[\#]{3}\s(.+)/gm, this.COMPLETE_MARK + '<h3>$1</h3>');
		value = value.replace(/^[\#]{2}\s(.+)/gm, this.COMPLETE_MARK + '<h2>$1</h2>');
		value = value.replace(/^[\#]{1}\s(.+)/gm, this.COMPLETE_MARK + '<h1>$1</h1>');

		// hr
		value = value.replace(/(^[\-\=]{5,}\n)/gm, function(match){
			return $this.COMPLETE_MARK + '<hr/>';
		});

		// plantuml extention
		if(deflate && encode64){
			value = value.replace(/^@startuml[ \t]*(.*)\n((.|\n)*?)^@enduml\n/gm, function(match,attr){
				var s = unescape(encodeURIComponent(match));
				s = deflate(s);
				s = encode64(s);	
				return '<img src="http://www.plantuml.com/plantuml/img/' + s +'" ' + attr + '/>';
			});
		}

		// return
		return value;	
	},
	/**
	 * parses inline
	 * @method 
	 * @param {string} value - value
	 * @return {string} 
	 */
	parseInline: function(value){
	
		// font style
		value = value.replace(/\*{2}([^\*].+)\*{2}/gm, '<b>$1</b>');
		value = value.replace(/\_{2}([^\_].+)\_{2}/gm, '<em>$1</em>');
		value = value.replace(/\~{2}([^\~].+)\~{2}/gm, '<del>$1</del>');

		// image
		value = value.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" />');

		// link
		value = value.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4">$1</a>');

		// return
		return value;	
	}
}

/**
 * duice.util.WebSocketClient
 * @class
 * @classdesc
 * <iframe width="100%" height="300" src="//jsfiddle.net/chomookun/5p79wkcu/embedded/js,html,css,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe> 
 * @constructor
 * @param {string} url - websocket connect URL
 */
duice.util.WebSocketClient = function(url) {
	this.url = url;
	this.listener = {};
	this.reconnectInterval = 3*1000;	// ms
	this.messageHandlers = [];
	return this;
}
duice.util.WebSocketClient.prototype = {
	/**
	 * open 
	 * @method
	 */
	open: function() {
		this.webSocket = new WebSocket(this.url);
		var $this = this;
		this.webSocket.onopen = function(event){
			if($this.listener.onOpen){
				$this.listener.onOpen.call($this,event);
			}
		}
		this.webSocket.onmessage = function(event){
			if($this.listener.onMessage){
				$this.listener.onMessage.call($this,event);
			}
			$this.messageHandlers.forEach(function(messageHandler){
				messageHandler.call(this, event);
			});
		}
		this.webSocket.onclose = function(ev){
			if($this.listener.onClose){
				$this.listener.onClose.call($this,event);
			}
			// reconnect
			setTimeout(function(){
				$this.open($this.url);
			},$this.reconnectInterval);
		}
		this.webSocket.onerror = function(ev){
			if($this.listener.onError){
				$this.listener.onError.call($this,event);
			}
		}
	},
	/**
	 * Sends message
	 * @method
	 * @param {string} message - message string to send
	 */
	send: function(message) {
		this.webSocket.send(message);
	},
	/**
	 * Sets open event listener function
	 * @method
	 * @param {function} listener - event listener function on open
	 */
	onOpen: function(listener) {
		this.listener.onOpen = listener;
	},
	/**
	 * Sets on message listener function
	 * @method
	 * @param {function} listener - event listener function on message received.
	 */
	onMessage: function(listener) {
		this.listener.onMessage = listener;
	},
	/**
	 * Sets socket closed event listener function
	 * @method
	 * @param {function} listener - event listener functon on socket closed.
	 */
	onClose: function(listener) {
		this.listener.onClose = listener;
	},
	/**
	 * Sets error event listener function
	 * @method
	 * @param {function} listener - event listener function on error occured.
	 */
	onError: function(listener){
		this.listener.onError = listener;
	},
	/**
	 * Sets re-connect interval(milliseconds)
	 * @method 
	 * @param {number} value - reconnect interval milliseconds
	 */
	setReconnectInterval: function(value){
		this.reconnectInterval = value;
	},
	/**
	 * Adds handler function when message received.
	 * @method
	 * @param {function} handler - message listener function when message is received.
	 */
	addMessageHandler: function(handler){
		this.messageHandlers.push(handler);
	}
}

//-----------------------------------------------------------------------------
// DOMContentLoaded event process
//-----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function(event) {
	var $context = typeof global !== 'undefined' ? global : 
					typeof self !== 'undefined' ? self : 
					typeof window !== 'undefined' ? window :
					{};
	duice.initialize(document,$context);
});

