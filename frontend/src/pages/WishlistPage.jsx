import React from 'react';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage({ onQuickView, onBuyNow, setCurrentPage }) {
  const { wishlist, toggleWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div style={{ padding: '80px 0', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 500 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'var(--color-primary-soft)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Heart size={40} />
          </div>
          <h2 style={{ fontSize: '2.1rem', marginBottom: 12 }}>Your Wishlist is Empty</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 28 }}>
            Save your favorite ethnic chudithar suits and makeup products here to review or buy anytime.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => { setCurrentPage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            Explore Boutique Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 30 }}>
          <button
            onClick={() => { setCurrentPage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: 8 }}
          >
            <ArrowLeft size={14} /> Back to Store
          </button>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--color-text-main)' }}>
            My Wishlist ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
          </h1>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
