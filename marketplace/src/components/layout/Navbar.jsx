import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  FiSearch, FiShoppingBag, FiUser, FiLogOut, FiPlusSquare,
  FiHeart, FiList, FiX, FiMenu, FiShoppingCart, FiEdit,
} from 'react-icons/fi'
import { useApp, ACTIONS } from '../../context/AppContext'
import { useAuth, useCart } from '../../hooks/useMarketplace'
import './Navbar.css'

export default function Navbar() {
  const { state, dispatch } = useApp()
  const { logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const desktopMenuRef = useRef(null)
  const mobileDrawerRef = useRef(null)

  // Close desktop dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(e.target)) {
        setDesktopMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleSearch = (e) => {
    dispatch({ type: ACTIONS.SET_SEARCH, payload: e.target.value })
    if (e.target.value && !window.location.pathname.includes('/tienda')) {
      navigate('/tienda')
    }
  }

  const closeAll = () => {
    setMobileOpen(false)
    setDesktopMenuOpen(false)
  }

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner container">

          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeAll}>
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

          {/* ── Desktop nav (hidden on mobile) ── */}
          <nav className="navbar-links desktop-only">
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
              <div className="user-menu" ref={desktopMenuRef}>
                <button className="user-trigger" onClick={() => setDesktopMenuOpen(v => !v)}>
                  <span className="user-avatar">{state.user?.nombre?.[0]?.toUpperCase()}</span>
                  <span className="user-name">{state.user?.nombre?.split(' ')[0]}</span>
                </button>

                {desktopMenuOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <p className="dropdown-user">{state.user?.nombre}</p>
                      <p className="dropdown-email text-muted text-small">{state.user?.email}</p>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/perfil" className="dropdown-item" onClick={closeAll}><FiUser /> Mi Perfil</Link>
                    <Link to="/perfil/editar" className="dropdown-item" onClick={closeAll}><FiEdit /> Editar Perfil</Link>
                    <Link to="/perfil/crear" className="dropdown-item" onClick={closeAll}><FiPlusSquare /> Crear Publicación</Link>
                    <Link to="/perfil/publicaciones" className="dropdown-item" onClick={closeAll}><FiList /> Mis Publicaciones</Link>
                    <Link to="/perfil/favoritos" className="dropdown-item" onClick={closeAll}><FiHeart /> Mis Favoritos</Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={() => { closeAll(); logout() }}>
                      <FiLogOut /> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* ── Mobile right side (always visible) ── */}
          <div className="mobile-bar">
            <NavLink to="/carrito" className="cart-nav-btn" aria-label="Carrito" onClick={closeAll}>
              <FiShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
            </NavLink>

            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      <nav
        ref={mobileDrawerRef}
        className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        {/* User greeting or auth prompt */}
        {state.isAuthenticated ? (
          <div className="drawer-user">
            <span className="drawer-avatar">{state.user?.nombre?.[0]?.toUpperCase()}</span>
            <div>
              <p className="drawer-user-name">{state.user?.nombre}</p>
              <p className="drawer-user-email text-muted text-small">{state.user?.email}</p>
            </div>
          </div>
        ) : (
          <div className="drawer-auth-prompt">
            <Link to="/login" className="drawer-btn-fill" onClick={closeAll}>Iniciar Sesión</Link>
            <Link to="/registro" className="drawer-btn-outline" onClick={closeAll}>Registrarse</Link>
          </div>
        )}

        <div className="drawer-divider" />

        {/* Common links */}
        <NavLink to="/tienda" className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`} onClick={closeAll}>
          Tienda
        </NavLink>
        <NavLink to="/carrito" className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`} onClick={closeAll}>
          <span className="drawer-link-inner">
            Carrito
            {cartCount > 0 && <span className="drawer-cart-badge">{cartCount}</span>}
          </span>
        </NavLink>

        {/* Authenticated links */}
        {state.isAuthenticated && (
          <>
            <div className="drawer-divider" />
            <p className="drawer-section-label">Mi cuenta</p>

            <NavLink to="/perfil" end className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`} onClick={closeAll}>
              <FiUser /> Mi Perfil
            </NavLink>
            <NavLink to="/perfil/editar" className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`} onClick={closeAll}>
              <FiEdit /> Editar Perfil
            </NavLink>
            <NavLink to="/perfil/crear" className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`} onClick={closeAll}>
              <FiPlusSquare /> Crear Publicación
            </NavLink>
            <NavLink to="/perfil/publicaciones" className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`} onClick={closeAll}>
              <FiList /> Mis Publicaciones
            </NavLink>
            <NavLink to="/perfil/favoritos" className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`} onClick={closeAll}>
              <FiHeart /> Mis Favoritos
            </NavLink>

            <div className="drawer-divider" />
            <button className="drawer-link danger" onClick={() => { closeAll(); logout() }}>
              <FiLogOut /> Cerrar Sesión
            </button>
          </>
        )}
      </nav>
    </>
  )
}
