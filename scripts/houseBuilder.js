window.addEventListener('DOMContentLoaded', () => {
	buildBuilding();
	document.getElementById('rollBtn').addEventListener('click', buildBuilding);
});

function buildBuilding(){
	container = document.getElementById('descShort');
	container.innerText = buildHouse();
}

