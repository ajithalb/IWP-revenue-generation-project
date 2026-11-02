import React, { useState } from 'react';
import './styles/index.css';

// Context Providers
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import BookingModal from './components/BookingModal';
import Toast from './components/Toast';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ChuditharPage from './pages/ChuditharPage';
import MakeupPage from './pages/MakeupPage';
import BridalPage from './pages/BridalPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import WishlistPage from './pages/WishlistPage';
import PolicyPages from './pages/PolicyPages';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function MainApp() {
  const { isAuthenticated } = useAuth();

  // Navigation State
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bookingService, setBookingService] = useState(null);
  const [servicesList, setServicesList] = useState([]);

  // Checkout & Order State
  const [buyNowItem, setBuyNowItem] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [trackIdentifier, setTrackIdentifier] = useState('');

  // Toast System
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Quick View Handler
  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  // Buy Now Handler
  const handleBuyNow = (product, size, color, quantity = 1) => {
    const item = {
      product_id: product.id,
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      selected_size: size || (product.sizes?.[0] || 'Standard'),
      selected_color: color || (product.colors?.[0] || 'Default'),
      image_url: product.image_url,
      stock: product.stock
    };
    setBuyNowItem(item);
    setSelectedProduct(null);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Bridal Booking Trigger
  const handleBookService = (service) => {
    setBookingService(service);
  };

  // Order Placed Success Handler
  const handleOrderPlaced = (order) => {
    setPlacedOrder(order);
    setBuyNowItem(null);
    setCurrentPage('order_confirmed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Order #${order.order_ref} placed successfully!`, 'success');
  };

  // Track Order Trigger
  const handleTrackOrder = (ref) => {
    setTrackIdentifier(ref);
    setCurrentPage('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Page Content
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            setCurrentPage={setCurrentPage}
            onQuickView={handleQuickView}
            onBuyNow={handleBuyNow}
            onBookService={handleBookService}
          />
        );
      case 'shop':
        return (
          <ShopPage
            initialSearch={searchQuery}
            onQuickView={handleQuickView}
            onBuyNow={handleBuyNow}
          />
        );
      case 'chudithar':
        return (
          <ChuditharPage
            onQuickView={handleQuickView}
            onBuyNow={handleBuyNow}
          />
        );
      case 'makeup':
        return (
          <MakeupPage
            onQuickView={handleQuickView}
            onBuyNow={handleBuyNow}
          />
        );
      case 'bridal':
        return (
          <BridalPage
            onBookService={handleBookService}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'cart':
        return (
          <CartPage
            setCurrentPage={setCurrentPage}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            buyNowItem={buyNowItem}
            onOrderPlaced={handleOrderPlaced}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'order_confirmed':
        return (
          <OrderConfirmationPage
            order={placedOrder}
            setCurrentPage={setCurrentPage}
            onTrackOrder={handleTrackOrder}
          />
        );
      case 'track':
        return (
          <TrackOrderPage
            initialIdentifier={trackIdentifier}
          />
        );
      case 'about':
        return (
          <AboutPage
            setCurrentPage={setCurrentPage}
          />
        );
      case 'contact':
        return (
          <ContactPage
            showToast={showToast}
          />
        );
      case 'wishlist':
        return (
          <WishlistPage
            onQuickView={handleQuickView}
            onBuyNow={handleBuyNow}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'policy_shipping':
        return <PolicyPages policyType="shipping" setCurrentPage={setCurrentPage} />;
      case 'policy_returns':
        return <PolicyPages policyType="returns" setCurrentPage={setCurrentPage} />;
      case 'policy_privacy':
        return <PolicyPages policyType="privacy" setCurrentPage={setCurrentPage} />;
      case 'policy_terms':
        return <PolicyPages policyType="terms" setCurrentPage={setCurrentPage} />;
      case 'admin':
        return isAuthenticated ? (
          <AdminDashboardPage setCurrentPage={setCurrentPage} showToast={showToast} />
        ) : (
          <AdminLoginPage onLoginSuccess={() => setCurrentPage('admin')} setCurrentPage={setCurrentPage} />
        );
      default:
        return <NotFoundPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar (hidden in full admin dashboard if desired, but kept for seamless return) */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onSearchClick={(query) => {
          setSearchQuery(query);
          setCurrentPage('shop');
        }}
      />

      {/* Main Page Area */}
      <main style={{ flexGrow: 1 }}>
        {renderPage()}
      </main>

      {/* Footer */}
      {currentPage !== 'admin' && (
        <Footer
          setCurrentPage={setCurrentPage}
          showToast={showToast}
        />
      )}

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onCheckout={() => {
          setBuyNowItem(null);
          setCurrentPage('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onViewCart={() => {
          setCurrentPage('cart');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartShopping={() => {
          setCurrentPage('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* Bridal Makeup Booking Modal */}
      {bookingService && (
        <BookingModal
          service={bookingService}
          services={[
            { id: 1, name: 'Bridal Makeup Experience', price: 15000, duration: '3.5 - 4 Hours' },
            { id: 2, name: 'Reception Glam Makeup', price: 8000, duration: '2.5 Hours' },
            { id: 3, name: 'Engagement Elegance Makeup', price: 6000, duration: '2 Hours' },
            { id: 4, name: 'Festive & Party Makeup', price: 2500, duration: '1.5 Hours' },
            { id: 5, name: 'Bridal Trial Consultation & Makeup', price: 2000, duration: '1.5 Hours' },
            { id: 6, name: 'Bridesmaid & Family Group Makeup', price: 2000, duration: '1 Hour per person' }
          ]}
          onClose={() => setBookingService(null)}
          onBookingSuccess={(bkg) => {
            showToast(`Booking #${bkg.booking_ref} submitted!`, 'success');
          }}
        />
      )}

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function App() {
  const [appToasts, setAppToasts] = useState([]);

  const toastHandler = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setAppToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAppToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  return (
    <AuthProvider showToast={toastHandler}>
      <WishlistProvider showToast={toastHandler}>
        <CartProvider showToast={toastHandler}>
          <MainApp />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
