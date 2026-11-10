// API Service for connecting frontend with backend Node.js / Express server

const API_BASE_URL = "/api";

export const getAuthToken = () => {
  return localStorage.getItem("katalogwa_auth_token");
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("katalogwa_auth_token", token);
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem("katalogwa_auth_token");
};

// Headers helper
const getHeaders = (isMultipart = false) => {
  const headers = {};
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

// 1. Fetch Products (GET /api/produk)
export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/produk${query ? `?${query}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Gagal mengambil data produk");
  return res.json();
};

// 2. Fetch Categories (GET /api/categories)
export const fetchCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error("Gagal mengambil data kategori");
  return res.json();
};

// 3. Fetch Store Settings (GET /api/store)
export const fetchStoreSettings = async () => {
  const res = await fetch(`${API_BASE_URL}/store`);
  if (!res.ok) throw new Error("Gagal mengambil pengaturan toko");
  return res.json();
};

// 4. Update Store Settings (PUT /api/store)
export const updateStoreSettings = async (settings) => {
  const res = await fetch(`${API_BASE_URL}/store`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Gagal memperbarui pengaturan toko");
  return res.json();
};

// 5. Admin Auth: Login (POST /api/auth/login)
export const loginAdmin = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Email atau password salah");
  }
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
};

// 6. Admin Auth: Profile (GET /api/auth/me)
export const fetchAdminProfile = async () => {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Sesi login berakhir atau tidak valid");
  return res.json();
};

// 7. Admin Products Management
export const createProduct = async (formDataOrObject) => {
  const isFormData = formDataOrObject instanceof FormData;
  const res = await fetch(`${API_BASE_URL}/produk`, {
    method: "POST",
    headers: getHeaders(isFormData),
    body: isFormData ? formDataOrObject : JSON.stringify(formDataOrObject),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Gagal menambahkan produk");
  }
  return data;
};

export const updateProduct = async (id, formDataOrObject) => {
  const isFormData = formDataOrObject instanceof FormData;
  const res = await fetch(`${API_BASE_URL}/produk/${id}`, {
    method: "PUT",
    headers: getHeaders(isFormData),
    body: isFormData ? formDataOrObject : JSON.stringify(formDataOrObject),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Gagal memperbarui produk");
  }
  return data;
};

export const toggleProductStock = async (id) => {
  const res = await fetch(`${API_BASE_URL}/produk/${id}/stock`, {
    method: "PATCH",
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Gagal mengubah status stok");
  }
  return data;
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE_URL}/produk/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Gagal menghapus produk");
  }
  return data;
};

