"""Rebuild page 320 from its source PDF and synchronize its metadata."""

from contextlib import closing
import hashlib
import importlib.util
import json
from pathlib import Path
import sqlite3
import tempfile
import zipfile

import fitz
import numpy as np
from PIL import Image

from repair_page156_from_source import apply_approved_visual_enhancements


ROOT = Path(__file__).resolve().parents[1]
INFO = ROOT / "databases/ayahinfo/warsh_muthamman"
PAGE_PATH = ROOT / "pages/warsh_muthamman_png/page320.png"
WIDTH, HEIGHT = 1188, 1929


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def make_page():
    with fitz.open(ROOT / "source/warsh-muthamman-source.pdf") as source:
        page = source[319]
        pixmap = page.get_pixmap(matrix=fitz.Matrix(300 / 72, 300 / 72), alpha=False)
    rendered = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
    body = rendered.crop((60, 55, rendered.width - 60, rendered.height - 55))
    scale = min(1120 / body.width, 1740 / body.height)
    body = body.resize((round(body.width * scale), round(body.height * scale)), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (WIDTH, HEIGHT), "white")
    canvas.paste(body, ((WIDTH - body.width) // 2, 90))
    enhanced = apply_approved_visual_enhancements(canvas)

    spec = importlib.util.spec_from_file_location("unmultiply", ROOT / "tools/08b_unmultiply_all_pages.py")
    unmultiply = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(unmultiply)
    with tempfile.TemporaryDirectory(prefix="quran-page320-") as temp:
        intermediate = Path(temp) / "enhanced.png"
        enhanced.save(intermediate)
        output = unmultiply.remove_white_background(intermediate).quantize(
            colors=128, method=Image.Quantize.FASTOCTREE,
            dither=Image.Dither.FLOYDSTEINBERG,
        )
    return output


def detected_bands(image):
    rgba = image.convert("RGBA")
    canvas = Image.new("RGBA", image.size, "white")
    canvas.alpha_composite(rgba)
    pixels = np.asarray(canvas.convert("L"))[:, 40:-40]
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


def update_metadata(bands):
    page_path = INFO / "pages_json/page_320.json"
    layout_path = INFO / "page_layout_json/page_320.json"
    page = read_json(page_path)
    layout = read_json(layout_path)

    # The restored row is the new first row; all existing ayah rows move down.
    for key in ("ayah_highlights", "ayah_markers"):
        for item in page[key]:
            item["line"] += 1
    page["ayah_highlights"].insert(0, {
        "page": 320, "line": 1, "sura": 29, "ayah": 17,
        "left": 0.03, "right": 0.97, "confidence": 1.0,
        "source": "source_pdf_restored",
    })

    detailed = [
        {"line": number, "top": top, "bottom": bottom, "center": round((top + bottom) / 2)}
        for number, (top, bottom) in enumerate(bands, 1)
    ]
    layout.update(
        imageWidth=WIDTH, imageHeight=HEIGHT, detectedLineCount=len(bands),
        lineBands=detailed,
        textRegion={"top": bands[0][0], "bottom": bands[-1][1], "left": 30, "right": WIDTH - 30},
        confidence=1.0, manualOverride=True, method="source_pdf_restored",
    )
    write_json(page_path, page)
    write_json(layout_path, layout)

    with closing(sqlite3.connect(INFO / "ayahinfo.db")) as db, db:
        db.execute("UPDATE ayah_highlights SET line = line + 1 WHERE page = 320")
        db.execute("UPDATE ayah_markers SET line = line + 1 WHERE page = 320")
        db.execute(
            'INSERT INTO ayah_highlights (page,line,sura,ayah,"left","right",confidence,source) '
            "VALUES (320,1,29,17,0.03,0.97,1.0,'source_pdf_restored')"
        )
        db.execute("DELETE FROM page_line_bands WHERE page = 320")
        db.executemany(
            "INSERT INTO page_line_bands (page,line,top,bottom,center) VALUES (320,?,?,?,?)",
            [(band["line"], *(round(band[key] / HEIGHT, 4) for key in ("top", "bottom", "center"))) for band in detailed],
        )
    with zipfile.ZipFile(INFO / "ayahinfo_muthamman.zip", "w", zipfile.ZIP_DEFLATED) as archive:
        archive.write(INFO / "ayahinfo.db", "ayahinfo.db")


def main():
    layout = read_json(INFO / "page_layout_json/page_320.json")
    metadata = read_json(INFO / "pages_json/page_320.json")
    if any(
        highlight.get("source") == "source_pdf_restored" and highlight.get("line") == 1
        for highlight in metadata["ayah_highlights"]
    ):
        print("Page 320 already has the restored opening line; no files changed.")
        return
    if layout["detectedLineCount"] != 15:
        raise ValueError("Expected the original page 320 metadata before rebuilding it.")
    image = make_page()
    bands = detected_bands(image)
    if len(bands) != 15:
        raise ValueError(f"Expected 15 source text lines in rebuilt page, found {len(bands)}.")
    image.save(PAGE_PATH, optimize=True)
    update_metadata(bands)

    index_path = ROOT / "pages/warsh_muthamman_png_index.json"
    index = read_json(index_path)
    entry = next(item for item in index["pages"] if item["page"] == 320)
    entry.update(
        bytes=PAGE_PATH.stat().st_size,
        sha256=hashlib.sha256(PAGE_PATH.read_bytes()).hexdigest().upper(),
        width=WIDTH, height=HEIGHT,
    )
    index["totalBytes"] = sum(item["bytes"] for item in index["pages"])
    write_json(index_path, index)
    manifest_path = ROOT / "manifest.json"
    manifest = read_json(manifest_path)
    manifest["pages"]["totalBytes"] = index["totalBytes"]
    manifest["pages"]["status"] = "indexed_optimized"
    write_json(manifest_path, manifest)
    print(f"Rebuilt page 320 with {len(bands)} complete source lines.")


if __name__ == "__main__":
    main()
