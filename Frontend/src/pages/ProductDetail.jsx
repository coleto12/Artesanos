import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api, { getMediaUrl } from '../services/api'
import { useAuth } from '../context/AuthContext'

const GOLD = '#d4a017'
const BEIGE = '#c8b99a'

export default function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isFav, setIsFav] = useState(false)
  const [adding, setAdding] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useState(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    api.get(`/products/${id}/`)
      .then(res => setProduct(res.data))
      .finally(() => setLoading(false))

    if (user) {
      api.get('/favorites/')
        .then(res => {
          const favIds = res.data.products.map(f => f.product.id)
          setIsFav(favIds.includes(Number(id)))
        })
    }
  }, [id, user])

  const toggleFav = async () => {
    if (!user) { navigate('/login'); return }
    await api.post('/favorites/product/', { product_id: id })
    setIsFav(prev => !prev)
  }

  const addToCart = async () => {
    if (!user) { navigate('/login'); return }
    setAdding(true)
    try {
      await api.post('/orders/cart/', { product_id: id, quantity })
      navigate('/cart')
    } catch {
      alert('Error al agregar al carrito.')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <p style={s.msg}>Cargando...</p>
  if (!product) return <p style={s.msg}>Producto no encontrado.</p>

  return (
    <div style={{ ...s.page, padding: isMobile ? '20px 16px 48px' : '32px 56px 64px', colorScheme: 'light' }}>

      {/* BREADCRUMB */}
      <div style={s.breadcrumb}>
        <Link to="/catalog" style={s.breadLink}>Productos</Link>
        <span style={s.breadSep}>/</span>
        {product.category_name && (
          <>
            <Link to={`/catalog?category=${product.category_name}`} style={s.breadLink}>
              {product.category_name}
            </Link>
            <span style={s.breadSep}>/</span>
          </>
        )}
        <span style={s.breadCurrent}>{product.name}</span>
      </div>

      {/* MAIN */}
      <div style={{
        ...s.main,
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '24px' : '64px',
      }}>
        {/* Imagen */}
        <div style={s.imgSection}>
          <div style={{ ...s.imgBox, aspectRatio: isMobile ? '4/3' : '1' }}>
            {product.image
              ? <img src={getMediaUrl(product.image)} alt={product.name} style={s.img} />
              : <div style={s.noImg}></div>
            }
          </div>
        </div>

        {/* Info */}
        <div style={s.infoSection}>
          {product.category_name && (
            <p style={s.category}>{product.category_name}</p>
          )}
          <h1 style={{ ...s.title, fontSize: isMobile ? '1.6rem' : '2rem' }}>{product.name}</h1>
          <div style={s.titleBar} />

          <Link to={`/artisans`} style={s.artisanLink}>
            Por {product.artisan_name}
          </Link>

          <div style={s.priceRow}>
            <span style={{ ...s.price, fontSize: isMobile ? '1.6rem' : '2rem' }}>
              ${Number(product.price).toLocaleString('es-CO')}
            </span>
            <span style={s.priceCurrency}>COP</span>
          </div>

          <p style={s.stock}>
            {product.stock > 0
              ? `${product.stock} unidades disponibles`
              : 'Sin stock disponible'}
          </p>

          <p style={s.description}>{product.description}</p>

          {product.stock > 0 && (
            <div style={s.quantityRow}>
              <span style={s.quantityLabel}>Cantidad</span>
              <div style={s.quantityControls}>
                <button style={s.qBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span style={s.qNum}>{quantity}</span>
                <button style={s.qBtn} onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>
          )}

          <div style={s.btnRow}>
            <button
              style={{ ...s.btnCart, opacity: product.stock === 0 ? 0.5 : 1 }}
              onClick={addToCart}
              disabled={adding || product.stock === 0}>
              {adding ? 'Agregando...' : 'Agregar al carrito'}
            </button>
            <button
              style={{ ...s.btnFav, color: isFav ? '#e74c3c' : '#555' }}
              onClick={toggleFav}>
              {isFav ? '♥' : '♡'}
            </button>
          </div>

          <div style={s.extraInfo}>
            <div style={s.extraItem}><span style={s.extraText}>✓ Envío a todo Colombia</span></div>
            <div style={s.extraItem}><span style={s.extraText}>✓ Pago seguro garantizado</span></div>
            <div style={s.extraItem}><span style={s.extraText}>✓ Producto artesanal auténtico</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', background: '#fff', color: '#222' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  breadLink: { fontSize: '0.85rem', color: '#888', textDecoration: 'none' },
  breadSep: { fontSize: '0.85rem', color: '#ccc' },
  breadCurrent: { fontSize: '0.85rem', color: '#222', fontWeight: 500 },
  main: { display: 'grid', alignItems: 'start' },
  imgSection: {},
  imgBox: { borderRadius: '12px', overflow: 'hidden', background: '#F6F1E7', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { fontSize: '6rem' },
  infoSection: {},
  category: { fontSize: '0.75rem', color: BEIGE, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' },
  title: { fontFamily: "'Playfair Display', serif", fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a', lineHeight: 1.2 },
  titleBar: { width: '40px', height: '3px', background: GOLD, marginBottom: '16px' },
  artisanLink: { fontSize: '0.9rem', color: '#888', textDecoration: 'none', display: 'block', marginBottom: '24px' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' },
  price: { fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1a1a1a' },
  priceCurrency: { fontSize: '0.85rem', color: '#aaa' },
  stock: { fontSize: '0.82rem', color: '#888', margin: '0 0 20px' },
  description: { fontSize: '0.95rem', color: '#555', lineHeight: 1.8, margin: '0 0 28px', borderTop: '1px solid #eee', paddingTop: '20px' },
  quantityRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  quantityLabel: { fontSize: '0.85rem', fontWeight: 600, color: '#555' },
  quantityControls: { display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #ddd', borderRadius: '8px', padding: '4px 8px' },
  qBtn: { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#555', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qNum: { fontSize: '1rem', fontWeight: 600, minWidth: '24px', textAlign: 'center' },
  btnRow: { display: 'flex', gap: '12px', marginBottom: '16px' },
  btnCart: { flex: 1, padding: '14px', background: BEIGE, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 },
  btnFav: { width: '50px', height: '50px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  extraInfo: { borderTop: '1px solid #eee', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  extraItem: { display: 'flex', alignItems: 'center', gap: '10px' },
  extraText: { fontSize: '0.85rem', color: '#888' },
  msg: { textAlign: 'center', color: '#aaa', marginTop: '100px', fontSize: '1rem' },
}