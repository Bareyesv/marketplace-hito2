import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import { useFavorites } from '../../hooks/useMarketplace'
import './ProductCard.css'

function formatPrice(price) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price)
}

export default function ProductCard({ post, style }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const fav = isFavorite(post.id)

  return (
    <article className="product-card" style={style}>
      <Link to={`/tienda/${post.id}`} className="card-image-wrap">
        <img
          src={post.imagen_url}
          alt={post.titulo}
          className="card-image"
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80' }}
        />
        <div className="card-overlay" />
        {post.category_nombre && (
          <span className="card-badge">{post.category_nombre}</span>
        )}
      </Link>

      <div className="card-body">
        <div className="card-top">
          <Link to={`/tienda/${post.id}`} className="card-title">{post.titulo}</Link>
          <button
            className={`card-fav ${fav ? 'active' : ''}`}
            onClick={() => toggleFavorite(post.id)}
            aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <FiHeart />
          </button>
        </div>

        <p className="card-desc">{post.descripcion}</p>

        <div className="card-footer">
          <span className="card-price">{formatPrice(post.precio)}</span>
          {post.usuario && (
            <span className="card-author text-muted text-small">por {post.usuario}</span>
          )}
        </div>
      </div>
    </article>
  )
}
