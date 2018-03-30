//AVG MOVES TO WIN 65

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
AI.MIN_PROB = 0.1;
AI.ZERO_PROB = 0;
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
AI.TILE_EMPTY = 0;
AI.TILE_MISSED = 1;
AI.TILE_HIT = 2;



function getRandom(min, max){
	return parseInt(Math.random()*(max-min))+min;
}

class AIPlayer{
	constructor(board){
		this.board = board;
		this.running = true;
		this.mapSize = 10;
		this.aliveBoatsLength =  [2,3,3,4,5];
		this.delay = 2;


		this.probGrid = this.createProbGrid(this.mapSize); // Probability Grid
		this.initProbilities();
	}
	
	createProbGrid(size){
		var grid = new Array(size);
		
		for(var i = 0; i < size; i++){
			grid[i] = new Array(size);
		}
		
		return grid;
	}
	
	placeBoats(){
		this.board.placeBoat(0,9, 2, true);
		this.board.placeBoat(0,0, 3, false);
		this.board.placeBoat(5,6, 3, true);
		this.board.placeBoat(8,1, 4, false);
		this.board.placeBoat(9,3, 5, false);
	}
	
	initProbilities(){
		for(var x = 0; x < this.mapSize; x++){
			for(var y = 0; y < this.mapSize; y++){
				this.probGrid[x][y] = { type: AI.TILE_EMPTY, probability: AI.MIN_PROB };
			}
		}
		
		for(var index = 0; index < AI.OPENINGS.length; index++){
			var opening = AI.OPENINGS[index];
			this.probGrid[opening.x][opening.y].probability = opening.weight;
		}
		
		this.logProbGrid();
		
	}
	
	logProbGrid(){
		for(var index = 0;  index < this.mapSize; index++){
			console.log(this.probGrid[index]);
		}
		console.log('');
		console.log('');
	}
	
	updateProbilities(){
		for(var x = 0; x < this.mapSize; x++){
			for(var y = 0; y < this.mapSize; y++){
				this.updateProbability(x, y);
			}
		}
	};
	
	updateProbability(x, y){
		var gridPos = this.probGrid[x][y];
		var probability = 0.1;
		
		if(gridPos.type != AI.TILE_EMPTY){
			gridPos.probability = 0;
			return;
		}
		
		//Heuristic 1
		// 
		var neighbors = this.getNeighborPositions(x, y, Math.sqrt(2));
		for(var index = 0; index < neighbors.length; index++){
			var neighbor = this.probGrid[neighbors[index].x][neighbors[index].y];
			if(neighbor.type == AI.TILE_HIT){
				probability += 20 * this.distance(x, y, neighbors[index].x, neighbors[index].y);
			}
		}
		
		gridPos.probability = probability;
		
		//console.log(probability);
		
	}
	
	distance(x1, y1, x2, y2){
		return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1 - y2, 2));
	}
	
	//OPTIMIZE
	getNeighborPositions(x, y, radius){
		var squareRadius = Math.ceil(Math.abs(radius));
		var list = [];
		for(var startX = x-squareRadius; startX < x+squareRadius; startX++){
			for(var startY = y-squareRadius; startY < y+squareRadius; startY++){
				if(this.inBounds(startX, startY) && this.inRadius(x, y, startX, startY, radius)){
					list.push({x: startX, y: startY});
				}
			}
		}
		return list;
	}
	
	inRadius(centerX, centerY, pointX, pointY, radius){
		return (Math.pow(pointX - centerX, 2) + Math.pow(pointY - centerY, 2)) <= (radius * radius); 
	}
	
	inBounds(x, y){
		return x < this.mapSize && y < this.mapSize && y >= 0 && x >= 0;
	}
	
	play(){
		if(this.running == false){
			return false;
		}
		
		
		var self = this;
		setTimeout(function(){self.shoot()}, this.delay);
	}
	
	shoot(){
		this.updateProbilities();
		var bestPosition = this.getBestShot();
		this.board.shootEnemy(bestPosition.x, bestPosition.y);
		
		var shootedTile = this.board.getEnemyTile(bestPosition.x, bestPosition.y);
		//console.log("Shoting: ("+bestPosition.x+","+bestPosition.y+")");
		
		this.probGrid[bestPosition.x][bestPosition.y].probability = 0;
		if(shootedTile.hasBoat()){
			this.probGrid[bestPosition.x][bestPosition.y].type = AI.TILE_HIT;
		}else{
			this.probGrid[bestPosition.x][bestPosition.y].type = AI.TILE_MISSED;
		}
		
		
	}
	
	getBestShot(){
		var maxProb = 0;
		var bestPositionList = [];
		
		for(var x = 0; x < this.mapSize; x++){
			for(var y = 0; y < this.mapSize; y++){
				var prob = this.probGrid[x][y].probability;
				if(prob == maxProb){
					bestPositionList.push({x: x, y:y});
				}else if(prob >= maxProb){
					maxProb = prob;
					bestPositionList = [];
					bestPositionList.push({x: x, y:y});
				}
			}
		}
		
		if(bestPositionList.length == 0){
			console.log("No positon to shoot found.");
		}
		
		
		return bestPositionList[parseInt(Math.random()*bestPositionList.length)];
	}
	
	destroy(){
		this.running = false;
	}
}