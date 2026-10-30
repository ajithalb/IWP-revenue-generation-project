import fitz
import os

def create_page_border(page):
    # Outer double border matching SASTI M Boutique report
    # Outer rect: Rect(24.0, 23.95, 588.12, 768.07)
    # Inner rect: Rect(28.44, 28.39, 583.68, 763.63)
    page.draw_rect(fitz.Rect(24.0, 23.95, 588.12, 768.07), color=(0, 0, 0), width=1.0)
    page.draw_rect(fitz.Rect(28.44, 28.39, 583.68, 763.63), color=(0, 0, 0), width=0.6)

def build_test_pages():
    doc = fitz.open()
    
    # ------------------ PAGE 1 (Payment Details & Proof) ------------------
    p1 = doc.new_page(width=612.0, height=792.0)
    create_page_border(p1)
    
    # Footer page number
    p1.insert_text(fitz.Point(302.0, 752.0), "22", fontname="times-roman", fontsize=12, color=(0.17, 0.12, 0.13))
    
    # Title
    p1.insert_text(fitz.Point(57.6, 62.0), "Annexure C (Continued): Payment Details and Payment Proof", 
                   fontname="times-bold", fontsize=12, color=(0.77, 0.47, 0.52)) # #c47985
    
    # Introductory paragraph
    intro_p1 = (
        "The agreed project value for the website design and development project undertaken for SASTI M "
        "Boutique is ₹2,000. The payment status is recorded based on the actual transaction and supporting "
        "evidence available at the time of report submission. The payment details are presented in the "
        "accompanying table, followed by the verified transaction confirmation screenshot."
    )
    p1.insert_textbox(fitz.Rect(57.6, 70.0, 554.4, 105.0), intro_p1, fontname="times-roman", fontsize=9.5, color=(0.17, 0.12, 0.13), lineheight=1.2)
    
    # Table Header
    th_rect = fitz.Rect(57.6, 110.0, 554.4, 126.0)
    p1.draw_rect(th_rect, fill=(0.478, 0.086, 0.169), color=(0.478, 0.086, 0.169)) # #7A162B
    p1.insert_text(fitz.Point(64.0, 121.5), "Particulars (Commercial Settlement Record)", fontname="times-bold", fontsize=9.0, color=(1, 1, 1))
    p1.insert_text(fitz.Point(230.0, 121.5), "Verified Client & Transaction Details", fontname="times-bold", fontsize=9.0, color=(1, 1, 1))
    
    # Table rows
    table_data = [
        ("Client Enterprise", "SASTI M Boutique, 404, Subash Street, Kangeyam – 628701"),
        ("Client Representative", "Nisanth / Authorized Boutique Representative (Mobile: 7904871123)"),
        ("Project Title", "Design and Development of Full-Stack E-Commerce Website for SASTI M Boutique"),
        ("Total Agreed Project Value", "₹2,000 (Fixed Commercial Contract)"),
        ("Payment Status", "Confirmed Settled in Full — Completed"),
        ("Payment Method", "UPI / Online Bank Transfer (Google Pay / Canara Bank to K P R Charities)"),
        ("Payment Date & Time", "29 October 2026 at 6:56 PM IST (and 23-10-2026 Bank Transfer)"),
        ("Transaction Reference ID", "UPI ID: 630242663001 | Google Txn ID: CICAgPjJquC0ZA | UTR: 513526384752"),
        ("Beneficiary Account", "K P R CHARITIES (HDFC Bank: ....5784@hdfcbank)"),
        ("Remitter Account", "VAISHNAVI (Canara Bank 7497: ....b999@okaxis on Google Pay)")
    ]
    
    y = 126.0
    row_h = 15.0
    for i, (k, v) in enumerate(table_data):
        row_rect = fitz.Rect(57.6, y, 554.4, y + row_h)
        bg = (0.98, 0.97, 0.95) if i % 2 == 1 else (1, 1, 1)
        p1.draw_rect(row_rect, fill=bg, color=(0.8, 0.8, 0.8), width=0.5)
        # Vertical divider line
        p1.draw_line(fitz.Point(220.0, y), fitz.Point(220.0, y + row_h), color=(0.8, 0.8, 0.8), width=0.5)
        
        p1.insert_text(fitz.Point(64.0, y + 10.5), k, fontname="times-bold", fontsize=8.0, color=(0.17, 0.12, 0.13))
        p1.insert_text(fitz.Point(226.0, y + 10.5), v, fontname="times-roman", fontsize=8.0, color=(0.17, 0.12, 0.13))
        y += row_h
    
    # Outer border for table
    p1.draw_rect(fitz.Rect(57.6, 110.0, 554.4, y), color=(0.8, 0.8, 0.8), width=0.6)
    
    # Caption
    caption_y = y + 14.0
    caption_text = "Figure C.2: Payment confirmation for the SASTI M Boutique project (Google Pay / UPI Transfer)"
    p1.insert_text(fitz.Point(110.0, caption_y), caption_text, fontname="times-bolditalic", fontsize=9.5, color=(0.478, 0.086, 0.169))
    
    # Insert Screenshot ss.jpeg
    img_path = 'C:/Users/AJITHA/Downloads/ss.jpeg'
    img_y0 = caption_y + 8.0
    # Available height down to 732 is 732 - img_y0
    avail_h = 732.0 - img_y0
    # Image aspect ratio: 862 x 1599 = 0.53908
    img_h = min(avail_h, 420.0)
    img_w = img_h * (862.0 / 1599.0)
    img_x0 = (612.0 - img_w) / 2.0
    img_rect = fitz.Rect(img_x0, img_y0, img_x0 + img_w, img_y0 + img_h)
    
    # Draw frame / border around screenshot
    p1.draw_rect(fitz.Rect(img_x0 - 2, img_y0 - 2, img_x0 + img_w + 2, img_y0 + img_h + 2), fill=(0.95, 0.95, 0.95), color=(0.75, 0.75, 0.75), width=0.6)
    p1.insert_image(img_rect, filename=img_path)
    
    # ------------------ PAGE 2 (Customer Feedback & Email Evidence) ------------------
    p2 = doc.new_page(width=612.0, height=792.0)
    create_page_border(p2)
    
    # Footer page number
    p2.insert_text(fitz.Point(302.0, 752.0), "23", fontname="times-roman", fontsize=12, color=(0.17, 0.12, 0.13))
    
    # Title
    p2.insert_text(fitz.Point(57.6, 62.0), "Annexure C (Continued): Customer Feedback and Email Evidence", 
                   fontname="times-bold", fontsize=12, color=(0.77, 0.47, 0.52)) # #c47985
    
    # Section Heading
    p2.insert_text(fitz.Point(57.6, 78.0), "Client’s Feedback and Appreciation On Delivered Product", 
                   fontname="times-bold", fontsize=11, color=(0.478, 0.086, 0.169))
    
    # Communication details table
    th2_rect = fitz.Rect(57.6, 86.0, 554.4, 101.0)
    p2.draw_rect(th2_rect, fill=(0.478, 0.086, 0.169), color=(0.478, 0.086, 0.169))
    p2.insert_text(fitz.Point(64.0, 96.5), "Communication Field", fontname="times-bold", fontsize=8.5, color=(1, 1, 1))
    p2.insert_text(fitz.Point(230.0, 96.5), "Verified Email Transmission Details", fontname="times-bold", fontsize=8.5, color=(1, 1, 1))
    
    email_meta = [
        ("Client Sender", "Ajai Venkatesh (Proprietor / Representative, SASTI M Boutique)"),
        ("Sender Email Address", "nisanth08.connect@gamil.com (Ajai Venkatesh)"),
        ("Recipient", "Project Engineering Team (Ajitha Laxmi Balamurugan & Vaishnavi M)"),
        ("Date & Timestamp", "29 October 2026, 7:24 PM IST"),
        ("Email Subject", "Development Services (Inbox)")
    ]
    
    y2 = 101.0
    row_h2 = 13.5
    for i, (k, v) in enumerate(email_meta):
        row_rect = fitz.Rect(57.6, y2, 554.4, y2 + row_h2)
        bg = (0.98, 0.97, 0.95) if i % 2 == 1 else (1, 1, 1)
        p2.draw_rect(row_rect, fill=bg, color=(0.8, 0.8, 0.8), width=0.5)
        p2.draw_line(fitz.Point(220.0, y2), fitz.Point(220.0, y2 + row_h2), color=(0.8, 0.8, 0.8), width=0.5)
        p2.insert_text(fitz.Point(64.0, y2 + 9.5), k, fontname="times-bold", fontsize=8.0, color=(0.17, 0.12, 0.13))
        p2.insert_text(fitz.Point(226.0, y2 + 9.5), v, fontname="times-roman", fontsize=8.0, color=(0.17, 0.12, 0.13))
        y2 += row_h2
    p2.draw_rect(fitz.Rect(57.6, 86.0, 554.4, y2), color=(0.8, 0.8, 0.8), width=0.6)
    
    # Verbatim Email Transcript Card
    trans_y = y2 + 8.0
    trans_h = 105.0
    p2.draw_rect(fitz.Rect(57.6, trans_y, 554.4, trans_y + trans_h), fill=(0.99, 0.98, 0.97), color=(0.85, 0.85, 0.85), width=0.5)
    # Burgundy left bar accent
    p2.draw_rect(fitz.Rect(57.6, trans_y, 60.6, trans_y + trans_h), fill=(0.478, 0.086, 0.169), color=(0.478, 0.086, 0.169))
    
    p2.insert_text(fitz.Point(66.0, trans_y + 12.0), "Customer Feedback Transcript (Verbatim from Client Email):", fontname="times-bold", fontsize=8.5, color=(0.478, 0.086, 0.169))
    
    transcript_text = (
        "\"Dear Team,\n"
        "I would like to express my sincere appreciation for creating such a beautiful and attractive website for my dress boutique. "
        "The website looks amazing, with a modern design, elegant layout, and eye-catching visuals. It is very user-friendly and makes it easy for customers to explore dress collections, view product details, and shop online.\n"
        "I especially love the attractive homepage, smooth navigation, and well-organized product sections. The website looks professional and gives my boutique a unique identity online. All the features are very useful and make the shopping experience simple and enjoyable.\n"
        "I am extremely happy with your work and the effort you put into creating this website. It is exactly the kind of website I wanted for my business, and I believe it will help attract more customers and grow my boutique. Thank you for your excellent work and dedication. I truly appreciate your creativity and professionalism!\""
    )
    p2.insert_textbox(fitz.Rect(66.0, trans_y + 16.0, 546.0, trans_y + trans_h - 4.0), transcript_text, 
                      fontname="times-roman", fontsize=7.8, color=(0.17, 0.12, 0.13), lineheight=1.2)
    
    # Caption
    caption2_y = trans_y + trans_h + 12.0
    caption2_text = "Figure C.3: Official Customer Feedback & Appreciation Email Screenshot (Development Services)"
    p2.insert_text(fitz.Point(95.0, caption2_y), caption2_text, fontname="times-bolditalic", fontsize=9.5, color=(0.478, 0.086, 0.169))
    
    # Insert Screenshot email.jpeg
    email_path = 'C:/Users/AJITHA/Downloads/email.jpeg'
    img2_y0 = caption2_y + 6.0
    avail_h2 = 732.0 - img2_y0
    # Image aspect ratio: 852 x 1600 = 0.5325
    img2_h = min(avail_h2, 380.0)
    img2_w = img2_h * (852.0 / 1600.0)
    img2_x0 = (612.0 - img2_w) / 2.0
    img2_rect = fitz.Rect(img2_x0, img2_y0, img2_x0 + img2_w, img2_y0 + img2_h)
    
    p2.draw_rect(fitz.Rect(img2_x0 - 2, img2_y0 - 2, img2_x0 + img2_w + 2, img2_y0 + img2_h + 2), fill=(0.95, 0.95, 0.95), color=(0.75, 0.75, 0.75), width=0.6)
    p2.insert_image(img2_rect, filename=email_path)
    
    doc.save('test_two_pages.pdf')
    print('Test pages generated successfully!')

if __name__ == '__main__':
    build_test_pages()
