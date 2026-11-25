import os
import json
import openpyxl

base_dir = os.path.dirname(os.path.abspath(__file__))
xlsx_path = os.path.join(base_dir, 'fieldwork_folders_summary_template.xlsx')
index_path = os.path.join(base_dir, 'index.html')

if not os.path.exists(xlsx_path):
    print(f"Error: {xlsx_path} not found!")
    input("Press Enter to exit...")
    exit(1)

print(f"Reading 34 folders summary from Excel: {xlsx_path}...")
try:
    wb = openpyxl.load_workbook(xlsx_path, data_only=True)
    ws = wb["Folders_Summary"]
except Exception as e:
    print(f"Error opening workbook: {e}")
    input("Press Enter to exit...")
    exit(1)

# Columns: Folder_ID, Folder_Name, Total_Photos, Project_Title, Creative_Role, Location, Date_Year, General_Description, Camera_Setup, Production_Unit
folders_by_id = {}
for row in ws.iter_rows(min_row=2, values_only=True):
    if not row or row[0] is None:
        continue
    try:
        f_id = int(row[0])
    except (ValueError, TypeError):
        continue
    
    title = str(row[3] or "").strip()
    role = str(row[4] or "").strip()
    loc = str(row[5] or "").strip()
    date_val = str(row[6] or "").strip()
    desc = str(row[7] or "").strip()
    unit = str(row[8] or "").strip() or str(row[9] or "").strip()
    
    folders_by_id[f_id] = {
        "title": title,
        "role": role,
        "loc": loc,
        "date": date_val,
        "desc": desc,
        "camera": camera,
        "unit": unit
    }

print(f"Parsed {len(folders_by_id)} folder records from Excel.")

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

json_str = html[start_idx + len(start_marker):end_idx].strip()
projects = json.loads(json_str)

for p in projects:
    f_id = p.get("id")
    if f_id in folders_by_id:
        info = folders_by_id[f_id]
        if info["title"]: p["title_en"] = info["title"]
        if info["loc"]: p["location_en"] = info["loc"]
        if info["date"]: p["date_en"] = info["date"]
        if info["desc"]: p["desc_en"] = info["desc"]
        
        total_p = len(p.get("images", []))
        p["specs"] = {
            "role": info["role"] or "Direction, Field Research & Screenplay",
            "date": info["date"],
            "unit": info["unit"] or "Shabdvid Creative Crew & Lighting",
            "format": f"{total_p} High-Resolution Archival Photos & Master Cut"
        }
        
        new_photo_details = []
        for i, img_src in enumerate(p.get("images", [])):
            fn = os.path.basename(img_src)
            frame_title = f"{p['title_en']} — Frame {i+1:02d}"
            frame_desc = f"Archival fieldwork still ({i+1} of {total_p}). {p['desc_en']}"
            new_photo_details.append({
                "num": i + 1,
                "filename": fn,
                "caption": frame_title,
                "desc": frame_desc,
                "loc": p["location_en"]
            })
        p["photo_details"] = new_photo_details

new_json_str = json.dumps(projects, ensure_ascii=False)
new_html = html[:start_idx + len(start_marker)] + "\n" + new_json_str + "\n        " + html[end_idx:]

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(new_html)

print("SUCCESS: index.html has been updated with all 34 folder details!")
