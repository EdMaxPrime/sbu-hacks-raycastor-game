var memoized_distances = [];
function memoize_values(max_render_distance, screen_height) {
	max_render_distance *= sqrt(2);
	memoized_distances[0] = screen_height;
	for(let distance = 1; distance < max_render_distance; distance++) {
		memoized_distances.push(screen_height / (0.01 * distance));
	}
}
function stripe_height(distance, start, end) {
	start = start || 0;
	end = end || memoized_distances.length;
}

class ColorTexture {
	constructor(c) {
		this.mycolor = c;
		colorMode(HSB, 360, 100, 100, 255);
		this.darker = color(hue(this.mycolor), saturation(this.mycolor), brightness(this.mycolor)/2, alpha(this.mycolor));
		colorMode(RGB, 255, 255, 255, 255);
	}
	/* Draws a slice of this texture onto the screen
	@param side      either NORTH_SOUTH or EAST_WEST. The latter is shaded darker
	@param where     a number from 0 to 1 representing where the vertical slice of the texture is on its whole texture
	@param distance  how far away the camera is. Bigger distance means smaller slice height.
	@param x         the on-screen X coordinate where to draw the texture
	@param w         the width of the on-screen slice
	@param yOffset   a percent from 0-1 how much to draw the texture vertically from the bottom. 1 means whole thing, 0.5 means bottom half...
	*/
	render(side, where, distance, x, w, yOffset) {
		yOffset = yOffset || 1; //default value is 1
		if(side % 2 == NORTH_SOUTH) {
			fill(this.mycolor);
		} else {
			fill(this.darker);
		}
		rectMode(CORNER);
		var stripeHeight = heightOverDistance.value(distance);
		rect(x, (height - (yOffset * stripeHeight))/2, w, yOffset * stripeHeight);
	}
	/* Used for drawing the floor, pixel by pixel 
	@param floorX  the floating point coordinate on the grid (0 to dimension of the world)
	@param floorY  the floating point coordinate on the grid (0 to dimension of the world)
	@param x       the on-screen coordinate to draw this pixel on
	@param x       the on-screen coordinate to draw this pixel on
	@param x       the on-screen width to draw this pixel with
	@param x       the on-screen height to draw this pixel with
	*/
	drawPixel(floorX, floorY, x, y, w, h) {
		fill(this.mycolor);
		rect(x, y, w, h);
	}
}


class PatternTexture {
	constructor(bitmap) {
		this.bitmap = bitmap;
		this.textureHeight = bitmap.length;
		this.textureWidth = bitmap[0].length;
	}
	render(side, where, distance, x, w) {
		let d = heightOverDistance.value(distance);
		let pixelHeight = d / this.textureHeight;
		let pixelX = floor(where * this.textureWidth);
		for(let y = 0; y < this.textureHeight; y++) {
			fill(this.bitmap[y][pixelX]);
			rect(x, (height - d)/2 + y * pixelHeight, w, pixelHeight); 
		}
	}
	drawPixel(floorX, floorY, x, y, w, h) {
		let textureX = floor((floorX * this.textureWidth) % this.textureWidth);
		let textureY = floor((floorY * this.textureHeight) % this.textureHeight);
		fill(this.bitmap[textureY][textureX]);
		rect(x, y, w, h);
	}
}




