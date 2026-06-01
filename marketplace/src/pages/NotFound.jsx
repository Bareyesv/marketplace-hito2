import { Link } from 'react-router-dom'
import { FiHome, FiShoppingBag } from 'react-icons/fi'
import Button from '../components/common/Button'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="notfound page-enter">
      <div className="notfound-content">
        <div className="notfound-num">404</div>
        <h1 className="notfound-title">Página no encontrada</h1>
        <p className="notfound-desc">
          La página que buscas no existe o fue movida.<br />
          Vuelve al inicio o explora nuestra tienda.
        </p>
        <div className="notfound-actions">
          <Link to="/"><Button icon={<FiHome />}>Ir al Inicio</Button></Link>
          <Link to="/tienda"><Button variant="outline" icon={<FiShoppingBag />}>Ver Tienda</Button></Link>
        </div>
      </div>
    </div>
  )
}
