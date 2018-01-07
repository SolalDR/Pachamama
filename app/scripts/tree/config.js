export default {

	BRANCH : 1,
	TRUNK : 2,
	HERITANCE: 3,

	branch: {
		
		// Noise factor, describe the twist intensity 
		noise : {
			force: 1.5,
			speed: 0.15
		},
		
		// Length
		l: {
			min: 0.1,
			max: 1.5,
			
			// Ratio Length / Weight
			wRat : {
				min: 10, 
				max: 15
			}

		},

		// Weight 
		w: {
			min: 0.05,
			max: 0.5,

			transfer : {
				min: 0.5, 
				max: 0.7
			}
		},

		transition: {
			w: 0.3
		},

		prob: {

			behaviourSeparation: {
			
				division: 0, // At the end of the branch, it split in x new branches 
				ramification: 1 // At the end of the branch, a ramification is created and the master branch continue
			
			},

			countChild: [0, 0, 2, 2, 0, 0] // 0 branch, 1 branch, 2 branches

		}

	},

	trunk: {

		l: 2.5,
		w: 0.5,

		transition: {
			w: 0.3
		},

		// Noise factor null because the trunk is straight
		noise : {
			force: 0.15,
			speed: 0.3
		},

		prob: {

			behaviourSeparation: {

				division: 0.2, // At the end of the branch, it split in x new branches 
				ramification: 1 // At the end of the branch, a ramification is created and the master branch continue
			
			},

			countChild: [0, 0, 0, 7, 0, 0] // 0 branch, 1 branch, 2 branches
		}
	},

	compute: {

		precision: 0.01,
		dist: 0.1,
		pointW: 1.5

	},

	animation: {

		noise: {
			speed: 0.001,  	
			force: 0.1		
		},
		
		hurricane: {
			radius: 2, 		
			turns: 5 		
		},

		durationLeave: 500
	}

}
