const dndAPI = 'https://www.dnd5eapi.co';

let creatures = [];

const areas = [
    {name: 'Monsters', url: '/api/monsters'},
    {name: 'Spells', url: '/api/spells'},
    {name: 'Items', url: '/api/equipment'},
    {name: 'Classes', url: '/api/classes'},
    {name: 'Conditions', url: '/api/conditions'},
    {name: 'Races', url: '/api/races'},
    {name: 'Skills', url: '/api/skills'},
    {name: 'Languages', url: '/api/languages'},
    {name: 'Damage Types', url: '/api/damage-types'},
    {name: 'Weapon Properties', url: '/api/weapon-properties'},
];

function setUpSelect(){
    const select = document.getElementById('areaSelect');
    for(let area of areas){
        const option = document.createElement('option');
        option.value = area.url;
        option.innerText = area.name;
        select.appendChild(option);
    }
}

function getArea() {
    const select = document.getElementById('areaSelect');
    document.getElementById('creatureSearch').value = '';
    fetch(dndAPI + select.value)
        .then(response => response.json())
        .then(data => {
            creatures = data.results;
            searchCreatures(true);
        });
}

function searchResult(name, url){
    const creatureListItem = document.createElement('li');
    creatureListItem.addEventListener('click', () => {
        const creatureHolder = document.getElementById('creatureHolder');
        fetchDnDData(url, creatureHolder);
        const creatureListHolder = document.getElementById('creatureList');
        creatureListHolder.innerHTML = '';
        const creatureList = document.createElement('ul');
        creatureList.appendChild(searchResult(name,url));
        creatureListHolder.appendChild(creatureList);
    });
    creatureListItem.innerText = name; 
    return creatureListItem;
}

function searchCreatures(displayAll = false) {
    let search = document.getElementById('creatureSearch').value;
    const creatureListHolder = document.getElementById('creatureList');
    creatureListHolder.innerHTML = '';
    if(!displayAll && search.length < 2){
        return;
    }
    else{
        let filteredCreatures = creatures.filter(creature => creature.name.toLowerCase().includes(search.trim().toLowerCase()));
        
        const creatureList = document.createElement('ul');
        for(let creature of filteredCreatures) {
            creatureList.appendChild(searchResult(creature.name, creature.url));
        }
        creatureListHolder.appendChild(creatureList);
    }
}


window.addEventListener('DOMContentLoaded', () => {
    setUpSelect();
    document.getElementById('areaSelect').addEventListener('change', getArea);
    getArea();
    document.getElementById('creatureSearch').addEventListener('input', searchCreatures);
});