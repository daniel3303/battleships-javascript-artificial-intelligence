class PlayerBoardFacade extends BoardFacade{
	constructor(selector){		
		super(selector);
	}
	
	setEnemy(board){
		super.setEnemy(board);
		
		this.viewer = new HTMLBoardViewer("#player-board", this);
		
	}

	getViewer(){
		return this.viewer;
	}
	
	init(){
		if(this.enemyBoard == null){
			throw new Exception("Enemy not set.");
		}
		this.eventHandler = new HTMLBoardEventHandler(this, this.enemyBoard, this.viewer);
		super.init();
	}
	
	destroy(){
		this.viewer.destroy();
		super.destroy();
	}
	
}