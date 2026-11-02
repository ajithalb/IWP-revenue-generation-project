import React, { useState } from 'react';
import { Lock, User, KeyRound, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage({ onLoginSuccess, setCurrentPage }) {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@Sasti2026');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await login(username, password);
    if (res.success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div style={{ padding: '70px 0 100px', minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 460 }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: 24,
          padding: '40px 36px',
          border: '1px solid var(--color-blush-border)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #B57779 0%, #8F5254 100%)',
              color: '#F7F0E7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 20px rgba(168, 106, 108, 0.25)'
            }}>
              <Lock size={28} />
            </div>

            <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: 4 }}>
              Boutique Owner Portal
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
              Sign in to manage orders, stock, bridal bookings & catalog.
            </p>
          </div>

          {/* Localhost Demo Credentials Helper */}
          <div style={{
            background: '#FAF6F4',
            border: '1px dashed #DFC8C0',
            borderRadius: 12,
            padding: '12px 16px',
            fontSize: '0.84rem',
            color: 'var(--color-text-main)',
            marginBottom: 24
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 4 }}>
              <ShieldCheck size={14} /> Local Development Admin Credentials:
            </div>
            <div>Username: <code style={{ background: '#FFFFFF', padding: '2px 6px', borderRadius: 4 }}>admin</code></div>
            <div>Password: <code style={{ background: '#FFFFFF', padding: '2px 6px', borderRadius: 4 }}>Admin@Sasti2026</code></div>
          </div>

          {error && (
            <div style={{
              background: '#FCE8E6',
              border: '1px solid #F5C6CB',
              color: '#721C24',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: '0.88rem',
              marginBottom: 18
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Admin Username or Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 40 }}
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <User size={18} style={{ position: 'absolute', left: 14, top: 13, color: 'var(--color-text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: 40 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <KeyRound size={18} style={{ position: 'absolute', left: 14, top: 13, color: 'var(--color-text-muted)' }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: 10 }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'} <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 22, paddingTop: 16, borderTop: '1px solid #F0E4DE' }}>
            <button
              onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}
            >
              ← Return to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
