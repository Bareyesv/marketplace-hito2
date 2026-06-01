import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FiHeart, FiArrowLeft, FiUser, FiTag, FiShare2 } from 'react-icons/fi'
import { useApp, ACTIONS } from '../context/AppContext'
import { useFavorites } from '../hooks/useMarketplace'
import { MOCK_POSTS, MOCK_CATEGORIES } from '../services/api'
import ProductCard from '../components/products/ProductCard'
import Button from '../components/common/Button'
import './ProductDetail.css'

function formatPrice(price) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price)
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useApp()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const found = (state.posts.length ? state.posts : MOCK_POSTS).find(p => p.id === Number(id))
    setTimeout(() => { setPost(found || null); setLoading(false) }, 300)
    window.scrollTo(0, 0)
  }, [id, state.posts])

  const getCategoryName = (catId) => {
    const cats = state.categories.length ? state.categories : MOCK_CATEGORIES
    return cats.find(c => c.id === catId)?.nombre || 'Sin categoría'
  }

  const related = (state.posts.length ? state.posts : MOCK_POSTS)
    .filter(p => p.id !== Number(id) && p.category_id === post?.category_id)
    .slice(0, 4)

  if (loading) {
    return (
      <div className="detail-loading container">
        <div className="skeleton" style={{ height: 480, borderRadius: 20 }} />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="detail-notfound container">
        <h2>Producto no encontrado</h2>
        <Button variant="outline" onClick={() => navigate('/tienda')} icon={<FiArrowLeft />}>
          Volver a la tienda
        </Button>
      </div>
    )
  }

  const fav = isFavorite(post.id)

  return (
    <div className="product-detail page-enter">
      <div className="container">
        {/* Breadcrumb */}
        <div className="detail-breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/tienda">Tienda</Link>
          <span>/</span>
          <span>{post.titulo}</span>
        </div>

        {/* Main */}
        <div className="detail-main">
          {/* Image */}
          <div className="detail-image-wrap">
            <img
              src={post.imagen_url}
              alt={post.titulo}
              className="detail-image"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80' }}
            />
            <div className="detail-image-overlay" />
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-meta">
              <span className="detail-category">
                <FiTag /> {getCategoryName(post.category_id)}
              </span>
              <div className="detail-actions-top">
                <button
                  className={`detail-fav ${fav ? 'active' : ''}`}
                  onClick={() => toggleFavorite(post.id)}
                >
                  <FiHeart /> {fav ? 'Guardado' : 'Favorito'}
                </button>
                <button className="detail-share">
                  <FiShare2 />
                </button>
              </div>
            </div>

            <h1 className="detail-title">{post.titulo}</h1>
            <p className="detail-price">{formatPrice(post.precio)}</p>

            <div className="detail-divider" />

            <p className="detail-desc">{post.descripcion}</p>

            <div className="detail-divider" />

            <div className="detail-seller">
              <div className="seller-avatar">
                <FiUser />
              </div>
              <div>
                <p className="seller-label text-small text-muted">Publicado por</p>
                <p className="seller-name">{post.usuario || 'Vendedor'}</p>
              </div>
            </div>

            <div className="detail-cta">
              <Button
                size="lg"
                fullWidth
                onClick={() => toggleFavorite(post.id)}
                variant={fav ? 'outline' : 'primary'}
                icon={<FiHeart />}
              >
                {fav ? 'Quitar de favoritos' : 'Marcar como favorito'}
              </Button>
              <Button size="lg" variant="outline" fullWidth onClick={() => navigate('/tienda')}>
                <FiArrowLeft /> Seguir explorando
              </Button>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="detail-related">
            <h2 className="section-title-sm">Productos Relacionados</h2>
            <div className="related-grid">
              {related.map(p => <ProductCard key={p.id} post={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
