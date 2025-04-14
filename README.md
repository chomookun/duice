# DUICE (Data-binding UI Component Element)

[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-red?logo=github)](https://github.com/sponsors/chomookun)
[![Donate](https://img.shields.io/badge/Donate-Ko--fi-orange?logo=kofi)](https://ko-fi.com/chomookun)

[![Preview](https://img.youtube.com/vi/Dke_mQblaMk/0.jpg)](https://www.youtube.com/watch?v=Dke_mQblaMk)


---


## 🗒️ Conception

### 1. MVC Auto-Binding (Between Data and DOM)

Automatically synchronizes data and UI by binding JavaScript Object and Array to HTML DOM elements.
<br/>
Changes to data are immediately reflected in the UI, and user input in the UI automatically updates the underlying data.
<br/>
This bidirectional binding is powered internally by JavaScript Proxy and the Observer pattern.

### 2. Low Learning Curve (Just HTML + JavaScript)

If you know basic HTML and JavaScript, you’re ready to go.
<br/>
No need to learn complex syntax or frameworks — just write standard HTML and bind data intuitively.

### 3. Pure JavaScript, No Dependencies

This library is built with pure vanilla JavaScript — no dependencies, no conflicts.
<br/>
It’s lightweight, framework-agnostic, and can be seamlessly used alongside any other JavaScript libraries or frameworks.



---


## 🖥️ Demo site

### Website
[![](https://img.shields.io/badge/Website-https://duice.chomookun.org-green?logo=html5)](https://duice.chomookun.org)

### Example project 
[![](https://img.shields.io/badge/Duice%20example-https://gcp.duice--example.chomookun.org-blue?logo=html5)](https://gcp.duice-example.chomookun.org)
<br/>
Plain HTML + Integrated with Vue/React examples

### Live Examples
[![](https://img.shields.io/badge/Arch4j-https://gcp.arch4j--web.chomookun.org/admin-blue?logo=html5)](https://gcp.arch4j-web.chomookun.org/admin)
<br/>
[![](https://img.shields.io/badge/Fintics-https://gcp.fintics--web.chomookun.org-green?logo=html5)](https://gcp.fintics-web.chomookun.org)
<br/>
Credentials: **developer/developer<br/>**
Because of cold start, Waits about 30 seconds to start the server.

---

## 🏁 Getting Started

### CDN (jsdelivr.net)
```html
<script src="https://cdn.jsdelivr.net/npm/duice/dist/duice.min.js"></script>
<!-- (optional) symple style -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/duice/dist/duice.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/duice/dist/duice-theme.css">
```

### CDN (unpkg.com)
```html
<script src="https://unpkg.com/duice/dist/duice.min.js"></script>
<!-- (optional) symple style -->
<link rel="stylesheet" href="https://unpkg.com/duice/dist/duice.css">
<link rel="stylesheet" href="https://unpkg.com/duice/dist/duice-theme.css">
```

### NPM package
```shell
npm install duice
```

---

## 🔗 References

### Git Repository
[![](https://img.shields.io/badge/Github-https://github.com/chomookun/duice-orange?logo=github)](https://github.com/chomookun/duice)

### NPM Package
[![](https://img.shields.io/badge/NPM-https://www.npmjs.com/package/duice-steelblue?logo=npm)](https://www.npmjs.com/package/duice)

### Plugin project
[![](https://img.shields.io/badge/Github-https://github.com/chomookun/duice--plugin-orange?logo=github)](https://github.com/chomookun/duice-plugin)
<br/>
Plugin project integrated with pagination, codemirror, marked, jsplumb ...

---

## 📁 Object Element 

[![](https://img.shields.io/badge/Test-object--element--test.html-red?logo=html5)](https://duice.chomookun.org/test/object-element-test.html)
<br/>
Data binding example between **Object Proxy - HTML Element**.

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

[![](https://img.shields.io/badge/Test-array--element--test.html-blue?logo=html5)](https://duice.chomookun.org/test/array-element-test.html)
<br/>
Data binding example between **Array Proxy - HTML Element**.


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

[![](https://img.shields.io/badge/Test-dialog/dialog--test.html-green?logo=html5)](https://duice.chomookun.org/test/dialog/dialog-test.html)
<br/>
Custom alert, confirm, prompt dialog example.


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

