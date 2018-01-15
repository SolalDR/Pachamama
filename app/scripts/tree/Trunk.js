import Branch from "./Branch.js";
import config from "./config.js"

class Trunk extends Branch {
	constructor(args){
		args.type = config.TRUNK;
		super(args)
	}

	initInheritance(){
		this.noiseCoord = this.parent.noiseCoord;
	}

	init() {
		if( this.inheritance ){
			this.initInheritance();
		} else {
			this.noiseCoord = new THREE.Vector2(Math.random(), Math.random()); 
			
		}

		this.length = config.trunk.l; 
		this.weight = config.trunk.w;
	

		this.baseCoord = this.parent == null ? new THREE.Vector3() : this.parent.topCoord;
		this.topCoord = this.getCoordsAtLength(this.length);

		if( this.canHaveChild ) this.genRamification(); 
	}
}

export default Trunk;