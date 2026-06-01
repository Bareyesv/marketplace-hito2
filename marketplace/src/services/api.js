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
    precio: 4200000, imagen_url: 'https://images.unsplash.com/photo-1606986628253-a5fd7b06e6ad?w=600&q=80', category_id: 1, user_id: 2, usuario: 'Carlos M.', category_nombre: 'Fotografía'
  },
  {
    id: 2, titulo: 'Silla Eames Lounge Chair', descripcion: 'Réplica premium de la icónica silla Eames en cuero genuino negro con base de aluminio pulido.',
    precio: 890000, imagen_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', category_id: 2, user_id: 3, usuario: 'Valentina R.', category_nombre: 'Hogar & Diseño'
  },
  {
    id: 3, titulo: 'MacBook Pro M3 Max 16"', descripcion: 'Laptop Apple M3 Max, 36GB RAM, 1TB SSD. Cargador original incluido. Garantía vigente hasta 2026.',
    precio: 3800000, imagen_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80', category_id: 3, user_id: 2, usuario: 'Carlos M.', category_nombre: 'Tecnología'
  },
  {
    id: 4, titulo: 'Bicicleta Trek Émonda SL6', descripcion: 'Bicicleta de ruta carbono, talla 56, grupo Shimano Ultegra. Usada una temporada, en excelente estado.',
    precio: 1650000, imagen_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80', category_id: 4, user_id: 4, usuario: 'Diego A.', category_nombre: 'Deportes'
  },
  {
    id: 5, titulo: 'Colección Libros Arquitectura', descripcion: 'Set de 8 libros de arquitectura contemporánea incluyendo Zaha Hadid, Tadao Ando y Rem Koolhaas. Impecables.',
    precio: 95000, imagen_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80', category_id: 5, user_id: 5, usuario: 'Andrea L.', category_nombre: 'Libros'
  },
  {
    id: 6, titulo: 'Guitarra Gibson Les Paul Standard', descripcion: 'Gibson Les Paul Standard 2022 en sunburst, pastillas Burstbucker Pro. Con estuche rígido original.',
    precio: 2100000, imagen_url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80', category_id: 6, user_id: 6, usuario: 'Matías V.', category_nombre: 'Música'
  },
  {
    id: 7, titulo: 'Reloj Tissot Le Locle Automático', descripcion: 'Tissot Le Locle automático, caja de acero inoxidable 39.3mm, correa de cuero café. Estado 9/10.',
    precio: 480000, imagen_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', category_id: 7, user_id: 3, usuario: 'Valentina R.', category_nombre: 'Accesorios'
  },
  {
    id: 8, titulo: 'Proyector Sony 4K Home Cinema', descripcion: 'Proyector Sony VPL-XW5000, nativo 4K, 2000 lúmenes, HDR. 120 horas de uso. Con pantalla de 100".',
    precio: 2900000, imagen_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80', category_id: 3, user_id: 7, usuario: 'Paula S.', category_nombre: 'Tecnología'
  },
  {
    id: 9, titulo: 'Drone DJI Mavic 3 Pro', descripcion: 'Drone con cámara Hasselblad 4/3 CMOS, autonomía 43 min, obstáculo omnidireccional. 15 horas de vuelo total.',
    precio: 3200000, imagen_url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=80', category_id: 1, user_id: 4, usuario: 'Diego A.', category_nombre: 'Fotografía'
  },
  {
    id: 10, titulo: 'Escritorio Standing Desk Eléctrico', descripcion: 'Escritorio de altura regulable eléctricamente, 140×70cm, tablero de bambú, motor silencioso.',
    precio: 620000, imagen_url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80', category_id: 2, user_id: 5, usuario: 'Andrea L.', category_nombre: 'Hogar & Diseño'
  },
  {
    id: 11, titulo: 'iPad Pro M4 13" + Apple Pencil', descripcion: 'iPad Pro M4 13 pulgadas, 256GB WiFi + Apple Pencil Pro. Perfecto para diseño e ilustración.',
    precio: 2400000, imagen_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80', category_id: 3, user_id: 6, usuario: 'Matías V.', category_nombre: 'Tecnología'
  },
  {
    id: 12, titulo: 'Tabla de Surf Firewire 6\'2"', descripcion: 'Tabla shortboard Firewire Volcanic, 6\'2" x 19" x 2.5". Ideal para olas medianas a grandes.',
    precio: 550000, imagen_url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=80', category_id: 4, user_id: 7, usuario: 'Paula S.', category_nombre: 'Deportes'
  },
  {
    id: 13, titulo: 'Set Fotografía Objetivos Sigma Art', descripcion: 'Pack de 3 objetivos Sigma Art: 24mm f/1.4, 35mm f/1.4 y 50mm f/1.4. Montura Sony E.',
    precio: 3500000, imagen_url: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&q=80', category_id: 1, user_id: 2, usuario: 'Carlos M.', category_nombre: 'Fotografía'
  },
  {
    id: 14, titulo: 'Lámpara de Arco Arco Flos', descripcion: 'Lámpara de arco Flos Arco original, base de mármol de Carrara, 2.5m de altura. Diseño Castiglioni.',
    precio: 1100000, imagen_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', category_id: 2, user_id: 3, usuario: 'Valentina R.', category_nombre: 'Hogar & Diseño'
  },
  {
    id: 15, titulo: 'Piano Digital Yamaha P-515', descripcion: 'Piano digital Yamaha P-515 con 88 teclas de acción GH3X y muestreo CFX. Con soporte y pedales.',
    precio: 1850000, imagen_url: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&q=80', category_id: 6, user_id: 4, usuario: 'Diego A.', category_nombre: 'Música'
  },
  {
    id: 16, titulo: 'Sony A7 IV Mirrorless', descripcion: 'Cuerpo Sony A7 IV full-frame 33MP, estabilización de 5 ejes, video 4K60. Menos de 5000 disparos.',
    precio: 2750000, imagen_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80', category_id: 1, user_id: 5, usuario: 'Andrea L.', category_nombre: 'Fotografía'
  },
  {
    id: 17, titulo: 'Monitor LG UltraFine 5K 27"', descripcion: 'Monitor LG UltraFine 5K 27", Thunderbolt 3, P3 wide color. Ideal para edición de video y foto.',
    precio: 1700000, imagen_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80', category_id: 3, user_id: 6, usuario: 'Matías V.', category_nombre: 'Tecnología'
  },
  {
    id: 18, titulo: 'Colección Haruki Murakami Completa', descripcion: '15 novelas de Haruki Murakami en edición tapa blanda. Todas en perfecto estado, sin subrayados.',
    precio: 78000, imagen_url: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=600&q=80', category_id: 5, user_id: 7, usuario: 'Paula S.', category_nombre: 'Libros'
  },
  {
    id: 19, titulo: 'Auriculares Sony WH-1000XM5', descripcion: 'Auriculares inalámbricos Sony con cancelación activa de ruido líder, 30h de batería. Como nuevos.',
    precio: 280000, imagen_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', category_id: 7, user_id: 2, usuario: 'Carlos M.', category_nombre: 'Accesorios'
  },
  {
    id: 20, titulo: 'Kayak Inflable Advanced Elements', descripcion: 'Kayak inflable AE1007 de 3.35m, capacidad 136kg, incluye remos y bomba. Perfecto estado.',
    precio: 420000, imagen_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80', category_id: 4, user_id: 3, usuario: 'Valentina R.', category_nombre: 'Deportes'
  },
  {
    id: 21, titulo: 'Bajo Eléctrico Fender Precision', descripcion: 'Fender Precision Bass 2021 en sunburst. Pastillas originales, setup profesional. Incluye funda.',
    precio: 980000, imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', category_id: 6, user_id: 4, usuario: 'Diego A.', category_nombre: 'Música'
  },
  {
    id: 22, titulo: 'Cafetera La Marzocco Linea Mini', descripcion: 'Cafetera espresso La Marzocco Linea Mini, grupo doble, 2 años de uso. Mantenimiento al día.',
    precio: 2200000, imagen_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80', category_id: 2, user_id: 5, usuario: 'Andrea L.', category_nombre: 'Hogar & Diseño'
  },
  {
    id: 23, titulo: 'Apple Watch Ultra 2', descripcion: 'Apple Watch Ultra 2 titanio, GPS + Cellular, 49mm. Correa Alpine Loop talla M. Impecable.',
    precio: 750000, imagen_url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&q=80', category_id: 7, user_id: 6, usuario: 'Matías V.', category_nombre: 'Accesorios'
  },
  {
    id: 24, titulo: 'Patines Rollerblade Twister X', descripcion: 'Patines en línea Rollerblade Twister X talla 42, marco de aluminio, ruedas 80mm. 3 sesiones de uso.',
    precio: 185000, imagen_url: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=600&q=80', category_id: 4, user_id: 7, usuario: 'Paula S.', category_nombre: 'Deportes'
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
