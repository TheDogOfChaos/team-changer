
const ui = require("ui-lib/library");
var dialog = null; var button = null;
var team = Vars.state.rules.defaultTeam;
var curTeam = Vars.state.rules.defaultTeam;

// executes code serverside via js-eval
function runServer(){
    let name = Vars.player.name;
    let script = ("p.team(" + team.get(curTeam)] + ")");
    let code = ["Groups.player.each(p=>{p.name.includes(\"", name, "\")?", script, ":0})"].join("");
    Call.sendChatMessage("/js " + code);
}

// clientside change, purely visual unless playing in singleplayer
function teamLocal(){
    Vars.player.team(curTeam);
}

// calls runServer and teamLocal
function changeTeam(){
    curTeam = team;
    (Vars.net.client() ? runServer : teamLocal)();
}

// executed once ui button is pressed
ui.onLoad(() => {
	dialog = new BaseDialog("Change team");
	const table = dialog.cont;
	const sliders = table.table().bottom().center().get();
	var teamSlider, teamField;
	
	sliders.add("          ");
	teamSlider = sliders.slider(0, 255, 1, team, t => {
		team = team.get(t);
		teamField.text = t;
	}).get();

	sliders.add(" team id: ");
	teamField = sliders.field(team.id, text => {
		team = team.get(parseInt(text));
		teamSlider.value = parseInt(text);
	}).get();
	teamField.validator = text => !isNaN(parseInt(text));

	table.row();
	var placeButtons = table.table().bottom().get();
	placeButtons.right().button("Change team", Icon.refresh, changeTeam);
	dialog.addCloseButton();
});

// ui button itself
ui.addButton("Block placer", Icon.refresh, () => {
	dialog.show();
});

// do the funny (2% chance)
Events.on(EventType.ClientLoadEvent, () => {
	if (Math.random()*100 <= 2) {Core.app.openURI("https://bit.ly/gdy2ibdiy")}
})
