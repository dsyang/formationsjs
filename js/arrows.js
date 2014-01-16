function ArrowsList() {
		this.arrows = []
}

ArrowsList.prototype.inArrows = function(frame) {
		return this.arrows[frame];
}

ArrowsList.prototype.outArrows = function(frame) {
		return this.arrows[frame+1];
}

ArrowsList.prototype.add = function(frame, arrows, isIn) {
		if (isIn) {
				this.arrows[frame] = arrows;
		} else {
				this.arrows[frame+1] = arrows;
		}
}
