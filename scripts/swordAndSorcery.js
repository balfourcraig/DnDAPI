let story = null;

function generateSnSStory(){
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


window.addEventListener('DOMContentLoaded', () => {
	generateSnSStory();
	document.getElementById('rollBtn').addEventListener('click', generateSnSStory);
});