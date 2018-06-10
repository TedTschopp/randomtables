


gen_data["San_Bernardino_Mountains"] = [
	'You stand in a {TerrainDescription} {Area} {stuff}.  {Features}.  {Weather}.'
]

gen_data["TerrainDescription"] = {
	'1-2' : 'broken',
	'3-4' : 'flat',
	'5-6' : 'hilly',
	'7-8' : 'mountainous'
}

gen_data["Area"] = {
	'1-2' : 'area',
	'3-4' : 'region',
	'5-6' : 'terrain'
}

gen_data["stuff"] = {
	'1-2' : '{ObjPop} {stonedesc} {Stone}. It\'s also {ObjPop} {plants}',
	'3-4' : '{ObjPop} {plants}',
	'5-6' : '{ObjPop} {stonedesc} {Stone}'
}

gen_data["Features"] = {
	'1-2' : 'You can see {BFeatures}',
	'3-4' : 'You can see {WFeatures}',
	'5-6' : 'You can see {WFeatures} and {BFeatures}'
}
gen_data["BFeatures"] = {
	'1-2' : '{Structure} {Distance}'
}

gen_data["WFeatures"] = {
	'1-2' : '{WaterBody} {Distance}'
}

gen_data["stonedesc"] = {
	'1-2' : '{stone-only}',
	'3-4' : '{ps-desc}',
}
gen_data["stone-only"] = {
	'1-3' : 'broken',
	'4-6' : 'jagged',
	'7-10' : 'rough',
	'11-20' : 'smooth',
	'21-31' : 'weather-worn',
	'32-43' : 'worn-down'
}

gen_data["ObjPop"] = {
	'1-2' : 'abounding with',
	'3-4' : 'covered with',
	'5-6' : 'dotted with',
	'7-8' : 'scattered with',
	'9-10' : 'smattered with',
	'11-12' : 'spotted with',
	'13-14' : 'sprinkled with',
	'15-16' : 'strewn with',
	'17-18' : 'replete with'
}

gen_data["plants"] = {
	'1-2' : '{softplant}grass',
	'3-4' : '{softplant}grass and {softplant}wildflowers',
	'5-6' : '{plantdesc}shrubs and {softplant}grass',
	'7-8' : '{plantdesc}trees, {plantdesc}shrubs, and {softplant}grass',
	'9-10' : '{plantdesc}plants',
	'11-12' : '{plantdesc}shrubs',
	'13-14' : '{plantdesc}trees and {softplant}wildflowers',
	'15-16' : '{plantdesc}trees and {softplant}grass',
	'17-18' : '{plantdesc}trees, {softplant}grass, and {softplant}wildflowers',
	'19-20' : '{softplant}wildflowers'
}

gen_data["plantdesc"] = {
	'1-2' : '{woodplant} ',
	'3-4' : '{allplant} ',
	'5-6' : '{psdesc} '
}

gen_data["softplant"] = {
	'1-2' : '{allplant} ',
	'3-4' : '{psdesc} ',
	'5-6' : ''
}

gen_data["allplant"] = {
	'1-2' : 'colorful',
	'3-4' : 'dead',
	'5-6' : 'foul-smelling',
	'7-8' : 'pleasant-smelling',
	'9-10' : 'sharp',
	'11-12' : 'strange-looking'
}
gen_data["woodplant"] = {
	'1-2' : 'fruit-bearing',
	'3-4' : 'prickly',
	'5-6' : 'thorny',
	'7-8' : 'deciduous',
	'9-10' : 'evergreen'
}
gen_data["psdesc"] = {
	'1-2' : 'diverse',
	'3-4' : 'gigantic',
	'5-6' : 'huge',
	'7-8' : 'small',
	'9-10' : 'unusual',
	'11-12' : 'various'
}
gen_data["Stone"] = {
	'1-2' : '{stonecolor} rocks',
	'3-4' : '{stonecolor} stones'
}

gen_data["stonecolor"] = {
	'1-2' : 'brown',
	'3-4' : 'pale brown',
	'5-6' : 'greenish',
	'7-8' : 'gray',
	'9-10' : 'dark',
	'11-12' : 'pale'
}

gen_data["WaterBody"] = {
	'1-2' : 'a small body of water',
	'3-4' : 'a{size} river',
	'5-6' : 'a{size} lake',
	'7-8' : 'a stream',
	'9-10' : 'a waterfall'
}

gen_data["size"] = {
	'1-10' : 'small',
	'11-25' : '',
	'26-28' : 'large'
}

gen_data["Structure"] = {
	'1-10' : 'a {size} town',
	'11-25' : 'a {size} city',
	'26-28' : 'a {size} warehouse',
	'29-30' : 'a {size} hospital',
	'31-33' : 'a {size} school',
	'34-35' : 'a {size} Museum',
	'36-40' : 'a {size} Church',
	'41-45' : 'a {size} Hotel',
	'46-60' : 'a {size} office building',
	'61-100' : 'a {size} house'
}

gen_data["Distance"] = {
	'1-10' : 'to the east',
	'11-20' : 'to the north',
	'21-30' : 'to the south',
	'31-40' : 'to the west',
	'41-75' : 'close by'
}

gen_data["Weather"] = [
	'The temperature is {temp} and the sky is {skyconditions}'
]

gen_data["temp"] = {
	'1-4' : 'cool',
	'5-15' : 'somewhat warm',
	'16-26' : 'warm',
	'27-37' : 'very warm',
	'38-50' : 'hot'
}
gen_data["skyconditions"] = {
	'1-5' : 'clear',
	'5-25' : 'mostly clear',
	'26-30' : 'partially cloudy',
	'31-35' : 'overcast',
	'36-45' : 'smoggy',
	'46-48' : 'cloudy'
}
