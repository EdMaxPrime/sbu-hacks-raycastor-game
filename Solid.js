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
    if(whichSide == EAST_WEST) 
			return this.texture.render(whichSide, where, distance, x, w);
    return this.texture.render(whichSide, where, distance, x, w);
  }
}

class HalfSolid {
	constructor(x, y, c){
		this.xpos = x;
		this.ypos = y;
		this.width = 1;
		this.height = 1;
		this.mycolor = c;
		colorMode(HSB, 360, 100, 100, 255);
    this.darker = color(hue(this.mycolor), saturation(this.mycolor), brightness(this.mycolor)/2, alpha(this.mycolor));
		colorMode(RGB, 255, 255, 255, 255);
		this.opacity = 0.5; //ranges from 0 (invisible) to 1 (blocks everything behind it)
  }
	/* Returns an image object that is 1 pixel wide */
	drawStripe(whichSide, where, distance, x, w){
    if(whichSide % 2 == NORTH_SOUTH) {
			fill(this.mycolor);
		} else {
			fill(this.darker);
		}
		rectMode(CORNER);
		rect(x, height/2, w, height/(2*distance));
  }	
}