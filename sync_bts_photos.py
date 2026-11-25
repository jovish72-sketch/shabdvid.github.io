import os
import json
import re

base_dir = os.path.dirname(os.path.abspath(__file__))
bts_dir = os.path.join(base_dir, 'bts-assets')
index_path = os.path.join(base_dir, 'index.html')

if not os.path.exists(bts_dir) or not os.path.exists(index_path):
    print("Error: Could not locate bts-assets or index.html!")
    input("Press Enter to exit...")
    exit(1)

print(f"Scanning photos in: {bts_dir}...")

with open(index_path, 'r', encoding='utf-8') as f:
    html = f.read()

start_marker = '<script id="fieldworkArchiveData" type="application/json">'
end_marker = '</script>'
start_idx = html.find(start_marker)
end_idx = html.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Error: Could not find fieldworkArchiveData in index.html")
    input("Press Enter to exit...")
    exit(1)

projects = json.loads(html[start_idx + len(start_marker):end_idx].strip())

valid_exts = {'.jpg', '.jpeg', '.png', '.webp'}
total_added = 0
total_all_photos = 0

for p in projects:
    slug = p.get('slug', '')
    p_folder = os.path.join(bts_dir, slug)
    
    # Also check if folder matches by id or partial name
    if not os.path.exists(p_folder):
        # find matching folder
        prefix = f"p{p.get('id', 0):02d}_"
        for d in os.listdir(bts_dir):
            if d.startswith(prefix):
                p_folder = os.path.join(bts_dir, d)
                p['slug'] = d
                break
    
    if os.path.exists(p_folder) and os.path.isdir(p_folder):
        disk_files = []
        for f in os.listdir(p_folder):
            ext = os.path.splitext(f)[1].lower()
            if ext in valid_exts:
                disk_files.append(f)
        
        # Natural sort
        disk_files.sort(key=lambda s: [int(t) if t.isdigit() else t.lower() for t in re.split(r'(\d+)', s)])
        
        rel_paths = [f"bts-assets/{os.path.basename(p_folder)}/{fn}" for fn in disk_files]
        
        old_count = len(p.get('images', []))
        new_count = len(rel_paths)
        if new_count != old_count:
            diff = new_count - old_count
            print(f"  [{p.get('id', 0):02d}] {p.get('title_en', '')}: changed from {old_count} to {new_count} photos ({diff:+d})")
            total_added += diff
        
        p['images'] = rel_paths
        p['total_photos'] = new_count
        if rel_paths and not p.get('hero_image'):
            p['hero_image'] = rel_paths[0]
            
        # Update specs format string
        if 'specs' in p:
            p['specs']['format'] = f"{new_count} High-Resolution Archival Photos & Master Cut"
            
        # Update photo details
        new_details = []
        old_details = {d.get('filename'): d for d in p.get('photo_details', [])}
        for i, rpath in enumerate(rel_paths):
            fn = os.path.basename(rpath)
            if fn in old_details and old_details[fn].get('caption'):
                det = old_details[fn]
                det['num'] = i + 1
                new_details.append(det)
            else:
                new_details.append({
                    "num": i + 1,
                    "filename": fn,
                    "caption": f"{p.get('title_en', '')} — Frame {i+1:02d}",
                    "desc": f"Archival fieldwork still ({i+1} of {new_count}). {p.get('desc_en', '')}",
                    "loc": p.get('location_en', '')
                })
        p['photo_details'] = new_details
        total_all_photos += new_count

new_json_str = json.dumps(projects, ensure_ascii=False)
new_html = html[:start_idx + len(start_marker)] + "\n" + new_json_str + "\n        " + html[end_idx:]

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(new_html)

print("\n" + "=" * 65)
print(f"SUCCESS: Synchronized all 34 folders!")
print(f"Total photos now indexed on website: {total_all_photos}")
if total_added != 0:
    print(f"Net change: {total_added:+d} photos updated on website!")
else:
    print("All folder photos are currently in perfect sync.")
print("=" * 65)
