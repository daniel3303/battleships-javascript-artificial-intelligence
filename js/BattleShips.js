class BattleShips{
	constructor(options){
		BattleShips.INSTANCE = this;
		this.options = options;
		this.requiredBoats = 5;
		this.numGames = 0;
		this.totalMoves = 0;
		this.gameStarted = false;
		
		//State
		this.playerPlacedAllBoats = false;
		this.computerPlacedAllBoats = false;
		
		this.startGame();
	}
	
	startGame(){
		var self = this;
		this.numGames++;
		this.computerBoard = new AIBoardFacade("#computer-board");
		this.playerBoard = new PlayerBoardFacade("#player-board");
		BattleShips.showMessage("Seleciona os navios à esquerda e coloca-os no teu tabuleiro.");
		
		this.playerBoard.setEnemy(this.computerBoard);
		this.computerBoard.setEnemy(this.playerBoard);
		
		this.playerBoard.onAllBoatsPlaced(function(){
			self.playerPlacedAllBoats = true;
			self.tryToStartGame();
		});
		
		this.computerBoard.onAllBoatsPlaced(function(){
			self.computerPlacedAllBoats = true;
			self.tryToStartGame();
		});
				
		//Pick the boats
		this.playerBoard.init();
		this.computerBoard.init();
		
		
		//Starts the game
		this.playerBoard.setGameStarter();
		
		//On player lost
		this.playerBoard.onAllBoatsSinked(function(){
			alert("O computador ganhou!");
			self.onGameFinished();
		});
		
		//On computer lost
		this.computerBoard.onAllBoatsSinked(function(){
			alert("Parabéns, ganhou!");
			self.onGameFinished();
		});
	}
	
	tryToStartGame(){
		if(this.playerPlacedAllBoats && this.computerPlacedAllBoats){
			this.gameStarted = true;
			BattleShips.showMessage("O jogo começou!<br />Clica nas quadrículas (no tabuleiro do computador) que pretendes afundar.");
		}
	}
	
	onGameFinished(){
		window.location.reload()
		var self = this;
		this.totalMoves += this.computerBoard.getNumMoves();
		this.computerBoard.destroy();
		this.playerBoard.destroy();
		/*var numGames = document.querySelectorAll(".num-games");
		numGames.forEach(function(elem){
			elem.innerHTML = self.numGames;
		});
		
		var avgShoots = document.querySelectorAll(".avg-moves");
		avgShoots.forEach(function(elem){
			elem.innerHTML = (self.totalMoves/self.numGames).toFixed(2);
		});
		
		this.startGame();
		*/
	}
	
	pauseAI(){
		this.playerBoard.pause();
		this.computerBoard.pause();
	}
	
	resumeAI(){
		this.playerBoard.resume();
		this.computerBoard.resume();
	}
	
	setAIDelay(delay){
		this.playerBoard.setDelay(delay);
		this.computerBoard.setDelay(delay);
	}
	
	printAIProbs(){
		this.computerBoard.printAIProbs();
	}
	
	isGameStarted(){
		return this.gameStarted;
	}
	
	static showMessage(msg){
		var wrapper = document.getElementById("user-messages");
		wrapper.innerHTML = msg;
		return true;
	}
	
	static getInstance(){
		return BattleShips.INSTANCE;
	}
	
}

BattleShips.DEBUG = false;
BattleShips.INSTANCE = null;