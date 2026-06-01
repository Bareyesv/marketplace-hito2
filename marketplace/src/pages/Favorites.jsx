import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingBag } from 'react-icons/fi'
import { useFavorites } from '../hooks/useMarketplace'
import ProductCard from '../components/products/ProductCard'
import Button from '../components/common/Button'
import './SharedProfile.css'

export default function Favorites() {
  const { favoritePosts, favorites } = useFavorites()

  return (
    <div className="shared-profile-page page-enter">
      <div className="shared-header">
        <div>
          <h1 className="profile-page-title">Mis Favoritos</h1>
          <p className="text-muted">{favorites.length} productos guardados</p>
        </div>
      </div>

      {favoritePosts.length === 0 ? (
        <div className="empty-profile">
          <FiHeart className="empty-icon" />
          <h3>No tienes favoritos guardados</h3>
          <p>Explora la tienda y guarda los productos que más te gusten.</p>
          <Link to="/tienda">
            <Button icon={<FiShoppingBag />}>Explorar Tienda</Button>
          </Link>
        </div>
      ) : (
        <div className="profile-products-grid">
          {favoritePosts.map((post, i) => (
            <ProductCard key={post.id} post={post} style={{ animationDelay: `${i * 0.07}s` }} />
          ))}
        </div>
      )}
    </div>
  )
}
