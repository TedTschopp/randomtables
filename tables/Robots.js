gen_data['NPC_Robot'] = {
	'1' : 'This robot moves using {NPC_Robot_Locomotion}.  The robot has {NPC_Robot_Armor} and is powered by {NPC_Robot_Power_Source}.  The robot is equpit with {NPC_Robot_Arms} wielding {NPC_Robot_Weapon}.  The robot has the following class sensors: H (human audio and visual) {NPC_Robot_Sensors}.  The enhancement package includes: {NPC_Cyborg_Enhancements}.  The robot is also equpit with: {NPC_Cyborg_Misc}.
}


gen_data['PC_Cyborg_Locomotion_Condition'] = {
    '1-35': 'Both biological legs are intact',
    '36-50': 'Character has lost one leg, and it has been replaced with a bionic leg',
    '51-100': 'Character has lost both legs and they have been replaced with {PC_Robot_Locomotion}'
}
gen_data['PC_Robot_Locomotion'] = {
    '1-15': 'hoverfans',
    '16-45': 'bionic legs',
    '56-65': 'hover pods',
    '66-85': 'treads',
    '86-100': 'wheels'
}
gen_data['NPC_Robot_Locomotion'] = {
    '1-10': 'hoverfans',
    '11-35': 'bionic legs',
    '36-45': 'hover pods',
    '46-55': 'rotors',
    '56-75': 'treads',
    '76-85': 'water locomotion',
    '86-100': 'wheels'
}
gen_data['PC_Cyborg_Armor_Condition'] = {
    '1-30': 'Character has no armor additions',
    '36-70': 'Character is covered with bionic armor at base AC 7(-35)',
    '71-100': 'Character is covered with bionic armor at base AC 7(-35) with {PC_Robot_Armor}'
}
gen_data['PC_Robot_Armor'] = {
    '1': 'Camouflage Armor',
    '2': 'Energy Dampening Field',
    '3': 'Energy Field Generator',
    '4': 'Neutralizing Pigment Armor',
    '5': 'Sealed Armor',
    '6': 'Zilch Armor'
}
gen_data['NPC_Robot_Armor'] = {
	'01-25': 'no additional armor',
	'26-40': '+1 AC armor'
	'41-50': '+2 AC armor' 
    '51-55': 'Camouflage Armor',
    '56-60': 'an energy dampening field',
    '61-70': 'an energy field generator',
    '71-75': 'Neutralizing Pigment Armor',
    '76-95': 'Sealed Armor',
    '96-199': 'Zilch Armor'
}
gen_data['PC_Robot_Power_Source'] = {
    '1-15': 'Atomic Energy Cell',
    '16-30': 'Chemical Energy Cell',
    '31-45': 'Hydrogen Energy Cell',
    '46-53': 'Minipower Plant',
    '54-63': 'Nuclear Power Plant',
    '64-80': 'Solar Energy Cell',
    '81-88': 'Solar Collectors',
    '89-93': 'Universal Coupler',
    '94-98': '{PC_Robot_Power_Source_No_Extras} and {PC_Robot_Power_Source_No_Extras}',
    '99-100': '{PC_Robot_Power_Source_No_Extras}, {PC_Robot_Power_Source_No_Extras}, and {PC_Robot_Power_Source_No_Extras}'
}
gen_data['PC_Robot_Power_Source_No_Extras'] = {
    '1-15': 'Atomic Energy Cell',
    '16-30': 'Chemical Energy Cell',
    '31-45': 'Hydrogen Energy Cell',
    '46-53': 'Minipower Plant',
    '54-63': 'Nuclear Power Plant',
    '64-80': 'Solar Energy Cell',
    '81-88': 'Solar Collectors',
    '89-93': 'Universal Coupler'
}
gen_data['NPC_Robot_Power_Source'] = {
    '1-7': 'Atomic Energy Cell',
    '8-22': 'Chemical Energy Cell',
    '23-34': 'Hydrogen Energy Cell',
    '35-37': 'Minipower Plant',
    '38-42': 'Nuclear Power Plant',
    '43-55': 'Solar Energy Cell',
    '56-70': 'Solar Collectors',
    '71-75': 'Universal Coupler',
    '76-90': '{NPC_Robot_Power_Source_No_Extras} and {NPC_Robot_Power_Source_No_Extras}',
    '91-100': '{NPC_Robot_Power_Source_No_Extras}, {NPC_Robot_Power_Source_No_Extras}, and {NPC_Robot_Power_Source_No_Extras}'
}
gen_data['NPC_Robot_Power_Source_No_Extras'] = {
    '1-7': 'Atomic Energy Cell',
    '8-22': 'Chemical Energy Cell',
    '23-34': 'Hydrogen Energy Cell',
    '35-37': 'Minipower Plant',
    '38-42': 'Nuclear Power Plant',
    '43-55': 'Solar Energy Cell',
    '56-70': 'Solar Collectors',
    '71-75': 'Universal Coupler'
 }
gen_data['PC_Cyborg_Limbs'] = {
    '1-35': 'Both biological arms are intact',
    '36-50': '{PC_Cyborg_Weapons_One_Weapon}',
    '51-100': '{PC_Cyborg_Weapons_Two_Weapons}'
}
gen_data['PC_Robot_Arms'] = {
    '1-50': 'Humanoid arms',
    '51-60': 'Specialized inside the arms',
    '61-90': 'Tentacles',
    '91-100': 'Specialized Tools instead of arms'
}
gen_data['NPC_Robot_Arms'] = {
    '1-30': 'Humanoid arms',
    '31-60': 'Specialized inside the arms',
    '61-90': 'Tentacles',
    '91-100': 'Specialized Tools instead of arms'
}
gen_data['PC_Cyborg_Sensors'] = {
    '1-35': 'No sensory damage and no additional sensors',
    '36-65': 'Character has {PC_Robot_Sensors}',
    '66-90': 'Character has {PC_Robot_Sensors} and {PC_Robot_Sensors}',
    '66-90': 'Character has lost most of their head and has {PC_Robot_Sensors}, {PC_Robot_Sensors}, {PC_Robot_Sensors}, and {PC_Robot_Sensors}'
}
gen_data['PC_Robot_Sensors'] = {
    '1-5': 'A (audio)',
    '6-15': 'C (Celluar communications / radio)',
    '16-20': 'EM (electro-magnetic)',
    '21-35': 'F (feeling)',
    '36-55': 'I (infrared)',
    '56-60': 'M (magnetic)',
    '61-80': 'R (radar / sonar)',
    '81-85': 'S (microscope)',
    '86-90': 'T (telescopic)',
    '91-95': 'U (ultraviolet)',
    '96-100': 'v (vibrational)'
}

// TODO: Add Human Sensors here
gen_data['NPC_Robot_Sensors'] = {
    '1-8': 'A (audio)',
    '6-16': 'B (broadcast)',
	'17-30' : 'C (Celluar communications / radio)',
    '31-38': 'EM (electro-magnetic)',
    '39-46': 'F (feeling)',
    '47-62': 'I (infrared)',
    '63-66': 'M (magnetic)',
    '67-80': 'R (radar / sonar)',
    '81-85': 'S (microscope)',
    '86-90': 'T (telescopic)',
    '91-95': 'U (ultraviolet)',
    '96-100': 'v (vibrational)'
}

gen_data['PC_Cyborg_Weapons_One_Weapon'] = {
    '1-60': 'no bionic weapon.',
    '61-100': 'Character has lost one arm, and it has been replaced with a bionic arm with a {PC_Robot_Weapon}',

}
gen_data['PC_Cyborg_Weapons_Two_Weapons'] = {
    '1-60': 'no bionic weapon.',
    '61-100': 'Character has lost both arms and they have been replaced with {PC_Robot_Arms}.  One with a {PC_Robot_Weapon} embedded in it, and the other with a {PC_Robot_Weapon} embedded in it.',
}
gen_data['PC_Robot_Weapon'] = {
	'01-10'	: 'Blaster I',
	'11-15'	: 'Blaster II',
	'16-20'	: 'Defoliator',
	'21-25'	: 'Electric Field',
	'26-35'	: 'Gas Emitter',
	'36-40'	: 'Heat Field',
	'41-50'	: 'Laser I',
	'51-55'	: 'Laser II',
	'56-60'	: 'Light Emitter',
	'61-68'	: 'Needler',
	'69-74'	: 'Paralysis Rod',
	'75-82'	: 'Slicer',
	'83-88'	: 'Slug Thrower',
	'89-91'	: 'Sonic Emitter',
	'92-96'	: 'Stun Ray I',
	'97-98'	: 'Stun Ray II',
	'99-100': '{PC_Robot_Weapon_Extra} and {PC_Robot_Weapon_Extra}'
}
gen_data['PC_Robot_Weapon_Extra'] = {
	'01-10'	: 'Blaster I',
	'11-15'	: 'Blaster II',
	'16-20'	: 'Defoliator',
	'21-25'	: 'Electric Field',
	'26-35'	: 'Gas Emitter',
	'36-40'	: 'Heat Field',
	'41-50'	: 'Laser I',
	'51-55'	: 'Laser II',
	'56-60'	: 'Light Emitter',
	'61-68'	: 'Needler',
	'69-74'	: 'Paralysis Rod',
	'75-82'	: 'Slicer',
	'83-88'	: 'Slug Thrower',
	'89-91'	: 'Sonic Emitter',
	'92-96'	: 'Stun Ray I',
	'97-98'	: 'Stun Ray II',
	'99-100': '{PC_Robot_Weapon} and {PC_Robot_Weapon}'
}
gen_data['NPC_Robot_Weapon'] = {
	'01-04'	: 'Blaster I',
	'05-08'	: 'Blaster II',
	'09-12'	: 'Defoliator',
	'13-16'	: 'Electric Field',
	'17-20' : 'Gamma Emitter',
	'21-24'	: 'Gas Emitter',
	'15-28' : 'Grenade Launcher',
	'29-32'	: 'Heat Field',
	'33-36'	: 'Laser I',
	'37-40'	: 'Laser II',
	'41-44'	: 'Light Emitter',
	'45-48' : 'Metal Spikes',
	'49-52' : 'Micro-Missile',
	'53-56' : 'Mine',
	'57-60' : 'Mini-Missile',
	'61-64'	: 'Needler',
	'65-68'	: 'Paralysis Rod',
	'69-72'	: 'Slicer',
	'73-76'	: 'Slug Thrower',
	'77-80'	: 'Sonic Emitter',
	'80-85'	: 'Stun Ray I',
	'86-88'	: 'Stun Ray II',
	'89-95': '{NPC_Robot_Weapon_Extra} and {NPC_Robot_Weapon_Extra}',
	'95-100': '{NPC_Robot_Weapon_Extra}, {NPC_Robot_Weapon_Extra}, and {NPC_Robot_Weapon_Extra}'
}
gen_data['NPC_Robot_Weapon_Extra'] = {
	'01-04'	: 'Blaster I',
	'05-08'	: 'Blaster II',
	'09-12'	: 'Defoliator',
	'13-16'	: 'Electric Field',
	'17-20' : 'Gamma Emitter',
	'21-24'	: 'Gas Emitter',
	'15-28' : 'Grenade Launcher',
	'29-32'	: 'Heat Field',
	'33-36'	: 'Laser I',
	'37-40'	: 'Laser II',
	'41-44'	: 'Light Emitter',
	'45-48' : 'Metal Spikes',
	'49-52' : 'Micro-Missile',
	'53-56' : 'Mine',
	'57-60' : 'Mini-Missile',
	'61-64'	: 'Needler',
	'65-68'	: 'Paralysis Rod',
	'69-72'	: 'Slicer',
	'73-76'	: 'Slug Thrower',
	'77-80'	: 'Sonic Emitter',
	'80-85'	: 'Stun Ray I',
	'86-88'	: 'Stun Ray II'
}
gen_data['PC_Cyborg_Enhancements'] = {
    '1-60': 'No additional enhancements',
    '61-90': 'Character has {PC_Robot_Enhancements}',
    '91-100': 'Character has {PC_Robot_Enhancements} and {PC_Robot_Enhancements}',
 }
gen_data['PC_Robot_Enhancements'] = {
    '1-10': 'Enhanced Dexterity',
    '11-20': 'Enhanced Endurance',
    '21-30': 'Enhanced Mental Strenth',
    '31-40': 'Enhanced multiple actions',
    '41-50': 'Enhanced Programming Rating',
    '51-60': 'Enhanced Physical Speed',
    '61-70': 'Enhanced Speed',
    '71-80': 'Expanded Memory Bank',
    '81-100': 'Bionic Organ'
}
gen_data['NPC_Cyborg_Enhancements'] = {
    '1-50': 'No additional enhancements',
    '51-95': '{NPC_Robot_Enhancements}',
    '96-100': '{NPC_Robot_Enhancements} and {NPC_Robot_Enhancements}',
 }
gen_data['NPC_Robot_Enhancements'] = {
    '1-10': 'Enhanced Dexterity',
    '11-20': 'Enhanced Endurance',
    '21-28': 'Enhanced Mental Strenth',
    '29-35': 'Enhanced multiple actions',
    '36-45': 'Enhanced Programming Rating',
    '46-70': 'Enhanced Physical Speed',
    '71-80': 'Enhanced Speed',
    '81-100': 'Expanded Memory Bank'
}
// I AM HERE
gen_data['PC_Cyborg_Misc'] = {
    '1-60': 'No additional enhancements',
    '61-90': 'Character has {PC_Robot_Misc}',
    '91-100': 'Character has {PC_Robot_Misc} and {PC_Robot_Misc}',
 }
gen_data['PC_Robot_Misc'] = {
    '01-02' : 'Base Spray',
    '03-04' : 'Communications Sender',
    '05-15' : 'Communicator',
    '16-20' : 'Fire Extinguisher',
    '21-25' : 'Fire Hose',
    '26-30' : 'Flame Thrower',
    '31-35' : 'Flare Gun',
    '36-45' : 'Liquid Sprayer',
    '46-60' : 'Misc. Equipment',
    '61-67' : 'Portent',
    '68-77' : 'Repair Program',
    '78-92' : 'Tools',
    '93' : 'Tractor / Presser Beam',
    '94-97' : '{PC_Robot_Misc_Extra} and {PC_Robot_Misc_Extra}',
    '98-100' : '{PC_Robot_Misc_Extra}, {PC_Robot_Misc_Extra}, and {PC_Robot_Misc_Extra}'
}
gen_data['PC_Robot_Misc_Extra'] = {
    '01-02' : 'Base Spray',
    '03-04' : 'Communications Sender',
    '05-15' : 'Communicator',
    '16-20' : 'Fire Extinguisher',
    '21-25' : 'Fire Hose',
    '26-30' : 'Flame Thrower',
    '31-35' : 'Flare Gun',
    '36-45' : 'Liquid Sprayer',
    '46-60' : 'Misc. Equipment',
    '61-67' : 'Portent',
    '68-77' : 'Repair Program',
    '78-92' : 'Tools',
    '93' : 'Tractor / Presser Beam'
}
gen_data['NPC_Cyborg_Misc'] = {
    '01-02' : 'Base Spray',
    '3' : 'Code ID',
    '4-5' : 'Communications Sender',
    '6-8' : 'Communicator',
    '9-12' : 'Fire Extinguisher',
    '13-14' : 'Fire Hose',
    '15-21' : 'Flame Thrower',
    '22-25' : 'Flare Gun',
    '26-30' : 'Liquid Sprayer',
    '31-42' : 'Misc. Equipment',
    '43-45' : 'Portent',
    '46-50' : 'Repair Program',
    '51-52' : 'Robot Command',
    '53-54' : 'Robot Summoning',
    '55' : 'Robot Summoning / Command',
    '56-70' : 'Tools',
    '71-80' : 'Tractor / Presser Beam',
    '81-90' : '{NPC_Cyborg_Misc_Extra} and {NPC_Cyborg_Misc_Extra}',
    '91-96' : '{NPC_Cyborg_Misc_Extra}, {NPC_Cyborg_Misc_Extra}, and {NPC_Cyborg_Misc_Extra}'
    '97-100' : '{NPC_Cyborg_Misc_Extra} {NPC_Cyborg_Misc_Extra}, {NPC_Cyborg_Misc_Extra}, and {NPC_Cyborg_Misc_Extra}'
}
gen_data['NPC_Cyborg_Misc_Extra'] = {
    '01-02' : 'Base Spray',
    '3' : 'Code ID',
    '4-5' : 'Communications Sender',
    '6-8' : 'Communicator',
    '9-12' : 'Fire Extinguisher',
    '13-14' : 'Fire Hose',
    '15-21' : 'Flame Thrower',
    '22-25' : 'Flare Gun',
    '26-30' : 'Liquid Sprayer',
    '31-42' : 'Misc. Equipment',
    '43-45' : 'Portent',
    '46-50' : 'Repair Program',
    '51-52' : 'Robot Command',
    '53-54' : 'Robot Summoning',
    '55' : 'Robot Summoning / Command',
    '56-70' : 'Tools',
    '71-80' : 'Tractor / Presser Beam',
    '81-90' : '3 additional items',
    '91-96' : '4 additional items'
    '97-100' : '4 additional items'
}
