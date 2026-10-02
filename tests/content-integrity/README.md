# Page 156 content regression

Page 156's delivered PNG omitted the first line of At-Tawbah 9:40, beginning
with `إلا تنصروه`. Page 155 ends at 9:39. The original PDF contains the entire
opening on page 156, so this is missing image content rather than a verse
continuing from the preceding page. The precise historical processing step
that dropped the line has not been established.

The repair restores the opening from the PDF's embedded image into the blank
space above the remaining text. Before transparency and palette conversion,
the restored line passes through the adopted balanced contrast, color, and
sharpness settings and the stronger background-cleaning pass. It retains the
original pixels and positions of all 14 existing lines, adds a first highlight
for 9:40, and shifts the coordinate line identifiers. The opening leaves space
for the mobile reader's page-info header. The SQLite update changes only page
156, and its download archive is repackaged from that database.

Run the source comparison and asset checks from this repository:

```text
python -B -m unittest discover -s tests/content-integrity -v
```

The tests compare the opening visually against a rendering of the source PDF,
require all 15 text lines, retain a fingerprint of the existing body pixels,
check clearance for the page-info header, and verify the coordinate JSON,
SQLite rows, downloadable archive, and image
index. Structural coordinate validation alone cannot detect missing image
content; page 156 passed it before this repair as well.

The targeted repair is reproducible, and subsequent runs leave files intact:

```text
python -B tools/repair_page156_from_source.py
```

These checks validate local assets and coordinate data. They do not establish
that remote download URLs or a running device have received the repaired files.
