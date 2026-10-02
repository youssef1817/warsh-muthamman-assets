"""Restore the omitted first line of page 156 without resampling its other lines.

Run from the assets repository: python -B tools/repair_page156_from_source.py
This updates only page 156, its coordinates, the download index and DB archive.
It does not publish assets or copy them into an installed application.
"""

from contextlib import closing
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import sqlite3
import tempfile
import zipfile

import fitz
import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
INFO = ROOT / "databases/ayahinfo/warsh_muthamman"


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def rgba_palette(image):
    palette = np.array(image.getpalette("RGBA"), dtype=np.uint8).reshape(-1, 4)
    transparency = image.info.get("transparency")
    if isinstance(transparency, bytes):
        palette[:len(transparency), 3] = list(transparency)
    elif isinstance(transparency, int):
        palette[transparency, 3] = 0
    return palette


def restore_opening(image_path):
    with Image.open(image_path) as original:
        original.load()
        if original.mode != "P" or original.size != (1188, 1929):
            raise ValueError("Expected the original indexed 1188x1929 page 156.")
        with fitz.open(ROOT / "source/warsh-muthamman-source.pdf") as source:
            page = source[155]
            embedded = source.extract_image(page.get_images(full=True)[0][0])
            # Upsample the original embedded JPEG smoothly, rather than enlarge
            # MuPDF's non-interpolated raster. Include the complete first line.
            with Image.open(io.BytesIO(embedded["image"])) as native:
                scale = 300 / 72
                full = native.convert("RGB").resize(
                    (round(page.rect.width * scale), round(page.rect.height * scale)),
                    Image.Resampling.LANCZOS,
                )
            opening = full.crop((60, 65, full.width - 60, 160))
            opening = opening.resize(
                (1120, round(opening.height * 1120 / opening.width)),
                Image.Resampling.LANCZOS,
            )
            # Trim the trailing blank pixels so the patch ends before the
            # existing second line. Leave room above it for the app header.
            opening = opening.crop((0, 0, 1120, 84))

        # Use the existing transparency recipe only on the restored line.
        spec = importlib.util.spec_from_file_location(
            "unmultiply", ROOT / "tools/08b_unmultiply_all_pages.py"
        )
        unmultiply = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(unmultiply)
        with tempfile.TemporaryDirectory(prefix="quran-page156-opening-") as temp:
            opening_path = Path(temp) / "opening.png"
            opening.save(opening_path)
            patch = unmultiply.remove_white_background(opening_path).quantize(
                colors=128, method=Image.Quantize.FASTOCTREE,
                dither=Image.Dither.FLOYDSTEINBERG,
            )

        # Preserve every existing pixel and palette entry in the other 14 lines.
        old_palette = rgba_palette(original)
        new_palette = rgba_palette(patch)
        if len(old_palette) + len(new_palette) > 256:
            raise ValueError("The lossless combined palette exceeds 256 colors.")
        pixels = np.array(original, copy=True)
        pixels[47:47 + patch.height, 30:1150] = (
            np.asarray(patch, dtype=np.uint16) + len(old_palette)
        ).astype(np.uint8)
        repaired = Image.fromarray(pixels)
        repaired.putpalette(np.vstack((old_palette, new_palette)).ravel().tolist(), rawmode="RGBA")
        if repaired.convert("RGBA").crop((0, 133, 1188, 1929)).tobytes() != (
            original.convert("RGBA").crop((0, 133, 1188, 1929)).tobytes()
        ):
            raise ValueError("Repair unexpectedly modified an existing text line.")
        repaired.save(image_path, optimize=True)


def update_coordinates():
    page_path = INFO / "pages_json/page_156.json"
    layout_path = INFO / "page_layout_json/page_156.json"
    page = read_json(page_path)
    layout = read_json(layout_path)
    scale = 1929 / layout["imageHeight"]
    bands = [
        {"line": b["line"] + 1, **{key: round(b[key] * scale) for key in ("top", "bottom", "center")}}
        for b in layout["lineBands"]
    ]
    bands[0]["top"] = 133
    bands.insert(0, {"line": 1, "top": 52, "bottom": 133, "center": 92})
    layout.update(
        imageWidth=1188, imageHeight=1929, detectedLineCount=15, lineBands=bands,
        textRegion={"top": 52, "bottom": bands[-1]["bottom"], "left": 30, "right": 1150},
    )
    for key in ("ayah_highlights", "ayah_markers"):
        for item in page[key]:
            item["line"] += 1
    page["ayah_highlights"].insert(0, {
        "page": 156, "line": 1, "sura": 9, "ayah": 40,
        "left": 0.03, "right": 0.97, "confidence": 1.0, "source": "source_pdf_restored",
    })
    write_json(page_path, page)
    write_json(layout_path, layout)

    # Keep every other page's database rows untouched.
    with closing(sqlite3.connect(INFO / "ayahinfo.db")) as db, db:
        db.execute("UPDATE ayah_highlights SET line = line + 1 WHERE page = 156")
        db.execute("UPDATE ayah_markers SET line = line + 1 WHERE page = 156")
        db.execute(
            'INSERT INTO ayah_highlights (page,line,sura,ayah,"left","right",confidence,source) '
            "VALUES (156,1,9,40,0.03,0.97,1.0,'source_pdf_restored')"
        )
        db.execute("DELETE FROM page_line_bands WHERE page = 156")
        db.executemany(
            "INSERT INTO page_line_bands (page,line,top,bottom,center) VALUES (156,?,?,?,?)",
            [(b["line"], *(round(b[k] / 1929, 4) for k in ("top", "bottom", "center"))) for b in bands],
        )
    with zipfile.ZipFile(INFO / "ayahinfo_muthamman.zip", "w", zipfile.ZIP_DEFLATED) as archive:
        archive.write(INFO / "ayahinfo.db", "ayahinfo.db")


def main():
    layout = read_json(INFO / "page_layout_json/page_156.json")
    if layout["detectedLineCount"] == 15:
        print("Page 156 already has the restored line; no files changed.")
        return
    if layout["detectedLineCount"] != 14:
        raise ValueError("Expected the known 14-line page 156 before applying this repair.")
    image_path = ROOT / "pages/warsh_muthamman_png/page156.png"
    restore_opening(image_path)
    update_coordinates()
    index_path = ROOT / "pages/warsh_muthamman_png_index.json"
    index = read_json(index_path)
    entry = next(page for page in index["pages"] if page["page"] == 156)
    entry.update(bytes=image_path.stat().st_size,
                 sha256=hashlib.sha256(image_path.read_bytes()).hexdigest().upper())
    index["totalBytes"] = sum(page["bytes"] for page in index["pages"])
    write_json(index_path, index)
    manifest_path = ROOT / "manifest.json"
    manifest = read_json(manifest_path)
    manifest["pages"]["totalBytes"] = index["totalBytes"]
    manifest["pages"]["status"] = "indexed_optimized"
    write_json(manifest_path, manifest)
    print("Restored the opening of 9:40 on page 156 and synchronized its coordinates and archive.")


if __name__ == "__main__":
    main()
