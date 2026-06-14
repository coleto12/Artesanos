import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api, { getMediaUrl } from '../services/api'
import { useAuth } from '../context/AuthContext'

const GOLD = '#d4a017'
const BEIGE = '#c8b99a'

export default function Artisans() {
  const { user } = useAuth()
  const [artisans, setArtisans] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [favArtisans, setFavArtisans] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    api.get('/artisans/')
      .then(res => setArtisans(res.data))
      .finally(() => setLoading(false))

    if (user) {
      api.get('/favorites/')
        .then(res => setFavArtisans(res.data.artisans.map(f => f.artisan.id)))
        .catch(() => {})
    }
  }, [user])

  const toggleFav = async (e, artisanId) => {
    e.preventDefault()
    if (!user) return
    await api.post('/favorites/artisan/', { artisan_id: artisanId })
    setFavArtisans(prev =>
      prev.includes(artisanId)
        ? prev.filter(id => id !== artisanId)
        : [...prev, artisanId]
    )
  }

  const specialties = [...new Set(artisans.map(a => a.specialty).filter(Boolean))]

  const filtered = artisans.filter(a => {
    const matchSearch = a.username.toLowerCase().includes(search.toLowerCase()) ||
      a.specialty?.toLowerCase().includes(search.toLowerCase()) ||
      a.region?.toLowerCase().includes(search.toLowerCase())
    const matchSpecialty = selectedSpecialty ? a.specialty === selectedSpecialty : true
    return matchSearch && matchSpecialty
  })

  return (
    <div style={{ ...s.page, padding: isMobile ? '24px 16px' : '56px', colorScheme: 'light' }}>
      <div style={s.pageHeader}>
        <h1 style={s.title}>Artesanos</h1>
        <div style={s.titleBar} />
        <p style={s.sub}>Conoce a los creadores detrás de cada pieza única</p>
      </div>

      {/* ── FILTROS ── */}
      <div style={s.filters}>
        <input
          placeholder="Buscar por nombre, especialidad o región..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={s.search}
        />
        <div style={s.specialtyFilters}>
          <button
            style={{ ...s.filterBtn, ...(selectedSpecialty === '' ? s.filterBtnActive : {}) }}
            onClick={() => setSelectedSpecialty('')}>
            Todos
          </button>
          {specialties.map(sp => (
            <button
              key={sp}
              style={{ ...s.filterBtn, ...(selectedSpecialty === sp ? s.filterBtnActive : {}) }}
              onClick={() => setSelectedSpecialty(sp)}>
              {sp}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={s.msg}>Cargando artesanos...</p>
      ) : filtered.length === 0 ? (
        <p style={s.msg}>No se encontraron artesanos.</p>
      ) : (
        <div style={{
          ...s.grid,
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: isMobile ? '12px' : '28px',
        }}>
          {filtered.map(a => (
            <Link to={`/artisans/${a.id}`} key={a.id} style={s.card}>
              <div style={{ ...s.avatarBox, height: isMobile ? '160px' : '220px' }}>
                {a.avatar
                  ? <img src={getMediaUrl(a.avatar)} alt={a.username} style={s.avatarImg} />
                  : <div style={s.avatarPlaceholder}>
                      {a.username?.[0]?.toUpperCase()}
                    </div>
                }
                <button
                  style={{ ...s.heartBtn, color: favArtisans.includes(a.id) ? '#e74c3c' : '#ccc' }}
                  onClick={e => toggleFav(e, a.id)}>
                  {favArtisans.includes(a.id) ? '♥' : '♡'}
                </button>
              </div>
              <div style={{ ...s.info, padding: isMobile ? '12px' : '20px' }}>
                <h3 style={{ ...s.name, fontSize: isMobile ? '0.95rem' : '1.15rem' }}>{a.username}</h3>
                {a.specialty && <p style={s.specialty}>{a.specialty}</p>}
                {a.region && <p style={s.region}> {a.region}</p>}
                {!isMobile && a.bio && <p style={s.bio}>{a.bio}</p>}
                <div style={s.cardFooter}>
                  {a.years_of_experience > 0 && (
                    <span style={s.badge}>{a.years_of_experience} años</span>
                  )}
                  {a.is_verified && <span style={s.verified}>✓</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

const s = {
  page: { fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', background: '#fff', color: '#222' },
  pageHeader: { marginBottom: '32px' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, margin: '0 0 10px', color: '#1a1a1a' },
  titleBar: { width: '48px', height: '3px', background: GOLD, marginBottom: '12px' },
  sub: { color: '#888', fontSize: '0.95rem', margin: 0 },
  filters: { marginBottom: '32px' },
  search: { width: '100%', padding: '12px 16px', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '16px', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff', color: '#222' },
  specialtyFilters: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  filterBtn: { padding: '8px 18px', border: '1px solid #ddd', borderRadius: '20px', background: '#fff', cursor: 'pointer', fontSize: '0.85rem', color: '#555', fontFamily: 'inherit' },
  filterBtnActive: { background: BEIGE, color: '#fff', border: '1px solid transparent', fontWeight: 600 },
  grid: { display: 'grid' },
  card: { textDecoration: 'none', color: '#222', border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', background: '#fff' },
  avatarBox: { background: '#F6F1E7', position: 'relative', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarPlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', fontWeight: 700, color: BEIGE, fontFamily: "'Playfair Display', serif" },
  heartBtn: { position: 'absolute', top: '8px', right: '8px', background: '#fff', borderRadius: '50%', width: '30px', height: '30px', border: 'none', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  info: { },
  name: { fontFamily: "'Playfair Display', serif", fontWeight: 700, margin: '0 0 4px', color: '#1a1a1a' },
  specialty: { fontSize: '0.75rem', color: BEIGE, fontWeight: 600, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  region: { fontSize: '0.78rem', color: '#888', margin: '0 0 8px' },
  bio: { fontSize: '0.85rem', color: '#555', lineHeight: 1.6, margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  cardFooter: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' },
  badge: { background: '#F6F1E7', color: '#888', padding: '3px 8px', borderRadius: '20px', fontSize: '0.72rem' },
  verified: { color: '#2d6a4f', fontSize: '0.8rem', fontWeight: 600 },
  msg: { textAlign: 'center', color: '#aaa', marginTop: '80px', fontSize: '1rem' },
}