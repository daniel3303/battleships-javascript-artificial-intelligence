class BoardTileManager{
	constructor(){		
		//Board options
		this.boardWidth = 10;
		this.boardHeight = 10;
		this.tiles = [];
		
		this.createTiles();
	}

	createTiles(){
		var tile = null;
		for(var y = this.boardHeight-1; y >= 0; y--){
			for(var x = 0; x < this.boardHeight; x++){
				tile = new Tile(x, y);		
				this.tiles.push(tile);
			}
		}
	}
	
	placeBoat(boat){
		if(this.canPlaceBoat(boat) == false){
			return false;
		}
		
		return this.doPlaceBoat(boat);		
	}
	
	canPlaceBoat(boat){
		var x = boat.getX();
		var y = boat.getY();
		var length = boat.getLength();
		
		var incrementX = 0;
		var incrementY = 0;
	
		if(boat.isHorizontal() == true){
			incrementX = 1;
		}else{
			incrementY = 1;
		}
		
		for(var i = 0; i < length; i++){
			if(this.tileCanReceiveBoat(x, y) == false){
				return false;
			}
				
			x += incrementX;
			y += incrementY;
		}
		
		return true;
		
	}
	
	doPlaceBoat(boat){
		var x = boat.getX();
		var y = boat.getY();
		var length = boat.getLength();
		
		var incrementX = 0;
		var incrementY = 0;
	
		if(boat.isHorizontal() == true){
			incrementX = 1;
		}else{
			incrementY = 1;
		}
		
		for(var i = 0; i < length; i++){
			var tile = this.getTile(x, y);
			tile.receiveBoat(boat);
				
			x += incrementX;
			y += incrementY;
		}
		
		return true;
		
	}
	
	inBounds(x, y){
		return x < this.boardWidth && y < this.boardHeight && y >= 0 && x >= 0;
	}
	
	
	tileCanReceiveBoat(x, y){
		if(this.inBounds(x, y) == false){
			return false;
		}
		var tile = this.getTile(x, y);
		return tile.canReceiveBoat();
	}
	
	shoot(x, y){
		if(this.inBounds(x, y) == false){
			console.log("invalid shoot");
			return false;
		}
		var tile = this.getTile(x,y);
		return tile.shoot();
	}
	
	//optimize!!!
	getTile(x, y){
		var tile = null;
		this.tiles.forEach(function(elem){
			if(elem.getX() == x && elem.getY() == y){
				tile = elem;
			}
		});
		
		if(tile != null){
			return tile;
		}else{
			throw new TileNotFoundException(x, y);
		}
	}
	
	getTiles(){
		return this.tiles;
	}
	
}