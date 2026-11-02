import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  Check, 
  Phone, 
  Mail, 
  Award, 
  Search, 
  ShieldCheck, 
  Heart,
  ChevronRight
} from 'lucide-react';
import { shopApi } from '../services/api';

export default function BridalPage({ onBookService, setCurrentPage }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const res = await shopApi.getServices();
        setServices(res.data.services || []);
      } catch (err) {
        console.error('Failed to load bridal services:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Bridal Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #B57779 0%, #8F5254 100%)',
          borderRadius: 24,
          padding: '50px 40px',
          color: '#FFFFFF',
          marginBottom: 45,
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: 720 }}>
            <span className="badge badge-gold" style={{ marginBottom: 12 }}>
              <Sparkles size={13} /> BESPOKE BRIDAL MAKEUP ARTISTRY
            </span>
            <h1 style={{ color: '#FFFFFF', fontSize: '2.8rem', marginBottom: 14 }}>
              Grace, Radiance & Timeless Bridal Beauty
            </h1>
            <p style={{ color: '#F8EBE8', fontSize: '1.08rem', lineHeight: 1.65, marginBottom: 26 }}>
              Celebrate your most treasured celebrations with bespoke bridal makeover artistry by Sasti Boutique. Featuring custom HD and Airbrush finishes, authentic Kanjeevaram saree pleating, temple jewelry styling, and floral hairdos.
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 20,
              background: 'rgba(255, 255, 255, 0.18)',
              padding: '10px 20px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              fontSize: '0.9rem'
            }}>
              <span>Direct Artist Desk:</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#F7F0E7' }}>
                <Phone size={15} /> 7904871123
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, opacity: 0.9 }}>
                <Mail size={15} /> nisanth08.connect@gamil.com
              </span>
            </div>
          </div>
        </div>

        {/* Existing Booking Check Bar */}
        <div style={{
          background: '#FAF6F4',
          borderRadius: 16,
          padding: '18px 26px',
          border: '1px solid #EEDCD5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 45,
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--color-text-main)' }}>
              Already submitted an appointment request?
            </strong>
            <span style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
              Track your bridal booking status (Pending, Confirmed, Completed) using your Reference ID or Phone number.
            </span>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setCurrentPage('track'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <Search size={14} /> Check Booking Status
          </button>
        </div>

        {/* Services List */}
        <div className="section-header">
          <span className="section-pretitle">Tailored Bridal Services</span>
          <h2 className="section-title">Our Bridal Makeover Packages</h2>
          <p className="section-desc">
            All prices are completely transparent and editable. Select your desired package below to reserve your special date.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            Loading bridal service packages...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: 30
          }}>
            {services.map((srv) => (
              <div
                key={srv.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 20,
                  border: '1px solid var(--color-blush-border)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.borderColor = 'rgba(168, 106, 108, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--color-blush-border)';
                }}
              >
                {/* Service Image Banner */}
                <div style={{ height: 230, position: 'relative', overflow: 'hidden', background: '#F8F4F2' }}>
                  <img
                    src={srv.image_url}
                    alt={srv.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/bridal_saree_styling.jpg';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    background: 'rgba(61, 48, 45, 0.75)',
                    backdropFilter: 'blur(6px)',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <Clock size={13} style={{ color: 'var(--color-champagne)' }} />
                    {srv.duration}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '26px 24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--color-text-main)', marginBottom: 8 }}>
                    {srv.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 14 }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      ₹{srv.price.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {srv.slug === 'bridesmaid-makeup' ? '/ person' : 'all-inclusive'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 18 }}>
                    {srv.description}
                  </p>

                  {/* Features List */}
                  {srv.features && srv.features.length > 0 && (
                    <div style={{
                      background: 'var(--color-blush)',
                      borderRadius: 14,
                      padding: '14px 16px',
                      marginBottom: 22,
                      flexGrow: 1
                    }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-gold)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                        Package Inclusions:
                      </span>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {srv.features.map((feat, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', color: 'var(--color-text-main)' }}>
                            <Check size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    className="btn btn-primary btn-block btn-lg"
                    onClick={() => onBookService && onBookService(srv)}
                  >
                    <Calendar size={18} /> Book This Makeover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Why Book Bridal Section */}
        <div style={{
          marginTop: 80,
          background: '#FFFFFF',
          borderRadius: 24,
          padding: '45px 36px',
          border: '1px solid var(--color-blush-border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span className="section-pretitle">The Sasti Bridal Promise</span>
            <h2 style={{ fontSize: '2rem' }}>Why Brides Choose Sasti Boutique</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 26
          }}>
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-primary)' }}>
                <Award size={26} />
              </div>
              <h4 style={{ marginBottom: 8 }}>Master Artisans</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                Trained in both traditional South Indian Muhurtham styling and contemporary evening reception glam.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '10px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-primary)' }}>
                <ShieldCheck size={26} />
              </div>
              <h4 style={{ marginBottom: 8 }}>Skin-Safe Luxury Kits</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                100% genuine hypoallergenic, waterproof HD products formulated for 14+ hours of sweat-proof radiance.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '10px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-primary)' }}>
                <Clock size={26} />
              </div>
              <h4 style={{ marginBottom: 8 }}>Punctual Mandapam Arrival</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                We understand Muhurtham timings are sacred. Our artists arrive at your wedding hall 30 minutes prior.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '10px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-primary)' }}>
                <Heart size={26} />
              </div>
              <h4 style={{ marginBottom: 8 }}>Bespoke Consultation</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                Personalized trial and outfit matching sessions so there are zero surprises on your wedding day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
