import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api, { getMediaUrl } from '../services/api'

const GOLD = '#d4a017'
const BEIGE = '#c8b99a'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [artisans, setArtisans] = useState([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('products')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const query = searchParams.get('q') || ''
  const [input, setInput] = useState(query)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    Promise.all([
      api.get(`/products/?search=${query}`),
      api.get('/artisans/')
    ]).then(([prodRes, artRes]) => {
      setProducts(prodRes.data)
      setArtisans(artRes.data.filter(a =>
        a.username.toLowerCase().includes(query.toLowerCase()) ||
        a.specialty?.toLowerCase().includes(query.toLowerCase()) ||
        a.region?.toLowerCase().includes(query.toLowerCase()) ||
        a.bio?.toLowerCase().includes(query.toLowerCase())
      ))
    }).finally(() => setLoading(false))
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    if (input.trim()) setSearchParams({ q: input.trim() })
  }

  return (
    <div style={{ ...s.page, padding: isMobile ? '24px 16px' : '56px', colorScheme: 'light' }}>
      <h1 style={s.title}>Buscar</h1>
      <div style={s.titleBar} />

      <form onSubmit={handleSearch} style={{ ...s.searchForm, flexDirection: isMobile ? 'column' : 'row' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Buscar productos, artesanos..."
          style={s.searchInput}
          autoFocus
        />
        <button type="submit" style={{ ...s.searchBtn, width: isMobile ? '100%' : 'auto' }}>
          Buscar
        </button>
      </form>

      {query && (
        <p style={s.resultsText}>
          Resultados para <strong>"{query}"</strong> — {products.length} productos, {artisans.length} artesanos
        </p>
      )}

      {query && (
        <div style={s.tabs}>
          <button style={{ ...s.tab, ...(tab === 'products' ? s.tabActive : {}) }}
            onClick={() => setTab('products')}>
            Productos ({products.length})
          </button>
          <button style={{ ...s.tab, ...(tab === 'artisans' ? s.tabActive : {}) }}
            onClick={() => setTab('artisans')}>
            Artesanos ({artisans.length})
          </button>
        </div>
      )}

      {loading ? (
        <p style={s.msg}>Buscando...</p>
      ) : !query ? (
        <p style={s.msg}>Escribe algo para buscar.</p>
      ) : tab === 'products' ? (
        products.length === 0 ? (
          <p style={s.msg}>No se encontraron productos.</p>
        ) : (
          <div style={{
            ...s.grid,
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: isMobile ? '12px' : '24px',
          }}>
            {products.map(p => (
              <Link to={`/product/${p.id}`} key={p.id} style={s.productCard}>
                <div style={{ ...s.imgBox, height: isMobile ? '140px' : '180px' }}>
                  {p.image
                    ? <img src={getMediaUrl(p.image)} alt={p.name} style={s.img} />
                    : <div style={s.noImg}>🏺</div>}
                </div>
                <div style={{ ...s.info, padding: isMobile ? '10px 12px' : '14px 16px' }}>
                  <p style={s.category}>{p.category_name || ''}</p>
                  <h3 style={{ ...s.name, fontSize: isMobile ? '0.88rem' : '1rem' }}>{p.name}</h3>
                  {!isMobile && <p style={s.artisan}>Por {p.artisan_name}</p>}
                  <p style={s.price}>${Number(p.price).toLocaleString('es-CO')}</p>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        artisans.length === 0 ? (
          <p style={s.msg}>No se encontraron artesanos.</p>
        ) : (
          <div style={{
            ...s.artisanGrid,
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: isMobile ? '12px' : '24px',
          }}>
            {artisans.map(a => (
              <Link to={`/artisans/${a.id}`} key={a.id} style={s.artisanCard}>
                <div style={{ ...s.artisanImgBox, height: isMobile ? '140px' : '180px' }}>
                  {a.avatar
                    ? <img src={getMediaUrl(a.avatar)} alt={a.username} style={s.img} />
                    : <div style={s.artisanPlaceholder}>{a.username?.[0]?.toUpperCase()}</div>
                  }
                </div>
                <div style={{ ...s.info, padding: isMobile ? '10px 12px' : '14px 16px' }}>
                  <h3 style={{ ...s.name, fontSize: isMobile ? '0.88rem' : '1rem' }}>{a.username}</h3>
                  {a.specialty && <p style={s.specialty}>{a.specialty}</p>}
                  {a.region && <p style={s.region}>📍 {a.region}</p>}
                  {!isMobile && a.bio && <p style={s.bio}>{a.bio}</p>}
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  )
}

const s = {
  page: { fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', background: '#fff', color: '#222' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, margin: '0 0 10px', color: '#1a1a1a' },
  titleBar: { width: '48px', height: '3px', background: GOLD, marginBottom: '32px' },
  searchForm: { display: 'flex', gap: '12px', marginBottom: '24px' },
  searchInput: { flex: 1, padding: '14px 18px', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'inherit', outline: 'none', background: '#fff', color: '#222' },
  searchBtn: { padding: '14px 28px', background: BEIGE, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 },
  resultsText: { color: '#888', fontSize: '0.9rem', marginBottom: '24px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '32px' },
  tab: { padding: '10px 24px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '0.9rem', color: '#555', fontFamily: 'inherit' },
  tabActive: { background: BEIGE, color: '#fff', border: '1px solid transparent', fontWeight: 600 },
  grid: { display: 'grid' },
  productCard: { textDecoration: 'none', color: '#222', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', background: '#fff' },
  imgBox: { background: '#F6F1E7', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { fontSize: '3rem' },
  info: { },
  category: { fontSize: '0.72rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' },
  name: { fontFamily: "'Playfair Display', serif", fontWeight: 700, margin: '0 0 4px', color: '#1a1a1a' },
  artisan: { fontSize: '0.82rem', color: '#888', margin: '0 0 8px' },
  price: { fontSize: '1rem', fontWeight: 700, color: '#222', margin: 0 },
  artisanGrid: { display: 'grid' },
  artisanCard: { textDecoration: 'none', color: '#222', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', background: '#fff' },
  artisanImgBox: { background: '#F6F1E7', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  artisanPlaceholder: { fontSize: '4rem', fontWeight: 700, color: BEIGE, fontFamily: "'Playfair Display', serif" },
  specialty: { fontSize: '0.82rem', color: BEIGE, fontWeight: 600, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  region: { fontSize: '0.82rem', color: '#888', margin: '0 0 8px' },
  bio: { fontSize: '0.82rem', color: '#555', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  msg: { textAlign: 'center', color: '#aaa', marginTop: '80px', fontSize: '1rem' },
}