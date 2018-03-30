/**
* This heuristic prefers tiles that are in line with other hinted tiles. Basically if we hit a boat we preference
* to finish destroying that boat before going further.
*/
class ThirdHeuristic extends AbstractHeuristic{
	constructor(utilityGrid){
		super(utilityGrid);
		//Default weight
		this.setWeight(500);
	}
	
	//Calculates the value of this heuristic for the position (x, y) of the battle ship grid.
	getUtility(x, y){
		var inlineScore = 0;
		
		//horizontal left
		for(var offset = 1; offset <= x; offset++){
			if(this.inBounds(x-offset, y) && this.utilityGrid[x-offset][y].getState() == Tile.HIT){
				inlineScore += 0.5;
			}else{
				break;
			}			
		}
		
		
		//horizontal right
		for(var offset = 1; offset < this.utilityGrid.length - x; offset++){
			if(this.inBounds(x+offset, y) && this.utilityGrid[x+offset][y].getState() == Tile.HIT){
				inlineScore += 0.5;
			}else{
				break;
			}
		}
		
		//vertical bottom
		for(var offset = 1; offset <= y; offset++){
			if(this.inBounds(x, y-offset) && this.utilityGrid[x][y-offset].getState() == Tile.HIT){
				inlineScore += 0.5;
			}else{
				break;
			}			
		}
		
		
		//vertical up
		for(var offset = 1; offset < this.utilityGrid[0].length - y; offset++){
			if(this.inBounds(x, y+offset) && this.utilityGrid[x][y+offset].getState() == Tile.HIT){
				inlineScore += 0.5;
			}else{
				break;
			}			
		}	
		return inlineScore * this.weight;
		
	}
}