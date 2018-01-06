var Vector3 = THREE.Vector3; 
var Vector2 = THREE.Vector2;
var Vector4 = THREE.Vector4;

class Random {


	/*
	* Generate a random point in a box (delimited by a set a boundaries)
	* @param {Object} boudaries { x : { min: ... , max: ... }, y : { min: ... , max: ... }, z : { min: ... , max: ... } }
	* @return {THREE.Vector3} 
	*/
	static randomInBox(boundaries) {
		return new Vector3(
			(boundaries.x.max - boundaries.x.min) * Math.random() + boundaries.x.min, 
			(boundaries.y.max - boundaries.y.min) * Math.random() + boundaries.y.min, 
			(boundaries.z.max - boundaries.z.min) * Math.random() + boundaries.z.min
		)
	}

	/*
	*/
	static randomInCircle(radius) {
		var angle = Math.random() * 2*Math.PI;
		return new Vector2(
			Math.cos(angle) * radius,
			Math.sin(angle) * radius
		);
	}


	static inSphere(radius) {
		var theta = 2 * Math.PI * Math.random();
		var phi = Math.acos(2 * Math.random() - 1);
		return new Vector3(
			radius * Math.sin(phi) * Math.cos(theta),
			radius * Math.sin(phi) * Math.sin(theta),
			radius * Math.cos(phi)
		);
	}


	static randomInDisc(radius) {
		var angle = Math.random() * 2*Math.PI;
		return new Vector3(
			Math.cos(angle) * radius,
			0,
			Math.sin(angle) * radius
		);
	}

	

	static betweenNumber (a, b) {
		return (b - a)*Math.random() + a;
	}

	static loopRandomInDisc(n, radius) {
		var nums = [];
		for(var i=0; i<n; i++){
			nums.push(Random.randomInDisc(radius));
		}
		return nums;
	}

	static loopBetweenNumber(n, a, b) {
		var nums = [];
		for(var i=0; i<n; i++){
			nums.push(Random.betweenNumber(a, b));
		}
		return nums;
	}

}


export default Random;