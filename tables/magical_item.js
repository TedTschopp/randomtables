gen_data['legendary_weapon'] = [
    'A {legandary_weapon_craftsmanship} {legandary_weapon_material} {number_of_and_type_of_legendary}. Its body {legandary_weapon_body} and its handle {legandary_weapon_handle}. It {legandary_weapon_aura} in the presence of {legandary_weapon_aura_trigger}, and when striking in combat it {legandary_weapon_aura_effect}. This weapon {legandary_weapon_age}, and was created by {legandary_weapon_creator} for {legandary_weapon_purpose}. Its last known owner was {legandary_weapon_owner}, who used it {legandary_weapon_usage}.'
];
gen_data['number_of_and_type_of_legendary'] = [
      'shortsword',
      'longsword',
      'broadsword',
      'two-handed sword',
      'rapier',
      'scimitar',
      'falchion',
      'dagger',
      'stilleto',
      'battle axe',
      'handaxe',
      'battle axe',
      'club',
      'flail',
      'mace',
      'war hammer',
      'morningstar',
      'quarterstaff',
      'maul',
      'short spear',
      'long spear',
      'scythe',
      'poleaxe',
      'pike',
      'light crossbow',
      'heavy crossbow',
      'short bow',
      'long bow',
      'voulge',
      'javelins(two)',
      'javelins(three)',
      'javelins(four)',
      'javelins(five)',
      'javelins(six)',
      'throwing knives(two)',
      'throwing knives(three)',
      'throwing knives(four)'
];

gen_data['legandary_weapon_material'] = {
    '1-3': '{MetalWeapon}',
    '4-5': '{WoodWeapon}',
    '6': '{legandary_weapon_exotic_material}'
};

gen_data['legandary_weapon_exotic_material'] = [
  'flint',
  '{GemType}',
  '{HornIvory}',
  '{fantastic_animal} bone',
  'china',
  'glass',
  'crystalline ice',
  'shadows with {light_motes}',
  'pure light with {light_motes}' 
]
gen_data['legandary_weapon_craftsmanship'] = [
  'ordinary',
  'well-made',
  'decorative and ornate',
  'worn',
  'discarded',
  'childish toy-like',
  'exotic'
]
  
gen_data['legandary_weapon_body'] = [
  'is indistinguishable from any other similar weapon',
  'has a simple signature marked by its creator',
  'is inscribed with a prayer to an ancient god',
  'is inscribed with an oath to a dead king',
  'is inscribed with a plea to a fallen tyrant',
  'has dozens small signs and symbols surrounded by {Symbols}',
  'has dozens of arcane and runic sigils in {RuneLanguage}',
  'has hundreds of seemingly random of lines, swirls, and shapes surrounded by {Symbols}',
  'has hundreds of seemingly meaningful patterns of lines, swirls, and shapes surrounded by {Symbols}',
  'is covered in ancient crude art, telling the story of an extinct race',
  'is covered in modern impressionist art, telling the story of a sexual conquest',
  'is covered in simplistic drawings, telling the story of a forgotten battle'
]
  
gen_data['legandary_weapon_handle'] = [
  'is unwrapped/bare',
  'is wrapped in brightly-colored silk',
  'is wrapped in gray and silverly tendrils like spider webs',
  'is wrapped in tightly-woven grass and reeds',
  'is wrapped in strips of black leather',
  'is wrapped in strips of taut, white human skin',
  'is made of plain wood',    
  'is made of finely lathed exotic wood',
  'is made of intricately rune-carved wood',
  'is wrapped in the tattered pages of an ancient philosophy tome',
  'is wrapped in strips torn from a king\'s tapestry' 
]
  
gen_data['legandary_weapon_aura'] = [
  'glows silvery like the full moon',
  'glows golden like the sun',
  'glows azure like the ocean',
  'glows crimson like angry fire',
  'glows soft green like a forest mist',
  'becomes translucent',
  'becomes light as a feather',
  'becomes heavy like lodestone'
]
  
gen_data['legandary_weapon_aura_trigger'] = [
  'dead bodies',
  'fine wines',
  'poetry books',
  'ritualistic magic',
  'enchantments',
  'hidden doors',
  'safe havens',
  'disease',
  'gold or jewels',
  'undead',
  'goblins',
  'celestial entities',
  'demonic entities',
  'astral entities',
  'vermin',
  'fairykind',
  'natural animals',
  'Lovecraftian horrors'
]
  
gen_data['legandary_weapon_aura_effect'] = [
  'burns with angry fire',
  'freezes enemies to the bone',
  'covers enemies in flesh-corroding poison',
  'crackles with electricity',
  'emits a choking gas',
  'pierces with holy light',
  'trails wispy, necrotic shadows',
  'causes explosive clouds of spores',
  'erupts in entangling briars',
  'vomits forth crawling spiders',
  'drains the blood of enemies',
  'creates minor illusions of the wielder',
  'summons swarms of stinging wasps',
  'evokes nightmarish terrors',
  'forms powerful whirlwinds'
]

gen_data['legandary_weapon_age'] = [
  'was recently forged',
  'is a few decades old',
  'is from a past generation',
  'is from the last century',
  'is hundreds of years old',
  'was forged over a millennium ago',
  'is as ancient as the oldest dragons',
  'was forged during the creation of the world'
]
  
gen_data['legandary_weapon_creator'] = [
  'the First Sentinel of the Resonant Enclave',
  'the Mastersmyth of Lurus the Wind Shepherd',
  'slaves of Khet-lui',
  'the Children of Khatai',
  'Justhal the Thunderer, ancient Dwarven smith',
  'a secret sect of the Cloven Strand',
  'the Weeping God',
  'Arxhis the Blood-handed',
  'a circle of nine blind satyrs',
  'the Cult of the Beneath',
  'insane worshippers of the dead godling, Munt Far-la',
  'six Elven Starsmiths',
  'servitor-wraiths of Entropos',
  'Uhltros the Octopodling',
  'the twin banelings, Atmas and Omtha',
  'Sphirtol, the Scarecrow King',
  'a long-forgotten gnomish blacksmith',
  'crystal weavers of the Ariphean Spires',
  'the First Creed of Man',
  'four angels of the White Wolf',
  'Karsayul, the Last Remnant of Insight',
  'six Shephard-monks of Glepazen',
  'weird catfolk from the moon',
  'blood demons of the Last Paragons'
]
  
gen_data['legandary_weapon_purpose'] = [
  'avenging the fallen brethren of Man',
  'avenging the broken body of the Goddess',
  'avenging the shattered Fellowship of Shipwrights',
  'avenging the smoldering Qendi Jungles',
  'avenging the obliterated Kukai tribes',
  'uniting the Hosts of Sanctity',
  'uniting the Band of the White Dove',
  'uniting the Septs of Hope',
  'defending the ursine Pilgrims of Galzamel',
  'defending the survivors of Haldar Logath',
  'defending all the world\'s innocence',
  'defending the last of the cloudfolk',
  'fighting in the War of Final Accords',
  'fighting in the War of the Nine Sins',
  'fighting in the Titanwars',
  'fighting in the Godsbane Trials',
  'fighting in the War of the Blind',
  'fighting in the Battle of Maidens',
  'fighting in the Battle of the Fiery Lake',
  'fighting in the Battle of Smoking Homelands',
  'fighting in the Battle of Lost Storms',
  'fighting in the War of Imbalance',
  'destroying the Cresthordes',
  'destroying the Corrupted Ones',
  'ending Purity',
  'ending Hope',
  'ending Betrayal',
  'ending Slavery',
  'ending Suffering',
  'causing Disharmony',
  'causing Chaos'
]
  
gen_data['legandary_weapon_owner'] = [

  'a poor farmer',
  'a lonely woodsman',
  'a virgin milkmaid',
  'an evil stepfather',
  'a small-town mayor',
  'a traveling knight-errant',
  'a succubus sorceress',
  'an absent-minded goliath',
  'a troubled windchime craftsman',
  'a nightmare-plagued king',
  'a vampire baroness',
  'a floating crystalline entity',
  'an almost-immortal godchild',
  'an enslaved princess',
  'a heretic priest',
  'a streetwise urchin',
  'a drug-addled alchemist',
  'a rune-scarred clown magician',
  'a brothel owner',
  'a crippled goblin king'
]
  
gen_data['legandary_weapon_usage'] = [
  'to swat at flies',
  'to pry open old jars',
  'as a glorified doorstop',
  'as a souvenir piece over a mantel',
  'as a walking staff',
  'to fight off bandits',
  'to ward off apple-stealing pixies',
  'to intimidate a scummy landlord',
  'to rummage through an owlbear\'s den',
  'to assassinate a local lord',
  'to kill a local pedophile',
  'to slay an ancient dragon' 
]
  