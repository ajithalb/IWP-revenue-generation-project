import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Calendar, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Eye, 
  Store,
  DollarSign,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { shopApi } from '../services/api';

export default function AdminDashboardPage({ setCurrentPage, showToast }) {
  const { adminUser, logout, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'orders', 'bookings', 'messages'
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Products Tab State
  const [products, setProducts] = useState([]);
  const [productCategory, setProductCategory] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Product Form Fields
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('chudithar');
  const [pSubcategory, setPSubcategory] = useState('Cotton Daily Wear');
  const [pPrice, setPPrice] = useState('');
  const [pOriginalPrice, setPOriginalPrice] = useState('');
  const [pStock, setPStock] = useState('15');
  const [pImage, setPImage] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pDetails, setPDetails] = useState('');
  const [pSizes, setPSizes] = useState('XS, S, M, L, XL, XXL');
  const [pColors, setPColors] = useState('Blush Pink, Crimson, Mint');
  const [pFeatured, setPFeatured] = useState(false);

  // Orders Tab State
  const [orders, setOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Bookings Tab State
  const [bookings, setBookings] = useState([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [servicePriceInput, setServicePriceInput] = useState('');

  // Messages Tab State
  const [messages, setMessages] = useState([]);
  const [messageStatusFilter, setMessageStatusFilter] = useState('all');

  // Load Dashboard Data
  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsRes, prodRes, ordRes, bkgRes, srvRes, msgRes] = await Promise.all([
        shopApi.getDashboardStats(),
        shopApi.getProducts(),
        shopApi.getAllOrders(),
        shopApi.getAllBookings(),
        shopApi.getServices(),
        shopApi.getAllContacts()
      ]);

      setStats(statsRes.data);
      setProducts(prodRes.data.products || []);
      setOrders(ordRes.data.orders || []);
      setBookings(bkgRes.data.bookings || []);
      setServices(srvRes.data.services || []);
      setMessages(msgRes.data.messages || []);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      if (showToast) showToast('Failed to load dashboard data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboard();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 450 }}>
          <h2 style={{ marginBottom: 12 }}>Admin Session Required</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 20 }}>
            Please sign in to access the boutique management dashboard.
          </p>
          <button className="btn btn-primary" onClick={() => setCurrentPage('admin')}>
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  // Handle Product Add/Edit
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setPName(product.name);
      setPCategory(product.category);
      setPSubcategory(product.subcategory);
      setPPrice(product.price);
      setPOriginalPrice(product.original_price || '');
      setPStock(product.stock);
      setPImage(product.image_url);
      setPDescription(product.description || '');
      setPDetails(product.details || '');
      setPSizes(Array.isArray(product.sizes) ? product.sizes.join(', ') : (product.sizes || ''));
      setPColors(Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || ''));
      setPFeatured(product.featured === 1);
    } else {
      setEditingProduct(null);
      setPName('');
      setPCategory('chudithar');
      setPSubcategory('Cotton Daily Wear');
      setPPrice('');
      setPOriginalPrice('');
      setPStock('15');
      setPImage('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80');
      setPDescription('');
      setPDetails('');
      setPSizes('XS, S, M, L, XL, XXL');
      setPColors('Blush Pink, Crimson, Mint');
      setPFeatured(false);
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!pName || !pPrice || !pStock || !pImage) {
      if (showToast) showToast('Please fill in required fields: Name, Price, Stock, Image URL', 'error');
      return;
    }

    const payload = {
      name: pName,
      category: pCategory,
      subcategory: pSubcategory,
      price: Number(pPrice),
      original_price: pOriginalPrice ? Number(pOriginalPrice) : null,
      stock: parseInt(pStock, 10),
      image_url: pImage,
      description: pDescription,
      details: pDetails,
      sizes: pSizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: pColors.split(',').map(c => c.trim()).filter(Boolean),
      featured: pFeatured ? 1 : 0
    };

    try {
      if (editingProduct) {
        await shopApi.updateProduct(editingProduct.id, payload);
        if (showToast) showToast(`Product "${pName}" updated successfully!`, 'success');
      } else {
        await shopApi.createProduct(payload);
        if (showToast) showToast(`New product "${pName}" created!`, 'success');
      }

      setProductModalOpen(false);
      loadDashboard();
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    try {
      await shopApi.deleteProduct(product.id);
      if (showToast) showToast('Product deleted from catalog.', 'info');
      loadDashboard();
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    }
  };

  // Quick Stock Modifier
  const handleQuickStock = async (product, delta) => {
    const newStock = Math.max(0, product.stock + delta);
    try {
      await shopApi.updateProduct(product.id, { stock: newStock });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: newStock } : p));
      if (showToast) showToast(`Stock for ${product.name} updated to ${newStock}`, 'info');
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await shopApi.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (showToast) showToast(`Order status updated to "${newStatus}"`, 'success');
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    }
  };

  // Handle Booking Status Update
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await shopApi.updateBookingStatus(bookingId, newStatus);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      if (showToast) showToast(`Booking status updated to "${newStatus}"`, 'success');
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    }
  };

  // Handle Service Price Update
  const handleSaveServicePrice = async (e) => {
    e.preventDefault();
    if (!editingService || !servicePriceInput) return;

    try {
      await shopApi.updateService(editingService.id, { price: Number(servicePriceInput) });
      if (showToast) showToast(`Price for "${editingService.name}" updated to ₹${servicePriceInput}`, 'success');
      setEditingService(null);
      loadDashboard();
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    }
  };

  // Handle Contact Message Status Update
  const handleUpdateMessageStatus = async (messageId, newStatus) => {
    try {
      await shopApi.updateContactStatus(messageId, newStatus);
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: newStatus } : m));
      if (showToast) showToast(`Message marked as "${newStatus}"`, 'info');
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCat = productCategory === 'all' || p.category.toLowerCase() === productCategory.toLowerCase();
    const matchesSearch = !productSearch.trim() || 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
      p.subcategory.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch = !orderSearch.trim() ||
      o.order_ref.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
    const matchesSearch = !bookingSearch.trim() ||
      b.booking_ref.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customer_name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.contact_number.includes(bookingSearch);
    return matchesStatus && matchesSearch;
  });

  // Filtered Messages
  const filteredMessages = messages.filter(m => {
    return messageStatusFilter === 'all' || m.status === messageStatusFilter;
  });

  return (
    <div style={{ background: '#FAF6F4', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Top Admin Header Bar */}
      <div style={{
        background: '#352724',
        color: '#FFFFFF',
        padding: '16px 0',
        borderBottom: '2px solid var(--color-champagne)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <LayoutDashboard size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '1.15rem', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                Sasti Boutique Admin Portal
              </strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-gold-light)', display: 'block' }}>
                Logged in as: <strong>{adminUser?.username || 'admin'}</strong> ({adminUser?.email || 'admin@sastiboutique.com'})
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ background: 'transparent', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
              onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <Store size={15} /> View Storefront
            </button>

            <button
              className="btn btn-sm"
              style={{ background: 'var(--color-danger)', color: '#FFFFFF' }}
              onClick={logout}
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container" style={{ marginTop: 30 }}>
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 30,
          background: '#FFFFFF',
          padding: 8,
          borderRadius: 16,
          border: '1px solid var(--color-blush-border)',
          overflowX: 'auto',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {[
            { id: 'overview', label: 'Overview & Sales', icon: LayoutDashboard },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'bookings', label: `Bridal Bookings (${bookings.length})`, icon: Calendar },
            { id: 'messages', label: `Inquiries (${messages.length})`, icon: MessageSquare }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-main)',
                  transition: 'var(--transition)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* Metric KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 20,
              marginBottom: 36
            }}>
              {/* Revenue */}
              <div style={{ background: '#FFFFFF', borderRadius: 18, padding: 24, border: '1px solid var(--color-blush-border)', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Total Realized Revenue
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', margin: '6px 0' }}>
                  ₹{(stats?.stats?.totalRevenue || 0).toLocaleString('en-IN')}
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <TrendingUp size={14} /> From non-cancelled orders
                </span>
              </div>

              {/* Total Orders */}
              <div style={{ background: '#FFFFFF', borderRadius: 18, padding: 24, border: '1px solid var(--color-blush-border)', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Total Orders Placed
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '6px 0' }}>
                  {stats?.stats?.totalOrders || 0}
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-warning)' }}>
                  {stats?.stats?.pendingOrders || 0} Pending Fulfillment
                </span>
              </div>

              {/* Bridal Bookings */}
              <div style={{ background: '#FFFFFF', borderRadius: 18, padding: 24, border: '1px solid var(--color-blush-border)', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Bridal Makeup Bookings
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '6px 0' }}>
                  {stats?.stats?.totalBookings || 0}
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                  {stats?.stats?.pendingBookings || 0} Pending Confirmation
                </span>
              </div>

              {/* Inventory Alert */}
              <div style={{ background: '#FFFFFF', borderRadius: 18, padding: 24, border: '1px solid var(--color-blush-border)', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Low Stock Inventory
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: stats?.stats?.lowStockCount > 0 ? '#BD2130' : 'var(--color-success)', margin: '6px 0' }}>
                  {stats?.stats?.lowStockCount || 0}
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Items with ≤ 5 units left
                </span>
              </div>
            </div>

            {/* Quick Two-Column View: Recent Orders & Upcoming Bookings */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: 26
            }}>
              {/* Recent Orders */}
              <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 26, border: '1px solid var(--color-blush-border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <h3 style={{ fontSize: '1.25rem' }}>Recent Orders</h3>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('orders')}>
                    View All Orders
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map(ord => (
                      <div key={ord.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#FAF6F4', borderRadius: 12 }}>
                        <div>
                          <strong>{ord.order_ref}</strong>
                          <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>
                            {ord.customer_name} • {ord.city}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 800, color: 'var(--color-primary)', display: 'block' }}>
                            ₹{ord.total_amount.toLocaleString('en-IN')}
                          </span>
                          <span className={`badge ${ord.status === 'Confirmed' ? 'badge-gold' : ord.status === 'Delivered' ? 'badge-success' : 'badge-pending'}`} style={{ fontSize: '0.7rem' }}>
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--color-text-muted)' }}>No recent orders.</p>
                  )}
                </div>
              </div>

              {/* Upcoming Bridal Appointments */}
              <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 26, border: '1px solid var(--color-blush-border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <h3 style={{ fontSize: '1.25rem' }}>Upcoming Appointments</h3>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('bookings')}>
                    View All
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {stats?.upcomingBookings && stats.upcomingBookings.length > 0 ? (
                    stats.upcomingBookings.map(bkg => (
                      <div key={bkg.id} style={{ padding: '12px 14px', background: '#FAF6F4', borderRadius: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <strong style={{ fontSize: '0.92rem' }}>{bkg.customer_name}</strong>
                          <span className="badge badge-pending" style={{ fontSize: '0.68rem' }}>{bkg.status}</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                          {bkg.service_name}
                        </p>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          📅 {bkg.event_date} at {bkg.event_time} • {bkg.event_location}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--color-text-muted)' }}>No upcoming bookings scheduled.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 28, border: '1px solid var(--color-blush-border)', boxShadow: 'var(--shadow-sm)' }}>
            {/* Header & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary)' }}>Product Inventory & Catalog</h2>
                <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                  Manage chudithar sets, makeup items, stock counts, and pricing in ₹.
                </span>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => handleOpenProductModal()}
              >
                <Plus size={18} /> Add New Product
              </button>
            </div>

            {/* Filter Bar */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
              <select
                className="form-select"
                style={{ width: 'auto' }}
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="chudithar">Chudithar Sets</option>
                <option value="makeup">Makeup Products</option>
              </select>

              <div style={{ position: 'relative', flexGrow: 1, maxWidth: 360 }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="Filter by product name or collection..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
                <Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--color-text-muted)' }} />
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#FAF6F4', borderBottom: '2px solid #EEDCD5' }}>
                    <th style={{ padding: '12px 14px' }}>Product</th>
                    <th style={{ padding: '12px 14px' }}>Category</th>
                    <th style={{ padding: '12px 14px' }}>Price (₹)</th>
                    <th style={{ padding: '12px 14px' }}>Stock</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F0E4DE' }}>
                      <td style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={p.image_url}
                          alt=""
                          style={{ width: 44, height: 52, borderRadius: 8, objectFit: 'cover', background: '#F8F4F2' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div>
                          <strong>{p.name}</strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>
                            {p.subcategory}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px', textTransform: 'capitalize' }}>
                        {p.category}
                      </td>

                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-primary)' }}>
                        ₹{p.price}
                        {p.original_price && (
                          <span style={{ textDecoration: 'line-through', color: '#9C8E90', fontSize: '0.8rem', marginLeft: 6 }}>
                            ₹{p.original_price}
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <button
                            onClick={() => handleQuickStock(p, -1)}
                            style={{ width: 24, height: 24, background: '#F0E4DE', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                            title="Decrease stock"
                          >
                            -
                          </button>
                          <strong style={{ minWidth: 24, textAlign: 'center' }}>{p.stock}</strong>
                          <button
                            onClick={() => handleQuickStock(p, 1)}
                            style={{ width: 24, height: 24, background: '#F0E4DE', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                            title="Increase stock"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        {p.stock <= 0 ? (
                          <span className="badge badge-cancelled" style={{ fontSize: '0.7rem' }}>OUT OF STOCK</span>
                        ) : p.stock <= 5 ? (
                          <span className="badge badge-pending" style={{ fontSize: '0.7rem' }}>LOW ({p.stock})</span>
                        ) : (
                          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>IN STOCK</span>
                        )}
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 8 }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '6px 12px' }}
                            onClick={() => handleOpenProductModal(p)}
                            title="Edit Product"
                          >
                            <Edit2 size={14} /> Edit
                          </button>

                          <button
                            style={{ color: '#BD2130', padding: '6px 8px' }}
                            onClick={() => handleDeleteProduct(p)}
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 28, border: '1px solid var(--color-blush-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary)' }}>Customer Orders</h2>
                <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                  View delivery addresses, item breakdowns, and update fulfillment status.
                </span>
              </div>
            </div>

            {/* Filter Bar */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
              <select
                className="form-select"
                style={{ width: 'auto' }}
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <div style={{ position: 'relative', flexGrow: 1, maxWidth: 360 }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="Search by order ref, customer, or phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
                <Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--color-text-muted)' }} />
              </div>
            </div>

            {/* Orders Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#FAF6F4', borderBottom: '2px solid #EEDCD5' }}>
                    <th style={{ padding: '12px 14px' }}>Order Ref</th>
                    <th style={{ padding: '12px 14px' }}>Customer & Destination</th>
                    <th style={{ padding: '12px 14px' }}>Items</th>
                    <th style={{ padding: '12px 14px' }}>Total (₹)</th>
                    <th style={{ padding: '12px 14px' }}>Payment</th>
                    <th style={{ padding: '12px 14px' }}>Status Updater</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(ord => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid #F0E4DE' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <strong style={{ color: 'var(--color-primary)' }}>{ord.order_ref}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>
                          {new Date(ord.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <strong>{ord.customer_name}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>
                          Phone: {ord.phone} • {ord.city}, {ord.state}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        {ord.items?.length || 0} items
                      </td>

                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-primary)' }}>
                        ₹{ord.total_amount.toLocaleString('en-IN')}
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <span className="badge badge-pending" style={{ fontSize: '0.72rem' }}>
                          {ord.payment_method}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <select
                          className="form-select"
                          style={{ padding: '4px 8px', fontSize: '0.82rem', width: 'auto' }}
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px' }}
                          onClick={() => setSelectedOrderDetails(ord)}
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: BRIDAL BOOKINGS */}
        {activeTab === 'bookings' && (
          <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 28, border: '1px solid var(--color-blush-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary)' }}>Bridal Makeup Appointments</h2>
                <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                  Confirm, complete, or reschedule customer makeover requests.
                </span>
              </div>
            </div>

            {/* Service Pricing Manager Box */}
            <div style={{
              background: '#FAF6F4',
              borderRadius: 16,
              padding: 20,
              border: '1px solid #EEDCD5',
              marginBottom: 28
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 12 }}>
                <Settings size={18} /> Manage Bridal Service Packages & Prices (₹)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                {services.map(srv => (
                  <div key={srv.id} style={{ background: '#FFFFFF', padding: 12, borderRadius: 10, border: '1px solid #DFC8C0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '0.88rem', display: 'block' }}>{srv.name}</strong>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 700 }}>₹{srv.price.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginLeft: 6 }}>({srv.duration})</span>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                      onClick={() => { setEditingService(srv); setServicePriceInput(srv.price); }}
                    >
                      Edit Price
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
              <select
                className="form-select"
                style={{ width: 'auto' }}
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
              >
                <option value="all">All Booking Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <div style={{ position: 'relative', flexGrow: 1, maxWidth: 360 }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="Search by booking ref, bride name, phone..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                />
                <Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--color-text-muted)' }} />
              </div>
            </div>

            {/* Bookings Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#FAF6F4', borderBottom: '2px solid #EEDCD5' }}>
                    <th style={{ padding: '12px 14px' }}>Ref & Date</th>
                    <th style={{ padding: '12px 14px' }}>Bride / Client</th>
                    <th style={{ padding: '12px 14px' }}>Service</th>
                    <th style={{ padding: '12px 14px' }}>Venue Location</th>
                    <th style={{ padding: '12px 14px' }}>Requirements</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(bkg => (
                    <tr key={bkg.id} style={{ borderBottom: '1px solid #F0E4DE' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <strong style={{ color: 'var(--color-primary)' }}>{bkg.booking_ref}</strong>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block' }}>
                          📅 {bkg.event_date} ({bkg.event_time})
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <strong>{bkg.customer_name}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>
                          {bkg.contact_number} • {bkg.email}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--color-primary)' }}>
                        {bkg.service_name} ({bkg.guest_count} guests)
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '0.84rem' }}>
                        {bkg.event_location}
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: 'var(--color-text-muted)', maxWidth: 200 }}>
                        {bkg.additional_requirements || 'Standard Package'}
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <select
                          className="form-select"
                          style={{ padding: '4px 8px', fontSize: '0.82rem', width: 'auto' }}
                          value={bkg.status}
                          onChange={(e) => handleUpdateBookingStatus(bkg.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: INQUIRIES & CONTACT MESSAGES */}
        {activeTab === 'messages' && (
          <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 28, border: '1px solid var(--color-blush-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary)' }}>Customer Inquiries</h2>
                <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                  Questions and custom outfit requests submitted through the Contact Us page.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
              <select
                className="form-select"
                style={{ width: 'auto' }}
                value={messageStatusFilter}
                onChange={(e) => setMessageStatusFilter(e.target.value)}
              >
                <option value="all">All Inquiries</option>
                <option value="New">New</option>
                <option value="Read">Read</option>
                <option value="Replied">Replied</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filteredMessages.map(msg => (
                <div key={msg.id} style={{ padding: 18, borderRadius: 14, background: '#FAF6F4', border: '1px solid #EEDCD5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>{msg.name}</strong>
                      <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginLeft: 10 }}>
                        {msg.email} {msg.phone && `• ${msg.phone}`}
                      </span>
                    </div>
                    <select
                      className="form-select"
                      style={{ padding: '3px 8px', fontSize: '0.78rem', width: 'auto' }}
                      value={msg.status}
                      onChange={(e) => handleUpdateMessageStatus(msg.id, e.target.value)}
                    >
                      <option value="New">New</option>
                      <option value="Read">Read</option>
                      <option value="Replied">Replied</option>
                    </select>
                  </div>

                  <h5 style={{ fontSize: '0.94rem', marginBottom: 4 }}>Subject: {msg.subject}</h5>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
                    {msg.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', display: 'block', marginTop: 8 }}>
                    Received: {new Date(msg.created_at).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {productModalOpen && (
        <div className="modal-overlay" onClick={() => setProductModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 650, padding: 32 }}>
            <button className="modal-close-btn" onClick={() => setProductModalOpen(false)}>
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', marginBottom: 20 }}>
              {editingProduct ? 'Edit Product' : 'Add New Boutique Item'}
            </h2>

            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Royal Maroon Silk Anarkali Set"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    required
                  >
                    <option value="chudithar">Chudithar Sets</option>
                    <option value="makeup">Makeup Products</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subcategory *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Anarkali Sets / Lipstick"
                    value={pSubcategory}
                    onChange={(e) => setPSubcategory(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Selling Price (₹) *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 1299"
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 1999"
                    value={pOriginalPrice}
                    onChange={(e) => setPOriginalPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Units in Stock *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 20"
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Image URL *</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="Brief boutique product description..."
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="XS, S, M, L, XL, XXL"
                    value={pSizes}
                    onChange={(e) => setPSizes(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Colors / Shades (comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Rose Gold, Crimson, Navy"
                    value={pColors}
                    onChange={(e) => setPColors(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={pFeatured}
                    onChange={(e) => setPFeatured(e.target.checked)}
                  />
                  <span>Feature on Homepage Showcase</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setProductModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ORDER DETAILS DRAWER / MODAL */}
      {selectedOrderDetails && (
        <div className="modal-overlay" onClick={() => setSelectedOrderDetails(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640, padding: 32 }}>
            <button className="modal-close-btn" onClick={() => setSelectedOrderDetails(null)}>
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', marginBottom: 4 }}>
              Order #{selectedOrderDetails.order_ref}
            </h2>
            <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: 20 }}>
              Date: {new Date(selectedOrderDetails.created_at).toLocaleString('en-IN')}
            </span>

            {/* Customer Details */}
            <div style={{ background: '#FAF6F4', padding: 18, borderRadius: 14, marginBottom: 20, fontSize: '0.9rem' }}>
              <strong>Customer & Shipping Destination:</strong>
              <p style={{ marginTop: 4 }}>{selectedOrderDetails.customer_name} ({selectedOrderDetails.phone})</p>
              <p>{selectedOrderDetails.email}</p>
              <p>{selectedOrderDetails.address_house}, {selectedOrderDetails.address_street}</p>
              <p>{selectedOrderDetails.city}, {selectedOrderDetails.state} - {selectedOrderDetails.pincode}</p>
              {selectedOrderDetails.delivery_instructions && (
                <p style={{ color: 'var(--color-gold)', marginTop: 4 }}>Note: {selectedOrderDetails.delivery_instructions}</p>
              )}
            </div>

            {/* Items */}
            <h4 style={{ marginBottom: 10 }}>Order Items:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {selectedOrderDetails.items?.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #F0E4DE', paddingBottom: 8 }}>
                  <img src={it.image_url} alt="" style={{ width: 44, height: 52, borderRadius: 6, objectFit: 'cover' }} />
                  <div style={{ flexGrow: 1 }}>
                    <strong>{it.product_name}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>
                      Size: {it.selected_size} • Qty: {it.quantity}
                    </span>
                  </div>
                  <strong>₹{it.subtotal.toLocaleString('en-IN')}</strong>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, borderTop: '2px solid #F0E4DE', paddingTop: 12, marginBottom: 24 }}>
              <span>Total:</span>
              <span style={{ color: 'var(--color-primary)' }}>₹{selectedOrderDetails.total_amount.toLocaleString('en-IN')}</span>
            </div>

            <button className="btn btn-primary btn-block" onClick={() => setSelectedOrderDetails(null)}>
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT SERVICE PRICE */}
      {editingService && (
        <div className="modal-overlay" onClick={() => setEditingService(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440, padding: 30 }}>
            <button className="modal-close-btn" onClick={() => setEditingService(null)}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', marginBottom: 8 }}>
              Edit Service Price (₹)
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: 18 }}>
              {editingService.name}
            </p>

            <form onSubmit={handleSaveServicePrice}>
              <div className="form-group">
                <label className="form-label">Price in Indian Rupees (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={servicePriceInput}
                  onChange={(e) => setServicePriceInput(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setEditingService(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Save Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
