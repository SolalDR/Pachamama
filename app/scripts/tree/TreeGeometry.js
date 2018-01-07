import Tree from "./Tree.js";
import Random from "./helpers/Random.js"


class TreeGeometry extends THREE.BufferGeometry {
	
	constructor(tree, args) {
		super();
		
		this._tree = tree;
		this.type = "TreeGeometry";
		var result = this._tree.tree.compute(tree.config.compute.precision);
		this.vertices = result.vertices;
		this.weights = result.weights
		this.computeVertices();
		// this.computeWeights();


		if( args.animate ){
			this.initAnimation();
		}

	}

	computeWeights(){
		var bufferArray = new Float32Array( this.vertices.length);
		for(var i=0; i<bufferArray.length; i++){
			bufferArray[i] = this.weights[i];
		}

		console.log(bufferArray)
		this.addAttribute( 'weight', new THREE.BufferAttribute( bufferArray , 1 ) );
	}

	computeVertices(){
	
		var bufferArray = new Float32Array( this.vertices.length * 3 );
		for(var i = 0; i < this.vertices.length; i++) {
			bufferArray[i*3] = this.vertices[i].x
			bufferArray[i*3+1] = this.vertices[i].y
			bufferArray[i*3+2] = this.vertices[i].z
		}

		this.addAttribute( 'position', new THREE.BufferAttribute( bufferArray , 3 ) );
		
		return bufferArray;
	}

	initAnimation(){

		var l = this.vertices.length; 
		var durations = new Float32Array(l);

		for(var i = 0; i < l; i++) {
			durations[i] = this.vertices[i].y * 500 + Random.betweenNumber(500, 1000)
		}

		var delays = new Float32Array(l).fill(0).map( x => Math.random()*1000 );	

		this.addAttribute( 'duration', new THREE.BufferAttribute( durations , 1 ) );
		this.addAttribute( 'delay', new THREE.BufferAttribute( delays , 1 ) );
	}


}

export default TreeGeometry