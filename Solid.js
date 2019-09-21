class Solid{
	constructor(x, y, o, _texture){
		this.xpos = x;
		this.ypos = y;
		this.width = 1;
		this.height = 1;
		this.texture = _texture;
		this.opacity = o; //ranges from 0 (invisible) to 1 (blocks everything behind it)
	}
	/* Returns an image object that is 1 pixel wide */
	drawStripe(whichSide, where, distance, x, w){
		this.texture.render(whichSide, where, distance, x, w, 1);
	}
}

class Door {
	constructor(x, y, _texture) {
		this.xpos = x;
		this.ypos = y;
		this.texture = _texture;
		this.opacity = 1;
		this.progress = 1; //0 = open, 1 = closed
		this.direction = 0;
	}
	drawStripe(whichSide, where, distance, x, w) {
		this.texture.render(whichSide, where, distance, x, w, this.progress);
	}
	open() {
		this.opacity = 0;
		this.direction = -0.1;
	}
	close() {
		this.opacity = 0;
		this.direction = +0.1;
	}
	update() {
		//check for completely closed
		if(this.progress >= 1 && this.direction > 0) {
			this.progress = 1;
			this.opacity = 1;
			this.direction = 0;
		}
		//check for completely open
		else if(this.progress <= 0 && this.direction < 0) {
			this.progress = 0;
			this.opacity = 0;
			this.direction = 0;
		}
		//check for closing/opening door
		else {
			this.progress += this.direction;
		}
	}
}