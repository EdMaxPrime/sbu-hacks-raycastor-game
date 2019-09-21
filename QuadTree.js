class World {
	constructor() {
		this.floor = 0;
		this.terrain = new QuadTree(this);
		this.sky = 2;
		this.needToUpdate = [];
	}
	whatsThere(x, y, z) {
		z = z || 1;
		if(z == 0) { //floor
			if(x > 2) {
				return "texture";
			}
		}
		else {
			return this.terrain.whatsThere(x, y);
		}
	}
	pleaseUpdate(solid) {
		this.needToUpdate.push(solid);
	}
	stopUpdating(solid) {
		var index = this.needToUpdate.indexOf(solid);
		if(index != -1) {
			this.needToUpdate.splice(index, 1);
		}
	}
	update() {
		for(var i = 0; i < this.needToUpdate.length; i++) {
			this.needToUpdate[i].update();
		}
	}
}

class QuadTree {
	constructor(world) {
		var str = 	" DRRRRRRRRR\n" +
					"Y         G\n" +
					"Y         G\n" +
					"Y  YYYY  GR\n" +
					"Y  Y  YY  R\n" +
					"Y         R\n" +
					"Y         R\n" +
					"RRRRRRRRRRR";
		this.world = [[]];
		this.updater = world;
		let y = 0;
		let x = 0;
		for(var i = 0; i < str.length; i++) {
			if(str.charAt(i) == "\n") {
				this.world.push([]);
				y++;
				x = 0;
			}
			else if(str.charAt(i) == " ") {this.world[y].push(null); x++;}
			else if(str.charAt(i) == "R") {this.world[y].push(new Solid(x, y, 1, new PatternTexture(textures[0]))); x++;}
			else if(str.charAt(i) == "Y") {this.world[y].push(new Solid(x, y, 1, new ColorTexture("yellow"))); x++;}
			else if(str.charAt(i) == "G") {this.world[y].push(new Solid(x, y, 1, new ColorTexture("green"))); x++;}
			else if(str.charAt(i) == "D") {this.world[y].push(new  Door(x, y, new ColorTexture("green"), this.updater)); x++;}
		}
	}
	whatsThere(x, y) {
    if (y < 0 || y >= this.world.length) {
      return null;
    }
    if (x < 0 || x >= this.world[y].length) {
      return null;
    }
    return this.world[y][x];
  }
}

class Node {
	constructor(x, y, w, h, p, m) {
		this.parent = p;
		this.children = [];
		this.objects = [];
		this.count = 0;
		this.maxChildren = m;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	add(object, id) {
		if(this.count >= 4 && this.children.length == 0) {
			this.divide();
			this.objects.push(object);
			while(this.objects.length > 0) {
				//
			}
		} else {
			this.objects.push(object);
		}
		this.count++;
	}
	/* Given an object, if it is in this node, it will be removed. */
	remove(object) {
		//
	}
	search(x, y, w, h) {}
	/* Given an object with x,y,w,h will return true if any part of that object is in the boundaries of this node */
	inbounds(object) {
		let x1 = object.x, x2 = object.x + object.w;
		let y1 = object.y, y2 = object.y + object.h;
		return (x2 >= this.x) && (x1 < this.x + this.w) && (y2 >= this.y) && (y1 < this.y + this.h);
	}
	divide() {
		this.children[0] = new Node(this.x, this.y, this.w/2, this.h/2, this, this.maxChildren);
		this.children[1] = new Node(this.x + this.w/2, this.y, this.w/2, this.h/2, this, this.maxChildren);
		this.children[2] = new Node(this.x + this.w/2, this.y + this.h/2, this.w/2, this.h/2, this, this.maxChildren);
		this.children[3] = new Node(this.x, this.y + this.h/2, this.w/2, this.h/2, this, this.maxChildren);
	}
	/* The opposite of divide */
	absorb() {
		for(let i = 0; i < this.children.length; i++) {
			let contents = this.children[i].absorb();
			for(let j = 0; j < contents.length; j++) {
				this.objects.push(contents[j]);
			}
			this.children[i] = null;
		}
		this.children = [];
		return this.objects;
	}
}