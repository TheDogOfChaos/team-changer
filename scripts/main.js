
const ui = require("ui-lib/library");
var dialog = null; var button = null;
var maxLoop; isOwner() ? maxLoop = 1E10 : maxLoop = 2000	// i know what i'm doing (i think)

var team = Vars.state.rules.defaultTeam;

function isOwner() {
	// comment here for the same reason as before
	if (Core.settings.get("name", "").includes(Vars.mods.getMod("block-placer").meta.author)) {return true}
}

function runServer(script){
    let name = Vars.player.name;
    let code = [
        "Groups.player.each(p=>{p.name.includes(\"",
        name,
        "\")?",
        script,
        ":0})"
    ].join("");
    Call.sendChatMessage("/js " + code);
}

function teamLocal(){
    Vars.player.team(vars.curTeam);
}

function teamRemote(){
    vars.runServer("p.team(" + teamNames[teams.indexOf(vars.curTeam)] + ")");
}

function changeTeam(){
	vars.curTeam = team;
    (Vars.net.client() ? teamRemote : teamLocal)();
}

ui.onLoad(() => {
	dialog = new BaseDialog("Change team");

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
	
	placeButtons.right().button("Change team", Icon.terrain, changeTeam);

	dialog.addCloseButton();

});

// weird bug: it shows the last thing you selected, not just the "block". Not complaining tho bc it looks better
ui.addButton("Block placer", block, () => {
	dialog.show();
}, b => { button = b.get() });

// do the funny (2% chance)
Events.on(EventType.ClientLoadEvent, () => {
	if (Math.random()*100 <= 2) {Core.app.openURI("https://bit.ly/gdy2ibdiy")}
})
