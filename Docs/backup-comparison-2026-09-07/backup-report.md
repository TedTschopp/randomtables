# Backup Definition Comparison

Audit date: 2026-09-07.

**54 missing target names have positive-weight definitions in additional wiki XML snapshots.** Another 5 have candidates only in converted collections. 129 already have definitions in the current XML history.

**No tables were imported, renamed, enabled, or repaired.** A matching definition is a recovery candidate, not a verified executable restoration. Exact page and subtable identities, weights, dependencies, contributor attribution, and historical intent still require review.

## Results

| Target Classification | Count |
| --- | ---: |
| Already in the current XML history | 129 |
| Additional original wiki XML evidence | 54 |
| Converted-copy-only candidates | 5 |
| Definitions without positive-weight rows | 3 |
| No matching definition in inspected sources | 492 |
| Case-only definitions requiring identity review | 0 |
| Existing local case candidates, excluded from comparison | 174 |
| Malformed identities, excluded from comparison | 4 |
| Total unresolved target names | 861 |

683 exact target identities were compared. 129 of the baseline matches occur only in older retained revisions, not the latest revision of that page identity. These counts are target names, not pages, files, unique revisions, or the number of tables that would become runnable.

## Inspected Sources

The planned scope is complete: 15 explicitly named history XML snapshots and 3 converted collections containing 982 table files. 388,405 XML revision records were inspected across the snapshots. This revision count includes repeated fragments and copied history; it is not a count of unique revisions.

| Source | Kind | Files | XML Revision Records | Exact Positive Target Matches |
| --- | --- | ---: | ---: | ---: |
| [random\_generatorcom-20120618](https://archive.org/download/wiki-random_generatorcom/random_generatorcom-20120618-history.xml.7z) | wiki-export | 1 | 1,182 | 53 |
| [random\_generatorcom-20140203](https://archive.org/download/wiki-random_generatorcom/random_generatorcom-20140203-history.xml.7z) | wiki-export | 1 | 17,348 | 117 |
| [random\_generatorcom-20140329](https://archive.org/download/wiki-random_generatorcom/random_generatorcom-20140329-history.xml.7z) | wiki-export | 1 | 18,080 | 125 |
| [random\_generatorcom-20140706](https://archive.org/download/wiki-random_generatorcom/random_generatorcom-20140706-history.xml.7z) | wiki-export | 1 | 21,348 | 152 |
| [random\_generatorcom-20180505](https://archive.org/download/wiki-random_generatorcom/random_generatorcom-20180505-history.xml.7z) | wiki-export | 1 | 36,160 | 125 |
| [random\_generatorcom-20200225](https://archive.org/download/wiki-random_generatorcom/random_generatorcom-20200225-history.xml.7z) | wiki-export | 1 | 40,016 | 129 |
| [markanddaveyrandom\_generatorcom-20140213](https://archive.org/download/wiki-markanddaveyrandom_generatorcom/markanddaveyrandom_generatorcom-20140213-history.xml.7z) | wiki-export | 1 | 17,365 | 117 |
| [markanddaveyrandom\_generatorcom-20140325](https://archive.org/download/wiki-markanddaveyrandom_generatorcom/markanddaveyrandom_generatorcom-20140325-history.xml.7z) | wiki-export | 1 | 18,079 | 125 |
| [markanddaveyrandom\_generatorcom-20180504](https://archive.org/download/wiki-markanddaveyrandom_generatorcom/markanddaveyrandom_generatorcom-20180504-history.xml.7z) | wiki-export | 1 | 36,160 | 125 |
| [markanddaveyrandom\_generatorcom-20180505](https://archive.org/download/wiki-markanddaveyrandom_generatorcom/markanddaveyrandom_generatorcom-20180505-history.xml.7z) | wiki-export | 1 | 36,160 | 125 |
| [markanddaveyrandom\_generatorcom-20200212](https://archive.org/download/wiki-markanddaveyrandom_generatorcom/markanddaveyrandom_generatorcom-20200212-history.xml.7z) | wiki-export | 1 | 40,059 | 129 |
| [spycraftrandom\_generatorcom-20120414](https://archive.org/download/wiki-spycraftrandom_generatorcom/spycraftrandom_generatorcom-20120414-history.xml.7z) | wiki-export | 1 | 12,129 | 87 |
| [spycraftrandom\_generatorcom-20140325](https://archive.org/download/wiki-spycraftrandom_generatorcom/spycraftrandom_generatorcom-20140325-history.xml.7z) | wiki-export | 1 | 18,079 | 125 |
| [spycraftrandom\_generatorcom-20180505](https://archive.org/download/wiki-spycraftrandom_generatorcom/spycraftrandom_generatorcom-20180505-history.xml.7z) | wiki-export | 1 | 36,160 | 125 |
| [spycraftrandom\_generatorcom-20200209](https://archive.org/download/wiki-spycraftrandom_generatorcom/spycraftrandom_generatorcom-20200209-history.xml.7z) | baseline | 1 | 40,080 | 129 |
| [scadding-MyUniverse](https://github.com/scadding/MyUniverse/tree/c2aaa5e3d9c04954c57b7e9dbed029c1cd9bf351) | converted-tables | 463 | 0 | 53 |
| [scadding-MyUniverse\_V2](https://github.com/scadding/MyUniverse_V2/tree/c3aedf8e925618e197be552eaa5e52b85c8fc71c) | converted-tables | 512 | 0 | 53 |
| [ToddAT-ramban](https://github.com/ToddAT/ramban/tree/19e7b0b3cf212b38f7dc83ee0f825056b8203118) | converted-tables | 7 | 0 | 0 |

Source counts overlap. The MyUniverse versions are related copies, not independent corroboration. A complete scan means all files in this explicit plan were parsed successfully; it does not establish that their original wiki exports were complete.

The [JSON evidence](backup-report.json) records source URLs, pinned repository revisions, source-file hashes, decoded XML hashes, definition variants, page IDs, locations, first and last retained matching revisions, and hashes of the full retained revision evidence. Raw table rows are not republished here. The verified local scan cache retains the complete definition and revision evidence.

## Additional XML Definitions

These target names are absent as positive-weight definitions from the current XML history but occur in at least one inspected alternate snapshot. A retained definition may have been deliberately removed or may depend on other unavailable tables.

| Target | XML Sources With Positive Rows | Distinct XML Definition Variants |
| --- | ---: | ---: |
| Blazon.main | 1 | 18 |
| Blazon.pack | 1 | 4 |
| Blazon.words | 1 | 8 |
| Creepy Fantasy Villain.Scary | 8 | 13 |
| Creepy Fantasy Villain.main | 8 | 5 |
| Curse.cursename | 6 | 8 |
| Curse.main | 6 | 12 |
| Found in a crate.main | 8 | 10 |
| Guards.main | 1 | 1 |
| Guards.main-resolvedice | 1 | 1 |
| Guards.virtue | 1 | 1 |
| Hireling.hireling profession | 6 | 1 |
| LotFP Spell Lists.LevelFive | 4 | 1 |
| LotFP Spell Lists.LevelFour | 4 | 1 |
| LotFP Spell Lists.LevelOne | 4 | 1 |
| LotFP Spell Lists.LevelSix | 4 | 1 |
| LotFP Spell Lists.LevelThree | 4 | 1 |
| LotFP Spell Lists.LevelTwo | 4 | 1 |
| Modifier.p3d6 | 1 | 2 |
| Ostler.general-mount | 6 | 1 |
| Ostler.general-mount-quirk | 6 | 4 |
| Ostler.intro | 6 | 2 |
| Ostler.quirk | 6 | 18 |
| Pickpocket.MidContents | 8 | 3 |
| Pickpocket.MidNPC | 8 | 1 |
| Pickpocket.NPCDescriptor | 8 | 1 |
| Pickpocket.PoorContents | 8 | 1 |
| Pickpocket.PoorNPC | 8 | 1 |
| Pickpocket.RichContents | 8 | 2 |
| Pickpocket.RichNPC | 8 | 1 |
| Pickpocket.StealVerb | 8 | 1 |
| Quick Horrors.main | 1 | 9 |
| Quick Populations.anygroup | 1 | 4 |
| Quick Populations.domestic-animal | 1 | 9 |
| Quick Populations.power-animal | 1 | 15 |
| Rituals.eventAny | 8 | 6 |
| Rituals.riteAny | 8 | 5 |
| Rituals.riteClause | 8 | 9 |
| Rituals.ritualStart | 8 | 13 |
| Starting Equipment.adventurer-gear | 6 | 1 |
| Starting Equipment.any-basic | 6 | 1 |
| Starting Equipment.any-junk | 6 | 2 |
| Starting Equipment.anything | 6 | 8 |
| Starting Equipment.goodarmor | 6 | 1 |
| Starting Equipment.hireling-gear | 6 | 1 |
| Starting Equipment.simple-gear | 6 | 1 |
| Village.animal | 6 | 1 |
| Village.crime | 6 | 8 |
| Village.digit | 6 | 2 |
| Village.food | 6 | 1 |
| Village.local heroes | 6 | 3 |
| Village.maybeweird | 6 | 1 |
| Village.quirks | 6 | 3 |
| Village.weird | 6 | 18 |

## Converted-Only Candidates

Filename stems suggest page identity but do not establish original wiki provenance. Wrappers, rewritten references, commented-out rows, and mixed-source content need separate fidelity and attribution review.

| Target | Distinct Positive Definition Variants |
| --- | ---: |
| Fantasy Names.Start | 2 |
| Female Appearance.Start | 2 |
| Piercings.Start | 2 |
| Random Humanoid Horde.Level | 1 |
| Weird Fantasy Monster.Level | 1 |

## Recovery Constraints

- Start review with original XML definitions. Select a defensible historical revision and check why the definition is absent from the current page.
- Trace every positive-weight dependency and relevant template before estimating runnable recovery. Affected-table counts are not recovery counts.
- Preserve exact case, punctuation, Unicode, weights, significant whitespace, source hashes, revision evidence, and contributor attribution. Do not create name aliases.
- Any later wiki import must include all other tables from the same contributors under the existing contributor-wide selection and collision safeguards.
- Do not promote converted-only wrappers as original wiki definitions without a separate, explicit decision.
- Keep the three no-positive-row definitions unresolved; an empty header does not provide a usable distribution.

## Limits

The scanner checks active semicolon-named subtables inside wiki `sgtable` blocks and matching headers in the selected converted files. It ignores wiki comments and `nowiki` text for definition detection. Renamed pages, case changes, aliases, other generator formats, and tables in unplanned packages are not automatically equated.

Only the explicitly inventoried `*-history.xml.7z` snapshots were compared. Other `wikidump.7z` packages and Wayback HTML captures were not exhaustively inspected. No matching definition means none was found in the inspected scope, not that the source is permanently lost.

The XML files are MediaWiki exports, not original SQL database backups. All comparison tools are optional local maintenance tools; the application remains static, browser-only, and offline.

## Complete Target List

| Target | Classification |
| --- | --- |
| 1E DMG City Encounter.bandit | No positive-weight rows |
| 1E DMG City Encounter.drunktype | Not found in inspected sources |
| 1E DMG City Encounter.drunktype plural | Not found in inspected sources |
| 1E DMG City Encounter.giant rat | Not found in inspected sources |
| 1st Level Dungeon.potion | Not found in inspected sources |
| 50F Encounter Table.Escort Brigantine Statblock | Not found in inspected sources |
| 50F Encounter Table.Escort Crumster Statblock | Not found in inspected sources |
| 50F Encounter Table.Escort Galleon Statblock | Not found in inspected sources |
| 50F Encounter Table.Escort Galley Statblock | Not found in inspected sources |
| 50F Encounter Table.Escort Junk Statblock | Not found in inspected sources |
| 50F Encounter Table.Escort Sloop Statblock | Not found in inspected sources |
| ADVENTURE CAST.Act | Existing local case candidate; excluded |
| ADVENTURE CAST.construct | Not found in inspected sources |
| ADVENTURE CAST.deathtouched | Not found in inspected sources |
| ADVENTURE CAST.dragon | Not found in inspected sources |
| ADVENTURE CAST.feytouched | Not found in inspected sources |
| ADVENTURE CAST.planetouched | Not found in inspected sources |
| ARGUS.NOTES | Not found in inspected sources |
| Adventurers CC.ADVENTURER\_TYPE | Not found in inspected sources |
| AllTheCheeses.Main | Existing local case candidate; excluded |
| American Census Names.Female | Existing local case candidate; excluded |
| American Census Names.Male | Existing local case candidate; excluded |
| American Census Names.Surname | Existing local case candidate; excluded |
| American Census Names.commonfemale | Not found in inspected sources |
| American Census Names.uncommonfemale | Not found in inspected sources |
| AmmunitionThrown.NoDescription | Not found in inspected sources |
| Angel generator.Title Type | Existing local case candidate; excluded |
| Angels and demons.female | Already in current XML history |
| Angels and demons.main | Already in current XML history |
| Angels and demons.male | Already in current XML history |
| Angels and demons.titlechance | Already in current XML history |
| Animal.fantasyAcquatic | Not found in inspected sources |
| Animal.fantasyFeatheredAnimal | Already in current XML history |
| Animal.fantasyFurredAnimal | Already in current XML history |
| Animal.fantasyLandAnimal | Already in current XML history |
| Animal.fantasyScaledAnimal | Already in current XML history |
| Animal.fantasyaquatic | Existing local case candidate; excluded |
| Animal.fantasycreature | Existing local case candidate; excluded |
| Animal.fantasyland | Existing local case candidate; excluded |
| Animal.farmanimal | Already in current XML history |
| Armor.Color | Not found in inspected sources |
| Art, Grace, and Guts Oracle.main | Not found in inspected sources |
| Artifacts-D20.d20stat | Existing local case candidate; excluded |
| Artifacts-D20.for 1 day per HD killed | Not found in inspected sources |
| Artwork.main | Not found in inspected sources |
| Astonishing Tales Creatures.5th | Not found in inspected sources |
| Astonishing Tales Creatures.creature | Not found in inspected sources |
| Astonishing Tales Creatures.inspiration | Not found in inspected sources |
| Astonishing Tales Creatures.mainstream | Not found in inspected sources |
| Astonishing Villain.focus | Not found in inspected sources |
| Astonishing Villain.villain | Not found in inspected sources |
| Available Dog Generator.14 | Not found in inspected sources |
| Available Dog Generator.15 | Not found in inspected sources |
| Available Dog Generator.16 | Not found in inspected sources |
| B-Movie Title generator.adjective | Not found in inspected sources |
| Background Generator for SR.Description | Not found in inspected sources |
| Bad Year in Bear Lake.intro | Existing local case candidate; excluded |
| Barbarian Tribe Generator.\[http:&#47;&#47;www.random-generator.com/index.php?title=Available\_Dog\_Generator'''Roll A Dog'''\] | Malformed identity; excluded |
| Barrens Menu Generator.MainMeals | Not found in inspected sources |
| Bebidas Fantásticas.Liqueur | Existing local case candidate; excluded |
| Bebidas Fantásticas.LiqueurFlavor | Existing local case candidate; excluded |
| Blazon.main | Additional XML definition |
| Blazon.pack | Additional XML definition |
| Blazon.words | Additional XML definition |
| Bows.NoDescription | Not found in inspected sources |
| Building Description, Fantasy.AfRu | Existing local case candidate; excluded |
| Building Description, Fantasy.BeersNAles | Not found in inspected sources |
| Building Description, Fantasy.Fruit | Not found in inspected sources |
| Building Description, Fantasy.Liqueur | Not found in inspected sources |
| Building Description, Fantasy.alcoholicdrinks | Existing local case candidate; excluded |
| Building Description, Fantasy.nonalchoholicdrinks | Existing local case candidate; excluded |
| CC-Blessings-Curses.BODY\_LOCATIONS | Not found in inspected sources |
| CC-Blessings-Curses.PYSCHIC\_POWERS | Not found in inspected sources |
| CC-Blessings-Curses.RELATIVES | Not found in inspected sources |
| CC-Crimes.Pira-Main | Not found in inspected sources |
| CC-Crimes.Under-Main | Not found in inspected sources |
| CC-Enslavement.CRIMES | Not found in inspected sources |
| CC-Enslavement.NPC-Events-CC | Not found in inspected sources |
| CC-Fantasy-Childhood.DEITY | Not found in inspected sources |
| CC-Fantasy-Childhood.JOBS | Not found in inspected sources |
| CC-Gifts-Legacies.DEBTS | Not found in inspected sources |
| CC-Love-Romance.AH\_LOVE | Already in current XML history |
| CC-Military.Distinguishments | Not found in inspected sources |
| CC-Military.MILITARY\_EVENTS | Not found in inspected sources |
| CC-Occupations.CRAFT\_B | Not found in inspected sources |
| CC-Occupations.MERCHANT | Not found in inspected sources |
| CC-Occupations.PRIMITVE\_OCCUPATIONS | Not found in inspected sources |
| CC-Race-Events.BUTTHOLES | Not found in inspected sources |
| CC-Rivals.JUST\_UNITS | Not found in inspected sources |
| CC-Rivals.RIVAL | Not found in inspected sources |
| CC-Tragedies.HEAD\_INJURY | Not found in inspected sources |
| Castle.LightHeavy | Not found in inspected sources |
| Castle.color | Not found in inspected sources |
| Centaur Names.FemaleTitle | Not found in inspected sources |
| Centaur Names.MaleTitle | Not found in inspected sources |
| Clerics.clericalign | Not found in inspected sources |
| ClothingFemale.ClothingColors | Already in current XML history |
| ClothingFemale.FemaleClothing | Already in current XML history |
| ClothingFemale.FemaleFootwear | Already in current XML history |
| ClothingFemale.FemaleLegwear | Already in current XML history |
| ClothingFemale.FemaleLowerSkirtType | Already in current XML history |
| ClothingFemale.FemaleShirtType | Already in current XML history |
| ClothingFemale.LegWearColors | Existing local case candidate; excluded |
| ClothingFemale.MaterialCombosChainmailable | Already in current XML history |
| ClothingFemale.MaterialCombosCommon | Already in current XML history |
| ClothingFemale.MaterialCombosFancy | Already in current XML history |
| ClothingFemale.MaterialCombosLeather | Already in current XML history |
| ClothingFemale.MaterialsChainmailableCommon | Already in current XML history |
| ClothingFemale.brightadj | Already in current XML history |
| CoatOfArms.Four-leggedAttittudes | Not found in inspected sources |
| Color.any | Not found in inspected sources |
| Color.metalic | Not found in inspected sources |
| Compound Word Names.Color | Already in current XML history |
| Compound Word.Monosyllabic | Already in current XML history |
| Compound Word.Polysyllabic | Already in current XML history |
| Compound Word.main | Existing local case candidate; excluded |
| Cormyr.Cormyr Noble Houeses | Not found in inspected sources |
| Creatures.Animal | Not found in inspected sources |
| Creatures.Basic Fantastic | Not found in inspected sources |
| Creatures.Feathered | Not found in inspected sources |
| Creepy Fantasy Villain.Scary | Additional XML definition |
| Creepy Fantasy Villain.main | Additional XML definition |
| Curse.cursename | Additional XML definition |
| Curse.main | Additional XML definition |
| DOG WIZARDS DICE.4d6 | Already in current XML history |
| DOG WIZARDS DICE.d20 | Not found in inspected sources |
| DOG WIZARDS DICE.highlvls | Already in current XML history |
| DOG WIZARDS DICE.midlvls | Already in current XML history |
| DOG WIZARDS.name | Not found in inspected sources |
| Deadlands Character Generation.coat | Not found in inspected sources |
| Deadlands Character Generation.mpants | Not found in inspected sources |
| Deadlands Character Generation.suithat | Not found in inspected sources |
| Delver Fate.pit\_result | Already in current XML history |
| Delver Fate.♂exploration | Not found in inspected sources |
| Demon generator.Title Type | Existing local case candidate; excluded |
| Dice.\(1D6\) \* 10 | Not found in inspected sources |
| Dice.\(1D6+1\) \* 10 | Not found in inspected sources |
| Dice.100 | Not found in inspected sources |
| Dice.1D10 | Existing local case candidate; excluded |
| Dice.1D10+10 | Existing local case candidate; excluded |
| Dice.1D100 | Existing local case candidate; excluded |
| Dice.1D2 | Existing local case candidate; excluded |
| Dice.1D20 | Existing local case candidate; excluded |
| Dice.1D3 | Existing local case candidate; excluded |
| Dice.1D3+1 | Existing local case candidate; excluded |
| Dice.1D3+2 | Existing local case candidate; excluded |
| Dice.1D4 | Existing local case candidate; excluded |
| Dice.1D4+2 | Existing local case candidate; excluded |
| Dice.1D6 | Existing local case candidate; excluded |
| Dice.1D8 | Existing local case candidate; excluded |
| Dice.1d50 | Not found in inspected sources |
| Dice.1d6+5 | Not found in inspected sources |
| Dice.2D2 | Existing local case candidate; excluded |
| Dice.2D20 | Existing local case candidate; excluded |
| Dice.2D4 | Existing local case candidate; excluded |
| Dice.2D8 | Existing local case candidate; excluded |
| Dice.2d12+1 | Not found in inspected sources |
| Dice.2d4 blocks | Not found in inspected sources |
| Dice.3d10 | Not found in inspected sources |
| Dice.4D6 | Existing local case candidate; excluded |
| Dice.Digit | Existing local case candidate; excluded |
| Dice.Twodthree | Existing local case candidate; excluded |
| Dice.d20 | Not found in inspected sources |
| Dice.d4 | Not found in inspected sources |
| Dice.digit+1 | Not found in inspected sources |
| Dickensian Names.Last Name Suffix | Already in current XML history |
| Dickensian Names.Male First | Already in current XML history |
| DnD 4e character generator.ClericDaily | Not found in inspected sources |
| DnD 4e character generator.ClericEncounter | Not found in inspected sources |
| DnD 4e character generator.Fighter | Not found in inspected sources |
| DnD 4e character generator.FighterPowers | Not found in inspected sources |
| DnD 4e character generator.PaladinPowers | Not found in inspected sources |
| DnD 4e character generator.RangerPowers | Not found in inspected sources |
| DnD 4e character generator.RoguePowers | Not found in inspected sources |
| DnD 4e character generator.WarlockPowers | Not found in inspected sources |
| DnD 4e character generator.WarlordPowers | Not found in inspected sources |
| DnD 4e character generator.WizardPowers | Not found in inspected sources |
| DnD Next Magic Item Detail Cruncher.mod +0 | Not found in inspected sources |
| Dossier.ForeignCapital | Already in current XML history |
| Dossier.US Cities | Not found in inspected sources |
| Dragon type.horned | Already in current XML history |
| Drone Generator.main | Not found in inspected sources |
| Dueling Character.ArcherShieldColor | Not found in inspected sources |
| Dueling Character.AxeHeadDepictionChance | Not found in inspected sources |
| Dueling Character.AxeHeadSpike | Not found in inspected sources |
| Dueling Character.Metalflavor | Not found in inspected sources |
| Dungeon Doors.PortalCoverings | Not found in inspected sources |
| Dungeon Dressing.%NSEW | Not found in inspected sources |
| Dungeon Dressing.%size | Not found in inspected sources |
| Dungeon Dressing.damp flora fauna | Not found in inspected sources |
| Dungeon Dressing.drip | Not found in inspected sources |
| Dungeon Stocker.Cistern | Not found in inspected sources |
| Dungeon Stocker.WaitingRoom | Not found in inspected sources |
| Dungeon Stocker.clothing | Existing local case candidate; excluded |
| Dwarf Names.SGNPNorseMale | Not found in inspected sources |
| Dyson Curse.curse | Not found in inspected sources |
| Elements.allCap | Already in current XML history |
| Elements.negativeCap | Already in current XML history |
| Elf-folk.shape-changer | Existing local case candidate; excluded |
| Enchanted Items.relic | Not found in inspected sources |
| Enchanted Sword.motif | Existing local case candidate; excluded |
| Epithets.AdjVary | Existing local case candidate; excluded |
| Epithets.adj2 | Existing local case candidate; excluded |
| Epithets.people | Existing local case candidate; excluded |
| Epithets.place | Existing local case candidate; excluded |
| Epithets.slain | Existing local case candidate; excluded |
| European Kings.France | Not found in inspected sources |
| European Kings.main | Not found in inspected sources |
| Evocative Colors.gray | Not found in inspected sources |
| Evocative Colors.maleshirts | Not found in inspected sources |
| Evocative Colors.sgreen | Not found in inspected sources |
| FRUtility.Aglarond | Not found in inspected sources |
| FRUtility.Akanul | Not found in inspected sources |
| FRUtility.Amn | Not found in inspected sources |
| FRUtility.Baldurs Gate | Not found in inspected sources |
| FRUtility.Beastlands | Not found in inspected sources |
| FRUtility.Calimshan | Not found in inspected sources |
| FRUtility.Chessenta | Not found in inspected sources |
| FRUtility.Chult | Not found in inspected sources |
| FRUtility.Cormyr | Not found in inspected sources |
| FRUtility.Dalelands | Not found in inspected sources |
| FRUtility.Damara | Not found in inspected sources |
| FRUtility.Dambrath | Not found in inspected sources |
| FRUtility.Dragon Coast | Not found in inspected sources |
| FRUtility.Durpar | Not found in inspected sources |
| FRUtility.East Rift | Not found in inspected sources |
| FRUtility.Elfharrow | Not found in inspected sources |
| FRUtility.Elturgard | Not found in inspected sources |
| FRUtility.Erlkazar | Not found in inspected sources |
| FRUtility.Estagund | Not found in inspected sources |
| FRUtility.Evereska | Not found in inspected sources |
| FRUtility.Evermeet | Not found in inspected sources |
| FRUtility.Great Dale | Not found in inspected sources |
| FRUtility.Halruaa | Not found in inspected sources |
| FRUtility.High Imaskar | Not found in inspected sources |
| FRUtility.Hordelands | Not found in inspected sources |
| FRUtility.Impiltur | Not found in inspected sources |
| FRUtility.Lake of Steam | Not found in inspected sources |
| FRUtility.Luruar | Not found in inspected sources |
| FRUtility.Luskan | Not found in inspected sources |
| FRUtility.Many-Arrows | Not found in inspected sources |
| FRUtility.Moonsea | Not found in inspected sources |
| FRUtility.Moonshae Isles | Not found in inspected sources |
| FRUtility.Murghom | Not found in inspected sources |
| FRUtility.Myth Drannor | Not found in inspected sources |
| FRUtility.Najara | Not found in inspected sources |
| FRUtility.Narfell | Not found in inspected sources |
| FRUtility.Nelanther Isles | Not found in inspected sources |
| FRUtility.Netheril | Not found in inspected sources |
| FRUtility.Okoth | Not found in inspected sources |
| FRUtility.Rashemen | Not found in inspected sources |
| FRUtility.Raurin | Not found in inspected sources |
| FRUtility.Sea of Fallen Stars | Not found in inspected sources |
| FRUtility.Sembia | Not found in inspected sources |
| FRUtility.Tethyr | Not found in inspected sources |
| FRUtility.Thay | Not found in inspected sources |
| FRUtility.Thesk | Not found in inspected sources |
| FRUtility.Turmish | Not found in inspected sources |
| FRUtility.Tymanther | Not found in inspected sources |
| FRUtility.Vaasa | Not found in inspected sources |
| FRUtility.Var the Drowned | Not found in inspected sources |
| FRUtility.Velen | Not found in inspected sources |
| FRUtility.Vesperin | Not found in inspected sources |
| FRUtility.Vilhon Wilds | Not found in inspected sources |
| FRUtility.Waterdeep | Not found in inspected sources |
| FRUtility.main | Not found in inspected sources |
| FaeTroop.FaeWeakness | Not found in inspected sources |
| FamousPeople.HumanFemaleDescription | Not found in inspected sources |
| Fantasy Adventure Locations.Simplecolor | Existing local case candidate; excluded |
| Fantasy Adventure Locations.citydaj | Not found in inspected sources |
| Fantasy Adventure Locations.colors | Not found in inspected sources |
| Fantasy Bakery.DoorAjd | Not found in inspected sources |
| Fantasy Bakery.ExoticArchitecture | Not found in inspected sources |
| Fantasy Combat Class Generator.Name | Not found in inspected sources |
| Fantasy Curses and Blessings.BODY\_LOCATIONS | Not found in inspected sources |
| Fantasy Curses and Blessings.RELATIVES | Not found in inspected sources |
| Fantasy Landmarks.Coastal | Existing local case candidate; excluded |
| Fantasy Legacies.OTHER\_DEATH EVENTS | Not found in inspected sources |
| Fantasy Life Events.VILLAIN | Not found in inspected sources |
| Fantasy Military Service.MILITARY\_EVENTS | Already in current XML history |
| Fantasy NPC \(Basic\).Main | Existing local case candidate; excluded |
| Fantasy NPC \(Basic\).Race | Already in current XML history |
| Fantasy Names.CombinedConsonant | Already in current XML history |
| Fantasy Names.Consonant | Already in current XML history |
| Fantasy Names.ConsonantEnd | Already in current XML history |
| Fantasy Names.FemaleFirstName | Already in current XML history |
| Fantasy Names.FemalePrefix | Already in current XML history |
| Fantasy Names.FemaleSuffix | Already in current XML history |
| Fantasy Names.MainNoLabel | Existing local case candidate; excluded |
| Fantasy Names.Root I | Already in current XML history |
| Fantasy Names.Root II | Already in current XML history |
| Fantasy Names.Root III | Already in current XML history |
| Fantasy Names.Start | Converted-copy candidate only |
| Fantasy Names.StartFemaleNoTitle | Already in current XML history |
| Fantasy Names.hasTitleFemale | Already in current XML history |
| Fantasy Names.surname | Existing local case candidate; excluded |
| Fantasy Occupations.MERCHANT | Not found in inspected sources |
| Fantasy Pantheon.Main | Existing local case candidate; excluded |
| Fantasy Person Of Interest.Main | Existing local case candidate; excluded |
| Fantasy Place Name.inspiration | Not found in inspected sources |
| Fantasy Place Name.main | Not found in inspected sources |
| Fantasy Place Name.plural | Not found in inspected sources |
| Fantasy Place Name.postplace | Not found in inspected sources |
| Fantasy Region.Orc Tribe Name | Not found in inspected sources |
| Fantasy Region.State | Not found in inspected sources |
| Fantasy Romantic History.PYSCHIC\_POWERS | Not found in inspected sources |
| Fantasy Spellcasting Class Generator.spellcaster | Already in current XML history |
| Fantasy Spellcasting Class Generator.spellschool | Already in current XML history |
| Fantasy Sport.Teamsize | Existing local case candidate; excluded |
| Fantasy Town \(Simpler\).personeventclause | Not found in inspected sources |
| Fantasy Town Feature.building | Not found in inspected sources |
| Fantasy Town Names.suffix | Existing local case candidate; excluded |
| Fantasy farm description.BeersNAles | Not found in inspected sources |
| Fantasy farm description.Fruit | Not found in inspected sources |
| Fantasy farm description.Liqueur | Not found in inspected sources |
| Fantasy farm description.alcoholicdrinks | Existing local case candidate; excluded |
| Fantasy farm description.nonalchoholicdrinks | Existing local case candidate; excluded |
| Fantasy-CC-Traits.EXOTIC | Not found in inspected sources |
| Fantasy-CC-Traits.NEUTRAL | Not found in inspected sources |
| Fantasy-CC-Traits.UNUSUAL\_SKILLS | Not found in inspected sources |
| FantasyBooks.subject | Existing local case candidate; excluded |
| FantasyCampsite.Features | Not found in inspected sources |
| FantasyCampsite.Type | Not found in inspected sources |
| FantasyDrinks.DrinkNames | Already in current XML history |
| FantasyDrinks.Liqueur | Existing local case candidate; excluded |
| FantasyDrinks.LiqueurFlavor | Existing local case candidate; excluded |
| FantasyFarmstead.AgricultureProduct | Not found in inspected sources |
| FantasyFarmstead.Product | Not found in inspected sources |
| FantasyMenu.ExoticMainMeals | Not found in inspected sources |
| Feelings.Adjective | Existing local case candidate; excluded |
| Feelings.bodyfeel | Not found in inspected sources |
| Feelings.smooths | Not found in inspected sources |
| Female Appearance.Start | Converted-copy candidate only |
| Field rations.cheesetype | Not found in inspected sources |
| Film Noir Monologue.Lady | Already in current XML history |
| Film Noir Monologue.Outro | Not found in inspected sources |
| Firearm Generator.MilitaryIssueChance | Not found in inspected sources |
| Foci Generator.main | Not found in inspected sources |
| Forgotten Realms Icons.Dragon Triumvirate Locations | Already in current XML history |
| Forgotten Realms Icons.Lich Zulkir Locations | Already in current XML history |
| Forgotten Realms Icons.Macguffin | Existing local case candidate; excluded |
| Formal Names.Start | Not found in inspected sources |
| Formal Names.mainNoTitle | Not found in inspected sources |
| Found in a crate.main | Additional XML definition |
| Four Season Events.beast | Already in current XML history |
| Four Season Events.direction | Not found in inspected sources |
| Four Season Events.locations | Already in current XML history |
| Fourth Page - Artifact.origin | Existing local case candidate; excluded |
| Future Gear.Radioactive | Already in current XML history |
| Future Gear.TradeGoods | Not found in inspected sources |
| Félix Fénéon Orcale.main | Not found in inspected sources |
| G.I. Joe Plot Generator.joecharacter | Not found in inspected sources |
| Generic Mission Generator.itempost | Not found in inspected sources |
| Generic Sci Fi Character.main | Existing local case candidate; excluded |
| Germanic Tribe.middle | Not found in inspected sources |
| GheronUtility.DietySymbol | Already in current XML history |
| Goblin.nameob | Already in current XML history |
| Guards.main | Additional XML definition |
| Guards.main-resolvedice | Additional XML definition |
| Guards.virtue | Additional XML definition |
| HaftedWeapons.NoDescription | Not found in inspected sources |
| Herb Names.misc | Existing local case candidate; excluded |
| Hex Map Key.Numbronesix | Not found in inspected sources |
| Hex Map Key.TownCustomsIntro | Already in current XML history |
| Hex Map Key.metal | Existing local case candidate; excluded |
| Hex Map Key.personeventclause | Not found in inspected sources |
| Hireling.hireling profession | Additional XML definition |
| Hoard Class.C | Not found in inspected sources |
| Hoard Class.MU/E | Not found in inspected sources |
| Holy Books.TranslationChance | Not found in inspected sources |
| Horror Movie Titles.Action | Existing local case candidate; excluded |
| Horror Movie Titles.Adj | Existing local case candidate; excluded |
| Horror Movie Titles.Do | Existing local case candidate; excluded |
| Horror Movie Titles.Event | Existing local case candidate; excluded |
| Horror Movie Titles.Guy | Existing local case candidate; excluded |
| Horror Movie Titles.Main | Existing local case candidate; excluded |
| Horror Movie Titles.Monster | Existing local case candidate; excluded |
| Horror Movie Titles.Place | Existing local case candidate; excluded |
| Horror Movie Titles.Profession | Existing local case candidate; excluded |
| Horror Movie Titles.Rand1 | Existing local case candidate; excluded |
| Horror Movie Titles.Room | Existing local case candidate; excluded |
| Horror Movie Titles.Setting | Existing local case candidate; excluded |
| Horror Movie Titles.Time | Existing local case candidate; excluded |
| Horror Movie Titles.Type | Existing local case candidate; excluded |
| Horse Description.Gender | Already in current XML history |
| Host Generator.AAA | Not found in inspected sources |
| Host Generator.ExEleven | Not found in inspected sources |
| Host Generator.ExNine | Not found in inspected sources |
| Host Generator.IC | Not found in inspected sources |
| Host Generator.IC2 | Not found in inspected sources |
| Host Generator.R11 | Not found in inspected sources |
| Host Generator.R7 | Not found in inspected sources |
| Host Generator.R9 | Not found in inspected sources |
| Host Generator.andMatrix | Not found in inspected sources |
| Host Generator.color | Not found in inspected sources |
| Host Generator.items | Not found in inspected sources |
| Host Generator.theme | Not found in inspected sources |
| Human Encounter.Bandits | Existing local case candidate; excluded |
| Human Encounter.Berserkers | Existing local case candidate; excluded |
| Human Encounter.Border Patrol | Existing local case candidate; excluded |
| Human Encounter.Caravan | Existing local case candidate; excluded |
| Human Encounter.Cavemen | Existing local case candidate; excluded |
| Human Encounter.Dervishes | Existing local case candidate; excluded |
| Human Encounter.Pilgrims | Existing local case candidate; excluded |
| Human Encounter.Tribesmen | Existing local case candidate; excluded |
| Humanoid Encounter.1d4 | Not found in inspected sources |
| Humanoid Encounter.Diopsid | Existing local case candidate; excluded |
| Humanoid Encounter.Dwarf | Existing local case candidate; excluded |
| Humanoid Encounter.Elf | Existing local case candidate; excluded |
| Humanoid Encounter.Gnome | Existing local case candidate; excluded |
| Humanoid Encounter.Goblin | Existing local case candidate; excluded |
| Humanoid Encounter.Halfling | Existing local case candidate; excluded |
| Humanoid Encounter.Orc | Existing local case candidate; excluded |
| Humanoid Encounter.Qward | Not found in inspected sources |
| Humanoid Encounter.Tengu | Existing local case candidate; excluded |
| Humanoid Encounter.medium band | Not found in inspected sources |
| Humanoid Encounter.medium barrel | Not found in inspected sources |
| Humanoid Encounter.medium bevy | Not found in inspected sources |
| Humanoid Encounter.medium brood | Not found in inspected sources |
| Humanoid Encounter.medium clowder | Not found in inspected sources |
| Humanoid Encounter.medium cluster | Not found in inspected sources |
| Humanoid Encounter.medium haven | Not found in inspected sources |
| Humanoid Encounter.medium meet | Not found in inspected sources |
| Humanoid Encounter.medium redoubt | Not found in inspected sources |
| Humanoid Encounter.medium unkindness | Not found in inspected sources |
| Humanoid Encounter.medium warband | Not found in inspected sources |
| Humanoid Encounter.nine animals | Not found in inspected sources |
| Humanoid Encounter.zimbad animals | Not found in inspected sources |
| Inn Patrons.cold | Not found in inspected sources |
| Inn Patrons.hot | Not found in inspected sources |
| Inn Patrons.watery | Not found in inspected sources |
| Inscriptions.DefiniteNoun | Already in current XML history |
| Inscriptions.Inscriptions.Abs\_Noun\_Neg | Not found in inspected sources |
| Inscriptions.Inscriptions.Abs\_Noun\_Pos | Not found in inspected sources |
| Inscriptions.Main | Existing local case candidate; excluded |
| Interesting Treasure Hoard Generator.LeatherAnimalType | Not found in inspected sources |
| Iron Canyons Wilderness Encounter.Dragon | Not found in inspected sources |
| Island.island | Not found in inspected sources |
| Japanese names.Male | Not found in inspected sources |
| Jewelry.item | Existing local case candidate; excluded |
| Jewelry.startItemOnly | Existing local case candidate; excluded |
| Jgbaxter MedievalSocialClass.DisciplineArcana | Already in current XML history |
| Jgbaxter MedievalSocialClass.Engineer | Not found in inspected sources |
| Jgbaxter MedievalSocialClass.GenderPrinceTitle | Already in current XML history |
| Jgbaxter MedievalSocialClass.Noble | Not found in inspected sources |
| Jgbaxter MedievalSocialClass.RelgiousMedium | Not found in inspected sources |
| Jgbaxter MedievalSocialClass.ReliiousLow | Not found in inspected sources |
| Jgbaxter MedievalSocialClass.Royal | Not found in inspected sources |
| Jgbaxter.Personality Sins and Virtues.Quality | Already in current XML history |
| Jgbaxter.Personality Sins and Virtues.TraitLevelHigh | Not found in inspected sources |
| Jgbaxter.Personality Sins and Virtues.TraitLevelLow | Not found in inspected sources |
| Jgbaxter.Personality Sins and Virtues.TraitLevelMinimal | Not found in inspected sources |
| Jgbaxter.Personality Sins and Virtues.TraitLevelModerate | Not found in inspected sources |
| LL Random Magic Item.C | Not found in inspected sources |
| LL Random Magic Item.MU/E | Not found in inspected sources |
| Lances.NoDescription | Not found in inspected sources |
| Level 3 Monster.level2 | Already in current XML history |
| Linaje Dragon Generator.CHZ-f | Not found in inspected sources |
| Linaje Dragon Generator.dah-f | Not found in inspected sources |
| Local Secrets.something\_else | Existing local case candidate; excluded |
| LotFP Spell Lists.LevelFive | Additional XML definition |
| LotFP Spell Lists.LevelFour | Additional XML definition |
| LotFP Spell Lists.LevelOne | Additional XML definition |
| LotFP Spell Lists.LevelSix | Additional XML definition |
| LotFP Spell Lists.LevelThree | Additional XML definition |
| LotFP Spell Lists.LevelTwo | Additional XML definition |
| Lovecraft mythos weird headline.Action | Existing local case candidate; excluded |
| Lovecraft mythos weird headline.Adj | Existing local case candidate; excluded |
| Lovecraft mythos weird headline.Do | Existing local case candidate; excluded |
| Lovecraft mythos weird headline.Event | Existing local case candidate; excluded |
| Lovecraft mythos weird headline.Guy | Existing local case candidate; excluded |
| Lovecraft mythos weird headline.Killer | Existing local case candidate; excluded |
| Lovecraft mythos weird headline.Main | Existing local case candidate; excluded |
| Lovecraft mythos weird headline.Monster | Existing local case candidate; excluded |
| Lovecraft mythos weird headline.Place | Existing local case candidate; excluded |
| Lovecraft mythos weird headline.Profession | Existing local case candidate; excluded |
| Lovecraft mythos weird headline.Rand1 | Existing local case candidate; excluded |
| Lovecraft mythos weird headline.Room | Existing local case candidate; excluded |
| Lovecraft mythos weird headline.Setting | Existing local case candidate; excluded |
| Lovecraft mythos weird headline.Sex | Existing local case candidate; excluded |
| Lovecraft mythos weird headline.Time | Existing local case candidate; excluded |
| Lovecraft mythos weird headline.Type | Existing local case candidate; excluded |
| Lovecraft mythos weird headline.kicker | Not found in inspected sources |
| Lovecraftian Horror Oracle.Main | Existing local case candidate; excluded |
| Magic Item.A | Not found in inspected sources |
| Magic Item.D | Not found in inspected sources |
| Magic Item.Magic Item | Existing local case candidate; excluded |
| Magic Item.Miscellaneous Weapon | Already in current XML history |
| Magic Item.armor desc | Already in current XML history |
| Magic Item.description | Already in current XML history |
| Magic Item.potion | Not found in inspected sources |
| Magic Item.random monster from most relevant random encounter table | Not found in inspected sources |
| Magic Item.scroll | Not found in inspected sources |
| Magic Item.swtype | Already in current XML history |
| Magic Physics.Chance | Already in current XML history |
| Magic Sword.Intelligent Sword | Existing local case candidate; excluded |
| MagicalWondrous.Gemstones | Not found in inspected sources |
| Marvel Event Generator.;B-List | Not found in inspected sources |
| Marvel Event Generator.A-list Heroes | Not found in inspected sources |
| Marvel Event Generator.A-lists | Not found in inspected sources |
| Marvel Event Generator.B-list | Existing local case candidate; excluded |
| Marvel Event Generator.Cosmic | Existing local case candidate; excluded |
| Marvel Event Generator.D-list | Existing local case candidate; excluded |
| Marvel Event Generator.Hero | Existing local case candidate; excluded |
| Marvel Event Generator.Supporting | Existing local case candidate; excluded |
| Marvel Event Generator.Villains | Not found in inspected sources |
| Marvel Event Generator.a-list | Existing local case candidate; excluded |
| Marvel Event Generator.aftermath | Existing local case candidate; excluded |
| Marvel Event Generator.bad team | Not found in inspected sources |
| Marvel Event Generator.badteam | Not found in inspected sources |
| Marvel Event Generator.d-list | Existing local case candidate; excluded |
| Marvel Event Generator.giant | Not found in inspected sources |
| Marvel Event Generator.locations | Not found in inspected sources |
| Marvel Event Generator.team | Not found in inspected sources |
| Marvel Event Generator.third | Not found in inspected sources |
| Marvel Event Generator.villain | Existing local case candidate; excluded |
| Marvel Event Generator.villains | Not found in inspected sources |
| Medieval Encounter.Compass | Existing local case candidate; excluded |
| Medieval Encounter.Locations | Existing local case candidate; excluded |
| Medieval Person.beast motivation | Not found in inspected sources |
| Medieval Person.environmental | Already in current XML history |
| Medieval Person.manorbeast | Already in current XML history |
| Mermaid tails.color | Not found in inspected sources |
| Message.any | Not found in inspected sources |
| Message.guy | Not found in inspected sources |
| Message.main | Not found in inspected sources |
| Message.message | Not found in inspected sources |
| Messages for the Empress.or so | Not found in inspected sources |
| Messages for the Empress.wordswords | Already in current XML history |
| Metamorphica.creature | Not found in inspected sources |
| Middle Eastern Character.ArcherShieldColor | Not found in inspected sources |
| Middle Eastern Character.BarbarianArmor | Not found in inspected sources |
| Middle Eastern Character.Blunt | Already in current XML history |
| Middle Eastern Character.HeavyArmor | Already in current XML history |
| Middle Eastern Character.HeavyShield | Already in current XML history |
| Middle Eastern Character.LightArmor | Already in current XML history |
| Middle Eastern Character.LightShield | Already in current XML history |
| Middle Eastern Character.Swords | Not found in inspected sources |
| Middle Eastern Character.TwoHandBlunt | Already in current XML history |
| Middle Eastern Gear.TwoHandAxe | Not found in inspected sources |
| Middle Eastern Gear.TwoHandSwordType | Not found in inspected sources |
| Modern Profession.Federal Agent | Already in current XML history |
| Modern Profession.Profession | Existing local case candidate; excluded |
| Modifier.p3d6 | Additional XML definition |
| Musical Instruments.RankEnglishSpecialReligious | Not found in inspected sources |
| MusicalInstruments.RankEnglishSpecialReligious | Not found in inspected sources |
| Mutant Hordeling.skin app | Not found in inspected sources |
| NPC-Events-CC.Tragedy | Existing local case candidate; excluded |
| Nazi.german surname | Not found in inspected sources |
| Nazi.nationality\_aristocratic | Not found in inspected sources |
| New Monster Name.Pre | Existing local case candidate; excluded |
| Nightmares Underneath - 3d6 in Order.Level | Already in current XML history |
| Nightmares Underneath - Equipment - SS 3.Level | Not found in inspected sources |
| Noble Houses.commodity | Not found in inspected sources |
| OSR Armor.leather type | Not found in inspected sources |
| OSR Dragon Generator.mental disorder | Not found in inspected sources |
| Old West Objects.WesternFurishing | Not found in inspected sources |
| Orc Names.CapCons | Already in current XML history |
| Orc Names.CapVowel | Already in current XML history |
| Orc Names.More | Already in current XML history |
| Ostler.general-mount | Additional XML definition |
| Ostler.general-mount-quirk | Additional XML definition |
| Ostler.intro | Additional XML definition |
| Ostler.quirk | Additional XML definition |
| Painting.HistoricalAge | Not found in inspected sources |
| Painting.HoldingSentence | Not found in inspected sources |
| Painting.PortraitPose | Not found in inspected sources |
| Patent Medicine.ameprefixfemale | Not found in inspected sources |
| Pathfinder / 3 5 Monster.Pathfinder Outsider \(Aeon, Extraplanar\) | Not found in inspected sources |
| Pathfinder Artifact.EnergyType | Already in current XML history |
| Pathfinder Artifact.RandomEffects | Not found in inspected sources |
| Pathfinder Artifact.d20AC | Not found in inspected sources |
| Pathfinder Artifact.d20Saves | Not found in inspected sources |
| Pathfinder Artifact.d20Skills | Not found in inspected sources |
| Pathfinder Artifact.d20Stat | Not found in inspected sources |
| Pathfinder Spell List A-D.Emotion/Thought High Level | No positive-weight rows |
| Pathfinder Spell List A-D.Emotion/Thought Low Level | Already in current XML history |
| Pathfinder Spell List A-D.Emotion/Thought Medium Level | No positive-weight rows |
| Pathfinder Spell List.Ice High Level | Not found in inspected sources |
| Pathfinder Spell List.Ice Low Level | Not found in inspected sources |
| Pathfinder Spell List.Ice Medium Level | Not found in inspected sources |
| Pathfinder Spell List.Wizard 2 | Already in current XML history |
| Pathfinder spell.inquisitor3 | Not found in inspected sources |
| Penny D.Doomsday Devices | Not found in inspected sources |
| Penny D.Escape | Already in current XML history |
| Penny D.subhook | Already in current XML history |
| Penny For My Thoughts Memory Trigger.shouts | Not found in inspected sources |
| Perilous Wilds Creature.size | Not found in inspected sources |
| Perilous Wilds Creature.special\_chance\_pre | Not found in inspected sources |
| Perilous Wilds Danger.oddity | Not found in inspected sources |
| Perilous Wilds Discovery.magic | Not found in inspected sources |
| Pickpocket.MidContents | Additional XML definition |
| Pickpocket.MidNPC | Additional XML definition |
| Pickpocket.NPCDescriptor | Additional XML definition |
| Pickpocket.PoorContents | Additional XML definition |
| Pickpocket.PoorNPC | Additional XML definition |
| Pickpocket.RichContents | Additional XML definition |
| Pickpocket.RichNPC | Additional XML definition |
| Pickpocket.StealVerb | Additional XML definition |
| Piercings.Start | Converted-copy candidate only |
| Piercings.middleware | Not found in inspected sources |
| Pirate Oracle - Black Sails on the Horizon.main | Already in current XML history |
| Planarch Codex Parish.item-description-consonant | Not found in inspected sources |
| Planet Name.letter | Not found in inspected sources |
| Port Rumors.alltowns | Already in current XML history |
| Potion Provider.mod | Already in current XML history |
| Prophecies.heard | Not found in inspected sources |
| Psychon Mutants.has\_mutation\_select | Not found in inspected sources |
| Psychon.tin | Not found in inspected sources |
| Pulp Fantasy Nation.Main | Existing local case candidate; excluded |
| Pulp Villain.major\_aim\_1 | Not found in inspected sources |
| Pulp Villain.major\_aim\_2 | Not found in inspected sources |
| Pulp Villain.nation | Not found in inspected sources |
| Pulp Villain.target\_aim | Not found in inspected sources |
| Quick Horrors.main | Additional XML definition |
| Quick NPC.NPCDescriptor-noarticle | Already in current XML history |
| Quick PC.GUY | Existing local case candidate; excluded |
| Quick Populations.anygroup | Additional XML definition |
| Quick Populations.domestic-animal | Additional XML definition |
| Quick Populations.power-animal | Additional XML definition |
| Quick Starting Equipment.adventuregear | Already in current XML history |
| Quick Starting Equipment.blank | Not found in inspected sources |
| Quick levelling.inspiring combat maneuvers | Not found in inspected sources |
| Random Datafiles for HMR.mysticalpowers | Not found in inspected sources |
| Random Fantasy NPC.EmptyTable | Already in current XML history |
| Random Humanoid Horde.Level | Converted-copy candidate only |
| Random Humanoid Horde.Numbronesix | Not found in inspected sources |
| Random Tools for Mutant Future.Junk | Existing local case candidate; excluded |
| Reagent Generator.Animal | Not found in inspected sources |
| Reagent Generator.DryGoodsContainer | Not found in inspected sources |
| Reagent Generator.Jewelry | Not found in inspected sources |
| Reagent Generator.SRanimal | Not found in inspected sources |
| Reagent Generator.Stuff | Not found in inspected sources |
| Reagent Generator.number | Not found in inspected sources |
| Reagent Generator.parts | Not found in inspected sources |
| Resting In Town Before Going Back Into The Dungeon.\[https:&#47;&#47;www.dropbox.com/s/s8pu4s9kliv2q42/Original%20Petty%20Gods%20-%20OPG.pdf Petty Gods pdf\] | Malformed identity; excluded |
| Resting In Town Before Going Back Into The Dungeon.digit | Not found in inspected sources |
| Rituals.eventAny | Additional XML definition |
| Rituals.riteAny | Additional XML definition |
| Rituals.riteClause | Additional XML definition |
| Rituals.ritualStart | Additional XML definition |
| Romance of the Three Kingdoms.ChineseFemaleName | Not found in inspected sources |
| Romance of the Three Kingdoms.Rank | Not found in inspected sources |
| SCP Foundation Idea Generator.adjective | Existing local case candidate; excluded |
| SGNP barbarians.BarbarianSurnam | Not found in inspected sources |
| SGNP zulu.surname | Not found in inspected sources |
| SciFiStowAways.&#124;a lover&#124;an ex-lover&#124;a religious place | Not found in inspected sources |
| SciFiStowAways.&#124;meaning | Not found in inspected sources |
| Scroll.CaseDecoration | Not found in inspected sources |
| Scroll.SpoolMaterial | Not found in inspected sources |
| Scroll.main | Existing local case candidate; excluded |
| Sea Encounters.elfofficers | Existing local case candidate; excluded |
| Sea Encounters.justthePlace | Existing local case candidate; excluded |
| Sea Encounters.monstercaptain | Existing local case candidate; excluded |
| Sea Encounters.zhousurvivors | Existing local case candidate; excluded |
| Secret Society Title.Main | Existing local case candidate; excluded |
| Secret Society Title.title | Existing local case candidate; excluded |
| Secret Society Title.titledescriptor | Existing local case candidate; excluded |
| Security and Site Generator.AAA | Not found in inspected sources |
| Shadowrun Background Generator.Clothes | Already in current XML history |
| Shadowrun Bar.DowntownBars | Not found in inspected sources |
| Shadowrun Bar.EastsideBars | Not found in inspected sources |
| Shadowrun Bar.SouthsideBars | Not found in inspected sources |
| Shadowrun Bar.WestsideBars | Not found in inspected sources |
| Shadowrun Barrens Brew Generator.Drinknames | Existing local case candidate; excluded |
| Shadowrun Barrens Menu Generator.ExoticMainMeals | Not found in inspected sources |
| Shadowrun Barrens Menu Generator.menu | Existing local case candidate; excluded |
| Shadowrun Border Crossing Generator.BorderSenso8r | Not found in inspected sources |
| Shadowrun Border Crossing Generator.range8 | Existing local case candidate; excluded |
| Shadowrun Bounty Hunting Job Thresholds.FemaleTattoo | Existing local case candidate; excluded |
| Shadowrun Drone Generator.FletchingColor | Not found in inspected sources |
| Shadowrun Firearm Generator.ForeGrip | Existing local case candidate; excluded |
| Shadowrun Heist Generator.Warding | Not found in inspected sources |
| Shadowrun Host Generator.DTSpam | Not found in inspected sources |
| Shadowrun Host Generator.SSpam | Not found in inspected sources |
| Shadowrun Host Generator.Spam | Not found in inspected sources |
| Shadowrun Host Generator.black | Not found in inspected sources |
| Shadowrun MSP Location Generator.Restaurant | Not found in inspected sources |
| Shadowrun MSP Location Generator.SecurityLocation | Not found in inspected sources |
| Shadowrun MSP Location Generator.SouthsideStripClubs | Not found in inspected sources |
| Shadowrun Reagent Generator.Predicate | Not found in inspected sources |
| Shadowrun Security and Site Generator.Warding | Not found in inspected sources |
| Shadowrun UCAS Ration Generator.ExoticMainMeals | Not found in inspected sources |
| Shadowrun Utility.FemaleNames | Already in current XML history |
| Shadowrun Utility.MaleNames | Already in current XML history |
| Shinobi and samurai loot.TwoHandSwordType | Not found in inspected sources |
| Ship Description.Main | Existing local case candidate; excluded |
| Siege Force.LightHeavy | Not found in inspected sources |
| Simple Colors.SGREY | Not found in inspected sources |
| Simple Colors.brown | Not found in inspected sources |
| Simple Colors.gray | Not found in inspected sources |
| Simple Colors.sblack | Existing local case candidate; excluded |
| Simple Colors.sblue | Not found in inspected sources |
| Simple Colors.sbrown | Existing local case candidate; excluded |
| Simple Colors.scan | Existing local case candidate; excluded |
| Simple Colors.sgray | Existing local case candidate; excluded |
| Simple Colors.sgreen | Not found in inspected sources |
| Simple Colors.sgrey | Not found in inspected sources |
| Simple Colors.sorange | Not found in inspected sources |
| Simple Colors.spink | Not found in inspected sources |
| Simple Colors.spurple | Not found in inspected sources |
| Simple Colors.sred | Not found in inspected sources |
| Simple Colors.swhite | Existing local case candidate; excluded |
| Simple Colors.syellow | Not found in inspected sources |
| Simple Colors.white | Not found in inspected sources |
| Sky Island in Shattered Eberron.Eberron sea | Existing local case candidate; excluded |
| SnW Monster Generator.hd1012 | Not found in inspected sources |
| Spells By School.SorcerySuffix | Not found in inspected sources |
| Sstabhmontown Hirelings.Dice 1d4+1 | Not found in inspected sources |
| Sstabhmontown Hirelings.horseman | Not found in inspected sources |
| Sstabhmontown Magic Items.13 | Not found in inspected sources |
| Sstabhmontown Magic Items.15 | Not found in inspected sources |
| Sstabhmontown Magic Items.17 | Not found in inspected sources |
| Sstabhmontown Magic Items.excpetional | Not found in inspected sources |
| Sstabhmontown Magic Items.scrolleOne | Not found in inspected sources |
| Sstabhmontown Mercenaries.championarmour | Not found in inspected sources |
| Sstabhmontown Mercenaries.championshield | Not found in inspected sources |
| Sstabhmontown Mercenaries.cleric-champion-magic | Not found in inspected sources |
| Sstabhmontown Mercenaries.comandersword | Not found in inspected sources |
| Sstabhmontown Mercenaries.druid-champion-magic | Not found in inspected sources |
| Sstabhmontown Mercenaries.mu-champion-magic | Not found in inspected sources |
| Sstabhmontown Mercenaries.power | Not found in inspected sources |
| Sstabhmontown Mercenaries.slcomcomcapha | Not found in inspected sources |
| Star Trek: The Next Generation Plot Generator.tngrew | Not found in inspected sources |
| Star Wars Random NPC.main | Existing local case candidate; excluded |
| Starship Breakdowns.&#124;small&#124;large | Not found in inspected sources |
| Starship Breakdowns.&#124;too hot&#124;too cold | Not found in inspected sources |
| Starting Equipment.adventurer-gear | Additional XML definition |
| Starting Equipment.any-basic | Additional XML definition |
| Starting Equipment.any-junk | Additional XML definition |
| Starting Equipment.anything | Additional XML definition |
| Starting Equipment.goodarmor | Additional XML definition |
| Starting Equipment.hireling-gear | Additional XML definition |
| Starting Equipment.simple-gear | Additional XML definition |
| Steampunk.powerprefix | Not found in inspected sources |
| Stolen Lands Treasure.2d4 | Not found in inspected sources |
| Stolen Lands Treasure.moderatepoison | Already in current XML history |
| Strange Languages.lengish\_word | Not found in inspected sources |
| Strange New World.molten\_rocky\_planet | Not found in inspected sources |
| Strange New World.oceanic\_rocky\_planet | Not found in inspected sources |
| Substances.chunks | Existing local case candidate; excluded |
| Suburban development names.suffixmed | Not found in inspected sources |
| Swords.NoDescription | Not found in inspected sources |
| Syfy original movie.a | Not found in inspected sources |
| Tavern Entertainer Circuit.Level | Not found in inspected sources |
| Terrain Feature.water dragon | Not found in inspected sources |
| The Blues Engine.Significant other | Not found in inspected sources |
| The Demon's True Name.Carcosa | Existing local case candidate; excluded |
| The Plum in the Golden Vase.ChineseFemaleName | Not found in inspected sources |
| Today At Sea.ships | Existing local case candidate; excluded |
| Trade Goods.GlassOpacity | Not found in inspected sources |
| Treatment-test.Events | Already in current XML history |
| Unprotected Treasure.C | Not found in inspected sources |
| Unprotected Treasure.MU/E | Not found in inspected sources |
| Unprotected Treasure.unprotectedtreasure9 | Not found in inspected sources |
| User talk:MiSuBa.FemaleHobby | Not found in inspected sources |
| User talk:MiSuBa.FemaleJob | Not found in inspected sources |
| User talk:MiSuBa.MaleHobby | Not found in inspected sources |
| User talk:MiSuBa.MaleJob | Not found in inspected sources |
| User:GreyKnight/arcana test.STR 1, DEX 10, WIS 1, 1HP, attack 1 | Not found in inspected sources |
| User:GreyKnight/arcana test.STR 5, DEX 10, WIS 13, 1 HP, attack d4 | Not found in inspected sources |
| User:Samohtrace.Restaurant | Not found in inspected sources |
| User:SirKodiak/Sandbox.actions\_taken | Not found in inspected sources |
| Utility.Clothe | Not found in inspected sources |
| Utility.Color | Not found in inspected sources |
| Utility.Colors | Already in current XML history |
| Utility.DarkColorsColors | Not found in inspected sources |
| Utility.Drinks | Already in current XML history |
| Utility.FancyCloth | Not found in inspected sources |
| Utility.Foodstuffs | Not found in inspected sources |
| Utility.FullMeal\(FantasyMenu\) | Not found in inspected sources |
| Utility.LeatherAnimalType | Already in current XML history |
| Utility.MetallicColors | Already in current XML history |
| Utility.Metals | Not found in inspected sources |
| Utility.Nuts | Not found in inspected sources |
| Utility.PerfumeScents | Already in current XML history |
| Utility.TradeGoodsAnimals | Already in current XML history |
| Utility.Vegetables | Not found in inspected sources |
| Utility.WoodsBow | Not found in inspected sources |
| Utility.color | Not found in inspected sources |
| Utility.flower | Existing local case candidate; excluded |
| Utility.fruit | Existing local case candidate; excluded |
| Utility.fur | Existing local case candidate; excluded |
| Utility.hornivory | Existing local case candidate; excluded |
| Utility.metal | Existing local case candidate; excluded |
| Utility.symbols | Existing local case candidate; excluded |
| Utility.wood | Existing local case candidate; excluded |
| Vehicle Generator.AirMfg | Not found in inspected sources |
| Vehicle Generator.Car | Not found in inspected sources |
| Vehicle Generator.CarMfg | Not found in inspected sources |
| Vehicle Generator.Decor | Not found in inspected sources |
| Vehicle Generator.FirstClassQuality | Not found in inspected sources |
| Vehicle Generator.Helo | Not found in inspected sources |
| Vehicle Generator.Paint | Not found in inspected sources |
| Vehicle Generator.Quality | Not found in inspected sources |
| Vehicle Generator.Rating | Not found in inspected sources |
| Vehicle Generator.Truck | Not found in inspected sources |
| Vehicle Generator.and | Not found in inspected sources |
| Vehicle Generator.but | Not found in inspected sources |
| Victim Generator.syndicate | Not found in inspected sources |
| Village.animal | Additional XML definition |
| Village.crime | Additional XML definition |
| Village.digit | Additional XML definition |
| Village.food | Additional XML definition |
| Village.local heroes | Additional XML definition |
| Village.maybeweird | Additional XML definition |
| Village.quirks | Additional XML definition |
| Village.weird | Additional XML definition |
| Wampus Country Magic User Generator.TestOutput | Not found in inspected sources |
| Wampus Country Potions.TestOutput | Not found in inspected sources |
| Waterdeep Villa.Remarkable Sculpture | Not found in inspected sources |
| Weapon Foci Generator.main | Not found in inspected sources |
| Weapon Generator.main | Not found in inspected sources |
| Weapon Shields.\[file:top.png&#124;520px\] | Malformed identity; excluded |
| Weird Fantasy Monster.Level | Converted-copy candidate only |
| Weird Fantasy Monster.Main | Existing local case candidate; excluded |
| Weird West Clothing.coatsyle | Not found in inspected sources |
| Weird West Clothing.otherhat | Not found in inspected sources |
| Weird West Clothing.weird west felthatcolors | Not found in inspected sources |
| Weird West Colors.brown\_adj | Not found in inspected sources |
| Weird West Colors.felthatcolors | Already in current XML history |
| Weird West Colors.femhatcolors | Already in current XML history |
| Weird West Colors.gray\_adj | Not found in inspected sources |
| Weird West Colors.hatcolors | Already in current XML history |
| Weird West Colors.leatheradj | Already in current XML history |
| Weird West Colors.leathercolor | Already in current XML history |
| Weird West Colors.malepants | Already in current XML history |
| Weird West Colors.maleshirts | Already in current XML history |
| Weird West Colors.pink | Not found in inspected sources |
| Weird West Colors.shirts | Not found in inspected sources |
| Western Outfit.basic | Existing local case candidate; excluded |
| Western Outfit.evocativeleather | Not found in inspected sources |
| Western Outfit.normalquality | Already in current XML history |
| Western Outfit.pantscolor | Already in current XML history |
| Western Outfit.shirtfabric | Already in current XML history |
| Western Outfit.shirtwithoutvest | Already in current XML history |
| Western Outfit.shirtwithvest | Already in current XML history |
| Western Outfit.stripecolors | Not found in inspected sources |
| Wild West Personas.1d6+1 | Not found in inspected sources |
| Wild West Personas.hairadjective | Already in current XML history |
| Wild West Personas.uniquefemaleface | Already in current XML history |
| Wizard Tower.\[http:&#47;&#47;talesofthegrotesqueanddungeonesque.blogspot.com/2012/08/what-type-of-haunting-is-afoot.html\)\] | Malformed identity; excluded |
| Wizard schools.mainCap | Already in current XML history |
| Wizard's death-curse.main | Existing local case candidate; excluded |
| World Generator.Americaculture | Not found in inspected sources |
| World Generator.Americaregion | Not found in inspected sources |
| World Generator.Americareligion | Not found in inspected sources |
| Wrestling names.articlechance | Already in current XML history |
| Wrestling names.porpernamelast | Not found in inspected sources |
| Wuxia Names.surnames\_pinyin | Already in current XML history |
| Wuxia Organizations.adjective | Already in current XML history |
| Wuxia Organizations.hyphenated | Already in current XML history |
| Wuxia Organizations.noun | Already in current XML history |
| Wuxia Organizations.number | Already in current XML history |
| Wuxia Organizations.number-plain | Already in current XML history |
| XBows.NoDescription | Not found in inspected sources |
| Zenume Region Names.Owner | Existing local case candidate; excluded |
| Zenume Settlement and Landmark Names.amount | Existing local case candidate; excluded |
| Zenume Settlement and Landmark Names.goup2 | Not found in inspected sources |
| Zenume Settlement and Landmark Names.jobs | Existing local case candidate; excluded |
| kaac.houseádi\_clan | Not found in inspected sources |
