# Notes on cleaning CT-citations.bib

The original export (Google Scholar style) had 139 entries. `assets/papers.bib` keeps **102** after the changes below (37 removed). Nothing here is used by the site; it's a record so you can restore anything I got wrong (the original file is unchanged in the Project).

## Removed – not publications
| key | why |
|---|---|
| `alsallakhinfovis` | InfoVis programme committee list |
| `scheuermann2023eurovis` | EuroVis 2023 front matter |
| `arunkumarenergyvis` | EnergyVis 2023 committee list |
| `aerts2022remote` | Dagstuhl "Remote Participants" list |
| `buchspringer` | Garbled Springer catalogue entry |
| `birkelandvortrage` | German index heading, not a paper |
| `turkaysupplementary` | Supplementary material for `turkay2016designing` |
| `dykes2021ramp` | Zenodo supplement for `dykes2022visualization` |

## Removed – duplicates or garbled copies
| key | kept instead |
|---|---|
| `turkay2019cagatay` | `turkay2018progressive` |
| `allain2019orcid` | `allain2019towards` |
| `leebroadening` | `lee2019broadening` |
| `rooneymulti` | `dykes2015multi` |
| `turkaycharacterizing` | `turkay2014characterizing` |
| `turkayapplication` | `turkay2014computationally` (fragment of its title) |
| `turkay2016multi` | `sathiyanarayanan2016multi` |
| `sathiyanarayanan2019design` | `sathiyanarayanan2018design` |
| `moller2022modelling` | merged into `turkay2022modelling` (full author list + venue) |
| `heitlinger2022more` ×2 | one `heitlinger2022more` kept (Project Reflections) |
| 13 × `andrienko2020*` chapters | one `@book` entry, *Visual Analytics for Data Scientists* |

## Removed – need your check before adding back
| key | issue |
|---|---|
| `birkeland2012offizielle` | Title is a German library heading; CGF 31(3):905–914 (2012). Add with the real title if it's yours. |
| `nguyendoing` | "Doing User Behaviour Analytics through Interactive Visual User Profiles" – no venue/year; possibly an early version of Vasabi. |
| `lushould` | "What Should the Agent Withhold? …" – no venue/year (under review?). Add back with `note = {Under review}` or once published. |
| `dunne2021uncertainty` | "Under submission to Epidemics" – check whether it became `dunne2022complex` or another paper. |
| `birmingham20154` | Dagstuhl report section; author list is broken ("Birmingham, GB"). |

## Fixes applied
- Duplicate key `turkay2011integrating` (two different papers) → the Computer Journal one is now `turkay2011integratinginfo`.
- Venue names normalised (e.g. "IEEE transactions on visualization and computer graphics" → proper case), EuroVis CGF papers labelled `Computer Graphics Forum (EuroVis)`.
- Abbreviated author names expanded where the full name appears elsewhere in the file (e.g. "Turkay, C" → "Turkay, Cagatay").
- Entries with no venue moved from `@article` to `@misc` so they list under "Other".
- `lee2019broadening` given volume/issue/pages from the Warwick page.
- `selected = {true}` added to the ten papers on your Warwick "Selected Publications" list, with their open-access links.
