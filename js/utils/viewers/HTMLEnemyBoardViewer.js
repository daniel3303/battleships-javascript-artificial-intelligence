class HTMLEnemyBoardViewer{
	constructor(selector, boardFacade){
		this.boardFacade = boardFacade;
		this.tiles = []; //HTMLElement tiles
		this.selector = selector;
		
		this.boardWrapper = document.querySelector(selector);		
		this.init();
	}
	
	
	init(){
		var self = this;
		var tiles = this.boardFacade.getTiles();
		
		//Add class board to tile wrapper
		this.boardWrapper.classList.add("board");
		
		//Create the tiles
		tiles.forEach(function(tile){
			self.tiles.push(self.createTile(tile));
		});
		
		
		//Register itself on board facade
		this.boardFacade.onChange(function(){
			self.update();
		});
	}
	
	createTile(tile){
		var x = tile.getX();
		var y = tile.getY();
		
		var tileElem = document.createElement("div");
		tileElem.setAttribute("x", x);
		tileElem.setAttribute("y", y);
		tileElem.classList.add("board-tile");
		this.boardWrapper.appendChild(tileElem);
		
		tileElem.tileObject = tile;
		
		
		
		return tileElem;
	}
	
	
	//OPTIMIZE!!!
	update(){
		this.tiles.forEach(function(htmlTile){
			var tile = htmlTile.tileObject;
			if(tile.isShot()){
				htmlTile.classList.add("is-shot");
			}
			if(tile.hasBoat() && tile.isShot()){
				htmlTile.classList.add("has-ship");
			}
			if(tile.hasBoat() && tile.isShot() && tile.getBoat().isSunk()){
				htmlTile.classList.add("is-sunk");
			}
		});
	}
	
	//OPTIMIZE!!!
	getTile(x, y){
		for(var index = 0; index < this.tiles.length; index++){
			var htmlTile = this.tiles[index];
			if(htmlTile.tileObject.getX() == x && htmlTile.tileObject.getY() == y){
				return htmlTile;
			}
		}
		return null;
	}
	
	getHTMLTiles(){
		return this.tiles;
	}
	
	destroy(){
		this.boardWrapper.innerHTML = "";
	}
	
	showUtilityGrid(utilityGrid){
		this.tiles.forEach(function(htmlTile){
			var tile = htmlTile.tileObject;
			var utilityCell = utilityGrid.getCell(tile.getX(), tile.getY());
			console.log(utilityGrid.getMaxUtility());
			var extraCSS = (utilityCell.getUtility() == utilityGrid.getMaxUtility()) ? "font-green bold" : "";
			htmlTile.innerHTML = "<div class='board-tile-content "+extraCSS+"'>"+parseInt(utilityCell.getUtility())+"</div>";
		});
	}
	
	
}