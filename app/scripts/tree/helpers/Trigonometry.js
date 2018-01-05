class Trigonometry {

	rotateLooking (local, direction) {

		var angle = Math.acos( local.dot( direction ) );
		var axe = new THREE.Vector3().copy(local).cross(direction);

		return new THREE.Vector3().copy(local).applyAxisAngle(axe, angle);

	}

}

export default Trigonometry;