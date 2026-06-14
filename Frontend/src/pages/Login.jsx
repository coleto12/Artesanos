import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const GOLD = '#d4a017'
const BEIGE = '#c8b99a'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useState(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await login(form.email, form.password)
      if (user.role === 'artesano') navigate('/my-products')
      else navigate('/catalog')
    } catch (err) {
      const status = err?.response?.status
      if (status === 401 || status === 400 || status === 404) {
        setError('Correo o contraseña incorrectos.')
      } else if (status === 500) {
        setError('Error del servidor. Intenta de nuevo más tarde.')
      } else {
        setError('Correo o contraseña incorrectos.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      ...s.page,
      flexDirection: isMobile ? 'column' : 'row',
      colorScheme: 'light',
    }}>
      {/* Panel izquierdo — oculto en móvil */}
      {!isMobile && (
        <div style={s.left}>
          <h1 style={s.leftTitle}>Bienvenido de nuevo.</h1>
          <div style={s.leftBar} />
          <p style={s.leftSub}>
            Accede a tu cuenta y descubre artesanías únicas hechas a mano por artesanos colombianos.
          </p>
        </div>
      )}

      <div style={{
        ...s.right,
        padding: isMobile ? '40px 24px' : '40px',
        alignItems: isMobile ? 'flex-start' : 'center',
      }}>
        <div style={{ ...s.card, maxWidth: isMobile ? '100%' : '420px' }}>

          {isMobile && (
            <>
              <h1 style={{ ...s.leftTitle, fontSize: '1.8rem', marginBottom: '10px' }}>
                Bienvenido de nuevo.
              </h1>
              <div style={{ ...s.leftBar, marginBottom: '24px' }} />
            </>
          )}

          <h2 style={s.title}>Iniciar sesión</h2>
          <div style={s.titleBar} />

          {error && <p style={s.error}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div style={s.field}>
              <label style={s.label}>Correo electrónico</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                style={s.input}
                required
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Contraseña</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                style={s.input}
                required
              />
            </div>
            <button type="submit" style={s.button} disabled={loading}>
              {loading ? 'Entrando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p style={s.footer}>
            ¿No tienes cuenta? <Link to="/register" style={s.link}>Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", background: '#fff' },
  left: { flex: '0 0 45%', background: '#F6F1E7', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 64px', boxSizing: 'border-box' },
  leftTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px', lineHeight: 1.2 },
  leftBar: { width: '48px', height: '4px', background: GOLD, margin: '0 0 24px' },
  leftSub: { fontSize: '1rem', color: '#666', lineHeight: 1.7, maxWidth: '360px', margin: 0 },
  right: { flex: 1, display: 'flex', justifyContent: 'center', background: '#fff' },
  card: { width: '100%' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, margin: '0 0 10px', color: '#1a1a1a' },
  titleBar: { width: '40px', height: '3px', background: GOLD, marginBottom: '32px' },
  field: { marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.82rem', fontWeight: 600, color: '#555', letterSpacing: '0.03em' },
  input: { padding: '12px 14px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', background: '#fff', color: '#222' },
  button: { width: '100%', padding: '13px', background: BEIGE, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600, marginTop: '8px' },
  error: { background: '#fdecea', color: '#c0392b', padding: '10px 14px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.88rem' },
  footer: { textAlign: 'center', marginTop: '24px', color: '#888', fontSize: '0.88rem' },
  link: { color: BEIGE, fontWeight: 600, textDecoration: 'none' },
}