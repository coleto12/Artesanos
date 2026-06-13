import { Link } from 'react-router-dom'

const GOLD = '#d4a017'
const BEIGE = '#c8b99a'

export default function OrderSuccess() {
  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.icon}>✓</div>
        <h1 style={s.title}>Pago exitoso</h1>
        <div style={s.bar} />
        <p style={s.text}>
          Tu pedido ha sido confirmado y está siendo procesado.
          Recibirás un correo con los detalles de tu compra.
        </p>
        <div style={s.btns}>
          <Link to="/orders" style={s.btnPrimary}>Ver mis pedidos</Link>
          <Link to="/catalog" style={s.btnSecondary}>Seguir comprando</Link>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '80vh', fontFamily: "'Segoe UI', sans-serif" },
  card: { textAlign: 'center', maxWidth: '440px', padding: '40px' },
  icon: { width: '80px', height: '80px', borderRadius: '50%', background: '#eaf5ee',
    color: '#2d6a4f', fontSize: '2.2rem', display: 'flex', alignItems: 'center',
    justifyContent: 'center', margin: '0 auto 24px', fontWeight: 700 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2rem',
    fontWeight: 700, margin: '0 0 12px', color: '#222' },
  bar: { width: '40px', height: '3px', background: GOLD, margin: '0 auto 20px' },
  text: { color: '#666', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 32px' },
  btns: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: { display: 'inline-block', padding: '12px 28px', background: BEIGE,
    color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 },
  btnSecondary: { display: 'inline-block', padding: '12px 28px', background: 'transparent',
    color: '#555', borderRadius: '6px', textDecoration: 'none',
    border: '1px solid #ddd', fontWeight: 600 },
}