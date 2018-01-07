
import OrbitControls from "./helpers/OrbitControls.js"
import { Stats } from "three-stats"
import Clock from "./helpers/Clock.js"
import Tree from "./tree/Tree.js"
import config from "./config.js"
import initDatGUI from "./gui.js"
import Galaxy from "./Galaxy.js"

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

        this.galaxy = new Galaxy();
        this.scene.add(this.galaxy.mesh);

        // console.log(initDatGUI)
        if( this.config.gui ) {
            this.initDatGUI = initDatGUI.bind(this);
            this.initDatGUI();
        }

        this.onWindowResize();
        this.renderer.animate( this.render.bind(this) );
    }


    // -----------------------------------------

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
        this.controls.animate();
        this.tree.render(this.clock.elapsed);
        this.galaxy.render(this.clock.elapsed);
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
