!function(e){var t={};function r(n){if(t[n])return t[n].exports;var s=t[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)r.d(n,s,function(t){return e[t]}.bind(null,s));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=2)}([function(e,t,r){},,function(e,t,r){"use strict";r.r(t);
/*!
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */
const n=0,s="",i=8;function a(e,t){const r=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(r>>16)<<16|65535&r}function o(e,t){return e<<t|e>>>32-t}function c(e){const t=[],r=(1<<i)-1;for(let n=0;n<e.length*i;n+=i)null!=t[n>>5]?t[n>>5]|=(e.charCodeAt(n/i)&r)<<32-i-n%32:t[n>>5]=(e.charCodeAt(n/i)&r)<<32-i-n%32;return t}function u(e,t,r,n){return e<20?t&r|~t&n:e<40?t^r^n:e<60?t&r|t&n|r&n:t^r^n}function l(e){return e<20?1518500249:e<40?1859775393:e<60?-1894007588:-899497514}function h(e,t){const r=t>>5;null==e[r]?e[r]=128<<24-t%32:e[r]|=128<<24-t%32,e[15+(t+64>>9<<4)]=t;const n=Array(80);let s=1732584193,i=-271733879,c=-1732584194,h=271733878,d=-1009589776;for(let t=0;t<e.length;t+=16){const r=s,g=i,f=c,p=h,b=d;for(let r=0;r<80;r++){n[r]=r<16?e[t+r]:o(n[r-3]^n[r-8]^n[r-14]^n[r-16],1);const g=a(a(o(s,5),u(r,i,c,h)),a(a(d,n[r]),l(r)));d=h,h=c,c=o(i,30),i=s,s=g}s=a(s,r),i=a(i,g),c=a(c,f),h=a(h,p),d=a(d,b)}return[s,i,c,h,d]}const d=(e,t)=>(function(e){let t="";for(let r=0;r<4*e.length;r+=3){const n=(null!=e[r>>2]?(e[r>>2]>>8*(3-r%4)&255)<<16:0)|(null!=e[r+1>>2]?(e[r+1>>2]>>8*(3-(r+1)%4)&255)<<8:0)|(null!=e[r+2>>2]?e[r+2>>2]>>8*(3-(r+2)%4)&255:0);for(let i=0;i<4;i++)8*r+6*i>32*e.length?t+=s:t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(n>>6*(3-i)&63)}return t})(function(e,t){let r=c(e);r.length>16&&(r=h(r,e.length*i));const n=Array(16),s=Array(16);for(let e=0;e<16;e++){const t=null!=r[e]?r[e]:0;n[e]=909522486^t,s[e]=1549556828^t}const a=h(n.concat(c(t)),512+t.length*i);return h(s.concat(a),672)}(e,t)),g=e=>(function(e){const t=n?"0123456789ABCDEF":"0123456789abcdef";let r="";for(let n=0;n<4*e.length;n++)r+=t.charAt(e[n>>2]>>8*(3-n%4)+4&15)+t.charAt(e[n>>2]>>8*(3-n%4)&15);return r})(h(c(e),e.length*i));
/*!
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Password Hasher
 *
 * The Initial Developer of the Original Code is Steve Cooper.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s): (none)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 */
function f(e,t,r,n,s,i,a){const o=n%s,c=(o+t)%s;for(let t=0;t<s-r;t+=1){const n=(o+r+t)%s,c=e.charCodeAt(n);if(c>=i&&c<i+a)return e}return(c>0?e.substring(0,c):"")+String.fromCharCode((n+e.charCodeAt(c))%a+i)+(c+1<e.length?e.substring(c+1,e.length):"")}var p=({siteTag:e,masterKey:t,hashWordSize:r,requireDigit:n,requirePunctuation:s,requireMixedCase:i,restrictSpecial:a,restrictDigits:o,bangify:c})=>{let u=d(t,e),l=0;for(let e=0;e<u.length;e+=1)l+=u.charCodeAt(e);return o?u=function(e,t,r){let n="",s=0;for(;s<r;){const r=e.substring(s).search(/[^0-9]/i);if(r<0)break;r>0&&(n+=e.substring(s,s+r)),n+=String.fromCharCode((t+e.charCodeAt(s))%10+48),s+=r+1}return s<e.length&&(n+=e.substring(s)),n}(u,l,r):(n&&(u=f(u,0,4,l,r,48,10)),s&&!a&&(u=f(u,1,4,l,r,33,15)),i&&(u=f(u,2,4,l,r,65,26),u=f(u,3,4,l,r,97,26)),a&&(u=function(e,t,r){let n="",s=0;for(;s<r;){const r=e.substring(s).search(/[^a-z0-9]/i);if(r<0)break;r>0&&(n+=e.substring(s,s+r)),n+=String.fromCharCode((t+s)%26+65),s+=r+1}return s<e.length&&(n+=e.substring(s)),n}(u,l,r))),u=u.substr(0,r),c&&(u=u.replace(/.$/,"!")),u};const b={tag:"siteTag",size:"hashWordSize",requireSpecial:"restrictSpecial",requireDigitsOnly:"restrictDigits"};const m={requireDigit:!0,requirePunctuation:!1,requireMixedCase:!0,restrictSpecial:!1,restrictDigits:!1,hashWordSize:"26",bangify:!1};function y(e){return document.getElementById(e)}function v(){let e=!1;return t=>{e||(e=!0,setTimeout(()=>e=!1,0),t())}}r(0);window.form=new class{constructor(){this.store=new class{entries(){return this.load().entries()}keys(){return this.load().keys()}[Symbol.iterator](){return this.load()[Symbol.iterator]()}set(e,t){const r=this.load();r.set(e,{...t,timestamp:Date.now()}),this.save(r)}has(e){return this.load().has(e)}get(e){return this.load().get(e)}delete(e){const t=this.load();t.delete(e),this.save(t)}load(){try{let e=localStorage.getItem("db329347-75fb-4d26-8f4e-6b887f2f08a9");return(e=JSON.parse(e)).props?e=this.inflate(e):(this.upgrade(e),e=[...Object.entries(e)]),new Map(e)}catch(e){console.error("error loading data",e)}return new Map}save(e){try{localStorage.setItem("db329347-75fb-4d26-8f4e-6b887f2f08a9",JSON.stringify(this.compact([...e])))}catch(e){console.error("error saving data",e)}}compact(e){const t=[],r=e.map(([e,r])=>{const n=[];return Object.entries(r).forEach(([e,r])=>{let s=t.indexOf(e);-1===s&&(s=t.push(e)-1),n[s]=r}),[e,n]});return{props:t,map:r}}inflate({props:e,map:t}){return t.map(([t,r])=>{const n={};return r.forEach((t,r)=>{null!==t&&(n[e[r]]=t)}),[t,n]})}upgrade(e){Object.values(e).forEach(e=>{Object.entries(b).forEach(([t,r])=>{t in e&&(e[r]=e[t],delete e[t])})})}},this.bindPassword("masterKey"),["siteTag","hash",...Object.keys(m)].forEach(e=>this.bindInput(e)),this.bindListeners(),this.setSettings(),this.updateDatalist(),this.setTimers()}get settings(){return Object.keys(m).reduce((e,t)=>(e[t]=this[t],e),{})}setSettings(e=m){Object.entries(e).forEach(([e,t])=>{this[e]=t})}hasCustomSettings(){return!Object.entries(m).every(([e,t])=>this[e]===t)}bindInput(e){const t=y(e),r="checkbox"===t.type?"checked":"value",n=v();Object.defineProperty(this,e,{enumerable:!0,get:()=>t[r],set(e){t[r]=e,n(()=>t.dispatchEvent(new Event("change")))}}),t.addEventListener("change",t=>{n(()=>this[e]=t.target[r])})}bindPassword(e){const t=y(e);let r="";const n=v();Object.defineProperty(this,e,{enumerable:!0,get:()=>r,set(e){r=e,t.value=Array(e.length).fill("x").join(""),n(()=>t.dispatchEvent(new Event("change")))}}),t.addEventListener("change",t=>{n(()=>this[e]=t.target.value)})}bindListeners(){Object.entries(Object.getOwnPropertyDescriptors(this.constructor.prototype)).forEach(([e,t])=>{if("function"!=typeof t.value)return;const r=e.match(/^on(.*)(Click|Input|Change|Blur|Focus|Submit)$/);r&&y(function(e){return`${e[0].toLowerCase()}${e.slice(1)}`}(r[1])).addEventListener(r[2].toLowerCase(),t=>{this[e](t)})})}onResetClick(){this.setSettings()}onHashWordSizeInput(e){y("sizeOutput").value=e.target.value}onHashWordSizeChange(e){y("sizeOutput").value=e.target.value}onRestrictSpecialChange(e){y("requirePunctuation").disabled=e.target.checked}onRestrictDigitsChange(e){y("requireDigit").disabled=e.target.checked,y("requirePunctuation").disabled=e.target.checked,y("requireMixedCase").disabled=e.target.checked,y("restrictSpecial").disabled=e.target.checked}onMasterKeyFocus(){this.masterKey="",this.hash=""}onMasterKeyChange(){this.hash=""}onSiteTagChange(e){if(this.hash="",!this.store.has(this.siteTag))return this.setSettings(),void(y("details").open=!1);this.setSettings(this.store.get(e.target.value)),y("delete").hidden=!1,y("details").open=this.hasCustomSettings(),this.masterKey&&this.generateHash()}onDeleteClick(){this.store.delete(this.siteTag),this.updateDatalist(),y("delete").hidden=!0}onFormSubmit(e){e.preventDefault(),this.generateHash(),this.store.set(this.siteTag,this.settings),y("delete").hidden=!1}generateHash(){this.hash=p({...this.settings,masterKey:this.masterKey,siteTag:this.siteTag}),y("hash").setSelectionRange(0,this.hash.length),y("hash").focus(),this.updateDatalist()}async onHashChange(e){const t=e.target;if(t.classList.remove("ok","danger","network"),t.title="",0!==t.value.length)try{await(async e=>{const t=g(e).toUpperCase(),r=`https://api.pwnedpasswords.com/range/${t.slice(0,5)}`,n=await fetch(r);if(!n.ok)throw n;const s=await n.text();let i=0;return s.split("\n").some(e=>{const r=e.trim().split(":");return r[0]===t.slice(5)&&(i=+r[1],!0)}),i})(t.value)>0?(t.classList.add("danger"),t.title=`Password compromised ${this.state.pwned} times`):t.classList.add("ok")}catch(e){e instanceof Response?console.error(e):t.classList.add("network")}}updateDatalist(){const e=y("saved-sites");e.innerHTML="",[...this.store.keys()].forEach(t=>{const r=document.createElement("option");r.value=t,r.label=t,e.appendChild(r)})}setTimers(){let e=Date.now();window.addEventListener("focus",()=>{e+144e5<Date.now()&&(this.masterKey=""),e=Date.now()})}},"serviceWorker"in navigator&&navigator.serviceWorker.register("worker.js")}]);