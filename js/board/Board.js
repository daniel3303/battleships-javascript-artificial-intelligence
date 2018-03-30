class Board{
	constructor(selector, numBoats){
		this.wrapper = document.querySelector(selector);
		this.tileManager = new BoardTileManager(this.wrapper);
		this.boats = [];
		this.numBoats = numBoats;
		this.eventDispatcher = null;
		this.allBoatsSunk = false;
		this.allBoatsSunkclosures = [];
		this.onBoatSunkclosures = [];
		this.allBoatsPlacedClosures = [];
	}
	
	getTileManager(){
		return this.tileManager;
	}
	
	shoot(x, y){
		if(this.allBoatsSunk == true || this.boats.length < this.numBoats){
			return false;
		}
		
		var success = this.tileManager.shoot(x, y);
		this.checkSunkBoats();
		
		return success;
	}
	
	checkSunkBoats(){
		var allSunk = true
		this.boats.forEach(function(boat){
			if(boat.isSunk() == false){
				allSunk = false;
			}
		});
		this.allBoatsSunk = allSunk;
		
		if(allSunk == true){
			this.triggerOnAllBoatsSunk();
		}
	}
	
	triggerOnAllBoatsSunk(){
		this.allBoatsSunkclosures.forEach(function(closure){
			closure();
		});
	}
	
	allBoatsSunk(){
		return allBoatsSunk;
	}
	
	getTiles(){
		return this.tileManager.getTiles();
	}
	
	//return true if the boat was successfully placed
	placeBoat(boat){
		if((boat instanceof Boat) == false){
			throw new InvalidArgumentException("boat must be an Instance of Boat");
		}
		
		if(this.tileManager.placeBoat(boat) == true){
			this.boats.push(boat);
			
			//Register the on sunk closure
			var self = this;
			boat.onSunk(function(boat){
				self.triggerOnBoatSunk(boat);
			});
			
			if(BattleShips.getInstance().requiredBoats == this.boats.length){
				this.triggerOnAllBoatsPlaced();
			}
			return true;
		}
		return false;
		
				
	}
	
	triggerOnBoatSunk(boat){
		this.onBoatSunkclosures.forEach(function(closure){
			closure(boat);
		});
	}
	
	triggerOnAllBoatsPlaced(){
		this.allBoatsPlacedClosures.forEach(function(closure){
			closure();
		});
	}
	
	
	
	
	onBoatSunk(closure){
		this.onBoatSunkclosures.push(closure);
	}
	
	onAllBoatsSunk(closure){
		this.allBoatsSunkclosures.push(closure);
	}
	
	onAllBoatsPlaced(closure){
		this.allBoatsPlacedClosures.push(closure);
	}
	
	//Returns true whenever the board is waiting for the player to place the boats
	isWaitingForBoats(){
		return this.boats.length < this.numBoats
	}
	
	getTiles(){
		return this.tileManager.getTiles();
	}
	
	getTile(x, y){
		return this.tileManager.getTile(x, y);
	}
	
	
	
}