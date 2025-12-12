
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


window.addEventListener('DOMContentLoaded', () => {
    const urls = getUrlVars();
    if(urls['url']){
        fetchDnDData(urls['url'], document.getElementById('resultHolder'));
    }
});