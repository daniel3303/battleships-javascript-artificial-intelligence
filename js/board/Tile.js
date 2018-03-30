class Tile{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.shot = false; //tells if this tile was already shot
		this.boat = null;
	}
	
	shoot(){
		if(this.shot == false){
			this.shot = true;
			this.onShot();
			return true;
		}else{
			return false;
		}
	}
	
	onShot(){
		if(this.hasBoat() == true){
			this.boat.onShot();
		}
	}
	
	getX(){
		return this.x;
	}
	
	getY(){
		return this.y;
	}
	
	hasBoat(){
		if(this.boat == null){
			return false;
		}
		return true;
	}
	
	canReceiveBoat(){
		return !this.hasBoat();
	}
	
	receiveBoat(boat){
		if(!this.canReceiveBoat()){
			console.log("Error!!! This tile can not receive a boat");
			return false;
		}
		
		this.boat = boat;
		
		return true;
	}
	
	isShot(){
		return this.shot;
	}
	
	getBoat(){
		return this.boat;
	}
	
}
Tile.EMPTY = 0;
Tile.MISSED = 1;
Tile.HIT = 2;
Tile.BOAT_SUNK = 3;