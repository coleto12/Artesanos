import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api, { getMediaUrl } from '../services/api'
import { useAuth } from '../context/AuthContext'

const GOLD = '#d4a017'
const BEIGE = '#c8b99a'

export default function ArtisanDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [artisan, setArtisan] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFav, setIsFav] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    api.get(`/artisans/${id}/`)
      .then(res => {
        setArtisan(res.data)
        return api.get(`/products/?artisan=${res.data.user_id}`)
      })
      .then(res => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))

    if (user) {
      api.get('/favorites/')
        .then(res => {
          const favIds = res.data.artisans.map(f => f.artisan.id)
          setIsFav(favIds.includes(Number(id)))
        })
    }
  }, [id, user])

  const toggleFav = async () => {
    if (!user) return
    await api.post('/favorites/artisan/', { artisan_id: id })
    setIsFav(prev => !prev)
  }

  if (loading) return <p style={s.msg}>Cargando...</p>
  if (!artisan) return <p style={s.msg}>Artesano no encontrado.</p>

  return (
    <div style={{ ...s.page, colorScheme: 'light' }}>

      {/* ── HERO ── */}
      <div style={{ ...s.hero, flexDirection: isMobile ? 'column' : 'row', minHeight: isMobile ? 'auto' : '420px' }}>
        <div style={{ ...s.heroImg, flex: isMobile ? 'none' : '0 0 45%', height: isMobile ? '240px' : 'auto' }}>
          {artisan.avatar
            ? <img src={getMediaUrl(artisan.avatar)} alt={artisan.username} style={s.heroImgTag} />
            : <div style={s.heroPlaceholder}>{artisan.username?.[0]?.toUpperCase()}</div>
          }
          <div style={s.heroOverlay} />
        </div>
        <div style={{ ...s.heroInfo, padding: isMobile ? '24px 20px' : '56px 64px' }}>
          <p style={s.heroSpecialty}>{artisan.specialty}</p>
          <h1 style={{ ...s.heroName, fontSize: isMobile ? '1.8rem' : 'clamp(2rem, 3vw, 3rem)' }}>
            {artisan.username}
          </h1>
          <div style={s.heroBar} />
          {artisan.region && <p style={s.heroRegion}>📍 {artisan.region}</p>}
          <div style={s.heroBadges}>
            {artisan.years_of_experience > 0 && (
              <span style={s.badge}>{artisan.years_of_experience} años de experiencia</span>
            )}
            {artisan.is_verified && <span style={s.verified}>✓ Verificado</span>}
          </div>
          <button style={{ ...s.favBtn, background: isFav ? '#fdecea' : '#F6F1E7', color: isFav ? '#e74c3c' : '#555' }} onClick={toggleFav}>
            {isFav ? '♥ En favoritos' : '♡ Agregar a favoritos'}
          </button>
        </div>
      </div>

      {/* ── BIO ── */}
      {artisan.bio && (
        <div style={{ ...s.section, padding: isMobile ? '32px 20px' : '56px' }}>
          <h2 style={s.sectionTitle}>Sobre mí</h2>
          <div style={s.sectionBar} />
          <p style={s.bioText}>{artisan.bio}</p>
        </div>
      )}

      {/* ── PRODUCTOS ── */}
      {products.length > 0 && (
        <div style={{ ...s.section, background: '#fafafa', padding: isMobile ? '32px 20px' : '56px' }}>
          <h2 style={s.sectionTitle}>Productos de {artisan.username}</h2>
          <div style={s.sectionBar} />
          <div style={{
            ...s.productsGrid,
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: isMobile ? '12px' : '20px',
          }}>
            {products.map(p => (
              <Link to={`/product/${p.id}`} key={p.id} style={s.productCard}>
                <div style={{ ...s.productImgBox, height: isMobile ? '130px' : '180px' }}>
                  {p.image
                    ? <img src={getMediaUrl(p.image)} alt={p.name} style={s.productImg} />
                    : <div style={s.productNoImg}>🏺</div>
                  }
                </div>
                <div style={{ ...s.productInfo, padding: isMobile ? '10px 12px' : '14px 16px' }}>
                  <p style={s.productCategory}>{p.category_name || ''}</p>
                  <h3 style={{ ...s.productName, fontSize: isMobile ? '0.85rem' : '0.95rem' }}>{p.name}</h3>
                  <p style={s.productPrice}>${Number(p.price).toLocaleString('es-CO')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── HISTORIAS ── */}
      {artisan.stories?.length > 0 && (
        <div style={{ ...s.section, background: '#F6F1E7', padding: isMobile ? '32px 20px' : '56px' }}>
          <h2 style={s.sectionTitle}>Historias culturales</h2>
          <div style={s.sectionBar} />
          <div style={{
            ...s.storiesGrid,
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
          }}>
            {artisan.stories.map(story => (
              <div key={story.id} style={s.storyCard}>
                {story.image && (
                  <img src={getMediaUrl(story.image)} alt={story.title} style={s.storyImg} />
                )}
                <h3 style={s.storyTitle}>{story.title}</h3>
                <p style={s.storyContent}>{story.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RESEÑAS ── */}
      {artisan.reviews?.length > 0 && (
        <div style={{ ...s.section, padding: isMobile ? '32px 20px' : '56px' }}>
          <h2 style={s.sectionTitle}>Reseñas</h2>
          <div style={s.sectionBar} />
          <div style={{
            ...s.reviewsGrid,
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))',
          }}>
            {artisan.reviews.map(r => (
              <div key={r.id} style={s.reviewCard}>
                <div style={s.reviewHeader}>
                  <strong style={s.reviewUser}>{r.customer_name}</strong>
                  <span style={s.reviewRating}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                {r.comment && <p style={s.reviewComment}>{r.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ ...s.backBtn, padding: isMobile ? '0 20px 40px' : '0 56px 56px' }}>
        <Link to="/artisans" style={s.btnBorder}>← Volver a artesanos</Link>
      </div>
    </div>
  )
}

const s = {
  page: { fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', background: '#fff', color: '#222' },
  hero: { display: 'flex', background: '#F6F1E7' },
  heroImg: { position: 'relative', overflow: 'hidden' },
  heroImgTag: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  heroPlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem', fontWeight: 700, color: BEIGE, fontFamily: "'Playfair Display', serif" },
  heroOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)' },
  heroInfo: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  heroSpecialty: { fontSize: '0.8rem', color: BEIGE, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' },
  heroName: { fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px', lineHeight: 1.1 },
  heroBar: { width: '48px', height: '3px', background: GOLD, marginBottom: '20px' },
  heroRegion: { fontSize: '0.9rem', color: '#666', margin: '0 0 20px' },
  heroBadges: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' },
  badge: { background: '#fff', color: '#888', padding: '5px 12px', borderRadius: '20px', fontSize: '0.78rem', border: '1px solid #eee' },
  verified: { color: '#2d6a4f', fontSize: '0.82rem', fontWeight: 600, background: '#eef7f2', padding: '5px 12px', borderRadius: '20px' },
  favBtn: { padding: '11px 24px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, alignSelf: 'flex-start', fontFamily: 'inherit' },
  section: { },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, margin: '0 0 10px', color: '#1a1a1a' },
  sectionBar: { width: '40px', height: '3px', background: GOLD, marginBottom: '28px' },
  bioText: { fontSize: '1rem', color: '#555', lineHeight: 1.8, maxWidth: '720px' },
  productsGrid: { display: 'grid' },
  productCard: { textDecoration: 'none', color: '#222', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', background: '#fff' },
  productImgBox: { background: '#F6F1E7', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  productImg: { width: '100%', height: '100%', objectFit: 'cover' },
  productNoImg: { fontSize: '3rem' },
  productInfo: { },
  productCategory: { fontSize: '0.72rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' },
  productName: { fontFamily: "'Playfair Display', serif", fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' },
  productPrice: { fontSize: '1rem', fontWeight: 700, color: '#222', margin: 0 },
  storiesGrid: { display: 'grid', gap: '24px' },
  storyCard: { background: '#fff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #eee' },
  storyImg: { width: '100%', height: '180px', objectFit: 'cover' },
  storyTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, margin: '16px 16px 8px', color: '#1a1a1a' },
  storyContent: { fontSize: '0.85rem', color: '#666', lineHeight: 1.6, margin: '0 16px 16px' },
  reviewsGrid: { display: 'grid', gap: '16px' },
  reviewCard: { background: '#F6F1E7', borderRadius: '10px', padding: '20px' },
  reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  reviewUser: { fontSize: '0.9rem', color: '#222' },
  reviewRating: { color: GOLD, fontSize: '0.9rem' },
  reviewComment: { fontSize: '0.85rem', color: '#555', lineHeight: 1.6, margin: 0 },
  backBtn: { },
  btnBorder: { display: 'inline-block', padding: '10px 24px', border: '1px solid #333', borderRadius: '8px', textDecoration: 'none', color: '#333', fontSize: '0.9rem' },
  msg: { textAlign: 'center', color: '#aaa', marginTop: '100px', fontSize: '1rem' },
}