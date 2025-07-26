const API_BASE_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${text || res.statusText}`);
  }
  return res.status === 204 ? null : res.json(); 
};

const apiService = {
  login: (data) =>
    request(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  register: (data) =>
    request(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  getProfile: (token) => {
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : getAuthHeaders();
    return request(`${API_BASE_URL}/auth/profile`, { headers });
  },

  getOverview: () =>
    request(`${API_BASE_URL}/stats/overview`, { headers: { ...getAuthHeaders() } }),

  getFoods: (params = {}) =>
    request(`${API_BASE_URL}/foods?${new URLSearchParams(params)}`, {
      headers: { ...getAuthHeaders() },
    })
    .then(res => Array.isArray(res.data?.foods) ? res.data.foods : []),

  getFood: (id) =>
    request(`${API_BASE_URL}/foods/${id}`, { headers: { ...getAuthHeaders() } }),
  createFood: (data) =>
    request(`${API_BASE_URL}/foods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    }),
  updateFood: (id, data) =>
    request(`${API_BASE_URL}/foods/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    }),
  deleteFood: (id) =>
    request(`${API_BASE_URL}/foods/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    }),

  getCategories: () => request(`${API_BASE_URL}/category`),
  getCategory: (id) => request(`${API_BASE_URL}/category/${id}`),
  createCategory: (data) =>
    request(`${API_BASE_URL}/category`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    }),
  updateCategory: (id, data) =>
    request(`${API_BASE_URL}/category/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    }),
  deleteCategory: (id) =>
    request(`${API_BASE_URL}/category/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    }),

  addToCart: ({ userId, foodId, quantity }) =>
    request(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ userId, foodId, quantity }),
    }),
  getCart: (userId) =>
    request(`${API_BASE_URL}/cart/${userId}`, { headers: { ...getAuthHeaders() } }),
  updateCart: (data) =>
    request(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    }),
  removeFromCart: (data) =>
    request(`${API_BASE_URL}/cart/remove`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    }),
  clearCart: (userId) =>
    request(`${API_BASE_URL}/cart/clear/${userId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    }),
  getCartCount: (userId) =>
    request(`${API_BASE_URL}/cart/count/${userId}`, { headers: { ...getAuthHeaders() } }),

  getOrders: () =>
    request(`${API_BASE_URL}/orders`, { headers: { ...getAuthHeaders() } }),
  getOrderStats: () =>
    request(`${API_BASE_URL}/orders/stats`, { headers: { ...getAuthHeaders() } }),
  getOrder: (id) =>
    request(`${API_BASE_URL}/orders/${id}`, { headers: { ...getAuthHeaders() } }),
  getOrdersByUser: (userId) =>
    request(`${API_BASE_URL}/orders/user/${userId}`, {
      headers: { ...getAuthHeaders() },
    }),
  getOrdersByTable: (tableId) =>
    request(`${API_BASE_URL}/orders/table/${tableId}`, {
      headers: { ...getAuthHeaders() },
    }),
  createOrder: (data) =>
    request(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    }),
  createPaymentUrl: (data) =>
    request(`${API_BASE_URL}/payment/create_payment_url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    }),
  updateOrder: (id, data) =>
    request(`${API_BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    }),
  deleteOrder: (id) =>
    request(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    }),

  getReviews: () => request(`${API_BASE_URL}/reviews`),
  getReview: (id) => request(`${API_BASE_URL}/reviews/${id}`),
  createReview: (data) =>
    request(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    }),
  updateReview: (id, data) =>
    request(`${API_BASE_URL}/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    }),
  deleteReview: (id) =>
    request(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    }),

  getTables: () => request(`${API_BASE_URL}/tables`),
  getTable: (id) => request(`${API_BASE_URL}/tables/${id}`),
  createTable: (data) =>
    request(`${API_BASE_URL}/tables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    }),
  updateTable: (id, data) =>
    request(`${API_BASE_URL}/tables/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    }),
  deleteTable: (id) =>
    request(`${API_BASE_URL}/tables/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    }),

  getUsers: () =>
    request(`${API_BASE_URL}/users`, { headers: { ...getAuthHeaders() } }),
  getUser: (id) =>
    request(`${API_BASE_URL}/users/${id}`, { headers: { ...getAuthHeaders() } }),
  getUserStats: () =>
    request(`${API_BASE_URL}/users/stats`, { headers: { ...getAuthHeaders() } }),
  createUser: (data) =>
    request(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    }),
  updateUser: (id, data) =>
    request(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    }),
  deleteUser: (id) =>
    request(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    }),
  
};

export { apiService, API_BASE_URL, getAuthHeaders, request };
