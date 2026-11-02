import React from 'react';
import { CheckCircle2, Printer, ArrowRight, Package, Phone, Mail, MapPin } from 'lucide-react';

export default function OrderConfirmationPage({ order, setCurrentPage, onTrackOrder }) {
  if (!order) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 500 }}>
          <h2>No Order Selected</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 20 }}>
            Return to store to browse our latest ethnic fashion.
          </p>
          <button className="btn btn-primary" onClick={() => setCurrentPage('home')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '50px 0 90px' }}>
      <div className="container" style={{ maxWidth: 840 }}>
        {/* Success Banner */}
        <div style={{
          textAlign: 'center',
          background: '#FFFFFF',
          borderRadius: 24,
          border: '1px solid var(--color-blush-border)',
          padding: '45px 36px',
          boxShadow: 'var(--shadow-md)',
          marginBottom: 32
        }}>
          <div style={{
            width: 76,
            height: 76,
            borderRadius: '50%',
            background: '#E6F6ED',
            color: '#146C36',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px'
          }}>
            <CheckCircle2 size={44} />
          </div>

          <span className="badge badge-success" style={{ marginBottom: 10, fontSize: '0.8rem' }}>
            ORDER CONFIRMED
          </span>

          <h1 style={{ fontSize: '2.4rem', color: 'var(--color-primary)', marginBottom: 8 }}>
            Thank You, {order.customer_name}!
          </h1>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto 16px' }}>
            Your boutique order has been recorded in our system. We are carefully packaging your ethnic selections with utmost care.
          </p>

          <div style={{
            display: 'inline-block',
            background: 'var(--color-primary-soft)',
            padding: '10px 24px',
            borderRadius: '9999px',
            border: '1px solid rgba(122, 22, 43, 0.2)'
          }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>Order Reference Number: </span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>{order.order_ref}</strong>
          </div>
        </div>

        {/* Invoice Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 24,
          border: '1px solid var(--color-blush-border)',
          padding: '36px 32px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: 32
        }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F0E4DE', paddingBottom: 20, marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', color: 'var(--color-primary)' }}>
                Sasti Boutique Tax Invoice Summary
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                Placed on: {new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handlePrint}
            >
              <Printer size={15} /> Print / Save Invoice
            </button>
          </div>

          {/* Delivery & Payment Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: 26,
            background: '#FAF6F4',
            padding: 22,
            borderRadius: 16,
            border: '1px solid #EEDCD5',
            marginBottom: 26,
            fontSize: '0.9rem'
          }}>
            <div>
              <strong style={{ display: 'block', color: 'var(--color-primary)', marginBottom: 6 }}>
                Shipping Destination:
              </strong>
              <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{order.customer_name}</p>
              <p style={{ color: 'var(--color-text-muted)' }}>{order.address_house}, {order.address_street}</p>
              <p style={{ color: 'var(--color-text-muted)' }}>{order.city}, {order.state} - <strong>{order.pincode}</strong></p>
              <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>
                Phone: <strong>{order.phone}</strong> | Email: {order.email}
              </p>
              {order.delivery_instructions && (
                <p style={{ color: 'var(--color-gold)', fontSize: '0.82rem', marginTop: 6 }}>
                  Note: {order.delivery_instructions}
                </p>
              )}
            </div>

            <div>
              <strong style={{ display: 'block', color: 'var(--color-primary)', marginBottom: 6 }}>
                Payment & Fulfillment:
              </strong>
              <p style={{ color: 'var(--color-text-main)', marginBottom: 4 }}>
                Method: <strong>{order.payment_method === 'COD' ? 'Cash on Delivery (COD)' : 'Mock Online Testing'}</strong>
              </p>
              <p style={{ color: 'var(--color-text-main)', marginBottom: 6 }}>
                Payment Status: <span className="badge badge-pending" style={{ fontSize: '0.72rem' }}>{order.payment_status}</span>
              </p>
              <p style={{ color: 'var(--color-text-main)' }}>
                Fulfillment: <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>{order.status || 'Pending'}</span>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <h4 style={{ fontSize: '1.1rem', marginBottom: 14 }}>Items Ordered:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {order.items && order.items.map((item, idx) => (
              <div 
                key={idx} 
                style={{
                  display: 'grid',
                  gridTemplateColumns: '55px 1fr auto auto',
                  gap: 16,
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid #F2E4DE'
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  style={{ width: 55, height: 65, borderRadius: 8, objectFit: 'cover', background: '#F8F4F2' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div>
                  <h5 style={{ fontSize: '0.96rem', marginBottom: 2 }}>{item.product_name}</h5>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    Size: <strong>{item.selected_size}</strong>
                    {item.selected_color && ` • Shade: ${item.selected_color}`}
                  </p>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  ₹{item.price} × {item.quantity}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  ₹{item.subtotal.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            maxWidth: 320,
            marginLeft: 'auto',
            paddingTop: 12,
            borderTop: '2px solid #F0E4DE',
            fontSize: '0.92rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Subtotal:</span>
              <span style={{ fontWeight: 600 }}>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Shipping Fee:</span>
              <span>{order.delivery_fee === 0 ? <strong style={{ color: 'var(--color-success)' }}>FREE</strong> : `₹${order.delivery_fee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', paddingTop: 8, borderTop: '1px dashed #DFC8C0' }}>
              <strong>Grand Total:</strong>
              <strong style={{ color: 'var(--color-primary)' }}>₹{order.total_amount.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              if (onTrackOrder) onTrackOrder(order.order_ref);
              else setCurrentPage('track');
            }}
          >
            <Package size={18} /> Track Your Package Status
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            Return to Boutique <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
