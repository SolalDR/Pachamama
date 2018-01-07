function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[i] = arr[i];
  return rv;
}

class Probability {

	static hydrate(key, value) {
		keys.push(i); 
		values.push(arg[i]);
		sum += arg[i]; 
	}

	static random (arg) {
		var sum = 0, key = null, keys = [], values = [];
		
		if ( arg instanceof Array ) arg = toObject(arg); 
		for( var i in arg){
			keys.push(i);	
			values.push(arg[i]);
			sum += arg[i];
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