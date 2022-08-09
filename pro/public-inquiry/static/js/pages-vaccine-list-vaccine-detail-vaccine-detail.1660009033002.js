(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-vaccine-list-vaccine-detail-vaccine-detail"],{"1a7e":function(t,e,a){var i=a("5638");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var n=a("4f06").default;n("d94a02a4",i,!0,{sourceMap:!1,shadowMode:!1})},2505:function(t,e,a){"use strict";a.r(e);var i=a("2921c"),n=a.n(i);for(var o in i)["default"].indexOf(o)<0&&function(t){a.d(e,t,(function(){return i[t]}))}(o);e["default"]=n.a},"2921c":function(t,e,a){"use strict";a("4160"),a("ac1f"),a("1276"),a("159b"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=a("972a"),n=a("cf45"),o={props:{},components:{},data:function(){return{model:{name:"四价流感病毒裂解疫苗",label:"免疫规划苗",price:"164",factory:"华兰生物疫苗有限公司",specification:"0.5/ml",effect:"可预防甲型HIN1，H3N2和BN系、BY系流感病毒",introduction:"四价流感病毒裂解疫苗是华兰生物疫苗股份有限公司生产的。该疫苗适用于预防6月龄至35月龄人群流感病毒的感染。2022年5月31日，四价婴幼儿流感病毒裂解疫苗获得批签发证明并开始供应。",crowd:"四价流感病毒裂解疫苗适用于6个月以上的儿童以及成年人接种。",reaction:"1、局部反应，少数接种者注射后12到24小时，注射部位出现红、肿、痛、触痛和痒等，一般很快消失，不影响正常活动及工作，24小时后即可消失，如果没有消失，应及时就医。2、全身反应，少数接种者可能会出现发热、疲劳乏力、头痛、头晕、恶心、皮疹等全身反应,偶见咽喉疼痛、肌肉疼痛、咳嗽腹痛关节疼痛、活动异常、口干、食欲不振腹泻、过敏、胸闷，以上不良反应以轻度为主，主要发生在接种后24小时内，一般能在1到2天内得到缓解。",attention:"四价流感病毒裂解疫苗接种后应注意接种疫苗者在接种后应在接种现场观察30分钟。接种部位24小时内要保持干燥和清洁，接种当天最好是不要洗澡，不要剧烈运动，多饮水、多吃水果及清淡饮食，避免食用辛辣食物。接种后如接种部位发红、有痛感或低烧等，如持续24小时未自然消失，应该及时就医。"}}},computed:{voccineId:function(){return this.$route.query.voccineId},pageType:function(){return this.$route.query.pageType?this.$route.query.pageType:0}},onLoad:function(){},created:function(){},onShow:function(){},methods:{buttonClick:function(){},linkToRouter:function(t){uni.navigateTo({url:t})},previewImage:function(t,e){var a=[];console.log(t,e),t.forEach((function(t){a.push(t.src)})),uni.previewImage({urls:a,current:e,indicator:"default"})},attachments:function(t,e,a,n){var o=this;this.$api.attachments({bizId:t,bizType:e,fileGroup:a,pageNumber:"1",pageSize:"10"}).then((function(t){t.state&&t.data.length&&t.data.forEach((function(t){t.src=i.fileUrl+"/"+t.filepath,o.imagePaths[n].push(t)}))}))},setNavigationBarTitle:function(){uni.setNavigationBarTitle({title:"".concat(this.rwtypeList[this.routeData.type],"任务详情")})},detail:function(){var t=this;uni.showLoading({title:"加载中"}),t.$api.messageDetail({id:t.vaccineId},"GET",t.messageId).then((function(e){uni.hideLoading(),console.log(e),e.state&&(t.stepState=e.data.state,t.eventOrigin=e.data,t.joinUserList=e.data.joinUser.split(","),(0,n.removeNull)(t.eventOrigin),t.setBaseInfo(),t.eventOrigin.type&&"1"==t.eventOrigin.type&&t.eventOrigin.ryid&&t.patientBaseInfo(t.eventOrigin.ryid))}))}}};e.default=o},5638:function(t,e,a){var i=a("24fb");e=i(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 主色 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */uni-page-body[data-v-5a575b2a]{height:100%;overflow-y:scroll;overflow-x:hidden}.main[data-v-5a575b2a]{width:100%;height:100%;word-break:break-all}.main .tab-class[data-v-5a575b2a]{background-color:#fff;color:#333}.main .tab-class[data-v-5a575b2a] .wuc-tab-item{font-size:%?30?%;font-weight:600}.main .tab-class[data-v-5a575b2a] .text-blue{color:#1270f2}.main .load-done[data-v-5a575b2a]{font-size:%?30?%;color:#666}.main .vaccine-container[data-v-5a575b2a]{min-height:100%;padding:0 %?20?%;margin-top:%?10?%}.main .vaccine-container .item[data-v-5a575b2a]{border-bottom:#edf1f5 solid %?1?%;padding:%?20?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.main .vaccine-container .item .item-right[data-v-5a575b2a]{width:%?30?%;height:%?30?%;margin-left:%?15?%}.main .vaccine-container .item .item-title[data-v-5a575b2a]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;width:100%}.main .vaccine-container .item .item-title .item-title-img[data-v-5a575b2a]{width:%?50?%;height:%?50?%;-webkit-flex-shrink:0;flex-shrink:0;margin-right:%?10?%}.main .vaccine-container .item .item-title .item-title-container[data-v-5a575b2a]{width:100%}.main .vaccine-container .item .item-title .item-title-container .item-top[data-v-5a575b2a]{display:-webkit-box;display:-webkit-flex;display:flex}.main .vaccine-container .item .item-title .item-title-container .item-top .item-title-content[data-v-5a575b2a]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-flex:1;-webkit-flex:1;flex:1;font-size:%?30?%;color:#333;word-break:break-all;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.main .vaccine-container .item .item-title .item-title-container .item-top .item-title-content .item-number[data-v-5a575b2a]{background:#8fbc8f;padding:%?3?% %?12?%;border-radius:%?5?%;font-size:%?26?%;margin-right:%?5?%;color:#fff}.main .vaccine-container .item .item-title .item-title-container .item-top .item-title-content .item-number-readed[data-v-5a575b2a]{background:silver}.main .vaccine-container .item .item-title .item-title-container .item-top .item-title-content-label[data-v-5a575b2a]{padding:%?2?% %?10?%;background:rgba(30,144,255,.1);color:#1e90ff;font-size:%?26?%;width:auto;display:inline-block;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.main .vaccine-container .item .item-title .item-title-container .item-top .item-title-content-label_[data-v-5a575b2a]{background:rgba(50,205,50,.1);color:#32cd32}.main .vaccine-container .item .item-title .item-title-container .item-top .item-title-price[data-v-5a575b2a]{color:red;font-size:%?34?%}.main .vaccine-container .item .item-title .item-title-container .item-top .item-title-price[data-v-5a575b2a]::before{margin:auto %?10?% auto 0;content:"¥";text-align:center}.main .vaccine-container .item .item-title .item-title-container .item-bottom[data-v-5a575b2a]{margin-top:%?20?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;width:100%;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.main .vaccine-container .item .item-title .item-title-container .item-bottom .item-department[data-v-5a575b2a]{font-size:%?26?%;color:#666;-webkit-box-flex:1;-webkit-flex:1;flex:1}.main .vaccine-container .item .item-title .item-title-container .item-bottom .item-time[data-v-5a575b2a]{font-size:%?26?%;color:#666}.main .vaccine-container .item .item-title .item-title-container .item-bottom .item-readed[data-v-5a575b2a]{color:#999!important}.main .top-image[data-v-5a575b2a]{width:100%;object-fit:cover;display:-webkit-box;display:-webkit-flex;display:flex}.main .top-container[data-v-5a575b2a]{background:url(/static/imgs/index/picture-banner.png);background-position:60% 90%;background-repeat:no-repeat;padding:%?60?% %?30?%;width:100%}.main .top-container .form-title[data-v-5a575b2a]{color:#fff;font-size:%?34?%;font-weight:700}.main .top-container .form-content-label[data-v-5a575b2a]{padding:%?6?% %?16?%;background:#4169e1;color:#fff;font-size:%?26?%;width:auto;display:inline-block;border-radius:%?4?%}.main .top-container .form-content-label_[data-v-5a575b2a]{background:#32cd32;color:#fff}.main .top-container .form-content[data-v-5a575b2a]{color:#fff;font-size:%?30?%;font-weight:300;width:100%;margin-top:%?10?%;display:-webkit-box;display:-webkit-flex;display:flex;text-align:start;-webkit-box-pack:start;-webkit-justify-content:flex-start;justify-content:flex-start;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.main .top-container .form-content .form-content-price[data-v-5a575b2a]::before{margin:auto %?10?% auto 0;content:"¥";text-align:center}.main .top-container .form-bottom[data-v-5a575b2a]{margin-top:%?10?%;color:#fff;font-size:%?28?%;width:100%;display:-webkit-box;display:-webkit-flex;display:flex;text-align:start;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:start;-webkit-justify-content:flex-start;justify-content:flex-start}.main .top-container .form-bottom .form-bottom-icon[data-v-5a575b2a]{width:%?48?%;height:%?48?%;margin-left:%?5?%}.main .main-container[data-v-5a575b2a]{background:#fff;padding:%?30?% %?30?% %?140?% %?30?%}.main .main-container .vaccine_title[data-v-5a575b2a]{margin-top:%?20?%;color:#333;font-size:%?32?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.main .main-container .vaccine_title[data-v-5a575b2a]::before{margin:auto %?10?% auto 0;content:"";width:%?10?%;height:%?24?%;background-color:#6495ed;text-align:center}.main .main-container .vaccine-content[data-v-5a575b2a]{margin-top:%?20?%;color:#666;font-size:%?30?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.main .attachment[data-v-5a575b2a]{padding:%?20?% %?10?%;border-bottom:%?1?% solid #f5f5f5;margin:0 %?10?%;font-size:14px}.main .attachment .attribute[data-v-5a575b2a]{display:-webkit-box;display:-webkit-flex;display:flex}.main .attachment .attribute .asterisk[data-v-5a575b2a]{color:red;padding:0 %?5?%;width:%?30?%}.main .attachment .attribute .attribute-title[data-v-5a575b2a]{color:#999;margin-right:9px}.main .attachment .attachment-area[data-v-5a575b2a]{font-size:14px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-pack:start;-webkit-justify-content:flex-start;justify-content:flex-start}.main .attachment .attachment-area .attachment-area-item-center[data-v-5a575b2a]{-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;background-color:#f5f5f5}.main .attachment .attachment-area .attachment-area-item[data-v-5a575b2a]{width:%?130?%;height:%?130?%;padding:%?5?%;border-radius:%?5?%;margin:%?15?%;display:-webkit-box;display:-webkit-flex;display:flex;position:relative}.main .attachment .attachment-area .attachment-area-item .image-style[data-v-5a575b2a]{width:%?130?%;height:%?130?%}.main .attachment .attachment-area .attachment-area-item .image-add[data-v-5a575b2a]{width:%?48?%;height:%?48?%}.main .attachment .attachment-area .attachment-area-item .image-delete[data-v-5a575b2a]{position:absolute;z-index:10;font-size:18px;color:#ee0a24;width:%?48?%;height:%?48?%;margin-left:%?90?%;margin-top:%?-20?%}.main .attachment .attachment-area .attachment-area-item .attachment-area-item-value[data-v-5a575b2a]{font-size:%?26?%;color:#666;text-align:start}.main .submit-wrap-component[data-v-5a575b2a]{position:absolute;z-index:25;background-color:#fff;width:100%;padding:%?20?%;text-align:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;bottom:%?0?%;left:0;display:-webkit-box;display:-webkit-flex;display:flex}.main .submit-wrap-component .submit-component[data-v-5a575b2a]{-webkit-box-flex:1;-webkit-flex:1;flex:1;background-color:#007aff;font-size:%?32?%;font-weight:500;color:#fff;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;padding:%?20?%;border-radius:%?15?%}.main .submit-wrap-component .submit-component-margin[data-v-5a575b2a]{margin-left:%?10?%}',""]),t.exports=e},8879:function(t,e,a){"use strict";var i=a("1a7e"),n=a.n(i);n.a},aaa0:function(t,e,a){"use strict";var i;a.d(e,"b",(function(){return n})),a.d(e,"c",(function(){return o})),a.d(e,"a",(function(){return i}));var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",{staticClass:"main"},[a("v-uni-view",{staticClass:"top-container"},[a("v-uni-view",{staticClass:"form-title"},[t._v(t._s(t.model.name))]),a("v-uni-view",{staticClass:"form-content-label"},[t._v(t._s(t.model.label))]),a("v-uni-view",{staticClass:"form-content"},[t._v("疫苗价格："),a("v-uni-text",{staticClass:"form-content-price"},[t._v(t._s(t.model.price))])],1),a("v-uni-view",{staticClass:"form-content"},[t._v("生产厂商："+t._s(t.model.factory))]),a("v-uni-view",{staticClass:"form-content"},[t._v("产品规格："+t._s(t.model.specification))])],1),a("v-uni-view",{staticClass:"main-container"},[a("v-uni-view",{staticClass:"vaccine_title"},[t._v("疫苗简介")]),a("v-uni-view",{staticClass:"vaccine-content"},[t._v(t._s(t.model.introduction))]),a("v-uni-view",{staticClass:"vaccine_title"},[t._v("接种对象")]),a("v-uni-view",{staticClass:"vaccine-content"},[t._v(t._s(t.model.crowd))]),a("v-uni-view",{staticClass:"vaccine_title"},[t._v("不良反应")]),a("v-uni-view",{staticClass:"vaccine-content"},[t._v(t._s(t.model.reaction))]),a("v-uni-view",{staticClass:"vaccine_title"},[t._v("注意事项")]),a("v-uni-view",{staticClass:"vaccine-content"},[t._v(t._s(t.model.attention))])],1),"1"==t.pageType?a("v-uni-view",{staticClass:"submit-wrap-component"},[a("v-uni-view",{staticClass:"submit-component",nativeOn:{click:function(e){return t.buttonClick()}}},[t._v("预约")])],1):t._e()],1)},o=[]},aab1:function(t,e,a){"use strict";a.r(e);var i=a("aaa0"),n=a("2505");for(var o in n)["default"].indexOf(o)<0&&function(t){a.d(e,t,(function(){return n[t]}))}(o);a("8879");var c,r=a("f0c5"),l=Object(r["a"])(n["default"],i["b"],i["c"],!1,null,"5a575b2a",null,!1,i["a"],c);e["default"]=l.exports}}]);