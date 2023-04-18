function buildVarientHuman(player){
	const title = 'Varient Human';
	const description = 'Humans are the most adaptable and ambitious people among the common races. Whatever drives them, humans are the innovators, the achievers, and the pioneers of the worlds.';
	const traitsDesc = 'ASI, Extra language, Skill, Feat';
	holder = createRaceHolder(title, description, traitsDesc);

	holder.appendChild(asi(player, 'race'));
	holder.appendChild(languageSelector(player, 1, 'race'));
	holder.appendChild(skillSelector(player, 1, 'race'));
	holder.appendChild(element('p', '+ a feat, but I\'m not doing that yet'))
	return holder;
}

