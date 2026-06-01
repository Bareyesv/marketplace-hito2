import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiSearch, FiShoppingBag, FiUser, FiLogOut, FiPlusSquare, FiHeart, FiList, FiX, FiMenu, FiShoppingCart } from 'react-icons/fi'
import { useApp, ACTIONS } from '../../context/AppContext'
import { useAuth, useCart } from '../../hooks/useMarketplace'
import './Navbar.css'

export default function Navbar() {
  const { state, dispatch } = useApp()
  const { logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = (e) => {
    dispatch({ type: ACTIONS.SET_SEARCH, payload: e.target.value })
    if (e.target.value && !window.location.pathname.includes('/tienda')) {
      navigate('/tienda')
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-inner container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon"><FiShoppingBag /></span>
          <span className="logo-text">Market<em>Place</em></span>
        </Link>

        {/* Search */}
        <div className={`navbar-search ${searchFocused ? 'focused' : ''}`}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={state.searchQuery}
            onChange={handleSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {state.searchQuery && (
            <button className="search-clear" onClick={() => dispatch({ type: ACTIONS.SET_SEARCH, payload: '' })}>
              <FiX />
            </button>
          )}
        </div>

        {/* Nav Links */}
        <nav className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <NavLink to="/tienda" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Tienda
          </NavLink>

          <NavLink to="/carrito" className="cart-nav-btn" aria-label="Carrito de compras">
            <FiShoppingCart />
            {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
          </NavLink>

          {!state.isAuthenticated ? (
            <>
              <Link to="/login" className="btn-nav-outline">Iniciar Sesión</Link>
              <Link to="/registro" className="btn-nav-fill">Registrarse</Link>
            </>
          ) : (
            <div className="user-menu" ref={menuRef}>
              <button className="user-trigger" onClick={() => setMenuOpen(v => !v)}>
                <span className="user-avatar">{state.user?.nombre?.[0]?.toUpperCase()}</span>
                <span className="user-name">{state.user?.nombre?.split(' ')[0]}</span>
              </button>

              {menuOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-user">{state.user?.nombre}</p>
                    <p className="dropdown-email text-muted text-small">{state.user?.email}</p>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/perfil" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    <FiUser /> Mi Perfil
                  </Link>
                  <Link to="/perfil/crear" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    <FiPlusSquare /> Crear Publicación
                  </Link>
                  <Link to="/perfil/publicaciones" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    <FiList /> Mis Publicaciones
                  </Link>
                  <Link to="/perfil/favoritos" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    <FiHeart /> Mis Favoritos
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={() => { setMenuOpen(false); logout() }}>
                    <FiLogOut /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile toggle */}
        <button className="mobile-toggle" onClick={() => setMobileOpen(v => !v)}>
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  )
}
