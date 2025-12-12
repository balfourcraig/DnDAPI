window.addEventListener('DOMContentLoaded', () => {
    loadParty();
    loadMonsters();


    document.getElementById('damageDiceString').addEventListener('change', saveMonsters);
    document.getElementById('numMonstersInput').addEventListener('change', saveMonsters);
    document.getElementById('toHitInput').addEventListener('change', saveMonsters);
    document.getElementById('autoCritHit').addEventListener('change', saveMonsters);
    document.getElementById('damageRoundingSelect').addEventListener('change', saveMonsters);
    document.getElementById('hitsPerMonsterInput').addEventListener('change', saveMonsters);
    document.getElementById('rollBtn').addEventListener('click', rollClick);
    document.getElementById('addMemberBtn').addEventListener('click', () => {
        addMemberToForm({
            name: 'Player ' + (getPartyMembers(false).length + 1),
            ac: 10,
            active: true
        });
    });
    document.getElementById('clearBtn').addEventListener('click', () => {
        document.getElementById('resultsArea').classList.add('hidden');
    })
});

function getPartyMembers(activeOnly){
    const partyHolder = document.getElementById('partyMembersHolder');
    const party = [];
    for(let block of partyHolder.children){
        const active = block.querySelector('.memberActiveChk').checked;
        if((!activeOnly) || active){
            const name = block.querySelector('.memberName').value;
            const ac = parseInt(block.querySelector('.memberAC').value);
            const adDis = block.querySelector('select').value;
            party.push({
                name: name,
                ac: ac,
                damage: 0,
                hitCounter: 0,
                active: active,
                adDis: adDis
            });
        }
    }
    return party;
}

function saveMonsters(){
    const monsterStats = {
        inputString: document.getElementById('damageDiceString').value,
        numMonsters: parseInt(document.getElementById('numMonstersInput').value),
        toHitBonus: parseInt(document.getElementById('toHitInput').value),
        autoHitCrits: document.getElementById('autoCritHit').checked,
        damageRounding: document.getElementById('damageRoundingSelect').value,
        hitsPerMonster: parseInt(document.getElementById('hitsPerMonsterInput').value)
    }
    localStorage.setItem('monsterStats', JSON.stringify(monsterStats));
}

function loadMonsters(){
    const monstersString = localStorage.getItem('monsterStats');
    if(monstersString){
        const monsterStats = JSON.parse(monstersString);
        document.getElementById('damageDiceString').value = monsterStats.inputString;
        document.getElementById('numMonstersInput').value = monsterStats.numMonsters;
        document.getElementById('toHitInput').value = monsterStats.toHitBonus;
        document.getElementById('autoCritHit').checked = monsterStats.autoHitCrits;
        document.getElementById('damageRoundingSelect').value = monsterStats.damageRounding;
        document.getElementById('hitsPerMonsterInput').value = monsterStats.hitsPerMonster;
    }
}

function saveParty(){
    const party = getPartyMembers(false);
    localStorage.setItem('party', JSON.stringify(party));
}

function loadParty(){
    const partyString = localStorage.getItem('party');
    if(partyString){
        const party = JSON.parse(partyString);
        for(let member of party){
            addMemberToForm(member);
        }
    }
}

function addMemberToForm(member){
    const partyHolder = document.getElementById('partyMembersHolder');
    const div = element('div', '', 'partyMember');
    const selectCheck = element('input', '', 'memberActiveChk');
    selectCheck.type = 'checkbox';
    selectCheck.checked = member.active;
    selectCheck.addEventListener('change', saveParty);
    div.appendChild(selectCheck);

    div.appendChild(element('label', 'Name: '));
    const nameInp = element('input', '', 'memberName');
    nameInp.type = 'text';
    nameInp.placeholder = 'Name';
    nameInp.value = member.name;
    nameInp.addEventListener('change', saveParty);
    div.appendChild(nameInp);

    div.appendChild(element('label', 'AC: '));
    const acInp = element('input', '', 'memberAC');
    acInp.type = 'number';
    acInp.placeholder = 'AC';
    acInp.value = member.ac;
    acInp.addEventListener('change', saveParty);
    div.appendChild(acInp);

    div.appendChild(element('label', 'Modifier: '));
    const adDisSelect = element('select');
    const adDisNone = element('option', 'None');
    adDisNone.value = 'none';
    adDisSelect.appendChild(adDisNone);

    const adDisAd = element('option', 'Advantage');
    adDisAd.value = 'ad';
    adDisSelect.appendChild(adDisAd);

    const adDisDis = element('option', 'Disadvantage');
    adDisDis.value = 'dis';
    adDisSelect.appendChild(adDisDis);

    if(member.adDis)
        adDisSelect.value = member.adDis;
    adDisSelect.addEventListener('change', saveParty);
    div.appendChild(adDisSelect);

    const delBtn = element('button', 'X' , 'delBtn');
    delBtn.addEventListener('click', () => {
        partyHolder.removeChild(div);
        saveParty();
    });
    div.appendChild(delBtn);

    partyHolder.appendChild(div);
    saveParty();
}

function rollClick(){
    const inputString = document.getElementById('damageDiceString').value;
    const party = getPartyMembers(true);
    const numMonsters = parseInt(document.getElementById('numMonstersInput').value);
    const toHitBonus = parseInt(document.getElementById('toHitInput').value);
    const autoHitCrits = document.getElementById('autoCritHit').checked;
    const damageRounding = document.getElementById('damageRoundingSelect').value;
    const hitsPerMonster = parseInt(document.getElementById('hitsPerMonsterInput').value);
    
    if(party.length == 0 || numMonsters == 0){
        alert("You need at least one active party member and one monster");
        return;
    }
    else if(inputString == ''){
        alert("Monsters need a damage input eg 1d4+1");
        return;
    }

    document.getElementById('resultsArea').classList.remove('hidden');

    const blowByBlow = document.getElementById('blowByBlowHolder');
    blowByBlow.innerHTML = '';
    for(let i = 0; i < numMonsters; i++){
        for(let h = 0; h < hitsPerMonster; h++){
            const member = arrayRandom(party);
            let roll = getRandomInt(1,20);
            if(member.adDis == 'ad'){
                let secondRoll = getRandomInt(1,20);
                roll = Math.max(roll, secondRoll);
            }
            else if(member.adDis == 'dis'){
                let secondRoll = getRandomInt(1,20);
                roll = Math.min(roll, secondRoll);
            }
            
            const crit = roll == 20;
            const fail = roll == 1;
            let hit = roll + toHitBonus >= member.ac;

            if(autoHitCrits && roll == 20)
                hit = true;
            else if (autoHitCrits && roll == 1)
                hit = false;

            let damage = 0;
            if(hit)
                damage = calcRoll(inputString);
            if(crit)
                damage *= 2;

            if(damageRounding == 'up'){
                damage = Math.ceil(damage);
            }
            else if(damageRounding == 'down'){
                damage = Math.floor(damage);
            }

            member.damage += damage;
            member.hitCounter += hit ? 1 : 0;

            const li = element('li', '', (hit || fail) ? '' : 'miss');
            li.appendChild(element('span', `Monster ${i+1} rolled ${roll + toHitBonus} (${roll} + ${toHitBonus}) `));
            if(member.adDis == 'ad')
                li.appendChild(element('span', '  with advantage '));
            else if(member.adDis == 'dis')
                li.appendChild(element('span', '  with disadvantage '));
            li.appendChild(element('span', ' against '));
            li.appendChild(element('span', member.name, 'name'));
            li.appendChild(element('span', ` (AC: ${member.ac})` ));
            if(crit){
                li.appendChild(element('span', ' and dealt a '));
                li.appendChild(element('span', 'critical hit for ', 'crit'));
                li.appendChild(element('span', damage, 'dmg'));
            }
            else if(fail){
                li.appendChild(element('span', ' and'));
                li.appendChild(element('span', ` critically ${hit ? 'failed' : 'missed'}`, 'fail'));
                if(hit){
                    li.appendChild(element('span',` but dealt `));
                    li.appendChild(element('span', damage, 'dmg'));
                }
            }
            else if (hit) {
                li.appendChild(element('span',` and dealt `));
                li.appendChild(element('span', damage, 'dmg'));
            }
            else{
                li.appendChild(element('span', ' and missed'));
            }
            blowByBlow.appendChild(li);
        }
    }

    const resultArea = document.getElementById('resultsHolder');
    resultArea.innerHTML = '';
    for(let member of party){
        let li = element('li', '', member.hitCounter == 0 ? 'miss' : '');
        if(member.hitCounter == 0){
            li.appendChild(element('span', member.name, 'name'));
            li.appendChild(element('span', ' was not hit'));
        }
        else{
            li.appendChild(element('span', member.name, 'name'));
            li.appendChild(element('span',` was hit ${member.hitCounter}x for `));
            li.appendChild(element('span',member.damage, 'dmg'));
        }
        resultArea.appendChild(li);
    }
} 

function calcRoll(inputString){
    const useAverage = false;//document.getElementById('useAverageChk').checked;

    const buildOutput = build(inputString, useAverage);
    const result = buildOutput.result;
    const errors = buildOutput.errors;
    const rolls = buildOutput.rolls;
    if(errors.length > 0 || result.type !== 'NUM'){
        console.error('Error return');
        for(let e of errors){
            if(e.severity == 'error'){
                console.error(e.type + ': ' + e.value);
            }
            else if(e.severity == 'warning'){
                console.warn(e.type + ': ' + e.value);
            }
            else{
                console.log(e.type + ': ' + e.value);
            }
        }
        return -1;
    }
    console.log(result.value);
    return result.value;
}