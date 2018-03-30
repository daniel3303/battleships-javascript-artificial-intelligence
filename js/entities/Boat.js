class Boat{
	constructor(x, y, length){
		this.length = parseInt(length);
		this.lives = this.length;
		this.horizontal = true; //boat orientation
		this.sunk = false;
		this.x = parseInt(x);
		this.y = parseInt(y);
		
		this.onRotationClousures = [];
		this.onSunkClousures = [];
	}
	
	onShot(){
		if(this.sunk == true){
			return;
		}
		
		this.lives--;
		if(this.lives == 0){
			this.sunk = true;
			this.triggetOnSunk();
		}
	}
	
	triggetOnSunk(){
		var self = this;
		this.onSunkClousures.forEach(function(clousure){
			clousure(self);
		})
	}
	
	onSunk(clousure){
		this.onSunkClousures.push(clousure);
	}
	
	setHorizontal(bool){
		if(bool != this.horizontal){
			this.rotate();
		}
	}
	
	rotate(){
		this.horizontal = !this.horizontal;
		this.triggerOnRotation();
	}
	
	triggerOnRotation(){
		var self = this;
		this.onRotationClousures.forEach(function(clousure){
			clousure(self);
		})
	}
	
	onRotation(closuure){
		this.onRotationClousures.push(clousure);
	}
	
	getX(){
		return this.x;
	}
	
	getY(){
		return this.y;
	}
	
	getLength(){
		return this.length;
	}
	
	isHorizontal(){
		return this.horizontal;
	}
	
	isSunk(){
		return this.sunk;
	}
}