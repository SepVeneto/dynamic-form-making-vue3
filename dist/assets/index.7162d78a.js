var P=Object.defineProperty,I=Object.defineProperties;var T=Object.getOwnPropertyDescriptors;var E=Object.getOwnPropertySymbols;var $=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable;var x=(e,a,l)=>a in e?P(e,a,{enumerable:!0,configurable:!0,writable:!0,value:l}):e[a]=l,_=(e,a)=>{for(var l in a||(a={}))$.call(a,l)&&x(e,l,a[l]);if(E)for(var l of E(a))L.call(a,l)&&x(e,l,a[l]);return e},b=(e,a)=>I(e,T(a));import{c as B,u as J,d as f,r as p,a as S,b as t,e as m,f as V,m as k,g as o,o as G,h as q,i as M,w as Y,F as K,j as R,k as z}from"./vendor.6d2fe382.js";const H=function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function l(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerpolicy&&(r.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?r.credentials="include":n.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=l(n);fetch(n.href,r)}};H();const N=Symbol();function U(){return J(N)}function h(e,a){for(let l=0;l<e.length;++l){if(e[l].prop===a)return e;if(e[l].elements){const s=h(e[l].elements,a);if(s)return s}}return!1}const Q=B({state:{config:{config:{},data:[]},current:{}},mutations:{DELETE_CONFIG(e,a){const l=h(e.config.data,a.prop);if(!l)return;const s=l.findIndex(n=>n.prop===a.prop);l.splice(s,1)},COPY_CONFIG(e,a){const l=h(e.config.data,a.prop);console.log(l),!!l&&l.push(b(_({},a),{prop:`${a.prop}-${Date.now()}`}))},UPDATE_CONFIG(e,a){e.config=a},UPDATE_SELECT(e,a){e.current=a}}});var O=f({name:"comp-mask",props:{mask:Boolean,data:Object},setup(e,a){p(!1);const l=U();function s(){l.commit("DELETE_CONFIG",e.data)}function n(){console.log(e.data),l.commit("COPY_CONFIG",e.data)}function r(d){d.stopPropagation(),l.commit("UPDATE_SELECT",e.data)}const i=S(()=>{var d;return l.state.current.prop===((d=e.data)==null?void 0:d.prop)});return()=>{var d,c;return t("div",{class:["mask-wrap",{"is-selected":i.value}],onClick:r},[t("div",{class:{mask:e.mask}},[(c=(d=a.slots).default)==null?void 0:c.call(d)]),t("div",{class:"operate more"},[t("span",{onClick:s},[m("\u5220\u9664")]),t("span",{onClick:n},[m("\u590D\u5236")])])])}}}),W=f({name:"components-draggable",components:{draggable:V,compMask:O},props:{list:Array,data:{type:Object,required:!0}},setup(e,a){return()=>t(V,k(a.attrs,{list:e.list,"item-key":"prop"}),{item:({element:l})=>{if(l.type==="layout")return t(o("comp-mask"),{data:l},{default:()=>[t(o("el-row"),null,{default:()=>{var s;return[(s=l.elements)==null?void 0:s.map(n=>t(o("el-col"),{span:n.col,class:"mask-wrap"},{default:()=>[t(o("components-draggable"),{class:"draggable-area",list:n.elements,data:e.data,group:{name:"detail"}},null)]}))]}})]});if(l.type==="text")return t(o("comp-mask"),{data:l,mask:!0},{default:()=>[t("span",null,[l.label]),t("span",null,[e.data[l.prop]])]});if(l.type==="input")return t(o("comp-mask"),{mask:!0,data:l},{default:()=>[t(o("el-input"),null,null)]})}})}}),X=f({name:"template-code",props:{config:Object},setup(e){return()=>t("div",{style:"display: inline-block"},[t("pre",null,[JSON.stringify(e.config,null,2)])])}});const Z=e=>t(o("el-form"),null,{default:()=>[t(o("el-form-item"),{label:"\u6807\u7B7E"},{default:()=>[t(o("el-input"),{modelValue:e.label,"onUpdate:modelValue":a=>e.label=a},null)]}),t(o("el-form-item"),{label:"key"},{default:()=>[t(o("el-input"),{modelValue:e.prop,"onUpdate:modelValue":a=>e.prop=a},null)]})]}),ee=e=>t(o("el-form"),null,{default:()=>[t(o("el-form-item"),{label:"\u6807\u7B7E"},{default:()=>[t(o("el-input"),{modelValue:e.label,"onUpdate:modelValue":a=>e.label=a},null)]}),t(o("el-form-item"),{label:"key"},{default:()=>[t(o("el-input"),{modelValue:e.prop,"onUpdate:modelValue":a=>e.prop=a},null)]})]});function te(e){return{text:Z,input:ee}[e]}var le=f({name:"dynamic-form-item",props:{config:{type:Object,required:!0},data:{type:Object}},emits:["update:modelValue"],setup(e,a){const l=e.config;function s(n,r){a.emit("update:modelValue",b(_({},e.data),{[r]:n}))}return()=>{if((l==null?void 0:l.type)==="layout")return console.log(l),t(o("el-row"),null,{default:()=>{var r;return[(r=l.elements)==null?void 0:r.map(i=>t(o("el-col"),{span:i.col},{default:()=>{var d;return[(d=i.elements)==null?void 0:d.map(c=>t(o("dynamic-form-item"),{config:c},null))]}}))]}});if(l.type==="text")return t(o("el-form-item"),l,{default:()=>{var r;return[t("span",null,[(r=e.data)==null?void 0:r[l.prop]])]}});if(l.type==="input")return t(o("el-form-item"),l,{default:()=>{var r;return[t(o("el-input"),k({"model-value":(r=e.data)==null?void 0:r[l.prop]},{"onUpdate:modelValue":i=>s(i,l.prop)}),null)]}})}}}),ae=f({name:"dynamic-form",props:{config:Object,modelValue:Object},emits:["update:modelValue"],components:{dynamicFormItem:le},setup(e,a){return()=>t(o("el-form"),e.config,{default:()=>{var l;return[(l=e.config)==null?void 0:l.data.map(s=>t(o("dynamic-form-item"),k({config:s,data:e.modelValue},{"onUpdate:modelValue":n=>a.emit("update:modelValue",n)}),null))]}})}});function oe(e){return["<template>",'  <dynamic-form :config="config" ></dynamic-form>',"</template>","",'<script lang="ts">',"export default defineComponent({",'  name: "test"',"})","<\/script>","",'<script lang="ts" setup>',`const config = ${JSON.stringify(e)}`,"<\/script>"].join(`
`)}var F=(e,a)=>{for(const[l,s]of a)e[l]=s;return e};const ne={id:"ace-editor"},ue=f({name:"AceEditor"});function re(e,{expose:a,emit:l}){const s=e;let n;G(()=>{ace.config.set("basePath","https://pagecdn.io/lib/ace/1.4.12/"),n=ace.edit("ace-editor"),n.setTheme("ace/theme/twilight"),n.session.setMode(`ace/mode/${s.type}`),n.on("change",()=>{l("update:modelValue",n.getValue())})});function r(){const d=n.getSession();d.setValue(JSON.stringify(JSON.parse(d.getValue()),null,2))}function i(){return n.getValue()}return a({getContent:i,beauty:r}),(d,c)=>(M(),q("div",ne))}const se=f(b(_({},ue),{props:{type:{type:String,required:!0,default:"html"},content:{type:String,required:!1},modelValue:{type:String,required:!0}},emits:["update:modelValue"],setup:re}));var de=F(se,[["__scopeId","data-v-eb3fc3d0"]]),ie=f({components:{draggable:V,componentsDraggable:W,templateCode:X,dynamicForm:ae,aceEditor:de},setup(){const e=p({data:[],config:{}}),a=U();Y(()=>e.value,u=>{a.commit("UPDATE_CONFIG",u)},{deep:!0});const l={name:"venento"},s=p([{label:"\u6587\u672C",prop:"text",component:"<span>\u6587\u672C</span>"},{label:"\u8F93\u5165\u6846",prop:"input",component:"<el-input />"},{label:"\u6805\u683C",prop:"layout"}]);p(!1);const n=({element:u})=>t("div",null,[u.label]),r=p(!1),i=S(()=>oe(e.value)),d=p({}),c=p(!1);function w(){g.value.beauty()}const y=p(!1);function D(){y.value=!0}const g=p();function j(){const u=g.value.getContent();d.value=JSON.parse(u),y.value=!1,console.log(d.value)}const C=p(!1),v=p();function A(){console.log(v.value),e.value=JSON.parse(v.value)}return()=>t(K,null,[t("header",null,[t(o("el-button"),{type:"text",onClick:()=>r.value=!0},{default:()=>[m("\u751F\u6210\u4EE3\u7801")]}),t(o("el-button"),{type:"text",onClick:()=>C.value=!0},{default:()=>[m("\u5BFC\u5165\u914D\u7F6E")]}),t(o("el-button"),{type:"text",onClick:()=>c.value=!0},{default:()=>[m("\u9884\u89C8")]})]),t(o("el-row"),null,{default:()=>[t(o("el-col"),{span:4},{default:()=>[t(V,{list:s.value,"item-key":"prop",group:{name:"detail",pull:"clone"},clone:u=>u.prop==="layout"?{type:u.prop,prop:`${u.prop}-${Date.now()}`,elements:[{col:12,elements:[]},{col:12,elements:[]}]}:{type:u.prop,label:u.label,prop:`${u.prop}-${Date.now()}`}},{item:n})]}),t(o("el-col"),{span:14},{default:()=>[t(o("components-draggable"),{class:"edit-area",style:"flex: 1",list:e.value.data,"item-key":"prop",group:{name:"detail"},data:l},null)]}),t(o("el-col"),{span:6},{default:()=>{var u;return[t("aside",{class:"item-config"},[(u=te(a.state.current.type))==null?void 0:u(a.state.current)])]}})]}),t("footer",null,[t(o("dynamic-form"),{config:e.value},null)]),t("pre",{style:"text-align: left;"},[JSON.stringify(e.value,null,2)]),t(o("el-dialog"),{modelValue:r.value,"onUpdate:modelValue":u=>r.value=u,"destroy-on-close":!0},{default:()=>[t(o("ace-editor"),{modelValue:i.value,"onUpdate:modelValue":u=>i.value=u},null)]}),t(o("el-dialog"),{modelValue:y.value,"onUpdate:modelValue":u=>y.value=u,"destroy-on-close":!0},{default:()=>[t(o("ace-editor"),{ref:g,type:"json",modelValue:d.value,"onUpdate:modelValue":u=>d.value=u},null),t(o("el-button"),{type:"primary",onClick:j},{default:()=>[m("\u786E\u5B9A")]})]}),t(o("el-dialog"),{modelValue:C.value,"onUpdate:modelValue":u=>C.value=u,"destroy-on-close":!0},{default:()=>[t(o("ace-editor"),{ref:g,type:"json",modelValue:v.value,"onUpdate:modelValue":u=>v.value=u},null),t(o("el-button"),{type:"primary",onClick:A},{default:()=>[m("\u786E\u5B9A")]}),t(o("el-button"),{type:"primary",onClick:w},{default:()=>[m("\u683C\u5F0F\u5316")]})]}),t(o("el-dialog"),{modelValue:c.value,"onUpdate:modelValue":u=>c.value=u},{default:()=>[t("header",null,[t(o("el-button"),{type:"text",onClick:D},{default:()=>[m("\u5BFC\u5165\u6570\u636E")]})]),t(o("dynamic-form"),{config:e.value,modelValue:d.value,"onUpdate:modelValue":u=>d.value=u},null)]})])}});var pe=F(ie,[["__scopeId","data-v-6817c287"]]);R(pe).use(z).use(Q,N).component(O.name,O).mount("#app");