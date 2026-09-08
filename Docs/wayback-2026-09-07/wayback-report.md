# Missing Table Archive Check

Checked: 2026-09-07T12:41:42.839Z. Source commit: `6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0`.

This report checks the Internet Archive Wayback Availability API. It does not download or execute archived page content; no tables are imported or changed.

**An archived page does not confirm that a missing subtable exists in that capture.** Review the exact subtable, source text, weights, history, and contributor attribution before proposing recovery.

A `no-snapshot` result means the API returned no accessible capture for every planned URL variant. It is not proof that the source was never archived. Errors, timeouts, and unattempted URLs are not negative results.

Requested date: latest available capture. Stop reason: `request-budget`.

## Coverage

| Item | Count |
| --- | ---: |
| Missing-reference targets | 861 |
| Targets with an existing local candidate | 174 |
| Targets requiring source-identity review | 4 |
| Planned pages | 260 |
| Pages with an accessible snapshot | 4 |
| Missing targets on those pages, not verified | 18 |
| Pages with no snapshot across planned URLs | 0 |
| Incomplete or unattempted pages | 256 |
| API requests in this run | 5 |
| Retained query errors | 0 |

The scope is the imported wiki quarantine report, not every graph placeholder or every table in the upstream wiki. Absence from the import does not establish that a table is absent from the full source dump.

## Missing Targets

Names and capitalization remain exact. Existing local candidates are kept for separate review. Page requests are deduplicated; table identities are not merged.

| Missing Target | State | Archived Page | Capture |
| --- | --- | --- | --- |
| 1E DMG City Encounter.bandit | not-checked | - | - |
| 1E DMG City Encounter.drunktype | not-checked | - | - |
| 1E DMG City Encounter.drunktype plural | not-checked | - | - |
| 1E DMG City Encounter.giant rat | not-checked | - | - |
| 1st Level Dungeon.potion | not-checked | - | - |
| 50F Encounter Table.Escort Brigantine Statblock | not-checked | - | - |
| 50F Encounter Table.Escort Crumster Statblock | not-checked | - | - |
| 50F Encounter Table.Escort Galleon Statblock | not-checked | - | - |
| 50F Encounter Table.Escort Galley Statblock | not-checked | - | - |
| 50F Encounter Table.Escort Junk Statblock | not-checked | - | - |
| 50F Encounter Table.Escort Sloop Statblock | not-checked | - | - |
| ADVENTURE CAST.Act | local-review | - | - |
| ADVENTURE CAST.construct | not-checked | - | - |
| ADVENTURE CAST.deathtouched | not-checked | - | - |
| ADVENTURE CAST.dragon | not-checked | - | - |
| ADVENTURE CAST.feytouched | not-checked | - | - |
| ADVENTURE CAST.planetouched | not-checked | - | - |
| ARGUS.NOTES | not-checked | - | - |
| Adventurers CC.ADVENTURER\_TYPE | not-checked | - | - |
| AllTheCheeses.Main | local-review | - | - |
| American Census Names.Female | local-review | - | - |
| American Census Names.Male | local-review | - | - |
| American Census Names.Surname | local-review | - | - |
| American Census Names.commonfemale | not-checked | - | - |
| American Census Names.uncommonfemale | not-checked | - | - |
| AmmunitionThrown.NoDescription | not-checked | - | - |
| Angel generator.Title Type | local-review | - | - |
| Angels and demons.female | not-checked | - | - |
| Angels and demons.main | not-checked | - | - |
| Angels and demons.male | not-checked | - | - |
| Angels and demons.titlechance | not-checked | - | - |
| Animal.fantasyAcquatic | not-checked | - | - |
| Animal.fantasyFeatheredAnimal | not-checked | - | - |
| Animal.fantasyFurredAnimal | not-checked | - | - |
| Animal.fantasyLandAnimal | not-checked | - | - |
| Animal.fantasyScaledAnimal | not-checked | - | - |
| Animal.fantasyaquatic | local-review | - | - |
| Animal.fantasycreature | local-review | - | - |
| Animal.fantasyland | local-review | - | - |
| Animal.farmanimal | not-checked | - | - |
| Armor.Color | not-checked | - | - |
| Art, Grace, and Guts Oracle.main | not-checked | - | - |
| Artifacts-D20.d20stat | local-review | - | - |
| Artifacts-D20.for 1 day per HD killed | not-checked | - | - |
| Artwork.main | not-checked | - | - |
| Astonishing Tales Creatures.5th | not-checked | - | - |
| Astonishing Tales Creatures.creature | not-checked | - | - |
| Astonishing Tales Creatures.inspiration | not-checked | - | - |
| Astonishing Tales Creatures.mainstream | not-checked | - | - |
| Astonishing Villain.focus | not-checked | - | - |
| Astonishing Villain.villain | not-checked | - | - |
| Available Dog Generator.14 | not-checked | - | - |
| Available Dog Generator.15 | not-checked | - | - |
| Available Dog Generator.16 | not-checked | - | - |
| B-Movie Title generator.adjective | not-checked | - | - |
| Background Generator for SR.Description | not-checked | - | - |
| Bad Year in Bear Lake.intro | local-review | - | - |
| Barbarian Tribe Generator.\[http:&#47;&#47;www.random-generator.com/index.php?title=Available\_Dog\_Generator'''Roll A Dog'''\] | needs-review | - | - |
| Barrens Menu Generator.MainMeals | not-checked | - | - |
| Bebidas Fantásticas.Liqueur | local-review | - | - |
| Bebidas Fantásticas.LiqueurFlavor | local-review | - | - |
| Blazon.main | not-checked | - | - |
| Blazon.pack | not-checked | - | - |
| Blazon.words | not-checked | - | - |
| Bows.NoDescription | not-checked | - | - |
| Building Description, Fantasy.AfRu | local-review | - | - |
| Building Description, Fantasy.BeersNAles | not-checked | - | - |
| Building Description, Fantasy.Fruit | not-checked | - | - |
| Building Description, Fantasy.Liqueur | not-checked | - | - |
| Building Description, Fantasy.alcoholicdrinks | local-review | - | - |
| Building Description, Fantasy.nonalchoholicdrinks | local-review | - | - |
| CC-Blessings-Curses.BODY\_LOCATIONS | not-checked | - | - |
| CC-Blessings-Curses.PYSCHIC\_POWERS | not-checked | - | - |
| CC-Blessings-Curses.RELATIVES | not-checked | - | - |
| CC-Crimes.Pira-Main | not-checked | - | - |
| CC-Crimes.Under-Main | not-checked | - | - |
| CC-Enslavement.CRIMES | not-checked | - | - |
| CC-Enslavement.NPC-Events-CC | not-checked | - | - |
| CC-Fantasy-Childhood.DEITY | not-checked | - | - |
| CC-Fantasy-Childhood.JOBS | not-checked | - | - |
| CC-Gifts-Legacies.DEBTS | not-checked | - | - |
| CC-Love-Romance.AH\_LOVE | not-checked | - | - |
| CC-Military.Distinguishments | not-checked | - | - |
| CC-Military.MILITARY\_EVENTS | not-checked | - | - |
| CC-Occupations.CRAFT\_B | not-checked | - | - |
| CC-Occupations.MERCHANT | not-checked | - | - |
| CC-Occupations.PRIMITVE\_OCCUPATIONS | not-checked | - | - |
| CC-Race-Events.BUTTHOLES | not-checked | - | - |
| CC-Rivals.JUST\_UNITS | not-checked | - | - |
| CC-Rivals.RIVAL | not-checked | - | - |
| CC-Tragedies.HEAD\_INJURY | not-checked | - | - |
| Castle.LightHeavy | not-checked | - | - |
| Castle.color | not-checked | - | - |
| Centaur Names.FemaleTitle | not-checked | - | - |
| Centaur Names.MaleTitle | not-checked | - | - |
| Clerics.clericalign | not-checked | - | - |
| ClothingFemale.ClothingColors | not-checked | - | - |
| ClothingFemale.FemaleClothing | not-checked | - | - |
| ClothingFemale.FemaleFootwear | not-checked | - | - |
| ClothingFemale.FemaleLegwear | not-checked | - | - |
| ClothingFemale.FemaleLowerSkirtType | not-checked | - | - |
| ClothingFemale.FemaleShirtType | not-checked | - | - |
| ClothingFemale.LegWearColors | local-review | - | - |
| ClothingFemale.MaterialCombosChainmailable | not-checked | - | - |
| ClothingFemale.MaterialCombosCommon | not-checked | - | - |
| ClothingFemale.MaterialCombosFancy | not-checked | - | - |
| ClothingFemale.MaterialCombosLeather | not-checked | - | - |
| ClothingFemale.MaterialsChainmailableCommon | not-checked | - | - |
| ClothingFemale.brightadj | not-checked | - | - |
| CoatOfArms.Four-leggedAttittudes | not-checked | - | - |
| Color.any | not-checked | - | - |
| Color.metalic | not-checked | - | - |
| Compound Word Names.Color | not-checked | - | - |
| Compound Word.Monosyllabic | not-checked | - | - |
| Compound Word.Polysyllabic | not-checked | - | - |
| Compound Word.main | local-review | - | - |
| Cormyr.Cormyr Noble Houeses | not-checked | - | - |
| Creatures.Animal | not-checked | - | - |
| Creatures.Basic Fantastic | not-checked | - | - |
| Creatures.Feathered | not-checked | - | - |
| Creepy Fantasy Villain.Scary | not-checked | - | - |
| Creepy Fantasy Villain.main | not-checked | - | - |
| Curse.cursename | not-checked | - | - |
| Curse.main | not-checked | - | - |
| DOG WIZARDS DICE.4d6 | not-checked | - | - |
| DOG WIZARDS DICE.d20 | not-checked | - | - |
| DOG WIZARDS DICE.highlvls | not-checked | - | - |
| DOG WIZARDS DICE.midlvls | not-checked | - | - |
| DOG WIZARDS.name | not-checked | - | - |
| Deadlands Character Generation.coat | not-checked | - | - |
| Deadlands Character Generation.mpants | not-checked | - | - |
| Deadlands Character Generation.suithat | not-checked | - | - |
| Delver Fate.pit\_result | not-checked | - | - |
| Delver Fate.♂exploration | not-checked | - | - |
| Demon generator.Title Type | local-review | - | - |
| Dice.\(1D6\) \* 10 | not-checked | - | - |
| Dice.\(1D6+1\) \* 10 | not-checked | - | - |
| Dice.100 | not-checked | - | - |
| Dice.1D10 | local-review | - | - |
| Dice.1D10+10 | local-review | - | - |
| Dice.1D100 | local-review | - | - |
| Dice.1D2 | local-review | - | - |
| Dice.1D20 | local-review | - | - |
| Dice.1D3 | local-review | - | - |
| Dice.1D3+1 | local-review | - | - |
| Dice.1D3+2 | local-review | - | - |
| Dice.1D4 | local-review | - | - |
| Dice.1D4+2 | local-review | - | - |
| Dice.1D6 | local-review | - | - |
| Dice.1D8 | local-review | - | - |
| Dice.1d50 | not-checked | - | - |
| Dice.1d6+5 | not-checked | - | - |
| Dice.2D2 | local-review | - | - |
| Dice.2D20 | local-review | - | - |
| Dice.2D4 | local-review | - | - |
| Dice.2D8 | local-review | - | - |
| Dice.2d12+1 | not-checked | - | - |
| Dice.2d4 blocks | not-checked | - | - |
| Dice.3d10 | not-checked | - | - |
| Dice.4D6 | local-review | - | - |
| Dice.Digit | local-review | - | - |
| Dice.Twodthree | local-review | - | - |
| Dice.d20 | not-checked | - | - |
| Dice.d4 | not-checked | - | - |
| Dice.digit+1 | not-checked | - | - |
| Dickensian Names.Last Name Suffix | not-checked | - | - |
| Dickensian Names.Male First | not-checked | - | - |
| DnD 4e character generator.ClericDaily | not-checked | - | - |
| DnD 4e character generator.ClericEncounter | not-checked | - | - |
| DnD 4e character generator.Fighter | not-checked | - | - |
| DnD 4e character generator.FighterPowers | not-checked | - | - |
| DnD 4e character generator.PaladinPowers | not-checked | - | - |
| DnD 4e character generator.RangerPowers | not-checked | - | - |
| DnD 4e character generator.RoguePowers | not-checked | - | - |
| DnD 4e character generator.WarlockPowers | not-checked | - | - |
| DnD 4e character generator.WarlordPowers | not-checked | - | - |
| DnD 4e character generator.WizardPowers | not-checked | - | - |
| DnD Next Magic Item Detail Cruncher.mod +0 | not-checked | - | - |
| Dossier.ForeignCapital | not-checked | - | - |
| Dossier.US Cities | not-checked | - | - |
| Dragon type.horned | not-checked | - | - |
| Drone Generator.main | not-checked | - | - |
| Dueling Character.ArcherShieldColor | not-checked | - | - |
| Dueling Character.AxeHeadDepictionChance | not-checked | - | - |
| Dueling Character.AxeHeadSpike | not-checked | - | - |
| Dueling Character.Metalflavor | not-checked | - | - |
| Dungeon Doors.PortalCoverings | not-checked | - | - |
| Dungeon Dressing.%NSEW | not-checked | - | - |
| Dungeon Dressing.%size | not-checked | - | - |
| Dungeon Dressing.damp flora fauna | not-checked | - | - |
| Dungeon Dressing.drip | not-checked | - | - |
| Dungeon Stocker.Cistern | not-checked | - | - |
| Dungeon Stocker.WaitingRoom | not-checked | - | - |
| Dungeon Stocker.clothing | local-review | - | - |
| Dwarf Names.SGNPNorseMale | not-checked | - | - |
| Dyson Curse.curse | not-checked | - | - |
| Elements.allCap | not-checked | - | - |
| Elements.negativeCap | not-checked | - | - |
| Elf-folk.shape-changer | local-review | - | - |
| Enchanted Items.relic | not-checked | - | - |
| Enchanted Sword.motif | local-review | - | - |
| Epithets.AdjVary | local-review | - | - |
| Epithets.adj2 | local-review | - | - |
| Epithets.people | local-review | - | - |
| Epithets.place | local-review | - | - |
| Epithets.slain | local-review | - | - |
| European Kings.France | not-checked | - | - |
| European Kings.main | not-checked | - | - |
| Evocative Colors.gray | not-checked | - | - |
| Evocative Colors.maleshirts | not-checked | - | - |
| Evocative Colors.sgreen | not-checked | - | - |
| FRUtility.Aglarond | not-checked | - | - |
| FRUtility.Akanul | not-checked | - | - |
| FRUtility.Amn | not-checked | - | - |
| FRUtility.Baldurs Gate | not-checked | - | - |
| FRUtility.Beastlands | not-checked | - | - |
| FRUtility.Calimshan | not-checked | - | - |
| FRUtility.Chessenta | not-checked | - | - |
| FRUtility.Chult | not-checked | - | - |
| FRUtility.Cormyr | not-checked | - | - |
| FRUtility.Dalelands | not-checked | - | - |
| FRUtility.Damara | not-checked | - | - |
| FRUtility.Dambrath | not-checked | - | - |
| FRUtility.Dragon Coast | not-checked | - | - |
| FRUtility.Durpar | not-checked | - | - |
| FRUtility.East Rift | not-checked | - | - |
| FRUtility.Elfharrow | not-checked | - | - |
| FRUtility.Elturgard | not-checked | - | - |
| FRUtility.Erlkazar | not-checked | - | - |
| FRUtility.Estagund | not-checked | - | - |
| FRUtility.Evereska | not-checked | - | - |
| FRUtility.Evermeet | not-checked | - | - |
| FRUtility.Great Dale | not-checked | - | - |
| FRUtility.Halruaa | not-checked | - | - |
| FRUtility.High Imaskar | not-checked | - | - |
| FRUtility.Hordelands | not-checked | - | - |
| FRUtility.Impiltur | not-checked | - | - |
| FRUtility.Lake of Steam | not-checked | - | - |
| FRUtility.Luruar | not-checked | - | - |
| FRUtility.Luskan | not-checked | - | - |
| FRUtility.Many-Arrows | not-checked | - | - |
| FRUtility.Moonsea | not-checked | - | - |
| FRUtility.Moonshae Isles | not-checked | - | - |
| FRUtility.Murghom | not-checked | - | - |
| FRUtility.Myth Drannor | not-checked | - | - |
| FRUtility.Najara | not-checked | - | - |
| FRUtility.Narfell | not-checked | - | - |
| FRUtility.Nelanther Isles | not-checked | - | - |
| FRUtility.Netheril | not-checked | - | - |
| FRUtility.Okoth | not-checked | - | - |
| FRUtility.Rashemen | not-checked | - | - |
| FRUtility.Raurin | not-checked | - | - |
| FRUtility.Sea of Fallen Stars | not-checked | - | - |
| FRUtility.Sembia | not-checked | - | - |
| FRUtility.Tethyr | not-checked | - | - |
| FRUtility.Thay | not-checked | - | - |
| FRUtility.Thesk | not-checked | - | - |
| FRUtility.Turmish | not-checked | - | - |
| FRUtility.Tymanther | not-checked | - | - |
| FRUtility.Vaasa | not-checked | - | - |
| FRUtility.Var the Drowned | not-checked | - | - |
| FRUtility.Velen | not-checked | - | - |
| FRUtility.Vesperin | not-checked | - | - |
| FRUtility.Vilhon Wilds | not-checked | - | - |
| FRUtility.Waterdeep | not-checked | - | - |
| FRUtility.main | not-checked | - | - |
| FaeTroop.FaeWeakness | not-checked | - | - |
| FamousPeople.HumanFemaleDescription | not-checked | - | - |
| Fantasy Adventure Locations.Simplecolor | local-review | - | - |
| Fantasy Adventure Locations.citydaj | not-checked | - | - |
| Fantasy Adventure Locations.colors | not-checked | - | - |
| Fantasy Bakery.DoorAjd | not-checked | - | - |
| Fantasy Bakery.ExoticArchitecture | not-checked | - | - |
| Fantasy Combat Class Generator.Name | not-checked | - | - |
| Fantasy Curses and Blessings.BODY\_LOCATIONS | not-checked | - | - |
| Fantasy Curses and Blessings.RELATIVES | not-checked | - | - |
| Fantasy Landmarks.Coastal | local-review | - | - |
| Fantasy Legacies.OTHER\_DEATH EVENTS | not-checked | - | - |
| Fantasy Life Events.VILLAIN | not-checked | - | - |
| Fantasy Military Service.MILITARY\_EVENTS | not-checked | - | - |
| Fantasy NPC \(Basic\).Main | local-review | - | - |
| Fantasy NPC \(Basic\).Race | not-checked | - | - |
| Fantasy Names.CombinedConsonant | archived-page | [snapshot](https://web.archive.org/web/20250821052415/http://www.random-generator.com/index.php?title=Fantasy_Names) | 20250821052415 |
| Fantasy Names.Consonant | archived-page | [snapshot](https://web.archive.org/web/20250821052415/http://www.random-generator.com/index.php?title=Fantasy_Names) | 20250821052415 |
| Fantasy Names.ConsonantEnd | archived-page | [snapshot](https://web.archive.org/web/20250821052415/http://www.random-generator.com/index.php?title=Fantasy_Names) | 20250821052415 |
| Fantasy Names.FemaleFirstName | archived-page | [snapshot](https://web.archive.org/web/20250821052415/http://www.random-generator.com/index.php?title=Fantasy_Names) | 20250821052415 |
| Fantasy Names.FemalePrefix | archived-page | [snapshot](https://web.archive.org/web/20250821052415/http://www.random-generator.com/index.php?title=Fantasy_Names) | 20250821052415 |
| Fantasy Names.FemaleSuffix | archived-page | [snapshot](https://web.archive.org/web/20250821052415/http://www.random-generator.com/index.php?title=Fantasy_Names) | 20250821052415 |
| Fantasy Names.MainNoLabel | local-review | - | - |
| Fantasy Names.Root I | archived-page | [snapshot](https://web.archive.org/web/20250821052415/http://www.random-generator.com/index.php?title=Fantasy_Names) | 20250821052415 |
| Fantasy Names.Root II | archived-page | [snapshot](https://web.archive.org/web/20250821052415/http://www.random-generator.com/index.php?title=Fantasy_Names) | 20250821052415 |
| Fantasy Names.Root III | archived-page | [snapshot](https://web.archive.org/web/20250821052415/http://www.random-generator.com/index.php?title=Fantasy_Names) | 20250821052415 |
| Fantasy Names.Start | archived-page | [snapshot](https://web.archive.org/web/20250821052415/http://www.random-generator.com/index.php?title=Fantasy_Names) | 20250821052415 |
| Fantasy Names.StartFemaleNoTitle | archived-page | [snapshot](https://web.archive.org/web/20250821052415/http://www.random-generator.com/index.php?title=Fantasy_Names) | 20250821052415 |
| Fantasy Names.hasTitleFemale | archived-page | [snapshot](https://web.archive.org/web/20250821052415/http://www.random-generator.com/index.php?title=Fantasy_Names) | 20250821052415 |
| Fantasy Names.surname | local-review | - | - |
| Fantasy Occupations.MERCHANT | not-checked | - | - |
| Fantasy Pantheon.Main | local-review | - | - |
| Fantasy Person Of Interest.Main | local-review | - | - |
| Fantasy Place Name.inspiration | archived-page | [snapshot](https://web.archive.org/web/20240304191137/http://www.random-generator.com/index.php?title=Fantasy_Place_Name) | 20240304191137 |
| Fantasy Place Name.main | archived-page | [snapshot](https://web.archive.org/web/20240304191137/http://www.random-generator.com/index.php?title=Fantasy_Place_Name) | 20240304191137 |
| Fantasy Place Name.plural | archived-page | [snapshot](https://web.archive.org/web/20240304191137/http://www.random-generator.com/index.php?title=Fantasy_Place_Name) | 20240304191137 |
| Fantasy Place Name.postplace | archived-page | [snapshot](https://web.archive.org/web/20240304191137/http://www.random-generator.com/index.php?title=Fantasy_Place_Name) | 20240304191137 |
| Fantasy Region.Orc Tribe Name | not-checked | - | - |
| Fantasy Region.State | not-checked | - | - |
| Fantasy Romantic History.PYSCHIC\_POWERS | not-checked | - | - |
| Fantasy Spellcasting Class Generator.spellcaster | not-checked | - | - |
| Fantasy Spellcasting Class Generator.spellschool | not-checked | - | - |
| Fantasy Sport.Teamsize | local-review | - | - |
| Fantasy Town \(Simpler\).personeventclause | not-checked | - | - |
| Fantasy Town Feature.building | archived-page | [snapshot](https://web.archive.org/web/20240304174501/http://www.random-generator.com/index.php?title=Fantasy_Town_Feature) | 20240304174501 |
| Fantasy Town Names.suffix | local-review | - | - |
| Fantasy farm description.BeersNAles | not-checked | - | - |
| Fantasy farm description.Fruit | not-checked | - | - |
| Fantasy farm description.Liqueur | not-checked | - | - |
| Fantasy farm description.alcoholicdrinks | local-review | - | - |
| Fantasy farm description.nonalchoholicdrinks | local-review | - | - |
| Fantasy-CC-Traits.EXOTIC | not-checked | - | - |
| Fantasy-CC-Traits.NEUTRAL | not-checked | - | - |
| Fantasy-CC-Traits.UNUSUAL\_SKILLS | not-checked | - | - |
| FantasyBooks.subject | local-review | - | - |
| FantasyCampsite.Features | not-checked | - | - |
| FantasyCampsite.Type | not-checked | - | - |
| FantasyDrinks.DrinkNames | not-checked | - | - |
| FantasyDrinks.Liqueur | local-review | - | - |
| FantasyDrinks.LiqueurFlavor | local-review | - | - |
| FantasyFarmstead.AgricultureProduct | not-checked | - | - |
| FantasyFarmstead.Product | not-checked | - | - |
| FantasyMenu.ExoticMainMeals | not-checked | - | - |
| Feelings.Adjective | local-review | - | - |
| Feelings.bodyfeel | not-checked | - | - |
| Feelings.smooths | not-checked | - | - |
| Female Appearance.Start | not-checked | - | - |
| Field rations.cheesetype | not-checked | - | - |
| Film Noir Monologue.Lady | not-checked | - | - |
| Film Noir Monologue.Outro | not-checked | - | - |
| Firearm Generator.MilitaryIssueChance | not-checked | - | - |
| Foci Generator.main | not-checked | - | - |
| Forgotten Realms Icons.Dragon Triumvirate Locations | not-checked | - | - |
| Forgotten Realms Icons.Lich Zulkir Locations | not-checked | - | - |
| Forgotten Realms Icons.Macguffin | local-review | - | - |
| Formal Names.Start | not-checked | - | - |
| Formal Names.mainNoTitle | not-checked | - | - |
| Found in a crate.main | not-checked | - | - |
| Four Season Events.beast | not-checked | - | - |
| Four Season Events.direction | not-checked | - | - |
| Four Season Events.locations | not-checked | - | - |
| Fourth Page - Artifact.origin | local-review | - | - |
| Future Gear.Radioactive | not-checked | - | - |
| Future Gear.TradeGoods | not-checked | - | - |
| Félix Fénéon Orcale.main | not-checked | - | - |
| G.I. Joe Plot Generator.joecharacter | not-checked | - | - |
| Generic Mission Generator.itempost | not-checked | - | - |
| Generic Sci Fi Character.main | local-review | - | - |
| Germanic Tribe.middle | not-checked | - | - |
| GheronUtility.DietySymbol | not-checked | - | - |
| Goblin.nameob | not-checked | - | - |
| Guards.main | not-checked | - | - |
| Guards.main-resolvedice | not-checked | - | - |
| Guards.virtue | not-checked | - | - |
| HaftedWeapons.NoDescription | not-checked | - | - |
| Herb Names.misc | local-review | - | - |
| Hex Map Key.Numbronesix | not-checked | - | - |
| Hex Map Key.TownCustomsIntro | not-checked | - | - |
| Hex Map Key.metal | local-review | - | - |
| Hex Map Key.personeventclause | not-checked | - | - |
| Hireling.hireling profession | not-checked | - | - |
| Hoard Class.C | not-checked | - | - |
| Hoard Class.MU/E | not-checked | - | - |
| Holy Books.TranslationChance | not-checked | - | - |
| Horror Movie Titles.Action | local-review | - | - |
| Horror Movie Titles.Adj | local-review | - | - |
| Horror Movie Titles.Do | local-review | - | - |
| Horror Movie Titles.Event | local-review | - | - |
| Horror Movie Titles.Guy | local-review | - | - |
| Horror Movie Titles.Main | local-review | - | - |
| Horror Movie Titles.Monster | local-review | - | - |
| Horror Movie Titles.Place | local-review | - | - |
| Horror Movie Titles.Profession | local-review | - | - |
| Horror Movie Titles.Rand1 | local-review | - | - |
| Horror Movie Titles.Room | local-review | - | - |
| Horror Movie Titles.Setting | local-review | - | - |
| Horror Movie Titles.Time | local-review | - | - |
| Horror Movie Titles.Type | local-review | - | - |
| Horse Description.Gender | not-checked | - | - |
| Host Generator.AAA | not-checked | - | - |
| Host Generator.ExEleven | not-checked | - | - |
| Host Generator.ExNine | not-checked | - | - |
| Host Generator.IC | not-checked | - | - |
| Host Generator.IC2 | not-checked | - | - |
| Host Generator.R11 | not-checked | - | - |
| Host Generator.R7 | not-checked | - | - |
| Host Generator.R9 | not-checked | - | - |
| Host Generator.andMatrix | not-checked | - | - |
| Host Generator.color | not-checked | - | - |
| Host Generator.items | not-checked | - | - |
| Host Generator.theme | not-checked | - | - |
| Human Encounter.Bandits | local-review | - | - |
| Human Encounter.Berserkers | local-review | - | - |
| Human Encounter.Border Patrol | local-review | - | - |
| Human Encounter.Caravan | local-review | - | - |
| Human Encounter.Cavemen | local-review | - | - |
| Human Encounter.Dervishes | local-review | - | - |
| Human Encounter.Pilgrims | local-review | - | - |
| Human Encounter.Tribesmen | local-review | - | - |
| Humanoid Encounter.1d4 | not-checked | - | - |
| Humanoid Encounter.Diopsid | local-review | - | - |
| Humanoid Encounter.Dwarf | local-review | - | - |
| Humanoid Encounter.Elf | local-review | - | - |
| Humanoid Encounter.Gnome | local-review | - | - |
| Humanoid Encounter.Goblin | local-review | - | - |
| Humanoid Encounter.Halfling | local-review | - | - |
| Humanoid Encounter.Orc | local-review | - | - |
| Humanoid Encounter.Qward | not-checked | - | - |
| Humanoid Encounter.Tengu | local-review | - | - |
| Humanoid Encounter.medium band | not-checked | - | - |
| Humanoid Encounter.medium barrel | not-checked | - | - |
| Humanoid Encounter.medium bevy | not-checked | - | - |
| Humanoid Encounter.medium brood | not-checked | - | - |
| Humanoid Encounter.medium clowder | not-checked | - | - |
| Humanoid Encounter.medium cluster | not-checked | - | - |
| Humanoid Encounter.medium haven | not-checked | - | - |
| Humanoid Encounter.medium meet | not-checked | - | - |
| Humanoid Encounter.medium redoubt | not-checked | - | - |
| Humanoid Encounter.medium unkindness | not-checked | - | - |
| Humanoid Encounter.medium warband | not-checked | - | - |
| Humanoid Encounter.nine animals | not-checked | - | - |
| Humanoid Encounter.zimbad animals | not-checked | - | - |
| Inn Patrons.cold | not-checked | - | - |
| Inn Patrons.hot | not-checked | - | - |
| Inn Patrons.watery | not-checked | - | - |
| Inscriptions.DefiniteNoun | not-checked | - | - |
| Inscriptions.Inscriptions.Abs\_Noun\_Neg | not-checked | - | - |
| Inscriptions.Inscriptions.Abs\_Noun\_Pos | not-checked | - | - |
| Inscriptions.Main | local-review | - | - |
| Interesting Treasure Hoard Generator.LeatherAnimalType | not-checked | - | - |
| Iron Canyons Wilderness Encounter.Dragon | not-checked | - | - |
| Island.island | not-checked | - | - |
| Japanese names.Male | not-checked | - | - |
| Jewelry.item | local-review | - | - |
| Jewelry.startItemOnly | local-review | - | - |
| Jgbaxter MedievalSocialClass.DisciplineArcana | not-checked | - | - |
| Jgbaxter MedievalSocialClass.Engineer | not-checked | - | - |
| Jgbaxter MedievalSocialClass.GenderPrinceTitle | not-checked | - | - |
| Jgbaxter MedievalSocialClass.Noble | not-checked | - | - |
| Jgbaxter MedievalSocialClass.RelgiousMedium | not-checked | - | - |
| Jgbaxter MedievalSocialClass.ReliiousLow | not-checked | - | - |
| Jgbaxter MedievalSocialClass.Royal | not-checked | - | - |
| Jgbaxter.Personality Sins and Virtues.Quality | not-checked | - | - |
| Jgbaxter.Personality Sins and Virtues.TraitLevelHigh | not-checked | - | - |
| Jgbaxter.Personality Sins and Virtues.TraitLevelLow | not-checked | - | - |
| Jgbaxter.Personality Sins and Virtues.TraitLevelMinimal | not-checked | - | - |
| Jgbaxter.Personality Sins and Virtues.TraitLevelModerate | not-checked | - | - |
| LL Random Magic Item.C | not-checked | - | - |
| LL Random Magic Item.MU/E | not-checked | - | - |
| Lances.NoDescription | not-checked | - | - |
| Level 3 Monster.level2 | not-checked | - | - |
| Linaje Dragon Generator.CHZ-f | not-checked | - | - |
| Linaje Dragon Generator.dah-f | not-checked | - | - |
| Local Secrets.something\_else | local-review | - | - |
| LotFP Spell Lists.LevelFive | not-checked | - | - |
| LotFP Spell Lists.LevelFour | not-checked | - | - |
| LotFP Spell Lists.LevelOne | not-checked | - | - |
| LotFP Spell Lists.LevelSix | not-checked | - | - |
| LotFP Spell Lists.LevelThree | not-checked | - | - |
| LotFP Spell Lists.LevelTwo | not-checked | - | - |
| Lovecraft mythos weird headline.Action | local-review | - | - |
| Lovecraft mythos weird headline.Adj | local-review | - | - |
| Lovecraft mythos weird headline.Do | local-review | - | - |
| Lovecraft mythos weird headline.Event | local-review | - | - |
| Lovecraft mythos weird headline.Guy | local-review | - | - |
| Lovecraft mythos weird headline.Killer | local-review | - | - |
| Lovecraft mythos weird headline.Main | local-review | - | - |
| Lovecraft mythos weird headline.Monster | local-review | - | - |
| Lovecraft mythos weird headline.Place | local-review | - | - |
| Lovecraft mythos weird headline.Profession | local-review | - | - |
| Lovecraft mythos weird headline.Rand1 | local-review | - | - |
| Lovecraft mythos weird headline.Room | local-review | - | - |
| Lovecraft mythos weird headline.Setting | local-review | - | - |
| Lovecraft mythos weird headline.Sex | local-review | - | - |
| Lovecraft mythos weird headline.Time | local-review | - | - |
| Lovecraft mythos weird headline.Type | local-review | - | - |
| Lovecraft mythos weird headline.kicker | not-checked | - | - |
| Lovecraftian Horror Oracle.Main | local-review | - | - |
| Magic Item.A | not-checked | - | - |
| Magic Item.D | not-checked | - | - |
| Magic Item.Magic Item | local-review | - | - |
| Magic Item.Miscellaneous Weapon | not-checked | - | - |
| Magic Item.armor desc | not-checked | - | - |
| Magic Item.description | not-checked | - | - |
| Magic Item.potion | not-checked | - | - |
| Magic Item.random monster from most relevant random encounter table | not-checked | - | - |
| Magic Item.scroll | not-checked | - | - |
| Magic Item.swtype | not-checked | - | - |
| Magic Physics.Chance | not-checked | - | - |
| Magic Sword.Intelligent Sword | local-review | - | - |
| MagicalWondrous.Gemstones | incomplete | - | - |
| Marvel Event Generator.;B-List | not-checked | - | - |
| Marvel Event Generator.A-list Heroes | not-checked | - | - |
| Marvel Event Generator.A-lists | not-checked | - | - |
| Marvel Event Generator.B-list | local-review | - | - |
| Marvel Event Generator.Cosmic | local-review | - | - |
| Marvel Event Generator.D-list | local-review | - | - |
| Marvel Event Generator.Hero | local-review | - | - |
| Marvel Event Generator.Supporting | local-review | - | - |
| Marvel Event Generator.Villains | not-checked | - | - |
| Marvel Event Generator.a-list | local-review | - | - |
| Marvel Event Generator.aftermath | local-review | - | - |
| Marvel Event Generator.bad team | not-checked | - | - |
| Marvel Event Generator.badteam | not-checked | - | - |
| Marvel Event Generator.d-list | local-review | - | - |
| Marvel Event Generator.giant | not-checked | - | - |
| Marvel Event Generator.locations | not-checked | - | - |
| Marvel Event Generator.team | not-checked | - | - |
| Marvel Event Generator.third | not-checked | - | - |
| Marvel Event Generator.villain | local-review | - | - |
| Marvel Event Generator.villains | not-checked | - | - |
| Medieval Encounter.Compass | local-review | - | - |
| Medieval Encounter.Locations | local-review | - | - |
| Medieval Person.beast motivation | not-checked | - | - |
| Medieval Person.environmental | not-checked | - | - |
| Medieval Person.manorbeast | not-checked | - | - |
| Mermaid tails.color | not-checked | - | - |
| Message.any | not-checked | - | - |
| Message.guy | not-checked | - | - |
| Message.main | not-checked | - | - |
| Message.message | not-checked | - | - |
| Messages for the Empress.or so | not-checked | - | - |
| Messages for the Empress.wordswords | not-checked | - | - |
| Metamorphica.creature | not-checked | - | - |
| Middle Eastern Character.ArcherShieldColor | not-checked | - | - |
| Middle Eastern Character.BarbarianArmor | not-checked | - | - |
| Middle Eastern Character.Blunt | not-checked | - | - |
| Middle Eastern Character.HeavyArmor | not-checked | - | - |
| Middle Eastern Character.HeavyShield | not-checked | - | - |
| Middle Eastern Character.LightArmor | not-checked | - | - |
| Middle Eastern Character.LightShield | not-checked | - | - |
| Middle Eastern Character.Swords | not-checked | - | - |
| Middle Eastern Character.TwoHandBlunt | not-checked | - | - |
| Middle Eastern Gear.TwoHandAxe | not-checked | - | - |
| Middle Eastern Gear.TwoHandSwordType | not-checked | - | - |
| Modern Profession.Federal Agent | not-checked | - | - |
| Modern Profession.Profession | local-review | - | - |
| Modifier.p3d6 | not-checked | - | - |
| Musical Instruments.RankEnglishSpecialReligious | not-checked | - | - |
| MusicalInstruments.RankEnglishSpecialReligious | not-checked | - | - |
| Mutant Hordeling.skin app | not-checked | - | - |
| NPC-Events-CC.Tragedy | local-review | - | - |
| Nazi.german surname | not-checked | - | - |
| Nazi.nationality\_aristocratic | not-checked | - | - |
| New Monster Name.Pre | local-review | - | - |
| Nightmares Underneath - 3d6 in Order.Level | not-checked | - | - |
| Nightmares Underneath - Equipment - SS 3.Level | not-checked | - | - |
| Noble Houses.commodity | not-checked | - | - |
| OSR Armor.leather type | not-checked | - | - |
| OSR Dragon Generator.mental disorder | not-checked | - | - |
| Old West Objects.WesternFurishing | not-checked | - | - |
| Orc Names.CapCons | not-checked | - | - |
| Orc Names.CapVowel | not-checked | - | - |
| Orc Names.More | not-checked | - | - |
| Ostler.general-mount | not-checked | - | - |
| Ostler.general-mount-quirk | not-checked | - | - |
| Ostler.intro | not-checked | - | - |
| Ostler.quirk | not-checked | - | - |
| Painting.HistoricalAge | not-checked | - | - |
| Painting.HoldingSentence | not-checked | - | - |
| Painting.PortraitPose | not-checked | - | - |
| Patent Medicine.ameprefixfemale | not-checked | - | - |
| Pathfinder / 3 5 Monster.Pathfinder Outsider \(Aeon, Extraplanar\) | not-checked | - | - |
| Pathfinder Artifact.EnergyType | not-checked | - | - |
| Pathfinder Artifact.RandomEffects | not-checked | - | - |
| Pathfinder Artifact.d20AC | not-checked | - | - |
| Pathfinder Artifact.d20Saves | not-checked | - | - |
| Pathfinder Artifact.d20Skills | not-checked | - | - |
| Pathfinder Artifact.d20Stat | not-checked | - | - |
| Pathfinder Spell List A-D.Emotion/Thought High Level | not-checked | - | - |
| Pathfinder Spell List A-D.Emotion/Thought Low Level | not-checked | - | - |
| Pathfinder Spell List A-D.Emotion/Thought Medium Level | not-checked | - | - |
| Pathfinder Spell List.Ice High Level | not-checked | - | - |
| Pathfinder Spell List.Ice Low Level | not-checked | - | - |
| Pathfinder Spell List.Ice Medium Level | not-checked | - | - |
| Pathfinder Spell List.Wizard 2 | not-checked | - | - |
| Pathfinder spell.inquisitor3 | not-checked | - | - |
| Penny D.Doomsday Devices | not-checked | - | - |
| Penny D.Escape | not-checked | - | - |
| Penny D.subhook | not-checked | - | - |
| Penny For My Thoughts Memory Trigger.shouts | not-checked | - | - |
| Perilous Wilds Creature.size | not-checked | - | - |
| Perilous Wilds Creature.special\_chance\_pre | not-checked | - | - |
| Perilous Wilds Danger.oddity | not-checked | - | - |
| Perilous Wilds Discovery.magic | not-checked | - | - |
| Pickpocket.MidContents | not-checked | - | - |
| Pickpocket.MidNPC | not-checked | - | - |
| Pickpocket.NPCDescriptor | not-checked | - | - |
| Pickpocket.PoorContents | not-checked | - | - |
| Pickpocket.PoorNPC | not-checked | - | - |
| Pickpocket.RichContents | not-checked | - | - |
| Pickpocket.RichNPC | not-checked | - | - |
| Pickpocket.StealVerb | not-checked | - | - |
| Piercings.Start | not-checked | - | - |
| Piercings.middleware | not-checked | - | - |
| Pirate Oracle - Black Sails on the Horizon.main | not-checked | - | - |
| Planarch Codex Parish.item-description-consonant | not-checked | - | - |
| Planet Name.letter | not-checked | - | - |
| Port Rumors.alltowns | not-checked | - | - |
| Potion Provider.mod | not-checked | - | - |
| Prophecies.heard | not-checked | - | - |
| Psychon Mutants.has\_mutation\_select | not-checked | - | - |
| Psychon.tin | not-checked | - | - |
| Pulp Fantasy Nation.Main | local-review | - | - |
| Pulp Villain.major\_aim\_1 | not-checked | - | - |
| Pulp Villain.major\_aim\_2 | not-checked | - | - |
| Pulp Villain.nation | not-checked | - | - |
| Pulp Villain.target\_aim | not-checked | - | - |
| Quick Horrors.main | not-checked | - | - |
| Quick NPC.NPCDescriptor-noarticle | not-checked | - | - |
| Quick PC.GUY | local-review | - | - |
| Quick Populations.anygroup | not-checked | - | - |
| Quick Populations.domestic-animal | not-checked | - | - |
| Quick Populations.power-animal | not-checked | - | - |
| Quick Starting Equipment.adventuregear | not-checked | - | - |
| Quick Starting Equipment.blank | not-checked | - | - |
| Quick levelling.inspiring combat maneuvers | not-checked | - | - |
| Random Datafiles for HMR.mysticalpowers | not-checked | - | - |
| Random Fantasy NPC.EmptyTable | not-checked | - | - |
| Random Humanoid Horde.Level | not-checked | - | - |
| Random Humanoid Horde.Numbronesix | not-checked | - | - |
| Random Tools for Mutant Future.Junk | local-review | - | - |
| Reagent Generator.Animal | not-checked | - | - |
| Reagent Generator.DryGoodsContainer | not-checked | - | - |
| Reagent Generator.Jewelry | not-checked | - | - |
| Reagent Generator.SRanimal | not-checked | - | - |
| Reagent Generator.Stuff | not-checked | - | - |
| Reagent Generator.number | not-checked | - | - |
| Reagent Generator.parts | not-checked | - | - |
| Resting In Town Before Going Back Into The Dungeon.\[https:&#47;&#47;www.dropbox.com/s/s8pu4s9kliv2q42/Original%20Petty%20Gods%20-%20OPG.pdf Petty Gods pdf\] | needs-review | - | - |
| Resting In Town Before Going Back Into The Dungeon.digit | not-checked | - | - |
| Rituals.eventAny | not-checked | - | - |
| Rituals.riteAny | not-checked | - | - |
| Rituals.riteClause | not-checked | - | - |
| Rituals.ritualStart | not-checked | - | - |
| Romance of the Three Kingdoms.ChineseFemaleName | not-checked | - | - |
| Romance of the Three Kingdoms.Rank | not-checked | - | - |
| SCP Foundation Idea Generator.adjective | local-review | - | - |
| SGNP barbarians.BarbarianSurnam | not-checked | - | - |
| SGNP zulu.surname | not-checked | - | - |
| SciFiStowAways. / a lover / an ex-lover / a religious place | not-checked | - | - |
| SciFiStowAways. / meaning | not-checked | - | - |
| Scroll.CaseDecoration | not-checked | - | - |
| Scroll.SpoolMaterial | not-checked | - | - |
| Scroll.main | local-review | - | - |
| Sea Encounters.elfofficers | local-review | - | - |
| Sea Encounters.justthePlace | local-review | - | - |
| Sea Encounters.monstercaptain | local-review | - | - |
| Sea Encounters.zhousurvivors | local-review | - | - |
| Secret Society Title.Main | local-review | - | - |
| Secret Society Title.title | local-review | - | - |
| Secret Society Title.titledescriptor | local-review | - | - |
| Security and Site Generator.AAA | not-checked | - | - |
| Shadowrun Background Generator.Clothes | not-checked | - | - |
| Shadowrun Bar.DowntownBars | not-checked | - | - |
| Shadowrun Bar.EastsideBars | not-checked | - | - |
| Shadowrun Bar.SouthsideBars | not-checked | - | - |
| Shadowrun Bar.WestsideBars | not-checked | - | - |
| Shadowrun Barrens Brew Generator.Drinknames | local-review | - | - |
| Shadowrun Barrens Menu Generator.ExoticMainMeals | not-checked | - | - |
| Shadowrun Barrens Menu Generator.menu | local-review | - | - |
| Shadowrun Border Crossing Generator.BorderSenso8r | not-checked | - | - |
| Shadowrun Border Crossing Generator.range8 | local-review | - | - |
| Shadowrun Bounty Hunting Job Thresholds.FemaleTattoo | local-review | - | - |
| Shadowrun Drone Generator.FletchingColor | not-checked | - | - |
| Shadowrun Firearm Generator.ForeGrip | local-review | - | - |
| Shadowrun Heist Generator.Warding | not-checked | - | - |
| Shadowrun Host Generator.DTSpam | not-checked | - | - |
| Shadowrun Host Generator.SSpam | not-checked | - | - |
| Shadowrun Host Generator.Spam | not-checked | - | - |
| Shadowrun Host Generator.black | not-checked | - | - |
| Shadowrun MSP Location Generator.Restaurant | not-checked | - | - |
| Shadowrun MSP Location Generator.SecurityLocation | not-checked | - | - |
| Shadowrun MSP Location Generator.SouthsideStripClubs | not-checked | - | - |
| Shadowrun Reagent Generator.Predicate | not-checked | - | - |
| Shadowrun Security and Site Generator.Warding | not-checked | - | - |
| Shadowrun UCAS Ration Generator.ExoticMainMeals | not-checked | - | - |
| Shadowrun Utility.FemaleNames | not-checked | - | - |
| Shadowrun Utility.MaleNames | not-checked | - | - |
| Shinobi and samurai loot.TwoHandSwordType | not-checked | - | - |
| Ship Description.Main | local-review | - | - |
| Siege Force.LightHeavy | not-checked | - | - |
| Simple Colors.SGREY | not-checked | - | - |
| Simple Colors.brown | not-checked | - | - |
| Simple Colors.gray | not-checked | - | - |
| Simple Colors.sblack | local-review | - | - |
| Simple Colors.sblue | not-checked | - | - |
| Simple Colors.sbrown | local-review | - | - |
| Simple Colors.scan | local-review | - | - |
| Simple Colors.sgray | local-review | - | - |
| Simple Colors.sgreen | not-checked | - | - |
| Simple Colors.sgrey | not-checked | - | - |
| Simple Colors.sorange | not-checked | - | - |
| Simple Colors.spink | not-checked | - | - |
| Simple Colors.spurple | not-checked | - | - |
| Simple Colors.sred | not-checked | - | - |
| Simple Colors.swhite | local-review | - | - |
| Simple Colors.syellow | not-checked | - | - |
| Simple Colors.white | not-checked | - | - |
| Sky Island in Shattered Eberron.Eberron sea | local-review | - | - |
| SnW Monster Generator.hd1012 | not-checked | - | - |
| Spells By School.SorcerySuffix | not-checked | - | - |
| Sstabhmontown Hirelings.Dice 1d4+1 | not-checked | - | - |
| Sstabhmontown Hirelings.horseman | not-checked | - | - |
| Sstabhmontown Magic Items.13 | not-checked | - | - |
| Sstabhmontown Magic Items.15 | not-checked | - | - |
| Sstabhmontown Magic Items.17 | not-checked | - | - |
| Sstabhmontown Magic Items.excpetional | not-checked | - | - |
| Sstabhmontown Magic Items.scrolleOne | not-checked | - | - |
| Sstabhmontown Mercenaries.championarmour | not-checked | - | - |
| Sstabhmontown Mercenaries.championshield | not-checked | - | - |
| Sstabhmontown Mercenaries.cleric-champion-magic | not-checked | - | - |
| Sstabhmontown Mercenaries.comandersword | not-checked | - | - |
| Sstabhmontown Mercenaries.druid-champion-magic | not-checked | - | - |
| Sstabhmontown Mercenaries.mu-champion-magic | not-checked | - | - |
| Sstabhmontown Mercenaries.power | not-checked | - | - |
| Sstabhmontown Mercenaries.slcomcomcapha | not-checked | - | - |
| Star Trek: The Next Generation Plot Generator.tngrew | not-checked | - | - |
| Star Wars Random NPC.main | local-review | - | - |
| Starship Breakdowns. / small / large | not-checked | - | - |
| Starship Breakdowns. / too hot / too cold | not-checked | - | - |
| Starting Equipment.adventurer-gear | not-checked | - | - |
| Starting Equipment.any-basic | not-checked | - | - |
| Starting Equipment.any-junk | not-checked | - | - |
| Starting Equipment.anything | not-checked | - | - |
| Starting Equipment.goodarmor | not-checked | - | - |
| Starting Equipment.hireling-gear | not-checked | - | - |
| Starting Equipment.simple-gear | not-checked | - | - |
| Steampunk.powerprefix | not-checked | - | - |
| Stolen Lands Treasure.2d4 | not-checked | - | - |
| Stolen Lands Treasure.moderatepoison | not-checked | - | - |
| Strange Languages.lengish\_word | not-checked | - | - |
| Strange New World.molten\_rocky\_planet | not-checked | - | - |
| Strange New World.oceanic\_rocky\_planet | not-checked | - | - |
| Substances.chunks | local-review | - | - |
| Suburban development names.suffixmed | not-checked | - | - |
| Swords.NoDescription | not-checked | - | - |
| Syfy original movie.a | not-checked | - | - |
| Tavern Entertainer Circuit.Level | not-checked | - | - |
| Terrain Feature.water dragon | not-checked | - | - |
| The Blues Engine.Significant other | not-checked | - | - |
| The Demon's True Name.Carcosa | local-review | - | - |
| The Plum in the Golden Vase.ChineseFemaleName | not-checked | - | - |
| Today At Sea.ships | local-review | - | - |
| Trade Goods.GlassOpacity | not-checked | - | - |
| Treatment-test.Events | not-checked | - | - |
| Unprotected Treasure.C | not-checked | - | - |
| Unprotected Treasure.MU/E | not-checked | - | - |
| Unprotected Treasure.unprotectedtreasure9 | not-checked | - | - |
| User talk:MiSuBa.FemaleHobby | not-checked | - | - |
| User talk:MiSuBa.FemaleJob | not-checked | - | - |
| User talk:MiSuBa.MaleHobby | not-checked | - | - |
| User talk:MiSuBa.MaleJob | not-checked | - | - |
| User:GreyKnight/arcana test.STR 1, DEX 10, WIS 1, 1HP, attack 1 | not-checked | - | - |
| User:GreyKnight/arcana test.STR 5, DEX 10, WIS 13, 1 HP, attack d4 | not-checked | - | - |
| User:Samohtrace.Restaurant | not-checked | - | - |
| User:SirKodiak/Sandbox.actions\_taken | not-checked | - | - |
| Utility.Clothe | not-checked | - | - |
| Utility.Color | not-checked | - | - |
| Utility.Colors | not-checked | - | - |
| Utility.DarkColorsColors | not-checked | - | - |
| Utility.Drinks | not-checked | - | - |
| Utility.FancyCloth | not-checked | - | - |
| Utility.Foodstuffs | not-checked | - | - |
| Utility.FullMeal\(FantasyMenu\) | not-checked | - | - |
| Utility.LeatherAnimalType | not-checked | - | - |
| Utility.MetallicColors | not-checked | - | - |
| Utility.Metals | not-checked | - | - |
| Utility.Nuts | not-checked | - | - |
| Utility.PerfumeScents | not-checked | - | - |
| Utility.TradeGoodsAnimals | not-checked | - | - |
| Utility.Vegetables | not-checked | - | - |
| Utility.WoodsBow | not-checked | - | - |
| Utility.color | not-checked | - | - |
| Utility.flower | local-review | - | - |
| Utility.fruit | local-review | - | - |
| Utility.fur | local-review | - | - |
| Utility.hornivory | local-review | - | - |
| Utility.metal | local-review | - | - |
| Utility.symbols | local-review | - | - |
| Utility.wood | local-review | - | - |
| Vehicle Generator.AirMfg | not-checked | - | - |
| Vehicle Generator.Car | not-checked | - | - |
| Vehicle Generator.CarMfg | not-checked | - | - |
| Vehicle Generator.Decor | not-checked | - | - |
| Vehicle Generator.FirstClassQuality | not-checked | - | - |
| Vehicle Generator.Helo | not-checked | - | - |
| Vehicle Generator.Paint | not-checked | - | - |
| Vehicle Generator.Quality | not-checked | - | - |
| Vehicle Generator.Rating | not-checked | - | - |
| Vehicle Generator.Truck | not-checked | - | - |
| Vehicle Generator.and | not-checked | - | - |
| Vehicle Generator.but | not-checked | - | - |
| Victim Generator.syndicate | not-checked | - | - |
| Village.animal | not-checked | - | - |
| Village.crime | not-checked | - | - |
| Village.digit | not-checked | - | - |
| Village.food | not-checked | - | - |
| Village.local heroes | not-checked | - | - |
| Village.maybeweird | not-checked | - | - |
| Village.quirks | not-checked | - | - |
| Village.weird | not-checked | - | - |
| Wampus Country Magic User Generator.TestOutput | not-checked | - | - |
| Wampus Country Potions.TestOutput | not-checked | - | - |
| Waterdeep Villa.Remarkable Sculpture | not-checked | - | - |
| Weapon Foci Generator.main | not-checked | - | - |
| Weapon Generator.main | not-checked | - | - |
| Weapon Shields.\[file:top.png / 520px\] | needs-review | - | - |
| Weird Fantasy Monster.Level | not-checked | - | - |
| Weird Fantasy Monster.Main | local-review | - | - |
| Weird West Clothing.coatsyle | not-checked | - | - |
| Weird West Clothing.otherhat | not-checked | - | - |
| Weird West Clothing.weird west felthatcolors | not-checked | - | - |
| Weird West Colors.brown\_adj | not-checked | - | - |
| Weird West Colors.felthatcolors | not-checked | - | - |
| Weird West Colors.femhatcolors | not-checked | - | - |
| Weird West Colors.gray\_adj | not-checked | - | - |
| Weird West Colors.hatcolors | not-checked | - | - |
| Weird West Colors.leatheradj | not-checked | - | - |
| Weird West Colors.leathercolor | not-checked | - | - |
| Weird West Colors.malepants | not-checked | - | - |
| Weird West Colors.maleshirts | not-checked | - | - |
| Weird West Colors.pink | not-checked | - | - |
| Weird West Colors.shirts | not-checked | - | - |
| Western Outfit.basic | local-review | - | - |
| Western Outfit.evocativeleather | not-checked | - | - |
| Western Outfit.normalquality | not-checked | - | - |
| Western Outfit.pantscolor | not-checked | - | - |
| Western Outfit.shirtfabric | not-checked | - | - |
| Western Outfit.shirtwithoutvest | not-checked | - | - |
| Western Outfit.shirtwithvest | not-checked | - | - |
| Western Outfit.stripecolors | not-checked | - | - |
| Wild West Personas.1d6+1 | not-checked | - | - |
| Wild West Personas.hairadjective | not-checked | - | - |
| Wild West Personas.uniquefemaleface | not-checked | - | - |
| Wizard Tower.\[http:&#47;&#47;talesofthegrotesqueanddungeonesque.blogspot.com/2012/08/what-type-of-haunting-is-afoot.html\)\] | needs-review | - | - |
| Wizard schools.mainCap | archived-page | [snapshot](https://web.archive.org/web/20170713073228/http://random-generator.com/index.php?title=Wizard_schools) | 20170713073228 |
| Wizard's death-curse.main | local-review | - | - |
| World Generator.Americaculture | not-checked | - | - |
| World Generator.Americaregion | not-checked | - | - |
| World Generator.Americareligion | not-checked | - | - |
| Wrestling names.articlechance | not-checked | - | - |
| Wrestling names.porpernamelast | not-checked | - | - |
| Wuxia Names.surnames\_pinyin | not-checked | - | - |
| Wuxia Organizations.adjective | not-checked | - | - |
| Wuxia Organizations.hyphenated | not-checked | - | - |
| Wuxia Organizations.noun | not-checked | - | - |
| Wuxia Organizations.number | not-checked | - | - |
| Wuxia Organizations.number-plain | not-checked | - | - |
| XBows.NoDescription | not-checked | - | - |
| Zenume Region Names.Owner | local-review | - | - |
| Zenume Settlement and Landmark Names.amount | local-review | - | - |
| Zenume Settlement and Landmark Names.goup2 | not-checked | - | - |
| Zenume Settlement and Landmark Names.jobs | local-review | - | - |
| kaac.houseádi\_clan | not-checked | - | - |

## Query Evidence

The [JSON report](wayback-report.json) retains all source bindings, input hashes, page URL variants, API requests, timestamps, errors, and candidate capture links. A successful availability response is page-level evidence only.

The checker tries HTTP and HTTPS, with and without `www`, for the MediaWiki page and `action=raw` URLs. It stops querying a page after the first valid capture. Other URL layouts or older captures may still require manual research.

Each run is request-limited and sequential. HTTP 403, 429, or 503 stops the run and leaves the remainder pending. Resume into a new output directory; previously completed queries are reused, errors are retried, and different output files are never overwritten.

Only public wiki page URLs are sent to `archive.org`; row contents and contributor records are not sent. The application remains browser-only and does not load this checker.

API documentation: [Wayback Machine APIs](https://archive.org/help/wayback_api.php).
