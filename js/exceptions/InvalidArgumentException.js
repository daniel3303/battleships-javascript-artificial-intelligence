class TileNotFoundException extends Exception{
	constructor(x, y){
		super("Tile ("+x+","+y+") not found.");
	}
}