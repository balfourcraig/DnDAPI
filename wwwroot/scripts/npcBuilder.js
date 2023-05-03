let savedCharacters = [];

let person = null;
window.addEventListener('DOMContentLoaded', () => {
	appendCharacter(buildRandomCharacter());
	document.getElementById('rollBtn').addEventListener('click', () => {
		appendCharacter(buildRandomCharacter());
	});
	document.getElementById('blankBtn').addEventListener('click', () => {
		appendCharacter(buildBlankCharacter());
	});
	document.getElementById('chatSendBtn').addEventListener('click', sendChatMessage);
	document.getElementById('chatResetBtn').addEventListener('click', resetChat);
	document.getElementById('chatInputBox').addEventListener('keyup', (e) => {
		if(e.keyCode === 13){
			sendChatMessage();
		}
	});
	document.getElementById('downloadBtn').addEventListener('click', exportAllCharactersToJSONFile);
	document.getElementById('uploadBtn').addEventListener('click', () => {
		document.getElementById('fileInput').click();
	});
	document.getElementById('fileInput').addEventListener('change', importCharactersFromJSONFile);
	resetChat();
	loadCharactersFromLocalStorage();
});

let messages = [];

function importCharactersFromJSONFile(){
	const fileInput = document.getElementById('fileInput');
	const file = fileInput.files[0];
	const reader = new FileReader();
	reader.onload = function(e) {
		const contents = e.target.result;
		try{
			const json = JSON.parse(contents);
			let chars = [];
			if(json.length)
				chars = json;
			else
				chars.push(json);
			for(let i = 0; i < chars.length; i++){
				for(let j = 0; j < savedCharacters.length; j++){
					if(savedCharacters[j].firstname === chars[i].firstname && savedCharacters[j].lastname === chars[i].lastname){
						savedCharacters.splice(j, 1);
						break;
					}
				}
				savedCharacters.push(chars[i]);
			}
		}
		catch(e){
			alert('Invalid file format');
			return;
		}
		saveCharacters();
	};
	reader.readAsText(file);
}

function exportAllCharactersToJSONFile(){
	const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedCharacters));
	const downloadAnchorNode = document.createElement('a');
	downloadAnchorNode.setAttribute("href",     dataStr);
	downloadAnchorNode.setAttribute("download", "characters.dndchar");
	document.body.appendChild(downloadAnchorNode); // required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();	
}
 
function exportCharToJSONFIle(c){
	const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(c));
	const downloadAnchorNode = document.createElement('a');
	downloadAnchorNode.setAttribute("href",     dataStr);
	downloadAnchorNode.setAttribute("download", c.firstname + c.lastname + ".dndchar");
	document.body.appendChild(downloadAnchorNode); // required for firefox
	downloadAnchorNode.click();
	downloadAnchorNode.remove();
}

function loadCharactersFromLocalStorage(){
	const data = localStorage.getItem('savedCharacters');
	if(data){
		const holder = document.getElementById('savedCharHolder');
		holder.innerHTML = '';
		savedCharacters = JSON.parse(data);
		for(let i = 0; i < savedCharacters.length; i++){
			const c = savedCharacters[i];
			const charBlock = document.createElement('div');
			charBlock.setAttribute('class','savedCharBlock');
			const name = document.createElement('div');
			name.setAttribute('class','charName');
			name.innerHTML = c.firstname + ' ' + c.lastname;
			charBlock.appendChild(name);

			const exportBtn = document.createElement('button');
			exportBtn.title = 'Export to file';
			exportBtn.setAttribute('class','randBtn');
			exportBtn.innerHTML = '&#11123;';
			exportBtn.addEventListener('click', () => {
				exportCharToJSONFIle(c);
			});
			charBlock.appendChild(exportBtn);

			const delCharBtn = document.createElement('button');
			delCharBtn.setAttribute('class','delBtn');
			delCharBtn.innerHTML = 'X';
			delCharBtn.addEventListener('click', () => {
				savedCharacters.splice(i, 1);
				saveCharacters();
				loadCharactersFromLocalStorage();
			});
			charBlock.appendChild(delCharBtn);
			charBlock.addEventListener('click', () => {
				appendCharacter(c);
			});
			holder.appendChild(charBlock);
		}
	}
}

function saveCharacters(){
	localStorage.setItem('savedCharacters', JSON.stringify(savedCharacters));
	loadCharactersFromLocalStorage();
}


function resetChat(){
	messages = [];
	const inputBox = document.getElementById('chatInputBox');
	inputBox.value = '';
	inputBox.disabled = false;
	document.getElementById('msgBlock').innerHTML = '';
}

function sendChatMessage(){
	const inputBox = document.getElementById('chatInputBox');
	const msg = inputBox.value;
	if(msg.trim() === ''){
		alert('Please enter a message');
	}
	else{
		messages.push({
			role: 'user',
			content: msg
		});
		const msgRow = buildMessage(msg, 'user', 'You');
		document.getElementById('msgBlock').appendChild(msgRow);
		inputBox.value = 'Loading...';
		inputBox.disabled = true;
		const address = apiAddress + `/api/NPC/Chat`;
		const requestData = {
			messages: messages,
			person: person
		};
		makePostRequest(address, JSON.stringify(requestData), (data) => {
			const response = JSON.parse(data);
			const msgRow = buildMessage(response.content, 'npc', person.firstname);
			messages.push(
				{
					role: 'assistant',
					content: response.content
				}
			);
			document.getElementById('msgBlock').appendChild(msgRow);
			inputBox.value = '';
			inputBox.disabled = false;
			inputBox.focus();
		});
	}
}

function buildBlankCharacter(){
	resetChat();
	const c = {};
	c.gender = '';
	c.firstname = '';
	c.lastname = '';
	c.race = '';
	c.loot = '';
	c.flavor = '';
	c.secret = '';
	c.voice = '';
	c.clothing = '';
	c.action = '';
	c.house = '';
	c.imageURL = null;
	c.description = null;
	c.profession = '';
	c.location = '';
	return c;
}

function buildRandomCharacter(){
	resetChat();
	const c = {};
	c.gender = Math.random() > 0.5 ? 'M' : 'F';
	c.firstname = arrayRandom(c.gender === 'M' ? npcFirstnameM.items : npcFirstnameF.items);
	c.lastname = arrayRandom(npcSurname.items);
	c.race = arrayRandom(npcRace.items);
	c.loot = generateLoot();//source from normal loot and gut wrench
	c.flavor = arrayRandom(npcFlavor.items);
	c.secret = arrayRandom(npcSecrets.items);
	c.voice = arrayRandom(voices.items);
	c.clothing = randomNPCOutfit(c.gender);
	c.action = generateAction();
	c.house = buildHouse();
	c.imageURL = null;
	c.description = null;
	c.profession = arrayRandom(npcProfessions.items);
	c.location = '';
	return c;
}

function generateAction(){
	const r = Math.random();
	if(r < 0.7)
		return arrayRandom(actions.items)
	else if(r < 0.85)
		return 'Saying: "' + arrayRandom(overheard.items) + '"';
	else if(r < 0.95)
		return 'Praying: "' + arrayRandom(prayers.items) + '"';
	else
		return 'Joking: "...' + arrayRandom(punchlines.items) + '"';
}

function generateLoot(){
	const numItems = ~~(Math.random() * 4) + 1;
	let items = '';
	for(let i = 0; i < numItems; i++){
		const r = Math.random();
		if(r < 0.1)
			items += arrayRandom(gutWrench.items) + '\n';
		else
			items += arrayRandom(clutter.items) + '\n';
	}
	return items.trim();
}

function appendCharacter(c){
	if(person){
		if(person.imageURL && !c.imageURL)
			c.imageURL = person.imageURL;
		if(person.description && !c.description)
			c.description = person.description;
	}

	const charBlock = document.createElement('div');
	charBlock.setAttribute('class','charBlock');

	const saveBtn = document.createElement('button');

	saveBtn.innerHTML = '&#128190;  Save'
	saveBtn.addEventListener('click', () => {
		let existing = false;
		for(let i = 0; i < savedCharacters.length; i++){
			if(savedCharacters[i].firstname === c.firstname && savedCharacters[i].lastname === c.lastname){
				savedCharacters[i] = c;
				existing = true;
				break;
			}
		}
		if(!existing)
			savedCharacters.push(c);
		saveCharacters();
	});
	charBlock.appendChild(saveBtn);

	const picHolder = document.createElement('div');
	picHolder.setAttribute('class','picHolder');
	const profileHolder = document.createElement('div');

	const imgBtn = document.createElement('button');
	picHolder.appendChild(imgBtn);
	picHolder.appendChild(profileHolder);
	imgBtn.addEventListener('click', () => {
		profileHolder.innerHTML = 'Loading...';
		imgBtn.style.display = 'none';
		const address = apiAddress + `/api/NPC/Image`;
		makePostRequest(address, JSON.stringify(c), (data) => {
			appendCharacter(JSON.parse(data));
		});
	});
	if(c.imageURL){
		imgBtn.innerHTML = 'Regenerate Image';
		const pic = document.createElement('img');
		pic.src = c.imageURL;
		pic.setAttribute('class','profilePic');
		profileHolder.appendChild(pic);
	}
	else{
		imgBtn.innerHTML = 'Generate Image';
	}

	const headerBlock = document.createElement('div');
	headerBlock.setAttribute('class','charHeader');
	headerBlock.appendChild(picHolder);
	const nameBlock = document.createElement('div');
	nameBlock.setAttribute('class', 'nameBlock');
	nameBlock.appendChild(buildLine(
		c.firstname, 
		'Firstname', 
		() => arrayRandom(c.gender === 'M' ? npcFirstnameM.items : npcFirstnameF.items), 
		(e) => {
			c.firstname = e;
			document.getElementById('chatTitle').innerText = `Talk to ${e}`;
		},
		true
		));
	nameBlock.appendChild(buildLine(c.lastname, 'Surname', () => arrayRandom(npcSurname.items), (e) => c.lastname = e));
	
	headerBlock.appendChild(nameBlock);
	charBlock.appendChild(headerBlock);
	
	const detailsTbl = document.createElement('table');
	detailsTbl.setAttribute('class','detailsTable');
	detailsTbl.appendChild(buildRowBlock(c.gender, 'Gender', () => c.gender == 'M' ? 'F' : 'M',
		(e) => {
			c.gender = e;
		})
	);
	detailsTbl.appendChild(buildRowBlock(c.race, 'Race', () => arrayRandom(npcRace.items), (e) => c.race = e));

	const descriptionRow = document.createElement('tr');
	descriptionRow.setAttribute('class', 'lineArea');
	const descriptionLabelArea = document.createElement('td');
	const descriptionLabel = document.createElement('label');
	descriptionLabel.innerText = 'Description';
	descriptionLabel.setAttribute('class','tblLabel');
	descriptionLabelArea.appendChild(descriptionLabel);
	const descriptionInput = document.createElement('td');
	const descriptionInputArea = document.createElement('div');
	const descriptionBtnArea = document.createElement('td');
	if(c.description){
		descriptionInputArea.innerText = c.description ? c.description : '';
	}
	else{
		const descriptionBtn = document.createElement('button');
		descriptionBtn.innerText = 'Generate Description';
		descriptionBtn.addEventListener('click', () => {
			descriptionInputArea.innerText = 'Loading...';
			descriptionBtn.style.display = 'none';
			const address = apiAddress + `/api/NPC/LongDescription?sentences=2`;
			makePostRequest(address, JSON.stringify(c), (data) => {
				appendCharacter(JSON.parse(data));
			});
		});
		descriptionBtnArea.appendChild(descriptionBtn);
	}
	descriptionInput.appendChild(descriptionInputArea);
	descriptionRow.appendChild(descriptionLabelArea);
	descriptionRow.appendChild(descriptionInput);
	descriptionRow.appendChild(descriptionBtnArea);
	detailsTbl.appendChild(descriptionRow);

	detailsTbl.appendChild(buildRowBlock(c.voice, 'Voice', () => arrayRandom(voices.items), (e) => c.voice = e));
	detailsTbl.appendChild(buildRowBlock(c.clothing, 'Clothing', () => randomNPCOutfit(c.gender), (e) => c.clothing = e));
	detailsTbl.appendChild(buildRowBlock(c.loot, 'Loot', generateLoot, (e) => c.loot = e));
	detailsTbl.appendChild(buildRowBlock(c.action, 'Doing', generateAction, (e) => c.action = e));
	detailsTbl.appendChild(buildRowBlock(c.flavor, 'Detail', () => arrayRandom(npcFlavor.items), (e) => c.flavor = e));
	detailsTbl.appendChild(buildRowBlock(c.secret, 'Secret', () => arrayRandom(npcSecrets.items), (e) => c.secret = e));
	detailsTbl.appendChild(buildRowBlock(c.house, 'House', buildHouse, (e) => c.house = e));
	detailsTbl.appendChild(buildRowBlock(c.profession, 'Profession', () => arrayRandom(npcProfessions.items), (e) => c.profession = e));
	detailsTbl.appendChild(buildRowBlock(c.location, 'Location', () => '', (e) => c.location = e));
	
	charBlock.appendChild(detailsTbl);

	const charArea = document.getElementById('charArea');
	charArea.innerHTML = '';
	charArea.appendChild(charBlock);
	person = c;
}

let lineUniquifier = 1;

function buildMessage(contents, sender, label){
	const row = document.createElement('div');
	row.classList.add('msgRow');
	row.classList.add(sender);
	const msg = document.createElement('div');
	msg.classList.add('msg');
	const msgLabel = document.createElement('div');
	msgLabel.classList.add('msgHeader');
	msgLabel.innerText = label;
	msg.appendChild(msgLabel);
	const msgContent = document.createElement('div');
	msgContent.classList.add('msgContent');
	msgContent.innerText = contents;
	msg.appendChild(msgContent);
	row.appendChild(msg);
	return row;
}

function buildRowBlock(content, name, randFunc, updateFunc){
	const row = document.createElement('tr');
	row.setAttribute('class', 'lineArea');
	const randBtn = document.createElement('button');
	randBtn.innerHTML = '&#127922;';
	randBtn.setAttribute('class', 'randBtn');
	const inp = document.createElement('div');
	inp.setAttribute('contentEditable','true');
	inp.setAttribute('class',name.toLowerCase());
	inp.addEventListener('input', () => updateFunc(inp.innerText));
	inp.innerText = content;
	inp.id = 'line' + lineUniquifier;
	inp.setAttribute('spellcheck', 'false');

	lineUniquifier++;
	const label = document.createElement('label');
	label.innerHTML = name;
	label.htmlFor = inp.id;
	randBtn.addEventListener('click', () => {
		inp.innerText = randFunc();
		updateFunc(inp.innerText);
	});

	const labelTd = document.createElement('td');
	labelTd.setAttribute('class','tblLabel');
	const randTd = document.createElement('td');
	randTd.setAttribute('class','tblRand');
	const inpTd = document.createElement('td');
	inpTd.setAttribute('class','tblInp');
	
	labelTd.appendChild(label);
	randTd.appendChild(randBtn);
	inpTd.appendChild(inp);
	row.appendChild(labelTd);
	row.appendChild(inpTd);
	row.appendChild(randTd);
	
	return row;
}

function buildLine(content, name, randFunc, updateFunc, updateOnCreate = false){
	const lineArea = document.createElement('div');
	lineArea.setAttribute('class', 'lineArea');
	const randBtn = document.createElement('button');
	randBtn.innerHTML = '&#127922;';
	randBtn.setAttribute('class', 'randBtn');
	const inp = document.createElement('div');
	inp.setAttribute('contentEditable','true');
	inp.setAttribute('spellcheck', 'false');
	inp.setAttribute('class',name.toLowerCase());
	inp.addEventListener('input', () => updateFunc(inp.innerText));
	inp.innerText = content;
	inp.id = 'line' + lineUniquifier;
	lineUniquifier++;
	const label = document.createElement('label');
	label.innerHTML = name;
	label.htmlFor = inp.id;
	randBtn.addEventListener('click', () => {
		inp.innerText = randFunc();
		updateFunc(inp.innerText);
	});
	if(updateOnCreate){
		updateFunc(inp.innerText);
	}
	lineArea.appendChild(label);
	lineArea.appendChild(inp);
	lineArea.appendChild(randBtn);
	
	return lineArea;
}

