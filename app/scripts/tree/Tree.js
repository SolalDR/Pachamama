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
import fragment from "./glsl/classic.frag"
import vertex from "./glsl/hurricane.vert"

import TreeGeometry from "./TreeGeometry.js"

class Tree {
	
	static get CONFIG() {
		return config;
	}

	constructor() {
		this.config = config;
		this.noise = new Noise();
		this.new();
		this.init();
	}

	/**
	 * Create a new tree and compute it
	 */
	new() {
		this.tree = new Branch( { 
			type: Tree.CONFIG.TRUNK,
			noise: this.noise 
		});
	}

	update(){

		this.new();

		this.createGeometry();
		this.mesh.geometry = this.geometry;

	}


	render(time){
		this.time = time;
		this.material.uniforms.time.value = time;
		this.material.uniforms.needsUpdate = true;
	}



	createGeometry(){
		this.geometry = new TreeGeometry(this, {
			animate: true
		});
	}

	get uniforms() {
		return {
			time: { type: "f", value: 0 },
			start: { type: "f", value: 0},
			isLeaving: { type: "bool", value: false },
			noiseSpeed: { type: "f", value: Tree.CONFIG.animation.noise.speed },
			noiseIntensity: { type: "f", value: Tree.CONFIG.animation.noise.force },
			animRadius: { type: "f", value: Tree.CONFIG.animation.hurricane.radius },
			animRotationSpeed: { type: "f", value: Tree.CONFIG.animation.hurricane.turns },
			durationLeave: { type: "f", value: Tree.CONFIG.animation.durationLeave },
			pointSize: { type: "f", value: Tree.CONFIG.compute.pointW }
		}
	}

	display() {
		this.material.uniforms.start.value = this.time;
		this.material.uniforms.isLeaving.value = false;
		this.material.uniforms.needsUpdate = true; 
	}

	hide() {
		this.material.uniforms.start.value = this.time;
		this.material.uniforms.isLeaving.value = true;
		this.material.uniforms.needsUpdate = true; 
	}

	init() {

		this.createGeometry();

		this.material = new THREE.ShaderMaterial({
			uniforms: this.uniforms, 
			fragmentShader: fragment,
			vertexShader: vertex,
			color: 0x888888
		});

		this.mesh = new THREE.Points(this.geometry, this.material);
		this.mesh.name = "Tree";
		this.mesh.position.y = -5;

	}

}

export default Tree;