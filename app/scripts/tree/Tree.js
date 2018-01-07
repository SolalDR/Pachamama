/*	  

  This is a goal

	  o*****
	 *********
	*******o***
    **o********
	****o*****
	   ****
		||
		||
		||
	|-|-|-|-|-

*/

import config from "./config.js"
import { Noise } from "noisejs"
import Branch from "./Branch.js"
import Trunk from "./Trunk.js"
import fragment from "./glsl/classic.frag"
import vertex from "./glsl/hurricane.vert"
import TreeGeometry from "./TreeGeometry.js"

class Tree {

	static get CONFIG() { return config; }

	constructor() {
		this.config = config;
		this.noise = new Noise();
		this._display = true;
		this.boundaries = {
			x: { min: 0,  max: 0 }, 
			y: { min: 0, max: 0 },
			z: { min: 0, max:0 }
		}

		this.new();
		this.initMesh();
	}

	/**
	 * Create a new tree and compute it
	 */
	new() {
		this.tree = new Trunk( {  noise: this.noise  });
		this.setBoundaries();
		this.newGeometry();
	}


	/**
	 * Map in all the tree's branches and define the boundaries
	 */
	setBoundaries(){
		this.tree.map((branch)=>{
			for( var i in this.boundaries){
				if( branch.topCoord.x < this.boundaries.x.min ) this.boundaries.x.min = branch.topCoord.x
				if( branch.topCoord.x > this.boundaries.x.max ) this.boundaries.x.max = branch.topCoord.x
				
				if( branch.topCoord.y < this.boundaries.y.min ) this.boundaries.y.min = branch.topCoord.y
				if( branch.topCoord.y > this.boundaries.y.max ) this.boundaries.y.max = branch.topCoord.y

				if( branch.topCoord.z < this.boundaries.z.min ) this.boundaries.z.min = branch.topCoord.z
				if( branch.topCoord.z > this.boundaries.z.max ) this.boundaries.z.max = branch.topCoord.z
			}
		})
	}


	/**
	 * Launch hide animation, compile new tree and display it
 	 */
	replace(){
		// If there is already an animation, don't do anything
		if( this.animationAdvanced < 1 ) return; 
		
		// If tree displayed, hide it and set the animation duration as timeout
		var timeout = 0;
		if( this.display ) {
			this.display = false;
			timeout = Tree.CONFIG.animation.durationLeave + 2000;
		}

		// Wait and show new tree
		setTimeout(()=>{
			this.new();
			this.display = true;
		}, timeout);
	}

	/**
	 * Create a new geometry from the current tree
	 */
	newGeometry() {
		this.tree.update();
		this.geometry = new TreeGeometry(this, { animate: true });
		if( this.mesh ) this.mesh.geometry = this.geometry;	
	}

	/**
	 * Update uniforms after a DatGUI Change
	 */
	updateUniforms() {
		this.material.uniforms.noiseSpeed.value = Tree.CONFIG.animation.noise.speed; 
		this.material.uniforms.noiseIntensity.value = Tree.CONFIG.animation.noise.force; 
		this.material.uniforms.animRadius.value = Tree.CONFIG.animation.hurricane.radius; 
		this.material.uniforms.animRotationSpeed.value = Tree.CONFIG.animation.hurricane.turns; 
		this.material.uniforms.durationLeave.value = Tree.CONFIG.animation.durationLeave; 
		this.material.uniforms.pointSize.value = Tree.CONFIG.compute.pointW; 
		this.material.uniforms.needsUpdate = true;
	}

	/**
	 * Hide or display the tree by starting an animation
	 * @param {boolean} bool
	 */
	set display(bool) {
		// If there is already an animation, don't do anything
		if( this.animationAdvanced < 1 ) return;

		this.material.uniforms.start.value = this.time;
		this.material.uniforms.isLeaving.value = bool ? false : true;
		this.material.uniforms.needsUpdate = true;

		this._display = bool;
	}
	get display() {
		return this._display;
	}

	
	/**
	 * Getter that calculate the global advancement of the animation
	 * @return {float} - The advancement of animation between 0 and 1
	 */
	get animationAdvanced() {
		var duration = this.display === false ? Tree.CONFIG.animation.durationLeave + 2000 : this.boundaries.y.max*500 + 1000; 
		return Math.min(1, (this.time - this.material.uniforms.start.value)/duration); 
	}

	/**
	 * RAF method, update the clock 
	 */
	render(time){
		this.time = time;
		this.material.uniforms.time.value = time;
		this.material.uniforms.needsUpdate = true;
	}
	
	/**
	 * Create material & mesh
	 */
	initMesh() {
		this.material = new THREE.ShaderMaterial({
			uniforms: {
				time: { type: "f", value: 0 }, start: { type: "f", value: 0},
				isLeaving: { type: "bool", value: !this.display },
				noiseSpeed: { type: "f", value: Tree.CONFIG.animation.noise.speed },
				noiseIntensity: { type: "f", value: Tree.CONFIG.animation.noise.force },
				animRadius: { type: "f", value: Tree.CONFIG.animation.hurricane.radius },
				animRotationSpeed: { type: "f", value: Tree.CONFIG.animation.hurricane.turns },
				durationLeave: { type: "f", value: Tree.CONFIG.animation.durationLeave },
				pointSize: { type: "f", value: Tree.CONFIG.compute.pointW }
			}, 
			fragmentShader: fragment,
			vertexShader: vertex
		});

		this.mesh = new THREE.Points(this.geometry, this.material);
		this.mesh.name = "Tree";
		this.mesh.position.y = -5;
	}
}

export default Tree;