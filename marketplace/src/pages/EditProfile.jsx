import { useState } from 'react'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiSave } from 'react-icons/fi'
import { useEditProfile } from '../hooks/useMarketplace'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import './EditProfile.css'

export default function EditProfile() {
  const { user, updateProfile, loading } = useEditProfile()

  const [form, setForm] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    setSaved(false)
  }

  const validate = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio'
    if (!form.email.trim()) e.email = 'El correo es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Ingresa un correo válido'
    if (form.password) {
      if (form.password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres'
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    await updateProfile({ nombre: form.nombre.trim(), email: form.email.trim() })
    setForm(prev => ({ ...prev, password: '', confirmPassword: '' }))
    setSaved(true)
  }

  const avatarLetter = form.nombre?.[0]?.toUpperCase() || '?'
  const hasChanges =
    form.nombre.trim() !== (user?.nombre || '') ||
    form.email.trim() !== (user?.email || '') ||
    form.password !== ''

  return (
    <div className="edit-profile page-enter">
      <h1 className="profile-page-title">Editar Perfil</h1>

      <form onSubmit={handleSubmit} className="edit-profile-form">

        {/* Avatar preview */}
        <div className="avatar-preview-wrap">
          <div className="avatar-preview">{avatarLetter}</div>
          <div>
            <p className="avatar-preview-name">{form.nombre || 'Tu nombre'}</p>
            <p className="text-small text-muted">{form.email || 'tu@correo.com'}</p>
          </div>
        </div>

        {/* Personal info */}
        <section className="edit-section">
          <h2 className="edit-section-title">Información personal</h2>

          <div className="edit-fields">
            <Input
              label="Nombre completo"
              type="text"
              placeholder="Ej: María González"
              icon={<FiUser />}
              value={form.nombre}
              onChange={handleChange('nombre')}
              error={errors.nombre}
            />
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@correo.com"
              icon={<FiMail />}
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
            />
          </div>
        </section>

        {/* Password change */}
        <section className="edit-section">
          <h2 className="edit-section-title">Cambiar contraseña <span className="optional-label">opcional</span></h2>

          <div className="edit-fields">
            <div className="input-group">
              <label className="input-label">Nueva contraseña</label>
              <div className={`input-wrap has-icon ${errors.password ? 'has-error' : ''}`}>
                <span className="input-icon"><FiLock /></span>
                <input
                  className="input-field"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={handleChange('password')}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <span className="input-error">{errors.password}</span>}
            </div>

            <div className="input-group">
              <label className="input-label">Confirmar contraseña</label>
              <div className={`input-wrap has-icon ${errors.confirmPassword ? 'has-error' : ''}`}>
                <span className="input-icon"><FiLock /></span>
                <input
                  className="input-field"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repite la contraseña"
                  value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  disabled={!form.password}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirm(v => !v)}
                  tabIndex={-1}
                  aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  disabled={!form.password}
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && <span className="input-error">{errors.confirmPassword}</span>}
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="edit-actions">
          <Button
            type="submit"
            size="lg"
            loading={loading}
            icon={<FiSave />}
            disabled={!hasChanges}
          >
            {saved && !hasChanges ? 'Cambios guardados' : 'Guardar cambios'}
          </Button>
          <button
            type="button"
            className="edit-reset-btn"
            onClick={() => {
              setForm({ nombre: user?.nombre || '', email: user?.email || '', password: '', confirmPassword: '' })
              setErrors({})
              setSaved(false)
            }}
            disabled={!hasChanges}
          >
            Descartar cambios
          </button>
        </div>
      </form>
    </div>
  )
}
