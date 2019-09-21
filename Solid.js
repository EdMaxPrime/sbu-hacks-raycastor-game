class Solid{
	constructor(x, y, o, _texture){
		this.xpos = x;
		this.ypos = y;
		this.width = 1;
		this.height = 1;
		this.texture = _texture;
		this.opacity = o; //ranges from 0 (invisible) to 1 (blocks everything behind it)
		this.walkThrough = false;
	}
	/* Returns an image object that is 1 pixel wide */
	drawStripe(whichSide, where, distance, x, w){
		this.texture.render(whichSide, where, distance, x, w, 1);
	}
}

class Door {
	constructor(x, y, _texture, world) {
		this.xpos = x;
		this.ypos = y;
		this.texture = _texture;
		this.opacity = 1;
		this.walkThrough = false;
		this.progress = 1; //0 = open, 1 = closed
		this.direction = 0;
		this.world = world;
	}
	drawStripe(whichSide, where, distance, x, w) {
		if(where < this.progress && whichSide % 2 == NORTH_SOUTH) {
			this.texture.render(whichSide, where, distance, x, w, 1);
		}
		else if(whichSide % 2 == EAST_WEST) {
			this.texture.render(whichSide, where, distance, x, w, 1);
		}
	}
	open() {
		this.walkThrough = false;
		this.opacity = 0.5;
		this.direction = -0.1;
		this.world.pleaseUpdate(this);
	}
	close() {
		this.walkThrough = false;
		this.opacity = 0.5;
		this.direction = +0.1;
		this.world.pleaseUpdate(this);
	}
	update() {
		//check for completely closed
		if(this.progress >= 1 && this.direction > 0) {
			this.progress = 1;
			this.opacity = 1;
			this.direction = 0;
			this.world.stopUpdating(this);
		}
		//check for completely open
		else if(this.progress <= 0 && this.direction < 0) {
			this.progress = 0;
			this.walkThrough = true;
			this.opacity = 0;
			this.direction = 0;
			this.world.stopUpdating(this);
		}
		//check for closing/opening door
		else {
			this.progress += this.direction;
		}
	}
}