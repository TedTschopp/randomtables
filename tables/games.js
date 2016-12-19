gen_data['game'] = {
	'01-02': '{game_names}: The game is played with {game_played_with} {game_played_in_this_game_players} {game_played_in_this_game_spectators} {game_played_in_this_game_cheating} {game_played_known_for} {game_played_famous_for}',
}
gen_data['game_played_with'] = {
	'01-02': '{game_played_with_cards}. In order to win: {game_played_with_cards_to_win} During their turn players: {game_played_with_cards_players_turn}',
	'03-04': '{game_played_with_dice}. Winning requires that you  {game_played_with_dice_to_win} During their turn players: {game_played_with_dice_players_turn}',
	'05-06': '{game_played_with_dice} and {game_played_with_board}. In order you have to {game_played_with_board_to_win} During their turn players: {game_played_with_board_players_turn}  ',
	'07-08': '{game_played_with_dice}, {game_played_with_board} and {game_played_with_pieces}. In order to win players need to {game_played_with_board_to_win}  During their turn players: {game_played_with_board_players_turn}',
	'09-10': '{game_played_with_board} and {game_played_with_pieces}. In order to win, you must {game_played_with_board_to_win}  During their turn players: {game_played_with_board_players_turn} '
}
gen_data['game_played_with_cards'] = {
	'01-02': 'A deck of over 100 cards',
	'03-04': 'A deck of 53 cards',
	'05-06': 'A deck of 52 cards',
	'07-08': 'A deck of 24 cards',
	'09-10': 'A deck of 22 cards',
	'11-12': 'A deck with a variable number of cards',
}
gen_data['game_played_with_dice'] = {
	'01-02': 'a single die',
	'03-04': 'a pair of dice',
	'05-06': 'several dice',
	'07-08': 'a cup of dice',
}
gen_data['game_played_with_board'] = {
	'01-05': 'a square board',
	'05-10': 'a rectangular board',
	'11-12': 'a triangular board',
	'13-18': 'a board with a side for each player',
	'19-20': 'a modular board',
}
gen_data['game_played_with_pieces'] = {
	'01-05': 'colored stones / marbles / pawns',
	'05-10': 'pegs',
	'11-12': 'a triangular board',
	'13-18': 'a board with a side for each player',
	'19-20': 'a modular board',
}
gen_data['game_played_with_pieces'] = [
  'stones',
  'marbles',
  'pawns',
  'pegs',
  'chips',
  'carved minature {game_played_with_pieces_minis}'
]
gen_data['game_played_with_pieces_minis'] = [
  'Dragons',
  'Horses',
  'Warlord and his army',
  'The king and his court',
  'The queen and her ladies',
  'The dark lord and his minions',
  'A treasure chest and its contents'
]
gen_data['game_played_in_this_game_players'] = {
	'01-02': 'Players have the opportunity to bet once on each player\'s turn.',
	'03-04': 'Players have several opportunities to bet on each player\'s turn.',
	'05-06': 'Players have several opportunities to bet each round.',
	'07-08': 'Players must bet before the round is played.',
	'09-10': 'Players must bet before the game begins.',
}
gen_data['game_played_in_this_game_spectators'] = {
	'01-16': 'The game is not often played with people watching.',
	'07-12': 'The game is occasionaly watched by afficianitos.',
	'11-12': 'Spectators bet as often as players do.',
	'13-14': 'Spectators typically place bets before the game begins.',
	'15-16': 'Spectators often place bets while the game is in progress.',
}
gen_data['game_played_in_this_game_cheating'] = {
	'01-02': 'Cheating is extremely rare or impossible.',
	'03-04': 'Cheating is difficult, and often occurs with the help of someone else in the room.',
	'05-06': 'Cheating is common.',
	'07-08': 'Cheating is encouraged.'
}
gen_data['game_played_known_for'] = {
	'01-02': 'It is know for low stakes, social gambling.',
	'03-04': 'It\'s know for its simple set of rules.',
	'05-06': 'Everyone knows that the game has a complicated set of rules.',
	'07-08': 'It is know for the ease with which anyone can learn to play.',
	'09-10': 'There is a class of expert players and their elaborate strategies.',
	'11-12': 'It is know for high stakes gambling.'
}
gen_data['game_played_famous_for'] = {
	'01-02': 'Tales are told of a famous bit of cheating that launched a war.',
	'03-04': 'There are stories written about how a war was prevented by someone cheating at this game.',
	'05-06': 'This game is the guilty pleasure of the local royalty.',
	'07-08': 'This game is the game {names}, the legendary wizard lost.',
	'09-10': 'There is a legand that {names}, the loser had to face and defeat a {fantastic_animal}',
	'11-12': 'Gamblers tell the story about {name}, who won {game_played_famous_loss} ',
	'13-50': ' '
}
gen_data['game_played_famous_loss'] = [
  'famous ship {ship_name}',
  'An acient text titled: {acient_texts}',
  'A castle',
  'The keys to the city of {town_name}',
  'A magical sword',
  'A magic wand',
  'the hand of the losers daughter',
  'a large hoard of treasure'
]
gen_data['game_played_origin'] = [
  'The game originated a long time ago in this region.',
  'The game originatedLong ago in a foreign land.',
  'Long ago in an unknown location.',
  'In the recent past in this region.',
  'In the recent past in this very room.',
  'In the recent past in a foreign land.',
  'Down along the docks of a bustling port city.',
  'In a quaint country inn.',
  'In rough-and-tumble urban tavern.',
  'Along a trade route to an exotic land.',
  'In the court of a mighty king or queen.',
  'In the mind of a half-mad wizard.'
]
	/*


	Sailors and pirates.
	Fishermen and dockworkers.
	Thieves and knaves.
	Knights and lords.
	Peasants.
	Dwarves.
	Miners and smiths.
	Goblins and hobgoblins.
	Elves.
	Noblewomen.
	Masons and stonecutters.
	Mages and priests.


	d12 The game originated...


	CARD GAMES
	*/
gen_data['game_played_with_cards_players_turn'] = {
	'01-02': 'Plays a card from his or her hand face up or face down on the table.',
	'03-04': 'Draws one or more cards from a personal deck.',
	'05-06': 'Draws one card from a community deck.',
	'07-08': 'Draws a card from a community deck if he or she has no other plays.',
	'09-10': 'Places a card from his or her hand into the discard pile.',
	'11-12': 'Lays down a pair, a three or four of a kind, or a straight on the table.',
	'13-14': 'Lays down a card to build threes and fours of a kind or straights on the table.',
	'15-16': 'Draws one or more cards from a personal deck.',
}
gen_data['game_played_with_cards_to_win'] = {
	'01-02': 'Play all the cards in his or her hand.',
	'03-04': 'Be holding the highest score at the end of the hand.',
	'05-06': 'Be holding the score closest to a target score.',
	'07-08': 'Hold all the cards in the deck.',
	'09-10': 'Win the most tricks over the course of a round.',
	'11-12': 'Be holding the lowest score at the end of the hand.',
	'13-14': 'Bluff and bet their way to having the lowest scoring hand.',
	'15-16': 'Bluff and bet there way to being the highest scoring hand.',
}
gen_data['game_played_with_dice_players_turn'] = {
	'01-02': 'Rolls once.',
	'03-04': 'Rolls twice, keeping the better results.',
	'05-06': 'Rolls once or twice, keeping the second result on a reroll.',
	'07-08': 'Rolls at the same time as other players.',
	'09-10': 'Rolls and hides the results from other players.',
	'11-12': 'Rolls and hides the results from him- or herself and from other players.',
	'13-14': 'Rolls and hides the results from him- or herself but not from the other players',
	'15-16': 'Rolls and waits for an arbiter to make a ruling.',
}
gen_data['game_played_with_dice_to_win'] = {
	'01-02': 'Have rolled the highest score in play.',
	'03-04': 'Roll the highest possible score.',
	'05-06': 'Roll the lowest possible score.',
	'07-08': 'Have rolled the lowest score in play.',
	'09-10': 'Achieve a target score over the succession of many rolls.',
	'11-12': 'Outscore his or her opponents over the succession of many rolls.',
	'13-14': 'Bluff and bet their way to having the lowest remaining score.',
	'15-16': 'Bluff and bet there way to being the highest remaining score.',
}
gen_data['game_played_with_board_players_turn'] = {
	'01-02': 'Moves one of his or her pieces on the board.',
	'03-04': 'Places a piece on the board.',
	'05-06': 'Moves two or more of his or her pieces on the board.',
	'07-08': 'Places two or more pieces on the board.',
	'09-10': 'Removes one or more of his or her opponent\'s pieces by encircling it or flanking it.',
	'13-14': 'Converts one or more of his or her opponent\'s pieces by encircling it or flanking it.',
	'11-12': 'Halts his or her opponent\'s progress by encircling or flanking one or more of the opponent\'s pieces.',
	'15-16': 'Moves his or her piece closer to a destination space on the board.',
}
gen_data['game_played_with_board_to_win'] = {
	'01-02': 'Capture all of his or her opponents pieces.',
	'03-04': 'Kill all of his or her opponents pieces.',
	'05-06': 'Race his or her opponent\'s pieces through a labyrinth of obstacles.',
	'07-08': 'Maneuver pieces to the far side of his or her opponent\'s territory.',
	'09-10': 'Capture his or her opponent\'s headquarters.',
	'11-12': 'Kill his or her opponent\'s commanding piece.',
	'13-14': 'Score points while navigating pieces through a labyrinth.',
	'15-16': 'Claim territorial positions with pieces before his or her opponent does.',
}
gen_data['game_names'] = [
  "Abduction", "Adrift", "Agency", "Alarm", "Ambush", "Analyze", "Anarchy", "Anticipation", "Ashes to Ashes", "Assassins", "Assemble", "At Sea", "Avant-Garde", "Ax to Grind", "Backbone", "Bad Manners", "Bankroll", "Bankrupt", "Beat the System", "Bed of Roses", "Beef Up", "Best Guess", "Big Hit", "Biohazard", "Black Arts", "Black Market", "Blessings", "Blitzkreig", "Blizzard", "Bloodborn", "Bolster", "Bombardment", "Bonedust", "Boundaries", "Brawl", "Break Down", "Breakdown", "Brother Bother", "Buccaneers", "Bull's Eye", "Burrow", "Buzz", "Carnage", "Cast Down", "Cat Burglar", "Cat and Mouse", "Champions", "Charge", "Chime In", "Cipher", "Clamor", "Clandestine", "Clash", "Classified", "Clear As Day", "Cloak and Dagger", "Cloud Nine", "Cloudburst", "Coffee Break", "Coincidence", "Collapse", "Collision", "Compass", "Complot", "Confinement", "Conquest", "Contrast", "Cookie Crumbles", "Counterplot", "Countersign", "Cross Swords", "Crusade", "Cryptic Crypts", "Crystals", "Cunning", "Cured", "Custody", "Cut Loose", "Daydream", "Delight", "Delusion", "Deserted", "Destiny", "Devolution", "Disclosed", "Disguise", "Dismantle", "Dissaray", "Dodge", "Dominion", "Double Trouble", "Down the Drain", "Dragon Slayer", "Dreamland", "Dynamite", "Eclipse", "Effigy", "Eggs in One Basket", "Embezzler", "Emergency", "Empower", "Enchantments", "Endurance", "Enigma", "Entangled", "Entity", "Envision", "Escape", "Espionage", "Evolution", "Exorcism", "Expedition", "Extermination", "Extinction", "False Pretense", "Fame", "Fame and Fortune", "Fata Morgana", "Fifty Fifty", "Fighting Chance", "Figments", "Flabbergasted", "Flourish", "Fluke", "Flush Out", "Flying Colors", "Focal Point", "Foiled", "Fool's Paradise", "Forfeit", "Forsaken", "Foundations", "Fracas", "Gambol", "Gem Jam", "Generations", "Getaway", "Ghost Whisperer", "Go For Broke", "Go Under", "Good Times", "Gophers", "Grand Slam", "Grapple", "Groundwork", "Guerrilla", "Guesstimation", "Haphazard", "Harmonize", "Have a Look", "Havoc", "Hazard", "Heat", "Heave Ho", "Heckler", "Heirlooms", "Held Captive", "Hijacked", "Hone In", "Honesty", "Horse Around", "Hot Potato", "Hunting Grounds", "Hush Hush", "Ignorance is Bliss", "Illusions", "Immunity", "Impersonate", "Impulse", "In the Cards", "Incognito", "Inferno", "Ingenuity", "Inquire", "Inside Out", "Interference", "Interruption", "Intrusion", "Invasion", "Isolation", "Jabber", "Jackpot", "Jaw Dropper", "Jingle Jangle", "Karma", "Keep in Sight", "Key Word", "Kiss Goodbye", "Knock Off", "Knuckle Down", "Lap of Luxury", "Let Loose", "Life Spark", "Lightspeed", "Lightyear", "Limbo", "Limelight", "Loan Shark", "Long Con", "Long Shot", "Loophole", "Loyalty", "Magic Number", "Mania", "Manipulation", "Massacre", "Mastery", "Medium", "Memento", "Menace", "Metamorphose", "Miracles", "Mismatch", "Mithril", "Mix It Up", "Monarchy", "Monkey Business", "Morale", "Morality", "Mortal Beings", "Moxie", "Multiply", "Mutation", "Mystical Myths", "Negotiations", "Neutralize", "Nightowl", "No Prisoners", "Nonsense", "Nourish", "Obliterate", "Oblivion", "Obscurity", "Obsidian", "Obsolete", "Occult", "Offhand", "On The Rocks", "On the Line", "On the Prowl", "One-Track Mind", "Oomph", "Open Sesame", "Operator", "Opposition", "Oracle", "Orbit", "Order", "Out of View", "Out the Window", "Overpower", "Overthrow", "Paradise", "Password", "Patterns", "Peasants", "Penumbra", "Peons", "Peril", "Perish", "Persistence", "Phantom", "Phobia", "Pickpocket", "Pilgrimage", "Pitfall", "Platform", "Play With Fire", "Plunge", "Poppycock", "Probe", "Prodigy", "Promotion", "Prospects", "Prosperity", "Puppet Master", "Pursuit", "Quads", "Quarrel", "Quest", "Rack and Ruin", "Raise Dough", "Rapture", "Redemption", "Reign", "Reinforcements", "Rejuvenate", "Relics", "Resources", "Revelations", "Rifts", "Risky Business", "Road to Ruin", "Roll Back", "Rope In", "Safeguard", "Savvy", "Scot-Free", "Scraps", "Scrapyard", "Scrimmage", "Seasons", "Secure", "Sensations", "Sentinels", "Sequence", "Serendipity", "Set Sail", "Set Up", "Setback", "Shackled", "Shift Gears", "Shipwreck", "Shock Phase", "Shore Up", "Shortstop", "Shot in the Dark", "Show Off", "Sidestep", "Signal", "Skirmish", "Sleight of Hand", "Sorcery", "Speculation", "Spotlight", "Squires", "Staged", "Stay the Course", "Steamroll", "Stocks", "Stones Unturned", "Storm", "Straitjacket", "Streak of Luck", "Strife", "Stroke of Luck", "Stupefy", "Stupidity", "Submerged", "Subtlety", "Surrender", "Suspense", "Suspension of Disbelief", "Sustenance", "Swamps", "Swindle", "Swindled", "Switched", "Tact", "Take Away", "Tempt Fate", "Termination", "Terra Form", "The Shattering", "The Skids", "The Void", "Thin Ice", "Time Out", "Top Secret", "Torpedo", "Tragedy", "Train of Thought", "Treachery", "Tread the Boards", "Treason", "Trespasser", "Trials and Tribulations", "Trigger Finger", "Trigger Happy", "Trio", "Triumph", "Tug of War", "Turn of the Cards", "Twilight", "Tycoons", "Umbrage", "Undead", "Under Wraps", "Under the Table", "Undercover", "Underground", "Unforeseen", "Utopia", "Vanish", "Venture", "Voodoo", "Wager", "Wait Out", "Way of Life", "Wayward", "Wildcat", "Wipe Out", "Wisdom", "Wit", "Without a Trace", "Wrecking Ball", "Wriggle Room"
]
	/*
	d8 The highest card or hand is called...
	The dragon.
	The lord.
	The crown.
	The queen.
	The alchemist.
	The knight.
	The champion.
	The eagle.
	d8 The lowest card or hand is called...
	The worm.
	The beggar.
	The rat.
	The fool.
	The crone.
	The devil.
	The villain.
	The pigeon.
	d8 The highest roll is called...
	The dragon.
	The keep.
	The warship.
	The maiden.
	The thunder.
	The shark.
	The tower.
	The sorcerer.
	d8 The lowest roll is called...
	The snake.
	The thief.
	The dinghy.
	The hag.
	The ghost ship.
	The tuna.
	The pits.
	The demon.
	BOARD GAMES
	d8 On a typical turn, the player...
	d8 The weakest piece or biggest blunder is called...
	The minion.
	The foot soldier.
	The goblin.
	The goon.
	The guard.
	The skeleton.
	The trap.
	The club.

	*/
