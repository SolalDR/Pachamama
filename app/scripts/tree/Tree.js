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
		this.new();
		this.initMesh();
	}

	/**
	 * Create a new tree and compute it
	 */
	new() {
		this.tree = new Trunk( {  noise: this.noise  });
		this.newGeometry();
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
		this.material.uniforms.start.value = this.time;
		this.material.uniforms.isLeaving.value = bool ? false : true;
		this.material.uniforms.needsUpdate = true;
	} 
	get display() {
		return !this.material.uniforms.isLeaving.value
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
				isLeaving: { type: "bool", value: false },
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