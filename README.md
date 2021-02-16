# **DUICE** (Data-oriented UI Component Engine)
------------------------------------------------------------------------------------------

## Concept

### MVC Auto-Binding (between Data Structure and HTML DOM Element)
By using the installed DataMap and DataList Data Structure, bidirectional binding processing is performed with Element in charge of presentation of the screen. (Internally it is Observer Pattern)
When changing the data of DataMap and DataList, the value of the UI DOM element binding was also automatically changed.
Conversely, if the user changes the value of the UI DOM Element, the binding data is automatically changed.

### Reducing Learning Curve (via Just Simple HTML5 data-* Attribute)
If you know only basic HTML format and Javascript, configure it to be able to operate.
JQuery, AgularJS, ReactJS .. It is really a spring and autumn season. Something is just about new.
The running curve is too large.
I just want simple things to work. It is possible to set only HTML5 custom attribute data- *.

### Pure Javascript Prototype (No Dependency, No Conflict)
This library is developted by just pure javascript prototype. It is oriented towards minimal code, no-dependency and no-conflict.
Therefore you can use it with another javascript library together.
You can use it with JQuery, AngularJS and so on, also Responsive UI framework like Bootstrap.

------------------------------------------------------------------------------------------

## References 

### Demo page
<a href ="https://oopscraft.github.io/duice/src/duice.html" target="_blank">
	duice.html
</a>

### application.oopscraft.net (Standalone Application Platform)
<a href ="http://application.oopscraft.net/admin" target="_blank">
	http://application.oopscraft.net/admin
</a>
user/pass : test/test11!!

### Official Website
<a href="https://oopscraft.github.io/duice" target="_blank">
	https://oopscraft.github.io/duice/
</a>

### Source Repository
<a href="https://github.com/oopscraft/duice" target="_blank">
	https://github.com/oopscraft/duice
</a>

### Distribution Download
<a href="https://oopscraft.github.io/duice/dist/duice-0.1.2.zip" target="_blank">
	duice-0.1.2.zip
</a>

### Licence
Anyone can use it freely.
Modify the source or allow re-creation. However, you must state that you have the original creator.
However, we can not grant patents or licenses for reproductives. (Modifications or reproductions must be shared with the public.)
Licence: LGPL(GNU Lesser General Public License version 3)
Copyright (C) 2017 duice.oopscraft.net
Contact <chomookun@gmail.com>

------------------------------------------------------------------------------------------

## Data Structure

### duice.Map
The Map object holds key-value pairs and remembers the original insertion order of the keys. Any value (both objects and primitive values) may be used as either a key or a value.

<p class="codepen" data-height="478" data-theme-id="dark" data-default-tab="js" data-user="chomookun" data-slug-hash="rNxyaGQ" style="height: 478px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="duice.Map">
  <span>See the Pen <a href="https://codepen.io/chomookun/pen/rNxyaGQ">
  duice.Map</a> by chomookun (<a href="https://codepen.io/chomookun">@chomookun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### duice.List
The duice.List class is a resizable array.

<p class="codepen" data-height="411" data-theme-id="dark" data-default-tab="js" data-user="chomookun" data-slug-hash="ZEQeGzZ" style="height: 411px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="duice.List">
  <span>See the Pen <a href="https://codepen.io/chomookun/pen/ZEQeGzZ">
  duice.List</a> by chomookun (<a href="https://codepen.io/chomookun">@chomookun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

------------------------------------------------------------------------------------------

## Map Component

### <span is="duice-span" data-duice-bind="[map],[name]" ...></span>
data-bindable span custom element.

<p class="codepen" data-height="267" data-theme-id="dark" data-default-tab="html,result" data-user="chomookun" data-slug-hash="dyGvoJR" style="height: 267px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="&amp;lt;span is=&amp;quot;duice-span&amp;quot; data-duice-bind=&amp;quot;map,name&amp;quot; ...">
  <span>See the Pen <a href="https://codepen.io/chomookun/pen/dyGvoJR">
  &lt;span is=&quot;duice-span&quot; data-duice-bind=&quot;map,name&quot; ...</a> by chomookun (<a href="https://codepen.io/chomookun">@chomookun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### <div is="duice-div" data-duice-bind="[map],[name]" ...></div>
data-bindable div custom element

<p class="codepen" data-height="260" data-theme-id="dark" data-default-tab="html,result" data-user="chomookun" data-slug-hash="XWXMbYX" style="height: 260px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="&amp;lt;div is=&amp;quot;duice-div&amp;quot; data-duice-bind=&amp;quot;map,name&amp;quot; ...">
  <span>See the Pen <a href="https://codepen.io/chomookun/pen/XWXMbYX">
  &lt;div is=&quot;duice-div&quot; data-duice-bind=&quot;map,name&quot; ...</a> by chomookun (<a href="https://codepen.io/chomookun">@chomookun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### <input is="duice-input" type="text" data-duice-bind="[map],[name]" .../>
data-bindable input custom element.

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="chomookun" data-slug-hash="XWXMbwj" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="&amp;lt;input is=&amp;quot;duice-input&amp;quot; type=&amp;quot;text&amp;quot; data-duice-bind=&amp;quot;[map],[name]&amp;quot; ...">
  <span>See the Pen <a href="https://codepen.io/chomookun/pen/XWXMbwj">
  &lt;input is=&quot;duice-input&quot; type=&quot;text&quot; data-duice-bind=&quot;[map],[name]&quot; ...</a> by chomookun (<a href="https://codepen.io/chomookun">@chomookun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### <input is="duice-input" type="number" data-duice-bind="[map],[name]".../>
data-bindable input number custom tag.

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="chomookun" data-slug-hash="BajWWgm" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="&amp;lt;input is=&amp;quot;duice-input&amp;quot; type=&amp;quot;number&amp;quot; data-duice-bind=&amp;quot;[map],[name]&amp;quot;.../&amp;gt;">
  <span>See the Pen <a href="https://codepen.io/chomookun/pen/BajWWgm">
  &lt;input is=&quot;duice-input&quot; type=&quot;number&quot; data-duice-bind=&quot;[map],[name]&quot;.../&gt;</a> by chomookun (<a href="https://codepen.io/chomookun">@chomookun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### <input is="duice-input" type="checkbox" data-duice-bind="[map],[name]" .../>
input checkbox

<p class="codepen" data-height="323" data-theme-id="dark" data-default-tab="js,result" data-user="chomookun" data-slug-hash="dyGvWPX" style="height: 323px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="&amp;lt;input is=&amp;quot;duice-input&amp;quot; type=&amp;quot;checkbox&amp;quot; data-duice-bind=&amp;quot;[map],[name]&amp;quot; .../&amp;gt;">
  <span>See the Pen <a href="https://codepen.io/chomookun/pen/dyGvWPX">
  &lt;input is=&quot;duice-input&quot; type=&quot;checkbox&quot; data-duice-bind=&quot;[map],[name]&quot; .../&gt;</a> by chomookun (<a href="https://codepen.io/chomookun">@chomookun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>








