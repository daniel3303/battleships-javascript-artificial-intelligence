class AIPlayer{
	constructor(board){
		this.board = board;
		
		//settings
		this.running = true;
		this.mapSize = 10;
		this.aliveBoats =  [2,3,3,4,5];
		this.delay = 1;
		

		//properties grid
		this.probGrid = this.createProbGrid(this.mapSize); // Probability Grid
		this.initProbilities();
		
		//listen to board events
		this.listenBoard();
	}
	
	createProbGrid(size){
		var grid = new Array(size);
		
		for(var i = 0; i < size; i++){
			grid[i] = new Array(size);
		}
		
		return grid;
	}
	
	placeBoats(){
		while(this.board.placeBoat(Util.randomInt(0, this.mapSize),Util.randomInt(0, this.mapSize), 2, Util.randomBool()) == false);
		while(this.board.placeBoat(Util.randomInt(0, this.mapSize),Util.randomInt(0, this.mapSize), 3, Util.randomBool()) == false);
		while(this.board.placeBoat(Util.randomInt(0, this.mapSize),Util.randomInt(0, this.mapSize), 3, Util.randomBool()) == false);
		while(this.board.placeBoat(Util.randomInt(0, this.mapSize),Util.randomInt(0, this.mapSize), 4, Util.randomBool()) == false);
		while(this.board.placeBoat(Util.randomInt(0, this.mapSize),Util.randomInt(0, this.mapSize), 5, Util.randomBool()) == false);
	}
	
	initProbilities(){
		for(var x = 0; x < this.mapSize; x++){
			for(var y = 0; y < this.mapSize; y++){
				this.probGrid[x][y] = { type: AIPlayer.TILE_EMPTY, probability: AIPlayer.MIN_PROB };
			}
		}
		
		//this.logProbGrid();
		
	}
	
	logProbGrid(){
		for(var index = this.mapSize-1;  index >= 0; index--){
			var row = "";
			for(var index2 = 0; index2 < this.mapSize; index2++){
				row += "("+this.probGrid[index2][index].probability + " / "+this.probGrid[index2][index].type+")"+" - ";
			}
			console.log(row+" <- "+index);
		}
		console.log('');
		console.log('');
	}
	
	updateProbabilities(){
		for(var x = 0; x < this.mapSize; x++){
			for(var y = 0; y < this.mapSize; y++){
				this.updateProbability(x, y);
			}
		}
		
		this.showProbsOnBoard();
	};
	
	showProbsOnBoard(){
		var viewer = this.board.getEnemyBoardViewer();
		if(viewer != null){
			viewer.updateProbabilities(this.probGrid);
		}
	}
	
	updateProbability(x, y){
		var gridPos = this.probGrid[x][y];
		var probability = 0.1;
		
		if(gridPos.type != AIPlayer.TILE_EMPTY){
			gridPos.probability = 0;
			return;
		}

		
		//Heuristic 2
		//Prefer tiles that are in line with more than one hit
		var heuristicOneWeight = 1000; //Very important heuristic
		var inlineScore = this.getInlineScore(x, y);
		probability += heuristicOneWeight * inlineScore;
		
		//Heuristic 3
		//Prefer tiles where more boats fit in
		var heuristicTwoWeight = 10;
		var combinationScore = this.getNumCombinations(x, y);
		probability += combinationScore * heuristicTwoWeight;
		
		
		gridPos.probability = probability;
		
	}
	
	getNumCombinations(x, y){
		var fTLeft = 0;
		var fTRight = 0;
		var fTUp = 0;
		var fTDown = 0;
		var totalFit = 0; //total num different ways boats fit in this tile
		
		//left
		for(var offset = 1; offset <= x; offset++){
			if(this.inBounds(x-offset, y) && this.probGrid[x-offset][y].type == AIPlayer.TILE_EMPTY){
				fTLeft++;
			}else{
				break;
			}			
		}
		//right
		for(var offset = 1; offset < this.mapSize - x; offset++){
			if(this.inBounds(x+offset, y) && this.probGrid[x+offset][y].type == AIPlayer.TILE_EMPTY){
				fTRight++;
			}else{
				break;
			}
		}
		//down
		for(var offset = 1; offset <= y; offset++){
			if(this.inBounds(x, y-offset) && this.probGrid[x][y-offset].type == AIPlayer.TILE_EMPTY){
				fTDown++;
			}else{
				break;
			}			
		}
		//up
		for(var offset = 1; offset < this.mapSize - y; offset++){
			if(this.inBounds(x, y+offset) && this.probGrid[x][y+offset].type == AIPlayer.TILE_EMPTY){
				fTUp++;
			}else{
				break;
			}			
		}
		
		for(var index = 0; index < this.aliveBoats.length; index++){
			var boatLenght = this.aliveBoats[index];
			
			//horizontal
			var leftShitfs = Util.clamp(fTLeft, 0, boatLenght);
			var rightShitfs = Util.clamp(fTRight, 0, boatLenght);
			var numCombinations = Math.max(((leftShitfs + rightShitfs + 1) - boatLenght) + 1, 0);
			totalFit += numCombinations;
			
			//vertical
			var upShitfs = Util.clamp(fTUp, 0, boatLenght);
			var downShitfs = Util.clamp(fTDown, 0, boatLenght);
			var numCombinations = Math.max(((upShitfs + downShitfs + 1) - boatLenght) + 1, 0);
			totalFit += numCombinations;
		}
		
		return totalFit;
		
		
		
		
	}
	
	getInlineScore(x, y){
		var inlineScore = 0;
		
		//horizontal left
		for(var offset = 1; offset <= x; offset++){
			if(this.inBounds(x-offset, y) && this.probGrid[x-offset][y].type == AIPlayer.TILE_HIT){
				inlineScore += 0.5;
			}else{
				break;
			}			
		}
		
		
		//horizontal right
		for(var offset = 1; offset < this.mapSize - x; offset++){
			if(this.inBounds(x+offset, y) && this.probGrid[x+offset][y].type == AIPlayer.TILE_HIT){
				inlineScore += 0.5;
			}else{
				break;
			}
		}
		
		//vertical left
		for(var offset = 1; offset <= y; offset++){
			if(this.inBounds(x, y-offset) && this.probGrid[x][y-offset].type == AIPlayer.TILE_HIT){
				inlineScore += 0.5;
			}else{
				break;
			}			
		}
		
		
		//vertical right
		for(var offset = 1; offset < this.mapSize - y; offset++){
			if(this.inBounds(x, y+offset) && this.probGrid[x][y+offset].type == AIPlayer.TILE_HIT){
				inlineScore += 0.5;
			}else{
				break;
			}			
		}	
		return inlineScore;
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
		var bestPosition = this.getBestShot();
		var shotSuccess = this.board.shootEnemy(bestPosition.x, bestPosition.y);
		
		if(!shotSuccess){
			alert("Ocorreu um erro: 0x0001");
		}
		
		var shootedTile = this.board.getEnemyTile(bestPosition.x, bestPosition.y);
		//console.log("Shoting: ("+bestPosition.x+","+bestPosition.y+")");
		
		this.probGrid[bestPosition.x][bestPosition.y].probability = 0;
		
		
		//Check if the tile is empty because a callback may set it as BOAT_SUNK
		if(this.probGrid[bestPosition.x][bestPosition.y].type == AIPlayer.TILE_EMPTY){
			if(shootedTile.hasBoat()){
				this.probGrid[bestPosition.x][bestPosition.y].type = AIPlayer.TILE_HIT;
			}else{
				this.probGrid[bestPosition.x][bestPosition.y].type = AIPlayer.TILE_MISSED;
			}
		}
		this.updateProbabilities();
		
		
	}
	
	onEnemyBoatSunk(boat){
		var x = boat.getX();		
		var y = boat.getY();
		var incrementX = 0;
		var incrementY = 0;
		
		if(boat.isHorizontal()){
			incrementX = 1;
		}else{
			incrementY = 1;
		}
		
		for(var offset = 0; offset < boat.getLength(); offset++){
			this.probGrid[x][y].type = AIPlayer.TILE_BOAT_SUNK;
			x += incrementX;
			y += incrementY;
		}
		
		//Update alive boats
		for(var index = 0; index < this.aliveBoats.length; index++){
			if(this.aliveBoats[index] == boat.getLength()){
				this.aliveBoats.splice(index, 1);
				break;
			}
		}
		
		this.updateProbabilities();
		
		
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
	
	pause(){
		this.running = false;
	}
	
	resume(){
		this.running = true;
		this.play();
	}
	
	setDelay(delay){
		this.delay = parseInt(delay) || 1000;
	}
	
	listenBoard(){
		var self = this;
		this.board.onEnemyBoatSunk(function(boat){
			self.onEnemyBoatSunk(boat);
		});
	}
	
	printProbs(){
		this.logProbGrid();
	}
	
}
AIPlayer.MIN_PROB = 0.1;
AIPlayer.ZERO_PROB = 0;
AIPlayer.TILE_EMPTY = 0;
AIPlayer.TILE_MISSED = 1;
AIPlayer.TILE_HIT = 2;
AIPlayer.TILE_BOAT_SUNK = 3;