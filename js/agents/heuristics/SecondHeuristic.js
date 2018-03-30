/**
* This heuristic prefers tiles that allow a larger number of boats in different positions.
*/
class SecondHeuristic extends AbstractHeuristic{
	constructor(utilityGrid, aliveBoats){
		super(utilityGrid);
		this.aliveBoats = aliveBoats;
		//Default weight
		this.setWeight(10);
	}
	
	//Calculates the value of this heuristic for the position (x, y) of the battle ship grid.
	getUtility(x, y){
		var fTLeft = 0;
		var fTRight = 0;
		var fTUp = 0;
		var fTDown = 0;
		var totalFit = 0; //total num different ways boats fit in this tile
		
		//left
		for(var offset = 1; offset <= x; offset++){
			if(this.inBounds(x-offset, y) && this.utilityGrid[x-offset][y].getState() == Tile.EMPTY){
				fTLeft++;
			}else{
				break;
			}			
		}
		//right
		for(var offset = 1; offset < this.utilityGrid.length - x; offset++){
			if(this.inBounds(x+offset, y) && this.utilityGrid[x+offset][y].getState() == Tile.EMPTY){
				fTRight++;
			}else{
				break;
			}
		}
		//down
		for(var offset = 1; offset <= y; offset++){
			if(this.inBounds(x, y-offset) && this.utilityGrid[x][y-offset].getState() == Tile.EMPTY){
				fTDown++;
			}else{
				break;
			}			
		}
		//up
		for(var offset = 1; offset < this.utilityGrid[0].length - y; offset++){
			if(this.inBounds(x, y+offset) && this.utilityGrid[x][y+offset].getState() == Tile.EMPTY){
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
		
		return totalFit * this.weight;
		
	}
}