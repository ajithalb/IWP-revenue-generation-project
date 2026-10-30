import fitz
import os

def create_page_border(page):
    # Outer double border matching SASTI M Boutique report
    page.draw_rect(fitz.Rect(24.0, 23.95, 588.12, 768.07), color=(0, 0, 0), width=1.0)
    page.draw_rect(fitz.Rect(28.44, 28.39, 583.68, 763.63), color=(0, 0, 0), width=0.6)

def build_test_pages():
    doc = fitz.open()
    
    # ------------------ PAGE 1 (Payment Details & Proof) ------------------
    p1 = doc.new_page(width=612.0, height=792.0)
    create_page_border(p1)
    
    # Register TrueType fonts from Windows Fonts
    p1.insert_font(fontname="TNR", fontfile="C:/Windows/Fonts/times.ttf")
    p1.insert_font(fontname="TNR-Bold", fontfile="C:/Windows/Fonts/timesbd.ttf")
    p1.insert_font(fontname="TNR-Italic", fontfile="C:/Windows/Fonts/timesi.ttf")
    p1.insert_font(fontname="TNR-BoldItalic", fontfile="C:/Windows/Fonts/timesbi.ttf")
    
    # Footer page number
    p1.insert_text(fitz.Point(302.0, 752.0), "22", fontname="TNR", fontsize=12, color=(0.17, 0.12, 0.13))
    
    # Title
    p1.insert_text(fitz.Point(57.6, 58.0), "Annexure C (Continued): Payment Details and Payment Proof", 
                   fontname="TNR-Bold", fontsize=12, color=(0.77, 0.47, 0.52)) # #c47985
    
    # Subtitle
    p1.insert_text(fitz.Point(57.6, 73.0), "Payment Details and Supporting Evidence", 
                   fontname="TNR-Bold", fontsize=11, color=(0.478, 0.086, 0.169)) # #7A162B
    
    # Introductory paragraph
    intro_p1 = (
        "The agreed project value for the website design and development project undertaken for SASTI M Boutique "
        "is ₹2,000. The payment status is recorded based on the actual transaction and supporting evidence available at "
        "the time of report submission. The payment details are presented in the accompanying table. The transaction screenshot "
        "is included as supporting evidence, with sensitive banking credentials masked where appropriate."
    )
    p1.insert_textbox(fitz.Rect(57.6, 79.0, 554.4, 118.0), intro_p1, fontname="TNR", fontsize=9.0, color=(0.17, 0.12, 0.13), lineheight=1.2)
    
    # Table Header
    col1_w = 175.0
    table_x0 = 57.6
    table_x1 = 554.4
    col_div = table_x0 + col1_w
    
    th_y0 = 120.0
    th_y1 = 135.0
    p1.draw_rect(fitz.Rect(table_x0, th_y0, table_x1, th_y1), fill=(0.478, 0.086, 0.169), color=(0.478, 0.086, 0.169))
    p1.insert_text(fitz.Point(table_x0 + 8.0, th_y0 + 11.0), "Particulars", fontname="TNR-Bold", fontsize=9.0, color=(1, 1, 1))
    p1.insert_text(fitz.Point(col_div + 8.0, th_y0 + 11.0), "Verified Details & Evidence Record", fontname="TNR-Bold", fontsize=9.0, color=(1, 1, 1))
    
    # Table rows matching SMM Builders format exactly, with SASTI details
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
    
    # Outer border for table
    p1.draw_rect(fitz.Rect(table_x0, th_y0, table_x1, y), color=(0.8, 0.8, 0.8), width=0.6)
    
    # Caption
    caption_y = y + 14.0
    caption_text = "Figure C.2: Payment confirmation for the SASTI M Boutique project (UPI / Google Pay Transfer)"
    p1.insert_text(fitz.Point(85.0, caption_y), caption_text, fontname="TNR-BoldItalic", fontsize=9.0, color=(0.478, 0.086, 0.169))
    
    # Insert Screenshot ss.jpeg
    img_path = 'C:/Users/AJITHA/Downloads/ss.jpeg'
    img_y0 = caption_y + 8.0
    avail_h = 732.0 - img_y0
    img_h = min(avail_h, 420.0)
    img_w = img_h * (862.0 / 1599.0)
    img_x0 = (612.0 - img_w) / 2.0
    img_rect = fitz.Rect(img_x0, img_y0, img_x0 + img_w, img_y0 + img_h)
    
    p1.draw_rect(fitz.Rect(img_x0 - 2, img_y0 - 2, img_x0 + img_w + 2, img_y0 + img_h + 2), fill=(0.95, 0.95, 0.95), color=(0.75, 0.75, 0.75), width=0.6)
    p1.insert_image(img_rect, filename=img_path)
    
    # ------------------ PAGE 2 (Customer Feedback & Email Evidence) ------------------
    p2 = doc.new_page(width=612.0, height=792.0)
    create_page_border(p2)
    
    p2.insert_font(fontname="TNR", fontfile="C:/Windows/Fonts/times.ttf")
    p2.insert_font(fontname="TNR-Bold", fontfile="C:/Windows/Fonts/timesbd.ttf")
    p2.insert_font(fontname="TNR-Italic", fontfile="C:/Windows/Fonts/timesi.ttf")
    p2.insert_font(fontname="TNR-BoldItalic", fontfile="C:/Windows/Fonts/timesbi.ttf")
    
    # Footer page number
    p2.insert_text(fitz.Point(302.0, 752.0), "23", fontname="TNR", fontsize=12, color=(0.17, 0.12, 0.13))
    
    # Title
    p2.insert_text(fitz.Point(57.6, 56.0), "Annexure C (Continued): Customer Feedback and Email Evidence", 
                   fontname="TNR-Bold", fontsize=12, color=(0.77, 0.47, 0.52))
    
    # Section Heading
    p2.insert_text(fitz.Point(57.6, 71.0), "Client’s Feedback and Appreciation On Delivered Product", 
                   fontname="TNR-Bold", fontsize=11, color=(0.478, 0.086, 0.169))
    
    # Communication details table
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
    row_h2 = 12.5
    for i, (k, v) in enumerate(email_meta):
        row_rect = fitz.Rect(table_x0, y2, table_x1, y2 + row_h2)
        bg = (0.98, 0.97, 0.95) if i % 2 == 1 else (1, 1, 1)
        p2.draw_rect(row_rect, fill=bg, color=(0.8, 0.8, 0.8), width=0.5)
        p2.draw_line(fitz.Point(col_div, y2), fitz.Point(col_div, y2 + row_h2), color=(0.8, 0.8, 0.8), width=0.5)
        p2.insert_text(fitz.Point(table_x0 + 8.0, y2 + 9.0), k, fontname="TNR-Bold", fontsize=7.5, color=(0.17, 0.12, 0.13))
        p2.insert_text(fitz.Point(col_div + 8.0, y2 + 9.0), v, fontname="TNR", fontsize=7.5, color=(0.17, 0.12, 0.13))
        y2 += row_h2
    p2.draw_rect(fitz.Rect(table_x0, th2_y0, table_x1, y2), color=(0.8, 0.8, 0.8), width=0.6)
    
    # Verbatim Email Transcript Card
    trans_y = y2 + 6.0
    trans_h = 100.0
    p2.draw_rect(fitz.Rect(table_x0, trans_y, table_x1, trans_y + trans_h), fill=(0.99, 0.98, 0.97), color=(0.85, 0.85, 0.85), width=0.5)
    # Burgundy left bar accent
    p2.draw_rect(fitz.Rect(table_x0, trans_y, table_x0 + 3.0, trans_y + trans_h), fill=(0.478, 0.086, 0.169), color=(0.478, 0.086, 0.169))
    
    p2.insert_text(fitz.Point(table_x0 + 8.0, trans_y + 11.0), "Customer Feedback Transcript (Verbatim from Client Email):", 
                   fontname="TNR-Bold", fontsize=8.0, color=(0.478, 0.086, 0.169))
    
    transcript_text = (
        "\"Dear Team,\n\n"
        "I would like to express my sincere appreciation for creating such a beautiful and attractive website for my dress boutique. "
        "The website looks amazing, with a modern design, elegant layout, and eye-catching visuals. It is very user-friendly and makes it easy for customers to explore dress collections, view product details, and shop online.\n\n"
        "I especially love the attractive homepage, smooth navigation, and well-organized product sections. The website looks professional and gives my boutique a unique identity online. All the features are very useful and make the shopping experience simple and enjoyable.\n\n"
        "I am extremely happy with your work and the effort you put into creating this website. It is exactly the kind of website I wanted for my business, and I believe it will help attract more customers and grow my boutique. "
        "Thank you for your excellent work and dedication. I truly appreciate your creativity and professionalism!\""
    )
    rc = p2.insert_textbox(fitz.Rect(table_x0 + 8.0, trans_y + 14.0, table_x1 - 8.0, trans_y + trans_h - 2.0), 
                           transcript_text, fontname="TNR", fontsize=7.2, color=(0.17, 0.12, 0.13), lineheight=1.15)
    print("Page 2 transcript insert_textbox return code:", rc)
    
    # Caption
    caption2_y = trans_y + trans_h + 12.0
    caption2_text = "Figure C.3: Official Customer Feedback & Appreciation Email Screenshot (Development Services)"
    p2.insert_text(fitz.Point(85.0, caption2_y), caption2_text, fontname="TNR-BoldItalic", fontsize=9.0, color=(0.478, 0.086, 0.169))
    
    # Insert Screenshot email.jpeg
    email_path = 'C:/Users/AJITHA/Downloads/email.jpeg'
    img2_y0 = caption2_y + 6.0
    avail_h2 = 732.0 - img2_y0
    img2_h = min(avail_h2, 420.0)
    img2_w = img2_h * (852.0 / 1600.0)
    img2_x0 = (612.0 - img2_w) / 2.0
    img2_rect = fitz.Rect(img2_x0, img2_y0, img2_x0 + img2_w, img2_y0 + img2_h)
    
    p2.draw_rect(fitz.Rect(img2_x0 - 2, img2_y0 - 2, img2_x0 + img2_w + 2, img2_y0 + img2_h + 2), fill=(0.95, 0.95, 0.95), color=(0.75, 0.75, 0.75), width=0.6)
    p2.insert_image(img2_rect, filename=email_path)
    
    doc.save('test_two_pages_v2.pdf')
    print('Test pages v2 generated successfully!')

if __name__ == '__main__':
    build_test_pages()
