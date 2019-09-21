const NORTH_SOUTH = 1;
const EAST_WEST = 0;
const EAST = 0;
const SOUTH = 1;
const WEST = 2;
const NORTH = 3;

class Ray {
  constructor(x1, y1, x2, y2) {
    this.startX = x1;
    this.startY = y1;
    this.mapX = floor(this.startX);
    this.mapY = floor(this.startY);
    this.vector = createVector(x2 - x1, y2 - y1);
    this.originalMagnitude = this.vector.mag();
    this.onGrid = false;
    this.sideHit = NORTH_SOUTH; //NorthSouth are odd, EastWest are even
		this.deltaDistX = this.deltaDistY = this.initDistX = this.initDistY = 0;
    this.calculateDistances();
  }
	calculateDistances() {
    this.deltaDistX = sqrt(1 + (this.vector.y*this.vector.y) / (this.vector.x*this.vector.x));
    this.deltaDistY = sqrt(1 + (this.vector.x*this.vector.x) / (this.vector.y*this.vector.y));
    if(this.vector.x < 0) {
      this.stepX = -1;
      this.initDistX = (this.getPosX() - this.getMapX()) * this.deltaDistX;
    } else {
      this.stepX = 1;
      this.initDistX = (this.getMapX() + 1 - this.getPosX()) * this.deltaDistX;
    }
    if(this.vector.y < 0) {
      this.stepY = -1;
      this.initDistY = (this.getPosY() - this.getMapY()) * this.deltaDistY;
    } else {
      this.stepY = 1;
      this.initDistY = (this.getMapY() + 1 - this.getPosY()) * this.deltaDistY;
    }
  }
	/* Grows the tip of this ray to the next side of a square on the map.  */
	grow() {
    if(this.initDistX < this.initDistY) {
      this.initDistX += this.deltaDistX;
      this.mapX += this.stepX;
      //side = east/west
			if(this.vector.x > 0)
				this.sideHit = WEST;
			else
				this.sideHit = EAST;
    } else {
      this.initDistY += this.deltaDistY;
      this.mapY += this.stepY;
      //side = north/south
			if(this.vector.y > 0)
				this.sideHit = SOUTH;
			else
				this.sideHit = NORTH;
    }
    //now safe to check if a wall was hit
  }
  
  /** The length of this ray from its vertex */
  magnitude() {
    return this.vector.mag();
  }
  
  /** The length of this ray if it began at the camera plane */
  planeMagnitude() {
    return this.vector.mag() - this.originalMagnitude;
  }
  
  /** Returns the exact coordinates of this ray tip */
  getPosX() {return this.vector.x + this.startX;}
  getPosY() {return this.vector.y + this.startY;}
  
  /** Returns the integer coordinates of this ray tip */
  getMapX() {return parseInt(this.mapX);}
  getMapY() {return parseInt(this.mapY);}
  
  /** Returns the perpendicular distance from the camera plane
      to wherever the ray hit a wall to avoid the fish-eye effect.*/
  perpWallDist() {
    if(this.sideHit % 2 == EAST_WEST) //hit east-west side
      return (this.mapX - this.startX + (1 - this.stepX) / 2) / this.vector.x;
    else         //hit north-south side
      return (this.mapY - this.startY + (1 - this.stepY) / 2) / this.vector.y; 
  }
  
  toString() {
    return "<" + this.vector.x + "," + this.vector.y + ">";
  }
  
  where() {
    return "("+this.mapX+"  "+this.mapY+")";
  }
}