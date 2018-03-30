class BoardFacade{
	constructor(selector){	
		var numBoats = 5;
		this.board = new Board(selector, numBoats);
		this.enemyBoard = null;
		this.eventDispatcher = null;
		this.myTurn = false;
		this.numMoves = 0;
		
		//On change
		this.onChangeClousures = [];
	}
	
	setEnemyBoard(board){
		this.enemyBoard = board;
	}
	
	shootEnemy(x, y){
		if(this.myTurn == true){
			var success = this.enemyBoard.shoot(x, y);
			if(success){
				this.closeTurn();
				return true;
			}
			return false;
		}
		return false;
	}
	
	shoot(x, y){ //self shoot
		if(this.myTurn == true || BattleShips.getInstance().isGameStarted() == false){
			return false;
		}
		x = parseInt(x);
		y = parseInt(y);
		
		var success = false;
		
		if(this.board.shoot(x, y) == true){
			this.myTurn = true;
			success = true;
		}
		
		this.triggerOnChange();
		
		return success;
	}
	
	closeTurn(){
		this.myTurn = false;
		this.numMoves++;
		this.enemyBoard.play();
	}
	
	getNumMoves(){
		return this.numMoves;
	};
	
	placeBoat(x, y, length, horizontal){
		var boat = new Boat(x, y, length);
		boat.setHorizontal(horizontal);
		
		
		var success = this.board.placeBoat(boat);
		
		this.triggerOnChange();
		
		return success;
	}
	
	play(){ //called when is my turn to play
	} 
	
	
	//Events
	onAllBoatsSinked(clousure){
		this.board.onAllBoatsSunk(clousure);
	}
	
	onBoatSunk(clousure){
		this.board.onBoatSunk(clousure);
	}
	
	onAllBoatsPlaced(clousure){
		this.board.onAllBoatsPlaced(clousure);
	}
	
	
	onEnemyBoatSunk(clousure){
		this.enemyBoard.onBoatSunk(clousure);
	}
	
	//Getters
	getTiles(){
		return this.board.getTiles();
	}
	
	onChange(clousure){
		this.onChangeClousures.push(clousure);
	}
	
	triggerOnChange(){
		this.onChangeClousures.forEach(function(closure){
			closure();
		});
	}
	
	isWaitingForBoats(){
		return this.board.isWaitingForBoats();
	}
	
	setEnemy(board){
		this.enemyBoard = board;
	}
	
	getTile(x, y){
		return this.board.getTile(x,y);
	}
	
	getEnemyTile(x, y){
		if(this.enemyBoard != null){
			try{
				return this.enemyBoard.getTile(x, y);
			}catch(err){
				console.log("ERR: Invalid map position. "+err);
			}
		}else{
			return null;
		}
		
	}
	
	
	//sets this player as the one who starts the game
	setGameStarter(){
		this.myTurn = true;
		this.play();
	}
	
	isMyTurn(){
		return this.myTurn;
	}
	
	destroy(){}
	
	//Method run after setting the enemy of both boards
	init(){}
}