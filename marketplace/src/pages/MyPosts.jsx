import { Link } from 'react-router-dom'
import { FiPlusSquare, FiPackage } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { MOCK_POSTS } from '../services/api'
import ProductCard from '../components/products/ProductCard'
import Button from '../components/common/Button'
import './SharedProfile.css'

export default function MyPosts() {
  const { state } = useApp()
  const allPosts = state.posts.length ? state.posts : MOCK_POSTS
  const myPosts = allPosts.filter(p => p.user_id === state.user?.id)

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
        <div className="profile-products-grid">
          {myPosts.map((post, i) => (
            <ProductCard key={post.id} post={post} style={{ animationDelay: `${i * 0.07}s` }} />
          ))}
        </div>
      )}
    </div>
  )
}
