/**
 * JUICE (Javascript UI Component Engine)
 * - Anyone can use it freely.
 * - Modify the source or allow re-creation. However, you must state that you have the original creator.
 * - However, we can not grant patents or licenses for reproductives. (Modifications or reproductions must be shared with the public.)
 * Licence: LGPL(GNU Lesser General Public License version 3)
 * Copyright (C) 2017 juice.oopscraft.net
 */
"use strict";

/**
 * Defines package
 */
var juice = {
	data:{},	// Data structure package
	ui:{},		// UI component package
	util:{}		// Utilities package
};

/**
 * DataMap prototype
 */
juice.data.Map = function(json) {
	this.data = {};
	this.observers = new Array();
	this.listener = {};
	this.parentNode = null;
	this.childNodes = new Array();
	if(json) {
		this.fromJson(json);
	}
}
juice.data.Map.prototype = {
	/* load data from json object*/
	fromJson: function(json) {
		this.data = {};
		for(var name in json){
			var value = json[name];
			this.data[name] = value;
		}
		this.notifyObservers();
	},
	/* convert data into json object */
	toJson: function() {
		var json = {};
		for(var name in this.data){
			var value = this.data[name];
			json[name] = value;
		}
		return json;
	},
	/* add observer */
	addObserver: function(observer) {
		this.observers.push(observer);
	},
	/* notify observer */
	notifyObservers: function() {
		for(var i = 0; i < this.observers.length; i++){
			this.observers[i].update();
		}
	},
	/* setting value */
	set: function(name,value) {
		var event = {name:name, value:value};
		if(this.listener.change && this.listener.change.call(this,event) == false){
			this.notifyObservers();
			return false;
		}
		this.data[name] = value;
		this.notifyObservers();
	},
	/* getting value */
	get: function(name){
		return this.data[name];
	},
	/* getting column names */
	getNames: function() {
		var names = new Array();
		for(var name in this.data){
			names.push(name);
		}
		return names;
	},
	/* get parent node */
	getParentNode: function(){
		return this.parentNode;
	},
	/* get child node */
	getChildNodes: function(){
		return this.childNodes;
	},
	/* return specified child node */
	getChildNode: function(index){
		return this.childNodes[index];
	},
	/* adds child node */
	addChildNode: function(map){
		map.parentNode = this;
		this.childNodes.push(map);
		this.notifyObservers();
	},
	/* insert child node */
	insertChildNode: function(index,map){
		map.parentNode = this;
		this.childNodes.splice(index,0,map);
		this.notifyObservers();
	},
	/* remove specified child node */
	removeChildNode: function(index){
		this.childNodes.splice(index,1);
		this.notifyObservers();
	},
	/* listen change event */
	onChange: function(listener){
		this.listener.change = listener;
	}
}

/**
 * DataList prototype
 */
juice.data.List = function(json) {
	this.mapList = new Array();
	this.observers = new Array();
	this.index = -1;
	if(json) {
		this.fromJson(json);
	}
}
juice.data.List.prototype = {
	/* load data from json */
	fromJson: function(json){
		this.mapList = new Array();
		for(var i = 0; i < json.length; i ++ ) {
			var map = new juice.data.Map();
			map.fromJson(json[i]);
			map.addObserver(this);
			this.mapList.push(map);
		}
		this.index = -1;
		this.notifyObservers();
	},
	/* convert to json object */
	toJson: function() {
		var json = new Array();
		for(var i = 0; i < this.mapList.length; i ++){
			json.push(this.mapList[i].toJson());
		}
		return json;
	},
	/* add observer */
	addObserver: function(observer) {
		this.observers.push(observer);
	},
	/* notify chages to observers */
	notifyObservers: function(observer) {
		for(var i = 0; i < this.observers.length; i++){
			if(this.observers[i] == observer){
				continue;
			}
			this.observers[i].update();
		}
	},
	/* update */
	update: function(){
		this.notifyObservers();
	},
	/* set index */
	setIndex: function(index) {
		this.index = index;
		this.notifyObservers();
	},
	/* get current select row index */
	getIndex: function() {
		return this.index;
	},
	/* returns current row count */
	getRowCount: function() {
		return this.mapList.length;
	},
	/* returns specified row */
	getRow: function(index) {
		return this.mapList[index];
	},
	/* adds new row map into list */
	addRow: function(map){
		map.addObserver(this);
		this.mapList.push(map);
		this.index = this.getRowCount();
		this.notifyObservers();
	},
	/* moves from row into to row */
	moveRow: function(from, to) {
		this.index = from;
		this.mapList.splice(to, 0, this.mapList.splice(from, 1)[0]);
		this.index = to;
		this.notifyObservers();
	},
	/* insert row map into specified position */
	insertRow: function(index, map){
		map.addObserver(this);
		this.mapList.splice(index, 0, map);
		this.index = index;
		this.notifyObservers();
	},
	/* removes specified row map */
	removeRow: function(index){
		this.mapList.splice(index, 1);
		this.notifyObservers();
	}
}

/**
 * juice.data.tree prototype
 */
juice.data.Tree = function(json,linkNodeName) {
	this.rootNode = new juice.data.Map();
	this.observers = new Array();
	if(json) {
		this.fromJson(json,linkNodeName);
	}
}
juice.data.Tree.prototype = {
	/* load data from JSON Array */ 
	fromJson: function(json,linkNodeName){
		this.rootNode = new juice.data.Map();
		for(var i = 0; i < json.length; i ++){
			var node = new juice.data.Map();
			node.fromJson(json[i]);
			makeTree(node);
			this.rootNode.addChildNode(node);
		}
		function makeTree(node) {
			var childNodes = node.get(linkNodeName);
			if(childNodes){
				for(var i = 0; i < childNodes.length; i ++){
					var childNode = new juice.data.Map();
					childNode.fromJson(childNodes[i]);
					makeTree(childNode);
					node.addChildNode(childNode);
				}
			}
		}
		this.notifyObservers();
	},
	/* convert into JSON Array */
	toJson: function(linkNodeName){
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
				json[linkNodeName] = new Array();
				for(var i = 0; i < childNodes.length; i ++){
					var childNode = childNodes[i];
					var childJson = makeJson(childNode);
					json[linkNodeName].push(childJson);
				}
			}
			return json;
		}
		return json;
	},
	/* add observer */
	addObserver: function(observer) {
		this.observers.push(observer);
	},
	/* notify chages to observers */
	notifyObservers: function() {
		for(var i = 0; i < this.observers.length; i++){
			this.observers[i].update();
		}
	},
	/* get rootNode */
	getRootNode: function() {
		return this.rootNode;
	},
	/* get tree node */
	getNode: function(index){
		var node = this.rootNode;
		for(var i = 0; i < index.length; i ++){
			var childNodes = node.getChildNodes();
			node = childNodes[index[i]];
		}
		return node;
	},
	/* remove node */
	removeNode: function(index){
		var node = this.getNode(index);
		var parentNode = node.getParentNode();
		parentNode.removeChildNode(index[index.length-1]);
		this.notifyObservers();
	},
	/* moves node */
	moveNode: function(from, to){
		var fromNode = this.getNode(from);
		var toNode = this.getNode(to);
		
		//remove
		var fromParentNode = fromNode.getParentNode();
		fromParentNode.removeChildNode(from[from.length-1]);
		
		// insert
		var toParentNode = toNode.getParentNode();
		toParentNode.insertChildNode(to[to.length-1],fromNode);
		
		// notify 
		this.notifyObservers();
	},
	/* move node to child */
	moveNodeToChild: function(from, to){
		var fromNode = this.getNode(from);
		var toNode = this.getNode(to);
		
		//remove
		var fromParentNode = fromNode.getParentNode();
		fromParentNode.removeChildNode(from[from.length-1]);
		
		// insert as child
		toNode.addChildNode(fromNode);
		
		// notify 
		this.notifyObservers();
	}
}

/**
 * Label prototype
 */
juice.ui.Label = function(label) {
	this.label = label;
	this.label.classList.add('juice-ui-label');
}
juice.ui.Label.prototype = {
	bind: function(map, name) {
		this.map = map;
		this.name = name;
		this.map.addObserver(this);
	},
	update: function() {
		while (this.label.firstChild) {
		    this.label.removeChild(this.label.firstChild);
		}
		var value = this.map.get(this.name) == undefined ? '' : this.map.get(this.name);
		if(this.mask){
			this.label.appendChild(document.createTextNode(juice.util.MaskFormatter.mask(this.mask, value)));
		}else{
			this.label.appendChild(document.createTextNode(value));
		}
	},
	setMask: function(mask){
		this.mask = mask;
	}
}

/**
 * TextField prototype
 */
juice.ui.TextField = function(input){
	this.input = input;
	this.input.classList.add('juice-ui-textField');
}
juice.ui.TextField.prototype = {
	bind: function(map, name) {
		var $this = this;
		this.map = map;
		this.name = name;
		this.map.addObserver(this);
		this.input.addEventListener('change',function(){
			if($this.validator){
				if($this.validator.call(this,this.value) == false) {
					$this.update();
					this.focus();
					return;
				}
			}
			if($this.mask){
				map.set(name, juice.util.MaskFormatter.unmask($this.mask, this.value));
			}else{
				map.set(name, this.value);
			}
		});
	},
	update: function() {
		var value = this.map.get(this.name) == undefined ? '' : this.map.get(this.name);
		if(this.mask){
			this.input.value = juice.util.MaskFormatter.mask(this.mask, value);
		}else{
			this.input.value = value;
		}
	},
	setMask: function(mask){
		this.mask = mask;
	},
	setValidator: function(validator){
		this.validator = validator;
	}
}

/**
 * ComboBox prototype
 */
juice.ui.ComboBox = function(select) {
	this.select = select;
	this.select.classList.add('juice-ui-comboBox');
}
juice.ui.ComboBox.prototype = {
	options: function(options){
		for(var i = 0; i < options.length; i++){
			var option = document.createElement('option');
			option.value = options[i]['value'] || '';
			option.appendChild(document.createTextNode(options[i]['text']));
			if(options[i]['disabled']){
				option.disabled = options[i]['disabled'];
			}
			if(options[i].style){
				for(var property in options[i].style){
					option.style[property] = options[i].style[property];
				}
			}
			this.select.appendChild(option);
		}
	},
	bind: function(map, name) {
		this.map = map;
		this.name = name;
		this.map.addObserver(this);
		this.select.addEventListener('change',function(){
			map.set(name, this.value);	
		});
	},
	update: function() {
		this.select.value = this.map.get(this.name) || '';
	}
}

/**
 * CheckBox prototype
 */
juice.ui.CheckBox = function(input) {
	this.input = input;
	this.input.type = 'checkbox';
	this.input.classList.add('juice-ui-checkBox');
}
juice.ui.CheckBox.prototype = {
	bind: function(map,name) {
		this.map = map;
		this.name = name;
		this.map.addObserver(this);
		this.input.addEventListener('change', function() {
			map.set(name, this.checked);
		});
	},
	update: function() {
		if(this.map.get(this.name) == true) {
			this.input.checked = true;
		}else{
			this.input.checked = false;
		}
	}
}

/**
 * Radio prototype
 */
juice.ui.Radio = function(input) {
	this.input = input;
	this.input.type = 'radio';
	this.input.classList.add('juice-ui-radio');
}
juice.ui.Radio.prototype = {
	bind: function(map,name) {
		this.map = map;
		this.name = name;
		this.map.addObserver(this);
		this.input.addEventListener('change', function() {
			map.set(name, this.value);
		});
	},
	update: function(){
		if(this.map.get(this.name) == this.input.value) {
			this.input.checked = true;
		}else{
			this.input.checked = false;
		}
	}
}

/**
 * TextArea prototype
 */
juice.ui.TextArea = function(textarea) {
	this.textarea = textarea;
	this.textarea.classList.add('juice-ui-textArea');
}
juice.ui.TextArea.prototype = {
	bind: function(map,name) {
		this.map = map;
		this.name = name;
		this.map.addObserver(this);
		this.textarea.name = name;
		this.textarea.value = map.get(name);
		var $this = this;
		this.textarea.addEventListener('change',function(){
			map.set(this.name, this.value);
		});
	},
	update: function() {
		this.textarea.value = this.map.get(this.name) || '';
	}
}

/**
 * HtmlEditor prototype
 */
juice.ui.HtmlEditor = function(div) {
	var $this = this;
	this.div = div;
	this.div.classList.add('juice-ui-htmlEditor');
	
	// create toolbar
	this.toolbar = this.createToolbar();
	this.toolbar.classList.add('juice-ui-htmlEditor-toolbar');
	this.div.appendChild(this.toolbar);
	
	// create content
	this.content = document.createElement('div');
	this.content.classList.add('juice-ui-htmlEditor-content');
	this.iframe = document.createElement('iframe');
	this.content.appendChild(this.iframe);
	this.textarea = document.createElement('textarea');
	this.textarea.style.display = 'none';
	this.content.appendChild(this.textarea);
	this.div.appendChild(this.content);
	
	// iframe designMode 
	this.iframe.contentDocument.designMode = "on";

	// iframe specific
	this.iframe.addEventListener('DOMNodeInsertedIntoDocument', function(){
		$this.bind($this.map, $this.name);
	});
}
juice.ui.HtmlEditor.prototype = {
	bind: function(map,name) {
		this.map = map;
		this.name = name;
		this.map.addObserver(this);
		this.iframe.contentDocument.designMode = "on";
		this.iframe.contentDocument.addEventListener('DOMSubtreeModified', function(){
			if(map.get(name) != this.body.innerHTML){
				map.set(name, this.body.innerHTML);
			}
		});
		this.textarea.addEventListener('change', function(){
			map.set(name, this.value);
		});
	},
	update: function() {
		if(this.iframe.contentDocument.body.innerHTML != this.map.get(this.name)) {
			this.iframe.contentDocument.body.innerHTML = this.map.get(this.name) || '';
		}
		if(this.textarea.value != this.map.get(this.name)){
			this.textarea.value = this.map.get(this.name) || '';
		}
	},
	createToolbar: function() {
		var editor = this;
		var toolbar = document.createElement('div');
		
		// font family
		var fontfamily = document.createElement('select');
		fontfamily.classList.add('juice-ui-htmlEditor-toolbar-fontfamily');
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
		fontsize.classList.add('juice-ui-htmlEditor-toolbar-fontsize');
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
		bold.classList.add('juice-ui-htmlEditor-toolbar-bold');
		bold.addEventListener('click', function(){
			editor.execCommand('bold',null,null);
		});
		toolbar.appendChild(bold);
		
		// italic
		var italic = document.createElement('button');
		italic.classList.add('juice-ui-htmlEditor-toolbar-italic');
		italic.addEventListener('click',function(){
			editor.execCommand('italic',null,null);
		});
		toolbar.appendChild(italic);
		
		// underline
		var underline = document.createElement('button');
		underline.classList.add('juice-ui-htmlEditor-toolbar-underline');
		toolbar.appendChild(underline);
		underline.addEventListener('click',function() {
			editor.execCommand('underline',null,null);
		});

		// align left
		var alignleft = document.createElement('button');
		alignleft.classList.add('juice-ui-htmlEditor-toolbar-alignleft');
		alignleft.addEventListener('click',function() {
			editor.execCommand('justifyLeft',null,null);
		});
		toolbar.appendChild(alignleft);
		
		// align center
		var aligncenter = document.createElement('button');
		aligncenter.classList.add('juice-ui-htmlEditor-toolbar-aligncenter');
		aligncenter.addEventListener('click',function() {
			editor.execCommand('justifyCenter',null,null);
		});
		toolbar.appendChild(aligncenter);
		
		// align right
		var alignright = document.createElement('button');
		alignright.classList.add('juice-ui-htmlEditor-toolbar-alignright');
		alignright.addEventListener('click',function() {
			editor.execCommand('justifyRight',null,null);
		});
		toolbar.appendChild(alignright);
		
		// indent increase
		var indentincrease = document.createElement('button');
		indentincrease.classList.add('juice-ui-htmlEditor-toolbar-indentincrease');
		indentincrease.addEventListener('click',function() {
			editor.execCommand('indent',null,null);
		});
		toolbar.appendChild(indentincrease);
		
		// indent decrease
		var indentdecrease = document.createElement('button');
		indentdecrease.classList.add('juice-ui-htmlEditor-toolbar-indentdecrease');
		indentdecrease.addEventListener('click',function() {
			editor.execCommand('outdent',null,null);
		});
		toolbar.appendChild(indentdecrease);
		
		// list order
		var listorder = document.createElement('button');
		listorder.classList.add('juice-ui-htmlEditor-toolbar-listorder');
		listorder.addEventListener('click',function() {
			editor.execCommand('insertorderedlist',null,null);
		});
		toolbar.appendChild(listorder);
		
		// list unorder
		var listunorder = document.createElement('button');
		listunorder.classList.add('juice-ui-htmlEditor-toolbar-listunorder');
		listunorder.addEventListener('click',function() {
			editor.execCommand('insertUnorderedList',null,null);
		});
		toolbar.appendChild(listunorder);
		
		// html
		var html = document.createElement('button');
		html.classList.add('juice-ui-htmlEditor-toolbar-html');
		html.addEventListener('click', function() {
			editor.toggleHtml();
		});
		toolbar.appendChild(html);
		
		return toolbar;
	},
	execCommand: function(commandName,showDefaultUI, valueArgument) {
		this.iframe.contentDocument.execCommand(commandName, showDefaultUI, valueArgument);
	},
	toggleHtml: function() {
		if(this.html == true){
			this.html = false;
			this.iframe.style.display = 'block';
			this.textarea.style.display = 'none';
		}else{
			this.html = true;
			this.iframe.style.display = 'none';
			this.textarea.style.display = 'block';
		}
	}
}

/**
 * CronExpression prototype
 */
juice.ui.CronExpression = function(input) {
	this.input = input;
	
	
	this.second = this.createSelectSecond();
	this.minute = this.createSelectMinute();
	this.hour = this.createSelectHour();
	this.day = this.createSelectDay();
	this.month = this.createSelectMonth();
	this.week = this.createSelectWeek();
	
	this.editor = document.createElement('span');
	this.editor.classList.add('juice-ui-cronExpression-editor');
	
	// seconds
	var secondSpan = document.createElement('span');
	secondSpan.classList.add('juice-ui-cronExpression-editor-second');
	secondSpan.appendChild(this.second);
	this.editor.appendChild(secondSpan);
	
	// minute
	var minuteSpan = document.createElement('span');
	minuteSpan.classList.add('juice-ui-cronExpression-editor-minute');
	minuteSpan.appendChild(this.minute);
	this.editor.appendChild(minuteSpan);
	
	// hour
	var hourSpan = document.createElement('span');
	hourSpan.classList.add('juice-ui-cronExpression-editor-hour');
	hourSpan.appendChild(this.hour);
	this.editor.appendChild(hourSpan);
	
	// day
	var daySpan = document.createElement('span');
	daySpan.classList.add('juice-ui-cronExpression-editor-day');
	daySpan.appendChild(this.day);
	this.editor.appendChild(daySpan);
	
	// month
	var monthSpan = document.createElement('span');
	monthSpan.classList.add('juice-ui-cronExpression-editor-month');
	monthSpan.appendChild(this.month);
	this.editor.appendChild(monthSpan);
	
	// week
	var weekSpan = document.createElement('span');
	weekSpan.classList.add('juice-ui-cronExpression-editor-week');
	weekSpan.appendChild(this.week);
	this.editor.appendChild(weekSpan);
	
	// append editor span to input parent
	this.input.parentNode.appendChild(this.editor);
}
juice.ui.CronExpression.prototype = {
	text: {
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
	},
	bind: function(map, name) {
		this.map = map;
		this.name = name;
		this.map.addObserver(this);
		this.input.addEventListener('change',function(){
			map.set(name, this.value);
		});
	},
	/* update */
	update: function() {
		var $this = this;
		this.input.value = this.map.get(this.name) || '';
		this.input.classList.add('juice-ui-cronExpression');
		
		// parse cron expression
		var cronExpressionArray = this.input.value.split(' ');
		this.second.value = cronExpressionArray[0];
		this.minute.value = cronExpressionArray[1];
		this.hour.value = cronExpressionArray[2];
		this.day.value = cronExpressionArray[3];
		this.month.value = cronExpressionArray[4];
		this.week.value = cronExpressionArray[5];
	},
	setReadonly: function(readonly) {
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
	},
	isSupprotCronExpression: function() {
		var pattern = /([\d]{1,2}) ([\d]{1,2}) ([\d|\*]{1,2}) ([\d|\*]{1,2}) ([\d|\*]{1,2}) ([\?]{1})$/gi;
		return pattern.test(this.input.value);
	},
	generateCronExpression: function() {
		var cronExpression = this.second.value 
						+ ' ' + this.minute.value 
						+ ' ' + this.hour.value
						+ ' ' + this.day.value 
						+ ' ' + this.month.value
						+ ' ' + this.week.value;
		this.map.set(this.name, cronExpression);
	},
	createSelectSecond: function() {
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
	},
	createSelectMinute: function() {
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
	},
	createSelectHour: function() {
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
	},
	createSelectDay: function() {
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
	},
	createSelectMonth: function() {
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
	},
	createSelectWeek: function() {
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
}

/**
 * Grid prototype
 */
juice.ui.Grid = function(table) {
	this.table = table;
	this.table.classList.add('juice-ui-grid');
	this.tbody = table.querySelector('tbody');
	this.table.removeChild(this.tbody);
	this.rows = new Array();
}
juice.ui.Grid.prototype = {
	/* bind data structure */
	bind: function(list) {
		this.list = list;
		this.list.addObserver(this);
	},
	/* set item */
	setItem: function(item) {
		this.item = item;
	},
	/* sets editable */
	setEditable: function(editable){
		this.editable = editable;
	},
	/* sets filter */
	setFilter: function(filter){
		this.filter = filter;
	},
	/* update */
	update: function() {
		
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
	},
	/* creates row */
	createRow: function(index,map) {
		var $this = this;
		var table = this.table;
		var tbody = this.tbody.cloneNode(true);
		
		// setting index
		tbody.dataset.juiceIndex = index;
		
		// executes expression
		var $context = {};
		$context['index'] = index;
		$context[this.item] = map;
		tbody = this.executeExpression(tbody, $context);
		
		// creates juice element.
		juice.initialize(tbody,$context);
		
		// add current row index event listener
		tbody.addEventListener('mousedown', function(){
			$this.list.index = this.dataset.juiceIndex;
			var elements = table.querySelectorAll('tbody');
			for(var i = 0; i < elements.length; i ++ ) {
				elements[i].classList.remove('juice-ui-grid-index');
			}
			tbody.classList.add('juice-ui-grid-index');
			$this.list.index = index;
			$this.list.notifyObservers($this);
		});
		if(index == this.list.index){
			tbody.classList.add('juice-ui-grid-index');
		}
		
		// Editable 
		if(this.editable){
			
			// disable drag
			if(tbody.dataset.juiceDraggable && eval(tbody.dataset.juiceDraggable) == false){
				tbody.setAttribute('graggable',false);
				tbody.classList.remove('juice-ui-grid-draggable');
			}
			// enable drag
			else{
				tbody.setAttribute('draggable', true);
				tbody.classList.add('juice-ui-grid-draggable');
				
				// setting row drag and drop
				tbody.addEventListener('dragstart', function(ev) {
					ev.target.id = new Date().getMilliseconds();
					ev.dataTransfer.setData("id", ev.target.id);
				});
			}
				
			// disable drop
			if(tbody.dataset.juiceDroppable && eval(tbody.dataset.juiceDroppable) == false){
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
					$this.list.moveRow(dragedTbody.dataset.juiceIndex, dropedTbody.dataset.juiceIndex);
				});
				tbody.addEventListener('dragover', function(ev){
					ev.preventDefault();
				});
			}
		}
		
		// Adjust filter
		if(this.filter){
			if(this.filter.call($context) == false) {
				tbody.style.display = 'none';
			}
		}
		
		// return
		return tbody;
	},
	/* creates not found row */
	createEmptyRow: function() {
		var tbody = this.tbody.cloneNode(true);
		while (tbody.firstChild) {
			tbody.removeChild(tbody.firstChild);
		}
		tbody.dataset.juiceIndex = -1;
		tbody.classList.add('juice-ui-grid-empty')
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		var colspan = this.tbody.querySelectorAll('tr > td').length;
		td.setAttribute('colspan',colspan);
		var emptyMessage = document.createElement('div');
		emptyMessage.classList.add('juice-ui-grid-empty-message');
		td.appendChild(emptyMessage);
		tr.appendChild(td);
		tbody.appendChild(tr);
		return tbody;
	},
	/* executes expression */
	executeExpression: function(element,$context) {
		var string = element.outerHTML;
		string = string.replace(/\{\{(.*?)\}\}/gi,function(match, command){
			return eval(command);
		});
		var table = document.createElement('table');
		table.innerHTML = string;
		return table.firstChild;
	}
}

/**
 * juice.ui.TreeView
 */
juice.ui.TreeView = function(ul){
	this.ul = ul;
	this.ul.classList.add('juice-ui-treeView');
	this.li = this.ul.querySelector('li');
	this.ul.removeChild(this.li);
}
juice.ui.TreeView.prototype = {
	/* bind data */
	bind: function(tree) {
		this.tree = tree;
		this.tree.addObserver(this);
	},
	/* set item */
	setItem: function(item){
		this.item = item;
	},
	/* setting editable */
	setEditable: function(editable) {
		this.editable = editable;
	},
	/* update */
	update: function() {
		
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
	},
	/* creates node */
	createNode: function(index, node){
		var $this = this;
		var li = this.li.cloneNode(true);
		var index = JSON.parse(JSON.stringify(index)); 	// deep copy
		
		// setting index
		li.dataset.juiceIndex = JSON.stringify(index);
		
		// executes expression
		var $context = {};
		$context['index'] = JSON.stringify(index);
		$context['depth'] = index.length - 1;
		$context[this.item] = node;
		li = this.executeExpression(li, $context);
		
		// creates juice element.
		juice.initialize(li,$context);

		// child node
		var childNodes = node.getChildNodes();
		if(childNodes){
			index.push(-1);
			var childUl = document.createElement('ul');
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
			if(li.dataset.juiceDraggable && eval(li.dataset.juiceDraggable) == false){
				li.setAttribute('draggable', false);
				li.classList.remove('juice-ui-treeView-draggable');
			}
			// enable drag
			else{
				li.setAttribute('draggable', true);
				li.classList.add('juice-ui-treeView-draggable');
				// setting row drag and drop
				li.addEventListener('dragstart', function(ev) {
					ev.stopPropagation();
					ev.target.id = new Date().getMilliseconds();
					ev.dataTransfer.setData("id", ev.target.id);
					this.classList.add('juice-ui-treeView-dragstart');
				});
				li.addEventListener('dragend', function(ev){
					this.classList.remove('juice-ui-treeView-dragstart');
				});
			}

			// disable drop
			if(li.dataset.juiceDroppable && eval(li.dataset.juiceDroppable) == false){
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
				    var fromIndex = eval(dragedLi.dataset.juiceIndex);
				    var toIndex = eval(dropedLi.dataset.juiceIndex);
				    if(fromIndex.toString() == toIndex.toString()) {
				    	return false;
				    }
				    
				    // check move or add child
				    if(li.dataset.juiceContainable && eval(li.dataset.juiceContainable) == true){
				    	$this.tree.moveNodeToChild(fromIndex, toIndex);
				    }else{
				    	$this.tree.moveNode(fromIndex, toIndex);
				    }
				});
				li.addEventListener('dragover', function(ev){
					ev.preventDefault();
					ev.stopPropagation();
				});
			}
		}
		
		// return li
		return li;
	},
	/* executes expression */
	executeExpression: function(element,$context) {
		var string = element.outerHTML;
		string = string.replace(/\{\{(.*?)\}\}/gi,function(match, command){
			return eval(command);
		});
		var div = document.createElement('div');
		div.innerHTML = string;
		return div.firstChild;
	}
}

/**
 * juice.ui.Workflow
 */
juice.ui.Workflow = function(ul){
	this.ul = ul;
	this.ul.classList.add('juice-ui-workflow');
	this.ul.style.listStyleType = 'none';
	this.li = this.ul.querySelector('li');
	this.ul.removeChild(this.li);
	if(this.ul.parentElement){
		this.ul.parentElement.style.position = 'relative';
	}
	
	// default option
	this.nodeId = 'nodeId';
	this.nodeX = 'nodeX';
	this.nodeY = 'nodeY';
	this.linkFrom = 'linkFrom';
	this.linkTo = 'linkTo';
	this.linkText = null;
}
juice.ui.Workflow.prototype = {
	/* bind data structure */
	bind: function(nodeList,linkList) {
		this.nodeList = nodeList;
		this.linkList = linkList;
		this.nodeList.addObserver(this);
		this.linkList.addObserver(this);
	},
	/* setting node id */
	setNodeId: function(value) {
		this.nodeId = value;
	},
	setNodeX: function(value) {
		this.nodeX = value;
	},
	setNodeY: function(value) {
		this.nodeY = value;
	},
	/* setting link from */
	setLinkFrom: function(value) {
		this.linkFrom = value;
	},
	/* setting link to */
	setLinkTo: function(value) {
		this.linkTo = value;
	},
	/* setting link text */
	setLinkText: function(value) {
		this.linkText = value;
	},
	/* update */
	update: function() {
		var $this = this;
		var ul = this.ul;
		
		// remove previous node
		var elements = this.ul.querySelectorAll('.juice-ui-workflow-node');
		for(var i = 0; i < elements.length; i ++ ) {
			this.ul.removeChild(elements[i]);
		}
		
		// creates node list
		for(var index = 0; index < this.nodeList.getRowCount(); index ++ ) {
			var map = this.nodeList.getRow(index);
			var li = this.createNode(index,map);
			li.dataset.juiceNodeId = map.get(this.nodeId);
			this.ul.appendChild(li);
		}
		
		// remove previous link
		var elements = this.ul.querySelectorAll('.juice-ui-workflow-link');
		for(var i = 0; i < elements.length; i ++ ) {
			this.ul.removeChild(elements[i]);
		}
		
		// creates link list
		for(var index = 0; index < this.linkList.getRowCount(); index ++) {
			var map = this.linkList.getRow(index);
			var line = this.createLink(index, map);
			this.ul.appendChild(line);
		}
	},
	/* create ndoe */
	createNode: function(index, map){
		var $this = this;
		var li = this.li.cloneNode(true);
		li.classList.add('juice-ui-workflow-node');

		var $context = {};
		$context['node'] = map;
		li = this.executeExpression(li, $context);
		li.dataset.juiceIndex = index;
		li.dataset.juiceId = map.get(this.nodeId);
		
		// setting index class
		if(index == this.nodeList.index){
			li.classList.add('juice-ui-workflow-node-index');
		}
		
		// creates juice element.
		juice.initialize(li,$context);
		
		// drag
		li.style.position = 'absolute';
		li.style.zIndex = 9;
		li.style.left = map.get(this.nodeX) + 'px';
		li.style.top = map.get(this.nodeY) + 'px';
		// mouse down
		li.addEventListener('mousedown', function(ev){
			
			// setting current index
			$this.nodeList.index = index;
			var elements = $this.ul.querySelectorAll('.juice-ui-workflow-node');
			for(var i = 0; i < elements.length; i ++ ) {
				elements[i].classList.remove('juice-ui-workflow-node-index');
			}
			li.classList.add('juice-ui-workflow-node-index');

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
	},
	/* create link */
	createLink: function(index, map) {
		var $this = this;
		var line = document.createElement('div');
		line.style.position = 'absolute';
		line.classList.add('juice-ui-workflow-link');
		line.dataset.juiceIndex = index;
		
		// setting current index
		if(index == this.linkList.index){
			line.classList.add('juice-ui-workflow-link-index');
		}
		line.addEventListener('mousedown', function() {
			$this.linkList.index = index;
			var elements = $this.ul.querySelectorAll('.juice-ui-workflow-link');
			for(var i = 0; i < elements.length; i ++ ) {
				elements[i].classList.remove('juice-ui-workflow-link-index');
			}
			line.classList.add('juice-ui-workflow-link-index');
			$this.linkList.notifyObservers($this);
		});

		
		// defines line position
		try {
			var from = this.ul.querySelector('[data-juice-node-id="' + map.get(this.linkFrom) + '"]');
			var to = this.ul.querySelector('[data-juice-node-id="' + map.get(this.linkTo) + '"]');
	
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
				span.classList.add('juice-ui-workflow-link-text');
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
	},
	/* executes expression */
	executeExpression: function(element,$context) {
		var string = element.outerHTML;
		string = string.replace(/\{\{(.*?)\}\}/gi,function(match, command){
			return eval(command);
		});
		var div = document.createElement('div');
		div.innerHTML = string;
		return div.firstChild;
	}
}

/**
 * juice.ui.Pagination prototype
 */
juice.ui.Pagination = function(ul){
	this.ul = ul;
	this.ul.classList.add('juice-ui-pagination');
	this.ul.style.listStyleType = 'none';
	this.li = this.ul.querySelector('li');
	this.ul.removeChild(this.li);
	this.pageSize = 1;
}
juice.ui.Pagination.prototype = {
	/* bind */
	bind: function(map) {
		this.map = map;
		this.map.addObserver(this);
	},
	/* setting column name specified rows value */
	setRows: function(value){
		this.rows = value;
	},
	/* setting column name specified page value */
	setPage: function(value){
		this.page = value;
	},
	/* setting column name specified total rows value */
	setTotalCount: function(value){
		this.totalCount = value;
	},
	setPageSize: function(value) {
		this.pageSize = parseInt(value);
	},
	/* update */
	update: function() {

		// remove all li element
		while (this.ul.hasChildNodes()) {
			this.ul.removeChild(this.ul.lastChild);
		}
		
		// getting pagination values
		var rows = parseInt(this.map.get(this.rows));
		var page = parseInt(this.map.get(this.page));
		var	totalCount = parseInt(this.map.get(this.totalCount));

		// creates previous item
		var itemPrev = this.createItemPrev(page-1);
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
					itemPage.classList.add('juice-ui-pagination-item-page-index');
					itemPage.onclick = null;
					itemPage.style.pointerEvents = 'none';
				}
				this.ul.appendChild(itemPage);
			}
			
			// create next item
			var itemNext = this.createItemNext(page+1);
			this.ul.appendChild(itemNext);
			if(page == totalPage) {
				itemNext.onclick = null;
				itemNext.style.pointerEvents = 'none';
			}
			
		}else{
			// creates page item
			var itemPage = this.createItemPage(page);
			itemPage.classList.add('juice-ui-pagination-item-page-index');
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
	},
	/* create page item */
	createItemPage: function(page) {
		var $this = this;
		var ul = this.ul;
		var li = this.li.cloneNode(true);
		li.classList.add('juice-ui-pagination-item-page');
		
		// executes expression
		var $context = {};
		$context['page'] = page;
		li = this.executeExpression(li, $context);
		return li;
	},
	createItemPrev: function(page) {
		var $this = this;
		var ul = this.ul;
		var li = this.li.cloneNode(true);
		li.classList.add('juice-ui-pagination-item-prev');
		
		// remove child element
		while (li.hasChildNodes()) {
			li.removeChild(li.lastChild);
		}
		// executes expression
		var $context = {};
		$context['page'] = page;
		li = this.executeExpression(li, $context);
		return li;
	},
	createItemNext: function(page) {
		var $this = this;
		var ul = this.ul;
		var li = this.li.cloneNode(true);
		li.classList.add('juice-ui-pagination-item-next');
		
		// remove child element
		while (li.hasChildNodes()) {
			li.removeChild(li.lastChild);
		}
		// executes expression
		var $context = {};
		$context['page'] = page;
		li = this.executeExpression(li, $context);
		return li;
	},
	/* executes expression */
	executeExpression: function(element,$context) {
		var string = element.outerHTML;
		string = string.replace(/\{\{(.*?)\}\}/gi,function(match, command){
			return eval(command);
		});
		var ul = document.createElement('ul');
		ul.innerHTML = string;
		return ul.firstChild;
	}
}

/**
 * juice.ui.Anitmator
 */
juice.ui.Animator = function(element){
	this.element = element;
}
juice.ui.Animator.prototype = {
	executeCallback: function(callback) {
		var interval = setInterval(function() {
			try {
				callback.call(this.element);
			}catch(ignore){
			}finally{
				clearInterval(interval);
			}
		},400);
	},
	/* fade in */
	fadeIn: function(callback) {
		this.element.classList.remove('juice-ui-animator-fadeOut');
		this.element.classList.add('juice-ui-animator-fadeIn');
		if(callback){
			this.executeCallback(callback);
		}
	},
	/* fade out */
	fadeOut: function(callback) {
		this.element.classList.remove('juice-ui-animator-fadeIn');
		this.element.classList.add('juice-ui-animator-fadeOut');
		if(callback){
			this.executeCallback(callback);
		}
	}
}

/**
 * juice.ui.Blocker prototype
 */
juice.ui.Blocker = function(element) {
	this.element = element;
	this.div = document.createElement('div');
	this.div.classList.add('juice-ui-blocker');
	this.animator = new juice.ui.Animator(this.div);
}
juice.ui.Blocker.prototype = {
	/* getMaxZIndex */
	getMaxZIndex: function(){
	    var zIndex,
        z = 0,
        all = document.getElementsByTagName('*');
	    for (var i = 0, n = all.length; i < n; i++) {
	        zIndex = document.defaultView.getComputedStyle(all[i],null).getPropertyValue("z-index");
	        zIndex = parseInt(zIndex, 10);
	        z = (zIndex) ? Math.max(z, zIndex) : z;
	    }
	    return z;
	},
	/* blocking specified element */ 
	block: function(){
		
		// adjusting position
		this.div.style.position = 'fixed';
		this.div.style.zIndex = this.getMaxZIndex() + 1;
		
		// full blocking in case of BODY
		if(this.element.tagName == 'BODY'){
			this.div.style.width = '100%';
			this.div.style.height = '100%';
			this.div.style.top = '0px';
			this.div.style.left = '0px';
		}
		// otherwise adjusting to parent element
		else{
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
		this.animator.fadeIn();
	},
	/* release blocking element */
	unblock: function() {
		var $this = this;
		this.animator.fadeOut(function() {
			$this.element.removeChild($this.div);
		});
	}
}

/**
 * juice.ui.Dialog prototype
 */
juice.ui.Dialog = function(content) {
	var $this = this;
	
	// defines content
	if(content.parentNode){
		this.parentNode = content.parentNode;
	}
	this.content = content;
	
	// event listener
	this.listener = {};
	
	// creates div
	this.div = document.createElement('div');
	this.div.classList.add('juice-ui-dialog');
	
	// blocker
	this.blocker = new juice.ui.Blocker(this.getWindow().document.body);
	
	// creates header
	this.header = document.createElement('div');
	this.header.classList.add('juice-ui-dialog-header');
	this.header.style.cursor = 'move';
	this.div.appendChild(this.header);
	
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
		    $this.div.style.left = ($this.div.offsetLeft - pos1) + 'px';
		    $this.div.style.top = ($this.div.offsetTop - pos2) + 'px';
	    };
	};
	
	// create title
	this.title = document.createElement('span');
	this.title.classList.add('juice-ui-dialog-header-title');
	this.header.appendChild(this.title);
	
	// creates exit
	this.closeButton = document.createElement('span');
	this.closeButton.classList.add('juice-ui-dialog-header-close');
	this.closeButton.addEventListener('click',function(ev){
		$this.close();
	});
	this.header.appendChild(this.closeButton);

	// creates body
	this.body = document.createElement('div');
	this.body.classList.add('juice-ui-dialog-body');
	this.body.appendChild(this.content);
	this.div.appendChild(this.body);
	
	// on resize event
	this.getWindow().addEventListener('resize', function(ev) {
		$this.setPosition();
	});
}
juice.ui.Dialog.prototype = {
	/* returns current window */
	getWindow: function() {
		if(window.frameElement){
			return window.parent;
		}else{
			return window;
		}
	},
	/* setting position */
	setPosition: function() {
		// adjusting position
		var computedStyle = this.getWindow().getComputedStyle(this.div);
		var computedWidth = computedStyle.getPropertyValue('width').replace(/px/gi, '');
		var computedHeight = computedStyle.getPropertyValue('height').replace(/px/gi, '');
		this.div.style.width = Math.min(this.getWindow().screen.width-20, computedWidth) + 'px';
		this.div.style.height = Math.min(this.getWindow().screen.height, computedHeight) + 'px';
		this.div.style.left = Math.max(10,this.getWindow().innerWidth/2 - computedWidth/2) + 'px';
		this.div.style.top = Math.max(0,this.getWindow().innerHeight/2 - computedHeight/2) + 'px';
	},
	/* sets title */
	setTitle: function(title){
		this.title.appendChild(document.createTextNode(title));
	},
	/* open dialog window */
	open: function(){
		
		// blocker
		this.blocker.block();
		
		// setting position
		this.div.style.position = 'fixed';
		this.div.style.zIndex = this.blocker.getMaxZIndex() + 1;
		
		// adds into document
		this.getWindow().document.body.appendChild(this.div);

		// adjusting position
		this.setPosition();

		// display
		var animator = new juice.ui.Animator(this.div);
		animator.fadeIn();
		
		// let current active element to be blur.
		try {
			this.getWindow().document.activeElement.blur();
		}catch(ignore){
		}
	},
	/* close dialog window */
	close: function(callback) {
		var $this = this;
		
		// fires close listener
		if(this.listener.close){
			if($this.listener.close.call($this) == false){
				return false;
			}
		}

		// close window.
		var animator = new juice.ui.Animator(this.div);
		animator.fadeOut(function() {
			
			// restore content element into parent node
			if($this.parentNode){
				$this.parentNode.appendChild($this.content);
			}
			
			// removes dialog from screen
			$this.getWindow().document.body.removeChild($this.div);

			// calls callback function
			if(callback){
				callback.call($this);
			}
		});
		
		// unblock
		this.blocker.unblock();
	},
	/* defines close event callback function */
	onClose: function(listener){
		this.listener.close = listener;
	}
}

/**
 * juice.ui.Alert prototype
 */
juice.ui.Alert = function(message){
	var $this = this;
	
	// listener
	this.listener = {};

	// contents
	this.content = document.createElement('div');
	this.content.classList.add('juice-ui-alert');
	
	// message
	this.message = document.createElement('div');
	this.message.classList.add('juice-ui-alert-message');
	this.message.appendChild(document.createTextNode(message));
	this.content.appendChild(this.message);
	
	// button
	this.button = document.createElement('div');
	this.button.classList.add('juice-ui-alert-button');
	this.content.appendChild(this.button);
	
	// confirm button
	this.buttonConfirm = document.createElement('button');
	this.buttonConfirm.classList.add('juice-ui-alert-button-confirm');
	this.buttonConfirm.addEventListener('click', function(){
		$this.confirm();
	});
	this.button.appendChild(this.buttonConfirm);

	// creates dialog
	this.dialog = new juice.ui.Dialog(this.content);
}
juice.ui.Alert.prototype = {
	/* setting title */
	setTitle: function(title){
		this.dialog.setTitle(title);
	},
	/* opens alert message box */
	open : function(){
		this.dialog.open();
		this.buttonConfirm.focus();
	},
	/* confirm */
	confirm: function(){
		this.dialog.close(this.listener.confirm);
	},
	/* on close event callback */
	onConfirm: function(listener){
		this.listener.confirm = listener;
	}
}

/**
 * juice.ui.Confirm prototype
 */
juice.ui.Confirm = function(message){
	var $this = this;
	
	// event property
	this.listener = {};

	// contents
	this.content = document.createElement('div');
	this.content.classList.add('juice-ui-confirm');
	
	// message
	this.message = document.createElement('div');
	this.message.classList.add('juice-ui-confirm-message');
	this.message.appendChild(document.createTextNode(message));
	this.content.appendChild(this.message);
	
	// button
	this.button = document.createElement('div');
	this.button.classList.add('juice-ui-confirm-button');
	this.content.appendChild(this.button);
	
	// confirm button
	this.buttonConfirm = document.createElement('button');
	this.buttonConfirm.classList.add('juice-ui-confirm-button-confirm');
	this.buttonConfirm.addEventListener('click', function(){
		$this.confirm();
	});
	this.button.appendChild(this.buttonConfirm);
	
	// confirm button
	this.buttonCancel = document.createElement('button');
	this.buttonCancel.classList.add('juice-ui-confirm-button-cancel');
	this.buttonCancel.addEventListener('click', function(){
		$this.cancel();
	});
	this.button.appendChild(this.buttonCancel);

	// creates dialog
	this.dialog = new juice.ui.Dialog(this.content);
}
juice.ui.Confirm.prototype = {
	/* setting title */
	setTitle: function(title){
		this.dialog.setTitle(title);
	},
	/* opens alert message box */
	open : function(){
		this.dialog.open();
		this.buttonCancel.focus();
	},
	/* confirm */
	confirm: function(){
		this.dialog.close(this.listener.confirm);
	},
	/* cancel */
	cancel: function(){
		this.dialog.close(this.listener.cancel);
	},
	/* defines confirm event callback function */
	onConfirm: function(listener){
		this.listener.confirm = listener;
	},
	/* onClose listener */
	onCancel: function(listener){
		this.listener.cancel = listener;
	}
}


/**
 * juice.ui.Prompt prototype
 */
juice.ui.Prompt = function(message){
	var $this = this;

	// event property
	this.listener = {};

	// contents
	this.content = document.createElement('div');
	this.content.classList.add('juice-ui-prompt');
	
	// message
	this.message = document.createElement('div');
	this.message.classList.add('juice-ui-prompt-message');
	this.message.appendChild(document.createTextNode(message));
	this.content.appendChild(this.message);

	// input
	this.input = document.createElement('input');
	this.input.classList.add('juice-ui-prompt-input');
	this.input.type = 'text'
	this.content.appendChild(this.input);

	// button
	this.button = document.createElement('div');
	this.button.classList.add('juice-ui-prompt-button');
	this.content.appendChild(this.button);
	
	// confirm button
	this.buttonConfirm = document.createElement('button');
	this.buttonConfirm.classList.add('juice-ui-prompt-button-confirm');
	this.buttonConfirm.addEventListener('click', function(){
		$this.confirm();
	});
	this.button.appendChild(this.buttonConfirm);
	
	// confirm button
	this.buttonCancel = document.createElement('button');
	this.buttonCancel.classList.add('juice-ui-prompt-button-cancel');
	this.buttonCancel.addEventListener('click', function(){
		$this.cancel();
	});
	this.button.appendChild(this.buttonCancel);

	// creates dialog
	this.dialog = new juice.ui.Dialog(this.content);
}
juice.ui.Prompt.prototype = {
	/* setting title */
	setTitle: function(title){
		this.dialog.setTitle(title);
	},
	/* opens alert message box */
	open : function(){
		this.dialog.open();
		this.input.focus();
	},
	/* closes alert message box */
	confirm: function() {
		if(this.listener.confirm){
			if(this.listener.confirm.call(this) == false){
				return false;
			}
		}
		this.dialog.close();
	},
	/* cancel */
	cancel: function() {
		if(this.listener.cancel){
			if(this.listener.cancel.call(this) == false){
				return false;
			}
		}
		this.dialog.close();
	},
	/* return input value */
	getValue: function() {
		return this.input.value;
	},
	/* defines confirm event callback function */
	onConfirm: function(listener){
		this.listener.confirm = listener;
	},
	/* defines cancle event callback function */
	onCancel: function(listener){
		this.listener.cancel = listener;
	}
}

/**
 * juice.ui.Progress prototype
 */
juice.ui.Progress = function(){
	var $this = this;

	// creates div
	this.div = document.createElement('div');
	this.div.classList.add('juice-ui-progress');
	this.div.style.position = 'fixed';
	this.div.style.zIndex = 99;
	this.div.style.opacity = 0;
	
	// animator
	this.animator = new juice.ui.Animator(this.div);

	// on resize event
	this.getWindow().addEventListener('resize', function(ev) {
		$this.setPosition();
	});
}
juice.ui.Progress.prototype = {
	/* returns current window */
	getWindow: function() {
		if(window.frameElement){
			return window.parent;
		}else{
			return window;
		}
	},
	/* setting position */
	setPosition: function() {
		var computedStyle = this.getWindow().getComputedStyle(this.div);
		var computedWidth = computedStyle.getPropertyValue('width').replace(/px/gi, '');
		var computedHeight = computedStyle.getPropertyValue('height').replace(/px/gi, '');
		this.div.style.width = Math.min(this.getWindow().screen.width-20, computedWidth) + 'px';
		this.div.style.height = Math.min(this.getWindow().screen.height, computedHeight) + 'px';
		this.div.style.left = Math.max(10,this.getWindow().innerWidth/2 - computedWidth/2) + 'px';
		this.div.style.top = Math.max(0,this.getWindow().innerHeight/2 - computedHeight/2) + 'px';
	},
	start: function(){
		this.getWindow().document.body.appendChild(this.div);
		this.setPosition();
		this.animator.fadeIn();
	},
	end: function() {
		this.animator.fadeOut();
	}
}

/**
 * juice.util.MaskFormatter
 */
juice.util.MaskFormatter = {
	DIGIT_KEY: '#',
	DIGIT_REX: /[0-9]/,
	UPPERCASE_KEY: 'U',
	UPPERCASE_REX: /[A-Z]/,
	LOWERCASE_KEY: 'L',
	LOWERCASE_REX: /[a-z]/,
	CHARACTER_KEY: '?',
	CHARACTER_REX: /[a-zA-Z]/,
	ALPHA_NUMERIC_KEY: 'A',
	ALPHA_NUMERIC_REX: /[a-zA-Z0-9]/,
	ANYTHING_KEY: '*',
	ANYTHING_REX: /[*]/,
	mask: function(format, value) {
		if(!value) {
			return '';
		}
		var resultValue = '';
		var formatChars = format.split('');
		var valueChars = value.split('');
		var pos = 0;
		for(var i = 0, len = formatChars.length; i < len; i ++){
			var formatChar = formatChars[i];
			switch(formatChar) {
			case this.DIGIT_KEY:
				var valueChar = valueChars[pos++];
				resultValue += this.DIGIT_REX.test(valueChar) ? valueChar : 0; 
			break;
			case this.UPPERCASE_KEY:
				var valueChar = valueChars[pos++];
				resultValue += this.UPPERCASE_REX.test(valueChar) ? valueChar : ' ';
			break;
			case this.LOWERCASE_KEY:
				var valueChar = valueChars[pos++];
				resultValue += this.LOWERCASE_REX.test(valueChar) ? valueChar : ' ';
			break;
			case this.CHARACTER_KEY:
				var valueChar = valueChars[pos++];
				resultValue += this.CHARACTER_REX.test(valueChar) ? valueChar : ' ';
			break;
			case this.ALPHA_NUMERIC_KEY:
				var valueChar = valueChars[pos++];
				resultValue += this.ALPHA_NUMERIC_REX.test(valueChar) ? valueChar : ' ';
			break;
			case this.ANYTHING_KEY:
				var valueChar = valueChars[pos++];
				resultValue += this.ANYTHING_REX.test(valueChar) ? valueChar : ' ';
			break;
			default:
				resultValue += formatChar; 
			break;
			}
		}
		return resultValue;
	},
	unmask: function(format, value) {
		var resultValue = '';
		var formatChars = format.split('');
		var valueChars = value.split('');
		var pos = 0;
		for(var i = 0, len = formatChars.length; i < len; i ++){
			var formatChar = formatChars[i];
			switch(formatChar) {
			case this.DIGIT_KEY:
				var valueChar = valueChars[pos++];
				resultValue += this.DIGIT_REX.test(valueChar) ? valueChar : 0; 
			break;
			case this.UPPERCASE_KEY:
				var valueChar = valueChars[pos++];
				resultValue += this.UPPERCASE_REX.test(valueChar) ? valueChar : ' ';
			break;
			case this.LOWERCASE_KEY:
				var valueChar = valueChars[pos++];
				resultValue += this.LOWERCASE_REX.test(valueChar) ? valueChar : ' ';
			break;
			case this.CHARACTER_KEY:
				var valueChar = valueChars[pos++];
				resultValue += this.CHARACTER_REX.test(valueChar) ? valueChar : ' ';
			break;
			case this.ALPHA_NUMERIC_KEY:
				var valueChar = valueChars[pos++];
				resultValue += this.ALPHA_NUMERIC_REX.test(valueChar) ? valueChar : ' ';
			break;
			case this.ANYTHING_KEY:
				var valueChar = valueChars[pos++];
				resultValue += this.ANYTHING_REX.test(valueChar) ? valueChar : ' ';
			break;
			default:
				pos++;
			break;
			}
		}
		return resultValue;
	}
}

/**
 * juice.util.WebSocketClient prototype
 */
juice.util.WebSocketClient = function(url) {
	this.url = url;
	this.listener = {};
	this.reconnectInterval = 3*1000;	// ms
}
juice.util.WebSocketClient.prototype = {
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
	send: function(message) {
		this.webSocket.send(message);
	},
	onOpen: function(listener) {
		this.listener.onOpen = listener;
	},
	onMessage: function(listener) {
		this.listener.onMessage = listener;
	},
	onClose: function(listener) {
		this.listener.onClose = listener;
	},
	onError: function(listener){
		this.listener.onError = listener;
	},
	setReconnectInterval: function(value){
		this.reconnectInterval = value;
	}
}

/**
 * initialize juice component.
 */
juice.initialize = function(container, $context) {
	
	// generateUUID
	function generateUUID() {
		var dt = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (dt + Math.random()*16)%16 | 0;
			dt = Math.floor(dt/16);
			return (c=='x' ? r :(r&0x3|0x8)).toString(16);
		});
		return uuid;
	}

	// creates TreeView 
	var treeViewElements = container.querySelectorAll('ul[data-juice="TreeView"]');
	for(var i = 0; i < treeViewElements.length; i++ ) {
		var element = treeViewElements[i];
		var treeView = new juice.ui.TreeView(element);
		var bind = element.dataset.juiceBind;
		var list = $context[bind];
		treeView.bind(list);
		treeView.setItem(element.dataset.juiceItem);
		element.dataset.juiceEditable && treeView.setEditable(eval(element.dataset.juiceEditable));
		treeView.update();
		var id = generateUUID();
		element.dataset.juice = id;
	}
	
	// creates Grid
	var gridElements = container.querySelectorAll('table[data-juice="Grid"]');
	for(var i = 0; i < gridElements.length; i++ ) {
		var element = gridElements[i];
		var grid = new juice.ui.Grid(element);
		var bind = element.dataset.juiceBind;
		var list = $context[bind];
		grid.bind(list);
		grid.setItem(element.dataset.juiceItem);
		element.dataset.juiceEditable && grid.setEditable(eval(element.dataset.juiceEditable));
		element.dataset.juiceFilter && grid.setFilter(eval(element.dataset.juiceFilter));
		grid.update();
		var id = generateUUID();
		element.dataset.juice = id;
	}
	
	// creates Workflow
	var workflowElements = container.querySelectorAll('ul[data-juice="Workflow"]');
	for(var i = 0; i < workflowElements.length; i++ ) {
		var element = workflowElements[i];
		var workflow = new juice.ui.Workflow(element);
		var bind = element.dataset.juiceBind.split(',');
		var nodeList = bind[0];
		var linkList = bind[1];
		workflow.bind($context[nodeList],$context[linkList]);
		workflow.setNodeId(element.dataset.juiceNodeId);
		workflow.setNodeX(element.dataset.juiceNodeX);
		workflow.setNodeY(element.dataset.juiceNodeY);
		workflow.setLinkFrom(element.dataset.juiceLinkFrom);
		workflow.setLinkTo(element.dataset.juiceLinkTo);
		element.dataset.juiceLinkText && workflow.setLinkText(element.dataset.juiceLinkText);
		workflow.update();
		var id = generateUUID();
		element.dataset.juice = id;
	}
	
	// creates Pagination
	var paginationElements = container.querySelectorAll('ul[data-juice="Pagination"]');
	for(var i = 0; i < paginationElements.length; i++ ) {
		var element = paginationElements[i];
		var pagination = new juice.ui.Pagination(element);
		var bind = element.dataset.juiceBind;
		pagination.bind($context[bind]);
		pagination.setRows(element.dataset.juiceRows);
		pagination.setPage(element.dataset.juicePage);
		pagination.setTotalCount(element.dataset.juiceTotalCount);
		pagination.setPageSize(element.dataset.juicePageSize);
		pagination.update();
		var id = generateUUID();
		element.dataset.juice = id;
	}
		
	// creates unit elements
	var elements = container.querySelectorAll('[data-juice]');
	for(var i = 0; i < elements.length; i ++ ) {
		var element = elements[i];
		var type = element.dataset.juice;
		var bind = element.dataset.juiceBind.split('.');
		var name = bind.pop();
		var map = bind.join('.');
		var id = generateUUID();
		switch(type) {
			case 'Label':
				var label = new juice.ui.Label(element);
				label.bind($context[map],name);
				element.dataset.juiceMask && label.setMask(element.dataset.juiceMask);
				label.update();
			break;
			case 'TextField':
				var textField = new juice.ui.TextField(element);
				textField.bind($context[map],name);
				element.dataset.juiceMask && textField.setMask(element.dataset.juiceMask);
				element.dataset.juiceValidator && textField.setValidator(eval(element.dataset.juiceValidator));
				textField.update();
			break;
			case 'ComboBox':
				var comboBox = new juice.ui.ComboBox(element);
				var options = element.dataset.juiceOptions;
				comboBox.options(eval(options));
				comboBox.bind($context[map],name);
				comboBox.update();
			break;
			case 'CheckBox':
				var checkBox = new juice.ui.CheckBox(element);
				checkBox.bind($context[map],name);
				checkBox.update();
			break;
			case 'Radio':
				var radio = new juice.ui.Radio(element);
				radio.bind($context[map],name);
				radio.update();
			break;
			case 'TextArea':
				var textArea = new juice.ui.TextArea(element);
				textArea.bind($context[map], name);
				textArea.update();
			break;
			case 'HtmlEditor':
				var htmlEditor = new juice.ui.HtmlEditor(element);
				htmlEditor.bind($context[map],name);
				htmlEditor.update();
			break;
			case 'CronExpression':
				var cronExpression = new juice.ui.CronExpression(element);
				cronExpression.bind($context[map],name);
				cronExpression.update();
				if(element.dataset.juiceReadonly){
					cronExpression.setReadonly(eval(element.dataset.juiceReadonly));
				}
			break;
		}
		element.dataset.juice = id;
	}
}

/**
 * juice.alert 
 */
juice.alert = function(message){
	var alert = new juice.ui.Alert(message);
	return {
		setTitle: function(title){
			alert.setTitle(title);
			return this;
		},
		onConfirm: function(listener){
			alert.onConfirm(listener);
			return this;
		},
		open: function(){
			alert.open();
			return this;
		}
	}
}

/**
 * juice.confirm
 */
juice.confirm = function(message){
	var confirm = new juice.ui.Confirm(message);
	return {
		setTitle: function(title){
			confirm.setTitle(title);
			return this;
		},
		onConfirm: function(listener){
			confirm.onConfirm(listener);
			return this;
		},
		onCancel: function(listener){
			confirm.onCancel(listener);
			return this;
		},
		open: function(){
			confirm.open();
			return this;
		}
	}
}

/**
 * juice.prompt
 */
juice.prompt = function(message){
	var prompt = new juice.ui.Prompt(message);
	return {
		setTitle: function(title){
			prompt.setTitle(title);
			return this;
		},
		onConfirm: function(listener){
			prompt.onConfirm(listener);
			return this;
		},
		onCancel: function(listener){
			prompt.onCancel(listener);
			return this;
		},
		open: function(){
			prompt.open();
			return this;
		}
	}
}

/**
 * juice.dialog
 * @param element
 * @returns
 */
juice.dialog = function(element) {
	var dialog = new juice.ui.Dialog(element);
	return {
		setTitle: function(title){
			dialog.setTitle(title);
			return this;
		},
		onClose: function(listener){
			dialog.onClose(listener);
			return this;
		},
		open: function(){
			dialog.open();
			return this;
		},
		close: function(){
			dialog.close();
			return this;
		}
	}
}

/**
 * juice.progress
 */
juice.progress = {
	progress: new juice.ui.Progress(),
	start: function(){
		this.progress.start();
	},
	end: function(){
		this.progress.end();
	}
}


/**
 * DOMContentLoaded event process
 * @param event
 * @returns
 */
document.addEventListener("DOMContentLoaded", function(event) {
	var $context = typeof global !== 'undefined' ? global : 
					typeof self !== 'undefined' ? self : 
					typeof window !== 'undefined' ? window :
					{};
	juice.initialize(document,$context);
});

