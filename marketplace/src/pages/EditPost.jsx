import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiTag, FiDollarSign, FiFileText, FiType, FiArrowLeft } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { useEditPost } from '../hooks/useMarketplace'
import { MOCK_CATEGORIES } from '../services/api'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import ImageUploader from '../components/common/ImageUploader'
import './CreatePost.css'

export default function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useApp()
  const { post, updatePost, loading } = useEditPost(id)
  const categories = state.categories.length ? state.categories : MOCK_CATEGORIES

  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (post) {
      setForm({
        titulo: post.titulo || '',
        descripcion: post.descripcion || '',
        precio: String(post.precio || ''),
        imagen_url: post.imagen_url || '',
        category_id: String(post.category_id || ''),
      })
    }
  }, [post])

  if (!post) {
    return (
      <div className="create-post page-enter">
        <div className="create-header">
          <h1 className="profile-page-title">Publicación no encontrada</h1>
        </div>
        <Button variant="outline" icon={<FiArrowLeft />} onClick={() => navigate('/perfil/publicaciones')}>
          Volver a mis publicaciones
        </Button>
      </div>
    )
  }

  if (!form) return null

  const validate = () => {
    const e = {}
    if (!form.titulo.trim()) e.titulo = 'El título es obligatorio'
    if (!form.descripcion.trim()) e.descripcion = 'La descripción es obligatoria'
    if (!form.precio || isNaN(form.precio) || Number(form.precio) <= 0) e.precio = 'Ingresa un precio válido'
    if (!form.category_id) e.category_id = 'Selecciona una categoría'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) updatePost(form)
  }

  return (
    <div className="create-post page-enter">
      <div className="create-header">
        <div>
          <button
            className="back-link text-muted text-small"
            onClick={() => navigate('/perfil/publicaciones')}
            type="button"
          >
            <FiArrowLeft /> Mis publicaciones
          </button>
          <h1 className="profile-page-title">Editar Publicación</h1>
        </div>
      </div>

      <div className="create-layout">
        <form onSubmit={handleSubmit} className="create-form">
          <Input
            label="Título del producto"
            type="text"
            placeholder="Ej: Cámara Canon EOS R5"
            icon={<FiType />}
            value={form.titulo}
            onChange={handleChange('titulo')}
            error={errors.titulo}
          />

          <div className="input-group">
            <label className="input-label">Descripción</label>
            <textarea
              className={`textarea-field ${errors.descripcion ? 'has-error' : ''}`}
              placeholder="Describe tu producto..."
              value={form.descripcion}
              onChange={handleChange('descripcion')}
              rows={5}
            />
            {errors.descripcion && <span className="input-error">{errors.descripcion}</span>}
          </div>

          <div className="form-row">
            <Input
              label="Precio (CLP)"
              type="number"
              placeholder="Ej: 150000"
              icon={<FiDollarSign />}
              value={form.precio}
              onChange={handleChange('precio')}
              error={errors.precio}
              min="1"
            />

            <div className="input-group">
              <label className="input-label">Categoría</label>
              <div className={`input-wrap ${errors.category_id ? 'has-error' : ''}`}>
                <span className="input-icon"><FiTag /></span>
                <select
                  className="input-field has-icon-select"
                  value={form.category_id}
                  onChange={handleChange('category_id')}
                  style={{ paddingLeft: '42px' }}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              {errors.category_id && <span className="input-error">{errors.category_id}</span>}
            </div>
          </div>

          <ImageUploader
            label="Imagen del producto (opcional)"
            value={form.imagen_url}
            onChange={(url) => setForm(prev => ({ ...prev, imagen_url: url }))}
          />

          <div className="create-actions">
            <Button type="submit" size="lg" loading={loading} icon={<FiFileText />}>
              Guardar cambios
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate('/perfil/publicaciones')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
