import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { shopApi } from '../services/api';

export default function ContactPage({ showToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await shopApi.submitContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim()
      });

      setSubmitted(true);
      if (showToast) showToast(res.data.message || 'Message sent successfully!', 'success');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err.message || 'Failed to submit your message. Please try again or call us directly.');
      if (showToast) showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '50px 0 90px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 45 }}>
          <span className="badge badge-gold" style={{ marginBottom: 8 }}>
            WE LOVE HEARING FROM YOU
          </span>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: 10 }}>
            Contact Sasti Boutique
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: 600, margin: '0 auto' }}>
            Whether you have questions regarding our chudithar collections, makeup items, or need bespoke bridal makeover consultation, our team is here for you.
          </p>
        </div>

        {/* 2-Column Contact Info & Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr',
          gap: 40,
          alignItems: 'start',
          marginBottom: 60
        }}>
          {/* Left Column: Direct Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Phone Card */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: 24,
              border: '1px solid var(--color-blush-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                <Phone size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Call or WhatsApp
                </span>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginTop: 2 }}>
                  7904871123
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-light)' }}>
                  Mon - Sun: 10:00 AM - 08:30 PM IST
                </span>
              </div>
            </div>

            {/* Email Card */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: 24,
              border: '1px solid var(--color-blush-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                <Mail size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Direct Email
                </span>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--color-primary)', marginTop: 2, wordBreak: 'break-all' }}>
                  nisanth08.connect@gamil.com
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-light)' }}>
                  We usually respond within 2 to 4 business hours.
                </span>
              </div>
            </div>

            {/* Boutique Location */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: 24,
              border: '1px solid var(--color-blush-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                <MapPin size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Boutique Studio
                </span>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-main)', marginTop: 2 }}>
                  Sasti Boutique Studio
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Chennai, Tamil Nadu - 600017, India
                </span>
              </div>
            </div>

            {/* Operating Hours */}
            <div style={{
              background: '#FAF6F4',
              borderRadius: 16,
              padding: 20,
              border: '1px solid #EEDCD5',
              fontSize: '0.88rem',
              color: 'var(--color-text-main)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 6 }}>
                <Clock size={16} /> Boutique Store Hours
              </div>
              <p>Monday – Saturday: 10:00 AM – 8:30 PM</p>
              <p>Sunday: 11:00 AM – 7:00 PM</p>
              <p style={{ marginTop: 6, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                *Early morning bridal bookings (4:00 AM onwards) are accommodated upon prior confirmation.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 22,
            padding: '36px 32px',
            border: '1px solid var(--color-blush-border)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h3 style={{ fontSize: '1.45rem', marginBottom: 6, color: 'var(--color-primary)' }}>
              Send Us a Message
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
              Fill out the form below. Your message will be saved to our boutique database and reviewed by our team.
            </p>

            {submitted && (
              <div style={{
                background: '#E6F6ED',
                border: '1px solid #C3E6CB',
                color: '#155724',
                padding: '14px 18px',
                borderRadius: 12,
                fontSize: '0.92rem',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
                <span>Thank you! Your message has been safely received. We will respond promptly.</span>
              </div>
            )}

            {error && (
              <div style={{
                background: '#FCE8E6',
                border: '1px solid #F5C6CB',
                color: '#721C24',
                padding: '12px 16px',
                borderRadius: 12,
                fontSize: '0.88rem',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">
                    Your Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Meenakshi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email Address <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="meenakshi@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Subject <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Bridal Saree Draping inquiry"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Your Message <span className="req">*</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  placeholder="How can Sasti Boutique assist you with your outfit or makeover today?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={submitting}
              >
                <Send size={18} /> {submitting ? 'Sending Message...' : 'Submit Message'}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{
          background: '#FAF6F4',
          borderRadius: 24,
          padding: '45px 36px',
          border: '1px solid #EEDCD5'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span className="section-pretitle">Helpful Questions</span>
            <h2 style={{ fontSize: '1.9rem' }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: '#FFFFFF', padding: 22, borderRadius: 14, border: '1px solid #EEDCD5' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: 8, color: 'var(--color-primary)' }}>
                How long does shipping take?
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Orders within Tamil Nadu & South India are delivered within 2 to 4 business days. For the rest of India, standard courier delivery takes 4 to 6 business days.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: 22, borderRadius: 14, border: '1px solid #EEDCD5' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: 8, color: 'var(--color-primary)' }}>
                Is Cash on Delivery available?
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Yes! We offer 100% Cash on Delivery across most pin codes in India. You can inspect your package and pay cash or UPI directly upon delivery.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: 22, borderRadius: 14, border: '1px solid #EEDCD5' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: 8, color: 'var(--color-primary)' }}>
                Do you travel for outstation weddings?
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Yes! Our bridal artists travel across India for destination and outstation weddings. Travel and accommodation are coordinated at actuals upon booking confirmation.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: 22, borderRadius: 14, border: '1px solid #EEDCD5' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: 8, color: 'var(--color-primary)' }}>
                Can I request size exchanges?
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Yes, we offer hassle-free size exchanges within 7 days of delivery for all unwashed and tagged chudithar sets.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: '1fr 1.3fr'"],
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
