(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-message-list-message-list"],{"0c00":function(e,t,i){"use strict";var a=i("4ea4");i("99af"),i("4de4"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=a(i("a4bd0")),s={components:{},data:function(){return{tabList:[{name:"全部"},{name:"已读"},{name:"未读"}],tabCur:0,messageList:[],loadDone:!1,total:0,pageSize:20,pageNumber:1,messageState:"",dictionary:this.$store.state.dictionary,dictionaryMap:{text:"name",value:"value"},lxDict:[{name:"全部",value:""},{name:"消息",value:"01"},{name:"任务",value:"02"}],xxlxDict:[],rwlxDict:[],filtersLx:"",xxlx:"",rwlx:"",ydwd:"",lx:"",type:""}},onLoad:function(){},onShow:function(){this.reload(!0)},created:function(){},onPullDownRefresh:function(){this.reload(!0)},onReachBottom:function(){this.loadDone?uni.showToast({title:"没有更多了",icon:"none"}):this.getMessgeList()},methods:{itemClick:function(e,t,i){var a=this;a.linkToRouter("./message-detail/message-detail")},linkToRouter:function(e){uni.navigateTo({url:e})},reload:function(e){this.total=2,this.loadDone=!0,this.messageList=[{title:"关于XXXX社康行政处罚信息公示",publishDepartment:"深圳市市场监督管理局福田分局",publishTime:"2022-07-25"},{title:"关于XXXX社康行政处罚信息公示",publishDepartment:"深圳市市场监督管理局福田分局",publishTime:"2022-07-25"}]},lower:function(){this.reload(!1)},getMessgeList:function(e){var t=this;1==t.pageNumber&&(t.messageList=[],t.total=0),uni.showLoading({title:"加载中",mask:!0});var i={pageSize:t.pageSize,pageNumber:t.pageNumber,type:t.filtersLx};n.default.getMessages(t,i,(function(i){uni.hideLoading(),e&&uni.stopPullDownRefresh(),console.log(i),t.total=i.total,i.data&&i.data.length>0&&(t.messageList=t.messageList.concat(i.data)),t.messageList.length<t.total?t.pageNumber++:t.loadDone=!0}),(function(t){uni.hideLoading(),e&&uni.stopPullDownRefresh(),console.log(t)}))},tabChange:function(e){this.activeFilter=e,this.ydwd=1==e?1:2==e?0:"",this.reload(!0)},showFilter:function(e){this.$refs.filter.open()},confirm:function(){this.$refs.filter.close(),this.reload(!0)},resetDrawer:function(){this.filtersLx="",this.type=""},filtersChange:function(e){"lx"==e&&(this.type="")}}};t.default=s},"0e32":function(e,t,i){var a=i("7b1e");"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var n=i("4f06").default;n("6c4fb96d",a,!0,{sourceMap:!1,shadowMode:!1})},"18de":function(e,t,i){"use strict";var a=i("a9b3"),n=i.n(a);n.a},"1e86":function(e,t,i){"use strict";var a;i.d(t,"b",(function(){return n})),i.d(t,"c",(function(){return s})),i.d(t,"a",(function(){return a}));var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return e.visibleSync?i("v-uni-view",{staticClass:"uni-drawer",class:{"uni-drawer--visible":e.showDrawer},on:{touchmove:function(t){t.stopPropagation(),t.preventDefault(),arguments[0]=t=e.$handleEvent(t),e.clear.apply(void 0,arguments)}}},[i("v-uni-view",{staticClass:"uni-drawer__mask",class:{"uni-drawer__mask--visible":e.showDrawer&&e.mask},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.close("mask")}}}),i("v-uni-view",{staticClass:"uni-drawer__content",class:{"uni-drawer--right":e.rightMode,"uni-drawer--left":!e.rightMode,"uni-drawer__content--visible":e.showDrawer},style:{width:e.drawerWidth+"px"}},[e._t("default")],2)],1):e._e()},s=[]},"326a":function(e,t,i){"use strict";i("a9e3"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a={name:"UniDrawer",props:{mode:{type:String,default:""},mask:{type:Boolean,default:!0},maskClick:{type:Boolean,default:!0},width:{type:Number,default:220}},data:function(){return{visibleSync:!1,showDrawer:!1,rightMode:!1,watchTimer:null,drawerWidth:220}},created:function(){this.drawerWidth=this.width,this.rightMode="right"===this.mode},methods:{clear:function(){},close:function(e){("mask"!==e||this.maskClick)&&this.visibleSync&&this._change("showDrawer","visibleSync",!1)},open:function(){this.visibleSync||this._change("visibleSync","showDrawer",!0)},_change:function(e,t,i){var a=this;this[e]=i,this.watchTimer&&clearTimeout(this.watchTimer),this.watchTimer=setTimeout((function(){a[t]=i,a.$emit("change",i)}),i?50:300)}}};t.default=a},"3f6d":function(e,t,i){"use strict";i.d(t,"b",(function(){return n})),i.d(t,"c",(function(){return s})),i.d(t,"a",(function(){return a}));var a={uniDrawer:i("6e16").default,uniDataCheckbox:i("a199").default},n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-uni-view",{staticClass:"message-list"},[i("v-uni-view",{staticClass:"total-value"},[e._v("共"),i("span",{staticClass:"total-css-number"},[e._v(e._s(e.total))]),e._v("条数据")]),i("v-uni-view",{staticClass:"container"},e._l(e.messageList,(function(t,a){return i("v-uni-view",{key:"notice"+a,staticClass:"item",nativeOn:{click:function(i){return e.itemClick(t,a,e.messageList)}}},[i("v-uni-view",{staticClass:"item-title"},[i("v-uni-view",{staticClass:"item-title-container"},[i("v-uni-view",{staticClass:"item-title-content",class:{"item-readed":"1"==t.state}},[i("span",{staticClass:"item-number",class:{"item-number-readed":"1"==t.state}},[e._v(e._s(a+1))]),e._v(e._s(t.title))]),i("v-uni-view",{staticClass:"item-bottom"},[i("v-uni-view",{staticClass:"item-department"},[e._v(e._s(t.publishDepartment))]),i("v-uni-view",{staticClass:"item-time"},[e._v(e._s(t.publishTime))])],1)],1)],1),i("v-uni-image",{staticClass:"item-right",attrs:{src:"/static/imgs/statistics/right.png"}})],1)})),1),i("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:e.loadDone,expression:"loadDone"}],staticClass:"load-done"},[e._v(e._s(0==e.messageList.length?"暂无数据":"--我是有底线的--"))]),i("uni-drawer",{ref:"filter",attrs:{mode:"right",width:300,maskClick:!0}},[i("v-uni-view",{staticClass:"filter-type"},[i("v-uni-view",{staticClass:"filter-type-main"},[i("v-uni-scroll-view",{staticClass:"filter-scroll-view",attrs:{"scroll-y":"true"}},[i("v-uni-view",{staticClass:"filter-type-classification"},[e._v("类型")]),i("v-uni-view",[i("uni-data-checkbox",{attrs:{localdata:e.lxDict,mode:"tag",map:e.dictionaryMap},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.filtersChange("lx")}},model:{value:e.filtersLx,callback:function(t){e.filtersLx=t},expression:"filtersLx"}})],1),"01"==e.filtersLx?i("v-uni-view",{staticClass:"filter-type-classification"},[e._v("消息类型")]):e._e(),"01"==e.filtersLx?i("v-uni-view",[i("uni-data-checkbox",{attrs:{localdata:e.xxlxDict,mode:"tag",map:e.dictionaryMap},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.filtersChange()}},model:{value:e.type,callback:function(t){e.type=t},expression:"type"}})],1):e._e(),"02"==e.filtersLx?i("v-uni-view",{staticClass:"filter-type-classification"},[e._v("任务类型")]):e._e(),"02"==e.filtersLx?i("v-uni-view",[i("uni-data-checkbox",{attrs:{localdata:e.rwlxDict,mode:"tag",map:e.dictionaryMap},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.filtersChange()}},model:{value:e.type,callback:function(t){e.type=t},expression:"type"}})],1):e._e()],1)],1),i("v-uni-view",{staticClass:"filter-bottom"},[i("v-uni-view",{staticClass:"filter-bottom-reset",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.resetDrawer(4)}}},[e._v("重置")]),i("v-uni-view",{staticClass:"filter-bottom-submit",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.confirm(4)}}},[e._v("确认")])],1)],1)],1)],1)},s=[]},"55a0":function(e,t,i){"use strict";i.r(t);var a=i("3f6d"),n=i("bc3c");for(var s in n)["default"].indexOf(s)<0&&function(e){i.d(t,e,(function(){return n[e]}))}(s);i("7f9f");var o,r=i("f0c5"),l=Object(r["a"])(n["default"],a["b"],a["c"],!1,null,"bbd336ea",null,!1,a["a"],o);t["default"]=l.exports},"6e16":function(e,t,i){"use strict";i.r(t);var a=i("1e86"),n=i("9c14");for(var s in n)["default"].indexOf(s)<0&&function(e){i.d(t,e,(function(){return n[e]}))}(s);i("18de");var o,r=i("f0c5"),l=Object(r["a"])(n["default"],a["b"],a["c"],!1,null,"c9373edc",null,!1,a["a"],o);t["default"]=l.exports},"7b1e":function(e,t,i){var a=i("24fb");t=a(!1),t.push([e.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 主色 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */.message-list[data-v-bbd336ea]{height:100%;width:100%}.message-list .load-done[data-v-bbd336ea]{font-size:%?30?%}.message-list .tab-class[data-v-bbd336ea]{background-color:#fff;color:#000;position:fixed;top:%?100?%;z-index:99;font-weight:700}.message-list .tab-class[data-v-bbd336ea] .wuc-tab-item{font-size:%?30?%}.message-list .tab-class[data-v-bbd336ea] .text-blue{color:#1270f2}.message-list .total-value[data-v-bbd336ea]{width:100%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;padding:%?12?% %?20?%;background:#f6f6f6;color:#666;font-size:%?26?%;position:fixed;top:%?100?%;z-index:9}.message-list .total-value .total-css-number[data-v-bbd336ea]{color:#456bdf;padding:0 %?5?%}.message-list .search-right[data-v-bbd336ea]{font-size:%?28?%;color:#456bdf;display:-webkit-box;display:-webkit-flex;display:flex;position:fixed;z-index:999;top:%?32?%;right:%?20?%}.message-list .search-right .search-right-icon[data-v-bbd336ea]{width:%?40?%;height:%?40?%;margin-left:%?10?%}.message-list .container[data-v-bbd336ea]{border-top:1px solid #eee;min-height:100%;padding:0 %?20?%;margin-top:%?60?%}.message-list .container .item[data-v-bbd336ea]{border-bottom:#edf1f5 solid %?1?%;padding:%?20?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.message-list .container .item .item-right[data-v-bbd336ea]{width:%?30?%;height:%?30?%;margin-left:%?15?%}.message-list .container .item .item-title[data-v-bbd336ea]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;width:100%}.message-list .container .item .item-title .item-title-img[data-v-bbd336ea]{width:%?50?%;height:%?50?%;-webkit-flex-shrink:0;flex-shrink:0;margin-right:%?10?%}.message-list .container .item .item-title .item-title-container[data-v-bbd336ea]{width:100%}.message-list .container .item .item-title .item-title-container .item-title-content[data-v-bbd336ea]{font-size:%?30?%;color:#333;word-break:break-all}.message-list .container .item .item-title .item-title-container .item-title-content .item-number[data-v-bbd336ea]{background:#8fbc8f;padding:%?3?% %?12?%;border-radius:%?5?%;font-size:%?26?%;margin-right:%?5?%;color:#fff}.message-list .container .item .item-title .item-title-container .item-title-content .item-number-readed[data-v-bbd336ea]{background:silver}.message-list .container .item .item-title .item-title-container .item-bottom[data-v-bbd336ea]{margin-top:%?20?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;width:100%;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.message-list .container .item .item-title .item-title-container .item-bottom .item-department[data-v-bbd336ea]{font-size:%?26?%;color:#666;-webkit-box-flex:1;-webkit-flex:1;flex:1}.message-list .container .item .item-title .item-title-container .item-bottom .item-time[data-v-bbd336ea]{font-size:%?26?%;color:#666}.message-list .container .item .item-title .item-title-container .item-bottom .item-readed[data-v-bbd336ea]{color:#999!important}.message-list .filter-type[data-v-bbd336ea]{font-size:%?36?%;color:#333;height:100%}.message-list .filter-type .filter-type-main[data-v-bbd336ea]{padding:%?30?%;height:100%}.message-list .filter-type .filter-type-main .filter-scroll-view[data-v-bbd336ea]{height:92%}.message-list .filter-type .filter-type-main .filter-scroll-view .filter-type-classification[data-v-bbd336ea]{font-size:%?32?%;color:#333;margin-top:%?20?%}.message-list .filter-type .filter-type-main .filter-scroll-view .filter-type-item[data-v-bbd336ea]{display:inline-block;padding:%?20?%;margin-right:%?10?%;margin-top:%?10?%;font-size:%?26?%;color:#666;cursor:pointer;font-family:microsoft yahei;border:%?1?% solid #f5f5f5;background-color:#f5f5f5;border-radius:%?5?%}.message-list .filter-type .filter-type-main .filter-scroll-view .filter-type-item-choose[data-v-bbd336ea]{border:1px solid #3369e7;background-color:#ebf0fc;color:#3369e7}.message-list .filter-type .filter-bottom[data-v-bbd336ea]{width:100%;bottom:0;position:fixed;z-index:222;display:-webkit-box;display:-webkit-flex;display:flex;height:%?80?%;font-size:%?32?%}.message-list .filter-type .filter-bottom .filter-bottom-reset[data-v-bbd336ea]{-webkit-box-flex:1;-webkit-flex:1;flex:1;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;height:100%;color:#666;border:1px solid #e7e7e7}.message-list .filter-type .filter-bottom .filter-bottom-submit[data-v-bbd336ea]{-webkit-box-flex:1;-webkit-flex:1;flex:1;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;height:100%;color:#fff;background:#456bdf;border:1px solid #456bdf}',""]),e.exports=t},"7f9f":function(e,t,i){"use strict";var a=i("0e32"),n=i.n(a);n.a},"9c14":function(e,t,i){"use strict";i.r(t);var a=i("326a"),n=i.n(a);for(var s in a)["default"].indexOf(s)<0&&function(e){i.d(t,e,(function(){return a[e]}))}(s);t["default"]=n.a},a4bd0:function(e,t,i){"use strict";i("99af"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a={messages:[],messageTotal:0,messagePageNumber:1,messagePageSize:10,messageLoadDone:!1,bizType:"message-publish",fileGroup:"0",publishType:[{name:"通知公告",value:"01"},{name:"健康科普",value:"02"}],publishTypeFilter:[{name:"全部",value:""},{name:"通知公告",value:"01"},{name:"健康科普",value:"02"}],getMessages:function(e,t,i,a){e.$api.getMessages(t).then((function(e){e.state?i(e):a(e.msg)}))},readMessage:function(e,t,i,a,n,s){e.$api.readMessage({id:t}).then((function(e){e.state?n(e):s(e.msg)}))},toMessageItem:function(e,t,i,a,n,s){if(t.state&&"0"!=t.state||this.readMessage(e,t.systemid,t,i,n,s),t.type)switch(t.type){case"3":"02"==t.messageType&&("1"==t.businessState?uni.navigateTo({url:"../add-interview/add-interview?ywcSystemid=".concat(t.systemid,"&ryid=").concat(t.taskid)}):"0"==t.businessState&&uni.navigateTo({url:"../add-interview/add-interview?ryid=".concat(t.taskid,"&eventId=").concat(t.taskid,"&messageId=").concat(t.systemid,"&fromType=2&pageType=1&backPageCount=1")}));break;case"11":"02"==t.messageType&&("1"==t.businessState?uni.navigateTo({url:"../patient-event/patient-event-detail?eventId=".concat(t.taskid)}):"0"==t.businessState&&uni.navigateTo({url:"../patient-event/patient-event?eventId=".concat(t.taskid,"&fromType=2&pageType=1")}));break;case"12":"02"==t.messageType&&("1"==t.businessState?uni.navigateTo({url:"../patient-event/patient-event-detail?eventId=".concat(t.taskid)}):"0"==t.businessState&&uni.navigateTo({url:"../patient-event/patient-event?eventId=".concat(t.taskid,"&fromType=2&pageType=1")}));break;case"13":"01"!=t.messageType&&"02"!=t.messageType?uni.navigateTo({url:"../patient-event/patient-event?eventId=".concat(t.taskid,"&fromType=2&pageType=1")}):uni.navigateTo({url:"./message-event-detail/message-event-detail?eventId=".concat(t.taskid,"&messageType=").concat(t.messageType)});break}}};t.default=a},a9b3:function(e,t,i){var a=i("e9949");"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var n=i("4f06").default;n("439cb6ec",a,!0,{sourceMap:!1,shadowMode:!1})},bc3c:function(e,t,i){"use strict";i.r(t);var a=i("0c00"),n=i.n(a);for(var s in a)["default"].indexOf(s)<0&&function(e){i.d(t,e,(function(){return a[e]}))}(s);t["default"]=n.a},e9949:function(e,t,i){var a=i("24fb");t=a(!1),t.push([e.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 主色 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */.uni-drawer[data-v-c9373edc]{display:block;position:fixed;top:0;left:0;right:0;bottom:0;overflow:hidden;z-index:999}.uni-drawer__content[data-v-c9373edc]{display:block;position:absolute;top:0;width:220px;bottom:0;background-color:#fff;-webkit-transition:-webkit-transform .3s ease;transition:-webkit-transform .3s ease;transition:transform .3s ease;transition:transform .3s ease,-webkit-transform .3s ease}.uni-drawer--left[data-v-c9373edc]{left:0;-webkit-transform:translateX(-100%);transform:translateX(-100%)}.uni-drawer--right[data-v-c9373edc]{right:0;-webkit-transform:translateX(100%);transform:translateX(100%)}.uni-drawer__content--visible[data-v-c9373edc]{-webkit-transform:translateX(0);transform:translateX(0)}.uni-drawer__mask[data-v-c9373edc]{display:block;opacity:0;position:absolute;top:0;left:0;bottom:0;right:0;background-color:rgba(0,0,0,.4);-webkit-transition:opacity .3s;transition:opacity .3s}.uni-drawer__mask--visible[data-v-c9373edc]{display:block;opacity:1}',""]),e.exports=t}}]);