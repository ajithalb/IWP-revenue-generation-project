import React from 'react';
import { ShieldCheck, Truck, RotateCcw, FileText, AlertCircle } from 'lucide-react';

export default function PolicyPages({ policyType = 'shipping', setCurrentPage }) {
  const policies = {
    shipping: {
      title: 'Shipping & Delivery Policy',
      icon: Truck,
      content: (
        <>
          <div style={{
            background: '#FFF8E6',
            border: '1px solid #FFE499',
            padding: '12px 16px',
            borderRadius: 12,
            marginBottom: 24,
            fontSize: '0.86rem',
            color: '#8C6207',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span><strong>Draft Policy Notice:</strong> This is a sample draft policy provided for Sasti Boutique. The boutique owner can customize shipping timelines and partner couriers as needed before final commercial publication.</span>
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: 10, color: 'var(--color-primary)' }}>1. Delivery Timelines</h3>
          <p style={{ marginBottom: 16 }}>
            All ethnic wear orders placed before 2:00 PM IST on business days are dispatched within 24 to 48 hours from our Chennai fulfillment hub. Standard domestic courier transit takes 2-4 business days for Tamil Nadu & Southern states, and 4-6 business days for the rest of India.
          </p>

          <h3 style={{ fontSize: '1.25rem', marginBottom: 10, color: 'var(--color-primary)' }}>2. Shipping Charges</h3>
          <p style={{ marginBottom: 16 }}>
            We provide <strong>FREE Express Shipping</strong> on all domestic prepaid and Cash on Delivery (COD) orders valued at ₹999 or above. For orders below ₹999, a nominal flat courier fee of ₹70 is applied at checkout.
          </p>

          <h3 style={{ fontSize: '1.25rem', marginBottom: 10, color: 'var(--color-primary)' }}>3. Cash on Delivery (COD) Verification</h3>
          <p style={{ marginBottom: 16 }}>
            COD is available across 18,000+ pin codes in India. For high-value wedding sets exceeding ₹5,000, our support executive may place a quick verification call to your registered mobile number prior to dispatch.
          </p>
        </>
      )
    },
    returns: {
      title: 'Return, Refund & Exchange Policy',
      icon: RotateCcw,
      content: (
        <>
          <div style={{
            background: '#FFF8E6',
            border: '1px solid #FFE499',
            padding: '12px 16px',
            borderRadius: 12,
            marginBottom: 24,
            fontSize: '0.86rem',
            color: '#8C6207',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span><strong>Draft Policy Notice:</strong> This is an editable draft exchange policy for Sasti Boutique.</span>
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: 10, color: 'var(--color-primary)' }}>1. 7-Day Size Exchanges</h3>
          <p style={{ marginBottom: 16 }}>
            We want your chudithar sets to fit you impeccably. If the size ordered does not match your preference, you may request a hassle-free size exchange within 7 calendar days of package delivery.
          </p>

          <h3 style={{ fontSize: '1.25rem', marginBottom: 10, color: 'var(--color-primary)' }}>2. Conditions for Return & Exchange</h3>
          <p style={{ marginBottom: 16 }}>
            Apparel items must be unworn, unwashed, unaltered, and accompanied by original boutique tags and packaging. For hygiene reasons, opened cosmetic and makeup products cannot be returned once unsealed unless received in a transit-damaged condition.
          </p>

          <h3 style={{ fontSize: '1.25rem', marginBottom: 10, color: 'var(--color-primary)' }}>3. Bridal Booking Cancellation</h3>
          <p style={{ marginBottom: 16 }}>
            Bridal makeover appointments may be rescheduled up to 10 days before the event date without penalty, subject to slot availability on the newly requested date.
          </p>
        </>
      )
    },
    privacy: {
      title: 'Privacy & Data Protection Policy',
      icon: ShieldCheck,
      content: (
        <>
          <div style={{
            background: '#FFF8E6',
            border: '1px solid #FFE499',
            padding: '12px 16px',
            borderRadius: 12,
            marginBottom: 24,
            fontSize: '0.86rem',
            color: '#8C6207',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span><strong>Draft Policy Notice:</strong> Sample boutique privacy policy for customer reassurance.</span>
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: 10, color: 'var(--color-primary)' }}>1. Personal Information Collected</h3>
          <p style={{ marginBottom: 16 }}>
            When you place an order or reserve a bridal slot at Sasti Boutique, we collect your name, shipping address, mobile phone number, and email strictly for fulfilling orders and scheduling beauty consultations.
          </p>

          <h3 style={{ fontSize: '1.25rem', marginBottom: 10, color: 'var(--color-primary)' }}>2. No Sharing of Financial Data</h3>
          <p style={{ marginBottom: 16 }}>
            We do not store credit card numbers, CVVs, or UPI PINs. We never sell, rent, or trade your personal contact details to external third-party advertisers.
          </p>
        </>
      )
    },
    terms: {
      title: 'Terms & Conditions of Service',
      icon: FileText,
      content: (
        <>
          <div style={{
            background: '#FFF8E6',
            border: '1px solid #FFE499',
            padding: '12px 16px',
            borderRadius: 12,
            marginBottom: 24,
            fontSize: '0.86rem',
            color: '#8C6207',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span><strong>Draft Policy Notice:</strong> Terms of service governing transactions on Sasti Boutique.</span>
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: 10, color: 'var(--color-primary)' }}>1. Accuracy of Product Colors</h3>
          <p style={{ marginBottom: 16 }}>
            We strive to display ethnic fabrics and makeup shades with utmost fidelity. However, subtle variations may occur due to photography lighting and mobile/laptop screen calibrations.
          </p>

          <h3 style={{ fontSize: '1.25rem', marginBottom: 10, color: 'var(--color-primary)' }}>2. Booking Appointments</h3>
          <p style={{ marginBottom: 16 }}>
            Bridal bookings submitted online are registered with an initial 'Pending' status. The reservation is formally confirmed only once our bridal team confirms artist schedule availability with the client.
          </p>
        </>
      )
    }
  };

  const currentPolicy = policies[policyType] || policies.shipping;
  const Icon = currentPolicy.icon;

  return (
    <div style={{ padding: '50px 0 90px' }}>
      <div className="container" style={{ maxWidth: 820 }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 30, overflowX: 'auto', paddingBottom: 6 }}>
          {[
            { id: 'policy_shipping', label: 'Shipping Policy' },
            { id: 'policy_returns', label: 'Returns & Exchanges' },
            { id: 'policy_privacy', label: 'Privacy Policy' },
            { id: 'policy_terms', label: 'Terms of Service' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentPage(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: policyType === tab.id.replace('policy_', '') ? '2px solid var(--color-primary)' : '1px solid #DFC8C0',
                background: policyType === tab.id.replace('policy_', '') ? 'var(--color-primary)' : '#FFFFFF',
                color: policyType === tab.id.replace('policy_', '') ? '#FFFFFF' : 'var(--color-text-main)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 22,
          padding: '40px 36px',
          border: '1px solid var(--color-blush-border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, borderBottom: '1px solid #F0E4DE', paddingBottom: 18 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <Icon size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-gold)', fontWeight: 700 }}>
                Sasti Boutique Customer Guide
              </span>
              <h1 style={{ fontSize: '1.9rem', color: 'var(--color-primary)', marginTop: 2 }}>
                {currentPolicy.title}
              </h1>
            </div>
          </div>

          <div style={{ color: 'var(--color-text-main)', fontSize: '0.94rem', lineHeight: 1.7 }}>
            {currentPolicy.content}
          </div>
        </div>
      </div>
    </div>
  );
}
