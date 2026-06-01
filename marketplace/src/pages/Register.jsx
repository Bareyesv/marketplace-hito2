import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../hooks/useMarketplace'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import './AuthPages.css'

export default function Register() {
  const { register, loading, error } = useAuth()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio'
    if (!form.email) e.email = 'El correo es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Correo inválido'
    if (!form.password) e.password = 'La contraseña es obligatoria'
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) register({ nombre: form.nombre, email: form.email, password: form.password })
  }

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  return (
    <div className="auth-page page-enter">
      <div className="auth-bg">
        <div className="auth-blob auth-blob--register" />
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">Market<em>Place</em></div>
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">Únete a nuestra comunidad de compradores y vendedores.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Nombre completo"
            type="text"
            placeholder="Tu nombre"
            icon={<FiUser />}
            value={form.nombre}
            onChange={handleChange('nombre')}
            error={errors.nombre}
            autoComplete="name"
          />
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="nombre@ejemplo.com"
            icon={<FiMail />}
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="Mínimo 6 caracteres"
            icon={<FiLock />}
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            autoComplete="new-password"
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="Repite tu contraseña"
            icon={<FiLock />}
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={loading}
            icon={<FiArrowRight />}
          >
            Crear Cuenta
          </Button>
        </form>

        <div className="auth-footer">
          <p>¿Ya tienes cuenta? <Link to="/login" className="auth-link">Inicia sesión aquí</Link></p>
          <Link to="/" className="btn btn--ghost btn--sm">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  )
}
