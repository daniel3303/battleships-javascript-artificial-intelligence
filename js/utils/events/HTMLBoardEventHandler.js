class HTMLBoardEventHandler{
	constructor(board, enemyBoard, htmlViewer){
		this.board = board;
		this.enemyBoard = enemyBoard;
		this.htmlViewer = htmlViewer;
		
		//State
		this.selectedBoatHTMLELement = null;
		this.selectedBoatLength = 0;
		this.selectedBoatHorizontal = true;
		
		
		this.registerEvents();
	}
	
	onTileClick(tile){
		var self = this;
		
		var x = tile.getX();
		var y = tile.getY();
		
		//we are selecting boats
		if(this.board.isWaitingForBoats() == true){
			if(this.selectedBoatLength == 0){
				return false;
			}else{
				//notify board
				var success = this.board.placeBoat(x, y, self.selectedBoatLength, self.selectedBoatHorizontal);
				if(success){
					this.selectedBoatLength = 0;
					this.selectedBoatHorizontal = true;
					this.selectedBoatHTMLELement.classList.add("d-none");
				}
			}
		}
	}
	
	onEnemyTileClick(tile){
		this.board.shootEnemy(tile.getX(), tile.getY());
	}
	
	onMouseOverTile(tile){
		var x = tile.getX();
		var y = tile.getY();
		if(this.board.isWaitingForBoats() && this.selectedBoatLength > 0){
			this.htmlViewer.setBoatOver(x, y, this.selectedBoatLength, this.selectedBoatHorizontal);
		}
	}
	
	
	
	registerEvents(){
		var self = this;
				
		/* OWN BOARD */
		//Each tile events
		var htmlTiles = this.htmlViewer.getHTMLTiles();
		htmlTiles.forEach(function(htmlTile, index, array){
			htmlTile.addEventListener("click", function(event){				
				self.onTileClick(htmlTile.tileObject);
			});
			htmlTile.addEventListener("mouseover", function(event){				
				self.onMouseOverTile(htmlTile.tileObject);
			});
		});
		
		//Select ship events
		var ships = document.querySelectorAll(".ships > .ship");
		ships.forEach(function(ship){
			ship.addEventListener("click", function(event){
				event.preventDefault();
				self.selectedBoatLength = parseInt(this.getAttribute("length"));
				self.selectedBoatHTMLELement = this;
			});
		});
		
		//Ship rotator button
		var button = document.querySelector("#rotate-ship");
		button.addEventListener("click", function(event){
			event.preventDefault();
			self.selectedBoatHorizontal = !self.selectedBoatHorizontal;
		});
		
		/* ENEMY BOARD */
		//Each tile events
		var enemyHtmlTiles = this.enemyBoard.getViewer().getHTMLTiles();
		enemyHtmlTiles.forEach(function(htmlTile, index, array){
			htmlTile.addEventListener("click", function(event){				
				self.onEnemyTileClick(htmlTile.tileObject);
			});
		});
	}
	
	unregisterEvents(){
		
	}
	
	destroy(){
		this.unregisterEvents();
	}
	
}