import { Link, useNavigate } from 'react-router-dom'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi'
import { useCart } from '../hooks/useMarketplace'
import Button from '../components/common/Button'
import './Cart.css'

function formatPrice(price) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(price)
}

export default function Cart() {
  const { cartItems, cartTotal, cartCount, removeFromCart, updateQuantity, clearCart } = useCart()
  const navigate = useNavigate()

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty container page-enter">
        <div className="cart-empty-icon"><FiShoppingBag /></div>
        <h2>Tu carrito está vacío</h2>
        <p className="text-muted">Explora la tienda y agrega productos que te interesen.</p>
        <Button onClick={() => navigate('/tienda')} icon={<FiArrowLeft />}>
          Ir a la tienda
        </Button>
      </div>
    )
  }

  return (
    <div className="cart-page container page-enter">
      <div className="cart-header">
        <h1 className="cart-title">Carrito de compras</h1>
        <span className="cart-count-label">{cartCount} {cartCount === 1 ? 'producto' : 'productos'}</span>
      </div>

      <div className="cart-layout">
        {/* Items list */}
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <Link to={`/tienda/${item.id}`} className="cart-item-image-wrap">
                <img
                  src={item.imagen_url}
                  alt={item.titulo}
                  className="cart-item-image"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&q=80' }}
                />
              </Link>

              <div className="cart-item-info">
                <Link to={`/tienda/${item.id}`} className="cart-item-title">{item.titulo}</Link>
                {item.usuario && (
                  <span className="cart-item-seller text-muted text-small">por {item.usuario}</span>
                )}
                <span className="cart-item-price">{formatPrice(item.precio)}</span>
              </div>

              <div className="cart-item-controls">
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Reducir cantidad"
                  >
                    <FiMinus />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Aumentar cantidad"
                  >
                    <FiPlus />
                  </button>
                </div>

                <span className="cart-item-subtotal">
                  {formatPrice(item.precio * item.quantity)}
                </span>

                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Eliminar producto"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}

          <button className="cart-clear-btn" onClick={clearCart}>
            Vaciar carrito
          </button>
        </div>

        {/* Summary */}
        <aside className="cart-summary">
          <h2 className="summary-title">Resumen del pedido</h2>

          <div className="summary-rows">
            {cartItems.map(item => (
              <div key={item.id} className="summary-row">
                <span className="summary-row-name">
                  {item.titulo}
                  {item.quantity > 1 && <span className="summary-qty"> ×{item.quantity}</span>}
                </span>
                <span className="summary-row-price">{formatPrice(item.precio * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>
            <span className="summary-total-price">{formatPrice(cartTotal)}</span>
          </div>

          <Button size="lg" fullWidth>
            Proceder al pago
          </Button>

          <Link to="/tienda" className="summary-continue">
            <FiArrowLeft /> Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  )
}
