class Entity {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.w = 1;
		this.h = 1;
	}
	/*
	@param where  from 0-1, where 0=left and 1=right, where the sprite was hit
	@param x      the x position to draw this stripe at
	@param w      how wide to draw the stripe
	@param w      how tall the stripe is
	*/
	drawStripe(where, x, w, h) {
		fill(0, 255, 255);
		var triangleY = where * h;
		rect(x, (height + h)/2 - triangleY, w, triangleY);
	}
}