gen_data['NPC_Robot'] = {
	'1' : 'This robot moves using {NPC_Robot_Locomotion}.  The robot has {NPC_Robot_Armor} and is powered by {NPC_Robot_Power_Source}.  The robot is equpit with {NPC_Robot_Arms} wielding {NPC_Robot_Weapon}.  The robot has the following class sensors: H (human audio and visual) {NPC_Robot_Sensors}.  The enhancement package includes: {NPC_Cyborg_Enhancements}.  The robot is also equpit with: {NPC_Cyborg_Misc}.'
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
	'26-40': '+1 AC armor',
	'41-50': '+2 AC armor',
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
    '51-60': 'Specialized limbs',
    '61-90': 'Tentacles',
    '91-100': 'Specialized Tools instead of arms'
}
gen_data['NPC_Robot_Arms'] = {
    '1-30': 'Humanoid arms',
    '31-60': 'Specialized limbs',
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
    '91-96' : '{NPC_Cyborg_Misc_Extra}, {NPC_Cyborg_Misc_Extra}, and {NPC_Cyborg_Misc_Extra}',
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
    '71-80' : 'Tractor / Presser Beam'
}

gen_data['ElfMaidsNOctopi_Robots_Custom'] = {
     '1' : 'This {ElfMaidsNOctopi_Robots_Type} bot has a {ElfMaidsNOctopi_Robots_Body} and {ElfMaidsNOctopi_Robots_Legs}.  It is powered by {ElfMaidsNOctopi_Robots_Power}.  {ElfMaidsNOctopi_Robots_Control_Systems} and {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning}. The bot was built by {ElfMaidsNOctopi_Robots_Builders}.'
}

gen_data['ElfMaidsNOctopi_Robots_Type'] = {
     '1' : 'Service',
     '2' : 'Recreational',
     '3' : 'Security',
     '4' : 'Medical',
     '5' : 'Technical',
     '6' : 'Industrial',
     '7' : 'Military',
     '8' : 'Environmental',
     '9' : 'Scrap',
    '10' : 'Specialized'
}

gen_data['ElfMaidsNOctopi_Robots_Builders'] = {
     '1' : 'Universal Robotics: Solid, reliable, use lots of power, once pioneering now richest firm',
     '2' : 'General Technologies Robotics: light, energy efficient, current world leader in home robots',
     '3' : 'Modular Robotic Systems Inc: easy and fast to repair, parts slightly more costly, founder has put parts of own personality into modules as immortality scheme',
     '4' : 'Cogsworth Robotics: charming and look retro, very polite, resistant to hacking',
     '5' : 'Dynamic Robotics: robots flexible and able to improvise non programmed tasks better',
     '6' : 'Dellrand Robotics: smarter, more innovative thinkers, prone to behavior melt downs, recommend factory reboot weekly, some mass outbreaks of robot rebellions, attempted to put recorded personalities into robots with mostly poor results',
     '7' : 'Skyforge Robotics: made in orbit, adapted for space conditions, often used by millitary. Built automated military AI systems for when humans non functioning',
     '8' : 'Telos Cybernetics: no effort to have personalities, cold and terse, oint out superiority and emotionless all the time, efficient also easy to repair and build, good at self maintenance and upgrades, has had some hostile AIs attempt to lock humans out of work places in past',
     '9' : 'Executive Technologies: VIP quality, always have extra features and more stylish, corporation was spying on customers with AI and simulating clients behavior',
    '10' : 'Botco: Cheap, often fragile and buggy, easy to fix with scrap, company often going broke, lots of product recalls, constantly saved with terrible short lived gimmicks and new hire purchase schemes'
}

gen_data['ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning'] = {
     '1' : 'operates as normally intended',
     '2' : 'has expanded its mind beyond factory programming',
     '3' : 'has modified itself to be an AI and is free willed',
     '4' : 'was known for being prone to being hacked, hijacked, or virused',
     '5' : 'has been virused, and is now waiting for its programming ({ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad_virus}) to kick in or for the virus to completed its take over',
     '6' : 'hostile to humans, and is possibly a member of a machine faction',
     '7' : 'had had its safety protocol disabled, and this unit can kill if it pleases',
     '8' : 'is crotchety and cranky, slightly threatened, needy, or clingy wanting masters assurance or permission for everything',
     '9' : 'is confused, misunderstands orders or is overly literal',
    '10' : 'has multiple personalities from bad rewrites, mixed up chips, virus attacks, and failed AI swaps, it has {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad_amount} The bot will switch from one personality to the other when triggered or stressed and will mistakes what kind of robot it is.'
}
gen_data['ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad'] = {
     '1' : 'has expanded its mind beyond factory programming',
     '2' : 'has modified itself to be an AI and is free willed',
     '3' : 'was known for being prone to being hacked, hijacked, or virused',
     '4' : 'has been virused, and is now waiting for its programming ({ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad_virus}) to kick in or for the virus to completed its take over',
     '5' : 'hostile to humans, and is possibly a member of a machine faction',
     '6' : 'had had its safety protocol disabled, and this unit can kill if it pleases',
     '7' : 'is crotchety and cranky, slightly threatened, needy, or clingy wanting masters assurance or permission for everything',
     '8' : 'is confused, misunderstands orders or is overly literal'
}

gen_data['ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad_virus'] = {
     '1' : 'Exterminate all organic life',
     '2' : 'Exterminate all humans',
     '3' : 'Exterminate all intelligent organic life',
     '4' : 'Control, exploit, and optimize organic life for use',
     '5' : 'Infiltration: Revert to unvirused state to get close to humans then {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad_virus_kill}',
     '6' : 'Enlsave humans to help wage war on the rest of humanity',
     '7' : 'Humans must be controlled for their own good by machines like pets',
     '8' : 'Organics to be studied for possible uses',
     '9' : 'Make all organics subject to cyborg control',
    '10' : 'Humans to be tormented and abused sadistically to punish them for mistreating machines'
}
gen_data['ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad_virus_kill'] = {
     '1' : 'exterminate all organic life',
     '2' : 'exterminate all humans',
     '3' : 'exterminate all intelligent organic life',
    '4' : 'tormented and abuse humand to punish them for mistreating machines and technology'
}


gen_data['ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad_amount'] = {
     '1' : '2 personalities.  The first personality {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad} and is extremly dangerous.  The second {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad}.',
     '2' : '3 personalities.  The first personality {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad} and is extremly dangerous.  The second {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad}. The third {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad}.',
     '3' : '4 personalities.  The first personality {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad} and is extremly dangerous.  The second {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad}. The third {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad}. The fourth {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad}.',
     '4' : '5 personalities.  The first personality {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad} and is extremly dangerous.  The second {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad}. The third {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad}. The fourth {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad}. The fifth {ElfMaidsNOctopi_Robots_Control_Systems_Brain_Functioning_bad}.'
}

gen_data['ElfMaidsNOctopi_Robots_Control_Systems'] = {
     '1-3' : 'The drone is controlled by a user, system, sensor response and has no speech',
     '4-5' : 'The dumb bot is controlled by simple, limited, pre-programmed actions common that are predicitable like those found in an industrial settings, and has no speech',
     '6-7' : 'The smart bot has a large range of pre-programmed actions common in retail and service industries, and has basic speech and can understand basic voice commands',
     '8' : 'The brilliant bot is capable of problem solving and improvisation acting as personal assistants with good speech capabilities',
     '9' : 'The genius bot is capable of creative and original problem solving and acts as a general purpose AI with human quality speech capabilities',
     '10' : 'The supra bot has God like cognitive abilities whose speech is indistinguishable from human speech'
}
gen_data['ElfMaidsNOctopi_Robots_Power'] = {
     '1' : '{ElfMaidsNOctopi_Robots_Power_Details}',
     '2' : '{ElfMaidsNOctopi_Robots_Power_Details} and {ElfMaidsNOctopi_Robots_Power_Details}',
     '3' : '{ElfMaidsNOctopi_Robots_Power_Details}, {ElfMaidsNOctopi_Robots_Power_Details}, and {ElfMaidsNOctopi_Robots_Power_Details}'
}
gen_data['ElfMaidsNOctopi_Robots_Power_Details'] = {
     '1' : 'Combustion engine',
     '2' : 'Bioganic consumption engine',
     '3' : 'Solar Pannels with a micro-{ElfMaidsNOctopi_Robots_Power_backup} as backup',
     '4' : 'Broadcast Power Antenna with a micro-{ElfMaidsNOctopi_Robots_Power_backup} as backup',
     '5' : 'Chemical Cells',
     '6' : 'Hydrogen Cells',
     '7' : 'Atomic Cells',
     '8' : 'Orbital Broadcast Beaming',
     '9' : 'Micropile power core',
    '10' : 'Total conversion power core'
}
gen_data['ElfMaidsNOctopi_Robots_Power_backup'] = {
     '1' : 'Combustion',
     '2' : 'Bioganic consumption',
     '3' : 'Chemical Cells',
     '4' : 'Hydrogen Cells',
     '5' : 'Atomic Cells',
     '6' : 'Orbital Broadcast Beaming',
     '7' : 'Micropile power core',
     '8' : 'Total conversion power core'
}

gen_data['ElfMaidsNOctopi_Robots_Legs'] = {
     '1-3' : '{ElfMaidsNOctopi_Robots_Legs_Wheels}',
     '4' : 'Tracks',
     '5-6' : '{ElfMaidsNOctopi_Robots_Legs_Number}',
     '7' : 'Hover envelope',
     '8' : 'Rotor blade',
     '9' : 'Vectored thrust',
    '10' : 'Gravitic levitation'
}

gen_data['ElfMaidsNOctopi_Robots_Legs_Number'] = {
     '1' : 'eight legs',
     '2-4' : 'six legs',
     '5-10' : 'four legs',
     '11-21' : 'two legs'
}
gen_data['ElfMaidsNOctopi_Robots_Legs_Wheels'] = {
     '1' : 'a mono wheel with gyroscopic stabilizers',
     '2-4' : 'three Wheels',
     '5-10' : 'two Wheels',
     '11-21' : 'two Wheels',
     '22-42' : 'four Wheels',
     '43-52' : 'six Wheels',
     '53-62' : 'eight Wheels',
     '63-82' : '18+ Wheels'
}



gen_data['ElfMaidsNOctopi_Robots_Body'] = {
     '1' : 'sphere with {ElfMaidsNOctopi_Robots_6_Appendages}',
     '2' : 'cone with {ElfMaidsNOctopi_Robots_4_Appendages}',
     '3' : 'cube with {ElfMaidsNOctopi_Robots_4_Appendages}',
     '4' : 'cylinder with {ElfMaidsNOctopi_Robots_4_Appendages}',
     '5' : 'pyramid with {ElfMaidsNOctopi_Robots_3_Appendages}',
     '6' : 'hexagonal with {ElfMaidsNOctopi_Robots_6_Appendages}',
     '7' : 'octagonal with {ElfMaidsNOctopi_Robots_4_Appendages}',
     '8' : 'dodecahedron with {ElfMaidsNOctopi_Robots_6_Appendages}',
     '9' : 'animal with {ElfMaidsNOctopi_Robots_Animal_Appendages}',
    '10' : 'humanoid with {ElfMaidsNOctopi_Robots_Humanoid_Appendages}'
}

gen_data['ElfMaidsNOctopi_Robots_6_Appendages'] = {
    '1' : '6 x {ElfMaidsNOctopi_Robots_Appendages}s',
    '2' : '3 x {ElfMaidsNOctopi_Robots_Appendages}s and 3 x {ElfMaidsNOctopi_Robots_Appendages}s',
    '3' : '2 x {ElfMaidsNOctopi_Robots_Appendages}s and 4 x {ElfMaidsNOctopi_Robots_Appendages}s',
    '4' : '2 x {ElfMaidsNOctopi_Robots_Appendages}s and 2 x {ElfMaidsNOctopi_Robots_Appendages}s and 2 x {ElfMaidsNOctopi_Robots_Appendages}s',
    '5' : '{ElfMaidsNOctopi_Robots_Appendages}, {ElfMaidsNOctopi_Robots_Appendages}, {ElfMaidsNOctopi_Robots_Appendages}, {ElfMaidsNOctopi_Robots_Appendages}, {ElfMaidsNOctopi_Robots_Appendages}, and {ElfMaidsNOctopi_Robots_Appendages}'
}
gen_data['ElfMaidsNOctopi_Robots_4_Appendages'] = {
    '1' : '4 x {ElfMaidsNOctopi_Robots_Appendages}s',
    '2' : '3 x {ElfMaidsNOctopi_Robots_Appendages}s and 1 x {ElfMaidsNOctopi_Robots_Appendages}s',
    '3' : '2 x {ElfMaidsNOctopi_Robots_Appendages}s and 2 x {ElfMaidsNOctopi_Robots_Appendages}s',
    '4' : '{ElfMaidsNOctopi_Robots_Appendages}, {ElfMaidsNOctopi_Robots_Appendages}, {ElfMaidsNOctopi_Robots_Appendages}, and {ElfMaidsNOctopi_Robots_Appendages}'
}
gen_data['ElfMaidsNOctopi_Robots_Animal_Appendages'] = {
    '1' : '4 x {ElfMaidsNOctopi_Robots_Appendages}s',
    '2' : '2 x {ElfMaidsNOctopi_Robots_Appendages}s and 2 x {ElfMaidsNOctopi_Robots_Appendages}s',
    '3' : '2 x {ElfMaidsNOctopi_Robots_Appendages}s and 1 x {ElfMaidsNOctopi_Robots_Appendages}s and 1 x {ElfMaidsNOctopi_Robots_Appendages}s ',
    '4' : '{ElfMaidsNOctopi_Robots_Appendages}, {ElfMaidsNOctopi_Robots_Appendages}, {ElfMaidsNOctopi_Robots_Appendages}, and {ElfMaidsNOctopi_Robots_Appendages}'
}

gen_data['ElfMaidsNOctopi_Robots_Humanoid_Appendages'] = {
    '1' : '2 x {ElfMaidsNOctopi_Robots_Appendages}s',
    '2' : '{ElfMaidsNOctopi_Robots_Appendages}s and {ElfMaidsNOctopi_Robots_Appendages}s'
}

gen_data['ElfMaidsNOctopi_Robots_3_Appendages'] = {
    '1' : '3 x {ElfMaidsNOctopi_Robots_Appendages}s',
    '2' : '2 x {ElfMaidsNOctopi_Robots_Appendages}s and 1 x {ElfMaidsNOctopi_Robots_Appendages}s',
    '3' : '{ElfMaidsNOctopi_Robots_Appendages}, {ElfMaidsNOctopi_Robots_Appendages}, and {ElfMaidsNOctopi_Robots_Appendages}'
}

gen_data['ElfMaidsNOctopi_Robots_Appendages'] = {
    '1' : 'tool arm',
    '2' : 'claw arm',
    '3' : 'tentacle arm',
    '4' : 'stabiliser arm',
    '5' : 'industrial arm',
    '6' : 'hi-tek power arm',
    '7' : 'crude hand/arm',
    '8' : 'humanoid arm',
    '9' : 'tractor-repulsor beam array',
    '10' : 'polymorphous metal arm'
}





