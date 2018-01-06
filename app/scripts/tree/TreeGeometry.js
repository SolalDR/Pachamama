import Tree from "./Tree.js";

class TreeGeometry extends THREE.BufferGeometry {
	
	constructor(tree) {
		super();
		
		this._tree = tree;
		this.type = "TreeGeometry";
		this.vertices = this._tree.tree.compute(tree.config.compute.precision);

		this.computeVertices();
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


}

export default TreeGeometry