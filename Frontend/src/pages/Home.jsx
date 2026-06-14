import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const GREEN = '#2d6a4f'
const GOLD  = '#d4a017'

const categories = [
  { name: 'Cerámica',          img: '/ceramica.jpg' },
  { name: 'Tejidos',           img: '/tejidos.jpg' },
  { name: 'Tallado en madera', img: '/madera.jpg' },
  { name: 'Joyería',           img: '/joyeria.jpg' },
  { name: 'Decoración',        img: '/decoracion.jpg' },
  { name: 'Fibras naturales',  img: '/fibras.jpg' },
]

const values = [
  { title: 'Apoya lo nuestro',      desc: 'Fortalece las comunidades y la economía local.' },
  { title: 'Hecho a mano',          desc: 'Piezas únicas elaboradas con técnicas tradicionales.' },
  { title: 'De todas las regiones', desc: 'Artesanía auténtica de todos los rincones de Colombia.' },
  { title: 'Compra con propósito',  desc: 'Tu compra transforma vidas y preserva nuestra cultura.' },
]

const HERO_IMAGE = '/hero-artesano.png'

export default function Home() {
  const { user } = useAuth()
  const [artisans, setArtisans] = useState([])
  const [favArtisans, setFavArtisans] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    api.get('/artisans/featured/')
      .then(res => setArtisans(res.data))
      .catch(() => {})

    if (user) {
      api.get('/favorites/')
        .then(res => setFavArtisans(res.data.artisans.map(f => f.artisan.id)))
        .catch(() => {})
    }
  }, [user])

  const toggleFavArtisan = async (e, artisanId) => {
    e.preventDefault()
    if (!user) return
    await api.post('/favorites/artisan/', { artisan_id: artisanId })
    setFavArtisans(prev =>
      prev.includes(artisanId)
        ? prev.filter(id => id !== artisanId)
        : [...prev, artisanId]
    )
  }

  return (
    <div style={s.page}>

      {/* ── HERO ── */}
      <section style={{ ...s.hero, flexDirection: isMobile ? 'column' : 'row' }}>
        <div style={{ ...s.heroText, padding: isMobile ? '48px 24px' : '80px 48px' }}>
          <h1 style={{ ...s.heroTitle, fontSize: isMobile ? '2rem' : 'clamp(1.8rem, 3vw, 2.8rem)' }}>
            Hecho a mano.<br />Hecho en Colombia.
          </h1>
          <div style={s.heroAccent} />
          <p style={s.heroSub}>
            Descubre el talento, la tradición y la magia de miles de artesanos
            que mantienen vivas nuestras raíces.
          </p>
          <div style={s.heroBtns}>
            <Link to="/catalog" style={s.btnPrimary}>Explorar productos</Link>
          </div>
        </div>
        {!isMobile && (
          <div style={s.heroImgWrapper}>
            <img src={HERO_IMAGE} alt="Artesano colombiano tejiendo" style={s.heroImgTag} />
          </div>
        )}
      </section>

      {/* ── VALORES ── */}
      <section style={{
        ...s.valuesSection,
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
      }}>
        {values.map((v, i) => (
          <div key={v.title} style={{
            ...s.valueItem,
            borderRight: !isMobile && i < values.length - 1 ? '1px solid #eee' : 'none',
            borderBottom: isMobile ? '1px solid #eee' : 'none',
          }}>
            <strong style={s.valueTitle}>{v.title}</strong>
            <p style={s.valueDesc}>{v.desc}</p>
          </div>
        ))}
      </section>

      {/* ── CATEGORÍAS ── */}
      <section style={{ ...s.section, padding: isMobile ? '40px 20px' : '64px 56px' }}>
        <h2 style={s.sectionTitle}>Explora por categorías</h2>
        <div style={s.titleBar} />
        <div style={{
          ...s.catGrid,
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)',
          gap: isMobile ? '12px' : '16px',
        }}>
          {categories.map(c => (
            <Link to={`/catalog?category=${encodeURIComponent(c.name)}`} key={c.name}
              style={{ ...s.catCard, position: 'relative', overflow: 'hidden' }}>
              <img src={c.img} alt={c.name} style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', opacity: 0.6,
              }} />
              <span style={{ ...s.catName, position: 'relative', zIndex: 1 }}>{c.name}</span>
            </Link>
          ))}
        </div>
        <div style={s.centered}>
          <Link to="/catalog" style={s.btnBorder}>Ver todas las categorías</Link>
        </div>
      </section>

      {/* ── ARTESANOS DESTACADOS ── */}
      <section style={{ ...s.section, background: '#fafafa', padding: isMobile ? '40px 20px' : '64px 56px' }}>
        <h2 style={s.sectionTitle}>Artesanos destacados</h2>
        <div style={s.titleBar} />
        {artisans.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa', marginTop: '24px' }}>
            Próximamente artesanos destacados.
          </p>
        ) : (
          <div style={{
            ...s.artisanGrid,
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '12px' : '20px',
          }}>
            {artisans.map(a => (
              <Link to={`/artisans/${a.id}`} key={a.id} style={s.artisanCard}>
                <div style={{ ...s.artisanAvatar, height: isMobile ? '200px' : '280px' }}>
                  {a.avatar
                    ? <img src={a.avatar} alt={a.username}
                        style={{ width: '100%', height: '100%', objectFit: 'cover',
                          position: 'absolute', top: 0, left: 0 }} />
                    : a.banner
                      ? <img src={a.banner} alt={a.username}
                          style={{ width: '100%', height: '100%', objectFit: 'cover',
                            position: 'absolute', top: 0, left: 0 }} />
                      : null
                  }
                  <div style={s.artisanOverlay} />
                  <div style={s.artisanOverlayText}>
                    <strong style={s.artisanOverlayName}>{a.username}</strong>
                    <p style={s.artisanOverlayCraft}>{a.specialty}{a.region ? ` · ${a.region}` : ''}</p>
                    {!isMobile && <p style={s.artisanOverlayBio}>{a.bio || 'Artesano colombiano.'}</p>}
                  </div>
                  <button
                    style={{ ...s.heartBtn, color: favArtisans.includes(a.id) ? '#e74c3c' : '#fff' }}
                    onClick={e => toggleFavArtisan(e, a.id)}>
                    {favArtisans.includes(a.id) ? '♥' : '♡'}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div style={s.centered}>
          <Link to="/artisans" style={s.btnBorder}>Conoce más artesanos</Link>
        </div>
      </section>

      {/* ── BANNER REGIONES ── */}
      <section style={{
        ...s.banner,
        flexDirection: isMobile ? 'column' : 'row',
        margin: isMobile ? '0 16px 40px' : '0 56px 64px',
        padding: isMobile ? '32px 24px' : '48px 56px',
        textAlign: isMobile ? 'center' : 'left',
      }}>
        <div>
          <h2 style={s.bannerTitle}>Colombia está llena<br />de manos que crean historias.</h2>
          <p style={s.bannerSub}>
            Viaja por nuestras regiones y descubre la diversidad cultural a través de su artesanía.
          </p>
        </div>
        <Link to="/regions" style={s.btnPrimary}>Explorar regiones</Link>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        ...s.footer,
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 2fr',
        padding: isMobile ? '40px 24px' : '56px',
        gap: isMobile ? '32px' : '40px',
      }}>
        <div style={s.footerBrand}>
          <strong style={s.footerLogo}>
            Artesanos<br />
            <small style={{ fontWeight: 400, letterSpacing: '0.12em', fontSize: '0.7rem' }}>DE COLOMBIA</small>
          </strong>
          <p style={s.footerTagline}>
            Conectamos el talento artesanal de Colombia con el mundo para mantener vivas nuestras tradiciones.
          </p>
        </div>
        <div style={s.footerCol}>
          <strong style={s.footerColTitle}>Enlaces</strong>
          {[
            { label: 'Inicio', to: '/' },
            { label: 'Artesanos', to: '/artisans' },
            { label: 'Productos', to: '/catalog' },
            { label: 'Regiones', to: '/regions' },
            { label: 'Historias', to: '/stories' },
            { label: 'Sobre nosotros', to: '/about' },
          ].map(l => (
            <Link key={l.label} to={l.to} style={s.footerLink}>{l.label}</Link>
          ))}
        </div>
        <div style={s.footerCol}>
          <strong style={s.footerColTitle}>Ayuda</strong>
          {['Preguntas frecuentes','Envíos y devoluciones','Políticas de compra','Términos y condiciones','Contáctanos'].map(l => (
            <Link key={l} to="/" style={s.footerLink}>{l}</Link>
          ))}
        </div>
        <div style={s.footerCol}>
          <strong style={s.footerColTitle}>Suscríbete a nuestro boletín</strong>
          <p style={{ fontSize: '0.85rem', color: '#999', margin: '8px 0 12px' }}>
            Recibe novedades, historias y promociones especiales.
          </p>
          <div style={s.newsletter}>
            <input placeholder="Tu correo electrónico" style={s.nlInput} />
            <button style={s.nlBtn}>Suscribirme</button>
          </div>
        </div>
        <div style={s.footerBottom}>
          © 2024 Artesanos de Colombia. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}

const s = {
  page: { fontFamily: "'Lato', sans-serif", color: '#222', background: '#fff', width: '100%', boxSizing: 'border-box',   colorScheme: 'light', },
  hero: { display: 'flex', alignItems: 'stretch', background: '#F6F1E7', overflow: 'hidden', width: '100%' },
  heroText: { flex: '0 0 50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left', boxSizing: 'border-box', background: '#F6F1E7' },
  heroTitle: { fontWeight: 700, lineHeight: 1.1, margin: '0 0 16px', textAlign: 'left', fontFamily: "'Playfair Display', serif",color: '#1a1a1a' },
  heroAccent: { width: '48px', height: '4px', background: GOLD, margin: '0 0 24px' },
  heroSub: { fontSize: '1rem', color: '#555', maxWidth: '400px', margin: '0 0 36px', lineHeight: 1.6, textAlign: 'left' },
  heroBtns: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  heroImgWrapper: { flex: '0 0 50%', overflow: 'hidden', position: 'relative', minHeight: '500px', background: '#F6F1E7' },
  heroImgTag: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '55% 30%', display: 'block' },
  btnPrimary: { background: '#c8b99a', color: '#fff', padding: '12px 28px', borderRadius: '4px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', display: 'inline-block' },
  btnBorder: { display: 'inline-block', padding: '10px 32px', border: '1px solid #333', borderRadius: '8px', textDecoration: 'none', color: '#333', fontSize: '0.9rem' },
  valuesSection: { display: 'grid', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', width: '100%' },
  valueItem: { padding: '24px 16px', textAlign: 'center' },
  valueTitle: { display: 'block', fontSize: '0.95rem', color: '#222', fontWeight: 700, marginBottom: '8px', fontFamily: "'Lato', sans-serif" },
  valueDesc: { fontSize: '0.82rem', color: '#777', margin: 0, lineHeight: 1.5, fontFamily: "'Lato', sans-serif" },
  section: { width: '100%', boxSizing: 'border-box' },
  sectionTitle: { textAlign: 'center', fontSize: '1.7rem', fontWeight: 700, margin: '0 0 10px', fontFamily: "'Playfair Display', serif", color: '#1a1a1a',  },
  titleBar: { width: '48px', height: '3px', background: GOLD, margin: '0 auto 40px' },
  centered: { textAlign: 'center', marginTop: '36px' },
  catGrid: { display: 'grid' },
  catCard: { background: '#3d3b2f', borderRadius: '10px', aspectRatio: '1', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '16px', textDecoration: 'none', color: '#fff' },
  catName: { fontSize: '0.85rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 },
  artisanGrid: { display: 'grid' },
  artisanCard: { borderRadius: '12px', overflow: 'hidden', textDecoration: 'none', color: '#222' },
  artisanAvatar: { background: 'linear-gradient(135deg, #c8a882 0%, #8b6b4a 100%)', position: 'relative', overflow: 'hidden', borderRadius: '12px' },
  artisanOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)' },
  artisanOverlayText: { position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '16px', boxSizing: 'border-box', zIndex: 2 },
  artisanOverlayName: { display: 'block', color: '#fff', fontSize: '1rem', fontWeight: 700, fontFamily: "'Playfair Display', serif", marginBottom: '4px' },
  artisanOverlayCraft: { color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem', margin: '0 0 6px' },
  artisanOverlayBio: { color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  heartBtn: { position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: '32px', height: '32px', border: 'none', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  banner: { background: '#eef2ee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', borderRadius: '16px', boxSizing: 'border-box' },
  bannerTitle: { fontSize: '1.4rem', fontWeight: 700, margin: '0 0 10px', lineHeight: 1.3,  color: '#1a1a1a',  },
  bannerSub: { fontSize: '0.9rem', color: '#666', margin: 0 },
  footer: { background: '#1a1a1a', color: '#bbb', display: 'grid', width: '100%', boxSizing: 'border-box' },
  footerBrand: { display: 'flex', flexDirection: 'column', gap: '14px' },
  footerLogo: { color: '#fff', fontSize: '1.1rem', lineHeight: 1.4 },
  footerTagline: { fontSize: '0.82rem', color: '#888', margin: 0, lineHeight: 1.6 },
  footerCol: { display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' },
  footerColTitle: { color: '#fff', marginBottom: '4px', fontSize: '0.9rem' },
  footerLink: { color: '#999', textDecoration: 'none' },
  newsletter: { display: 'flex' },
  nlInput: { flex: 1, padding: '10px 12px', border: '1px solid #444', borderRadius: '6px 0 0 6px', background: '#2a2a2a', color: '#fff', fontSize: '0.85rem', outline: 'none' },
  nlBtn: { padding: '10px 18px', background: GREEN, color: '#fff', border: 'none', borderRadius: '0 6px 6px 0', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
  footerBottom: { gridColumn: '1 / -1', borderTop: '1px solid #2e2e2e', paddingTop: '24px', textAlign: 'center', fontSize: '0.8rem', color: '#555' },
}