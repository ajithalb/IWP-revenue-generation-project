import React from 'react';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFoundPage({ setCurrentPage }) {
  return (
    <div style={{ padding: '90px 0', minHeight: '65vh', display: 'flex', alignItems: 'center', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: 520 }}>
        <span style={{ fontSize: '5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontWeight: 800, display: 'block', lineHeight: 1 }}>
          404
        </span>
        <h2 style={{ fontSize: '2rem', margin: '14px 0 10px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 28 }}>
          The boutique page or collection you are looking for may have been moved or is currently being curated.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <ArrowLeft size={16} /> Return to Home
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => { setCurrentPage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <ShoppingBag size={16} /> Shop Collections
          </button>
        </div>
      </div>
    </div>
  );
}
