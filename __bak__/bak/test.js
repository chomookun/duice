// when document exit.
$(window).on("beforeunload", function(){
    return "When you move the screen, the changed data will be initialized.";
});

// clear and load library
var libraries = new Array();
function setLibrary(library){
	console.log(library);
	for(var i = 0; i < libraries.length; i ++ ) {
		document.head.removeChild(libraries[i]);
	}
	libraries = new Array();
	switch(library){
	case 'bootstrap':
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = 'lib/bootstrap/css/bootstrap.min.css';
		document.head.appendChild(link);
		libraries.push(link);
		var script = document.createElement('script');
		script.src = 'lib/bootstrap/js/bootstrap.min.js';
		document.head.appendChild(script);
		libraries.push(script);
	break;
	}
	console.log(libraries);
}

// repository for test data
var repository = {
	entities : {},
	setEntity : function(name, entity) {
		this.entities[name] = entity;
	},
	getEntity : function(name) {
		return this.entities[name];
	},
	indexOf : function(name, where) {
		var entity = this.getEntity(name);
		for (var i = 0, size = entity.length; i < size; i++) {
			var item = entity[i];
			if (this.compare(item, where)) {
				return i;
			}
		}
		return -1;
	},
	compare : function(item, where) {
		for ( var column in where) {
			if (where[column] !== item[column]) {
				return false;
			}
		}
		return true;
	},
	compareLike : function(item, where) {
		for ( var column in where) {
			if (item[column].indexOf(where[column]) == -1) {
				return false;
			}
		}
		return true;
	},
	find : function(name, rows, page, where) {
		var list = new Array();
		var entity = this.getEntity(name);
		var offset = rows * (page - 1);
		for (var i = 0, size = entity.length; i < size; i++) {
			if (i < offset) {
				continue;
			}
			var item = entity[i];
			if (where) {
				if (this.compareLike(item, where) == true) {
					list.push(item);
				}
			} else {
				list.push(item);
			}
			if (list.length >= rows) {
				break;
			}
		}
		return list;
	},
	findOne : function(name, where) {
		var index = this.indexOf(name, key, value);
		return this.getEntity(name)[index];
	},
	saveOne : function(name, key, where, item) {
		var index = this.indexOf(name, where);
		if (index > -1) {
			this.getEntity(name).splice(index, 1, item);
		} else {
			this.getEntity(name).splice(0, 0, item);
		}
	},
	deleteOne : function(name, where) {
		var index = this.indexOf(name, where);
		this.getEntity(name).splice(index, 1);
	}
}

// add users
repository.setEntity('users',[
	 {id:'apple',email:'apple@gmail.com',name:'James Anderson',nickname:'Apple',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'orange',email:'orange@gmail.com',name:'Olivia Brown',nickname:'Orange',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'grape',email:'grape@gmail.com',name:'David Johnson',nickname:'Grape',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'banana',email:'banana@gmail.com',name:'Olivia Brown',nickname:'Orange',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'melon',email:'melon@gmail.com',name:'David Johnson',nickname:'Melon',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'cherry',email:'cherry@gmail.com',name:'James Anderson',nickname:'Cherry',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'tomato',email:'tomato@gmail.com',name:'Olivia Brown',nickname:'Tomato',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'mango',email:'mango@gmail.com',name:'David Johnson',nickname:'Mango',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'lemon',email:'lemon@gmail.com',name:'Olivia Brown',nickname:'Lemon',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'potato',email:'potato@gmail.com',name:'David Johnson',nickname:'Potato',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'orange1',email:'orange@gmail.com',name:'Olivia Brown',nickname:'Orange',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'grape1',email:'grape@gmail.com',name:'David Johnson',nickname:'Grape',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'banana1',email:'banana@gmail.com',name:'Olivia Brown',nickname:'Orange',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'melon1',email:'melon@gmail.com',name:'David Johnson',nickname:'Melon',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'cherry1',email:'cherry@gmail.com',name:'James Anderson',nickname:'Cherry',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'tomato1',email:'tomato@gmail.com',name:'Olivia Brown',nickname:'Tomato',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'mango1',email:'mango@gmail.com',name:'David Johnson',nickname:'Mango',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'lemon1',email:'lemon@gmail.com',name:'Olivia Brown',nickname:'Lemon',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'potato1',email:'potato@gmail.com',name:'David Johnson',nickname:'Potato',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'orange2',email:'orange@gmail.com',name:'Olivia Brown',nickname:'Orange',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'grape2',email:'grape@gmail.com',name:'David Johnson',nickname:'Grape',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'banana2',email:'banana@gmail.com',name:'Olivia Brown',nickname:'Orange',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'melon2',email:'melon@gmail.com',name:'David Johnson',nickname:'Melon',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'cherry2',email:'cherry@gmail.com',name:'James Anderson',nickname:'Cherry',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'tomato2',email:'tomato@gmail.com',name:'Olivia Brown',nickname:'Tomato',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'mango2',email:'mango@gmail.com',name:'David Johnson',nickname:'Mango',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'lemon2',email:'lemon@gmail.com',name:'Olivia Brown',nickname:'Lemon',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'potato2',email:'potato@gmail.com',name:'David Johnson',nickname:'Potato',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'orange3',email:'orange@gmail.com',name:'Olivia Brown',nickname:'Orange',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'grape3',email:'grape@gmail.com',name:'David Johnson',nickname:'Grape',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'banana3',email:'banana@gmail.com',name:'Olivia Brown',nickname:'Orange',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'melon3',email:'melon@gmail.com',name:'David Johnson',nickname:'Melon',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'cherry3',email:'cherry@gmail.com',name:'James Anderson',nickname:'Cherry',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'tomato3',email:'tomato@gmail.com',name:'Olivia Brown',nickname:'Tomato',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'mango3',email:'mango@gmail.com',name:'David Johnson',nickname:'Mango',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'lemon3',email:'lemon@gmail.com',name:'Olivia Brown',nickname:'Lemon',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'potato3',email:'potato@gmail.com',name:'David Johnson',nickname:'Potato',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'orange4',email:'orange@gmail.com',name:'Olivia Brown',nickname:'Orange',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'grape4',email:'grape@gmail.com',name:'David Johnson',nickname:'Grape',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'banana4',email:'banana@gmail.com',name:'Olivia Brown',nickname:'Orange',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'melon4',email:'melon@gmail.com',name:'David Johnson',nickname:'Melon',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'cherry4',email:'cherry@gmail.com',name:'James Anderson',nickname:'Cherry',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'tomato4',email:'tomato@gmail.com',name:'Olivia Brown',nickname:'Tomato',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'mango4',email:'mango@gmail.com',name:'David Johnson',nickname:'Mango',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'lemon4',email:'lemon@gmail.com',name:'Olivia Brown',nickname:'Lemon',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'potato4',email:'potato@gmail.com',name:'David Johnson',nickname:'Potato',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'orange5',email:'orange@gmail.com',name:'Olivia Brown',nickname:'Orange',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'grape5',email:'grape@gmail.com',name:'David Johnson',nickname:'Grape',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'banana5',email:'banana@gmail.com',name:'Olivia Brown',nickname:'Orange',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'melon5',email:'melon@gmail.com',name:'David Johnson',nickname:'Melon',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'cherry5',email:'cherry@gmail.com',name:'James Anderson',nickname:'Cherry',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'tomato5',email:'tomato@gmail.com',name:'Olivia Brown',nickname:'Tomato',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'mango5',email:'mango@gmail.com',name:'David Johnson',nickname:'Mango',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'lemon5',email:'lemon@gmail.com',name:'Olivia Brown',nickname:'Lemon',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'potato5',email:'potato@gmail.com',name:'David Johnson',nickname:'Potato',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'orange6',email:'orange@gmail.com',name:'Olivia Brown',nickname:'Orange',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'grape6',email:'grape@gmail.com',name:'David Johnson',nickname:'Grape',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'banana6',email:'banana@gmail.com',name:'Olivia Brown',nickname:'Orange',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'melon6',email:'melon@gmail.com',name:'David Johnson',nickname:'Melon',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'cherry6',email:'cherry@gmail.com',name:'James Anderson',nickname:'Cherry',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'tomato6',email:'tomato@gmail.com',name:'Olivia Brown',nickname:'Tomato',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'mango6',email:'mango@gmail.com',name:'David Johnson',nickname:'Mango',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'lemon6',email:'lemon@gmail.com',name:'Olivia Brown',nickname:'Lemon',gender: 'F',password:'abcd1234!@',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{id:'potato6',email:'potato@gmail.com',name:'David Johnson',nickname:'Potato',gender: 'M',password:'abcd1234!@',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
]);

// adds groups
repository.setEntity('groups', JSON.stringify([
	 {group:'mgm1',name:'Management',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'dev1',name:'Development',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'sal1',name:'Sales',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mkt1',name:'Marketing',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'spt1',name:'Support',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mgm2',name:'Management',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'dev2',name:'Development',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'sal2',name:'Sales',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mkt2',name:'Marketing',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'spt2',name:'Support',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mgm3',name:'Management',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'dev3',name:'Development',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'sal3',name:'Sales',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mkt3',name:'Marketing',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'spt3',name:'Support',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mgm4',name:'Management',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'dev4',name:'Development',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'sal4',name:'Sales',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mkt4',name:'Marketing',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'spt4',name:'Support',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mgm5',name:'Management',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'dev5',name:'Development',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'sal5',name:'Sales',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mkt5',name:'Marketing',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'spt5',name:'Support',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mgm6',name:'Management',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'dev6',name:'Development',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'sal6',name:'Sales',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mkt6',name:'Marketing',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'spt6',name:'Support',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mgm11',name:'Management',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'dev11',name:'Development',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'sal11',name:'Sales',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mkt11',name:'Marketing',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'spt11',name:'Support',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mgm21',name:'Management',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'dev21',name:'Development',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'sal21',name:'Sales',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mkt21',name:'Marketing',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'spt21',name:'Support',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mgm31',name:'Management',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'dev31',name:'Development',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'sal31',name:'Sales',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mkt31',name:'Marketing',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'spt31',name:'Support',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mgm41',name:'Management',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'dev41',name:'Development',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'sal41',name:'Sales',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mkt41',name:'Marketing',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'spt41',name:'Support',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mgm51',name:'Management',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'dev51',name:'Development',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'sal51',name:'Sales',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mkt51',name:'Marketing',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'spt51',name:'Support',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mgm61',name:'Management',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'dev61',name:'Development',useYn:'Y',delete:true,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'sal61',name:'Sales',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'mkt61',name:'Marketing',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
	,{group:'spt61',name:'Support',useYn:'Y',delete:false,description:'I am generous.\nI am generous.\nI am generous.\n'}
]));

repository.setEntity('userGroups', JSON.stringify([
	 {id:'apple',group:"mgm1"}
	,{id:'orange',group:"dev2"}
	,{id:'grape',group:"sal3"}
	,{id:'banana',group:"mkt4"}
	,{id:'melon',group:"mgm5"}
	,{id:'cherry',group:"dev6"}
	,{id:'tomato',group:"mkt5"}
	,{id:'mango',group:"spt4"}
	,{id:'lemon',group:"spt3"}
	,{id:'potato',group:"mgm2"}
	,{id:'orange1',group:"dev5"}
	,{id:'grape1',group:"sal4"}
	,{id:'banana1',group:"mkt3"}
	,{id:'melon1',group:"mgm2"}
	,{id:'cherry1',group:"dev1"}
	,{id:'tomato1',group:"mkt2"}
	,{id:'mango1',group:"spt3"}
	,{id:'lemon1',group:"spt4"}
	,{id:'potato1',group:"mgm5"}
	,{id:'orange2',group:"dev4"}
	,{id:'grape2',group:"sal4"}
	,{id:'banana2',group:"mkt3"}
	,{id:'melon2',group:"mgm2"}
	,{id:'cherry2',group:"dev6"}
	,{id:'tomato2',group:"mkt6"}
	,{id:'mango2',group:"spt6"}
	,{id:'lemon2',group:"spt5"}
	,{id:'potato2',group:"mgm4"}
	,{id:'orange3',group:"dev2"}
	,{id:'grape3',group:"sal3"}
	,{id:'banana3',group:"mkt4"}
	,{id:'melon3',group:"mgm2"}
	,{id:'cherry3',group:"dev4"}
	,{id:'tomato3',group:"mkt3"}
	,{id:'mango3',group:"spt5"}
	,{id:'lemon3',group:"spt2"}
	,{id:'potato3',group:"mgm1"}
	,{id:'orange4',group:"dev3"}
	,{id:'grape4',group:"sal2"}
	,{id:'banana4',group:"mkt2"}
	,{id:'melon4',group:"mgm1"}
	,{id:'cherry4',group:"dev6"}
	,{id:'tomato4',group:"mkt5"}
	,{id:'mango4',group:"spt6"}
	,{id:'lemon4',group:"spt5"}
	,{id:'potato4',group:"mgm4"}
	,{id:'orange5',group:"dev2"}
	,{id:'grape5',group:"sal2"}
	,{id:'banana5',group:"mkt5"}
	,{id:'melon5',group:"mgm6"}
	,{id:'cherry5',group:"dev5"}
	,{id:'tomato5',group:"mkt4"}
	,{id:'mango5',group:"sal1"}
	,{id:'lemon5',group:"spt2"}
	,{id:'potato5',group:"mgm1"}
	,{id:'orange6',group:"dev3"}
	,{id:'grape6',group:"sal5"}
	,{id:'banana6',group:"mkt2"}
	,{id:'melon6',group:"mgm3"}
	,{id:'cherry6',group:"dev2"}
	,{id:'tomato6',group:"mkt5"}
	,{id:'mango6',group:"spt6"}
	,{id:'lemon6',group:"spt5"}
	,{id:'potato6',group:"sal2"}
	,{id:'apple',group:"mgm11"}
	,{id:'orange',group:"dev21"}
	,{id:'grape',group:"sal31"}
	,{id:'banana',group:"mkt41"}
	,{id:'melon',group:"mgm51"}
	,{id:'cherry',group:"dev61"}
	,{id:'tomato',group:"mkt51"}
	,{id:'mango',group:"spt41"}
	,{id:'lemon',group:"spt31"}
	,{id:'potato',group:"mgm21"}
	,{id:'orange1',group:"dev51"}
	,{id:'grape1',group:"sal41"}
	,{id:'banana1',group:"mkt31"}
	,{id:'melon1',group:"mgm21"}
	,{id:'cherry1',group:"dev11"}
	,{id:'tomato1',group:"mkt21"}
	,{id:'mango1',group:"spt31"}
	,{id:'lemon1',group:"spt41"}
	,{id:'potato1',group:"mgm51"}
	,{id:'orange2',group:"dev41"}
	,{id:'grape2',group:"sal41"}
	,{id:'banana2',group:"mkt31"}
	,{id:'melon2',group:"mgm21"}
	,{id:'cherry2',group:"dev61"}
	,{id:'tomato2',group:"mkt61"}
	,{id:'mango2',group:"spt61"}
	,{id:'lemon2',group:"spt51"}
	,{id:'potato2',group:"mgm41"}
	,{id:'orange3',group:"dev21"}
	,{id:'grape3',group:"sal31"}
	,{id:'banana3',group:"mkt41"}
	,{id:'melon3',group:"mgm21"}
	,{id:'cherry3',group:"dev41"}
	,{id:'tomato3',group:"mkt31"}
	,{id:'mango3',group:"spt51"}
	,{id:'lemon3',group:"spt21"}
	,{id:'potato3',group:"mgm11"}
	,{id:'orange4',group:"dev31"}
	,{id:'grape4',group:"sal21"}
	,{id:'banana4',group:"mkt21"}
	,{id:'melon4',group:"mgm11"}
	,{id:'cherry4',group:"dev61"}
	,{id:'tomato4',group:"mkt51"}
	,{id:'mango4',group:"spt61"}
	,{id:'lemon4',group:"spt51"}
	,{id:'potato4',group:"mgm41"}
	,{id:'orange5',group:"dev21"}
	,{id:'grape5',group:"sal21"}
	,{id:'banana5',group:"mkt51"}
	,{id:'melon5',group:"mgm61"}
	,{id:'cherry5',group:"dev51"}
	,{id:'tomato5',group:"mkt41"}
	,{id:'mango5',group:"sal11"}
	,{id:'lemon5',group:"spt21"}
	,{id:'potato5',group:"mgm11"}
	,{id:'orange6',group:"dev31"}
	,{id:'grape6',group:"sal51"}
	,{id:'banana6',group:"mkt21"}
	,{id:'melon6',group:"mgm31"}
	,{id:'cherry6',group:"dev21"}
	,{id:'tomato6',group:"mkt51"}
	,{id:'mango6',group:"spt61"}
	,{id:'lemon6',group:"spt51"}
	,{id:'potato6',group:"sal21"}
]));	

