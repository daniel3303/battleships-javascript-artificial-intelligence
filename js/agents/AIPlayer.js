class AIPlayer{
	constructor(board){
		this.board = board;
		
		//settings
		this.running = true;
		this.mapSize = 10;
		this.aliveBoats =  [2,3,3,4,5];
		this.delay = 10;
		

		//properties grid
		this.utilityGrid = new UtilityGrid(this.mapSize, this.mapSize, this.aliveBoats);
		
		//listen to board events
		this.listenBoard();
	}
	
	placeBoats(){
		while(this.board.placeBoat(Util.randomInt(0, this.mapSize),Util.randomInt(0, this.mapSize), 2, Util.randomBool()) == false);
		while(this.board.placeBoat(Util.randomInt(0, this.mapSize),Util.randomInt(0, this.mapSize), 3, Util.randomBool()) == false);
		while(this.board.placeBoat(Util.randomInt(0, this.mapSize),Util.randomInt(0, this.mapSize), 3, Util.randomBool()) == false);
		while(this.board.placeBoat(Util.randomInt(0, this.mapSize),Util.randomInt(0, this.mapSize), 4, Util.randomBool()) == false);
		while(this.board.placeBoat(Util.randomInt(0, this.mapSize),Util.randomInt(0, this.mapSize), 5, Util.randomBool()) == false);
	}
	
	
	sendUtilityGridToViewer(){
		var viewer = this.board.getEnemyBoardViewer();
		if(viewer != null){
			viewer.showUtilityGrid(this.utilityGrid);
		}
	}
	

	
	play(){
		if(this.running == false){
			return false;
		}
		
		
		var self = this;
		setTimeout(function(){self.shoot()}, this.delay);
	}
	
	shoot(){
		var bestPosition = this.utilityGrid.getBestCellPosition();
		var shotSuccess = this.board.shootEnemy(bestPosition.x, bestPosition.y);

		
		if(!shotSuccess){
			alert("Ocorreu um erro: 0x0001");
		}
		
		var shootedTile = this.board.getEnemyTile(bestPosition.x, bestPosition.y);
		
		//this.probGrid[bestPosition.x][bestPosition.y].probability = 0;
		
		
		//Check if the tile is empty because a callback may set it as BOAT_SUNK
		if(this.utilityGrid.getCell(bestPosition.x, bestPosition.y).getState() == Tile.EMPTY){
			if(shootedTile.hasBoat()){
				this.utilityGrid.getCell(bestPosition.x, bestPosition.y).setState(Tile.HIT);
			}else{
				this.utilityGrid.getCell(bestPosition.x, bestPosition.y).setState(Tile.MISSED);
			}
		}
		this.utilityGrid.update();
		this.sendUtilityGridToViewer();
		
		
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
			var cell = this.utilityGrid.getCell(x, y);
			cell.setState(Tile.BOAT_SUNK);
			
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
		
		this.utilityGrid.update();
		
		
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
