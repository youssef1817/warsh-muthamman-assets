"""Guard the missing opening of At-Tawbah 9:40 against the source PDF.

Run: python -B -m unittest discover -s tests/content-integrity -v
Requires the image toolchain's PyMuPDF, Pillow and NumPy dependencies.
"""

from contextlib import closing
import hashlib
import json
from pathlib import Path
import sqlite3
import unittest
import zipfile

import fitz
import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
PAGE_PATH = ROOT / "pages/warsh_muthamman_png/page156.png"
INFO = ROOT / "databases/ayahinfo/warsh_muthamman"


def on_white(image):
    canvas = Image.new("RGBA", image.size, "white")
    canvas.alpha_composite(image.convert("RGBA"))
    return canvas.convert("RGB")


def line_bounds(image):
    pixels = np.asarray(image.convert("L"))[:, 40:-40]
    occupied = (pixels < 150).sum(axis=1) > 35
    edges = np.diff(np.r_[False, occupied, False].astype(int))
    spans = zip(np.where(edges == 1)[0], np.where(edges == -1)[0])
    merged = []
    for top, bottom in spans:
        if merged and top - merged[-1][1] < 6:
            merged[-1] = (merged[-1][0], int(bottom))
        else:
            merged.append((int(top), int(bottom)))
    return merged


def line_fingerprint(image, bounds):
    top, bottom = bounds
    # Keep the words at both ends of the row. The source's PDF frame has
    # already been excluded; another horizontal inset would clip its text.
    line = image.convert("L").crop((0, top, image.width, bottom))
    ink = np.asarray(line) < 150
    rows, columns = np.where(ink)
    line = line.crop((columns.min(), rows.min(), columns.max() + 1, rows.max() + 1))
    return (255 - np.asarray(line.resize((384, 32)), dtype=float)).ravel()


class Page156ContentTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with fitz.open(ROOT / "source/warsh-muthamman-source.pdf") as source:
            pixmap = source[155].get_pixmap(
                matrix=fitz.Matrix(300 / 72, 300 / 72), alpha=False
            )
        image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
        # Exclude only the PDF frame and its small printed header/footer.
        cls.source = image.crop((60, 55, image.width - 60, image.height - 55))
        with Image.open(PAGE_PATH) as asset:
            cls.asset = on_white(asset)
        cls.source_lines = line_bounds(cls.source)
        cls.asset_lines = line_bounds(cls.asset)

    def test_all_fifteen_source_lines_are_present(self):
        self.assertEqual(len(self.source_lines), 15)
        self.assertEqual(
            len(self.asset_lines), 15,
            "Page 156 lost a Quran text line: the source PDF has 15 lines.",
        )

    def test_first_line_contains_the_source_opening_of_9_40(self):
        expected = line_fingerprint(self.source, self.source_lines[0])
        actual = line_fingerprint(self.asset, self.asset_lines[0])
        similarity = np.dot(expected, actual) / (
            np.linalg.norm(expected) * np.linalg.norm(actual)
        )
        self.assertGreater(
            similarity, 0.85,
            "The first displayed line must contain the source opening of 9:40.",
        )

    def test_existing_fourteen_lines_keep_their_original_pixels(self):
        with Image.open(PAGE_PATH) as image:
            body = image.convert("RGBA").crop((0, 133, image.width, image.height))
        self.assertEqual(
            hashlib.sha256(body.tobytes()).hexdigest(),
            "f256e0f7229f677fcc1d78d9cbe95a68e0af2b6243d53c7f77ca8551ba3f8fb8",
        )

    def test_opening_clears_the_mobile_page_info_header(self):
        # QuranPageWidget uses a 0.5%-height top offset and a 3.4%-width
        # text size for the non-tiled mobile image header.
        header_bottom = self.asset.height * 0.005 + self.asset.width * 0.034
        self.assertGreater(self.asset_lines[0][0], header_bottom)
        self.assertLess(self.asset_lines[0][1], self.asset_lines[1][0])

    def test_coordinates_include_the_restored_line(self):
        layout = json.loads((INFO / "page_layout_json/page_156.json").read_text())
        page = json.loads((INFO / "pages_json/page_156.json").read_text())
        self.assertEqual((layout["imageWidth"], layout["imageHeight"]), (1188, 1929))
        self.assertEqual(layout["detectedLineCount"], 15)
        self.assertEqual(len(layout["lineBands"]), 15)
        for band, (top, bottom) in zip(layout["lineBands"], self.asset_lines):
            self.assertLessEqual(band["top"], top)
            self.assertGreaterEqual(band["bottom"], bottom)
        verse_lines = [h["line"] for h in page["ayah_highlights"] if h["ayah"] == 40]
        self.assertEqual(verse_lines, list(range(1, 7)))
        self.assertEqual([m["line"] for m in page["ayah_markers"]], [6, 8, 10, 12, 14, 15])
        with closing(sqlite3.connect(f"{(INFO / 'ayahinfo.db').as_uri()}?mode=ro", uri=True)) as db:
            self.assertEqual(
                db.execute("SELECT COUNT(*) FROM page_line_bands WHERE page = 156").fetchone()[0],
                15,
            )
            self.assertEqual(
                db.execute("SELECT line FROM ayah_markers WHERE page = 156 ORDER BY ayah").fetchall(),
                [(6,), (8,), (10,), (12,), (14,), (15,)],
            )
        with zipfile.ZipFile(INFO / "ayahinfo_muthamman.zip") as archive:
            self.assertEqual(archive.read("ayahinfo.db"), (INFO / "ayahinfo.db").read_bytes())

    def test_download_index_describes_the_repaired_image(self):
        index = json.loads((ROOT / "pages/warsh_muthamman_png_index.json").read_text())
        entry = next(page for page in index["pages"] if page["page"] == 156)
        self.assertEqual(entry["bytes"], PAGE_PATH.stat().st_size)
        self.assertEqual(entry["sha256"], hashlib.sha256(PAGE_PATH.read_bytes()).hexdigest().upper())
        self.assertEqual((entry["width"], entry["height"]), self.asset.size)
        self.assertEqual(index["totalBytes"], sum(page["bytes"] for page in index["pages"]))


if __name__ == "__main__":
    unittest.main()
