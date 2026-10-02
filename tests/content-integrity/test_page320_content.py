"""Catch the page 320 opening line lost during the smart-crop stage."""

from contextlib import closing
import hashlib
import json
import sqlite3
import unittest
from pathlib import Path
import zipfile

import fitz
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]


PAGE_PATH = ROOT / "pages/warsh_muthamman_png/page320.png"


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
    return [band for band in merged if band[1] - band[0] >= 10]


def line_fingerprint(image, bounds):
    top, bottom = bounds
    line = image.convert("L").crop((0, top, image.width, bottom))
    ink = np.asarray(line) < 150
    rows, columns = np.where(ink)
    line = line.crop((columns.min(), rows.min(), columns.max() + 1, rows.max() + 1))
    return (255 - np.asarray(line.resize((384, 32)), dtype=float)).ravel()


class Page320ContentTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with fitz.open(ROOT / "source/warsh-muthamman-source.pdf") as source:
            pixmap = source[319].get_pixmap(
                matrix=fitz.Matrix(300 / 72, 300 / 72), alpha=False
            )
        image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
        cls.source = image.crop((60, 55, image.width - 60, image.height - 55))
        with Image.open(PAGE_PATH) as asset:
            cls.asset = on_white(asset)
        cls.source_lines = line_bounds(cls.source)
        cls.asset_lines = line_bounds(cls.asset)

    def test_source_opening_line_is_present_in_the_asset(self):
        expected = line_fingerprint(self.source, self.source_lines[0])
        actual = line_fingerprint(self.asset, self.asset_lines[0])
        similarity = np.dot(expected, actual) / (
            np.linalg.norm(expected) * np.linalg.norm(actual)
        )
        self.assertGreater(
            similarity,
            0.80,
            "Page 320 must retain the source opening line beginning 'إنما تعبدون'.",
        )

    def test_all_source_text_lines_are_present_and_positioned(self):
        self.assertEqual(len(self.source_lines), 15)
        self.assertEqual(
            len(self.asset_lines), 15,
            "Page 320 must retain all 15 source text lines.",
        )
        header_bottom = self.asset.height * 0.005 + self.asset.width * 0.034
        self.assertGreater(self.asset_lines[0][0], header_bottom)
        self.assertLess(self.asset_lines[0][1], self.asset_lines[1][0])
        layout = json.loads(
            (ROOT / "databases/ayahinfo/warsh_muthamman/page_layout_json/page_320.json")
            .read_text(encoding="utf-8")
        )
        self.assertEqual(layout["detectedLineCount"], 15)
        for band, (top, bottom) in zip(layout["lineBands"], self.asset_lines):
            self.assertLessEqual(band["top"], top)
            self.assertGreaterEqual(band["bottom"], bottom)

    def test_page_coordinates_and_download_package_are_synchronized(self):
        info = ROOT / "databases/ayahinfo/warsh_muthamman"
        layout = json.loads((info / "page_layout_json/page_320.json").read_text(encoding="utf-8"))
        page = json.loads((info / "pages_json/page_320.json").read_text(encoding="utf-8"))
        self.assertEqual((layout["imageWidth"], layout["imageHeight"]), self.asset.size)
        self.assertEqual([h["line"] for h in page["ayah_highlights"][:3]], [1, 3, 2])
        self.assertEqual(
            [m["line"] for m in page["ayah_markers"]],
            [3, 4, 6, 7, 8, 10, 11, 13, 15],
        )
        with closing(sqlite3.connect(f"{(info / 'ayahinfo.db').as_uri()}?mode=ro", uri=True)) as db:
            self.assertEqual(
                db.execute("SELECT COUNT(*) FROM page_line_bands WHERE page = 320").fetchone()[0],
                15,
            )
            self.assertEqual(
                db.execute("SELECT line FROM ayah_markers WHERE page = 320 ORDER BY ayah").fetchall(),
                [(3,), (4,), (6,), (7,), (8,), (10,), (11,), (13,), (15,)],
            )
        with zipfile.ZipFile(info / "ayahinfo_muthamman.zip") as archive:
            self.assertEqual(archive.read("ayahinfo.db"), (info / "ayahinfo.db").read_bytes())

        index = json.loads((ROOT / "pages/warsh_muthamman_png_index.json").read_text())
        entry = next(item for item in index["pages"] if item["page"] == 320)
        image_path = ROOT / "pages/warsh_muthamman_png/page320.png"
        self.assertEqual(entry["bytes"], image_path.stat().st_size)
        self.assertEqual(entry["sha256"], hashlib.sha256(image_path.read_bytes()).hexdigest().upper())
        self.assertEqual((entry["width"], entry["height"]), self.asset.size)
        self.assertEqual(index["totalBytes"], sum(item["bytes"] for item in index["pages"]))


if __name__ == "__main__":
    unittest.main()
