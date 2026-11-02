import React from 'react';
import { Sparkles, Heart, Award, ShieldCheck, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function AboutPage({ setCurrentPage }) {
  return (
    <div style={{ padding: '50px 0 90px' }}>
      <div className="container">
        {/* Story Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #FAF2EE 0%, #F5EAE6 100%)',
          borderRadius: 24,
          padding: '60px 45px',
          border: '1px solid #EEDCD5',
          marginBottom: 60,
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: 40,
          alignItems: 'center'
        }}>
          <div>
            <span className="badge badge-burgundy" style={{ marginBottom: 12 }}>
              OUR ETHOS & STORY
            </span>
            <h1 style={{ fontSize: '2.8rem', color: 'var(--color-primary)', marginBottom: 16 }}>
              Celebrating the Grace of Modern Indian Women
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 20 }}>
              Welcome to <strong>Sasti Boutique</strong>. Founded with a deep passion for traditional Indian textiles and contemporary elegance, we are a specialized boutique dedicated to bringing you handpicked ethnic wear, everyday skin-safe cosmetics, and bespoke bridal makeover artistry.
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.96rem', lineHeight: 1.7, marginBottom: 28 }}>
              We believe every woman deserves clothing that feels breathable in the Indian climate and makes her feel radiant on her most cherished days. From handcrafted pure Malmal cotton chudithar sets for daily comfort to regal bridal zardozi suits and certified makeup services, Sasti Boutique is your trusted companion for style, beauty, and festive celebrations.
            </p>

            <div style={{ display: 'flex', gap: 14 }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => { setCurrentPage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                Explore Collections <ArrowRight size={16} />
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => { setCurrentPage('bridal'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                Bridal Services
              </button>
            </div>
          </div>

          <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <img
              src="/images/hero_boutique_dress.jpg"
              alt="Sasti Boutique Fabric & Craft"
              style={{ width: '100%', height: 420, objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* 3 Pillars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 30,
          marginBottom: 60
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: 34,
            border: '1px solid var(--color-blush-border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: 18 }}>
              <Sparkles size={26} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: 10 }}>Authentic Ethnic Wear</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              We source directly from skilled artisans across India. Pure Malmal cottons, Chanderi silks, georgettes, and heavy festive embroideries tailored for flawless drape and all-day comfort.
            </p>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: 34,
            border: '1px solid var(--color-blush-border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: 18 }}>
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: 10 }}>Skin-Safe Cosmetics</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Cosmetics specially formulated to withstand humidity and heat. Enriched with natural oils and tested for sensitive skin. Pigmented lip shades and smudge-free kajals.
            </p>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: 34,
            border: '1px solid var(--color-blush-border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: 18 }}>
              <Award size={26} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: 10 }}>Bridal Artistry</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Our dedicated makeup artists provide on-location Muhurtham, Sangeet, and Reception makeover packages, including professional hair design and saree draping.
            </p>
          </div>
        </div>

        {/* Contact Banner */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '36px 32px',
          border: '1px solid var(--color-blush-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20
        }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: 6 }}>
              Have Questions or Need Styling Advice?
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              We are delighted to assist with size recommendations, custom bridal dates, or bulk inquiries.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--color-primary)' }}>
              <Phone size={18} /> 7904871123
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)' }}>
              <Mail size={18} /> nisanth08.connect@gamil.com
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: '1.2fr 0.8fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
