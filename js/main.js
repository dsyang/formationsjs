function main_init(elemid) {
		var stage  = new Stage(document.getElementById(elemid));
		stage.displayInArrows = $("#display-in-arrows").prop("checked");
		stage.displayOutArrows = $("#display-out-arrows").prop("checked");
		stage.displayNames = $("#display-names").prop("checked");
		stage.displayGrid = $("#display-grid").prop("checked");
		var str = loadPageVar("stage");
		if (str !== "") {

				Stage.deserializeInto(str, stage);

		} else {

				stage.setMarkers(6,3);

				stage.addDancer("Vijay", "M", "yellow");
				stage.addDancer("Vsai", "M", "yellow");
				stage.addDancer("Shals", "F", "yellow");
				stage.addDancer("Mitra", "F", "yellow");
				stage.addDancer("Samir", "M", "pink");
				stage.addDancer("Shawn", "M", "pink");
				stage.addDancer("Shaina", "F", "pink");
				stage.addDancer("Yazzy", "F", "pink");
				stage.addDancer("Sid", "M", "purple");
				stage.addDancer("Ankur", "M", "purple");
				stage.addDancer("Shahana", "F", "purple");
				stage.addDancer("Sowmya", "F", "purple");

		}
		return stage;
}

function updateFrameCountUI() {
		$("#current-frame").html(stage.frame+1);
		$("#total-frames").html(stage.frameCount);
}
