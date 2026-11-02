import React, { useState } from 'react';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, AlertCircle, Lock, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { shopApi } from '../services/api';

export default function CheckoutPage({ buyNowItem, onOrderPlaced, setCurrentPage }) {
  const { cart, clearCart, subtotal: cartSubtotal, deliveryFee: cartDeliveryFee, total: cartTotal } = useCart();

  // Determine items being purchased: either the single Buy Now item or the entire cart
  const checkoutItems = buyNowItem ? [buyNowItem] : cart;

  const subtotal = buyNowItem 
    ? (buyNowItem.price * buyNowItem.quantity)
    : cartSubtotal;

  const deliveryFee = subtotal >= 999 ? 0 : 70;
  const total = subtotal + deliveryFee;

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressHouse, setAddressHouse] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const indianStates = [
    'Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana',
    'Maharashtra', 'Delhi', 'Gujarat', 'West Bengal', 'Rajasthan',
    'Uttar Pradesh', 'Madhya Pradesh', 'Punjab', 'Haryana', 'Odisha', 'Goa'
  ];

  if (checkoutItems.length === 0) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 500 }}>
          <h2 style={{ marginBottom: 12 }}>Your Checkout Bag is Empty</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
            Please select a chudithar set or makeup product to begin checkout.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => { setCurrentPage('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            Browse Collections
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Frontend validations
    if (!customerName.trim() || !phone.trim() || !email.trim() || !addressHouse.trim() || !addressStreet.trim() || !city.trim() || !pincode.trim()) {
      setError('Please fill in all mandatory delivery address fields.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    if (pincode.replace(/[^0-9]/g, '').length < 6) {
      setError('Please enter a valid 6-digit postal PIN code.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer_name: customerName,
        phone: cleanPhone,
        email: email.trim(),
        address_house: addressHouse,
        address_street: addressStreet,
        city: city,
        state: state,
        pincode: pincode,
        delivery_instructions: deliveryInstructions,
        payment_method: paymentMethod,
        items: checkoutItems.map(item => ({
          product_id: item.product_id || item.id,
          quantity: item.quantity,
          selected_size: item.selected_size,
          selected_color: item.selected_color,
          image_url: item.image_url
        }))
      };

      const res = await shopApi.createOrder(payload);

      // Clear cart if standard cart was used
      if (!buyNowItem) {
        clearCart();
      }

      if (onOrderPlaced) {
        onOrderPlaced(res.data.order);
      }
    } catch (err) {
      setError(err.message || 'Failed to place order. Please check item stock.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => { setCurrentPage(buyNowItem ? 'shop' : 'cart'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.88rem', color: 'var(--color-text-muted)' }}
          >
            <ArrowLeft size={14} /> Back to {buyNowItem ? 'Store' : 'Shopping Bag'}
          </button>
        </div>

        <h1 style={{ fontSize: '2.3rem', marginBottom: 24, color: 'var(--color-text-main)' }}>
          Secure Checkout
        </h1>

        {error && (
          <div style={{
            background: '#FCE8E6',
            border: '1px solid #F5C6CB',
            color: '#721C24',
            padding: '12px 18px',
            borderRadius: 12,
            fontSize: '0.92rem',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <div className="cart-layout">
          {/* Left Form Column */}
          <div className="cart-card">
            <form onSubmit={handleSubmit}>
              {/* Customer Contact */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  1. Contact Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Priya Sundaram"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      10-Digit Mobile Number <span className="req">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="e.g. 9840123456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email Address <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. priya@example.com (For order invoice)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div style={{ marginBottom: 28, paddingTop: 20, borderTop: '1px solid #F0E4DE' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 16 }}>
                  2. Shipping Address (Pan-India)
                </h3>

                <div className="form-group">
                  <label className="form-label">
                    Flat / House No. / Building Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Flat 4B, Meenakshi Towers"
                    value={addressHouse}
                    onChange={(e) => setAddressHouse(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Street Address & Locality / Area <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 14th Cross, Anna Nagar West"
                    value={addressStreet}
                    onChange={(e) => setAddressStreet(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">
                      City / Town <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Chennai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      State <span className="req">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    >
                      {indianStates.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      PIN Code <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="6 digits"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Optional Delivery Instructions</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ring bell twice / Leave with security guard"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: 28, paddingTop: 20, borderTop: '1px solid #F0E4DE' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 16 }}>
                  3. Payment Method
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* COD Option */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 18px',
                    borderRadius: 14,
                    border: paymentMethod === 'COD' ? '2px solid var(--color-primary)' : '1px solid #DFC8C0',
                    background: paymentMethod === 'COD' ? 'var(--color-primary-soft)' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}>
                    <input
                      type="radio"
                      name="checkoutPayment"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                    <Banknote size={24} style={{ color: 'var(--color-primary)' }} />
                    <div style={{ flexGrow: 1 }}>
                      <strong style={{ display: 'block', fontSize: '0.98rem' }}>
                        Cash on Delivery (COD) — Recommended
                      </strong>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        Pay with cash or UPI QR code directly to the courier executive upon delivery at your doorstep.
                      </span>
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>VERIFIED</span>
                  </label>

                  {/* Mock Payment Testing Option */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 18px',
                    borderRadius: 14,
                    border: paymentMethod === 'MOCK_ONLINE' ? '2px solid var(--color-primary)' : '1px solid #DFC8C0',
                    background: paymentMethod === 'MOCK_ONLINE' ? 'var(--color-primary-soft)' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}>
                    <input
                      type="radio"
                      name="checkoutPayment"
                      value="MOCK_ONLINE"
                      checked={paymentMethod === 'MOCK_ONLINE'}
                      onChange={() => setPaymentMethod('MOCK_ONLINE')}
                    />
                    <CreditCard size={24} style={{ color: 'var(--color-gold)' }} />
                    <div style={{ flexGrow: 1 }}>
                      <strong style={{ display: 'block', fontSize: '0.98rem' }}>
                        Mock Instant Payment Simulation (Demo Testing)
                      </strong>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        Instantly generates a marked "Paid" test invoice without asking for real card, CVV, or UPI PINs.
                      </span>
                    </div>
                    <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>TEST MODE</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading}
              >
                {loading ? 'Confirming Your Order with Server...' : `Confirm Order (₹${total.toLocaleString('en-IN')})`}
              </button>
            </form>
          </div>

          {/* Right Summary Column */}
          <div className="cart-card" style={{ background: '#FAF6F4', border: '1.5px solid #EEDCD5' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 18, paddingBottom: 10, borderBottom: '1px solid #EEDCD5' }}>
              Order Review ({checkoutItems.length} {checkoutItems.length === 1 ? 'item' : 'items'})
            </h3>

            {/* Item Thumbnails List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20, maxHeight: 280, overflowY: 'auto' }}>
              {checkoutItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{ width: 54, height: 64, borderRadius: 8, objectFit: 'cover', background: '#F8F4F2' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontSize: '0.88rem', marginBottom: 2 }}>{item.name}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      Size: {item.selected_size} • Qty: {item.quantity}
                    </p>
                  </div>
                  <strong style={{ fontSize: '0.92rem', color: 'var(--color-primary)' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </strong>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.92rem', borderTop: '1px solid #EEDCD5', paddingTop: 14, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Subtotal:</span>
                <span style={{ fontWeight: 700 }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Shipping Fee:</span>
                <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--color-success)' }}>FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingTop: 14,
              borderTop: '2px dashed #DFC8C0',
              marginBottom: 20
            }}>
              <strong style={{ fontSize: '1.15rem' }}>Total Payable:</strong>
              <strong style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>
                ₹{total.toLocaleString('en-IN')}
              </strong>
            </div>

            <div style={{ background: '#FFFFFF', padding: 12, borderRadius: 10, border: '1px solid #EEDCD5', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              🔒 <strong>256-Bit SSL Safe Checkout</strong><br />
              All prices and stock counts are checked directly against our live database server.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 650px) {
          form div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
