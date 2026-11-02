import axios from 'axios';

// Base API client
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to inject admin JWT if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sasti_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

// API Service Functions
export const shopApi = {
  // Business Info
  getHealth: () => api.get('/health'),

  // Products
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // Makeup Services & Bookings
  getServices: () => api.get('/bookings/services'),
  updateService: (id, data) => api.put(`/bookings/services/${id}`, data),
  createBooking: (data) => api.post('/bookings', data),
  getBooking: (ref) => api.get(`/bookings/track/${encodeURIComponent(ref)}`),
  getAllBookings: (params) => api.get('/bookings', { params }),
  updateBookingStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),

  // Orders & Checkout
  createOrder: (data) => api.post('/orders', data),
  getOrder: (identifier) => api.get(`/orders/track/${encodeURIComponent(identifier)}`),
  getAllOrders: (params) => api.get('/orders', { params }),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),

  // Contact & Newsletter
  submitContact: (data) => api.post('/contact', data),
  getAllContacts: (params) => api.get('/contact', { params }),
  updateContactStatus: (id, status) => api.patch(`/contact/${id}/status`, { status }),
  subscribeNewsletter: (email) => api.post('/contact/newsletter', { email }),

  // Admin Auth & Stats
  login: (username, password) => api.post('/auth/login', { username, password }),
  getMe: () => api.get('/auth/me'),
  getDashboardStats: () => api.get('/stats/dashboard')
};

export default shopApi;
