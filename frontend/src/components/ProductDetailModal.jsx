import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Zap, Star, Shield, RotateCcw, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetailModal({ product, onClose, onBuyNow }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.image_url);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard'
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : 'Default'
  );
  const [quantity, setQuantity] = useState(1);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  useEffect(() => {
    setActiveImage(product.image_url);
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : 'Default');
    setQuantity(1);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  const allImages = [product.image_url, ...(product.additional_images || [])];

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuy = () => {
    if (isOutOfStock) return;
    if (onBuyNow) {
      onBuyNow(product, selectedSize, selectedColor, quantity);
    } else {
      addToCart(product, quantity, selectedSize, selectedColor);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '36px 32px' }}
      >
        {/* Close Button */}
        <button 
          className="modal-close-btn" 
          onClick={onClose} 
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: 36,
          alignItems: 'start'
        }}>
          {/* Left Column: Image Gallery */}
          <div>
            <div style={{
              borderRadius: 16,
              overflow: 'hidden',
              background: '#F8F4F2',
              border: '1px solid var(--color-blush-border)',
              position: 'relative'
            }}>
              <img
                src={activeImage}
                alt={product.name}
                style={{ width: '100%', height: 420, objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/cotton_daily_chudithar.jpg';
                }}
              />
            </div>

            {/* Thumbnail list */}
            {allImages.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginTop: 14, overflowX: 'auto' }}>
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: 65,
                      height: 75,
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: activeImage === img ? '2px solid var(--color-primary)' : '1px solid #E2D2CB',
                      opacity: activeImage === img ? 1 : 0.7,
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Selection */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className="badge badge-gold">{product.category === 'chudithar' ? 'Ethnic Couture' : 'Beauty Essential'}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-gold)', fontWeight: 700 }}>
                {product.subcategory}
              </span>
            </div>

            <h2 style={{ fontSize: '1.75rem', marginBottom: 12, lineHeight: 1.3 }}>
              {product.name}
            </h2>

            {/* Ratings & Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18, fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-gold)' }}>
                <Star size={16} fill="var(--color-gold)" color="var(--color-gold)" />
                <strong>{product.rating || 4.8}</strong>
                <span style={{ color: 'var(--color-text-muted)' }}>({product.review_count || 32} reviews)</span>
              </div>
              <span style={{ color: '#D8C6BF' }}>|</span>
              <div>
                {isOutOfStock ? (
                  <span style={{ color: 'var(--color-danger)', fontWeight: 700 }}>Out of Stock</span>
                ) : (
                  <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                    In Stock ({product.stock} available)
                  </span>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.original_price && (
                <span style={{ fontSize: '1.15rem', textDecoration: 'line-through', color: 'var(--color-text-light)' }}>
                  ₹{Number(product.original_price).toLocaleString('en-IN')}
                </span>
              )}
              {product.discount_percent > 0 && (
                <span className="badge badge-discount" style={{ fontSize: '0.82rem' }}>
                  {product.discount_percent}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.94rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
              {product.description}
            </p>

            {/* Details Bullet Box */}
            {product.details && (
              <div style={{
                background: '#FAF5F3',
                padding: '12px 16px',
                borderRadius: 12,
                border: '1px solid #EEDCD5',
                fontSize: '0.86rem',
                color: 'var(--color-text-main)',
                marginBottom: 20
              }}>
                <strong>Fabric & Craft Details:</strong> {product.details}
              </div>
            )}

            {/* Size Options (if applicable) */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Select Size / Volume:</label>
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600 }}>Size Guide</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        border: selectedSize === sz ? '2px solid var(--color-primary)' : '1px solid #DFC8C0',
                        background: selectedSize === sz ? 'var(--color-primary-soft)' : '#FFFFFF',
                        color: selectedSize === sz ? 'var(--color-primary)' : 'var(--color-text-main)',
                        transition: 'var(--transition)'
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color / Shade Options */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <label className="form-label">Available Shade / Color: <strong>{selectedColor}</strong></label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.colors.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 20,
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        border: selectedColor === col ? '1.5px solid var(--color-primary)' : '1px solid #DFC8C0',
                        background: selectedColor === col ? 'var(--color-primary)' : '#FAF7F5',
                        color: selectedColor === col ? '#FFFFFF' : 'var(--color-text-main)',
                        transition: 'var(--transition)'
                      }}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Stock Limits */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 26 }}>
              <div>
                <span className="form-label">Quantity:</span>
                <div className="qty-control">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="qty-input"
                    value={quantity}
                    readOnly
                  />
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Wishlist Button */}
              <div style={{ marginTop: 22 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => toggleWishlist(product)}
                >
                  <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
                  {isFavorited ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={handleAdd}
                disabled={isOutOfStock}
              >
                <ShoppingBag size={18} /> {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </button>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleBuy}
                disabled={isOutOfStock}
              >
                <Zap size={18} /> Buy Now
              </button>
            </div>

            {/* Assurance Badges */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              paddingTop: 18,
              borderTop: '1px solid #F0E4DE',
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)',
              textAlign: 'center'
            }}>
              <div>
                <Truck size={18} style={{ color: 'var(--color-gold)', margin: '0 auto 4px' }} />
                <span>Fast Delivery</span>
              </div>
              <div>
                <ShieldCheck size={18} style={{ color: 'var(--color-gold)', margin: '0 auto 4px' }} />
                <span>100% Quality Check</span>
              </div>
              <div>
                <RotateCcw size={18} style={{ color: 'var(--color-gold)', margin: '0 auto 4px' }} />
                <span>7-Day Easy Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .modal-content > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
