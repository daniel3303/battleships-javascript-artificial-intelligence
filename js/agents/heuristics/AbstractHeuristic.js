class AbstractHeuristic{
	constructor(utilityGrid){
		if (this.constructor === AbstractHeuristic) {
            throw new TypeError('Abstract class "AbstractHeuristic" cannot be instantiated directly.'); 
        }
		
		this.utilityGrid = utilityGrid;
		this.weight = 1; //Default heuristic weight
	}
	
	setWeight(newWeight){
		this.weight = parseInt(newWeight);
	}
	
	getUtility(x, y){
		return "some value";
	}
	
	//Utility methods
	inBounds(x, y){
		if(x < this.utilityGrid.length && y < this.utilityGrid[0].length && y >= 0 && x >= 0 == false){
			console.log("falha");
		}
		return x < this.utilityGrid.length && y < this.utilityGrid[0].length && y >= 0 && x >= 0;
	}
}