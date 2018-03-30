class UtilityCell{
	constructor(utility, state){
		this.utility = 0;
		this.state = state;
	}
	
	setUtility(value){
		this.utility = parseInt(value);
	}
	
	addUtility(value){
		this.utility -= parseInt(value);
	}
	
	getUtility(){
		return this.utility;
	}
	
	setState(newState){
		this.state = newState;
	}
	
	getState(){
		return this.state;
	}
}