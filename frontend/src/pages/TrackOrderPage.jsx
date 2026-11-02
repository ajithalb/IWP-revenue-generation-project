import React, { useState, useEffect } from 'react';
import { Search, Package, Calendar, CheckCircle2, Clock, Truck, ShieldAlert, Phone, Mail } from 'lucide-react';
import { shopApi } from '../services/api';

export default function TrackOrderPage({ initialIdentifier = '' }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'bookings'
  const [searchTerm, setSearchTerm] = useState(initialIdentifier);
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (initialIdentifier) {
      handleSearch();
    }
  }, [initialIdentifier]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    setOrderResult(null);
    setBookingResult(null);

    try {
      if (activeTab === 'orders') {
        const res = await shopApi.getOrder(searchTerm.trim());
        setOrderResult(res.data);
      } else {
        const res = await shopApi.getBooking(searchTerm.trim());
        setBookingResult(res.data);
      }
    } catch (err) {
      setErrorMessage(err.message || 'No records found. Please check your reference ID or phone number.');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Confirmed': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  return (
    <div style={{ padding: '50px 0 90px' }}>
      <div className="container" style={{ maxWidth: 760 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span className="badge badge-gold" style={{ marginBottom: 8 }}>
            LIVE STATUS TRACKER
          </span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--color-primary)', marginBottom: 10 }}>
            Track Order & Appointment
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.98rem' }}>
            Check the real-time fulfillment status of your clothing package or bridal makeup appointment.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#FFFFFF',
          borderRadius: 16,
          padding: 6,
          border: '1px solid var(--color-blush-border)',
          marginBottom: 30
        }}>
          <button
            onClick={() => { setActiveTab('orders'); setOrderResult(null); setBookingResult(null); setErrorMessage(null); }}
            style={{
              padding: '12px 18px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: activeTab === 'orders' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'orders' ? '#FFFFFF' : 'var(--color-text-main)',
              transition: 'var(--transition)'
            }}
          >
            <Package size={18} /> Track Product Order
          </button>

          <button
            onClick={() => { setActiveTab('bookings'); setOrderResult(null); setBookingResult(null); setErrorMessage(null); }}
            style={{
              padding: '12px 18px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: activeTab === 'bookings' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'bookings' ? '#FFFFFF' : 'var(--color-text-main)',
              transition: 'var(--transition)'
            }}
          >
            <Calendar size={18} /> Bridal Makeup Booking
          </button>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          <input
            type="text"
            className="form-input"
            style={{ padding: '14px 18px', fontSize: '1rem' }}
            placeholder={activeTab === 'orders' ? 'Enter Order Ref (e.g. SB-ORD-202610-1001) or 10-digit Phone' : 'Enter Booking Ref (e.g. SB-BRK-202611-001) or Phone'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            <Search size={18} /> {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Error message */}
        {errorMessage && (
          <div style={{
            background: '#FCE8E6',
            border: '1px solid #F5C6CB',
            color: '#721C24',
            padding: '16px 20px',
            borderRadius: 14,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <ShieldAlert size={22} style={{ flexShrink: 0 }} />
            <div>
              <strong>Record not found:</strong> {errorMessage}
            </div>
          </div>
        )}

        {/* 1. ORDER RESULTS */}
        {orderResult && (
          <div>
            {(orderResult.multiple ? orderResult.orders : [orderResult.order]).map((order) => {
              const currentStep = getOrderStatusStep(order.status);

              return (
                <div 
                  key={order.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 20,
                    border: '1px solid var(--color-blush-border)',
                    padding: '30px 26px',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: 24
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F0E4DE', paddingBottom: 14, marginBottom: 20 }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Order Reference:</span>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>{order.order_ref}</h3>
                    </div>
                    <div>
                      <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : order.status === 'Cancelled' ? 'badge-cancelled' : 'badge-gold'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Visual Status Stepper */}
                  {order.status !== 'Cancelled' ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: 8,
                      textAlign: 'center',
                      margin: '24px 0 30px'
                    }}>
                      {[
                        { step: 1, label: 'Order Placed', icon: Clock },
                        { step: 2, label: 'Confirmed', icon: CheckCircle2 },
                        { step: 3, label: 'Shipped', icon: Truck },
                        { step: 4, label: 'Delivered', icon: Package }
                      ].map((s) => {
                        const Icon = s.icon;
                        const isDone = currentStep >= s.step;
                        return (
                          <div key={s.step} style={{ position: 'relative' }}>
                            <div style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: isDone ? 'var(--color-primary)' : '#F0E4DE',
                              color: isDone ? '#FFFFFF' : 'var(--color-text-light)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 8px',
                              transition: 'all 0.3s'
                            }}>
                              <Icon size={18} />
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: isDone ? 700 : 500, color: isDone ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ background: '#FCE8E6', padding: 12, borderRadius: 10, color: '#721C24', textAlign: 'center', marginBottom: 20, fontSize: '0.9rem' }}>
                      This order was cancelled. Please contact customer support for details.
                    </div>
                  )}

                  {/* Shipping & Payment Summary */}
                  <div style={{
                    background: '#FAF6F4',
                    borderRadius: 14,
                    padding: 18,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                    fontSize: '0.88rem',
                    marginBottom: 18
                  }}>
                    <div>
                      <strong>Delivery Destination:</strong>
                      <p>{order.customer_name} ({order.phone})</p>
                      <p>{order.address_house}, {order.address_street}</p>
                      <p>{order.city}, {order.state} - {order.pincode}</p>
                    </div>

                    <div>
                      <strong>Order Total:</strong>
                      <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        ₹{order.total_amount.toLocaleString('en-IN')}
                      </p>
                      <p style={{ color: 'var(--color-text-muted)' }}>
                        Method: {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Mock Payment'}
                      </p>
                    </div>
                  </div>

                  {/* Items list */}
                  <div>
                    <h5 style={{ fontSize: '0.92rem', marginBottom: 8 }}>Included Items ({order.items?.length || 0}):</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {order.items && order.items.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                          <span>{it.product_name} ({it.selected_size}) × {it.quantity}</span>
                          <strong>₹{it.subtotal.toLocaleString('en-IN')}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. BRIDAL BOOKING RESULTS */}
        {bookingResult && (
          <div>
            {(bookingResult.multiple ? bookingResult.bookings : [bookingResult.booking]).map((b) => (
              <div
                key={b.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 20,
                  border: '1px solid var(--color-blush-border)',
                  padding: '30px 26px',
                  boxShadow: 'var(--shadow-sm)',
                  marginBottom: 24
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F0E4DE', paddingBottom: 14, marginBottom: 18 }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Booking Reference:</span>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>{b.booking_ref}</h3>
                  </div>
                  <span className={`badge ${b.status === 'Confirmed' ? 'badge-success' : b.status === 'Pending' ? 'badge-pending' : 'badge-burgundy'}`}>
                    {b.status}
                  </span>
                </div>

                <div style={{
                  background: '#FAF6F4',
                  borderRadius: 14,
                  padding: 20,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                  fontSize: '0.9rem',
                  marginBottom: 18
                }}>
                  <div>
                    <strong style={{ color: 'var(--color-primary)' }}>Client & Event:</strong>
                    <p style={{ fontWeight: 600 }}>{b.customer_name}</p>
                    <p>Phone: {b.contact_number}</p>
                    <p>Email: {b.email}</p>
                    <p style={{ marginTop: 4 }}><strong>Venue:</strong> {b.event_location}</p>
                  </div>

                  <div>
                    <strong style={{ color: 'var(--color-primary)' }}>Reserved Slot:</strong>
                    <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                      {b.service_name}
                    </p>
                    <p>Date: <strong>{b.event_date}</strong></p>
                    <p>Time: <strong>{b.event_time}</strong></p>
                    <p>Guest Count: {b.guest_count} person(s)</p>
                  </div>
                </div>

                {b.additional_requirements && (
                  <div style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>
                    <strong>Special Requirements:</strong> {b.additional_requirements}
                  </div>
                )}

                <div style={{ background: '#FFFFFF', border: '1px dashed #DFC8C0', padding: 12, borderRadius: 10, fontSize: '0.84rem' }}>
                  📞 <strong>Direct Artist Line:</strong> For date adjustments or early Muhurtham coordination, call <strong>7904871123</strong> or email <strong>nisanth08.connect@gamil.com</strong>.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
