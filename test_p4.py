import fitz

def test_p4_update():
    doc = fitz.open('C:/Users/AJITHA/Downloads/sasti boutique finalllllllllll reporttttttt.pdf')
    p4 = doc[3] # Page 4
    
    # Register TrueType fonts
    p4.insert_font(fontname="TNR", fontfile="C:/Windows/Fonts/times.ttf")
    p4.insert_font(fontname="TNR-Bold", fontfile="C:/Windows/Fonts/timesbd.ttf")
    
    table_x0 = 76.34
    col1_div = 162.74
    col2_div = 479.86
    table_x1 = 536.98
    
    y_start = 410.5
    y_end = 510.0
    
    # Redact / cover with white
    p4.draw_rect(fitz.Rect(74.0, y_start, 540.0, y_end), fill=(1, 1, 1), color=(1, 1, 1))
    
    rows = [
        ("Annexure C", "Commercial Quotation, Tax Invoice (Table C.1) & Commercial Record", "21"),
        ("Annexure C (Cont.)", "Payment Details & Payment Confirmation Proof (Figure C.2)", "22"),
        ("Annexure C (Cont.)", "Customer Feedback & Email Supporting Evidence (Figure C.3)", "23"),
        ("Annexure D & E", "Client Authorization Consent Letter & Client Acceptance Certificate", "24"),
        ("Annexure F & Sign", "Academic & Technical References & Institutional Submission Sign-Off", "25"),
    ]
    
    cur_y = 410.5
    row_h = 16.0
    border_col = (0.7999, 0.8000, 0.7999)
    text_col = (0.17, 0.12, 0.13)
    
    for i, (col1, col2, col3) in enumerate(rows):
        y_next = cur_y + row_h
        # Row background (alternating subtle tint)
        bg = (0.976, 0.965, 0.961) if i % 2 == 1 else (1, 1, 1)
        p4.draw_rect(fitz.Rect(table_x0, cur_y, table_x1, y_next), fill=bg, color=None)
        
        # Grid lines
        p4.draw_line(fitz.Point(table_x0, cur_y), fitz.Point(table_x1, cur_y), color=border_col, width=0.5)
        p4.draw_line(fitz.Point(table_x0, cur_y), fitz.Point(table_x0, y_next), color=border_col, width=0.5)
        p4.draw_line(fitz.Point(col1_div, cur_y), fitz.Point(col1_div, y_next), color=border_col, width=0.5)
        p4.draw_line(fitz.Point(col2_div, cur_y), fitz.Point(col2_div, y_next), color=border_col, width=0.5)
        p4.draw_line(fitz.Point(table_x1, cur_y), fitz.Point(table_x1, y_next), color=border_col, width=0.5)
        
        # Text
        p4.insert_text(fitz.Point(table_x0 + 4.0, cur_y + 11.0), col1, fontname="TNR", fontsize=8.0, color=text_col)
        p4.insert_text(fitz.Point(col1_div + 4.0, cur_y + 11.0), col2, fontname="TNR", fontsize=8.0, color=text_col)
        # Center or right-align col3
        p4.insert_text(fitz.Point(col2_div + 20.0, cur_y + 11.0), col3, fontname="TNR", fontsize=8.0, color=text_col)
        
        cur_y = y_next
        
    # Bottom line
    p4.draw_line(fitz.Point(table_x0, cur_y), fitz.Point(table_x1, cur_y), color=border_col, width=0.5)
    
    pix = p4.get_pixmap(dpi=150)
    pix.save('test_p4_updated.png')
    print('Page 4 updated and saved as test_p4_updated.png')

if __name__ == '__main__':
    test_p4_update()
