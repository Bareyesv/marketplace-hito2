import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlusSquare, FiPackage, FiEdit2, FiTrash2, FiAlertTriangle } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { useDeletePost } from '../hooks/useMarketplace'
import { MOCK_POSTS, MOCK_CATEGORIES } from '../services/api'
import Button from '../components/common/Button'
import './SharedProfile.css'
import './MyPosts.css'

function formatPrice(price) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price)
}

export default function MyPosts() {
  const { state } = useApp()
  const { deletePost, loadingId } = useDeletePost()
  const [confirmId, setConfirmId] = useState(null)

  const allPosts = state.posts.length ? state.posts : MOCK_POSTS
  const allCats = state.categories.length ? state.categories : MOCK_CATEGORIES
  const myPosts = allPosts.filter(p => p.user_id === state.user?.id)

  const getCatName = (catId) => allCats.find(c => c.id === catId)?.nombre || ''

  const handleDelete = async (id) => {
    await deletePost(id)
    setConfirmId(null)
  }

  return (
    <div className="shared-profile-page page-enter">
      <div className="shared-header">
        <div>
          <h1 className="profile-page-title">Mis Publicaciones</h1>
          <p className="text-muted">{myPosts.length} publicaciones activas</p>
        </div>
        <Link to="/perfil/crear">
          <Button icon={<FiPlusSquare />}>Nueva Publicación</Button>
        </Link>
      </div>

      {myPosts.length === 0 ? (
        <div className="empty-profile">
          <FiPackage className="empty-icon" />
          <h3>No tienes publicaciones aún</h3>
          <p>Publica tu primer producto y comienza a vender.</p>
          <Link to="/perfil/crear">
            <Button icon={<FiPlusSquare />}>Crear mi primera publicación</Button>
          </Link>
        </div>
      ) : (
        <div className="my-posts-list">
          {myPosts.map((post) => (
            <div key={post.id} className="my-post-row">
              <Link to={`/tienda/${post.id}`} className="my-post-image-wrap">
                <img
                  src={post.imagen_url}
                  alt={post.titulo}
                  className="my-post-image"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&q=80' }}
                />
              </Link>

              <div className="my-post-info">
                <Link to={`/tienda/${post.id}`} className="my-post-title">{post.titulo}</Link>
                <span className="my-post-cat text-small text-muted">{getCatName(post.category_id)}</span>
                <p className="my-post-desc text-muted text-small">{post.descripcion}</p>
              </div>

              <div className="my-post-meta">
                <span className="my-post-price">{formatPrice(post.precio)}</span>
              </div>

              <div className="my-post-actions">
                {confirmId === post.id ? (
                  <div className="delete-confirm">
                    <FiAlertTriangle className="confirm-icon" />
                    <span className="confirm-text">¿Eliminar?</span>
                    <button
                      className="confirm-yes"
                      onClick={() => handleDelete(post.id)}
                      disabled={loadingId === post.id}
                    >
                      {loadingId === post.id ? '...' : 'Sí'}
                    </button>
                    <button className="confirm-no" onClick={() => setConfirmId(null)}>No</button>
                  </div>
                ) : (
                  <>
                    <Link to={`/perfil/editar/${post.id}`} className="action-btn edit-btn" aria-label="Editar">
                      <FiEdit2 />
                      <span>Editar</span>
                    </Link>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => setConfirmId(post.id)}
                      aria-label="Eliminar"
                    >
                      <FiTrash2 />
                      <span>Eliminar</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
