class RayCastor {
	constructor(c, w) {
		this.world = w;
		this.camera = c;
		this.renderDistance = 20; //how many squares away you can see
		this.stripes = [];
		this.floor = [];
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
				if (solid == null) {
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
	/* Sets the maximum distance rays will be projected. */
	setRenderDistance(d) {
		if(d > 1 && d < 100) this.renderDistance = d;
	}
	getRenderDistance() {
		return this.renderDistance;
	}
}