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
	'{common_animal}', '{fantastic_animal}', '{bird_of_prey}'
  ];
  gen_data['common_animal'] = {
  	'1-3': 'bear',
  	'4-5': 'boar',
  	'6-9': 'bull',
  	'10': 'cow',
  	'11': 'horse',
  	'12-13': 'hound',
  	'14-15': 'lamb',
  	'16-19': 'lion',
  	'20-22': 'serpent',
  	'23-25': 'stag',
  	'26-27': 'tiger',
  	'28-30': 'wolf',
  	'31': 'sturgeon',
  	'32': 'elk',
  	'33': 'badger',
  	'34': 'hare',
  	'35': 'bat',
  	'36': 'lizard',
  	'37': 'squirrel',
  	'38-40': 'fox',
  	'41': 'dolphin',
  	'42-43': 'panther',
  	'45-46': 'ram',
  	'47': 'goat',
  	'48': 'beaver',
  	'49': 'mountain lion',
  	'50': 'tortoise',
  	'51': 'pike',
  	'52': 'frog',
  	'53': 'rat',
  	'54': 'mare',
  	'55': 'stallion',
  	'56': 'plowhorse',
  	'57': 'ox'
  };
  gen_data['fantastic_animal'] = {
  	'1-2': 'dragon',
  	'3-4': 'griffin',
  	'5-6': 'hydra',
  	'7': 'phoenix',
  	'8-9': 'unicorn',
  	'10': 'wyvern',
  	'11': 'giant',
  	'12-13': 'sphinx',
  	'14': 'demon',
  	'15': 'cyclops',
  	'16': 'harpy',
  	'17': 'kraken',
  	'18': 'leviathon',
  	'19': 'manticore',
  	'20': 'pegasus',
  	'21': 'ogre',
  	'22': 'troll'
  };
  gen_data['bird_of_prey'] = {
  	'1-2': 'eagle',
  	'3-4': 'falcon',
  	'5-6': 'hawk',
  	'7-8': 'raven',
  	'9': 'rook',
  	'10': 'heron',
  	'11': 'crane',
  	'12': 'rooster',
  	'13': 'crow',
  	'14': 'gull',
  	'15': 'condor',
  	'16-17': 'owl',
  	'18': 'merlin'
  };
  gen_data['saltwater_fish'] = [
   'Albacore',
   'Anchovy',
   'Sea Bass',
   'Blue fish',
   'Carp',
   'Cod',
   'Flounder',
   'Grouper',
   'Hake',
   'Halibut',
   'Herring',
   'Mackerel',
   'Ocean perch',
   'Red snapper',
   'Rockfish',
   'Roughy',
   'Swordfish',
   'Tuna',
   'Turbot',
   'Yellowtail'
]
  gen_data['aquitic_creatures'] = [
  'Albatross',
  'Dolphin',
  'Eel',
  'Great white shark',
  'Gull',
  'Jellyfish',
  'Otter',
  'Pelican',
  'Sea anemone',
  'Sea snake',
  'Seal',
  'Shark',
  'Sponge',
  'Walrus',
  'Crab',
  'Flounder',
  'Flying fish',
  'Killer whale',
  'Lobster',
  'Octopus',
  'Pufferfish',
  'Ray',
  'Sea snake',
  'Sea turtle',
  'Seahorse',
  'Squid',
  'Sturgeon',
  'Whale'
]
  gen_data['fey_creature'] = [
  'Brownie',
  'Dryad',
  'Faun',
  'Leprechaun',
  'Nymph',
  'Pixie',
  'Satyr',
  'Sprite',
  'Sylph'
]
  gen_data['inches'] = {
  	'1': '1',
  	'2': '2',
  	'3': '3',
  	'4': '4',
  	'5': '5',
  	'6': '6',
  	'7': '7',
  	'8': '8',
  	'9': '9',
  	'10': '10',
  	'11': '11'
  };
  gen_data['musical_instruments'] = {
  	'1': 'Alphorn',
  	'2': 'Bagpipes',
  	'4': 'Guitar',
  	'5': 'Drums',
  	'6': 'Dulcimer',
  	'7': 'Fiddle',
  	'8': 'Harp',
  	'9': 'Harpsichord',
  	'9': 'Horn',
  	'13': 'Lute',
  	'14': 'Lyre',
  	'15': 'Mandolin',
  	'16': 'Pan pipes'
  };
  gen_data['culture'] = {
  	'01-10': 'norse',
  	'11-20': 'roman',
  	'21-30': 'babylonian',
  	'31-40': 'egyptian'
  }
  gen_data['side'] = {
  	'1': 'left',
  	'2': 'right'
  };
  gen_data['general_quality'] = {
  	'1': 'excellent',
  	'2-3': 'good',
  	'4-7': 'average',
  	'8-9': 'poor',
  	'10': 'terrible'
  };
  gen_data['precious_material'] = {
  	'1-5': 'amber',
  	'6-15': 'ivory',
  	'16-20': 'glass',
  	'21-25': '{more_precious_material}'
  };
  gen_data['more_precious_material'] = {
  	'1': 'platinum',
  	'2-3': 'gold',
  	'4-6': 'silver',
  	'7-10': 'copper',
  	'11-40': 'brass',
  	'41-70': 'bronze',
  	'71-100': 'steel',
  	'101-110': 'lead',
  	'111-125': 'iron',
  	'126-130': 'pewter',
  };
  gen_data['color'] = {
  	'1': 'red',
  	'2': 'blue',
  	'3': 'yellow',
  	'4': 'green',
  	'5': 'white',
  	'6': 'black',
  	'7': 'purple',
  	'8': 'brown',
  	'9': 'orange',
  	'10': 'indego'
  };
  gen_data['direction'] = {
  	'1-3': 'north',
  	'4-5': 'northeast',
  	'6-8': 'east',
  	'9-10': 'southeast',
  	'11-13': 'south',
  	'14-15': 'southwest',
  	'16-18': 'west',
  	'19-20': 'northwest'
  };
  gen_data['rarity'] = {
  	'1-50': 'common',
  	'51-85': 'uncommon',
  	'86-95': 'rare',
  	'96-99': 'very rare',
  	'100': 'unique'
  };
  gen_data['size_a'] = {
  	'1-5': 'tiny',
  	'6-25': 'small',
  	'26-75': 'average',
  	'76-95': 'large',
  	'96-100': 'huge'
  };
  gen_data['size_b'] = {
  	'1': 'small',
  	'2-3': 'medium',
  	'4': 'large'
  };
  gen_data['human_height'] = {
  	/*Change to inches distribution */
  	'1': '4 foot {inches} inches (Short)',
  	'2-3': '5 foot {inches} inches (Average)',
  	'4': '6 foot {inches} inches (Tall)'
  };
  gen_data['human_weight'] = {
  	'1': 'Skinny ([Dice~7d20] lbs.)',
  	'2-3': 'Average ([Dice~14d20] lbs.)',
  	'4': 'Fat ([Dice~21d20] lbs.)'
  };
  gen_data['human_hair_color'] = {
  	'1-5': '{human_roman_hair_style} brown hair',
  	'6-8': '{human_roman_hair_style} blond hair',
  	'9-10': '{human_roman_hair_style} red hair',
  	'11': '{human_roman_hair_style} white hair',
  	'12': '{human_roman_hair_style} grey hair',
  	'13-15': 'bald',
  	'15-18': 'shaved head'
  };
  gen_data['human_roman_hair_style'] = {
  	'1-2': 'short and straight',
  	'3-4': 'short and curly',
  	'5-7': 'moderate in length and straight',
  	'8-10': 'moderate in length and curly',
  	'11': 'long and straight\, unbound',
  	'12': 'long and straight\, tied in the back',
  	'13': 'long and curly\, unbound',
  	'14': 'long and curly\, tied in the back'
  };
  gen_data['human_eye_color'] = {
  	'1-33': 'Brown',
  	'34-66': 'Blue',
  	'66-99': 'Green',
  	'100': 'One {human_eye_color} and one {human_eye_color}'
  };
  gen_data['human_identifying_marks'] = {
  	'1-9': ' no identifying marks',
  	'10-12': 'eye patch',
  	'13-15': 'scar on {side} cheek',
  	'16-17': 'visible tattoo of a {human_identifying_marks_tattoo} on the {human_identifying_marks_body_part}'
  };
  gen_data['human_identifying_marks_body_part'] = {
  	'1': 'forehead',
  	'2': '{side} cheek',
  	'3': '{side} hand',
  	'4': 'neck'
  };
  gen_data['human_identifying_marks_tattoo'] = {
  	'1': '{common_animal}',
  	'2': '{bird_of_prey}',
  	'3': 'Evil outsider',
  	'4': 'Flower',
  	'5': 'Good outsider',
  	'6': 'Holy symbol',
  	'7': 'Magical rune',
  	'8': '{fantastic_animal}',
  	'9': 'Name',
  	'10': 'Reptile',
  	'11': 'Sea serpent',
  	'12': 'Ship',
  	'13': '{common_animal} skull',
  	'14': 'Starburst design',
  	'15': 'tribal knot',
  	'16': 'Vine',
  	'17': '{weapon}',
  	'18': 'Human Skull',
  	'19': 'Anchor with rope',
  	'20': 'Arcane symbol or shape',
  	'21': 'Banner bearing the colors {color} and {color}',
  	'22': 'Castle tower',
  	'23': 'Celtic knot',
  	'24': 'Crossed {melee_weapon}s',
  	'25': 'Hammer and anvil',
  	'26': '{musical_instruments}',
  	'27': 'Noose',
  	'28': 'Ornate {melee_weapon}',
  	'29': 'Robed figure carrying a {weapon}',
  	'30': 'Rune',
  	'31': 'Sailing ship',
  	'32': 'Shattered {melee_weapon}',
  	'33': 'Shield with a {bird_of_prey} in the middle',
  	'34': 'Ship on water',
  	'35': 'Skull and crossbones',
  	'36': 'Five Pointed Star'
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
