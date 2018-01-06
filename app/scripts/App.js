
import OrbitControls from "./helpers/OrbitControls.js"
import Dat from "dat-gui"
import { Stats } from "three-stats"
import Clock from "./helpers/Clock.js"
import Tree from "./tree/Tree.js"
import config from "./config.js"

export default class App {

    constructor() {
        
        this.config = config; 

        // Events
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        document.body.addEventListener("click", this.updateMousePosition.bind(this), false);
        
        // Init
        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor ( 0xEEEEEE, 1 )
        this.container.appendChild( this.renderer.domElement );

        // Camera and control
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set(10, 0, 0);
        this.controls = new OrbitControls( this.camera );
        this.mouse = new THREE.Vector2();


        // Init Clock
        this.clock = new Clock();
        if( this.config.stats ) this.initStat();

    	this.scene = new THREE.Scene();

        this.tree = new Tree();
        this.scene.add(this.tree.mesh)

        if( this.config.gui ) this.initDatGUI();

        this.onWindowResize();
        this.renderer.animate( this.render.bind(this) );
    }


    // -----------------------------------------

    initDatGUI() {

        var self = this;
        var gui = new Dat.GUI();

        gui.close();
        var branch = gui.addFolder('Branch');
        var trunk = gui.addFolder('Trunk');
        var animation = gui.addFolder('Animation');

        gui.add(Tree.CONFIG.compute, 'precision', 0.001, 0.1).onFinishChange(self.tree.newGeometry.bind(self.tree));
        gui.add(Tree.CONFIG.compute, 'dist', 0, 1).onFinishChange(self.tree.newGeometry.bind(self.tree));
        gui.add(Tree.CONFIG.compute, 'pointW', 0, 1).onFinishChange(self.tree.newGeometry.bind(self.tree));

        gui.add(this.tree, 'display')
        gui.add(this.tree, 'hide')

        /**********
        *  Trunk
        **********/

        trunk.add(Tree.CONFIG.trunk, 'l', 0, 10)
            .name("length").onFinishChange(self.tree.new.bind(self.tree));

        trunk.add(Tree.CONFIG.trunk, 'w', 0, 2.5)
            .name("weight").onFinishChange(self.tree.new.bind(self.tree));
       
        trunk.add(Tree.CONFIG.trunk.noise, 'speed', 0, 2)
            .name("twistChangeSpeed").onFinishChange(self.tree.newGeometry.bind(self.tree));

        trunk.add(Tree.CONFIG.trunk.noise, 'force', 0, 2)
            .name("twistForce").onFinishChange(self.tree.newGeometry.bind(self.tree));

        trunk.add(Tree.CONFIG.trunk.transition, 'w', 0, 1)
            .name("weightTransition").onFinishChange(self.tree.newGeometry.bind(self.tree));

        var trunkChild = trunk.addFolder("Branch Child creation");

        trunkChild.add(Tree.CONFIG.trunk.prob.behaviourSeparation, "division", 0, 1)
            .name("Division").onFinishChange(self.tree.new.bind(self.tree));

        trunkChild.add(Tree.CONFIG.trunk.prob.behaviourSeparation, "ramification", 0, 1)
            .name("Ramification").onFinishChange(self.tree.new.bind(self.tree));

        var trunkChildCreation = trunkChild.addFolder("Number of child branches (probability)");
        for(var i=0; i < Tree.CONFIG.trunk.prob.countChild.length; i++){
            trunkChildCreation.add(Tree.CONFIG.trunk.prob.countChild, i, 0, 10)
                .step(0.2).onFinishChange(self.tree.new.bind(self.tree));
        }
        
        /**********
        *  Branch
        **********/

        this.manageMinMaxGui(Tree.CONFIG.branch.l, branch, 0, 10, "Length");
        this.manageMinMaxGui(Tree.CONFIG.branch.w, branch, 0, 2, "Weight");
        this.manageMinMaxGui(Tree.CONFIG.branch.w.transfer, branch, 0, 1, "Transfer"); 

        branch.add(Tree.CONFIG.branch.noise, 'speed', 0, 2)
            .name("twistChangeSpeed").onFinishChange(self.tree.newGeometry.bind(self.tree));

        branch.add(Tree.CONFIG.branch.noise, 'force', 0, 2)
            .name("twistForce").onFinishChange(self.tree.newGeometry.bind(self.tree));

        branch.add(Tree.CONFIG.branch.transition, 'w', 0, 1)
            .name("weightTransition").onFinishChange(self.tree.newGeometry.bind(self.tree));

        var branchChild = branch.addFolder("Branch Child creation");
       
        branchChild.add(Tree.CONFIG.branch.prob.behaviourSeparation, "division", 0, 1)
            .name("Division").onFinishChange(self.tree.new.bind(self.tree));
      
        branchChild.add(Tree.CONFIG.branch.prob.behaviourSeparation, "ramification", 0, 1)
            .name("Ramification").onFinishChange(self.tree.new.bind(self.tree));
        
        var branchCreation = branchChild.addFolder("Number of child branches (probability)");
       
        for(var i=0; i < Tree.CONFIG.branch.prob.countChild.length; i++){
            branchCreation.add(Tree.CONFIG.branch.prob.countChild, i, 0, 10)
                .step(0.2).onFinishChange(self.tree.new.bind(self.tree));
        }

        animation.add(Tree.CONFIG.animation.noise, 'speed', 0, 0.005).onChange(self.tree.updateUniforms.bind(self.tree));
        animation.add(Tree.CONFIG.animation.noise, 'force', 0, 1).onChange(self.tree.updateUniforms.bind(self.tree));
        animation.add(Tree.CONFIG.animation.hurricane, 'radius', 0, 5).onChange(self.tree.updateUniforms.bind(self.tree));
        animation.add(Tree.CONFIG.animation.hurricane, 'turns', 0, 20).onChange(self.tree.updateUniforms.bind(self.tree));
        animation.add(Tree.CONFIG.animation, 'durationLeave', 0, 5000).onChange(self.tree.updateUniforms.bind(self.tree));

    }

    manageMinMaxGui(config, folder, min, max, name){

        var self = this;

        folder.add(config, 'min', min, max).name('min'+name).listen().onChange((val)=>{
            if( config.max < config.min)
                config.max = config.min;
        }).onFinishChange(self.tree.new.bind(self.tree));

        folder.add(config, 'max', min, max).name('max'+name).listen().onChange((val)=>{
            if( config.max < config.min)
                config.min = config.max;
        }).onFinishChange(self.tree.new.bind(self.tree));

    }

    initStat() {
        this.stats = new Stats();
        this.stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );
    }

    // -----------------------------------------


    beforeRender(){
         if(this.config.stats) 
            this.stats.begin();
        this.clock.update();
    }

    afterRender(){
        if(this.config.stats) 
            this.stats.end();
    }

    render() {
        this.beforeRender();

        this.tree.render(this.clock.elapsed);
    	this.renderer.render( this.scene, this.camera );
        
        this.afterRender();
    }


    // -----------------------------------------
        
    updateMousePosition( event ) { 
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    onWindowResize() {
    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}
