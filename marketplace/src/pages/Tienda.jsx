import { useEffect, useRef, useState, useMemo } from 'react'
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
  const [loadingMore, setLoadingMore] = useState(false)
  const sentinelRef = useRef(null)

  const sortedPosts = useMemo(() => (
    [...posts].sort((a, b) => {
      if (sortBy === 'price-asc') return a.precio - b.precio
      if (sortBy === 'price-desc') return b.precio - a.precio
      return b.id - a.id
    })
  ), [posts, sortBy])

  const visiblePosts = sortedPosts.slice(0, page * PAGE_SIZE)
  const hasMore = visiblePosts.length < sortedPosts.length

  // Reset to page 1 when filters or sort change
  useEffect(() => { setPage(1) }, [posts, sortBy])

  // IntersectionObserver — load next batch when sentinel enters viewport
  useEffect(() => {
    if (!hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          setLoadingMore(true)
          // Small delay so skeletons are visible — simulates async fetch
          setTimeout(() => {
            setPage(p => p + 1)
            setLoadingMore(false)
          }, 500)
        }
      },
      { rootMargin: '150px' }
    )

    const el = sentinelRef.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [hasMore, loading, loadingMore])

  const clearFilters = () => {
    dispatch({ type: ACTIONS.SET_CATEGORY, payload: null })
    dispatch({ type: ACTIONS.SET_SEARCH, payload: '' })
  }

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
          <select
            className="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
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
                onClick={() => dispatch({ type: ACTIONS.SET_CATEGORY, payload: null })}
              >
                Todas las categorías
              </button>
              {state.categories.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-option ${state.selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => dispatch({ type: ACTIONS.SET_CATEGORY, payload: cat.id })}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Sidebar overlay */}
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
                  <ProductCard
                    key={post.id}
                    post={post}
                    style={{ animationDelay: `${(i % PAGE_SIZE) * 0.05}s` }}
                  />
                ))}
              </div>

              {/* Skeleton batch while loading more */}
              {loadingMore && (
                <div className="products-grid-shop load-more-grid">
                  {[...Array(Math.min(PAGE_SIZE, sortedPosts.length - visiblePosts.length))].map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: 320, borderRadius: 20 }} />
                  ))}
                </div>
              )}

              {/* Sentinel for IntersectionObserver */}
              {hasMore && !loadingMore && (
                <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />
              )}

              {/* End of list */}
              {!hasMore && sortedPosts.length > PAGE_SIZE && (
                <div className="scroll-end">
                  <span className="scroll-end-line" />
                  <span className="scroll-end-text">Has visto todos los productos</span>
                  <span className="scroll-end-line" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
