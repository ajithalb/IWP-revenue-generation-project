import sys
import fitz

sys.stdout.reconfigure(encoding='utf-8')
doc = fitz.open('C:/Users/AJITHA/Downloads/sasti boutique finalllllllllll reporttttttt.pdf')
p = doc[20] # Page 21
for block in p.get_text('dict')['blocks']:
    if 'lines' in block:
        for line in block['lines']:
            for span in line['spans']:
                txt = span['text'].strip()
                if txt:
                    print(f"{span['font']} | {span['size']:.1f}pt | #{span['color']:06x} | {txt[:50]}")
