import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  Star, 
  Calendar, 
  ShieldCheck, 
  Heart, 
  Clock, 
  Award,
  ChevronRight
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { shopApi } from '../services/api';

export default function HomePage({ setCurrentPage, onQuickView, onBuyNow, onBookService }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [makeupProducts, setMakeupProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [chuditharRes, makeupRes, servicesRes] = await Promise.all([
          shopApi.getProducts({ category: 'chudithar', featured: 1 }),
          shopApi.getProducts({ category: 'makeup', featured: 1 }),
          shopApi.getServices()
        ]);

        setFeaturedProducts(chuditharRes.data.products || []);
        setMakeupProducts(makeupRes.data.products || []);
        setServices(servicesRes.data.services || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  return (
    <div>
      {/* 1. HERO BANNER */}
      <section className="hero-banner">
        <div className="container hero-grid">
          <div>
            <div className="hero-tagline">
              <Sparkles size={15} />
              <span>Festive 2026 Ethnic & Bridal Collection</span>
            </div>

            <h1 className="hero-title">
              Your Style, Your Beauty, <br />
              <span>Your Special Day.</span>
            </h1>

            <p className="hero-desc">
              Discover opulent Anarkalis, breathable Malmal cotton chudithar sets, skin-loving makeup essentials, and bespoke bridal makeover experiences tailored for Indian celebrations.
            </p>

            <div className="hero-btn-group">
              <button 
                className="btn btn-gold btn-lg"
                onClick={() => { setCurrentPage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <ShoppingBag size={18} /> Shop Collections
              </button>

              <button 
                className="btn btn-secondary btn-lg"
                onClick={() => { setCurrentPage('bridal'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <Calendar size={18} /> Book Bridal Makeup
              </button>
            </div>

            {/* Quick Micro Badges */}
            <div style={{ display: 'flex', gap: 24, marginTop: 36, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '1.25rem', color: 'var(--color-primary)' }}>100%</strong>
                Pure Malmal & Silk
              </div>
              <div style={{ borderLeft: '1px solid var(--color-blush-border)', paddingLeft: 20 }}>
                <strong style={{ display: 'block', fontSize: '1.25rem', color: 'var(--color-primary)' }}>Cash on Delivery</strong>
                Pan-India Delivery
              </div>
              <div style={{ borderLeft: '1px solid var(--color-blush-border)', paddingLeft: 20 }}>
                <strong style={{ display: 'block', fontSize: '1.25rem', color: 'var(--color-primary)' }}>HD Bridal</strong>
                Certified Artists
              </div>
            </div>
          </div>

          {/* Hero Right Visual Card */}
          <div className="hero-image-card">
            <img 
              src="/images/hero_boutique_dress.jpg" 
              alt="Sasti Boutique Couture Anarkali" 
            />
            <div className="hero-float-badge">
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <Sparkles size={22} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.96rem' }}>Heritage Bridal Elegance</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Curated with love in Chennai</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE PILLARS BANNER */}
      <section style={{ padding: '60px 0 30px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24
          }}>
            {/* Card 1 */}
            <div 
              style={{
                background: '#FAF2EE',
                borderRadius: 20,
                padding: '30px 24px',
                border: '1px solid #EEDCD5',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onClick={() => { setCurrentPage('chudithar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span className="badge badge-burgundy" style={{ marginBottom: 12 }}>ETHNIC WEAR</span>
              <h3 style={{ fontSize: '1.45rem', marginBottom: 10 }}>Chudithar & Anarkali Sets</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 18 }}>
                From pure cotton daily wear starting at ₹599 to heavy zardozi wedding suits. Designed for all-day comfort.
              </p>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                Explore Chudithars <ChevronRight size={16} />
              </span>
            </div>

            {/* Card 2 */}
            <div 
              style={{
                background: '#FDF6F0',
                borderRadius: 20,
                padding: '30px 24px',
                border: '1px solid #EEDCD5',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onClick={() => { setCurrentPage('makeup'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span className="badge badge-gold" style={{ marginBottom: 12 }}>COSMETICS</span>
              <h3 style={{ fontSize: '1.45rem', marginBottom: 10 }}>Everyday & Glam Makeup</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 18 }}>
                Velvet matte lipsticks, smudge-free kajal, HD foundations, and complete beauty vanity kits crafted for Indian skin.
              </p>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                Shop Makeup <ChevronRight size={16} />
              </span>
            </div>

            {/* Card 3 */}
            <div 
              style={{
                background: '#F8EEEC',
                borderRadius: 20,
                padding: '30px 24px',
                border: '1px solid #EEDCD5',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onClick={() => { setCurrentPage('bridal'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span className="badge badge-burgundy" style={{ marginBottom: 12 }}>BESPOKE SERVICE</span>
              <h3 style={{ fontSize: '1.45rem', marginBottom: 10 }}>Bridal Makeover Packages</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 18 }}>
                Complete bridal Muhurtham, reception glam, and bridesmaid group makeup with professional saree draping.
              </p>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                Book Appointment <ChevronRight size={16} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CHUDITHAR SETS */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-pretitle">Handpicked Ethnic Couture</span>
            <h2 className="section-title">Popular Chudithar Collections</h2>
            <p className="section-desc">
              Graceful silhouettes, vibrant dyes, and artisanal craftsmanship made for festive gatherings, workdays, and grand weddings.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
              Loading beautiful collections...
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                  onBuyNow={onBuyNow}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => { setCurrentPage('chudithar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              View All Chudithar Sets <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. MAKEUP COLLECTION SHOWCASE */}
      <section style={{ padding: '60px 0', background: '#FAF5F2' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-pretitle">Radiance & Glamour</span>
            <h2 className="section-title">Best-Selling Makeup Essentials</h2>
            <p className="section-desc">
              High-pigment, sweat-proof, and skin-comfort formulations designed to enhance your natural beauty from morning till night.
            </p>
          </div>

          <div className="product-grid">
            {makeupProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => { setCurrentPage('makeup'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              Explore All Makeup Products <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. BRIDAL MAKEUP HIGHLIGHT */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #B57779 0%, #8F5254 100%)',
            borderRadius: 24,
            overflow: 'hidden',
            color: '#FFFFFF',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ padding: '50px 45px' }}>
              <span className="badge badge-gold" style={{ marginBottom: 14 }}>
                <Sparkles size={12} /> LUXURY BRIDAL ARTISTRY
              </span>
              <h2 style={{ color: '#FFFFFF', fontSize: '2.4rem', marginBottom: 18 }}>
                Experience Your Dream Bridal Look
              </h2>
              <p style={{ color: '#F7EDE9', fontSize: '1rem', lineHeight: 1.6, marginBottom: 24 }}>
                Trust our master bridal makeover artists to create a breathtaking, camera-ready look for your Muhurtham, Sangeet, and Reception. Packages include HD finish, customized hair styling, and authentic saree draping.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 30, fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Award size={18} style={{ color: '#F7F0E7' }} />
                  <span>Certified Bridal Stylists</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={18} style={{ color: '#F7F0E7' }} />
                  <span>On-time Mandapam Service</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={18} style={{ color: '#F7F0E7' }} />
                  <span>Premium HD & Airbrush Kits</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Heart size={18} style={{ color: '#F7F0E7' }} />
                  <span>Customized Saree Draping</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <button
                  className="btn btn-gold btn-lg"
                  onClick={() => {
                    if (onBookService && services.length > 0) {
                      onBookService(services[0]);
                    } else {
                      setCurrentPage('bridal');
                    }
                  }}
                >
                  <Calendar size={18} /> Book Bridal Makeup (₹15,000)
                </button>
                <button
                  className="btn btn-secondary btn-lg"
                  style={{ background: 'rgba(255,255,255,0.18)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.45)' }}
                  onClick={() => { setCurrentPage('bridal'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  View All 6 Packages
                </button>
              </div>
            </div>

            <div style={{ height: '100%', minHeight: 460 }}>
              <img
                src="/images/bridal_saree_styling.jpg"
                alt="Bespoke Bridal Kanjeevaram Saree & Makeover Artistry"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            div[style*="gridTemplateColumns: '1fr 1fr'"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* 6. CUSTOMER REVIEWS (DEMO IDENTIFIED) */}
      <section style={{ padding: '60px 0 80px', background: '#FAF7F5' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-pretitle">Words of Love</span>
            <h2 className="section-title">What Our Patrons Say</h2>
            <p className="section-desc">
              Real joy and festive moments shared by women across India. <em style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>[Curated Customer Demo Reviews]</em>
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 26
          }}>
            {/* Review 1 */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: 28,
              border: '1px solid #EEDCD5',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', gap: 4, color: '#C89B3C', marginBottom: 14 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#C89B3C" />)}
              </div>
              <p style={{ fontSize: '0.94rem', color: 'var(--color-text-main)', lineHeight: 1.6, marginBottom: 16 }}>
                "The Malmal Cotton Chudithar Set is blissfully soft for Chennai summers! The tailoring is precise, and the color stayed vibrant after multiple washes. Plus, Cash on Delivery was super seamless."
              </p>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Soundarya Ramanathan</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Verified Buyer, Chennai • Cotton Daily Wear</span>
              </div>
            </div>

            {/* Review 2 */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: 28,
              border: '1px solid #EEDCD5',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', gap: 4, color: '#C89B3C', marginBottom: 14 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#C89B3C" />)}
              </div>
              <p style={{ fontSize: '0.94rem', color: 'var(--color-text-main)', lineHeight: 1.6, marginBottom: 16 }}>
                "Booked the Sasti Boutique team for my wedding reception makeup. The HD look didn’t budge throughout the night, and the saree pleating was flawless! Everyone kept asking about my bridal look."
              </p>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Ananya Natarajan</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Bridal Client • Reception Glam Package</span>
              </div>
            </div>

            {/* Review 3 */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: 28,
              border: '1px solid #EEDCD5',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', gap: 4, color: '#C89B3C', marginBottom: 14 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#C89B3C" />)}
              </div>
              <p style={{ fontSize: '0.94rem', color: 'var(--color-text-main)', lineHeight: 1.6, marginBottom: 16 }}>
                "The Velvet Matte Lip Crayon in Berry Romance is now my everyday signature shade! Doesn't dry out my lips, and the packaging feels so luxurious for ₹399. Highly recommend Sasti Boutique."
              </p>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Divya Krishnan</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Verified Buyer, Bengaluru • Matte Lip Crayon</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
