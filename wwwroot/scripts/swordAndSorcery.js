let story = null;

function generateSnSStory(){
	let theme = document.getElementById("themeSelect").value;
    if(theme == "CUSTOM")
        theme = document.getElementById("customThemeInp").value;
	story = {
		title: buildSnSTitle(),
		mission: buildSnSMission(),
		hook: arrayRandom(snSHook),
		antagonist: arrayRandom(snSAntagonist),
		ally: arrayRandom(snSPotentialAlly),
		complication: arrayRandom(snSComplication),
		obstacle: arrayRandom(snSObstacle),
		twist: arrayRandom(snSTwist),
		reward: arrayRandom(snSReward),
		description: '',
		theme: theme
	};
	printStory();
}

function printStory(){
	document.getElementById('SnSTitle').innerText = story.title;
	document.getElementById('missionBlock').innerText = 'Mission: ' + story.mission;
	document.getElementById('hookBlock').innerText = 'Hook: ' + story.hook;
	document.getElementById('antagonistBlock').innerText = 'Antagonist: ' + story.antagonist;
	document.getElementById('potentialAllyBlock').innerText = 'Potential Ally: ' + story.ally;
	document.getElementById('complicationBlock').innerText = 'Complication: ' + story.complication;
	document.getElementById('obstacleBlock').innerText = 'Obstacle: ' + story.obstacle;
	document.getElementById('twistBlock').innerText = 'Twist: ' + story.twist;
	document.getElementById('rewardBlock').innerText = 'Reward: ' + story.reward;
	if(story.description != null && story.description != '')
		document.getElementById('desc').innerText = story.description;
	else
		document.getElementById('desc').innerText = 'Click the button to generate a description.';
}

function buildSnSTitle(){
	const p1 = arrayRandom(snSTitle1.items);
	const p2 = arrayRandom(snSTitle2.items);
	return p1 + ' of ' + p2;
}

function buildSnSMission(){
	const m = arrayRandom(snSMission);
	const mText = m.mission + ' the ';
	if(m.targetType === 'person'){
		return mText + arrayRandom(snSPerson);
	}
	else if(m.targetType === 'place'){
		return mText + arrayRandom(snSPlace);
	}
	else if(m.targetType === 'thing'){
		return mText + arrayRandom(snSThing);
	}
	return mText;
}

function getDescription(){
    if(story == null){
		generateSnSStory();
	}
	let theme = document.getElementById("themeSelect").value;
    if(theme == "CUSTOM")
        theme = document.getElementById("customThemeInp").value;
	story.theme = theme;
    document.getElementById("desc").innerText = "Loading...";
	const btn = document.getElementById("descBtn");
	btn.disabled = true;
    let address = apiAddress + `/api/Quest/LongDescription`;
    
	const length = document.getElementById("lengthSelect").value;
    address += `&sentences=${length}`;
    makePostRequest(address, JSON.stringify(story),
    (data) => { 
		btn.disabled = false;
        const response = JSON.parse(data);
        story = response;
		printStory();
    });
}

function getImage(){
	if(story == null){
		generateSnSStory();
	}
	let theme = document.getElementById("themeSelect").value;
    if(theme == "CUSTOM")
        theme = document.getElementById("customThemeInp").value;
	story.theme = theme;
    document.getElementById("imgHolder").innerText = "Loading...";
	const btn = document.getElementById("imgBtn");
	btn.disabled = true;
    let address = apiAddress + `https://dndtools.azurewebsites.net/api/Quest/Image`;

    makePostRequest(address, JSON.stringify(story),
    (data) => { 
		btn.disabled = false;
        const response = JSON.parse(data);
        const img = document.createElement('img');
		img.src = response;
		document.getElementById("imgHolder").innerText = "";
		document.getElementById("imgHolder").appendChild(img);
    });
}

window.addEventListener('DOMContentLoaded', () => {
	createSelectWithCustom('themeSelectHolder', themes, 'theme', 'Theme');
	generateSnSStory();
	document.getElementById('rollBtn').addEventListener('click', generateSnSStory);
	document.getElementById('descBtn').addEventListener('click', getDescription);
	document.getElementById('imgBtn').addEventListener('click', getImage);
});