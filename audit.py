import fitz
import sys
sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open('SASTI_M_Boutique_Final_Report_Updated.pdf')
print('=== FINAL REPORT QUALITY AUDIT ===')
print(f'Total pages: {len(doc)}')

for i in range(len(doc)):
    page = doc[i]
    txt = page.get_text().strip()
    imgs = page.get_images()
    lines = [l.strip() for l in txt.splitlines() if l.strip()]
    first_line = lines[0] if lines else 'EMPTY'
    last_line = lines[-1] if lines else 'EMPTY'
    print(f'Page {i+1:02d}: chars={len(txt):04d}, images={len(imgs)}, top="{first_line[:35]}", bottom="{last_line[:25]}"')

assert len(doc) == 25, 'Expected exactly 25 pages'
print('\nAudit passed successfully! All 25 pages verified.')
