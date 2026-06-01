import { useState, useRef, useCallback } from 'react'
import { FiUploadCloud, FiImage, FiX, FiLink, FiRefreshCw } from 'react-icons/fi'
import './ImageUploader.css'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_MB = 5

export default function ImageUploader({ label = 'Imagen del producto', value, onChange, error }) {
  const [dragging, setDragging] = useState(false)
  const [urlMode, setUrlMode] = useState(!!(value && value.startsWith('http')))
  const [urlInput, setUrlInput] = useState(value?.startsWith('http') ? value : '')
  const [fileError, setFileError] = useState('')
  const inputRef = useRef(null)

  const processFile = useCallback((file) => {
    setFileError('')
    if (!ACCEPTED.includes(file.type)) {
      setFileError('Formato no soportado. Usa JPG, PNG, WEBP o GIF.')
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setFileError(`La imagen no puede superar ${MAX_MB}MB.`)
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => onChange(e.target.result)
    reader.readAsDataURL(file)
  }, [onChange])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)

  const handleFileInput = (e) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  const handleUrlApply = () => {
    if (urlInput.trim()) onChange(urlInput.trim())
  }

  const handleRemove = () => {
    onChange('')
    setUrlInput('')
    setFileError('')
  }

  const displayError = error || fileError

  return (
    <div className="img-uploader-group">
      {label && <label className="input-label">{label}</label>}

      {value ? (
        /* ── Preview state ── */
        <div className="img-uploader-preview">
          <img
            src={value}
            alt="Preview"
            className="img-uploader-img"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80' }}
          />
          <div className="img-uploader-overlay">
            <button
              type="button"
              className="img-uploader-action"
              onClick={() => { handleRemove(); setUrlMode(false); setTimeout(() => inputRef.current?.click(), 50) }}
            >
              <FiRefreshCw /> Cambiar
            </button>
            <button
              type="button"
              className="img-uploader-action danger"
              onClick={handleRemove}
            >
              <FiX /> Quitar
            </button>
          </div>
        </div>
      ) : urlMode ? (
        /* ── URL input mode ── */
        <div className={`img-url-zone ${displayError ? 'has-error' : ''}`}>
          <FiLink className="img-url-icon" />
          <input
            type="url"
            className="img-url-input"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleUrlApply())}
            autoFocus
          />
          <button type="button" className="img-url-apply" onClick={handleUrlApply} disabled={!urlInput.trim()}>
            Aplicar
          </button>
          <button type="button" className="img-url-switch" onClick={() => { setUrlMode(false); setFileError('') }}>
            <FiUploadCloud />
          </button>
        </div>
      ) : (
        /* ── Drop zone ── */
        <div
          className={`img-drop-zone ${dragging ? 'dragging' : ''} ${displayError ? 'has-error' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
          aria-label="Subir imagen"
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            className="img-file-input"
            onChange={handleFileInput}
          />
          <div className="img-drop-content">
            <div className={`img-drop-icon ${dragging ? 'bounce' : ''}`}>
              {dragging ? <FiImage /> : <FiUploadCloud />}
            </div>
            <p className="img-drop-title">
              {dragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic'}
            </p>
            <p className="img-drop-hint">JPG, PNG, WEBP · Máx. {MAX_MB}MB</p>
          </div>
          <button
            type="button"
            className="img-url-toggle"
            onClick={e => { e.stopPropagation(); setUrlMode(true) }}
          >
            <FiLink /> Usar URL
          </button>
        </div>
      )}

      {displayError && <span className="input-error">{displayError}</span>}
    </div>
  )
}
