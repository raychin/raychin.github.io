(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-login-login"],{3285:function(t,n,e){"use strict";e.r(n);var a=e("6263"),i=e.n(a);for(var o in a)["default"].indexOf(o)<0&&function(t){e.d(n,t,(function(){return a[t]}))}(o);n["default"]=i.a},5229:function(t,n,e){var a=e("760a");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var i=e("4f06").default;i("3c2c0e3e",a,!0,{sourceMap:!1,shadowMode:!1})},6263:function(t,n,e){"use strict";var a=e("4ea4");e("d3b7"),e("ac1f"),e("1276"),Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0,e("96cf");var i=a(e("1da1")),o=e("21f2"),c=a(e("3a34")),r={components:{},data:function(){return{username:"",password:"",key:"",captcha:"",imgPath:"",debugCount:0}},created:function(){return(0,i.default)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:case"end":return t.stop()}}),t)})))()},onReady:function(){this.getCaptcha()},onShow:function(){},onHide:function(){},methods:{openLog:function(){var t=1;return function(){if(t++,t>5)new c.default;console.log(t)}}(),checkFormat:function(){this.username?this.password?this.captcha?this.login():uni.showToast({title:"请输入验证码",icon:"none"}):uni.showToast({title:"请输入密码",icon:"none"}):uni.showToast({title:"请输入账号",icon:"none"})},getCaptcha:function(){var t=this;return(0,i.default)(regeneratorRuntime.mark((function n(){var e;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,t.$api.getCaptcha({});case 2:e=n.sent,t.imgPath=e.data.verCode,t.key=e.data.key,console.log(e,"getCaptcha");case 6:case"end":return n.stop()}}),n)})))()},getToken:function(){var t=this;return new Promise((function(n,e){t.$api.login({username:t.username,password:(0,o.encrypt)(t.password),captcha:t.captcha,key:t.key,phone:"12131",smsCaptcha:"123213",isEncrypt:!0}).then((function(t){console.log(t),t&&n(t)}))}))},getLoginData:function(){var t=this;return new Promise((function(n,e){t.$api.getLoginData({}).then((function(t){console.log(t),t&&n(t)}))}))},login:function(){var t=this;return(0,i.default)(regeneratorRuntime.mark((function n(){var e,a,i;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return uni.showLoading({title:"加载中",mask:!0}),e=t,n.next=4,e.getToken();case 4:if(a=n.sent,!a.success){n.next=13;break}return t.$store.commit("updateAppToken",a.data.tokenValue),n.next=9,e.getLoginData();case 9:i=n.sent,i.success?(t.$store.commit("updateLoginData",i.data),t.$store.commit("updateDictionary",""),t.$store.commit("updateLabelResource",""),uni.redirectTo({url:"../index/index"})):uni.showToast({title:i.msg,icon:"none"}),n.next=16;break;case 13:t.captcha="",t.getCaptcha(),uni.showToast({title:a.msg,icon:"none"});case 16:case"end":return n.stop()}}),n)})))()},swiperSlide:function(t){return!0},getSign:function(){var t=this,n=window.location.href;console.log(window.location.href);var e=n.split("#");console.log(e),this.$api.getSign({corpid:govChatCorpId,corpsecret:govChatCorpSecret,url:e[0]}).then((function(n){console.log(n),n.state&&t.wxConfig(n.data)}))},wxConfig:function(t){var n=this;n.$wx.config({beta:!0,debug:!1,appId:govChatCorpId,timestamp:t.timestamp,nonceStr:t.noncestr,signature:t.signStr,jsApiList:["scanQRCode"]}),n.$wx.ready((function(){n.$wx.checkJsApi({jsApiList:["scanQRCode"],success:function(t){0!=t.checkResult.getLocation?n.canScan=!0:uni.showToast({title:"你的微信版本太低，不支持二维码功能，请升级到最新版本！",icon:"none"})}})})),n.$wx.error((function(t){console.log(t)}))}}};n.default=r},"760a":function(t,n,e){var a=e("24fb");n=a(!1),n.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 主色 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */uni-page-body[data-v-2cd64b4a]{width:100vw;overflow:hidden;background:#fff}.main[data-v-2cd64b4a]{height:100%;width:100%;background:#072769;background-size:100% 100%;background-position:50% 50%;background-repeat:no-repeat}.main .content[data-v-2cd64b4a]{height:100%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.main .content .title[data-v-2cd64b4a]{color:#fff;font-size:%?65?%;margin-bottom:%?100?%;font-weight:700}.main .content .input-root[data-v-2cd64b4a]{width:80%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;margin-bottom:%?50?%;padding:%?30?%;border-radius:%?50?%;background-color:rgba(112,169,225,.5);position:relative}.main .content .input-root .label[data-v-2cd64b4a]{width:%?110?%;color:#fff;font-size:%?35?%;margin-right:%?30?%}.main .content .input-root[data-v-2cd64b4a] .uni-input-input{color:#fff;font-size:%?34?%}.main .content .input-root .img[data-v-2cd64b4a]{height:%?60?%;width:%?150?%;position:absolute;top:0;right:%?30?%;bottom:0;margin:auto}.main .content .button[data-v-2cd64b4a]{margin-top:%?50?%;width:80%;text-align:center;padding:%?20?%;color:#fff;background-color:#009afa;border-radius:%?50?%}.iframe[data-v-2cd64b4a]{width:100%;height:100%}',""]),t.exports=n},"9b70":function(t,n,e){"use strict";var a;e.d(n,"b",(function(){return i})),e.d(n,"c",(function(){return o})),e.d(n,"a",(function(){return a}));var i=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("v-uni-view",{staticClass:"main"},[e("v-uni-view",{staticClass:"content"},[e("v-uni-view",{staticClass:"title",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.openLog()}}},[t._v("实体采集")]),e("v-uni-view",{staticClass:"input-root"},[e("v-uni-view",{staticClass:"label"},[t._v("账号")]),e("v-uni-input",{staticClass:"input",attrs:{"placeholder-style":"color:white;font-size:34rpx",placeholder:"请输入账号"},model:{value:t.username,callback:function(n){t.username=n},expression:"username"}})],1),e("v-uni-view",{staticClass:"input-root"},[e("v-uni-view",{staticClass:"label"},[t._v("密码")]),e("v-uni-input",{staticClass:"input",attrs:{password:!0,"placeholder-style":"color:white;font-size:34rpx",placeholder:"请输入密码"},model:{value:t.password,callback:function(n){t.password=n},expression:"password"}})],1),e("v-uni-view",{staticClass:"input-root"},[e("v-uni-view",{staticClass:"label"},[t._v("验证码")]),e("v-uni-input",{staticClass:"input",attrs:{"placeholder-style":"color:white;font-size:34rpx",placeholder:"请输入验证码"},model:{value:t.captcha,callback:function(n){t.captcha=n},expression:"captcha"}}),t.imgPath?e("v-uni-image",{staticClass:"img",attrs:{src:t.imgPath},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.getCaptcha()}}}):t._e()],1),e("v-uni-view",{staticClass:"button",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.checkFormat()}}},[t._v("登 录")])],1)],1)},o=[]},a86a:function(t,n,e){"use strict";e.r(n);var a=e("9b70"),i=e("3285");for(var o in i)["default"].indexOf(o)<0&&function(t){e.d(n,t,(function(){return i[t]}))}(o);e("ea63");var c,r=e("f0c5"),s=Object(r["a"])(i["default"],a["b"],a["c"],!1,null,"2cd64b4a",null,!1,a["a"],c);n["default"]=s.exports},ea63:function(t,n,e){"use strict";var a=e("5229"),i=e.n(a);i.a}}]);