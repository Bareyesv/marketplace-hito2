import { useState } from 'react'
import { FiImage, FiTag, FiDollarSign, FiFileText, FiType } from 'react-icons/fi'
import { useApp } from '../context/AppContext'
import { useCreatePost } from '../hooks/useMarketplace'
import { MOCK_CATEGORIES } from '../services/api'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import ImageUploader from '../components/common/ImageUploader'
import './CreatePost.css'

export default function CreatePost() {
  const { state } = useApp()
  const { createPost, loading } = useCreatePost()
  const categories = state.categories.length ? state.categories : MOCK_CATEGORIES

  const [form, setForm] = useState({
    titulo: '', descripcion: '', precio: '', imagen_url: '', category_id: ''
  })
  const [errors, setErrors] = useState({})
  const [preview, setPreview] = useState(false)

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
    if (validate()) {
      createPost({
        ...form,
        precio: Number(form.precio),
        category_id: Number(form.category_id),
      })
    }
  }

  return (
    <div className="create-post page-enter">
      <div className="create-header">
        <h1 className="profile-page-title">Crear Publicación</h1>
        <button
          className={`preview-toggle ${preview ? 'active' : ''}`}
          onClick={() => setPreview(v => !v)}
          type="button"
        >
          {preview ? 'Editar' : 'Vista previa'}
        </button>
      </div>

      <div className={`create-layout ${preview ? 'with-preview' : ''}`}>
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
              placeholder="Describe tu producto: estado, características, por qué lo vendes..."
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
              Publicar Producto
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => setForm({ titulo: '', descripcion: '', precio: '', imagen_url: '', category_id: '' })}>
              Limpiar
            </Button>
          </div>
        </form>

        {/* Preview card */}
        {preview && (
          <div className="post-preview">
            <h3 className="preview-title">Vista Previa</h3>
            <div className="preview-card">
              {form.imagen_url ? (
                <img src={form.imagen_url} alt="preview" className="preview-img"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400' }} />
              ) : (
                <div className="preview-img-placeholder"><FiImage /></div>
              )}
              <div className="preview-body">
                <p className="preview-cat text-small text-muted">
                  {categories.find(c => c.id === Number(form.category_id))?.nombre || 'Sin categoría'}
                </p>
                <h4 className="preview-name">{form.titulo || 'Título del producto'}</h4>
                <p className="preview-desc text-muted text-small">{form.descripcion || 'Descripción del producto'}</p>
                <p className="preview-price">
                  {form.precio ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(form.precio)) : '$0'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
