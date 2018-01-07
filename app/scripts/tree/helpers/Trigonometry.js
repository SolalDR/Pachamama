class Trigonometry {

	static rotateLooking (local, direction) {

		var angle = Math.acos( local.dot( direction ) );
		var axe = new THREE.Vector3().copy(local).cross(direction);

		return new THREE.Vector3().copy(local).applyAxisAngle(axe, angle);

	}

	static genCircle(nPoints, baseAngle, radius) {
		var angle, point;
		var incAngle = Math.PI*2/nPoints;
		var points = [];

		for(var j=0 ; j < nPoints; j++){				
			angle = baseAngle + incAngle*j;  // Local angle in circle
			point = new THREE.Vector3( Math.cos(angle) * radius, 0, Math.sin(angle) * radius );
			points.push(new THREE.Vector3().copy(point)); // Add Point 
		}
		return points
	}

}

export default Trigonometry;