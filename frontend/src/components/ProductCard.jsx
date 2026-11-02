import React from 'react';
import { Heart, ShoppingBag, Eye, Star, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product, onQuickView, onBuyNow }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard';
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'Default';
    addToCart(product, 1, defaultSize, defaultColor);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard';
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'Default';
    if (onBuyNow) {
      onBuyNow(product, defaultSize, defaultColor);
    } else {
      addToCart(product, 1, defaultSize, defaultColor);
    }
  };

  return (
    <div className="product-card" onClick={() => onQuickView && onQuickView(product)}>
      {/* Thumbnail */}
      <div className="card-img-wrap">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            // Elegant fallback image
            e.target.onerror = null;
            e.target.src = '/images/cotton_daily_chudithar.jpg';
          }}
        />

        {/* Badges */}
        <div className="card-badges">
          {product.discount_percent > 0 && (
            <span className="badge badge-discount">
              {product.discount_percent}% OFF
            </span>
          )}
          {product.is_new === 1 && (
            <span className="badge badge-gold">
              NEW
            </span>
          )}
          {isOutOfStock && (
            <span className="badge badge-cancelled">
              SOLD OUT
            </span>
          )}
          {isLowStock && (
            <span className="badge badge-pending">
              Only {product.stock} left!
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`card-wishlist-btn ${isFavorited ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Card Content */}
      <div className="card-body">
        <span className="card-subcategory">{product.subcategory}</span>
        
        <h3 className="card-title" title={product.name}>
          {product.name}
        </h3>

        <div className="card-rating">
          <Star size={14} fill="var(--color-gold)" color="var(--color-gold)" />
          <span><strong>{product.rating || 4.8}</strong> ({product.review_count || 24})</span>
        </div>

        <div className="card-price-row">
          <span className="card-price">₹{Number(product.price).toLocaleString('en-IN')}</span>
          {product.original_price && (
            <span className="card-original-price">
              ₹{Number(product.original_price).toLocaleString('en-IN')}
            </span>
          )}
          {product.discount_percent > 0 && (
            <span className="card-discount-tag">Save ₹{(product.original_price - product.price).toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="card-btn-row">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <ShoppingBag size={14} /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
          >
            <Zap size={14} /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
