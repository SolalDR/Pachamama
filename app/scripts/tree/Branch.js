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
		
		this.length = 0; // Local length
		this.baseLength = this.parent ? this.parent.totalLength : 0; // Global length before the branch

		this.weight = null;
		this.ramifications = [];

		this.init();
	}

	get totalLength() {
		return this.length + this.baseLength;
	}

	/**
	 * Init length, weight, noiseCoords, boundaries
	 */
	init () {
		// If branch is an inheritance, we copy certain value from the parent
		this.noiseCoord = this.inheritance ? this.parent.noiseCoord : new THREE.Vector2(Math.random(), Math.random());	

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

	getForceAtLength(l) {
		if( this.inheritance ){
			var endF = this.parent.getForceAtLength(this.parent.length); 
			return Math.min(2, this.config.noise.force * (endF + l) ) 
		}
		return Math.min(2, this.config.noise.force * l)
	}

	getGlobalLength(l) {
		return this.baseLength + l;
	}

	getNoiseCoordAtLength(l){
		return {
			x: new THREE.Vector2( this.config.noise.speed * l + this.noiseCoord.x,  this.noiseCoord.y  ),
			z: new THREE.Vector2( this.noiseCoord.x, this.noiseCoord.y + this.config.noise.speed * l )
		}
	}

	/**
	 * Calculate the position of a point in the branch
	 * @param {integer} l - the advancement
	 * @returns {Vector3} 
	 */
	getCoordsAtLength(l) {
		var c = this.config;

		var gF = this.getForceAtLength(l); // Global force
		var gL = this.getGlobalLength(l);  // Global length
		var n = this.getNoiseCoordAtLength(gL);


		var xDiff = gF * this.noise.simplex2( n.x.x, n.x.y );
		var zDiff = gF * this.noise.simplex2( n.z.x, n.z.y );

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
		var points = [], weights = [];
		var expectedL = Math.floor(this.length / precision);
		for( var i=0; i< expectedL; i++ ) {
			points.push(this.getCoordsAtLength(i*precision))
			weights.push(this.weight); 
		}

		points = this.genCircles(points, precision);
		for( var i = 0; i<this.ramifications.length; i++ ){
			var result = this.ramifications[i].compute(precision); 
			
			points = points.concat(result.vertices);
			weights = weights.concat(result.weights);
		}
		return {
			vertices: points,
			weights: weights
		}; 
	}

}

export default Branch;