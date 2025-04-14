# DUICE (Data-binding UI Component Element)

[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-red?logo=github)](https://github.com/sponsors/chomookun)
[![Donate](https://img.shields.io/badge/Donate-Ko--fi-orange?logo=kofi)](https://ko-fi.com/chomookun)

[![Preview](https://img.youtube.com/vi/Dke_mQblaMk/0.jpg)](https://www.youtube.com/watch?v=Dke_mQblaMk)


## 🗒️ Conception

### 1. MVC Auto-Binding (between Data Structure and HTML DOM Element)

By using the Object and Array, bidirectional binding processing is performed with HTML DOM Element in charge of presentation of the screen.
(It's implemented by Internally it is Proxy and Observer Pattern)
When changing the data of Object and Array, the value of the UI DOM element binding was also automatically changed.
Conversely, if the user changes the value of the UI DOM Element, the binding Object and Array is automatically changed.

### 2. Reducing Learning Curve (Only simple HTML and javascript)

If you know only basic HTML format and Javascript,
configure it to be able to operate.

### 3. Pure Javascript Prototype (No Dependency, No Conflict)

This library is developted by just pure javascript.
It is oriented towards minimal code, no-dependency and no-conflict.
Therefore you can use it with another javascript library together.


---


## 🖥️ Demo site

### Website
[![](https://img.shields.io/badge/Website-https://duice.chomookun.org-green?logo=html5)](https://duice.chomookun.org)


---


## 🔗 References

### Git Repository
[![](https://img.shields.io/badge/Github-https://github.com/chomookun/duice-orange?logo=github)](https://github.com/chomookun/duice)

### NPM Package
[![](https://img.shields.io/badge/NPM-https://www.npmjs.com/package/duice-steelblue?logo=npm)](https://www.npmjs.com/package/duice)

### Plugin project
[![](https://img.shields.io/badge/Github-https://github.com/chomookun/duice--plugin-orange?logo=github)](https://github.com/chomookun/duice-plugin)

### Example project (Plain HTML + Integrated with Vue/React)
[![](https://img.shields.io/badge/Github-https://github.com/chomookun/duice--example-blue?logo=github)](https://github.com/chomookun/duice-example)

### Live Examples
[![](https://img.shields.io/badge/Arch4j-https://github.com/chomookun/arch4j-blue?logo=github)](https://github.com/chomookun/arch4j)
<br/>
[![](https://img.shields.io/badge/Fintics-https://github.com/chomookun/fintics-green?logo=github)](https://github.com/chomookun/fintics)


---


## 📁 Object Element 

[![](https://img.shields.io/badge/Test-/test/object--element--test.html-red?logo=html5)](test/object-element-test.html)

### Javascript

```javascript
const user = new duice.ObjectProxy({
    id: 'apple',
    name: 'Apple'
});
```

### HTML

```html
<span data-duice-bind="user" data-duice-property="id"></span>
<input type="text" data-duice-bind="user" data-duice-property="name"/>
```

### Attribute

| attribute                                  | description                                                         |
|:-------------------------------------------|:--------------------------------------------------------------------|
| data-duice-bind="[object]"                 | Object name to bind                                                 |
| data-duice-property="[property of object]" | Object Property name to bind                                        |
| data-duice-format="[data format clause]"   | ex) string('###-###'), number(2), date('yyyy-MM-dd')                |
| data-duice-if="[reutrn false to hiddne]"   | javascript code for decide to hidden or not |
| data-duice-execute="[code to execute]"     | javascript code to execute when element is updated                  |

### Event

```javascript
// Fires before property is changing.
duice.ObjectProxy.onPropertyChanging(user, event => {
    console.log(event);
});
// Fires after property is changed.
duice.ObjectProxy.onPropertyChanged(user, event => {
    console.log(event);
});
```

---


## 📁 Array Element 

[![](https://img.shields.io/badge/Test-test/array--element--test.html-blue?logo=html5)](test/array-element-test.html)

### Javascript

```javascript
const users = new duice.ArrayProxy([
    {id: 'apple', name: 'Apple'},
    {id: 'monkey', name: 'Monkey'},
    {id: 'orange', name: 'Orange'}
]);
```

### HTML

```html
<table>
    <tr>
        <th>no</th>
        <th>name</th>
        <th>name</th>
    </tr>
    <tr data-duice-bind="users" data-duice-foreach="user,status">
        <td data-duice-bind="status" data-duice-property="count"></td>
        <td data-duice-bind="user" data-duice-property="id"></td>
        <td><input type="text" data-duice-bind="user" data-duice-property="name"/></td>
    </tr>
</table>
```

### Attribute

| attribute                                         | description                             |
|:--------------------------------------------------|:----------------------------------------|
| data-duice-bind="[array]"                         | Object name to bind                     |
| data-duice-foreach="[element name],[status name]" | element object and status variable name |
| data-duice-recursive="[id name],[parent id name]" | if recursive, id and parent id name     |
| data-duice-if="[reutrn false to hiddne]"   | javascript code for decide to hidden or not |
| data-duice-execute="[code to execute]"     | javascript code to execute when element is updated                  |

### Event

```javascript
// Fires before property is changing.
duice.ObjectProxy.onPropertyChanging(users, event => {
    console.log(event);
});
// Fires after property is changed.
duice.ObjectProxy.onPropertyChanged(users, event => {
    console.log(event);
});
// Fires before item is selecting.
duice.ArrayProxy.onItemSelecting(users, event => {
    console.log(event);
});
// Fires after item is selected.
duice.ArrayProxy.onItemSelected(users, event => {
    console.log(event);
});
// Fires before item is moving.
duice.ArrayProxy.onItemMoving(users, event => {
    console.log(event);
});
// Fires after item is moved.
duice.ArrayProxy.onItemMoved(users, event => {
    console.log(event);
});
```


---


## 📁 Dialog(alert,confirm,prompt,custom dialog)

[![](https://img.shields.io/badge/Test-/dialog/dialog--test.html-green?logo=html5)](test/dialog/dialog-test.html)

### Javascript
```javascript
// await style
async function confirmAwait() {
    if(await duice.confirm('<b>Hello~</b>\nThis is confirm message!\nYes or No?')){
        alert(true);
    }else{
        alert(false);
    }
}

// then style
async function confirmThen() {
    duice.confirm('<b>Hello~</b>\nThis is confirm message!\nYes or No?').then((result) =>{
        if(result) {
            alert(true);
        }else{
            alert(false);
        }
    });
}

// custom dialog from HTML Dialog Element
async function openDialog() {
    duice.openDialog(document.getElementById('myDialog')).then(()=>{
        alert('do next');
    });
}
```

### HTML 

```html
<dialog id="myDialog">
    <pre>
        Custom Dialog
    </pre>
</dialog>
```


