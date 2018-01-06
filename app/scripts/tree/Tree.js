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
import Random from "./helpers/Random.js"
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
		this.material.uniforms.time.value = time;
		this.material.uniforms.needsUpdate = true;
	}



	createGeometry(){

		this.geometry = new TreeGeometry(this, {
			animate: true
		});
		
		var length = this.geometry.vertices.length
		var animationPoints = new Float32Array(length);	
		for(var i = 0; i < length; i++) {
			animationPoints[i] = this.geometry.vertices[i].y * 500 + Random.betweenNumber(500, 1000)
		}
		var animationDecal = new Float32Array(length).fill(0).map( x => Math.random()*1000 );	

		this.geometry.addAttribute( 'animation', new THREE.BufferAttribute( animationPoints , 1 ) );
		this.geometry.addAttribute( 'start', new THREE.BufferAttribute( animationDecal , 1 ) );

	}

	init() {

		this.createGeometry();

		var uniforms =  {
			time: { type: "f", value: 0 }
		}
		this.material = new THREE.ShaderMaterial({
			uniforms: uniforms, 
			fragmentShader: fragment,
			vertexShader: vertex,
			color: 0x888888
		});

		this.mesh = new THREE.Points(this.geometry, this.material);
		this.mesh.name = "Tree";
		this.mesh.position.y = -5

	}

}

export default Tree;