class RayCastor {
	constructor(c, w) {
		this.world = w;
		this.camera = c;
		this.renderDistance = 20; //how many squares away you can see
		this.stripes = [];
		this.floor = [];
		this.entitiesStripes = [];
		this.max = 0;
	}
	beginCasting() {
		// //green lines
		//fill(0);
		//rect(width/2, height/2, 200, -200);
		this.camera.reset();
		this.stripes = []; //an array of length "camera.resolution" containing Image objects
		var stackOfHitObjects = [];
		var pointsOnFloor = [];
		var rayNumber = 0;
		var solid = null;
		while (this.camera.hasNextRay()) {
			var r = this.camera.nextRay();
			stackOfHitObjects = [];
			for (var i = 0; i < this.renderDistance; i ++) {
				solid = this.world.whatsThere(r.getMapX(), r.getMapY());

				// //green lines
				// if(solid != null) {
				// 	stroke(128, 255, 128);
				// 	var end = r.vector.copy();
				// 	end.setMag(r.perpWallDist());
				// 	line(width/2, height/2, width/2 + end.x*40, height/2 - end.y*40);
				// }

				var where; //from 0 to 1, the xCoord of the texture
				if (r.sideHit % 2 == EAST_WEST) where = r.startX + r.perpWallDist() * r.vector.y; //east-west (side = 0)
				else                            where = r.startX + r.perpWallDist() * r.vector.x; //north-south (side = 1)
				where -= floor(where); //we only need the decimal portion of this variable
				let wallDist = r.perpWallDist();
				pointsOnFloor.push([this.world.whatsThere(r.getMapX(), r.getMapY(), 0), r.getMapX(), r.getMapY(), wallDist]);
				if (solid == null || solid.opacity == 0) {
					r.grow(); //nothing there, keep going
				} else if (solid.opacity < 1) {
					stackOfHitObjects.push([solid, r.sideHit, where, wallDist]);
					r.grow();
				} else {
					//if(wallDist > this.max) this.max = wallDist;
					stackOfHitObjects.push([solid, r.sideHit, where, wallDist]);
		  			break; //we hit something opaque
	  			}
			}
			this.floor[rayNumber] = pointsOnFloor;
			this.stripes[rayNumber] = stackOfHitObjects;
			rayNumber++;
		}
	}
	floorCast(x, y, numHorizontalStripes) {
		/*var furthestWall = floor[i][floor[i].length - 1].distance;
			for(var y = (height + height / furthestWall)/2; y < height; y += w) {
				var interpolatedDistance = height / (2 * y - height);
				if(interpolatedDistance == Infinity) interpolatedDistance = 1000; //world.width
				var weight = interpolatedDistance / furthestWall;
				var currentFloorX = weight * XWall + (1 - weight) * x;
				var currentFloorY = weight * YWall + (1 - weight) * y;
			}
		this.floor.map(function(elem) {
			return {
				floorX: 0, //from formula, used in drawing player
				floorY: 0,
				y: 0,
				texture: null
			};
		});*/
	}
	/* Must be called after regular casting */
	spriteCast() {
		//reset entity stripe info
		for(var i = 0; i < this.stripes.length; i++) this.entitiesStripes[i] = [];
		//sort entities on distance to the camera
		var entities = this.world.entities.slice().sort(function(a, b) {
			return ((this.camera.xpos - a.x) * (this.camera.xpos - a.x) + (this.camera.ypos - a.y) * (this.camera.ypos - a.y)) - ((this.camera.xpos - b.x) * (this.camera.xpos - b.x) + (this.camera.ypos - b.y) * (this.camera.ypos - b.y));
		});
		var m = this.camera.inverseMatrix();
		//multiply camera matrix (2x2) by sprite coordinates (2x1)
		var spriteCoords = [];
		var transform = [];
		for(var i = entities.length - 1; i >= 0 ; i--) {
			spriteCoords[0] = entities[i].x - this.camera.xpos;
			spriteCoords[1] = entities[i].y - this.camera.ypos;
			transform[0] = m[0] * spriteCoords[0] + m[1] * spriteCoords[1];
			transform[1] = m[2] * spriteCoords[0] + m[3] * spriteCoords[1]; //depth inside the screen
			var x = parseInt((this.entitiesStripes.length / 2) * (1 + transform[0] / transform[1]));
			var h = abs(parseInt(height / transform[1]));
			var w = abs(parseInt(this.entitiesStripes.length / transform[1]));
			//j represents the stripes of this sprite from left to right
			for(var j = parseInt(x - w/2); j <= parseInt(x + w/2); j++) {
				//make sure this stripe of the entity is in front of camera plane, not to the left of the screen, not to the right of the screen, and not behind the closest wall 
				if(transform[1] > 0 && j > 0 && j < this.entitiesStripes.length) {
					//make sure this part of the sprite is not behind any terrain
					var closestTerrain = 1000000;
					if(this.stripes[j].length > 0) {
						closestTerrain = this.stripes[j][this.stripes[j].length - 1][3];
					}
					if(transform[1] < closestTerrain) {
						this.entitiesStripes[j].push({x: x, w: w, h: h, e: entities[i], where: (j - (-w / 2 + x)) / w});
					}
				}
			}
		}
	}
	/* Returns the solid/entity closest to the camera using the center ray */
	lookingAt() {
		var r = this.camera.centerRay();
		var solid = null;
		for(var i = 0; i < this.renderDistance; i++) {
			solid = this.world.whatsThere(r.getMapX(), r.getMapY());
			if(solid == null) r.grow(); //nothing there
			else break; //hit something
		}
		return solid;
	}
	/* Returns the array of stripes to be drawn drawn */
	getTerrainBuffer() {
		return this.stripes;
	}
	/* Returns an array of floor textures to be drawn under each stripe, as well as the distance they are away from the player [texture, x, y, distance] */
	getFloorBuffer() {
		return this.floor;
	}
	/* Returns an array of stripes with the entities to be drawn in each stripe */
	getSpriteBuffer() {
		return this.entitiesStripes;
	}
	/* Sets the maximum distance rays will be projected. */
	setRenderDistance(d) {
		if(d > 1 && d < 100) this.renderDistance = d;
	}
	getRenderDistance() {
		return this.renderDistance;
	}
}