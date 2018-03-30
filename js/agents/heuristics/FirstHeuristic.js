/**
* This heuristic says that any cell that has not been shot yet has utility!
*/
class FirstHeuristic extends AbstractHeuristic{
	constructor(utilityGrid){
		super(utilityGrid);
		
		//Default weight
		this.setWeight(1);
	}
	
	getUtility(x, y){
		return this.weight;		
	}
}