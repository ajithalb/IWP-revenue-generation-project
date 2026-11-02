import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, Sparkles, CheckCircle2, Phone, Mail, AlertTriangle } from 'lucide-react';
import { shopApi } from '../services/api';

export default function BookingModal({ service, services = [], onClose, onBookingSuccess }) {
  const [selectedServiceId, setSelectedServiceId] = useState(service ? service.id : (services[0]?.id || 1));
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('06:00 AM');
  const [eventLocation, setEventLocation] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [requirements, setRequirements] = useState('');
  const [budget, setBudget] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  // Today for date min attribute
  const todayStr = new Date().toISOString().split('T')[0];

  const currentService = services.find(s => s.id === Number(selectedServiceId)) || service;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!customerName || !contactNumber || !email || !eventDate || !eventLocation) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer_name: customerName,
        contact_number: contactNumber,
        email,
        service_id: Number(selectedServiceId),
        event_date: eventDate,
        event_time: eventTime,
        event_location: eventLocation,
        guest_count: parseInt(guestCount, 10) || 1,
        additional_requirements: requirements,
        budget: budget || (currentService ? `₹${currentService.price.toLocaleString('en-IN')}` : '')
      };

      const res = await shopApi.createBooking(payload);
      setConfirmation(res.data);
      if (onBookingSuccess) onBookingSuccess(res.data.booking);
    } catch (err) {
      setError(err.message || 'Failed to submit booking request. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 680, padding: '36px 32px' }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close booking modal">
          <X size={20} />
        </button>

        {confirmation ? (
          /* Confirmation View */
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#E6F6ED',
              color: '#146C36',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <h2 style={{ fontSize: '1.9rem', marginBottom: 8, color: 'var(--color-primary)' }}>
              Booking Request Received!
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.96rem', maxWidth: 480, margin: '0 auto 20px' }}>
              Thank you, <strong>{confirmation.booking.customer_name}</strong>. Your bridal appointment request has been recorded with initial status <strong>Pending</strong>.
            </p>

            {confirmation.conflictNotice && (
              <div style={{
                background: '#FFF8E6',
                border: '1px solid #FFE499',
                padding: '12px 16px',
                borderRadius: 12,
                fontSize: '0.86rem',
                color: '#8C6207',
                marginBottom: 20,
                textAlign: 'left',
                display: 'flex',
                gap: 10
              }}>
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{confirmation.conflictNotice}</span>
              </div>
            )}

            {/* Receipt Summary Box */}
            <div style={{
              background: '#FAF6F4',
              borderRadius: 16,
              border: '1px solid #EEDCD5',
              padding: 22,
              textAlign: 'left',
              marginBottom: 24
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #EEDCD5', paddingBottom: 10, marginBottom: 10 }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Booking Reference:</span>
                <strong style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>{confirmation.booking.booking_ref}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Selected Service:</span>
                <strong>{confirmation.booking.service_name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Date & Time:</span>
                <strong>{confirmation.booking.event_date} at {confirmation.booking.event_time}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Location:</span>
                <span>{confirmation.booking.event_location}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Contact:</span>
                <span>{confirmation.booking.contact_number}</span>
              </div>
            </div>

            <div style={{
              background: '#FFFFFF',
              border: '1px dashed #DFC8C0',
              borderRadius: 12,
              padding: '14px 18px',
              fontSize: '0.86rem',
              color: 'var(--color-text-muted)',
              marginBottom: 24
            }}>
              <p style={{ marginBottom: 6 }}>For urgent bridal confirmations and saree draping requests, contact our boutique directly:</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, fontWeight: 700, color: 'var(--color-primary)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Phone size={14} /> 7904871123
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={14} /> nisanth08.connect@gamil.com
                </span>
              </div>
            </div>

            <button className="btn btn-primary btn-block" onClick={onClose}>
              Done & Return to Boutique
            </button>
          </div>
        ) : (
          /* Booking Form */
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span className="badge badge-gold" style={{ marginBottom: 8 }}>
                <Sparkles size={12} /> Bespoke Makeover Reservation
              </span>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)' }}>
                Book Bridal Makeup Artistry
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                Reserve your wedding, reception, or muhurtham makeover slot with Sasti Boutique.
              </p>
            </div>

            {error && (
              <div style={{
                background: '#FCE8E6',
                border: '1px solid #F5C6CB',
                color: '#721C24',
                padding: '10px 16px',
                borderRadius: 10,
                fontSize: '0.88rem',
                marginBottom: 18
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Service Select */}
              <div className="form-group">
                <label className="form-label">
                  Selected Makeup Package <span className="req">*</span>
                </label>
                <select
                  className="form-select"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  required
                >
                  {services.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name} — ₹{srv.price.toLocaleString('en-IN')} ({srv.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Phone */}
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
                    Contact Phone Number <span className="req">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="10-digit mobile number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="req">*</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">
                    Event Date <span className="req">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    min={todayStr}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Preferred Time Slot <span className="req">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    required
                  >
                    <option value="04:30 AM">04:30 AM (Early Muhurtham)</option>
                    <option value="05:30 AM">05:30 AM (Muhurtham)</option>
                    <option value="07:00 AM">07:00 AM (Morning Function)</option>
                    <option value="09:30 AM">09:30 AM (Engagement)</option>
                    <option value="02:00 PM">02:00 PM (Afternoon)</option>
                    <option value="04:00 PM">04:00 PM (Evening Reception)</option>
                    <option value="06:00 PM">06:00 PM (Night Gala)</option>
                  </select>
                </div>
              </div>

              {/* Location & Guests */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">
                    Event Location / Mandapam Address <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Mandapam name, Hall, or City (e.g. Mylapore, Chennai)"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total People</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    className="form-input"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                  />
                </div>
              </div>

              {/* Requirements & Budget */}
              <div className="form-group">
                <label className="form-label">Special Requirements / Saree Draping Notes</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="e.g. Traditional Kanjeevaram saree draping, temple jewelry setting, hair jasmine styling, or skin sensitivities..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                />
              </div>

              <div style={{
                background: '#FAF6F4',
                padding: '12px 16px',
                borderRadius: 12,
                fontSize: '0.84rem',
                color: 'var(--color-text-muted)',
                marginBottom: 20
              }}>
                ℹ️ <strong>Please note:</strong> New appointment requests are saved with <strong>Pending</strong> status. Our lead bridal artist will review slot feasibility and contact you via phone or WhatsApp to finalize arrangements.
              </div>

              <div style={{ display: 'flex', gap: 14 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting Reservation...' : 'Submit Booking Request'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .modal-content {
            padding: 24px 18px !important;
          }
          .modal-content form > div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
