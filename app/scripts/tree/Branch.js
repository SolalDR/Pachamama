import config from "./config.js"
import Probability from "./helpers/Probability.js"
import Random from "./helpers/Random.js"
import Trigonometry from "./helpers/Trigonometry.js"


class Branch {

	/**
	 * @constructor
	 */
	constructor ( args ) {
		this.type = args.type !== undefined ? args.type : config.BRANCH;
		this.inheritance = args.inheritance ? true : false; 
		this.parent = args.parent ? args.parent : null ; 
		
		this.noise = args.noise !== undefined ? args.noise : this.parent.noise; 
		
		this.length = null;
		this.weight = null;
		this.ramifications = [];

		this.init();
	}

	/**
	 * Init length, weight, noiseCoords, boundaries
	 */
	init () {
		// If branch is an inheritance, we copy certain value from the parent
		this.noiseCoord = new THREE.Vector2(Math.random(), Math.random());	

		var prop = Probability.between(config.branch.w.transfer.min, config.branch.w.transfer.max);
		this.weight = prop * this.parent.weight;

		// Calculate the length from the weight
		var ratWL = Probability.between(config.branch.l.wRat.min, config.branch.l.wRat.max);
		this.length = Math.min(this.weight * ratWL, config.branch.l.max);

		this.refreshBoundaries();
		if( this.canHaveChild ) this.genRamification(); 
	}

	/**************************
	*		  Getters
	**************************/

	get config() {
		return this.type == config.TRUNK ? config.trunk : config.branch;
	}

	get canHaveChild() {
		if( this.weight > config.branch.w.min ) {
			return true;
		}
		return false;
	}

	/**
	 * Calculate the position of a point in the branch
	 * @param {integer} l - the advancement
	 * @returns {Vector3} 
	 */
	getCoordsAtLength(l) {
		var c = this.config; 

		var xDiff = c.noise.force * l * this.noise.simplex2(c.noise.speed * l + this.noiseCoord.x, this.noiseCoord.y );
		var zDiff = c.noise.force * l * this.noise.simplex2(this.noiseCoord.x, this.noiseCoord.x + c.noise.speed *  l );

		var point = new THREE.Vector3().copy(this.baseCoord);

		point.x += xDiff;
		point.y += l; 
		point.z += zDiff

		return point;
	}
	

	/**************************
	*		Conception
	**************************/

	/**
	 * Set the boundaries of the branch (base and top coords)
	 */
	refreshBoundaries() {
		this.baseCoord = this.parent == null ? new THREE.Vector3() : this.parent.topCoord;
		this.topCoord = this.getCoordsAtLength(this.length);
	}

	/**
	 * Recursively update the boundaries of the branch and its ramifications
	 */
	update() {
		this.refreshBoundaries();
		for(var i = 0; i < this.ramifications.length; i++){
			this.ramifications[i].update();
		}
	}

	/**
	 * Create the ramification
	 */
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

	/**************************
	*		Accessibility
	**************************/

	map(callback){
		for (var i=0; i < this.ramifications.length; i++){
			callback(this);
			this.ramifications[i].map(callback);
		}
	}

	/**************************
	*		Computation
	**************************/

	/**
	 * Gen circle arround a point 
	 * @param {Vector3[]} basePoints - the array of all the Vector3 representing a branch
	 * @param {integer} precision
	 * @returns {Vector3[]}
	 */
	genCircles(basePoints, precision) {
		var points = [], direction, c, baseAngle, w, advancement, diffWeight;
		basePoints.unshift(this.baseCoord); // Avoid basePoints[i-1] not defined for first occurence 
		
		// For each point create multiple point arround in circle
		for(var i=1; i < basePoints.length; i++) {
			
			// calculate a smooth weight transition
			advancement = (1 - Math.min(1, i*precision / this.length / this.config.transition.w ) ); 
			diffWeight = this.parent ? this.parent.weight - this.weight : this.weight * 0.8; 
			w = advancement * diffWeight + this.weight;

			// Calculate the number of circle's points and the resulted step angle 
			c = Math.floor(2*Math.PI*w/config.compute.dist); 
			
			// Create a random offset angle 
			baseAngle = Math.random() * (2*Math.PI/6);
			// Direction Vector between last point and current point 
			direction = new THREE.Vector3().copy(basePoints[i]).sub(basePoints[i-1]);
			
			// For each circle's points 
			var circlePoints = Trigonometry.genCircle(c, baseAngle, w);
			circlePoints.map(function(point){
				point = Trigonometry.rotateLooking(point, direction);
				point.add(basePoints[i]);
				points.push(point);
			})

		}
		return points;
	}

	/**
	 * Calculate the position of each point on a branch 
	 * @param {integer} precision - The precision define the increment size so the resolution to.
	 * @returns {Vector3[]}
	 */
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