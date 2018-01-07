import Branch from "./Branch.js";
import config from "./config.js"

class Trunk extends Branch {
	constructor(args){
		args.type = config.TRUNK;
		super(args)
	}

	init() {
		this.length = config.trunk.l; 
		this.weight = config.trunk.w;
		this.noiseCoord = new THREE.Vector2(Math.random(), Math.random());

		this.baseCoord = this.parent == null ? new THREE.Vector3() : this.parent.topCoord;
		this.topCoord = this.getCoordsAtLength(this.length);

		if( this.canHaveChild ) this.genRamification(); 
	}
}

export default Trunk;