(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-vaccine-list-vaccine-classify"],{"54f3":function(i,t,n){"use strict";n("99af"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a={components:{},data:function(){return{rowData:[{title:"新冠肺炎疫苗",icon:"../../static/imgs/vaccine/icon_xinguan.png",bgImage:"../../static/imgs/index/bg_ymjzd.png",text:"适用于预防由新型冠状病毒感染引起的疾病(COVID-19)",backgroundColor:"#FFF9F3",path:"./vaccine-classify-list/vaccine-classify-list",color:"#2E99FD"},{title:"流感疫苗",icon:"../../static/imgs/vaccine/icon_liugan.png",bgImage:"../../static/imgs/index/bg_ymjzddt.png",text:"适用于预防流行性感冒病毒引起的流行性感冒(简称流感)的疫苗",backgroundColor:"#F4F9FF",path:"./vaccine-classify-list/vaccine-classify-list",color:"#3A9D7A"},{title:"带疹状疱疹疫苗",icon:"../../static/imgs/vaccine/icon_paozhen.png",bgImage:"../../static/imgs/index/bg_jzyyxx.png",text:"适用于预防带状疱疹的疫苗",backgroundColor:"#F4F9FF",path:"./vaccine-classify-list/vaccine-classify-list",color:"#FFCF64"},{title:"乙肝疫苗",icon:"../../static/imgs/vaccine/icon_yigan.png",bgImage:"../../static/imgs/index/bg_ymfl.png",text:"适用于预防乙肝的特殊药物",backgroundColor:"#F8F8FF",path:"./vaccine-classify-list/vaccine-classify-list",color:"#6566FA"},{title:"肺炎疫苗",icon:"../../static/imgs/vaccine/icon_feiyan.png",bgImage:"../../static/imgs/index/bg_ymjzd.png",text:"适用于预防肺炎球菌引起的肺炎的疫苗",backgroundColor:"#FFF9F3",path:"./vaccine-classify-list/vaccine-classify-list",color:"#2E99FD"},{title:"儿童疫苗",icon:"../../static/imgs/vaccine/icon_ertong.png",bgImage:"../../static/imgs/index/bg_ymjzddt.png",text:"适用于0-6岁婴幼儿群体的医疗疫苗",backgroundColor:"#F4F9FF",path:"./vaccine-classify-list/vaccine-classify-list",color:"#3A9D7A"},{title:"霍乱疫苗",icon:"../../static/imgs/vaccine/icon_huoluan.png",bgImage:"../../static/imgs/index/bg_jzyyxx.png",text:"以降低霍乱的发病率，减轻症状和降低死亡率",backgroundColor:"#F4F9FF",path:"./vaccine-classify-list/vaccine-classify-list",color:"#FFCF64"},{title:"甲肝疫苗",icon:"../../static/imgs/vaccine/icon_jiagan.png",bgImage:"../../static/imgs/index/bg_ymfl.png",text:"适用于预防甲型肝炎的疫苗",backgroundColor:"#F8F8FF",path:"./vaccine-classify-list/vaccine-classify-list",color:"#6566FA"},{title:"破伤风疫苗",icon:"../../static/imgs/vaccine/icon_poshangfeng.png",bgImage:"../../static/imgs/index/bg_ymjzd.png",text:"可预防感染类疾病",backgroundColor:"#FFF9F3",path:"./vaccine-classify-list/vaccine-classify-list",color:"#2E99FD"},{title:"水痘疫苗",icon:"../../static/imgs/vaccine/icon_shuidou.png",bgImage:"../../static/imgs/index/bg_ymjzddt.png",text:"预防水痘感染的唯一手段",backgroundColor:"#F4F9FF",path:"./vaccine-classify-list/vaccine-classify-list",color:"#3A9D7A"}]}},created:function(){},onReady:function(){},onShow:function(){},onHide:function(){},methods:{linkToRouter:function(i){uni.navigateTo({url:i})},iconClick:function(i){var t="".concat(i.path,"?uniTitle=").concat(i.title);this.linkToRouter(t)}}};t.default=a},"56cf":function(i,t,n){var a=n("24fb");t=a(!1),t.push([i.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 主色 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */uni-page-body[data-v-79f554ff]{height:100%;background:#fff;overflow-y:scroll;overflow-x:hidden;padding-bottom:%?30?%}.mains[data-v-79f554ff]{width:100%;height:100%;padding:%?20?%}.mains .toolbar-right[data-v-79f554ff]{position:fixed;top:%?10?%;right:%?15?%;z-index:998;font-size:%?30?%;color:#000}.mains .toolbar-right .toolbar-right-icon[data-v-79f554ff]{width:%?102?%;height:%?72?%;padding:%?10?% %?25?% %?10?% %?25?%}.mains .container_row[data-v-79f554ff]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row}.mains .container_row .row_module[data-v-79f554ff]{width:48%;padding:%?30?% %?20?%;border-radius:%?5?%;margin:%?5?%;-webkit-box-align:center;-webkit-align-items:center;align-items:center;display:-webkit-box;display:-webkit-flex;display:flex}.mains .container_row .row_module .module_icon[data-v-79f554ff]{height:%?72?%;width:%?72?%}.mains .container_row .row_module .module-container[data-v-79f554ff]{margin-left:%?10?%}.mains .container_row .row_module .module-container .module_title[data-v-79f554ff]{font-size:%?30?%;font-weight:500;color:#333}.mains .container_row .row_module .module-container .module_text[data-v-79f554ff]{width:%?220?%;font-size:%?26?%;margin-top:%?10?%;color:#b0aba8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',""]),i.exports=t},"57bf":function(i,t,n){"use strict";var a=n("5c0a"),c=n.n(a);c.a},"5c0a":function(i,t,n){var a=n("56cf");"string"===typeof a&&(a=[[i.i,a,""]]),a.locals&&(i.exports=a.locals);var c=n("4f06").default;c("13f0ecdd",a,!0,{sourceMap:!1,shadowMode:!1})},"7a3c":function(i,t,n){"use strict";n.r(t);var a=n("820d"),c=n("9333");for(var e in c)["default"].indexOf(e)<0&&function(i){n.d(t,i,(function(){return c[i]}))}(e);n("57bf");var o,s=n("f0c5"),l=Object(s["a"])(c["default"],a["b"],a["c"],!1,null,"79f554ff",null,!1,a["a"],o);t["default"]=l.exports},"820d":function(i,t,n){"use strict";var a;n.d(t,"b",(function(){return c})),n.d(t,"c",(function(){return e})),n.d(t,"a",(function(){return a}));var c=function(){var i=this,t=i.$createElement,n=i._self._c||t;return n("v-uni-view",{staticClass:"mains"},[i._e(),n("v-uni-view",{staticClass:"container_row"},i._l(i.rowData,(function(t,a){return n("v-uni-view",{key:a,staticClass:"row_module",style:{backgroundColor:""+t.backgroundColor},on:{click:function(n){arguments[0]=n=i.$handleEvent(n),i.iconClick(t)}}},[n("v-uni-image",{staticClass:"module_icon",attrs:{src:t.icon}}),n("v-uni-view",{staticClass:"module-container"},[n("v-uni-view",{staticClass:"module_title"},[i._v(i._s(t.title))]),n("v-uni-view",{staticClass:"module_text"},[i._v(i._s(t.text))])],1)],1)})),1)],1)},e=[]},9333:function(i,t,n){"use strict";n.r(t);var a=n("54f3"),c=n.n(a);for(var e in a)["default"].indexOf(e)<0&&function(i){n.d(t,i,(function(){return a[i]}))}(e);t["default"]=c.a}}]);