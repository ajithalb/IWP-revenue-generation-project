import React, { useState } from 'react';
import { Mail, Phone, MapPin, Heart, ShieldCheck, Truck, Clock, Send } from 'lucide-react';
import { shopApi } from '../services/api';

export default function Footer({ setCurrentPage, showToast }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleNav = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setSubscribing(true);
    try {
      const res = await shopApi.subscribeNewsletter(newsletterEmail.trim());
      if (showToast) showToast(res.data.message || 'Subscribed successfully!', 'success');
      setNewsletterEmail('');
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Value Proposition Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
          paddingBottom: 40,
          marginBottom: 45,
          borderBottom: '1px solid #E5D6C8'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: '#FFFFFF',
            padding: '16px 20px',
            borderRadius: 16,
            border: '1px solid var(--color-blush-border)',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <Truck size={22} />
            </div>
            <div>
              <h5 style={{ color: 'var(--color-mocha-deep)', fontSize: '0.98rem', fontWeight: 700 }}>Free Express Shipping</h5>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>On all prepaid & COD orders over ₹999</p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: '#FFFFFF',
            padding: '16px 20px',
            borderRadius: 16,
            border: '1px solid var(--color-blush-border)',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h5 style={{ color: 'var(--color-mocha-deep)', fontSize: '0.98rem', fontWeight: 700 }}>Pure Fabrics & Safe Makeup</h5>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>Tested hypoallergenic & breathable cottons</p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: '#FFFFFF',
            padding: '16px 20px',
            borderRadius: 16,
            border: '1px solid var(--color-blush-border)',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <Clock size={22} />
            </div>
            <div>
              <h5 style={{ color: 'var(--color-mocha-deep)', fontSize: '0.98rem', fontWeight: 700 }}>Bridal Styling Booking</h5>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>Slot reservation with certified bridal artists</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="footer-grid">
          {/* Col 1: About Boutique */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                Sasti Boutique
              </span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 20 }}>
              Your premier destination for handpicked daily and wedding chudithar sets, premium makeup essentials, and bespoke bridal makeover experiences. Dedicated to celebrating the grace and elegance of modern Indian women.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone size={15} style={{ color: 'var(--color-gold)' }} />
                <span>+91 <strong>7904871123</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={15} style={{ color: 'var(--color-gold)' }} />
                <span>nisanth08.connect@gamil.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={15} style={{ color: 'var(--color-gold)' }} />
                <span>Chennai, Tamil Nadu, India</span>
              </div>
            </div>
          </div>

          {/* Col 2: Collections */}
          <div className="footer-col">
            <h4>Collections</h4>
            <ul className="footer-links">
              <li><button className="footer-link" onClick={() => handleNav('chudithar')}>Cotton Daily Sets</button></li>
              <li><button className="footer-link" onClick={() => handleNav('chudithar')}>Anarkali Suits</button></li>
              <li><button className="footer-link" onClick={() => handleNav('chudithar')}>Party & Festive Wear</button></li>
              <li><button className="footer-link" onClick={() => handleNav('chudithar')}>Bridal Chudithar Sets</button></li>
              <li><button className="footer-link" onClick={() => handleNav('makeup')}>Lipsticks & Glosses</button></li>
              <li><button className="footer-link" onClick={() => handleNav('makeup')}>Foundation & Compact</button></li>
              <li><button className="footer-link" onClick={() => handleNav('makeup')}>Eyeshadow & Kajal</button></li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div className="footer-col">
            <h4>Customer Care</h4>
            <ul className="footer-links">
              <li><button className="footer-link" onClick={() => handleNav('track')}>Track Order / Booking</button></li>
              <li><button className="footer-link" onClick={() => handleNav('bridal')}>Book Bridal Appointment</button></li>
              <li><button className="footer-link" onClick={() => handleNav('contact')}>Contact Store Team</button></li>
              <li><button className="footer-link" onClick={() => handleNav('policy_shipping')}>Shipping Policy (Draft)</button></li>
              <li><button className="footer-link" onClick={() => handleNav('policy_returns')}>Return & Refund (Draft)</button></li>
              <li><button className="footer-link" onClick={() => handleNav('policy_privacy')}>Privacy Policy (Draft)</button></li>
              <li><button className="footer-link" onClick={() => handleNav('policy_terms')}>Terms & Conditions (Draft)</button></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="footer-col">
            <h4>Boutique Club</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: 16 }}>
              Subscribe to receive private invitations to new ethnic arrivals, festive discounts, and bridal beauty tips.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: '1.5px solid var(--color-blush-border)',
                  background: '#FFFFFF',
                  color: 'var(--color-text-main)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxShadow: 'var(--shadow-xs)'
                }}
              />
              <button 
                type="submit" 
                className="btn btn-gold btn-block btn-sm"
                disabled={subscribing}
              >
                <Send size={15} /> {subscribing ? 'Subscribing...' : 'Join Sasti Circle'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} <strong>Sasti Boutique</strong>. All rights reserved. Prices displayed in Indian Rupees (₹).</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Crafted with <Heart size={14} style={{ color: 'var(--color-primary)', fill: 'var(--color-primary)' }} /> for Indian Couture & Bridal Beauty
          </p>
        </div>
      </div>
    </footer>
  );
}
