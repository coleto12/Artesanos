import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const GOLD = '#d4a017'
const BEIGE = '#c8b99a'

const REGIONS_DATA = {
  "La Guajira": {
    specialty: "Tejidos Wayuu", years: 500,
    history: "La Guajira es hogar del pueblo Wayuu, quienes desde tiempos ancestrales tejen las mochilas más reconocidas de Colombia. Cada patrón cuenta una historia familiar y cada color representa un elemento de la naturaleza.",
    techniques: ["Tejido en crochet", "Telar ancestral", "Tinte natural con plantas"],
    featured: ["Mochila Wayuu", "Chinchorro", "Mantas", "Alpargatas"]
  },
  "Bolívar": {
    specialty: "Filigrana y Cerámica", years: 400,
    history: "Cartagena y el departamento de Bolívar tienen una rica tradición artesanal heredada de las culturas indígenas Zenú y la influencia africana y española.",
    techniques: ["Filigrana en oro", "Talla en totumo", "Tejido en palma"],
    featured: ["Joyería en filigrana", "Sombreros vueltiao", "Maracas decorativas", "Cerámica Zenú"]
  },
  "Antioquia": {
    specialty: "Orfebrería y Textiles", years: 350,
    history: "Antioquia es cuna de la orfebrería precolombina y de una fuerte tradición textil.",
    techniques: ["Orfebrería", "Tejido en lana", "Bordado", "Cerámica"],
    featured: ["Joyería en oro", "Ruanas", "Mantas", "Cerámica decorativa"]
  },
  "Nariño": {
    specialty: "Barniz de Pasto y Chaquiras", years: 600,
    history: "Nariño alberga una de las técnicas más únicas del mundo: el barniz de Pasto o mopa-mopa, reconocido por la UNESCO.",
    techniques: ["Barniz de Pasto (mopa-mopa)", "Bordado en chaquiras", "Miniaturas en tamo", "Cerámica negra"],
    featured: ["Objetos con barniz de Pasto", "Bolsos en chaquiras", "Miniaturas", "Máscaras de carnaval"]
  },
  "Boyacá": {
    specialty: "Ruanas y Cerámica Raquira", years: 450,
    history: "Boyacá es conocida como la tierra de la ruana. Ráquira es el pueblo artesanal más famoso del país.",
    techniques: ["Tejido de ruana", "Cerámica en torno", "Tejido en fique", "Bordado"],
    featured: ["Ruanas", "Cerámica de Ráquira", "Canastos en fique", "Alpargatas"]
  },
  "Valle del Cauca": {
    specialty: "Cestería y Madera", years: 300,
    history: "El Valle del Cauca combina influencias indígenas, afrocolombianas y mestizas en su artesanía.",
    techniques: ["Cestería en guadua", "Talla en madera", "Tejido artesanal", "Trabajo en barro"],
    featured: ["Canastos en guadua", "Figuras talladas", "Sombreros", "Muebles artesanales"]
  },
  "Cauca": {
    specialty: "Tejidos Nasa y Misak", years: 700,
    history: "El Cauca es territorio de los pueblos Nasa y Misak, quienes conservan técnicas ancestrales de tejido.",
    techniques: ["Tejido en telar de cintura", "Tinte con plantas naturales", "Platería", "Talla en madera"],
    featured: ["Cobijas Misak", "Joyería en plata", "Mochilas Nasa", "Figuras en arcilla"]
  },
  "Chocó": {
    specialty: "Cestería y Tagua", years: 400,
    history: "El Chocó tiene una riquísima tradición artesanal afrocolombiana e indígena.",
    techniques: ["Talla en tagua", "Cestería en werregue", "Joyería en oro del Pacífico", "Talla en madera"],
    featured: ["Figuras en tagua", "Canastos en werregue", "Collares Emberá", "Máscaras"]
  },
  "Santander": {
    specialty: "Ruana y Talla en Madera", years: 380,
    history: "Barichara es el pueblo artesano por excelencia, con sus tallados en roca y trabajos en fique.",
    techniques: ["Tejido en caña flecha", "Talla en piedra", "Trabajo en fique", "Cerámica"],
    featured: ["Ruanas", "Sombreros en caña flecha", "Esculturas en piedra", "Bolsos en fique"]
  },
  "Meta": {
    specialty: "Artesanías Llaneras", years: 250,
    history: "Los Llanos Orientales tienen una artesanía ligada a la cultura llanera.",
    techniques: ["Trabajo en cuero", "Lutería artesanal", "Tejido indígena", "Talla en madera"],
    featured: ["Instrumentos llaneros", "Sillas de montar", "Tejidos Sikuani", "Hamacas"]
  }
}

const DEFAULT_DATA = {
  specialty: "Artesanías tradicionales", years: 200,
  history: "Este departamento tiene una rica tradición artesanal que refleja la diversidad cultural de Colombia.",
  techniques: ["Tejido artesanal", "Cerámica", "Talla en madera"],
  featured: ["Artesanías típicas", "Tejidos", "Cerámica"]
}

const DEPTS = [
  { id: "laguajira", name: "La Guajira", d: "M195 20 L230 15 L255 30 L250 55 L235 65 L210 60 L200 45 Z" },
  { id: "magdalena", name: "Magdalena", d: "M170 30 L195 20 L210 60 L200 80 L185 90 L165 80 L160 60 Z" },
  { id: "atlantico", name: "Atlántico", d: "M155 45 L170 30 L160 60 L150 65 L145 55 Z" },
  { id: "bolivar", name: "Bolívar", d: "M140 60 L155 45 L150 65 L165 80 L185 90 L180 115 L160 125 L140 115 L130 95 L132 75 Z" },
  { id: "cesar", name: "Cesar", d: "M200 45 L235 65 L240 90 L225 105 L205 100 L200 80 L210 60 Z" },
  { id: "nortesantander", name: "Norte de Santander", d: "M205 100 L225 105 L235 125 L220 145 L200 140 L195 120 Z" },
  { id: "sucre", name: "Sucre", d: "M130 75 L140 60 L155 45 L145 55 L135 70 Z" },
  { id: "cordoba", name: "Córdoba", d: "M115 80 L132 75 L140 115 L130 130 L110 125 L105 105 Z" },
  { id: "antioquia", name: "Antioquia", d: "M105 105 L130 95 L140 115 L160 125 L165 155 L150 175 L125 180 L100 165 L90 140 L95 118 Z" },
  { id: "choco", name: "Chocó", d: "M75 120 L95 118 L90 140 L100 165 L85 185 L65 175 L60 150 L70 130 Z" },
  { id: "santander", name: "Santander", d: "M160 125 L180 115 L195 120 L200 140 L190 165 L170 170 L155 155 L165 135 Z" },
  { id: "boyaca", name: "Boyacá", d: "M170 145 L200 140 L210 160 L205 185 L185 195 L165 185 L160 165 Z" },
  { id: "cundinamarca", name: "Cundinamarca", d: "M165 185 L185 195 L190 215 L175 225 L155 215 L150 195 Z" },
  { id: "caldas", name: "Caldas", d: "M125 180 L150 175 L155 195 L140 205 L120 200 Z" },
  { id: "risaralda", name: "Risaralda", d: "M110 190 L125 180 L120 200 L108 205 Z" },
  { id: "quindio", name: "Quindío", d: "M108 205 L120 200 L118 215 L106 215 Z" },
  { id: "tolima", name: "Tolima", d: "M140 200 L155 195 L150 215 L155 235 L140 245 L120 235 L115 215 L120 205 Z" },
  { id: "valle", name: "Valle del Cauca", d: "M85 210 L108 205 L106 215 L115 235 L105 250 L80 245 L75 225 Z" },
  { id: "cauca", name: "Cauca", d: "M80 245 L105 250 L110 270 L100 290 L78 280 L70 260 Z" },
  { id: "narino", name: "Nariño", d: "M70 280 L100 285 L105 305 L85 320 L60 310 L58 290 Z" },
  { id: "huila", name: "Huila", d: "M150 235 L155 215 L175 225 L180 250 L165 265 L145 255 Z" },
  { id: "meta", name: "Meta", d: "M185 195 L215 195 L225 225 L215 260 L185 265 L170 250 L175 225 L190 215 Z" },
  { id: "caqueta", name: "Caquetá", d: "M145 260 L165 265 L175 290 L160 320 L135 315 L125 290 L130 265 Z" },
  { id: "putumayo", name: "Putumayo", d: "M100 300 L125 295 L130 320 L115 335 L90 325 L88 310 Z" },
  { id: "vaupes", name: "Vaupés", d: "M215 265 L255 265 L265 305 L240 325 L210 320 L200 295 Z" },
  { id: "amazonas", name: "Amazonas", d: "M135 320 L165 325 L175 360 L150 380 L115 370 L110 345 Z" },
  { id: "guainia", name: "Guainía", d: "M255 265 L295 255 L300 290 L270 310 L245 305 L265 305 Z" },
  { id: "vichada", name: "Vichada", d: "M225 195 L275 185 L295 210 L295 255 L255 265 L225 225 Z" },
  { id: "casanare", name: "Casanare", d: "M210 160 L240 155 L255 175 L245 195 L225 195 L215 195 L205 185 Z" },
  { id: "arauca", name: "Arauca", d: "M210 135 L240 130 L255 145 L255 165 L240 155 L210 160 L205 145 Z" },
  { id: "guaviare", name: "Guaviare", d: "M185 265 L215 265 L220 295 L200 310 L175 295 L170 275 Z" },
]

export default function Regions() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [allArtisans, setAllArtisans] = useState([])
  const [artisanCount, setArtisanCount] = useState({})
  const [productCount, setProductCount] = useState({})
  const [loadingCounts, setLoadingCounts] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    api.get('/artisans/').then(res => {
      const artisans = res.data
      setAllArtisans(artisans)
      const counts = {}
      artisans.forEach(a => {
        if (a.region) counts[a.region] = (counts[a.region] || 0) + 1
      })
      setArtisanCount(counts)
    }).catch(() => {})

    const loadProductCounts = async () => {
      setLoadingCounts(true)
      const counts = {}
      await Promise.all(
        DEPTS.map(async dept => {
          try {
            const res = await api.get(`/products/?region=${encodeURIComponent(dept.name)}`)
            counts[dept.name] = res.data.length
          } catch {
            counts[dept.name] = 0
          }
        })
      )
      setProductCount(counts)
      setLoadingCounts(false)
    }
    loadProductCounts()
  }, [])

  const data = selected ? (REGIONS_DATA[selected] || DEFAULT_DATA) : null
  const regionArtisans = allArtisans.filter(a =>
    a.region?.toLowerCase() === selected?.toLowerCase()
  )

  return (
    <div style={{ ...s.page, padding: isMobile ? '24px 16px' : '56px', colorScheme: 'light' }}>
      <h1 style={s.title}>Regiones artesanales</h1>
      <div style={s.titleBar} />
      <p style={s.sub}>Explora la riqueza artesanal de cada departamento de Colombia</p>

      <div style={{ ...s.layout, flexDirection: isMobile ? 'column' : 'row' }}>
        {/* ── MAPA ── */}
        <div style={{ ...s.mapContainer, width: isMobile ? '100%' : 'auto' }}>
          <p style={s.mapHint}>Toca un departamento</p>
          <svg viewBox="0 0 340 480" style={{
            ...s.svg,
            width: isMobile ? '100%' : '320px',
            height: isMobile ? 'auto' : '480px',
          }}>
            {DEPTS.map(dept => (
              <g key={dept.id} onClick={() => setSelected(dept.name)} style={{ cursor: 'pointer' }}>
                <path
                  d={dept.d}
                  style={{
                    fill: selected === dept.name ? GOLD : BEIGE,
                    stroke: selected === dept.name ? '#b8860b' : '#fff',
                    strokeWidth: selected === dept.name ? 2 : 0.8,
                    opacity: selected && selected !== dept.name ? 0.5 : 1,
                    transition: 'all 0.15s',
                  }}
                />
              </g>
            ))}
            <g onClick={() => setSelected('Bogotá D.C.')} style={{ cursor: 'pointer' }}>
              <circle cx="172" cy="210" r="8"
                style={{ fill: selected === 'Bogotá D.C.' ? GOLD : '#8b6b4a', transition: 'all 0.15s' }}
              />
              <text x="172" y="213" fontSize="6" fill="#fff" textAnchor="middle" pointerEvents="none">BOG</text>
            </g>
          </svg>
        </div>

        {/* ── PANEL ── */}
        <div style={{ ...s.panel, minHeight: isMobile ? 'auto' : '520px' }}>
          {!selected ? (
            <div style={{ ...s.emptyPanel, height: isMobile ? '120px' : '400px' }}>
              <p style={s.emptySub}>Selecciona un departamento para descubrir su artesanía</p>
            </div>
          ) : (
            <div>
              <div style={s.panelHeader}>
                <div>
                  <p style={s.panelSpecialty}>{data.specialty}</p>
                  <h2 style={{ ...s.panelTitle, fontSize: isMobile ? '1.4rem' : '1.8rem' }}>{selected}</h2>
                  <div style={s.panelBar} />
                </div>
                <button style={s.closeBtn} onClick={() => setSelected(null)}>×</button>
              </div>

              <div style={{ ...s.statsGrid, gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div style={s.statCard}>
                  <div style={s.statNum}>{artisanCount[selected] ?? 0}</div>
                  <div style={s.statLabel}>Artesanos</div>
                </div>
                <div style={s.statCard}>
                  <div style={s.statNum}>{loadingCounts ? '...' : (productCount[selected] ?? 0)}</div>
                  <div style={s.statLabel}>Productos</div>
                </div>
                <div style={s.statCard}>
                  <div style={s.statNum}>{data.years}</div>
                  <div style={s.statLabel}>Años</div>
                </div>
              </div>

              <div style={s.sectionLabel}>Historia artesanal</div>
              <p style={s.historyText}>{data.history}</p>

              <div style={s.sectionLabel}>Técnicas tradicionales</div>
              <div style={s.tags}>
                {data.techniques.map(t => <span key={t} style={s.tag}>{t}</span>)}
              </div>

              <div style={s.sectionLabel}>Productos destacados</div>
              <div style={s.tags}>
                {data.featured.map(p => <span key={p} style={s.productTag}>{p}</span>)}
              </div>

              {regionArtisans.length > 0 && (
                <>
                  <div style={s.sectionLabel}>Artesanos de {selected}</div>
                  <div style={s.artisansList}>
                    {regionArtisans.slice(0, 3).map(a => (
                      <div key={a.id} style={s.artisanChip} onClick={() => navigate(`/artisans/${a.id}`)}>
                        <div style={s.artisanAvatar}>{a.username?.[0]?.toUpperCase()}</div>
                        <div>
                          <p style={s.artisanName}>{a.username}</p>
                          <p style={s.artisanSpec}>{a.specialty || 'Artesano'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <button
                style={s.btnCatalog}
                onClick={() => navigate(`/catalog?region=${encodeURIComponent(selected)}`)}>
                Ver productos de esta región →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', background: '#fff', color: '#222' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, margin: '0 0 10px', color: '#1a1a1a' },
  titleBar: { width: '48px', height: '3px', background: GOLD, marginBottom: '12px' },
  sub: { color: '#888', fontSize: '0.95rem', margin: '0 0 32px' },
  layout: { display: 'flex', gap: '40px', alignItems: 'flex-start' },
  mapContainer: { flexShrink: 0, background: '#F6F1E7', borderRadius: '12px', padding: '16px', border: '1px solid #e8e0d0', boxSizing: 'border-box' },
  mapHint: { fontSize: '0.82rem', color: '#aaa', textAlign: 'center', margin: '0 0 8px' },
  svg: { display: 'block' },
  panel: { flex: 1 },
  emptyPanel: { display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
  emptySub: { color: '#aaa', fontSize: '0.9rem', maxWidth: '280px', lineHeight: 1.6, margin: 0 },
  panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  panelSpecialty: { fontSize: '0.78rem', color: BEIGE, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' },
  panelTitle: { fontFamily: "'Playfair Display', serif", fontWeight: 700, margin: '0 0 10px', color: '#1a1a1a' },
  panelBar: { width: '40px', height: '3px', background: GOLD },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#aaa', padding: 0 },
  statsGrid: { display: 'grid', gap: '12px', marginBottom: '24px' },
  statCard: { background: '#F6F1E7', borderRadius: '8px', padding: '14px', textAlign: 'center' },
  statNum: { fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a' },
  statLabel: { fontSize: '0.78rem', color: '#888', marginTop: '4px' },
  sectionLabel: { fontSize: '0.78rem', fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '20px 0 10px' },
  historyText: { fontSize: '0.9rem', color: '#555', lineHeight: 1.8, margin: 0 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' },
  tag: { background: '#F6F1E7', color: '#666', padding: '5px 12px', borderRadius: '20px', fontSize: '0.82rem', border: '1px solid #e8e0d0' },
  productTag: { background: '#fff', color: '#555', padding: '5px 12px', borderRadius: '20px', fontSize: '0.82rem', border: '1px solid #ddd' },
  artisansList: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px' },
  artisanChip: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#F6F1E7', borderRadius: '8px', cursor: 'pointer', border: '1px solid #e8e0d0' },
  artisanAvatar: { width: '36px', height: '36px', borderRadius: '50%', background: BEIGE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#fff', flexShrink: 0 },
  artisanName: { fontSize: '0.88rem', fontWeight: 600, margin: 0, color: '#1a1a1a' },
  artisanSpec: { fontSize: '0.78rem', color: '#888', margin: 0 },
  btnCatalog: { marginTop: '20px', padding: '12px 24px', background: BEIGE, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.95rem', cursor: 'pointer', fontWeight: 600 },
}