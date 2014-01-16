$("#display-in-arrows").change(function() {
		console.log("changing");
		stage.displayInArrows = !stage.displayInArrows;
		stage.draw();
});

$("#display-out-arrows").change(function() {
		stage.displayOutArrows = !stage.displayOutArrows;
		stage.draw();
});

$("#display-names").change(function() {
		stage.displayNames = !stage.displayNames;
		stage.draw();
});

$("#display-grid").change(function() {
		stage.displayGrid = !stage.displayGrid;
		stage.draw();
});

$("#previous-frame").click(function() {
		if (stage.frame > 0) {stage.frame--;}
		updateFrameCountUI();
		stage.draw();
});

$("#next-frame").click(function() {
		if (stage.frame+1 < stage.frameCount) {
		stage.frame++;
    }
		updateFrameCountUI();
		stage.draw();
});

$("#make-stage-image").click(function() {
		var str = stage.canvas.toDataURL();
		document.getElementById("stage-image").src = str;
});

$("#clear-stage").click(function() {
		var id;
		var f = stage.frame;
		stage.dancers.makeInactive();
		for (id in stage.dancers.array) {
				stage.dancers.array[id].xs[f] = undefined;
				stage.dancers.array[id].ys[f] = undefined;
		}
		stage.draw();
});

$("#num-marker-input-submit").click(function() {
		var numHorz = parseInt($("#num-marker-input-horz").val(), 10);
		var numVert = parseInt($("#num-marker-input-vert").val(), 10);
		console.log("Setting", numHorz, numVert);
		stage.setMarkers(numHorz, numVert);
		stage.draw();
});

$("#transition-add-in-arrow").click(function() {
		if (!stage.displayInArrows) {
				console.log("Not showing in arrows");
		} else {
				console.log("everythng good");
		}
});

$("#transition-add-out-arrow").click(function() {
		if (!stage.displayOutArrows) {
				console.log("Not showing out arrows");
		} else {
				console.log("everythng good out");
		}
});

$("#formation-add-frame").click(function() {
		stage.frameCount++;
		var newf = stage.frameCount-1;
		var prevf = newf-1;

		stage.dancers.makeInactive();
		for (id in stage.dancers.array) {
				stage.dancers.array[id].xs[newf] =
						stage.dancers.array[id].xs[prevf];
				stage.dancers.array[id].ys[newf] =
						stage.dancers.array[id].ys[prevf];
		}
		stage.frame = newf;

		updateFrameCountUI();
		stage.draw();
});

$("#formation-save-formation").click(function() {
		var stageString = stage.serialize();
		window.location.search = "?stage="+stageString;
});

$("#formation-clear-all").click(function() {
		window.location.search = "";
});

$("#addDancerButton").click(function() {
		var name = $("#addDancerName").val();
  	var gender = $("#addDancerGender").val()[0];
  	var color = $("#addDancerColor").val().toLowerCase();
  	stage.addDancer(name, gender, color);
});
