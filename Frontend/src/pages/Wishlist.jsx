import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api, { getMediaUrl } from '../services/api'

const GOLD = '#d4a017'
const BEIGE = '#c8b99a'

export default function Wishlist() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [artisans, setArtisans] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('products')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useState(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!user) return
    api.get('/favorites/')
      .then(res => {
        setProducts(res.data.products)
        setArtisans(res.data.artisans)
      })
      .finally(() => setLoading(false))
  }, [user])

  const removeProduct = async (productId) => {
    await api.post('/favorites/product/', { product_id: productId })
    setProducts(products.filter(f => f.product.id !== productId))
  }

  const removeArtisan = async (artisanId) => {
    await api.post('/favorites/artisan/', { artisan_id: artisanId })
    setArtisans(artisans.filter(f => f.artisan.id !== artisanId))
  }

  if (!user) return (
    <div style={s.center}>
      <p>Debes <Link to="/login">iniciar sesión</Link> para ver tus favoritos.</p>
    </div>
  )

  return (
    <div style={{ ...s.page, padding: isMobile ? '24px 16px' : '56px', colorScheme: 'light' }}>
      <h1 style={s.title}>Mis favoritos</h1>
      <div style={s.titleBar} />

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

      {loading ? (
        <p style={s.msg}>Cargando...</p>
      ) : tab === 'products' ? (
        products.length === 0 ? (
          <div style={s.empty}>
            <p style={s.emptyIcon}></p>
            <p style={s.emptyText}>No tienes productos favoritos aún.</p>
            <Link to="/catalog" style={s.btnPrimary}>Explorar productos</Link>
          </div>
        ) : (
          <div style={{
            ...s.grid,
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: isMobile ? '12px' : '24px',
          }}>
            {products.map(f => (
              <div key={f.id} style={s.card}>
                <div style={{ ...s.imgBox, height: isMobile ? '150px' : '200px' }}>
                  {f.product.image
                    ? <img src={getMediaUrl(f.product.image)} alt={f.product.name} style={s.img} />
                    : <div style={s.noImg}></div>}
                  <button style={s.heartBtn} onClick={() => removeProduct(f.product.id)}>♥</button>
                </div>
                <div style={{ ...s.cardBody, padding: isMobile ? '10px 12px' : '16px' }}>
                  <p style={s.cardCategory}>{f.product.category_name || ''}</p>
                  <Link to={`/product/${f.product.id}`} style={{ ...s.cardName, fontSize: isMobile ? '0.88rem' : '1rem' }}>
                    {f.product.name}
                  </Link>
                  {!isMobile && <p style={s.cardArtisan}>Por {f.product.artisan_name}</p>}
                  <p style={s.cardPrice}>${Number(f.product.price).toLocaleString('es-CO')}</p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        artisans.length === 0 ? (
          <div style={s.empty}>
            <p style={s.emptyIcon}></p>
            <p style={s.emptyText}>No tienes artesanos favoritos aún.</p>
            <Link to="/artisans" style={s.btnPrimary}>Explorar artesanos</Link>
          </div>
        ) : (
          <div style={{
            ...s.grid,
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: isMobile ? '12px' : '24px',
          }}>
            {artisans.map(f => (
              <div key={f.id} style={s.artisanCard}>
                <div style={{ ...s.artisanAvatar, height: isMobile ? '180px' : '240px' }}>
                  {f.artisan.avatar
                    ? <img src={getMediaUrl(f.artisan.avatar)} alt={f.artisan.username}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                    : null}
                  <div style={s.artisanOverlay} />
                  <div style={s.artisanOverlayText}>
                    <strong style={{ ...s.artisanName, fontSize: isMobile ? '0.88rem' : '1rem' }}>
                      {f.artisan.username}
                    </strong>
                    <p style={s.artisanCraft}>
                      {f.artisan.specialty}{f.artisan.region ? ` · ${f.artisan.region}` : ''}
                    </p>
                  </div>
                  <button style={s.heartBtn} onClick={() => removeArtisan(f.artisan.id)}>♥</button>
                </div>
              </div>
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
  tabs: { display: 'flex', gap: '8px', marginBottom: '36px' },
  tab: { padding: '10px 24px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '0.9rem', color: '#555', fontFamily: 'inherit' },
  tabActive: { background: BEIGE, color: '#fff', border: '1px solid transparent', fontWeight: 600 },
  grid: { display: 'grid' },
  card: { border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', background: '#fff' },
  imgBox: { background: '#F6F1E7', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { fontSize: '3rem' },
  heartBtn: { position: 'absolute', top: '8px', right: '8px', background: '#fff', borderRadius: '50%', width: '30px', height: '30px', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#e74c3c', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardBody: { },
  cardCategory: { fontSize: '0.72rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' },
  cardName: { fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1a1a1a', textDecoration: 'none', display: 'block', marginBottom: '4px' },
  cardArtisan: { fontSize: '0.82rem', color: '#888', margin: '0 0 8px' },
  cardPrice: { fontSize: '1rem', fontWeight: 700, color: '#222', margin: 0 },
  artisanCard: { borderRadius: '12px', overflow: 'hidden' },
  artisanAvatar: { background: 'linear-gradient(135deg, #c8a882 0%, #8b6b4a 100%)', position: 'relative', overflow: 'hidden', borderRadius: '12px' },
  artisanOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)' },
  artisanOverlayText: { position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '16px', boxSizing: 'border-box', zIndex: 2 },
  artisanName: { display: 'block', color: '#fff', fontWeight: 700, fontFamily: "'Playfair Display', serif", marginBottom: '4px' },
  artisanCraft: { color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', margin: 0 },
  empty: { textAlign: 'center', marginTop: '80px' },
  emptyIcon: { fontSize: '4rem', margin: '0 0 16px' },
  emptyText: { fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#1a1a1a', margin: '0 0 24px' },
  btnPrimary: { background: BEIGE, color: '#fff', padding: '12px 28px', borderRadius: '4px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', display: 'inline-block' },
  msg: { textAlign: 'center', color: '#aaa', marginTop: '60px' },
  center: { textAlign: 'center', marginTop: '100px' },
}