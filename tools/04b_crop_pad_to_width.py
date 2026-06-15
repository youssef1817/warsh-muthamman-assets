from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import shutil
from concurrent.futures import ProcessPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image


DEFAULT_WORKERS = 6
DEFAULT_TARGET_WIDTH = 1188
DEFAULT_TARGET_HEIGHT = 1929


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def process_batch(
    batch_index: int,
    page_numbers: list[int],
    input_dir: str,
    output_dir: str,
    target_width: int,
    target_height: int,
) -> dict[str, object]:
    input_root = Path(input_dir)
    output_root = Path(output_dir)
    batch_entries: list[dict[str, object]] = []

    for page_number in page_numbers:
        input_path = input_root / f"page{page_number:03d}.png"
        if not input_path.exists():
            raise FileNotFoundError(input_path)

        output_path = output_root / input_path.name
        with Image.open(input_path) as image:
            orig_w, orig_h = image.size
            
            # Ensure height is target_height first (should be already)
            if orig_h != target_height:
                scale = target_height / orig_h
                temp_w = int(round(orig_w * scale))
                # Resize height to target_height preserving aspect ratio
                try:
                    resample_method = Image.Resampling.LANCZOS
                except AttributeError:
                    resample_method = Image.LANCZOS
                image = image.resize((temp_w, target_height), resample=resample_method)
                orig_w, orig_h = image.size

            # Adjust width
            if orig_w == target_width:
                result_image = image
            elif orig_w > target_width:
                # Center crop
                left = (orig_w - target_width) // 2
                right = left + target_width
                result_image = image.crop((left, 0, right, target_height))
            else:
                # Center pad with white
                if image.mode == 'P':
                    # Convert to RGB, pad with white, then quantize back to 128 colors to save space
                    rgb_img = image.convert("RGB")
                    new_img = Image.new("RGB", (target_width, target_height), (255, 255, 255))
                    left = (target_width - orig_w) // 2
                    new_img.paste(rgb_img, (left, 0))
                    result_image = new_img.quantize(
                        colors=128,
                        method=Image.Quantize.MEDIANCUT,
                        dither=Image.Dither.FLOYDSTEINBERG,
                    )
                else:
                    new_img = Image.new(
                        image.mode,
                        (target_width, target_height),
                        (255, 255, 255) if image.mode == "RGB" else 255
                    )
                    left = (target_width - orig_w) // 2
                    new_img.paste(image, (left, 0))
                    result_image = new_img

            # Save the final image
            result_image.save(output_path, optimize=True)
            output_bytes = output_path.stat().st_size
            original_bytes = input_path.stat().st_size

        delta_bytes = output_bytes - original_bytes
        delta_percent = round(delta_bytes * 100.0 / original_bytes, 2)
        batch_entries.append(
            {
                "page": input_path.name,
                "originalBytes": original_bytes,
                "outputBytes": output_bytes,
                "deltaBytes": delta_bytes,
                "deltaPercent": delta_percent,
                "originalSize": [orig_w, orig_h],
                "newSize": [target_width, target_height],
                "action": "crop" if orig_w > target_width else ("pad" if orig_w < target_width else "none"),
            }
        )

    total_original = sum(int(entry["originalBytes"]) for entry in batch_entries)
    total_output = sum(int(entry["outputBytes"]) for entry in batch_entries)
    return {
        "batchIndex": batch_index,
        "pages": page_numbers,
        "entries": batch_entries,
        "totals": {
            "originalBytes": total_original,
            "outputBytes": total_output,
            "deltaBytes": total_output - total_original,
            "deltaPercent": round((total_output - total_original) * 100.0 / total_original, 2),
            "count": len(batch_entries),
        },
    }


def split_into_batches(page_numbers: list[int], workers: int) -> list[list[int]]:
    if workers < 1:
        raise ValueError("workers must be at least 1")
    if not page_numbers:
        return []
    batch_size = math.ceil(len(page_numbers) / workers)
    return [page_numbers[i : i + batch_size] for i in range(0, len(page_numbers), batch_size)]


def build_index(output_dir: Path, index_path: Path, page_numbers: list[int]) -> dict[str, object]:
    pages: list[dict[str, object]] = []
    for page_number in page_numbers:
        file_path = output_dir / f"page{page_number:03d}.png"
        with Image.open(file_path) as image:
            width, height = image.size
        pages.append(
            {
                "page": page_number,
                "file": str(file_path.relative_to(output_dir.parent)),
                "bytes": file_path.stat().st_size,
                "width": width,
                "height": height,
                "sha256": sha256_file(file_path),
            }
        )
    total_bytes = sum(int(page["bytes"]) for page in pages)
    index = {
        "stage": "warsh_muthamman_png_1188x1929",
        "format": "png",
        "pageCount": len(pages),
        "totalBytes": total_bytes,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "pages": pages,
    }
    index_path.write_text(
        json.dumps(index, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return index


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Adjust page widths to a uniform size using center cropping or white padding."
    )
    parser.add_argument("--input-dir", default="pages/warsh_muthamman_png_height1929")
    parser.add_argument("--output-dir", default="pages/warsh_muthamman_png_final1188")
    parser.add_argument("--index", default="pages/warsh_muthamman_png_final1188_index.json")
    parser.add_argument("--target-width", type=int, default=DEFAULT_TARGET_WIDTH)
    parser.add_argument("--target-height", type=int, default=DEFAULT_TARGET_HEIGHT)
    parser.add_argument("--workers", type=int, default=DEFAULT_WORKERS)
    parser.add_argument("--clean-output", action="store_true", default=True)
    parser.add_argument("--keep-output", action="store_false", dest="clean_output")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    input_dir = (repo_root / args.input_dir).resolve()
    output_dir = (repo_root / args.output_dir).resolve()
    index_path = (repo_root / args.index).resolve()

    if not input_dir.exists():
        raise FileNotFoundError(input_dir)

    if args.clean_output and output_dir.exists():
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    page_numbers = [
        int(path.stem.replace("page", ""))
        for path in sorted(input_dir.glob("page*.png"))
    ]
    if not page_numbers:
        raise FileNotFoundError(f"No page PNG files found in {input_dir}")

    batches = split_into_batches(page_numbers, args.workers)
    report_batches: list[dict[str, object]] = []
    futures = []

    print(f"input: {input_dir}")
    print(f"output: {output_dir}")
    print(f"pages: {len(page_numbers)}")
    print(f"target width: {args.target_width}")
    print(f"target height: {args.target_height}")
    print(f"workers: {args.workers}")

    with ProcessPoolExecutor(max_workers=args.workers) as executor:
        for batch_index, batch_pages in enumerate(batches, start=1):
            futures.append(
                executor.submit(
                    process_batch,
                    batch_index,
                    batch_pages,
                    str(input_dir),
                    str(output_dir),
                    args.target_width,
                    args.target_height,
                )
            )

        for future in as_completed(futures):
            batch_report = future.result()
            report_batches.append(batch_report)
            totals = batch_report["totals"]
            first_page = batch_report["pages"][0]
            last_page = batch_report["pages"][-1]
            print(
                f"batch {batch_report['batchIndex']}: page{first_page:03d}-page{last_page:03d} "
                f"processed {totals['count']} pages."
            )

    report_batches.sort(key=lambda item: int(item["batchIndex"]))
    entries = [entry for batch in report_batches for entry in batch["entries"]]
    total_original = sum(int(entry["originalBytes"]) for entry in entries)
    total_output = sum(int(entry["outputBytes"]) for entry in entries)

    report = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "profile": f"crop_pad_to_{args.target_width}x{args.target_height}",
        "sourceDir": str(input_dir),
        "outputDir": str(output_dir),
        "workers": args.workers,
        "batches": report_batches,
        "entries": entries,
        "totals": {
            "originalBytes": total_original,
            "outputBytes": total_output,
            "deltaBytes": total_output - total_original,
            "deltaPercent": round((total_output - total_original) * 100.0 / total_original, 2),
            "count": len(entries),
        },
    }

    report_path = output_dir / "crop_pad_report.json"
    report_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"wrote {report_path}")

    index = build_index(output_dir=output_dir, index_path=index_path, page_numbers=page_numbers)
    print(f"wrote {index_path}")
    print(f"Total output size: {index['totalBytes']} bytes")


if __name__ == "__main__":
    if os.name == "nt":
        import multiprocessing

        multiprocessing.freeze_support()
    main()
