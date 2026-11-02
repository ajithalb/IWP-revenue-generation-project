import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, Search, RefreshCw, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { shopApi } from '../services/api';

export default function ChuditharPage({ onQuickView, onBuyNow }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [pricePreset, setPricePreset] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const subcategories = [
    { id: 'all', name: 'All Chudithar Collections' },
    { id: 'Cotton Daily Wear', name: 'Cotton Daily Wear' },
    { id: 'Anarkali Sets', name: 'Anarkali Sets' },
    { id: 'Party Wear', name: 'Party Wear Ethnic' },
    { id: 'Embroidered Festive', name: 'Embroidered Festive' },
    { id: 'Straight Cut Kurta', name: 'Straight-Cut Kurta' },
    { id: 'Bridal Wedding Wear', name: 'Regal Wedding Suits' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: 'chudithar',
        sort: sortBy
      };

      if (selectedSubcategory !== 'all') params.subcategory = selectedSubcategory;
      if (selectedSize !== 'all') params.size = selectedSize;
      if (inStockOnly) params.inStockOnly = '1';
      if (searchQuery.trim()) params.search = searchQuery.trim();

      if (pricePreset === 'under_700') {
        params.maxPrice = 700;
      } else if (pricePreset === '700_1200') {
        params.minPrice = 700;
        params.maxPrice = 1200;
      } else if (pricePreset === '1200_1800') {
        params.minPrice = 1200;
        params.maxPrice = 1800;
      } else if (pricePreset === 'above_1800') {
        params.minPrice = 1800;
      }

      const res = await shopApi.getProducts(params);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to load chudithars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedSubcategory, selectedSize, pricePreset, inStockOnly, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const handleResetFilters = () => {
    setSelectedSubcategory('all');
    setSelectedSize('all');
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
          background: 'linear-gradient(135deg, #FAF2EE 0%, #F5EAE6 100%)',
          borderRadius: 20,
          padding: '36px 32px',
          marginBottom: 40,
          border: '1px solid #EEDCD5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20
        }}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: 8 }}>
              <Sparkles size={12} /> ETHNIC COLLECTION
            </span>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary)', marginBottom: 8 }}>
              Chudithar & Anarkali Sets
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.98rem', maxWidth: 640 }}>
              From pure Malmal cotton daily wear starting at ₹599 to heavy embroidered zardozi wedding ensembles. Available in sizes XS to XXL.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
              {products.length} Designs Found
            </span>
          </div>
        </div>

        {/* Filter Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '270px 1fr',
          gap: 32,
          alignItems: 'start'
        }}>
          {/* Left Filter Sidebar */}
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

            {/* Subcategory Filter */}
            <div style={{ marginBottom: 24 }}>
              <label className="form-label" style={{ fontWeight: 700, marginBottom: 10 }}>Collections</label>
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

            {/* Size Filter */}
            <div style={{ marginBottom: 24 }}>
              <label className="form-label" style={{ fontWeight: 700, marginBottom: 10 }}>Available Size</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedSize('all')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: selectedSize === 'all' ? '2px solid var(--color-primary)' : '1px solid #DFC8C0',
                    background: selectedSize === 'all' ? 'var(--color-primary-soft)' : '#FFFFFF',
                    color: selectedSize === 'all' ? 'var(--color-primary)' : 'inherit'
                  }}
                >
                  All
                </button>
                {sizes.map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: selectedSize === sz ? '2px solid var(--color-primary)' : '1px solid #DFC8C0',
                      background: selectedSize === sz ? 'var(--color-primary-soft)' : '#FFFFFF',
                      color: selectedSize === sz ? 'var(--color-primary)' : 'inherit'
                    }}
                  >
                    {sz}
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
                    name="priceRange"
                    checked={pricePreset === 'all'}
                    onChange={() => setPricePreset('all')}
                  />
                  <span>All Prices</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="priceRange"
                    checked={pricePreset === 'under_700'}
                    onChange={() => setPricePreset('under_700')}
                  />
                  <span>Under ₹700 (Daily Cotton)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="priceRange"
                    checked={pricePreset === '700_1200'}
                    onChange={() => setPricePreset('700_1200')}
                  />
                  <span>₹700 - ₹1,200</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="priceRange"
                    checked={pricePreset === '1200_1800'}
                    onChange={() => setPricePreset('1200_1800')}
                  />
                  <span>₹1,200 - ₹1,800 (Anarkali & Party)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="priceRange"
                    checked={pricePreset === 'above_1800'}
                    onChange={() => setPricePreset('above_1800')}
                  />
                  <span>Above ₹1,800 (Wedding & Festive)</span>
                </label>
              </div>
            </div>

            {/* In Stock Toggle */}
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

          {/* Right Product Grid Area */}
          <div>
            {/* Top Toolbar: Search & Sort */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 26,
              gap: 16,
              flexWrap: 'wrap'
            }}>
              {/* Search Inside Category */}
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 8, flexGrow: 1, maxWidth: 360 }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ padding: '8px 14px', fontSize: '0.88rem' }}
                  placeholder="Search inside chudithar sets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary btn-sm">
                  <Search size={14} />
                </button>
              </form>

              {/* Sort By Dropdown */}
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
                Loading chudithar collection...
              </div>
            ) : products.length === 0 ? (
              <div style={{
                background: '#FFFFFF',
                borderRadius: 18,
                padding: '60px 20px',
                textAlign: 'center',
                border: '1px solid var(--color-blush-border)'
              }}>
                <h3 style={{ marginBottom: 10 }}>No matching sets found</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 20 }}>
                  Try relaxing your size or price filters to see more designs.
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
