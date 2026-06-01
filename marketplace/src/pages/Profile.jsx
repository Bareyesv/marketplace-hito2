import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { FiUser, FiPlusSquare, FiList, FiHeart, FiLogOut, FiMail, FiEdit } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { useAuth } from '../hooks/useMarketplace'
import './Profile.css'

const NAV_ITEMS = [
  { to: '/perfil', label: 'Mi Perfil', icon: <FiUser />, end: true },
  { to: '/perfil/editar', label: 'Editar Perfil', icon: <FiEdit /> },
  { to: '/perfil/crear', label: 'Crear Publicación', icon: <FiPlusSquare /> },
  { to: '/perfil/publicaciones', label: 'Mis Publicaciones', icon: <FiList /> },
  { to: '/perfil/favoritos', label: 'Mis Favoritos', icon: <FiHeart /> },
]

export default function Profile() {
  const { state } = useApp()
  const { logout } = useAuth()
  const location = useLocation()
  const isRoot = location.pathname === '/perfil'

  return (
    <div className="profile-layout page-enter">
      <div className="container profile-container">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-user-card">
            <div className="profile-avatar">
              {state.user?.nombre?.[0]?.toUpperCase()}
            </div>
            <div className="profile-user-info">
              <h3>{state.user?.nombre}</h3>
              <p className="text-muted text-small">
                <FiMail style={{ verticalAlign: 'middle', marginRight: 4 }} />
                {state.user?.email}
              </p>
            </div>
          </div>

          <nav className="profile-nav">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `profile-nav-item ${isActive ? 'active' : ''}`}
              >
                {item.icon} {item.label}
              </NavLink>
            ))}
          </nav>

          <button className="profile-logout" onClick={logout}>
            <FiLogOut /> Cerrar Sesión
          </button>
        </aside>

        {/* Content */}
        <div className="profile-content">
          {isRoot ? <ProfileHome /> : <Outlet />}
        </div>
      </div>
    </div>
  )
}

function ProfileHome() {
  const { state } = useApp()
  const myPosts = state.posts.filter(p => p.user_id === state.user?.id)
  const { logout } = useAuth()

  return (
    <div className="profile-home">
      <div className="profile-home-header">
        <h1 className="profile-page-title">Mi Perfil</h1>
        <Link to="/perfil/editar" className="btn btn--outline btn--sm profile-edit-btn">
          <FiEdit /> Editar perfil
        </Link>
      </div>

      <div className="profile-info-card">
        <div className="profile-info-row">
          <span className="profile-info-label">Nombre</span>
          <span className="profile-info-value">{state.user?.nombre}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Correo</span>
          <span className="profile-info-value">{state.user?.email}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Publicaciones</span>
          <span className="profile-info-value">{myPosts.length}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Favoritos</span>
          <span className="profile-info-value">{state.favorites.length}</span>
        </div>
      </div>

      <div className="profile-quick-actions">
        <Link to="/perfil/editar" className="quick-action">
          <FiEdit /> <span>Editar Perfil</span>
        </Link>
        <Link to="/perfil/crear" className="quick-action">
          <FiPlusSquare /> <span>Nueva Publicación</span>
        </Link>
        <Link to="/perfil/publicaciones" className="quick-action">
          <FiList /> <span>Mis Publicaciones</span>
        </Link>
        <Link to="/perfil/favoritos" className="quick-action">
          <FiHeart /> <span>Mis Favoritos</span>
        </Link>
        <button className="quick-action danger" onClick={logout}>
          <FiLogOut /> <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  )
}
