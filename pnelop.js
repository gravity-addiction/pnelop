var PNelOP=(function(u){version="1.2";var y={};var K={},C={};widgetCache={};var r=0;var b=false;var h=15000,k=100,G=3;var m=[],L=[],l=[],g=[];var e=new Date().getTime();loadContainer="<div class='pageContainer'></div>";layoutMain="<div class='mainPage'><div class='rightColumn'></div><div class='leftColumn'></div><div class='mainColumn'></div></div>";isMobile=function(){if(/android|iphone|ipad|blackberry|kindle|skyfire|teashark|jsme|blazer|bolt|fennec|gobrowser|iemobile|iris|maemo|minimo|netfront|series 60|teleca|uzard/.test(navigator.userAgent.toLowerCase())){return true}else{return false}};setup=function(){u.ajaxSetup({async:"true",cache:"true",contentType:"application/x-www-form-urlencoded",timeout:"8000",type:"GET",dataType:"json",beforeSend:function(M){u.xhrPool.push(M)},error:function(M,O,N){if(O=="error"||O=="timeout"||O=="parseerror"){_bootDebug("Ajax "+O+": "+N)}},complete:function(M,O){var N=u.inArray(M,u.xhrPool);if(N>-1){u.xhrPool.splice(N,1)}}});u.xhrPool=[];u.xhrPool.abortAll=function(){var N=u.xhrPool.length;for(i=0;i<N;i++){try{if(!!u.xhrPool[i]){u.xhrPool[i].abort()}}catch(M){_bootDebug("Abort Err: "+M)}}u.xhrPool.splice(0,N)};u.funQue={_timer:null,_queue:[],add:function(P,N,Q){var M=function(R){u.funQue._timer=setTimeout(function(){R=u.funQue.add();if(u.funQue._queue.length){M(R)}},R||2)};if(P){u.funQue._queue.push([P,N,Q]);if(u.funQue._queue.length==1){M(Q)}return}var O=u.funQue._queue.shift();if(!O){return 0}O[0].call(O[1]||window);return O[2]},clear:function(){clearTimeout(u.funQue._timer);u.funQue._queue=[]}};I._init()};bootModule=function(){var M,N,O=false;if(arguments.length>0&&(typeof arguments[0])=="string"){M=arguments[0]}else{return}if(arguments.length>1&&((typeof arguments[1])=="function"||(typeof arguments[1])=="object")){N=arguments[1]}else{return}if(arguments.length>1&&(typeof arguments[2])=="boolean"){O=arguments[2]}if((typeof K[M])=="object"&&(typeof K[M].protect)=="boolean"&&!!K[M].protect){O=false}if((!!O||(typeof K[M])=="undefined")&&(typeof N)=="object"){K[M]=N}return M};bootLink=function(){var N,O,P,M;if(arguments.length>0&&(typeof arguments[0])=="string"){N=arguments[0]}else{return}if(arguments.length>1&&(typeof arguments[1])=="function"){O=arguments[1]}else{return}if(arguments.length>2&&(typeof arguments[2])=="function"){P=arguments[2]}M=Math.random().toString(36).substring(7);y[M]={link:N,action:O,clean:P};return M};nukeLink=function(){var M;if(arguments.length>0&&(typeof arguments[0])=="string"){M=arguments[0]}else{return}if(!!y[M]&&(typeof y[M])=="object"){delete y[M]}return};bootScript=function(){var P;var M;var N;var O;if(arguments.length>0){P=arguments[0]}else{return}x.apply(this,arguments);return};bootCSS=function(){var M;if(arguments.length>0){M=arguments[0]}else{return}E.apply(this,arguments);return};nukeCSS=function(){var M;if(arguments.length>0){M=arguments[0]}else{return}var N=document.styleSheets.length;for(ls=0;ls<N;ls++){if(document.styleSheets[ls].href==M){B(g,M,1);if(g.indexOf(M)==-1){document.styleSheets[ls].disabled="disabled"}}}};bootState=function(){var M,P=document.createElement("a"),N,O=document.createElement("a");if(arguments.length>0&&(typeof arguments[0])=="string"){M=arguments[0]}else{return}if(arguments.length>1&&(typeof arguments[1])=="string"){N=arguments[1]}if(!!M){P.href=M}if(!!N){O.href=N}_bootDebug("Boot State","Cur:",P.search+P.hash,"Prev:",O.search+O.hash);u.each(y,function(R,Q){if(!!N&&!!M&&((O.href+O.search).indexOf(Q.link)>-1||(O.href+O.hash).indexOf(Q.link)>-1)&&(typeof Q.clean)=="function"){_bootDebug("Cleaning: ",Q.link);Q.clean()}});u.each(C,function(R,Q){if(!!Q.placeMarker&&Q.placeMarker.length&&Q.placeMarker.prop("tagName").toLowerCase()!="body"){Q.placeMarker.css("display","none").addClass("delContainer")}});u.each(y,function(R,Q){if(((P.href+P.search).indexOf(Q.link)>-1||(P.href+P.hash).indexOf(Q.link)>-1)&&(typeof Q.action)=="function"){_bootDebug("Loading: "+Q.link);if(!!Q.placeMarker&&Q.placeMarker.length&&Q.placeMarker.prop("tagName").toLowerCase()!="body"){Q.placeMarker.css("display","").removeClass("delContainer")}u.funQue.add(function(){Q.action()},this)}});u(".delContainer").html("").removeClass("delContainer")};bootLayout=function(){var Q,O=u("body");if(arguments.length>0){Q=arguments[0]}else{return}if(arguments.length>1){O=arguments[1]}else{if(!!Q.placeMarker){O=Q.placeMarker}}if((typeof O)=="string"&&u(O).length){O=u(O)}if((typeof O)!="object"||!u(O).length){O=u("body")}_bootDebug("New Layout Init");H(Q);var P=document.styleSheets.length;for(var N in Q){var M=Q[N];if((typeof M)!="object"){continue}if((typeof M.loaded)!="number"){M.loaded=0}if((typeof M.loadLoops)!="number"){M.loadLoops=0}if((typeof M.widgets)!="object"){M.widgets={}}if((typeof M.js)!="object"){M.js=[]}if((typeof M.css)!="object"){M.css=[]}if(M.pageLayout!=""){if((typeof M.pageLayout)!="string"){M.pageLayout="single"}if((typeof M.pageWidths)!="string"){M.pageWidths="*"}M._layoutMarker=w(M.pageLayout,M.pageWidths);if((typeof M.ident)=="string"){u(M._layoutMarker).find(".mainPage").attr("id",M.ident)}O.append(M._layoutMarker)}M.loadLoops=0;M.loadStart=e;A(M)}n(M)};bootWidgets=function(){var M;if(arguments.length>0){M=arguments[0]}else{return false}var P=0;var O=0;var Q=Object.keys(M).length;while(Q>O&&P<25){for(var R in M){var N=M[R];if((typeof N)!="object"){continue}if((typeof N.process)!="number"){N.process=24}if(N.process!=0&&P!=N.process){continue}bootWidget(N,((typeof N.ident)=="string"&&N.ident!=""?N.ident:R));O++}P++}};bootWidget=function(){var N,P=u("body"),O=u("body");var M={ident:"",process:0,loaded:0,loadLoops:0,js:[],css:[],placeMarker:u("body")};if(arguments.length>0){N=arguments[0]}else{return}if(arguments.length>1&&(typeof arguments[1])=="string"){N.ident=arguments[1]}else{if((typeof N.ident)!="string"){return}}if(arguments.length>2){P=arguments[2]}else{if(!!N.placeMarker){P=N.placeMarker}}if((typeof P)=="string"&&u(P).length){P=u(P)}if((typeof N.process)!="number"){N.process=0}if((typeof N.loaded)!="number"){N.loaded=0}if((typeof N.loadLoops)!="number"){N.loadLoops=0}if((typeof N.js)!="object"){N.js=[]}if((typeof N.css)!="object"){N.css=[]}u.extend(M,N);if((typeof C[M.ident])=="object"&&!!C[M.ident].placeMarker&&u(C[M.ident].placeMarker).length){P=u(C[M.ident].placeMarker)}if((typeof P)=="object"||u(P).length){O=P}else{if((typeof P)!="object"||!u(P).length){O=u(loadContainer);if((typeof M.ident)=="string"&&M.ident!=""){u(O).attr("id",M.ident)}u("body").append(O)}else{if((typeof P)=="object"&&P.prop("tagName").toLowerCase()=="body"){O=u(loadContainer).appendTo(P);if((typeof M.ident)=="string"&&M.ident!=""){u(O).attr("id",M.ident)}}}}M.placeMarker=O;M.loadLoops=0;M.loadStart=e;if((typeof M.loadTimeout)=="undefined"||(typeof M.loadTimeout)!="number"){M.loadTimeout=h}C[M.ident]=M;widgetCache[M.ident]=N;_bootDebug("Load Widget Scripts: "+M.ident);_bootDebug(M);if((typeof M.onStart)=="function"){M.onStart(M,u(O))}if(!!u(O)&&u(O).length){u(O).css("display","").removeClass("delContainer")}A(M);c(M)};fetchWidget=function(){if(arguments.length>0&&(typeof K[arguments[0]])=="object"){return K[arguments[0]]}else{return false}};nukeWidget=function(){var P;var N,M;if(arguments.length>0&&(typeof C[arguments[0]])=="object"){P=C[arguments[0]]}else{return false}var O=P.css.length;for(M=0;M<O;M++){nukeCSS(P.css[M])}if(arguments.length>2&&arguments[2]==true){for(N=0;N<L.length;N++){for(M=0;M<P.js.length;M++){if(L[N]==P.js[M]){B(L,P.js[M])}}}}if(arguments.length>1&&arguments[1]==false&&!!u(P.placeMarker).length&&P.placeMarker.prop("tagName").toLowerCase()!="body"){u(P.placeMarker).empty()}else{if(!!u(P.placeMarker).length&&P.placeMarker.prop("tagName").toLowerCase()!="body"){u(P.placeMarker).html("");delete P.placeMarker}}if(arguments.length>2&&arguments[2]==true){delete K[P.module];delete C[arguments[0]]}_bootDebug("Nuking",P);_bootDebug(C);_bootDebug(g);_bootDebug(L)};loadLinks=function(){I._loadPushLinks.apply(this,arguments)};fetchPage=function(){I._fetchPage.apply(this,arguments)};pushURL=function(){I._pushURL.apply(this,arguments)};var n=function(){var M;if(arguments.length>0){M=arguments[0]}else{return false}if(p(M)){alert("Some Layout Script Components Failed to Load")}else{if(!a(M)){_bootDebug("Need Layout Scripts Loop");_bootDebug(m);M.loadLoops+=1;var O=k;for(var N=0;N<M.loadLoops;N++){O*=2}if(O<=h){setTimeout(function(){n(M)},O)}else{_bootDebug("Failed To Load Page Scripts")}}else{M.loaded=1;u.funQue.add(function(){bootWidgets(M.widgets)},this)}}};var c=function(){var O,M=0;if(arguments.length>0&&(typeof arguments[0])=="object"){O=arguments[0]}else{return false}if(p(O)){alert("Some Widget Script Components Failed to Load")}else{if(!a(O)){_bootDebug("Need Widget Scripts Loop: "+O.loadLoops);O.loadLoops+=1;var P=k;for(var N=0;N<O.loadLoops;N++){P*=2;M+=P}if(M<=O.loadTimeout){setTimeout(function(){c(O)},P)}else{_bootDebug("Failed To Load Widget Scripts For "+O.ident)}}else{O.loaded=1;u.funQue.add(function(){d(O)},this)}}};var d=function(){var M,P=u("body"),O,N;if(arguments.length>0&&(typeof arguments[0])=="object"){M=arguments[0]}else{return false}if((typeof M.placeMarker)=="object"&&M.placeMarker.length){P=M.placeMarker}else{if((typeof M.placeMarker)=="string"&&u("body").find(M.placeMarker).length){P=u("body").find(M.placeMarker)}}if(!u(P).length||(typeof P)!="object"){P=u("body")}if((typeof M.ident)=="string"){O=M.ident}if((typeof O)!="string"){O=""}_bootDebug("Boot Widget: "+O+" in Container: ");_bootDebug(P);if((typeof M.onReady)=="function"){M.onReady(M,u(P))}if((typeof K[M.module])=="object"){N=K[M.module]}if(!!N&&(typeof N.processObject)=="function"){N.processObject(M,u(P))}if(!!N&&(typeof N._init)=="function"){N._init(M,u(P))}if((typeof loadLinks)=="function"){loadLinks()}if((typeof M.onComplete)=="function"){M.onComplete(M,u(P))}M.loaded=2;return};var p=function(){var M;if(arguments.length>0&&(typeof arguments[0])=="object"){M=arguments[0]}else{return false}if((typeof M.js)=="object"&&!!M.js&&M.js.length){for(var N in M.js){if(l.indexOf(M.js[N])>-1){return true}}}return false};var a=function(){var N;if(arguments.length>0&&(typeof arguments[0])=="object"){N=arguments[0]}else{return false}if((typeof N.js)=="object"){if(!!N.js&&N.js.length){for(var O in N.js){if(L==null){return false}if(L.indexOf(N.js[O])>-1&&m.indexOf(N.js[O])==-1){continue}else{return false}}}}if((typeof N.css)=="object"){if(!!N.css&&N.css.length){for(var M in N.css){if(g==null){return false}if(g.indexOf(N.css[M])>-1&&m.indexOf(N.css[M])==-1){continue}else{return false}}}}return true};var A=function(){var N;if(arguments.length>0&&(typeof arguments[0])=="object"){N=arguments[0]}else{return}if(!!N.css&&N.css.length){for(var M in N.css){_bootDebug("Loading Stylesheet: "+N.css[M]);E(N.css[M])}}_bootDebug("Loading Packet: ");_bootDebug(N);_bootDebug("Loading JS: ");_bootDebug(N.js);if(!!N.js){u.each(u(N.js),function(O,P){_bootDebug("Loading File: "+P);x(P)})}};var E=function(){var Q=document.styleSheets.length,P=[],M=0,N="",O=0;if(arguments.length>0){N=arguments[0]}else{return}g.push(N);for(M=0;M<Q;M++){if(document.styleSheets[M].href==null){continue}if(document.styleSheets[M].href.indexOf(N)>-1){O=1;_bootDebug("Cached Stylesheet: "+N);document.styleSheets[M].disabled="";break}}if(O==0){m.push(N);_bootDebug("Fetching Stylesheet: "+N);u("head").append(u('<link rel="stylesheet" type="text/css" href="'+N+'" />').ready(function(){_bootDebug("Stylesheet Loaded: "+N);H(this);B(m,N)}))}};var x=function(){var Q;var M;var O;var P;if(arguments.length>0){Q=arguments[0]}else{return}if(arguments.length>1){M=arguments[1]}else{M=null}if(arguments.length>2){P=arguments[2]}else{P=h}if(arguments.length>3){O=arguments[3]}_bootDebug("Is Script: "+Q+" Loaded? "+u.inArray(Q,L));if(u.inArray(Q,L)==-1){_bootDebug("Requesting JS: "+Q);m.push(Q);if(Q.substr(0,7)!="http://"&&Q.substr(0,8)!="https://"){O=1}if(O==1){var N=document.createElement("script");N.type="text/javascript";N.src=Q;N.text="";if(document.all){N.onreadystatechange=function(){if(N.readyState=="complete"){N.onreadystatechange="";j(Q,M)}else{if(N.readyState=="loaded"){N.onreadystatechange="";j(Q,M)}else{if(N.readyState=="error"){N.onreadystatechange="";f(Q)}else{_bootDebug(N.readyState)}}}}}else{N.onload=function(){j(Q,M)};N.onerror=function(){f(Q)}}document.body.appendChild(N)}else{u.ajax({type:"GET",url:Q,dataType:"script",timeout:P,success:function(S,T,R){j(this.url,M)},error:function(R,T,S){f(this.url,M,P)}})}}else{_bootDebug("Already Loaded: "+Q);j(Q,M)}L.push(Q)};var j=function(){var N;var M;if(arguments.length>0){N=arguments[0]}else{return}if(arguments.length>1&&!!F(arguments[1])){M=arguments[1]}_bootDebug("Loaded JS: "+N);if(!!F(M)){M()}_bootDebug("Cleaning JS: "+N);B(m,N);B(l,N)};var f=function(){var O;if(arguments.length>0){O=arguments[0]}else{return}_bootDebug("Failed Loading JS: "+O);if(r>0){alert("Failed Loading Javascript: "+O)}l.push(O);var N=0;for(var M=0;M<l.length;M++){if(l[M]==O){N+=1}}B(m,O);B(L,O);if(N<G){x.apply(this,arguments)}};var B=function(){var P,N,O=-1,M=0;if(arguments.length>0&&(typeof arguments[0])=="object"){P=arguments[0]}else{return}if(arguments.length>1&&(typeof arguments[1])=="string"){N=arguments[1]}else{return}if(arguments.length>2&&(typeof arguments[2])=="number"){O=arguments[2]}while((typeof P)=="object"&&P.length>0&&P.indexOf(N)!==-1){P.splice(P.indexOf(N),1);M+=1;if(O>0&&O>=M){return}}};var z="",s="",v=Boolean(window.history&&window.history.pushState&&window.history.replaceState&&!((/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i).test(navigator.userAgent)||(/AppleWebKit\/5([0-2]|3[0-2])/i).test(navigator.userAgent))),q=false;var I={_init:function(){_bootDebug("HTML5 History Enabled: ",v);try{if(v){b=true}else{b=false}}catch(M){u(document).ready(function(){b=false})}window.onpopstate=function(){_bootDebug("Pop State Change: ",location.href,I._historyCurURL);if(!I._forceFetchPage&&location.href==I._historyCurURL){_bootDebug("Identical Pop State. History Cannot Help You");return false}fetchPage(location.href);q=false};window.onhashchange=function(){_bootDebug("Hash Change: HTML5 User?",b);if(!b){u(window).trigger("popstate")}};if(!b){u.funQue.add(function(){u(window).trigger("popstate")},this)}},_addLink:function(M){if(v){history.pushState(null,null,M)}else{window.location=M}},_loadPushLinks:function(){if(!v){if(b){b=false}return false}var M=u(".pushLink");if(arguments.length>0&&(typeof arguments[0])=="string"&&!!u(arguments[0]).length){M=u(arguments[0])}if(arguments.length>0&&(typeof arguments[0])=="object"){M=arguments[0]}u(function(){M.unbind("click").bind("click",function(O){if(O.which==2||O.metaKey){return true}var P=u(this),N=P.attr("href");pushURL(N);O.preventDefault();return false})})},_pushURL:function(M){if(!v){location.href=M;return false}history.replaceState(null,null,M);if(location.href!=s){history.replaceState(null,null,s);history.pushState(null,null,M)}q=true;u(window).trigger("popstate")},_fetchPage:function(){var O=location.href;var N=s;var M={};u.xhrPool.abortAll();m=[];l=[];if(arguments.length>0){O=arguments[0]}if(arguments.length>1){N=arguments[1]}z=N;s=O;u.funQue.add(function(){$P.bootState(O,N)},this)}};var D=function(){var M=document.title;if(arguments.length>0){M=arguments[0]}else{return}if(!!bootLayout.pageTitle){document.title=M}};var w=function(){var O="none",M="";if(arguments.length>0&&arguments[0]!=undefined){O=arguments[0]}if(arguments.length>1&&arguments[1]!=undefined){M=arguments[1]}var Q=u(layoutMain).clone();var N,P;if(O=="single"||O=="single_left"){Q.find(".rightColumn").remove()}if(O=="single"||O=="single_right"){Q.find(".leftColumn").remove()}if(!!M){if(M.indexOf(",")!=-1){N=M.split(",")}else{N=new Array(M)}P=Q.children("div").length;for(_layoutI=0;_layoutI<P;_layoutI++){if(!!N[_layoutI]&&N[_layoutI]!="*"){Q.children("div").eq(_layoutI).css("width",N[_layoutI])}}}return Q};var o=function(){var M;if(arguments.length>1){i=arguments[0];io=arguments[1]}else{return}if(M.modals&&M.modals.length){for(i in M.modals){for(obm in K){if(K[obm].processModal){K[obm].processModal(M.modals[i])}}}if(grabModals.length){grabModals=[]}}};var J=function(N){var M;if(arguments.length>0){N=arguments[0]}else{return}for(i in N){u("#modalWindows").append(N[i]["data"])}};_bootDebug=function(){if(!r){return}var M="";if(arguments.length>0){M=arguments[0]}try{console.log(M)}catch(N){}};var H=function(){if(!r||r<2){return}var M="";if(arguments.length>0){M=arguments[0]}try{console.log(M)}catch(N){}};var t=function(){var N="",M="";if(arguments.length>0){N=arguments[0]}if(arguments.length>1){M=arguments[1]}try{console.log("BOOT ERROR");if(!!N){console.log(N)}if(!!M){console.log(M.message)}}catch(O){}};var F=function(M){var N={};return M&&N.toString.call(M)==="[object Function]"};return parent}(jQuery));var $P=PNelOP;$P.setup();