AUI.add("aui-progressbar",function(O){var I=O.Lang,r=I.isNumber,M=I.isString,P="",U=".",B=" ",Z="auto",m="boundingBox",Q="complete",W="contentBox",b="height",N="horizontal",o="label",i="lineHeight",p="max",S="min",K="orientation",X="progress-bar",s="px",h="ratio",J="status",q="statusNode",t="step",l="text",c="textNode",j="value",R="vertical",D="width",g=function(A){return parseFloat(A)||0;},E=O.ClassNameManager.getClassName,Y=E(X,N),G=E(X,J),F=E(X,l),V=E(X,R),n='<div class="'+G+'"></div>',k='<div class="'+F+'"></div>',e=O.Widget.prototype,H=[o,K,j],d=e._BIND_UI_ATTRS,C=e._SYNC_UI_ATTRS,T=d.concat(H),f=C.concat(H);function a(A){a.superclass.constructor.apply(this,arguments);}O.mix(a,{NAME:X,ATTRS:{height:{value:25},label:{value:P},max:{validator:r,value:100},min:{validator:r,value:0},orientation:{value:N,validator:function(A){return M(A)&&(A===N||A===R);}},ratio:{getter:"_getRatio",readOnly:true},step:{getter:"_getStep",readOnly:true},statusNode:{valueFn:function(){return O.Node.create(n);}},textNode:{valueFn:function(){return O.Node.create(k);}},value:{setter:g,validator:function(A){return r(g(A))&&((A>=this.get(S))&&(A<=this.get(p)));},value:0},width:{value:250}},HTML_PARSER:{label:function(A){var L=A.one(U+F);if(L){return L.html();}},statusNode:U+G,textNode:U+F}});O.extend(a,O.Widget,{_BIND_UI_ATTRS:T,_SYNC_UI_ATTRS:f,renderUI:function(){var A=this;A._renderStatusNode();A._renderTextNode();},bindUI:function(){var A=this;A.after("valueChange",O.bind(A._afterValueChange,A));},_afterValueChange:function(u){var A=this;var L=A.get(t);if(L>=100){A.fire(Q,{progressbar:{ratio:A.get(h),step:L,value:A.get(j)}});}},_getContentBoxSize:function(){var A=this;var L=A.get(W);return g(L.getStyle((this.get(K)===N)?D:b));},_getPixelStep:function(){var A=this;return A._getContentBoxSize()*A.get(h);},_getRatio:function(){var A=this;var L=A.get(S);var u=(A.get(j)-L)/(A.get(p)-L);return Math.max(u,0);},_getStep:function(){return this.get(h)*100;},_renderStatusNode:function(){var A=this;A.get(W).append(A.get(q));},_renderTextNode:function(){var A=this;A.get(W).append(A.get(c));},_uiSetLabel:function(A){this.get(c).html(A);},_uiSetOrientation:function(v){var A=this;var u=A.get(m);var L=(v===N);u.toggleClass(Y,L);u.toggleClass(V,!L);A._uiSizeTextNode();},_uiSetValue:function(w){var A=this;var u=A.get(q);var L=A._getPixelStep();var v={};if(A.get(K)===N){v={height:"100%",top:Z,width:L+s};}else{v={height:L+s,top:g(A._getContentBoxSize()-L)+s,width:"100%"};}u.setStyles(v);},_uiSizeTextNode:function(){var A=this;var L=A.get(W);var u=A.get(c);u.setStyle(i,L.getStyle(b));}});O.ProgressBar=a;},"@VERSION@",{requires:["aui-base"],skinnable:true});