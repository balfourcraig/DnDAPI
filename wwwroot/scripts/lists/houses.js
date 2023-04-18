const houseDescriptions = [
	'large',
	'small',
	'crumbling',
	'stately',
	'squat',
	'tall',
	'tidy',
	'dirty',
	'faded',
	'fresh',
	'painted',
	'aged',
	'old',
	'overgrown',
	'moss-covered',
	'well kept',
	'detailed',
	'decorative',
	"ornate",
	"rustic",
	"rusty",
	"weathered",
	"weather-beaten",
];

const houseMaterials = [
	'brick',
	'wooden',
	'stone',
	'clay brick',
	'boarded',
	'tiled',
	'draughty',
	'red brick',
	'wood board',
	'mud brick',
	'adobe',
	"Yellow sandstone",
	"brick and mortar",
	"brick and stone",
	"brick and wood",
	"Timber-framed",
];

const houseTypes = [
	'house',
	'hovel',
	'shack',
	'home',
	'manor',
	'shed',
	'building',
	'apartment',
	'dwelling',
	'mansion',
	'cave',
	'shanty',
	'tent',
	'cabin',
	'cottage',
	'farm',
	'hut',
	'place',
	'shelter',
	'bungalow',
	'homestead',
	'lodge',
	"residence",
	"villa",
	"barn",
	"barracks",
	"guildhall",
	"farmhouse",
	"hall",
	"inn",
	"church",
];

const houseSingleFeatures = [
	'roof',
	'garden',
	'porch',
	'veranda',
	'planter box',
	'entrance',
	'hall',
	"thatched roof",
	"chimney",
	"fireplace",
];

const houseMultipleFeatures = [
	'windows',
	'eves',
	'doors',
	'fittings',
	"terracotta roof tiles",
];

const houseLife = [
	'smoke rising from the chimney',
	'lit windows',
	"illuminated windows",
	"arrow-slit windows",
	"stained-glass windows",
	"a doorbell",
	"a door knocker",
	"door ajar",
	"wooden beams",
	"fortified gates",
	"a gatehouse",
	"a drawbridge",
	"wrought-iron railings"
];





function buildHouse(){
	let h = "";
	h += capitalize(addArticle(arrayRandom(houseDescriptions))) + ' ';
	if(Math.random() < 0.2){
		h += arrayRandom(houseMaterials) + ' ';
	}
	h += arrayRandom(houseTypes);
	const featureIndex = Math.random();
	if(featureIndex < 0.3){
		h += ' with ';
		let desc = arrayRandom(houseDescriptions);
		while(h.includes(desc))
			desc = arrayRandom(houseDescriptions);
		h += addArticle(desc) + ' ';
		h += arrayRandom(houseSingleFeatures);
	}
	else if(featureIndex < 0.6){
		h += ' with ';
		let desc = arrayRandom(houseDescriptions);
		while(h.includes(desc))
			desc = arrayRandom(houseDescriptions);
		h += desc + ' ';
		h += arrayRandom(houseMultipleFeatures);
	}
	else if(featureIndex < 0.75){
		h += ' with ';
		h += arrayRandom(houseLife);
	}
	return h + '.';
}