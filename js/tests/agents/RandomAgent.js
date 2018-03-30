var AI = {}
AI.PROB_WEIGHT = 5000; // arbitrarily big number
// how much weight to give to the opening book's high probability cells
AI.OPEN_HIGH_MIN = 20;
AI.OPEN_HIGH_MAX = 30;
// how much weight to give to the opening book's medium probability cells
AI.OPEN_MED_MIN = 15;
AI.OPEN_MED_MAX = 25;
// how much weight to give to the opening book's low probability cells
AI.OPEN_LOW_MIN = 10;
AI.OPEN_LOW_MAX = 20;
// Amount of randomness when selecting between cells of equal probability
AI.RANDOMNESS = 0.1;
// AI's opening book.
// This is the pattern of the first cells for the AI to target
AI.OPENINGS = [
	{'x': 7, 'y': 3, 'weight': getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX)},
	{'x': 6, 'y': 2, 'weight': getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX)},
	{'x': 3, 'y': 7, 'weight': getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX)},
	{'x': 2, 'y': 6, 'weight': getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX)},
	{'x': 6, 'y': 6, 'weight': getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX)},
	{'x': 3, 'y': 3, 'weight': getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX)},
	{'x': 5, 'y': 5, 'weight': getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX)},
	{'x': 4, 'y': 4, 'weight': getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX)},
	{'x': 0, 'y': 8, 'weight': getRandom(AI.OPEN_MED_MIN, AI.OPEN_MED_MAX)},
	{'x': 1, 'y': 9, 'weight': getRandom(AI.OPEN_HIGH_MIN, AI.OPEN_HIGH_MAX)},
	{'x': 8, 'y': 0, 'weight': getRandom(AI.OPEN_MED_MIN, AI.OPEN_MED_MAX)},
	{'x': 9, 'y': 1, 'weight': getRandom(AI.OPEN_HIGH_MIN, AI.OPEN_HIGH_MAX)},
	{'x': 9, 'y': 9, 'weight': getRandom(AI.OPEN_HIGH_MIN, AI.OPEN_HIGH_MAX)},
	{'x': 0, 'y': 0, 'weight': getRandom(AI.OPEN_HIGH_MIN, AI.OPEN_HIGH_MAX)}
];

function getRandom(min, max){
	return parseInt(Math.random()*(max-min))+min;
}

class RandomAgent{
	constructor(board){
		this.board = board;
		this.running = true;
		this.mapSize = 10;
		this.aliveBoatsLength =  [2,3,3,4,5];


		this.probGrid = [this.mapSize, this.mapSize]; // Probability Grid
		this.initProbilities();
		//this.updateProbilities();
	}
	
	placeBoats(){
		this.board.placeBoat(0,0, 2, true);
		this.board.placeBoat(0,1, 3, true);
		this.board.placeBoat(0,2, 3, true);
		this.board.placeBoat(0,3, 4, true);
		this.board.placeBoat(0,4, 5, true);
	}
	
	initProbilities(){
		for(var x = 0; x < this.mapSize; x++){
			for(var y = 0; y < this.mapSize; y++){
				
			}
		}
	}
	
	play(){
		if(this.running == false){
			return false;
		}
		
		
		var self = this;
		setTimeout(function(){self.shoot()}, 2);
	}
	
	shoot(){
		while(this.board.shootEnemy(parseInt(Math.random()*10), parseInt(Math.random()*10)) == false){};
	}
	
	destroy(){
		this.running = false;
	}
}