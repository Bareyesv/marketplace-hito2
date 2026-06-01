import axios from 'axios'

// Base URL from env or default
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mp_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor: normalize errors
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || 'Error de conexión con el servidor'
    return Promise.reject(new Error(message))
  }
)

// =====================
// AUTH ENDPOINTS
// =====================
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/users/me'),
}

// =====================
// POSTS ENDPOINTS
// =====================
export const postsService = {
  getAll: (params) => api.get('/posts', { params }),
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  getMyPosts: () => api.get('/posts/my'),
}

// =====================
// FAVORITES ENDPOINTS
// =====================
export const favoritesService = {
  add: (postId) => api.post('/favorites', { post_id: postId }),
  remove: (postId) => api.delete(`/favorites/${postId}`),
  getAll: () => api.get('/favorites'),
}

// =====================
// CATEGORIES ENDPOINTS
// =====================
export const categoriesService = {
  getAll: () => api.get('/categories'),
}

// =====================
// MOCK DATA (for demo without backend)
// =====================
export const MOCK_POSTS = [
  {
    id: 1, titulo: 'Cámara Leica M11 Profesional', descripcion: 'Cámara de fotografía full-frame de 60MP, perfecta para fotografía callejera y retratos. Poco uso, impecable.',
    precio: 4200000, imagen_url: 'https://images.unsplash.com/photo-1606986628253-a5fd7b06e6ad?w=600&q=80', category_id: 1, user_id: 2, usuario: 'Carlos M.'
  },
  {
    id: 2, titulo: 'Silla Eames Lounge Chair', descripcion: 'Réplica premium de la icónica silla Eames en cuero genuino negro con base de aluminio pulido.',
    precio: 890000, imagen_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', category_id: 2, user_id: 3, usuario: 'Valentina R.'
  },
  {
    id: 3, titulo: 'MacBook Pro M3 Max 16"', descripcion: 'Laptop Apple M3 Max, 36GB RAM, 1TB SSD. Cargador original incluido. Garantía vigente hasta 2026.',
    precio: 3800000, imagen_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80', category_id: 3, user_id: 2, usuario: 'Carlos M.'
  },
  {
    id: 4, titulo: 'Bicicleta Trek Émonda SL6', descripcion: 'Bicicleta de ruta carbono, talla 56, grupo Shimano Ultegra. Usada una temporada, en excelente estado.',
    precio: 1650000, imagen_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80', category_id: 4, user_id: 4, usuario: 'Diego A.'
  },
  {
    id: 5, titulo: 'Colección Libros Arquitectura', descripcion: 'Set de 8 libros de arquitectura contemporánea incluyendo Zaha Hadid, Tadao Ando y Rem Koolhaas. Impecables.',
    precio: 95000, imagen_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80', category_id: 5, user_id: 5, usuario: 'Andrea L.'
  },
  {
    id: 6, titulo: 'Guitarra Gibson Les Paul Standard', descripcion: 'Gibson Les Paul Standard 2022 en sunburst, pastillas Burstbucker Pro. Con estuche rígido original.',
    precio: 2100000, imagen_url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80', category_id: 6, user_id: 6, usuario: 'Matías V.'
  },
  {
    id: 7, titulo: 'Reloj Tissot Le Locle Automático', descripcion: 'Tissot Le Locle automático, caja de acero inoxidable 39.3mm, correa de cuero café. Estado 9/10.',
    precio: 480000, imagen_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', category_id: 7, user_id: 3, usuario: 'Valentina R.'
  },
  {
    id: 8, titulo: 'Proyector Sony 4K Home Cinema', descripcion: 'Proyector Sony VPL-XW5000, nativo 4K, 2000 lúmenes, HDR. 120 horas de uso. Con pantalla de 100".',
    precio: 2900000, imagen_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80', category_id: 3, user_id: 7, usuario: 'Paula S.'
  },
]

export const MOCK_CATEGORIES = [
  { id: 1, nombre: 'Fotografía' },
  { id: 2, nombre: 'Hogar & Diseño' },
  { id: 3, nombre: 'Tecnología' },
  { id: 4, nombre: 'Deportes' },
  { id: 5, nombre: 'Libros' },
  { id: 6, nombre: 'Música' },
  { id: 7, nombre: 'Accesorios' },
]

export default api
