import os
import json
import openpyxl

base_dir = os.path.dirname(os.path.abspath(__file__))
xlsx_path = os.path.join(base_dir, 'fieldwork_photos_details_template.xlsx')
index_path = os.path.join(base_dir, 'index.html')

if not os.path.exists(xlsx_path):
    print(f"Error: {xlsx_path} not found!")
    input("Press Enter to exit...")
    exit(1)

print(f"Reading Excel: {xlsx_path}...")
try:
    wb = openpyxl.load_workbook(xlsx_path, data_only=True)
    ws = wb["Photo_Details"]
except Exception as e:
    print(f"Error opening workbook: {e}")
    input("Press Enter to exit...")
    exit(1)

rows_by_folder = {}
for row in ws.iter_rows(min_row=2, values_only=True):
    if not row or row[0] is None:
        continue
    try:
        folder_id = int(row[0])
    except (ValueError, TypeError):
        continue
    
    photo_num = int(row[3]) if row[3] is not None else 1
    filename = str(row[4] or "")
    caption = str(row[5] or "").strip()
    desc = str(row[6] or "").strip()
    loc = str(row[7] or "").strip()
    
    if folder_id not in rows_by_folder:
        rows_by_folder[folder_id] = []
    
    rows_by_folder[folder_id].append({
        "num": photo_num,
        "filename": filename,
        "caption": caption,
        "desc": desc,
        "loc": loc
    })

print(f"Parsed details for {len(rows_by_folder)} folders.")

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

for proj in projects:
    f_id = proj.get("id")
    if f_id in rows_by_folder:
        proj["photo_details"] = rows_by_folder[f_id]

new_json_str = json.dumps(projects, ensure_ascii=False)
new_html = html[:start_idx + len(start_marker)] + "\n" + new_json_str + "\n        " + html[end_idx:]

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(new_html)

print("SUCCESS: index.html has been updated with your latest photo details!")
