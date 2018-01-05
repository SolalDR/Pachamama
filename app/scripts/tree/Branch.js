import config from "./config.js"
import Probability from "./helpers/Probability.js"
import Random from "./helpers/Random.js"

class Branch {

	constructor ( args ) {
		this.type = args.type !== undefined ? args.type : config.BRANCH;
		this.inheritance = args.inheritance ? true : false; 
		this.parent = this.type == config.TRUNK ? null : args.parent; 
		this.noise = args.noise !== undefined ? args.noise : this.parent.noise; 
		this.length = null;
		this.baseLength = 0; 
		this.weight = null;
		this.ramifications = [];
		this.init();
	}

	get config() {
		return this.type == config.TRUNK ? config.trunk : config.branch;
	}

	testParent() {
		if( this.weight > config.branch.w.min ) {
			return true;
		}
		return false;
	}

	initTrunk() {
		this.length = config.trunk.l; 
		this.weight = config.trunk.w;
		this.noiseCoord = new THREE.Vector2(Math.random(), Math.random());
	}

	initBranch(){

		// If branch is an inheritance, we copy certain value from the parent
		if( this.inheritance ){

			this.noiseCoord = this.parent.noiseCoord; 
			this.type = this.parent.type
			this.baseLength = this.parent.length;

		} else {

			this.noiseCoord = new THREE.Vector2(Math.random(), Math.random());	

		}

		var prop = Probability.between(config.branch.w.transfer.min, config.branch.w.transfer.max);
		this.weight = prop * this.parent.weight;

		// Calculate the length from the weight
		var ratWL = Probability.between(config.branch.l.wRat.min, config.branch.l.wRat.max);
		this.length = Math.min(this.weight * ratWL, config.branch.l.max);

	}

	// Init variable like length and weight
	init () {
		if( !this.parent )
			this.initTrunk();
		else
			this.initBranch();
		
		this.baseCoord = this.parent == null ? new THREE.Vector3() : this.parent.topCoord;
		this.topCoord = this.getCoordsAtLength(this.length);

		if( this.testParent() ) {
			this.genRamification(); 
		}
	}

	genRamification () {

		var count = Probability.random(this.config.prob.countChild);
		var behaviourSeparation = Probability.random(this.config.prob.behaviourSeparation); 
		var inheritance = behaviourSeparation == "ramification" ? true : false; 
		for(var i=0; i<count; i++) {
			this.ramifications.push(new Branch({
				inheritance: inheritance,
				parent: this
			}));
			inheritance = false; 
		}

	}

	getCoordsAtLength(l) {

		var c = this.config; 

		var xDiff = c.noise.force * l * this.noise.simplex2(c.noise.speed * l + this.noiseCoord.x, this.noiseCoord.y );
		var zDiff = c.noise.force * l * this.noise.simplex2(this.noiseCoord.x, this.noiseCoord.x + c.noise.speed *  l );

		var base = new THREE.Vector3().copy(this.baseCoord);

		base.x += xDiff;
		base.y += l; 
		base.z += zDiff

		return base;

	}

	genCircles(basePoints, precision) {
		var points = [], direction, point, c, angle, crossAngle, cross, baseAngle, incAngle, w, advancement, diffWeight;
		
		// Add base coord at beginning and start loop at one to always calculate the direction vector
		basePoints.unshift(this.baseCoord);
		
		// For each point create multiple point arround in circle
		for(var i=1; i < basePoints.length; i++) {
			
			// If parent exist, calculate the current weight based on advancement in the branch to get a smooth weight transition 
			if(this.parent){
				advancement = (1 - Math.min(1, i*precision / this.length / this.config.transition.w ) ); 
				diffWeight = this.parent.weight - this.weight; 
			} else {
				advancement = (1 - Math.min(1, i*precision / this.length / this.config.transition.w ) );
				diffWeight = this.weight * 0.8; 
			}

			w = advancement * diffWeight + this.weight;


			// Calculate the number of circle's points and the resulted step angle 
			c = Math.floor(2*Math.PI*w/this.config.dist); 
			incAngle = Math.PI*2/c;

			// Create a random offset angle 
			baseAngle = Math.random() * (2*Math.PI/6);
			
			// Direction Vector between last point and current point 
			direction = new THREE.Vector3().copy(basePoints[i]).sub(basePoints[i-1]);
			
			// For each circle's points 
			for(var j=0 ; j < c; j++){

				// Local angle in circle
				angle = baseAngle + incAngle*j;  
				
				// Local coords resulted of local angle 
				point = new THREE.Vector3( 
					Math.cos(angle) * w, 0, Math.sin(angle) * w 
				);

				// Dot product to calculate the angle between direction and local unit vector 
				crossAngle = Math.acos( point.dot( direction ) );
				
				// Cross local with direction to get the rotation axes
				cross = new THREE.Vector3().copy(point).cross( direction )

				// Apply rotation between the 2 vectors around cross axe
				point.applyAxisAngle( cross, crossAngle ).add(basePoints[i]);

				// Add Point 
				points.push(new THREE.Vector3().copy(point));

			}
		}

		return points;
	}


	compute(precision) {
		var points = [];
		var expectedL = Math.floor(this.length / precision);
		for( var i=0; i< expectedL; i++ ) {
			points.push(this.getCoordsAtLength(i*precision))
		}
		points = this.genCircles(points, precision);
		for( var i = 0; i<this.ramifications.length; i++ ){
			points = points.concat(this.ramifications[i].compute(precision))
		}
		return points; 
	}

}

export default Branch;