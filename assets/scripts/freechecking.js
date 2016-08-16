/*!
Waypoints - 4.0.0
Copyright © 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blog/master/licenses.txt
*/
!function(){"use strict";function t(o){if(!o)throw new Error("No options passed to Waypoint constructor");if(!o.element)throw new Error("No element option passed to Waypoint constructor");if(!o.handler)throw new Error("No handler option passed to Waypoint constructor");this.key="waypoint-"+e,this.options=t.Adapter.extend({},t.defaults,o),this.element=this.options.element,this.adapter=new t.Adapter(this.element),this.callback=o.handler,this.axis=this.options.horizontal?"horizontal":"vertical",this.enabled=this.options.enabled,this.triggerPoint=null,this.group=t.Group.findOrCreate({name:this.options.group,axis:this.axis}),this.context=t.Context.findOrCreateByElement(this.options.context),t.offsetAliases[this.options.offset]&&(this.options.offset=t.offsetAliases[this.options.offset]),this.group.add(this),this.context.add(this),i[this.key]=this,e+=1}var e=0,i={};t.prototype.queueTrigger=function(t){this.group.queueTrigger(this,t)},t.prototype.trigger=function(t){this.enabled&&this.callback&&this.callback.apply(this,t)},t.prototype.destroy=function(){this.context.remove(this),this.group.remove(this),delete i[this.key]},t.prototype.disable=function(){return this.enabled=!1,this},t.prototype.enable=function(){return this.context.refresh(),this.enabled=!0,this},t.prototype.next=function(){return this.group.next(this)},t.prototype.previous=function(){return this.group.previous(this)},t.invokeAll=function(t){var e=[];for(var o in i)e.push(i[o]);for(var n=0,r=e.length;r>n;n++)e[n][t]()},t.destroyAll=function(){t.invokeAll("destroy")},t.disableAll=function(){t.invokeAll("disable")},t.enableAll=function(){t.invokeAll("enable")},t.refreshAll=function(){t.Context.refreshAll()},t.viewportHeight=function(){return window.innerHeight||document.documentElement.clientHeight},t.viewportWidth=function(){return document.documentElement.clientWidth},t.adapters=[],t.defaults={context:window,continuous:!0,enabled:!0,group:"default",horizontal:!1,offset:0},t.offsetAliases={"bottom-in-view":function(){return this.context.innerHeight()-this.adapter.outerHeight()},"right-in-view":function(){return this.context.innerWidth()-this.adapter.outerWidth()}},window.Waypoint=t}(),function(){"use strict";function t(t){window.setTimeout(t,1e3/60)}function e(t){this.element=t,this.Adapter=n.Adapter,this.adapter=new this.Adapter(t),this.key="waypoint-context-"+i,this.didScroll=!1,this.didResize=!1,this.oldScroll={x:this.adapter.scrollLeft(),y:this.adapter.scrollTop()},this.waypoints={vertical:{},horizontal:{}},t.waypointContextKey=this.key,o[t.waypointContextKey]=this,i+=1,this.createThrottledScrollHandler(),this.createThrottledResizeHandler()}var i=0,o={},n=window.Waypoint,r=window.onload;e.prototype.add=function(t){var e=t.options.horizontal?"horizontal":"vertical";this.waypoints[e][t.key]=t,this.refresh()},e.prototype.checkEmpty=function(){var t=this.Adapter.isEmptyObject(this.waypoints.horizontal),e=this.Adapter.isEmptyObject(this.waypoints.vertical);t&&e&&(this.adapter.off(".waypoints"),delete o[this.key])},e.prototype.createThrottledResizeHandler=function(){function t(){e.handleResize(),e.didResize=!1}var e=this;this.adapter.on("resize.waypoints",function(){e.didResize||(e.didResize=!0,n.requestAnimationFrame(t))})},e.prototype.createThrottledScrollHandler=function(){function t(){e.handleScroll(),e.didScroll=!1}var e=this;this.adapter.on("scroll.waypoints",function(){(!e.didScroll||n.isTouch)&&(e.didScroll=!0,n.requestAnimationFrame(t))})},e.prototype.handleResize=function(){n.Context.refreshAll()},e.prototype.handleScroll=function(){var t={},e={horizontal:{newScroll:this.adapter.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.adapter.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};for(var i in e){var o=e[i],n=o.newScroll>o.oldScroll,r=n?o.forward:o.backward;for(var s in this.waypoints[i]){var a=this.waypoints[i][s],l=o.oldScroll<a.triggerPoint,h=o.newScroll>=a.triggerPoint,p=l&&h,u=!l&&!h;(p||u)&&(a.queueTrigger(r),t[a.group.id]=a.group)}}for(var c in t)t[c].flushTriggers();this.oldScroll={x:e.horizontal.newScroll,y:e.vertical.newScroll}},e.prototype.innerHeight=function(){return this.element==this.element.window?n.viewportHeight():this.adapter.innerHeight()},e.prototype.remove=function(t){delete this.waypoints[t.axis][t.key],this.checkEmpty()},e.prototype.innerWidth=function(){return this.element==this.element.window?n.viewportWidth():this.adapter.innerWidth()},e.prototype.destroy=function(){var t=[];for(var e in this.waypoints)for(var i in this.waypoints[e])t.push(this.waypoints[e][i]);for(var o=0,n=t.length;n>o;o++)t[o].destroy()},e.prototype.refresh=function(){var t,e=this.element==this.element.window,i=e?void 0:this.adapter.offset(),o={};this.handleScroll(),t={horizontal:{contextOffset:e?0:i.left,contextScroll:e?0:this.oldScroll.x,contextDimension:this.innerWidth(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:e?0:i.top,contextScroll:e?0:this.oldScroll.y,contextDimension:this.innerHeight(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}};for(var r in t){var s=t[r];for(var a in this.waypoints[r]){var l,h,p,u,c,d=this.waypoints[r][a],f=d.options.offset,w=d.triggerPoint,y=0,g=null==w;d.element!==d.element.window&&(y=d.adapter.offset()[s.offsetProp]),"function"==typeof f?f=f.apply(d):"string"==typeof f&&(f=parseFloat(f),d.options.offset.indexOf("%")>-1&&(f=Math.ceil(s.contextDimension*f/100))),l=s.contextScroll-s.contextOffset,d.triggerPoint=y+l-f,h=w<s.oldScroll,p=d.triggerPoint>=s.oldScroll,u=h&&p,c=!h&&!p,!g&&u?(d.queueTrigger(s.backward),o[d.group.id]=d.group):!g&&c?(d.queueTrigger(s.forward),o[d.group.id]=d.group):g&&s.oldScroll>=d.triggerPoint&&(d.queueTrigger(s.forward),o[d.group.id]=d.group)}}return n.requestAnimationFrame(function(){for(var t in o)o[t].flushTriggers()}),this},e.findOrCreateByElement=function(t){return e.findByElement(t)||new e(t)},e.refreshAll=function(){for(var t in o)o[t].refresh()},e.findByElement=function(t){return o[t.waypointContextKey]},window.onload=function(){r&&r(),e.refreshAll()},n.requestAnimationFrame=function(e){var i=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||t;i.call(window,e)},n.Context=e}(),function(){"use strict";function t(t,e){return t.triggerPoint-e.triggerPoint}function e(t,e){return e.triggerPoint-t.triggerPoint}function i(t){this.name=t.name,this.axis=t.axis,this.id=this.name+"-"+this.axis,this.waypoints=[],this.clearTriggerQueues(),o[this.axis][this.name]=this}var o={vertical:{},horizontal:{}},n=window.Waypoint;i.prototype.add=function(t){this.waypoints.push(t)},i.prototype.clearTriggerQueues=function(){this.triggerQueues={up:[],down:[],left:[],right:[]}},i.prototype.flushTriggers=function(){for(var i in this.triggerQueues){var o=this.triggerQueues[i],n="up"===i||"left"===i;o.sort(n?e:t);for(var r=0,s=o.length;s>r;r+=1){var a=o[r];(a.options.continuous||r===o.length-1)&&a.trigger([i])}}this.clearTriggerQueues()},i.prototype.next=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints),o=i===this.waypoints.length-1;return o?null:this.waypoints[i+1]},i.prototype.previous=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints);return i?this.waypoints[i-1]:null},i.prototype.queueTrigger=function(t,e){this.triggerQueues[e].push(t)},i.prototype.remove=function(t){var e=n.Adapter.inArray(t,this.waypoints);e>-1&&this.waypoints.splice(e,1)},i.prototype.first=function(){return this.waypoints[0]},i.prototype.last=function(){return this.waypoints[this.waypoints.length-1]},i.findOrCreate=function(t){return o[t.axis][t.name]||new i(t)},n.Group=i}(),function(){"use strict";function t(t){this.$element=e(t)}var e=window.jQuery,i=window.Waypoint;e.each(["innerHeight","innerWidth","off","offset","on","outerHeight","outerWidth","scrollLeft","scrollTop"],function(e,i){t.prototype[i]=function(){var t=Array.prototype.slice.call(arguments);return this.$element[i].apply(this.$element,t)}}),e.each(["extend","inArray","isEmptyObject"],function(i,o){t[o]=e[o]}),i.adapters.push({name:"jquery",Adapter:t}),i.Adapter=t}(),function(){"use strict";function t(t){return function(){var i=[],o=arguments[0];return t.isFunction(arguments[0])&&(o=t.extend({},arguments[1]),o.handler=arguments[0]),this.each(function(){var n=t.extend({},o,{element:this});"string"==typeof n.context&&(n.context=t(this).closest(n.context)[0]),i.push(new e(n))}),i}}var e=window.Waypoint;window.jQuery&&(window.jQuery.fn.waypoint=t(window.jQuery)),window.Zepto&&(window.Zepto.fn.waypoint=t(window.Zepto))}();

/*!
Waypoints Sticky Element Shortcut - 4.0.0
Copyright © 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blog/master/licenses.txt
*/
!function(){"use strict";function t(s){this.options=e.extend({},i.defaults,t.defaults,s),this.element=this.options.element,this.$element=e(this.element),this.createWrapper(),this.createWaypoint()}var e=window.jQuery,i=window.Waypoint;t.prototype.createWaypoint=function(){var t=this.options.handler;this.waypoint=new i(e.extend({},this.options,{element:this.wrapper,handler:e.proxy(function(e){var i=this.options.direction.indexOf(e)>-1,s=i?this.$element.outerHeight(!0):"";this.$wrapper.height(s),this.$element.toggleClass(this.options.stuckClass,i),t&&t.call(this,e)},this)}))},t.prototype.createWrapper=function(){this.options.wrapper&&this.$element.wrap(this.options.wrapper),this.$wrapper=this.$element.parent(),this.wrapper=this.$wrapper[0]},t.prototype.destroy=function(){this.$element.parent()[0]===this.wrapper&&(this.waypoint.destroy(),this.$element.removeClass(this.options.stuckClass),this.options.wrapper&&this.$element.unwrap())},t.defaults={wrapper:'<div class="sticky-wrapper" />',stuckClass:"stuck",direction:"down right"},i.Sticky=t}();

/*!
Waypoints Inview Element Shortcut - 4.0.0
Copyright © 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blog/master/licenses.txt
*/
!function(){"use strict";function t(){}function e(t){this.options=i.Adapter.extend({},e.defaults,t),this.axis=this.options.horizontal?"horizontal":"vertical",this.waypoints=[],this.element=this.options.element,this.createWaypoints()}var i=window.Waypoint;e.prototype.createWaypoints=function(){for(var t={vertical:[{down:"enter",up:"exited",offset:"100%"},{down:"entered",up:"exit",offset:"bottom-in-view"},{down:"exit",up:"entered",offset:0},{down:"exited",up:"enter",offset:function(){return-this.adapter.outerHeight()}}],horizontal:[{right:"enter",left:"exited",offset:"100%"},{right:"entered",left:"exit",offset:"right-in-view"},{right:"exit",left:"entered",offset:0},{right:"exited",left:"enter",offset:function(){return-this.adapter.outerWidth()}}]},e=0,i=t[this.axis].length;i>e;e++){var n=t[this.axis][e];this.createWaypoint(n)}},e.prototype.createWaypoint=function(t){var e=this;this.waypoints.push(new i({context:this.options.context,element:this.options.element,enabled:this.options.enabled,handler:function(t){return function(i){e.options[t[i]].call(e,i)}}(t),offset:t.offset,horizontal:this.options.horizontal}))},e.prototype.destroy=function(){for(var t=0,e=this.waypoints.length;e>t;t++)this.waypoints[t].destroy();this.waypoints=[]},e.prototype.disable=function(){for(var t=0,e=this.waypoints.length;e>t;t++)this.waypoints[t].disable()},e.prototype.enable=function(){for(var t=0,e=this.waypoints.length;e>t;t++)this.waypoints[t].enable()},e.defaults={context:window,enabled:!0,enter:t,entered:t,exit:t,exited:t},i.Inview=e}();

/*! skrollr 0.6.30 (2015-08-12) | Alexander Prinzhorn - https://github.com/Prinzhorn/skrollr | Free to use under terms of MIT license */
!function(a,b,c){"use strict";function d(c){if(e=b.documentElement,f=b.body,T(),ha=this,c=c||{},ma=c.constants||{},c.easing)for(var d in c.easing)W[d]=c.easing[d];ta=c.edgeStrategy||"set",ka={beforerender:c.beforerender,render:c.render,keyframe:c.keyframe},la=c.forceHeight!==!1,la&&(Ka=c.scale||1),na=c.mobileDeceleration||y,pa=c.smoothScrolling!==!1,qa=c.smoothScrollingDuration||A,ra={targetTop:ha.getScrollTop()},Sa=(c.mobileCheck||function(){return/Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent||navigator.vendor||a.opera)})(),Sa?(ja=b.getElementById(c.skrollrBody||z),ja&&ga(),X(),Ea(e,[s,v],[t])):Ea(e,[s,u],[t]),ha.refresh(),wa(a,"resize orientationchange",function(){var a=e.clientWidth,b=e.clientHeight;(b!==Pa||a!==Oa)&&(Pa=b,Oa=a,Qa=!0)});var g=U();return function h(){$(),va=g(h)}(),ha}var e,f,g={get:function(){return ha},init:function(a){return ha||new d(a)},VERSION:"0.6.30"},h=Object.prototype.hasOwnProperty,i=a.Math,j=a.getComputedStyle,k="touchstart",l="touchmove",m="touchcancel",n="touchend",o="skrollable",p=o+"-before",q=o+"-between",r=o+"-after",s="skrollr",t="no-"+s,u=s+"-desktop",v=s+"-mobile",w="linear",x=1e3,y=.004,z="skrollr-body",A=200,B="start",C="end",D="center",E="bottom",F="___skrollable_id",G=/^(?:input|textarea|button|select)$/i,H=/^\s+|\s+$/g,I=/^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/,J=/\s*(@?[\w\-\[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi,K=/^(@?[a-z\-]+)\[(\w+)\]$/,L=/-([a-z0-9_])/g,M=function(a,b){return b.toUpperCase()},N=/[\-+]?[\d]*\.?[\d]+/g,O=/\{\?\}/g,P=/rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g,Q=/[a-z\-]+-gradient/g,R="",S="",T=function(){var a=/^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;if(j){var b=j(f,null);for(var c in b)if(R=c.match(a)||+c==c&&b[c].match(a))break;if(!R)return void(R=S="");R=R[0],"-"===R.slice(0,1)?(S=R,R={"-webkit-":"webkit","-moz-":"Moz","-ms-":"ms","-o-":"O"}[R]):S="-"+R.toLowerCase()+"-"}},U=function(){var b=a.requestAnimationFrame||a[R.toLowerCase()+"RequestAnimationFrame"],c=Ha();return(Sa||!b)&&(b=function(b){var d=Ha()-c,e=i.max(0,1e3/60-d);return a.setTimeout(function(){c=Ha(),b()},e)}),b},V=function(){var b=a.cancelAnimationFrame||a[R.toLowerCase()+"CancelAnimationFrame"];return(Sa||!b)&&(b=function(b){return a.clearTimeout(b)}),b},W={begin:function(){return 0},end:function(){return 1},linear:function(a){return a},quadratic:function(a){return a*a},cubic:function(a){return a*a*a},swing:function(a){return-i.cos(a*i.PI)/2+.5},sqrt:function(a){return i.sqrt(a)},outCubic:function(a){return i.pow(a-1,3)+1},bounce:function(a){var b;if(.5083>=a)b=3;else if(.8489>=a)b=9;else if(.96208>=a)b=27;else{if(!(.99981>=a))return 1;b=91}return 1-i.abs(3*i.cos(a*b*1.028)/b)}};d.prototype.refresh=function(a){var d,e,f=!1;for(a===c?(f=!0,ia=[],Ra=0,a=b.getElementsByTagName("*")):a.length===c&&(a=[a]),d=0,e=a.length;e>d;d++){var g=a[d],h=g,i=[],j=pa,k=ta,l=!1;if(f&&F in g&&delete g[F],g.attributes){for(var m=0,n=g.attributes.length;n>m;m++){var p=g.attributes[m];if("data-anchor-target"!==p.name)if("data-smooth-scrolling"!==p.name)if("data-edge-strategy"!==p.name)if("data-emit-events"!==p.name){var q=p.name.match(I);if(null!==q){var r={props:p.value,element:g,eventType:p.name.replace(L,M)};i.push(r);var s=q[1];s&&(r.constant=s.substr(1));var t=q[2];/p$/.test(t)?(r.isPercentage=!0,r.offset=(0|t.slice(0,-1))/100):r.offset=0|t;var u=q[3],v=q[4]||u;u&&u!==B&&u!==C?(r.mode="relative",r.anchors=[u,v]):(r.mode="absolute",u===C?r.isEnd=!0:r.isPercentage||(r.offset=r.offset*Ka))}}else l=!0;else k=p.value;else j="off"!==p.value;else if(h=b.querySelector(p.value),null===h)throw'Unable to find anchor target "'+p.value+'"'}if(i.length){var w,x,y;!f&&F in g?(y=g[F],w=ia[y].styleAttr,x=ia[y].classAttr):(y=g[F]=Ra++,w=g.style.cssText,x=Da(g)),ia[y]={element:g,styleAttr:w,classAttr:x,anchorTarget:h,keyFrames:i,smoothScrolling:j,edgeStrategy:k,emitEvents:l,lastFrameIndex:-1},Ea(g,[o],[])}}}for(Aa(),d=0,e=a.length;e>d;d++){var z=ia[a[d][F]];z!==c&&(_(z),ba(z))}return ha},d.prototype.relativeToAbsolute=function(a,b,c){var d=e.clientHeight,f=a.getBoundingClientRect(),g=f.top,h=f.bottom-f.top;return b===E?g-=d:b===D&&(g-=d/2),c===E?g+=h:c===D&&(g+=h/2),g+=ha.getScrollTop(),g+.5|0},d.prototype.animateTo=function(a,b){b=b||{};var d=Ha(),e=ha.getScrollTop(),f=b.duration===c?x:b.duration;return oa={startTop:e,topDiff:a-e,targetTop:a,duration:f,startTime:d,endTime:d+f,easing:W[b.easing||w],done:b.done},oa.topDiff||(oa.done&&oa.done.call(ha,!1),oa=c),ha},d.prototype.stopAnimateTo=function(){oa&&oa.done&&oa.done.call(ha,!0),oa=c},d.prototype.isAnimatingTo=function(){return!!oa},d.prototype.isMobile=function(){return Sa},d.prototype.setScrollTop=function(b,c){return sa=c===!0,Sa?Ta=i.min(i.max(b,0),Ja):a.scrollTo(0,b),ha},d.prototype.getScrollTop=function(){return Sa?Ta:a.pageYOffset||e.scrollTop||f.scrollTop||0},d.prototype.getMaxScrollTop=function(){return Ja},d.prototype.on=function(a,b){return ka[a]=b,ha},d.prototype.off=function(a){return delete ka[a],ha},d.prototype.destroy=function(){var a=V();a(va),ya(),Ea(e,[t],[s,u,v]);for(var b=0,d=ia.length;d>b;b++)fa(ia[b].element);e.style.overflow=f.style.overflow="",e.style.height=f.style.height="",ja&&g.setStyle(ja,"transform","none"),ha=c,ja=c,ka=c,la=c,Ja=0,Ka=1,ma=c,na=c,La="down",Ma=-1,Oa=0,Pa=0,Qa=!1,oa=c,pa=c,qa=c,ra=c,sa=c,Ra=0,ta=c,Sa=!1,Ta=0,ua=c};var X=function(){var d,g,h,j,o,p,q,r,s,t,u,v;wa(e,[k,l,m,n].join(" "),function(a){var e=a.changedTouches[0];for(j=a.target;3===j.nodeType;)j=j.parentNode;switch(o=e.clientY,p=e.clientX,t=a.timeStamp,G.test(j.tagName)||a.preventDefault(),a.type){case k:d&&d.blur(),ha.stopAnimateTo(),d=j,g=q=o,h=p,s=t;break;case l:G.test(j.tagName)&&b.activeElement!==j&&a.preventDefault(),r=o-q,v=t-u,ha.setScrollTop(Ta-r,!0),q=o,u=t;break;default:case m:case n:var f=g-o,w=h-p,x=w*w+f*f;if(49>x){if(!G.test(d.tagName)){d.focus();var y=b.createEvent("MouseEvents");y.initMouseEvent("click",!0,!0,a.view,1,e.screenX,e.screenY,e.clientX,e.clientY,a.ctrlKey,a.altKey,a.shiftKey,a.metaKey,0,null),d.dispatchEvent(y)}return}d=c;var z=r/v;z=i.max(i.min(z,3),-3);var A=i.abs(z/na),B=z*A+.5*na*A*A,C=ha.getScrollTop()-B,D=0;C>Ja?(D=(Ja-C)/B,C=Ja):0>C&&(D=-C/B,C=0),A*=1-D,ha.animateTo(C+.5|0,{easing:"outCubic",duration:A})}}),a.scrollTo(0,0),e.style.overflow=f.style.overflow="hidden"},Y=function(){var a,b,c,d,f,g,h,j,k,l,m,n=e.clientHeight,o=Ba();for(j=0,k=ia.length;k>j;j++)for(a=ia[j],b=a.element,c=a.anchorTarget,d=a.keyFrames,f=0,g=d.length;g>f;f++)h=d[f],l=h.offset,m=o[h.constant]||0,h.frame=l,h.isPercentage&&(l*=n,h.frame=l),"relative"===h.mode&&(fa(b),h.frame=ha.relativeToAbsolute(c,h.anchors[0],h.anchors[1])-l,fa(b,!0)),h.frame+=m,la&&!h.isEnd&&h.frame>Ja&&(Ja=h.frame);for(Ja=i.max(Ja,Ca()),j=0,k=ia.length;k>j;j++){for(a=ia[j],d=a.keyFrames,f=0,g=d.length;g>f;f++)h=d[f],m=o[h.constant]||0,h.isEnd&&(h.frame=Ja-h.offset+m);a.keyFrames.sort(Ia)}},Z=function(a,b){for(var c=0,d=ia.length;d>c;c++){var e,f,i=ia[c],j=i.element,k=i.smoothScrolling?a:b,l=i.keyFrames,m=l.length,n=l[0],s=l[l.length-1],t=k<n.frame,u=k>s.frame,v=t?n:s,w=i.emitEvents,x=i.lastFrameIndex;if(t||u){if(t&&-1===i.edge||u&&1===i.edge)continue;switch(t?(Ea(j,[p],[r,q]),w&&x>-1&&(za(j,n.eventType,La),i.lastFrameIndex=-1)):(Ea(j,[r],[p,q]),w&&m>x&&(za(j,s.eventType,La),i.lastFrameIndex=m)),i.edge=t?-1:1,i.edgeStrategy){case"reset":fa(j);continue;case"ease":k=v.frame;break;default:case"set":var y=v.props;for(e in y)h.call(y,e)&&(f=ea(y[e].value),0===e.indexOf("@")?j.setAttribute(e.substr(1),f):g.setStyle(j,e,f));continue}}else 0!==i.edge&&(Ea(j,[o,q],[p,r]),i.edge=0);for(var z=0;m-1>z;z++)if(k>=l[z].frame&&k<=l[z+1].frame){var A=l[z],B=l[z+1];for(e in A.props)if(h.call(A.props,e)){var C=(k-A.frame)/(B.frame-A.frame);C=A.props[e].easing(C),f=da(A.props[e].value,B.props[e].value,C),f=ea(f),0===e.indexOf("@")?j.setAttribute(e.substr(1),f):g.setStyle(j,e,f)}w&&x!==z&&("down"===La?za(j,A.eventType,La):za(j,B.eventType,La),i.lastFrameIndex=z);break}}},$=function(){Qa&&(Qa=!1,Aa());var a,b,d=ha.getScrollTop(),e=Ha();if(oa)e>=oa.endTime?(d=oa.targetTop,a=oa.done,oa=c):(b=oa.easing((e-oa.startTime)/oa.duration),d=oa.startTop+b*oa.topDiff|0),ha.setScrollTop(d,!0);else if(!sa){var f=ra.targetTop-d;f&&(ra={startTop:Ma,topDiff:d-Ma,targetTop:d,startTime:Na,endTime:Na+qa}),e<=ra.endTime&&(b=W.sqrt((e-ra.startTime)/qa),d=ra.startTop+b*ra.topDiff|0)}if(sa||Ma!==d){La=d>Ma?"down":Ma>d?"up":La,sa=!1;var h={curTop:d,lastTop:Ma,maxTop:Ja,direction:La},i=ka.beforerender&&ka.beforerender.call(ha,h);i!==!1&&(Z(d,ha.getScrollTop()),Sa&&ja&&g.setStyle(ja,"transform","translate(0, "+-Ta+"px) "+ua),Ma=d,ka.render&&ka.render.call(ha,h)),a&&a.call(ha,!1)}Na=e},_=function(a){for(var b=0,c=a.keyFrames.length;c>b;b++){for(var d,e,f,g,h=a.keyFrames[b],i={};null!==(g=J.exec(h.props));)f=g[1],e=g[2],d=f.match(K),null!==d?(f=d[1],d=d[2]):d=w,e=e.indexOf("!")?aa(e):[e.slice(1)],i[f]={value:e,easing:W[d]};h.props=i}},aa=function(a){var b=[];return P.lastIndex=0,a=a.replace(P,function(a){return a.replace(N,function(a){return a/255*100+"%"})}),S&&(Q.lastIndex=0,a=a.replace(Q,function(a){return S+a})),a=a.replace(N,function(a){return b.push(+a),"{?}"}),b.unshift(a),b},ba=function(a){var b,c,d={};for(b=0,c=a.keyFrames.length;c>b;b++)ca(a.keyFrames[b],d);for(d={},b=a.keyFrames.length-1;b>=0;b--)ca(a.keyFrames[b],d)},ca=function(a,b){var c;for(c in b)h.call(a.props,c)||(a.props[c]=b[c]);for(c in a.props)b[c]=a.props[c]},da=function(a,b,c){var d,e=a.length;if(e!==b.length)throw"Can't interpolate between \""+a[0]+'" and "'+b[0]+'"';var f=[a[0]];for(d=1;e>d;d++)f[d]=a[d]+(b[d]-a[d])*c;return f},ea=function(a){var b=1;return O.lastIndex=0,a[0].replace(O,function(){return a[b++]})},fa=function(a,b){a=[].concat(a);for(var c,d,e=0,f=a.length;f>e;e++)d=a[e],c=ia[d[F]],c&&(b?(d.style.cssText=c.dirtyStyleAttr,Ea(d,c.dirtyClassAttr)):(c.dirtyStyleAttr=d.style.cssText,c.dirtyClassAttr=Da(d),d.style.cssText=c.styleAttr,Ea(d,c.classAttr)))},ga=function(){ua="translateZ(0)",g.setStyle(ja,"transform",ua);var a=j(ja),b=a.getPropertyValue("transform"),c=a.getPropertyValue(S+"transform"),d=b&&"none"!==b||c&&"none"!==c;d||(ua="")};g.setStyle=function(a,b,c){var d=a.style;if(b=b.replace(L,M).replace("-",""),"zIndex"===b)isNaN(c)?d[b]=c:d[b]=""+(0|c);else if("float"===b)d.styleFloat=d.cssFloat=c;else try{R&&(d[R+b.slice(0,1).toUpperCase()+b.slice(1)]=c),d[b]=c}catch(e){}};var ha,ia,ja,ka,la,ma,na,oa,pa,qa,ra,sa,ta,ua,va,wa=g.addEvent=function(b,c,d){var e=function(b){return b=b||a.event,b.target||(b.target=b.srcElement),b.preventDefault||(b.preventDefault=function(){b.returnValue=!1,b.defaultPrevented=!0}),d.call(this,b)};c=c.split(" ");for(var f,g=0,h=c.length;h>g;g++)f=c[g],b.addEventListener?b.addEventListener(f,d,!1):b.attachEvent("on"+f,e),Ua.push({element:b,name:f,listener:d})},xa=g.removeEvent=function(a,b,c){b=b.split(" ");for(var d=0,e=b.length;e>d;d++)a.removeEventListener?a.removeEventListener(b[d],c,!1):a.detachEvent("on"+b[d],c)},ya=function(){for(var a,b=0,c=Ua.length;c>b;b++)a=Ua[b],xa(a.element,a.name,a.listener);Ua=[]},za=function(a,b,c){ka.keyframe&&ka.keyframe.call(ha,a,b,c)},Aa=function(){var a=ha.getScrollTop();Ja=0,la&&!Sa&&(f.style.height=""),Y(),la&&!Sa&&(f.style.height=Ja+e.clientHeight+"px"),Sa?ha.setScrollTop(i.min(ha.getScrollTop(),Ja)):ha.setScrollTop(a,!0),sa=!0},Ba=function(){var a,b,c=e.clientHeight,d={};for(a in ma)b=ma[a],"function"==typeof b?b=b.call(ha):/p$/.test(b)&&(b=b.slice(0,-1)/100*c),d[a]=b;return d},Ca=function(){var a,b=0;return ja&&(b=i.max(ja.offsetHeight,ja.scrollHeight)),a=i.max(b,f.scrollHeight,f.offsetHeight,e.scrollHeight,e.offsetHeight,e.clientHeight),a-e.clientHeight},Da=function(b){var c="className";return a.SVGElement&&b instanceof a.SVGElement&&(b=b[c],c="baseVal"),b[c]},Ea=function(b,d,e){var f="className";if(a.SVGElement&&b instanceof a.SVGElement&&(b=b[f],f="baseVal"),e===c)return void(b[f]=d);for(var g=b[f],h=0,i=e.length;i>h;h++)g=Ga(g).replace(Ga(e[h])," ");g=Fa(g);for(var j=0,k=d.length;k>j;j++)-1===Ga(g).indexOf(Ga(d[j]))&&(g+=" "+d[j]);b[f]=Fa(g)},Fa=function(a){return a.replace(H,"")},Ga=function(a){return" "+a+" "},Ha=Date.now||function(){return+new Date},Ia=function(a,b){return a.frame-b.frame},Ja=0,Ka=1,La="down",Ma=-1,Na=Ha(),Oa=0,Pa=0,Qa=!1,Ra=0,Sa=!1,Ta=0,Ua=[];"function"==typeof define&&define.amd?define([],function(){return g}):"undefined"!=typeof module&&module.exports?module.exports=g:a.skrollr=g}(window,document);

// http://spin.js.org/#v2.3.2
!function(a,b){"object"==typeof module&&module.exports?module.exports=b():"function"==typeof define&&define.amd?define(b):a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=j.substring(0,j.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return m[e]||(k.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",k.cssRules.length),m[e]=1),e}function d(a,b){var c,d,e=a.style;if(b=b.charAt(0).toUpperCase()+b.slice(1),void 0!==e[b])return b;for(d=0;d<l.length;d++)if(c=l[d]+b,void 0!==e[c])return c}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a,b){return"string"==typeof a?a:a[b%a.length]}function h(a){this.opts=f(a||{},h.defaults,n)}function i(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}k.addRule(".spin-vml","behavior:url(#default#VML)"),h.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function h(a,h,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~h}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.scale*d.width,left:d.scale*d.radius,top:-d.scale*d.width>>1,filter:i}),c("fill",{color:g(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.scale*(d.length+d.width),k=2*d.scale*j,l=-(d.width+d.length)*d.scale*2+"px",m=e(f(),{position:"absolute",top:l,left:l});if(d.shadow)for(i=1;i<=d.lines;i++)h(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)h(i);return b(a,m)},h.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var j,k,l=["webkit","Moz","ms","O"],m={},n={lines:12,length:7,width:5,radius:10,scale:1,corners:1,color:"#000",opacity:.25,rotate:0,direction:1,speed:1,trail:100,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",shadow:!1,hwaccel:!1,position:"absolute"};if(h.defaults={},f(h.prototype,{spin:function(b){this.stop();var c=this,d=c.opts,f=c.el=a(null,{className:d.className});if(e(f,{position:d.position,width:0,zIndex:d.zIndex,left:d.left,top:d.top}),b&&b.insertBefore(f,b.firstChild||null),f.setAttribute("role","progressbar"),c.lines(f,c.opts),!j){var g,h=0,i=(d.lines-1)*(1-d.direction)/2,k=d.fps,l=k/d.speed,m=(1-d.opacity)/(l*d.trail/100),n=l/d.lines;!function o(){h++;for(var a=0;a<d.lines;a++)g=Math.max(1-(h+(d.lines-a)*n)%l*m,d.opacity),c.opacity(f,a*d.direction+i,g,d);c.timeout=c.el&&setTimeout(o,~~(1e3/k))}()}return c},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function h(b,c){return e(a(),{position:"absolute",width:f.scale*(f.length+f.width)+"px",height:f.scale*f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*k+f.rotate)+"deg) translate("+f.scale*f.radius+"px,0)",borderRadius:(f.corners*f.scale*f.width>>1)+"px"})}for(var i,k=0,l=(f.lines-1)*(1-f.direction)/2;k<f.lines;k++)i=e(a(),{position:"absolute",top:1+~(f.scale*f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:j&&c(f.opacity,f.trail,l+k*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(h("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,h(g(f.color,k),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}}),"undefined"!=typeof document){k=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}();var o=e(a("group"),{behavior:"url(#default#VML)"});!d(o,"transform")&&o.adj?i():j=d(o,"animation")}return h});


$(function() {
	var branches = [],
		GeoCodeCalc = {},
		infoWindow,
		map,
		radius = 5,
		service,
		mapInitialized = false;

	skrollr.init({
		forceHeight: false
	});

	new Waypoint.Sticky({
		element: $(".sticker")[0]
	});

	new Waypoint.Inview({
		element: $(".free-checking-account-hero .form")[0],
		enter: function(direction) {
			$(".sticker").removeClass("fixed");
		},
		exited: function(direction) {
			$(".sticker").addClass("fixed");
		}
	});

	new Waypoint.Inview({
		element: $(".free-checking-account-options .sticky-wrapper")[0],
		entered: function(direction) {
			$(".sticker").removeClass("fixed");
		},
		exit: function(direction) {
			$(".sticker").addClass("fixed");
		}
	});

	new Spinner({lines:13,length:0,width:14,radius:36,scale:1.25,corners:1,color:"#000",opacity:0,rotate:0,direction:1,speed:1,trail:42,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",shadow:!1,hwaccel:!1,position:"absolute"}).spin($(".iframe-wrapper")[0]);

	$(document).on("click", ".locate-branch, .button-get-started, .button-close, .icon-search, .icon-target, .button-back, .search-result-item", function() {
		if($(this).hasClass("locate-branch")) {
			if($(this).hasClass("active")) {
				$(".locate-branch").removeClass("active");
				$(".free-checking-locate-branch").fadeOut(250, function() {
					$(".search-zip").val("");
					// branchSearch();


					// TODO: reset map positionm, markers, list.


				});
				return false;
			} else {
				if(!mapInitialized) {
					initializeMap();
				}
				$(this).addClass("active");
				$(".free-checking-locate-branch").fadeIn(250);
			}
		} else if($(this).hasClass("button-get-started")) {
			var form = $(this).closest("form"),
				input = $(this).siblings("input[type=text]");

			if(!/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test($(input).val()) || $(input).val().length === 0) {
				input.addClass("invalid");
				input.focus();
			} else{
				var emailAddress = $(this).closest("form").find(".email-address").val();
				$(".email-address").removeClass("invalid");
				$("body").addClass("fixed");
				$(".spinner").show();
				$(".curtain").fadeIn(250, function() {
					$(".spinner").fadeOut(500);
					$(".iframe-wrapper").find("iframe").attr("src", "https://express.easternbank.com/open-deposit/#/?&e=" + emailAddress);
				});
			}
		} else if($(this).hasClass("button-close")) {
				$("body").removeClass("fixed");
				$(".email-address").val("");
				$(".curtain").fadeOut(250, function() {
					$(".iframe-wrapper").find("iframe").attr("src", "");
				});
		} else if($(this).hasClass("icon-search")) {
			if($(".search-zip").val().length === 0) {
				$(".search-zip").addClass("invalid").focus();
			} else {
				$(".search-zip").removeClass("invalid");
				$(".button-back").click();
				branchSearch("search");
			}
		} else if($(this).hasClass("icon-target")) {
			$(".search-zip").val("");
			$(".icon-target").addClass("disabled");
			navigator.geolocation.getCurrentPosition(function(location) {
				$(".icon-target").removeClass("disabled");
				branchSearch("geo", location.coords.latitude, location.coords.longitude);
			});
		} else if($(this).hasClass("button-back")) {
			$(".search-result-item-detail").hide();
			$(".search-results ol").show();
		} else if($(this).hasClass("search-result-item")) {
			$(".search-results ol").hide();
			$(".search-result-item-detail").show();
			$(".search-result-item-detail").find("p:first-child").html($(this).find("p").html());
		}
		return false;
	});

	$(".search-container form").on("keydown", function(e) {
		var code = e.keyCode || e.which;
		// Enter (13).
		if (code == 13) {
			$(".icon-search").click();
			e.preventDefault();
			return false;
		}
	});

	$(document).on("keydown", function(e) {
		var code = e.keyCode || e.which;
		// Escape (27).
		if(code === 27 && $(".curtain").is(':visible')) {
			$(".button-close").click();
		}
	});






	var branchList = [
		{
			"name": "Eastern Bank",
			"address": "63 Franklin Street",
			"city": "Boston",
			"state": "MA",
			"zip": "02110",
			"phone": "617-526-0170",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:17:00,6:08:30:17:00",
			"lat": "42.355499",
			"lng": "-71.058296",
			"distance": "0.3463867415285906"
		},
		{
			"name": "Eastern Bank",
			"address": "265 Franklin Street",
			"city": "Boston",
			"state": "MA",
			"zip": "02110",
			"phone": "617-897-1100",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:17:00,6:08:30:17:00",
			"lat": "42.356548",
			"lng": "-71.053986",
			"distance": "0.37550769602147477"
		},
		{
			"name": "Eastern Bank",
			"address": "155 Dartmouth Street",
			"city": "Boston",
			"state": "MA",
			"zip": "02116",
			"phone": "617-927-2200",
			"hours": "2:08:30:16:30,3:08:30:16:30,4:08:30:16:30,5:08:30:16:30,6:08:30:18:00,7:09:00:13:00",
			"lat": "42.347698",
			"lng": "-71.076202",
			"distance": "1.2434038975969084"
		},
		{
			"name": "Eastern Bank",
			"address": "1 Broadway",
			"city": "Cambridge",
			"state": "MA",
			"zip": "02142",
			"phone": "617-498-2500",
			"hours": "2:08:30:16:30,3:08:30:16:30,4:08:30:16:30,5:08:30:16:30,6:08:30:16:30",
			"lat": "42.362850",
			"lng": "-71.085899",
			"distance": "1.3799559767264165"
		},
		{
			"name": "Eastern Bank",
			"address": "246 Border Street",
			"city": "Boston",
			"state": "MA",
			"zip": "02128",
			"phone": "617-263-2560",
			"hours": "2:10:00:19:00,3:10:00:19:00,4:10:00:19:00,5:10:00:19:00,6:10:00:19:00,7:10:00:18:00,1:11:00:15:00",
			"lat": "42.376369",
			"lng": "-71.039848",
			"distance": "1.4722681389149515"
		},
		{
			"name": "Eastern Bank",
			"address": "470 West Broadway",
			"city": "Boston",
			"state": "MA",
			"zip": "02127",
			"phone": "617-464-2700",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:18:00,6:08:30:18:00,7:08:30:13:00",
			"lat": "42.336136",
			"lng": "-71.046288",
			"distance": "1.8042110527679602"
		},
		{
			"name": "Eastern Bank",
			"address": "647 Massachusetts Avenue",
			"city": "Cambridge",
			"state": "MA",
			"zip": "02139",
			"phone": "617-354-2445",
			"hours": "2:08:30:16:30,3:08:30:16:30,4:08:30:16:30,5:08:30:17:00,6:08:30:17:00,7:09:00:13:00",
			"lat": "42.365601",
			"lng": "-71.103996",
			"distance": "2.32124486181478"
		},
		{
			"name": "Eastern Bank",
			"address": "90 Everett Ave",
			"city": "Chelsea",
			"state": "MA",
			"zip": "02150",
			"phone": "617-235-8135",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:17:00,6:08:30:17:00,7:08:30:12:00",
			"lat": "42.394699",
			"lng": "-71.039398",
			"distance": "2.568671424676159"
		},
		{
			"name": "Eastern Bank",
			"address": "1 Brattle Square",
			"city": "Cambridge",
			"state": "MA",
			"zip": "02138",
			"phone": "617-354-3616",
			"hours": "2:08:30:16:30,3:08:30:16:30,4:08:30:16:30,5:08:30:17:00,6:08:30:17:00,7:09:00:13:00",
			"lat": "42.373390",
			"lng": "-71.120865",
			"distance": "3.2788410292997963"
		},
		{
			"name": "Eastern Bank",
			"address": "301 Harvard Street",
			"city": "Brookline",
			"state": "MA",
			"zip": "02446",
			"phone": "617-739-2010",
			"hours": "2:08:30:16:30,3:08:30:16:30,4:08:30:16:30,5:08:30:18:00,6:08:30:18:00,7:09:00:13:00",
			"lat": "42.343063",
			"lng": "-71.122688",
			"distance": "3.4647589815423334"
		},
		{
			"name": "Eastern Bank",
			"address": "53 Locust St",
			"city": "Medford",
			"state": "MA",
			"zip": "02155",
			"phone": "781-395-4899",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:19:00,6:09:00:19:00,7:09:00:13:00",
			"lat": "42.408134",
			"lng": "-71.093292",
			"distance": "3.727547407566711"
		},
		{
			"name": "Eastern Bank",
			"address": "738 Broadway",
			"city": "Everett",
			"state": "MA",
			"zip": "02149",
			"phone": "617-387-5115",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:18:00,6:09:00:18:00,7:09:00:12:00",
			"lat": "42.415627",
			"lng": "-71.048058",
			"distance": "3.8516457810367677"
		},
		{
			"name": "Eastern Bank",
			"address": "250 Elm St",
			"city": "Somerville",
			"state": "MA",
			"zip": "02144",
			"phone": "617-628-9700",
			"hours": "2:08:30:16:30,3:08:30:16:30,4:08:30:16:30,5:08:30:17:00,6:08:30:17:00,7:09:00:13:00",
			"lat": "42.395451",
			"lng": "-71.124367",
			"distance": "4.117050471253167"
		},
		{
			"name": "Eastern Bank",
			"address": "687 Centre Street",
			"city": "Jamaica Plain",
			"state": "MA",
			"zip": "02130",
			"phone": "617-971-9550",
			"hours": "2:08:30:16:30,3:08:30:16:30,4:08:30:16:30,5:08:30:17:00,6:08:30:17:00,7:09:00:13:00",
			"lat": "42.312126",
			"lng": "-71.114433",
			"distance": "4.377435010947063"
		},
		{
			"name": "Eastern Bank",
			"address": "94 Pleasant St",
			"city": "Malden",
			"state": "MA",
			"zip": "02148",
			"phone": "781-388-1210",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:17:00,6:08:30:17:00,7:09:00:13:00",
			"lat": "42.426800",
			"lng": "-71.069633",
			"distance": "4.614164839281387"
		},
		{
			"name": "Eastern Bank",
			"address": "176 Alewife Brook Parkway",
			"city": "Cambridge",
			"state": "MA",
			"zip": "02138",
			"phone": "617-234-2255",
			"hours": "2:08:30:16:30,3:08:30:16:30,4:08:30:16:30,5:08:30:17:00,6:08:30:17:00,7:09:00:13:00",
			"lat": "42.394669",
			"lng": "-71.140602",
			"distance": "4.785771749890594"
		},
		{
			"name": "Eastern Bank",
			"address": "1906 Dorchester Avenue",
			"city": "Boston",
			"state": "MA",
			"zip": "02124",
			"phone": "617-929-1906",
			"hours": "2:08:30:16:30,3:08:30:16:30,4:08:30:16:30,5:08:30:17:00,6:08:30:17:00,7:09:00:13:00",
			"lat": "42.286247",
			"lng": "-71.064156",
			"distance": "5.135912764147221"
		},
		{
			"name": "Eastern Bank",
			"address": "1 Church St",
			"city": "Watertown",
			"state": "MA",
			"zip": "02472",
			"phone": "617-926-7588",
			"hours": "2:08:30:16:30,3:08:30:16:30,4:08:30:16:30,5:08:30:17:00,6:08:30:17:00,7:09:00:13:00",
			"lat": "42.366402",
			"lng": "-71.185997",
			"distance": "6.4935746190758445"
		},
		{
			"name": "Eastern Bank",
			"address": "441 Main Street",
			"city": "Melrose",
			"state": "MA",
			"zip": "02176",
			"phone": "781-665-2264",
			"hours": "2:08:00:18:00,3:08:00:18:00,4:08:00:18:00,5:08:00:19:00,6:08:00:19:00,7:09:00:15:00,1:11:00:15:00",
			"lat": "42.454800",
			"lng": "-71.065498",
			"distance": "6.525512915026517"
		},
		{
			"name": "Eastern Bank",
			"address": "466 Lincoln Avenue",
			"city": "Saugus",
			"state": "MA",
			"zip": "01906",
			"phone": "781-231-4880",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:16:00,6:09:00:17:00,7:09:00:12:00",
			"lat": "42.448624",
			"lng": "-71.009102",
			"distance": "6.602421568616116"
		},
		{
			"name": "Eastern Bank",
			"address": "731 Hancock Street",
			"city": "Quincy",
			"state": "MA",
			"zip": "02170",
			"phone": "617-689-1712",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:19:00,6:08:30:17:00,7:08:30:13:00",
			"lat": "42.266048",
			"lng": "-71.016655",
			"distance": "6.875386970488417"
		},
		{
			"name": "Eastern Bank",
			"address": "1255 Centre Street",
			"city": "Newton",
			"state": "MA",
			"zip": "02459",
			"phone": "617-969-6330",
			"hours": "2:08:30:16:30,3:08:30:16:30,4:08:30:16:30,5:08:30:17:00,6:08:30:17:00,7:09:00:13:00",
			"lat": "42.330276",
			"lng": "-71.195000",
			"distance": "7.249214363449615"
		},
		{
			"name": "Eastern Bank",
			"address": "2029 Centre Street",
			"city": "West Roxbury",
			"state": "MA",
			"zip": "02132",
			"phone": "617-897-1068",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:18:00,6:08:30:18:00,7:09:00:14:00",
			"lat": "42.280815",
			"lng": "-71.158401",
			"distance": "7.487274089059296"
		},
		{
			"name": "Eastern Bank",
			"address": "13 Main St",
			"city": "Saugus",
			"state": "MA",
			"zip": "01906",
			"phone": "781-231-4890",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:16:00,6:09:00:19:00,7:09:00:12:00",
			"lat": "42.464802",
			"lng": "-71.010803",
			"distance": "7.617203889548229"
		},
		{
			"name": "Eastern Bank",
			"address": "605 Broadway",
			"city": "Saugus",
			"state": "MA",
			"zip": "01906",
			"phone": "781-231-4801",
			"hours": "2:07:00:20:00,3:07:00:20:00,4:07:00:20:00,5:07:00:20:00,6:07:00:20:00,7:09:00:17:00,1:11:00:15:00",
			"lat": "42.479645",
			"lng": "-71.021584",
			"distance": "8.453007591127536"
		},
		{
			"name": "Eastern Bank",
			"address": "188 Needham St",
			"city": "Newton",
			"state": "MA",
			"zip": "02464",
			"phone": "617-243-8200",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:18:00,6:08:30:17:00,7:09:00:12:00",
			"lat": "42.311798",
			"lng": "-71.213402",
			"distance": "8.570932758838998"
		},
		{
			"name": "Eastern Bank",
			"address": "63 Franklin Street",
			"city": "Quincy",
			"state": "MA",
			"zip": "02169",
			"phone": "617-689-1746",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:19:00,6:08:30:18:00,7:08:30:13:00",
			"lat": "42.241810",
			"lng": "-71.003693",
			"distance": "8.674363181756194"
		},
		{
			"name": "Eastern Bank",
			"address": "112 Market Street",
			"city": "Lynn",
			"state": "MA",
			"zip": "01901",
			"phone": "781-598-8607",
			"hours": "2:08:30:16:00,3:08:30:16:00,4:08:30:16:00,5:08:30:16:00,6:08:30:16:00,7:09:00:12:00",
			"lat": "42.462940",
			"lng": "-70.948463",
			"distance": "9.053085772527778"
		},
		{
			"name": "Eastern Bank",
			"address": "163 Main St",
			"city": "Stoneham",
			"state": "MA",
			"zip": "02180",
			"phone": "781-438-3535",
			"hours": "2:08:30:16:00,3:08:30:16:00,4:08:30:16:00,5:08:30:18:00,6:08:30:18:00,7:09:00:15:00",
			"lat": "42.490463",
			"lng": "-71.100220",
			"distance": "9.223574906568977"
		},
		{
			"name": "Eastern Bank",
			"address": "156 Boston Street",
			"city": "Lynn",
			"state": "MA",
			"zip": "01904",
			"phone": "781-598-2520",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:19:00,6:09:00:18:00,7:09:00:15:00,1:11:00:15:00",
			"lat": "42.472858",
			"lng": "-70.959846",
			"distance": "9.268865952334815"
		},
		{
			"name": "Eastern Bank",
			"address": "240 Providence Highway",
			"city": "Dedham",
			"state": "MA",
			"zip": "02026",
			"phone": "617-689-1754",
			"hours": "2:09:00:17:00,3:09:00:17:00,4:09:00:17:00,5:09:00:17:00,6:09:00:19:00,7:09:00:13:00,1:11:00:15:00",
			"lat": "42.249508",
			"lng": "-71.171143",
			"distance": "9.570907974967563"
		},
		{
			"name": "Eastern Bank",
			"address": "2060 Commonwealth Avenue",
			"city": "Newton",
			"state": "MA",
			"zip": "02466",
			"phone": "617-558-2300",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:17:00,6:08:30:18:00,7:09:00:13:00",
			"lat": "42.347393",
			"lng": "-71.245880",
			"distance": "9.582222401759326"
		},
		{
			"name": "Eastern Bank",
			"address": "445 Main St",
			"city": "Wakefield",
			"state": "MA",
			"zip": "01880",
			"phone": "781-246-2727",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:18:00,6:09:00:18:00,7:09:00:12:00",
			"lat": "42.502102",
			"lng": "-71.072067",
			"distance": "9.80816809299377"
		},
		{
			"name": "Eastern Bank",
			"address": "45 Salem St",
			"city": "Lynnfield",
			"state": "MA",
			"zip": "01940",
			"phone": "781-246-1100",
			"hours": "2:08:00:17:00,3:08:00:17:00,4:08:00:17:00,5:08:00:19:00,6:08:00:19:00,7:09:00:14:00",
			"lat": "42.511799",
			"lng": "-71.036613",
			"distance": "10.518239946012482"
		},
		{
			"name": "Eastern Bank",
			"address": "1833 Massachusetts Avenue",
			"city": "Lexington",
			"state": "MA",
			"zip": "02420",
			"phone": "781-238-4714",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:18:00,6:08:30:18:00,7:09:00:12:00",
			"lat": "42.448532",
			"lng": "-71.229370",
			"distance": "10.607682356953106"
		},
		{
			"name": "Eastern Bank",
			"address": "51 Commercial Street",
			"city": "Braintree",
			"state": "MA",
			"zip": "02184",
			"phone": "781-848-5560",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:17:00,6:08:30:19:00,7:08:30:13:00",
			"lat": "42.220982",
			"lng": "-70.969933",
			"distance": "10.661423839460914"
		},
		{
			"name": "Eastern Bank",
			"address": "43 Middlesex Turnpike",
			"city": "Burlington",
			"state": "MA",
			"zip": "01803",
			"phone": "781-238-4700",
			"hours": "2:09:00:17:00,3:09:00:17:00,4:09:00:17:00,5:09:00:18:00,6:09:00:18:00,7:09:00:13:00",
			"lat": "42.472198",
			"lng": "-71.211700",
			"distance": "10.964400430412795"
		},
		{
			"name": "Eastern Bank",
			"address": "405 Paradise Rd",
			"city": "Swampscott",
			"state": "MA",
			"zip": "01907",
			"phone": "781-599-8100",
			"hours": "2:08:00:17:00,3:08:00:17:00,4:08:00:17:00,5:08:00:19:00,6:08:00:19:00,7:09:00:13:00,1:11:00:15:00",
			"lat": "42.478100",
			"lng": "-70.907837",
			"distance": "11.205235575681694"
		},
		{
			"name": "Eastern Bank",
			"address": "123 Haven St",
			"city": "Reading",
			"state": "MA",
			"zip": "01867",
			"phone": "781-942-8187",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:18:00,6:08:30:18:00,7:09:00:13:00",
			"lat": "42.522907",
			"lng": "-71.104736",
			"distance": "11.462417344303848"
		},
		{
			"name": "Eastern Bank",
			"address": "102 Lynn Street",
			"city": "Peabody",
			"state": "MA",
			"zip": "01960",
			"phone": "(978) 531-8311",
			"hours": "2:08:00:17:00,3:08:00:17:00,4:08:00:17:00,5:08:00:18:00,6:08:00:18:00,7:09:00:13:00",
			"lat": "42.512184",
			"lng": "-70.947166",
			"distance": "11.934876967222882"
		},
		{
			"name": "Eastern Bank",
			"address": "6 Trader's Way",
			"city": "Salem",
			"state": "MA",
			"zip": "01970",
			"phone": "(978) 740-6144",
			"hours": "2:09:00:17:00,3:09:00:17:00,4:09:00:17:00,5:09:00:20:00,6:09:00:20:00,7:09:00:15:00,1:11:00:15:00",
			"lat": "42.502731",
			"lng": "-70.923981",
			"distance": "12.003059567826071"
		},
		{
			"name": "Eastern Bank",
			"address": "274 Main St",
			"city": "Hingham",
			"state": "MA",
			"zip": "02043",
			"phone": "781-740-4830",
			"hours": "2:08:30:16:00,3:08:30:16:00,4:08:30:16:00,5:08:30:17:00,6:08:30:18:00,7:08:30:12:00",
			"lat": "42.233917",
			"lng": "-70.880333",
			"distance": "12.645976496500667"
		},
		{
			"name": "Eastern Bank",
			"address": "72 Loring Avenue",
			"city": "Salem",
			"state": "MA",
			"zip": "01970",
			"phone": "(978) 740-6372",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:18:00,6:09:00:18:00,7:09:00:12:00",
			"lat": "42.501240",
			"lng": "-70.895744",
			"distance": "12.805262757382605"
		},
		{
			"name": "Eastern Bank",
			"address": "1150 Washington St",
			"city": "Weymouth",
			"state": "MA",
			"zip": "02189",
			"phone": "781-331-0893",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:19:00,6:08:30:17:00,7:08:30:13:00",
			"lat": "42.197208",
			"lng": "-70.929291",
			"distance": "13.08785741345429"
		},
		{
			"name": "Eastern Bank",
			"address": "37 Foster Street",
			"city": "Peabody",
			"state": "MA",
			"zip": "01960",
			"phone": "(978) 977-0555",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:18:00,6:09:00:18:00,7:09:00:12:00",
			"lat": "42.524700",
			"lng": "-70.928200",
			"distance": "13.163779357349437"
		},
		{
			"name": "Eastern Bank",
			"address": "Essex Center Drive",
			"city": "Peabody",
			"state": "MA",
			"zip": "01960",
			"phone": "(978) 531-4505",
			"hours": "2:10:00:20:00,3:10:00:20:00,4:10:00:20:00,5:10:00:20:00,6:10:00:20:00,7:10:00:18:00,1:11:00:15:00",
			"lat": "42.528492",
			"lng": "-70.929863",
			"distance": "13.348128125563047"
		},
		{
			"name": "Eastern Bank",
			"address": "35 Memorial Pkwy",
			"city": "Randolph",
			"state": "MA",
			"zip": "02368",
			"phone": "781-961-1951",
			"hours": "2:08:30:16:30,3:08:30:16:30,4:08:30:16:30,5:08:30:17:30,6:08:30:17:30,7:09:00:12:00",
			"lat": "42.163261",
			"lng": "-71.043526",
			"distance": "13.650483201629873"
		},
		{
			"name": "Eastern Bank",
			"address": "125 Washington St",
			"city": "Salem",
			"state": "MA",
			"zip": "01970",
			"phone": "(978) 740-6235",
			"hours": "2:08:30:16:00,3:08:30:16:00,4:08:30:16:00,5:08:30:16:00,6:08:30:16:00",
			"lat": "42.520824",
			"lng": "-70.895607",
			"distance": "13.864518803588572"
		},
		{
			"name": "Eastern Bank",
			"address": "19 Congress Street",
			"city": "Salem",
			"state": "MA",
			"zip": "01970",
			"phone": "(978) 745-0183",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:19:00,6:09:00:18:00,7:09:00:15:00",
			"lat": "42.519798",
			"lng": "-70.889671",
			"distance": "13.992752894551698"
		},
		{
			"name": "Eastern Bank",
			"address": "370 Main St",
			"city": "Wilmington",
			"state": "MA",
			"zip": "01887",
			"phone": "(978) 658-4000",
			"hours": "2:09:00:17:00,3:09:00:17:00,4:09:00:17:00,5:09:00:19:00,6:09:00:17:00,7:09:00:13:00",
			"lat": "42.548824",
			"lng": "-71.176857",
			"distance": "14.332856163944003"
		},
		{
			"name": "Eastern Bank",
			"address": "4 Federal Street",
			"city": "Danvers",
			"state": "MA",
			"zip": "01923",
			"phone": "(978) 777-1600",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:19:00,6:08:30:19:00,7:09:00:15:00,1:11:00:15:00",
			"lat": "42.550701",
			"lng": "-70.946831",
			"distance": "14.33514038702164"
		},
		{
			"name": "Eastern Bank",
			"address": "118 Washington St",
			"city": "Marblehead",
			"state": "MA",
			"zip": "01945",
			"phone": "781-639-4320",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:17:00,6:09:00:17:00,7:09:00:12:00",
			"lat": "42.504452",
			"lng": "-70.850174",
			"distance": "14.575769624717015"
		},
		{
			"name": "Eastern Bank",
			"address": "81 Bridge Street",
			"city": "Beverly",
			"state": "MA",
			"zip": "01915",
			"phone": "(978) 927-1803",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:18:00,6:09:00:18:00,7:09:00:12:00",
			"lat": "42.550598",
			"lng": "-70.895798",
			"distance": "15.551508061526452"
		},
		{
			"name": "Eastern Bank",
			"address": "2 South Avenue",
			"city": "Natick",
			"state": "MA",
			"zip": "01760",
			"phone": "(508) 655-4101",
			"hours": "2:08:30:16:00,3:08:30:16:00,4:08:30:16:00,5:08:30:17:00,6:08:30:17:00,7:09:00:12:00",
			"lat": "42.285400",
			"lng": "-71.347603",
			"distance": "15.627215832751908"
		},
		{
			"name": "Eastern Bank",
			"address": "397 Washington Street",
			"city": "Stoughton",
			"state": "MA",
			"zip": "02072",
			"phone": "781-297-3550",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:18:00,6:08:30:17:00,7:08:30:13:00",
			"lat": "42.135300",
			"lng": "-71.101700",
			"distance": "15.711524337504931"
		},
		{
			"name": "Eastern Bank",
			"address": "80 Washington St",
			"city": "Norwell",
			"state": "MA",
			"zip": "02061",
			"phone": "781-871-8650",
			"hours": "2:08:30:16:00,3:08:30:16:00,4:08:30:16:00,5:08:30:17:00,6:08:30:18:00,7:09:00:12:00",
			"lat": "42.172787",
			"lng": "-70.880424",
			"distance": "15.863066449273022"
		},
		{
			"name": "Eastern Bank",
			"address": "39 Washington Street",
			"city": "Canton",
			"state": "MA",
			"zip": "02021",
			"phone": "781-828-4448",
			"hours": "2:08:30:16:00,3:08:30:16:00,4:08:30:16:00,5:08:30:18:00,6:08:30:17:00,7:09:00:12:00",
			"lat": "42.139362",
			"lng": "-71.148643",
			"distance": "15.950928419797327"
		},
		{
			"name": "Eastern Bank",
			"address": "7 South Main Street",
			"city": "Sharon",
			"state": "MA",
			"zip": "02067",
			"phone": "781-784-7800",
			"hours": "2:08:30:15:00,3:08:30:15:00,4:08:30:15:00,5:08:30:18:00,6:08:30:15:00,7:08:30:12:30",
			"lat": "42.123550",
			"lng": "-71.179306",
			"distance": "17.488631241770825"
		},
		{
			"name": "Eastern Bank",
			"address": "1800 Main Street",
			"city": "Tewksbury",
			"state": "MA",
			"zip": "01876",
			"phone": "(978) 851-0300",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:19:00,6:09:00:18:00,7:09:00:12:00",
			"lat": "42.593014",
			"lng": "-71.209061",
			"distance": "17.79328046377175"
		},
		{
			"name": "Eastern Bank",
			"address": "33 Enon Street",
			"city": "Beverly",
			"state": "MA",
			"zip": "01915",
			"phone": "(978) 927-5890",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:18:00,6:09:00:18:00,7:09:00:12:00",
			"lat": "42.586784",
			"lng": "-70.885117",
			"distance": "17.97526640816908"
		},
		{
			"name": "Eastern Bank",
			"address": "276 Quincy Street",
			"city": "Brockton",
			"state": "MA",
			"zip": "02302",
			"phone": "(508) 586-6800",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:17:00,6:09:00:18:00,7:08:30:12:00",
			"lat": "42.085663",
			"lng": "-70.987213",
			"distance": "19.341835693072635"
		},
		{
			"name": "Eastern Bank",
			"address": "60 Main Street",
			"city": "Andover",
			"state": "MA",
			"zip": "01810",
			"phone": "(978) 296-9044",
			"hours": "2:09:00:17:00,3:09:00:17:00,4:09:00:17:00,5:09:00:18:00,6:09:00:18:00,7:09:00:12:00",
			"lat": "42.655392",
			"lng": "-71.139771",
			"distance": "20.78822626237775"
		},
		{
			"name": "Eastern Bank",
			"address": "1265 Belmont Street",
			"city": "Brockton",
			"state": "MA",
			"zip": "02301",
			"phone": "(508) 587-3210",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:17:00,6:09:00:18:00,7:08:30:12:00",
			"lat": "42.059021",
			"lng": "-71.067528",
			"distance": "20.83460824480369"
		},
		{
			"name": "Eastern Bank",
			"address": "17 North Road",
			"city": "Chelmsford",
			"state": "MA",
			"zip": "01824",
			"phone": "(978) 256-3733",
			"hours": "",
			"lat": "42.598309",
			"lng": "-71.352684",
			"distance": "22.22502843618672"
		},
		{
			"name": "Eastern Bank",
			"address": "291 Chelmsford Street",
			"city": "Chelmsford",
			"state": "MA",
			"zip": "01824",
			"phone": "(978) 256-3751",
			"hours": "2:08:00:17:00,3:08:00:17:00,4:08:00:17:00,5:08:00:19:00,6:08:00:18:00,7:09:00:13:00",
			"lat": "42.612598",
			"lng": "-71.330803",
			"distance": "22.253283292326014"
		},
		{
			"name": "Eastern Bank",
			"address": "50 Central Street",
			"city": "Lowell",
			"state": "MA",
			"zip": "01852",
			"phone": "(978) 446-9276",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:19:00,6:09:00:18:00,7:09:00:12:00",
			"lat": "42.644669",
			"lng": "-71.308197",
			"distance": "23.381015019452455"
		},
		{
			"name": "Eastern Bank",
			"address": "203 Littleton Road",
			"city": "Westford",
			"state": "MA",
			"zip": "01886",
			"phone": "(978) 692-3467",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:19:00,6:09:00:18:00,7:09:00:12:00",
			"lat": "42.563354",
			"lng": "-71.429428",
			"distance": "23.514649546293622"
		},
		{
			"name": "Eastern Bank",
			"address": "755 Lakeview Avenue",
			"city": "Lowell",
			"state": "MA",
			"zip": "01850",
			"phone": "(978) 446-9214",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:17:00,6:09:00:17:00,7:09:00:12:00",
			"lat": "42.657223",
			"lng": "-71.312866",
			"distance": "24.23949193870181"
		},
		{
			"name": "Eastern Bank",
			"address": "486 Essex Street",
			"city": "Lawrence",
			"state": "MA",
			"zip": "01840",
			"phone": "(978) 722-0096",
			"hours": "2:09:00:17:00,3:09:00:17:00,4:09:00:17:00,5:09:00:18:00,6:09:00:18:00,7:09:00:13:00",
			"lat": "42.705811",
			"lng": "-71.165443",
			"distance": "24.46855522388476"
		},
		{
			"name": "Eastern Bank",
			"address": "420 Common Street",
			"city": "Lawrence",
			"state": "MA",
			"zip": "01840",
			"phone": "(978) 446-5200",
			"hours": "2:10:00:18:00,3:10:00:18:00,4:10:00:18:00,5:10:00:18:00,6:10:00:16:00",
			"lat": "42.706795",
			"lng": "-71.165054",
			"distance": "24.530502304255755"
		},
		{
			"name": "Eastern Bank",
			"address": "45 Broadway Rd",
			"city": "Dracut",
			"state": "MA",
			"zip": "01826",
			"phone": "(978) 441-0040",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:19:00,6:09:00:18:00,7:09:00:12:00",
			"lat": "42.671322",
			"lng": "-71.295692",
			"distance": "24.62858923550235"
		},
		{
			"name": "Eastern Bank",
			"address": "110 Main Street",
			"city": "Bridgewater",
			"state": "MA",
			"zip": "02324",
			"phone": "(508) 697-8800",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:16:00,6:09:00:18:00,7:09:00:12:00",
			"lat": "41.992432",
			"lng": "-70.978195",
			"distance": "25.7661918951595"
		},
		{
			"name": "Eastern Bank",
			"address": "1932 Ocean Street",
			"city": "Marshfield",
			"state": "MA",
			"zip": "02050",
			"phone": "781-837-0491",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:18:00,6:08:30:18:00,7:08:30:13:00",
			"lat": "42.092087",
			"lng": "-70.706848",
			"distance": "25.859314237545988"
		},
		{
			"name": "Eastern Bank",
			"address": "19 Depot St",
			"city": "Duxbury",
			"state": "MA",
			"zip": "02332",
			"phone": "781-934-0101",
			"hours": "2:08:30:16:00,3:08:30:16:00,4:08:30:16:00,5:08:30:17:00,6:08:30:18:00,7:08:30:13:00",
			"lat": "42.025787",
			"lng": "-70.683968",
			"distance": "30.059277903172944"
		},
		{
			"name": "Eastern Bank",
			"address": "108 Main Street",
			"city": "Kingston",
			"state": "MA",
			"zip": "02364",
			"phone": "781-585-6150",
			"hours": "2:09:00:16:00,3:09:00:16:00,4:09:00:16:00,5:09:00:18:00,6:09:00:18:00,7:08:30:12:00",
			"lat": "41.987362",
			"lng": "-70.712830",
			"distance": "31.289704799184015"
		},
		{
			"name": "Eastern Bank",
			"address": "151 Campanelli Drive",
			"city": "Middleborough",
			"state": "MA",
			"zip": "02346",
			"phone": "(508) 946-3065",
			"hours": "2:08:00:17:00,3:08:00:17:00,4:08:00:17:00,5:08:00:17:00,6:08:00:17:00,7:08:30:12:00",
			"lat": "41.911514",
			"lng": "-70.960770",
			"distance": "31.428629970904474"
		},
		{
			"name": "Eastern Bank",
			"address": "17 Storey Avenue",
			"city": "Newburyport",
			"state": "MA",
			"zip": "01950",
			"phone": "(978) 462-6641",
			"hours": "2:08:30:16:00,3:08:30:16:00,4:08:30:16:00,5:08:30:18:00,6:08:30:18:00,7:09:00:12:00",
			"lat": "42.821301",
			"lng": "-70.906700",
			"distance": "32.771286575397816"
		},
		{
			"name": "Eastern Bank",
			"address": "742 County St",
			"city": "Taunton",
			"state": "MA",
			"zip": "02780",
			"phone": "(508) 884-3447",
			"hours": "2:09:00:15:00,3:09:00:15:00,4:09:00:15:00,5:09:00:16:00,6:09:00:17:00,7:08:30:12:00",
			"lat": "41.882889",
			"lng": "-71.065659",
			"distance": "33.0021443155134"
		},
		{
			"name": "Eastern Bank",
			"address": "71 Carver Rd",
			"city": "Plymouth",
			"state": "MA",
			"zip": "02360",
			"phone": "(508) 747-6060",
			"hours": "2:08:30:16:00,3:08:30:16:00,4:08:30:16:00,5:08:30:17:00,6:08:30:18:00,7:09:00:13:00,1:10:00:15:00",
			"lat": "41.944199",
			"lng": "-70.705864",
			"distance": "33.98124485485701"
		},
		{
			"name": "Eastern Bank",
			"address": "45 Main Street",
			"city": "Lakeville",
			"state": "MA",
			"zip": "02347",
			"phone": "(508) 946-3923",
			"hours": "2:08:00:17:00,3:08:00:17:00,4:08:00:17:00,5:08:00:17:00,6:08:00:18:00,7:08:30:13:00",
			"lat": "41.874538",
			"lng": "-70.926773",
			"distance": "34.255150584262715"
		},
		{
			"name": "Eastern Bank",
			"address": "36 Main Street",
			"city": "Plymouth",
			"state": "MA",
			"zip": "02360",
			"phone": "(508) 746-3301",
			"hours": "2:08:00:16:00,3:08:00:16:00,4:08:00:16:00,5:08:00:17:00,6:08:00:17:00,7:08:30:12:00",
			"lat": "41.956299",
			"lng": "-70.664497",
			"distance": "34.47342330160974"
		},
		{
			"name": "Eastern Bank",
			"address": "11 Trafalgar Square #105",
			"city": "Nashua",
			"state": "NH",
			"zip": "03063",
			"phone": "(603) 546-0012",
			"hours": "2:09:00:17:30,3:09:00:17:30,4:09:00:17:30,5:09:00:17:30,6:09:00:17:30",
			"lat": "42.786701",
			"lng": "-71.507195",
			"distance": "37.246607136554914"
		},
		{
			"name": "Eastern Bank",
			"address": "226 Main Street",
			"city": "Wareham",
			"state": "MA",
			"zip": "02571",
			"phone": "(508) 295-3800",
			"hours": "2:08:00:15:00,3:08:00:15:00,4:08:00:15:00,5:08:00:17:00,6:08:00:18:00,7:08:30:12:00",
			"lat": "41.759220",
			"lng": "-70.716942",
			"distance": "45.10069475373059"
		},
		{
			"name": "Eastern Bank",
			"address": "3003 Cranberry Highway",
			"city": "East Wareham",
			"state": "MA",
			"zip": "02538",
			"phone": "(508) 291-0908",
			"hours": "2:08:30:16:00,3:08:30:16:00,4:08:30:16:00,5:08:30:17:00,6:08:30:18:00,7:08:30:12:00",
			"lat": "41.759842",
			"lng": "-70.666702",
			"distance": "46.12603446673089"
		},
		{
			"name": "Eastern Bank",
			"address": "1 Atwood Lane",
			"city": "Bedford",
			"state": "NH",
			"zip": "03110",
			"phone": "(603) 647-4446",
			"hours": "2:08:00:17:00,3:08:00:17:00,4:08:00:17:00,5:08:00:18:00,6:08:00:17:00",
			"lat": "42.960552",
			"lng": "-71.483505",
			"distance": "46.73708012108964"
		},
		{
			"name": "Eastern Bank",
			"address": "340 Front St",
			"city": "Marion",
			"state": "MA",
			"zip": "02738",
			"phone": "(508) 748-2919",
			"hours": "2:08:00:17:00,3:08:00:17:00,4:08:00:17:00,5:08:00:17:00,6:08:00:18:00,7:08:30:12:00",
			"lat": "41.714756",
			"lng": "-70.769379",
			"distance": "47.02939072266106"
		},
		{
			"name": "Eastern Bank",
			"address": "41 Hooksett Road",
			"city": "Manchester",
			"state": "NH",
			"zip": "03104",
			"phone": "(603) 647-4446",
			"hours": "2:08:00:17:00,3:08:00:17:00,4:08:00:17:00,5:08:00:17:00,6:08:00:17:00",
			"lat": "43.007740",
			"lng": "-71.456871",
			"distance": "49.07666844418056"
		},
		{
			"name": "Eastern Bank",
			"address": "29 County Road",
			"city": "Mattapoisett",
			"state": "MA",
			"zip": "02739",
			"phone": "(508) 758-4936",
			"hours": "2:08:00:15:00,3:08:00:15:00,4:08:00:15:00,5:08:00:16:00,6:08:00:18:00,7:08:30:12:00",
			"lat": "41.663300",
			"lng": "-70.814697",
			"distance": "49.780251278170184"
		},
		{
			"name": "Eastern Bank",
			"address": "65 Massachusetts 6A",
			"city": "Sandwich",
			"state": "MA",
			"zip": "02563",
			"phone": "(508) 888-4444",
			"hours": "2:08:00:16:00,3:08:00:16:00,4:08:00:16:00,5:08:00:17:00,6:08:00:18:00,7:08:30:12:00",
			"lat": "41.765808",
			"lng": "-70.508911",
			"distance": "49.84849558078986"
		},
		{
			"name": "Eastern Bank",
			"address": "163 Deer Street",
			"city": "Portsmouth",
			"state": "NH",
			"zip": "03801",
			"phone": "(603) 433-4747",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:17:00,6:08:30:17:00",
			"lat": "43.078041",
			"lng": "-70.762047",
			"distance": "51.82357673803435"
		},
		{
			"name": "Eastern Bank",
			"address": "337 Cotuit Rd",
			"city": "Sandwich",
			"state": "MA",
			"zip": "02563",
			"phone": "(508) 833-5111",
			"hours": "2:08:30:16:00,3:08:30:16:00,4:08:30:16:00,5:08:30:17:00,6:08:30:18:00,7:08:30:12:00",
			"lat": "41.711338",
			"lng": "-70.491066",
			"distance": "53.49370139597768"
		},
		{
			"name": "Eastern Bank",
			"address": "538 Central Avenue",
			"city": "Dover",
			"state": "NH",
			"zip": "03820",
			"phone": "(603) 742-9494",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:17:00,6:08:30:17:00",
			"lat": "43.199921",
			"lng": "-70.875549",
			"distance": "58.745183447708676"
		},
		{
			"name": "Eastern Bank",
			"address": "1560 Old Post Road",
			"city": "Marstons Mills",
			"state": "MA",
			"zip": "02648",
			"phone": "(508) 428-1300",
			"hours": "2:08:00:16:00,3:08:00:16:00,4:08:00:16:00,5:08:00:17:00,6:08:00:18:00,7:09:00:13:00",
			"lat": "41.648643",
			"lng": "-70.420753",
			"distance": "59.10497105314338"
		},
		{
			"name": "Eastern Bank",
			"address": "6 Shellback Way",
			"city": "Mashpee",
			"state": "MA",
			"zip": "02649",
			"phone": "(508) 477-7984",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:17:00,6:08:30:17:00,7:09:00:14:00,1:11:00:14:00",
			"lat": "41.611107",
			"lng": "-70.491226",
			"distance": "59.42799973530042"
		},
		{
			"name": "Eastern Bank",
			"address": "4 Sandwich Road",
			"city": "Teaticket",
			"state": "MA",
			"zip": "02536",
			"phone": "(508) 540-5002",
			"hours": "2:08:30:16:00,3:08:30:16:00,4:08:30:16:00,5:08:30:17:00,6:08:30:18:00,7:08:30:12:00",
			"lat": "41.568214",
			"lng": "-70.595039",
			"distance": "59.70941412314807"
		},
		{
			"name": "Eastern Bank",
			"address": "117 Main Street",
			"city": "Falmouth",
			"state": "MA",
			"zip": "02540",
			"phone": "(508) 548-3000",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:17:00,6:08:30:17:00,7:08:30:12:00",
			"lat": "41.553654",
			"lng": "-70.619553",
			"distance": "60.150107978128155"
		},
		{
			"name": "Eastern Bank",
			"address": "375 Iyannough Rd",
			"city": "Hyannis",
			"state": "MA",
			"zip": "02601",
			"phone": "(508) 771-4906",
			"hours": "2:08:00:17:00,3:08:00:17:00,4:08:00:17:00,5:08:00:17:00,6:08:00:18:00,7:08:30:13:00",
			"lat": "41.663219",
			"lng": "-70.283051",
			"distance": "62.51719294162776"
		},
		{
			"name": "Eastern Bank",
			"address": "11 South Main Street",
			"city": "Concord",
			"state": "NH",
			"zip": "03301",
			"phone": "(603) 224-1717",
			"hours": "2:08:30:17:00,3:08:30:17:00,4:08:30:17:00,5:08:30:17:00,6:08:30:17:00",
			"lat": "43.203934",
			"lng": "-71.535400",
			"distance": "63.08834730512873"
		}
	];

	function initializeMap() {
		var geocoder = new google.maps.Geocoder(),
			searchButton = $(".icon-search")[0];

		mapInitialized = true;

		map = new google.maps.Map(document.getElementById("map"), {
			draggable: true,
			mapTypeControl: false,
			scaleControl: true,
			scrollwheel: false,
			streetViewControl: false,
			zoomControl: true,
			zoomControlOptions: {
				position: google.maps.ControlPosition.RIGHT_TOP
			}
		});

		// infoWindow = new google.maps.InfoWindow();
		service = new google.maps.places.PlacesService(map);
		branchSearch();
	}

	function branchSearch(type, lat, lng) {
		var geocoder = new google.maps.Geocoder(),
			zipCode = $(".search-zip")[0].value;

		$(".search-results ol").empty().show();

		for (var i = 0; i < branches.length; i++ ) {
			branches[i].setMap(null);
		}

		branches.length = 0;


		if(type === "geo") {
			console.log("1");
	    var latlng = new google.maps.LatLng(lat, lng);

			geocoder.geocode({location: latlng}, function(results, status) {
				if(status == google.maps.GeocoderStatus.OK) {
					if (results[1]) {
						zipCode = results[1]["address_components"][7]["short_name"];
						geocoder.geocode({address: zipCode}, function(results, status) {
							if(status == google.maps.GeocoderStatus.OK) {
								radius = 5;
								branchSearchNear(results[0].geometry.location, type);
							}
						});
					}
				}
			});
		}else {
			console.log("2");
			if(type === "search") {
				radius = 5;
			} else {
				radius = 1000;
				zipCode = "02203";
			}
			geocoder.geocode({address: zipCode}, function(results, status) {
				if(status == google.maps.GeocoderStatus.OK) {
					branchSearchNear(results[0].geometry.location, type);
				}
			});
		}
	}

	locationFilteredResults = [];

	function branchSearchNear(center, type) {
		var address,
			amPm,
			bounds = new google.maps.LatLngBounds(),
			day,
			dayPrefixed,
			daysHours,
			distance,
			firstCharacter,
			hours,
			hoursClose,
			hoursCloseFull,
			hoursOpen,
			hoursOpenFull,
			ii = 0,
			lat,
			lng,
			location,
			locationResults = [],
			name,
			numItems,
			phone,
			resultRangeCounter = 0,
			userLat = center.lat(),
			userLng = center.lng();



		clearBranches();

		for(var i = 0; i < branchList.length; i++) {
			lat = branchList[i].lat;
			lng = branchList[i].lng;

			distance = GeoCodeCalc.CalcDistance(userLat, userLng, lat, lng, 3956);

			name = branchList[i].name;
			address = branchList[i].address + " <br> " + branchList[i].city + " " + branchList[i].state + " " + branchList[i].zip;
			phone = branchList[i].phone;



			// TODO: make this consitent with sidebar see 			$(".search-results ol").append('<li class="search-result-item"><p>'



			daysHours = branchList[i].hours.split(",");
			hours = "";
			numItems = daysHours.length;

			for (ii = 0; ii < numItems; ii++) {
				firstCharacter = daysHours[ii][0];
				day = daysHours[ii].substring(0, 2);
				switch (firstCharacter) {
					case "1":
						dayPrefixed = "Sunday";
						break;
					case "2":
						dayPrefixed = "Monday";
						break;
					case "3":
						dayPrefixed = "Tuesday";
						break;
					case "4":
						dayPrefixed = "Wednesday";
						break;
					case "5":
						dayPrefixed = "Thursday";
						break;
					case "6":
						dayPrefixed = "Friday";
						break;
					case "7":
						dayPrefixed = "Saturday";
						break;
					default:
						break;
				}

				hoursOpenFull = daysHours[ii].substring(2, 7);
		    amPm = (hoursOpenFull.substring(0, 2)).substring() > 11 ? 'PM' : 'AM';
				hoursOpen = parseInt(hoursOpenFull);
				hoursOpen = ((hoursOpen + 11) % 12 + 1).toString();
				hoursOpen = hoursOpen + ":" + hoursOpenFull.substring(hoursOpenFull.length - 2) + " " + amPm;

				hoursCloseFull = daysHours[ii].substring(daysHours[ii].length - 5);
		    amPm = (hoursCloseFull.substring(0, 2)).substring() > 11 ? 'PM' : 'AM';
				hoursClose = parseInt(hoursCloseFull);
				hoursClose = ((hoursClose + 11) % 12 + 1).toString();
				hoursClose = hoursClose + ":" + hoursCloseFull.substring(hoursCloseFull.length - 2) + " " + amPm;

				hours += '<span class="branch-hours-day">' + dayPrefixed +  "</span> " + hoursOpen +  " - " + hoursClose + '<br>';
			}

			locationResults[i] = new Array (distance, name, lat, lng, address, phone, hours);
		}


		if(locationResults[0][0] > radius) {
			alert("Sorry, no branches in this area.");

			console.warn("TODO");

			// branchSearch();

			return false;
		}



		// // Sort the multi-dimensional array numerically.
		// locationResults.sort(function(a, b) {
		// 	var x = a[0];
		// 	var y = b[0];
		// });



		for (var j = 0; j <= locationResults.length - 1; j++) {
			location = new google.maps.LatLng(parseFloat(locationResults[j][2]), parseFloat(locationResults[j][3]));


			// console.log("creating marker", j);


			if(locationResults[j][0] <= 5.9999 && type === "search") {
				bounds.extend(location);
				resultRangeCounter++;
				createMarker(location, locationResults[j][1], locationResults[j][4], locationResults[j][5], locationResults[j][6]);
				console.log("123");
				locationFilteredResults.push(location, locationResults[j][1], locationResults[j][4], locationResults[j][5], locationResults[j][6]);

			// $(".search-results ol").append('<li class="search-result-item"><p>'
			//  + locationResults[j][1] + '<br>'
			//  + locationResults[j][4] + '<br><span class="hidden"><a href="tel://1-' + locationResults[j][5] + '">'
			//  + locationResults[j][5] + '</a><br><br>'
			//  + locationResults[j][6] + '</span></p></li>');

			// console.log("aa", locationResults[j][0]);

			}
			else if(locationResults[j][0] <= 5.9999 && type === "geo") {
				bounds.extend(location);
				createMarker(location, locationResults[j][1], locationResults[j][4], locationResults[j][5], locationResults[j][6]);
			}
			else if(type !== "search") {
				bounds.extend(location);
				createMarker(location, locationResults[j][1], locationResults[j][4], locationResults[j][5], locationResults[j][6]);
			}


		}


		console.log("locationR", locationFilteredResults.length);

		map.fitBounds(bounds);

		map.panBy(120, 0);

		// if(type === "search" && resultRangeCounter > 10) {
		// 	setTimeout(function() {
		// 		// map.setZoom(map.getZoom() + 1);

		// 	console.warn("noooo");
		// 		map.panBy(120, 0);

		// 		// map.fitBounds(bounds);

		// 	}, 50);
		// }
		// if(type === "search" && resultRangeCounter == 1) {
		// 	console.warn("hi");
		// 	setTimeout(function() {
		// 		// map.setZoom(map.getZoom() - 5);
		// 		map.fitBounds(bounds);

		// 	}, 50);
		// }

		// if(type === "geo") {

		// }

		// if(type == "geo") {
		// 	console.log("conyo");
		// }


	}

	function clearBranches() {
		 for (var i = 0; i < branches.length; i++) {
       branches[i].setMap(null);
     }
     branches.length = 0;
	}

	function createMarker(location, name, address, phone, hours) {
		var marker = new google.maps.Marker({
			icon: {
				url: "assets/images/location-marker.png",
			},
			map: map,
			position: location
		});

		google.maps.event.addListener(marker, "click", function() {
			$(".search-results ol").hide();
			$(".search-result-item-detail").show();
			$(".search-result-item-detail").find("p:first-child").html(name + "<br>" + address + "<br>" + phone + "<br><br>" + hours);
		});

		branches.push(marker);
	}

	GeoCodeCalc.ToRadian = function(v) {
		return v * (Math.PI / 180);
	};

	GeoCodeCalc.DiffRadian = function(v1, v2) {
		return GeoCodeCalc.ToRadian(v2) - GeoCodeCalc.ToRadian(v1);
	};

	GeoCodeCalc.CalcDistance = function(lat1, lng1, lat2, lng2, radius) {
		return radius * 2 * Math.asin( Math.min(1, Math.sqrt( ( Math.pow(Math.sin((GeoCodeCalc.DiffRadian(lat1, lat2)) / 2.0), 2.0) + Math.cos(GeoCodeCalc.ToRadian(lat1)) * Math.cos(GeoCodeCalc.ToRadian(lat2)) * Math.pow(Math.sin((GeoCodeCalc.DiffRadian(lng1, lng2)) / 2.0), 2.0) ) ) ) );
	};


	$(".locate-branch").click();
	// $(".search-zip").val("02138");
	// setTimeout(function(){
	// 	$(".icon-search").click();
	// }, 250);
});
