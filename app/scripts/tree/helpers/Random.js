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


	static randomInDisc(minRadius, maxRadius) {
		var angle = Math.random() * 2*Math.PI;
		return new Vector2(
			Math.cos(angle) * radius,
			Math.sin(angle) * radius
		);
	}


	static betweenNumber (a, b) {
		return (b - a)*Math.random() + a;
	}

}


export default Random;