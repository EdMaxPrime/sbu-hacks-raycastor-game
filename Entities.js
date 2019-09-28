class Entity {
	/*
	Constructor for a generic Entity.
	@param x                    an integer or floating point number representing the x-coordinate of this entity on the world map
	@param y                    an integer or floating point number representing the y-coordinate of this entity on the world map
	@param scaleW               controls how much of a full block's width this texture is. Values from 0-1. 0 = no width, 0.5 = half width, 1 = full wall width
	@param scaleH               controls how much of a full block's height this texture is. Values from 0-1. 0 = no height, 0.5 = half height, 1 = full wall height
	@param verticalTranslation  controls how far from the middle of the wall's height this sprite should be. If scaleH is less than 1, please adjust this parameter. 
	                            Negative numbers will move it towards the ceiling, and positive numbers will move it towards the floor. Ranges from 0 to height of the screen.
	 */
	constructor(x, y, scaleW, scaleH, verticalTranslation) {
		this.x = x;
		this.y = y;
		this.w = 1;
		this.h = 1;
		this.scaleWidth = scaleW || 1;
		this.scaleHeight = scaleH || 1;
		this.moveV = verticalTranslation || 0;
	}
	/*
	@param where  from 0-1, where 0=left and 1=right, where the sprite was hit
	@param x      the x position to draw this stripe at on the screen
	@param w      how wide to draw the stripe
	@param w      how tall the stripe is
	@param d      the depth of this entity in the screen, which is the distance from the player
	*/
	drawStripe(where, x, w, h, d) {
		let startY = ((height + h) / 2) + (this.moveV / d);
		fill(0, 255, 255);
		var triangleY = where * h;
		rect(x, startY - triangleY, w, triangleY);
	}
}