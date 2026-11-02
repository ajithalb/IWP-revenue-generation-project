# 🌸 Sasti Boutique — Complete E-Commerce & Bridal Makeup Web Application

A complete, fully functional local e-commerce platform and bridal makeup reservation system built for **Sasti Boutique** — celebrating ethnic Indian fashion, everyday cosmetics, and bespoke bridal makeovers.

Designed for instant local execution on Windows laptops with **Zero paid APIs**, **Zero external database servers required** (embedded SQLite database), and **Cash on Delivery (COD)** checkout.

---

## 1. Business & Brand Details

- **Shop Name**: Sasti Boutique
- **Tagline**: *"Your Style, Your Beauty, Your Special Day."*
- **Contact Number**: `7904871123`
- **Email Address**: `nisanth08.connect@gamil.com` *(spelled exactly as instructed)*
- **Location**: Chennai, Tamil Nadu, India
- **Currency**: Indian Rupees (`₹` / INR)
- **Target Audience**: Indian women seeking authentic ethnic wear (Anarkali & daily Malmal cotton chudithar sets), skin-loving cosmetics, and certified bridal makeover artistry.
- **Color Aesthetics**: Blush Pink (`#FDF8F7`), Warm Cream (`#FAF7F2`), Regal Burgundy (`#7A162B`), and Heritage Gold (`#D4AF37`).

---

## 2. Technology Stack

- **Frontend**:
  - React.js 18+ powered by **Vite**
  - Modern bespoke CSS Design System (CSS custom properties, glassmorphism, responsive grid, micro-animations)
  - Google Fonts: *Playfair Display* (luxury serif) & *Plus Jakarta Sans* (modern UI)
  - Lucide React Icons
  - Axios for REST API communication with automatic JWT injection
- **Backend**:
  - Node.js & Express.js
  - RESTful API architecture with CORS, request logging, and server-side validation
  - Embedded **SQLite** database (`better-sqlite3` with native `node:sqlite` fallback)
  - Password hashing with **Bcrypt.js** (10 salt rounds)
  - Admin token authorization with **JSON Web Tokens (JWT)**
- **Database**:
  - Persistent SQLite local file at `backend/database/sasti_boutique.db`
  - Tables: `products`, `makeup_services`, `makeup_bookings`, `orders`, `order_items`, `admins`, `contact_messages`, `newsletter_subscribers`

---

## 3. Key Features

### 👗 Chudithar Sets Shopping
- Realistic ethnic collections: Cotton Daily Wear, Anarkali Sets, Party Wear, Embroidered Festive, Straight Cut Kurta, and Heavy Zardozi Wedding Wear.
- Demo price points: ₹599, ₹899, ₹1,299, ₹1,499, ₹1,999, ₹2,499.
- Functional filters: Category/Collection, Sizes (**XS, S, M, L, XL, XXL**), Price Range Presets, and In-Stock Only.
- Sorting: Featured, Price (Low to High), Price (High to Low), Newest Arrivals, and Most Popular.
- Product Quick View modal with multi-angle image gallery, shade/color swatches, stock counter, and size guide.

### 💄 Makeup Products
- Beauty categories: Lipsticks & Lip Stains, HD Liquid Foundations, Mineral Compact Powder, 24H Waterproof Kajal & Eyeliners, Volume Mascara, Blush & Highlighters, Eyeshadow Palettes, Professional Brush Kits, Setting Mist, and Complete Bridal Vanity Boxes.
- Dedicated demo product notices indicating sample boutique formulations.
- Live shade selector, stock alerts, Add to Cart, Buy Now, and Wishlist toggles.

### 🛒 Working Shopping Cart
- Adds items with selected size and color variant.
- Stock validation prevents adding more than available warehouse stock.
- Live free shipping progress meter: **Free Express Delivery on orders above ₹999** (₹70 delivery fee for smaller orders).
- Cart drawer slide-over and full Cart Page view with quantity increment/decrement, item deletion, and clear cart options.
- **100% Persistent across page refreshes** via synchronized local storage.

### 🛍️ Buy Now & Checkout
- Full Indian address form: Customer Full Name, 10-digit Phone, Email, Flat/House No, Street/Area, City, State dropdown, and 6-digit PIN code.
- **Server-side price and stock calculation** in an atomic SQLite transaction (prevents client price tampering).
- Safe stock decrement upon successful order placement.
- **Cash on Delivery (COD)** as working, active option; plus marked Mock Payment testing mode.
- Unique Order Reference generator (e.g. `SB-ORD-202610-1001`).
- Printable and downloadable tax invoice receipt summary with live tracking links.

### 👰 Bridal Makeup Booking System
- 6 complete makeover packages:
  1. *Bridal Makeup Experience*: ₹15,000 (3.5 - 4 Hours)
  2. *Reception Glam Makeup*: ₹8,000 (2.5 Hours)
  3. *Engagement Elegance Makeup*: ₹6,000 (2 Hours)
  4. *Festive & Party Makeup*: ₹2,500 (1.5 Hours)
  5. *Bridal Trial Consultation & Makeup*: ₹2,000 (1.5 Hours)
  6. *Bridesmaid & Family Group Makeup*: ₹2,000 per person (1 Hour)
- Interactive reservation form capturing event date, preferred time slot (morning Muhurtham to evening reception), venue location, guest count, and saree draping notes.
- Slot collision and duplicate booking checking.
- Generates unique reference (e.g. `SB-BRK-202611-001`) with initial status **Pending**.

### 🔍 Order & Booking Tracking
- Dual lookup tool by Order ID, Booking ID, or 10-digit Customer Phone.
- Visual stepper timeline for package delivery (*Order Placed -> Confirmed -> Shipped -> Delivered*).
- Live booking appointment status (*Pending -> Confirmed -> Completed*).

### 🔒 Protected Owner Admin Dashboard
- Secure login protected with bcrypt hashed passwords and JWT tokens.
- **Overview Analytics**: Total revenue in ₹, total orders, pending orders, bridal bookings count, low-stock inventory alerts.
- **Product Management**: Add new products, edit titles, update prices in ₹, modify stock with quick `+/-` buttons, toggle homepage featured status, delete products.
- **Order Management**: View full customer details, shipping address, order items list, and change status (*Pending, Confirmed, Shipped, Delivered, Cancelled*).
- **Bridal Appointment Management**: Review bridal bookings, event dates, mandapam locations, and confirm or complete appointments.
- **Service Price Manager**: Easily edit bridal package prices and durations directly from the dashboard.
- **Inquiry Desk**: View contact messages submitted through the Contact Us page and mark them as Read/Replied.

---

## 4. Quick Localhost Setup Guide (Windows)

### Prerequisites
Make sure **Node.js** (version 18, 20, or 22) is installed on your computer:
```powershell
node -v
npm -v
```
*(If you need Node.js, download the LTS installer from [https://nodejs.org/](https://nodejs.org/)).*

---

### Option A: 1-Click Launch with Startup Script (Easiest)

Simply open PowerShell or Command Prompt in the `d:\iwp_project` directory and run:

**Using PowerShell:**
```powershell
.\start.ps1
```

**Or Double-Click:**
Double-click `start.bat` in Windows File Explorer.

The launcher will automatically verify dependencies, seed the SQLite database, launch the backend on port 5001, launch the frontend on port 5173, and open `http://localhost:5173` in your default browser!

---

### Option B: Manual Step-by-Step Execution

1. **Install root, backend, and frontend dependencies**:
   ```powershell
   npm install
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

2. **Configure Environment & Seed Database**:
   ```powershell
   copy backend\.env.example backend\.env
   cd backend
   npm run seed
   cd ..
   ```

3. **Start Both Servers Simultaneously**:
   ```powershell
   npm run dev
   ```

4. **Access the Application**:
   - **Customer Website**: [http://localhost:5173](http://localhost:5173)
   - **Backend REST API**: [http://localhost:5001/api](http://localhost:5001/api)
   - **Health Check**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 5. Admin Portal Credentials

To access the boutique management console:
- Click the **Owner Portal** link in the top announcement bar or user icon in the navigation bar.
- Or open directly: [http://localhost:5173](http://localhost:5173) and switch to the Admin page.

| Field | Default Value | Notes |
| :--- | :--- | :--- |
| **Username** | `admin` | Or email `admin@sastiboutique.com` |
| **Password** | `Admin@Sasti2026` | Encrypted with Bcrypt in SQLite database |

*(You can modify these credentials inside `backend/.env` and re-seed anytime with `cd backend && npm run seed`).*

---

## 6. Project Structure

```
d:\iwp_project\
├── backend/
│   ├── controllers/
│   │   ├── authController.js        # Admin login & JWT issuing
│   │   ├── productController.js     # Catalog browsing & CRUD
│   │   ├── orderController.js       # Atomic checkout & stock deduction
│   │   ├── bookingController.js     # Bridal appointment scheduler
│   │   ├── contactController.js     # Contact inquiries & newsletter
│   │   └── statsController.js       # Analytics KPI calculations
│   ├── database/
│   │   ├── db.js                    # SQLite connection & fallback handler
│   │   ├── schema.sql               # Relational SQLite tables & indexes
│   │   ├── seed.js                  # Pre-seeds 19 products, 6 services, demo orders
│   │   └── sasti_boutique.db        # SQLite database file
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT admin protection middleware
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── contactRoutes.js
│   │   └── statsRoutes.js
│   ├── app.js                       # Express configuration & CORS
│   ├── server.js                    # Server startup & port listener
│   ├── package.json
│   ├── .env.example
│   └── .env
├── frontend/
│   ├── public/
│   │   └── favicon.svg              # Boutique gold & burgundy monogram
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Sticky nav with live cart/wishlist count
│   │   │   ├── Footer.jsx           # Boutique info, phone, email & draft policies
│   │   │   ├── ProductCard.jsx      # Product card with badges, zoom & Buy Now
│   │   │   ├── ProductDetailModal.jsx # Quick view modal with size/shade selectors
│   │   │   ├── CartDrawer.jsx       # Slide-out bag preview with free delivery meter
│   │   │   ├── BookingModal.jsx     # Interactive bridal reservation form
│   │   │   └── Toast.jsx            # Animated user notification popups
│   │   ├── context/
│   │   │   ├── CartContext.jsx      # Stock checking, variants, localStorage
│   │   │   ├── WishlistContext.jsx  # Persistent favorited items
│   │   │   └── AuthContext.jsx      # Admin session manager
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Hero banner, 3 pillars, featured items
│   │   │   ├── ShopPage.jsx         # Unified shop with category filters
│   │   │   ├── ChuditharPage.jsx    # Dedicated ethnic wear catalog (XS-XXL)
│   │   │   ├── MakeupPage.jsx       # Cosmetics catalog with demo disclaimer
│   │   │   ├── BridalPage.jsx       # 6 makeover packages with instant booking
│   │   │   ├── CartPage.jsx         # Full shopping bag with quantity updater
│   │   │   ├── CheckoutPage.jsx     # Pan-India shipping address & COD payment
│   │   │   ├── OrderConfirmationPage.jsx # Printable tax invoice summary
│   │   │   ├── TrackOrderPage.jsx   # Dual tracker for orders and bridal bookings
│   │   │   ├── AboutPage.jsx        # Sasti Boutique craftsmanship & values
│   │   │   ├── ContactPage.jsx      # Direct studio contact & SQLite form
│   │   │   ├── WishlistPage.jsx     # Saved favorites
│   │   │   ├── PolicyPages.jsx      # Editable draft store policies
│   │   │   ├── AdminLoginPage.jsx   # Secure admin authentication
│   │   │   ├── AdminDashboardPage.jsx # Full management console
│   │   │   └── NotFoundPage.jsx     # Custom 404 page
│   │   ├── services/
│   │   │   └── api.js               # Central Axios client
│   │   ├── styles/
│   │   │   └── index.css            # Luxury boutique design system
│   │   ├── App.jsx                  # Main routing & state coordinator
│   │   └── main.jsx
│   ├── index.html                   # Google Fonts & SEO metadata
│   ├── vite.config.js               # Vite proxy to backend port 5001
│   └── package.json
├── package.json                     # Root orchestrator with concurrently
├── start.bat                        # 1-click Windows Batch launcher
├── start.ps1                        # 1-click Windows PowerShell launcher
├── setup.ps1                        # One-click dependency setup & seeder
└── README.md
```

---

## 7. Direct Support & Assistance

For any queries regarding product sizing, wedding makeup schedules, or custom saree draping:
- **Phone / WhatsApp**: `7904871123`
- **Email**: `nisanth08.connect@gamil.com`
- **Store Hours**: Monday – Sunday, 10:00 AM – 08:30 PM IST
