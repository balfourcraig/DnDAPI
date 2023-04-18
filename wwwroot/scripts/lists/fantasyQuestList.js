const quest_questPrompt = 'There is adventure afoot... and with adventure comes the opportunity for riches and renown! Bend your ear to the words of ';
const quest_questGiver = [
    'concernerd townsfolk',
    'eccentric hermit',
    'gregarious tavernkeep',
    'high priest',
    'humble farmer',
    'innkeeper',
    'local sage',
    'local witch',
    'royal family',
    'village elders',
];

const quest_villainPrompt = 'An evil plot is underway, masterminded by ';
const quest_villain = [
    'ancient Lich',
    'beguiling Sorceress',
    'crafty demon',
    'cunning dragon',
    'fearsome beast',
    'ferocious orc',
    'giant',
    'otherworldly horror',
    'powerful wizard',
    'ruthless warlord',
    'savage barbarian',
];

const quest_minionPrompt = 'This wicked creature has cobbled together a great host of ';
const quest_minions = [
    'bandits',
    'fanatical cultists',
    'bestial marauders',
    'ravenous undead',
    'reptilian monstrosities',
    'savage orcs and goblins',
    'sadistic dark elves',
];

const quest_locationPrompt = 'They\'ve seized and occupied ';
const quest_location = [
    'ancient and holy temple',
    'enchanted tower',
    'deep and twisted caverns',
    'formidable and awesome fortress',
    'isolated and eerie homestead',
    'shrouded and ghostly woodlands',
];

const quest_troublePrompt = 'Your adversaries are causing great mischief by ';
const quest_trouble = [
    'butchering, terrorizing, and razing',
    'conquering and enslaving',
    'desecrating and corrupting',
    'inflaming, inciting, and dividing',
    'raiding and pillaging',
    'ransoming, extorting, and assassinating'
];

const quest_captivePrompt = 'They have absconded with a hostage key to their ploy, ';
const quest_captive = [
    'cherished elder',
    'diplomatic envoy',
    'gifted artisan',
    'prince',
    'princess',
    'sorcerous protege',
    'wealthy merchant'
];

const quest_schemePrompt = 'You must foil the villain, defeat his minions, and rescue the captive. If you do not, we will be overcome when your foes ';
const quest_scheme = [
    'ascend in form and power',
    'corrupt a potent relic',
    'discover a terrible secret',
    'forge a devious alliance',
    'sow chaos and ruin',
    'unchain a fell power'
];

const wrapInSpan = (className, text) => `<span class="${className}">${text}</span>`;

const buildQuest = () => {
    let quest = quest_questPrompt + wrapInSpan('questItem', addArticle(arrayRandom(quest_questGiver))) + '. ';
    quest += quest_villainPrompt + wrapInSpan('questItem', addArticle(arrayRandom(quest_villain))) + '. ';
    quest += quest_minionPrompt + wrapInSpan('questItem', arrayRandom(quest_minions)) + '. ';
    quest += quest_locationPrompt + wrapInSpan('questItem', addArticle(arrayRandom(quest_location))) + '. ';
    quest += quest_troublePrompt + wrapInSpan('questItem', arrayRandom(quest_trouble)) + '. ';
    quest += quest_captivePrompt + wrapInSpan('questItem', addArticle(arrayRandom(quest_captive))) + '. ';
    quest += quest_schemePrompt + wrapInSpan('questItem', arrayRandom(quest_scheme)) + '. ';
    return quest;
}
