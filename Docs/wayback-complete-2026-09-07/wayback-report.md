# Missing Table Archive Check

Checked: 2026-09-07T21:47:27.609Z. Source commit: `6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0`.

This report checks the Internet Archive Wayback Availability API. It does not download or execute archived page content; no tables are imported or changed.

**An archived page does not confirm that a missing subtable exists in that capture.** Review the exact subtable, source text, weights, history, and contributor attribution before proposing recovery.

A `no-snapshot` result means the API returned no accessible capture for every planned URL variant. It is not proof that the source was never archived. Errors, timeouts, and unattempted URLs are not negative results.

Requested date: latest available capture. Stop reason: `complete`.

## Coverage

| Item | Count |
| --- | ---: |
| Missing-reference targets | 861 |
| Targets with an existing local candidate | 174 |
| Targets requiring source-identity review | 4 |
| Planned pages | 260 |
| Pages with an accessible snapshot | 174 |
| Missing targets on those pages, not verified | 462 |
| Pages with no snapshot across planned URLs | 86 |
| Incomplete or unattempted pages | 0 |
| API requests in this run | 39 |
| Retained query errors | 0 |

The scope is the imported wiki quarantine report, not every graph placeholder or every table in the upstream wiki. Absence from the import does not establish that a table is absent from the full source dump.

## Missing Targets

Names and capitalization remain exact. Existing local candidates are kept for separate review. Page requests are deduplicated; table identities are not merged.

| Missing Target | State | Archived Page | Capture |
| --- | --- | --- | --- |
| 1E DMG City Encounter.bandit | archived-page | [snapshot](https://web.archive.org/web/20220703155542/https://www.random-generator.com/index.php?title=1E_DMG_City_Encounter) | 20220703155542 |
| 1E DMG City Encounter.drunktype | archived-page | [snapshot](https://web.archive.org/web/20220703155542/https://www.random-generator.com/index.php?title=1E_DMG_City_Encounter) | 20220703155542 |
| 1E DMG City Encounter.drunktype plural | archived-page | [snapshot](https://web.archive.org/web/20220703155542/https://www.random-generator.com/index.php?title=1E_DMG_City_Encounter) | 20220703155542 |
| 1E DMG City Encounter.giant rat | archived-page | [snapshot](https://web.archive.org/web/20220703155542/https://www.random-generator.com/index.php?title=1E_DMG_City_Encounter) | 20220703155542 |
| 1st Level Dungeon.potion | archived-page | [snapshot](https://web.archive.org/web/20210301225708/http://www.random-generator.com/index.php?title=1st_Level_Dungeon) | 20210301225708 |
| 50F Encounter Table.Escort Brigantine Statblock | archived-page | [snapshot](https://web.archive.org/web/20170621051014/http://random-generator.com/index.php?title=50F_Encounter_Table) | 20170621051014 |
| 50F Encounter Table.Escort Crumster Statblock | archived-page | [snapshot](https://web.archive.org/web/20170621051014/http://random-generator.com/index.php?title=50F_Encounter_Table) | 20170621051014 |
| 50F Encounter Table.Escort Galleon Statblock | archived-page | [snapshot](https://web.archive.org/web/20170621051014/http://random-generator.com/index.php?title=50F_Encounter_Table) | 20170621051014 |
| 50F Encounter Table.Escort Galley Statblock | archived-page | [snapshot](https://web.archive.org/web/20170621051014/http://random-generator.com/index.php?title=50F_Encounter_Table) | 20170621051014 |
| 50F Encounter Table.Escort Junk Statblock | archived-page | [snapshot](https://web.archive.org/web/20170621051014/http://random-generator.com/index.php?title=50F_Encounter_Table) | 20170621051014 |
| 50F Encounter Table.Escort Sloop Statblock | archived-page | [snapshot](https://web.archive.org/web/20170621051014/http://random-generator.com/index.php?title=50F_Encounter_Table) | 20170621051014 |
| ADVENTURE CAST.Act | local-review | - | - |
| ADVENTURE CAST.construct | archived-page | [snapshot](https://web.archive.org/web/20220703153719/https://www.random-generator.com/index.php?title=ADVENTURE_CAST) | 20220703153719 |
| ADVENTURE CAST.deathtouched | archived-page | [snapshot](https://web.archive.org/web/20220703153719/https://www.random-generator.com/index.php?title=ADVENTURE_CAST) | 20220703153719 |
| ADVENTURE CAST.dragon | archived-page | [snapshot](https://web.archive.org/web/20220703153719/https://www.random-generator.com/index.php?title=ADVENTURE_CAST) | 20220703153719 |
| ADVENTURE CAST.feytouched | archived-page | [snapshot](https://web.archive.org/web/20220703153719/https://www.random-generator.com/index.php?title=ADVENTURE_CAST) | 20220703153719 |
| ADVENTURE CAST.planetouched | archived-page | [snapshot](https://web.archive.org/web/20220703153719/https://www.random-generator.com/index.php?title=ADVENTURE_CAST) | 20220703153719 |
| ARGUS.NOTES | archived-page | [snapshot](https://web.archive.org/web/20220703152732/https://www.random-generator.com/index.php?title=ARGUS) | 20220703152732 |
| Adventurers CC.ADVENTURER\_TYPE | archived-page | [snapshot](https://web.archive.org/web/20220703144014/https://www.random-generator.com/index.php?title=Adventurers_CC) | 20220703144014 |
| AllTheCheeses.Main | local-review | - | - |
| American Census Names.Female | local-review | - | - |
| American Census Names.Male | local-review | - | - |
| American Census Names.Surname | local-review | - | - |
| American Census Names.commonfemale | archived-page | [snapshot](https://web.archive.org/web/20210515112408/https://www.random-generator.com/index.php?title=American_Census_Names) | 20210515112408 |
| American Census Names.uncommonfemale | archived-page | [snapshot](https://web.archive.org/web/20210515112408/https://www.random-generator.com/index.php?title=American_Census_Names) | 20210515112408 |
| AmmunitionThrown.NoDescription | archived-page | [snapshot](https://web.archive.org/web/20211201144436/https://www.random-generator.com/index.php?title=AmmunitionThrown) | 20211201144436 |
| Angel generator.Title Type | local-review | - | - |
| Angels and demons.female | archived-page | [snapshot](https://web.archive.org/web/20210927222207/https://www.random-generator.com/index.php?title=Angels_and_demons) | 20210927222207 |
| Angels and demons.main | archived-page | [snapshot](https://web.archive.org/web/20210927222207/https://www.random-generator.com/index.php?title=Angels_and_demons) | 20210927222207 |
| Angels and demons.male | archived-page | [snapshot](https://web.archive.org/web/20210927222207/https://www.random-generator.com/index.php?title=Angels_and_demons) | 20210927222207 |
| Angels and demons.titlechance | archived-page | [snapshot](https://web.archive.org/web/20210927222207/https://www.random-generator.com/index.php?title=Angels_and_demons) | 20210927222207 |
| Animal.fantasyAcquatic | archived-page | [snapshot](https://web.archive.org/web/20240304184308/http://www.random-generator.com/index.php?title=Animal) | 20240304184308 |
| Animal.fantasyFeatheredAnimal | archived-page | [snapshot](https://web.archive.org/web/20240304184308/http://www.random-generator.com/index.php?title=Animal) | 20240304184308 |
| Animal.fantasyFurredAnimal | archived-page | [snapshot](https://web.archive.org/web/20240304184308/http://www.random-generator.com/index.php?title=Animal) | 20240304184308 |
| Animal.fantasyLandAnimal | archived-page | [snapshot](https://web.archive.org/web/20240304184308/http://www.random-generator.com/index.php?title=Animal) | 20240304184308 |
| Animal.fantasyScaledAnimal | archived-page | [snapshot](https://web.archive.org/web/20240304184308/http://www.random-generator.com/index.php?title=Animal) | 20240304184308 |
| Animal.fantasyaquatic | local-review | - | - |
| Animal.fantasycreature | local-review | - | - |
| Animal.fantasyland | local-review | - | - |
| Animal.farmanimal | archived-page | [snapshot](https://web.archive.org/web/20240304184308/http://www.random-generator.com/index.php?title=Animal) | 20240304184308 |
| Armor.Color | archived-page | [snapshot](https://web.archive.org/web/20241007195622/http://www.random-generator.com/index.php?title=Armor) | 20241007195622 |
| Art, Grace, and Guts Oracle.main | archived-page | [snapshot](https://web.archive.org/web/20231209144748/http://www.random-generator.com/index.php?title=Art%2C_Grace%2C_and_Guts_Oracle) | 20231209144748 |
| Artifacts-D20.d20stat | local-review | - | - |
| Artifacts-D20.for 1 day per HD killed | archived-page | [snapshot](https://web.archive.org/web/20220703142655/https://www.random-generator.com/index.php?title=Artifacts-D20) | 20220703142655 |
| Artwork.main | archived-page | [snapshot](https://web.archive.org/web/20250823121929/http://www.random-generator.com/index.php?title=Artwork) | 20250823121929 |
| Astonishing Tales Creatures.5th | archived-page | [snapshot](https://web.archive.org/web/20230422090908/http://www.random-generator.com/index.php?title=Astonishing_Tales_Creatures) | 20230422090908 |
| Astonishing Tales Creatures.creature | archived-page | [snapshot](https://web.archive.org/web/20230422090908/http://www.random-generator.com/index.php?title=Astonishing_Tales_Creatures) | 20230422090908 |
| Astonishing Tales Creatures.inspiration | archived-page | [snapshot](https://web.archive.org/web/20230422090908/http://www.random-generator.com/index.php?title=Astonishing_Tales_Creatures) | 20230422090908 |
| Astonishing Tales Creatures.mainstream | archived-page | [snapshot](https://web.archive.org/web/20230422090908/http://www.random-generator.com/index.php?title=Astonishing_Tales_Creatures) | 20230422090908 |
| Astonishing Villain.focus | archived-page | [snapshot](https://web.archive.org/web/20220703141704/https://www.random-generator.com/index.php?title=Astonishing_Villain) | 20220703141704 |
| Astonishing Villain.villain | archived-page | [snapshot](https://web.archive.org/web/20220703141704/https://www.random-generator.com/index.php?title=Astonishing_Villain) | 20220703141704 |
| Available Dog Generator.14 | archived-page | [snapshot](https://web.archive.org/web/20260302003613/http://random-generator.com/index.php?title=Available_Dog_Generator) | 20260302003613 |
| Available Dog Generator.15 | archived-page | [snapshot](https://web.archive.org/web/20260302003613/http://random-generator.com/index.php?title=Available_Dog_Generator) | 20260302003613 |
| Available Dog Generator.16 | archived-page | [snapshot](https://web.archive.org/web/20260302003613/http://random-generator.com/index.php?title=Available_Dog_Generator) | 20260302003613 |
| B-Movie Title generator.adjective | archived-page | [snapshot](https://web.archive.org/web/20260104124104/http://www.random-generator.com/index.php?title=B-Movie_Title_generator) | 20260104124104 |
| Background Generator for SR.Description | archived-page | [snapshot](https://web.archive.org/web/20220703135710/https://www.random-generator.com/index.php?title=Background_Generator_for_SR) | 20220703135710 |
| Bad Year in Bear Lake.intro | local-review | - | - |
| Barbarian Tribe Generator.\[http:&#47;&#47;www.random-generator.com/index.php?title=Available\_Dog\_Generator'''Roll A Dog'''\] | needs-review | - | - |
| Barrens Menu Generator.MainMeals | archived-page | [snapshot](https://web.archive.org/web/20230422091703/http://www.random-generator.com/index.php?title=Barrens_Menu_Generator) | 20230422091703 |
| Bebidas Fantásticas.Liqueur | local-review | - | - |
| Bebidas Fantásticas.LiqueurFlavor | local-review | - | - |
| Blazon.main | archived-page | [snapshot](https://web.archive.org/web/20211201114927/https://www.random-generator.com/index.php?title=Blazon) | 20211201114927 |
| Blazon.pack | archived-page | [snapshot](https://web.archive.org/web/20211201114927/https://www.random-generator.com/index.php?title=Blazon) | 20211201114927 |
| Blazon.words | archived-page | [snapshot](https://web.archive.org/web/20211201114927/https://www.random-generator.com/index.php?title=Blazon) | 20211201114927 |
| Bows.NoDescription | archived-page | [snapshot](https://web.archive.org/web/20211015214229/https://www.random-generator.com/index.php?title=Bows) | 20211015214229 |
| Building Description, Fantasy.AfRu | local-review | - | - |
| Building Description, Fantasy.BeersNAles | archived-page | [snapshot](https://web.archive.org/web/20220703143655/https://www.random-generator.com/index.php?title=Building_Description,_Fantasy) | 20220703143655 |
| Building Description, Fantasy.Fruit | archived-page | [snapshot](https://web.archive.org/web/20220703143655/https://www.random-generator.com/index.php?title=Building_Description,_Fantasy) | 20220703143655 |
| Building Description, Fantasy.Liqueur | archived-page | [snapshot](https://web.archive.org/web/20220703143655/https://www.random-generator.com/index.php?title=Building_Description,_Fantasy) | 20220703143655 |
| Building Description, Fantasy.alcoholicdrinks | local-review | - | - |
| Building Description, Fantasy.nonalchoholicdrinks | local-review | - | - |
| CC-Blessings-Curses.BODY\_LOCATIONS | archived-page | [snapshot](https://web.archive.org/web/20230422092917/http://www.random-generator.com/index.php?title=CC-Blessings-Curses) | 20230422092917 |
| CC-Blessings-Curses.PYSCHIC\_POWERS | archived-page | [snapshot](https://web.archive.org/web/20230422092917/http://www.random-generator.com/index.php?title=CC-Blessings-Curses) | 20230422092917 |
| CC-Blessings-Curses.RELATIVES | archived-page | [snapshot](https://web.archive.org/web/20230422092917/http://www.random-generator.com/index.php?title=CC-Blessings-Curses) | 20230422092917 |
| CC-Crimes.Pira-Main | archived-page | [snapshot](https://web.archive.org/web/20220626085528/https://www.random-generator.com/index.php?title=CC-Crimes) | 20220626085528 |
| CC-Crimes.Under-Main | archived-page | [snapshot](https://web.archive.org/web/20220626085528/https://www.random-generator.com/index.php?title=CC-Crimes) | 20220626085528 |
| CC-Enslavement.CRIMES | archived-page | [snapshot](https://web.archive.org/web/20220703144136/https://www.random-generator.com/index.php?title=CC-Enslavement) | 20220703144136 |
| CC-Enslavement.NPC-Events-CC | archived-page | [snapshot](https://web.archive.org/web/20220703144136/https://www.random-generator.com/index.php?title=CC-Enslavement) | 20220703144136 |
| CC-Fantasy-Childhood.DEITY | archived-page | [snapshot](https://web.archive.org/web/20220703142046/https://www.random-generator.com/index.php?title=CC-Fantasy-Childhood) | 20220703142046 |
| CC-Fantasy-Childhood.JOBS | archived-page | [snapshot](https://web.archive.org/web/20220703142046/https://www.random-generator.com/index.php?title=CC-Fantasy-Childhood) | 20220703142046 |
| CC-Gifts-Legacies.DEBTS | archived-page | [snapshot](https://web.archive.org/web/20210612121712/https://www.random-generator.com/index.php?title=CC-Gifts-Legacies) | 20210612121712 |
| CC-Love-Romance.AH\_LOVE | archived-page | [snapshot](https://web.archive.org/web/20230422093149/http://www.random-generator.com/index.php?title=CC-Love-Romance) | 20230422093149 |
| CC-Military.Distinguishments | archived-page | [snapshot](https://web.archive.org/web/20230422093212/http://www.random-generator.com/index.php?title=CC-Military) | 20230422093212 |
| CC-Military.MILITARY\_EVENTS | archived-page | [snapshot](https://web.archive.org/web/20230422093212/http://www.random-generator.com/index.php?title=CC-Military) | 20230422093212 |
| CC-Occupations.CRAFT\_B | archived-page | [snapshot](https://web.archive.org/web/20230422093246/http://www.random-generator.com/index.php?title=CC-Occupations) | 20230422093246 |
| CC-Occupations.MERCHANT | archived-page | [snapshot](https://web.archive.org/web/20230422093246/http://www.random-generator.com/index.php?title=CC-Occupations) | 20230422093246 |
| CC-Occupations.PRIMITVE\_OCCUPATIONS | archived-page | [snapshot](https://web.archive.org/web/20230422093246/http://www.random-generator.com/index.php?title=CC-Occupations) | 20230422093246 |
| CC-Race-Events.BUTTHOLES | archived-page | [snapshot](https://web.archive.org/web/20220703155331/https://www.random-generator.com/index.php?title=CC-Race-Events) | 20220703155331 |
| CC-Rivals.JUST\_UNITS | archived-page | [snapshot](https://web.archive.org/web/20230422093343/http://www.random-generator.com/index.php?title=CC-Rivals) | 20230422093343 |
| CC-Rivals.RIVAL | archived-page | [snapshot](https://web.archive.org/web/20230422093343/http://www.random-generator.com/index.php?title=CC-Rivals) | 20230422093343 |
| CC-Tragedies.HEAD\_INJURY | archived-page | [snapshot](https://web.archive.org/web/20220626073042/https://www.random-generator.com/index.php?title=CC-Tragedies) | 20220626073042 |
| Castle.LightHeavy | archived-page | [snapshot](https://web.archive.org/web/20230601020358/https://www.random-generator.com/index.php?title=Castle) | 20230601020358 |
| Castle.color | archived-page | [snapshot](https://web.archive.org/web/20230601020358/https://www.random-generator.com/index.php?title=Castle) | 20230601020358 |
| Centaur Names.FemaleTitle | archived-page | [snapshot](https://web.archive.org/web/20220626075649/https://www.random-generator.com/index.php?title=Centaur_Names) | 20220626075649 |
| Centaur Names.MaleTitle | archived-page | [snapshot](https://web.archive.org/web/20220626075649/https://www.random-generator.com/index.php?title=Centaur_Names) | 20220626075649 |
| Clerics.clericalign | archived-page | [snapshot](https://web.archive.org/web/20230601032010/https://www.random-generator.com/index.php?title=Clerics) | 20230601032010 |
| ClothingFemale.ClothingColors | archived-page | [snapshot](https://web.archive.org/web/20220121180351/https://www.random-generator.com/index.php?title=ClothingFemale) | 20220121180351 |
| ClothingFemale.FemaleClothing | archived-page | [snapshot](https://web.archive.org/web/20220121180351/https://www.random-generator.com/index.php?title=ClothingFemale) | 20220121180351 |
| ClothingFemale.FemaleFootwear | archived-page | [snapshot](https://web.archive.org/web/20220121180351/https://www.random-generator.com/index.php?title=ClothingFemale) | 20220121180351 |
| ClothingFemale.FemaleLegwear | archived-page | [snapshot](https://web.archive.org/web/20220121180351/https://www.random-generator.com/index.php?title=ClothingFemale) | 20220121180351 |
| ClothingFemale.FemaleLowerSkirtType | archived-page | [snapshot](https://web.archive.org/web/20220121180351/https://www.random-generator.com/index.php?title=ClothingFemale) | 20220121180351 |
| ClothingFemale.FemaleShirtType | archived-page | [snapshot](https://web.archive.org/web/20220121180351/https://www.random-generator.com/index.php?title=ClothingFemale) | 20220121180351 |
| ClothingFemale.LegWearColors | local-review | - | - |
| ClothingFemale.MaterialCombosChainmailable | archived-page | [snapshot](https://web.archive.org/web/20220121180351/https://www.random-generator.com/index.php?title=ClothingFemale) | 20220121180351 |
| ClothingFemale.MaterialCombosCommon | archived-page | [snapshot](https://web.archive.org/web/20220121180351/https://www.random-generator.com/index.php?title=ClothingFemale) | 20220121180351 |
| ClothingFemale.MaterialCombosFancy | archived-page | [snapshot](https://web.archive.org/web/20220121180351/https://www.random-generator.com/index.php?title=ClothingFemale) | 20220121180351 |
| ClothingFemale.MaterialCombosLeather | archived-page | [snapshot](https://web.archive.org/web/20220121180351/https://www.random-generator.com/index.php?title=ClothingFemale) | 20220121180351 |
| ClothingFemale.MaterialsChainmailableCommon | archived-page | [snapshot](https://web.archive.org/web/20220121180351/https://www.random-generator.com/index.php?title=ClothingFemale) | 20220121180351 |
| ClothingFemale.brightadj | archived-page | [snapshot](https://web.archive.org/web/20220121180351/https://www.random-generator.com/index.php?title=ClothingFemale) | 20220121180351 |
| CoatOfArms.Four-leggedAttittudes | archived-page | [snapshot](https://web.archive.org/web/20240420071739/http://www.random-generator.com/index.php?title=CoatOfArms) | 20240420071739 |
| Color.any | archived-page | [snapshot](https://web.archive.org/web/20211205163208/http://www.random-generator.com/index.php?title=Color) | 20211205163208 |
| Color.metalic | archived-page | [snapshot](https://web.archive.org/web/20211205163208/http://www.random-generator.com/index.php?title=Color) | 20211205163208 |
| Compound Word Names.Color | archived-page | [snapshot](https://web.archive.org/web/20250822165558/http://www.random-generator.com/index.php?title=Compound_Word_Names) | 20250822165558 |
| Compound Word.Monosyllabic | archived-page | [snapshot](https://web.archive.org/web/20220626074838/https://www.random-generator.com/index.php?title=Compound_Word) | 20220626074838 |
| Compound Word.Polysyllabic | archived-page | [snapshot](https://web.archive.org/web/20220626074838/https://www.random-generator.com/index.php?title=Compound_Word) | 20220626074838 |
| Compound Word.main | local-review | - | - |
| Cormyr.Cormyr Noble Houeses | archived-page | [snapshot](https://web.archive.org/web/20220703144406/https://www.random-generator.com/index.php?title=Cormyr) | 20220703144406 |
| Creatures.Animal | no-snapshot | - | - |
| Creatures.Basic Fantastic | no-snapshot | - | - |
| Creatures.Feathered | no-snapshot | - | - |
| Creepy Fantasy Villain.Scary | archived-page | [snapshot](https://web.archive.org/web/20260616090342/http://www.random-generator.com/index.php?title=Creepy_Fantasy_Villain) | 20260616090342 |
| Creepy Fantasy Villain.main | archived-page | [snapshot](https://web.archive.org/web/20260616090342/http://www.random-generator.com/index.php?title=Creepy_Fantasy_Villain) | 20260616090342 |
| Curse.cursename | archived-page | [snapshot](https://web.archive.org/web/20210927232814/https://www.random-generator.com/index.php?title=Curse) | 20210927232814 |
| Curse.main | archived-page | [snapshot](https://web.archive.org/web/20210927232814/https://www.random-generator.com/index.php?title=Curse) | 20210927232814 |
| DOG WIZARDS DICE.4d6 | archived-page | [snapshot](https://web.archive.org/web/20210927125115/https://www.random-generator.com/index.php?title=DOG_WIZARDS_DICE) | 20210927125115 |
| DOG WIZARDS DICE.d20 | archived-page | [snapshot](https://web.archive.org/web/20210927125115/https://www.random-generator.com/index.php?title=DOG_WIZARDS_DICE) | 20210927125115 |
| DOG WIZARDS DICE.highlvls | archived-page | [snapshot](https://web.archive.org/web/20210927125115/https://www.random-generator.com/index.php?title=DOG_WIZARDS_DICE) | 20210927125115 |
| DOG WIZARDS DICE.midlvls | archived-page | [snapshot](https://web.archive.org/web/20210927125115/https://www.random-generator.com/index.php?title=DOG_WIZARDS_DICE) | 20210927125115 |
| DOG WIZARDS.name | archived-page | [snapshot](https://web.archive.org/web/20240326211029/http://www.random-generator.com/index.php?title=DOG_WIZARDS) | 20240326211029 |
| Deadlands Character Generation.coat | archived-page | [snapshot](https://web.archive.org/web/20220119170117/https://www.random-generator.com/index.php?title=Deadlands_Character_Generation) | 20220119170117 |
| Deadlands Character Generation.mpants | archived-page | [snapshot](https://web.archive.org/web/20220119170117/https://www.random-generator.com/index.php?title=Deadlands_Character_Generation) | 20220119170117 |
| Deadlands Character Generation.suithat | archived-page | [snapshot](https://web.archive.org/web/20220119170117/https://www.random-generator.com/index.php?title=Deadlands_Character_Generation) | 20220119170117 |
| Delver Fate.pit\_result | no-snapshot | - | - |
| Delver Fate.♂exploration | no-snapshot | - | - |
| Demon generator.Title Type | local-review | - | - |
| Dice.\(1D6\) \* 10 | archived-page | [snapshot](https://web.archive.org/web/20220625235536/http://www.random-generator.com/index.php?title=Dice) | 20220625235536 |
| Dice.\(1D6+1\) \* 10 | archived-page | [snapshot](https://web.archive.org/web/20220625235536/http://www.random-generator.com/index.php?title=Dice) | 20220625235536 |
| Dice.100 | archived-page | [snapshot](https://web.archive.org/web/20220625235536/http://www.random-generator.com/index.php?title=Dice) | 20220625235536 |
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
| Dice.1d50 | archived-page | [snapshot](https://web.archive.org/web/20220625235536/http://www.random-generator.com/index.php?title=Dice) | 20220625235536 |
| Dice.1d6+5 | archived-page | [snapshot](https://web.archive.org/web/20220625235536/http://www.random-generator.com/index.php?title=Dice) | 20220625235536 |
| Dice.2D2 | local-review | - | - |
| Dice.2D20 | local-review | - | - |
| Dice.2D4 | local-review | - | - |
| Dice.2D8 | local-review | - | - |
| Dice.2d12+1 | archived-page | [snapshot](https://web.archive.org/web/20220625235536/http://www.random-generator.com/index.php?title=Dice) | 20220625235536 |
| Dice.2d4 blocks | archived-page | [snapshot](https://web.archive.org/web/20220625235536/http://www.random-generator.com/index.php?title=Dice) | 20220625235536 |
| Dice.3d10 | archived-page | [snapshot](https://web.archive.org/web/20220625235536/http://www.random-generator.com/index.php?title=Dice) | 20220625235536 |
| Dice.4D6 | local-review | - | - |
| Dice.Digit | local-review | - | - |
| Dice.Twodthree | local-review | - | - |
| Dice.d20 | archived-page | [snapshot](https://web.archive.org/web/20220625235536/http://www.random-generator.com/index.php?title=Dice) | 20220625235536 |
| Dice.d4 | archived-page | [snapshot](https://web.archive.org/web/20220625235536/http://www.random-generator.com/index.php?title=Dice) | 20220625235536 |
| Dice.digit+1 | archived-page | [snapshot](https://web.archive.org/web/20220625235536/http://www.random-generator.com/index.php?title=Dice) | 20220625235536 |
| Dickensian Names.Last Name Suffix | archived-page | [snapshot](https://web.archive.org/web/20231209140627/http://www.random-generator.com/index.php?title=Dickensian_Names) | 20231209140627 |
| Dickensian Names.Male First | archived-page | [snapshot](https://web.archive.org/web/20231209140627/http://www.random-generator.com/index.php?title=Dickensian_Names) | 20231209140627 |
| DnD 4e character generator.ClericDaily | no-snapshot | - | - |
| DnD 4e character generator.ClericEncounter | no-snapshot | - | - |
| DnD 4e character generator.Fighter | no-snapshot | - | - |
| DnD 4e character generator.FighterPowers | no-snapshot | - | - |
| DnD 4e character generator.PaladinPowers | no-snapshot | - | - |
| DnD 4e character generator.RangerPowers | no-snapshot | - | - |
| DnD 4e character generator.RoguePowers | no-snapshot | - | - |
| DnD 4e character generator.WarlockPowers | no-snapshot | - | - |
| DnD 4e character generator.WarlordPowers | no-snapshot | - | - |
| DnD 4e character generator.WizardPowers | no-snapshot | - | - |
| DnD Next Magic Item Detail Cruncher.mod +0 | no-snapshot | - | - |
| Dossier.ForeignCapital | archived-page | [snapshot](https://web.archive.org/web/20170621015627/http://random-generator.com/index.php?title=Dossier) | 20170621015627 |
| Dossier.US Cities | archived-page | [snapshot](https://web.archive.org/web/20170621015627/http://random-generator.com/index.php?title=Dossier) | 20170621015627 |
| Dragon type.horned | archived-page | [snapshot](https://web.archive.org/web/20220119170235/https://www.random-generator.com/index.php?title=Dragon_type) | 20220119170235 |
| Drone Generator.main | no-snapshot | - | - |
| Dueling Character.ArcherShieldColor | archived-page | [snapshot](https://web.archive.org/web/20251127013447/http://www.random-generator.com/index.php?title=Dueling_Character) | 20251127013447 |
| Dueling Character.AxeHeadDepictionChance | archived-page | [snapshot](https://web.archive.org/web/20251127013447/http://www.random-generator.com/index.php?title=Dueling_Character) | 20251127013447 |
| Dueling Character.AxeHeadSpike | archived-page | [snapshot](https://web.archive.org/web/20251127013447/http://www.random-generator.com/index.php?title=Dueling_Character) | 20251127013447 |
| Dueling Character.Metalflavor | archived-page | [snapshot](https://web.archive.org/web/20251127013447/http://www.random-generator.com/index.php?title=Dueling_Character) | 20251127013447 |
| Dungeon Doors.PortalCoverings | archived-page | [snapshot](https://web.archive.org/web/20231202074812/http://www.random-generator.com/index.php?title=Dungeon_Doors) | 20231202074812 |
| Dungeon Dressing.%NSEW | archived-page | [snapshot](https://web.archive.org/web/20231202074806/http://www.random-generator.com/index.php?title=Dungeon_Dressing) | 20231202074806 |
| Dungeon Dressing.%size | archived-page | [snapshot](https://web.archive.org/web/20231202074806/http://www.random-generator.com/index.php?title=Dungeon_Dressing) | 20231202074806 |
| Dungeon Dressing.damp flora fauna | archived-page | [snapshot](https://web.archive.org/web/20231202074806/http://www.random-generator.com/index.php?title=Dungeon_Dressing) | 20231202074806 |
| Dungeon Dressing.drip | archived-page | [snapshot](https://web.archive.org/web/20231202074806/http://www.random-generator.com/index.php?title=Dungeon_Dressing) | 20231202074806 |
| Dungeon Stocker.Cistern | no-snapshot | - | - |
| Dungeon Stocker.WaitingRoom | no-snapshot | - | - |
| Dungeon Stocker.clothing | local-review | - | - |
| Dwarf Names.SGNPNorseMale | no-snapshot | - | - |
| Dyson Curse.curse | no-snapshot | - | - |
| Elements.allCap | archived-page | [snapshot](https://web.archive.org/web/20230602214912/http://www.random-generator.com/index.php?title=Elements) | 20230602214912 |
| Elements.negativeCap | archived-page | [snapshot](https://web.archive.org/web/20230602214912/http://www.random-generator.com/index.php?title=Elements) | 20230602214912 |
| Elf-folk.shape-changer | local-review | - | - |
| Enchanted Items.relic | archived-page | [snapshot](https://web.archive.org/web/20220119165803/http://www.random-generator.com/index.php?title=Enchanted_Items) | 20220119165803 |
| Enchanted Sword.motif | local-review | - | - |
| Epithets.AdjVary | local-review | - | - |
| Epithets.adj2 | local-review | - | - |
| Epithets.people | local-review | - | - |
| Epithets.place | local-review | - | - |
| Epithets.slain | local-review | - | - |
| European Kings.France | no-snapshot | - | - |
| European Kings.main | no-snapshot | - | - |
| Evocative Colors.gray | no-snapshot | - | - |
| Evocative Colors.maleshirts | no-snapshot | - | - |
| Evocative Colors.sgreen | no-snapshot | - | - |
| FRUtility.Aglarond | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Akanul | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Amn | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Baldurs Gate | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Beastlands | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Calimshan | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Chessenta | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Chult | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Cormyr | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Dalelands | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Damara | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Dambrath | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Dragon Coast | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Durpar | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.East Rift | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Elfharrow | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Elturgard | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Erlkazar | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Estagund | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Evereska | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Evermeet | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Great Dale | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Halruaa | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.High Imaskar | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Hordelands | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Impiltur | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Lake of Steam | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Luruar | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Luskan | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Many-Arrows | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Moonsea | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Moonshae Isles | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Murghom | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Myth Drannor | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Najara | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Narfell | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Nelanther Isles | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Netheril | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Okoth | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Rashemen | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Raurin | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Sea of Fallen Stars | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Sembia | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Tethyr | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Thay | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Thesk | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Turmish | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Tymanther | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Vaasa | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Var the Drowned | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Velen | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Vesperin | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Vilhon Wilds | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.Waterdeep | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FRUtility.main | archived-page | [snapshot](https://web.archive.org/web/20171014110141/http://random-generator.com/index.php?title=FRUtility) | 20171014110141 |
| FaeTroop.FaeWeakness | archived-page | [snapshot](https://web.archive.org/web/20210305191839/http://www.random-generator.com/index.php?title=FaeTroop) | 20210305191839 |
| FamousPeople.HumanFemaleDescription | no-snapshot | - | - |
| Fantasy Adventure Locations.Simplecolor | local-review | - | - |
| Fantasy Adventure Locations.citydaj | archived-page | [snapshot](https://web.archive.org/web/20231128025406/http://www.random-generator.com/index.php?title=Fantasy_Adventure_Locations) | 20231128025406 |
| Fantasy Adventure Locations.colors | archived-page | [snapshot](https://web.archive.org/web/20231128025406/http://www.random-generator.com/index.php?title=Fantasy_Adventure_Locations) | 20231128025406 |
| Fantasy Bakery.DoorAjd | no-snapshot | - | - |
| Fantasy Bakery.ExoticArchitecture | no-snapshot | - | - |
| Fantasy Combat Class Generator.Name | no-snapshot | - | - |
| Fantasy Curses and Blessings.BODY\_LOCATIONS | no-snapshot | - | - |
| Fantasy Curses and Blessings.RELATIVES | no-snapshot | - | - |
| Fantasy Landmarks.Coastal | local-review | - | - |
| Fantasy Legacies.OTHER\_DEATH EVENTS | no-snapshot | - | - |
| Fantasy Life Events.VILLAIN | no-snapshot | - | - |
| Fantasy Military Service.MILITARY\_EVENTS | no-snapshot | - | - |
| Fantasy NPC \(Basic\).Main | local-review | - | - |
| Fantasy NPC \(Basic\).Race | archived-page | [snapshot](https://web.archive.org/web/20240304173834/http://www.random-generator.com/index.php?title=Fantasy_NPC_%28Basic%29) | 20240304173834 |
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
| Fantasy Occupations.MERCHANT | no-snapshot | - | - |
| Fantasy Pantheon.Main | local-review | - | - |
| Fantasy Person Of Interest.Main | local-review | - | - |
| Fantasy Place Name.inspiration | archived-page | [snapshot](https://web.archive.org/web/20240304191137/http://www.random-generator.com/index.php?title=Fantasy_Place_Name) | 20240304191137 |
| Fantasy Place Name.main | archived-page | [snapshot](https://web.archive.org/web/20240304191137/http://www.random-generator.com/index.php?title=Fantasy_Place_Name) | 20240304191137 |
| Fantasy Place Name.plural | archived-page | [snapshot](https://web.archive.org/web/20240304191137/http://www.random-generator.com/index.php?title=Fantasy_Place_Name) | 20240304191137 |
| Fantasy Place Name.postplace | archived-page | [snapshot](https://web.archive.org/web/20240304191137/http://www.random-generator.com/index.php?title=Fantasy_Place_Name) | 20240304191137 |
| Fantasy Region.Orc Tribe Name | archived-page | [snapshot](https://web.archive.org/web/20240620162556/http://www.random-generator.com/index.php?title=Fantasy_Region) | 20240620162556 |
| Fantasy Region.State | archived-page | [snapshot](https://web.archive.org/web/20240620162556/http://www.random-generator.com/index.php?title=Fantasy_Region) | 20240620162556 |
| Fantasy Romantic History.PYSCHIC\_POWERS | archived-page | [snapshot](https://web.archive.org/web/20220627185852/http://www.random-generator.com/index.php?title=Fantasy_Romantic_History) | 20220627185852 |
| Fantasy Spellcasting Class Generator.spellcaster | archived-page | [snapshot](https://web.archive.org/web/20230325040501/https://www.random-generator.com/index.php?title=Fantasy_Spellcasting_Class_Generator) | 20230325040501 |
| Fantasy Spellcasting Class Generator.spellschool | archived-page | [snapshot](https://web.archive.org/web/20230325040501/https://www.random-generator.com/index.php?title=Fantasy_Spellcasting_Class_Generator) | 20230325040501 |
| Fantasy Sport.Teamsize | local-review | - | - |
| Fantasy Town \(Simpler\).personeventclause | archived-page | [snapshot](https://web.archive.org/web/20240304171640/http://www.random-generator.com/index.php?title=Fantasy_Town_%28Simpler%29) | 20240304171640 |
| Fantasy Town Feature.building | archived-page | [snapshot](https://web.archive.org/web/20240304174501/http://www.random-generator.com/index.php?title=Fantasy_Town_Feature) | 20240304174501 |
| Fantasy Town Names.suffix | local-review | - | - |
| Fantasy farm description.BeersNAles | archived-page | [snapshot](https://web.archive.org/web/20170713154224/http://random-generator.com/index.php?title=Fantasy_farm_description) | 20170713154224 |
| Fantasy farm description.Fruit | archived-page | [snapshot](https://web.archive.org/web/20170713154224/http://random-generator.com/index.php?title=Fantasy_farm_description) | 20170713154224 |
| Fantasy farm description.Liqueur | archived-page | [snapshot](https://web.archive.org/web/20170713154224/http://random-generator.com/index.php?title=Fantasy_farm_description) | 20170713154224 |
| Fantasy farm description.alcoholicdrinks | local-review | - | - |
| Fantasy farm description.nonalchoholicdrinks | local-review | - | - |
| Fantasy-CC-Traits.EXOTIC | no-snapshot | - | - |
| Fantasy-CC-Traits.NEUTRAL | no-snapshot | - | - |
| Fantasy-CC-Traits.UNUSUAL\_SKILLS | no-snapshot | - | - |
| FantasyBooks.subject | local-review | - | - |
| FantasyCampsite.Features | archived-page | [snapshot](https://web.archive.org/web/20250819073444/http://www.random-generator.com/index.php?title=FantasyCampsite) | 20250819073444 |
| FantasyCampsite.Type | archived-page | [snapshot](https://web.archive.org/web/20250819073444/http://www.random-generator.com/index.php?title=FantasyCampsite) | 20250819073444 |
| FantasyDrinks.DrinkNames | archived-page | [snapshot](https://web.archive.org/web/20210724014712/https://www.random-generator.com/index.php?title=FantasyDrinks) | 20210724014712 |
| FantasyDrinks.Liqueur | local-review | - | - |
| FantasyDrinks.LiqueurFlavor | local-review | - | - |
| FantasyFarmstead.AgricultureProduct | archived-page | [snapshot](https://web.archive.org/web/20070524211220/http://www.random-generator.com:80/index.php?title=FantasyFarmstead) | 20070524211220 |
| FantasyFarmstead.Product | archived-page | [snapshot](https://web.archive.org/web/20070524211220/http://www.random-generator.com:80/index.php?title=FantasyFarmstead) | 20070524211220 |
| FantasyMenu.ExoticMainMeals | archived-page | [snapshot](https://web.archive.org/web/20250823174456/http://www.random-generator.com/index.php?title=FantasyMenu) | 20250823174456 |
| Feelings.Adjective | local-review | - | - |
| Feelings.bodyfeel | archived-page | [snapshot](https://web.archive.org/web/20171013150824/http://random-generator.com/index.php?title=Feelings) | 20171013150824 |
| Feelings.smooths | archived-page | [snapshot](https://web.archive.org/web/20171013150824/http://random-generator.com/index.php?title=Feelings) | 20171013150824 |
| Female Appearance.Start | archived-page | [snapshot](https://web.archive.org/web/20170718150517/http://random-generator.com/index.php?title=Female_Appearance) | 20170718150517 |
| Field rations.cheesetype | archived-page | [snapshot](https://web.archive.org/web/20210927124702/https://www.random-generator.com/index.php?title=Field_rations) | 20210927124702 |
| Film Noir Monologue.Lady | archived-page | [snapshot](https://web.archive.org/web/20250515034256/http://random-generator.com/index.php?title=Film_Noir_Monologue) | 20250515034256 |
| Film Noir Monologue.Outro | archived-page | [snapshot](https://web.archive.org/web/20250515034256/http://random-generator.com/index.php?title=Film_Noir_Monologue) | 20250515034256 |
| Firearm Generator.MilitaryIssueChance | no-snapshot | - | - |
| Foci Generator.main | no-snapshot | - | - |
| Forgotten Realms Icons.Dragon Triumvirate Locations | archived-page | [snapshot](https://web.archive.org/web/20250825062604/http://random-generator.com/index.php?title=Forgotten_Realms_Icons) | 20250825062604 |
| Forgotten Realms Icons.Lich Zulkir Locations | archived-page | [snapshot](https://web.archive.org/web/20250825062604/http://random-generator.com/index.php?title=Forgotten_Realms_Icons) | 20250825062604 |
| Forgotten Realms Icons.Macguffin | local-review | - | - |
| Formal Names.Start | no-snapshot | - | - |
| Formal Names.mainNoTitle | no-snapshot | - | - |
| Found in a crate.main | archived-page | [snapshot](https://web.archive.org/web/20250815152715/http://random-generator.com/index.php?title=Found_in_a_crate) | 20250815152715 |
| Four Season Events.beast | no-snapshot | - | - |
| Four Season Events.direction | no-snapshot | - | - |
| Four Season Events.locations | no-snapshot | - | - |
| Fourth Page - Artifact.origin | local-review | - | - |
| Future Gear.Radioactive | archived-page | [snapshot](https://web.archive.org/web/20220701015230/http://www.random-generator.com/index.php?title=Future_Gear) | 20220701015230 |
| Future Gear.TradeGoods | archived-page | [snapshot](https://web.archive.org/web/20220701015230/http://www.random-generator.com/index.php?title=Future_Gear) | 20220701015230 |
| Félix Fénéon Orcale.main | archived-page | [snapshot](https://web.archive.org/web/20210616112928/https://www.random-generator.com/index.php?title=F%C3%A9lix_F%C3%A9n%C3%A9on_Orcale) | 20210616112928 |
| G.I. Joe Plot Generator.joecharacter | archived-page | [snapshot](https://web.archive.org/web/20210305075914/http://www.random-generator.com/index.php?title=G.I._Joe_Plot_Generator) | 20210305075914 |
| Generic Mission Generator.itempost | archived-page | [snapshot](https://web.archive.org/web/20240808081947/http://www.random-generator.com/index.php?title=Generic_Mission_Generator) | 20240808081947 |
| Generic Sci Fi Character.main | local-review | - | - |
| Germanic Tribe.middle | no-snapshot | - | - |
| GheronUtility.DietySymbol | archived-page | [snapshot](https://web.archive.org/web/20211207020217/http://www.random-generator.com/index.php?title=GheronUtility) | 20211207020217 |
| Goblin.nameob | archived-page | [snapshot](https://web.archive.org/web/20250822160052/http://www.random-generator.com/index.php?title=Goblin) | 20250822160052 |
| Guards.main | archived-page | [snapshot](https://web.archive.org/web/20230422134412/https://www.random-generator.com/index.php?title=Guards) | 20230422134412 |
| Guards.main-resolvedice | archived-page | [snapshot](https://web.archive.org/web/20230422134412/https://www.random-generator.com/index.php?title=Guards) | 20230422134412 |
| Guards.virtue | archived-page | [snapshot](https://web.archive.org/web/20230422134412/https://www.random-generator.com/index.php?title=Guards) | 20230422134412 |
| HaftedWeapons.NoDescription | archived-page | [snapshot](https://web.archive.org/web/20211028163332/https://www.random-generator.com/index.php?title=HaftedWeapons) | 20211028163332 |
| Herb Names.misc | local-review | - | - |
| Hex Map Key.Numbronesix | archived-page | [snapshot](https://web.archive.org/web/20250813232920/http://www.random-generator.com/index.php?title=Hex_Map_Key) | 20250813232920 |
| Hex Map Key.TownCustomsIntro | archived-page | [snapshot](https://web.archive.org/web/20250813232920/http://www.random-generator.com/index.php?title=Hex_Map_Key) | 20250813232920 |
| Hex Map Key.metal | local-review | - | - |
| Hex Map Key.personeventclause | archived-page | [snapshot](https://web.archive.org/web/20250813232920/http://www.random-generator.com/index.php?title=Hex_Map_Key) | 20250813232920 |
| Hireling.hireling profession | no-snapshot | - | - |
| Hoard Class.C | archived-page | [snapshot](https://web.archive.org/web/20210305061020/http://www.random-generator.com/index.php?title=Hoard_Class) | 20210305061020 |
| Hoard Class.MU/E | archived-page | [snapshot](https://web.archive.org/web/20210305061020/http://www.random-generator.com/index.php?title=Hoard_Class) | 20210305061020 |
| Holy Books.TranslationChance | archived-page | [snapshot](https://web.archive.org/web/20230320124718/https://www.random-generator.com/index.php?title=Holy_Books) | 20230320124718 |
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
| Horse Description.Gender | archived-page | [snapshot](https://web.archive.org/web/20170718150906/http://random-generator.com/index.php?title=Horse_Description) | 20170718150906 |
| Host Generator.AAA | no-snapshot | - | - |
| Host Generator.ExEleven | no-snapshot | - | - |
| Host Generator.ExNine | no-snapshot | - | - |
| Host Generator.IC | no-snapshot | - | - |
| Host Generator.IC2 | no-snapshot | - | - |
| Host Generator.R11 | no-snapshot | - | - |
| Host Generator.R7 | no-snapshot | - | - |
| Host Generator.R9 | no-snapshot | - | - |
| Host Generator.andMatrix | no-snapshot | - | - |
| Host Generator.color | no-snapshot | - | - |
| Host Generator.items | no-snapshot | - | - |
| Host Generator.theme | no-snapshot | - | - |
| Human Encounter.Bandits | local-review | - | - |
| Human Encounter.Berserkers | local-review | - | - |
| Human Encounter.Border Patrol | local-review | - | - |
| Human Encounter.Caravan | local-review | - | - |
| Human Encounter.Cavemen | local-review | - | - |
| Human Encounter.Dervishes | local-review | - | - |
| Human Encounter.Pilgrims | local-review | - | - |
| Human Encounter.Tribesmen | local-review | - | - |
| Humanoid Encounter.1d4 | archived-page | [snapshot](https://web.archive.org/web/20210301225612/http://www.random-generator.com/index.php?title=Humanoid_Encounter) | 20210301225612 |
| Humanoid Encounter.Diopsid | local-review | - | - |
| Humanoid Encounter.Dwarf | local-review | - | - |
| Humanoid Encounter.Elf | local-review | - | - |
| Humanoid Encounter.Gnome | local-review | - | - |
| Humanoid Encounter.Goblin | local-review | - | - |
| Humanoid Encounter.Halfling | local-review | - | - |
| Humanoid Encounter.Orc | local-review | - | - |
| Humanoid Encounter.Qward | archived-page | [snapshot](https://web.archive.org/web/20210301225612/http://www.random-generator.com/index.php?title=Humanoid_Encounter) | 20210301225612 |
| Humanoid Encounter.Tengu | local-review | - | - |
| Humanoid Encounter.medium band | archived-page | [snapshot](https://web.archive.org/web/20210301225612/http://www.random-generator.com/index.php?title=Humanoid_Encounter) | 20210301225612 |
| Humanoid Encounter.medium barrel | archived-page | [snapshot](https://web.archive.org/web/20210301225612/http://www.random-generator.com/index.php?title=Humanoid_Encounter) | 20210301225612 |
| Humanoid Encounter.medium bevy | archived-page | [snapshot](https://web.archive.org/web/20210301225612/http://www.random-generator.com/index.php?title=Humanoid_Encounter) | 20210301225612 |
| Humanoid Encounter.medium brood | archived-page | [snapshot](https://web.archive.org/web/20210301225612/http://www.random-generator.com/index.php?title=Humanoid_Encounter) | 20210301225612 |
| Humanoid Encounter.medium clowder | archived-page | [snapshot](https://web.archive.org/web/20210301225612/http://www.random-generator.com/index.php?title=Humanoid_Encounter) | 20210301225612 |
| Humanoid Encounter.medium cluster | archived-page | [snapshot](https://web.archive.org/web/20210301225612/http://www.random-generator.com/index.php?title=Humanoid_Encounter) | 20210301225612 |
| Humanoid Encounter.medium haven | archived-page | [snapshot](https://web.archive.org/web/20210301225612/http://www.random-generator.com/index.php?title=Humanoid_Encounter) | 20210301225612 |
| Humanoid Encounter.medium meet | archived-page | [snapshot](https://web.archive.org/web/20210301225612/http://www.random-generator.com/index.php?title=Humanoid_Encounter) | 20210301225612 |
| Humanoid Encounter.medium redoubt | archived-page | [snapshot](https://web.archive.org/web/20210301225612/http://www.random-generator.com/index.php?title=Humanoid_Encounter) | 20210301225612 |
| Humanoid Encounter.medium unkindness | archived-page | [snapshot](https://web.archive.org/web/20210301225612/http://www.random-generator.com/index.php?title=Humanoid_Encounter) | 20210301225612 |
| Humanoid Encounter.medium warband | archived-page | [snapshot](https://web.archive.org/web/20210301225612/http://www.random-generator.com/index.php?title=Humanoid_Encounter) | 20210301225612 |
| Humanoid Encounter.nine animals | archived-page | [snapshot](https://web.archive.org/web/20210301225612/http://www.random-generator.com/index.php?title=Humanoid_Encounter) | 20210301225612 |
| Humanoid Encounter.zimbad animals | archived-page | [snapshot](https://web.archive.org/web/20210301225612/http://www.random-generator.com/index.php?title=Humanoid_Encounter) | 20210301225612 |
| Inn Patrons.cold | no-snapshot | - | - |
| Inn Patrons.hot | no-snapshot | - | - |
| Inn Patrons.watery | no-snapshot | - | - |
| Inscriptions.DefiniteNoun | archived-page | [snapshot](https://web.archive.org/web/20240420063529/http://www.random-generator.com/index.php?title=Inscriptions) | 20240420063529 |
| Inscriptions.Inscriptions.Abs\_Noun\_Neg | archived-page | [snapshot](https://web.archive.org/web/20240420063529/http://www.random-generator.com/index.php?title=Inscriptions) | 20240420063529 |
| Inscriptions.Inscriptions.Abs\_Noun\_Pos | archived-page | [snapshot](https://web.archive.org/web/20240420063529/http://www.random-generator.com/index.php?title=Inscriptions) | 20240420063529 |
| Inscriptions.Main | local-review | - | - |
| Interesting Treasure Hoard Generator.LeatherAnimalType | no-snapshot | - | - |
| Iron Canyons Wilderness Encounter.Dragon | archived-page | [snapshot](https://web.archive.org/web/20171014092223/http://random-generator.com/index.php?title=Iron_Canyons_Wilderness_Encounter) | 20171014092223 |
| Island.island | archived-page | [snapshot](https://web.archive.org/web/20231201061949/http://random-generator.com/index.php?title=Island) | 20231201061949 |
| Japanese names.Male | archived-page | [snapshot](https://web.archive.org/web/20210515184340/https://www.random-generator.com/index.php?title=Japanese_names) | 20210515184340 |
| Jewelry.item | local-review | - | - |
| Jewelry.startItemOnly | local-review | - | - |
| Jgbaxter MedievalSocialClass.DisciplineArcana | no-snapshot | - | - |
| Jgbaxter MedievalSocialClass.Engineer | no-snapshot | - | - |
| Jgbaxter MedievalSocialClass.GenderPrinceTitle | no-snapshot | - | - |
| Jgbaxter MedievalSocialClass.Noble | no-snapshot | - | - |
| Jgbaxter MedievalSocialClass.RelgiousMedium | no-snapshot | - | - |
| Jgbaxter MedievalSocialClass.ReliiousLow | no-snapshot | - | - |
| Jgbaxter MedievalSocialClass.Royal | no-snapshot | - | - |
| Jgbaxter.Personality Sins and Virtues.Quality | no-snapshot | - | - |
| Jgbaxter.Personality Sins and Virtues.TraitLevelHigh | no-snapshot | - | - |
| Jgbaxter.Personality Sins and Virtues.TraitLevelLow | no-snapshot | - | - |
| Jgbaxter.Personality Sins and Virtues.TraitLevelMinimal | no-snapshot | - | - |
| Jgbaxter.Personality Sins and Virtues.TraitLevelModerate | no-snapshot | - | - |
| LL Random Magic Item.C | archived-page | [snapshot](https://web.archive.org/web/20230422152737/http://random-generator.com/index.php?title=LL_Random_Magic_Item) | 20230422152737 |
| LL Random Magic Item.MU/E | archived-page | [snapshot](https://web.archive.org/web/20230422152737/http://random-generator.com/index.php?title=LL_Random_Magic_Item) | 20230422152737 |
| Lances.NoDescription | archived-page | [snapshot](https://web.archive.org/web/20210613132050/https://www.random-generator.com/index.php?title=Lances) | 20210613132050 |
| Level 3 Monster.level2 | archived-page | [snapshot](https://web.archive.org/web/20210927214556/https://www.random-generator.com/index.php?title=Level_3_Monster) | 20210927214556 |
| Linaje Dragon Generator.CHZ-f | no-snapshot | - | - |
| Linaje Dragon Generator.dah-f | no-snapshot | - | - |
| Local Secrets.something\_else | local-review | - | - |
| LotFP Spell Lists.LevelFive | archived-page | [snapshot](https://web.archive.org/web/20230422134646/https://www.random-generator.com/index.php?title=LotFP_Spell_Lists) | 20230422134646 |
| LotFP Spell Lists.LevelFour | archived-page | [snapshot](https://web.archive.org/web/20230422134646/https://www.random-generator.com/index.php?title=LotFP_Spell_Lists) | 20230422134646 |
| LotFP Spell Lists.LevelOne | archived-page | [snapshot](https://web.archive.org/web/20230422134646/https://www.random-generator.com/index.php?title=LotFP_Spell_Lists) | 20230422134646 |
| LotFP Spell Lists.LevelSix | archived-page | [snapshot](https://web.archive.org/web/20230422134646/https://www.random-generator.com/index.php?title=LotFP_Spell_Lists) | 20230422134646 |
| LotFP Spell Lists.LevelThree | archived-page | [snapshot](https://web.archive.org/web/20230422134646/https://www.random-generator.com/index.php?title=LotFP_Spell_Lists) | 20230422134646 |
| LotFP Spell Lists.LevelTwo | archived-page | [snapshot](https://web.archive.org/web/20230422134646/https://www.random-generator.com/index.php?title=LotFP_Spell_Lists) | 20230422134646 |
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
| Lovecraft mythos weird headline.kicker | no-snapshot | - | - |
| Lovecraftian Horror Oracle.Main | local-review | - | - |
| Magic Item.A | no-snapshot | - | - |
| Magic Item.D | no-snapshot | - | - |
| Magic Item.Magic Item | local-review | - | - |
| Magic Item.Miscellaneous Weapon | no-snapshot | - | - |
| Magic Item.armor desc | no-snapshot | - | - |
| Magic Item.description | no-snapshot | - | - |
| Magic Item.potion | no-snapshot | - | - |
| Magic Item.random monster from most relevant random encounter table | no-snapshot | - | - |
| Magic Item.scroll | no-snapshot | - | - |
| Magic Item.swtype | no-snapshot | - | - |
| Magic Physics.Chance | no-snapshot | - | - |
| Magic Sword.Intelligent Sword | local-review | - | - |
| MagicalWondrous.Gemstones | no-snapshot | - | - |
| Marvel Event Generator.;B-List | no-snapshot | - | - |
| Marvel Event Generator.A-list Heroes | no-snapshot | - | - |
| Marvel Event Generator.A-lists | no-snapshot | - | - |
| Marvel Event Generator.B-list | local-review | - | - |
| Marvel Event Generator.Cosmic | local-review | - | - |
| Marvel Event Generator.D-list | local-review | - | - |
| Marvel Event Generator.Hero | local-review | - | - |
| Marvel Event Generator.Supporting | local-review | - | - |
| Marvel Event Generator.Villains | no-snapshot | - | - |
| Marvel Event Generator.a-list | local-review | - | - |
| Marvel Event Generator.aftermath | local-review | - | - |
| Marvel Event Generator.bad team | no-snapshot | - | - |
| Marvel Event Generator.badteam | no-snapshot | - | - |
| Marvel Event Generator.d-list | local-review | - | - |
| Marvel Event Generator.giant | no-snapshot | - | - |
| Marvel Event Generator.locations | no-snapshot | - | - |
| Marvel Event Generator.team | no-snapshot | - | - |
| Marvel Event Generator.third | no-snapshot | - | - |
| Marvel Event Generator.villain | local-review | - | - |
| Marvel Event Generator.villains | no-snapshot | - | - |
| Medieval Encounter.Compass | local-review | - | - |
| Medieval Encounter.Locations | local-review | - | - |
| Medieval Person.beast motivation | no-snapshot | - | - |
| Medieval Person.environmental | no-snapshot | - | - |
| Medieval Person.manorbeast | no-snapshot | - | - |
| Mermaid tails.color | archived-page | [snapshot](https://web.archive.org/web/20171014084312/http://random-generator.com/index.php?title=Mermaid_tails) | 20171014084312 |
| Message.any | archived-page | [snapshot](https://web.archive.org/web/20220122195628/https://www.random-generator.com/index.php?title=Message) | 20220122195628 |
| Message.guy | archived-page | [snapshot](https://web.archive.org/web/20220122195628/https://www.random-generator.com/index.php?title=Message) | 20220122195628 |
| Message.main | archived-page | [snapshot](https://web.archive.org/web/20220122195628/https://www.random-generator.com/index.php?title=Message) | 20220122195628 |
| Message.message | archived-page | [snapshot](https://web.archive.org/web/20220122195628/https://www.random-generator.com/index.php?title=Message) | 20220122195628 |
| Messages for the Empress.or so | archived-page | [snapshot](https://web.archive.org/web/20220129063310/http://www.random-generator.com/index.php?title=Messages_for_the_Empress) | 20220129063310 |
| Messages for the Empress.wordswords | archived-page | [snapshot](https://web.archive.org/web/20220129063310/http://www.random-generator.com/index.php?title=Messages_for_the_Empress) | 20220129063310 |
| Metamorphica.creature | archived-page | [snapshot](https://web.archive.org/web/20210303013804/http://www.random-generator.com/index.php?title=Metamorphica) | 20210303013804 |
| Middle Eastern Character.ArcherShieldColor | archived-page | [snapshot](https://web.archive.org/web/20171014234232/http://random-generator.com/index.php?title=Middle_Eastern_Character) | 20171014234232 |
| Middle Eastern Character.BarbarianArmor | archived-page | [snapshot](https://web.archive.org/web/20171014234232/http://random-generator.com/index.php?title=Middle_Eastern_Character) | 20171014234232 |
| Middle Eastern Character.Blunt | archived-page | [snapshot](https://web.archive.org/web/20171014234232/http://random-generator.com/index.php?title=Middle_Eastern_Character) | 20171014234232 |
| Middle Eastern Character.HeavyArmor | archived-page | [snapshot](https://web.archive.org/web/20171014234232/http://random-generator.com/index.php?title=Middle_Eastern_Character) | 20171014234232 |
| Middle Eastern Character.HeavyShield | archived-page | [snapshot](https://web.archive.org/web/20171014234232/http://random-generator.com/index.php?title=Middle_Eastern_Character) | 20171014234232 |
| Middle Eastern Character.LightArmor | archived-page | [snapshot](https://web.archive.org/web/20171014234232/http://random-generator.com/index.php?title=Middle_Eastern_Character) | 20171014234232 |
| Middle Eastern Character.LightShield | archived-page | [snapshot](https://web.archive.org/web/20171014234232/http://random-generator.com/index.php?title=Middle_Eastern_Character) | 20171014234232 |
| Middle Eastern Character.Swords | archived-page | [snapshot](https://web.archive.org/web/20171014234232/http://random-generator.com/index.php?title=Middle_Eastern_Character) | 20171014234232 |
| Middle Eastern Character.TwoHandBlunt | archived-page | [snapshot](https://web.archive.org/web/20171014234232/http://random-generator.com/index.php?title=Middle_Eastern_Character) | 20171014234232 |
| Middle Eastern Gear.TwoHandAxe | archived-page | [snapshot](https://web.archive.org/web/20210418125036/http://www.random-generator.com/index.php?title=Middle_Eastern_Gear) | 20210418125036 |
| Middle Eastern Gear.TwoHandSwordType | archived-page | [snapshot](https://web.archive.org/web/20210418125036/http://www.random-generator.com/index.php?title=Middle_Eastern_Gear) | 20210418125036 |
| Modern Profession.Federal Agent | archived-page | [snapshot](https://web.archive.org/web/20210513095321/https://www.random-generator.com/index.php?title=Modern_Profession) | 20210513095321 |
| Modern Profession.Profession | local-review | - | - |
| Modifier.p3d6 | archived-page | [snapshot](https://web.archive.org/web/20230422134844/https://www.random-generator.com/index.php?title=Modifier) | 20230422134844 |
| Musical Instruments.RankEnglishSpecialReligious | archived-page | [snapshot](https://web.archive.org/web/20250823110221/http://www.random-generator.com/index.php?title=Musical_Instruments) | 20250823110221 |
| MusicalInstruments.RankEnglishSpecialReligious | archived-page | [snapshot](https://web.archive.org/web/20220120232533/https://www.random-generator.com/index.php?title=MusicalInstruments) | 20220120232533 |
| Mutant Hordeling.skin app | no-snapshot | - | - |
| NPC-Events-CC.Tragedy | local-review | - | - |
| Nazi.german surname | no-snapshot | - | - |
| Nazi.nationality\_aristocratic | no-snapshot | - | - |
| New Monster Name.Pre | local-review | - | - |
| Nightmares Underneath - 3d6 in Order.Level | no-snapshot | - | - |
| Nightmares Underneath - Equipment - SS 3.Level | no-snapshot | - | - |
| Noble Houses.commodity | no-snapshot | - | - |
| OSR Armor.leather type | archived-page | [snapshot](https://web.archive.org/web/20170519042326/http://www.random-generator.com/index.php?title=OSR_Armor) | 20170519042326 |
| OSR Dragon Generator.mental disorder | archived-page | [snapshot](https://web.archive.org/web/20171013153017/http://random-generator.com/index.php?title=OSR_Dragon_Generator) | 20171013153017 |
| Old West Objects.WesternFurishing | archived-page | [snapshot](https://web.archive.org/web/20210305065139/http://www.random-generator.com/index.php?title=Old_West_Objects) | 20210305065139 |
| Orc Names.CapCons | archived-page | [snapshot](https://web.archive.org/web/20171014090717/http://random-generator.com/index.php?title=Orc_Names) | 20171014090717 |
| Orc Names.CapVowel | archived-page | [snapshot](https://web.archive.org/web/20171014090717/http://random-generator.com/index.php?title=Orc_Names) | 20171014090717 |
| Orc Names.More | archived-page | [snapshot](https://web.archive.org/web/20171014090717/http://random-generator.com/index.php?title=Orc_Names) | 20171014090717 |
| Ostler.general-mount | archived-page | [snapshot](https://web.archive.org/web/20250319003348/http://www.random-generator.com/index.php?title=Ostler) | 20250319003348 |
| Ostler.general-mount-quirk | archived-page | [snapshot](https://web.archive.org/web/20250319003348/http://www.random-generator.com/index.php?title=Ostler) | 20250319003348 |
| Ostler.intro | archived-page | [snapshot](https://web.archive.org/web/20250319003348/http://www.random-generator.com/index.php?title=Ostler) | 20250319003348 |
| Ostler.quirk | archived-page | [snapshot](https://web.archive.org/web/20250319003348/http://www.random-generator.com/index.php?title=Ostler) | 20250319003348 |
| Painting.HistoricalAge | archived-page | [snapshot](https://web.archive.org/web/20211016015424/https://www.random-generator.com/index.php?title=Painting) | 20211016015424 |
| Painting.HoldingSentence | archived-page | [snapshot](https://web.archive.org/web/20211016015424/https://www.random-generator.com/index.php?title=Painting) | 20211016015424 |
| Painting.PortraitPose | archived-page | [snapshot](https://web.archive.org/web/20211016015424/https://www.random-generator.com/index.php?title=Painting) | 20211016015424 |
| Patent Medicine.ameprefixfemale | archived-page | [snapshot](https://web.archive.org/web/20220524210912/http://www.random-generator.com/index.php?title=Patent_Medicine) | 20220524210912 |
| Pathfinder / 3 5 Monster.Pathfinder Outsider \(Aeon, Extraplanar\) | archived-page | [snapshot](https://web.archive.org/web/20210514153510/https://www.random-generator.com/index.php?title=Pathfinder_/_3_5_Monster) | 20210514153510 |
| Pathfinder Artifact.EnergyType | archived-page | [snapshot](https://web.archive.org/web/20220701013910/http://www.random-generator.com/index.php?title=Pathfinder_Artifact) | 20220701013910 |
| Pathfinder Artifact.RandomEffects | archived-page | [snapshot](https://web.archive.org/web/20220701013910/http://www.random-generator.com/index.php?title=Pathfinder_Artifact) | 20220701013910 |
| Pathfinder Artifact.d20AC | archived-page | [snapshot](https://web.archive.org/web/20220701013910/http://www.random-generator.com/index.php?title=Pathfinder_Artifact) | 20220701013910 |
| Pathfinder Artifact.d20Saves | archived-page | [snapshot](https://web.archive.org/web/20220701013910/http://www.random-generator.com/index.php?title=Pathfinder_Artifact) | 20220701013910 |
| Pathfinder Artifact.d20Skills | archived-page | [snapshot](https://web.archive.org/web/20220701013910/http://www.random-generator.com/index.php?title=Pathfinder_Artifact) | 20220701013910 |
| Pathfinder Artifact.d20Stat | archived-page | [snapshot](https://web.archive.org/web/20220701013910/http://www.random-generator.com/index.php?title=Pathfinder_Artifact) | 20220701013910 |
| Pathfinder Spell List A-D.Emotion/Thought High Level | archived-page | [snapshot](https://web.archive.org/web/20210514170756/https://www.random-generator.com/index.php?title=Pathfinder_Spell_List_A-D) | 20210514170756 |
| Pathfinder Spell List A-D.Emotion/Thought Low Level | archived-page | [snapshot](https://web.archive.org/web/20210514170756/https://www.random-generator.com/index.php?title=Pathfinder_Spell_List_A-D) | 20210514170756 |
| Pathfinder Spell List A-D.Emotion/Thought Medium Level | archived-page | [snapshot](https://web.archive.org/web/20210514170756/https://www.random-generator.com/index.php?title=Pathfinder_Spell_List_A-D) | 20210514170756 |
| Pathfinder Spell List.Ice High Level | archived-page | [snapshot](https://web.archive.org/web/20210514174240/https://www.random-generator.com/index.php?title=Pathfinder_Spell_List) | 20210514174240 |
| Pathfinder Spell List.Ice Low Level | archived-page | [snapshot](https://web.archive.org/web/20210514174240/https://www.random-generator.com/index.php?title=Pathfinder_Spell_List) | 20210514174240 |
| Pathfinder Spell List.Ice Medium Level | archived-page | [snapshot](https://web.archive.org/web/20210514174240/https://www.random-generator.com/index.php?title=Pathfinder_Spell_List) | 20210514174240 |
| Pathfinder Spell List.Wizard 2 | archived-page | [snapshot](https://web.archive.org/web/20210514174240/https://www.random-generator.com/index.php?title=Pathfinder_Spell_List) | 20210514174240 |
| Pathfinder spell.inquisitor3 | no-snapshot | - | - |
| Penny D.Doomsday Devices | no-snapshot | - | - |
| Penny D.Escape | no-snapshot | - | - |
| Penny D.subhook | no-snapshot | - | - |
| Penny For My Thoughts Memory Trigger.shouts | no-snapshot | - | - |
| Perilous Wilds Creature.size | no-snapshot | - | - |
| Perilous Wilds Creature.special\_chance\_pre | no-snapshot | - | - |
| Perilous Wilds Danger.oddity | archived-page | [snapshot](https://web.archive.org/web/20171014083942/http://random-generator.com/index.php?title=Perilous_Wilds_Danger) | 20171014083942 |
| Perilous Wilds Discovery.magic | archived-page | [snapshot](https://web.archive.org/web/20171014091515/http://random-generator.com/index.php?title=Perilous_Wilds_Discovery) | 20171014091515 |
| Pickpocket.MidContents | archived-page | [snapshot](https://web.archive.org/web/20250818004020/http://www.random-generator.com/index.php?title=Pickpocket) | 20250818004020 |
| Pickpocket.MidNPC | archived-page | [snapshot](https://web.archive.org/web/20250818004020/http://www.random-generator.com/index.php?title=Pickpocket) | 20250818004020 |
| Pickpocket.NPCDescriptor | archived-page | [snapshot](https://web.archive.org/web/20250818004020/http://www.random-generator.com/index.php?title=Pickpocket) | 20250818004020 |
| Pickpocket.PoorContents | archived-page | [snapshot](https://web.archive.org/web/20250818004020/http://www.random-generator.com/index.php?title=Pickpocket) | 20250818004020 |
| Pickpocket.PoorNPC | archived-page | [snapshot](https://web.archive.org/web/20250818004020/http://www.random-generator.com/index.php?title=Pickpocket) | 20250818004020 |
| Pickpocket.RichContents | archived-page | [snapshot](https://web.archive.org/web/20250818004020/http://www.random-generator.com/index.php?title=Pickpocket) | 20250818004020 |
| Pickpocket.RichNPC | archived-page | [snapshot](https://web.archive.org/web/20250818004020/http://www.random-generator.com/index.php?title=Pickpocket) | 20250818004020 |
| Pickpocket.StealVerb | archived-page | [snapshot](https://web.archive.org/web/20250818004020/http://www.random-generator.com/index.php?title=Pickpocket) | 20250818004020 |
| Piercings.Start | archived-page | [snapshot](https://web.archive.org/web/20171013142817/http://random-generator.com/index.php?title=Piercings) | 20171013142817 |
| Piercings.middleware | archived-page | [snapshot](https://web.archive.org/web/20171013142817/http://random-generator.com/index.php?title=Piercings) | 20171013142817 |
| Pirate Oracle - Black Sails on the Horizon.main | archived-page | [snapshot](https://web.archive.org/web/20240304172748/http://www.random-generator.com/index.php?title=Pirate_Oracle_-_Black_Sails_on_the_Horizon) | 20240304172748 |
| Planarch Codex Parish.item-description-consonant | archived-page | [snapshot](https://web.archive.org/web/20250821080418/http://www.random-generator.com/index.php?title=Planarch_Codex_Parish) | 20250821080418 |
| Planet Name.letter | archived-page | [snapshot](https://web.archive.org/web/20210515134654/https://www.random-generator.com/index.php?title=Planet_Name) | 20210515134654 |
| Port Rumors.alltowns | no-snapshot | - | - |
| Potion Provider.mod | no-snapshot | - | - |
| Prophecies.heard | archived-page | [snapshot](https://web.archive.org/web/20220701012433/http://www.random-generator.com/index.php?title=Prophecies) | 20220701012433 |
| Psychon Mutants.has\_mutation\_select | archived-page | [snapshot](https://web.archive.org/web/20220119173823/http://www.random-generator.com/index.php?title=Psychon_Mutants) | 20220119173823 |
| Psychon.tin | archived-page | [snapshot](https://web.archive.org/web/20260303061205/http://www.random-generator.com/index.php?title=Psychon) | 20260303061205 |
| Pulp Fantasy Nation.Main | local-review | - | - |
| Pulp Villain.major\_aim\_1 | archived-page | [snapshot](https://web.archive.org/web/20250117054622/http://www.random-generator.com/index.php?title=Pulp_Villain) | 20250117054622 |
| Pulp Villain.major\_aim\_2 | archived-page | [snapshot](https://web.archive.org/web/20250117054622/http://www.random-generator.com/index.php?title=Pulp_Villain) | 20250117054622 |
| Pulp Villain.nation | archived-page | [snapshot](https://web.archive.org/web/20250117054622/http://www.random-generator.com/index.php?title=Pulp_Villain) | 20250117054622 |
| Pulp Villain.target\_aim | archived-page | [snapshot](https://web.archive.org/web/20250117054622/http://www.random-generator.com/index.php?title=Pulp_Villain) | 20250117054622 |
| Quick Horrors.main | archived-page | [snapshot](https://web.archive.org/web/20230422134523/https://www.random-generator.com/index.php?title=Quick_Horrors) | 20230422134523 |
| Quick NPC.NPCDescriptor-noarticle | archived-page | [snapshot](https://web.archive.org/web/20240808082432/http://www.random-generator.com/index.php?title=Quick_NPC) | 20240808082432 |
| Quick PC.GUY | local-review | - | - |
| Quick Populations.anygroup | archived-page | [snapshot](https://web.archive.org/web/20211201124142/https://www.random-generator.com/index.php?title=Quick_Populations) | 20211201124142 |
| Quick Populations.domestic-animal | archived-page | [snapshot](https://web.archive.org/web/20211201124142/https://www.random-generator.com/index.php?title=Quick_Populations) | 20211201124142 |
| Quick Populations.power-animal | archived-page | [snapshot](https://web.archive.org/web/20211201124142/https://www.random-generator.com/index.php?title=Quick_Populations) | 20211201124142 |
| Quick Starting Equipment.adventuregear | no-snapshot | - | - |
| Quick Starting Equipment.blank | no-snapshot | - | - |
| Quick levelling.inspiring combat maneuvers | archived-page | [snapshot](https://web.archive.org/web/20240318235338/http://www.random-generator.com/index.php?title=Quick_levelling) | 20240318235338 |
| Random Datafiles for HMR.mysticalpowers | no-snapshot | - | - |
| Random Fantasy NPC.EmptyTable | archived-page | [snapshot](https://web.archive.org/web/20231120221957/https://random-generator.com/index.php?title=Random_Fantasy_NPC) | 20231120221957 |
| Random Humanoid Horde.Level | archived-page | [snapshot](https://web.archive.org/web/20260212065921/http://www.random-generator.com/index.php?title=Random_Humanoid_Horde) | 20260212065921 |
| Random Humanoid Horde.Numbronesix | archived-page | [snapshot](https://web.archive.org/web/20260212065921/http://www.random-generator.com/index.php?title=Random_Humanoid_Horde) | 20260212065921 |
| Random Tools for Mutant Future.Junk | local-review | - | - |
| Reagent Generator.Animal | no-snapshot | - | - |
| Reagent Generator.DryGoodsContainer | no-snapshot | - | - |
| Reagent Generator.Jewelry | no-snapshot | - | - |
| Reagent Generator.SRanimal | no-snapshot | - | - |
| Reagent Generator.Stuff | no-snapshot | - | - |
| Reagent Generator.number | no-snapshot | - | - |
| Reagent Generator.parts | no-snapshot | - | - |
| Resting In Town Before Going Back Into The Dungeon.\[https:&#47;&#47;www.dropbox.com/s/s8pu4s9kliv2q42/Original%20Petty%20Gods%20-%20OPG.pdf Petty Gods pdf\] | needs-review | - | - |
| Resting In Town Before Going Back Into The Dungeon.digit | archived-page | [snapshot](https://web.archive.org/web/20231226011435/https://www.random-generator.com/index.php?title=Resting_In_Town_Before_Going_Back_Into_The_Dungeon) | 20231226011435 |
| Rituals.eventAny | archived-page | [snapshot](https://web.archive.org/web/20250816010045/http://www.random-generator.com/index.php?title=Rituals) | 20250816010045 |
| Rituals.riteAny | archived-page | [snapshot](https://web.archive.org/web/20250816010045/http://www.random-generator.com/index.php?title=Rituals) | 20250816010045 |
| Rituals.riteClause | archived-page | [snapshot](https://web.archive.org/web/20250816010045/http://www.random-generator.com/index.php?title=Rituals) | 20250816010045 |
| Rituals.ritualStart | archived-page | [snapshot](https://web.archive.org/web/20250816010045/http://www.random-generator.com/index.php?title=Rituals) | 20250816010045 |
| Romance of the Three Kingdoms.ChineseFemaleName | no-snapshot | - | - |
| Romance of the Three Kingdoms.Rank | no-snapshot | - | - |
| SCP Foundation Idea Generator.adjective | local-review | - | - |
| SGNP barbarians.BarbarianSurnam | archived-page | [snapshot](https://web.archive.org/web/20210725064612/https://www.random-generator.com/index.php?title=SGNP_barbarians) | 20210725064612 |
| SGNP zulu.surname | archived-page | [snapshot](https://web.archive.org/web/20210725071351/https://www.random-generator.com/index.php?title=SGNP_zulu) | 20210725071351 |
| SciFiStowAways. / a lover / an ex-lover / a religious place | no-snapshot | - | - |
| SciFiStowAways. / meaning | no-snapshot | - | - |
| Scroll.CaseDecoration | archived-page | [snapshot](https://web.archive.org/web/20231202074810/http://www.random-generator.com/index.php?title=Scroll) | 20231202074810 |
| Scroll.SpoolMaterial | archived-page | [snapshot](https://web.archive.org/web/20231202074810/http://www.random-generator.com/index.php?title=Scroll) | 20231202074810 |
| Scroll.main | local-review | - | - |
| Sea Encounters.elfofficers | local-review | - | - |
| Sea Encounters.justthePlace | local-review | - | - |
| Sea Encounters.monstercaptain | local-review | - | - |
| Sea Encounters.zhousurvivors | local-review | - | - |
| Secret Society Title.Main | local-review | - | - |
| Secret Society Title.title | local-review | - | - |
| Secret Society Title.titledescriptor | local-review | - | - |
| Security and Site Generator.AAA | no-snapshot | - | - |
| Shadowrun Background Generator.Clothes | no-snapshot | - | - |
| Shadowrun Bar.DowntownBars | archived-page | [snapshot](https://web.archive.org/web/20220121204614/http://www.random-generator.com/index.php?title=Shadowrun_Bar) | 20220121204614 |
| Shadowrun Bar.EastsideBars | archived-page | [snapshot](https://web.archive.org/web/20220121204614/http://www.random-generator.com/index.php?title=Shadowrun_Bar) | 20220121204614 |
| Shadowrun Bar.SouthsideBars | archived-page | [snapshot](https://web.archive.org/web/20220121204614/http://www.random-generator.com/index.php?title=Shadowrun_Bar) | 20220121204614 |
| Shadowrun Bar.WestsideBars | archived-page | [snapshot](https://web.archive.org/web/20220121204614/http://www.random-generator.com/index.php?title=Shadowrun_Bar) | 20220121204614 |
| Shadowrun Barrens Brew Generator.Drinknames | local-review | - | - |
| Shadowrun Barrens Menu Generator.ExoticMainMeals | archived-page | [snapshot](https://web.archive.org/web/20220521131629/http://www.random-generator.com/index.php?title=Shadowrun_Barrens_Menu_Generator) | 20220521131629 |
| Shadowrun Barrens Menu Generator.menu | local-review | - | - |
| Shadowrun Border Crossing Generator.BorderSenso8r | no-snapshot | - | - |
| Shadowrun Border Crossing Generator.range8 | local-review | - | - |
| Shadowrun Bounty Hunting Job Thresholds.FemaleTattoo | local-review | - | - |
| Shadowrun Drone Generator.FletchingColor | archived-page | [snapshot](https://web.archive.org/web/20210919105452/https://www.random-generator.com/index.php?title=Shadowrun_Drone_Generator) | 20210919105452 |
| Shadowrun Firearm Generator.ForeGrip | local-review | - | - |
| Shadowrun Heist Generator.Warding | archived-page | [snapshot](https://web.archive.org/web/20210515150357/https://www.random-generator.com/index.php?title=Shadowrun_Heist_Generator) | 20210515150357 |
| Shadowrun Host Generator.DTSpam | archived-page | [snapshot](https://web.archive.org/web/20210515132510/https://www.random-generator.com/index.php?title=Shadowrun_Host_Generator) | 20210515132510 |
| Shadowrun Host Generator.SSpam | archived-page | [snapshot](https://web.archive.org/web/20210515132510/https://www.random-generator.com/index.php?title=Shadowrun_Host_Generator) | 20210515132510 |
| Shadowrun Host Generator.Spam | archived-page | [snapshot](https://web.archive.org/web/20210515132510/https://www.random-generator.com/index.php?title=Shadowrun_Host_Generator) | 20210515132510 |
| Shadowrun Host Generator.black | archived-page | [snapshot](https://web.archive.org/web/20210515132510/https://www.random-generator.com/index.php?title=Shadowrun_Host_Generator) | 20210515132510 |
| Shadowrun MSP Location Generator.Restaurant | archived-page | [snapshot](https://web.archive.org/web/20211028204617/http://www.random-generator.com/index.php?title=Shadowrun_MSP_Location_Generator) | 20211028204617 |
| Shadowrun MSP Location Generator.SecurityLocation | archived-page | [snapshot](https://web.archive.org/web/20211028204617/http://www.random-generator.com/index.php?title=Shadowrun_MSP_Location_Generator) | 20211028204617 |
| Shadowrun MSP Location Generator.SouthsideStripClubs | archived-page | [snapshot](https://web.archive.org/web/20211028204617/http://www.random-generator.com/index.php?title=Shadowrun_MSP_Location_Generator) | 20211028204617 |
| Shadowrun Reagent Generator.Predicate | archived-page | [snapshot](https://web.archive.org/web/20170719100334/http://random-generator.com/index.php?title=Shadowrun_Reagent_Generator) | 20170719100334 |
| Shadowrun Security and Site Generator.Warding | archived-page | [snapshot](https://web.archive.org/web/20210515133807/https://www.random-generator.com/index.php?title=Shadowrun_Security_and_Site_Generator) | 20210515133807 |
| Shadowrun UCAS Ration Generator.ExoticMainMeals | archived-page | [snapshot](https://web.archive.org/web/20210919144226/http://www.random-generator.com/index.php?title=Shadowrun_UCAS_Ration_Generator) | 20210919144226 |
| Shadowrun Utility.FemaleNames | archived-page | [snapshot](https://web.archive.org/web/20210919125933/http://www.random-generator.com/index.php?title=Shadowrun_Utility) | 20210919125933 |
| Shadowrun Utility.MaleNames | archived-page | [snapshot](https://web.archive.org/web/20210919125933/http://www.random-generator.com/index.php?title=Shadowrun_Utility) | 20210919125933 |
| Shinobi and samurai loot.TwoHandSwordType | no-snapshot | - | - |
| Ship Description.Main | local-review | - | - |
| Siege Force.LightHeavy | archived-page | [snapshot](https://web.archive.org/web/20210128013026/http://www.random-generator.com/index.php?title=Siege_Force) | 20210128013026 |
| Simple Colors.SGREY | no-snapshot | - | - |
| Simple Colors.brown | no-snapshot | - | - |
| Simple Colors.gray | no-snapshot | - | - |
| Simple Colors.sblack | local-review | - | - |
| Simple Colors.sblue | no-snapshot | - | - |
| Simple Colors.sbrown | local-review | - | - |
| Simple Colors.scan | local-review | - | - |
| Simple Colors.sgray | local-review | - | - |
| Simple Colors.sgreen | no-snapshot | - | - |
| Simple Colors.sgrey | no-snapshot | - | - |
| Simple Colors.sorange | no-snapshot | - | - |
| Simple Colors.spink | no-snapshot | - | - |
| Simple Colors.spurple | no-snapshot | - | - |
| Simple Colors.sred | no-snapshot | - | - |
| Simple Colors.swhite | local-review | - | - |
| Simple Colors.syellow | no-snapshot | - | - |
| Simple Colors.white | no-snapshot | - | - |
| Sky Island in Shattered Eberron.Eberron sea | local-review | - | - |
| SnW Monster Generator.hd1012 | archived-page | [snapshot](https://web.archive.org/web/20231225170443/https://www.random-generator.com/index.php?title=SnW_Monster_Generator) | 20231225170443 |
| Spells By School.SorcerySuffix | no-snapshot | - | - |
| Sstabhmontown Hirelings.Dice 1d4+1 | archived-page | [snapshot](https://web.archive.org/web/20191221110529/http://random-generator.com/index.php?title=Sstabhmontown_Hirelings) | 20191221110529 |
| Sstabhmontown Hirelings.horseman | archived-page | [snapshot](https://web.archive.org/web/20191221110529/http://random-generator.com/index.php?title=Sstabhmontown_Hirelings) | 20191221110529 |
| Sstabhmontown Magic Items.13 | no-snapshot | - | - |
| Sstabhmontown Magic Items.15 | no-snapshot | - | - |
| Sstabhmontown Magic Items.17 | no-snapshot | - | - |
| Sstabhmontown Magic Items.excpetional | no-snapshot | - | - |
| Sstabhmontown Magic Items.scrolleOne | no-snapshot | - | - |
| Sstabhmontown Mercenaries.championarmour | archived-page | [snapshot](https://web.archive.org/web/20210305061707/http://www.random-generator.com/index.php?title=Sstabhmontown_Mercenaries) | 20210305061707 |
| Sstabhmontown Mercenaries.championshield | archived-page | [snapshot](https://web.archive.org/web/20210305061707/http://www.random-generator.com/index.php?title=Sstabhmontown_Mercenaries) | 20210305061707 |
| Sstabhmontown Mercenaries.cleric-champion-magic | archived-page | [snapshot](https://web.archive.org/web/20210305061707/http://www.random-generator.com/index.php?title=Sstabhmontown_Mercenaries) | 20210305061707 |
| Sstabhmontown Mercenaries.comandersword | archived-page | [snapshot](https://web.archive.org/web/20210305061707/http://www.random-generator.com/index.php?title=Sstabhmontown_Mercenaries) | 20210305061707 |
| Sstabhmontown Mercenaries.druid-champion-magic | archived-page | [snapshot](https://web.archive.org/web/20210305061707/http://www.random-generator.com/index.php?title=Sstabhmontown_Mercenaries) | 20210305061707 |
| Sstabhmontown Mercenaries.mu-champion-magic | archived-page | [snapshot](https://web.archive.org/web/20210305061707/http://www.random-generator.com/index.php?title=Sstabhmontown_Mercenaries) | 20210305061707 |
| Sstabhmontown Mercenaries.power | archived-page | [snapshot](https://web.archive.org/web/20210305061707/http://www.random-generator.com/index.php?title=Sstabhmontown_Mercenaries) | 20210305061707 |
| Sstabhmontown Mercenaries.slcomcomcapha | archived-page | [snapshot](https://web.archive.org/web/20210305061707/http://www.random-generator.com/index.php?title=Sstabhmontown_Mercenaries) | 20210305061707 |
| Star Trek: The Next Generation Plot Generator.tngrew | no-snapshot | - | - |
| Star Wars Random NPC.main | local-review | - | - |
| Starship Breakdowns. / small / large | archived-page | [snapshot](https://web.archive.org/web/20211129060710/http://www.random-generator.com/index.php?title=Starship_Breakdowns) | 20211129060710 |
| Starship Breakdowns. / too hot / too cold | archived-page | [snapshot](https://web.archive.org/web/20211129060710/http://www.random-generator.com/index.php?title=Starship_Breakdowns) | 20211129060710 |
| Starting Equipment.adventurer-gear | archived-page | [snapshot](https://web.archive.org/web/20230422135007/https://www.random-generator.com/index.php?title=Starting_Equipment) | 20230422135007 |
| Starting Equipment.any-basic | archived-page | [snapshot](https://web.archive.org/web/20230422135007/https://www.random-generator.com/index.php?title=Starting_Equipment) | 20230422135007 |
| Starting Equipment.any-junk | archived-page | [snapshot](https://web.archive.org/web/20230422135007/https://www.random-generator.com/index.php?title=Starting_Equipment) | 20230422135007 |
| Starting Equipment.anything | archived-page | [snapshot](https://web.archive.org/web/20230422135007/https://www.random-generator.com/index.php?title=Starting_Equipment) | 20230422135007 |
| Starting Equipment.goodarmor | archived-page | [snapshot](https://web.archive.org/web/20230422135007/https://www.random-generator.com/index.php?title=Starting_Equipment) | 20230422135007 |
| Starting Equipment.hireling-gear | archived-page | [snapshot](https://web.archive.org/web/20230422135007/https://www.random-generator.com/index.php?title=Starting_Equipment) | 20230422135007 |
| Starting Equipment.simple-gear | archived-page | [snapshot](https://web.archive.org/web/20230422135007/https://www.random-generator.com/index.php?title=Starting_Equipment) | 20230422135007 |
| Steampunk.powerprefix | no-snapshot | - | - |
| Stolen Lands Treasure.2d4 | no-snapshot | - | - |
| Stolen Lands Treasure.moderatepoison | no-snapshot | - | - |
| Strange Languages.lengish\_word | archived-page | [snapshot](https://web.archive.org/web/20210517132747/https://www.random-generator.com/index.php?title=Strange_Languages) | 20210517132747 |
| Strange New World.molten\_rocky\_planet | archived-page | [snapshot](https://web.archive.org/web/20250816094513/http://www.random-generator.com/index.php?title=Strange_New_World) | 20250816094513 |
| Strange New World.oceanic\_rocky\_planet | archived-page | [snapshot](https://web.archive.org/web/20250816094513/http://www.random-generator.com/index.php?title=Strange_New_World) | 20250816094513 |
| Substances.chunks | local-review | - | - |
| Suburban development names.suffixmed | archived-page | [snapshot](https://web.archive.org/web/20250818094206/http://www.random-generator.com/index.php?title=Suburban_development_names) | 20250818094206 |
| Swords.NoDescription | archived-page | [snapshot](https://web.archive.org/web/20260318190858/http://www.random-generator.com/index.php?title=Swords) | 20260318190858 |
| Syfy original movie.a | no-snapshot | - | - |
| Tavern Entertainer Circuit.Level | no-snapshot | - | - |
| Terrain Feature.water dragon | no-snapshot | - | - |
| The Blues Engine.Significant other | no-snapshot | - | - |
| The Demon's True Name.Carcosa | local-review | - | - |
| The Plum in the Golden Vase.ChineseFemaleName | no-snapshot | - | - |
| Today At Sea.ships | local-review | - | - |
| Trade Goods.GlassOpacity | archived-page | [snapshot](https://web.archive.org/web/20210514171419/https://www.random-generator.com/index.php?title=Trade_Goods) | 20210514171419 |
| Treatment-test.Events | no-snapshot | - | - |
| Unprotected Treasure.C | no-snapshot | - | - |
| Unprotected Treasure.MU/E | no-snapshot | - | - |
| Unprotected Treasure.unprotectedtreasure9 | no-snapshot | - | - |
| User talk:MiSuBa.FemaleHobby | no-snapshot | - | - |
| User talk:MiSuBa.FemaleJob | no-snapshot | - | - |
| User talk:MiSuBa.MaleHobby | no-snapshot | - | - |
| User talk:MiSuBa.MaleJob | no-snapshot | - | - |
| User:GreyKnight/arcana test.STR 1, DEX 10, WIS 1, 1HP, attack 1 | no-snapshot | - | - |
| User:GreyKnight/arcana test.STR 5, DEX 10, WIS 13, 1 HP, attack d4 | no-snapshot | - | - |
| User:Samohtrace.Restaurant | archived-page | [snapshot](https://web.archive.org/web/20211021200827/https://www.random-generator.com/index.php?title=User:Samohtrace) | 20211021200827 |
| User:SirKodiak/Sandbox.actions\_taken | no-snapshot | - | - |
| Utility.Clothe | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.Color | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.Colors | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.DarkColorsColors | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.Drinks | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.FancyCloth | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.Foodstuffs | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.FullMeal\(FantasyMenu\) | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.LeatherAnimalType | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.MetallicColors | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.Metals | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.Nuts | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.PerfumeScents | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.TradeGoodsAnimals | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.Vegetables | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.WoodsBow | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.color | archived-page | [snapshot](https://web.archive.org/web/20210517135753/https://www.random-generator.com/index.php?title=Utility) | 20210517135753 |
| Utility.flower | local-review | - | - |
| Utility.fruit | local-review | - | - |
| Utility.fur | local-review | - | - |
| Utility.hornivory | local-review | - | - |
| Utility.metal | local-review | - | - |
| Utility.symbols | local-review | - | - |
| Utility.wood | local-review | - | - |
| Vehicle Generator.AirMfg | no-snapshot | - | - |
| Vehicle Generator.Car | no-snapshot | - | - |
| Vehicle Generator.CarMfg | no-snapshot | - | - |
| Vehicle Generator.Decor | no-snapshot | - | - |
| Vehicle Generator.FirstClassQuality | no-snapshot | - | - |
| Vehicle Generator.Helo | no-snapshot | - | - |
| Vehicle Generator.Paint | no-snapshot | - | - |
| Vehicle Generator.Quality | no-snapshot | - | - |
| Vehicle Generator.Rating | no-snapshot | - | - |
| Vehicle Generator.Truck | no-snapshot | - | - |
| Vehicle Generator.and | no-snapshot | - | - |
| Vehicle Generator.but | no-snapshot | - | - |
| Victim Generator.syndicate | no-snapshot | - | - |
| Village.animal | archived-page | [snapshot](https://web.archive.org/web/20210927222944/https://www.random-generator.com/index.php?title=Village) | 20210927222944 |
| Village.crime | archived-page | [snapshot](https://web.archive.org/web/20210927222944/https://www.random-generator.com/index.php?title=Village) | 20210927222944 |
| Village.digit | archived-page | [snapshot](https://web.archive.org/web/20210927222944/https://www.random-generator.com/index.php?title=Village) | 20210927222944 |
| Village.food | archived-page | [snapshot](https://web.archive.org/web/20210927222944/https://www.random-generator.com/index.php?title=Village) | 20210927222944 |
| Village.local heroes | archived-page | [snapshot](https://web.archive.org/web/20210927222944/https://www.random-generator.com/index.php?title=Village) | 20210927222944 |
| Village.maybeweird | archived-page | [snapshot](https://web.archive.org/web/20210927222944/https://www.random-generator.com/index.php?title=Village) | 20210927222944 |
| Village.quirks | archived-page | [snapshot](https://web.archive.org/web/20210927222944/https://www.random-generator.com/index.php?title=Village) | 20210927222944 |
| Village.weird | archived-page | [snapshot](https://web.archive.org/web/20210927222944/https://www.random-generator.com/index.php?title=Village) | 20210927222944 |
| Wampus Country Magic User Generator.TestOutput | no-snapshot | - | - |
| Wampus Country Potions.TestOutput | no-snapshot | - | - |
| Waterdeep Villa.Remarkable Sculpture | no-snapshot | - | - |
| Weapon Foci Generator.main | no-snapshot | - | - |
| Weapon Generator.main | no-snapshot | - | - |
| Weapon Shields.\[file:top.png / 520px\] | needs-review | - | - |
| Weird Fantasy Monster.Level | archived-page | [snapshot](https://web.archive.org/web/20260103151745/http://www.random-generator.com/index.php?title=Weird_Fantasy_Monster) | 20260103151745 |
| Weird Fantasy Monster.Main | local-review | - | - |
| Weird West Clothing.coatsyle | no-snapshot | - | - |
| Weird West Clothing.otherhat | no-snapshot | - | - |
| Weird West Clothing.weird west felthatcolors | no-snapshot | - | - |
| Weird West Colors.brown\_adj | no-snapshot | - | - |
| Weird West Colors.felthatcolors | no-snapshot | - | - |
| Weird West Colors.femhatcolors | no-snapshot | - | - |
| Weird West Colors.gray\_adj | no-snapshot | - | - |
| Weird West Colors.hatcolors | no-snapshot | - | - |
| Weird West Colors.leatheradj | no-snapshot | - | - |
| Weird West Colors.leathercolor | no-snapshot | - | - |
| Weird West Colors.malepants | no-snapshot | - | - |
| Weird West Colors.maleshirts | no-snapshot | - | - |
| Weird West Colors.pink | no-snapshot | - | - |
| Weird West Colors.shirts | no-snapshot | - | - |
| Western Outfit.basic | local-review | - | - |
| Western Outfit.evocativeleather | no-snapshot | - | - |
| Western Outfit.normalquality | no-snapshot | - | - |
| Western Outfit.pantscolor | no-snapshot | - | - |
| Western Outfit.shirtfabric | no-snapshot | - | - |
| Western Outfit.shirtwithoutvest | no-snapshot | - | - |
| Western Outfit.shirtwithvest | no-snapshot | - | - |
| Western Outfit.stripecolors | no-snapshot | - | - |
| Wild West Personas.1d6+1 | archived-page | [snapshot](https://web.archive.org/web/20220119171429/https://www.random-generator.com/index.php?title=Wild_West_Personas) | 20220119171429 |
| Wild West Personas.hairadjective | archived-page | [snapshot](https://web.archive.org/web/20220119171429/https://www.random-generator.com/index.php?title=Wild_West_Personas) | 20220119171429 |
| Wild West Personas.uniquefemaleface | archived-page | [snapshot](https://web.archive.org/web/20220119171429/https://www.random-generator.com/index.php?title=Wild_West_Personas) | 20220119171429 |
| Wizard Tower.\[http:&#47;&#47;talesofthegrotesqueanddungeonesque.blogspot.com/2012/08/what-type-of-haunting-is-afoot.html\)\] | needs-review | - | - |
| Wizard schools.mainCap | archived-page | [snapshot](https://web.archive.org/web/20170713073228/http://random-generator.com/index.php?title=Wizard_schools) | 20170713073228 |
| Wizard's death-curse.main | local-review | - | - |
| World Generator.Americaculture | archived-page | [snapshot](https://web.archive.org/web/20170718171812/http://random-generator.com/index.php?title=World_Generator) | 20170718171812 |
| World Generator.Americaregion | archived-page | [snapshot](https://web.archive.org/web/20170718171812/http://random-generator.com/index.php?title=World_Generator) | 20170718171812 |
| World Generator.Americareligion | archived-page | [snapshot](https://web.archive.org/web/20170718171812/http://random-generator.com/index.php?title=World_Generator) | 20170718171812 |
| Wrestling names.articlechance | archived-page | [snapshot](https://web.archive.org/web/20210515114134/https://www.random-generator.com/index.php?title=Wrestling_names) | 20210515114134 |
| Wrestling names.porpernamelast | archived-page | [snapshot](https://web.archive.org/web/20210515114134/https://www.random-generator.com/index.php?title=Wrestling_names) | 20210515114134 |
| Wuxia Names.surnames\_pinyin | archived-page | [snapshot](https://web.archive.org/web/20210514171834/https://www.random-generator.com/index.php?title=Wuxia_Names) | 20210514171834 |
| Wuxia Organizations.adjective | no-snapshot | - | - |
| Wuxia Organizations.hyphenated | no-snapshot | - | - |
| Wuxia Organizations.noun | no-snapshot | - | - |
| Wuxia Organizations.number | no-snapshot | - | - |
| Wuxia Organizations.number-plain | no-snapshot | - | - |
| XBows.NoDescription | archived-page | [snapshot](https://web.archive.org/web/20210418113721/http://www.random-generator.com/index.php?title=XBows) | 20210418113721 |
| Zenume Region Names.Owner | local-review | - | - |
| Zenume Settlement and Landmark Names.amount | local-review | - | - |
| Zenume Settlement and Landmark Names.goup2 | no-snapshot | - | - |
| Zenume Settlement and Landmark Names.jobs | local-review | - | - |
| kaac.houseádi\_clan | no-snapshot | - | - |

## Query Evidence

The [JSON report](wayback-report.json) retains all source bindings, input hashes, page URL variants, API requests, timestamps, errors, and candidate capture links. A successful availability response is page-level evidence only.

The checker tries HTTP and HTTPS, with and without `www`, for the MediaWiki page and `action=raw` URLs. It stops querying a page after the first valid capture. Other URL layouts or older captures may still require manual research.

Each run is request-limited and sequential. HTTP 403, 429, or 503 stops the run and leaves the remainder pending. Resume into a new output directory; previously completed queries are reused, errors are retried, and different output files are never overwritten.

Only public wiki page URLs are sent to `archive.org`; row contents and contributor records are not sent. The application remains browser-only and does not load this checker.

API documentation: [Wayback Machine APIs](https://archive.org/help/wayback_api.php).
