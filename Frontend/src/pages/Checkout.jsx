import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api, { getMediaUrl } from '../services/api'
import { useAuth } from '../context/AuthContext'

const GOLD = '#d4a017'
const BEIGE = '#c8b99a'
const WOMPI_PUBLIC_KEY = 'pub_test_rnR8ERXhWO8nf4L11xG4pV9BWNZU6COH'

const DEPARTAMENTOS = [
  'Amazonas','Antioquia','Arauca','Atlántico','Bolívar','Boyacá','Caldas',
  'Caquetá','Casanare','Cauca','Cesar','Chocó','Córdoba','Cundinamarca',
  'Guainía','Guaviare','Huila','La Guajira','Magdalena','Meta','Nariño',
  'Norte de Santander','Putumayo','Quindío','Risaralda','San Andrés y Providencia',
  'Santander','Sucre','Tolima','Valle del Cauca','Vaupés','Vichada'
]

export default function Checkout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    address: '', department: '', city: '',
    postalCode: '', notes: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    api.get('/orders/cart/')
      .then(res => {
        if (!res.data?.items?.length) { navigate('/cart'); return }
        setCart(res.data)
        setForm(f => ({
          ...f,
          fullName: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          email: user.email || '',
          phone: user.phone || '',
        }))
      })
      .finally(() => setLoading(false))
  }, [user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Requerido'
    if (!form.email.trim()) e.email = 'Requerido'
    if (!form.phone.trim()) e.phone = 'Requerido'
    if (!form.address.trim()) e.address = 'Requerido'
    if (!form.department) e.department = 'Requerido'
    if (!form.city.trim()) e.city = 'Requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const total = cart?.items?.reduce((sum, item) =>
    sum + (item.quantity * Number(item.product.price)), 0) || 0

  const totalCentavos = Math.round(total * 100)

const handlePay = async () => {
  if (!validate()) return

  const fullAddress = `${form.address}, ${form.city}, ${form.department}${form.postalCode ? `, CP: ${form.postalCode}` : ''}${form.notes ? `. Notas: ${form.notes}` : ''}`

  try {
    await api.post('/orders/create/', { address: fullAddress })
  } catch {
    alert('Error al procesar el pedido.')
    return
  }
const reference = `ART-${Date.now()}`
  try {
    const sigRes = await api.post('/signature/', {
      reference,
      amount: String(totalCentavos), 
      currency: 'COP'
    })
    const signature = sigRes.data.signature

    console.log('Firma:', signature)
    console.log('Amount centavos:', totalCentavos)

    const params = new URLSearchParams({
      'public-key': WOMPI_PUBLIC_KEY,
      'currency': 'COP',
      'amount-in-cents': String(totalCentavos),
      'reference': reference,
      'signature:integrity': signature,
      'redirect-url': `${window.location.origin}/order-success`,
      'customer-data:email': form.email,
      'customer-data:full-name': form.fullName,
      'customer-data:phone-number': form.phone,
      'customer-data:phone-number-prefix': '+57',
    })

    console.log('URL:', `https://checkout.wompi.co/p/?${params.toString()}`)
    window.location.href = `https://checkout.wompi.co/p/?${params.toString()}`

  } catch(err) {
    console.error('Error en firma:', err)
    alert('Error al generar la firma de pago: ' + err.message)
  }
}
  if (loading) return <p style={s.msg}>Cargando...</p>

  return (
    <div style={s.page}>
      <div style={s.breadcrumb}>
        <Link to="/cart" style={s.breadLink}>Carrito</Link>
        <span style={s.breadSep}>/</span>
        <span style={s.breadCurrent}>Pagar</span>
      </div>

      <h1 style={s.title}>Información de envío</h1>
      <div style={s.titleBar} />

      <div style={s.layout}>
        {/* ── FORMULARIO ── */}
        <div style={s.formSection}>
          <h3 style={s.formSectionTitle}>Datos personales</h3>
          <div style={s.grid2}>
            <div style={s.field}>
              <label style={s.label}>Nombre completo *</label>
              <input name="fullName" value={form.fullName}
                onChange={handleChange}
                style={{ ...s.input, ...(errors.fullName ? s.inputError : {}) }} />
              {errors.fullName && <span style={s.errorMsg}>{errors.fullName}</span>}
            </div>
            <div style={s.field}>
              <label style={s.label}>Correo electrónico *</label>
              <input name="email" type="email" value={form.email}
                onChange={handleChange}
                style={{ ...s.input, ...(errors.email ? s.inputError : {}) }} />
              {errors.email && <span style={s.errorMsg}>{errors.email}</span>}
            </div>
            <div style={s.field}>
              <label style={s.label}>Teléfono *</label>
              <input name="phone" value={form.phone}
                onChange={handleChange}
                style={{ ...s.input, ...(errors.phone ? s.inputError : {}) }}
                placeholder="3001234567" />
              {errors.phone && <span style={s.errorMsg}>{errors.phone}</span>}
            </div>
          </div>

          <h3 style={{ ...s.formSectionTitle, marginTop: '32px' }}>Dirección de entrega</h3>
          <div style={s.field}>
            <label style={s.label}>Dirección *</label>
            <input name="address" value={form.address}
              onChange={handleChange}
              style={{ ...s.input, ...(errors.address ? s.inputError : {}) }}
              placeholder="Calle, carrera, número, barrio..." />
            {errors.address && <span style={s.errorMsg}>{errors.address}</span>}
          </div>
          <div style={s.grid2}>
            <div style={s.field}>
              <label style={s.label}>Departamento *</label>
              <select name="department" value={form.department}
                onChange={handleChange}
                style={{ ...s.input, ...(errors.department ? s.inputError : {}) }}>
                <option value="">Seleccionar...</option>
                {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <span style={s.errorMsg}>{errors.department}</span>}
            </div>
            <div style={s.field}>
              <label style={s.label}>Ciudad *</label>
              <input name="city" value={form.city}
                onChange={handleChange}
                style={{ ...s.input, ...(errors.city ? s.inputError : {}) }} />
              {errors.city && <span style={s.errorMsg}>{errors.city}</span>}
            </div>
            <div style={s.field}>
              <label style={s.label}>Código postal</label>
              <input name="postalCode" value={form.postalCode}
                onChange={handleChange} style={s.input} placeholder="Opcional" />
            </div>
          </div>
          <div style={s.field}>
            <label style={s.label}>Notas adicionales</label>
            <textarea name="notes" value={form.notes}
              onChange={handleChange}
              style={{ ...s.input, height: '80px', resize: 'vertical' }}
              placeholder="Instrucciones especiales para la entrega..." />
          </div>
        </div>

        {/* ── RESUMEN ── */}
        <div style={s.summary}>
          <h2 style={s.summaryTitle}>Resumen</h2>
          <div style={s.summaryBar} />

          <div style={s.summaryItems}>
            {cart?.items?.map(item => (
              <div key={item.id} style={s.summaryItem}>
                <div style={s.summaryItemImg}>
                  {item.product.image
                    ? <img src={getMediaUrl(item.product.image)} alt={item.product.name} style={s.summaryImg} />
                    : <div style={s.summaryNoImg}>🏺</div>}
                </div>
                <div style={s.summaryItemInfo}>
                  <p style={s.summaryItemName}>{item.product.name}</p>
                  <p style={s.summaryItemQty}>× {item.quantity}</p>
                </div>
                <p style={s.summaryItemPrice}>
                  ${(item.quantity * Number(item.product.price)).toLocaleString('es-CO')}
                </p>
              </div>
            ))}
          </div>

          <div style={s.summaryDivider} />

          <div style={s.summaryTotal}>
            <span style={s.summaryTotalLabel}>Total a pagar</span>
            <div>
              <span style={s.summaryTotalNum}>${total.toLocaleString('es-CO')}</span>
              <span style={s.summaryTotalCurrency}> COP</span>
            </div>
          </div>

          <button style={s.payBtn} onClick={handlePay}>
            Realizar pago →
          </button>

          <div style={s.wompiInfo}>
            <p style={s.wompiText}>Pago seguro con</p>
            <div style={s.wompiBadge}>Wompi</div>
            <p style={s.wompiMethods}>Tarjeta débito · Crédito · PSE · Nequi</p>
          </div>

          <Link to="/cart" style={s.backLink}>← Volver al carrito</Link>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { padding: '40px 56px 64px', fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' },
  breadLink: { fontSize: '0.85rem', color: '#888', textDecoration: 'none' },
  breadSep: { fontSize: '0.85rem', color: '#ccc' },
  breadCurrent: { fontSize: '0.85rem', color: '#222', fontWeight: 500 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem',
    fontWeight: 700, margin: '0 0 10px', color: '#222' },
  titleBar: { width: '48px', height: '3px', background: GOLD, marginBottom: '40px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', alignItems: 'start' },
  formSection: {},
  formSectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.1rem',
    fontWeight: 700, margin: '0 0 20px', color: '#222' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.82rem', fontWeight: 600, color: '#555', letterSpacing: '0.03em' },
  input: { padding: '11px 14px', borderRadius: '6px', border: '1px solid #ddd',
    fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none' },
  inputError: { borderColor: '#e74c3c' },
  errorMsg: { fontSize: '0.78rem', color: '#e74c3c' },
  summary: { background: '#F6F1E7', borderRadius: '12px', padding: '32px',
    border: '1px solid #e8e0d0', position: 'sticky', top: '80px' },
  summaryTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.2rem',
    fontWeight: 700, margin: '0 0 10px', color: '#222' },
  summaryBar: { width: '32px', height: '3px', background: GOLD, marginBottom: '20px' },
  summaryItems: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' },
  summaryItem: { display: 'flex', alignItems: 'center', gap: '10px' },
  summaryItemImg: { width: '44px', height: '44px', borderRadius: '6px', overflow: 'hidden',
    background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  summaryImg: { width: '100%', height: '100%', objectFit: 'cover' },
  summaryNoImg: { fontSize: '1.2rem' },
  summaryItemInfo: { flex: 1 },
  summaryItemName: { fontSize: '0.85rem', fontWeight: 600, color: '#222', margin: '0 0 2px' },
  summaryItemQty: { fontSize: '0.78rem', color: '#888', margin: 0 },
  summaryItemPrice: { fontSize: '0.88rem', fontWeight: 700, color: '#222', margin: 0, flexShrink: 0 },
  summaryDivider: { height: '1px', background: '#e8e0d0', margin: '16px 0' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  summaryTotalLabel: { fontSize: '0.9rem', fontWeight: 600, color: '#555' },
  summaryTotalNum: { fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#222' },
  summaryTotalCurrency: { fontSize: '0.78rem', color: '#aaa' },
  payBtn: { width: '100%', padding: '14px', background: BEIGE, color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer',
    fontWeight: 600, marginBottom: '16px' },
  wompiInfo: { textAlign: 'center', marginBottom: '16px' },
  wompiText: { fontSize: '0.75rem', color: '#aaa', margin: '0 0 6px' },
  wompiBadge: { display: 'inline-block', background: '#7B2D8B', color: '#fff',
    padding: '4px 14px', borderRadius: '4px', fontSize: '0.85rem',
    fontWeight: 700, marginBottom: '6px' },
  wompiMethods: { fontSize: '0.72rem', color: '#aaa', margin: 0 },
  backLink: { display: 'block', textAlign: 'center', fontSize: '0.85rem',
    color: '#888', textDecoration: 'none' },
  msg: { textAlign: 'center', color: '#aaa', marginTop: '100px' },
}