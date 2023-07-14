# DUICE (Data-oriented UI Component Element)

## Conception

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

-----------------------------------------------------------

## Git and Website

* Git Repository: [https://github.com/oopscraft/duice](https://github.com/oopscraft/duice)
* Website: [https://duice.oopscraft.org](https://duice.oopscraft.org)

## Demo Site

* Arch4j: [https://arch4j-web.oopscraft.org/admin](https://arch4j-web.oopscraft.org/admin)
* Test Account: **dev/dev**

-----------------------------------------------------------

## Object Element 


### Javascript

```javascript
const user = new duice.ObjectProxy({
    id: 'apple',
    name: 'Apple'
});
```

### HTML

| attribute                                  | description                                          |
|:-------------------------------------------|:-----------------------------------------------------|
| data-duice-bind="[object]"               | Object name to bind                                  |
| data-duice-property="[property of object]" | Object Property name to bind                         |
| data-duice-script="[script code]"          | javascript code to execute when element is updated   |
| data-duice-format="[data format clause]"   | ex) string('###-###'), number(2), date('yyyy-MM-dd') |

```html
<span data-duice-bind="user" data-duice-property="id"></span>
<input type="text" data-duice-bind="user" data-duice-property="name"/>
```

### Test Case
[Object Element Test](test/ObjectElementTest.html)


-----------------------------------------------------------


## Array Element 

### Javascript

```javascript
const users = new duice.ArrayProxy([
    {id: 'apple', name: 'Apple'},
    {id: 'monkey', name: 'Monkey'},
    {id: 'orange', name: 'Orange'}
]);
```

### HTML

| attribute                                      | description                              |
|:-----------------------------------------------|:-----------------------------------------|
| data-duice-bind="[array]"                     | Object name to bind                      |
| data-duice-loop="[element name],[status name]" | element object and status variable name  |
| data-duice-script="[script code]"              | javascript code to execute when element is updated   |

```html
<table>
    <tr>
        <th>no</th>
        <th>name</th>
        <th>name</th>
    </tr>
    <tr data-duice-bind="users" data-duice-loop="user,status">
        <td data-duice-bind="status" data-duice-property="count"></td>
        <td data-duice-bind="user" data-duice-property="id"></td>
        <td><input type="text" data-duice-bind="user" data-duice-property="name"/></td>
    </tr>
</table>
```

### Test Case 

[Array Element Test](test/ArrayElementTest.html)


-----------------------------------------------------------


## Custom Element 

### Javascript

```javascript
duice.defineCustomElement("my-object", class extends duice.CustomElement {
    doRender(object) {
        return this.createElement(`
                    <div>
                        <span data-duice-bind="object" data-duice-property="name"></span>
                        <input type="text" data-duice-bind="object" data-duice-property="name" class="bg-red"/>
                    </div>
                `);
    }

    // (optional)
    doStyle(data) {
        return `
                    .bg-red {
                        background-color: red;
                    }
                `;
    }
});
```

### HTML

| attribute                    | description                              |
|:-----------------------------|:-----------------------------------------|
| data-duice-bind="[object name]" | Object name to bind                      |
| data-duice-bind="[array name]"   | Array name to bind                       |

```html

<script>
    let myObject = new duice.ObjectProxy({
        id: 'apple',
        name: 'Apple',
    });
</script>

<my-object data-duice-bind="myObject"></my-object>

```

### Test Case

[Custom Element Test](test/CustomElementTest.html)


------------------------------------------------------


## Dialog(alert,confirm,prompt,custom dialog)

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

### Test Case

[Dialog/Alert/Confirm/Prompt Test](test/dialog/DialogTest.html)


-----------------------------------------------------------

## License

DUICE (Data-oriented UI Component Element)
Copyright (C) 2016 oopscraft.org

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


## Contact
* email: [chomookun@gmailcom](mailto:chomookun@gmail.com)
* linkedin: [https://www.linkedin.com/in/chomookun](https://www.linkedin.com/in/chomookun)

