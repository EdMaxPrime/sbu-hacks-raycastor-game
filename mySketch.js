var ground = "#764D0D";
var sky = "#82CAFF";
var player;
var renderer;
var heightOverDistance;
var state;
var MAIN_MENU = 0, MAZE = 1;
var player_score = 0;
var textures = [];

function preload() {
	textures[0] = loadImage("block.jpeg");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
	heightOverDistance = new Memoized(height, function(array) {
		for(var i = 0.001; i < 10 * sqrt(2); i += 0.001) {
			array.push({key: i, value: height / i});
		}
	});
	textures[0].loadPixels();
	renderer = new RayCastor(new Camera(0, 0, radians(45), 100), new World());
	player = new Player(renderer);
	state = MAZE;
}

function draw() {
	if(state == MAZE) {
		player.updateWorld();
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
		fill(0);
		rect(0, 0, 60, 20);
		fill(255);
		text("Score: " + player_score, 10, 16);
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
	var door = renderer.lookingAt();
	if(door.open) {
		door.open();
		print("open");
	}
	print("no door");
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


