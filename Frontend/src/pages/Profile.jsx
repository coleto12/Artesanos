import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const COLOMBIA_DEPARTMENTS = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá",
  "Caldas", "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó",
  "Córdoba", "Cundinamarca", "Guainía", "Guaviare", "Huila", "La Guajira",
  "Magdalena", "Meta", "Nariño", "Norte de Santander", "Putumayo",
  "Quindío", "Risaralda", "San Andrés y Providencia", "Santander", "Sucre",
  "Tolima", "Valle del Cauca", "Vaupés", "Vichada", "Bogotá D.C."
].sort()

export default function Profile() {
  const { user } = useAuth()
  const [form, setForm] = useState({ phone: '', address: '' })
  const [artisanForm, setArtisanForm] = useState({ bio: '', region: '', specialty: '', years_of_experience: '' })
  const [avatar, setAvatar] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setForm({ phone: user.phone || '', address: user.address || '' })
      if (user.avatar) setPreview(user.avatar)
    }
    if (user?.role === 'artesano') {
      api.get('/artisans/my-profile/')
        .then(res => setArtisanForm({
          bio: res.data.bio || '',
          region: res.data.region || '',
          specialty: res.data.specialty || '',
          years_of_experience: res.data.years_of_experience || '',
        }))
        .catch(() => {})
    }
  }, [user])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleArtisanChange = (e) => setArtisanForm({ ...artisanForm, [e.target.name]: e.target.value })

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (file) { setAvatar(file); setPreview(URL.createObjectURL(file)) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      if (avatar) data.append('avatar', avatar)
      await api.patch('/users/profile/', data, { headers: { 'Content-Type': 'multipart/form-data' } })

      if (user?.role === 'artesano') {
        await api.patch('/artisans/my-profile/', artisanForm)
      }
      setSuccess(true)
    } catch {
      setError('Error al guardar el perfil.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.container}>
        <h1 style={s.title}>Mi perfil</h1>
        <div style={s.titleBar} />
        <p style={s.sub}>Actualiza tu información de contacto y presentación</p>

        <form onSubmit={handleSubmit}>
          {/* ── AVATAR ── */}
          <div style={s.card}>
            <div style={s.avatarSection}>
              <div style={s.avatarWrapper}>
                {preview
                  ? <img src={preview} alt="Avatar" style={s.avatarImg} />
                  : <div style={s.avatarPlaceholder}>
                      {user?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                }
              </div>
              <div>
                <p style={s.avatarName}>
                  {user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user?.username}
                </p>
                <p style={s.avatarRole}>{user?.role}</p>
                <p style={s.avatarEmail}>{user?.email}</p>
                <label style={s.btnAvatar}>
                  Cambiar foto de perfil
                  <input type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          </div>

          {/* ── CONTACTO ── */}
          <div style={s.card}>
            <h3 style={s.sectionTitle}>Información de contacto</h3>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>Teléfono</label>
                <input name="phone" value={form.phone} onChange={handleChange} style={s.input} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Ciudad</label>
                <input name="address" value={form.address} onChange={handleChange} style={s.input} />
              </div>
            </div>
          </div>

          {/* ── PERFIL ARTESANO ── */}
          {user?.role === 'artesano' && (
            <div style={s.card}>
              <h3 style={s.sectionTitle}>Perfil de artesano</h3>
              <div style={s.field}>
                <label style={s.label}>Biografía</label>
                <textarea name="bio" value={artisanForm.bio} onChange={handleArtisanChange}
                  style={{ ...s.input, height: '100px', resize: 'vertical' }}
                  placeholder="Cuéntanos sobre ti y tu trabajo..." />
              </div>
              <div style={s.grid2}>
                <div style={s.field}>
                  <label style={s.label}>Departamento</label>
                  <select name="region" value={artisanForm.region} onChange={handleArtisanChange} style={s.input}>
                    <option value="">Selecciona un departamento</option>
                    {COLOMBIA_DEPARTMENTS.map(dep => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Especialidad</label>
                  <input name="specialty" value={artisanForm.specialty} onChange={handleArtisanChange} style={s.input} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Años de experiencia</label>
                  <input name="years_of_experience" type="number" value={artisanForm.years_of_experience}
                    onChange={handleArtisanChange} style={s.input} />
                </div>
              </div>
            </div>
          )}

          {success && <p style={s.success}>✓ Perfil actualizado correctamente.</p>}
          {error && <p style={s.error}>{error}</p>}

          <button type="submit" style={s.btnSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}

const GOLD = '#d4a017'
const BEIGE = '#c8b99a'

const s = {
  page: { background: '#fff', minHeight: '100vh', padding: '56px', fontFamily: "'Segoe UI', sans-serif" },
  container: { maxWidth: '720px', margin: '0 auto' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, margin: '0 0 10px', color: '#222' },
  titleBar: { width: '48px', height: '3px', background: GOLD, marginBottom: '12px' },
  sub: { color: '#888', fontSize: '0.95rem', margin: '0 0 36px' },
  card: { background: '#F6F1E7', borderRadius: '12px', padding: '32px', marginBottom: '24px', border: '1px solid #e8e0d0' },
  avatarSection: { display: 'flex', alignItems: 'center', gap: '28px' },
  avatarWrapper: { flexShrink: 0 },
  avatarImg: { width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' },
  avatarPlaceholder: { width: '90px', height: '90px', borderRadius: '50%', background: BEIGE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', fontWeight: 700, color: '#fff' },
  avatarName: { fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, margin: '0 0 4px' },
  avatarRole: { fontSize: '0.82rem', color: '#aaa', textTransform: 'capitalize', margin: '0 0 4px' },
  avatarEmail: { fontSize: '0.82rem', color: '#888', margin: '0 0 14px' },
  btnAvatar: { background: '#fff', border: '1px solid #ddd', padding: '8px 18px', borderRadius: '4px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600, color: '#555' },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, margin: '0 0 20px', color: '#222' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  field: { marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '7px' },
  label: { fontSize: '0.82rem', fontWeight: 600, color: '#555', letterSpacing: '0.03em' },
  input: { padding: '11px 14px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.95rem', background: '#fff', fontFamily: 'inherit' },
  btnSave: { background: BEIGE, color: '#fff', border: 'none', padding: '13px 36px', borderRadius: '4px', fontSize: '0.95rem', cursor: 'pointer', fontWeight: 600 },
  success: { color: '#5a8a6a', background: '#f0faf4', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.9rem' },
  error: { color: '#c0392b', marginBottom: '16px', fontSize: '0.9rem' },
}