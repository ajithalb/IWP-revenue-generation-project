import fitz
import os
import shutil

def create_page_border(page):
    """Draw the double black border exactly matching SASTI M Boutique report."""
    page.draw_rect(fitz.Rect(24.0, 23.95, 588.12, 768.07), color=(0, 0, 0), width=1.0)
    page.draw_rect(fitz.Rect(28.44, 28.39, 583.68, 763.63), color=(0, 0, 0), width=0.6)

def build_payment_details_page(doc):
    """Build Page 22: Payment Details & Payment Proof."""
    p1 = doc.new_page(width=612.0, height=792.0)
    create_page_border(p1)
    
    # Register TrueType fonts
    p1.insert_font(fontname="TNR", fontfile="C:/Windows/Fonts/times.ttf")
    p1.insert_font(fontname="TNR-Bold", fontfile="C:/Windows/Fonts/timesbd.ttf")
    p1.insert_font(fontname="TNR-Italic", fontfile="C:/Windows/Fonts/timesi.ttf")
    p1.insert_font(fontname="TNR-BoldItalic", fontfile="C:/Windows/Fonts/timesbi.ttf")
    
    # Footer page number
    p1.insert_text(fitz.Point(302.0, 752.0), "22", fontname="TNR", fontsize=12, color=(0.17, 0.12, 0.13))
    
    # Heading & Subtitle
    p1.insert_text(fitz.Point(57.6, 56.0), "Annexure C (Continued): Payment Details and Payment Proof", 
                   fontname="TNR-Bold", fontsize=12, color=(0.77, 0.47, 0.52))
    p1.insert_text(fitz.Point(57.6, 71.0), "Payment Details and Supporting Evidence", 
                   fontname="TNR-Bold", fontsize=11, color=(0.478, 0.086, 0.169))
    
    # Introductory paragraph
    intro_p1 = (
        "The agreed project value for the website design and development project undertaken for SASTI M Boutique "
        "is ₹2,000. The payment status is recorded based on the actual transaction and supporting evidence available at "
        "the time of report submission. The payment details are presented in the accompanying table. The transaction screenshot "
        "is included as supporting evidence, with sensitive banking credentials masked where appropriate."
    )
    p1.insert_textbox(fitz.Rect(57.6, 77.0, 554.4, 114.0), intro_p1, fontname="TNR", fontsize=8.8, color=(0.17, 0.12, 0.13), lineheight=1.2)
    
    # Table Header
    col1_w = 175.0
    table_x0 = 57.6
    table_x1 = 554.4
    col_div = table_x0 + col1_w
    
    th_y0 = 117.0
    th_y1 = 132.0
    p1.draw_rect(fitz.Rect(table_x0, th_y0, table_x1, th_y1), fill=(0.478, 0.086, 0.169), color=(0.478, 0.086, 0.169))
    p1.insert_text(fitz.Point(table_x0 + 8.0, th_y0 + 11.0), "Particulars", fontname="TNR-Bold", fontsize=9.0, color=(1, 1, 1))
    p1.insert_text(fitz.Point(col_div + 8.0, th_y0 + 11.0), "Verified Details & Evidence Record", fontname="TNR-Bold", fontsize=9.0, color=(1, 1, 1))
    
    # Table rows
    table_data = [
        ("Client", "SASTI M Boutique (Retail Apparel & Bridal Makeover Artistry)"),
        ("Client Representative", "Nisanth / Authorized Boutique Representative (Mobile: 7904871123)"),
        ("Project Name", "Design and Development of Full-Stack E-Commerce Website for SASTI M Boutique"),
        ("Total Agreed Project Value", "₹2,000"),
        ("Amount Received", "₹2,000 (Settled in Full)"),
        ("Balance Due", "₹0 (Nil)"),
        ("Payment Status", "Completed / Confirmed Settled in Full"),
        ("Payment Method", "UPI / Bank Transfer (Google Pay / Canara Bank to K P R Charities)"),
        ("Payment Date & Time", "29 October 2026 at 6:56 PM IST (and 23-10-2026 Bank Transfer)"),
        ("Transaction Reference ID", "UPI ID: 630242663001 | Google Txn ID: CICAgPjJquC0ZA | UTR: 513526384752")
    ]
    
    y = th_y1
    row_h = 13.5
    for i, (k, v) in enumerate(table_data):
        row_rect = fitz.Rect(table_x0, y, table_x1, y + row_h)
        bg = (0.98, 0.97, 0.95) if i % 2 == 1 else (1, 1, 1)
        p1.draw_rect(row_rect, fill=bg, color=(0.8, 0.8, 0.8), width=0.5)
        p1.draw_line(fitz.Point(col_div, y), fitz.Point(col_div, y + row_h), color=(0.8, 0.8, 0.8), width=0.5)
        
        p1.insert_text(fitz.Point(table_x0 + 8.0, y + 9.5), k, fontname="TNR-Bold", fontsize=7.8, color=(0.17, 0.12, 0.13))
        p1.insert_text(fitz.Point(col_div + 8.0, y + 9.5), v, fontname="TNR", fontsize=7.8, color=(0.17, 0.12, 0.13))
        y += row_h
    
    p1.draw_rect(fitz.Rect(table_x0, th_y0, table_x1, y), color=(0.8, 0.8, 0.8), width=0.6)
    
    # Figure Caption
    caption_y = y + 13.0
    caption_text = "Figure C.2: Payment confirmation for the SASTI M Boutique project (UPI / Google Pay Transfer)"
    cap_w = fitz.get_text_length(caption_text, fontname="times-bolditalic", fontsize=9.0)
    cap_x = (612.0 - cap_w) / 2.0
    p1.insert_text(fitz.Point(cap_x, caption_y), caption_text, fontname="TNR-BoldItalic", fontsize=9.0, color=(0.478, 0.086, 0.169))
    
    # Insert Screenshot ss.jpeg
    img_path = 'C:/Users/AJITHA/Downloads/ss.jpeg'
    img_y0 = caption_y + 7.0
    avail_h = 732.0 - img_y0
    img_h = min(avail_h, 420.0)
    img_w = img_h * (862.0 / 1599.0)
    img_x0 = (612.0 - img_w) / 2.0
    img_rect = fitz.Rect(img_x0, img_y0, img_x0 + img_w, img_y0 + img_h)
    
    p1.draw_rect(fitz.Rect(img_x0 - 2, img_y0 - 2, img_x0 + img_w + 2, img_y0 + img_h + 2), fill=(0.96, 0.96, 0.96), color=(0.75, 0.75, 0.75), width=0.6)
    p1.insert_image(img_rect, filename=img_path)
    return p1

def build_customer_feedback_page(doc):
    """Build Page 23: Customer Feedback & Email Evidence."""
    p2 = doc.new_page(width=612.0, height=792.0)
    create_page_border(p2)
    
    p2.insert_font(fontname="TNR", fontfile="C:/Windows/Fonts/times.ttf")
    p2.insert_font(fontname="TNR-Bold", fontfile="C:/Windows/Fonts/timesbd.ttf")
    p2.insert_font(fontname="TNR-Italic", fontfile="C:/Windows/Fonts/timesi.ttf")
    p2.insert_font(fontname="TNR-BoldItalic", fontfile="C:/Windows/Fonts/timesbi.ttf")
    
    # Footer page number
    p2.insert_text(fitz.Point(302.0, 752.0), "23", fontname="TNR", fontsize=12, color=(0.17, 0.12, 0.13))
    
    # Heading & Subtitle
    p2.insert_text(fitz.Point(57.6, 56.0), "Annexure C (Continued): Customer Feedback and Email Evidence", 
                   fontname="TNR-Bold", fontsize=12, color=(0.77, 0.47, 0.52))
    p2.insert_text(fitz.Point(57.6, 71.0), "Client’s Feedback and Appreciation On Delivered Product", 
                   fontname="TNR-Bold", fontsize=11, color=(0.478, 0.086, 0.169))
    
    # Metadata Table
    col1_w = 175.0
    table_x0 = 57.6
    table_x1 = 554.4
    col_div = table_x0 + col1_w
    
    th2_y0 = 78.0
    th2_y1 = 92.0
    p2.draw_rect(fitz.Rect(table_x0, th2_y0, table_x1, th2_y1), fill=(0.478, 0.086, 0.169), color=(0.478, 0.086, 0.169))
    p2.insert_text(fitz.Point(table_x0 + 8.0, th2_y0 + 10.0), "Communication Parameter", fontname="TNR-Bold", fontsize=8.5, color=(1, 1, 1))
    p2.insert_text(fitz.Point(col_div + 8.0, th2_y0 + 10.0), "Verified Email Transmission Details", fontname="TNR-Bold", fontsize=8.5, color=(1, 1, 1))
    
    email_meta = [
        ("Client / Sender", "Ajai Venkatesh (Proprietor / Representative, SASTI M Boutique)"),
        ("Sender Email Address", "nisanth08.connect@gamil.com (Ajai Venkatesh)"),
        ("Recipient", "Project Engineering Team (Ajitha Laxmi Balamurugan & Vaishnavi M)"),
        ("Date & Timestamp", "29 October 2026, 7:24 PM IST"),
        ("Email Subject", "Development Services (Inbox)")
    ]
    
    y2 = th2_y1
    row_h2 = 12.0
    for i, (k, v) in enumerate(email_meta):
        row_rect = fitz.Rect(table_x0, y2, table_x1, y2 + row_h2)
        bg = (0.98, 0.97, 0.95) if i % 2 == 1 else (1, 1, 1)
        p2.draw_rect(row_rect, fill=bg, color=(0.8, 0.8, 0.8), width=0.5)
        p2.draw_line(fitz.Point(col_div, y2), fitz.Point(col_div, y2 + row_h2), color=(0.8, 0.8, 0.8), width=0.5)
        p2.insert_text(fitz.Point(table_x0 + 8.0, y2 + 8.5), k, fontname="TNR-Bold", fontsize=7.5, color=(0.17, 0.12, 0.13))
        p2.insert_text(fitz.Point(col_div + 8.0, y2 + 8.5), v, fontname="TNR", fontsize=7.5, color=(0.17, 0.12, 0.13))
        y2 += row_h2
    p2.draw_rect(fitz.Rect(table_x0, th2_y0, table_x1, y2), color=(0.8, 0.8, 0.8), width=0.6)
    
    # Verbatim Email Transcript Box
    trans_y = y2 + 5.0
    trans_h = 130.0
    p2.draw_rect(fitz.Rect(table_x0, trans_y, table_x1, trans_y + trans_h), fill=(0.99, 0.98, 0.97), color=(0.85, 0.85, 0.85), width=0.5)
    # Burgundy left bar accent
    p2.draw_rect(fitz.Rect(table_x0, trans_y, table_x0 + 3.0, trans_y + trans_h), fill=(0.478, 0.086, 0.169), color=(0.478, 0.086, 0.169))
    
    p2.insert_text(fitz.Point(table_x0 + 8.0, trans_y + 11.0), "Customer Feedback Transcript (Verbatim from Client Email):", 
                   fontname="TNR-Bold", fontsize=8.0, color=(0.478, 0.086, 0.169))
    
    transcript_text = (
        "\"Dear Team,\n\n"
        "I would like to express my sincere appreciation for creating such a beautiful and attractive website for my dress boutique.\n\n"
        "The website looks amazing, with a modern design, elegant layout, and eye-catching visuals. It is very user-friendly and makes it easy for customers to explore dress collections, view product details, and shop online. "
        "I especially love the attractive homepage, smooth navigation, and well-organized product sections. The website looks professional and gives my boutique a unique identity online. All the features are very useful and make the shopping experience simple and enjoyable.\n\n"
        "I am extremely happy with your work and the effort you put into creating this website. It is exactly the kind of website I wanted for my business, and I believe it will help attract more customers and grow my boutique. "
        "Thank you for your excellent work and dedication. I truly appreciate your creativity and professionalism!\""
    )
    rc = p2.insert_textbox(fitz.Rect(table_x0 + 8.0, trans_y + 16.0, table_x1 - 8.0, trans_y + trans_h - 4.0), 
                           transcript_text, fontname="TNR", fontsize=7.5, color=(0.17, 0.12, 0.13), lineheight=1.15)
    print("Page 23 transcript rc (should be positive):", rc)
    
    # Figure Caption
    caption2_y = trans_y + trans_h + 11.0
    caption2_text = "Figure C.3: Official Customer Feedback & Appreciation Email Screenshot (Development Services)"
    cap2_w = fitz.get_text_length(caption2_text, fontname="times-bolditalic", fontsize=9.0)
    cap2_x = (612.0 - cap2_w) / 2.0
    p2.insert_text(fitz.Point(cap2_x, caption2_y), caption2_text, fontname="TNR-BoldItalic", fontsize=9.0, color=(0.478, 0.086, 0.169))
    
    # Insert Screenshot email.jpeg
    email_path = 'C:/Users/AJITHA/Downloads/email.jpeg'
    img2_y0 = caption2_y + 6.0
    avail_h2 = 732.0 - img2_y0
    img2_h = min(avail_h2, 400.0)
    img2_w = img2_h * (852.0 / 1600.0)
    img2_x0 = (612.0 - img2_w) / 2.0
    img2_rect = fitz.Rect(img2_x0, img2_y0, img2_x0 + img2_w, img2_y0 + img2_h)
    
    p2.draw_rect(fitz.Rect(img2_x0 - 2, img2_y0 - 2, img2_x0 + img2_w + 2, img2_y0 + img2_h + 2), fill=(0.96, 0.96, 0.96), color=(0.75, 0.75, 0.75), width=0.6)
    p2.insert_image(img2_rect, filename=email_path)
    return p2

def update_table_of_contents(p4):
    """Update Page 4 Table of Contents to list the new Annexure pages."""
    p4.insert_font(fontname="TNR", fontfile="C:/Windows/Fonts/times.ttf")
    p4.insert_font(fontname="TNR-Bold", fontfile="C:/Windows/Fonts/timesbd.ttf")
    
    table_x0 = 76.34
    col1_div = 162.74
    col2_div = 479.86
    table_x1 = 536.98
    
    y_start = 410.5
    y_end = 510.0
    
    # Redact old rows 21, 22, 23
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
        bg = (0.976, 0.965, 0.961) if i % 2 == 1 else (1, 1, 1)
        p4.draw_rect(fitz.Rect(table_x0, cur_y, table_x1, y_next), fill=bg, color=None)
        
        p4.draw_line(fitz.Point(table_x0, cur_y), fitz.Point(table_x1, cur_y), color=border_col, width=0.5)
        p4.draw_line(fitz.Point(table_x0, cur_y), fitz.Point(table_x0, y_next), color=border_col, width=0.5)
        p4.draw_line(fitz.Point(col1_div, cur_y), fitz.Point(col1_div, y_next), color=border_col, width=0.5)
        p4.draw_line(fitz.Point(col2_div, cur_y), fitz.Point(col2_div, y_next), color=border_col, width=0.5)
        p4.draw_line(fitz.Point(table_x1, cur_y), fitz.Point(table_x1, y_next), color=border_col, width=0.5)
        
        p4.insert_text(fitz.Point(table_x0 + 4.0, cur_y + 11.0), col1, fontname="TNR", fontsize=8.0, color=text_col)
        p4.insert_text(fitz.Point(col1_div + 4.0, cur_y + 11.0), col2, fontname="TNR", fontsize=8.0, color=text_col)
        p4.insert_text(fitz.Point(col2_div + 20.0, cur_y + 11.0), col3, fontname="TNR", fontsize=8.0, color=text_col)
        
        cur_y = y_next
        
    p4.draw_line(fitz.Point(table_x0, cur_y), fitz.Point(table_x1, cur_y), color=border_col, width=0.5)

def update_page_number(page, old_num, new_num):
    """Redact old footer page number and insert new page number."""
    page.insert_font(fontname="TNR", fontfile="C:/Windows/Fonts/times.ttf")
    # Redact footer box
    page.draw_rect(fitz.Rect(280.0, 740.0, 335.0, 762.0), fill=(1, 1, 1), color=(1, 1, 1))
    page.insert_text(fitz.Point(302.0, 752.0), str(new_num), fontname="TNR", fontsize=12, color=(0.17, 0.12, 0.13))

def main():
    src_pdf = 'C:/Users/AJITHA/Downloads/sasti boutique finalllllllllll reporttttttt.pdf'
    output_pdf = 'SASTI_M_Boutique_Final_Report_Updated.pdf'
    
    print('Opening source PDF...')
    src_doc = fitz.open(src_pdf)
    print(f'Source PDF has {len(src_doc)} pages.')
    
    # 1. Update Page 4 (TOC)
    print('Updating Table of Contents on Page 4...')
    update_table_of_contents(src_doc[3])
    
    # 2. Update Old Page 22 (Index 21) -> page number 24
    print('Updating footer of Old Page 22 -> 24...')
    update_page_number(src_doc[21], 22, 24)
    
    # 3. Update Old Page 23 (Index 22) -> page number 25
    print('Updating footer of Old Page 23 -> 25...')
    update_page_number(src_doc[22], 23, 25)
    
    # 4. Create the two new pages in a temporary doc
    print('Generating the two new pages...')
    temp_doc = fitz.open()
    build_payment_details_page(temp_doc)
    build_customer_feedback_page(temp_doc)
    
    # 5. Assemble final document:
    # Final Doc = src_doc[0:21] (Pages 1 to 21) + temp_doc[0:2] (Pages 22 & 23) + src_doc[21:23] (Pages 24 & 25)
    print('Assembling final 25-page document...')
    final_doc = fitz.open()
    
    # Pages 1 to 21
    final_doc.insert_pdf(src_doc, from_page=0, to_page=20)
    
    # New Pages 22 & 23
    final_doc.insert_pdf(temp_doc, from_page=0, to_page=1)
    
    # Old Pages 22 & 23 (now 24 & 25)
    final_doc.insert_pdf(src_doc, from_page=21, to_page=22)
    
    print(f'Final document page count: {len(final_doc)}')
    
    # Save output
    final_doc.save(output_pdf)
    print(f'Successfully saved {output_pdf}')
    
    # Also copy to Downloads and Desktop
    dest_downloads = 'C:/Users/AJITHA/Downloads/' + output_pdf
    dest_desktop = 'C:/Users/AJITHA/Desktop/' + output_pdf
    shutil.copyfile(output_pdf, dest_downloads)
    shutil.copyfile(output_pdf, dest_desktop)
    print(f'Copied to:\n  {dest_downloads}\n  {dest_desktop}')

if __name__ == '__main__':
    main()
