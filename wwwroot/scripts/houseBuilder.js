window.addEventListener('DOMContentLoaded', () => {
	createSelectWithCustom('themeSelectHolder', themes, 'theme', 'Theme');
	buildBuilding();
	document.getElementById('rollBtn').addEventListener('click', buildBuilding);
	document.getElementById('descBtn').addEventListener('click', describeBuilding);
	document.getElementById('imgBtn').addEventListener('click', getImage);
});

function getImage(){
	let shortDesc = document.getElementById('descShort').innerText;
	if(shortDesc == "Loading..." || shortDesc == ""){
		alert("Please roll a building first.");
		return;
	}
	const btn = document.getElementById('imgBtn');
	btn.disabled = true;
	shortDesc = encodeURI(shortDesc);
	let address = apiAddress + `/api/Location/Image?prompt=${shortDesc}`;
	let theme = document.getElementById("themeSelect").value;
    if(theme == "CUSTOM")
        theme = document.getElementById("customThemeInp").value;
	if(theme != "")
        address += `&theme=${theme}`;
		
	const container = document.getElementById('imgHolder');
	container.innerHTML = "Loading...";
	makeGetRequest(address, 
	(data) => {
		container.innerHTML = "";
		btn.disabled = false;
		const response = JSON.parse(data);
		const img = document.createElement('img');
		img.src = response;
		img.alt = "Building Image";
		container.appendChild(img);
	});
}

function describeBuilding(){
	let shortDesc = document.getElementById('descShort').innerText;
	if(shortDesc == "Loading..." || shortDesc == ""){
		alert("Please roll a building first.");
		return;
	}
	let theme = document.getElementById("themeSelect").value;
    if(theme == "CUSTOM")
        theme = document.getElementById("customThemeInp").value;
    const length = parseInt(document.getElementById("lengthSelect").value);
	
	let address =  apiAddress + `/api/Location/LongDescription?shortDesc=${shortDesc}`;
	if(theme != "")
        address += `&theme=${theme}`;
    address += `&sentences=${length}`;
	shortDesc = encodeURI(shortDesc);
	const container = document.getElementById('descLong');
	container.innerHTML = "Loading...";
	makeGetRequest(address, 
	(data) => {
		const response = JSON.parse(data);
		container.innerText = response.response;
	});
}

function buildBuilding(){
	document.getElementById('descLong').innerHTML = "";
	container = document.getElementById('descShort');
	container.innerText = buildHouse();
	// container.innerText = "Loading...";
	// makeGetRequest(`https://dndtools.azurewebsites.net/api/Location/ShortDescription?key=${userKey()}`, 
	// (data) => {
	// 	const response = JSON.parse(data);
	// 	container.innerText = response.response;
	// });
}

