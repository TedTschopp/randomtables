gen_data['warrior_main'] = {
    '1-8': '{human_main}',
    '9': '{dwarf_main}',
    '10': '{gnome_main}',
    '11-12': '{elf_main}'
};


gen_data['human_main'] = {
   '1-3' : '{human_male_main}',
   '4' : '{human_female_main}'
};

gen_data['dwarf_main'] = {
    '1-9' : '{dwarf_male_main}',
    '10' : '{dwarf_female_main}'
};
gen_data['gnome_main'] = {
   '1' : '{gnome_male_main}',
   '2' : '{gnome_female_main}'
};
gen_data['elf_main'] = {
    '1-2': '{elf_male_main}',
    '3': '{elf_female_main}'
};



gen_data['human_male_main'] = [
  'A male human: {human_height} {human_weight} with {human_eye_color} eyes, {human_hair_male} and {human_identifying_marks}\, wearing {armor} with a {animal} on it and wielding {weapon} carrying {trinket} and {trinket} in their pockets.'
];
gen_data['dwarf_male_main'] = [
  'A male dwarf: {dwarf_height} {dwarf_weight} with {dwarf_eye_color} eyes, {dwarf_hair} and {human_identifying_marks}\, wearing {armor} with a {animal} on it and wielding {weapon} carrying {trinket} and {trinket} in their pockets'
];
gen_data['gnome_male_main'] = [
  'A male gnome: {gnome_height} {gnome_weight} with {gnome_eye_color} eyes, {gnome_hair} and {human_identifying_marks}\, wearing {armor} with a {animal} on it and wielding {weapon} carrying {trinket} and {trinket} in their pockets'
];
gen_data['elf_male_main'] = [
  'A male elf: {elf_height} {elf_weight} with {elf_eye_color} eyes, {elf_hair} and {human_identifying_marks}\, wearing {armor} with a {animal} on it and wielding {weapon} carrying {trinket} and {trinket} in their pockets'
];
gen_data['human_female_main'] = [
  'A female human: {human_height} {human_weight} with {human_eye_color} eyes, {human_hair_female} and {human_identifying_marks}\, wearing {armor} with a {animal} on it and wielding {weapon} carrying {trinket} and {trinket} in their pockets'
];
gen_data['dwarf_female_main'] = [
  'A female dwarf: {dwarf_height} {dwarf_weight} with {dwarf_eye_color} eyes, {dwarf_hair} and {human_identifying_marks}\, wearing {armor} with a {animal} on it and wielding {weapon} carrying {trinket} and {trinket} in their pockets'
];
gen_data['gnome_female_main'] = [
  'A female gnome: {gnome_height} {gnome_weight} with {gnome_eye_color} eyes, {gnome_hair} and {human_identifying_marks}\, wearing {armor} with a {animal} on it and wielding {weapon}.  They carry {trinket} and {trinket} in their pockets'
];
gen_data['elf_female_main'] = [
  'A female elf: {elf_height} {elf_weight} with {elf_eye_color} eyes, {elf_hair} and {human_identifying_marks}\, wearing {armor} with a {animal} on it and wielding {weapon}.  They carry {trinket} and {trinket} in their pockets'
];
gen_data['gender'] = [
    'male', 'female'
];
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
    '126-130': 'pewter'
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

// TODO: Fix generic weight and height to be an average of male and female
gen_data['human_height'] = {
    '1-1': '5 feet',
    '2-3': '5 feet 1 inches',
    '4-6': '5 feet 2 inches',
    '7-10': '5 feet 3 inches',
    '11-15': '5 feet 4 inches',
    '16-21': '5 feet 5 inches',
    '22-28': '5 feet 6 inches',
    '29-36': '5 feet 7 inches',
    '37-45': '5 feet 8 inches',
    '46-55': '5 feet 9 inches',
    '56-64': '5 feet 10 inches',
    '65-72': '5 feet 11 inches',
    '73-79': '6 feet',
    '80-85': '6 feet 1 inches',
    '86-90': '6 feet 2 inches',
    '91-94': '6 feet 3 inches',
    '95-97': '6 feet 4 inches',
    '98-99': '6 feet 5 inches',
    '100-100': '6 feet 6 inches'
}
gen_data['human_weight'] = {
    '1-1': '130 lbs',
    '2-3': '135 lbs',
    '4-6': '140 lbs',
    '7-10': '145 lbs',
    '11-15': '150 lbs',
    '16-21': '155 lbs',
    '22-28': '160 lbs',
    '29-36': '165 lbs',
    '37-45': '170 lbs',
    '46-55': '175 lbs',
    '56-64': '180 lbs',
    '65-72': '185 lbs',
    '73-79': '190 lbs',
    '80-85': '195 lbs',
    '86-90': '200 lbs',
    '91-94': '205 lbs',
    '95-97': '210 lbs',
    '98-99': '215 lbs',
    '100-100': '220 lbs'
}
gen_data['human_male_height'] = {
    '1-1': '5 feet',
    '2-3': '5 feet 1 inches',
    '4-6': '5 feet 2 inches',
    '7-10': '5 feet 3 inches',
    '11-15': '5 feet 4 inches',
    '16-21': '5 feet 5 inches',
    '22-28': '5 feet 6 inches',
    '29-36': '5 feet 7 inches',
    '37-45': '5 feet 8 inches',
    '46-55': '5 feet 9 inches',
    '56-64': '5 feet 10 inches',
    '65-72': '5 feet 11 inches',
    '73-79': '6 feet',
    '80-85': '6 feet 1 inches',
    '86-90': '6 feet 2 inches',
    '91-94': '6 feet 3 inches',
    '95-97': '6 feet 4 inches',
    '98-99': '6 feet 5 inches',
    '100-100': '6 feet 6 inches'
}
gen_data['human_male_weight'] = {
    '1-1': '130 lbs',
    '2-3': '135 lbs',
    '4-6': '140 lbs',
    '7-10': '145 lbs',
    '11-15': '150 lbs',
    '16-21': '155 lbs',
    '22-28': '160 lbs',
    '29-36': '165 lbs',
    '37-45': '170 lbs',
    '46-55': '175 lbs',
    '56-64': '180 lbs',
    '65-72': '185 lbs',
    '73-79': '190 lbs',
    '80-85': '195 lbs',
    '86-90': '200 lbs',
    '91-94': '205 lbs',
    '95-97': '210 lbs',
    '98-99': '215 lbs',
    '100-100': '220 lbs'
}
gen_data['human_female_height'] = {
    '1-1': '4 feet 7 inches',
    '2-3': '4 feet 8 inches',
    '4-6': '4 feet 9 inches',
    '7-10': '4 feet 10 inches',
    '11-15': '4 feet 11 inches',
    '16-21': '5 feet ',
    '22-28': '5 feet 1 inches',
    '29-36': '5 feet 2 inches',
    '37-45': '5 feet 3 inches',
    '46-55': '5 feet 4 inches',
    '56-64': '5 feet 5 inches',
    '65-72': '5 feet 6 inches',
    '73-79': '5 feet 7 inches',
    '80-85': '5 feet 8 inches',
    '86-90': '5 feet 9 inches',
    '91-94': '5 feet 10 inches',
    '95-97': '5 feet 11 inches',
    '98-99': '6 feet ',
    '100-100': '6 feet 1 inches'
}
gen_data['human_female_weight'] = {
    '1-1': '95 lbs',
    '2-3': '100 lbs',
    '4-6': '105 lbs',
    '7-10': '110 lbs',
    '11-15': '115 lbs',
    '16-21': '120 lbs',
    '22-28': '125 lbs',
    '29-36': '130 lbs',
    '37-45': '135 lbs',
    '46-55': '140 lbs',
    '56-64': '145 lbs',
    '65-72': '150 lbs',
    '73-79': '155 lbs',
    '80-85': '160 lbs',
    '86-90': '165 lbs',
    '91-94': '170 lbs',
    '95-97': '175 lbs',
    '98-99': '180 lbs',
    '100-100': '185 lbs'
}


gen_data['dwarf_height'] = {
    '1-1': '3 feet 11 inches',
    '2-3': '4 feet ',
    '4-6': '4 feet 1 inches',
    '7-10': '4 feet 2 inches',
    '11-13': '4 feet 3 inches',
    '14-15': '4 feet 4 inches',
    '16-16': '4 feet 5 inches'
}
gen_data['dwarf_weight'] = {
    '1-1': '164 lbs',
    '2-3': '171 lbs',
    '4-6': '178 lbs',
    '7-10': '185 lbs',
    '11-13': '192 lbs',
    '14-15': '199 lbs',
    '16-16': '206 lbs'
}
gen_data['dwarf_male_height'] = {
    '1-1': '3 feet 11 inches',
    '2-3': '4 feet ',
    '4-6': '4 feet 1 inches',
    '7-10': '4 feet 2 inches',
    '11-13': '4 feet 3 inches',
    '14-15': '4 feet 4 inches',
    '16-16': '4 feet 5 inches'
}
gen_data['dwarf_male_weight'] = {
    '1-1': '164 lbs',
    '2-3': '171 lbs',
    '4-6': '178 lbs',
    '7-10': '185 lbs',
    '11-13': '192 lbs',
    '14-15': '199 lbs',
    '16-16': '206 lbs',

}
gen_data['dwarf_female_height'] = {
    '1-1': '3 feet 9 inches',
    '2-3': '3 feet 10 inches',
    '4-6': '3 feet 11 inches',
    '7-10': '4 feet ',
    '11-13': '4 feet 1 inches',
    '14-15': '4 feet 2 inches',
    '16-16': '4 feet 3 inches',

}
gen_data['dwarf_female_weight'] = {
    '1-1': '134 lbs',
    '2-3': '141 lbs',
    '4-6': '148 lbs',
    '7-10': '155 lbs',
    '11-13': '162 lbs',
    '14-15': '169 lbs',
    '16-16': '176 lbs'
}

gen_data['gnome_height'] = {
    '1-1': '3 feet 8 inches',
    '2-3': '3 feet 9 inches',
    '4-6': '3 feet 10 inches',
    '7-10': '3 feet 11 inches',
    '11-13': '4 feet ',
    '14-15': '4 feet 1 inches',
    '16-16': '4 feet 2 inches'
}
gen_data['gnome_weight'] = {
    '1-1': '49 lbs',
    '2-3': '51 lbs',
    '4-6': '53 lbs',
    '7-10': '55 lbs',
    '11-13': '57 lbs',
    '14-15': '59 lbs',
    '16-16': '61 lbs'
}
gen_data['gnome_male_height'] = {
    '1-1': '3 feet 8 inches',
    '2-3': '3 feet 9 inches',
    '4-6': '3 feet 10 inches',
    '7-10': '3 feet 11 inches',
    '11-13': '4 feet ',
    '14-15': '4 feet 1 inches',
    '16-16': '4 feet 2 inches'
}
gen_data['gnome_male_weight'] = {
    '1-1': '49 lbs',
    '2-3': '51 lbs',
    '4-6': '53 lbs',
    '7-10': '55 lbs',
    '11-13': '57 lbs',
    '14-15': '59 lbs',
    '16-16': '61 lbs'
}
gen_data['gnome_female_height'] = {
    '1-1': '3 feet 2 inches',
    '2-3': '3 feet 3 inches',
    '4-6': '3 feet 4 inches',
    '7-10': '3 feet 5 inches',
    '11-13': '3 feet 6 inches',
    '14-15': '3 feet 7 inches',
    '16-16': '3 feet 8 inches'
}
gen_data['gnome_female_weight'] = {
    '1-1': '39 lbs',
    '2-3': '41 lbs',
    '4-6': '43 lbs',
    '7-10': '45 lbs',
    '11-13': '47 lbs',
    '14-15': '49 lbs',
    '16-16': '51 lbs'
}


gen_data['elf_height'] = {
    '1-1': '5 feet 6 inches',
    '2-3': '5 feet 7 inches',
    '4-6': '5 feet 8 inches',
    '7-10': '5 feet 9 inches',
    '11-15': '5 feet 10 inches',
    '16-21': '5 feet 11 inches',
    '22-28': '6 feet ',
    '29-36': '6 feet 1 inches',
    '37-43': '6 feet 2 inches',
    '44-49': '6 feet 3 inches',
    '50-54': '6 feet 4 inches',
    '55-58': '6 feet 5 inches',
    '59-61': '6 feet 6 inches',
    '62-63': '6 feet 7 inches',
    '64-64': '6 feet 8 inches'
}
gen_data['elf_weight'] = {
    '1-1': '106 lbs',
    '2-3': '109 lbs',
    '4-6': '112 lbs',
    '7-10': '115 lbs',
    '11-15': '118 lbs',
    '16-21': '121 lbs',
    '22-28': '124 lbs',
    '29-36': '127 lbs',
    '37-43': '130 lbs',
    '44-49': '133 lbs',
    '50-54': '136 lbs',
    '55-58': '139 lbs',
    '59-61': '142 lbs',
    '62-63': '145 lbs',
    '64-64': '148 lbs'
}
gen_data['elf_male_height'] = {
    '1-1': '5 feet 6 inches',
    '2-3': '5 feet 7 inches',
    '4-6': '5 feet 8 inches',
    '7-10': '5 feet 9 inches',
    '11-15': '5 feet 10 inches',
    '16-21': '5 feet 11 inches',
    '22-28': '6 feet ',
    '29-36': '6 feet 1 inches',
    '37-43': '6 feet 2 inches',
    '44-49': '6 feet 3 inches',
    '50-54': '6 feet 4 inches',
    '55-58': '6 feet 5 inches',
    '59-61': '6 feet 6 inches',
    '62-63': '6 feet 7 inches',
    '64-64': '6 feet 8 inches'
}
gen_data['elf_male_weight'] = {
    '1-1': '106 lbs',
    '2-3': '109 lbs',
    '4-6': '112 lbs',
    '7-10': '115 lbs',
    '11-15': '118 lbs',
    '16-21': '121 lbs',
    '22-28': '124 lbs',
    '29-36': '127 lbs',
    '37-43': '130 lbs',
    '44-49': '133 lbs',
    '50-54': '136 lbs',
    '55-58': '139 lbs',
    '59-61': '142 lbs',
    '62-63': '145 lbs',
    '64-64': '148 lbs'
}
gen_data['elf_female_height'] = {
    '1-1': '5 feet 6 inches',
    '2-3': '5 feet 7 inches',
    '4-6': '5 feet 8 inches',
    '7-10': '5 feet 9 inches',
    '11-15': '5 feet 10 inches',
    '16-21': '5 feet 11 inches',
    '22-28': '6 feet ',
    '29-36': '6 feet 1 inches',
    '37-43': '6 feet 2 inches',
    '44-49': '6 feet 3 inches',
    '50-54': '6 feet 4 inches',
    '55-58': '6 feet 5 inches',
    '59-61': '6 feet 6 inches',
    '62-63': '6 feet 7 inches',
    '64-64': '6 feet 8 inches'
}
gen_data['elf_female_weight'] = {
    '1-1': '96 lbs',
    '2-3': '99 lbs',
    '4-6': '102 lbs',
    '7-10': '105 lbs',
    '11-15': '108 lbs',
    '16-21': '111 lbs',
    '22-28': '114 lbs',
    '29-36': '117 lbs',
    '37-43': '120 lbs',
    '44-49': '123 lbs',
    '50-54': '126 lbs',
    '55-58': '129 lbs',
    '59-61': '132 lbs',
    '62-63': '135 lbs',
    '64-64': '138 lbs'
}

// TODO: Make hair styles based on culture not just on race.  Also age should affect hair.

gen_data['human_hair_color'] = {
    '1-12': 'black',
    '13-20': 'gray',
    '21-28': 'platinum',
    '29-36': 'white',
    '37-44': 'dark blonde',
    '45-52': 'blonde',
    '53-60': 'bleach blonde',
    '61-68': 'dark red',
    '69-76': 'red',
    '77-84': 'light red',
    '85-92': 'brunette',
    '93-00': 'auburn'
}
gen_data['elf_hair_color'] = {
    '1-12': 'black',
    '13-20': 'gray',
    '21-28': 'platinum',
    '29-36': 'white',
    '37-44': 'dark blonde',
    '45-52': 'blonde',
    '53-60': 'bleach blonde',
    '61-68': 'dark red',
    '69-76': 'red',
    '77-84': 'light red',
    '85-92': 'brunette',
    '93-00': 'auburn'
}

gen_data['dwarf_hair_color'] = {
    '1-7': 'black',
    '8-10': 'gray',
    '11-14': 'white',
    '15-16': 'dark red',
    '16-17': 'red',
    '18-19': 'light red',
    '19-22': 'brunette',
    '23-26': 'auburn'
}
gen_data['gnome_hair_color'] = {
    '1-7': 'black',
    '8-10': 'gray',
    '11-14': 'white',
    '15-16': 'dark red',
    '16-17': 'red',
    '18-19': 'light red',
    '19-22': 'brunette',
    '23-26': 'auburn'
}
gen_data['human_eye_color'] = {
    '1-17': 'amber',
    '17-36': 'brown',
    '37-52': 'hazel',
    '53-68': 'green',
    '69-84': 'blue',
    '85-00': 'gray'
}
gen_data['elf_eye_color'] = {
    '1-17': 'amber',
    '17-36': 'brown',
    '37-52': 'hazel',
    '53-68': 'green',
    '69-84': 'blue',
    '85-00': 'gray'
}
gen_data['dwarf_eye_color'] = {
    '1-17': 'amber',
    '17-36': 'Brown',
    '37-52': 'hazel',
    '53-68': 'green',
    '69-84': 'black',
    '85-00': 'gray'
}
gen_data['gnome_eye_color'] = {
    '1-17': 'amber',
    '17-36': 'brown',
    '37-52': 'hazel',
    '53-68': 'green',
    '69-84': 'black',
    '85-00': 'gray'
}

gen_data['human_skin'] = {
    '1-1': '{pale_skin}',
    '2-2': '{tan_skin}',
    '3-3': '{olive_skin}',
    '4-4': '{dark_skin}'
}
gen_data['elf_skin'] = {
    '1-1': '{pale_skin}',
    '2-2': '{tan_skin}'
}
gen_data['dwarf_skin'] = {
    '1-1': '{olive_skin}',
    '2-2': '{dark_skin}'
}
gen_data['gnome_skin'] = {
    '1-1': '{pale_skin}',
    '2-2': '{tan_skin}'
}
gen_data['pale_skin'] = {
    '1-25': 'pale',
    '26-50': 'fair',
    '51-75': 'light',
    '76-00': 'light tan'
}
gen_data['tan_skin'] = {
    '1-25': 'light',
    '26-50': 'light tan',
    '51-75': 'tan',
    '76-00': 'dark tan'
}
gen_data['olive_skin'] = {
    '1-25': 'light',
    '26-50': 'light tan',
    '51-75': 'tan',
    '76-00': 'dark tan'
}
gen_data['brown_skin'] = {
    '1-25': 'brown',
    '26-50': 'dark brown',
    '51-75': 'very dark brown',
    '76-00': 'black'
}



gen_data['human_hair'] = {
    '1': '{human_hair_male}',
    '2': '{human_hair_female}',

};
gen_data['human_hair_male'] = {
    '1-3': '{hair_type_modifier} {hair_type} {hair_length} length {human_hair_color} hair',
    '4-8': '{hair_type_modifier} {hair_type} {human_hair_color} hair that has been {hair_cut_length} and is now {hair_male_balding}',
    '9-10': '{hair_type_modifier} {hair_type} {human_hair_color} hair that has been {hair_cut_length}'
};
gen_data['human_hair_female'] = {
    '1-3': '{hair_type_modifier} {hair_type} {hair_length} length {human_hair_color} hair',
    '4-8': '{hair_type_modifier} {hair_type} {human_hair_color} hair that has been {hair_cut_length} and is now {hair_male_balding}',
    '9-10': '{hair_type_modifier} {hair_type} {human_hair_color} hair that has been {hair_cut_length}'
};
gen_data['dwarf_hair'] = {
    '1-5': '{dwarf_hair_color} hair {human_roman_hair_style}',
    '6': 'bald',
    '7-10': 'shaved head'
};
gen_data['gnome_hair'] = {
    '1-5': '{gnome_hair_color} hair {human_roman_hair_style}',
    '6-8': 'bald'
};
gen_data['elf_hair'] = {
    '1-5': '{elf_hair_color} hair {human_roman_hair_style}',
    '6-8': 'bald',
    '9-12': 'shaved head'
};


//Hair Length
gen_data['hair_length'] = {
    '1-20': 'neck',
    '21-40': 'shoulder',
    '41-60': 'arms',
    '61-80': 'chest',
    '81-90': 'mid-back',
    '91-100': 'waist',
    '101-105': 'hip',
    '106-110': 'butt',
    '111-113': 'knee',
    '114-117': 'calf',
    '118-118': 'ankle',
    '120': 'floor'
};
gen_data['hair_type'] = {
    '1': 'straight',
    '2': 'wavy',
    '3': 'curley',
    '4': 'kinky'
};
gen_data['hair_type_modifier'] = {
    '1': 'slightly',
    '2': '',
    '3': 'very'
};
gen_data['hair_cut_length'] = {
    '1': 'cut very short',
    '2': 'cut short',
    '3': 'cut to a couple inchs',
    '4': 'cut to above the neck'
}
gen_data['hair_male_balding'] = {
//    '': '',
    '1-5': 'thinning',
    '6-9': 'a slight recedding hairline with a thin spot on top',
    '10-12': 'recedding with a bald spot on top',
    '13-14': 'just a tuft of hair on top',
    '15': 'almost completly bald with hair above their ears',
    '16': 'a bald head with hair above their ears'
}
gen_data['hair_female_balding'] = {
//    '': '',
    '1-8': 'thinning along the part',
    '9-10': 'bald spots along the part'
}

//Hair Greying
//Hair Styles

// TODO: Make this respect race and gender and culture.



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
gen_data['human_identifying_marks'] = {
    '1-9': 'no identifying marks',
    '10-12': 'an eye patch',
    '13-15': 'a scar on {side} cheek',
    '16-17': 'a visible tattoo of a {human_identifying_marks_tattoo} on the {human_identifying_marks_body_part}'
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

gen_data['biped_race'] = [
    '{goblinoid_race}',
    '{humanoid_race}'
]

gen_data['goblinoid_race'] = [
  'bugbear',
  'gnoll',
  'goblin',
  'hobgoblin',
  'kobold',
  'orc'
]
gen_data['humanoid_race'] = [
  'dwarf', 'elf', 'human'
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
