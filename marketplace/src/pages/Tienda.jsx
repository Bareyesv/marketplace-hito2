import { useState, useMemo } from 'react'
import { FiFilter, FiX } from 'react-icons/fi'
import { useApp, ACTIONS } from '../context/AppContext'
import { useProducts } from '../hooks/useMarketplace'
import ProductCard from '../components/products/ProductCard'
import './Tienda.css'

const PAGE_SIZE = 8

export default function Tienda() {
  const { state, dispatch } = useApp()
  const { posts, loading } = useProducts()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sortBy, setSortBy] = useState('recent')
  const [page, setPage] = useState(1)

  const sortedPosts = useMemo(() => (
    [...posts].sort((a, b) => {
      if (sortBy === 'price-asc') return a.precio - b.precio
      if (sortBy === 'price-desc') return b.precio - a.precio
      return b.id - a.id
    })
  ), [posts, sortBy])

  const totalPages = Math.ceil(sortedPosts.length / PAGE_SIZE)
  const visiblePosts = sortedPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const clearFilters = () => {
    dispatch({ type: ACTIONS.SET_CATEGORY, payload: null })
    dispatch({ type: ACTIONS.SET_SEARCH, payload: '' })
    setPage(1)
  }

  const handleSort = (value) => { setSortBy(value); setPage(1) }
  const handleCategory = (id) => { dispatch({ type: ACTIONS.SET_CATEGORY, payload: id }); setPage(1) }

  const hasFilters = state.selectedCategory || state.searchQuery

  return (
    <div className="tienda page-enter">

      {/* Header */}
      <div className="tienda-header container">
        <div>
          <h1 className="tienda-title">Tienda</h1>
          <p className="text-muted">
            {loading ? 'Cargando...' : `${posts.length} productos encontrados`}
          </p>
        </div>
        <div className="tienda-controls">
          <select className="sort-select" value={sortBy} onChange={e => handleSort(e.target.value)}>
            <option value="recent">Más recientes</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
          <button className="filter-toggle" onClick={() => setSidebarOpen(v => !v)}>
            <FiFilter /> Filtros
            {hasFilters && <span className="filter-badge">!</span>}
          </button>
        </div>
      </div>

      <div className="tienda-layout container">
        {/* Sidebar */}
        <aside className={`tienda-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filtros</h3>
            <button onClick={() => setSidebarOpen(false)} className="sidebar-close"><FiX /></button>
          </div>

          {hasFilters && (
            <button className="clear-filters" onClick={clearFilters}>
              <FiX /> Limpiar filtros
            </button>
          )}

          <div className="filter-section">
            <h4 className="filter-title">Categorías</h4>
            <div className="filter-options">
              <button
                className={`filter-option ${!state.selectedCategory ? 'active' : ''}`}
                onClick={() => handleCategory(null)}
              >
                Todas las categorías
              </button>
              {state.categories.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-option ${state.selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategory(cat.id)}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

        {/* Products */}
        <div className="tienda-products">
          {loading ? (
            <div className="products-grid-shop">
              {[...Array(PAGE_SIZE)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 320, borderRadius: 20 }} />
              ))}
            </div>
          ) : visiblePosts.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: '3rem' }}>🔍</span>
              <h3>No se encontraron productos</h3>
              <p>Intenta con otros filtros o palabras clave</p>
              <button className="btn btn--outline btn--md" onClick={clearFilters}>Limpiar filtros</button>
            </div>
          ) : (
            <>
              <div className="products-grid-shop">
                {visiblePosts.map((post, i) => (
                  <ProductCard key={post.id} post={post} style={{ animationDelay: `${i * 0.05}s` }} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      className={`page-btn ${n === page ? 'active' : ''}`}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    className="page-btn"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages}
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
