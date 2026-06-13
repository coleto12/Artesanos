import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api, { getMediaUrl } from '../services/api'
import { useAuth } from '../context/AuthContext'

const GOLD = '#d4a017'
const BEIGE = '#c8b99a'

export default function Catalog() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])

  const selectedCategory = searchParams.get('category') || ''
  const selectedRegion = searchParams.get('region') || ''

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (selectedRegion) params.append('region', selectedRegion)

    api.get(`/products/?${params.toString()}`)
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false))
  }, [selectedRegion])

  useEffect(() => {
    api.get('/products/categories/').then(res => setCategories(res.data))
    if (user) {
      api.get('/favorites/')
        .then(res => setFavorites(res.data.products.map(f => f.product.id)))
    }
  }, [user])

  const toggleFavorite = async (e, productId) => {
    e.preventDefault()
    if (!user) return
    await api.post('/favorites/product/', { product_id: productId })
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = selectedCategory
      ? p.category_name?.toLowerCase() === selectedCategory.toLowerCase()
      : true
    return matchSearch && matchCategory
  })

  return (
    <div style={s.container}>
      <h1 style={s.title}>Catálogo de productos</h1>
      <div style={s.titleBar} />

      {/* Banner de región activa */}
      {selectedRegion && (
        <div style={s.regionBanner}>
          <span>Mostrando productos de artesanos de <strong>{selectedRegion}</strong></span>
          <button
            onClick={() => setSearchParams({})}
            style={s.clearRegion}>
            × Quitar filtro
          </button>
        </div>
      )}

      <input
        placeholder="Buscar productos..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={s.search}
      />

      {/* Filtros por categoría */}
      <div style={s.categoryFilters}>
        <button
          style={{ ...s.filterBtn, ...(selectedCategory === '' ? s.filterBtnActive : {}) }}
          onClick={() => setSearchParams(selectedRegion ? { region: selectedRegion } : {})}>
          Todos
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            style={{ ...s.filterBtn, ...(selectedCategory === c.name ? s.filterBtnActive : {}) }}
            onClick={() => setSearchParams(selectedRegion
              ? { region: selectedRegion, category: c.name }
              : { category: c.name })}>
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={s.msg}>Cargando productos...</p>
      ) : filtered.length === 0 ? (
        <p style={s.msg}>
          {selectedRegion
            ? `No hay productos de artesanos de ${selectedRegion} aún.`
            : 'No hay productos en esta categoría.'}
        </p>
      ) : (
        <div style={s.grid}>
          {filtered.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} style={s.card}>
              <div style={s.imgBox}>
                {product.image
                  ? <img src={getMediaUrl(product.image)} alt={product.name} style={s.img} />
                  : <div style={s.noImg}>🏺</div>}
                <button
                  style={{ ...s.heartBtn, color: favorites.includes(product.id) ? '#e74c3c' : '#ccc' }}
                  onClick={e => toggleFavorite(e, product.id)}
                  title={user ? 'Agregar a favoritos' : 'Inicia sesión para guardar'}>
                  {favorites.includes(product.id) ? '♥' : '♡'}
                </button>
              </div>
              <div style={s.info}>
                <p style={s.category}>{product.category_name || ''}</p>
                <h3 style={s.name}>{product.name}</h3>
                <p style={s.artisan}>Por {product.artisan_name}</p>
                <p style={s.price}>${Number(product.price).toLocaleString('es-CO')}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

const s = {
  container: { padding: '56px', fontFamily: "'Segoe UI', sans-serif" },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2.2rem',
    fontWeight: 700, margin: '0 0 10px', color: '#222' },
  titleBar: { width: '48px', height: '3px', background: GOLD, marginBottom: '32px' },
  regionBanner: {
    background: '#F6F1E7', padding: '12px 20px', borderRadius: '8px',
    marginBottom: '20px', fontSize: '0.9rem', color: '#555',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    border: '1px solid #e8e0d0',
  },
  clearRegion: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#aaa', fontSize: '1.1rem', lineHeight: 1,
  },
  search: { width: '100%', padding: '12px 16px', fontSize: '1rem',
    border: '1px solid #ddd', borderRadius: '8px', marginBottom: '16px',
    boxSizing: 'border-box', fontFamily: 'inherit' },
  categoryFilters: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '36px' },
  filterBtn: { padding: '8px 18px', border: '1px solid #ddd', borderRadius: '20px',
    background: '#fff', cursor: 'pointer', fontSize: '0.85rem', color: '#555',
    fontFamily: 'inherit' },
  filterBtnActive: { background: BEIGE, color: '#fff', border: '1px solid transparent', fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' },
  card: { textDecoration: 'none', color: '#222', border: '1px solid #eee',
    borderRadius: '12px', overflow: 'hidden', background: '#fff' },
  imgBox: { height: '200px', background: '#F6F1E7', display: 'flex',
    alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { fontSize: '3rem' },
  heartBtn: { position: 'absolute', top: '10px', right: '10px', background: '#fff',
    borderRadius: '50%', width: '32px', height: '32px', border: 'none',
    cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center' },
  info: { padding: '16px' },
  category: { fontSize: '0.75rem', color: '#aaa', textTransform: 'uppercase',
    letterSpacing: '0.08em', margin: '0 0 4px' },
  name: { fontFamily: "'Playfair Display', serif", fontSize: '1rem',
    fontWeight: 700, margin: '0 0 4px', color: '#222' },
  artisan: { fontSize: '0.82rem', color: '#888', margin: '0 0 8px' },
  price: { fontSize: '1.1rem', fontWeight: 700, color: '#222', margin: 0 },
  msg: { textAlign: 'center', color: '#888', fontSize: '1rem', marginTop: '60px' },
}