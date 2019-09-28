class Player {

  constructor(raycastor) {
		this.raycastor = raycastor;
    this.cam = raycastor.camera;
		this.world = raycastor.world;
    this.walkingSpeed = 0.1;
    this.turningSpeed = (PI / 90);
  }

  canWalkThrough(solid) {
    return (solid == null) || (solid.walkThrough == true);
  }

  forward() {
    let x = this.cam.xpos + this.cam.direction.x * this.walkingSpeed;
    let y = this.cam.ypos + this.cam.direction.y * this.walkingSpeed;
		if(this.canWalkThrough(this.world.whatsThere(parseInt(x), parseInt(y)))) {
			this.cam.xpos = x;
			this.cam.ypos = y;
		}
    //println(cam.xpos, cam.ypos);
  }

  backward() {
    this.cam.xpos -= this.cam.direction.x * this.walkingSpeed;
    this.cam.ypos -= this.cam.direction.y * this.walkingSpeed;
    //println(cam.xpos, cam.ypos);
  }

  /** -1 to turn left, +1 to turn right */
  turn(dir) {
    if (dir == -1) this.cam.rotate(- this.turningSpeed);
    if (dir ==  1) this.cam.rotate(+ this.turningSpeed);
  }
  
  /** Moves the player to the specified coordinates */
  moveto(x, y) {
    this.cam.xpos = x;
    this.cam.ypos = y;
  }
  
  /** Forces the player to face a certain direction. Angle provided should be in radians */
  face(angle) {
    var currentAngle = this.cam.direction.heading();
    var deltaAngle = angle - currentAngle;
    this.cam.rotate(deltaAngle);
  }
  
  getX() {return this.cam.xpos;}
  getY() {return this.cam.ypos;}
  getAngle() {return this.cam.direction.heading();}
	
	drawPOV() {
		this.raycastor.beginCasting();
		this.raycastor.floorCast(this.getX(), this.getY(), 10);
    this.raycastor.spriteCast();
		noStroke(); //remove to see each stripe outlined
		let buffer = this.raycastor.getTerrainBuffer(); //an array of Image objects, each representing a stripe on the screen
		let floorBuff = this.raycastor.getFloorBuffer();
    let spriteBuff = this.raycastor.getSpriteBuffer();
		let w = floor(width/buffer.length);
		fill(0);
		rect(buffer.length * w, 0, width - buffer.length * w, height);
    //loop "camera.resolution" times
		for(var i = 0; i < buffer.length; i++) {
			//loop through all opaque/transparent objects in this line of sight
      for(var j = buffer[i].length - 1; j >= 0; j--) {
				//drawStripe(side's direction, where(0..1), distance, x, w)
        buffer[i][j][0].drawStripe(buffer[i][j][1], buffer[i][j][2], buffer[i][j][3], i * w, w);
      }
			//loop through each floor texture hit in this stripe
      //loop through each entity's stripe
      for(var j = 0; j < spriteBuff[i].length; j++) {
        spriteBuff[i][j].e.drawStripe(spriteBuff[i][j].where, i * w, w, spriteBuff[i][j].h);
      }
    }
	}

  updateWorld() {
    this.world.update();
  }
}