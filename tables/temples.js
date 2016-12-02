gen_data['Type_of_Temple'] = [
  '{temple_holy_ground}',
  '{temple_shrine}',
  '{temple_chapel}',
  '{temple_small_temple}',
  '{temple_large_temple}',
  '{temple_major_temple}'
]

gen_data['temple_small_temple'] = [
/*
1d2 priests
1d4 acolytes
40% holy ground
30% relic
30% adminstrative function
*/
'{temple_small_temple_priest} {temple_small_temple_acolytes} {temple_small_temple_holy_ground} The temple itself is decorated with {temple_decorations}. {temple_small_temple_relic}.'
]
gen_data['temple_small_temple_priest'] = [
  'The small temple is staffed by a full time priest.',
  'The small temple has two priests who split their duties.'
]
gen_data['temple_small_temple_acolytes'] = [
  'It is also home to an acolyte.',
  'Several acolytes serve in addition to the priest.',
  'The small temple is also home to three acolytes.',
  'Four acolytes call the small temple home.'
]
gen_data['temple_small_temple_priest_admin'] = {
  '01-30' : 'The small temple has regular services as well as {temple_administrative_functions}.',
  '31-100' : 'The small temple has regular services.'
}

gen_data['temple_small_temple_holy_ground'] = {
  '01-40' : 'It is said that this is the location of the {temple_event}. The location is commerated with {temple_natural_feature}.',
  '41-100' : ' '
}
gen_data['temple_small_temple_relic'] = {
  '01-30' : '{temple_relics}',
  '31-100' : ' '
}




gen_data['temple_large_temple'] = [
/*
1d4+1 priests
1d4+2 acolytes
60% holy ground
60% relic
1D2 adminstrative functions
*/
'{temple_large_temple_priest} {temple_large_temple_acolytes} {temple_large_temple_holy_ground} The temple itself is decorated with {temple_decorations}. {temple_large_temple_relic}. '
]
gen_data['temple_large_temple_priest'] = [
  'The large temple has two priests who split their duties.',
  'The large temple has three priests.',
  'The large temple has four priests .',
  'The large temple has five priests.',
]
gen_data['temple_large_temple_acolytes'] = [
  'Several acolytes serve in addition to the priest.',
  'The large temple is also home to three acolytes.',
  'Four acolytes call the large temple home.',
  'The priests are supported by five acolytes.',
  'There are six acolytes who are studying and serving in order to enter holy orders.'
]
gen_data['temple_large_temple_priest_admin'] = [
  'The large temple has regular services as well as {temple_administrative_functions}.',
  'The large temple has regular services as well as {temple_administrative_functions} and {temple_administrative_functions}.',
]

gen_data['temple_large_temple_holy_ground'] = {
  '01-60' : 'It is said that this is the location of the {temple_event}. The location is commerated with {temple_natural_feature}.',
  '61-100' : ' '
}
gen_data['temple_large_temple_relic'] = {
  '01-60' : '{temple_relics}',
  '61-100' : ' '
}

gen_data['temple_major_temple'] = [
/*
1d6+1 priests
1d6+1 acolytes
75% holy ground
95% relic
1D2+2 adminstrative functions
*/
'{temple_major_temple_priest} {temple_major_temple_acolytes} {temple_major_temple_holy_ground} The temple itself is decorated with {temple_decorations}. {temple_major_temple_relic}.'
]
gen_data['temple_major_temple_priest'] = [
  'The major temple has two priests who split their duties.',
  'The major temple has three priests.',
  'The major temple has four priests .',
  'The major temple has five priests.',
  'The major temple has six priests.',
  'The major temple has seven priests.'
]
gen_data['temple_major_temple_acolytes'] = [
  'Several acolytes serve in addition to the priest.',
  'The major temple is also home to three acolytes.',
  'Four acolytes call the major temple home.',
  'The priests are supported by five acolytes.',
  'There are six acolytes who are studying and serving in order to enter holy orders.',
  'There are seven acolytes who are studying and serving in order to enter holy orders.'
]
gen_data['temple_major_temple_priest_admin'] = [
  'The major temple has regular services as well as {temple_administrative_functions} and {temple_administrative_functions}.',
  'The major temple has regular services as well as {temple_administrative_functions}, {temple_administrative_functions}, and {temple_administrative_functions}.',
  'The major temple has regular services as well as {temple_administrative_functions}, {temple_administrative_functions}, {temple_administrative_functions}, and {temple_administrative_functions}.',
]

gen_data['temple_major_temple_holy_ground'] = {
  '01-75' : 'It is said that this is the location of the {temple_event}. The location is commerated with {temple_natural_feature}.',
  '76-100' : ' '
}
gen_data['temple_major_temple_relic'] = {
  '01-95' : '{temple_relics}',
  '96-100' : ' '
}


gen_data['temple_chapel'] = [
  '{temple_chapel_priest} {temple_chapel_holy_ground} The chapel itself is decorated with {temple_decorations}.  {temple_chapel_relic}'
]

gen_data['temple_chapel_priest'] = [
  'The chapel has a full time priest. {temple_chapel_priest_admin}',
  'The chapel is served by a circut priest to officiate services on a regular basis. Locals will know the circut priests schedule.'
]
gen_data['temple_chapel_priest_admin'] = {
  '01-20' : 'The chapel has regular services as well as {temple_administrative_functions}.',
  '21-100' : 'The chapel has regular services.'
}

gen_data['temple_chapel_holy_ground'] = {
  '01-30' : 'It is said that this is the location of the {temple_event}. The location is commerated with {temple_natural_feature}.',
  '31-100' : ' '
}
gen_data['temple_chapel_relic'] = {
  '01-10' : '{temple_relics}',
  '11-100' : ' '
}



gen_data['temple_holy_ground'] = [
  'It is said that this is the location of the {temple_event}',
  'It is said that this is the location of the {temple_event}.  The location is commerated with {temple_natural_feature}',
]

gen_data['temple_shrine'] = {
  '01-25' : 'There is a small shrine dedicated to hero / saint / diety',
  '26-100' : 'There is a small shrine built here.  {temple_holy_ground}'
}




gen_data['temple_administrative_functions'] = {
  '01-05' : 'administers fiefs',
  '06-10' : 'administrates priests and the maintenance of a circut of smaller faciliites and areas of holy ground',
  '11-15' : 'an almshouse',
  '16-20' : 'an animal training location',
  '21-25' : 'archives',
  '26-30' : 'an asylum',
  '31-35' : 'an ecclesiastical court',
  '36-40' : 'a way station with stables and lodging for couriers',
  '41-45' : 'the headquarters of military order',
  '46-50' : 'the headquarters for a secret society',
  '51-55' : 'an herbal gardens',
  '56-60' : 'a hospital',
  '61-65' : 'an inquisition tribunal',
  '66-70' : 'a library',
  '71-75' : 'a prison',
  '76-80' : 'an academic school',
  '81-85' : 'a seminary',
  '86-90' : 'a scriptorium',
  '91-95' : 'a facility for spying and intelligence gathering for the sect',
  '96-00' : 'storehouses'
}

gen_data['temple_event'] = {
  '01-04' : 'avatar of deity manifests itself occasionally',
  '05-08' : 'birth of an avatar of the deity',
  '09-12' : 'birth of hero/saint',
  '13-16' : 'burial of hero / saint',
  '17-20' : 'death of an avatar of the deity',
  '21-24' : 'death of hero / saint',
  '25-28' : 'defeat of hero / saint in battle',
  '29-32' : 'defeat of hero / saint by trickery',
  '33-36' : 'defeat of the deity in battle ',
  '37-40' : 'defeat of the deity by trickery',
  '41-44' : 'ghost of the saint / hero manifests occasionally',
  '45-48' : 'healing magic performed by devotes is very strong here',
  '49-52' : 'hero / Saint signing a treaty',
  '53-56' : 'holy symbol of the deity manifests occasionally here',
  '57-60' : 'the deity manifests occasionally materially',
  '61-64' : 'marriage of hero / saint',
  '65-68' : 'oracular powers are very strong here for devotes',
  '69-72' : 'reputed birthplace of the deity',
  '73-76' : 'animals gather, live, and breed here',
  '77-80' : 'sacred animals of the deity gather, live, and breed here',
  '81-84' : 'victory that the avatar of the deity won',
  '85-88' : 'victory won the deity in battle',
  '89-92' : 'victory won by the deity though politics and trickery',
  '93-96' : 'victory won by the hero / saint in battle',
  '97-100' : 'victory won by the hero / saint though politics and trickery'
}

gen_data['temple_natural_feature'] = {
  '01-04' : 'altar (see Table 3-55 and Table 3-56 for ideas)',
  '05-08' : 'boulder',
  '09-12' : 'boulder, decorated',
  '13-16' : 'cairn, a pile of smaller rocks and boulders',
  '17-20' : 'garden tended by visitors',
  '21-24' : 'geyser / Steam vent',
  '25-28' : 'grove of trees',
  '29-32' : 'hot Springs',
  '33-36' : 'multiple unmarked standing stones randomly placed.  ',
  '37-40' : 'multiple decorated standing stones randomly placed.  ',
  '41-44' : 'multiple quarried undecorated standing stones randomly placed',
  '45-48' : 'multiple quarried decorated standing stones randomly placed',
  '49-52' : 'multiple standing stones with slabs resting across the tops',
  '53-56' : 'multiple decorated standing stones with slabs resting across the tops',
  '57-60' : 'natural spring',
  '61-64' : 'sacred plans',
  '65-68' : 'sacred tree',
  '69-72' : 'natural Standing Stones',
  '73-76' : 'natural decorated standing stones',
  '77-80' : 'quarried standing stones',
  '81-84' : 'quarried decorated standing stones',
  '85-88' : 'statue or idol (see table 3-72 through table 3-75 for ideas)',
  '89-92' : 'stone totem poles',
  '93-96' : 'wooden totem poles',
  '97-100' : 'wildflowers'
}

gen_data['temple_decorations'] = {
  '01-04' : 'chains or manacles',
  '05-08' : 'bloodstains',
  '09-12' : 'carvings of an event depicting {temple_event}',
  '13-16' : 'carved, incised and etched holy symbols',
  '17-20' : 'carved, incised and etched vines, flowers, and trees',
  '21-24' : 'carved, incised and etched whorls and patterns',
  '25-28' : 'carved bas-relief of an event depicting {temple_event}',
  '29-32' : 'carved bas-relief with holy symbols',
  '33-36' : 'carved bas-relief with vines. Flowers, and trees.',
  '37-40' : 'carved bas-relief with vines. Flowers, and trees.',
  '41-44' : 'carved ancient stylized depictions of unknown people ',
  '45-48' : 'carved depictions of mythological beasts',
  '49-52' : 'carved monstrous animal faces',
  '53-56' : 'carved  human faces',
  '57-60' : 'chipped and hacked at',
  '61-64' : 'fossils',
  '65-68' : 'inlaid nonprecious stones',
  '69-72' : 'inlaid semi-precious stones',
  '73-76' : 'painted in one color',
  '77-80' : 'painted with ancient stylized depictions of people, animals, and monsters.',
  '81-84' : 'painted with pictures depicting {temple_event}',
  '85-88' : 'painted with symbols',
  '89-92' : 'painted with whorls and patterns',
  '93-96' : 'veined with ore',
  '97-100' : 'veined with semi-precious stones'
}

gen_data['temple_relics'] = {
  '01-10' : '{temple_relics_cloths} of the hero/saint.',
  '11-20' : '{temple_relics_body}',
  '21-30' : '{temple_relics_water}',
  '31-40' : '{temple_relics_stones}',
  '41-50' : 'There is a {temple_relics_blessed_item} blessed by deity.',
  '51-60' : 'There is a {temple_relics_owned_item} owned by hero/saint.',
  '61-70' : 'The {temple_relics_body_part} of the deity’s body.',
  '71-80' : '{temple_relics_body_remnents} of the hero/saint’s.',
  '81-90' : '{temple_relics_armor_weapons} of the  hero/saint’s.',
  '91-00' : 'A library known for its collection containing {temple_relics_writings}.'
}
gen_data['temple_relics_cloths'] = {
  '01-10' : 'Robe',
  '11-20' : 'Shoes',
  '21-30' : 'Belt',
  '31-40' : 'Hat',
  '41-50' : 'Undergarmets',
  '51-60' : 'Glove',
  '61-70' : 'Shirt',
  '71-80' : 'Chains',
  '81-90' : 'Cloak',
  '91-100' : 'Mask'
}
gen_data['temple_relics_body'] = {
  '01-30' : 'The deity’s body is interned here.  It is a husk, left behind when they moved onto another plane.',
  '31-50' : 'The deity’s body is fake.  The real body is mummified and hidden from all but the most senior priest.',
  '51-60' : 'The deity’s body is fake.  The real body is hidden and in suspended animation awaiting for techniques to reanimate the body.',
  '61-70' : 'The deity’s body is fake.  The deity resides here and is alive hidden among the devote.  Only the senior most priest knows.',
  '71-80' : 'The deity’s body is fake.  The deity is actually imprisoned here.',
  '81-90' : 'The deity’s body is fake.  The deity is actually imprisoined and insane and the devot seek a cure.',
  '91-100' : 'The deity’s body is no longer here.  Divine attention is highly focused here: Rewards, defenses and punisments are more spectacular, deadly, and scrict.'
}
gen_data['temple_relics_water'] = {
  '01-30' : 'There is a holy fountain whose waters are {temple_relics_holy_fountain}.',
  '31-60' : 'There is a holy spring.  Waters flowing from the spring are {temple_relics_holy_fountain}.',
  '61-100' : 'Font that is maintained by the local devout.  The waters are {temple_relics_holy_fountain}.'
}

gen_data['temple_relics_holy_fountain'] = {
  '01-10' : 'blessed by saint or deity',
  '11-20' : 'falsely identified as being holy',
  '21-30' : 'gives visions to those who drink',
  '31-40' : 'healing',
  '41-50' : 'a source of elemental water',
  '51-60' : 'poisonous to most who drink - used as a test by the devout',
  '61-70' : 'raises the dead occasionally',
  '71-80' : 'removes curses',
  '81-90' : 'removes Diseases',
  '91-100' : 'shows other places'
}
gen_data['temple_relics_stones'] = {
  '01-80' : 'There is a statue which {temple_relics_holy_stone}.',
  '81-100' : 'There is a holy stone which {temple_relics_holy_stone}.'
}
gen_data['temple_relics_holy_stone'] = {
  '01-10' : 'animates and changes shape',
  '11-20' : 'is blessed by a saint or diety',
  '21-30' : 'is carved from meteroite, gem, wood from a sacred tree',
  '31-40' : 'is falsely idenfitied as being holy',
  '41-50' : 'is forbidden to lay eyes upon.  It is always covered',
  '51-60' : 'heals on touch',
  '61-70' : 'raises the dead occasionally',
  '71-80' : 'removes curses',
  '81-90' : 'removes diseases',
  '91-100' : 'speaks oracles'
}
gen_data['temple_relics_blessed_item'] = {
  '01-10' : 'amulet',
  '11-20' : 'black Velvet painting or tapestry',
  '21-30' : 'chariot',
  '31-40' : 'goblet',
  '41-50' : 'helmet',
  '51-60' : 'holy Symbol',
  '61-70' : 'lantern',
  '71-80' : 'ring',
  '81-90' : 'staff',
  '91-100' : 'statuette'
}
gen_data['temple_relics_owned_item'] = {
  '01-10' : 'amulet',
  '11-20' : 'black Velvet painting or tapestry',
  '21-30' : 'chariot',
  '31-40' : 'goblet',
  '41-50' : 'helmet',
  '51-60' : 'holy Symbol',
  '61-70' : 'lantern',
  '71-80' : 'ring',
  '81-90' : 'staff',
  '91-100' : 'statuette'
}
gen_data['temple_relics_body_part'] = {
  '01-10' : 'arm',
  '11-20' : 'eye',
  '21-30' : 'finger',
  '31-40' : 'foot',
  '41-50' : 'hair',
  '51-60' : 'hand',
  '61-70' : 'head',
  '71-80' : 'heart',
  '81-90' : 'leg',
  '91-100' : 'tooth'
}

gen_data['temple_relics_body_remnents'] = {
  '01-10' : 'A few bones or teeth',
  '11-20' : 'Ashes',
  '21-30' : 'Brain',
  '31-40' : 'Hair',
  '41-50' : 'Mummified body',
  '51-60' : 'Mummified hand',
  '61-70' : 'Mummified mistress',
  '71-80' : 'Mummified stead',
  '81-90' : 'Skeleton',
  '91-100' : 'Skull'
}
gen_data['temple_relics_armor_weapons'] = {
  '01-10' : 'Bow',
  '11-20' : 'Chain Mail',
  '21-30' : 'Gantlets',
  '31-40' : 'Hammer or mace',
  '41-50' : 'Helmet',
  '51-60' : 'Leather armor',
  '61-70' : 'Plate armor',
  '71-80' : 'Shield',
  '81-90' : 'Spear',
  '91-100' : 'Sword',
}
gen_data['temple_relics_writings'] = {
  '01-10' : 'clay tablets sacred to the devout',
  '11-20' : 'evil, cursed, and taboo texts kept guarded as secrets',
  '21-30' : 'forbidden texts kept guarded and secret',
  '31-40' : 'holy writings that can not be copied',
  '41-50' : 'journal of hero / saint',
  '51-60' : 'letters of hero / saint',
  '61-70' : 'map to a sacred location',
  '71-80' : 'map to tombs',
  '81-90' : 'cecret scriptures for only the initates',
  '91-100' : 'stone tablets sacred to the devout',
}
