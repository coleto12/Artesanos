import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api, { getMediaUrl } from '../services/api'

export default function MyProducts() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '' })
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user?.role !== 'artesano') { navigate('/'); return }
    fetchProducts()
    fetchCategories()
  }, [user])

  const fetchProducts = () => {
    api.get('/products/my-products/')
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false))
  }

  const fetchCategories = () => {
    api.get('/products/categories/')
      .then(res => setCategories(res.data))
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v) data.append(k, v) })
      if (image) data.append('image', image)
      if (editing) {
        await api.patch(`/products/${editing.id}/edit/`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.post('/products/create/', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      setShowForm(false)
      setEditing(null)
      setForm({ name: '', description: '', price: '', stock: '', category: '' })
      setImage(null)
      fetchProducts()
    } catch {
      setError('Error al guardar el producto.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product) => {
    setEditing(product)
    setForm({ name: product.name, description: product.description,
      price: product.price, stock: product.stock, category: product.category })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    await api.delete(`/products/${id}/edit/`)
    fetchProducts()
  }

  return (
    <div style={s.page}>

      {/* ── ENCABEZADO ── */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>Mis productos</h1>
          <div style={s.titleBar} />
          <p style={s.pageSub}>Gestiona tu catálogo de artesanías</p>
        </div>
        <button style={s.btnAdd} onClick={() => {
          setShowForm(!showForm); setEditing(null)
          setForm({ name: '', description: '', price: '', stock: '', category: '' })
        }}>
          {showForm ? 'Cancelar' : '+ Nuevo producto'}
        </button>
      </div>

      {/* ── FORMULARIO ── */}
      {showForm && (
        <div style={s.formCard}>
          <h2 style={s.formTitle}>{editing ? 'Editar producto' : 'Publicar nuevo producto'}</h2>
          {error && <p style={s.error}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>Nombre del producto</label>
                <input name="name" value={form.name} onChange={handleChange} style={s.input} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Categoría</label>
                <select name="category" value={form.category} onChange={handleChange} style={s.input}>
                  <option value="">Seleccionar...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Precio (COP)</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} style={s.input} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Unidades disponibles</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} style={s.input} required />
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Descripción</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                style={{ ...s.input, height: '100px', resize: 'vertical' }} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Imagen del producto</label>
              <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} style={s.fileInput} />
            </div>
            <div style={s.formBtns}>
              <button type="submit" style={s.btnSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Publicar producto'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── PRODUCTOS ── */}
      {loading ? (
        <p style={s.msg}>Cargando tus productos...</p>
      ) : products.length === 0 ? (
        <div style={s.empty}>
          <p style={s.emptyIcon}></p>
          <p style={s.emptyText}>Aún no tienes productos publicados.</p>
          <p style={s.emptySub}>Comparte tus creaciones con el mundo.</p>
        </div>
      ) : (
        <div style={s.grid}>
          {products.map(p => (
            <div key={p.id} style={s.card}>
              <div style={s.imgBox}>
              {p.image
                ? <img src={getMediaUrl(p.image)} alt={p.name} style={s.img} />
                : <div style={s.noImg}></div>}
              </div>
              <div style={s.cardBody}>
                <p style={s.cardCategory}>{p.category_name || 'Sin categoría'}</p>
                <h3 style={s.cardName}>{p.name}</h3>
                <p style={s.cardPrice}>${Number(p.price).toLocaleString('es-CO')}</p>
                <p style={s.cardStock}>Stock: {p.stock} unidades</p>
                <div style={s.cardBtns}>
                  <button style={s.btnEdit} onClick={() => handleEdit(p)}>Editar</button>
                  <button style={s.btnDelete} onClick={() => handleDelete(p.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const GOLD = '#d4a017'
const BEIGE = '#c8b99a'

const s = {
  page: { fontFamily: "'Segoe UI', sans-serif", background: '#fff',
    minHeight: '100vh', padding: '56px', boxSizing: 'border-box' },
  pageHeader: { display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '48px' },
  pageTitle: { fontFamily: "'Playfair Display', serif", fontSize: '2.2rem',
    fontWeight: 700, margin: '0 0 10px', color: '#222' },
  titleBar: { width: '48px', height: '3px', background: GOLD, marginBottom: '12px' },
  pageSub: { color: '#888', fontSize: '0.95rem', margin: 0 },
  btnAdd: { background: BEIGE, color: '#fff', border: 'none', padding: '12px 28px',
    borderRadius: '4px', fontSize: '0.95rem', cursor: 'pointer', fontWeight: 600 },

  formCard: { background: '#F6F1E7', borderRadius: '12px', padding: '40px',
    marginBottom: '56px', border: '1px solid #e8e0d0' },
  formTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.4rem',
    fontWeight: 700, margin: '0 0 24px', color: '#222' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  field: { marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#555', letterSpacing: '0.03em' },
  input: { padding: '11px 14px', borderRadius: '6px', border: '1px solid #ddd',
    fontSize: '0.95rem', background: '#fff', fontFamily: 'inherit' },
  fileInput: { padding: '10px 0', fontSize: '0.9rem', color: '#555' },
  formBtns: { marginTop: '8px' },
  btnSave: { background: BEIGE, color: '#fff', border: 'none', padding: '13px 36px',
    borderRadius: '4px', fontSize: '0.95rem', cursor: 'pointer', fontWeight: 600 },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '28px' },
  card: { border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden',
    background: '#fff', transition: 'box-shadow 0.2s' },
  imgBox: { height: '200px', background: '#F6F1E7', display: 'flex',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { fontSize: '3.5rem' },
  cardBody: { padding: '18px 20px' },
  cardCategory: { fontSize: '0.75rem', color: '#aaa', textTransform: 'uppercase',
    letterSpacing: '0.08em', margin: '0 0 6px' },
  cardName: { fontFamily: "'Playfair Display', serif", fontSize: '1.05rem',
    fontWeight: 700, margin: '0 0 8px', color: '#222' },
  cardPrice: { fontSize: '1.15rem', fontWeight: 700, color: '#222', margin: '0 0 4px' },
  cardStock: { fontSize: '0.82rem', color: '#aaa', margin: '0 0 16px' },
  cardBtns: { display: 'flex', gap: '8px' },
  btnEdit: { flex: 1, padding: '9px', background: '#F6F1E7', color: '#555',
    border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer',
    fontSize: '0.85rem', fontWeight: 600 },
  btnDelete: { flex: 1, padding: '9px', background: '#fff', color: '#c0392b',
    border: '1px solid #f5c6c6', borderRadius: '4px', cursor: 'pointer',
    fontSize: '0.85rem', fontWeight: 600 },

  msg: { textAlign: 'center', color: '#aaa', fontSize: '1rem', marginTop: '80px' },
  empty: { textAlign: 'center', marginTop: '80px' },
  emptyIcon: { fontSize: '4rem', margin: '0 0 16px' },
  emptyText: { fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#222', margin: '0 0 8px' },
  emptySub: { color: '#aaa', fontSize: '0.9rem', margin: 0 },
}