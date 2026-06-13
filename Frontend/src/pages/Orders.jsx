import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api, { getMediaUrl } from '../services/api'
import { useAuth } from '../context/AuthContext'

const GOLD = '#d4a017'
const BEIGE = '#c8b99a'

const STATUS_LABELS = {
  pendiente: { label: 'Pendiente', color: '#f39c12', bg: '#fef9e7' },
  confirmado: { label: 'Confirmado', color: '#27ae60', bg: '#eaf5ee' },
  enviado: { label: 'Enviado', color: '#2980b9', bg: '#e8f4f8' },
  entregado: { label: 'Entregado', color: '#2d6a4f', bg: '#e8f4f0' },
  cancelado: { label: 'Cancelado', color: '#c0392b', bg: '#fdecea' },
}

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!user) return
    api.get('/orders/')
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false))
  }, [user])

  if (loading) return <p style={s.msg}>Cargando pedidos...</p>

  return (
    <div style={s.page}>
      <h1 style={s.title}>Mis pedidos</h1>
      <div style={s.titleBar} />

      {orders.length === 0 ? (
        <div style={s.empty}>
          <p style={s.emptyTitle}>No tienes pedidos aún</p>
          <p style={s.emptySub}>Cuando realices una compra, aparecerá aquí.</p>
          <Link to="/catalog" style={s.btnPrimary}>Explorar productos</Link>
        </div>
      ) : (
        <div style={s.layout}>
          {/* ── LISTA ── */}
          <div style={s.ordersList}>
            {orders.map(order => {
              const status = STATUS_LABELS[order.status] || STATUS_LABELS.pendiente
              return (
                <div
                  key={order.id}
                  style={{ ...s.orderCard, border: selected?.id === order.id ? `2px solid ${GOLD}` : '1px solid #eee' }}
                  onClick={() => setSelected(order)}
                >
                  <div style={s.orderHeader}>
                    <div>
                      <p style={s.orderNum}>Pedido #{order.id}</p>
                      <p style={s.orderDate}>
                        {new Date(order.created_at).toLocaleDateString('es-CO', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span style={{ ...s.statusBadge, color: status.color, background: status.bg }}>
                      {status.label}
                    </span>
                  </div>

                  <div style={s.orderItems}>
                    {order.items?.slice(0, 3).map(item => (
                      <div key={item.id} style={s.orderItem}>
                        <div style={s.orderItemImg}>
                          {item.product?.image
                            ? <img src={getMediaUrl(item.product.image)} alt={item.product.name} style={s.img} />
                            : <div style={s.noImg}>🏺</div>}
                        </div>
                        <div style={s.orderItemInfo}>
                          <p style={s.orderItemName}>{item.product?.name}</p>
                          <p style={s.orderItemQty}>× {item.quantity}</p>
                        </div>
                        <p style={s.orderItemPrice}>
                          ${(item.quantity * Number(item.price)).toLocaleString('es-CO')}
                        </p>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <p style={s.moreItems}>+{order.items.length - 3} productos más</p>
                    )}
                  </div>

                  <div style={s.orderFooter}>
                    <span style={s.orderTotal}>
                      Total: <strong>${Number(order.total).toLocaleString('es-CO')} COP</strong>
                    </span>
                    <span style={s.orderAddress}> {order.address?.slice(0, 40)}...</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── DETALLE ── */}
          {selected && (
            <div style={s.detail}>
              <div style={s.detailHeader}>
                <h2 style={s.detailTitle}>Pedido #{selected.id}</h2>
                <button style={s.closeBtn} onClick={() => setSelected(null)}>×</button>
              </div>
              <div style={s.detailBar} />

              {/* Status timeline */}
              <div style={s.timeline}>
                {['pendiente', 'confirmado', 'enviado', 'entregado'].map((step, i) => {
                  const steps = ['pendiente', 'confirmado', 'enviado', 'entregado']
                  const currentIdx = steps.indexOf(selected.status)
                  const isDone = i <= currentIdx
                  const isCurrent = i === currentIdx
                  return (
                    <div key={step} style={s.timelineStep}>
                      <div style={{
                        ...s.timelineDot,
                        background: isDone ? GOLD : '#eee',
                        border: isCurrent ? `3px solid ${GOLD}` : '3px solid #eee',
                      }} />
                      <p style={{ ...s.timelineLabel, fontWeight: isCurrent ? 600 : 400,
                        color: isDone ? '#222' : '#aaa' }}>
                        {STATUS_LABELS[step]?.label}
                      </p>
                      {i < 3 && <div style={{ ...s.timelineLine, background: i < currentIdx ? GOLD : '#eee' }} />}
                    </div>
                  )
                })}
              </div>

              {/* Dirección */}
              <div style={s.detailSection}>
                <p style={s.detailSectionTitle}>Dirección de entrega</p>
                <p style={s.detailText}>{selected.address}</p>
              </div>

              {/* Productos */}
              <div style={s.detailSection}>
                <p style={s.detailSectionTitle}>Productos</p>
                {selected.items?.map(item => (
                  <div key={item.id} style={s.detailItem}>
                    <div style={s.detailItemImg}>
                      {item.product?.image
                        ? <img src={getMediaUrl(item.product.image)} alt={item.product.name} style={s.img} />
                        : <div style={s.noImg}>🏺</div>}
                    </div>
                    <div style={s.detailItemInfo}>
                      <p style={s.detailItemName}>{item.product?.name}</p>
                      <p style={s.detailItemQty}>× {item.quantity} · ${Number(item.price).toLocaleString('es-CO')} c/u</p>
                    </div>
                    <p style={s.detailItemTotal}>
                      ${(item.quantity * Number(item.price)).toLocaleString('es-CO')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={s.detailTotal}>
                <span>Total pagado</span>
                <span style={s.detailTotalNum}>${Number(selected.total).toLocaleString('es-CO')} COP</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const s = {
  page: { padding: '56px', fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2.2rem',
    fontWeight: 700, margin: '0 0 10px', color: '#222' },
  titleBar: { width: '48px', height: '3px', background: GOLD, marginBottom: '40px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', alignItems: 'start' },
  ordersList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  orderCard: { borderRadius: '12px', padding: '24px', background: '#fff',
    cursor: 'pointer', transition: 'border 0.15s' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  orderNum: { fontFamily: "'Playfair Display', serif", fontSize: '1rem',
    fontWeight: 700, margin: '0 0 4px', color: '#222' },
  orderDate: { fontSize: '0.82rem', color: '#888', margin: 0 },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 },
  orderItems: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
  orderItem: { display: 'flex', alignItems: 'center', gap: '10px' },
  orderItemImg: { width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden',
    background: '#F6F1E7', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { fontSize: '1.2rem' },
  orderItemInfo: { flex: 1 },
  orderItemName: { fontSize: '0.85rem', fontWeight: 600, color: '#222', margin: '0 0 2px' },
  orderItemQty: { fontSize: '0.75rem', color: '#888', margin: 0 },
  orderItemPrice: { fontSize: '0.85rem', fontWeight: 700, color: '#222', margin: 0 },
  moreItems: { fontSize: '0.78rem', color: '#aaa', margin: '4px 0 0' },
  orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderTop: '1px solid #eee', paddingTop: '12px' },
  orderTotal: { fontSize: '0.88rem', color: '#555' },
  orderAddress: { fontSize: '0.78rem', color: '#aaa', maxWidth: '200px',
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  detail: { background: '#F6F1E7', borderRadius: '12px', padding: '28px',
    border: '1px solid #e8e0d0', position: 'sticky', top: '80px' },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  detailTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.2rem',
    fontWeight: 700, margin: 0, color: '#222' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.5rem',
    cursor: 'pointer', color: '#aaa', padding: 0 },
  detailBar: { width: '32px', height: '3px', background: GOLD, marginBottom: '24px' },
  timeline: { display: 'flex', alignItems: 'flex-start', marginBottom: '24px', position: 'relative' },
  timelineStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' },
  timelineDot: { width: '14px', height: '14px', borderRadius: '50%', marginBottom: '6px', zIndex: 1 },
  timelineLabel: { fontSize: '0.7rem', color: '#555', textAlign: 'center', lineHeight: 1.3 },
  timelineLine: { position: 'absolute', top: '7px', left: '50%', width: '100%', height: '2px', zIndex: 0 },
  detailSection: { marginBottom: '20px' },
  detailSectionTitle: { fontSize: '0.75rem', fontWeight: 600, color: '#aaa',
    textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' },
  detailText: { fontSize: '0.88rem', color: '#555', margin: 0, lineHeight: 1.6 },
  detailItem: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' },
  detailItemImg: { width: '44px', height: '44px', borderRadius: '6px', overflow: 'hidden',
    background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  detailItemInfo: { flex: 1 },
  detailItemName: { fontSize: '0.85rem', fontWeight: 600, color: '#222', margin: '0 0 2px' },
  detailItemQty: { fontSize: '0.75rem', color: '#888', margin: 0 },
  detailItemTotal: { fontSize: '0.88rem', fontWeight: 700, color: '#222', margin: 0 },
  detailTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderTop: '1px solid #e8e0d0', paddingTop: '16px', fontSize: '0.9rem',
    fontWeight: 600, color: '#555' },
  detailTotalNum: { fontFamily: "'Playfair Display', serif", fontSize: '1.3rem',
    fontWeight: 700, color: '#222' },
  empty: { textAlign: 'center', marginTop: '80px' },
  emptyTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.5rem',
    fontWeight: 700, margin: '0 0 12px', color: '#222' },
  emptySub: { color: '#aaa', fontSize: '0.9rem', margin: '0 0 32px' },
  btnPrimary: { display: 'inline-block', padding: '12px 28px', background: BEIGE,
    color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 },
  msg: { textAlign: 'center', color: '#aaa', marginTop: '100px' },
}