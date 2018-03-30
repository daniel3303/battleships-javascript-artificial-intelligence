class Util{
	static clamp(num, min, max){
		return num <= min ? min : num >= max ? max : num;
	}
	
	static randomInt(min, max){
		return Math.floor(Math.random()*(max-min)) + min;
	}
	
	static randomBool(){
		return Math.random() >= 0.5;
	}
	
	distance(x1, y1, x2, y2){
		return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1 - y2, 2));
	}
	
}