import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ onCheckout, onViewCart, onStartShopping }) {
  const {
    cart,
    drawerOpen,
    setDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    total,
    amountToFreeShipping
  } = useCart();

  if (!drawerOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(35, 28, 29, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 2500,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={() => setDrawerOpen(false)}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: 440,
          height: '100%',
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          animation: 'slideInRight 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #F0E4DE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingBag size={22} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)' }}>
              Your Bag ({cart.length})
            </h3>
          </div>
          <button 
            onClick={() => setDrawerOpen(false)}
            style={{ width: 34, height: 34, borderRadius: '50%', background: '#F8F2EF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Close bag drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div style={{
          background: '#FDF7F5',
          padding: '12px 24px',
          borderBottom: '1px solid #F0E4DE',
          fontSize: '0.85rem'
        }}>
          {amountToFreeShipping > 0 ? (
            <div>
              <p style={{ color: 'var(--color-text-main)', marginBottom: 6 }}>
                Add <strong style={{ color: 'var(--color-primary)' }}>₹{amountToFreeShipping}</strong> more for <strong>FREE DELIVERY</strong>!
              </p>
              <div style={{ width: '100%', height: 6, background: '#EAD8D1', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(100, Math.round((subtotal / 999) * 100))}%`,
                  height: '100%',
                  background: 'var(--color-gold-gradient)',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-success)', fontWeight: 600 }}>
              <Sparkles size={16} /> You've unlocked FREE Express Shipping!
            </div>
          )}
        </div>

        {/* Items List */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: 'var(--color-primary-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                color: 'var(--color-primary)'
              }}>
                <ShoppingBag size={34} />
              </div>
              <h4 style={{ marginBottom: 8 }}>Your bag is empty</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 24 }}>
                Explore our festive chudithar collections & beauty essentials!
              </p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setDrawerOpen(false);
                  if (onStartShopping) onStartShopping();
                }}
              >
                Browse Collections
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cart.map((item) => (
                <div 
                  key={item.variantKey} 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '70px 1fr auto',
                    gap: 14,
                    alignItems: 'center',
                    paddingBottom: 16,
                    borderBottom: '1px solid #F5EAE6'
                  }}
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{ width: 70, height: 85, borderRadius: 10, objectFit: 'cover', background: '#F8F4F2' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.92rem', marginBottom: 4, lineHeight: 1.3 }}>
                      {item.name}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                      Size: <strong>{item.selected_size}</strong> {item.selected_color && `| Shade: ${item.selected_color}`}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                        ₹{item.price}
                      </span>
                      {/* Qty Counter */}
                      <div className="qty-control" style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.variantKey, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="qty-input">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.variantKey, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.variantKey)}
                    style={{ color: '#BD2130', padding: 8 }}
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #F0E4DE',
            background: '#FAF6F4'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.92rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Subtotal:</span>
              <span style={{ fontWeight: 700 }}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.92rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Estimated Delivery:</span>
              <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--color-success)' }}>FREE</strong> : `₹${deliveryFee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18, fontSize: '1.15rem' }}>
              <strong>Total:</strong>
              <strong style={{ color: 'var(--color-primary)' }}>₹{total.toLocaleString('en-IN')}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="btn btn-primary btn-block btn-lg"
                onClick={() => {
                  setDrawerOpen(false);
                  if (onCheckout) onCheckout();
                }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <button
                className="btn btn-secondary btn-block btn-sm"
                onClick={() => {
                  setDrawerOpen(false);
                  if (onViewCart) onViewCart();
                }}
              >
                View Full Bag Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
