import { Link } from 'react-router-dom'
import { FiShoppingBag, FiInstagram, FiTwitter, FiFacebook, FiMail } from 'react-icons/fi'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon-sm"><FiShoppingBag /></span>
            <span className="footer-logo-text">Market<em>Place</em></span>
          </div>
          <p className="footer-tagline">Compra y vende lo que amas.<br />Conectando personas, creando valor.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
            <a href="#" aria-label="Email"><FiMail /></a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Explorar</h4>
            <Link to="/tienda">Tienda</Link>
            <Link to="/tienda?cat=1">Fotografía</Link>
            <Link to="/tienda?cat=3">Tecnología</Link>
            <Link to="/tienda?cat=6">Música</Link>
          </div>
          <div className="footer-col">
            <h4>Mi Cuenta</h4>
            <Link to="/perfil">Mi Perfil</Link>
            <Link to="/perfil/crear">Publicar</Link>
            <Link to="/perfil/favoritos">Favoritos</Link>
            <Link to="/perfil/publicaciones">Mis Ventas</Link>
          </div>
          <div className="footer-col">
            <h4>Ayuda</h4>
            <a href="#">Centro de ayuda</a>
            <a href="#">Cómo vender</a>
            <a href="#">Cómo comprar</a>
            <a href="#">Contacto</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>© {new Date().getFullYear()} MarketPlace. Todos los derechos reservados.</p>
        <div className="footer-legal">
          <a href="#">Privacidad</a>
          <a href="#">Términos</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  )
}
