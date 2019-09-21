var ground = "#764D0D";
var sky = "#82CAFF";
var player;
var renderer;
var textures = [[], [], []];
var heightOverDistance;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
	for(let y = 0; y < 32; y++) {
		textures[0].push([]);
		textures[1].push([]);
		textures[2].push([]);
		for(let x = 0; x < 32; x++) {
			textures[0][y][x] = color(4 * (x + y), 8 * y, 5);
			textures[1][y][x] = color(5, 8 * y, 8 * (x ^ y));
			textures[2][y][x] = color(64, 8 * x, 8 * y);
		}
	}
	heightOverDistance = new Memoized(height, function(array) {
		for(var i = 0.001; i < 10 * sqrt(2); i += 0.001) {
			array.push({key: i, value: height / i});
		}
	});
	renderer = new RayCastor(new Camera(0, 0, radians(45), 100), new World());
	player = new Player(renderer);
}

function draw() {
	render();
  if(keyIsDown(UP_ARROW)) {
    player.forward();
  } else if(keyIsDown(DOWN_ARROW)) {
    player.backward();
  } else if(keyIsDown(LEFT_ARROW)) {
    player.turn(-1);
  } else if(keyIsDown(RIGHT_ARROW)) {
    player.turn(1);
  }
}

function keyPressed() {
}

/* Draws the 3d world given a RayCastor object */
function render() {
		noStroke();
    rectMode(CORNER);
		fill(sky);
    rect(0, 0, width, height/2);
    fill(ground);
    rect(0, height/2, width, height/2);
		
		player.drawPOV();
}

function mouseReleased() {
	//shoot laser
}

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
}

class Memoized {
	/*
	@param nf           some unique value to represent an element that was not memoized (-1, null, etc)
	@param listBuilder  an optional callback function to generate the mappings. It takes the mappings list as reference parameters and should populate with {key: k, value: v} objects.
	*/
	constructor(nf, listBuilder) {
		this.mappings = [];
		this.notFound = nf;
		if(listBuilder != undefined) {
			listBuilder(this.mappings);
			this.mappings.sort(function(a, b) {return a.key - b.key;});
		}
	}
	/* Adds two elements, keeping the array sorted */
	add(x, y) {
		var added = false;
		//insertion sort
		for(let i = 0; i < this.mappings.length; i++) {
			if(this.mappings[i].key >= x) {
				this.mappings.splice(i - 1, 0, {key: x, value: y});
				added = true;
				break;
			}
		}
		//elements should be added to the end of the sorted list
		if(!added) {
			this.mappings.push({key: x, value: y});
		}
	}
	value(x) {
		return height / x;
		let index = this.binarySearch(0, this.mappings.length, x);
		if(index == -1)
			return this.notFound;
		else
			return this.mappings[index].value;
	}
	binarySearch(start, end, key) {
		if(start == end) //empty list
			return -1;
		else if(end - start == 1) { //one thing in the list
			if(this.mappings[start].key == key)
				return start; //found it!
			else
				return -1;
		}
		else {
			var middle = parseInt(floor((end - start) / 2));
			if(key > this.mappings[middle].key)
				return this.binarySearch(middle + 1, end, key);
			else if(key < this.mappings[middle].key)
				return this.binarySearch(start, middle, key);
			else
				return middle; //found it!
		}
	}
}


