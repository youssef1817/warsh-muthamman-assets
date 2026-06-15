import os
import glob
import time
import json
import hashlib
import numpy as np
from PIL import Image
from concurrent.futures import ProcessPoolExecutor, as_completed

def remove_white_background(img_path):
    img = Image.open(img_path).convert('RGBA')
    data = np.array(img, dtype=np.float32)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    
    # Target background color is around 254 (cream/white)
    # We will use 254.0 as the base for background normalization
    BG_R, BG_G, BG_B = 254.0, 254.0, 254.0
    
    # Calculate alpha: 1.0 - min(R/BG_R, G/BG_G, B/BG_B)
    r_norm = np.clip(r / BG_R, 0.0, 1.0)
    g_norm = np.clip(g / BG_G, 0.0, 1.0)
    b_norm = np.clip(b / BG_B, 0.0, 1.0)
    
    alpha = 1.0 - np.minimum(np.minimum(r_norm, g_norm), b_norm)
    alpha = np.clip(alpha, 0.0, 1.0)
    
    # Create mask for pixels that aren't fully transparent
    mask = alpha > 0.001
    
    new_r = np.zeros_like(r)
    new_g = np.zeros_like(g)
    new_b = np.zeros_like(b)
    
    # Unblend: C_unblended = (C_pixel - (1.0 - alpha) * BG) / alpha
    new_r[mask] = (r[mask] - (1.0 - alpha[mask]) * BG_R) / alpha[mask]
    new_g[mask] = (g[mask] - (1.0 - alpha[mask]) * BG_G) / alpha[mask]
    new_b[mask] = (b[mask] - (1.0 - alpha[mask]) * BG_B) / alpha[mask]
    
    # For fully transparent pixels, set to black
    new_r[~mask] = 0.0
    new_g[~mask] = 0.0
    new_b[~mask] = 0.0
    
    # Clip color channels to [0, 255]
    new_r = np.clip(new_r, 0.0, 255.0)
    new_g = np.clip(new_g, 0.0, 255.0)
    new_b = np.clip(new_b, 0.0, 255.0)
    
    # Reassemble RGBA
    new_data = np.zeros_like(data)
    new_data[:,:,0] = new_r
    new_data[:,:,1] = new_g
    new_data[:,:,2] = new_b
    new_data[:,:,3] = alpha * 255.0
    
    return Image.fromarray(new_data.astype(np.uint8), 'RGBA')

def sha256_file(filepath):
    sha = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while True:
            chunk = f.read(65536)
            if not chunk:
                break
            sha.update(chunk)
    return sha.hexdigest().upper()

def process_single_page(args):
    filepath, src_dir, dest_dir = args
    filename = os.path.basename(filepath)
    
    # Extract page number from filename (e.g. page001.png -> 1)
    page_str = ''.join(c for c in filename if c.isdigit())
    page_num = int(page_str) if page_str else 0
    
    dest_path = os.path.join(dest_dir, filename)
    
    try:
        # 1. Remove background
        rgba_clean = remove_white_background(filepath)
        
        # 2. Quantize to 128 colors (P mode) preserving transparency
        p_clean = rgba_clean.quantize(
            colors=128, 
            method=Image.Quantize.FASTOCTREE, 
            dither=Image.Dither.FLOYDSTEINBERG
        )
        
        # 3. Save quantized image
        p_clean.save(dest_path, optimize=True)
        
        # 4. Gather file statistics
        file_size = os.path.getsize(dest_path)
        sha256_val = sha256_file(dest_path)
        width, height = p_clean.size
        
        # Format paths relative to the pages directory for the index json
        relative_file = os.path.join(os.path.basename(dest_dir), filename)
        
        return {
            'success': True,
            'page': page_num,
            'file': relative_file,
            'bytes': file_size,
            'width': width,
            'height': height,
            'sha256': sha256_val
        }
        
    except Exception as e:
        return {
            'success': False,
            'page': page_num,
            'file': filename,
            'error': str(e)
        }

def run():
    src_dir = r"C:\Users\pc\dev\al-quran\warsh-muthamman-assets\pages\warsh_muthamman_png"
    dest_dir = r"C:\Users\pc\dev\al-quran\warsh-muthamman-assets\pages\warsh_muthamman_png_transparent"
    
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        print(f"Created destination directory: {dest_dir}")
        
    pattern = os.path.join(src_dir, "page*.png")
    files = glob.glob(pattern)
    files.sort()
    
    print(f"Found {len(files)} files to process.")
    
    # Prepare arguments for multiprocessing
    tasks = [(filepath, src_dir, dest_dir) for filepath in files]
    
    results = []
    start_time = time.time()
    
    # Run in parallel using ProcessPoolExecutor
    print(f"Starting processing in parallel using processes...")
    max_workers = os.cpu_count() or 4
    print(f"Using {max_workers} worker processes.")
    
    completed = 0
    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(process_single_page, task): task for task in tasks}
        
        for future in as_completed(futures):
            res = future.result()
            results.append(res)
            completed += 1
            if completed % 50 == 0 or completed == len(files):
                elapsed = time.time() - start_time
                print(f"Progress: {completed}/{len(files)} completed ({elapsed:.1f}s elapsed)")
                
    # Separate successful and failed tasks
    success_pages = [r for r in results if r['success']]
    failed_pages = [r for r in results if not r['success']]
    
    print(f"\nProcessing finished.")
    print(f"Successfully processed: {len(success_pages)}")
    print(f"Failed: {len(failed_pages)}")
    
    if failed_pages:
        print("\nErrors occurred in these files:")
        for fp in failed_pages:
            print(f"  {fp['file']}: {fp['error']}")
            
    # Sort success pages by page number
    success_pages.sort(key=lambda x: x['page'])
    
    # Format pages list (remove the success flag)
    final_pages_list = []
    total_bytes = 0
    for p in success_pages:
        total_bytes += p['bytes']
        final_pages_list.append({
            'page': p['page'],
            'file': p['file'],
            'bytes': p['bytes'],
            'width': p['width'],
            'height': p['height'],
            'sha256': p['sha256']
        })
        
    # Generate index JSON
    index_data = {
        'stage': 'warsh_muthamman_png_transparent',
        'format': 'png',
        'pageCount': len(final_pages_list),
        'totalBytes': total_bytes,
        'generatedAt': time.time(),
        'pages': final_pages_list
    }
    
    index_path = r"C:\Users\pc\dev\al-quran\warsh-muthamman-assets\pages\warsh_muthamman_png_transparent_index.json"
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, indent=2)
        
    print(f"\nIndex JSON written successfully to: {index_path}")
    print(f"Total processed files size: {total_bytes / (1024*1024):.2f} MB")
    print(f"Total time elapsed: {time.time() - start_time:.2f} seconds")

if __name__ == '__main__':
    run()
