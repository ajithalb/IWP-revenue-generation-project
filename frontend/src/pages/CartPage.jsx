import React from 'react';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage({ setCurrentPage }) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    total,
    amountToFreeShipping
  } = useCart();

  if (cart.length === 0) {
    return (
      <div style={{ padding: '80px 0', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 520 }}>
          <div style={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            background: 'var(--color-primary-soft)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <ShoppingBag size={42} />
          </div>
          <h2 style={{ fontSize: '2.1rem', marginBottom: 12 }}>Your Shopping Bag is Empty</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 28 }}>
            Looks like you haven't added anything to your cart yet. Explore our beautiful chudithar collections or everyday makeup essentials.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => { setCurrentPage('chudithar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              Shop Chudithar Sets
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => { setCurrentPage('makeup'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              Shop Makeup Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb & Title */}
        <div style={{ marginBottom: 32 }}>
          <button
            onClick={() => { setCurrentPage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: 8 }}
          >
            <ArrowLeft size={14} /> Continue Shopping
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 14 }}>
            <h1 style={{ fontSize: '2.4rem', color: 'var(--color-text-main)' }}>
              Shopping Bag ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h1>
            <button
              onClick={clearCart}
              style={{ fontSize: '0.86rem', color: 'var(--color-danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Trash2 size={14} /> Clear Bag
            </button>
          </div>
        </div>

        {/* Free Shipping Meter */}
        <div style={{
          background: '#FAF6F4',
          borderRadius: 14,
          padding: '16px 22px',
          border: '1px solid #EEDCD5',
          marginBottom: 32
        }}>
          {amountToFreeShipping > 0 ? (
            <div>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-main)', marginBottom: 8 }}>
                Add <strong style={{ color: 'var(--color-primary)' }}>₹{amountToFreeShipping}</strong> more of products to unlock <strong>FREE EXPRESS SHIPPING</strong>!
              </p>
              <div style={{ width: '100%', height: 8, background: '#EAE0DC', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(100, Math.round((subtotal / 999) * 100))}%`,
                  height: '100%',
                  background: 'var(--color-gold-gradient)',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-success)', fontWeight: 700 }}>
              <Sparkles size={18} /> Congratulations! Your order qualifies for FREE Express Shipping!
            </div>
          )}
        </div>

        {/* Cart Main Layout */}
        <div className="cart-layout">
          {/* Left Column: Item List */}
          <div className="cart-card">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {cart.map((item) => (
                <div key={item.variantKey} className="cart-item">
                  {/* Thumbnail */}
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Details */}
                  <div>
                    <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.06em' }}>
                      {item.category === 'chudithar' ? 'Ethnic Suit' : 'Beauty'}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', marginTop: 2, marginBottom: 4 }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>
                      Selected Size: <strong>{item.selected_size}</strong>
                      {item.selected_color && ` • Shade: ${item.selected_color}`}
                    </p>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-light)' }}>
                      Unit Price: ₹{item.price} • Stock Left: {item.stock}
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div>
                    <div className="qty-control">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(item.variantKey, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="qty-input"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.variantKey, parseInt(e.target.value, 10))}
                        min="1"
                        max={item.stock}
                      />
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(item.variantKey, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Subtotal & Delete */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 6 }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.variantKey)}
                      style={{ color: '#BD2130', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      title="Remove from bag"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="cart-card" style={{ background: '#FAF6F4', border: '1.5px solid #EEDCD5' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #EEDCD5' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20, fontSize: '0.94rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Bag Subtotal:</span>
                <span style={{ fontWeight: 700 }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Delivery Charges:</span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong style={{ color: 'var(--color-success)' }}>FREE</strong>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Payment Method:</span>
                <span>Cash on Delivery (COD)</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingTop: 16,
              borderTop: '2px dashed #DFC8C0',
              marginBottom: 24
            }}>
              <strong style={{ fontSize: '1.2rem' }}>Grand Total:</strong>
              <strong style={{ fontSize: '1.6rem', color: 'var(--color-primary)' }}>
                ₹{total.toLocaleString('en-IN')}
              </strong>
            </div>

            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={() => { setCurrentPage('checkout'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{ marginBottom: 14 }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              paddingTop: 12,
              borderTop: '1px solid #EEDCD5'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={15} style={{ color: 'var(--color-gold)' }} />
                <span>100% Verified Quality & Safe Packaging</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Truck size={15} style={{ color: 'var(--color-gold)' }} />
                <span>Cash on Delivery available on this order</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 650px) {
          .cart-item {
            grid-template-columns: 70px 1fr !important;
            row-gap: 12px;
          }
          .cart-item > div:nth-child(3), .cart-item > div:nth-child(4) {
            grid-column: span 2;
            display: flex;
            justifyContent: space-between;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
