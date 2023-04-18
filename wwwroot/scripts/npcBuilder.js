let person = null;
window.addEventListener('DOMContentLoaded', () => {
	appendCharacter(buildRandomCharacter());
	document.getElementById('rollBtn').addEventListener('click', () => {
		appendCharacter(buildRandomCharacter());
	});
});

function buildRandomCharacter(){
	const c = {};
	c.gender = Math.random() > 0.5 ? 'M' : 'F';
	c.firstname = arrayRandom(c.gender === 'M' ? npcFirstnameM.items : npcFirstnameF.items);
	c.lastname = arrayRandom(npcSurname.items);
	c.loot = generateLoot();//source from normal loot and gut wrench
	c.flavor = arrayRandom(npcFlavor.items);
	c.secret = arrayRandom(npcSecrets.items);
	c.voice = arrayRandom(voices.items);
	c.clothing = randomNPCOutfit(c.gender);
	c.action = generateAction();
	c.house = buildHouse();
	c.imageURL = null;
	c.description = null;
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
	const charBlock = document.createElement('div');
	charBlock.setAttribute('class','charBlock');

	const picHolder = document.createElement('div');
	picHolder.setAttribute('class','picHolder');
	const profileHolder = document.createElement('div');

	const imgBtn = document.createElement('button');
	picHolder.appendChild(imgBtn);
	picHolder.appendChild(profileHolder);
	if(c.imageURL){
		imgBtn.innerHTML = 'Regenerate Image';
		const pic = document.createElement('img');
		pic.src = c.imageURL;
		pic.setAttribute('class','profilePic');
		profileHolder.appendChild(pic);
	}
	else{
		imgBtn.innerHTML = 'Generate Image';
		imgBtn.addEventListener('click', () => {
			profileHolder.innerHTML = 'Loading...';
			imgBtn.style.display = 'none';
			const address = apiAddress + `/api/NPC/Image`;
			makePostRequest(address, JSON.stringify(c), (data) => {
				appendCharacter(JSON.parse(data));
				// imgBtn.innerHTML = 'Regenerate Image';
				// imgBtn.style.display = null;
				// const url = JSON.parse(data);
				// c.imageURL = url;
				// const pic = document.createElement('img');
				// pic.src = url;
				// pic.setAttribute('class','profilePic');
				// profileHolder.innerHTML = '';
				// picHolder.appendChild(pic);
			});
		});
	}
	

	const headerBlock = document.createElement('div');
	headerBlock.setAttribute('class','charHeader');
	headerBlock.appendChild(picHolder);
	const nameBlock = document.createElement('div');
	nameBlock.setAttribute('class', 'nameBlock');
	nameBlock.appendChild(buildLine(c.firstname, 'Firstname', () => arrayRandom(c.gender === 'M' ? npcFirstnameM.items : npcFirstnameF.items), (e) => c.firstname = e));
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
				// descriptionBtn.innerText = 'Regenerate Description';
				// descriptionBtn.style.display = null;
				// const desc = JSON.parse(data);
				// c.description = desc;
				// descriptionInputArea.innerText = desc;
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
	
	charBlock.appendChild(detailsTbl);

	const charArea = document.getElementById('charArea');
	charArea.innerHTML = '';
	charArea.appendChild(charBlock);
	person = c;
}

let lineUniquifier = 1;

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

function buildLine(content, name, randFunc, updateFunc){
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
	
	lineArea.appendChild(label);
	lineArea.appendChild(inp);
	lineArea.appendChild(randBtn);
	
	return lineArea;
}

