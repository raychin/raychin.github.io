(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-index-login"],{1174:function(t,e,n){"use strict";var r=n("4ea4");n("99af"),n("d3b7"),Object.defineProperty(e,"__esModule",{value:!0}),e.getLoginToken=w,n("96cf");var o=r(n("1da1")),a=r(n("4360")),i=r(n("3299")),c=n("cf45"),s=r(n("8d81")),u=n("413c"),l=n("972a"),f=n("089f"),h=JSON.parse((0,u.decrypt)(l.config.PRO)),d=h.govChatCorpId,g=h.govChatCorpSecret,p="",v="true";function w(t){return m.apply(this,arguments)}function m(){return m=(0,o.default)(regeneratorRuntime.mark((function t(e){var n,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(a.default.commit("updateAppToken",""),window.sessionStorage.setItem("firstLoading",!1),window.localStorage.setItem("indexFilters",""),n=window.sessionStorage.getItem("govChatSession"),console.log(n),n&&null!=n){t.next=11;break}if(p){t.next=9;break}return t.next=9,y();case 9:t.next=13;break;case 11:r=JSON.parse(n),!p&&r.UserId&&(p=r.UserId);case 13:if(a.default.commit("updateGovUser",""),p){t.next=16;break}return t.abrupt("return");case 16:return t.next=18,b();case 18:if(!v){t.next=25;break}return t.next=21,x();case 21:return t.next=23,D();case 23:t.next=28;break;case 25:if((0,c.getStorage)("accessToken")){t.next=28;break}return t.next=28,k();case 28:case"end":return t.stop()}}),t)}))),m.apply(this,arguments)}function y(){var t=(0,c.getUrlKey)("code",window.location.href);(0,c.getUrlKey)("state",window.location.href);return new Promise((function(e,n){i.default.getGovWechatUserInfoByGeoSocial({corpid:d,corpsecret:g,code:t}).then((function(t){200===t.code&&("ok"==t.data.errmsg?(window.sessionStorage.setItem("govChatSession",JSON.stringify(t.data)),p=t.data.UserId):uni.showToast({title:t.data.errmsg,icon:"none"})),e()}))}))}function b(){return new Promise((function(t,e){var n=(0,f.createUUID)();i.default.loginGovChat({mid:"".concat(n,",").concat(p),system:"2",corpid:d,corpsecret:g}).then((function(e){if(e.data){var n=e.data;a.default.commit("updateGovUser",{userid:(0,u.decrypt)(n.userid),username:(0,u.decrypt)(n.name),mobile:(0,u.decrypt)(n.mobile)})}else a.default.commit("updateGovUser","");t(e.data)}))}))}function x(t){return new Promise((function(t,e){i.default.collectUser(p).then((function(e){e.state?a.default.commit("updateCollectUser",e.data):a.default.commit("updateCollectUser",e),t(e.data)}))}))}function D(t){var e=(0,s.default)(a.default.state.govUser.mobile).toLowerCase(),n=e.substring(0,10),r=(0,s.default)(n+e).toLowerCase();return console.log(e),console.log(n),console.log(e+n),new Promise((function(t,e){i.default.simpleUserLogin({userid:a.default.state.collectUser.mappingUserid,password:r}).then((function(e){var n,r;e.state?((0,c.setStorage)("accessToken",null===(n=e.data)||void 0===n?void 0:n.accessToken),a.default.commit("updateLoginData",e.data),t()):((0,c.setStorage)("accessToken",null===(r=e.data)||void 0===r?void 0:r.accessToken),a.default.commit("updateLoginData",e),t(e.msg))}))}))}function k(){return new Promise((function(t,e){var n="lmj";i.default.handleLogin({userid:n,password:(0,s.default)(btoa(n)+"Aa@888888")}).then((function(e){var n;200==e.code&&e.state&&"00"==e.data.loginCode?(0,c.setStorage)("accessToken",null===(n=e.data)||void 0===n?void 0:n.accessToken):uni.showToast({title:e.data.loginMsg||"系统异常，请联系管理员",icon:"none"});t()}))}))}},1362:function(t,e,n){"use strict";n.r(e);var r=n("cfa9"),o=n.n(r);for(var a in r)["default"].indexOf(a)<0&&function(t){n.d(e,t,(function(){return r[t]}))}(a);e["default"]=o.a},"1da1":function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return o}));n("d3b7"),n("e6cf");function r(t,e,n,r,o,a,i){try{var c=t[a](i),s=c.value}catch(u){return void n(u)}c.done?e(s):Promise.resolve(s).then(r,o)}function o(t){return function(){var e=this,n=arguments;return new Promise((function(o,a){var i=t.apply(e,n);function c(t){r(i,o,a,c,s,"next",t)}function s(t){r(i,o,a,c,s,"throw",t)}c(void 0)}))}}},"320e":function(t,e,n){"use strict";var r=n("d4ba"),o=n.n(r);o.a},"34af":function(t,e,n){"use strict";n.r(e);var r=n("5001"),o=n("1362");for(var a in o)["default"].indexOf(a)<0&&function(t){n.d(e,t,(function(){return o[t]}))}(a);n("320e");var i,c=n("f0c5"),s=Object(c["a"])(o["default"],r["b"],r["c"],!1,null,"12e147d8",null,!1,r["a"],i);e["default"]=s.exports},"4e41":function(t,e,n){var r=n("24fb"),o=n("1de5"),a=n("6519");e=r(!1);var i=o(a);e.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 主色 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */uni-page-body[data-v-12e147d8]{width:100vw;overflow:hidden;background:#fff}.main[data-v-12e147d8]{height:100%;width:100%;background-image:url('+i+");background-size:100% 100%;background-position:50% 50%;background-repeat:no-repeat}.main .content[data-v-12e147d8]{height:100%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.main .content .title[data-v-12e147d8]{color:#fff;font-size:%?65?%;margin-bottom:%?100?%;font-weight:700}.main .content .input-root[data-v-12e147d8]{width:80%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;margin-bottom:%?50?%;padding:%?30?%;border-radius:%?50?%;background-color:rgba(112,169,225,.5);position:relative}.main .content .input-root .label[data-v-12e147d8]{width:%?110?%;color:#fff;font-size:%?35?%;margin-right:%?30?%}.main .content .input-root[data-v-12e147d8] .uni-input-input{color:#fff;font-size:%?34?%}.main .content .input-root .img[data-v-12e147d8]{height:%?60?%;width:%?150?%;position:absolute;top:0;right:%?30?%;bottom:0;margin:auto}.main .content .button[data-v-12e147d8]{margin-top:%?50?%;width:80%;text-align:center;padding:%?20?%;color:#fff;background-color:#009afa;border-radius:%?50?%}.iframe[data-v-12e147d8]{width:100%;height:100%}",""]),t.exports=e},5001:function(t,e,n){"use strict";var r;n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){return r}));var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"main"},[n("v-uni-view",{staticClass:"content"},[n("v-uni-view",{staticClass:"title",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.openLog()}}},[t._v("福田疫苗安全监管")]),n("v-uni-view",{staticClass:"input-root"},[n("v-uni-view",{staticClass:"label"},[t._v("账号")]),n("v-uni-input",{staticClass:"input",attrs:{"placeholder-style":"color:white;font-size:34rpx",placeholder:"请输入账号"},model:{value:t.username,callback:function(e){t.username=e},expression:"username"}})],1),n("v-uni-view",{staticClass:"input-root"},[n("v-uni-view",{staticClass:"label"},[t._v("密码")]),n("v-uni-input",{staticClass:"input",attrs:{password:!0,"placeholder-style":"color:white;font-size:34rpx",placeholder:"请输入密码"},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}})],1),n("v-uni-view",{staticClass:"input-root"},[n("v-uni-view",{staticClass:"label"},[t._v("验证码")]),n("v-uni-input",{staticClass:"input",attrs:{"placeholder-style":"color:white;font-size:34rpx",placeholder:"请输入验证码"},model:{value:t.captcha,callback:function(e){t.captcha=e},expression:"captcha"}}),t.imgPath?n("v-uni-image",{staticClass:"img",attrs:{src:t.imgPath},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.getCaptcha()}}}):t._e()],1),n("v-uni-view",{staticClass:"button",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.checkFormat()}}},[t._v("登 录")])],1)],1)},a=[]},6519:function(t,e,n){t.exports=n.p+"static/img/bg.3e88c351.png"},"96cf":function(t,e){!function(e){"use strict";var n,r=Object.prototype,o=r.hasOwnProperty,a="function"===typeof Symbol?Symbol:{},i=a.iterator||"@@iterator",c=a.asyncIterator||"@@asyncIterator",s=a.toStringTag||"@@toStringTag",u="object"===typeof t,l=e.regeneratorRuntime;if(l)u&&(t.exports=l);else{l=e.regeneratorRuntime=u?t.exports:{},l.wrap=b;var f="suspendedStart",h="suspendedYield",d="executing",g="completed",p={},v={};v[i]=function(){return this};var w=Object.getPrototypeOf,m=w&&w(w(N([])));m&&m!==r&&o.call(m,i)&&(v=m);var y=M.prototype=D.prototype=Object.create(v);k.prototype=y.constructor=M,M.constructor=k,M[s]=k.displayName="GeneratorFunction",l.isGeneratorFunction=function(t){var e="function"===typeof t&&t.constructor;return!!e&&(e===k||"GeneratorFunction"===(e.displayName||e.name))},l.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,M):(t.__proto__=M,s in t||(t[s]="GeneratorFunction")),t.prototype=Object.create(y),t},l.awrap=function(t){return{__await:t}},L(C.prototype),C.prototype[c]=function(){return this},l.AsyncIterator=C,l.async=function(t,e,n,r){var o=new C(b(t,e,n,r));return l.isGeneratorFunction(e)?o:o.next().then((function(t){return t.done?t.value:o.next()}))},L(y),y[s]="Generator",y[i]=function(){return this},y.toString=function(){return"[object Generator]"},l.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){while(e.length){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},l.values=N,_.prototype={constructor:_,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach(E),!t)for(var e in this)"t"===e.charAt(0)&&o.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=n)},stop:function(){this.done=!0;var t=this.tryEntries[0],e=t.completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,o){return c.type="throw",c.arg=t,e.next=r,o&&(e.method="next",e.arg=n),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var s=o.call(i,"catchLoc"),u=o.call(i,"finallyLoc");if(s&&u){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(s){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&o.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var a=r;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,p):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),p},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),E(n),p}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;E(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:N(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=n),p}}}function b(t,e,n,r){var o=e&&e.prototype instanceof D?e:D,a=Object.create(o.prototype),i=new _(r||[]);return a._invoke=S(t,n,i),a}function x(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(r){return{type:"throw",arg:r}}}function D(){}function k(){}function M(){}function L(t){["next","throw","return"].forEach((function(e){t[e]=function(t){return this._invoke(e,t)}}))}function C(t){function e(n,r,a,i){var c=x(t[n],t,r);if("throw"!==c.type){var s=c.arg,u=s.value;return u&&"object"===typeof u&&o.call(u,"__await")?Promise.resolve(u.__await).then((function(t){e("next",t,a,i)}),(function(t){e("throw",t,a,i)})):Promise.resolve(u).then((function(t){s.value=t,a(s)}),(function(t){return e("throw",t,a,i)}))}i(c.arg)}var n;function r(t,r){function o(){return new Promise((function(n,o){e(t,r,n,o)}))}return n=n?n.then(o,o):o()}this._invoke=r}function S(t,e,n){var r=f;return function(o,a){if(r===d)throw new Error("Generator is already running");if(r===g){if("throw"===o)throw a;return O()}n.method=o,n.arg=a;while(1){var i=n.delegate;if(i){var c=F(i,n);if(c){if(c===p)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(r===f)throw r=g,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r=d;var s=x(t,e,n);if("normal"===s.type){if(r=n.done?g:h,s.arg===p)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(r=g,n.method="throw",n.arg=s.arg)}}}function F(t,e){var r=t.iterator[e.method];if(r===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=n,F(t,e),"throw"===e.method))return p;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return p}var o=x(r,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,p;var a=o.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=n),e.delegate=null,p):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,p)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function E(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function _(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function N(t){if(t){var e=t[i];if(e)return e.call(t);if("function"===typeof t.next)return t;if(!isNaN(t.length)){var r=-1,a=function e(){while(++r<t.length)if(o.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=n,e.done=!0,e};return a.next=a}}return{next:O}}function O(){return{value:n,done:!0}}}(function(){return this||"object"===typeof self&&self}()||Function("return this")())},"99ab":function(t,e,n){"use strict";var r=n("4ea4");n("d3b7"),n("4d63"),n("ac1f"),n("25f0"),n("5319"),Object.defineProperty(e,"__esModule",{value:!0}),e.getNowDate=a,e.getNowMonth=i,e.DateMinus=c,e.getMonthMinus=s,e.getNowFormatDate=u,e.getNowMonthFirstDay=l,e.getNowMonthLastDay=f,e.getNowWeekFirstDay=h,e.getNowWeekLastDay=d,e.getNearThreeMonthDate=g,e.getNearYearDate=p,e.formatTimeToStr=v,e.getDaysBetween=w,e.getDay=m,e.getDayBefore=y,e.doHandleMonth=b,e.getDaysOrHoursBetween=x,e.toTimeStamp=D,e.default=void 0;var o=r(n("c1df"));function a(){var t=new Date,e="-",n=t.getFullYear(),r=t.getMonth()+1,o=t.getDate();r>=1&&r<=9&&(r="0"+r),o>=0&&o<=9&&(o="0"+o);var a=n+e+r+e+o;return a}function i(){var t=new Date,e="-",n=t.getFullYear(),r=t.getMonth()+1;t.getDate();r>=1&&r<=9&&(r="0"+r);var o=n+e+r;return o}function c(t){var e,n,r,o,a=new Date;30!==t?(e=new Date(a-24*t*3600*1e3),n=e.getFullYear(),r=e.getMonth()+1,o=e.getDate()):(n=a.getFullYear(),r=a.getMonth(),o=a.getDate()),r>=1&&r<=9&&(r="0"+r),o>=1&&o<=9&&(o="0"+o);var i=n+"-"+r+"-"+o;return i}function s(t){var e,n,r,o=new Date;e=new Date(o-24*t*3600*1e3*30),n=e.getFullYear(),r=e.getMonth()+1,r>=1&&r<=9&&(r="0"+r);var a=n+"-"+r;return a}function u(){var t=new Date,e="-",n=":",r=t.getMonth()+1,o=t.getDate(),a=t.getSeconds(),i=t.getMinutes(),c=t.getHours();r<10&&(r="0"+r),o<10&&(o="0"+o),i<10&&(i="0"+i),a<10&&(a="0"+a),c<10&&(c="0"+c);var s=t.getFullYear()+e+r+e+o+" "+c+n+i+n+a;return s}function l(){var t=new Date,e="-",n=t.getMonth()+1;return n>=1&&n<=9&&(n="0"+n),t.getFullYear()+e+n+e+"01"}function f(){var t=new Date,e="-",n=t.getMonth()+1;n>=1&&n<=9&&(n="0"+n);var r=new Date(t.getFullYear(),n,0).getDate();return t.getFullYear()+e+n+e+r}function h(){var t=new Date,e=t.getFullYear(),n=(t.getMonth(),t.getDate(),0!=t.getDay()?t.getDay():7),r=t.valueOf()-24*(n-1)*60*60*1e3;r=new Date(r);var o="-",a=r.getMonth()+1,i=r.getDate();return a>=1&&a<=9&&(a="0"+a),i>=0&&i<=9&&(i="0"+i),e+o+a+o+i}function d(){var t=new Date,e=t.getFullYear(),n=(t.getMonth(),t.getDate(),0!=t.getDay()?t.getDay():7),r=t.valueOf()+24*(7-n)*60*60*1e3;r=new Date(r);var o="-",a=r.getMonth()+1,i=r.getDate();return a>=1&&a<=9&&(a="0"+a),i>=0&&i<=9&&(i="0"+i),e+o+a+o+i}function g(){var t=new Date,e="-",n=t.getFullYear(),r=t.getMonth()-2;r<=0&&(r+=12,n-=1);var o=t.getDate();r>=1&&r<=9&&(r="0"+r),o>=0&&o<=9&&(o="0"+o);var a=n+e+r+e+o;return a}function p(){var t=new Date,e="-",n=t.getFullYear()-1,r=t.getMonth()+1,o=t.getDate();r>=1&&r<=9&&(r="0"+r),o>=0&&o<=9&&(o="0"+o);var a=n+e+r+e+o;return a}function v(t,e){var n=new Date(t).Format("yyyy-MM-dd hh:mm:ss");return e&&(n=new Date(t).Format(e)),n.toLocaleString()}function w(t,e){var n=new Date(e),r=new Date(t);r=new Date(r.getFullYear(),r.getMonth(),r.getDate()),n=new Date(n.getFullYear(),n.getMonth(),n.getDate());var o=n.getTime()-r.getTime(),a=o/864e5;return a}function m(t,e){var n=new Date;t&&(n=new Date(t));var r=n.getTime()+864e5*e;n.setTime(r);var o=n.getFullYear(),a=n.getMonth(),i=n.getDate();return a=b(a+1),i=b(i),o+"-"+a+"-"+i}function y(t,e){var n=new Date;t&&(n=new Date(t));var r=n.getTime()-864e5*e;n.setTime(r);var o=n.getFullYear(),a=n.getMonth(),i=n.getDate();return a=b(a+1),i=b(i),o+"-"+a+"-"+i}function b(t){var e=t;return 1==t.toString().length&&(e="0"+t),e}function x(t,e){var n=(0,o.default)(t),r=(0,o.default)(e),a=r.diff(n,"hort"),i="";return i=a>=864e5?Math.round(a/864e5)+"天":a>=36e5?Math.round(a/36e5)+"小时":Math.round(a/6e4)+"分钟",i}function D(t){return new Date(t).getTime()}Date.prototype.Format=function(t){var e={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};for(var n in/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))),e)new RegExp("("+n+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[n]:("00"+e[n]).substr((""+e[n]).length)));return t};var k={getNowDate:a,getNowMonth:i,DateMinus:c,getNowFormatDate:u,getMonthMinus:s,getNearYearDate:p,getNowWeekFirstDay:h,getNowMonthFirstDay:l,formatTimeToStr:v,getNowMonthLastDay:f,getNowWeekLastDay:d,getDaysBetween:w,getDay:m,getDayBefore:y,doHandleMonth:b,getDaysOrHoursBetween:x,toTimeStamp:D};e.default=k},cfa9:function(t,e,n){"use strict";var r=n("4ea4");n("ac1f"),n("1276"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,n("96cf");var o=r(n("1da1")),a=(n("972a"),n("1174"),n("99ab"),n("cf45"),r(n("3a34"))),i={components:{},data:function(){return{username:"",password:"",key:"",captcha:"",imgPath:"",debugCount:0}},created:function(){return(0,o.default)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:case"end":return t.stop()}}),t)})))()},onReady:function(){this.getCaptcha()},onShow:function(){},onHide:function(){},methods:{openLog:function(){if(this.debugCount++,this.debugCount>5)new a.default},checkFormat:function(){this.username?this.password?this.captcha?this.login():uni.showToast({title:"请输入验证码",icon:"none"}):uni.showToast({title:"请输入密码",icon:"none"}):uni.showToast({title:"请输入账号",icon:"none"})},getCaptcha:function(){var t=this;this.$api.getCaptcha({}).then((function(e){t.imgPath=e.data.base64,t.key=e.data.key}))},login:function(){var t=this;uni.showLoading({title:"加载中",mask:!0}),this.$api.login({username:this.username,password:this.password,captcha:this.captcha,key:this.key}).then((function(e){t.captcha="",t.getCaptcha(),console.log(e),e&&(t.$store.commit("updateLoginData",e.data),uni.navigateTo({url:"../home-page/home-page"}))}))},swiperSlide:function(t){return!0},getSign:function(){var t=this,e=window.location.href;console.log(window.location.href);var n=e.split("#");console.log(n),this.$api.getSign({corpid:govChatCorpId,corpsecret:govChatCorpSecret,url:n[0]}).then((function(e){console.log(e),e.state&&t.wxConfig(e.data)}))},wxConfig:function(t){var e=this;e.$wx.config({beta:!0,debug:!1,appId:govChatCorpId,timestamp:t.timestamp,nonceStr:t.noncestr,signature:t.signStr,jsApiList:["scanQRCode"]}),e.$wx.ready((function(){e.$wx.checkJsApi({jsApiList:["scanQRCode"],success:function(t){0!=t.checkResult.getLocation?e.canScan=!0:uni.showToast({title:"你的微信版本太低，不支持二维码功能，请升级到最新版本！",icon:"none"})}})})),e.$wx.error((function(t){console.log(t)}))}}};e.default=i},d4ba:function(t,e,n){var r=n("4e41");"string"===typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);var o=n("4f06").default;o("43bb6b6d",r,!0,{sourceMap:!1,shadowMode:!1})}}]);