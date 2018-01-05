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
import vertex from "./glsl/classic.vert"

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

	new() {

		this.tree = new Branch( { 
			type: Tree.CONFIG.TRUNK,
			noise: this.noise 
		});

		this.compute();

	}

	compute() {
		var points = this.tree.compute(config.compute.precision);
		var vertices = new Float32Array( points.length * 3 );
		for(var i = 0; i < points.length; i++) {
			vertices[i*3] = points[i].x
			vertices[i*3+1] = points[i].y
			vertices[i*3+2] = points[i].z
		}
		return vertices;	
	}

	update(){

		this.new();

		this.createGeometry();
		this.mesh.geometry = this.geometry;

	}


	render(time){
		this.material.uniforms.time.value = time/1000;
		this.material.uniforms.needsUpdate = true;
	}

	createGeometry(){
		this.geometry = new THREE.BufferGeometry();
		this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.compute(), 3 ) );
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