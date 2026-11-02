import fitz

doc = fitz.open()
p = doc.new_page(width=612, height=792)
p.insert_font(fontname='TNR', fontfile='C:/Windows/Fonts/times.ttf')

text = (
    '"Dear Team,\n\n'
    'I would like to express my sincere appreciation for creating such a beautiful and attractive website for my dress boutique.\n\n'
    'The website looks amazing, with a modern design, elegant layout, and eye-catching visuals. It is very user-friendly and makes it easy for customers to explore dress collections, view product details, and shop online. I especially love the attractive homepage, smooth navigation, and well-organized product sections. The website looks professional and gives my boutique a unique identity online. All the features are very useful and make the shopping experience simple and enjoyable.\n\n'
    'I am extremely happy with your work and the effort you put into creating this website. It is exactly the kind of website I wanted for my business, and I believe it will help attract more customers and grow my boutique. Thank you for your excellent work and dedication. I truly appreciate your creativity and professionalism!"'
)

for fs in [7.5, 7.8, 8.0]:
    for h in [95, 105, 115, 125]:
        p_temp = doc.new_page(width=612, height=792)
        p_temp.insert_font(fontname='TNR', fontfile='C:/Windows/Fonts/times.ttf')
        rect = fitz.Rect(65.6, 160.0, 546.4, 160.0 + h)
        rc = p_temp.insert_textbox(rect, text, fontname='TNR', fontsize=fs, lineheight=1.15)
        print(f'fs={fs}, h={h} -> rc={rc}')
