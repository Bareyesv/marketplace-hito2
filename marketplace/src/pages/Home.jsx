import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiTrendingUp, FiShield, FiStar } from 'react-icons/fi'
import { useApp, ACTIONS } from '../context/AppContext'
import { MOCK_POSTS, MOCK_CATEGORIES } from '../services/api'
import ProductCard from '../components/products/ProductCard'
import Button from '../components/common/Button'
import './Home.css'

const FEATURES = [
  { icon: <FiShield />, title: 'Compra Segura', desc: 'Transacciones protegidas y vendedores verificados.' },
  { icon: <FiTrendingUp />, title: 'Mejores Precios', desc: 'Encuentra los precios más competitivos del mercado.' },
  { icon: <FiStar />, title: 'Calidad Garantizada', desc: 'Cada publicación revisada para asegurar calidad.' },
]

export default function Home() {
  const { state, dispatch } = useApp()

  useEffect(() => {
    if (state.posts.length === 0) {
      dispatch({ type: ACTIONS.SET_POSTS, payload: MOCK_POSTS })
    }
    if (state.categories.length === 0) {
      dispatch({ type: ACTIONS.SET_CATEGORIES, payload: MOCK_CATEGORIES })
    }
  }, [])

  const featured = state.posts.slice(0, 3)

  return (
    <div className="home page-enter">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob blob-1" />
          <div className="hero-blob blob-2" />
          <div className="hero-grid" />
        </div>
        <div className="hero-content container">
          <div className="hero-text">
            <span className="hero-badge">✦ Compra · Vende · Conecta</span>
            <h1 className="hero-title">
              Bienvenidos al<br />
              <em>MarketPlace</em>
            </h1>
            <p className="hero-desc">
              El espacio donde compradores y vendedores se encuentran. Descubre productos únicos,
              publica lo que ya no usas y da una segunda vida a las cosas que amas.
            </p>
            <div className="hero-actions">
              <Link to="/tienda">
                <Button size="lg" icon={<FiArrowRight />}>Explorar Tienda</Button>
              </Link>
              <Link to="/registro">
                <Button size="lg" variant="outline">Empezar a Vender</Button>
              </Link>
            </div>
          </div>
          <div className="hero-stats">
            {[['1,200+', 'Productos'], ['840+', 'Vendedores'], ['98%', 'Satisfacción']].map(([num, label]) => (
              <div key={label} className="stat-card">
                <span className="stat-num">{num}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-categories container">
        <div className="section-header">
          <h2 className="section-title">Explorar por Categoría</h2>
          <Link to="/tienda" className="section-link">Ver todo <FiArrowRight /></Link>
        </div>
        <div className="categories-grid">
          {state.categories.map((cat) => (
            <Link
              key={cat.id}
              to="/tienda"
              className="cat-chip"
              onClick={() => dispatch({ type: ACTIONS.SET_CATEGORY, payload: cat.id })}
            >
              {cat.nombre}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="section-featured container">
        <div className="section-header">
          <h2 className="section-title">Productos Destacados</h2>
          <Link to="/tienda" className="section-link">Ver todos <FiArrowRight /></Link>
        </div>
        <div className="products-grid">
          {featured.map((post, i) => (
            <ProductCard
              key={post.id}
              post={post}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section-features">
        <div className="container">
          <h2 className="section-title centered">¿Por qué elegirnos?</h2>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner container">
        <div className="cta-inner">
          <div className="cta-text">
            <h2>¿Tienes algo que vender?</h2>
            <p>Publica gratis y llega a miles de compradores hoy mismo.</p>
          </div>
          <Link to={state.isAuthenticated ? '/perfil/crear' : '/registro'}>
            <Button size="lg" variant="primary">Publicar Ahora</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
