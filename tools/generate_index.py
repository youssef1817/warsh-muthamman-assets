import os
import glob
import json
import hashlib
import time
from PIL import Image

def sha256_file(filepath):
    sha = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while True:
            chunk = f.read(65536)
            if not chunk:
                break
            sha.update(chunk)
    return sha.hexdigest().upper()

def run():
    src_dir = r"C:\Users\pc\dev\al-quran\warsh-muthamman-assets\pages\warsh_muthamman_png"
    index_path = r"C:\Users\pc\dev\al-quran\warsh-muthamman-assets\pages\warsh_muthamman_png_index.json"
    
    if not os.path.exists(src_dir):
        print(f"Error: Directory not found: {src_dir}")
        return
        
    pattern = os.path.join(src_dir, "page*.png")
    files = glob.glob(pattern)
    files.sort()
    
    print(f"Found {len(files)} files to index.")
    
    pages_list = []
    total_bytes = 0
    start_time = time.time()
    
    for i, filepath in enumerate(files):
        filename = os.path.basename(filepath)
        page_str = ''.join(c for c in filename if c.isdigit())
        page_num = int(page_str) if page_str else 0
        
        file_size = os.path.getsize(filepath)
        total_bytes += file_size
        sha256_val = sha256_file(filepath)
        
        try:
            with Image.open(filepath) as img:
                width, height = img.size
        except Exception as e:
            print(f"Error reading image dimensions for {filename}: {e}")
            width, height = 1188, 1929  # fallback
            
        relative_file = os.path.join("warsh_muthamman_png", filename)
        
        pages_list.append({
            'page': page_num,
            'file': relative_file,
            'bytes': file_size,
            'width': width,
            'height': height,
            'sha256': sha256_val
        })
        
        if (i + 1) % 50 == 0 or i == len(files) - 1:
            print(f"Indexed {i+1}/{len(files)} files...")
            
    index_data = {
        'stage': 'warsh_muthamman_png',
        'format': 'png',
        'pageCount': len(pages_list),
        'totalBytes': total_bytes,
        'generatedAt': time.time(),
        'pages': pages_list
    }
    
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, indent=2)
        
    print(f"\nIndex JSON generated and written to: {index_path}")
    print(f"Total Bytes: {total_bytes:,} ({total_bytes / (1024*1024):.2f} MB)")
    print(f"Time elapsed: {time.time() - start_time:.2f} seconds")

if __name__ == '__main__':
    run()
