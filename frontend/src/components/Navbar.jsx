import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar({ currentPage, setCurrentPage, onSearchClick }) {
  const { cartCount, setDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNav = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearchClick) onSearchClick(searchQuery.trim());
      handleNav('shop');
    }
  };

  return (
    <>
      {/* Top Announcement Ribbon */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Phone size={13} style={{ color: 'var(--color-gold)' }} />
              <strong>7904871123</strong>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, opacity: 0.9 }}>
              <Mail size={13} style={{ color: 'var(--color-gold)' }} />
              nisanth08.connect@gamil.com
            </span>
          </div>
          <div>
            <span>✨ <strong>FREE SHIPPING</strong> ON ALL ORDERS ABOVE ₹999 | COD AVAILABLE ALL OVER INDIA</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button 
              onClick={() => handleNav('track')}
              style={{ color: 'var(--color-primary)', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Calendar size={13} /> Track Order / Booking
            </button>
            <button 
              onClick={() => handleNav('admin')}
              style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', fontWeight: 500 }}
            >
              Owner Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav className="navbar">
        <div className="container navbar-inner">
          {/* Mobile Menu Button */}
          <button 
            className="icon-btn mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none' }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Brand Logo */}
          <div 
            className="brand-logo" 
            onClick={() => handleNav('home')}
            style={{ cursor: 'pointer' }}
          >
            <svg viewBox="0 0 100 100" style={{ width: 44, height: 44, borderRadius: 12 }}>
              <defs>
                <linearGradient id="navChampagne" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DFCEBA" />
                  <stop offset="50%" stopColor="#F7F0E7" />
                  <stop offset="100%" stopColor="#CDAF8E" />
                </linearGradient>
                <linearGradient id="navDustyRose" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#B57779" />
                  <stop offset="100%" stopColor="#8F5254" />
                </linearGradient>
              </defs>
              <rect width="100" height="100" rx="26" fill="url(#navDustyRose)" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="url(#navChampagne)" strokeWidth="2" strokeDasharray="4 2" opacity="0.7"/>
              <text x="50" y="62" fontFamily="'Playfair Display', Georgia, serif" fontSize="42" fontWeight="bold" fill="url(#navChampagne)" textAnchor="middle">SB</text>
            </svg>
            <div className="brand-text-wrap">
              <span className="brand-title">Sasti Boutique</span>
              <span className="brand-subtitle">Ethnic Wear & Bridal Artistry</span>
            </div>
          </div>

          {/* Navigation Links */}
          <ul className="nav-links">
            <li>
              <button 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => handleNav('home')}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'shop' ? 'active' : ''}`}
                onClick={() => handleNav('shop')}
              >
                Shop All
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'chudithar' ? 'active' : ''}`}
                onClick={() => handleNav('chudithar')}
              >
                Chudithar Sets
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'makeup' ? 'active' : ''}`}
                onClick={() => handleNav('makeup')}
              >
                Makeup Products
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'bridal' ? 'active' : ''}`}
                onClick={() => handleNav('bridal')}
                style={{ color: 'var(--color-primary)', fontWeight: 700 }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Sparkles size={14} style={{ color: 'var(--color-gold)' }} /> Bridal Makeup
                </span>
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
                onClick={() => handleNav('about')}
              >
                About Us
              </button>
            </li>
            <li>
              <button 
                className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
                onClick={() => handleNav('contact')}
              >
                Contact
              </button>
            </li>
          </ul>

          {/* Search & Actions */}
          <div className="nav-actions">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search chudithar, lipstick..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '9px 16px 9px 38px',
                  borderRadius: '9999px',
                  border: '1.5px solid var(--color-blush-border)',
                  fontSize: '0.88rem',
                  width: '210px',
                  background: '#FFFFFF',
                  outline: 'none',
                  transition: 'all 0.25s ease'
                }}
                onFocus={(e) => { e.target.style.width = '260px'; e.target.style.borderColor = 'var(--color-primary)'; }}
                onBlur={(e) => { if (!e.target.value) e.target.style.width = '210px'; e.target.style.borderColor = 'var(--color-blush-border)'; }}
              />
              <Search 
                size={16} 
                style={{ position: 'absolute', left: 14, color: 'var(--color-text-muted)', pointerEvents: 'none' }} 
              />
            </form>

            {/* Wishlist Icon */}
            <button 
              className="icon-btn" 
              onClick={() => handleNav('wishlist')} 
              title="My Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && <span className="icon-badge">{wishlistCount}</span>}
            </button>

            {/* Cart Icon */}
            <button 
              className="icon-btn" 
              onClick={() => setDrawerOpen(true)} 
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
            </button>

            {/* Owner / Admin */}
            <button 
              className="icon-btn" 
              onClick={() => handleNav('admin')} 
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(61, 48, 45, 0.45)',
            backdropFilter: 'blur(6px)',
            zIndex: 1999
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '80%',
              maxWidth: 320,
              background: '#FFFFFF',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 0 30px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid #F0E4DE', paddingBottom: 14 }}>
              <div className="brand-logo">
                <span className="brand-title" style={{ fontSize: '1.4rem' }}>Sasti Boutique</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li>
                <button 
                  onClick={() => handleNav('home')} 
                  style={{ width: '100%', textAlign: 'left', padding: '10px 0', fontSize: '1.05rem', fontWeight: 600, color: currentPage === 'home' ? 'var(--color-primary)' : 'inherit' }}
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('shop')} 
                  style={{ width: '100%', textAlign: 'left', padding: '10px 0', fontSize: '1.05rem', fontWeight: 600, color: currentPage === 'shop' ? 'var(--color-primary)' : 'inherit' }}
                >
                  Shop All Collections
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('chudithar')} 
                  style={{ width: '100%', textAlign: 'left', padding: '10px 0', fontSize: '1.05rem', fontWeight: 600, color: currentPage === 'chudithar' ? 'var(--color-primary)' : 'inherit' }}
                >
                  Chudithar Sets (Daily & Wedding)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('makeup')} 
                  style={{ width: '100%', textAlign: 'left', padding: '10px 0', fontSize: '1.05rem', fontWeight: 600, color: currentPage === 'makeup' ? 'var(--color-primary)' : 'inherit' }}
                >
                  Makeup Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('bridal')} 
                  style={{ width: '100%', textAlign: 'left', padding: '10px 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)' }}
                >
                  ✨ Bridal Makeup Booking
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('about')} 
                  style={{ width: '100%', textAlign: 'left', padding: '10px 0', fontSize: '1.05rem', fontWeight: 600 }}
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('contact')} 
                  style={{ width: '100%', textAlign: 'left', padding: '10px 0', fontSize: '1.05rem', fontWeight: 600 }}
                >
                  Contact & Store Info
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('track')} 
                  style={{ width: '100%', textAlign: 'left', padding: '10px 0', fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-gold)' }}
                >
                  Track Order / Makeup Booking
                </button>
              </li>
            </ul>

            <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid #F0E4DE', fontSize: '0.85rem' }}>
              <p style={{ fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 4 }}>Call or WhatsApp:</p>
              <p style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: 12 }}>7904871123</p>
              <button 
                className="btn btn-secondary btn-block btn-sm"
                onClick={() => handleNav('admin')}
              >
                Owner / Admin Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Style for mobile button visibility */}
      <style>{`
        @media (max-width: 900px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
