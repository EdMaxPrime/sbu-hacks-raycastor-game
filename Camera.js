class Camera {
	constructor(x, y, angle, res) {
		this.xpos = x; //(float) camera position in world
		this.ypos = y; //(float) camera position in world
		this.resolution = res; //(int) at most = WIDTH, controls how many rays we need to generate
		this.direction = p5.Vector.fromAngle(angle); //(PVector) direction of the camera
		this.current = 0; //(float)length of the camera plane, about 0.66
		this.planeLength = 0.66; //(int) which ray we are doing right now
	}
  rotate(angle){
    this.direction.rotate(angle);
  }
	getAngle() { return this.direction.heading(); }
	zoomIn(){
    this.resolution = round(this.resolution * 0.9);
  }
	zoomOut() {
    this.resolution = round(this.resolution / 0.9);
  }
	setResolution(res){
    if(res > 1 && res < width) this.resolution = res;
  }
	getResolution() {
    return resolution;
  }
	nextRay(){
    var cameraPlaneX = 2 * this.current / this.resolution - 1;
    var cameraPlane = this.direction.copy().rotate(HALF_PI);
    cameraPlane.setMag(this.planeLength);
    var ray = new Ray(this.xpos, this.ypos, this.xpos + this.direction.x + cameraPlane.x * cameraPlaneX, this.ypos + this.direction.y + cameraPlane.y * cameraPlaneX);
    this.current++;
    return ray;
  }
	centerRay() {
    var cameraPlaneX = 0; //0 is the middle, halfway between -1 and 1 on the cameraPlane
    var cameraPlane = this.direction.copy().rotate(HALF_PI); //perpendicular to direction vector
    cameraPlane.setMag(this.planeLength);
    var ray = new Ray(this.xpos, this.ypos, this.xpos + this.direction.x + cameraPlane.x * cameraPlaneX, this.ypos + this.direction.y + cameraPlane.y * cameraPlaneX);
    return ray;
  }
	reset(){
    this.current = 0;
    this.direction.normalize();
  }
	hasNextRay(){
    return this.current < this.resolution;
  }

  inverseMatrix(){
    var plane = this.direction.copy().rotate(HALF_PI);
    plane.setMag(this.planeLength);
    var det = 1 / (plane.x * this.direction.y - this.direction.x * plane.y);
    return [det * this.direction.y, -1 * det * this.direction.x, -1 * det * plane.y, det * plane.x]; 
  }
}