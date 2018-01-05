class Probability {

	static random (arg) {
		
		var sum = 0;
		var key = null; 
		var keys = []; 
		var values = [];
		
		if ( arg instanceof Array ) {
			for(var i=0; i<arg.length; i++){
				keys.push(i); 
				values.push(arg[i]);
				sum += arg[i]; 
			}
		}

		if( arg instanceof Object ){
			for( var i in arg ){
				keys.push(i); 
				values.push(arg[i]);
				sum+= arg[i];
			}
		}

		var result = Math.random() * sum; 

		for( var i=0, incSum= 0; i < values.length; i++ ){
			incSum += values[i]; 
			if( result < incSum) {
				key = keys[i];
				break; 
			}
		}

		return key; 

	}


	static between (a, b) {
		return (b - a)*Math.random() + a;
	}

	
}


export default Probability;