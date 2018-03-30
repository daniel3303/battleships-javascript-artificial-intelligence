class UtilityGrid{
	constructor(width, height, aliveBoats){
		this.width = parseInt(width);
		this.height = parseInt(height);
		this.aliveBoats = aliveBoats; //To remove from here (abstract with new class)
		
		this.utilityGrid = this.initializeGrid();
		this.heuristics = [];
		
		//Caching max known utility
		this.maxUtility = 0;
		
		this.heuristics.push(new FirstHeuristic(this.utilityGrid));
		this.heuristics.push(new SecondHeuristic(this.utilityGrid, this.aliveBoats));
		this.heuristics.push(new ThirdHeuristic(this.utilityGrid, this.aliveBoats));
		this.update();
	}
	
	addHeuristic(heuristic){
		if((heuristic instanceof AbstractHeuristic) == false){
			throw InvalidArgumentException("'heuristic' must be of type AbstractHeuristic.");
		}
		this.heuristics.push(heuristic);
	}
	
	initializeGrid(){
		//Allocates the space
		var grid = new Array(this.width);
		for(var i = 0; i < this.width; i++){
			grid[i] = new Array(this.height);
		}
		
		//Create the cells objects
		for(var x = 0; x < this.width; x++){
			for(var y = 0; y < this.height; y++){
				grid[x][y] = new UtilityCell(UtilityGrid.MIN_PROB, Tile.EMPTY);
			}
		}
		
		return grid;
	}
	
	//Apply the heuristics and updates the grid
	update(){
		this.maxUtility = 0;
		for(var x = 0; x < this.width; x++){
			for(var y = 0; y < this.height; y++){
				this.updateCell(x, y);
			}
		}
		//this.print();
	}
	
	updateCell(x, y){
		var cell = this.utilityGrid[x][y];
		var utility = 0;
		
		if(cell.getState() != Tile.EMPTY){
			cell.setUtility(0);
			return;
		}
		
		//Apply the heuristics
		this.heuristics.forEach(function(heuristic){
			utility += heuristic.getUtility(x, y);
		});
		
		cell.setUtility(utility);
		
		if(this.maxUtility < utility){
			this.maxUtility = utility;
		}
	}
	
	//Returns the position (x, y) of the best cell
	getBestCellPosition(){
		var maxUtility = 0;
		var bestPositionList = [];
		
		for(var x = 0; x < this.width; x++){
			for(var y = 0; y < this.height; y++){
				var utility = this.utilityGrid[x][y].getUtility();
				if(utility == maxUtility){
					bestPositionList.push({x: x, y:y});
				}else if(utility >= maxUtility){
					maxUtility = utility;
					bestPositionList = [];
					bestPositionList.push({x: x, y:y});
				}
			}
		}
		
		if(bestPositionList.length == 0 || maxUtility == 0){
			//console.log("No best position found.");
		}
		
		
		return bestPositionList[parseInt(Math.random()*bestPositionList.length)];
	}
	
	print(){
		for(var y = this.height-1;  y >= 0; y--){
			var row = "";
			for(var x = 0; x < this.width; x++){
				row += "("+this.utilityGrid[x][y].getUtility() + " / "+this.utilityGrid[x][y].getState()+")"+" - ";
			}
			console.log(row+" <- "+y);
		}
		console.log('');
		console.log('');
	}
	
	getUtilityGrid(){
		return this.utilityGrid;
	}
	
	getWidth(){
		return this.width;
	}
	
	getHeight(){
		return this.height;
	}
	
	getCell(x, y){
		if(x < this.width && x >= 0 && y >= 0 && y < this.height){
			return this.utilityGrid[x][y];
		}else{
			return null;
		}
	}
	
	getMaxUtility(){
		return this.maxUtility;
	}
	
	
}