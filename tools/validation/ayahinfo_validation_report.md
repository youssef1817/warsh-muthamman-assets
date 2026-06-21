# Quran Ayahinfo Validation Report (Warsh Muthamman)

**Date:** 2026-06-21T12:10:05.198Z  
**Pages Checked:** 485 / 485  
**Numbering Mode:** `hafs_tolerant`  

## Summary Stats
| Severity | Count |
|---|---|
| <span style="color:red">🔴 Fatal</span> | **109** |
| <span style="color:orange">🟡 Warning</span> | **60** |
| <span style="color:blue">🔵 Suspicious</span> | **491** |
| **Total Issues** | **660** |

### Stats by Category & Severity
| Category | Fatal | Warning | Suspicious | Total |
|---|---|---|---|---|
| `structural` | 48 | 0 | 0 | **48** |
| `numbering` | 0 | 8 | 0 | **8** |
| `layout` | 49 | 34 | 1 | **84** |
| `geometry` | 12 | 16 | 482 | **510** |
| `ordering` | 0 | 2 | 8 | **10** |
| `other` | 0 | 0 | 0 | **0** |

### Fatal Breakdown
- Fatal Issues (Excluding Numbering): **109**  
- Fatal Numbering Issues Only: **0**  

## Stats by Issue Code
| Code | Category | Severity | Count |
|---|---|---|---|
| `LAYOUT_ORDER_INVALID` | `layout` | <span style="color:red">fatal</span> | 52 |
| `HIGHLIGHT_LINE_OUT_OF_RANGE` | `structural` | <span style="color:red">fatal</span> | 25 |
| `MARKER_LINE_OUT_OF_RANGE` | `structural` | <span style="color:red">fatal</span> | 23 |
| `MARKER_NO_HIGHLIGHT` | `geometry` | <span style="color:red">fatal</span> | 12 |
| `LINE_COUNT_MISMATCH` | `layout` | <span style="color:orange">warning</span> | 31 |
| `ORPHAN_HIGHLIGHT_NO_MARKER` | `geometry` | <span style="color:orange">warning</span> | 16 |
| `HIGHLIGHT_AYAH_OUT_OF_RANGE` | `numbering` | <span style="color:orange">warning</span> | 7 |
| `DUPLICATE_MARKER_AYAH` | `ordering` | <span style="color:orange">warning</span> | 2 |
| `MARKER_AYAH_OUT_OF_RANGE` | `numbering` | <span style="color:orange">warning</span> | 1 |
| `MARKER_BOUNDARY_MISMATCH` | `geometry` | <span style="color:blue">suspicious</span> | 429 |
| `MARKER_NOT_ON_HIGHLIGHT_LINE` | `geometry` | <span style="color:blue">suspicious</span> | 33 |
| `SAME_LINE_OVERLAP` | `geometry` | <span style="color:blue">suspicious</span> | 18 |
| `HIGHLIGHT_ORDER_JUMP` | `ordering` | <span style="color:blue">suspicious</span> | 8 |
| `SAME_LINE_GAP` | `geometry` | <span style="color:blue">suspicious</span> | 2 |
| `LAYOUT_VERTICAL_OVERLAP` | `layout` | <span style="color:blue">suspicious</span> | 1 |

## Top 25 Pages with Most Issues
| Page | Issues Count |
|---|---|
| Page 362 | 37 |
| Page 471 | 23 |
| Page 361 | 22 |
| Page 3 | 16 |
| Page 68 | 16 |
| Page 479 | 14 |
| Page 483 | 14 |
| Page 422 | 13 |
| Page 358 | 11 |
| Page 457 | 10 |
| Page 475 | 10 |
| Page 468 | 8 |
| Page 469 | 8 |
| Page 463 | 7 |
| Page 477 | 7 |
| Page 484 | 7 |
| Page 299 | 6 |
| Page 359 | 6 |
| Page 420 | 6 |
| Page 452 | 6 |
| Page 466 | 6 |
| Page 1 | 5 |
| Page 161 | 5 |
| Page 211 | 5 |
| Page 214 | 5 |

## Major Root Causes (Deduplicated, Excluding Mismatch Geometry)
| Page | Category | Code | Severity | Ayah | Line | Count | Description |
|---|---|---|---|---|---|---|---|
| Page 1 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 1 | 1 | Line vertical bounds invalid: center (511) is outside top-bottom (277-504) by 7px |
| Page 41 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 13 | 1 | Line vertical bounds invalid: center (1644) is outside top-bottom (1347-1455) by 189px |
| Page 62 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 7 | 2 | Line vertical bounds invalid: center (996) is outside top-bottom (656-761) by 235px |
| Page 86 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 8 | 1 | Line vertical bounds invalid: center (1088) is outside top-bottom (800-896) by 192px |
| Page 122 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 14 | 1 | Line vertical bounds invalid: center (1533) is outside top-bottom (1654-1768) by 121px |
| Page 142 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 10 | 1 | Line vertical bounds invalid: center (1147) is outside top-bottom (1308-1421) by 161px |
| Page 150 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 10 | 2 | Line vertical bounds invalid: center (1301) is outside top-bottom (1010-1122) by 179px |
| Page 156 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 1 | 1 | Line vertical bounds invalid: center (104) is outside top-bottom (116-242) by 12px |
| Page 200 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 3 | 1 | Line vertical bounds invalid: center (644) is outside top-bottom (307-439) by 205px |
| Page 215 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 1 | 1 | Line vertical bounds invalid: center (379) is outside top-bottom (257-365) by 14px |
| Page 289 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 5 | 1 | Line vertical bounds invalid: center (550) is outside top-bottom (710-804) by 160px |
| Page 320 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 1 | 1 | Line vertical bounds invalid: center (100) is outside top-bottom (109-243) by 9px |
| Page 324 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 12 | 1 | Line vertical bounds invalid: center (1555) is outside top-bottom (1417-1517) by 38px |
| Page 329 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 8 | 1 | Line vertical bounds invalid: center (1094) is outside top-bottom (804-912) by 182px |
| Page 332 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 5 | 1 | Line vertical bounds invalid: center (788) is outside top-bottom (472-587) by 201px |
| Page 335 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 1 | 1 | Line vertical bounds invalid: center (376) is outside top-bottom (139-247) by 129px |
| Page 349 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 9 | 1 | Line vertical bounds invalid: center (1109) is outside top-bottom (1145-1250) by 36px |
| Page 349 | `structural` | `HIGHLIGHT_LINE_OUT_OF_RANGE` | <span style="color:red">fatal</span> | 35:18 | 17 | 1 | Highlight line (17) is outside layout bands (1..16) |
| Page 349 | `structural` | `MARKER_LINE_OUT_OF_RANGE` | <span style="color:red">fatal</span> | 35:7 | 17 | 1 | Marker line (17) is outside layout bands (1..16) |
| Page 353 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 13 | 1 | Line vertical bounds invalid: center (1486) is outside top-bottom (1643-1772) by 157px |
| Page 358 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 5 | 1 | Line vertical bounds invalid: center (749) is outside top-bottom (781-901) by 32px |
| Page 358 | `structural` | `HIGHLIGHT_LINE_OUT_OF_RANGE` | <span style="color:red">fatal</span> | 37:54 | 15 | 2 | Highlight line (15) is outside layout bands (1..14) |
| Page 358 | `structural` | `MARKER_LINE_OUT_OF_RANGE` | <span style="color:red">fatal</span> | 37:20 | 15 | 2 | Marker line (15) is outside layout bands (1..14) |
| Page 361 | `geometry` | `MARKER_NO_HIGHLIGHT` | <span style="color:red">fatal</span> | 37:104 | 11 | 4 | Marker exists for 37:104 but no highlight found on page |
| Page 362 | `geometry` | `MARKER_NO_HIGHLIGHT` | <span style="color:red">fatal</span> | 37:124 | 7 | 8 | Marker exists for 37:124 but no highlight found on page |
| Page 382 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 10 | 1 | Line vertical bounds invalid: center (1087) is outside top-bottom (1246-1337) by 159px |
| Page 387 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 14 | 1 | Line vertical bounds invalid: center (1597) is outside top-bottom (1737-1863) by 140px |
| Page 393 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 7 | 1 | Line vertical bounds invalid: center (826) is outside top-bottom (971-1076) by 145px |
| Page 415 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 9 | 1 | Line vertical bounds invalid: center (1026) is outside top-bottom (1184-1291) by 158px |
| Page 420 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 4 | 1 | Line vertical bounds invalid: center (658) is outside top-bottom (381-483) by 175px |
| Page 422 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 6 | 1 | Line vertical bounds invalid: center (810) is outside top-bottom (854-964) by 44px |
| Page 422 | `structural` | `HIGHLIGHT_LINE_OUT_OF_RANGE` | <span style="color:red">fatal</span> | 53:52 | 16 | 3 | Highlight line (16) is outside layout bands (1..15) |
| Page 422 | `structural` | `MARKER_LINE_OUT_OF_RANGE` | <span style="color:red">fatal</span> | 53:23 | 16 | 3 | Marker line (16) is outside layout bands (1..15) |
| Page 424 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 7 | 1 | Line vertical bounds invalid: center (1032) is outside top-bottom (729-850) by 182px |
| Page 429 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 1 | 1 | Line vertical bounds invalid: center (371) is outside top-bottom (244-359) by 12px |
| Page 437 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 14 | 1 | Line vertical bounds invalid: center (1421) is outside top-bottom (1568-1659) by 147px |
| Page 438 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 8 | 1 | Line vertical bounds invalid: center (1044) is outside top-bottom (806-919) by 125px |
| Page 445 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 6 | 1 | Line vertical bounds invalid: center (874) is outside top-bottom (904-1022) by 30px |
| Page 445 | `structural` | `HIGHLIGHT_LINE_OUT_OF_RANGE` | <span style="color:red">fatal</span> | 64:28 | 15 | 1 | Highlight line (15) is outside layout bands (1..14) |
| Page 445 | `structural` | `MARKER_LINE_OUT_OF_RANGE` | <span style="color:red">fatal</span> | 64:6 | 15 | 1 | Marker line (15) is outside layout bands (1..14) |
| Page 454 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 5 | 1 | Line vertical bounds invalid: center (575) is outside top-bottom (705-818) by 130px |
| Page 457 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 5 | 1 | Line vertical bounds invalid: center (714) is outside top-bottom (745-865) by 31px |
| Page 457 | `structural` | `HIGHLIGHT_LINE_OUT_OF_RANGE` | <span style="color:red">fatal</span> | 71:12 | 16 | 3 | Highlight line (16) is outside layout bands (1..15) |
| Page 457 | `structural` | `MARKER_LINE_OUT_OF_RANGE` | <span style="color:red">fatal</span> | 71:12 | 16 | 3 | Marker line (16) is outside layout bands (1..15) |
| Page 460 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 6 | 1 | Line vertical bounds invalid: center (647) is outside top-bottom (773-870) by 126px |
| Page 461 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 8 | 1 | Line vertical bounds invalid: center (833) is outside top-bottom (971-1078) by 138px |
| Page 463 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 1 | 1 | Line vertical bounds invalid: center (380) is outside top-bottom (249-355) by 25px |
| Page 468 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 1 | 1 | Line vertical bounds invalid: center (364) is outside top-bottom (263-353) by 11px |
| Page 469 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 2 | 2 | Line vertical bounds invalid: center (483) is outside top-bottom (153-261) by 222px |
| Page 471 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 1 | 2 | Line vertical bounds invalid: center (115) is outside top-bottom (277-378) by 162px |
| Page 471 | `structural` | `HIGHLIGHT_LINE_OUT_OF_RANGE` | <span style="color:red">fatal</span> | 83:7 | 14 | 9 | Highlight line (14) is outside layout bands (1..13) |
| Page 471 | `structural` | `MARKER_LINE_OUT_OF_RANGE` | <span style="color:red">fatal</span> | 83:7 | 14 | 7 | Marker line (14) is outside layout bands (1..13) |
| Page 475 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 8 | 2 | Line vertical bounds invalid: center (1349) is outside top-bottom (1013-1121) by 228px |
| Page 477 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 8 | 1 | Line vertical bounds invalid: center (1124) is outside top-bottom (1304-1396) by 180px |
| Page 479 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 4 | 2 | Line vertical bounds invalid: center (917) is outside top-bottom (945-1081) by 28px |
| Page 479 | `structural` | `HIGHLIGHT_LINE_OUT_OF_RANGE` | <span style="color:red">fatal</span> | 96:3 | 10 | 3 | Highlight line (10) is outside layout bands (1..9) |
| Page 479 | `structural` | `MARKER_LINE_OUT_OF_RANGE` | <span style="color:red">fatal</span> | 96:3 | 10 | 3 | Marker line (10) is outside layout bands (1..9) |
| Page 481 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 11 | 1 | Line vertical bounds invalid: center (1396) is outside top-bottom (1556-1663) by 160px |
| Page 483 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:red">fatal</span> | - | 1 | 1 | Line vertical bounds invalid: center (341) is outside top-bottom (373-501) by 32px |
| Page 483 | `structural` | `HIGHLIGHT_LINE_OUT_OF_RANGE` | <span style="color:red">fatal</span> | 106:3 | 9 | 3 | Highlight line (9) is outside layout bands (1..8) |
| Page 483 | `structural` | `MARKER_LINE_OUT_OF_RANGE` | <span style="color:red">fatal</span> | 106:3 | 9 | 3 | Marker line (9) is outside layout bands (1..8) |
| Page 3 | `ordering` | `DUPLICATE_MARKER_AYAH` | <span style="color:orange">warning</span> | 2:8 | 6 | 1 | Multiple markers (2 times) found on page for same ayah 2:8 |
| Page 4 | `ordering` | `DUPLICATE_MARKER_AYAH` | <span style="color:orange">warning</span> | 2:18 | 3 | 1 | Multiple markers (2 times) found on page for same ayah 2:18 |
| Page 4 | `geometry` | `ORPHAN_HIGHLIGHT_NO_MARKER` | <span style="color:orange">warning</span> | 2:17 | 2 | 1 | Highlight ends before left margin (0.143) but no marker circle found on page |
| Page 27 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (17) does not match lineBands count (18) |
| Page 62 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (15) does not match lineBands count (16) |
| Page 150 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (16) does not match lineBands count (17) |
| Page 156 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (15) does not match lineBands count (14) |
| Page 215 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (16) does not match lineBands count (17) |
| Page 263 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (18) does not match lineBands count (19) |
| Page 282 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (17) does not match lineBands count (15) |
| Page 285 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (17) does not match lineBands count (15) |
| Page 287 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (17) does not match lineBands count (16) |
| Page 289 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (17) does not match lineBands count (16) |
| Page 324 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (16) does not match lineBands count (17) |
| Page 334 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (15) does not match lineBands count (14) |
| Page 334 | `numbering` | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | <span style="color:orange">warning</span> | 32:31 | 14 | 1 | Highlight ayah (31) is out of range for sura (max 30) |
| Page 335 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (15) does not match lineBands count (17) |
| Page 349 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (17) does not match lineBands count (16) |
| Page 353 | `numbering` | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | <span style="color:orange">warning</span> | 35:46 | 11 | 2 | Highlight ayah (46) is out of range for sura (max 45) |
| Page 358 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (15) does not match lineBands count (14) |
| Page 361 | `geometry` | `ORPHAN_HIGHLIGHT_NO_MARKER` | <span style="color:orange">warning</span> | 37:114 | 13 | 5 | Highlight ends before left margin (0.730) but no marker circle found on page |
| Page 362 | `geometry` | `ORPHAN_HIGHLIGHT_NO_MARKER` | <span style="color:orange">warning</span> | 37:145 | 12 | 10 | Highlight ends before left margin (0.227) but no marker circle found on page |
| Page 368 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (15) does not match lineBands count (16) |
| Page 382 | `numbering` | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | <span style="color:orange">warning</span> | 40:86 | 9 | 1 | Highlight ayah (86) is out of range for sura (max 85) |
| Page 403 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:orange">warning</span> | - | 1 | 1 | Line vertical bounds slightly off: center (270) is outside top-bottom (275-357) by 5px |
| Page 422 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (16) does not match lineBands count (15) |
| Page 429 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (16) does not match lineBands count (17) |
| Page 438 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (15) does not match lineBands count (18) |
| Page 440 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (15) does not match lineBands count (16) |
| Page 443 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:orange">warning</span> | - | 1 | 1 | Line vertical bounds slightly off: center (276) is outside top-bottom (279-360) by 3px |
| Page 445 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (15) does not match lineBands count (14) |
| Page 445 | `numbering` | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | <span style="color:orange">warning</span> | 64:28 | 15 | 1 | Highlight ayah (28) is out of range for sura (max 18) |
| Page 450 | `numbering` | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | <span style="color:orange">warning</span> | 66:25 | 13 | 1 | Highlight ayah (25) is out of range for sura (max 12) |
| Page 451 | `layout` | `LAYOUT_ORDER_INVALID` | <span style="color:orange">warning</span> | - | 1 | 1 | Line vertical bounds slightly off: center (292) is outside top-bottom (295-399) by 3px |
| Page 452 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (16) does not match lineBands count (17) |
| Page 457 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (16) does not match lineBands count (15) |
| Page 463 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (15) does not match lineBands count (16) |
| Page 468 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (16) does not match lineBands count (17) |
| Page 469 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (15) does not match lineBands count (16) |
| Page 471 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (16) does not match lineBands count (13) |
| Page 475 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (13) does not match lineBands count (14) |
| Page 476 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (16) does not match lineBands count (17) |
| Page 479 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (10) does not match lineBands count (9) |
| Page 483 | `layout` | `LINE_COUNT_MISMATCH` | <span style="color:orange">warning</span> | - | - | 1 | detectedLineCount (9) does not match lineBands count (8) |
| Page 483 | `numbering` | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | <span style="color:orange">warning</span> | 106:5 | 9 | 1 | Highlight ayah (5) is out of range for sura (max 4) |
| Page 483 | `numbering` | `MARKER_AYAH_OUT_OF_RANGE` | <span style="color:orange">warning</span> | 106:5 | 9 | 1 | Marker ayah (5) is out of range for sura (max 4) |
| Page 2 | `layout` | `LAYOUT_VERTICAL_OVERLAP` | <span style="color:blue">suspicious</span> | - | 3 | 1 | Minor vertical overlap with previous line band by 5px |
| Page 3 | `geometry` | `MARKER_NOT_ON_HIGHLIGHT_LINE` | <span style="color:blue">suspicious</span> | 2:8 | 6 | 8 | Marker exists on line 6 for 2:8 but highlight is on different line(s) |
| Page 34 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 2:251 -> 2:252 | 16 | 1 | Horizontal overlap on same line by 0.1000 |
| Page 43 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 3:15 -> 3:16 | 3 | 1 | Horizontal overlap on same line by 0.1000 |
| Page 68 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 4:29 -> 4:30 | 3 | 6 | Horizontal overlap on same line by 0.1000 |
| Page 154 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 9:28 -> 9:29 | 4 | 1 | Horizontal overlap on same line by 0.1000 |
| Page 161 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 9:77 -> 9:78 | 4 | 2 | Horizontal overlap on same line by 0.1000 |
| Page 210 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 14:50 -> 14:50 | 15 | 1 | Horizontal overlap on same line by 0.1943 |
| Page 210 | `geometry` | `SAME_LINE_GAP` | <span style="color:blue">suspicious</span> | 14:50 -> 14:51 | 15 | 1 | Horizontal gap on same line by 0.1160 |
| Page 211 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 15:16 -> 15:17 | 12 | 1 | Horizontal overlap on same line by 0.1000 |
| Page 214 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 15:82 -> 15:82 | 4 | 1 | Horizontal overlap on same line by 0.1290 |
| Page 214 | `geometry` | `SAME_LINE_GAP` | <span style="color:blue">suspicious</span> | 15:82 -> 15:83 | 4 | 1 | Horizontal gap on same line by 0.0954 |
| Page 300 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 26:151 -> 26:151 | 3 | 1 | Horizontal overlap on same line by 0.0786 |
| Page 353 | `geometry` | `MARKER_NOT_ON_HIGHLIGHT_LINE` | <span style="color:blue">suspicious</span> | 35:45 | 12 | 1 | Marker exists on line 12 for 35:45 but highlight is on different line(s) |
| Page 354 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 36:9 -> 36:10 | 3 | 1 | Horizontal overlap on same line by 0.1000 |
| Page 361 | `ordering` | `HIGHLIGHT_ORDER_JUMP` | <span style="color:blue">suspicious</span> | 37:108 | 11 | 3 | Ayah forward jump: from 37:103 to 37:108 |
| Page 361 | `geometry` | `MARKER_NOT_ON_HIGHLIGHT_LINE` | <span style="color:blue">suspicious</span> | 37:95 | 6 | 8 | Marker exists on line 6 for 37:95 but highlight is on different line(s) |
| Page 362 | `ordering` | `HIGHLIGHT_ORDER_JUMP` | <span style="color:blue">suspicious</span> | 37:130 | 7 | 4 | Ayah forward jump: from 37:123 to 37:130 |
| Page 362 | `geometry` | `MARKER_NOT_ON_HIGHLIGHT_LINE` | <span style="color:blue">suspicious</span> | 37:130 | 10 | 13 | Marker exists on line 10 for 37:130 but highlight is on different line(s) |
| Page 368 | `ordering` | `HIGHLIGHT_ORDER_JUMP` | <span style="color:blue">suspicious</span> | 39:10 | 16 | 1 | Ayah forward jump: from 39:7 to 39:10 |
| Page 368 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 39:7 -> 39:10 | 16 | 1 | Horizontal overlap on same line by 0.9400 |
| Page 382 | `geometry` | `MARKER_NOT_ON_HIGHLIGHT_LINE` | <span style="color:blue">suspicious</span> | 40:85 | 9 | 1 | Marker exists on line 9 for 40:85 but highlight is on different line(s) |
| Page 407 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 47:17 -> 47:18 | 13 | 1 | Horizontal overlap on same line by 0.1000 |
| Page 416 | `geometry` | `MARKER_NOT_ON_HIGHLIGHT_LINE` | <span style="color:blue">suspicious</span> | 50:14 | 6 | 1 | Marker exists on line 6 for 50:14 but highlight is on different line(s) |
| Page 420 | `geometry` | `MARKER_NOT_ON_HIGHLIGHT_LINE` | <span style="color:blue">suspicious</span> | 51:59 | 4 | 1 | Marker exists on line 4 for 51:59 but highlight is on different line(s) |

## Section 1: Structural Issues
| Page | Line | Ayah | Severity | Code | Message |
|---|---|---|---|---|---|
| Page 349 | 17 | 35:18 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (17) is outside layout bands (1..16) |
| Page 349 | 17 | 35:7 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (17) is outside layout bands (1..16) |
| Page 358 | 15 | 37:54 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (15) is outside layout bands (1..14) |
| Page 358 | 15 | 37:55 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (15) is outside layout bands (1..14) |
| Page 358 | 15 | 37:20 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (15) is outside layout bands (1..14) |
| Page 358 | 15 | 37:21 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (15) is outside layout bands (1..14) |
| Page 422 | 16 | 53:52 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (16) is outside layout bands (1..15) |
| Page 422 | 16 | 53:53 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (16) is outside layout bands (1..15) |
| Page 422 | 16 | 53:54 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (16) is outside layout bands (1..15) |
| Page 422 | 16 | 53:23 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (16) is outside layout bands (1..15) |
| Page 422 | 16 | 53:24 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (16) is outside layout bands (1..15) |
| Page 422 | 16 | 53:25 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (16) is outside layout bands (1..15) |
| Page 445 | 15 | 64:28 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (15) is outside layout bands (1..14) |
| Page 445 | 15 | 64:6 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (15) is outside layout bands (1..14) |
| Page 457 | 16 | 71:12 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (16) is outside layout bands (1..15) |
| Page 457 | 16 | 71:13 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (16) is outside layout bands (1..15) |
| Page 457 | 16 | 71:14 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (16) is outside layout bands (1..15) |
| Page 457 | 16 | 71:12 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (16) is outside layout bands (1..15) |
| Page 457 | 16 | 71:13 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (16) is outside layout bands (1..15) |
| Page 457 | 16 | 71:14 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (16) is outside layout bands (1..15) |
| Page 471 | 14 | 83:7 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (14) is outside layout bands (1..13) |
| Page 471 | 14 | 83:8 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (14) is outside layout bands (1..13) |
| Page 471 | 14 | 83:9 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (14) is outside layout bands (1..13) |
| Page 471 | 14 | 83:10 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (14) is outside layout bands (1..13) |
| Page 471 | 14 | 83:7 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (14) is outside layout bands (1..13) |
| Page 471 | 14 | 83:8 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (14) is outside layout bands (1..13) |
| Page 471 | 14 | 83:9 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (14) is outside layout bands (1..13) |
| Page 471 | 15 | 83:10 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (15) is outside layout bands (1..13) |
| Page 471 | 15 | 83:11 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (15) is outside layout bands (1..13) |
| Page 471 | 15 | 83:12 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (15) is outside layout bands (1..13) |
| Page 471 | 15 | 83:10 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (15) is outside layout bands (1..13) |
| Page 471 | 15 | 83:11 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (15) is outside layout bands (1..13) |
| Page 471 | 16 | 83:12 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (16) is outside layout bands (1..13) |
| Page 471 | 16 | 83:13 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (16) is outside layout bands (1..13) |
| Page 471 | 16 | 83:12 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (16) is outside layout bands (1..13) |
| Page 471 | 16 | 83:13 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (16) is outside layout bands (1..13) |
| Page 479 | 10 | 96:3 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (10) is outside layout bands (1..9) |
| Page 479 | 10 | 96:4 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (10) is outside layout bands (1..9) |
| Page 479 | 10 | 96:5 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (10) is outside layout bands (1..9) |
| Page 479 | 10 | 96:3 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (10) is outside layout bands (1..9) |
| Page 479 | 10 | 96:4 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (10) is outside layout bands (1..9) |
| Page 479 | 10 | 96:5 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (10) is outside layout bands (1..9) |
| Page 483 | 9 | 106:3 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (9) is outside layout bands (1..8) |
| Page 483 | 9 | 106:4 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (9) is outside layout bands (1..8) |
| Page 483 | 9 | 106:5 | <span style="color:red">fatal</span> | `HIGHLIGHT_LINE_OUT_OF_RANGE` | Highlight line (9) is outside layout bands (1..8) |
| Page 483 | 9 | 106:3 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (9) is outside layout bands (1..8) |
| Page 483 | 9 | 106:4 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (9) is outside layout bands (1..8) |
| Page 483 | 9 | 106:5 | <span style="color:red">fatal</span> | `MARKER_LINE_OUT_OF_RANGE` | Marker line (9) is outside layout bands (1..8) |

## Section 2: Numbering Issues
| Page | Line | Ayah | Severity | Code | Message |
|---|---|---|---|---|---|
| Page 334 | 14 | 32:31 | <span style="color:orange">warning</span> | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | Highlight ayah (31) is out of range for sura (max 30) |
| Page 353 | 11 | 35:46 | <span style="color:orange">warning</span> | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | Highlight ayah (46) is out of range for sura (max 45) |
| Page 353 | 12 | 35:46 | <span style="color:orange">warning</span> | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | Highlight ayah (46) is out of range for sura (max 45) |
| Page 382 | 9 | 40:86 | <span style="color:orange">warning</span> | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | Highlight ayah (86) is out of range for sura (max 85) |
| Page 445 | 15 | 64:28 | <span style="color:orange">warning</span> | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | Highlight ayah (28) is out of range for sura (max 18) |
| Page 450 | 13 | 66:25 | <span style="color:orange">warning</span> | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | Highlight ayah (25) is out of range for sura (max 12) |
| Page 483 | 9 | 106:5 | <span style="color:orange">warning</span> | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | Highlight ayah (5) is out of range for sura (max 4) |
| Page 483 | 9 | 106:5 | <span style="color:orange">warning</span> | `MARKER_AYAH_OUT_OF_RANGE` | Marker ayah (5) is out of range for sura (max 4) |

## Section 3: Layout Issues
| Page | Line | Ayah | Severity | Code | Message |
|---|---|---|---|---|---|
| Page 1 | 1 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (511) is outside top-bottom (277-504) by 7px |
| Page 41 | 13 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1644) is outside top-bottom (1347-1455) by 189px |
| Page 62 | 7 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (996) is outside top-bottom (656-761) by 235px |
| Page 62 | 8 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1132) is outside top-bottom (959-1070) by 62px |
| Page 86 | 8 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1088) is outside top-bottom (800-896) by 192px |
| Page 122 | 14 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1533) is outside top-bottom (1654-1768) by 121px |
| Page 142 | 10 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1147) is outside top-bottom (1308-1421) by 161px |
| Page 150 | 10 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1301) is outside top-bottom (1010-1122) by 179px |
| Page 150 | 11 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1399) is outside top-bottom (1236-1346) by 53px |
| Page 156 | 1 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (104) is outside top-bottom (116-242) by 12px |
| Page 200 | 3 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (644) is outside top-bottom (307-439) by 205px |
| Page 215 | 1 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (379) is outside top-bottom (257-365) by 14px |
| Page 289 | 5 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (550) is outside top-bottom (710-804) by 160px |
| Page 320 | 1 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (100) is outside top-bottom (109-243) by 9px |
| Page 324 | 12 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1555) is outside top-bottom (1417-1517) by 38px |
| Page 329 | 8 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1094) is outside top-bottom (804-912) by 182px |
| Page 332 | 5 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (788) is outside top-bottom (472-587) by 201px |
| Page 335 | 1 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (376) is outside top-bottom (139-247) by 129px |
| Page 349 | 9 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1109) is outside top-bottom (1145-1250) by 36px |
| Page 353 | 13 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1486) is outside top-bottom (1643-1772) by 157px |
| Page 358 | 5 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (749) is outside top-bottom (781-901) by 32px |
| Page 382 | 10 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1087) is outside top-bottom (1246-1337) by 159px |
| Page 387 | 14 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1597) is outside top-bottom (1737-1863) by 140px |
| Page 393 | 7 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (826) is outside top-bottom (971-1076) by 145px |
| Page 415 | 9 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1026) is outside top-bottom (1184-1291) by 158px |
| Page 420 | 4 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (658) is outside top-bottom (381-483) by 175px |
| Page 422 | 6 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (810) is outside top-bottom (854-964) by 44px |
| Page 424 | 7 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1032) is outside top-bottom (729-850) by 182px |
| Page 429 | 1 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (371) is outside top-bottom (244-359) by 12px |
| Page 437 | 14 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1421) is outside top-bottom (1568-1659) by 147px |
| Page 438 | 8 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1044) is outside top-bottom (806-919) by 125px |
| Page 445 | 6 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (874) is outside top-bottom (904-1022) by 30px |
| Page 454 | 5 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (575) is outside top-bottom (705-818) by 130px |
| Page 457 | 5 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (714) is outside top-bottom (745-865) by 31px |
| Page 460 | 6 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (647) is outside top-bottom (773-870) by 126px |
| Page 461 | 8 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (833) is outside top-bottom (971-1078) by 138px |
| Page 463 | 1 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (380) is outside top-bottom (249-355) by 25px |
| Page 468 | 1 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (364) is outside top-bottom (263-353) by 11px |
| Page 469 | 2 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (483) is outside top-bottom (153-261) by 222px |
| Page 469 | 3 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (621) is outside top-bottom (463-574) by 47px |
| Page 471 | 1 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (115) is outside top-bottom (277-378) by 162px |
| Page 471 | 8 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1120) is outside top-bottom (1311-1413) by 191px |
| Page 475 | 8 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1349) is outside top-bottom (1013-1121) by 228px |
| Page 475 | 9 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1491) is outside top-bottom (1330-1441) by 50px |
| Page 477 | 8 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1124) is outside top-bottom (1304-1396) by 180px |
| Page 479 | 4 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (917) is outside top-bottom (945-1081) by 28px |
| Page 479 | 8 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1516) is outside top-bottom (1727-1829) by 211px |
| Page 481 | 11 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (1396) is outside top-bottom (1556-1663) by 160px |
| Page 483 | 1 | - | <span style="color:red">fatal</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds invalid: center (341) is outside top-bottom (373-501) by 32px |
| Page 27 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (17) does not match lineBands count (18) |
| Page 62 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (15) does not match lineBands count (16) |
| Page 150 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (16) does not match lineBands count (17) |
| Page 156 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (15) does not match lineBands count (14) |
| Page 215 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (16) does not match lineBands count (17) |
| Page 263 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (18) does not match lineBands count (19) |
| Page 282 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (17) does not match lineBands count (15) |
| Page 285 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (17) does not match lineBands count (15) |
| Page 287 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (17) does not match lineBands count (16) |
| Page 289 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (17) does not match lineBands count (16) |
| Page 324 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (16) does not match lineBands count (17) |
| Page 334 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (15) does not match lineBands count (14) |
| Page 335 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (15) does not match lineBands count (17) |
| Page 349 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (17) does not match lineBands count (16) |
| Page 358 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (15) does not match lineBands count (14) |
| Page 368 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (15) does not match lineBands count (16) |
| Page 403 | 1 | - | <span style="color:orange">warning</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds slightly off: center (270) is outside top-bottom (275-357) by 5px |
| Page 422 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (16) does not match lineBands count (15) |
| Page 429 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (16) does not match lineBands count (17) |
| Page 438 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (15) does not match lineBands count (18) |
| Page 440 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (15) does not match lineBands count (16) |
| Page 443 | 1 | - | <span style="color:orange">warning</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds slightly off: center (276) is outside top-bottom (279-360) by 3px |
| Page 445 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (15) does not match lineBands count (14) |
| Page 451 | 1 | - | <span style="color:orange">warning</span> | `LAYOUT_ORDER_INVALID` | Line vertical bounds slightly off: center (292) is outside top-bottom (295-399) by 3px |
| Page 452 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (16) does not match lineBands count (17) |
| Page 457 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (16) does not match lineBands count (15) |
| Page 463 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (15) does not match lineBands count (16) |
| Page 468 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (16) does not match lineBands count (17) |
| Page 469 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (15) does not match lineBands count (16) |
| Page 471 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (16) does not match lineBands count (13) |
| Page 475 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (13) does not match lineBands count (14) |
| Page 476 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (16) does not match lineBands count (17) |
| Page 479 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (10) does not match lineBands count (9) |
| Page 483 | - | - | <span style="color:orange">warning</span> | `LINE_COUNT_MISMATCH` | detectedLineCount (9) does not match lineBands count (8) |
| Page 2 | 3 | - | <span style="color:blue">suspicious</span> | `LAYOUT_VERTICAL_OVERLAP` | Minor vertical overlap with previous line band by 5px |

## Section 4: Ordering Issues
| Page | Line | Ayah | Severity | Code | Message |
|---|---|---|---|---|---|
| Page 3 | 6 | 2:8 | <span style="color:orange">warning</span> | `DUPLICATE_MARKER_AYAH` | Multiple markers (2 times) found on page for same ayah 2:8 |
| Page 4 | 3 | 2:18 | <span style="color:orange">warning</span> | `DUPLICATE_MARKER_AYAH` | Multiple markers (2 times) found on page for same ayah 2:18 |
| Page 361 | 11 | 37:108 | <span style="color:orange">suspicious</span> | `HIGHLIGHT_ORDER_JUMP` | Ayah forward jump: from 37:103 to 37:108 |
| Page 361 | 13 | 37:116 | <span style="color:orange">suspicious</span> | `HIGHLIGHT_ORDER_JUMP` | Ayah forward jump: from 37:114 to 37:116 |
| Page 361 | 14 | 37:120 | <span style="color:orange">suspicious</span> | `HIGHLIGHT_ORDER_JUMP` | Ayah forward jump: from 37:118 to 37:120 |
| Page 362 | 7 | 37:130 | <span style="color:orange">suspicious</span> | `HIGHLIGHT_ORDER_JUMP` | Ayah forward jump: from 37:123 to 37:130 |
| Page 362 | 9 | 37:135 | <span style="color:orange">suspicious</span> | `HIGHLIGHT_ORDER_JUMP` | Ayah forward jump: from 37:133 to 37:135 |
| Page 362 | 10 | 37:138 | <span style="color:orange">suspicious</span> | `HIGHLIGHT_ORDER_JUMP` | Ayah forward jump: from 37:136 to 37:138 |
| Page 362 | 17 | 37:160 | <span style="color:orange">suspicious</span> | `HIGHLIGHT_ORDER_JUMP` | Ayah forward jump: from 37:158 to 37:160 |
| Page 368 | 16 | 39:10 | <span style="color:orange">suspicious</span> | `HIGHLIGHT_ORDER_JUMP` | Ayah forward jump: from 39:7 to 39:10 |

## Section 5: Geometry Issues & Diagnostics
### Same-Line Gaps, Overlaps and Bindings (Excluding Boundary Mismatch)
| Page | Line | Ayah | Severity | Code | Message |
|---|---|---|---|---|---|
| Page 361 | 11 | 37:104 | <span style="color:red">fatal</span> | `MARKER_NO_HIGHLIGHT` | Marker exists for 37:104 but no highlight found on page |
| Page 361 | 12 | 37:105 | <span style="color:red">fatal</span> | `MARKER_NO_HIGHLIGHT` | Marker exists for 37:105 but no highlight found on page |
| Page 361 | 12 | 37:106 | <span style="color:red">fatal</span> | `MARKER_NO_HIGHLIGHT` | Marker exists for 37:106 but no highlight found on page |
| Page 361 | 12 | 37:107 | <span style="color:red">fatal</span> | `MARKER_NO_HIGHLIGHT` | Marker exists for 37:107 but no highlight found on page |
| Page 362 | 7 | 37:124 | <span style="color:red">fatal</span> | `MARKER_NO_HIGHLIGHT` | Marker exists for 37:124 but no highlight found on page |
| Page 362 | 8 | 37:125 | <span style="color:red">fatal</span> | `MARKER_NO_HIGHLIGHT` | Marker exists for 37:125 but no highlight found on page |
| Page 362 | 8 | 37:126 | <span style="color:red">fatal</span> | `MARKER_NO_HIGHLIGHT` | Marker exists for 37:126 but no highlight found on page |
| Page 362 | 9 | 37:127 | <span style="color:red">fatal</span> | `MARKER_NO_HIGHLIGHT` | Marker exists for 37:127 but no highlight found on page |
| Page 362 | 9 | 37:128 | <span style="color:red">fatal</span> | `MARKER_NO_HIGHLIGHT` | Marker exists for 37:128 but no highlight found on page |
| Page 362 | 10 | 37:129 | <span style="color:red">fatal</span> | `MARKER_NO_HIGHLIGHT` | Marker exists for 37:129 but no highlight found on page |
| Page 362 | 12 | 37:134 | <span style="color:red">fatal</span> | `MARKER_NO_HIGHLIGHT` | Marker exists for 37:134 but no highlight found on page |
| Page 362 | 14 | 37:137 | <span style="color:red">fatal</span> | `MARKER_NO_HIGHLIGHT` | Marker exists for 37:137 but no highlight found on page |
| Page 4 | 2 | 2:17 | <span style="color:orange">warning</span> | `ORPHAN_HIGHLIGHT_NO_MARKER` | Highlight ends before left margin (0.143) but no marker circle found on page |
| Page 361 | 13 | 37:114 | <span style="color:orange">warning</span> | `ORPHAN_HIGHLIGHT_NO_MARKER` | Highlight ends before left margin (0.730) but no marker circle found on page |
| Page 361 | 13 | 37:116 | <span style="color:orange">warning</span> | `ORPHAN_HIGHLIGHT_NO_MARKER` | Highlight ends before left margin (0.474) but no marker circle found on page |
| Page 361 | 13 | 37:117 | <span style="color:orange">warning</span> | `ORPHAN_HIGHLIGHT_NO_MARKER` | Highlight ends before left margin (0.106) but no marker circle found on page |
| Page 361 | 14 | 37:118 | <span style="color:orange">warning</span> | `ORPHAN_HIGHLIGHT_NO_MARKER` | Highlight ends before left margin (0.699) but no marker circle found on page |
| Page 361 | 14 | 37:120 | <span style="color:orange">warning</span> | `ORPHAN_HIGHLIGHT_NO_MARKER` | Highlight ends before left margin (0.152) but no marker circle found on page |
| Page 362 | 12 | 37:145 | <span style="color:orange">warning</span> | `ORPHAN_HIGHLIGHT_NO_MARKER` | Highlight ends before left margin (0.227) but no marker circle found on page |
| Page 362 | 13 | 37:147 | <span style="color:orange">warning</span> | `ORPHAN_HIGHLIGHT_NO_MARKER` | Highlight ends before left margin (0.744) but no marker circle found on page |
| Page 362 | 13 | 37:148 | <span style="color:orange">warning</span> | `ORPHAN_HIGHLIGHT_NO_MARKER` | Highlight ends before left margin (0.391) but no marker circle found on page |
| Page 362 | 14 | 37:150 | <span style="color:orange">warning</span> | `ORPHAN_HIGHLIGHT_NO_MARKER` | Highlight ends before left margin (0.765) but no marker circle found on page |
| Page 362 | 14 | 37:151 | <span style="color:orange">warning</span> | `ORPHAN_HIGHLIGHT_NO_MARKER` | Highlight ends before left margin (0.342) but no marker circle found on page |
| Page 362 | 15 | 37:153 | <span style="color:orange">warning</span> | `ORPHAN_HIGHLIGHT_NO_MARKER` | Highlight ends before left margin (0.777) but no marker circle found on page |
| Page 362 | 15 | 37:154 | <span style="color:orange">warning</span> | `ORPHAN_HIGHLIGHT_NO_MARKER` | Highlight ends before left margin (0.287) but no marker circle found on page |
| Page 362 | 16 | 37:156 | <span style="color:orange">warning</span> | `ORPHAN_HIGHLIGHT_NO_MARKER` | Highlight ends before left margin (0.704) but no marker circle found on page |
| Page 362 | 16 | 37:157 | <span style="color:orange">warning</span> | `ORPHAN_HIGHLIGHT_NO_MARKER` | Highlight ends before left margin (0.231) but no marker circle found on page |
| Page 362 | 17 | 37:160 | <span style="color:orange">warning</span> | `ORPHAN_HIGHLIGHT_NO_MARKER` | Highlight ends before left margin (0.625) but no marker circle found on page |
| Page 3 | 6 | 2:8 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 6 for 2:8 but highlight is on different line(s) |
| Page 3 | 7 | 2:9 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 7 for 2:9 but highlight is on different line(s) |
| Page 3 | 8 | 2:10 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 8 for 2:10 but highlight is on different line(s) |
| Page 3 | 9 | 2:11 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 9 for 2:11 but highlight is on different line(s) |
| Page 3 | 11 | 2:12 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 11 for 2:12 but highlight is on different line(s) |
| Page 3 | 13 | 2:13 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 13 for 2:13 but highlight is on different line(s) |
| Page 3 | 14 | 2:14 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 14 for 2:14 but highlight is on different line(s) |
| Page 3 | 15 | 2:15 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 15 for 2:15 but highlight is on different line(s) |
| Page 34 | 16 | 2:251 -> 2:252 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 43 | 3 | 3:15 -> 3:16 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 68 | 3 | 4:29 -> 4:30 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 68 | 4 | 4:30 -> 4:31 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 68 | 6 | 4:31 -> 4:32 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 68 | 8 | 4:32 -> 4:33 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 68 | 11 | 4:33 -> 4:34 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 68 | 15 | 4:34 -> 4:35 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 154 | 4 | 9:28 -> 9:29 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 161 | 4 | 9:77 -> 9:78 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 161 | 5 | 9:78 -> 9:79 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 210 | 15 | 14:50 -> 14:50 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1943 |
| Page 210 | 15 | 14:50 -> 14:51 | <span style="color:blue">suspicious</span> | `SAME_LINE_GAP` | Horizontal gap on same line by 0.1160 |
| Page 211 | 12 | 15:16 -> 15:17 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 214 | 4 | 15:82 -> 15:82 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1290 |
| Page 214 | 4 | 15:82 -> 15:83 | <span style="color:blue">suspicious</span> | `SAME_LINE_GAP` | Horizontal gap on same line by 0.0954 |
| Page 300 | 3 | 26:151 -> 26:151 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.0786 |
| Page 353 | 12 | 35:45 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 12 for 35:45 but highlight is on different line(s) |
| Page 354 | 3 | 36:9 -> 36:10 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 361 | 6 | 37:95 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 6 for 37:95 but highlight is on different line(s) |
| Page 361 | 11 | 37:103 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 11 for 37:103 but highlight is on different line(s) |
| Page 361 | 13 | 37:108 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 13 for 37:108 but highlight is on different line(s) |
| Page 361 | 13 | 37:109 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 13 for 37:109 but highlight is on different line(s) |
| Page 361 | 13 | 37:110 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 13 for 37:110 but highlight is on different line(s) |
| Page 361 | 14 | 37:111 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 14 for 37:111 but highlight is on different line(s) |
| Page 361 | 14 | 37:112 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 14 for 37:112 but highlight is on different line(s) |
| Page 361 | 15 | 37:113 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 15 for 37:113 but highlight is on different line(s) |
| Page 362 | 10 | 37:130 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 10 for 37:130 but highlight is on different line(s) |
| Page 362 | 11 | 37:131 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 11 for 37:131 but highlight is on different line(s) |
| Page 362 | 11 | 37:132 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 11 for 37:132 but highlight is on different line(s) |
| Page 362 | 12 | 37:133 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 12 for 37:133 but highlight is on different line(s) |
| Page 362 | 13 | 37:135 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 13 for 37:135 but highlight is on different line(s) |
| Page 362 | 13 | 37:136 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 13 for 37:136 but highlight is on different line(s) |
| Page 362 | 14 | 37:138 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 14 for 37:138 but highlight is on different line(s) |
| Page 362 | 15 | 37:139 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 15 for 37:139 but highlight is on different line(s) |
| Page 362 | 15 | 37:140 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 15 for 37:140 but highlight is on different line(s) |
| Page 362 | 16 | 37:141 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 16 for 37:141 but highlight is on different line(s) |
| Page 362 | 16 | 37:142 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 16 for 37:142 but highlight is on different line(s) |
| Page 362 | 17 | 37:143 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 17 for 37:143 but highlight is on different line(s) |
| Page 362 | 17 | 37:144 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 17 for 37:144 but highlight is on different line(s) |
| Page 368 | 16 | 39:7 -> 39:10 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.9400 |
| Page 382 | 9 | 40:85 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 9 for 40:85 but highlight is on different line(s) |
| Page 407 | 13 | 47:17 -> 47:18 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 416 | 6 | 50:14 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 6 for 50:14 but highlight is on different line(s) |
| Page 420 | 4 | 51:59 | <span style="color:blue">suspicious</span> | `MARKER_NOT_ON_HIGHLIGHT_LINE` | Marker exists on line 4 for 51:59 but highlight is on different line(s) |

### Marker Boundary Diagnostics (Top 50 Worst Mismatches by Delta)
| Page | Line | Ayah | Severity | Expected Boundary | Actual Marker X | Delta | Tolerance |
|---|---|---|---|---|---|---|---|
| Page 3 | 15 | 2:16 | <span style="color:blue">suspicious</span> | 0.9700 | 0.0971 | **0.8729** | 0.0250 |
| Page 416 | 6 | 50:15 | <span style="color:blue">suspicious</span> | 0.9301 | 0.0705 | **0.8596** | 0.0250 |
| Page 420 | 4 | 51:60 | <span style="color:blue">suspicious</span> | 0.9304 | 0.0782 | **0.8522** | 0.0250 |
| Page 32 | 3 | 2:235 | <span style="color:blue">suspicious</span> | 0.0300 | 0.8295 | **0.7995** | 0.0250 |
| Page 3 | 9 | 2:12 | <span style="color:blue">suspicious</span> | 0.9700 | 0.2278 | **0.7422** | 0.0250 |
| Page 3 | 11 | 2:13 | <span style="color:blue">suspicious</span> | 0.9724 | 0.2737 | **0.6987** | 0.0250 |
| Page 3 | 7 | 2:10 | <span style="color:blue">suspicious</span> | 0.9700 | 0.2978 | **0.6722** | 0.0250 |
| Page 3 | 13 | 2:14 | <span style="color:blue">suspicious</span> | 0.9700 | 0.4693 | **0.5007** | 0.0250 |
| Page 3 | 14 | 2:15 | <span style="color:blue">suspicious</span> | 0.9700 | 0.5796 | **0.3904** | 0.0250 |
| Page 3 | 6 | 2:9 | <span style="color:blue">suspicious</span> | 0.9700 | 0.7018 | **0.2682** | 0.0250 |
| Page 1 | 7 | 1:7 | <span style="color:blue">suspicious</span> | 0.0300 | 0.2592 | **0.2292** | 0.0250 |
| Page 68 | 3 | 4:29 | <span style="color:blue">suspicious</span> | 0.3966 | 0.5235 | **0.1269** | 0.0250 |
| Page 304 | 16 | 27:26 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1539 | **0.1239** | 0.0250 |
| Page 4 | 2 | 2:18 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1430 | **0.1130** | 0.0250 |
| Page 268 | 17 | 22:18 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1412 | **0.1112** | 0.0250 |
| Page 2 | 3 | 2:3 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1309 | **0.1009** | 0.0250 |
| Page 218 | 17 | 16:50 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1293 | **0.0993** | 0.0250 |
| Page 248 | 18 | 19:58 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1292 | **0.0992** | 0.0250 |
| Page 2 | 6 | 2:5 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1276 | **0.0976** | 0.0250 |
| Page 161 | 5 | 9:79 | <span style="color:blue">suspicious</span> | 0.2581 | 0.1609 | **0.0972** | 0.0250 |
| Page 385 | 18 | 41:37 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1266 | **0.0966** | 0.0250 |
| Page 211 | 12 | 15:17 | <span style="color:blue">suspicious</span> | 0.8281 | 0.7321 | **0.0960** | 0.0250 |
| Page 68 | 6 | 4:32 | <span style="color:blue">suspicious</span> | 0.8921 | 0.7969 | **0.0952** | 0.0250 |
| Page 1 | 1 | 1:1 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1230 | **0.0930** | 0.0250 |
| Page 354 | 3 | 36:10 | <span style="color:blue">suspicious</span> | 0.5037 | 0.4130 | **0.0907** | 0.0250 |
| Page 154 | 4 | 9:28 | <span style="color:blue">suspicious</span> | 0.6385 | 0.7288 | **0.0903** | 0.0250 |
| Page 142 | 9 | 7:206 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1139 | **0.0839** | 0.0250 |
| Page 1 | 4 | 1:5 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1128 | **0.0828** | 0.0250 |
| Page 293 | 17 | 25:60 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1109 | **0.0809** | 0.0250 |
| Page 337 | 16 | 33:24 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1082 | **0.0782** | 0.0250 |
| Page 68 | 4 | 4:31 | <span style="color:blue">suspicious</span> | 0.3331 | 0.2572 | **0.0759** | 0.0250 |
| Page 336 | 16 | 33:17 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1054 | **0.0754** | 0.0250 |
| Page 326 | 6 | 30:24 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1018 | **0.0718** | 0.0250 |
| Page 63 | 14 | 4:10 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1013 | **0.0713** | 0.0250 |
| Page 225 | 17 | 16:119 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1007 | **0.0707** | 0.0250 |
| Page 225 | 15 | 16:118 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1005 | **0.0705** | 0.0250 |
| Page 407 | 13 | 47:17 | <span style="color:blue">suspicious</span> | 0.5331 | 0.6023 | **0.0692** | 0.0250 |
| Page 240 | 14 | 18:49 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0990 | **0.0690** | 0.0250 |
| Page 326 | 16 | 30:29 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0990 | **0.0690** | 0.0250 |
| Page 140 | 15 | 7:187 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0978 | **0.0678** | 0.0250 |
| Page 337 | 12 | 33:22 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0972 | **0.0672** | 0.0250 |
| Page 335 | 16 | 33:7 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0969 | **0.0669** | 0.0250 |
| Page 214 | 17 | 15:99 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0967 | **0.0667** | 0.0250 |
| Page 1 | 3 | 1:4 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0965 | **0.0665** | 0.0250 |
| Page 332 | 16 | 32:10 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0949 | **0.0649** | 0.0250 |
| Page 232 | 10 | 17:66 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0932 | **0.0632** | 0.0250 |
| Page 46 | 17 | 3:51 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0926 | **0.0626** | 0.0250 |
| Page 239 | 18 | 18:41 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0920 | **0.0620** | 0.0250 |
| Page 103 | 5 | 5:113 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0917 | **0.0617** | 0.0250 |
| Page 133 | 1 | 7:117 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0917 | **0.0617** | 0.0250 |
