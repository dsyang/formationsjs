function Stage(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.context.font = "Bold 16px sans-serif";
		this.context.textBaseline = "center";
		this.context.textAlign = "center";

		//In case browser doesn't support dashed lines
		if (!this.context.setLineDash) {
				this.context.setLineDash = function() {};
		}

		this.frameCount = 1;
		this.frame = 0;

		this.markers = [];
		this.markerLayout = [0,0];
		this.markerHorzDist = 0;
		this.markerVertDist = 0;

		this.dancerCount = 0;
		this.dancers = new DancersList(document.getElementById('dancers'));

		this.arrows = new ArrowsList();
		// [0] in-arrows for frame 1, [1] out-arrows frame 1/in-arrows frame 2

		var self = this;
		this._listeners = {
				mousemove: function() { self._onMouseMove.apply(self, arguments); },
				mousedown: function() { self._onMouseDown.apply(self, arguments); },
				mouseup: function() { self._onMouseUp.apply(self, arguments); },
				click: function() { self._onClick.apply(self, arguments); }
		};
		var type;
		for (type in this._listeners) {
				this.canvas.addEventListener(type, this._listeners[type]);
		}
}

Stage.prototype.serialize = function() {
		var stageObject = {
				mL: this.markerLayout,
				dC: this.dancerCount,
				d: [],
				f: this.frameCount
		};
		var id;
		for (id in this.dancers.array) {
				stageObject.d[id] =
						this.dancers.array[id].serialize(this.markerHorzDist,
																						 this.markerVertDist);
		}

		return escape(JSON.stringify(stageObject));

}

Stage.deserializeInto = function(str, stage) {
		if(str[str.length-1] === '/') {
				str[str.length-1] = ' ';
		}
		var stageObject = JSON.parse(unescape(str));
		stage.frameCount = stageObject.f;
		stage.frame = 0;

		stage.setMarkers(stageObject.mL[0], stageObject.mL[1]);
		stage.dancers = new DancersList(stage.dancers.element);
		var id;
		for (id in stageObject.d) {
				var o = stageObject.d[id];
				stage.addDancer(o.n, o.g, o.c);
				stage.dancers.array[id].xs = o.xs.map(function(p) {
						if (p !== undefined) {
								return p*stage.markerHorzDist;
						}
				});
				stage.dancers.array[id].ys = o.ys.map(function(p) {
						if (p !== undefined) {
								return p*stage.markerVertDist;
						}
				});
		}
}

Stage.prototype.draw = function() {
		var id1, id2;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (id1 in this.markers) {
				this.markers[id1].draw(this);
		}

		for (id2 in this.dancers.array) {
				if(this.dancers.array[id2] === this.dancers.active) {
						continue;
				}
				this.dancers.array[id2].draw(this);
		}

		//always draw active dancer last
		this.dancers.active && this.dancers.active.draw(this);
}

Stage.prototype.setMarkers = function(numHorz, numVert) {
		this.markers = [];
		this.markerLayout = [numHorz, numVert];

		var spaceHorz = this.canvas.width / (2*(numHorz+1));
		var spaceVert = this.canvas.height / (2*(numVert+1));

		this.markerHorzDist = spaceHorz;
		this.markerVertDist = spaceVert;

		for (var i = 1; i < 2*(numHorz+1); i++) {
				// if i even, then actual marker, else it's a mid
				console.log("pushing horz");
				var m = new Marker(spaceHorz*i, 0, (i % 2 === 0));

				this.markers.push(m);
		}
		for (var j = 1; j < 2*(numVert+1); j++) {
				// if j even, then actual marker, else it's a mid
				var m = new Marker(0, spaceVert*j, (j % 2 === 0));

				this.markers.push(m);
		}
}

Stage.prototype.addDancer = function(name, gender, color) {
		this.dancerCount++;
		var self = this;
		var dancer = new Dancer(this.dancerCount, name, gender, color);
		dancer.element.mousedown(function() {
				if (self.dancers.active === dancer) {
						self.dancers.makeInactive();
				} else {
						self.dancers.makeActive(dancer)
				}
		});
		this.dancers.push(dancer);
}

Stage.prototype.snapH = function(x) {
		return Math.floor((x+25)/(this.markerHorzDist/4))*(this.markerHorzDist/4);
}

Stage.prototype.snapV = function(x) {
		return Math.floor((x+25)/(this.markerVertDist/4))*(this.markerVertDist/4);
}

Stage.prototype._onMouseMove = function(event) {
		var pos = offsets(event);
		var f = this.frame;
		if (this.dancers.active !== null)  {
				var dancer = this.dancers.active;
				dancer.xs[f] = this.snapH(pos.x-8);
				dancer.ys[f] = this.snapV(pos.y-8);
		} else {
				var insideSomeone = false;
				for (id in this.dancers.array) {
						var d = this.dancers.array[id];
						if( insideDancer(d,f,pos.x,pos.y) ) {
								insideSomeone = true;
								this._focused = d;
						}
				}
				if(!insideSomeone) this._focused = null;
		}

		this.draw();
		if (this._focused) {
				console.log("focused on: ", this._focused.name);
		}

}
Stage.prototype._onMouseDown = function(event) {
		//console.log("mousedown");
}
Stage.prototype._onMouseUp = function(event) {
//		console.log("mouseup");
}
Stage.prototype._onClick = function(event) {
		var pos = offsets(event);
		var f = this.frame;

		var insideSomeone = false;
		for (id in this.dancers.array) {
				var d = this.dancers.array[id];
				if( insideDancer(d,f,pos.x,pos.y) && d !== this.dancers.active) {
						insideSomeone = true;
						this.dancers.makeActive(d);
				}
		}
		if (!insideSomeone) this.dancers.makeInactive();

}
