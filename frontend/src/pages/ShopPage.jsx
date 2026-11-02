import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, RefreshCw, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { shopApi } from '../services/api';

export default function ShopPage({ initialSearch = '', onQuickView, onBuyNow }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [pricePreset, setPricePreset] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = { sort: sortBy };
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (inStockOnly) params.inStockOnly = '1';

      if (pricePreset === 'under_500') params.maxPrice = 500;
      else if (pricePreset === '500_1000') { params.minPrice = 500; params.maxPrice = 1000; }
      else if (pricePreset === '1000_2000') { params.minPrice = 1000; params.maxPrice = 2000; }
      else if (pricePreset === 'above_2000') params.minPrice = 2000;

      const res = await shopApi.getProducts(params);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to load shop catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, pricePreset, inStockOnly, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const handleReset = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPricePreset('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #FAF4F0 0%, #F5EAE6 100%)',
          borderRadius: 20,
          padding: '36px 32px',
          marginBottom: 32,
          border: '1px solid #EEDCD5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20
        }}>
          <div>
            <span className="badge badge-burgundy" style={{ marginBottom: 8 }}>
              COMPLETE BOUTIQUE STORE
            </span>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary)', marginBottom: 8 }}>
              All Boutique Collections
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.98rem', maxWidth: 600 }}>
              Explore our complete collection of ethnic chudithars, daily kurtas, and luxury makeup essentials in one place.
            </p>
          </div>

          <div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
              {products.length} Items Listed
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginBottom: 30,
          borderBottom: '1px solid #EEDCD5',
          paddingBottom: 14,
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.92rem',
              background: selectedCategory === 'all' ? 'var(--color-primary)' : '#FFFFFF',
              color: selectedCategory === 'all' ? '#FFFFFF' : 'var(--color-text-main)',
              border: '1px solid #DFC8C0'
            }}
          >
            All Collections
          </button>
          <button
            onClick={() => setSelectedCategory('chudithar')}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.92rem',
              background: selectedCategory === 'chudithar' ? 'var(--color-primary)' : '#FFFFFF',
              color: selectedCategory === 'chudithar' ? '#FFFFFF' : 'var(--color-text-main)',
              border: '1px solid #DFC8C0'
            }}
          >
            Chudithar Sets Only
          </button>
          <button
            onClick={() => setSelectedCategory('makeup')}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.92rem',
              background: selectedCategory === 'makeup' ? 'var(--color-primary)' : '#FFFFFF',
              color: selectedCategory === 'makeup' ? '#FFFFFF' : 'var(--color-text-main)',
              border: '1px solid #DFC8C0'
            }}
          >
            Makeup Products Only
          </button>
        </div>

        {/* Filter Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '270px 1fr',
          gap: 32,
          alignItems: 'start'
        }}>
          {/* Sidebar */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 18,
            border: '1px solid var(--color-blush-border)',
            padding: 24,
            boxShadow: 'var(--shadow-sm)',
            position: 'sticky',
            top: 90
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #F0E4DE' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                <SlidersHorizontal size={18} style={{ color: 'var(--color-primary)' }} />
                <span>Filters</span>
              </div>
              <button 
                onClick={handleReset}
                style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <RefreshCw size={12} /> Reset
              </button>
            </div>

            {/* Price Presets */}
            <div style={{ marginBottom: 24 }}>
              <label className="form-label" style={{ fontWeight: 700, marginBottom: 10 }}>Price Bracket (₹)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.86rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" name="shopPrice" checked={pricePreset === 'all'} onChange={() => setPricePreset('all')} />
                  <span>All Prices</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" name="shopPrice" checked={pricePreset === 'under_500'} onChange={() => setPricePreset('under_500')} />
                  <span>Under ₹500</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" name="shopPrice" checked={pricePreset === '500_1000'} onChange={() => setPricePreset('500_1000')} />
                  <span>₹500 - ₹1,000</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" name="shopPrice" checked={pricePreset === '1000_2000'} onChange={() => setPricePreset('1000_2000')} />
                  <span>₹1,000 - ₹2,000</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" name="shopPrice" checked={pricePreset === 'above_2000'} onChange={() => setPricePreset('above_2000')} />
                  <span>Above ₹2,000</span>
                </label>
              </div>
            </div>

            {/* In stock */}
            <div style={{ paddingTop: 14, borderTop: '1px solid #F0E4DE' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Grid Area */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 26,
              gap: 16,
              flexWrap: 'wrap'
            }}>
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 8, flexGrow: 1, maxWidth: 360 }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ padding: '8px 14px', fontSize: '0.88rem' }}
                  placeholder="Search across entire store..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary btn-sm">
                  <Search size={14} />
                </button>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>Sort By:</span>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '8px 14px', fontSize: '0.88rem' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
                Loading boutique items...
              </div>
            ) : products.length === 0 ? (
              <div style={{
                background: '#FFFFFF',
                borderRadius: 18,
                padding: '60px 20px',
                textAlign: 'center',
                border: '1px solid var(--color-blush-border)'
              }}>
                <h3 style={{ marginBottom: 10 }}>No products found</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 20 }}>
                  Try adjusting your search or filters to discover other boutique favorites.
                </p>
                <button className="btn btn-primary btn-sm" onClick={handleReset}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    onBuyNow={onBuyNow}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: '270px 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
