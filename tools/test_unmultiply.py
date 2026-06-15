import os
import numpy as np
from PIL import Image

def remove_white_background(img_path):
    img = Image.open(img_path).convert('RGBA')
    data = np.array(img, dtype=np.float32)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    
    # Target background color is around 254 (cream/white)
    # We will use 254.0 as the base for background normalization
    BG_R, BG_G, BG_B = 254.0, 254.0, 254.0
    
    # Calculate alpha: 1.0 - min(R/BG_R, G/BG_G, B/BG_B)
    # Clip normalized ratios to [0, 1] before calculating
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
    
    # For fully transparent pixels, set to black (or original color)
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

def run():
    pages = ['page001.png', 'page024.png']
    
    for page in pages:
        src = os.path.join('pages', 'warsh_muthamma_png', page)
        if not os.path.exists(src):
            print(f'File not found: {src}')
            continue
            
        print(f'Processing {page}...')
        # Generate clean RGBA image
        rgba_clean = remove_white_background(src)
        rgba_path = os.path.join('pages', f'test_rgba_clean_{page}')
        rgba_clean.save(rgba_path, optimize=True)
        print(f'  Saved RGBA clean to: {rgba_path}')
        
        # Quantize to P mode (128 colors) preserving transparency
        # Pillow quantize of RGBA supports transparency automatically
        p_clean = rgba_clean.quantize(colors=128, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG)
        p_path = os.path.join('pages', f'test_p128_clean_{page}')
        p_clean.save(p_path, optimize=True)
        print(f'  Saved P128 clean to: {p_path}')
        
        # Create blue background composite for visual validation
        blue_bg = Image.new('RGBA', rgba_clean.size, (100, 149, 237, 255))
        
        # Composite RGBA
        comp_rgba = Image.alpha_composite(blue_bg, rgba_clean)
        comp_rgba_path = os.path.join('pages', f'test_rgba_blue_bg_{page}')
        comp_rgba.save(comp_rgba_path)
        print(f'  Saved RGBA blue composite to: {comp_rgba_path}')
        
        # Composite P128 (convert to RGBA first to apply transparency)
        p_rgba = p_clean.convert('RGBA')
        comp_p = Image.alpha_composite(blue_bg, p_rgba)
        comp_p_path = os.path.join('pages', f'test_p128_blue_bg_{page}')
        comp_p.save(comp_p_path)
        print(f'  Saved P128 blue composite to: {comp_p_path}')

if __name__ == '__main__':
    run()
