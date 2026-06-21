# Quran Ayahinfo Validation Report (Warsh Muthamman)

**Date:** 2026-06-21T13:35:46.321Z  
**Pages Checked:** 485 / 485  
**Numbering Mode:** `hafs_tolerant`  
> **Note:** Numbering validation is app-facing Hafs/Kufi tolerant.  

## Summary Stats
| Severity | Count |
|---|---|
| <span style="color:red">🔴 Fatal</span> | **0** |
| <span style="color:orange">🟡 Warning</span> | **4** |
| <span style="color:blue">🔵 Suspicious</span> | **444** |
| **Total Issues** | **448** |

### Stats by Category & Severity
| Category | Fatal | Warning | Suspicious | Total |
|---|---|---|---|---|
| `structural` | 0 | 0 | 0 | **0** |
| `numbering` | 0 | 4 | 0 | **4** |
| `layout` | 0 | 0 | 1 | **1** |
| `geometry` | 0 | 0 | 442 | **442** |
| `ordering` | 0 | 0 | 1 | **1** |
| `other` | 0 | 0 | 0 | **0** |

### Fatal Breakdown
- Fatal Issues (Excluding Numbering): **0**  
- Fatal Numbering Issues Only: **0**  

## Stats by Issue Code
| Code | Category | Severity | Count |
|---|---|---|---|
| `HIGHLIGHT_AYAH_OUT_OF_RANGE` | `numbering` | <span style="color:orange">warning</span> | 3 |
| `MARKER_AYAH_OUT_OF_RANGE` | `numbering` | <span style="color:orange">warning</span> | 1 |
| `MARKER_BOUNDARY_MISMATCH` | `geometry` | <span style="color:blue">suspicious</span> | 425 |
| `SAME_LINE_OVERLAP` | `geometry` | <span style="color:blue">suspicious</span> | 17 |
| `LAYOUT_VERTICAL_OVERLAP` | `layout` | <span style="color:blue">suspicious</span> | 1 |
| `HIGHLIGHT_ORDER_JUMP` | `ordering` | <span style="color:blue">suspicious</span> | 1 |

## Top 25 Pages with Most Issues
| Page | Issues Count |
|---|---|
| Page 68 | 16 |
| Page 483 | 10 |
| Page 475 | 7 |
| Page 484 | 7 |
| Page 299 | 6 |
| Page 359 | 6 |
| Page 466 | 6 |
| Page 468 | 6 |
| Page 477 | 6 |
| Page 161 | 5 |
| Page 211 | 5 |
| Page 358 | 5 |
| Page 362 | 5 |
| Page 398 | 5 |
| Page 422 | 5 |
| Page 428 | 5 |
| Page 430 | 5 |
| Page 431 | 5 |
| Page 452 | 5 |
| Page 463 | 5 |
| Page 469 | 5 |
| Page 479 | 5 |
| Page 485 | 5 |
| Page 1 | 4 |
| Page 212 | 4 |

## Major Root Causes (Deduplicated, Excluding Mismatch Geometry)
| Page | Category | Code | Severity | Ayah | Line | Count | Description |
|---|---|---|---|---|---|---|---|
| Page 334 | `numbering` | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | <span style="color:orange">warning</span> | 32:31 | 14 | 1 | Highlight ayah (31) is out of range for sura (max 30) |
| Page 450 | `numbering` | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | <span style="color:orange">warning</span> | 66:25 | 13 | 1 | Highlight ayah (25) is out of range for sura (max 12) |
| Page 483 | `numbering` | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | <span style="color:orange">warning</span> | 106:5 | 9 | 1 | Highlight ayah (5) is out of range for sura (max 4) |
| Page 483 | `numbering` | `MARKER_AYAH_OUT_OF_RANGE` | <span style="color:orange">warning</span> | 106:5 | 9 | 1 | Marker ayah (5) is out of range for sura (max 4) |
| Page 2 | `layout` | `LAYOUT_VERTICAL_OVERLAP` | <span style="color:blue">suspicious</span> | - | 3 | 1 | Minor vertical overlap with previous line band by 5px |
| Page 34 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 2:251 -> 2:252 | 16 | 1 | Horizontal overlap on same line by 0.1000 |
| Page 43 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 3:15 -> 3:16 | 3 | 1 | Horizontal overlap on same line by 0.1000 |
| Page 68 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 4:29 -> 4:30 | 3 | 6 | Horizontal overlap on same line by 0.1000 |
| Page 154 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 9:28 -> 9:29 | 4 | 1 | Horizontal overlap on same line by 0.1000 |
| Page 161 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 9:77 -> 9:78 | 4 | 2 | Horizontal overlap on same line by 0.1000 |
| Page 211 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 15:16 -> 15:17 | 12 | 1 | Horizontal overlap on same line by 0.1000 |
| Page 300 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 26:151 -> 26:151 | 3 | 1 | Horizontal overlap on same line by 0.0786 |
| Page 354 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 36:9 -> 36:10 | 3 | 1 | Horizontal overlap on same line by 0.1000 |
| Page 368 | `ordering` | `HIGHLIGHT_ORDER_JUMP` | <span style="color:blue">suspicious</span> | 39:10 | 16 | 1 | Ayah forward jump: from 39:7 to 39:10 |
| Page 368 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 39:7 -> 39:10 | 16 | 1 | Horizontal overlap on same line by 0.9400 |
| Page 407 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 47:17 -> 47:18 | 13 | 1 | Horizontal overlap on same line by 0.1000 |
| Page 483 | `geometry` | `SAME_LINE_OVERLAP` | <span style="color:blue">suspicious</span> | 106:3 -> 106:4 | 9 | 1 | Horizontal overlap on same line by 0.1000 |

## Section 1: Structural Issues
| Page | Line | Ayah | Severity | Code | Message |
|---|---|---|---|---|---|

## Section 2: Numbering Issues
| Page | Line | Ayah | Severity | Code | Message |
|---|---|---|---|---|---|
| Page 334 | 14 | 32:31 | <span style="color:orange">warning</span> | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | Highlight ayah (31) is out of range for sura (max 30) |
| Page 450 | 13 | 66:25 | <span style="color:orange">warning</span> | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | Highlight ayah (25) is out of range for sura (max 12) |
| Page 483 | 9 | 106:5 | <span style="color:orange">warning</span> | `HIGHLIGHT_AYAH_OUT_OF_RANGE` | Highlight ayah (5) is out of range for sura (max 4) |
| Page 483 | 9 | 106:5 | <span style="color:orange">warning</span> | `MARKER_AYAH_OUT_OF_RANGE` | Marker ayah (5) is out of range for sura (max 4) |

## Section 3: Layout Issues
| Page | Line | Ayah | Severity | Code | Message |
|---|---|---|---|---|---|
| Page 2 | 3 | - | <span style="color:blue">suspicious</span> | `LAYOUT_VERTICAL_OVERLAP` | Minor vertical overlap with previous line band by 5px |

## Section 4: Ordering Issues
| Page | Line | Ayah | Severity | Code | Message |
|---|---|---|---|---|---|
| Page 368 | 16 | 39:10 | <span style="color:orange">suspicious</span> | `HIGHLIGHT_ORDER_JUMP` | Ayah forward jump: from 39:7 to 39:10 |

## Section 5: Geometry Issues & Diagnostics
### Same-Line Gaps, Overlaps and Bindings (Excluding Boundary Mismatch)
| Page | Line | Ayah | Severity | Code | Message |
|---|---|---|---|---|---|
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
| Page 211 | 12 | 15:16 -> 15:17 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 300 | 3 | 26:151 -> 26:151 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.0786 |
| Page 354 | 3 | 36:9 -> 36:10 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 368 | 16 | 39:7 -> 39:10 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.9400 |
| Page 407 | 13 | 47:17 -> 47:18 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |
| Page 483 | 9 | 106:3 -> 106:4 | <span style="color:blue">suspicious</span> | `SAME_LINE_OVERLAP` | Horizontal overlap on same line by 0.1000 |

### Marker Boundary Diagnostics (Top 50 Worst Mismatches by Delta)
| Page | Line | Ayah | Severity | Expected Boundary | Actual Marker X | Delta | Tolerance |
|---|---|---|---|---|---|---|---|
| Page 32 | 3 | 2:235 | <span style="color:blue">suspicious</span> | 0.0300 | 0.8295 | **0.7995** | 0.0250 |
| Page 1 | 7 | 1:7 | <span style="color:blue">suspicious</span> | 0.0300 | 0.2592 | **0.2292** | 0.0250 |
| Page 68 | 3 | 4:29 | <span style="color:blue">suspicious</span> | 0.3966 | 0.5235 | **0.1269** | 0.0250 |
| Page 304 | 16 | 27:26 | <span style="color:blue">suspicious</span> | 0.0300 | 0.1539 | **0.1239** | 0.0250 |
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
| Page 3 | 15 | 2:16 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0971 | **0.0671** | 0.0250 |
| Page 335 | 16 | 33:7 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0969 | **0.0669** | 0.0250 |
| Page 214 | 17 | 15:99 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0967 | **0.0667** | 0.0250 |
| Page 1 | 3 | 1:4 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0965 | **0.0665** | 0.0250 |
| Page 332 | 16 | 32:10 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0949 | **0.0649** | 0.0250 |
| Page 232 | 10 | 17:66 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0932 | **0.0632** | 0.0250 |
| Page 46 | 17 | 3:51 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0926 | **0.0626** | 0.0250 |
| Page 239 | 18 | 18:41 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0920 | **0.0620** | 0.0250 |
| Page 103 | 5 | 5:113 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0917 | **0.0617** | 0.0250 |
| Page 133 | 1 | 7:117 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0917 | **0.0617** | 0.0250 |
| Page 290 | 15 | 25:19 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0916 | **0.0616** | 0.0250 |
| Page 127 | 18 | 7:56 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0908 | **0.0608** | 0.0250 |
| Page 101 | 5 | 5:99 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0903 | **0.0603** | 0.0250 |
| Page 277 | 3 | 23:42 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0880 | **0.0580** | 0.0250 |
| Page 483 | 7 | 105:5 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0879 | **0.0579** | 0.0250 |
| Page 308 | 6 | 27:70 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0872 | **0.0572** | 0.0250 |
| Page 172 | 17 | 10:48 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0872 | **0.0572** | 0.0250 |
| Page 214 | 11 | 15:90 | <span style="color:blue">suspicious</span> | 0.0300 | 0.0868 | **0.0568** | 0.0250 |
| Page 68 | 8 | 4:33 | <span style="color:blue">suspicious</span> | 0.2526 | 0.1961 | **0.0565** | 0.0250 |
