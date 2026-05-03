#!/usr/bin/env python3
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV = ROOT / 'DKN_Kosongan - DATA SISWA.csv'
STUDENTS = ROOT / 'public' / 'data' / 'students.json'
OUT = ROOT / 'public' / 'data' / 'students.updated.json'

def extract_nisn_list(csv_path):
    nisn_list = []
    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            # data rows look like: ['', '1', 'XII. A', '11884', '2526.12.001', 'Name', 'L', '0077791126', ...]
            if len(row) >= 8:
                # require a numeric row index and a plausible NIPD (col 3) to skip header numbering rows
                if not row[1].strip().isdigit():
                    continue
                if len(row[3].strip()) < 4:
                    continue
                nisn = row[7].strip()
                nisn_list.append(nisn)
    return nisn_list

def main():
    nisn_list = extract_nisn_list(CSV)
    data = json.loads(STUDENTS.read_text(encoding='utf-8'))
    students = data.get('students', [])
    updated = 0
    for i, s in enumerate(students):
        if i < len(nisn_list) and nisn_list[i] != '':
            s['nis'] = nisn_list[i]
            updated += 1
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Updated {updated} / {len(students)} students; wrote {OUT}')

if __name__ == '__main__':
    main()
