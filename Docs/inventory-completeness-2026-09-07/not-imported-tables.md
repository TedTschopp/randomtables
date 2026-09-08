# Current Tables Not Imported

Snapshot: 2026-09-07. Source revision: `6bcc5d0bbbf990e49ecaf8f1edceb99751eb8ed0`.

**408 current tables across 38 source pages are present in the source checkout
but absent from the application's import.** They are the difference between
26,156 current extracted tables and 25,748 imported tables: the remaining 1.56%.

These are not the [492 targets without located definitions](missing-tables.md)
and not the [883 additional historical identities](new-wiki-tables.md). The
[published inventory](inventory-report.json) records this group with
`importStatus: "not-imported"`.

## Why They Are Outside the Import

The [import selector](../../explorer/tools/import-abulafia.cjs#L28) starts from
five seed tables, includes every current table associated with their current
and original contributors, and follows dependencies recursively. It does not
select the entire wiki automatically.

Recomputing that selection against the pinned, hash-verified source checkout
reproduced the exact 25,748 imported names. All 408 tables below fall outside
that selection. Their omission is not a download failure.

Completing current-corpus membership requires expanding the import selection
while retaining contributor-wide coverage, original attribution, exact names,
collision checks, and dependency validation. The resulting readiness of these
tables must be evaluated; import membership does not establish executability.
None of their exact qualified names matches a current imported
`missing_reference` diagnostic, so adding them does not automatically resolve
the existing missing-reference backlog.

For the separate 5,416 imported-but-blocked tables, see the
[quarantine report](../quarantine-report.md#blocker-families). Of those, 2,829
have only dependency diagnostics and 2,587 have at least one other diagnostic.
No import or runtime behavior was changed by this list.

## Exact Unimported Tables

Names, case, punctuation, and page IDs are preserved. `(empty name)` below is a
display label for the exact empty subtable string, not a proposed replacement.

| Source Page | Page ID | Subtable |
| --- | --- | --- |
| AV's Name Generator | 2568 | Syl1 |
| AV's Name Generator | 2568 | Syl1r |
| AV's Name Generator | 2568 | Syl2 |
| AV's Name Generator | 2568 | Syl2r |
| AV's Name Generator | 2568 | Syl3 |
| AV's Name Generator | 2568 | Syl3r |
| AV's Name Generator | 2568 | main |
| AWC Char Gen | 3592 | Value |
| Address list | 4788 | Apartment |
| Address list | 4788 | AptNumber |
| Address list | 4788 | AptNumberDist |
| Address list | 4788 | AptNumberLetter |
| Address list | 4788 | CityBlock |
| Address list | 4788 | CityBlock-Hundreds |
| Address list | 4788 | CityBlock-Thousands |
| Address list | 4788 | FirstDigit |
| Address list | 4788 | Intersection |
| Address list | 4788 | IntersectionLanguage |
| Address list | 4788 | Place |
| Address list | 4788 | StreetAddress |
| Address list | 4788 | StreetLocation |
| Address list | 4788 | StreetName |
| Bullet Ballet Oracle | 2581 | destiny |
| Bullet Ballet Oracle | 2581 | main |
| Bullet Ballet Oracle | 2581 | person |
| Dragon spirit generator | 3328 | 0 |
| Dragon spirit generator | 3328 | 1 |
| Dragon spirit generator | 3328 | 2 |
| Dragon spirit generator | 3328 | 3 |
| Dragon spirit generator | 3328 | 4 |
| Dragon spirit generator | 3328 | 5 |
| Dragon spirit generator | 3328 | 6 |
| Dragon spirit generator | 3328 | 7 |
| Dragon spirit generator | 3328 | 8 |
| Dragon spirit generator | 3328 | 9 |
| Dragon spirit generator | 3328 | Cons |
| Dragon spirit generator | 3328 | ConsCap |
| Dragon spirit generator | 3328 | FemalePrefix |
| Dragon spirit generator | 3328 | MalePrefix |
| Dragon spirit generator | 3328 | More |
| Dragon spirit generator | 3328 | Suffix |
| Dragon spirit generator | 3328 | Vowel |
| Dragon spirit generator | 3328 | VowelCap |
| Dragon spirit generator | 3328 | age |
| Dragon spirit generator | 3328 | breathchance |
| Dragon spirit generator | 3328 | dage |
| Dragon spirit generator | 3328 | dbody |
| Dragon spirit generator | 3328 | dname |
| Dragon spirit generator | 3328 | eyes |
| Dragon spirit generator | 3328 | head |
| Dragon spirit generator | 3328 | headfeature |
| Dragon spirit generator | 3328 | legnumber |
| Dragon spirit generator | 3328 | legtype |
| Dragon spirit generator | 3328 | main |
| Dragon spirit generator | 3328 | personality |
| Dragon spirit generator | 3328 | powers |
| Dragon spirit generator | 3328 | scales |
| Dragon spirit generator | 3328 | special |
| Dragon spirit generator | 3328 | tailtype |
| Dragon spirit generator | 3328 | type |
| Dragon spirit generator | 3328 | wings |
| Fantasy Verbose Character Builder | 3309 | Events |
| Fantasy Verbose Character Builder | 3309 | Family |
| Fantasy Verbose Character Builder | 3309 | Traits |
| Fantasy Verbose Character Builder | 3309 | age |
| Fantasy Verbose Character Builder | 3309 | ancestor |
| Fantasy Verbose Character Builder | 3309 | city |
| Fantasy Verbose Character Builder | 3309 | climate |
| Fantasy Verbose Character Builder | 3309 | dress style |
| Fantasy Verbose Character Builder | 3309 | event |
| Fantasy Verbose Character Builder | 3309 | gender |
| Fantasy Verbose Character Builder | 3309 | main |
| Fantasy Verbose Character Builder | 3309 | parents |
| Fantasy Verbose Character Builder | 3309 | race |
| Fantasy Verbose Character Builder | 3309 | sibling |
| Fantasy Verbose Character Builder | 3309 | sibling gender |
| Fantasy Verbose Character Builder | 3309 | sibling relative age |
| Fantasy Verbose Character Builder | 3309 | siblings |
| Fantasy Verbose Character Builder | 3309 | trait |
| Fantasy Verbose Character Builder | 3309 | tvmotivation |
| Grim World Locations | 3639 | Adjective |
| Grim World Locations | 3639 | Place |
| Grim World Locations | 3639 | Trait1 |
| Grim World Locations | 3639 | Trait2 |
| Grim World Locations | 3639 | main |
| Hand of Five Cards | 3962 | main |
| Heist Fast Character Generator | 4695 | D6AbilityRoll |
| Heist Fast Character Generator | 4695 | D6SkillRoll |
| Heist Fast Character Generator | 4695 | Skill |
| Heist Fast Character Generator | 4695 | main |
| Human Contact oracle | 2298 | main |
| Io Names | 2198 | NameGroup |
| My Little Pony Oracle | 3197 | main |
| OrdinaryPeople | 2318 | Age |
| PARTHOG Encounter Generator | 4663 | main |
| Scottsz-test1 | 2864 | Hues |
| Scottsz-test2 | 2865 | Color |
| Scottsz-test2 | 2865 | Person |
| Scottsz-test2 | 2865 | Place |
| Scottsz-test2 | 2865 | Shape |
| Scottsz-test2 | 2865 | Thing |
| Scottsz-test2 | 2865 | garrison |
| Tone for Swords Without Master | 3967 | main |
| User:Archon | 4050 | Main |
| User:Bloo | 4661 | Action |
| User:Bloo | 4661 | D6AbilityRoll |
| User:Bloo | 4661 | D6SkillRoll |
| User:Bloo | 4661 | MotivationCard |
| User:Bloo | 4661 | MotivationSpirit |
| User:Bloo | 4661 | MotivationSuit |
| User:Bloo | 4661 | Skill |
| User:Bloo | 4661 | Trait |
| User:Bloo | 4661 | Trigram |
| User:Bloo | 4661 | main |
| User:Companionsphere/Sword | 2436 | Basket |
| User:Companionsphere/Sword | 2436 | BasketedSwordType |
| User:Companionsphere/Sword | 2436 | DaggerStart |
| User:Companionsphere/Sword | 2436 | DaggerType |
| User:Companionsphere/Sword | 2436 | DecorMetal |
| User:Companionsphere/Sword | 2436 | HiltedSwordType |
| User:Companionsphere/Sword | 2436 | Pommel |
| User:Companionsphere/Sword | 2436 | PommelEyes |
| User:Companionsphere/Sword | 2436 | PommelShapes |
| User:Companionsphere/Sword | 2436 | Quality |
| User:Companionsphere/Sword | 2436 | QuillionShape |
| User:Companionsphere/Sword | 2436 | Quillions |
| User:Companionsphere/Sword | 2436 | RuneGlowChance |
| User:Companionsphere/Sword | 2436 | Scabbard |
| User:Companionsphere/Sword | 2436 | StartNoDescription |
| User:Companionsphere/Sword | 2436 | SwordBladeDecor |
| User:Companionsphere/Sword | 2436 | SwordBladeStyle |
| User:Companionsphere/Sword | 2436 | SwordHiltWrapping |
| User:Companionsphere/Sword | 2436 | SwordStart |
| User:Companionsphere/Sword | 2436 | main |
| User:Darktoad | 2602 | base\_alignment |
| User:Darktoad | 2602 | gender\_elf |
| User:Darktoad | 2602 | gender\_half-elf |
| User:Darktoad | 2602 | gender\_halfling |
| User:Darktoad | 2602 | gender\_human |
| User:Darktoad | 2602 | health |
| User:Darktoad | 2602 | heritage |
| User:Darktoad | 2602 | level |
| User:Darktoad | 2602 | name |
| User:Darktoad | 2602 | profession |
| User:Darktoad | 2602 | weapon |
| User:Eggdropsoap/Sandbox | 2268 | main |
| User:Eggdropsoap/Sandbox | 2268 | ogrenum |
| User:Eggdropsoap/Sandbox | 2268 | ogres |
| User:Eggdropsoap/Sandbox | 2268 | ogres-orcs |
| User:Eggdropsoap/Sandbox | 2268 | ogres-trolls |
| User:Eggdropsoap/Sandbox | 2268 | orcnum |
| User:Eggdropsoap/Sandbox | 2268 | orcs |
| User:Eggdropsoap/Sandbox | 2268 | orcs-ogres |
| User:Eggdropsoap/Sandbox | 2268 | orcs-trolls |
| User:Eggdropsoap/Sandbox | 2268 | trollnum |
| User:Eggdropsoap/Sandbox | 2268 | trolls |
| User:Eggdropsoap/Sandbox | 2268 | trolls-ogres |
| User:Eggdropsoap/Sandbox | 2268 | trolls-orcs |
| User:Fantomx11/Castle Description | 4620 | main |
| User:Fantomx11/Castle Description | 4620 | nm1 |
| User:Fantomx11/Castle Description | 4620 | nm10 |
| User:Fantomx11/Castle Description | 4620 | nm11 |
| User:Fantomx11/Castle Description | 4620 | nm12 |
| User:Fantomx11/Castle Description | 4620 | nm13 |
| User:Fantomx11/Castle Description | 4620 | nm14 |
| User:Fantomx11/Castle Description | 4620 | nm15 |
| User:Fantomx11/Castle Description | 4620 | nm16 |
| User:Fantomx11/Castle Description | 4620 | nm17 |
| User:Fantomx11/Castle Description | 4620 | nm18 |
| User:Fantomx11/Castle Description | 4620 | nm19 |
| User:Fantomx11/Castle Description | 4620 | nm2 |
| User:Fantomx11/Castle Description | 4620 | nm3 |
| User:Fantomx11/Castle Description | 4620 | nm4 |
| User:Fantomx11/Castle Description | 4620 | nm5 |
| User:Fantomx11/Castle Description | 4620 | nm6 |
| User:Fantomx11/Castle Description | 4620 | nm7 |
| User:Fantomx11/Castle Description | 4620 | nm8 |
| User:Fantomx11/Castle Description | 4620 | nm9 |
| User:Fantomx11/House Description | 4621 | main |
| User:Fantomx11/House Description | 4621 | nm1 |
| User:Fantomx11/House Description | 4621 | nm10a |
| User:Fantomx11/House Description | 4621 | nm10b |
| User:Fantomx11/House Description | 4621 | nm10c |
| User:Fantomx11/House Description | 4621 | nm11 |
| User:Fantomx11/House Description | 4621 | nm12 |
| User:Fantomx11/House Description | 4621 | nm13 |
| User:Fantomx11/House Description | 4621 | nm14 |
| User:Fantomx11/House Description | 4621 | nm15 |
| User:Fantomx11/House Description | 4621 | nm16 |
| User:Fantomx11/House Description | 4621 | nm17 |
| User:Fantomx11/House Description | 4621 | nm18 |
| User:Fantomx11/House Description | 4621 | nm19 |
| User:Fantomx11/House Description | 4621 | nm2 |
| User:Fantomx11/House Description | 4621 | nm20 |
| User:Fantomx11/House Description | 4621 | nm21 |
| User:Fantomx11/House Description | 4621 | nm22 |
| User:Fantomx11/House Description | 4621 | nm23 |
| User:Fantomx11/House Description | 4621 | nm24 |
| User:Fantomx11/House Description | 4621 | nm3 |
| User:Fantomx11/House Description | 4621 | nm4 |
| User:Fantomx11/House Description | 4621 | nm5 |
| User:Fantomx11/House Description | 4621 | nm6 |
| User:Fantomx11/House Description | 4621 | nm7 |
| User:Fantomx11/House Description | 4621 | nm8a |
| User:Fantomx11/House Description | 4621 | nm8b |
| User:Fantomx11/House Description | 4621 | nm8c |
| User:Fantomx11/House Description | 4621 | nm8d |
| User:Fantomx11/House Description | 4621 | nm8e |
| User:Fantomx11/House Description | 4621 | nm9 |
| User:Fantomx11/Orc Surname | 4617 | bodyPart |
| User:Fantomx11/Orc Surname | 4617 | creature |
| User:Fantomx11/Orc Surname | 4617 | doer |
| User:Fantomx11/Orc Surname | 4617 | main |
| User:Fantomx11/Orc Surname | 4617 | tool |
| User:Fantomx11/Throne Room Description | 4623 | main |
| User:Fantomx11/Throne Room Description | 4623 | nm1 |
| User:Fantomx11/Throne Room Description | 4623 | nm10 |
| User:Fantomx11/Throne Room Description | 4623 | nm11 |
| User:Fantomx11/Throne Room Description | 4623 | nm12 |
| User:Fantomx11/Throne Room Description | 4623 | nm12b |
| User:Fantomx11/Throne Room Description | 4623 | nm13 |
| User:Fantomx11/Throne Room Description | 4623 | nm14 |
| User:Fantomx11/Throne Room Description | 4623 | nm15 |
| User:Fantomx11/Throne Room Description | 4623 | nm16 |
| User:Fantomx11/Throne Room Description | 4623 | nm17 |
| User:Fantomx11/Throne Room Description | 4623 | nm18 |
| User:Fantomx11/Throne Room Description | 4623 | nm19 |
| User:Fantomx11/Throne Room Description | 4623 | nm2 |
| User:Fantomx11/Throne Room Description | 4623 | nm20 |
| User:Fantomx11/Throne Room Description | 4623 | nm21 |
| User:Fantomx11/Throne Room Description | 4623 | nm22 |
| User:Fantomx11/Throne Room Description | 4623 | nm23 |
| User:Fantomx11/Throne Room Description | 4623 | nm23b |
| User:Fantomx11/Throne Room Description | 4623 | nm24 |
| User:Fantomx11/Throne Room Description | 4623 | nm25 |
| User:Fantomx11/Throne Room Description | 4623 | nm26 |
| User:Fantomx11/Throne Room Description | 4623 | nm27 |
| User:Fantomx11/Throne Room Description | 4623 | nm28 |
| User:Fantomx11/Throne Room Description | 4623 | nm29 |
| User:Fantomx11/Throne Room Description | 4623 | nm3 |
| User:Fantomx11/Throne Room Description | 4623 | nm30 |
| User:Fantomx11/Throne Room Description | 4623 | nm31 |
| User:Fantomx11/Throne Room Description | 4623 | nm32 |
| User:Fantomx11/Throne Room Description | 4623 | nm33 |
| User:Fantomx11/Throne Room Description | 4623 | nm34 |
| User:Fantomx11/Throne Room Description | 4623 | nm35 |
| User:Fantomx11/Throne Room Description | 4623 | nm36 |
| User:Fantomx11/Throne Room Description | 4623 | nm37 |
| User:Fantomx11/Throne Room Description | 4623 | nm38 |
| User:Fantomx11/Throne Room Description | 4623 | nm39 |
| User:Fantomx11/Throne Room Description | 4623 | nm4 |
| User:Fantomx11/Throne Room Description | 4623 | nm40 |
| User:Fantomx11/Throne Room Description | 4623 | nm41 |
| User:Fantomx11/Throne Room Description | 4623 | nm42 |
| User:Fantomx11/Throne Room Description | 4623 | nm43 |
| User:Fantomx11/Throne Room Description | 4623 | nm44 |
| User:Fantomx11/Throne Room Description | 4623 | nm45 |
| User:Fantomx11/Throne Room Description | 4623 | nm46 |
| User:Fantomx11/Throne Room Description | 4623 | nm47 |
| User:Fantomx11/Throne Room Description | 4623 | nm48 |
| User:Fantomx11/Throne Room Description | 4623 | nm49 |
| User:Fantomx11/Throne Room Description | 4623 | nm5 |
| User:Fantomx11/Throne Room Description | 4623 | nm6 |
| User:Fantomx11/Throne Room Description | 4623 | nm7 |
| User:Fantomx11/Throne Room Description | 4623 | nm8 |
| User:Fantomx11/Throne Room Description | 4623 | nm9 |
| User:Fantomx11/Throne Room Description | 4623 | nm9b |
| User:Fantomx11/WOW Common | 4614 | C |
| User:Fantomx11/WOW Common | 4614 | F |
| User:Fantomx11/WOW Common | 4614 | I |
| User:Fantomx11/WOW Common | 4614 | V |
| User:Fantomx11/WOW Common | 4614 | main |
| User:Fantomx11/WOW Darnassian | 4611 | C |
| User:Fantomx11/WOW Darnassian | 4611 | F |
| User:Fantomx11/WOW Darnassian | 4611 | I |
| User:Fantomx11/WOW Darnassian | 4611 | S |
| User:Fantomx11/WOW Darnassian | 4611 | V |
| User:Fantomx11/WOW Darnassian | 4611 | forms |
| User:Fantomx11/WOW Darnassian | 4611 | main |
| User:Fantomx11/WOW Dwarven | 4613 | C |
| User:Fantomx11/WOW Dwarven | 4613 | F |
| User:Fantomx11/WOW Dwarven | 4613 | I |
| User:Fantomx11/WOW Dwarven | 4613 | S |
| User:Fantomx11/WOW Dwarven | 4613 | V |
| User:Fantomx11/WOW Dwarven | 4613 | forms |
| User:Fantomx11/WOW Dwarven | 4613 | main |
| User:Fantomx11/WOW Orcish | 4612 | C |
| User:Fantomx11/WOW Orcish | 4612 | F |
| User:Fantomx11/WOW Orcish | 4612 | I |
| User:Fantomx11/WOW Orcish | 4612 | S |
| User:Fantomx11/WOW Orcish | 4612 | V |
| User:Fantomx11/WOW Orcish | 4612 | forms |
| User:Fantomx11/WOW Orcish | 4612 | main |
| User:MinorBug | 4707 | pirate |
| User:MinorBug | 4707 | piratealignment |
| User:MinorBug | 4707 | pirateclass |
| User:MinorBug | 4707 | pirategender |
| User:MinorBug | 4707 | piraterace |
| User:Poposhka | 4675 | fd |
| User:Poposhka | 4675 | main |
| User:Precisi/Shieldian Food | 2685 | BodyParts1 |
| User:Precisi/Shieldian Food | 2685 | BodyParts2 |
| User:Precisi/Shieldian Food | 2685 | BreadSpreads |
| User:Precisi/Shieldian Food | 2685 | Breads |
| User:Precisi/Shieldian Food | 2685 | CheeseOrigin |
| User:Precisi/Shieldian Food | 2685 | CheeseProcess |
| User:Precisi/Shieldian Food | 2685 | CheeseType |
| User:Precisi/Shieldian Food | 2685 | CookingAdjectives |
| User:Precisi/Shieldian Food | 2685 | DescriptiveAdjective1 |
| User:Precisi/Shieldian Food | 2685 | DescriptiveAdjectives2 |
| User:Precisi/Shieldian Food | 2685 | Descriptor |
| User:Precisi/Shieldian Food | 2685 | Desserts |
| User:Precisi/Shieldian Food | 2685 | Eggs |
| User:Precisi/Shieldian Food | 2685 | Extras |
| User:Precisi/Shieldian Food | 2685 | ExtrasRoll |
| User:Precisi/Shieldian Food | 2685 | FreshwaterFish |
| User:Precisi/Shieldian Food | 2685 | Fruit |
| User:Precisi/Shieldian Food | 2685 | FruitButters |
| User:Precisi/Shieldian Food | 2685 | MainMeals |
| User:Precisi/Shieldian Food | 2685 | MainMealsExotic |
| User:Precisi/Shieldian Food | 2685 | Nuts |
| User:Precisi/Shieldian Food | 2685 | NutsVerb |
| User:Precisi/Shieldian Food | 2685 | Pastas |
| User:Precisi/Shieldian Food | 2685 | Pickles |
| User:Precisi/Shieldian Food | 2685 | RawOnlyVeggies |
| User:Precisi/Shieldian Food | 2685 | Salads |
| User:Precisi/Shieldian Food | 2685 | SaltwaterFish |
| User:Precisi/Shieldian Food | 2685 | SavorySauces |
| User:Precisi/Shieldian Food | 2685 | Sides |
| User:Precisi/Shieldian Food | 2685 | SpiceButters |
| User:Precisi/Shieldian Food | 2685 | Sweeteners |
| User:Precisi/Shieldian Food | 2685 | Tapas |
| User:Precisi/Shieldian Food | 2685 | Veggies |
| User:Precisi/Shieldian Food | 2685 | Veggies2 |
| User:Precisi/Shieldian Food | 2685 | VeggiesCookable |
| User:Precisi/Shieldian Food | 2685 | WithSide |
| User:Precisi/Shieldian Food | 2685 | cheese |
| User:Precisi/Shieldian Food | 2685 | main |
| User:Precisi/Shieldian Food | 2685 | veggiemain |
| User:Precisi/Tribes | 2684 | animal |
| User:Precisi/Tribes | 2684 | cheese\_type |
| User:Precisi/Tribes | 2684 | color |
| User:Precisi/Tribes | 2684 | main |
| User:Precisi/Tribes | 2684 | number |
| User:Precisi/Tribes | 2684 | tribe\_name |
| User:Richardofoakshire/Dada | 2690 | (empty name) |
| User:Richardofoakshire/Dada | 2690 | 3S-Prät-intr |
| User:Richardofoakshire/Dada | 2690 | Ort |
| User:Richardofoakshire/Dada | 2690 | Partizip |
| User:Richardofoakshire/Dada | 2690 | Römername |
| User:Richardofoakshire/Dada | 2690 | Stadt |
| User:Richardofoakshire/Dada | 2690 | Subjekt |
| User:Richardofoakshire/Dada | 2690 | Zahl |
| User:Richardofoakshire/Dada | 2690 | Zeit |
| User:Richardofoakshire/Dada | 2690 | dada |
| User:Wldenning | 3837 | axetable |
| User:Wldenning | 3837 | bracelettable |
| User:Wldenning | 3837 | cubetable |
| User:Wldenning | 3837 | daggertable |
| User:Wldenning | 3837 | darttable |
| User:Wldenning | 3837 | gemtable |
| User:Wldenning | 3837 | glovetable |
| User:Wldenning | 3837 | keytable |
| User:Wldenning | 3837 | knifetable |
| User:Wldenning | 3837 | lanterntable |
| User:Wldenning | 3837 | morningstartable |
| User:Wldenning | 3837 | nettable |
| User:Wldenning | 3837 | potiontable |
| User:Wldenning | 3837 | ringtable |
| User:Wldenning | 3837 | scrolltable |
| User:Wldenning | 3837 | sickletable |
| User:Wldenning | 3837 | skulltable |
| User:Wldenning | 3837 | teethtable |
| User:Wldenning | 3837 | tometable |
| User:Wldenning | 3837 | winetable |
| WORLD EATER encounters | 4113 | adjective |
| WORLD EATER encounters | 4113 | animal |
| WORLD EATER encounters | 4113 | class |
| WORLD EATER encounters | 4113 | color |
| WORLD EATER encounters | 4113 | criminal |
| WORLD EATER encounters | 4113 | demon |
| WORLD EATER encounters | 4113 | descriptive |
| WORLD EATER encounters | 4113 | dinosaur |
| WORLD EATER encounters | 4113 | do |
| WORLD EATER encounters | 4113 | domestic |
| WORLD EATER encounters | 4113 | dragon |
| WORLD EATER encounters | 4113 | emotion |
| WORLD EATER encounters | 4113 | equip |
| WORLD EATER encounters | 4113 | humanoid |
| WORLD EATER encounters | 4113 | ing |
| WORLD EATER encounters | 4113 | job |
| WORLD EATER encounters | 4113 | laws |
| WORLD EATER encounters | 4113 | main |
| WORLD EATER encounters | 4113 | metal |
| WORLD EATER encounters | 4113 | monster |
| WORLD EATER encounters | 4113 | noble |
| WORLD EATER encounters | 4113 | occupation |
| WORLD EATER encounters | 4113 | other |
| WORLD EATER encounters | 4113 | part |
| WORLD EATER encounters | 4113 | passion |
| WORLD EATER encounters | 4113 | race |
| WORLD EATER encounters | 4113 | state |
| WORLD EATER encounters | 4113 | things |
| WORLD EATER encounters | 4113 | thingy |
| WORLD EATER encounters | 4113 | undead |
| WORLD EATER encounters | 4113 | unnatural |
| WORLD EATER encounters | 4113 | wild |
| Weird Olympia Oracle | 2305 | main |
