import {Initializer} from "./Initializer";

// export class
export * from "./common"
export * from "./Configuration";
export * from "./Initializer";
export * from "./ProxyHandler";
export * from "./ArrayProxy";
export * from "./ObjectProxy";
export * from "./ElementRegistry"
export * from "./ObjectElement";
export * from "./ObjectElementFactory";
export * from "./ArrayElement";
export * from "./ArrayElementFactory";
export * from "./CustomElement";
export * from "./CustomElementFactory"
export * from "./element/ImgElementFactory"
export * from "./element/InputElementFactory"
export * from "./element/SelectElementFactory"
export * from "./element/TextareaElementFactory"
export * from "./dialog/Dialog";
export * from "./dialog/AlertDialog";
export * from "./dialog/ConfirmDialog";
export * from "./dialog/PromptDialog";
export * from "./tab/TabFolder";
export * from "./tab/TabItem";
// event
export * from "./event/PropertyChangingEvent";
export * from "./event/PropertyChangedEvent";
export * from "./event/ItemSelectingEvent";
export * from "./event/ItemSelectedEvent";
export * from "./event/ItemMovingEvent";
export * from "./event/ItemMovedEvent";

// initializes
(function() {
    // listen DOMContentLoaded
    if(globalThis.document) {
        document.addEventListener("DOMContentLoaded", event => {
            Initializer.initialize(document.documentElement, {});
        });
    }
    // listen history event and forward to DOMContentLoaded event
    if (globalThis.window) {
        ['popstate', 'pageshow'].forEach(event => {
            window.addEventListener(event, (e) => {
                if (event === 'pageshow' && !(e as PageTransitionEvent).persisted) return;
                document.dispatchEvent(new CustomEvent('DOMContentLoaded'));
            });
        });
    }
})();


