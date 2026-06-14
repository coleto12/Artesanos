import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { getMediaUrl } from '../services/api'
import { useAuth } from '../context/AuthContext'

const GOLD = '#d4a017'
const BEIGE = '#c8b99a'

export default function Cart() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useState(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchCart()
  }, [user])

  const fetchCart = () => {
    api.get('/orders/cart/')
      .then(res => setCart(res.data))
      .finally(() => setLoading(false))
  }

  const updateQuantity = async (itemId, productId, quantity) => {
    if (quantity < 1) return removeItem(itemId)
    await api.post('/orders/cart/', { product_id: productId, quantity: quantity - 999 })
    fetchCart()
  }

  const removeItem = async (itemId) => {
    await api.delete('/orders/cart/', { data: { item_id: itemId } })
    fetchCart()
  }

  const total = cart?.items?.reduce((sum, item) => sum + (item.quantity * Number(item.product.price)), 0) || 0

  if (loading) return <p style={s.msg}>Cargando carrito...</p>

  return (
    <div style={{ ...s.page, padding: isMobile ? '24px 16px' : '56px', colorScheme: 'light' }}>
      <h1 style={s.title}>Mi carrito</h1>
      <div style={s.titleBar} />

      {!cart?.items?.length ? (
        <div style={s.empty}>
          <p style={s.emptyTitle}>Tu carrito está vacío</p>
          <p style={s.emptySub}>Explora nuestro catálogo y agrega productos artesanales.</p>
          <Link to="/catalog" style={s.btnPrimary}>Explorar productos</Link>
        </div>
      ) : (
        <div style={{ ...s.layout, gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: isMobile ? '24px' : '48px' }}>

          {/* ITEMS */}
          <div style={s.itemsList}>
            {cart.items.map(item => (
              <div key={item.id} style={{
                ...s.item,
                gridTemplateColumns: isMobile ? '80px 1fr' : '100px 1fr auto',
                gap: isMobile ? '12px' : '20px',
                padding: isMobile ? '14px' : '20px',
              }}>
                <div style={{ ...s.itemImg, width: isMobile ? '80px' : '100px', height: isMobile ? '80px' : '100px' }}>
                  {item.product.image
                    ? <img src={getMediaUrl(item.product.image)} alt={item.product.name} style={s.img} />
                    : <div style={s.noImg}>🏺</div>}
                </div>
                <div style={s.itemInfo}>
                  <Link to={`/product/${item.product.id}`} style={{ ...s.itemName, fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    {item.product.name}
                  </Link>
                  {!isMobile && <p style={s.itemArtisan}>Por {item.product.artisan_name}</p>}
                  <p style={s.itemPrice}>${Number(item.product.price).toLocaleString('es-CO')} COP</p>

                  {/* En móvil, controles inline */}
                  {isMobile && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      <div style={s.quantityControls}>
                        <button style={s.qBtn} onClick={() => removeItem(item.id)}>−</button>
                        <span style={s.qNum}>{item.quantity}</span>
                        <button style={s.qBtn} onClick={() => updateQuantity(item.id, item.product.id, item.quantity + 1)}>+</button>
                      </div>
                      <p style={{ ...s.itemSubtotal, margin: 0 }}>
                        ${(item.quantity * Number(item.product.price)).toLocaleString('es-CO')}
                      </p>
                      <button style={s.removeBtn} onClick={() => removeItem(item.id)}>Eliminar</button>
                    </div>
                  )}
                </div>

                {/* En desktop, acciones a la derecha */}
                {!isMobile && (
                  <div style={s.itemActions}>
                    <div style={s.quantityControls}>
                      <button style={s.qBtn} onClick={() => removeItem(item.id)}>−</button>
                      <span style={s.qNum}>{item.quantity}</span>
                      <button style={s.qBtn} onClick={() => updateQuantity(item.id, item.product.id, item.quantity + 1)}>+</button>
                    </div>
                    <p style={s.itemSubtotal}>${(item.quantity * Number(item.product.price)).toLocaleString('es-CO')}</p>
                    <button style={s.removeBtn} onClick={() => removeItem(item.id)}>Eliminar</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* RESUMEN */}
          <div style={{ ...s.summary, position: isMobile ? 'static' : 'sticky' }}>
            <h2 style={s.summaryTitle}>Resumen del pedido</h2>
            <div style={s.summaryBar} />
            <div style={s.summaryRows}>
              {cart.items.map(item => (
                <div key={item.id} style={s.summaryRow}>
                  <span style={s.summaryRowName}>{item.product.name} × {item.quantity}</span>
                  <span style={s.summaryRowPrice}>
                    ${(item.quantity * Number(item.product.price)).toLocaleString('es-CO')}
                  </span>
                </div>
              ))}
            </div>
            <div style={s.summaryTotal}>
              <span>Total</span>
              <span style={s.totalNum}>${total.toLocaleString('es-CO')}</span>
            </div>
            <p style={s.totalCurrency}>COP · Impuestos incluidos</p>
            <button style={s.btnCheckout} onClick={() => navigate('/checkout')}>
              Proceder al pago
            </button>
            <Link to="/catalog" style={s.continueLink}>← Seguir comprando</Link>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  page: { fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', background: '#fff', color: '#222' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, margin: '0 0 10px', color: '#1a1a1a' },
  titleBar: { width: '48px', height: '3px', background: GOLD, marginBottom: '40px' },
  layout: { display: 'grid', alignItems: 'start' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  item: { display: 'grid', border: '1px solid #eee', borderRadius: '12px', background: '#fff' },
  itemImg: { borderRadius: '8px', overflow: 'hidden', background: '#F6F1E7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { fontSize: '2rem' },
  itemInfo: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  itemCategory: { fontSize: '0.72rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' },
  itemName: { fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1a1a1a', textDecoration: 'none', margin: '0 0 4px', display: 'block' },
  itemArtisan: { fontSize: '0.82rem', color: '#888', margin: '0 0 8px' },
  itemPrice: { fontSize: '0.95rem', fontWeight: 600, color: '#222', margin: 0 },
  itemActions: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' },
  quantityControls: { display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #ddd', borderRadius: '8px', padding: '4px 8px' },
  qBtn: { background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#555', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qNum: { fontSize: '0.95rem', fontWeight: 600, minWidth: '18px', textAlign: 'center' },
  itemSubtotal: { fontSize: '1rem', fontWeight: 700, color: '#222' },
  removeBtn: { background: 'none', border: 'none', color: '#c0392b', fontSize: '0.82rem', cursor: 'pointer', padding: 0 },
  summary: { background: '#F6F1E7', borderRadius: '12px', padding: '32px', border: '1px solid #e8e0d0', top: '80px' },
  summaryTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, margin: '0 0 10px', color: '#1a1a1a' },
  summaryBar: { width: '32px', height: '3px', background: GOLD, marginBottom: '24px' },
  summaryRows: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  summaryRowName: { fontSize: '0.85rem', color: '#666', flex: 1, marginRight: '8px' },
  summaryRowPrice: { fontSize: '0.85rem', fontWeight: 600, color: '#222', flexShrink: 0 },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e8e0d0', paddingTop: '16px', marginBottom: '4px', fontSize: '0.95rem', fontWeight: 600, color: '#222' },
  totalNum: { fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700 },
  totalCurrency: { fontSize: '0.75rem', color: '#aaa', margin: '0 0 24px', textAlign: 'right' },
  btnCheckout: { width: '100%', padding: '14px', background: BEIGE, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600, marginBottom: '12px' },
  continueLink: { display: 'block', textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: '#888', textDecoration: 'none' },
  empty: { textAlign: 'center', marginTop: '80px' },
  emptyTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' },
  emptySub: { color: '#aaa', fontSize: '0.9rem', margin: '0 0 32px' },
  btnPrimary: { display: 'inline-block', padding: '12px 28px', background: BEIGE, color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 },
  msg: { textAlign: 'center', color: '#aaa', marginTop: '100px' },
}