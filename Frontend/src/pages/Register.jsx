import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const GOLD = '#d4a017'
const BEIGE = '#c8b99a'

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '',
    password: '', password2: '', role: 'cliente', phone: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
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
    if (form.password !== form.password2) { setError('Las contraseñas no coinciden.'); return }
    setLoading(true)
    setError('')
    try {
      await register(form)
      navigate('/catalog')
    } catch {
      setError('Error al registrarse. Verifica los datos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      ...s.page,
      padding: isMobile ? '24px 16px' : '40px',
      alignItems: isMobile ? 'flex-start' : 'center',
      colorScheme: 'light',
    }}>
      <div style={{
        ...s.card,
        padding: isMobile ? '32px 20px' : '48px',
        boxShadow: isMobile ? 'none' : '0 4px 24px rgba(0,0,0,0.08)',
        borderRadius: isMobile ? '0' : '12px',
      }}>
        <h2 style={s.title}>Crear cuenta</h2>
        <div style={s.titleBar} />

        {error && <p style={s.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{
            ...s.grid2,
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          }}>
            <div style={s.field}>
              <label style={s.label}>Nombre</label>
              <input name="first_name" value={form.first_name} onChange={handleChange} style={s.input} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Apellido</label>
              <input name="last_name" value={form.last_name} onChange={handleChange} style={s.input} required />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Nombre de usuario</label>
            <input name="username" value={form.username} onChange={handleChange} style={s.input} required />
          </div>

          <div style={s.field}>
            <label style={s.label}>Correo electrónico</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} style={s.input} required />
          </div>

          <div style={s.field}>
            <label style={s.label}>Teléfono</label>
            <input name="phone" value={form.phone} onChange={handleChange} style={s.input} />
          </div>

          <div style={s.field}>
            <label style={s.label}>Tipo de cuenta</label>
            <select name="role" value={form.role} onChange={handleChange} style={s.input}>
              <option value="cliente">Cliente</option>
              <option value="artesano">Artesano</option>
            </select>
          </div>

          <div style={{
            ...s.grid2,
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          }}>
            <div style={s.field}>
              <label style={s.label}>Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} style={s.input} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Confirmar contraseña</label>
              <input name="password2" type="password" value={form.password2} onChange={handleChange} style={s.input} required />
            </div>
          </div>

          <button type="submit" style={s.button} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p style={s.footer}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: BEIGE, fontWeight: 600, textDecoration: 'none' }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  page: { display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#F6F1E7', fontFamily: "'Segoe UI', sans-serif" },
  card: { background: '#fff', width: '100%', maxWidth: '520px' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, margin: '0 0 10px', color: '#1a1a1a' },
  titleBar: { width: '40px', height: '3px', background: GOLD, marginBottom: '28px' },
  grid2: { display: 'grid', gap: '16px' },
  field: { marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '7px' },
  label: { fontSize: '0.82rem', fontWeight: 600, color: '#555', letterSpacing: '0.03em' },
  input: { padding: '11px 14px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.95rem', fontFamily: 'inherit', background: '#fff', color: '#222' },
  button: { width: '100%', padding: '13px', background: BEIGE, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600, marginTop: '8px' },
  error: { background: '#fdecea', color: '#c0392b', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.88rem' },
  footer: { textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '0.88rem' },
}