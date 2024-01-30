gen_data['welcome_to_town'] = {
	'01': 'Welcome to {town_name}, known for its {town_pride}. {cultural_differences_people}'
}


gen_data['town_pride'] = {
	'01-02': 'A large museum and library that people come from all over the known world to visit and study.',
	'03-04': '{statue_description} {statue_condition_unusal}',
	'05-06': 'A world famous {unusual_ruin}',
	'07-08': '{legendary_beasts}',
	'09-10': 'A local “wonder of the world” (plant or tree)',
	'11-12': 'The local cuisine of {dinner}',
	'13-14': 'A local strongman',
	'15-16': 'Beauty of the women',
	'17-18': 'Cleanliness of the people',
	'19-20': 'Cleanliness of the town',
	'21-22': 'Comfortable beds',
	'23-24': 'Elaborate and constant insults',
	'25-26': 'Flamboyance of local clothing',
	'27-28': 'Good manners',
	'29-30': 'Hospitality to foreigners',
	'31-32': 'Local {bread}',
	'33-34': 'Local cats',
	'35-36': 'Local {entertainers}',
	'37-38': 'The locals farmers known for their {livestock}',
	'39-40': 'The butchers are known for their {cuts_of_meat}',
	'41-42': 'Local music',
	'43': 'Local political leaders',
	'44': 'Local political system',
	'45-46': 'Local {fancy_dinner_drink}',
	'47-48': 'Local temple complex',
	'49': 'Manners of the town watch',
	'50': 'Skill of town watch',
	'51-52': 'Masonry',
	'53-54': 'Metalwork',
	'55-56': 'Obedience of slaves',
	'57-58': '{physical_traits}',
	'59-60': 'Quality of glassblowing products',
	'61-62': 'Quality of local food and cooking',
	'63-64': 'Quality of pottery or ceramics',
	'65-66': 'Quality of sailors (If city/town is a port)',
	'67-68': 'Quality of teeth',
	'69': 'Remarkable fatness of locals',
	'70': 'Remarkable thinness of locals',
	'71-72': 'Remarkable height of citizens',
	'73-74': 'Security of local prison',
	'75-76': 'Severity of laws',
	'77-78': 'A large local fair',
	'79': 'Size of the local vegetables',
	'80': 'Taste of the local vegetables',
	'81-82': 'Skill at playing {game}',
	'83-84': 'Skill of the local farmers in raising {livestock}',
	'85-86': 'Skill of local merchants',
	'87-88': 'Skill of local soldiers',
	'89-90': 'Skill of locals at trading and haggling',
	'91-92': '{statue_material} Statues',
	'93-94': 'Taverns and the beer they brew',
	'95-96': 'Textiles',
	'97-98': 'Wine',
	'99-00': 'Woodcarving'
}

gen_data['cuts_of_meat'] = [
	'{cuts_of_meat_fowl}',
	'{cuts_of_meat_lifestock}'
]

gen_data['cuts_of_meat_fowl'] = [
	'{fowl} breast',
	'{fowl} leg',
	'{fowl} drumstick',
	'{fowl} thigh',
	'{fowl} wing',
	'{fowl} backs and necks'
]

gen_data['cuts_of_meat_lifestock'] = [
	'{livestock} neck',
	'{livestock} chuck',
	'{livestock} T-bone',
	'{livestock} entrecote',
	'{livestock} Sirloin',
	'{livestock} Fillet',
	'{livestock} Rump Steak',
	'{livestock} Innter Shank',
	'{livestock} Topside',
	'{livestock} Shank',
	'{livestock} Flank Steak',
	'{livestock} Skirt',
	'{livestock} Shoulder',
	'{livestock} Flank'
]

gen_data['government_type'] = {
	'1': 'Anarchy (no government)',
	'2': 'Aristocracy (ruled by nobility)',
	'3': 'Autocracy* (absolute rule of one)',
	'4': 'Bureaucracy (government of administrators)',
	'5': 'Caliphate (ruled by a caliph/prophet)',
	'6': 'Communism (all property as common)',
	'7': 'Confederacy (alliance of rulers)',
	'8': 'Democracy (ruled by masses-elected agents)',
	'9': 'Despotism (absolute control/tyranny)',
	'10': 'Dyarchy (ruled by two)',
	'11': 'Dictatorship (absolute power to a dictator)',
	'12': 'Dictatorship, Military',
	'13': 'Duchy (ruled by a duke or duchess)',
	'14': 'Emirate (ruled by an Emir)',
	'15': 'Enlightened Absolutism',
	'16': 'Fascism (authoritarian nationalism)',
	'17': 'Feudalism (holding of land in a  ef or fee)',
	'18': 'Gerontocracy (ruled by council of elders)',
	'19': 'Gynarchy* (ruled by women)',
	'20': 'Hegemony (ruling of one nation over others)',
	'21': 'Heteronomy (domination by outside power)',
	'22': 'Hierarchy (religious feudal system)',
	'23': 'Isocracy (everyone has equal power)',
	'24': 'Kleptocracy (rule of theives and exploiters)',
	'25': 'Libertarian ("rule" of free will)',
	'26': 'Magocracy (ruled by magi or arcanists)',
	'27': 'Matriarchy (community ruled by matriarchs)',
	'28': 'Meritocracy (those with talent and skill)',
	'29': 'Militocracy (ruled by the military)',
	'30': 'Monarchy (ruled by a king or queen)',
	'31': 'Monarchy, Absolute',
	'32': 'Monarchy, Constitutional',
	'33': 'Ochlocracy (ruled by a mass or mob)',
	'34': 'Oligarchy* (ruled by a dominant class)',
	'35': 'Panocracy (ruled by everyone)',
	'36': 'Patriarchy (community ruled by patriarchs)',
	'37': 'Pedocracy (ruled by learned, savants, scholars)',
	'38': 'Police State (oppresses opposition to rule)',
	'39': 'Plutocracy (rule of the wealthy)',
	'40': 'Principality (ruled by a prince or chief ruler)',
	'41': 'Puppet State* (ruled by other outsiders)',
	'42': 'Regency* (rule in lieu of actual ruler)',
	'43': 'Republic (ruled by elected of cials)',
	'44': 'Republic, Capitalist',
	'45': 'Republic, Constitutional',
	'46': 'Republic, Parliamentary',
	'47': 'Republic, Socialist',
	'48': 'Satrapy* (ruled by a satrap/governor)',
	'49': 'Socialism (rule to bene t production and distribution of capital, land, etc)',
	'50': 'Sultanate (ruled by a sultan/governor)',
	'51': 'Syndicracy (ruled by business or guild)',
	'52': 'Technocracy (ruled by engineers/scientists)',
	'53': 'Theocracy (ruled by a church)',
	'54': 'Timocracy (ruled by honor)',
	'55': 'Totalitarianism (absolute control by the state)',
	'56': 'Tribalism (ruled by a tribe)',
	'57': 'Triumvirate (ruled by three magistrates)',
	'58': 'Tyranny (ruled by a tyrant or absolute ruler)',
	'59': 'Utopia (unrealistic but perfect society)',
	'60': 'Viceroyalty (ruled by a viceroy)'
}

gen_data['dinner'] = [
	'{fancy_dinner_cooking} {fancy_dinner_meat} with {fancy_dinner_with} and {fancy_dinner_with_and}, served with a side of {fancy_dinner_side} and {fancy_dinner_drink} to drink.'
]

gen_data['fancy_dinner_cooking'] = [
	'Stewed',
	'Roasted',
	'Fried',
	'Baked',
	'Grilled',
	'Seared',
	'Salted',
	'Candied'
]
gen_data['fancy_dinner_meat'] = [
	'Rabbit',
	'Pheasant',
	'Duck',
	'Bat',
	'Pork',
	'Beef',
	'Goose',
	'Trout',
	'Oysters',
	'Blood sausage',
	'Pork sausage',
	'Meat pie'
]
gen_data['fancy_dinner_with'] = [
	'Dumplings',
	'Sweet cabbage',
	'Caramelized onions',
	'Pumpkin',
	'Butternut squash',
	'Peas',
	'Kidney beans',
	'String beans',
	'Pudding',
	'Asparagus',
	'Sprouts',
	'Potatoes',
	'Mushrooms',
	'Toadstools',
	'Squash',
	'White beans',
	'Red onions',
	'Spinach',
	'Cucumber',
	'Pickles',
]
gen_data['fancy_dinner_with_and'] = [
	'Carrots',
	'Apples',
	'Cherries',
	'Tomatoes',
	'Pears',
	'Strawberries',
	'Pumpkin seeds',
	'Walnuts',
	'Pecans',
	'Almonds',
	'Parsley',
	'Turnips'
]
gen_data['fancy_dinner_side'] = [
	'Elvish bread',
	'Chocolate molded into the shape of frogs',
	'Cinnamon bread',
	'Pumpkin bread',
	'Chocolate candy',
	'Caramel candy',
	'Cheese cake',
	'Rum cake',
	'Sugar cake',
	'Fruit tart',
	'Pumpkin pie',
	'Blueberry pie'
]
gen_data['fancy_dinner_drink'] = [
	'Pumpkin juice',
	'Buttery ale',
	'Root beer',
	'Ginger beer',
	'Fizzy ale',
	'Chocolate stout',
	'Coffee stout',
	'Apple cider',
	'Pear cider',
	'Sweet tea',
	'Herbal tea',
	'Hot cocoa'
]



gen_data['legendary_beasts'] = [
	'A {fantastic_animal} that people describe as having {legendary_beasts_characterists}.  Its known for {legendary_beasts_known_for}',
	'A {fantastic_animal} that people describe as having {legendary_beasts_characterists} and {legendary_beasts_characterists}.  Its known for {legendary_beasts_known_for} ',
	'A {fantastic_animal} that people describe as having {legendary_beasts_characterists}, {legendary_beasts_characterists}, and {legendary_beasts_characterists}.  Its known for {legendary_beasts_known_for} ',
]

gen_data['legendary_beasts_characterists'] = [
	'unnatural intelligence',
	'the power of speech',
	'an especially savage manner',
	'a frightening howl or cry',
	'a mournful howl or cry',
	'immense size',
	'unusual coloration or markings',
	'a terrible scar on its face',
	'a terrible scar on its body',
	'a missing eye'
]

gen_data['legendary_beasts_known_for'] = [
	'slaying a well-known hero.',
	'slaying a notorious villain.',
	'laying ruin to a village all by itself.',
	'attacking the local trade routes and scattering the caravans.',
	'leaving a trail of destruction in its wake where ever it goes.',
	'living the the ruins of a {ruin_type}',
	'living on holy ground outside the city.',
	'hunting along a the main road into town.',
	'toying with its prey before the kill.',
	'protecting the people who live near it.'
]


gen_data['ruin_type'] = [
	'Castle',
	'Manor',
	'Temple',
	'{unusual_ruin}'
]
gen_data['unusual_ruin'] = {
	'01-03': 'Academy',
	'04-06': 'School',
	'07-10': 'University',
	'11-20': 'Water works and dams, used to power large industrial machines ',
	'21-30': 'A large forge used to manufactor all sorts of metal equiptment, armonr, and weapons',
	'31-40': 'A huge juggernaut',
	'41-50': 'A huge Library and archive',
	'51-52': 'Mines',
	'53-54': 'Stone Quarry',
	'55-56': 'Archaeological dig',
	'57-58': 'Oil drilling facility',
	'51-60': 'Water drilling facility',
	'61-65': 'Museum',
	'66-70': 'Observatory',
	'71-80': 'Prison',
	'81-90': 'Wizard’s research keep',
	'91-95': 'Zoo of unusal animals',
	'96-00': 'A large animal training school'
}


gen_data['statue_description'] = [
	/*
	Make this more random
	*/

	'Blue and white marbled statue. When light shines on it, it captures and magically reflects the light back in a kaleidoscope of colors. “In honor of Oben Dreamweaver” is inscribed on it.',
	'Elf Tree of Light. This pure white oak tree’s leaves are platinum in color. The tree’s girth is wider then the arm span of a dozen elves.',
	'{goblinoild_race}\'s Legacy. A statue of the legendary troll, the leader of the Goblinoid hoards from the northern reaches.',
	'Golden statue of a king standing with his foot on the head of a {fantastic_animal}, based on an old tale often told by bards.',
	'Huge anchor cast in bronze. When touched, a name can be uttered and that name, providing it is of one who truly was lost at sea, appears on the massive base.',
	'Huge fully armed figure cast in pure obsidian from top to base stands tall. Its armor is spiked and its hands rest on the hilt of its sword, which rests point down into the base.',
	'Huge obsidian stone statue of a spider spans the street, forcing people to walk beneath its belly. Its origins are unknown.',
	'Large silver unicorn statue acts as the centerpiece of a large fountain. At night the unicorn’s horn glows brightly, providing a soft light to all those who tarry around it.',
	'Marble statue of an elf rises from the base and roots of an ancient tree. The tree must have been massive while it lived, and the  gure\'s meticulous craftsmanship suggests a nonhuman sculptor.',
	'Monument of an elf riding a wolf and holding a book, its backpack over owing with scrolls. It is titled Tristam’s Legacy.',
	'Pillar of souls, a monolith made entirely of skulls. Stark white in color, mist appears to spill out from the mouths rising to the sky. When wind blows the right way it sounds like it is moaning.',
	'Primitive statue stands at the entrance to the city. Made of local stone and weathered by time it still stands its full eight feet tall. In goblin the plaque states Uglemesh great leader and king of mighty clans.',
	'Serpent’s Rock. This enormous rock is shaped like a dragon. On the belly is a memorial to a silver dragon that once defended the area.',
	'Small stone, about the size of a large tome, lies half in and half out of the ground. It seems a marker of some sort but the writing is dif cult to make out.',
	'Statue of an armored knight. “To honor all those who fell before you” is inscribed at the base. Foul markings have been scribed on its surface.',
	'Statue of a plate-armored  gure with his sword raised high and the symbol of the god of valor on his shield. “In honor of Laramo who valiantly strove against evil no matter the odds.”',
	'Stones hang in a perfectly circular formation from their bases, each one carved with a historical scene which spirals down from base to tip in chronological order.',
	'Tall, once pure-white obelisk rises to the sky. It is covered with strange ancient writings and is rumored to be only one of many.',
	'Torren\'s Might: A statue of Torren the adventurer mentalist of Redlarch, longspear in hand, who died while killing a great black dragon.',
	'Tree is actually a sculpture, living and growing. Its branches twist and turn in fanciful ways. Every tiny branch has been sculpted, even to the very top branches, suggesting it was done either by small winged creatures or is the work of magic.',
	'A statue of the god of learning, which is said to weep from time to time over the curse of ignorance.',
	'Marble statue of a barbarian tribe leader riding a giant lizard and wielding a spear',
	'Statue of an elf engulfed in  flames standing sternly and calmly, holding a whip',
	'Statue of a rubenesque woman who appears half human and half and half elemental',
	'A statue, made of a light metal, of a particular child',
	'Ivory statue of a lion-man cradling a young lizardfolk',
	'Exquisite statue of a human woman in plate armor; her hand poised up as if to cover her face from danger.',
]




gen_data['physical_traits'] = [
	'Athletic physiques',
	'Barrel torsos',
	'Braided hair',
	'Coarse body hair',
	'Deep tans',
	'Grim expressions',
	'Healthy appetites',
	'High foreheads',
	'Large hands',
	'Long faces',
	'Long legs',
	'Olive skin',
	'Pale complexion',
	'Peculiar dialect',
	'Shaved heads',
	'Short stature',
	'Stable gait',
	'Tall physiques',
	'Thin but strong limbs',
	'Very wide eyes'
]

gen_data['bread'] = {
	'1': 'Barley bread',
	'2': 'Biscuit',
	'3': 'Bread pudding',
	'4': 'Black bread',
	'5': 'Corn bread',
	'6': 'Croissant',
	'7': 'Dumpling',
	'8': 'Fruit bread',
	'9': 'Hard roll',
	'10': 'Hardtack',
	'11': 'Muffin',
	'12': 'Oatmean bread',
	'13': 'Pancake',
	'14': 'Roll',
	'15': 'Rye bread',
	'16': 'Sweet bread',
	'17': 'Tortilla',
	'18': 'Wheat bread',
	'19': 'White bread',
	'20': 'Whole wheat bread'
}


gen_data['livestock'] = {
	'1': 'Alpaca',
	'2': 'Bison',
	'3': 'Buffalo',
	'4': 'Bull',
	'5': 'Calf',
	'6': 'Cow',
	'7': 'Deer',
	'8': 'Elk',
	'9': 'Goat',
	'10': 'Horse',
	'11': 'Lamb',
	'12': 'Llama',
	'13': 'Mule',
	'14': 'Ox',
	'15': 'Pig',
	'16': 'Rabbit',
	'17': 'Reindeer',
	'18': 'Rooster',
	'19': 'Sheep',
	'20': 'Yak'
}
gen_data['fowl'] = {
	'1': 'Bittern',
	'2': 'Duck',
	'3': 'Finch',
	'4': 'Game hen',
	'5': 'Goose',
	'6': 'Grouse',
	'7': 'Guinea hen',
	'8': 'Heron',
	'9': 'Lark',
	'10': 'Moorhen',
	'11': 'Ostrich',
	'12': 'Partridge',
	'13': 'Pheasant',
	'14': 'Pigeon',
	'15': 'Plover',
	'16': 'Quail',
	'17': 'Snipe',
	'18': 'Thrush',
	'19': 'Turkey',
	'20': 'Woodcock'
}


gen_data['cultural_differences_people'] = {
	'01-05': 'All females must {cultural_differences_item}.',
	'06-10': 'All males are required {cultural_differences_item}',
	'11-15': 'All {married_cultural_differences}',
	'16-20': 'All {class_professions} must {cultural_differences_item}',
	'21-25': 'All {race} are required {cultural_differences_item}',
	'26-30': 'All worshippers of {roman_god} {cultural_differences_item}',
	'31-35': 'All members of the {guilds} must {cultural_differences_item}',
	'36-40': 'All people who are not members of one of the city’s of official guilds must {cultural_differences_item}',
	'41-45': 'All people, including visitors need to {cultural_differences_item}',
	'46-50': 'All residents must {cultural_differences_item}',
	'51-55': 'All {unmarried_cultural_differences}',
	'56-60': 'All visitors are requiered {cultural_differences_item}',
	'61-65': 'All {parents_cultural_differences}',
	'66-70': 'All people who passed the ritual of adulthood are now allowed to {cultural_differences_item}.',
	'71-75': 'All {Criminals} must {cultural_differences_item}.',
	'76-80': 'Members of each political faction wear {cultural_differences_item}.',
	'81-85': '{roman_class} {cultural_differences_item}'
}

gen_data['Criminals'] = {
		'01': 'Insolvent Debtors',
		'02': 'Adulterers',
		'03': 'People who have despoiled a virgin',
		'04': 'Disrespectful children',
		'05': 'Disobedient spouses',
		'06': 'People who abuse children',
		'07': 'People who abuse their Abuse',
		'08': 'People who steal',
		'09': 'Vandals',
		'10': 'People who bear false witness in a civil matter',
		'11': 'Blasphemiers against {roman_god}',
		'12': 'Murderers'
	}
	/*
	TODO: adds
	Accessory to another crime (roll again to determine)

	--Crimes against the family.
	Lewdness, private
	Adultery
	Incest
	Rape

	--crimes against property
	Arson
	Burglary
	Cattle theft or rustling
	Breaking and entering
	Grave robbery
	Horse theft
	Pickpocket
	Piracy
	Receiving stolen goods (fencing)
	Possession of stolen goods

	--crimes against the person
	Assault
	Battery
	Manslaughter
	Kidnapping
	Murder
	Poisoning
	Robbery

	--Financial crimes against the guilds and tax collectors
	Bankruptcy
	Blackmail
	Breach of contract
	Breach of financial duty
	Bribery
	Coin clipping
	Counterfeiting
	Embezzlement
	Escaped slave
	Escaping serfdom
	Extortion
	Forgery
	Harboring a slave
	Selling goods without license
	Selling unlicensed goods
	Tax evasion
	Peddling
	Racketeering
	Sale of shoddy goods
	Shoplifting
	Smuggling
	Swindling
	Theft
	Using false measures
	Watering wine or putting additives into food
	Violation of guild rules
	Soliciting

	--Crimes against the peace
	Possession of forbidden weapon
	Bearing improper armaments
	Begging
	Causing a disturbance
	Inciting to riot
	Cowardice or desertion
	Drug possession
	Drug smuggling
	Drunk and disorderly
	Drunkenness
	False imprisonment
	Forsaking an oath
	Gambling
	Insanity
	Lewdness, public
	Libel
	Ownership of vicious animal
	Prostitution
	Public nuisance
	Public recklessness
	Slander
	Trespass
	Aiding and abetting (criminals or enemies)
	Fleeing crime scene
	Harboring a criminal


	--Crimes against the church
	Consorting with demons
	Blasphemy
	Demonic possession
	Desecration
	Disrespect to clergy
	Heresy
	Witchcraft
	Necromancy
	Participating in forbidden meeting - religious

	--Crimes against the state / rulers
	Disrespect to nobility
	Impersonating an officer of the law
	Misuse of public funds
	Mutiny
	Participating in forbidden meeting - political
	Perjury
	Prison escape
	Violation of local taboo: forbidden speech
	Violation of local taboo: required article of clothing
	Violation of local taboo: required obeisance
	Violation of local taboo: required religious item
	Wearing improper badges of office
	Wearing improper clothing
	Wearing improper signatures of nobility
	Resisting arrest
	Sedition
	Treason
	Sabotage





	Punishments


	--Magical
	 Magical mark
	 Magical curse
	 Magical transformation
	 Placed in magical stasis

	--humiliated
	 Publicly humiliated
	 Stocks

	--Shunned
	 Banishment
	 Drafted into military
	 Prison sentence

	--Religious
	 Excommunicated


	--maimed
	 Maimed
	 Branded
	 Jaw broken
	 Lose ear/eye/nose
	 Lose finger or toe
	 Tongue removed
	 Lose limb
	 Poisoned
	 Thumb screws


	--propbable death
	 Flogged
	 Whipped
	 Clubbed
	 Publicly mauled by animals
	 Fight in the arena
	 Keel-hauled
	 Iron maiden


	--financial
	 Recompense to victim
	 Fined
	 Confiscation of worldly goods
	 Indentured servitude
	 Slavery

	--Capital
	Beheaded
	Hanged

	--Tortured to death
	 Drawn and quartered
	 Rack
	 Starved
	 Burned at the stake
	 Crucified
	 Fed to insect swarm
	 Stoned

	*/


gen_data['class_professions'] = {
	'01': 'Bard',
	'02': 'Cleric',
	'03': 'Druid',
	'04': 'Fighter',
	'05': 'Mage',
	'06': 'Monk',
	'07': 'Paladin',
	'08': 'Ranger',
	'09': 'Rogue'
}
gen_data['guilds'] = {
	'1': 'Apothecaries',
	'2': 'Armourers and Brasiers',
	'3': 'Bakers',
	'4': 'Barbers (surgeons and dentists)',
	'5': 'Basketmakers',
	'6': 'Blacksmiths',
	'7': 'Bowyers (bow makers)',
	'8': 'Brewers',
	'9': 'Broderers (embroiderers)',
	'10': 'Butchers',
	'11': 'Carpenters',
	'12': 'Chandlers (candle makers)',
	'13': 'Clothworkers',
	'14': 'Cordwainers (workers in fine leather)',
	'15': 'Curriers (dressers of tanned leather)',
	'16': 'Cutlers',
	'17': 'Dyers',
	'18': 'Farriers (shoers of horses)',
	'19': 'Fishmongers',
	'20': 'Fletchers (arrow makers)',
	'21': 'Girdlers (girdles and belts as clothing)',
	'22': 'Goldsmiths',
	'23': 'Loriners (stirrups and other harness for horses)',
	'24': 'Masons',
	'25': 'Mercers (general merchants)',
	'26': 'Needlemakers',
	'27': 'Pattenmakers (makers of wooden clog-style footwear)',
	'28': 'Plaisterers (plasterers)',
	'29': 'Plumbers',
	'30': 'Poulters',
	'31': 'Saddlers',
	'32': 'Salters',
	'33': 'Scriveners (writers of court letters and legal documents)',
	'34': 'Skinners',
	'35': 'Tallow chandlers (Candle makers)',
	'36': 'Upholders (upholsterers)',
	'37': 'Vintners',
	'38': 'Wax Chandlers (candle makers)',
	'39': 'Weavers',
	'40': 'Wheelwrights',
	'41': 'Woolmen (winders and packers of wool)'

}

gen_data['married_cultural_differences'] = {
	'01-10': 'married people are required {cultural_differences_item}',
	'11-15': 'Married women need to {cultural_differences_item}. While married men must {cultural_differences_item}'
}
gen_data['unmarried_cultural_differences'] = {
	'01-10': 'unmarried people must {cultural_differences_item}',
	'11-15': 'Unmarried women need to {cultural_differences_item}. While unmarried men have to {cultural_differences_item}'
}
gen_data['parents_cultural_differences'] = {
	'01-10': 'parents are required {cultural_differences_item}',
	'11-15': 'Mothers need to {cultural_differences_item}. While fathers have to {cultural_differences_item}'
}


gen_data['roman_class'] = {
	'01-05': 'Ruling',
	'06-10': 'Military',
	'11-15': 'Merchant',
	'15-20': 'Wealthy Property Owners',
	'21-25': 'Upper Property Owners',
	'26-30': 'Middle Property Owners',
	'31-35': 'Common Propery Owners',
	'36-40': 'Freemen',
	'41-45': 'Slaves',
	'46-50': 'Freed slaves',
	'51-55': 'Resident forigner'
}

gen_data['cultural_differences_item'] = {
	'01-05': 'carry a {small_container}.',
	'06-10': 'wear a {color} {clothing}',
	'11-15': 'wear a Bagde embroidered with a {human_identifying_marks_tattoo}',
	'16-20': 'wear bells on their {clothing}',
	'21-25': 'paint their face with a {color} {human_identifying_marks_tattoo}',
	'26-30': 'wear feathers from a {bird_of_prey} on their {clothing}',
	'31-35': 'wear or carry {flowers}s ',
	'36-40': 'wear {clothing}',
	'41-45': 'wear {silverware_metal} {silverware} on a chain around their neck',
	'46-50': 'wear a {color} {Mask}',
	'51-55': 'wear a {common_metal} collar and bracelet',
	'56-60': 'wear {silverware_metal} rings and earring',
	'61-65': 'have overlong sleeves on their shirts',
	'66-70': 'wear a pointed hat',
	'71-75': 'wear pointed shoes',
	'76-80': 'wear ribbons of various shades of {color}',
	'81-85': 'care for a family relic in the city center',
	'86-90': 'recieve a ritual tattoo of a {human_identifying_marks_tattoo}',
	'91-95': 'wear wide-brimmed hat',
	'96-100': 'wear wooden shoes',
	'101-120': '{hair_styles}'
}

gen_data['hair_styles'] = {
	'01': 'have {human_roman_hair_style} hair',
	'02': 'have long braids',
	'03': 'have braids tight against the head',
	'04': 'have shaved their head'
}


gen_data['entertainers'] = {
	'1': 'Acrobat',
	'2': 'Actor',
	'3': 'Animal trainer',
	'4': 'Artist',
	'5': 'Bard/Minstrel',
	'6': 'Coal walker',
	'7': 'Dancer',
	'8': 'Fortune teller',
	'9': 'Gambler',
	'10': 'Illusionist',
	'11': 'Jester',
	'12': 'Juggler',
	'13': 'Mountebank',
	'14': 'Musician',
	'15': 'Orator',
	'16': 'Poet',
	'17': 'Sculptor',
	'18': 'Singer',
	'19': 'Storyteller',
	'20': 'Sword swallower'
}
gen_data['games'] = {
	'1': 'Arm wrestling',
	'2': 'Aunt Sally',
	'3': 'Backgammon',
	'4': 'Billiards',
	'5': 'Boxing',
	'6': 'Cards',
	'7': 'Charades',
	'8': 'Chess',
	'9': 'Checkers',
	'10': 'Darts',
	'11': 'Dice',
	'12': 'Draughts',
	'13': 'Faro',
	'14': 'Horseshoes',
	'15': 'Mumblety peg',
	'16': 'Orc in the hole',
	'17': 'Pins',
	'18': 'Pitch penny',
	'19': 'Roulette',
	'20': 'Yard of ale'
}

gen_data['small_container'] = {
	'01': 'Small Basket',
	'02': 'Jewelry box',
	'03': 'Spice box',
	'04': 'Small earthenware pot',
	'05': 'Small flower pot',
	'06': 'Small glass globe',
	'07': 'Small Goblet',
	'08': 'Small ivory globe',
	'09': 'Locket',
	'10': 'Pouch',
	'11': 'Tankard with lid'
}

gen_data['clothing'] = {
	'01-05': 'Belt',
	'06-10': 'Boots',
	'11-15': 'Buttons',
	'16-20': 'Cap',
	'21-25': 'Cloak',
	'26-30': 'Fez',
	'31-35': 'Gloves',
	'36-40': 'Hat',
	'41-45': 'Hood',
	'46-50': 'Mask',
	'51-55': 'Medallion',
	'56-60': 'Necklace',
	'61-65': 'Sandals',
	'66-70': 'Sash',
	'71-75': 'Scarf',
	'76-80': 'Shirt',
	'81-85': 'Shoes',
	'86-90': 'Slippers',
	'91-95': 'Trousers',
	'96-00': 'Wig'
}

gen_data['flowers'] = {
	'1': 'Asteriscus',
	'2': 'Baby\'s Breath',
	'3': 'Bell flower',
	'4': 'Borago',
	'5': 'Comfrey',
	'6': 'Daffodil',
	'7': 'Daisy',
	'8': 'Dandelion',
	'9': 'Deinanthe',
	'10': 'Diascia',
	'11': 'Dublin',
	'12': 'Geranium',
	'13': 'Goldband lily',
	'14': 'Goldsturm',
	'15': 'Hacquetia',
	'16': 'Hellebore',
	'17': 'Holly',
	'18': 'Horned violet',
	'19': 'Hosta',
	'20': 'Hyacinth',
	'21': 'Iris',
	'22': 'Lamium',
	'23': 'Matilua',
	'24': 'Meadow rue',
	'25': 'Merrybells',
	'26': 'Mugwort',
	'27': 'Mullien',
	'28': 'Peony',
	'29': 'Persicaria',
	'30': 'Poppy',
	'31': 'Rodgersia',
	'32': 'Rose',
	'33': 'Snowdrop',
	'34': 'Spurge',
	'35': 'Sun flower',
	'36': 'Thistle',
	'37': 'Toadshade',
	'38': 'Tulip',
	'39': 'Wand flower',
	'40': 'Wild flower'
}

gen_data['silverware'] = {
	'1': 'Spoon',
	'2': 'Knife',
	'3': 'Fork'
}
gen_data['silverware_metal'] = {
	'01-05': '{common_metal}',
	'06': '{precious_material}'
}
gen_data['mask'] = {
	'1': 'Mask',
	'2': 'Veil',
	'3': 'Half Veil',
	'4': 'Half Mask',
	'5': 'Hood'
}
