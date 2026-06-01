import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../hooks/useMarketplace'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import './AuthPages.css'

export default function Login() {
  const { login, loading, error } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'El correo es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Correo inválido'
    if (!form.password) e.password = 'La contraseña es obligatoria'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) login(form)
  }

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  return (
    <div className="auth-page page-enter">
      <div className="auth-bg">
        <div className="auth-blob" />
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">Market<em>Place</em></div>
          <h1 className="auth-title">Iniciar Sesión</h1>
          <p className="auth-subtitle">Bienvenido de vuelta. Ingresa tus credenciales.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
            placeholder="••••••••"
            icon={<FiLock />}
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={loading}
            icon={<FiArrowRight />}
          >
            Iniciar Sesión
          </Button>
        </form>

        <div className="auth-footer">
          <p>¿No tienes cuenta? <Link to="/registro" className="auth-link">Regístrate aquí</Link></p>
          <Link to="/" className="btn btn--ghost btn--sm">← Volver al inicio</Link>
        </div>

        <div className="auth-demo">
          <p className="text-small text-muted">Demo: usa cualquier email y contraseña válidos</p>
        </div>
      </div>
    </div>
  )
}
