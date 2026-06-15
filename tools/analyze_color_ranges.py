import os
import glob
from PIL import Image
from collections import defaultdict

def analyze():
    folder = r"C:\Users\pc\dev\al-quran\warsh-muthamma-assets\pages\warsh_muthamma_png"
    pattern = os.path.join(folder, "page*.png")
    files = glob.glob(pattern)
    files.sort()
    
    print(f"Found {len(files)} files to analyze.")
    
    # Global color map: color (R, G, B) -> count
    global_colors = defaultdict(int)
    
    # We will analyze all files. Pillow's getcolors makes this very fast.
    for i, filepath in enumerate(files):
        if (i + 1) % 50 == 0 or i == 0 or i == len(files) - 1:
            print(f"Processing file {i+1}/{len(files)}: {os.path.basename(filepath)}")
        try:
            img = Image.open(filepath).convert('RGB')
            colors = img.getcolors(maxcolors=1000000)
            if colors:
                for count, rgb in colors:
                    global_colors[rgb] += count
        except Exception as e:
            print(f"Error reading {filepath}: {e}")
                
    print(f"Analysis complete. Total unique colors found across all pages: {len(global_colors)}")
    
    # Categorize colors
    categories = {
        'Background (Cream/White)': [],
        'Neutral Grays/Text (max-min <= 25)': [],
        'Red Marks & Transitions (R-G > 25, R-B > 25)': [],
        'Green Marks & Transitions (G-R > 15, G-B > 15)': [],
        'Blue Marks & Transitions': [],
        'Other Saturated Colors': []
    }
    
    for rgb, count in global_colors.items():
        r, g, b = rgb
        diff_max_min = max(r, g, b) - min(r, g, b)
        
        # 1. Background check
        if r >= 200 and g >= 200 and b >= 180 and diff_max_min <= 25:
            categories['Background (Cream/White)'].append((rgb, count))
        # 2. Red check
        elif r > g + 25 and r > b + 25:
            categories['Red Marks & Transitions (R-G > 25, R-B > 25)'].append((rgb, count))
        # 3. Green check
        elif g > r + 15 and g > b + 15:
            categories['Green Marks & Transitions (G-R > 15, G-B > 15)'].append((rgb, count))
        # 4. Blue check
        elif b > r + 25 and b > g + 25:
            categories['Blue Marks & Transitions'].append((rgb, count))
        # 5. Neutral check (including black text and transitions)
        elif diff_max_min <= 25:
            categories['Neutral Grays/Text (max-min <= 25)'].append((rgb, count))
        # 6. Saturated others
        else:
            categories['Other Saturated Colors'].append((rgb, count))
            
    # Calculate total pixels in all categories to compute percentage
    grand_total_pixels = sum(global_colors.values())
    print(f"Grand Total Pixels Analyzed: {grand_total_pixels}")
    
    # Report results in markdown format
    report_lines = []
    report_lines.append("# Quran Pages Color Range Analysis Report")
    report_lines.append(f"Analyzed {len(files)} pages from `warsh_muthamma_png`.")
    report_lines.append(f"Total Unique Colors: **{len(global_colors)}**")
    report_lines.append(f"Total Pixels: **{grand_total_pixels}**\n")
    
    report_lines.append("| Category | Unique Colors | Total Pixels | Pixels % | R Range | G Range | B Range |")
    report_lines.append("| --- | --- | --- | --- | --- | --- | --- |")
    
    for cat_name, items in categories.items():
        if not items:
            report_lines.append(f"| {cat_name} | 0 | 0 | 0.00% | - | - | - |")
            continue
            
        total_pixels = sum(count for rgb, count in items)
        unique_colors_count = len(items)
        percentage = (total_pixels / grand_total_pixels) * 100
        
        rs = [rgb[0] for rgb, count in items]
        gs = [rgb[1] for rgb, count in items]
        bs = [rgb[2] for rgb, count in items]
        
        report_lines.append(
            f"| {cat_name} | {unique_colors_count} | {total_pixels:,} | {percentage:.4f}% | "
            f"[{min(rs)} - {max(rs)}] | [{min(gs)} - {max(gs)}] | [{min(bs)} - {max(bs)}] |"
        )
        
    report_lines.append("\n## Detailed Breakdown of Categories (Top Colors by Pixel Count)\n")
    
    for cat_name, items in categories.items():
        if not items:
            continue
        report_lines.append(f"### {cat_name}")
        report_lines.append(f"- **Unique Colors count**: {len(items)}")
        report_lines.append(f"- **Total Pixels**: {sum(count for rgb, count in items):,}")
        report_lines.append("\n| Rank | Color (R, G, B) | Hex Code | Pixel Count | % in Category | % of Total |")
        report_lines.append("| --- | --- | --- | --- | --- | --- |")
        
        # Sort by pixel count descending
        items.sort(key=lambda x: x[1], reverse=True)
        cat_total = sum(count for rgb, count in items)
        
        for rank, (rgb, count) in enumerate(items[:20], 1):
            hex_code = f"#{rgb[0]:02X}{rgb[1]:02X}{rgb[2]:02X}"
            pct_cat = (count / cat_total) * 100
            pct_tot = (count / grand_total_pixels) * 100
            report_lines.append(
                f"| {rank} | {rgb} | `{hex_code}` | {count:,} | {pct_cat:.2f}% | {pct_tot:.4f}% |"
            )
        report_lines.append("")
        
    # Write report to markdown file
    report_content = "\n".join(report_lines)
    report_path = r"C:\Users\pc\dev\al-quran\warsh-muthamma-assets\tools\color_analysis_report.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report_content)
        
    print(f"Report written successfully to: {report_path}")

if __name__ == '__main__':
    analyze()
