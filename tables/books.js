gen_data['book'] = {
  '1': '{books} {book_spine} Overall the book is {book_condition}'
}

gen_data['books'] = {
  '1' : '{religion_book}: {book_volumes} {book_type_both}',
  '2' : '{travel_book}: {book_volumes} {book_type_both}',
  '3' : '{biology_book}: {book_volumes} {book_type_nonfiction}',
  '4' : '{magic_book}: {book_volumes} {book_type_both}',
  '5' : '{craftwork_book}: {book_volumes} {book_type_nonfiction}',
  '6' : '{tales_book}: {book_volumes} {book_type_both}',
  '7' : '{art_book}: {book_volumes} {book_type_fiction}',
  '8' : '{historical_book}: {book_volumes} {book_type_both}',
  '9' : '{geography_book}: {book_volumes} {book_type_both}',
  '10': '{linguistics_book}: {book_volumes} {book_type_nonfiction}'
}

gen_data['book_volumes'] = {
  '1-4' : 'a standalone volume, {author}',
  '5'   : '{3to9} volumes in the series {author}',
  '6'   : '{4to15} volumes in the series {author}',
  '7'   : 'An edition of a regularly published collection {author}',
  '8'   : 'A collection of works {author}',
  '9'   : 'An anthology of works {author}',
  '10'  : 'The sequel to a book {author}'
}

gen_data['author'] = {
  '1' : 'by {names}; the author\'s only published work.',
  '2' : '{names}\'s only surviving work.',
  '3' : 'written by {names}; a prolific but obscure author.',
  '4' : 'written by {names}; a well-known author.',
  '5' : 'by {multiple_authors}.',
  '6' : 'by {names}.',
  '7' : 'by {several_authors}.'
}

gen_data['multiple_authors'] = {
	'1' : 'by {names}, {names}, {names}, {names}, {names}, and {names}',
	'2' : 'by {names}, {names}, {names}, {names}, and {names}',
	'3' : 'by {names}, {names}, {names}, and {names}',
	'4' : 'by {names}, {names}, and {names}',
}


gen_data['several_authors'] = {
	'1' : 'by {names}, {names}, and {names}',
	'2' : 'by {names} and {names}',
}




gen_data['3to9'] = {
  '1' : 'three',
  '2' : 'four',
  '3' : 'five',
  '4' : 'six',
  '5' : 'seven',
  '6' : 'eight',
  '7' : 'nine'
}

gen_data['4to15'] = {
  '2' : 'four',
  '3' : 'five',
  '4' : 'six',
  '5' : 'seven',
  '6' : 'eight',
  '7' : 'nine',
  '8' : 'ten',
  '9' : 'eleven',
  '10' : 'twelve',
  '11' : 'thirteen',
  '12' : 'fourteen',
  '12' : 'fiveteen'
}



gen_data['book_spine'] = {
  '1' : 'The cover is missing, the pages are bound with string woven through holes near the spine.',
  '2' : 'The cover is stained leather.',
  '3' : 'The cover is wooden. The title is carved into the spine.',
  '4' : 'The book is a paperback.',
  '5' : 'The wrapped in animal hide.',
  '6' : 'The bound together with iron rings, and the cover is stone.',
  '7' : 'The book is kept in a cast iron box with hinges binding the top and bottom.',
  '8' : 'The cover is leather with gemstones embedded in it.',
  '9' : 'The cover is leather with the title branded on it.',
  '10': 'The cover is leather with gilding on the spine.',
  '11': 'The cover is torn off and held together by a leather belt.',
  '12': 'The cover is tree bark, dried vine binds it.'
}

gen_data['book_type_both'] = {
  '1' : '{book_type_fiction}',
  '2' : '{book_type_nonfiction}'
}
gen_data['book_type_fiction'] = {
  '1' : 'The book is a work of fiction that {book_quality_fiction}'
}
gen_data['book_type_nonfiction'] = {
  '1' : '{book_quality_nonfiction}'
}
gen_data['book_condition'] = {
        '1-46' : 'unreadable and in small pieces.  Little information can be gleaned from this work without a great deal of effort, and is only {d8*10} complete.', /* 3D6 =3 */
      '47-185' : 'unreadable and in small pieces.  Little information can be gleaned from this work without a great deal of effort, and is only {d8*10} complete.', /* 3D6 =4 */
     '186-462' : 'nearly unreadable, it is missing parts and in fragments, but the majority of the work is intact.  The ink is faded, and flaked off in places.  Margins are worn, torn and burned intrudes into the text.  The pages are stained.  The book will be 80% to 100% complete.', /* 3D6 =5 */
     '463-925' : 'nearly unreadable, it is missing parts and in fragments, but the majority of the work is intact.  The ink is faded, and flaked off in places.  Margins are worn, torn and burned intrudes into the text.  The pages are stained.  The book will be 80% to 100% complete.', /* 3D6 =6 */
    '926-1620' : 'intact but in bad condition. It is missing the cover page and has bad stains on some pages, while others are tattered.', /* 3D6 =7 */
   '1621-2592' : 'intact but in bad condition. It is missing the cover page and has bad stains on some pages, while others are tattered.', /* 3D6 =8 */
   '2593-3750' : 'worn with loose pages, a broken spine and dog ears pages but the book is whole and readable.', /* 3D6 =9 */
   '3751-5000' : 'worn with loose pages, a broken spine and dog ears pages but the book is whole and readable.', /* 3D6 =10 */
   '5001-6250' : 'showing sign of wear and heavy use, but is unbroken or stained.', /* 3D6 =11 */
   '6251-7407' : 'showing sign of wear and heavy use, but is unbroken or stained.', /* 3D6 =12 */
   '7408-8379' : 'showing some signs of shelf wear', /* 3D6 =13 */
   '8380-9074' : 'showing some signs of shelf wear', /* 3D6 =14 */
   '9075-9537' : 'is as new, but has small signs of wear.', /* 3D6 =15 */
   '9538-9814' : 'is as new, but has small signs of signs.', /* 3D6 =16 */
   '9815-9953' : 'newly printed or copied.', /* 3D6 =17 */
  '9954-10000' : 'newly printed or copied.' /* 3D6 =18 */
}
gen_data['book_quality_fiction'] = {
        '1-46' : 'you would rather rip your eyes out than read.', /* 3D6 =3 */
      '47-185' : 'you would rather rip your eyes out than read.', /* 3D6 =4 */
     '186-462' : 'You would sooner face Orcs than read this book.', /* 3D6 =5 */
     '463-925' : 'You would sooner face Orcs than read this book.', /* 3D6 =6 */
    '926-1620' : 'you could either read this or bang your head on the wall.', /* 3D6 =7 */
   '1621-2592' : 'you could either read this or bang your head on the wall.', /* 3D6 =8 */
   '2593-3750' : 'is predictable and formulaic.', /* 3D6 =9 */
   '3751-5000' : 'is predictable and formulaic.', /* 3D6 =10 */
   '5001-6250' : 'is a decent light read.', /* 3D6 =11 */
   '6251-7407' : 'is a decent light read.', /* 3D6 =12 */
   '7408-8379' : 'is engaging.', /* 3D6 =13 */
   '8380-9074' : 'is engaging.', /* 3D6 =14 */
   '9075-9537' : 'is a page turner.', /* 3D6 =15 */
   '9538-9814' : 'is a page turner.', /* 3D6 =16 */
   '9815-9953' : 'is a classic for the ages.', /* 3D6 =17 */
  '9954-10000' : 'is a classic for the ages.' /* 3D6 =18 */
}
gen_data['book_quality_nonfiction'] = {
        '1-46' : 'Dangerous - This book will impart dangerously wrong information.', /* 3D6 =3 */
      '47-185' : 'Dangerous - This book will impart dangerously wrong information.', /* 3D6 =4 */
     '186-462' : 'Worthless - The book is dead wrong, but not in a way that will hurt you.', /* 3D6 =5 */
     '463-925' : 'Worthless - The book is dead wrong, but not in a way that will hurt you.', /* 3D6 =6 */
    '926-1620' : 'Error prone - This book has just enough right information to hold up the wrong parts.', /* 3D6 =7 */
   '1621-2592' : 'Error prone - This book has just enough right information to hold up the wrong parts.', /* 3D6 =8 */
   '2593-3750' : 'Poorly researched - No patently bad data, but it is not well presented.', /* 3D6 =9 */
   '3751-5000' : 'Poorly researched - No patently bad data, but it is not well presented.', /* 3D6 =10 */
   '5001-6250' : 'A fair resource - Covers the subject well enough for the idly curious.', /* 3D6 =11 */
   '6251-7407' : 'A fair resource - Covers the subject well enough for the idly curious.', /* 3D6 =12 */
   '7408-8379' : 'A good resource - Covers the subject well enough for the dilettante. ', /* 3D6 =13 */
   '8380-9074' : 'A good resource - Covers the subject well enough for the dilettante. ', /* 3D6 =14 */
   '9075-9537' : 'An excellent resource - Covers the subject well enough for the serious ', /* 3D6 =15 */
   '9538-9814' : 'An excellent resource - Covers the subject well enough for the serious ', /* 3D6 =16 */
   '9815-9953' : 'The definitive resource - No better work on the subject.', /* 3D6 =17 */
  '9954-10000' : 'The definitive resource - No better work on the subject. ' /* 3D6 =18 */
}
  gen_data['d8*10'] = [
    '10','20','30','40','50','60','70','80'
  ]



  gen_data['religion_book'] = {
    '1' : 'Life of Saint {names}',
    '2' : '{relthings} of the {domain} {rel}',
    '3' : '{adj} {things} of the {domain} {rel}',
    '4' : '{things} of the {domain} {rel}'
  }
  gen_data['travel_book'] = {
    '1' : '{travel} of {names}'
  }
  gen_data['biology_book'] = {
    '1' : '{bio} of the {creature}',
    '2' : '{createure} of {things}'
  }
  gen_data['magic_book'] = {
    '1' : '{adj} {arcana} {things}',
    '2' : '{arcana} {things}',
    '3' : '{adj} {things} {regarding} {arcana}',
    '4' : '{things} {regarding} {arcana}'
  }
  gen_data['craftwork_book'] = {
    '1' : '{guide} {crafts}'
  }
  gen_data['tales_book'] = {
    '1' : '{story} of the {adj2} {place}',
    '2' : '{story} of the {adj2} {person}',
    '3' : '{story} of the {adj3} {person}'
  }
  gen_data['art_book'] = {
    '1' : '{poettype} {poetry}'
  }
  gen_data['historical_book'] = {
    '1' : '{history} of the {histtype}',
    '2' : '{adj} {things} of the {histtype}',
    '3' : '{things} of the {histtype}',
    '4' : '{fame} {people} of the {histtype}'
  }

  gen_data['geography_book'] = {
    '1' : '{adj2} {geo} Atlas',
    '2' : '{geothings} of the {adj2} {geo}',
    '3' : '{activity} of the {geo}'
  }
  gen_data['linguistics_book'] = {
    '1' : '{language} to {language} Dictionary',
    '2' : '{dictionary} of {language} {words}'
  }
  gen_data['relthings'] = [
    'appeals','champions','hymns','litanies','orders','petitions','prayers','relics','saints','shrines','symbols','temples'
  ];

  gen_data['domain'] = [
    'air','chaos','death','destruction','earth','evil','fire','good','knowledge','law','love','moon','nature','protection','strength','sun','travel','trickster','war'
  ];
  gen_data['things'] = [
    'fables','legends','lore','mysteries','myths','powers','rites','rituals','sagas','secrets','strictures','tales','traditions'
  ];
  gen_data['rel'] = [
    'cult','cults','deities','deity','divinities','divinity','faith','faiths','god','goddess','goddesses','gods','religion','religions'
  ];
  gen_data['crafts'] = [
    'alchemy','assassination','baking','barrelmaking','basketmaking','brewing','carpentry','cobbling','cooking','dancing','fishing','fletching','gemcutting','herbalism','leatherworking','locksmithing','masonry','milling','painting','poisons','ropemaking','sculpting','sewing','smithing','tanning','weaving'
  ];
  gen_data['travel'] = [
    'travels','journeys','voyages'
  ];
  gen_data['geo'] = [
    'caverns','desert','forest','hills','moors','mountains','plains','swamp'
  ];
  gen_data['geothings'] = [
    'animals','climate','hazards','herbs','history','monsters','people','riches','ruins','settlements','tales','weather'
  ];
  gen_data['dictionary'] = [
    'dictionary','glossary','lexicon'
  ];
  gen_data['words'] = [
    'letters','phrases','terms','words'
  ];
  gen_data['bio'] = [
    'bestiary','biology','dietary habits','ecology','mating habits'
  ];
  gen_data['arcana'] = [
    'abjuration','alchemy','conjuration','divination','evocation','illusion','magic','runecraft','thaumaturgy','transmutation','enchantment','necromancy','sorcery'
  ];
  gen_data['guide'] = [
    'book of','compendium on','guide to','manual of','writings on'
  ];
  gen_data['regarding'] = [
    'about','concerning','regarding'
  ];
  gen_data['history'] = [
    'architecture','armies','art','beliefs','cities','cuisine','customs','dances','heraldry','history','music','languages','rulers','ships','trade','treasures','wars','weapons'
  ];
  gen_data['language'] = [
    'abyssal','common','deep speech','draconic','dwarven','elven','giant','goblin','primordial','supernal'
  ];
  gen_data['story'] = [
    'legend','stories','tales'
  ];
  gen_data['poetry'] = [
    'ballads','idylls','poems','poetry','songs','verses'
  ];
  gen_data['poettype'] = [
    'ancient','celestial','elven','erotic','hopeful','inspirational','merry','mournful','mystic','rousing'
  ];
  gen_data['histtype'] = [
    'Ancient World','Barbarian Plains','Chaos Lands','Desert Tribes','Eastern Kingdoms','Empire','Island Kingdoms','Mountain Clans','Northern Cultures','Southern Regions','Western Realms','{nonHuman}'
  ];
  gen_data['nonhuman'] = [
    'Dragons','Dwarves','Elves','Giants','Gnomes','Orcs','Trolls','Underworld'
  ];
  gen_data['fame'] = [
    'acclaimed','exalted','famous','infamous','legendary','notable','obscure','renowned'
  ];
  gen_data['people'] = [
    'adventurers','champions','heroes','nobles','priests','sages','warriors','wizards'
  ];
  gen_data['person'] = [
    'alchemist','angel','archer','bandit','banshee','bard','baron','beggar','brigand','champion','cleric','dancer','druid','drunkard','dryad','dwarf','elf','enchanter','enchantress','fisherman','fool','friar','gambler','giant','goblin',
    'guard','gypsy','hag','hangman','harlot','harpy','hermit','hero','highwayman','horseman','hunter','huntress','jester','king','knave','knight','lady','lord','maiden','merchant','mermaid','minotaur','minstrel','mistress','monk',
    'nomad','nymph','ogre','pilgrim','pirate','plowman','priest','priestess','prince','queen','ranger','rogue','sage','sailor','shepard','smith','sorcerer','squire','stranger','thief','traveler','troll','virgin','vixen','wanderer',
    'warrior','watchman','wench','witch','wizard'
  ];
  gen_data['adj'] = [
    'esoteric','false','forbidden','forgotten','hidden','lost','mystical','sacred','secret','unholy','unknown','veiled'
  ];
  gen_data['adj2'] = [
    'ancient','black','blue','brass','brown','chaotic','copper','crimson','dark','dirty','dripping','enchanted','fearsome','frosty','frozen','glass','glorious','golden','great','green','grey','imperial','invisible','iron','ivory','jade','last','lawful','magical','majestic','mystic','odd','old','pale','red','royal','sacred','scarlet','secret','shining','silent','silver','singing','steel','stone','sturdy','twisted','whistling','white','wooden'
  ];
  gen_data['adj3'] = [
    'adulterous','amorous','angry','arcane','avenging','bald','bearded','beefy','bitter','blind','bloated','boastful','brave','brawny','brazen','bumbling','burly','buxom','charming','clever','crazy','crusty','curious','dancing','dead','dreaming','drooling','drunken','eager','fallen','fat','fell','fiery','fighting','flying','foolish','foppish','gay','gentle','greedy','grim','handsome','hanging','happy','hearty','honest','horned','horny','howling','humble','hungry','jealous','jolly','lame','laughing','lazy','leaping','lucky','lusty','mad','merry','mighty','naughty','noble','prancing','proud','roaring','rowdy','rude','salty','savage','shady','slaughtered','sleeping','sneezing','stalwart','stout','thirsty','timid','towering','virtuous','vulgar','wandering','wanton','weary','wise','zealous'
  ];
  gen_data['activity'] = [
    'fighting','hunting','mining','surviving','trave'
  ];
  gen_data['names'] = [
    'Amanapa','Arannash','Aspin','Astarte','Avilion','Celindaria','Crystanor','Dalis','Denudiel','Derenome','Doniri','Dwinian','Egildas','Elargir','Eldraz','El-Wisbin','Eninope','Findrillian','Foobar','Fordulana','Hirondelle','Ignius','Isrid','Jinarf','Lagwyn','Loriel','Margwas','Melpomene','Meridian','Mitzi','Mortick','Mystrene','Nilf','Ornill','Pildar','Prodge','Quailandir','Ravaniof','Repetitios','Rhyidon','Rhyndis','Sidiar','Spiridon','Splinders','Spork','Syniara','Tiffany','Trisilyan','Valdison','Vermopolis','Vevrissan','Widgil','Wrastforth','Xandiri','Zwind'
  ];
  gen_data['creature'] = [
    'ass','bear','beast','boar','bull','cat','chicken','chimera','cock','cow','crab','demon','devil','dog','dragon','drake','duck','eagle','falcon','fox','frog','gargoyle','goat','griffon','hare','hawk','hog','horse','hound','lamb','lion','lizard','mare','monster','owl','ox','phoenix','pig','pony','rat','raven','rooster','serpent','shadow','shark','sheep','siren','snake','stag','stallion','swine','unicorn','vulture','wolf','wyrm','wyvern'
  ];
  gen_data['place'] = [
    'battlement','bridge','castle','cave','cove','crag','crypt','den','domain','dungeon','gate','hall','haven','hideout','hill','house','inn','keep','labyrinth','lair','landing','manor','nest','oasis','pit','rest','river','road','rookery','roost','sanctum','shrine','star','temple','throne','tomb','tower','valley','vault','wood'
  ];
