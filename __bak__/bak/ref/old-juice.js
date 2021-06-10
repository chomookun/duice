/**
 * Top Navigation
 */
$(function() {
	// recursive function for dropdown menu.
	function __createJuiceNaviTopItem(li, depth) {
		li.children('ul').hide();
		var showOption = null;
		var hideOption = null;
		if(depth == 0) {
			li.mouseenter(function(e){
				$(this).children('ul').fadeIn(200);
			});
			li.mouseleave(function(e){
				$(this).children('ul').fadeOut(200);
			});
		}else{
			li.mouseenter(function(e){
				$(this).children('ul').fadeIn(200);
			});
			li.mouseleave(function(e){
				$(this).children('ul').fadeOut(200);
			});
			if(li.children('ul').length > 0) {
				li.addClass("__arrow__");
			}
		}

		depth ++;
		li.children('ul').children('li').each(function(idx){
			__createJuiceNaviTopItem($(this), depth);
		});
	}
	// creating dropdown menu
	var items = $('.__juice_navi_top__ > ul > li');
	var depth = 0;
	items.each(function(idx){
		__createJuiceNaviTopItem($(this), depth);
	});
});

/**
 * Side Navigation
 */
$(function() {
	// recursive function for dropdown menu.
	function __createJuiceNaviSideItem(li, depth) {
		li.children('ul').hide();
		var showOption = null;
		var hideOption = null;
		if(depth == 0) {
			li.toggle();
			li.click(function(e){
				$(this).children('ul').slideToggle(200);
		        return false;
			});
		}else{
			li.click(function(e){
				$(this).children('ul').slideToggle(200);
				if(li.hasClass('__indent_fold__') == true) {
					li.removeClass('__indent_fold__');
					li.addClass('__indent_unfold__');
				}else if(li.hasClass('__indent_unfold__') == true) {
					li.removeClass('__indent_unfold__');
					li.addClass('__indent_fold__');
				}
		        return false;
			});
		}
		
		if(depth > 0) {
			li.addClass("__indent__");
			if(li.children('ul').length > 0) {
				li.addClass("__indent_fold__");
			}
			if(depth > 1) {
				li.css('padding-left', '24px');
			}
		}
		
		depth ++;
		li.children('ul').children('li').each(function(idx){
			__createJuiceNaviSideItem($(this), depth);
		});
	}
	// creating dropdown menu
	var items = $('.__juice_navi_side__ > ul > li');
	var depth = 0;
	items.each(function(idx){
		__createJuiceNaviSideItem($(this), depth);
	});
});

/**
 * Text style
 */
$(function() {
	// create text element.
	function __createJuiceText(container) {
		var input = container.children('input');
		// void
	}
	// creating text
	var items = $('.__juice_text__');
	items.each(function(idx){
		__createJuiceText($(this));
	});
});
/**
 * Number style
 */
$(function() {
	function __createJuiceNumber(container) {
		var input = container.children('input');
		input.val(__numberFormat(input.val()));
		input.keypress(function(e){
			var c = String.fromCharCode(e.keyCode);
			if(__isNumeric(c) == false) {
				return false;
			}
		});
		input.keyup(function(e){
			var value = input.val();
			value = __numberFormat(value);
			$(this).val(value);
		});
		function __isNumeric(c) {
			return /\d|[\,\.]/.test(c);
		}
		function __numberFormat(value){
			value = value.split(',').join('');
			var parts = value.split(".");
		    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		    value = parts.join(".");
		    return value;
		}
	}
	var items = $('.__juice_number__');
	items.each(function(idx) {
		__createJuiceNumber($(this));
	});
});
/**
 * Password style
 */
$(function() {
	// create text element.
	function __createJuicePassword(container) {
		var input = container.children('input');
		input.click(function(e){
			$(this).select();
		});
	}
	// creating text
	var items = $('.__juice_password__');
	items.each(function(idx){
		__createJuicePassword($(this));
	});
});
/**
 * Combo style
 */
$(function() {
	// create text element.
	function __createJuiceCombo(container) {
		var select = container.children('select');
		select.css('width', (container.outerWidth(true) + 22) + 'px');
		select.click(function(e){
			// void
		});
	}
	// creating text
	var items = $('.__juice_combo__');
	items.each(function(idx){
		__createJuiceCombo($(this));
	});
});
/**
 * Date style
 */
$(function() {
	// create text element.
	function __createJuiceDate(container) {
		var input = container.children('input');

		// on keypress
		input.keypress(function(e){
			var c = String.fromCharCode(e.keyCode);
			if(__isDateCharacter(c) == false) {
				return false;
			}
		});
		
		// on keyup
		input.keyup(function(e){
			var value = input.val();
			value = __dateFormat(value);
			$(this).val(value);
		});
		
		// checking valid date character
		function __isDateCharacter(c) {
			return /[\d\-]/.test(c);
		}
		
		// return date format string.
		function __dateFormat(value){
			str = value.replace(/[\D\-]/g,'');
			if(str.length == 5) {
				return str.replace(/(\d{4})/,'$1-');
			}else if(str.length == 7) {
				return str.replace(/(\d{4})(\d{2})/,'$1-$2-');
			}else if(str.length == 8){
				return str.replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3');
			}
			return value;
		}
		
		// parse date string into date object.
		function __parseDate(yyyymmdd) {
			yyyymmdd = yyyymmdd.replace(/[\D\-]/g,'');
			var yyyy = yyyymmdd.substring(0,4);
			var mm = yyyymmdd.substring(4,6);
			var dd = yyyymmdd.substring(6,8);
			return new Date(yyyy,mm-1,dd);
		}
		
		// creates picker elements.
		input.click(function(e){
			var yyyymmdd = $(this).val();
			if(yyyymmdd.replace(/[\-]/,'').length < 8) {
				__createPicker(new Date());
			}else{
				__createPicker(__parseDate(yyyymmdd));
			}
		});
		
		// removes picker elements.
		container.mouseleave(function(e){
			if(e.relatedTarget == null) return;
			__removePicker();
		});

		function __createPicker(date) {

			// defines year, month, date integer.
			var yyyy = date.getFullYear();
			var mm = date.getMonth();
			var dd = date.getDate();
			
			__removePicker();
			var pickerContainer = $('<div></div>');
			pickerContainer.addClass('__picker__');
			var dateContainer = $('<div></div>');
			dateContainer.addClass('__date__');
			var controlContainer = $('<div></div>');
			controlContainer.addClass('__control__');
			
			// creates year select
			var yearSelect = $('<select></select>');
			for(var i = yyyy - 5, end = yyyy + 5; i <= end; i ++ ) {
				yearSelect.append($('<option value="'+i+'" '+ (i == yyyy ? 'selected' : '') +'>' + i + '</option>'));
			}
			yearSelect.change(function(e){
				date.setFullYear($(this).val());
				__createPicker(date);
			});

			// creates month select
			var monthSelect = $('<select></select>');
			for(var i = 1, end = 12; i <= end; i ++ ) {
				monthSelect.append($('<option value="'+i+'" '+ (i == (mm+1) ? 'selected' : '') +'>' + i + '</option>'));
			}
			monthSelect.change(function(e){
				date.setMonth($(this).val()-1);
				__createPicker(date);
			});

			// creates button for previous month calendar.
			var prevButton = $('<button type="button"/>');
			prevButton.addClass('__prev_button__');
			prevButton.click(function(e){
				date.setMonth(date.getMonth() - 1);
				__createPicker(date);
			});
			
			// creates button for current date
			var currentButton = $('<button type="button"/>');
			currentButton.addClass('__current_button__');
			currentButton.click(function(e){
				__createPicker(new Date());
			});			
			
			// creates next button
			var nextButton = $('<button type="button"/>');
			nextButton.addClass('__next_button__');
			nextButton.click(function(e){
				date.setMonth(date.getMonth() + 1);
				__removePicker();
				__createPicker(date);
			});
			
			// creates calendar container and elements.
			var calendarContainer = $('<div class="__calendar__"></div>');
			calendarContainer.addClass('__calendar__');
			var calendarTable = $('<table width=100 height=100 border=1><thead><tr></tr></thead><tbody></tbody></table>');
			var theadTr = calendarTable.children('thead').children('tr');
			var dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			for (var i = 0, length = dayOfWeek.length; i < length; i++) {
				var th = $('<th>' + dayOfWeek[i] + '</th>');
				theadTr.append(th);
			}

			var startDay = new Date(yyyy,mm,1).getDay();
			
			var lastDates = [31,28,31,30,31,30,31,31,30,31,30,31];
			if (yyyy%4 && yyyy%100!=0 || yyyy%400===0) {
				lastDates[1] = 29;
			}
			var lastDate = lastDates[mm];
			
			var tbody = calendarTable.children('tbody');
			var rowNum = Math.ceil((startDay + lastDate)/7);
			var dNum = 1;
			var currentDate = new Date();
			var selectedDate = __selectedDate();
			for (var i=1; i<=rowNum; i++) {
				var tr = $('<tr></tr>');
			    for (var k=1; k<=7; k++) {
			        if(i===1 && k<=startDay || dNum>lastDate) {
			        	tr.append($("<td>&nbsp;</td>"));
			        } else {
			        	var yyyymmdd = __lpad(yyyy,4,'0') + '-' + __lpad(mm+1,2,'0') + '-' + __lpad(dNum,2,'0');
			        	td = $('<td date='+yyyymmdd+'>' + dNum + '</td>');
			        	if(yyyy == currentDate.getFullYear() && mm == currentDate.getMonth() && dNum == currentDate.getDate()) {
			        		td.addClass('__current__');
			        	}
			        	if(yyyy == selectedDate.getFullYear() && mm == selectedDate.getMonth() && dNum == selectedDate.getDate()) {
			        		td.addClass('__selected__');
			        	}
			        	td.click(function(e){
			        		var yyyymmdd = $(this).attr('date');
			        		__selectDate(yyyymmdd);
			        		tbody.find('.__selected__').each(function(){
			        			$(this).removeClass('__selected__');
			        		});
			        		$(this).addClass('__selected__');
			        	});
			        	tr.append(td);
			            dNum++;
			        }
			    }
			    tbody.append(tr);
			}
			pickerContainer.append(dateContainer);
			dateContainer.append(controlContainer);
			controlContainer.append(prevButton);
			controlContainer.append(currentButton);
			controlContainer.append(yearSelect);
			controlContainer.append(monthSelect);
			controlContainer.append(nextButton);
			dateContainer.append(calendarContainer);
			calendarContainer.append(calendarTable);
			container.append(pickerContainer);
		}

		function __removePicker() {
			var pickerContainer = container.children('.__picker__');
			pickerContainer.remove();
		}
		
		function __selectDate(value) {
			input.val(value);
		}
		
		function __selectedDate() {
			return __parseDate(input.val());
		}
		
		function __lpad(value, length, padChar) {
			value = value + '';
			for(var i = 0, size = (length-value.length); i < size; i ++ ) {
				value = padChar + value;
			}
			return value;
		}


	}
	// creating text
	var items = $('.__juice_date__');
	items.each(function(idx){
		__createJuiceDate($(this));
	});
});
/**
 * Textarea area
 */
$(function() {
	// create text element.
	function __createJuiceTextarea(container) {
		var mode = 'text';
		var textarea = container.children('textarea');
		
		// creates menu
		var menu = $('<div></div>');
		menu.addClass('__menu__');
		menu.insertBefore(textarea);
		
		// select font
		var selectFont = $('<select></select>');
		var fonts = ['굴림','돋움','궁서','Courier New'];
		for(var idx = 0, size = fonts.length; idx < size; idx ++ ) {
			var option = $('<option></opotion>');
			option.attr('value', fonts[idx]);
			option.css('font-family', fonts[idx]);
			option.text(fonts[idx]);
			selectFont.append(option);
		}
		selectFont.change(function(e){
//			alert($(this).val());
			var selectionStart = textarea.prop("selectionStart");
			var selectionEnd = textarea.prop("selectionEnd");
			var prevText = textarea.val().substring(0,selectionStart);
			var selectText = textarea.val().substring(selectionStart, selectionEnd);
			var nextText = textarea.val().substring(selectionEnd, textarea.val().length);
			textarea.val(prevText + "<b>" + selectText + "</b>" + nextText);


			
		});
		menu.append(selectFont);
		
		// select font
		var selectFontSize = $('<select></select>');
		var fontSizes = ['Small','Regular','Big','Extra'];
		for(var idx = 0, size = fontSizes.length; idx < size; idx ++ ) {
			var option = $('<option></opotion>');
			option.attr('value', fontSizes[idx]);
			option.text(fontSizes[idx]);
			selectFontSize.append(option);
		}
		menu.append(selectFontSize);
		
		// button bold
		var buttonBold = $('<button type="button"/>');
		buttonBold.addClass('__button_bold__');
		buttonBold.click(function(e){
			if(mode == 'html') {
				document.execCommand('bold',false,null);	
			}
			else if(mode == 'text') {
			var selectionStart = textarea.prop("selectionStart");
			var selectionEnd = textarea.prop("selectionEnd");
			var prevText = textarea.val().substring(0,selectionStart);
			var selectText = textarea.val().substring(selectionStart, selectionEnd);
			var nextText = textarea.val().substring(selectionEnd, textarea.val().length);
			textarea.val(prevText + "<b>" + selectText + "</b>" + nextText);
			}
		});
		menu.append(buttonBold);
		
		// button underline
		var buttonUnderline = $('<button type="button"/>');
		buttonUnderline.addClass('__button_underline__');
		buttonUnderline.click(function(e){
			alert('buttonUnderline');
		});
		menu.append(buttonUnderline);		
		
		// button italic
		var buttonItalic = $('<button type="button"/>');
		buttonItalic.addClass('__button_italic__');
		buttonItalic.click(function(e){
			alert('buttonItalic');
		});
		menu.append(buttonItalic);	
		
		// button font color
		var buttonColor = $('<button type="button"/>');
		buttonColor.addClass('__button_color__');
		buttonColor.click(function(e){
			alert('buttonColor');
		});
		menu.append(buttonColor);			
		
		// button html
		var buttonHtml = $('<button type="button"/>');
		buttonHtml.addClass('__button_text__');
		buttonHtml.click(function(e){
			if(mode == 'text') {
				htmlarea.html(textarea.val());
				mode = 'html';
				textarea.hide();
				htmlarea.show();
				$(this).removeClass("__button_text__");
				$(this).addClass("__button_html__");
			}
			else if(mode == 'html') {
				textarea.val(htmlarea.html());
				mode = 'text';
				htmlarea.hide();
				textarea.show();
				$(this).removeClass("__button_html__");
				$(this).addClass("__button_text__");
			}
		});
		menu.append(buttonHtml);
		
		// create html textarea
		var htmlarea = $('<pre></pre>');
		htmlarea.attr('contenteditable','true');
		htmlarea.addClass('__htmlarea__');
		htmlarea.height(textarea.height());
		htmlarea.hide();
		
		//htmlarea.hide();
		container.append(htmlarea);
		
		textarea.click(function(e){
			// void
		});
	}
	// creating text
	var items = $('.__juice_textarea__');
	items.each(function(idx){
		__createJuiceTextarea($(this));
	});
});


