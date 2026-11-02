import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, Search, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { shopApi } from '../services/api';

export default function MakeupPage({ onQuickView, onBuyNow }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [pricePreset, setPricePreset] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const subcategories = [
    { id: 'all', name: 'All Makeup Essentials' },
    { id: 'Lipstick', name: 'Lipsticks & Lip Stains' },
    { id: 'Foundation', name: 'HD Liquid Foundations' },
    { id: 'Compact Powder', name: 'Mineral Compact Powder' },
    { id: 'Kajal & Eyeliner', name: 'Kajal & Eyeliners' },
    { id: 'Mascara', name: 'Volume Waterproof Mascara' },
    { id: 'Blush & Highlighter', name: 'Blush & Highlighters' },
    { id: 'Eyeshadow Palettes', name: 'Eyeshadow Palettes' },
    { id: 'Makeup Brushes', name: 'Professional Brush Kits' },
    { id: 'Primer & Spray', name: 'Setting Mist & Primers' },
    { id: 'Makeup Kits', name: 'Bridal Vanity Kits' }
  ];

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: 'makeup',
        sort: sortBy
      };

      if (selectedSubcategory !== 'all') params.subcategory = selectedSubcategory;
      if (inStockOnly) params.inStockOnly = '1';
      if (searchQuery.trim()) params.search = searchQuery.trim();

      if (pricePreset === 'under_400') {
        params.maxPrice = 400;
      } else if (pricePreset === '400_800') {
        params.minPrice = 400;
        params.maxPrice = 800;
      } else if (pricePreset === '800_1500') {
        params.minPrice = 800;
        params.maxPrice = 1500;
      } else if (pricePreset === 'above_1500') {
        params.minPrice = 1500;
      }

      const res = await shopApi.getProducts(params);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to load makeup products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedSubcategory, pricePreset, inStockOnly, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const handleResetFilters = () => {
    setSelectedSubcategory('all');
    setPricePreset('all');
    setInStockOnly(false);
    setSortBy('featured');
    setSearchQuery('');
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Banner Header */}
        <div style={{
          background: 'linear-gradient(135deg, #FBF0EC 0%, #F5E8E4 100%)',
          borderRadius: 20,
          padding: '36px 32px',
          marginBottom: 30,
          border: '1px solid #EEDCD5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20
        }}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: 8 }}>
              <Sparkles size={12} /> BEAUTY & COSMETICS
            </span>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary)', marginBottom: 8 }}>
              Makeup Essentials & Bridal Kits
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.98rem', maxWidth: 640 }}>
              Curated beauty products designed for Indian complexions. High-pigment lipsticks, tear-proof kajal, radiant HD foundations, and complete beauty vanity boxes.
            </p>
          </div>

          <div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
              {products.length} Products Available
            </span>
          </div>
        </div>

        {/* Demo Notice Banner */}
        <div style={{
          background: '#FFF8E6',
          border: '1px solid #FFE499',
          padding: '12px 18px',
          borderRadius: 12,
          fontSize: '0.86rem',
          color: '#8C6207',
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>
            <strong>Demo Product Notice:</strong> Product names, shades, and prices shown are sample boutique formulations for demonstration purposes. Cash on Delivery is enabled for testing checkout.
          </span>
        </div>

        {/* Filter Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '270px 1fr',
          gap: 32,
          alignItems: 'start'
        }}>
          {/* Left Sidebar Filter */}
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
                onClick={handleResetFilters}
                style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <RefreshCw size={12} /> Reset
              </button>
            </div>

            {/* Subcategory List */}
            <div style={{ marginBottom: 24 }}>
              <label className="form-label" style={{ fontWeight: 700, marginBottom: 10 }}>Categories</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {subcategories.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategory(sub.id)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 8,
                      fontSize: '0.86rem',
                      fontWeight: selectedSubcategory === sub.id ? 700 : 500,
                      background: selectedSubcategory === sub.id ? 'var(--color-primary-soft)' : 'transparent',
                      color: selectedSubcategory === sub.id ? 'var(--color-primary)' : 'var(--color-text-main)',
                      transition: 'var(--transition)'
                    }}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Presets */}
            <div style={{ marginBottom: 24 }}>
              <label className="form-label" style={{ fontWeight: 700, marginBottom: 10 }}>Price Range (₹)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.86rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="makeupPrice"
                    checked={pricePreset === 'all'}
                    onChange={() => setPricePreset('all')}
                  />
                  <span>All Prices</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="makeupPrice"
                    checked={pricePreset === 'under_400'}
                    onChange={() => setPricePreset('under_400')}
                  />
                  <span>Under ₹400 (Kajal & Lipsticks)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="makeupPrice"
                    checked={pricePreset === '400_800'}
                    onChange={() => setPricePreset('400_800')}
                  />
                  <span>₹400 - ₹800 (Foundation & Blush)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="makeupPrice"
                    checked={pricePreset === '800_1500'}
                    onChange={() => setPricePreset('800_1500')}
                  />
                  <span>₹800 - ₹1,500 (Eyeshadow & Palettes)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="makeupPrice"
                    checked={pricePreset === 'above_1500'}
                    onChange={() => setPricePreset('above_1500')}
                  />
                  <span>Above ₹1,500 (Bridal Vanity Kits)</span>
                </label>
              </div>
            </div>

            {/* In Stock Filter */}
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

          {/* Right Area */}
          <div>
            {/* Toolbar */}
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
                  placeholder="Search lipstick, eyeliner, brushes..."
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

            {/* Product Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
                Loading makeup catalog...
              </div>
            ) : products.length === 0 ? (
              <div style={{
                background: '#FFFFFF',
                borderRadius: 18,
                padding: '60px 20px',
                textAlign: 'center',
                border: '1px solid var(--color-blush-border)'
              }}>
                <h3 style={{ marginBottom: 10 }}>No cosmetics found</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 20 }}>
                  Try searching for different beauty products or resetting filters.
                </p>
                <button className="btn btn-primary btn-sm" onClick={handleResetFilters}>
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
