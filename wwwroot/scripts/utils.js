const golden_ratio= 1.618033988749895;
const goldenAngleRad = 2.39996322972865332;
const local = true;
// let apiDomain = 'dndtools.azurewebsites.net';
// let apiAddress = 'https://' + apiDomain;
// if(local){
// 	apiDomain = 'localhost';
// 	apiAddress = 'http://localhost:5235';
// }
apiAddress = '';
let randh = Math.random();

let userKeyVar = '';
function getUserKey(){
	const url = getUrlVars();
	if(url.key !== undefined){
		setCookie('userKey', url.key, 365);
	}
}
getUserKey();

function userKey(){
	if(!cookieExists('userKey')){
		const key = prompt('This function requires a password. Enter your user key');
		if(key)
			setCookie('userKey', key, 365);
	}
}

const cookieExists = (cName) => {
	return document.cookie.indexOf(cName) >= 0;
}

const getCookie = (cName) => {
	const name = cName + "=";
	const decodedCookie = decodeURIComponent(document.cookie);
	const ca = decodedCookie.split(';');
	for(let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

const setCookie = (cName, cValue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cName + "=" + cValue + ";" + expires + ";path=/" + ';SameSite=Strict;Secure';
}

const userPrefs = {};
const prefNames = ['theme', 'style'];
function getPrefs(){
	const url = getUrlVars();
	for(let p of prefNames){
		if(url[p] !== undefined){
			userPrefs[p] = url[p];
			localStorage.setItem(p, url[p]);
		}
		else if (localStorage.getItem(p) !== null){
			userPrefs[p] = localStorage.getItem(p);
		}
	}
}
getPrefs();

function savePref(name, value){
	if(prefNames.includes(name)){
		userPrefs[name] = value;
		localStorage.setItem(name, value);
	}
}

function addArticle(s){
	return (isVowel(s) ? 'an ' : 'a ') + s;
}

function isVowel(s){
	if(s && s.length > 0){
		s = s.toUpperCase();
		return s[0] === 'A' || s[0] === 'E' || s[0] === 'I' || s[0] === 'O' || s[0] === 'U';
	}
	else
		return false;
}

//text is number
function isNumber(text){
	return !isNaN(text);
}

function createSelectWithCustom(holderID, options, name, label){
	const isPref = prefNames.includes(name);
	const holder = document.getElementById(holderID);
	const select = document.createElement('select');
	select.id = name + 'Select';
	const custom = element('option', 'Custom', 'custom');
	custom.setAttribute('value', 'CUSTOM');
	const customInp = element('input', '', 'customInp');
	customInp.setAttribute('type', 'text');
	customInp.setAttribute('placeholder', 'Custom');
	customInp.id = 'custom' + name.charAt(0).toUpperCase() + name.slice(1) + 'Inp';
	if(userPrefs[name] && userPrefs[name].startsWith('CUSTOM')){
		custom.setAttribute('selected', 'selected');
		customInp.value = userPrefs[name].slice('CUSTOM'.length);
	}
	select.appendChild(custom);
	for(let i = 0; i < options.length; i++){
		const option = element('option', options[i]);
		option.setAttribute('value', options[i]);
		if(userPrefs[name] && userPrefs[name] == options[i]){
			option.setAttribute('selected', 'selected');
			customInp.classList.add('hidden');
		}
		select.appendChild(option);
	}
	holder.appendChild(select);
	
	holder.appendChild(customInp);
	holder.appendChild(element('label', label));
	customInp.addEventListener('input', () => {
		savePref(name, 'CUSTOM' + customInp.value);
	});
	select.addEventListener('change', () => {
		if(select.value == 'CUSTOM'){
			customInp.classList.remove('hidden');
			savePref(name, 'CUSTOM' + customInp.value)
		}
		else{
			customInp.classList.add('hidden');
			savePref(name, select.value);
		}
	});
}

function printListWithAnd(list){
	let str = '';
	for(let i = 0; i < list.length; i++){
		if(i == list.length - 1)
			str += 'and ' + list[i];
		else
			str += list[i] + ', ';
	}
	return str;
}

const compareStrings = (str1, str2, caseSensitive = false) => {
    if (!caseSensitive) {
        str1 = str1.toUpperCase();
        str2 = str2.toUpperCase();
    }
    const pairs1 = getAllPairs(str1);
    const pairs2 = getAllPairs(str2);
    if(pairs1.length === 0 || pairs2.length === 0)
        return 0;
    else{
        let intersection = 0;
        let union = pairs1.length + pairs2.length;
        for(let i = 0; i < pairs1.length; i++){
            const pair1 = pairs1[i];
            for(let j = 0; j < pairs2.length; j++){
                const pair2 = pairs2[j];
                if(pair1.c1 === pair2.c1 && pair1.c2 === pair2.c2){
                    intersection++;
                    pairs2.splice(j, 1);
                    break;
                }
            }
        }
        return (2.0 * intersection) / union;
    }
}

const getAllPairs = (str) => {
    const pairs = [];
    let pos = 0;
    for(let i = 0; i < str.length - 1; i++){
        if (str[i] != ' ' && str[i + 1] != ' ')
            pairs[pos++] = {c1: str[i], c2: str[i + 1]};
    }
    return pairs;
}

function getImageByPrompt(prompt, callback, theme = null){
	let address = `${apiAddress}/api/DnD/Image?key=${userKey()}&prompt=${prompt}`;
	if(theme)
		address += `&theme=${theme}`;
	makeGetRequest(address, (data) => {
		callback(JSON.parse(data));
	});
}

function makePostRequest(url, data, callback){
	userKey();
	const request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200)
			callback(request.responseText);
		else if (request.readyState == 4 && request.status == 401){
			const key = prompt('Incorrect key entered. Please enter a new key.');
			if(key){
				setCookie('userKey', key, 365);
				makePostRequest(url, data, callback);
			}	
		}

	}
	request.withCredentials = true;
	request.open('POST', url, true);
	request.setRequestHeader('Accept', 'application/json');
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(data);
}

function makeGetRequest(url, callback) {
	userKey();
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200)
			callback(request.responseText);
		else if (request.readyState == 4 && request.status == 401){
			const key = prompt('Incorrect key entered. Please enter a new key.');
			if(key){
				setCookie('userKey', key, 365);
				makeGetRequest(url, callback);
			}	
		}
	}
	request.withCredentials = true;
	request.open('GET', url, true);
	request.send();
}

function element(type, contents, htmlClass){
	const el = document.createElement(type);
	if(contents !== undefined)
		el.innerHTML = contents;
	if(htmlClass !== undefined)
		el.setAttribute('class', htmlClass);
	return el;
}

function arrayRandom(arr){
	return arr[Math.floor(Math.random() * arr.length)];
}

function removeFromArray(arr, item){
	let index = arr.indexOf(item);
	if(index !== -1)
		arr.splice(index, 1);
}

function round(num){
	return ~~(num + 0.5);
}

function nextGoldenRand(){
	randh += golden_ratio;
	randh %= 1;
	return randh;
}

function sumOffsets(el) {
    let sum = 0;
    while (el) {
        sum += el.offsetTop;
        el = el.offsetParent;
    }
    return sum;
}

function smoothMin(dstA, dstB, k){
	const h = Math.max(k - Math.abs(dstA-dstB), 0) / k;
	return Math.min(dstA, dstB) - h*h*h*k*1/6.0;//wut
}

function bias(x, biasAmount){
	const k = Math.pow(1-biasAmount, 3);
	return (x * k) / (x * k - x + 1);
}

function clamp(val, min, max){
	return Math.max(min, Math.min(val, max));
}

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

function stringHash(s, seed){
	const phi = 0.618033988749895;
	let hash = seed / phi;
	for (let i = s.length - 1; i >= 0; i--) {
		hash += phi * (phi / (i + 1)) * s.charCodeAt(i);
	}
	return hash % 1;
}

function radToDeg(rad){
	return rad * (180 / Math.PI);
}

function cosineInterpolate(start, end, position){
	const mapped = 0.5 * (-Math.cos(Math.PI * position)) + 0.5;
	return (mapped * (end - start)) + start;
}

function nextGoldenColor(sat, light){
	const num = nextGoldenRand();
	return 'hsl(' + (num * 360) + ', ' + sat + '%, ' + light + '%)';
}

function roundToPrecision(val, precision){
	const multiplier = Math.pow(10, precision || 0);
	return Math.round(val * multiplier) / multiplier;
}

function shuffleInplace(arr){
	let n = arr.length;
	while(n > 0){
		const r = Math.floor(Math.random() * n);
		const temp = arr[r];
		arr[r] = arr[n-1];
		arr[n-1] = temp;
		n--;
	}
}

function randomColor() {
	var letters = '0123456789ABC';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * letters.length)];
	}
	return color;
}

function pointReflect(origin, point, multiplier){
	const xDiff = origin.x - point.x;
	const yDiff = origin.y - point.y;

	const x = origin.x + xDiff * multiplier;
	const y = origin.y + yDiff * multiplier;
	return {x:x, y:y};
}

function pointByAngle(center, radius, angle){
	const x = Math.sin(angle) * radius + center.x;
	const y = Math.cos(angle) * radius + center.y;
	return {x:x, y:y};
}

function pointOnCircle(center, radius, totalPoints, pointNum){
	const angle = pointNum / totalPoints * Math.PI * 2;
	const x = Math.sin(angle) * radius + center.x;
	const y = Math.cos(angle) * radius + center.y;
	return {x:x, y:y};
}

function distance(p1, p2){
	const xDiff = p1.x - p2.x;
	const yDiff = p1.y - p2.y;
	return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

function midpoint(p1, p2){
	const x = (p1.x + p2.x) / 2;
	const y = (p1.y + p2.y) / 2;
	return {x:x, y:y};
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function boundedRandom(min, max) {
	//min = Math.ceil(min);
	//max = Math.floor(max);
	let num = (Math.random() * (max - min)) + min;
	return num;
}

function subdivideLine(p1, p2, totalSegments, seg){
	const xDiff = p2.x - p1.x;
	const yDiff = p2.y - p1.y;
	
	const ratio = (1/totalSegments) * seg;
	
	const x = xDiff * ratio + p1.x;
	const y = yDiff * ratio + p1.y;
	
	return {x:x, y:y};
}

function gcd(a, b){
	if(b == 0)
		return a;
	else
		return gcd(b, a % b);
}

function mapLinear(val, fromStart, fromEnd, toStart, toEnd){
	let fromDiff = fromEnd - fromStart;
	let toDiff = toEnd - toStart;

	let mapped = val - fromStart;
	mapped = mapped / fromDiff * toDiff;
	mapped += toStart;

	return mapped;
}

function MapPointSpace(point, xFromStart, xFromEnd, xToStart, xToEnd, yFromStart, yFromEnd, yToStart, yToEnd){
	return {
		x: mapLinear(point.x, xFromStart, xFromEnd, xToStart, xToEnd),
		y: mapLinear(point.y, yFromStart, yFromEnd, yToStart, yToEnd),
	};
}

function capitalize(s){
	return s[0].toUpperCase() + s.toLowerCase().substring(1);
}

function fullMod(lhs, rhs) {
	const r = lhs % rhs;
	return r < 0 ? r + rhs : r;
}

function randMany(arrs){//broken
  let totalLength = 0;
	for(let i = 0; i < arrs.length; i++){
    totalLength += arrs[i].length;
  }
	console.log('total length : ' + totalLength);
	const index = Math.floor(Math.random() * totalLength);
console.log('index: ' + index);
	let offset = 0;
	for(let i = 0; i < arrs.length; i++){
	console.log(offset);	
	if(offset + arrs[i].length < index){
			console.log('found');
			console.log(arrs[i][index - offset]);
			return arrs[i][index - offset];
		}
		else{
			offset += arrs[i].length;
		}
	}
}

function fetchDnDData(url, holder) {
    //document.getElementById('creatureList').innerHTML = '';
	holder.innerHTML = 'Loading...';
    fetch(dndAPI + url)
        .then(response => response.json())
        .then(data => {
            displayDnDData(data, holder);
        });
}

const ignoreProperties = [
    'index',
    'image',
    'url',
    'strength',
    'dexterity',
    'constitution',
    'intelligence',
    'wisdom',
    'charisma',
];

function formatName(name){
    return name.replace(/_/g, ' ');
}

function printDnDJson(item, topHolder, topLevel = false, parentProperty = ''){
    const holder = document.createElement('div');

    let isEmpty = true;
    let isLink = item['url'] !== undefined;
    if(item['strength'] !== undefined 
    && item['charisma'] !== undefined
    && item['constitution'] !== undefined
    && item['dexterity'] !== undefined
    && item['intelligence'] !== undefined
    && item['wisdom'] !== undefined){
        holder.appendChild(statBlock(item));
    }
    for(let property in item){
        if(!ignoreProperties.includes(property)){
            let propEmpty = true;
            const propHolder = document.createElement('div');
            propHolder.classList.add('propertyHolder');
            if(typeof item[property] === 'object'){
                const child = printDnDJson(item[property], topHolder, false, property);
                if(!child.empty){
                    if(isLink && property === 'name' && !topLevel){
                        const link = document.createElement('a');
                        link.href = '#';
                        link.innerText = formatName(property);
                        link.addEventListener('click', () => {
                            fetchDnDData(item['url'], topHolder);
                        });
                        propHolder.appendChild(link);
                    }
                    else if(!isNumber(property)){
                        const label = document.createElement('label'); 
                        label.innerText = formatName(property) + ': ';
                        propHolder.appendChild(label);
                    }
                    propHolder.appendChild(child.contents);
                    isEmpty = false;
                    propEmpty = false;
                }   
            }
            else{
                if(item[property] === null || item[property] === '' || (property === 'name' && topLevel))
                    continue;
                isEmpty = false;
                propEmpty = false;
                if(isLink && property === 'name' && !topLevel){
                    const link = document.createElement('a');
                    link.href = '#';
                    link.innerText = item[property];
                    link.addEventListener('click', () => {
                        fetchDnDData(item['url'], topHolder);
                    });
                    propHolder.appendChild(link);
                }
				else if (item[property].toString().startsWith('/api/')){
					const link = document.createElement('a');
					link.href = '#';
					link.innerText = formatName(property);
					link.addEventListener('click', () => {
						fetchDnDData(item[property], topHolder);
					});
					propHolder.appendChild(link);
				}
                else{
                    if(!isNumber(property) || parentProperty === 'slots'){
                        const label = document.createElement('label');
                        label.innerText = formatName(property) + ': ';
                        propHolder.appendChild(label);
                    }
                    
                    const value = document.createElement('span');
                    value.innerText = item[property];
                    propHolder.appendChild(value);
                }
            }
            if(!propEmpty)
			holder.appendChild(propHolder);
        }
        else if (property === 'image'){
            const image = document.createElement('img');
            image.src = dndAPI + item[property];
            holder.appendChild(image);
        }
    }
    if(topLevel && item['name'] !== undefined && item['image'] === undefined){
        const imageHolder = document.createElement('div');
        
        const imageBtn = document.createElement('button');
        imageBtn.innerText = 'Add Image';
        imageBtn.addEventListener('click', () => {
            imageHolder.innerHTML = 'Loading...';
            getImageByPrompt(addArticle(item['name']) + ' in D&D', (e) => {
                imageHolder.innerHTML = '';
                const image = document.createElement('img');
                image.src = e;
                imageHolder.appendChild(image);
            }, userPrefs.theme);
        });
        imageHolder.appendChild(imageBtn);
        holder.appendChild(imageHolder);
    }
    
    return {contents: holder, empty: isEmpty};
}

function statBlock(creature){
    const stats = [
        {name: 'STR', value: creature.strength},
        {name: 'DEX', value: creature.dexterity},
        {name: 'CON', value: creature.constitution},
        {name: 'INT', value: creature.intelligence},
        {name: 'WIS', value: creature.wisdom},
        {name: 'CHA', value: creature.charisma}
    ];
    const statBlock = document.createElement('table');
    statBlock.classList.add('statBlock');
    const statBlockHeader = document.createElement('tr');
    const statBlockValues = document.createElement('tr');
    const statBlockModifiers = document.createElement('tr');
    for(let stat of stats){
        const statBlockHeaderItem = document.createElement('th');
        statBlockHeaderItem.innerText = stat.name;
        statBlockHeader.appendChild(statBlockHeaderItem);
        const statBlockValue = document.createElement('td');
        statBlockValue.innerText = stat.value;
        statBlockValues.appendChild(statBlockValue);
        const statBlockModifier = document.createElement('td');
        statBlockModifier.innerText = Math.floor((stat.value - 10) / 2);
        statBlockModifiers.appendChild(statBlockModifier);
    }
    statBlock.appendChild(statBlockHeader);
    statBlock.appendChild(statBlockModifiers);
    statBlock.appendChild(statBlockValues);
    return statBlock;
}

function displayDnDData(creature, holder){
    //const holder = document.getElementById('creatureHolder');
    holder.innerHTML = '';
	if(creature['name'] !== undefined){
		const creatureName = document.createElement('h2');
		creatureName.innerText = creature.name;
		holder.appendChild(creatureName);
	}
    const creatureDetails = printDnDJson(creature, holder, true, '')
    holder.appendChild(creatureDetails.contents);
}