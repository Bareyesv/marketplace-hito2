import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Layout from './components/layout/Layout'
import Notification from './components/common/Notification'

// Pages
import Home from './pages/Home'
import Tienda from './pages/Tienda'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import MyPosts from './pages/MyPosts'
import Favorites from './pages/Favorites'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'

// Private Route Guard
function PrivateRoute({ children }) {
  const { state } = useApp()
  return state.isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { state } = useApp()

  return (
    <>
      {state.notification && <Notification />}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/tienda/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/carrito" element={<Cart />} />

          {/* Private Routes */}
          <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/perfil/crear" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
          <Route path="/perfil/publicaciones" element={<PrivateRoute><MyPosts /></PrivateRoute>} />
          <Route path="/perfil/favoritos" element={<PrivateRoute><Favorites /></PrivateRoute>} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
