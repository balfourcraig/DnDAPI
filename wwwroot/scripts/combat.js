function getDescription(){
    let weapon = document.getElementById("weaponSelect").value;
    if(weapon == "CUSTOM")
        weapon = document.getElementById("customWeaponInp").value;
    let enemy = document.getElementById("enemySelect").value;
    if(enemy == "CUSTOM")
        enemy = document.getElementById("customEnemyInp").value;
    let theme = document.getElementById("themeSelect").value;
    if(theme == "CUSTOM")
        theme = document.getElementById("customThemeInp").value;
    let style = document.getElementById("styleSelect").value;
    if(style == "CUSTOM")
        style = document.getElementById("customStyleInp").value;
    const length = parseInt(document.getElementById("lengthSelect").value);
    if(weapon == "" || enemy == ""){
        document.getElementById("description").innerText = "Please select at least weapon and an enemy.";
        return;
    }
    document.getElementById("description").innerText = "Loading...";
    let address = apiAddress + `/api/Combat?weapon=${weapon}&enemy=${enemy}`;
    if(theme != "")
        address += `&theme=${theme}`;
    if(style != "") 
        address += `&style=${style}`;
    address += `&sentences=${length}`;
    makeGetRequest(address, 
    (data) => { 
        const response = JSON.parse(data);
        document.getElementById("description").innerText = response.response;
    });
}

const weapons = [
    'Sword', 
    'Axe',
    'Mace',
    'Dagger',
    'Spear',
    'Bow',
    'Crossbow',
    'Staff',
    'Wand',
    'Whip',
    'Club',
    'Flail',
    'Hammer',
    'Sling',
    'Revolver',
    'Rifle',
    'Shotgun',
    'Musket',
    'Fireball',
    'Fire Bolt',
    'Lightning Bolt',
    'Acid Splash',
    'Poison Spray',
    'Ray of Frost',
    'Chill Touch',
    'Eldritch Blast',
    'Thunderclap',
    'Vicious Mockery',
];

const enemies = [
    'Goblin', 
    'Orc', 
    'Troll', 
    'Giant', 
    'Dragon',
    'Undead', 
    'Humanoid', 
    'Construct',
    'Elemental',
    'Fey',
    'Fiend',
    'Monstrosity',
    'Ooze',
    'Plant',
    'Beast',
    'Aberration',
];



window.addEventListener('DOMContentLoaded', () => {
	createSelectWithCustom('weaponSelectHolder', weapons, 'weapon', 'Weapon');
    createSelectWithCustom('enemySelectHolder', enemies, 'enemy', 'Enemy');
    createSelectWithCustom('themeSelectHolder', themes, 'theme', 'Theme');
    createSelectWithCustom('styleSelectHolder', styles, 'style', 'Style');
    document.getElementById('descBtn').addEventListener('click', getDescription);
});