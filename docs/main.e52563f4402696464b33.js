webpackJsonp([0],[,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={BRANCH:1,TRUNK:2,HERITANCE:3,branch:{noise:{force:1.5,speed:.15},l:{min:.1,max:1.5,wRat:{min:10,max:15}},w:{min:.05,max:.5,transfer:{min:.5,max:.7}},transition:{w:.3},prob:{behaviourSeparation:{division:0,ramification:1},countChild:[0,0,2,2,0,0]}},trunk:{l:2.5,w:.5,transition:{w:.3},noise:{force:.15,speed:.3},prob:{behaviourSeparation:{division:.2,ramification:1},countChild:[0,0,0,7,0,0]}},compute:{precision:.01,dist:.1,pointW:1.5},animation:{noise:{speed:.001,force:.1},hurricane:{radius:2,turns:5},durationLeave:500}}},function(e,t,n){"use strict";(function(e){function i(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),r=n(1),s=i(r),u=n(13),c=i(u),d=n(4),l=(i(d),n(14)),h=i(l),f=function(){function t(e){o(this,t),this.type=void 0!==e.type?e.type:s.default.BRANCH,this.inheritance=!!e.inheritance,this.parent=e.parent?e.parent:null,this.noise=void 0!==e.noise?e.noise:this.parent.noise,this.length=null,this.weight=null,this.ramifications=[],this.init()}return a(t,[{key:"init",value:function(){this.noiseCoord=new e.Vector2(Math.random(),Math.random());var t=c.default.between(s.default.branch.w.transfer.min,s.default.branch.w.transfer.max);this.weight=t*this.parent.weight;var n=c.default.between(s.default.branch.l.wRat.min,s.default.branch.l.wRat.max);this.length=Math.min(this.weight*n,s.default.branch.l.max),this.refreshBoundaries(),this.canHaveChild&&this.genRamification()}},{key:"getCoordsAtLength",value:function(t){var n=this.config,i=n.noise.force*t*this.noise.simplex2(n.noise.speed*t+this.noiseCoord.x,this.noiseCoord.y),o=n.noise.force*t*this.noise.simplex2(this.noiseCoord.x,this.noiseCoord.x+n.noise.speed*t),a=(new e.Vector3).copy(this.baseCoord);return a.x+=i,a.y+=t,a.z+=o,a}},{key:"refreshBoundaries",value:function(){this.baseCoord=null==this.parent?new e.Vector3:this.parent.topCoord,this.topCoord=this.getCoordsAtLength(this.length)}},{key:"update",value:function(){this.refreshBoundaries();for(var e=0;e<this.ramifications.length;e++)this.ramifications[e].update()}},{key:"genRamification",value:function(){for(var e=c.default.random(this.config.prob.countChild),n=c.default.random(this.config.prob.behaviourSeparation),i="ramification"==n,o=0;o<e;o++)this.ramifications.push(new t({inheritance:i,parent:this})),i=!1}},{key:"genCircles",value:function(t,n){var i,o,a,r,u,c,d=[];t.unshift(this.baseCoord);for(var l=1;l<t.length;l++){u=1-Math.min(1,l*n/this.length/this.config.transition.w),c=this.parent?this.parent.weight-this.weight:.8*this.weight,r=u*c+this.weight,o=Math.floor(2*Math.PI*r/s.default.compute.dist),a=Math.random()*(2*Math.PI/6),i=(new e.Vector3).copy(t[l]).sub(t[l-1]);h.default.genCircle(o,a,r).map(function(e){e=h.default.rotateLooking(e,i),e.add(t[l]),d.push(e)})}return d}},{key:"compute",value:function(e){for(var t=[],n=Math.floor(this.length/e),i=0;i<n;i++)t.push(this.getCoordsAtLength(i*e));t=this.genCircles(t,e);for(var i=0;i<this.ramifications.length;i++)t=t.concat(this.ramifications[i].compute(e));return t}},{key:"config",get:function(){return this.type==s.default.TRUNK?s.default.trunk:s.default.branch}},{key:"canHaveChild",get:function(){return this.weight>s.default.branch.w.min}}]),t}();t.default=f}).call(t,n(0))},function(e,t,n){"use strict";(function(e){function i(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),r=n(1),s=i(r),u=n(18),c=n(2),d=(i(c),n(12)),l=i(d),h=n(20),f=i(h),m=n(21),p=i(m),b=n(11),v=i(b),y=function(){function t(){o(this,t),this.config=s.default,this.noise=new u.Noise,this.new(),this.initMesh()}return a(t,null,[{key:"CONFIG",get:function(){return s.default}}]),a(t,[{key:"new",value:function(){this.tree=new l.default({noise:this.noise}),this.newGeometry()}},{key:"newGeometry",value:function(){this.tree.update(),this.geometry=new v.default(this,{animate:!0}),this.mesh&&(this.mesh.geometry=this.geometry)}},{key:"updateUniforms",value:function(){this.material.uniforms.noiseSpeed.value=t.CONFIG.animation.noise.speed,this.material.uniforms.noiseIntensity.value=t.CONFIG.animation.noise.force,this.material.uniforms.animRadius.value=t.CONFIG.animation.hurricane.radius,this.material.uniforms.animRotationSpeed.value=t.CONFIG.animation.hurricane.turns,this.material.uniforms.durationLeave.value=t.CONFIG.animation.durationLeave,this.material.uniforms.pointSize.value=t.CONFIG.compute.pointW,this.material.uniforms.needsUpdate=!0}},{key:"display",value:function(){this.material.uniforms.start.value=this.time,this.material.uniforms.isLeaving.value=!1,this.material.uniforms.needsUpdate=!0}},{key:"hide",value:function(){this.material.uniforms.start.value=this.time,this.material.uniforms.isLeaving.value=!0,this.material.uniforms.needsUpdate=!0}},{key:"render",value:function(e){this.time=e,this.material.uniforms.time.value=e,this.material.uniforms.needsUpdate=!0}},{key:"initMesh",value:function(){this.material=new e.ShaderMaterial({uniforms:{time:{type:"f",value:0},start:{type:"f",value:0},isLeaving:{type:"bool",value:!1},noiseSpeed:{type:"f",value:t.CONFIG.animation.noise.speed},noiseIntensity:{type:"f",value:t.CONFIG.animation.noise.force},animRadius:{type:"f",value:t.CONFIG.animation.hurricane.radius},animRotationSpeed:{type:"f",value:t.CONFIG.animation.hurricane.turns},durationLeave:{type:"f",value:t.CONFIG.animation.durationLeave},pointSize:{type:"f",value:t.CONFIG.compute.pointW}},fragmentShader:f.default,vertexShader:p.default}),this.mesh=new e.Points(this.geometry,this.material),this.mesh.name="Tree",this.mesh.position.y=-5}}]),t}();t.default=y}).call(t,n(0))},function(e,t,n){"use strict";(function(e){function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=e.Vector3,a=e.Vector2,r=(e.Vector4,function(){function e(){n(this,e)}return i(e,null,[{key:"randomInBox",value:function(e){return new o((e.x.max-e.x.min)*Math.random()+e.x.min,(e.y.max-e.y.min)*Math.random()+e.y.min,(e.z.max-e.z.min)*Math.random()+e.z.min)}},{key:"randomInCircle",value:function(e){var t=2*Math.random()*Math.PI;return new a(Math.cos(t)*e,Math.sin(t)*e)}},{key:"inSphere",value:function(e){var t=2*Math.PI*Math.random(),n=Math.acos(2*Math.random()-1);return new o(e*Math.sin(n)*Math.cos(t),e*Math.sin(n)*Math.sin(t),e*Math.cos(n))}},{key:"randomInDisc",value:function(e){var t=2*Math.random()*Math.PI;return new o(Math.cos(t)*e,0,Math.sin(t)*e)}},{key:"betweenNumber",value:function(e,t){return(t-e)*Math.random()+e}},{key:"loopRandomInDisc",value:function(t,n){for(var i=[],o=0;o<t;o++)i.push(e.randomInDisc(n));return i}},{key:"loopBetweenNumber",value:function(t,n,i){for(var o=[],a=0;a<t;a++)o.push(e.betweenNumber(n,i));return o}}]),e}());t.default=r}).call(t,n(0))},function(e,t,n){"use strict";(function(e){function i(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),r=n(10),s=i(r),u=n(15),c=i(u),d=n(19),l=n(9),h=i(l),f=n(3),m=i(f),p=n(8),b=i(p),v=function(){function t(){o(this,t),this.config=b.default,window.addEventListener("resize",this.onWindowResize.bind(this),!1),document.body.addEventListener("click",this.updateMousePosition.bind(this),!1),this.container=document.querySelector("#main"),document.body.appendChild(this.container),this.renderer=new e.WebGLRenderer({antialias:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setClearColor(15658734,1),this.container.appendChild(this.renderer.domElement),this.camera=new e.PerspectiveCamera(70,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.set(10,0,0),this.controls=new s.default(this.camera),this.mouse=new e.Vector2,this.clock=new h.default,this.config.stats&&this.initStat(),this.scene=new e.Scene,this.tree=new m.default,this.scene.add(this.tree.mesh),this.config.gui&&this.initDatGUI(),this.onWindowResize(),this.renderer.animate(this.render.bind(this))}return a(t,[{key:"initDatGUI",value:function(){var e=this,t=new c.default.GUI;t.close();var n=t.addFolder("Branch"),i=t.addFolder("Trunk"),o=t.addFolder("Animation");t.add(m.default.CONFIG.compute,"precision",.001,.1).onFinishChange(e.tree.newGeometry.bind(e.tree)),t.add(m.default.CONFIG.compute,"dist",.001,1).onFinishChange(e.tree.newGeometry.bind(e.tree)),t.add(m.default.CONFIG.compute,"pointW",0,1).onFinishChange(e.tree.newGeometry.bind(e.tree)),t.add(this.tree,"display"),t.add(this.tree,"hide"),i.add(m.default.CONFIG.trunk,"l",0,10).name("length").onFinishChange(e.tree.new.bind(e.tree)),i.add(m.default.CONFIG.trunk,"w",0,2.5).name("weight").onFinishChange(e.tree.new.bind(e.tree)),i.add(m.default.CONFIG.trunk.noise,"speed",0,2).name("twistChangeSpeed").onFinishChange(e.tree.newGeometry.bind(e.tree)),i.add(m.default.CONFIG.trunk.noise,"force",0,2).name("twistForce").onFinishChange(e.tree.newGeometry.bind(e.tree)),i.add(m.default.CONFIG.trunk.transition,"w",0,1).name("weightTransition").onFinishChange(e.tree.newGeometry.bind(e.tree));var a=i.addFolder("Branch Child creation");a.add(m.default.CONFIG.trunk.prob.behaviourSeparation,"division",0,1).name("Division").onFinishChange(e.tree.new.bind(e.tree)),a.add(m.default.CONFIG.trunk.prob.behaviourSeparation,"ramification",0,1).name("Ramification").onFinishChange(e.tree.new.bind(e.tree));for(var r=a.addFolder("Number of child branches (probability)"),s=0;s<m.default.CONFIG.trunk.prob.countChild.length;s++)r.add(m.default.CONFIG.trunk.prob.countChild,s,0,10).step(.2).onFinishChange(e.tree.new.bind(e.tree));this.manageMinMaxGui(m.default.CONFIG.branch.l,n,0,10,"Length"),this.manageMinMaxGui(m.default.CONFIG.branch.w,n,0,2,"Weight"),this.manageMinMaxGui(m.default.CONFIG.branch.w.transfer,n,0,1,"Transfer"),n.add(m.default.CONFIG.branch.noise,"speed",0,2).name("twistChangeSpeed").onFinishChange(e.tree.newGeometry.bind(e.tree)),n.add(m.default.CONFIG.branch.noise,"force",0,2).name("twistForce").onFinishChange(e.tree.newGeometry.bind(e.tree)),n.add(m.default.CONFIG.branch.transition,"w",0,1).name("weightTransition").onFinishChange(e.tree.newGeometry.bind(e.tree));var u=n.addFolder("Branch Child creation");u.add(m.default.CONFIG.branch.prob.behaviourSeparation,"division",0,1).name("Division").onFinishChange(e.tree.new.bind(e.tree)),u.add(m.default.CONFIG.branch.prob.behaviourSeparation,"ramification",0,1).name("Ramification").onFinishChange(e.tree.new.bind(e.tree));for(var d=u.addFolder("Number of child branches (probability)"),s=0;s<m.default.CONFIG.branch.prob.countChild.length;s++)d.add(m.default.CONFIG.branch.prob.countChild,s,0,10).step(.2).onFinishChange(e.tree.new.bind(e.tree));o.add(m.default.CONFIG.animation.noise,"speed",0,.005).onChange(e.tree.updateUniforms.bind(e.tree)),o.add(m.default.CONFIG.animation.noise,"force",0,1).onChange(e.tree.updateUniforms.bind(e.tree)),o.add(m.default.CONFIG.animation.hurricane,"radius",0,5).onChange(e.tree.updateUniforms.bind(e.tree)),o.add(m.default.CONFIG.animation.hurricane,"turns",0,20).onChange(e.tree.updateUniforms.bind(e.tree)),o.add(m.default.CONFIG.animation,"durationLeave",0,5e3).onChange(e.tree.updateUniforms.bind(e.tree))}},{key:"manageMinMaxGui",value:function(e,t,n,i,o){var a=this;t.add(e,"min",n,i).name("min"+o).listen().onChange(function(t){e.max<e.min&&(e.max=e.min)}).onFinishChange(a.tree.new.bind(a.tree)),t.add(e,"max",n,i).name("max"+o).listen().onChange(function(t){e.max<e.min&&(e.min=e.max)}).onFinishChange(a.tree.new.bind(a.tree))}},{key:"initStat",value:function(){this.stats=new d.Stats,this.stats.showPanel(1),document.body.appendChild(this.stats.dom)}},{key:"beforeRender",value:function(){this.config.stats&&this.stats.begin(),this.clock.update()}},{key:"afterRender",value:function(){this.config.stats&&this.stats.end()}},{key:"render",value:function(){this.beforeRender(),this.tree.render(this.clock.elapsed),this.renderer.render(this.scene,this.camera),this.afterRender()}},{key:"updateMousePosition",value:function(e){this.mouse.x=e.clientX/window.innerWidth*2-1,this.mouse.y=-e.clientY/window.innerHeight*2+1}},{key:"onWindowResize",value:function(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)}}]),t}();t.default=v}).call(t,n(0))},function(e,t){},function(e,t,n){"use strict";n(6);var i=n(5),o=function(e){return e&&e.__esModule?e:{default:e}}(i);window.app=new o.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={stats:!1,gui:!0}},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=function(){function e(t){i(this,e),this.autoStart=void 0===t||t,this._start=0,this.old=0,this.running=!1,this.elapsed=0,this.autoStart&&this.start()}return o(e,[{key:"start",value:function(){this._start=Date.now(),this.old=this._start,this.elapsed=0,this.running=!0}},{key:"stop",value:function(){this.running=!1}},{key:"update",value:function(){if(this.running){var e=Date.now();this.elapsed+=e-this.old,this.old=e}}}]),e}();t.default=a},function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),e.OrbitControls=function(t,n){function i(){return 2*Math.PI/60/60*_.autoRotateSpeed}function o(){return Math.pow(.95,_.zoomSpeed)}function a(e){H.theta-=e}function r(e){H.phi-=e}function s(t){_.object instanceof e.PerspectiveCamera?D/=t:_.object instanceof e.OrthographicCamera?(_.object.zoom=Math.max(_.minZoom,Math.min(_.maxZoom,_.object.zoom*t)),_.object.updateProjectionMatrix(),Z=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),_.enableZoom=!1)}function u(t){_.object instanceof e.PerspectiveCamera?D*=t:_.object instanceof e.OrthographicCamera?(_.object.zoom=Math.max(_.minZoom,Math.min(_.maxZoom,_.object.zoom/t)),_.object.updateProjectionMatrix(),Z=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),_.enableZoom=!1)}function c(e){B.set(e.clientX,e.clientY)}function d(e){J.set(e.clientX,e.clientY)}function l(e){K.set(e.clientX,e.clientY)}function h(e){W.set(e.clientX,e.clientY),X.subVectors(W,B);var t=_.domElement===document?_.domElement.body:_.domElement;a(2*Math.PI*X.x/t.clientWidth*_.rotateSpeed),r(2*Math.PI*X.y/t.clientHeight*_.rotateSpeed),B.copy(W),_.update()}function f(e){$.set(e.clientX,e.clientY),ee.subVectors($,J),ee.y>0?s(o()):ee.y<0&&u(o()),J.copy($),_.update()}function m(e){q.set(e.clientX,e.clientY),Q.subVectors(q,K),ie(Q.x,Q.y),K.copy(q),_.update()}function p(e){}function b(e){e.deltaY<0?u(o()):e.deltaY>0&&s(o()),_.update()}function v(e){switch(e.keyCode){case _.keys.UP:ie(0,_.keyPanSpeed),_.update();break;case _.keys.BOTTOM:ie(0,-_.keyPanSpeed),_.update();break;case _.keys.LEFT:ie(_.keyPanSpeed,0),_.update();break;case _.keys.RIGHT:ie(-_.keyPanSpeed,0),_.update()}}function y(e){B.set(e.touches[0].pageX,e.touches[0].pageY)}function w(e){var t=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY,i=Math.sqrt(t*t+n*n);J.set(0,i)}function g(e){K.set(e.touches[0].pageX,e.touches[0].pageY)}function C(e){W.set(e.touches[0].pageX,e.touches[0].pageY),X.subVectors(W,B);var t=_.domElement===document?_.domElement.body:_.domElement;a(2*Math.PI*X.x/t.clientWidth*_.rotateSpeed),r(2*Math.PI*X.y/t.clientHeight*_.rotateSpeed),B.copy(W),_.update()}function O(e){var t=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY,i=Math.sqrt(t*t+n*n);$.set(0,i),ee.subVectors($,J),ee.y>0?u(o()):ee.y<0&&s(o()),J.copy($),_.update()}function E(e){q.set(e.touches[0].pageX,e.touches[0].pageY),Q.subVectors(q,K),ie(Q.x,Q.y),K.copy(q),_.update()}function k(e){}function M(e){if(!1!==_.enabled){switch(e.preventDefault(),e.button){case _.mouseButtons.ORBIT:if(!1===_.enableRotate)return;c(e),z=L.ROTATE;break;case _.mouseButtons.ZOOM:if(!1===_.enableZoom)return;d(e),z=L.DOLLY;break;case _.mouseButtons.PAN:if(!1===_.enablePan)return;l(e),z=L.PAN}z!==L.NONE&&(document.addEventListener("mousemove",P,!1),document.addEventListener("mouseup",x,!1),_.dispatchEvent(S))}}function P(e){if(!1!==_.enabled)switch(e.preventDefault(),z){case L.ROTATE:if(!1===_.enableRotate)return;h(e);break;case L.DOLLY:if(!1===_.enableZoom)return;f(e);break;case L.PAN:if(!1===_.enablePan)return;m(e)}}function x(e){!1!==_.enabled&&(p(e),document.removeEventListener("mousemove",P,!1),document.removeEventListener("mouseup",x,!1),_.dispatchEvent(A),z=L.NONE)}function F(e){!1===_.enabled||!1===_.enableZoom||z!==L.NONE&&z!==L.ROTATE||(e.preventDefault(),e.stopPropagation(),b(e),_.dispatchEvent(S),_.dispatchEvent(A))}function N(e){!1!==_.enabled&&!1!==_.enableKeys&&!1!==_.enablePan&&v(e)}function I(e){if(!1!==_.enabled){switch(e.touches.length){case 1:if(!1===_.enableRotate)return;y(e),z=L.TOUCH_ROTATE;break;case 2:if(!1===_.enableZoom)return;w(e),z=L.TOUCH_DOLLY;break;case 3:if(!1===_.enablePan)return;g(e),z=L.TOUCH_PAN;break;default:z=L.NONE}z!==L.NONE&&_.dispatchEvent(S)}}function R(e){if(!1!==_.enabled)switch(e.preventDefault(),e.stopPropagation(),e.touches.length){case 1:if(!1===_.enableRotate)return;if(z!==L.TOUCH_ROTATE)return;C(e);break;case 2:if(!1===_.enableZoom)return;if(z!==L.TOUCH_DOLLY)return;O(e);break;case 3:if(!1===_.enablePan)return;if(z!==L.TOUCH_PAN)return;E(e);break;default:z=L.NONE}}function j(e){!1!==_.enabled&&(k(e),_.dispatchEvent(A),z=L.NONE)}function T(e){!1!==_.enabled&&e.preventDefault()}this.object=t,this.domElement=void 0!==n?n:document,this.enabled=!0,this.target=new e.Vector3,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.25,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.enableKeys=!0,this.keys={LEFT:37,UP:38,RIGHT:39,BOTTOM:40},this.mouseButtons={ORBIT:e.MOUSE.LEFT,ZOOM:e.MOUSE.MIDDLE,PAN:e.MOUSE.RIGHT},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=function(){return V.phi},this.getAzimuthalAngle=function(){return V.theta},this.saveState=function(){_.target0.copy(_.target),_.position0.copy(_.object.position),_.zoom0=_.object.zoom},this.reset=function(){_.target.copy(_.target0),_.object.position.copy(_.position0),_.object.zoom=_.zoom0,_.object.updateProjectionMatrix(),_.dispatchEvent(G),_.update(),z=L.NONE},this.update=function(){var n=new e.Vector3,o=(new e.Quaternion).setFromUnitVectors(t.up,new e.Vector3(0,1,0)),r=o.clone().inverse(),s=new e.Vector3,u=new e.Quaternion;return function(){var e=_.object.position;return n.copy(e).sub(_.target),n.applyQuaternion(o),V.setFromVector3(n),_.autoRotate&&z===L.NONE&&a(i()),V.theta+=H.theta,V.phi+=H.phi,V.theta=Math.max(_.minAzimuthAngle,Math.min(_.maxAzimuthAngle,V.theta)),V.phi=Math.max(_.minPolarAngle,Math.min(_.maxPolarAngle,V.phi)),V.makeSafe(),V.radius*=D,V.radius=Math.max(_.minDistance,Math.min(_.maxDistance,V.radius)),_.target.add(Y),n.setFromSpherical(V),n.applyQuaternion(r),e.copy(_.target).add(n),_.object.lookAt(_.target),!0===_.enableDamping?(H.theta*=1-_.dampingFactor,H.phi*=1-_.dampingFactor):H.set(0,0,0),D=1,Y.set(0,0,0),!!(Z||s.distanceToSquared(_.object.position)>U||8*(1-u.dot(_.object.quaternion))>U)&&(_.dispatchEvent(G),s.copy(_.object.position),u.copy(_.object.quaternion),Z=!1,!0)}}(),this.dispose=function(){_.domElement.removeEventListener("contextmenu",T,!1),_.domElement.removeEventListener("mousedown",M,!1),_.domElement.removeEventListener("wheel",F,!1),_.domElement.removeEventListener("touchstart",I,!1),_.domElement.removeEventListener("touchend",j,!1),_.domElement.removeEventListener("touchmove",R,!1),document.removeEventListener("mousemove",P,!1),document.removeEventListener("mouseup",x,!1),window.removeEventListener("keydown",N,!1)};var _=this,G={type:"change"},S={type:"start"},A={type:"end"},L={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_DOLLY:4,TOUCH_PAN:5},z=L.NONE,U=1e-6,V=new e.Spherical,H=new e.Spherical,D=1,Y=new e.Vector3,Z=!1,B=new e.Vector2,W=new e.Vector2,X=new e.Vector2,K=new e.Vector2,q=new e.Vector2,Q=new e.Vector2,J=new e.Vector2,$=new e.Vector2,ee=new e.Vector2,te=function(){var t=new e.Vector3;return function(e,n){t.setFromMatrixColumn(n,0),t.multiplyScalar(-e),Y.add(t)}}(),ne=function(){var t=new e.Vector3;return function(e,n){t.setFromMatrixColumn(n,1),t.multiplyScalar(e),Y.add(t)}}(),ie=function(){var t=new e.Vector3;return function(n,i){var o=_.domElement===document?_.domElement.body:_.domElement;if(_.object instanceof e.PerspectiveCamera){var a=_.object.position;t.copy(a).sub(_.target);var r=t.length();r*=Math.tan(_.object.fov/2*Math.PI/180),te(2*n*r/o.clientHeight,_.object.matrix),ne(2*i*r/o.clientHeight,_.object.matrix)}else _.object instanceof e.OrthographicCamera?(te(n*(_.object.right-_.object.left)/_.object.zoom/o.clientWidth,_.object.matrix),ne(i*(_.object.top-_.object.bottom)/_.object.zoom/o.clientHeight,_.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),_.enablePan=!1)}}();_.domElement.addEventListener("contextmenu",T,!1),_.domElement.addEventListener("mousedown",M,!1),_.domElement.addEventListener("wheel",F,!1),_.domElement.addEventListener("touchstart",I,!1),_.domElement.addEventListener("touchend",j,!1),_.domElement.addEventListener("touchmove",R,!1),window.addEventListener("keydown",N,!1),this.update()},e.OrbitControls.prototype=Object.create(e.EventDispatcher.prototype),e.OrbitControls.prototype.constructor=e.OrbitControls,Object.defineProperties(e.OrbitControls.prototype,{center:{get:function(){return console.warn("THREE.OrbitControls: .center has been renamed to .target"),this.target}},noZoom:{get:function(){return console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."),!this.enableZoom},set:function(e){console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."),this.enableZoom=!e}},noRotate:{get:function(){return console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."),!this.enableRotate},set:function(e){console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."),this.enableRotate=!e}},noPan:{get:function(){return console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."),!this.enablePan},set:function(e){console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."),this.enablePan=!e}},noKeys:{get:function(){return console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."),!this.enableKeys},set:function(e){console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."),this.enableKeys=!e}},staticMoving:{get:function(){return console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."),!this.enableDamping},set:function(e){console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."),this.enableDamping=!e}},dynamicDampingFactor:{get:function(){return console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."),this.dampingFactor},set:function(e){console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."),this.dampingFactor=e}}}),t.default=e.OrbitControls}).call(t,n(0))},function(e,t,n){"use strict";(function(e){function i(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),u=n(3),c=(i(u),n(4)),d=i(c),l=function(t){function n(e,t){o(this,n);var i=a(this,(n.__proto__||Object.getPrototypeOf(n)).call(this));return i._tree=e,i.type="TreeGeometry",i.vertices=i._tree.tree.compute(e.config.compute.precision),i.computeVertices(),t.animate&&i.initAnimation(),i}return r(n,t),s(n,[{key:"computeVertices",value:function(){for(var t=new Float32Array(3*this.vertices.length),n=0;n<this.vertices.length;n++)t[3*n]=this.vertices[n].x,t[3*n+1]=this.vertices[n].y,t[3*n+2]=this.vertices[n].z;return this.addAttribute("position",new e.BufferAttribute(t,3)),t}},{key:"initAnimation",value:function(){for(var t=this.vertices.length,n=new Float32Array(t),i=0;i<t;i++)n[i]=500*this.vertices[i].y+d.default.betweenNumber(500,1e3);var o=new Float32Array(t).fill(0).map(function(e){return 1e3*Math.random()});this.addAttribute("duration",new e.BufferAttribute(n,1)),this.addAttribute("delay",new e.BufferAttribute(o,1))}}]),n}(e.BufferGeometry);t.default=l}).call(t,n(0))},function(e,t,n){"use strict";(function(e){function i(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function r(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),u=n(2),c=i(u),d=n(1),l=i(d),h=function(t){function n(e){return o(this,n),e.type=l.default.TRUNK,a(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,e))}return r(n,t),s(n,[{key:"init",value:function(){this.length=l.default.trunk.l,this.weight=l.default.trunk.w,this.noiseCoord=new e.Vector2(Math.random(),Math.random()),this.baseCoord=null==this.parent?new e.Vector3:this.parent.topCoord,this.topCoord=this.getCoordsAtLength(this.length),this.canHaveChild&&this.genRamification()}}]),n}(c.default);t.default=h}).call(t,n(0))},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=function(){function e(){i(this,e)}return o(e,null,[{key:"random",value:function(e){var t=0,n=null,i=[],o=[];if(e instanceof Array)for(var a=0;a<e.length;a++)i.push(a),o.push(e[a]),t+=e[a];if(e instanceof Object)for(var a in e)i.push(a),o.push(e[a]),t+=e[a];for(var r=Math.random()*t,a=0,s=0;a<o.length;a++)if(s+=o[a],r<s){n=i[a];break}return n}},{key:"between",value:function(e,t){return(t-e)*Math.random()+e}}]),e}();t.default=a},function(e,t,n){"use strict";(function(e){function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o=function(){function t(){n(this,t)}return i(t,null,[{key:"rotateLooking",value:function(t,n){var i=Math.acos(t.dot(n)),o=(new e.Vector3).copy(t).cross(n);return(new e.Vector3).copy(t).applyAxisAngle(o,i)}},{key:"genCircle",value:function(t,n,i){for(var o,a,r=2*Math.PI/t,s=[],u=0;u<t;u++)o=n+r*u,a=new e.Vector3(Math.cos(o)*i,0,Math.sin(o)*i),s.push((new e.Vector3).copy(a));return s}}]),t}();t.default=o}).call(t,n(0))},,,,,,function(e,t){e.exports="void main () {\n  gl_FragColor = vec4(0., 0., 0., 1.);\n}"},function(e,t){e.exports="uniform float time;\nuniform float start;\nuniform bool isLeaving;\n\nuniform float noiseSpeed;\nuniform float noiseIntensity;\nuniform float pointSize;\nuniform float animRadius;\nuniform float animRotationSpeed;\nuniform float durationLeave;\n\nattribute float duration;\nvec3 floorPos = vec3(0., -10., 0.); \nattribute float delay;\n\nfloat linearAnim = 0.;\n\n\n\n\n#define PI 3.14159265358979323846\n\n// Transition function\n\nfloat quadraticOut(float t) {\n  return -t * (t - 2.0);\n}\n\nfloat quadraticIn(float t) {\n  return t * t;\n}\n\nfloat cubicInOut(float t) {\n  return t < 0.5\n    ? 4.0 * t * t * t\n    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;\n}\n\n// Noise\n\nfloat mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}\nvec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}\nvec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}\n\nfloat noise(vec3 p){\n    vec3 a = floor(p);\n    vec3 d = p - a;\n    d = d * d * (3.0 - 2.0 * d);\n\n    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);\n    vec4 k1 = perm(b.xyxy);\n    vec4 k2 = perm(k1.xyxy + b.zzww);\n\n    vec4 c = k2 + a.zzzz;\n    vec4 k3 = perm(c);\n    vec4 k4 = perm(c + 1.0);\n\n    vec4 o1 = fract(k3 * (1.0 / 41.0));\n    vec4 o2 = fract(k4 * (1.0 / 41.0));\n\n    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);\n    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);\n\n    return o4.y * d.y + o4.x * (1.0 - d.y);\n}\n\n\n\n\nvec3 hurricane(float anim, vec3 origin, vec3 target){\n    float radius;\n        \n    if( anim < 0.5 ){\n        radius = cubicInOut(anim*2.) * animRadius; \n    } else {\n        radius = 1. - cubicInOut((anim - 0.5)*2.) * animRadius;\n    }\n\n    vec3 pos = origin + (target - origin) * anim;    \n    vec3 rotatePos = vec3( cos ( anim * 2. * PI * animRotationSpeed ) * radius, 0., sin( anim * 2. * PI * animRotationSpeed ) * radius );\n   \n    return pos + rotatePos;\n}\n\n\nvoid main() {\n    vec3 newPosition = position;\n    float anim; \n\n    if (isLeaving) {\n        if( time > start + delay ){\n            linearAnim = min(1., (time - start - delay)/(delay + durationLeave)); \n        }\n        anim = 1. - quadraticIn(linearAnim); \n    } else {\n        if( time > start + delay ){\n            linearAnim = min(1., (time - start - delay)/(delay + duration)); \n        }\n        anim = quadraticOut(linearAnim); \n    }\n\n    if( anim < 1. ){ \n        newPosition = hurricane( anim, floorPos, position ); \n    } \n\n    newPosition = newPosition + position * noise( vec3( position.xy, position.z + time*noiseSpeed ) ) * noiseIntensity;\n    \n    gl_PointSize = pointSize;\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);\n\n}"}],[7]);