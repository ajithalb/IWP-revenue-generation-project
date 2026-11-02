const bcrypt = require('bcryptjs');
const db = require('./db');

function seedDatabase() {
  console.log('[Seed] Beginning database seeding for Sasti Boutique...');

  // 1. Clear existing data if resetting
  db.exec(`
    DELETE FROM newsletter_subscribers;
    DELETE FROM contact_messages;
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM makeup_bookings;
    DELETE FROM makeup_services;
    DELETE FROM products;
    DELETE FROM admins;
    DELETE FROM sqlite_sequence;
  `);

  // 2. Seed Admin
  const adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@Sasti2026', 10);
  const insertAdmin = db.prepare(`
    INSERT INTO admins (username, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `);
  insertAdmin.run(
    process.env.ADMIN_DEFAULT_USERNAME || 'admin',
    'nisanth08.connect@gamil.com',
    adminPasswordHash,
    'superadmin'
  );
  console.log('[Seed] Admin account created: username "admin", password "Admin@Sasti2026"');

  // 3. Seed Makeup Services
  const insertService = db.prepare(`
    INSERT INTO makeup_services (name, slug, price, duration, description, features, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const services = [
    {
      name: 'Bridal Makeup Experience',
      slug: 'bridal-makeup',
      price: 15000,
      duration: '3.5 - 4 Hours',
      description: 'Our signature bridal transformation designed to make your wedding day truly unforgettable. Includes custom high-definition airbrush finish, exquisite bridal hairdo, jewelry setting, and traditional saree/lehenga draping.',
      features: JSON.stringify([
        'Ultra-HD / Airbrush Waterproof Finish',
        'Bridal Hair Styling with Floral Accents',
        'Premium Mink Eyelashes & Lens Application',
        'Complete Saree / Lehenga Draping & Pinning',
        'Complimentary Touch-up Beauty Kit'
      ]),
      image_url: '/images/bridal_saree_styling.jpg'
    },
    {
      name: 'Reception Glam Makeup',
      slug: 'reception-makeup',
      price: 8000,
      duration: '2.5 Hours',
      description: 'A breathtaking, modern evening glam look tailored for your wedding reception or sangeet night. Features radiant dewy skin, glamorous smokey or shimmer eye artistry, and voluminous hairstyling.',
      features: JSON.stringify([
        'Radiant Evening Longwear Base',
        'Intense Glitter / Smokey Eye Artistry',
        'Modern Hairdos / Textured Curls',
        'Eyelash Enhancement & Lip Contour',
        'Outfit Styling & Dupatta Draping'
      ]),
      image_url: '/images/hero_boutique_dress.jpg'
    },
    {
      name: 'Engagement Elegance Makeup',
      slug: 'engagement-makeup',
      price: 6000,
      duration: '2 Hours',
      description: 'Sophisticated and graceful makeup that highlights your natural radiance for your ring ceremony and pre-wedding photo moments. Elegant, camera-ready, and lightweight.',
      features: JSON.stringify([
        'HD Soft Radiant Glow Finish',
        'Romantic Soft Eye Palette & Liner',
        'Braided or Half-Up Glam Hair Styling',
        'Draping Assistance Included',
        'Water-Resistant All-Day Wear'
      ]),
      image_url: '/images/dusty_rose_chudithar.jpg'
    },
    {
      name: 'Festive & Party Makeup',
      slug: 'party-makeup',
      price: 2500,
      duration: '1.5 Hours',
      description: 'Perfect for family celebrations, cocktail parties, festive gatherings, and anniversaries. Flawless complexion with chic eye makeup and sleek hair styling.',
      features: JSON.stringify([
        'Camera-ready Soft Matte Base',
        'Customized Eye Look & Liner',
        'Basic Hair Straightening or Waves',
        'Long-lasting Lip Shade'
      ]),
      image_url: '/images/makeup_flatlay_luxury.jpg'
    },
    {
      name: 'Bridal Trial Consultation & Makeup',
      slug: 'trial-makeup',
      price: 2000,
      duration: '1.5 Hours',
      description: 'Experience your prospective bridal look beforehand with our head artist. We assess your skin tone, wedding outfit swatches, and craft a bespoke look tailored to your preferences.',
      features: JSON.stringify([
        'Detailed Skin Tone & Outfit Consultation',
        'Half-Face Dual Style Trial',
        'Hairstyle Feasibility Discussion',
        'Personalized Bridal Care Advisory'
      ]),
      image_url: '/images/bridal_saree_styling.jpg'
    },
    {
      name: 'Bridesmaid & Family Group Makeup',
      slug: 'bridesmaid-makeup',
      price: 2000,
      duration: '1 Hour per person',
      description: 'Coordinated chic glam for bridesmaids, mother of the bride, and immediate family members. Synchronized styling to complement the wedding theme effortlessly.',
      features: JSON.stringify([
        'Natural HD Flawless Base',
        'Subtle Shimmer Eye Accents',
        'Quick Elegant Hairstyling',
        'Group Booking Discount Available'
      ]),
      image_url: '/images/lavender_anarkali_suit.jpg'
    }
  ];

  services.forEach(srv => {
    insertService.run(srv.name, srv.slug, srv.price, srv.duration, srv.description, srv.features, srv.image_url);
  });
  console.log(`[Seed] ${services.length} Makeup services seeded.`);

  // 4. Seed Products (Chudithar Sets & Makeup Products)
  const insertProduct = db.prepare(`
    INSERT INTO products (
      name, category, subcategory, price, original_price, discount_percent,
      description, details, sizes, colors, stock, image_url, additional_images,
      featured, is_new, rating, review_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    // --- CHUDITHAR SETS ---
    {
      name: 'Pure Malmal Cotton Handblock Chudithar Set',
      category: 'chudithar',
      subcategory: 'Cotton Daily Wear',
      price: 599,
      original_price: 999,
      discount_percent: 40,
      description: 'Crafted from 100% breathable Malmal cotton with artisanal handblock floral prints. Ideal for everyday office wear, college, and casual outings in warm climates.',
      details: 'Fabric: Pure Malmal Cotton. Set Includes: Kurta, Matching Chudithar Bottom, and Lightweight Mulmul Dupatta. Care: Hand wash separately with mild detergent.',
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Soft Blush', 'Sky Indigo', 'Mint Sage']),
      stock: 25,
      image_url: '/images/cotton_daily_chudithar.jpg',
      additional_images: JSON.stringify([
        '/images/ivory_chikankari_kurta.jpg'
      ]),
      featured: 1,
      is_new: 1,
      rating: 4.9,
      review_count: 42
    },
    {
      name: 'Rose Gold Shimmer Embroidered Anarkali Set',
      category: 'chudithar',
      subcategory: 'Anarkali Sets',
      price: 1299,
      original_price: 2199,
      discount_percent: 41,
      description: 'Sweeping floor-length Georgette Anarkali highlighted with intricate zari and sequence work on the yoke, paired with matching pants and a heavy border dupatta.',
      details: 'Fabric: Heavy Faux Georgette with Santoon Inner. Flare: 3.8 Meters. Work: Zari, Sequence & Resham Embroidery. Occasion: Festivals, Sangeet, Receptions.',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Rose Gold', 'Crimson Red', 'Powder Blue']),
      stock: 14,
      image_url: '/images/hero_boutique_dress.jpg',
      additional_images: JSON.stringify([
        '/images/lavender_anarkali_suit.jpg'
      ]),
      featured: 1,
      is_new: 1,
      rating: 4.8,
      review_count: 36
    },
    {
      name: 'Mulberry Wine Georgette Party Kurta Set',
      category: 'chudithar',
      subcategory: 'Party Wear',
      price: 899,
      original_price: 1499,
      discount_percent: 40,
      description: 'Make a graceful statement in this deep wine georgette straight kurta featuring delicate neckline hand embroidery and bell sleeves, paired with silk-blend chudithar pants.',
      details: 'Fabric: Micro Georgette with Silk Blend Trousers. Neckline: Keyhole with Pearl Detailing. Sleeves: Three-Quarter Flared. Wash: Gentle machine wash.',
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Mulberry Wine', 'Teal Green', 'Royal Navy']),
      stock: 18,
      image_url: '/images/party_georgette_suit.jpg',
      additional_images: JSON.stringify([]),
      featured: 1,
      is_new: 0,
      rating: 4.7,
      review_count: 29
    },
    {
      name: 'Dusty Rose Resham & Mirror Work Chudithar Set',
      category: 'chudithar',
      subcategory: 'Embroidered Festive',
      price: 1499,
      original_price: 2499,
      discount_percent: 40,
      description: 'Dazzle at festive gatherings with real mirror-work highlights and pastel Resham thread work along the neckline and cuffs. Paired with a contrast tissue dupatta.',
      details: 'Fabric: Chanderi Silk Blend with Cotton Lining. Embroidery: Foil Mirror & Zari Resham. Dupatta: Banarasi Weave Organza.',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Dusty Rose', 'Champagne Gold', 'Sage Green']),
      stock: 12,
      image_url: '/images/dusty_rose_chudithar.jpg',
      additional_images: JSON.stringify([]),
      featured: 0,
      is_new: 1,
      rating: 4.9,
      review_count: 19
    },
    {
      name: 'Classic Crimson Straight-Cut Kurta Pant Set',
      category: 'chudithar',
      subcategory: 'Straight Cut Kurta',
      price: 899,
      original_price: 1399,
      discount_percent: 36,
      description: 'A timeless silhouette featuring clean straight tailoring, side slits, mandarin collar, and pocket-equipped cigarette pants for smart daily and office elegance.',
      details: 'Fabric: Rayon Slub with Cotton Touch. Fit: Regular Straight. Pants: Half-elasticated waistband with deep right pocket.',
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Crimson Red', 'Mustard Yellow', 'Forest Green']),
      stock: 30,
      image_url: '/images/crimson_straight_kurta.jpg',
      additional_images: JSON.stringify([]),
      featured: 1,
      is_new: 0,
      rating: 4.6,
      review_count: 51
    },
    {
      name: 'Regal Burgundy Heavy Zardozi Wedding Chudithar Set',
      category: 'chudithar',
      subcategory: 'Bridal Wedding Wear',
      price: 1999,
      original_price: 3499,
      discount_percent: 43,
      description: 'A regal ensemble woven for weddings and grand receptions. Features antique gold zardozi, kora work, and stone embellishments on pure silk base with heavy jacquard dupatta.',
      details: 'Fabric: Raw Silk Blend with Satin Silk Lining. Embellishment: Handcrafted Zardozi, Cutdana & Kundan. Includes: Kurta, Sharara/Chudithar, Heavy Brocade Dupatta.',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Deep Burgundy', 'Emerald Green', 'Royal Maroon']),
      stock: 8,
      image_url: '/images/bridal_wedding_suit.jpg',
      additional_images: JSON.stringify([]),
      featured: 1,
      is_new: 1,
      rating: 5.0,
      review_count: 22
    },
    {
      name: 'Pastel Lavender Tiered Anarkali Suit',
      category: 'chudithar',
      subcategory: 'Anarkali Sets',
      price: 1299,
      original_price: 1999,
      discount_percent: 35,
      description: 'Charming three-tiered Anarkali silhouette in soft lilac lavender, complemented with silver gota patti borders and a matching chiffon dupatta with tassels.',
      details: 'Fabric: Pure Cambric Cotton. Sleeves: Full Churidar Sleeves. Length: Ankle Length. Neck: Sweetheart Neckline.',
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Pastel Lavender', 'Peach Sorbet', 'Baby Pink']),
      stock: 16,
      image_url: '/images/lavender_anarkali_suit.jpg',
      additional_images: JSON.stringify([]),
      featured: 0,
      is_new: 1,
      rating: 4.8,
      review_count: 15
    },
    {
      name: 'Ivory Gold Chikankari Straight Kurta Set',
      category: 'chudithar',
      subcategory: 'Straight Cut Kurta',
      price: 1199,
      original_price: 1899,
      discount_percent: 37,
      description: 'Elegance personified in fine Lucknowi style white-on-cream Chikankari embroidery with delicate mukaish dots, paired with cropped palazzo pants and mukaish chiffon dupatta.',
      details: 'Fabric: Modal Cotton Georgette. Hand Embroidered in Lucknow Style. Dry clean recommended for first wash.',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Ivory Cream', 'Pastel Pink', 'Soft Pistachio']),
      stock: 20,
      image_url: '/images/ivory_chikankari_kurta.jpg',
      additional_images: JSON.stringify([]),
      featured: 0,
      is_new: 0,
      rating: 4.9,
      review_count: 31
    },

    // --- MAKEUP PRODUCTS ---
    {
      name: 'Sasti Velvet Matte Lip Crayon - Berry Romance',
      category: 'makeup',
      subcategory: 'Lipstick',
      price: 399,
      original_price: 599,
      discount_percent: 33,
      description: 'Intense pigmented velvet matte finish that glides like butter and stays put for up to 12 hours. Enriched with Vitamin E and Jojoba Oil for zero drying and zero flaking.',
      details: 'Shade: Berry Romance (Deep Plum Pink). Finish: Ultra-Matte Comfort. Weight: 3.5g. Free from Parabens and Sulfates. [Demo Formulation]',
      sizes: JSON.stringify(['Standard 3.5g']),
      colors: JSON.stringify(['Berry Romance', 'Royal Ruby', 'Nude Caramel', 'Wine Diva']),
      stock: 45,
      image_url: '/images/lip_crayon_makeup.jpg',
      additional_images: JSON.stringify([
        '/images/makeup_flatlay_luxury.jpg'
      ]),
      featured: 1,
      is_new: 1,
      rating: 4.9,
      review_count: 58
    },
    {
      name: 'Sasti Satin Luxe Moisture Lipstick - Rose Nude',
      category: 'makeup',
      subcategory: 'Lipstick',
      price: 349,
      original_price: 499,
      discount_percent: 30,
      description: 'A creamy, ultra-nourishing lipstick infused with shea butter and argan oil. Delivers a natural satin sheen that plumps and hydrates lips all day.',
      details: 'Shade: Rose Nude. Finish: Satin Cream. Ingredients: Shea Butter, Argan Oil, Hyaluronic spheres. [Demo Product]',
      sizes: JSON.stringify(['Standard 4g']),
      colors: JSON.stringify(['Rose Nude', 'Spiced Cinnamon', 'Coral Flush']),
      stock: 35,
      image_url: '/images/lip_crayon_makeup.jpg',
      additional_images: JSON.stringify([]),
      featured: 0,
      is_new: 0,
      rating: 4.7,
      review_count: 24
    },
    {
      name: 'Sasti Flawless HD Skin Radiance Liquid Foundation',
      category: 'makeup',
      subcategory: 'Foundation',
      price: 699,
      original_price: 999,
      discount_percent: 30,
      description: 'Second-skin natural radiant finish with buildable medium-to-full coverage. Formulated specifically for Indian undertones to resist humidity and sweat.',
      details: 'Coverage: Medium to Full Buildable. Finish: Natural Dewy Glow. Volume: 30ml. SPF 25 PA+++. [Demo Formulation]',
      sizes: JSON.stringify(['30ml Pump Bottle']),
      colors: JSON.stringify(['Warm Sand (01)', 'Golden Honey (02)', 'Rich Caramel (03)', 'Deep Amber (04)']),
      stock: 28,
      image_url: '/images/makeup_flatlay_luxury.jpg',
      additional_images: JSON.stringify([]),
      featured: 1,
      is_new: 1,
      rating: 4.8,
      review_count: 47
    },
    {
      name: 'Sasti Mineral Glow Oil-Control Compact Powder',
      category: 'makeup',
      subcategory: 'Compact Powder',
      price: 399,
      original_price: 549,
      discount_percent: 27,
      description: 'Micro-milled silky mineral powder that sets makeup, blurs pores, and controls shine for up to 10 hours without cakey buildup. Mirror and puff included.',
      details: 'Finish: Matte-Blur. Weight: 9g. Includes plush applicator puff and mirror. Enriched with SPF 15.',
      sizes: JSON.stringify(['Standard 9g']),
      colors: JSON.stringify(['Light Beige', 'Natural Beige', 'Warm Honey']),
      stock: 40,
      image_url: '/images/makeup_flatlay_luxury.jpg',
      additional_images: JSON.stringify([]),
      featured: 0,
      is_new: 0,
      rating: 4.7,
      review_count: 38
    },
    {
      name: 'Sasti 24H Intense Carbon Black Waterproof Kajal',
      category: 'makeup',
      subcategory: 'Kajal & Eyeliner',
      price: 249,
      original_price: 399,
      discount_percent: 38,
      description: 'Smudge-proof, waterproof, tear-resistant herbal kajal enriched with soothing almond oil and triphala. Glides effortlessly with one-stroke jet black intensity.',
      details: 'Color: Carbon Jet Black. Wear: 24-Hour Stay. Opthalmologically tested. Safe for contact lens wearers.',
      sizes: JSON.stringify(['Retractable 0.35g']),
      colors: JSON.stringify(['Jet Black']),
      stock: 60,
      image_url: '/images/makeup_flatlay_luxury.jpg',
      additional_images: JSON.stringify([]),
      featured: 1,
      is_new: 0,
      rating: 4.9,
      review_count: 73
    },
    {
      name: 'Sasti Mega Lash Volume & Curl Waterproof Mascara',
      category: 'makeup',
      subcategory: 'Mascara',
      price: 449,
      original_price: 649,
      discount_percent: 31,
      description: 'Custom hourglass brush separates, lifts, and volumizes each lash from root to tip. Clump-free, zero-flake, humidity-resistant formula for dramatic Indian bridal eyes.',
      details: 'Shade: Deep Black. Wand: Hourglass Silicone Bristles. Weight: 8.5ml. Waterproof & Smudge-proof.',
      sizes: JSON.stringify(['8.5ml']),
      colors: JSON.stringify(['Midnight Black']),
      stock: 30,
      image_url: '/images/makeup_flatlay_luxury.jpg',
      additional_images: JSON.stringify([]),
      featured: 0,
      is_new: 1,
      rating: 4.8,
      review_count: 26
    },
    {
      name: 'Sasti Duo Cheek Flush Blush & Shimmer Highlighter',
      category: 'makeup',
      subcategory: 'Blush & Highlighter',
      price: 499,
      original_price: 799,
      discount_percent: 38,
      description: 'Dual pan palette pairing a silky rose-peach matte blush with a luminous champagne gold highlighter. Gives your cheeks a fresh festive, lit-from-within glow.',
      details: 'Net Weight: 10g (5g Blush + 5g Highlighter). Seamless blending, pigmented yet buildable formula.',
      sizes: JSON.stringify(['Compact Duo 10g']),
      colors: JSON.stringify(['Peach & Gold', 'Rose & Champagne', 'Berry & Bronze']),
      stock: 22,
      image_url: '/images/makeup_flatlay_luxury.jpg',
      additional_images: JSON.stringify([]),
      featured: 1,
      is_new: 0,
      rating: 4.9,
      review_count: 33
    },
    {
      name: 'Sasti Royal Indian Festive 18-Shade Eyeshadow Palette',
      category: 'makeup',
      subcategory: 'Eyeshadow Palettes',
      price: 899,
      original_price: 1499,
      discount_percent: 40,
      description: 'Curated 18-pan luxury palette featuring rich maroons, antique golds, warm terracotta mattes, and dazzling foiled metallic glitters for stunning ethnic looks.',
      details: '10 Butter-Soft Mattes + 6 Metallic Foils + 2 Duo-Chrome Glitters. Highly pigmented with minimal fallout.',
      sizes: JSON.stringify(['18-Pan Palette (22g)']),
      colors: JSON.stringify(['Royal Festive Palette']),
      stock: 25,
      image_url: '/images/eyeshadow_palette_luxury.jpg',
      additional_images: JSON.stringify([]),
      featured: 1,
      is_new: 1,
      rating: 5.0,
      review_count: 45
    },
    {
      name: 'Sasti Professional 12-Piece Rose Gold Brush Kit',
      category: 'makeup',
      subcategory: 'Makeup Brushes',
      price: 799,
      original_price: 1299,
      discount_percent: 38,
      description: 'Complete 12-piece professional brush kit with ultra-soft cruelty-free vegan bristles, ergonomic rose gold ferrules, and a chic travel cylinder pouch.',
      details: 'Includes Foundation buffer, Powder brush, Blush/Contour brush, 5 Precision eye brushes, Eyebrow spoolie, Lip brush, Fan highlighter brush + Luxury pouch.',
      sizes: JSON.stringify(['12-Piece Kit + Pouch']),
      colors: JSON.stringify(['Rose Gold & Pearl White']),
      stock: 19,
      image_url: '/images/rosegold_brush_kit.jpg',
      additional_images: JSON.stringify([]),
      featured: 0,
      is_new: 0,
      rating: 4.8,
      review_count: 39
    },
    {
      name: 'Sasti Dewy Glow All-Day Makeup Setting Mist',
      category: 'makeup',
      subcategory: 'Primer & Spray',
      price: 399,
      original_price: 599,
      discount_percent: 33,
      description: 'Micro-fine mist infused with Rose Water, Niacinamide, and Green Tea extract that locks makeup for 16 hours while infusing an instant dewy, fresh bounce.',
      details: 'Volume: 100ml. Alcohol-free. Calms skin and prevents makeup from melting or caking.',
      sizes: JSON.stringify(['100ml Spray Bottle']),
      colors: JSON.stringify(['Translucent Rose']),
      stock: 35,
      image_url: '/images/makeup_flatlay_luxury.jpg',
      additional_images: JSON.stringify([]),
      featured: 0,
      is_new: 1,
      rating: 4.7,
      review_count: 18
    },
    {
      name: 'Sasti Complete Bridal & Festive Beauty Vanity Box',
      category: 'makeup',
      subcategory: 'Makeup Kits',
      price: 1899,
      original_price: 2999,
      discount_percent: 37,
      description: 'All-in-one curated luxury vanity box containing HD Foundation, Compact, 2 Velvet Lipsticks, Kajal, Eyeliner, Mascara, Blush Palette, and 4 Mini Brushes in a golden keepsake box.',
      details: 'Value pack with 8 full-sized products. Perfect gift for brides-to-be, sisters, and wedding attendees.',
      sizes: JSON.stringify(['Full Bridal Vanity Kit']),
      colors: JSON.stringify(['Golden Keepsake Box']),
      stock: 15,
      image_url: '/images/makeup_flatlay_luxury.jpg',
      additional_images: JSON.stringify(['/images/rosegold_brush_kit.jpg']),
      featured: 1,
      is_new: 1,
      rating: 5.0,
      review_count: 62
    }
  ];

  products.forEach(p => {
    insertProduct.run(
      p.name,
      p.category,
      p.subcategory,
      p.price,
      p.original_price,
      p.discount_percent,
      p.description,
      p.details,
      p.sizes,
      p.colors,
      p.stock,
      p.image_url,
      p.additional_images,
      p.featured,
      p.is_new,
      p.rating,
      p.review_count
    );
  });
  console.log(`[Seed] ${products.length} Products seeded (Chudithar sets & Makeup).`);

  // 5. Seed Demo Orders
  const insertOrder = db.prepare(`
    INSERT INTO orders (
      order_ref, customer_name, phone, email, address_house, address_street,
      city, state, pincode, delivery_instructions, payment_method, payment_status,
      subtotal, delivery_fee, discount_amount, total_amount, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOrderItem = db.prepare(`
    INSERT INTO order_items (
      order_id, product_id, product_name, price, quantity, selected_size, selected_color, image_url, subtotal
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const demoOrder = insertOrder.run(
    'SB-ORD-202610-1001',
    'Priya Sundaram',
    '9840123456',
    'priya.sundaram@example.com',
    'Flat 4B, Lakshmi Apartments',
    'Anna Salai, T. Nagar',
    'Chennai',
    'Tamil Nadu',
    '600017',
    'Please ring the doorbell twice.',
    'COD',
    'Pending',
    2198,
    0, // Free delivery for orders over ₹999
    0,
    2198,
    'Confirmed'
  );

  insertOrderItem.run(
    demoOrder.lastInsertRowid,
    1,
    'Pure Malmal Cotton Handblock Chudithar Set',
    599,
    1,
    'M',
    'Soft Blush',
    '/images/cotton_daily_chudithar.jpg',
    599
  );

  insertOrderItem.run(
    demoOrder.lastInsertRowid,
    2,
    'Rose Gold Shimmer Embroidered Anarkali Set',
    1299,
    1,
    'L',
    'Rose Gold',
    '/images/hero_boutique_dress.jpg',
    1299
  );

  insertOrderItem.run(
    demoOrder.lastInsertRowid,
    10,
    'Sasti Velvet Matte Lip Crayon - Berry Romance',
    399,
    1,
    'Standard 3.5g',
    'Berry Romance',
    '/images/lip_crayon_makeup.jpg',
    399
  );

  // 6. Seed Demo Bridal Booking
  const insertBooking = db.prepare(`
    INSERT INTO makeup_bookings (
      booking_ref, customer_name, contact_number, email, service_id, service_name,
      event_date, event_time, event_location, guest_count, additional_requirements, budget, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBooking.run(
    'SB-BRK-202611-001',
    'Ananya Natarajan',
    '7904871123',
    'ananya.natarajan@example.com',
    1,
    'Bridal Makeup Experience',
    '2026-11-15',
    '05:30 AM',
    'Sri Krishna Kalyana Mandapam, Mylapore, Chennai',
    3,
    'Traditional South Indian Muhurtham silk saree look with temple jewelry pinning and jasmine flower styling.',
    '₹18,000',
    'Confirmed'
  );

  insertBooking.run(
    'SB-BRK-202612-002',
    'Kavitha Ramesh',
    '9884567890',
    'kavitha.ramesh@example.com',
    2,
    'Reception Glam Makeup',
    '2026-12-02',
    '04:00 PM',
    'Hotel Leela Palace Grand Ballroom, Chennai',
    2,
    'Evening party look with soft shimmer smokey eye and messy textured bun.',
    '₹10,000',
    'Pending'
  );

  // 7. Seed Demo Contact Message
  const insertContact = db.prepare(`
    INSERT INTO contact_messages (name, email, phone, subject, message, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertContact.run(
    'Meenakshi Iyer',
    'meenakshi.iyer@example.com',
    '9790123456',
    'Bridal Makeup Customization & Saree Draping',
    'Hello Sasti Boutique team! I am planning my wedding in Coimbatore for next month. Can your bridal artists travel to Coimbatore for our muhurtham?',
    'New'
  );

  console.log('[Seed] Database seeding completed successfully!');
}

if (require.main === module) {
  try {
    seedDatabase();
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  }
}

module.exports = seedDatabase;
