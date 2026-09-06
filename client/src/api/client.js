import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token automatically — checks admin token first, then buyer token
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('acet_admin_token');
  const buyerToken = localStorage.getItem('acet_buyer_token');
  const token = adminToken || buyerToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  track: (orderId) => api.get('/orders/track', { params: { orderId } }),
  getAll: () => api.get('/orders'),
  updateStatus: (id, statusData) => api.put(`/orders/${id}/status`, statusData)
};

export const customRequestAPI = {
  create: (data) => api.post('/custom-requests', data),
  getAll: () => api.get('/custom-requests'),
  approve: (id, bedData) => api.put(`/custom-requests/${id}/approve`, bedData)
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const buyerAuthAPI = {
  register: (data) => api.post('/auth/buyer/register', data),
  login: (credentials) => api.post('/auth/buyer/login', credentials),
  getMe: () => api.get('/auth/buyer/me')
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats')
};

export const reviewAPI = {
  getByProduct: (productId) => api.get(`/reviews/${productId}`),
  create: (data) => api.post('/reviews', data)
};

export default api;

export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data)
};

export const uploadAPI = {
  uploadCadFile: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

export const pageContentAPI = {
  getByPage: (pageSlug) => api.get(`/page-content/${pageSlug}`),
  create: (data) => api.post('/page-content', data),
  update: (id, data) => api.put(`/page-content/${id}`, data),
  delete: (id) => api.delete(`/page-content/${id}`)
};

export const paymentAPI = {
  getSettings: () => api.get('/payment/settings'),
  updateSettings: (data) => api.put('/payment/settings', data),
  submitPayment: (orderId, data) => api.post(/payment//submit, data),
  getPending: () => api.get('/payment/pending'),
  verify: (id) => api.patch(/payment//verify),
  reject: (id, reason) => api.patch(/payment//reject, { reason })
};

