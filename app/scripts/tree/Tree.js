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
		this.compute();
	}

	/**
	 * Compute a tree
	 */
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
		this.material.uniforms.time.value = time;
		this.material.uniforms.needsUpdate = true;
	}

	createGeometry(){

		this.geometry = new THREE.BufferGeometry();
		var vertices = this.compute();
		
		var floorPoints = new Float32Array(vertices.length);
		var vec;
		for( var i = 0; i < floorPoints.length; i+=3) {
			vec = Random.inSphere(Math.random());
			// floorPoints[i] = vec.x
			// floorPoints[i+1] = vec.y
			// floorPoints[i+2] = vec.z
			floorPoints[i] = 0;
			floorPoints[i+1] = -10;
			floorPoints[i+2] = 0;
		}

		var animationPoints = new Float32Array(vertices.length/3);	
		for(var i = 0; i < vertices.length; i+= 3) {
			animationPoints[i/3] = vertices[i + 1] * 500 + Random.betweenNumber(500, 1000)
		}
		var animationDecal = new Float32Array(vertices.length/3).fill(0).map( x => Math.random()*1000 );	

		this.geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices , 3 ) );
		this.geometry.addAttribute( 'floorPos', new THREE.BufferAttribute( floorPoints , 3 ) );
		this.geometry.addAttribute( 'animation', new THREE.BufferAttribute( animationPoints , 1 ) );
		this.geometry.addAttribute( 'animationStart', new THREE.BufferAttribute( animationDecal , 1 ) );

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