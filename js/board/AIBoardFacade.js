class AIBoardFacade extends BoardFacade{
	constructor(selector){		
		super(selector);		
		this.viewer = new HTMLEnemyBoardViewer(selector, this);		
		
		
	}
	
	setEnemy(board){
		super.setEnemy(board);
	}
	
	init(){
		if(this.enemyBoard == null){
			throw new Exception("Enemy not set.");
		}
		this.aiPlayer = new AIPlayer(this, this.board);
		this.aiPlayer.placeBoats();
		super.init();
	}
	
	getViewer(){
		return this.viewer;
	}
	
	play(){
		this.aiPlayer.play();
	}
	
	destroy(){
		this.viewer.destroy();
		if(this.aiPlayer != null){
			this.aiPlayer.destroy();
		}
		super.destroy();
	}
	
	//AI methods	
	pause(){
		this.aiPlayer.pause();
	}
	
	resume(){
		this.aiPlayer.resume();
	}
	
	setDelay(delay){
		this.aiPlayer.setDelay(delay);
	}
	
	printAIProbs(){
		this.aiPlayer.printProbs();
	}
	
	getEnemyBoardViewer(){
		if(this.enemyBoard != null){
			return this.enemyBoard.getViewer();
		}
		return null;
	}

	
}