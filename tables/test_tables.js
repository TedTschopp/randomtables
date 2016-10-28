  gen_data['main_1'] = [
    'A {gender} {race}, {human_height} with {human_eye_color} eyes and {human_hair_color} and {human_identifying_marks}\, wearing {armor} with a {animal} on it and wielding {weapon}.  In their pocket you find {trinket} {trinket}'
  ];

  gen_data['main'] = [
    '{minor_magic_item}'
  ];


  gen_data['gender'] = [
    'male', 'female'
  ];
  gen_data['race'] = {
    '1-4': 'human',
      '5': '{race_dwarf}',
      '6': 'elf'
  };

  gen_data['race_dwarf'] = {
    '1-5': 'dwarf',
      '6': 'gnome'
  };

  gen_data['armor'] = {
    '01-50': 'leather armor',
    '51-80': 'chainmail',
    '81-90': 'plate armor',
    '91-98': 'Mithril chain shirt',
    '99-100': 'Mithril plate armor'
  };

  gen_data['weapon'] = [
    '{melee_weapon}',
    '{melee_weapon} and a shield',
    'twin blades',
    '{ranged_weapon}'
  ];

  gen_data['melee_weapon'] = [
    'a battleaxe', 'a mace', 'a spear', 'a sword'
  ];

  gen_data['ranged_weapon'] = [
    'a longbow and arrows', 'a heavy crossbow'
  ];

/* Animals */
  gen_data['animal'] = [
	'{common_animal}','{fantastic_animal}','{bird_of_prey}'
  ];

  gen_data['common_animal'] = {
	'1-3':'bear',
	'4-5':'boar',
	'6-9':'bull',
	'10':'cow',
	'11':'horse',
	'12-13':'hound',
	'14-15':'lamb',
	'16-19':'lion',
	'20-22':'serpent',
	'23-25':'stag',
	'26-27':'tiger',
	'28-30':'wolf',
	'31':'sturgeon',
	'32':'elk',
	'33':'badger',
	'34':'hare',
	'35':'bat',
	'36':'lizard',
	'37':'squirrel',
	'38-40':'fox',
	'41':'dolphin',
	'42-43':'panther',
	'45-46':'ram',
	'47':'goat',
	'48':'beaver',
	'49':'mountain lion',
	'50':'tortoise',
	'51':'pike',
	'52':'frog',
	'53':'rat',
	'54':'mare',
	'55':'stallion',
	'56':'plowhorse',
	'57':'ox'
  };
  gen_data['fantastic_animal'] = {
	'1-2':'dragon',
	'3-4':'griffin',
	'5-6':'hydra',
	'7':'phoenix',
	'8-9':'unicorn',
	'10':'wyvern',
	'11':'giant',
	'12-13':'sphinx',
	'14':'demon',
	'15':'cyclops',
	'16':'harpy',
	'17':'kraken',
	'18':'leviathon',
	'19':'manticore',
	'20':'pegasus',
	'21':'ogre',
	'22':'troll'
  };
  gen_data['bird_of_prey'] = {
	'1-2':'eagle',
	'3-4':'falcon',
	'5-6':'hawk',
	'7-8':'raven',
	'9':'rook',
	'10':'heron',
	'11':'crane',
	'12':'rooster',
	'13':'crow',
	'14':'gull',
	'15':'condor',
	'16-17':'owl',
	'18':'merlin'
  };
  gen_data['inches'] = {
	'1':'1',
	'2':'2',
	'3':'3',
	'4':'4',
	'5':'5',
	'6':'6',
	'7':'7',
	'8':'8',
	'9':'9',
	'10':'10',
	'11':'11'
  };

  gen_data['musical_instruments'] = {
    '1':'Alphorn',
    '2':'Bagpipes',
    '4':'Guitar',
    '5':'Drums',
    '6':'Dulcimer',
    '7':'Fiddle',
    '8':'Harp',
    '9':'Harpsichord',
    '9':'Horn',
    '13':'Lute',
    '14':'Lyre',
    '15':'Mandolin',
    '16':'Pan pipes'
   };





/* Dieties

	Humans / Halfling = Greek/Roman, Egyptian, and Babylonian
	Elves = Tolkien
	Dwarves = Norse
	Gnomes = Norse
	Half Elves = Human + Elvish
	Orc = God King

*/

  gen_data['roman_god'] = [
/*
Name	Alignment	Domains	Favored Weapon	Description
Aphrodite	CG	Chaos, Good, Luck, Trickery	Whip	Goddess of love and beauty.
Apollo	NG	Good, Healing, Knowledge, Sun	Longbow	God of the sun (light), reason, music, healing, prophecy, and poetry. The brother of Artemis.
Ares	NE	Destruction, Evil, Strength, War	Longspear	God of war and bloodshed.
Artemis	CG	Animal, Chaos, Earth, Good	Longbow	Goddess of hunting and archery, sister of Apollo.
Athena	LG	Good, Knowledge, Law, War	Longspear	Goddess of wisdom, strategy, and war.
Demeter	NG	Earth, Good, Plant, Water	Mace	Goddess of agriculture, grain, harvest and earth.
Dionysus	CN	Chaos, Luck, Plant, Trickery	Quarterstaff	God of wine, agriculture, and the theatre.
Hades	LN	Death, Earth, Law, Magic	Longsword	God of the Dead and lord of the Underworld.
Hephaestus	LN	Fire, Knowledge, Law, Strength	Warhammer	God of fire and the forge (smiths).
Hera	LG	Good, Healing, Law, Protection	Whip	Goddess of marriage, family, and motherhood.
Hermes	NG	Air, Good, Luck, Travel, Trickery	Dagger	God of travel, thieves, and commerce.
Hestia	NG	Fire, Good, Healing, Magic	Sap	Goddess of the hearth and domestic life.
Nemesis	LN	Death, Destruction, Law, Trickery	Longsword	Goddess of Revenge.
Pan	CG	Animal, Chaos, Luck, Good	Sickle	God of flocks and sheep.
Poseidon	CN	Chaos, Strength, Travel, Water	Trident	God of the sea.
Zeus	N	Air, Destruction, Magic, Protection	Longspear	God of air, thunder and lightning.


Zeus	Jupiter	King of Gods
Hera	Juno	Goddess of Marriage
Poseidon	Neptune	God of the Sea
Cronos	Saturn	Youngest son of Uranus, Father of Zeus
Aphrodite	Venus	Goddess of Love
Hades	Pluto	God of the Underworld
Hephaistos	Vulcan	God of the Forge
Demeter	Ceres	Goddess of the Harvest
Apollo	Apollo	God of Music and Medicine
Athena	Minerva	Goddess of Wisdom
Artemis	Diana	Goddess of the Hunt
Ares	Mars	God of War
Hermes	Mercury	Messenger of the Gods
Dionysus	Bacchus	God of Wine
Persephone	Proserpine	Goddess of Underworld
Eros	Cupid	God of Love
Gaia	Gaea	Goddess of Earth
*/
	'Aphrodite',
    'Apollo',
    'Ares',
    'Artemis',
    'Athena',
    'Demeter',
    'Dionysus',
    'Hades',
    'Hephaestus',
    'Hera',
    'Hermes',
    'Hestia',
    'Nemesis',
    'Pan',
    'Poseidon',
    'Zeus'
  ];

    gen_data['roman_god_good'] = [
/*
Name	Alignment	Domains	Favored Weapon	Description
Aphrodite	CG	Chaos, Good, Luck, Trickery	Whip	Goddess of love and beauty.
Apollo	NG	Good, Healing, Knowledge, Sun	Longbow	God of the sun (light), reason, music, healing, prophecy, and poetry. The brother of Artemis.
Ares	NE	Destruction, Evil, Strength, War	Longspear	God of war and bloodshed.
Artemis	CG	Animal, Chaos, Earth, Good	Longbow	Goddess of hunting and archery, sister of Apollo.
Athena	LG	Good, Knowledge, Law, War	Longspear	Goddess of wisdom, strategy, and war.
Demeter	NG	Earth, Good, Plant, Water	Mace	Goddess of agriculture, grain, harvest and earth.
Dionysus	CN	Chaos, Luck, Plant, Trickery	Quarterstaff	God of wine, agriculture, and the theatre.
Hades	LN	Death, Earth, Law, Magic	Longsword	God of the Dead and lord of the Underworld.
Hephaestus	LN	Fire, Knowledge, Law, Strength	Warhammer	God of fire and the forge (smiths).
Hera	LG	Good, Healing, Law, Protection	Whip	Goddess of marriage, family, and motherhood.
Hermes	NG	Air, Good, Luck, Travel, Trickery	Dagger	God of travel, thieves, and commerce.
Hestia	NG	Fire, Good, Healing, Magic	Sap	Goddess of the hearth and domestic life.
Nemesis	LN	Death, Destruction, Law, Trickery	Longsword	Goddess of Revenge.
Pan	CG	Animal, Chaos, Luck, Good	Sickle	God of flocks and sheep.
Poseidon	CN	Chaos, Strength, Travel, Water	Trident	God of the sea.
Zeus	N	Air, Destruction, Magic, Protection	Longspear	God of air, thunder and lightning.


*/
	'Aphrodite',
    'Apollo',
    'Artemis',
    'Athena',
    'Demeter',
    'Hera',
    'Hermes',
    'Hestia',
    'Pan',
  ];

  gen_data['roman_evil'] = [
/*
Name	Alignment	Domains	Favored Weapon	Description
Aphrodite	CG	Chaos, Good, Luck, Trickery	Whip	Goddess of love and beauty.
Apollo	NG	Good, Healing, Knowledge, Sun	Longbow	God of the sun (light), reason, music, healing, prophecy, and poetry. The brother of Artemis.
Ares	NE	Destruction, Evil, Strength, War	Longspear	God of war and bloodshed.
Artemis	CG	Animal, Chaos, Earth, Good	Longbow	Goddess of hunting and archery, sister of Apollo.
Athena	LG	Good, Knowledge, Law, War	Longspear	Goddess of wisdom, strategy, and war.
Demeter	NG	Earth, Good, Plant, Water	Mace	Goddess of agriculture, grain, harvest and earth.
Dionysus	CN	Chaos, Luck, Plant, Trickery	Quarterstaff	God of wine, agriculture, and the theatre.
Hades	LN	Death, Earth, Law, Magic	Longsword	God of the Dead and lord of the Underworld.
Hephaestus	LN	Fire, Knowledge, Law, Strength	Warhammer	God of fire and the forge (smiths).
Hera	LG	Good, Healing, Law, Protection	Whip	Goddess of marriage, family, and motherhood.
Hermes	NG	Air, Good, Luck, Travel, Trickery	Dagger	God of travel, thieves, and commerce.
Hestia	NG	Fire, Good, Healing, Magic	Sap	Goddess of the hearth and domestic life.
Nemesis	LN	Death, Destruction, Law, Trickery	Longsword	Goddess of Revenge.
Pan	CG	Animal, Chaos, Luck, Good	Sickle	God of flocks and sheep.
Poseidon	CN	Chaos, Strength, Travel, Water	Trident	God of the sea.
Zeus	N	Air, Destruction, Magic, Protection	Longspear	God of air, thunder and lightning.
*/
    'Ares',
  ];

  gen_data['roman_god_neutral'] = [
/*
Name	Alignment	Domains	Favored Weapon	Description
Aphrodite	CG	Chaos, Good, Luck, Trickery	Whip	Goddess of love and beauty.
Apollo	NG	Good, Healing, Knowledge, Sun	Longbow	God of the sun (light), reason, music, healing, prophecy, and poetry. The brother of Artemis.
Ares	NE	Destruction, Evil, Strength, War	Longspear	God of war and bloodshed.
Artemis	CG	Animal, Chaos, Earth, Good	Longbow	Goddess of hunting and archery, sister of Apollo.
Athena	LG	Good, Knowledge, Law, War	Longspear	Goddess of wisdom, strategy, and war.
Demeter	NG	Earth, Good, Plant, Water	Mace	Goddess of agriculture, grain, harvest and earth.
Dionysus	CN	Chaos, Luck, Plant, Trickery	Quarterstaff	God of wine, agriculture, and the theatre.
Hades	LN	Death, Earth, Law, Magic	Longsword	God of the Dead and lord of the Underworld.
Hephaestus	LN	Fire, Knowledge, Law, Strength	Warhammer	God of fire and the forge (smiths).
Hera	LG	Good, Healing, Law, Protection	Whip	Goddess of marriage, family, and motherhood.
Hermes	NG	Air, Good, Luck, Travel, Trickery	Dagger	God of travel, thieves, and commerce.
Hestia	NG	Fire, Good, Healing, Magic	Sap	Goddess of the hearth and domestic life.
Nemesis	LN	Death, Destruction, Law, Trickery	Longsword	Goddess of Revenge.
Pan	CG	Animal, Chaos, Luck, Good	Sickle	God of flocks and sheep.
Poseidon	CN	Chaos, Strength, Travel, Water	Trident	God of the sea.
Zeus	N	Air, Destruction, Magic, Protection	Longspear	God of air, thunder and lightning.

*/
    'Demeter',
    'Dionysus',
    'Hades',
    'Hephaestus',
    'Nemesis',
    'Poseidon',
    'Zeus'
  ];


  gen_data['babylonian_god'] = [
/*
Deity	Alignment	Domains	Favored Weapon	Description
Anu	LG	Air, Knowledge, Law, Protection	Mace	Sky-God, lord of heaven and all other gods. He also judged those who committed crimes.
Anshar	NE	Evil, Magic, Trickery	Dagger	God who used to be lord of the sky, but was usurped by Anu.
Dahak	CE	Chaos, Death, Evil	Scimitar	A cruel, evil god who only seeks war.
Druaga	LE	Evil, Law, Trickery	Mace	Druaga is the evil god of the underworld and of Devils.
Enlil	NG	Air, Good, Luck, War	Heavy Pick	God of wind, breath, loft, and breadth.
Enki	LN	Earth, Magic, Water	Mace	God of crafts, seawater, lakewater, intelligence, and creation.
Gilgamesh	NG	Good, Strength, Travel, War	Mace	Being who is two parts god, one part man. He later ascended to heaven, where he is the god of strength and war, among other things.
Girru	LG	Fire, Good, Law, Magic	Morningstar	The god of light and fire.
Ishtar	N	Magic, Strength, Summer*, War	Light flail	The Goddess of fertility, love, war, and sex. Her worshippers often practice sacred prostitution, and though she has many lovers, she treats all of them cruelly.
Ki	N	Animal, Luck, Plant	Quarterstaff	Mother goddess of the earth and fertility.
Marduk	LN	Air, Law, Protection	Net	50-named god who is the patron deity of Babylon.
Nanna-Sin	CG	Chaos, Luck, Good	Battleaxe	God of the moon and mischeif.
Nergal	NE	Death, Earth, Evil	Longsword	A god of the underworld who causes war and pestilence.
Utu	CG	Chaos, Fire, Good, Sun	Scimitar	The firey god of the sun.

*/
	'Anu',
	'Anshar',
	'Dahak',
	'Druaga',
	'Enlil',
	'Enki',
	'Gilgamesh',
	'Girru',
	'Ishtar',
	'Ki',
	'Marduk',
	'Nanna-Sin',
	'Nergal',
	'Utu'

  ];

  gen_data['egyptian_god'] = [
/*

Deity	Alignment	Domains	Favored Weapon	Description
Re-Horakhty	LG	Good, Law, Sun, War	Khopesh	The falcon-headed God of the Sun.
Anubis	LN	Law, Magic, Repose*	Mace	The jackal-headed God of judgement in the afterlife and embalming.
Apep	NE	Evil, Fire, Sand*	Heavy pick	The snake God of darkness, who battles Re-Horakhty every night.
Bast	CG	Chaos, Destruction, Protection, Strength, War	Spiked gauntlet	Lion-headed warrior Goddess who was also protects the pharoahs.
Hathor	NG	Protection, Good, Luck	Longsword	Cow-headed Goddess of childbirth and miners.
Imhotep	NG	Earth, Healing, Knowledge, Rune*	Quaterstaff	Early human engineer and physician who became a God after death.
Isis	NG	Good, Magic, Protection, Water	Quaterstaff	Goddess of motherhood, magic, and fertility. She is the wife of Osiris.
Nephthys	CG	Chaos, Good, Protection, Repose*	Mace	Goddess of funerary rites who is the nurse and protector of the Pharoah. She is Isis' sister and the wife of Set.
Osiris	LG	Air, Earth, Good, Law, Plant, Repose*	Light flail	Green-skinned judge and lord of the dead, who is in charge of the underworld agency that grants all life.
Ptah	LN	Knowledge, Law, Travel	Mace	Green-skinned God that called the world into being, and god of craftsmen.
Set	CE	Air, Chaos, Destruction, Evil, Strength	Spear	Typhon-headed God of the desert, storms, darkness, and chaos. Like Apep, he is said to fight Re every night.
Sobek	LE	Animal, Evil, Water	Shortspear	Crocodile-headed God of the Nile and the reptiles that live in it.
Thoth	N	Knowledge, Magic, Rune*	Quaterstaff	Ibis-headed God of the heart and tongue, who is a mediator between disputes of good and evil.

*/

	"Re-Horakhty",
	"Anubis",
	"Apep",
	"Bast",
	"Hathor",
	"Imhotep",
	"Isis",
	"Nephthys",
	"Osiris",
	"Ptah",
	"Set",
	"Sobek",
	"Thoth"

  ];

  gen_data['Norse_god'] = [
/*

Name	Domains	Rank	Alignment	Favored Weapon	Portfolio
Odin	Air, Knowledge, Magic, Travel, Trickery, War	G	NG	Shortspear	Knowledge, magic, supreme, war
Aegir	Death, Destruction, Evil, Strength, Water	I	NE	Greatclub	Sea, storms
Balder	Good, Healing, Knowledge	I	NG	Greatsword	Beauty, light, music, poetry, rebirth
Forseti	Knowledge, Protection, Strength	I	N	Longsword	Justice, law
Frey	Air, Good, Plant, Sun	G	NG	Greatsword	Agriculture, fertility, harvest, sun
Freya	Air, Charm, Good, Magic	I	NG	Longsword	Fertility, love, magic, vanity
Frigga	Air, Animal, Community, Knowledge	G	N	Natural Weapons	Birth, fertility, love
Heimdall	Good, Law, War	I	LG	Longsword	Watchfulness, sight, hearing, loyalty
Hel	Death, Destruction, Evil	I	NE	Longsword	Death, underworld
Hermod	Chaos, Luck, Travel	D	CN	Rapier	Luck, communication, freedom
Loki	Chaos, Destruction, Evil, Trickery	G	CE	Dagger	Thieves, trickery, murder
Njord	Air, Good, Water	I	NG	Longspear	Commerce, sea, wind
Odur	Chaos, Fire, Sun	D	CG	Bastard Sword	Light, sun, travel
Sif	Chaos, Good, War	L	CG	Longsword	War, dueling
Skadi	Destruction, Earth, Strength	L	N	Greataxe	Earth, mountains
Surtur	Evil, Fire, Law, Strength, War	I	LE	Longsword	Fire, war
Thor	Chaos, Good, Protection,
Strength, War, Weather	G	CG	Warhammer	Storms, thunder, war
Thrym	Chaos, Earth, Evil, Strength, War	I	CE	Greataxe	War, cold, giants
Tyr	Law, Protection, War	I	LN	Longsword	Courage, trust, strategy, tactics, writing
Uller	Chaos, Protection, Travel	L	CN	Longbow	Archers, hunting, winter

*/

	'Odin',
	'Aegir',
	'Balder',
	'Forseti',
	'Frey',
	'Freya',
	'Frigga',
	'Heimdall',
	'Hel',
	'Hermod',
	'Loki',
	'Njord',
	'Odur',
	'Sif',
	'Skadi',
	'Surtur',
	'Thor',
	'Thrym',
	'Tyr',
	'Uller'

  ];






/*
Diety End
*/

  gen_data['side'] = {
    '1':'left',
    '2':'right'
  };

  gen_data['general_quality'] = {
	'1':'excellent',
	'2-3':'good',
	'4-7':'average',
	'8-9':'poor',
	'10':'terrible'
  };
  gen_data['precious_material'] = {
	'1-5':'amber',
	'6-15':'ivory',
	'16-20':'glass',
	'21-25':'{more_precious_material}'
  };
  gen_data['more_precious_material'] = {
	'1':'platinum',
	'2-3':'gold',
	'4-6':'silver',
	'7-10':'copper',
	'11-40':'brass',
	'41-70':'bronze',
	'71-100':'steel',
	'101-110':'lead',
	'111-125':'iron',
	'126-130':'pewter',
  };
  gen_data['color'] = {
	'1':'red',
	'2':'blue',
	'3':'yellow',
	'4':'green',
	'5':'white',
	'6':'black',
	'7':'purple',
	'8':'brown',
	'9':'orange',
	'10':'indego'
  };
  gen_data['direction'] = {
	'1-3':'north',
	'4-5':'northeast',
	'6-8':'east',
	'9-10':'southeast',
	'11-13':'south',
	'14-15':'southwest',
	'16-18':'west',
	'19-20':'northwest'
  };
  gen_data['rarity'] = {
	'1-50':'common',
	'51-85':'uncommon',
	'86-95':'rare',
	'96-99':'very rare',
	'100':'unique'
  };
  gen_data['size_a'] = {
	'1-5':'tiny',
	'6-25':'small',
	'26-75':'average',
	'76-95':'large',
	'96-100':'huge'
  };

  gen_data['size_b'] = {
	'1':'small',
	'2-3':'medium',
	'4':'large'
  };

  gen_data['human_height'] = {
    /*Change to inches distribution */
    '1':'4 foot {inches} inches (Short)',
    '2-3':'5 foot {inches} inches (Average)',
    '4':'6 foot {inches} inches (Tall)'
  };

  gen_data['human_weight'] = {
    '1':'Skinny ([Dice~7d20] lbs.)',
    '2-3':'Average ([Dice~14d20] lbs.)',
    '4':'Fat ([Dice~21d20] lbs.)'
  };

  gen_data['human_hair_color'] = {
    '1-5':'{human_roman_hair_style} brown hair',
    '6-8':'{human_roman_hair_style} blond hair',
    '9-10':'{human_roman_hair_style} red hair',
    '11':'{human_roman_hair_style} white hair',
    '12':'{human_roman_hair_style} grey hair',
    '13-15':'bald',
    '15-18':'shaved head'

  };

  gen_data['human_roman_hair_style'] = {
    '1-2':'short and straight',
    '3-4':'short and curly',
    '5-7':'moderate in length and straight',
    '8-10':'moderate in length and curly',
    '11':'long and straight\, unbound',
    '12':'long and straight\, tied in the back',
    '13':'long and curly\, unbound',
    '14':'long and curly\, tied in the back'
  };
  gen_data['human_eye_color'] = {
    '1-33':'Brown',
    '34-66':'Blue',
    '66-99':'Green',
    '100':'One [human_eye_color] and one [human_eye_color]'
  };
  gen_data['human_identifying_marks'] = {
    '1-9':' no identifying marks',
    '10-11':'eye patch',
    '13-14':'scar on {side} cheek',
    '16-17':'visible tattoo of a {human_identifying_marks_tattoo} on the {human_identifying_marks_body_part}'
  };
  gen_data['human_identifying_marks_body_part'] = {
    '1':'forehead',
    '2':'{side} cheek',
    '3':'{side} hand',
    '4':'neck'
  };
  gen_data['human_identifying_marks_tattoo'] = {
    '1':'{common_animal}',
    '2':'{bird_of_prey}',
    '3':'Evil outsider',
    '4':'Flower',
    '5':'Good outsider',
    '6':'Holy symbol',
    '7':'Magical rune',
    '8':'{fantastic_animal}',
    '9':'Name',
    '10':'Reptile',
    '11':'Sea serpent',
    '12':'Ship',
    '13':'{common_animal} skull',
    '14':'Starburst design',
    '15':'tribal knot',
    '16':'Vine',
    '17':'{weapon}',
    '18':'Human Skull',
    '19':'Anchor with rope',
    '20':'Arcane symbol or shape',
    '21':'Banner bearing the colors {color} and {color}',
    '22':'Castle tower',
    '23':'Celtic knot',
    '24':'Crossed {melee_weapon}s',
    '25':'Hammer and anvil',
    '26':'{musical_instruments}',
    '27':'Noose',
    '28':'Ornate {melee_weapon}',
    '29':'Robed figure carrying a {weapon}',
    '30':'Rune',
    '31':'Sailing ship',
    '32':'Shattered {melee_weapon}',
    '33':'Shield with a {bird_of_prey} in the middle',
    '34':'Ship on water',
    '35':'Skull and crossbones',
    '36':'Five Pointed Star'
  };


 gen_data['goblinoild_race'] = [
    'bugbear',
    'gnoll',
    'goblin',
    'hobgoblin',
    'kobold',
    'orc'
]
 gen_data['humanoid_race'] = [
    'dwarves', 'elves', 'human'
]
 gen_data['giant_race'] = [
    'Cloud Giant', 'Storm Giant', 'Hill Giant', 'Ogre', 'Troll'
]
 gen_data['mysterious_person'] = [
    'adventurer', 'hero', 'guildsman', 'noble', 'outlaw', 'religious', 'guru', 'royalty', 'villain'
]
 gen_data['small_common_domestic_animal'] = [
    'Bee',
    'Canary',
    'Dove',
    'Mouse',
    'Rat',
    'Snake',
    'Spider',
    'Rabbit'
]
 gen_data['common_metal'] = [
    'brass',
    'iron',
    'tin',
    'pewter',
    'copper'
]
gen_data['minor_magic_item'] = [
	'Wooden Spoon.  Carved with rune for "food".  When tapped on an inert organic or semi-organic material (wood, dirt) it turns that stuff into edible foodstuffs, although it will be mushy and unpalatable.',
	'Amulet of Hope.  Shines as bright as a candle, but only when there are no other light sources.  Light points back towards dungeon entrance, vaguely.  Hums reassuringly when clutched, and warms your hand.',
	'Orphan\'s Top.  Cannot be spun if there are any invisible undead nearby.  ',
	'Ring of the Adventurous Limb.  If worn on a hand, the entire arm will vanish.  It will return after 24 hours have elapsed.  Roll a d10: 1 - tattoo on arm, 2 - arm injured, 3 - gained a ring, probably a wedding ring, 4 - ring missing, 5-10 - nothing special.  It will have a similar effect on legs.',
	'Dust of De-Appearance.  Can make things invisible, but wears off if the object moves, is moved, or even wiggles a bit.  Best used on inanimate objects or people who can hold really, really, still.',
	'Paired Scrolls.  Whatever is written on one appears on the other.  Give players a 3"x5" card to write on, to limit how much they can write.',
	'Statuette of Baal.  Can be "fed" gold to grow larger, adding to its.  Starts out the size of a gold coin.  Becomes more complex as it grows larger, adds features and companions.  If grown to the size of 100,000 gp, golden tablet reveals great secret.  (Does not create or destroy gold, just absorbs it.)  If grown to 1,000,000 gp, it will come alive and try to take over the world.',
	'Book of Epic Boredom.  When reading, save vs sleep.',
	'Black Cigarette.  When smoked, it creates a huge cloud of smoke and allows the smoker to see through smoke and fog.  Can be smoked for 5 minutes (or 5 one-minute segments).',
	'Colorthief\'s Brush.  This paintbrush has a needle on the back.  If you prick something, you steal all the color from it, but can later paint with those same brilliant colors (stored in the brush, controlled by imagination).  If a book is pricked, it will steal the words.  The book can then be reconstructed, but it takes a few days of writing for it to be recovered.',
	'Sleeping Draught.  Sleep TWICE AS HARD for four hours.  You get a full night\'s rest, but cannot be woken up.  Unwilling targets get a save.',
	'Love Potion.',
	'Exploserous Carnelian.  When activated, begins to glow hotter and hotter.  Explodes like a stick of dynamite after 1d2+2 rounds.',
	'Mighty Acorn.  When thrown on the ground, immediately grows into a 20\' oak.',
	'Mechanical Torchbearer.  Follows the associated amulet, or whoever is wearing it.  Can hold 6 torches, and relight a new one as the old one burns out.  Looks like a mechanical spider, 5\' in diameter.',
	'Penguin tokens (1d6).  Summons an 80 lb emperor penguin.  On land, cannot do anything except waddle to where you direct.  In water, can attack as a 1 HD creature.  Is destroyed/killed if it takes any damage.  Reverts to a small (1") wooden token after 1 minute.',
	'Saint\'s Bones.  About the size of a cigar box.  Contains mandible + some carpals.  Will rattle ominously when a lie is uttered nearby.',
	'Amber Comb.  Any lightning attack within 10\' is diverted to the comb instead.  If the comb takes 6 or more damage (it is not immune to lightning), it shatters.',
	'Chewed Bone.  When chewed, it fills the air with the smell of delicious fresh meat.  This is strong enough to mask other odors.',
	'Bottle of Light.  When swung overhead (a small chain is attached for this purpose) the bottle absorbs ambient light.  Later, the bottle can be unstoppered to allow the light back out again.  Can hold up to 5 rounds of light.  Special properties of light are preserved: moonlight can induce lycanthropy, for example.',
	'Silver silk handkerchief.  3\' on a side.  On the command word, it becomes as hard as thick steel.  A second command word reverts.',
	'Silver silk rope.  As above, except a rope.  25\'.',
	'Goggles of the Clown.  When worn, everything looks like a clown, and speaks in a mocking, clowning voice.  It is very difficult to tell people apart.  You can barely tell a knight apart from his horse (which appears as a four-legged clown).  In combat, you must make a Wisdom check every round or lose track of which clown is which.  On the upside, you are immune to the beauty of nymphs and the ugliness of catoblepas.',
	'Vial of Nightshade.  When drunk, it puts the body into a deep coma and ejects the spirit.  You can now roam around, incorporeal, until you return to your body.  There is a 1-in-6 chance each hour that some mishap befalls you (body possessed by outsider, soul lost forever, etc).  Coma lasts for 1d3 days.',
	'Grinning Amulet.  Anyone who laughs--even a snicker--near this amulet must make a save or laugh uncontrollably for the next minute.  Careful, it\'s contagious--if a player laughs during this, so does their character.',
	'Trollwax.  Tacky and unpalatable.  Anything that tastes it must succeed on a check, or be so disgusted that it cannot taste it again.  (Takes a week to fully leave the tongue.)',
	'Cheater\'s Coin.  When flipped, it will give whatever result the owner wishes.  This is not limited to heads/tails--it can also give results of king, dragon, treasury, pilgrims, etc.',
	'Boots of Independence.  When you remove these boots and fail to restrain them (put them in a pack, etc) they will walk back the way they came, all the way back to where you first put them on, with more-or-less the same cadence and sounds.  If you walked in a loop somewhere along the line, the boots will get stuck in the loop and repeat.',
	'Tiny tree.  Produces three fat apples every day (enough to feed 1 person).  Must be watered with 1 cup of blood each day, or it will die.  If dead, can be revived with water.  Probably found dead/in a chest.',
	'Skeleton gourd.  This gourd has a peephole.  Anyone holding the gourd up to their face and looking into the peephole will be paralyzed while their brain is filled with visions of dancing skeletons.',
	'Ring of Petrification.  Putting this ring on will turn a person to stone, except for the ring.  Someone else can remove the ring, and thereby return them to flesh.',
	'Party Book.  This book creates audible illusions imitating a party.  The state of the party depends on the page the book is opened to.  If the book is turned to page 1, you\'ll hear a couple people setting up silverware.  Middle of the book, raucous carousing.  Near the end, mostly snores and a few people taking shots.',
	'Quiet Bell.  This 2" tall silver bell prevents all sound within 1\'.',
	'Palette of All Colors.  Contains 7 mundane palettes (ROYGBIV) and 1 color that is invisible to humans.  If the invisible color is painted on a wall, it allows people to see through it.  Can paint up to a 3\' diameter spot, or 10 3" peepholes.  Penetrates no more than 6".  Getting it on someone\'s face blinds them.',
	'Slimming Cone.  When touched to a creature, it instantly and harmless sucks out all the excess fat from them, ejecting it onto the floor in a big mass.',
	'Grass Whistle.  When blown, roll for a random encounter.  If the location has no encounter table (some cities, maybe), the PCs will meet someone interesting who wants something.',
	'Naiad-hair Ring.  50% cursed.  When worn, PC treats all water as if it had the consistency of a gas.  (Don\'t fall off a boat.)  Water is still unbreathable.',
	'Ring of Swimming.  Wearer treats air as if it had the consistency of water.  You can "fly" by swimming through the air, but the air is too thick to breath.  Other water penalties also apply.',
	'Belt of Cat Imprisonment.  When laid on the ground, felines are compelled to sit in the center of it.  As charm.',
	'Endless Boots.  Cannot stop walking.  Will never tire from walking.  Cannot run.  Walk walk walk.',
	'Spike of Woodland Suicides.  Sort of like a hunter\'s trap.  When left in the woods, wild animals will come and impale themselves on it.  A verdant forest yield 1d10 rations worth per day, but must be moved daily.  Fey will hate you, though.',
	'Salt Block.  Any food you carry will never spoil.  Doesn\'t have to be on your person.  Applies to a captain and his ship\'s cargo, for example.',
	'Log of Alarum.  This 300 lb log protects those who sleep with their heads against it.  If they would be attacked in their sleep, the log has a 90% chance of waking them up (by making bird song).',
	'Demonic Muffin.  When eaten, reverses your gravity for 1d6 minutes.',
	'Everice.  Never melts.',
	'Chest of the Mundane.  Anything placed inside it is covered with an illusion that makes it look worthless and boring.  Currently holding 3 peridots worth 10gp each.',
	'Boots of Devouring.  Cursed.  As soon as you put one on your foot it starts fucking eating you like a garbage disposal.  Feeding it lots of booze causes it to vomit out everything in its stomache (which may include some treasure).  ',
	'Fox-in-a-Bag.  Sleeps all the time.  As soon as it touches the ground, it will run around like crazy.  Dex 18, AC as plate because of high Dexterity + foxy nature.  If you pick it up (good luck) it will fall back asleep.',
	'Feather of Bravado.  When placed in a hat, it points in the direction of the nearest deadly foe capable of killing the PCs.  When placed in the bottom of one\'s shoe, allows them to run slightly faster.',
	'Gossip Cookies.  Each one contains either a random rumor from the most relevant rumor table or "You will be killed by [random monster from most relevant random encounter table]".  50% chance of each.',
	'A small silver figurine that, when given away, will return to your pocket after 1d6 minutes.  The only way to permanently get rid of it is for the recipient to similarly give it away before the 1d6 minutes expire.   (Alternatively, the original owner could die.)  Yes, this is great for scamming people.  Apparent value: 1d100 silver.',
	'A rock that, when thrown, always hits its target.  Always.  Cannot do anything that you couldn\'t conceivably do with a really lucky throw.',
	'A saddle that turns any animal into a horse when it is strapped on.  The horse cannot remove the saddle on its own.  Currently owned by a bounty hunter who is fond of riding his bounties back to town.',
	'A key that can unlock any door, but cannot be removed from the mechanism until the door is relocked.',
	'A mug that points the way to the nearest tavern when it is balanced on its edge.',
	'An egg cup that can hatch any egg that is placed atop it.',
	'A ring that gives the wearer a magnificent mustache/beard, depending on which finger it is worn on.  The left ring finger, for example, always yields a Van Dyke.',
	'A ring that makes your eyeball pop out.  This is not a problem, and you can continue to see through the eye just fine, like a spy-eye.  Reversible if the ring is removed.',
	'A ring that makes you invisible, but not your equipment or clothing.',
	'An umbrella that allows you float downwards at 60\'/round when open, negating fall damage.',
	'Chicken Arrows (1d6).  On a hit, target must save vs fear (first arrow only).  If sat upon like an egg, quickly turns into an adult chicken.  Fletched with white feathers.',
	'Bag of Infinite Manure.  Useful for campfires.',
	'Wand of Necromantic Cooking.  Can enchant a corpse or cut of meat to cut, prepare, marinate, and cook itself.  A slaughtered pig will seek out gravy to roll around in.  Sausages will jump into the saucepan, and then seek out your plate when cooked.',
	'Omnidress.  Can turn into any type of dress (can even imitate leather armor, but not metal).',
	'Indelible Pen.  Can write on anything.  Writing is permanent.  Works 1d6 times.',
	'Ring that makes the wearer appear to be dead and rotten.',
	'Scones (1d6).  When broken in half, it erupts into 1d100 scones (10 scones = food for a day).  Alternatively, it can be eaten to restore 1d6 HP.',
	'Wooden hand.  1/day, can turn into a living-but-disembodied hand for 1 hour.  Will obey your commands for the duration.  Str 1, can climb most walls.  Int 6, can see normally, but cannot speak.',
	'Locket.  Woman\'s face inside the amulet always looks towards Meltheria.',
	'Box of paired snails.  When one snail dies, so does its mate.  Normally used to send very crude, binary messages.  There are 1d6 pairs of snails.  Feed them leaves.',
	'Hungry coin.  Cursed.  Will attempt to eat other coins that it comes into contact with.  Eats 100 coins an hour.',
	'Armor of Glamour.  Looks like a fancy dinner suit.  Is actually a suit of plate mail.',
	'Ring of Good Omen.  The first time you fail a save against a curse or other magic, the ring breaks and you instead make your save.',
	'Prayer of the Seal.  When this sheet of paper is attached to a door or portal, it become locked (until the paper is removed or destroyed.)',
	'Boots of the Aristocrat.  When you click them together, your clothes become clean, your skin becomes perfumed, and your hair is styled.',
	'Cursed matches (1d6). When lit, the match does not ignite.  Instead, whatever the PC is looking at catches fire.  (Tiny match-sized fire.  Does no damage unless allowed to progress.)',
	'Preservative jar.  Anything placed in this jar enters stasis.  Cannot hold anything bigger than a toad.  Currently holds a toad.',
	'Library Box.  When a non-magical book is placed inside it, another of the same type will be found there the next day.',
	'Monocle of Entropy.  If you stare at something long enough, it will fall over.  1 round for a candlestick, 1 minute for a sleeping cow, 1 hour for a small tree, 1 day for a cottage or large tree, 1 week for a castle.  Must be within 100\'.',
	'Girdle of Masculinity/Femininity.  Non-cursed because that\'s way more fun.',
	'Stick of the Titan.  Hits for 2d8, then breaks.',
	'Singing frog.  Knows 1d6 songs.  Good for a free round of drinks in pretty much any bar you walk in to, with only a 20% chance that someone will try to steal it from you at the end of the night.',
	'Perpetual motion machine.  Utterly unremarkable in a world filled with magic, but still cool.',
	'Seed of Moon Ice.  If dropped in a body of water, will "freeze" an area up to 20\' diameter.  If swallowed, you die.  If touched, save or die.  Leaves awesomely frozen corpses that are not cold to the touch and never thaw.',
	'Small broom.  When activated, will attempt to clean the dirtiest thing nearby.',
	'Black cat, winged.  When you tap it on the nose, it enters stasis.  (This is why you found it in a treasure chest.)',
	'Blindfold of the Spirits.  When worn, you can attack incorporeal things as if they weren\'t.  Also, you\'re blind.',
	'Night\'s Black Windchimes.  25% chance of alerting you when you would be attacked during the night.  If one of the 1d6+1 chimes is broken in half, a refreshing (but also quite cold) breeze blows through the area.',
	'Dust of Vermicide.  When thrown, does 1 damage to everything in a 5\' diameter area.  Alternatively, does 2d6 damage against a swarm.',
	'Sovereign Glue.',
	'Universal Solvent.',
	'Goblin cloak.  Invisible while in shadowy areas, but stinks like a mound of goblin shit.',
	'Miser\'s Flute.  When played, all unsecured coins in 20\' will leap up and roll after you.  They will follow you as long as you play, and as fast as normal running speed.  Uphill is fine, stairs are not.',
	'Donkey Legs.  These wooden donkey legs can be attached to anything (but are not strong enough to carry literally anything).  Once attached, the thing will follow you around like a loyal donkey.  For example, you can attach them to a heavy statue and then have it walk itself out of the dungeon.  Donkey legs are as strong as two donkeys!',
	'Giant\'s Ochre.  Anything painted with this pigment will double in size.  Washes off easily with water or sweat.  (If you paint yourself, it\'ll wash off after 1d6 rounds of sweaty combat).',
	'Mask of the Jester.  Anyone seeing it for the first time must save vs charm or be compelled to attack the wearer.',
	'Eye of Zin.  If this jewel is pressed into the forehead, the wearer\'s eyes turn jet black, they gain darkvision, and they are blinded by even small amounts of light (a nearby torch will blind them, for example).',
	'Metal Eye Mask.  Wearing this mask obscures you normal vision, but allows you to see from above, sort of like an orbital satellite\'s view.  At sea level, you can see an area 200\' in diameter, centered on the mask.',
	'Pink Bead.  When smashed on the ground, immediately turns into a huge mountain of fluffy bubbles, similar in consistency to a mass of fused marshmallows.  Can cushion a fall or block a hallway or something.  10\' in diameter, can be cut through with 6 slashing attacks, lasts 1d6 minutes.',
	'Animate rope with the personality of a loyal dog.  50\'.  Must be taught knots the way a dog must be taught tricks.'
]


gen_data['trinket'] = [
    /* Modified from DnD 5e PHB Trinkets */

    'A mummified {goblinoid_race} hand',
    'A piece of {color} crystal that faintly glows in the moonlight',
    'A {precious_material} coin minted in an unknown land',
    'A diary written in a language you don’t know',
    'A {more_precious_material} ring that never tarnishes',
    'An old chess piece made from {precious_material}',
    'A pair of knucklebone dice, each with a skull symbol on the side that would normally show six pips',
    'A small idol depicting a nightmarish creature that gives you unsettling dreams when you sleep near it',
    'A rope necklace from which dangles four mummified {humanoid_race} fingers',
    'The deed for a parcel of land in a realm unknown to you',
    'A 1-ounce block made from an unknown material',
    'A small cloth doll of a {humanoid_race} skewered with needles',
    'A tooth from an unknown beast',
    'An enormous scale, perhaps from a dragon',
    'A bright {color} feather',
    'An old divination card bearing your likeness',
    'A glass orb filled with moving smoke',
    'A 1-pound egg with a bright red shell',
    'A pipe that blows bubbles',
    'A glass jar containing a weird bit o f flesh floating in pickling fluid',
    'A tiny gnome-crafted music box that plays a song you dimly remember from your childhood',
    'A small wooden statuette of a smug halfling',
    'A {size_b} {more_precious_material} orb etched with strange runes',
    'A multicolored stone disk',
    'A tiny {more_precious_material} icon of a {bird_of_prey}',
    'A bag containing forty-seven humanoid teeth, one of which is rotten',
    'A shard o f obsidian that always feels warm to the touch',
    'A dragon\'s bony talon hanging from a plain leather necklace',
    'A pair of old socks',
    'A blank book whose pages refuse to hold ink, chalk, graphite, or any other substance or marking',
    'A {more_precious_material} badge in the shape of a {human_identifying_marks_tattoo}',
    'A knife that belonged to a relative',
    'A glass vial filled with nail clippings',
    'A rectangular metal device with two tiny metal cups on one end that throws sparks when wet',
    'A {color} glove sized for a human',
    'A vest with one hundred tiny pockets',
    'A small, weightless stone block',
    'A tiny sketch portrait of a {goblinoid_race}',
    'An empty glass vial that smells of perfume when opened',
    'A gemstone that looks like a lump of coal when examined by anyone but you',
    'A scrap of cloth from an old banner',
    'A rank insignia from a lost legionnaire',
    'A tiny {more_precious_material} bell without a clapper',
    'A mechanical canary inside a gnomish lamp',
    'A tiny chest carved to look like it has numerous feet on the bottom',
    'A dead sprite inside a clear glass bottle',
    'A metal can that has no opening but sounds as if it is filled with liquid, sand, spiders, or broken glass (your choice)',
    'A glass orb filled with water, in which swims a clockwork goldfish',
    'A {more_precious_material} spoon with an M engraved on the handle',
    'A whistle made from gold-colored wood',
    'A dead scarab beetle the size of your hand',
    'Two toy soldiers, one with a missing head',
    'A small box filled with different-sized buttons',
    'A candle that can’t be lit',
    'A tiny cage with no door',
    'An old key',
    'An indecipherable treasure map',
    'A hilt from a broken sword',
    'A rabbit’s foot',
    'A glass eye',
    'A cameo carved in the likeness of a hideous person',
    'A {more_precious_material} skull the size of a coin',
    'An alabaster mask',
    'A pyramid of sticky black incense that smells very bad ',
    'A nightcap that, when worn, gives you pleasant dreams',
    'A single caltrop made from bone',
    'A {more_precious_material} monocle frame without the lens',
    'A 1-inch cube, each side painted a different color',
    'A crystal knob from a door',
    'A small packet filled with {color} dust',
    'A fragment o f a beautiful song, written as musical notes on two pieces of parchment',
    'A {more_precious_material} teardrop earring made from a real teardrop ',
    'The shell of an egg painted with scenes of {humanoid_race} misery in disturbing detail',
    'A fan that, when unfolded, shows a sleeping cat',
    'A {musical_instruments}',
    'A four-leaf clover pressed inside a book discussing manners and etiquette',
    'A sheet of parchment upon which is drawn a complex mechanical contraption',
    'An ornate scabbard that fits no blade you have found so far',
    'An invitation to a party where a murder happened',
    'A {more_precious_material} pentacle with an etching of a {common_animal}\'s head in its center',
    'A purple handkerchief embroidered with the name of a powerful archmage',
    'Half o f a floorplan for a temple, castle, or some other structure',
    'A bit of folded cloth that, when unfolded, turns into a stylish cap',
    'A receipt o f deposit at a bank in a far-flung city',
    'A diary with seven missing pages',
    'An empty {precious_material} snuffbox bearing an inscription on the surface that says “dreams’’',
    'An {common_metal} holy symbol devoted to an unknown god',
    'A book that tells the story of a legendary {mysterious_persons}\'s rise and fall, with the last chapter missing',
    'A small vial labled {fantastic_animal} blood',
    'An ancient arrow of {humanoid_race} design',
    'A needle that never bends',
    'An ornate brooch of {humanoid_race} design',
    'An empty wine bottle bearing a pretty label that says, “The Wizard of Wines Winery, Red Dragon Crush, 331422-W"',
    'A mosaic tile with a multicolored, glazed surface',
    'A petrified {small_common_domestic_animal}',
    'A black pirate flag adorned with a {fantastic_animal}\'s skull and crossbones',
    'A tiny mechanical crab or spider that moves about when it’s not being observed',
    'A glass jar containing lard with a label that reads, “{fantastic_animal} Grease”',
    'A wooden box with a ceramic bottom that holds a living worm with a head on each end of its body',
    'A metal urn containing the ashes of a {mysterious_person}'
]
