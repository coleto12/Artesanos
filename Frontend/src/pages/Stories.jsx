import { useState } from 'react'

const STORIES = [
  { id: 1, title: "El tejedor de San Jacinto", region: "Bolívar", craft: "Tejido", artisan: "José", content: "Desde niño, José observaba a su abuela tejer en un viejo telar de madera. Hoy, más de 30 años después, cada hamaca que crea lleva los colores y las tradiciones de San Jacinto, Bolívar." },
  { id: 2, title: "Hilos del desierto", region: "La Guajira", craft: "Tejido wayuu", artisan: "Ana", content: "En La Guajira, Ana aprendió a tejer mochilas wayuu junto a su madre. Cada figura representa historias, sueños y símbolos transmitidos por generaciones." },
  { id: 3, title: "La filigrana de Mompox", region: "Bolívar", craft: "Joyería", artisan: "Pedro", content: "Pedro dedica horas a entrelazar finísimos hilos de plata. Su trabajo mantiene viva una técnica artesanal que convirtió a Mompox en un referente mundial de la joyería artesanal." },
  { id: 4, title: "El sombrero que cuenta historias", region: "Córdoba", craft: "Sombrero vueltiao", artisan: "Manuel", content: "En Córdoba, Manuel fabrica sombreros vueltiaos siguiendo métodos ancestrales. Cada pieza puede tardar semanas en completarse y refleja la identidad cultural de toda una región." },
  { id: 5, title: "Manos de barro", region: "Boyacá", craft: "Cerámica", artisan: "Rosa", content: "Rosa transforma el barro en vasijas decorativas. Desde su taller familiar, mantiene una tradición que ha acompañado a su comunidad durante más de un siglo." },
  { id: 6, title: "Colores de la selva", region: "Amazonas", craft: "Tintes naturales", artisan: "Comunidad", content: "En el Amazonas, los artesanos utilizan tintes naturales obtenidos de plantas y semillas para crear piezas llenas de color y significado cultural." },
  { id: 7, title: "El arte del totumo", region: "Costa Caribe", craft: "Talla", artisan: "Carlos", content: "Carlos descubrió que un simple fruto podía convertirse en una obra de arte. Hoy talla y decora totumos que son admirados dentro y fuera de Colombia." },
  { id: 8, title: "La fuerza de una tradición", region: "Nariño", craft: "Tejido", artisan: "María", content: "María comenzó a tejer para ayudar a su familia. Lo que inició como una necesidad se convirtió en una empresa artesanal que genera empleo para otras mujeres de su comunidad." },
  { id: 9, title: "Entre agujas y sueños", region: "Antioquia", craft: "Bordado", artisan: "Elena", content: "Cada bordado de Elena toma varios días de trabajo. Sus diseños representan flores, aves y paisajes inspirados en los recuerdos de su infancia." },
  { id: 10, title: "El constructor de instrumentos", region: "Montañas colombianas", craft: "Lutería", artisan: "Ricardo", content: "En las montañas colombianas, Ricardo fabrica gaitas y tambores utilizando materiales tradicionales. Sus instrumentos acompañan festivales y celebraciones en todo el país." },
  { id: 11, title: "Una herencia familiar", region: "Cundinamarca", craft: "Talla en madera", artisan: "Familia Torres", content: "Durante cuatro generaciones, la familia Torres ha trabajado la madera. Sus piezas combinan técnicas ancestrales con diseños contemporáneos." },
  { id: 12, title: "La artesana del río", region: "Magdalena", craft: "Cestería", artisan: "Carmen", content: "A orillas del Magdalena, Carmen recolecta fibras naturales para elaborar canastos resistentes y elegantes que reflejan la vida junto al río." },
  { id: 13, title: "Tejiendo futuro", region: "Colombia", craft: "Tejido", artisan: "Jóvenes artesanos", content: "Un grupo de jóvenes decidió aprender el oficio de sus abuelos. Gracias a ello, una tradición que parecía desaparecer continúa creciendo." },
  { id: 14, title: "La magia del fique", region: "Santander", craft: "Fique", artisan: "Luis", content: "En Santander, Luis transforma fibras de fique en bolsos y accesorios sostenibles que combinan tradición y modernidad." },
  { id: 15, title: "Arte con semillas", region: "Amazonia", craft: "Joyería natural", artisan: "Diana", content: "Utilizando semillas recolectadas en bosques tropicales, Diana crea collares y pulseras únicos que resaltan la biodiversidad colombiana." },
  { id: 16, title: "Voces del Pacífico", region: "Chocó", craft: "Artesanía afrocolombiana", artisan: "Marta", content: "Las artesanías de Marta reflejan la riqueza cultural del Pacífico colombiano. Cada pieza está inspirada en los ritmos, colores y tradiciones de su región." },
  { id: 17, title: "El guardián del telar", region: "Boyacá", craft: "Tejido", artisan: "Andrés", content: "Andrés dedica gran parte de su tiempo a enseñar técnicas tradicionales de tejido a niños y jóvenes para preservar el patrimonio cultural de su comunidad." },
  { id: 18, title: "La historia en cada pieza", region: "Colombia", craft: "Arte mixto", artisan: "Isabel", content: "Para Isabel, cada objeto artesanal tiene un propósito: contar una historia. Sus creaciones combinan símbolos tradicionales con experiencias personales." },
  { id: 19, title: "Del campo al taller", region: "Tolima", craft: "Talla en madera", artisan: "Héctor", content: "Después de las jornadas agrícolas, Héctor dedica sus tardes a tallar madera. Lo que empezó como un pasatiempo hoy es reconocido en ferias artesanales nacionales." },
  { id: 20, title: "El sueño que cruzó fronteras", region: "Colombia", craft: "Artesanía exportada", artisan: "Claudia", content: "Lo que comenzó en un pequeño taller familiar terminó llegando a mercados internacionales. Sin abandonar sus raíces, Claudia demuestra que la artesanía colombiana puede conquistar el mundo." },
]

const pad = (n) => String(n).padStart(2, '0')

export default function Stories() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('')

  const filtered = filter
    ? STORIES.filter(s =>
        s.title.toLowerCase().includes(filter.toLowerCase()) ||
        s.region.toLowerCase().includes(filter.toLowerCase()) ||
        s.craft.toLowerCase().includes(filter.toLowerCase()) ||
        s.artisan.toLowerCase().includes(filter.toLowerCase())
      )
    : STORIES

  return (
    <div style={s.page}>

      {/* ── HERO ── */}
      <div style={s.hero}>
        <p style={s.heroLabel}>Patrimonio cultural</p>
        <h1 style={s.heroTitle}>Historias que tejen Colombia</h1>
        <p style={s.heroSub}>
          Detrás de cada artesanía hay una historia de vida, tradición y amor por el oficio.
          Conoce a los artesanos que mantienen viva la cultura colombiana.
        </p>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}></span>
          <input
            style={s.searchInput}
            placeholder="Buscar por nombre, región u oficio..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* ── HISTORIA DESTACADA ── */}
      {!filter && (
        <div style={s.featured}>
          <div style={s.featContent}>
            <p style={s.featLabel}>Historia destacada</p>
            <p style={s.featRegion}> {STORIES[0].region}</p>
            <h2 style={s.featTitle}>{STORIES[0].title}</h2>
            <span style={s.featCraft}>{STORIES[0].craft}</span>
            <p style={s.featText}>{STORIES[0].content}</p>
            <button style={s.featBtn} onClick={() => setSelected(STORIES[0])}>
              Leer historia →
            </button>
          </div>
          <div style={s.featNum}></div>
        </div>
      )}

      {/* ── SECCIÓN ── */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>
            {filter ? `Resultados para "${filter}"` : 'Todas las historias'}
          </h2>
          <span style={s.count}>{filtered.length} historia{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* ── GRID ── */}
        <div style={s.grid}>
          {filtered.map((story) => (
            <div
              key={story.id}
              style={s.card}
              onClick={() => setSelected(story)}
              onMouseEnter={e => e.currentTarget.style.background = '#f9f7f4'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <p style={s.cardNum}>{pad(story.id)}</p>
              <h3 style={s.cardTitle}>{story.title}</h3>
              <p style={s.cardRegion}>{story.region}</p>
              <p style={s.cardCraft}>{story.craft}</p>
              <p style={s.cardPreview}>{story.content.slice(0, 90)}…</p>
              <span style={s.cardLink}>Leer →</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL ── */}
      {selected && (
        <div style={s.overlay} onClick={() => setSelected(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <button style={s.modalClose} onClick={() => setSelected(null)}>Cerrar</button>
            <p style={s.modalNum}>Historia {pad(selected.id)}</p>
            <h2 style={s.modalTitle}>{selected.title}</h2>
            <div style={s.modalDivider} />
            <div style={s.modalTags}>
              <span style={s.tag}> {selected.region}</span>
              <span style={s.tag}> {selected.craft}</span>
              <span style={s.tag}> {selected.artisan}</span>
            </div>
            <p style={s.modalText}>{selected.content}</p>
            <button style={s.modalBtn} onClick={() => setSelected(null)}>
              Volver a historias
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  page: {
    fontFamily: "'Segoe UI', sans-serif",
    minHeight: '100vh',
    background: '#fff',
  },

  // HERO
  hero: {
    padding: '56px 56px 40px',
    borderBottom: '1px solid #eee',
    marginBottom: '40px',
  },
  heroLabel: {
    fontSize: '11px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#aaa',
    marginBottom: '12px',
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.2rem',
    fontWeight: 600,
    color: '#1a1a1a',
    marginBottom: '12px',
  },
  heroSub: {
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: 1.7,
    maxWidth: '520px',
    marginBottom: '24px',
  },
  searchWrap: {
    position: 'relative',
    maxWidth: '360px',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '14px',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '9px 14px 9px 36px',
    fontSize: '0.9rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    fontFamily: 'inherit',
    color: '#222',
    background: '#fff',
  },

  // FEATURED
  featured: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '2rem',
    alignItems: 'start',
    padding: '32px 40px',
    background: '#f9f7f4',
    borderRadius: '12px',
    border: '1px solid #eee',
    margin: '0 56px 40px',
  },
  featContent: { flex: 1 },
  featLabel: {
    fontSize: '11px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#aaa',
    marginBottom: '8px',
  },
  featRegion: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '8px',
  },
  featTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1a1a1a',
    marginBottom: '10px',
    lineHeight: 1.4,
  },
  featCraft: {
    display: 'inline-block',
    fontSize: '11px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '3px 10px',
    borderRadius: '6px',
    background: '#fff',
    border: '1px solid #ddd',
    color: '#666',
    marginBottom: '14px',
  },
  featText: {
    fontSize: '0.9rem',
    color: '#555',
    lineHeight: 1.75,
    marginBottom: '20px',
  },
  featBtn: {
    fontSize: '13px',
    color: '#1a1a1a',
    border: '1px solid #ccc',
    background: 'none',
    padding: '8px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  featNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '56px',
    fontWeight: 600,
    color: '#e0dcd6',
    lineHeight: 1,
    paddingTop: '8px',
    userSelect: 'none',
  },

  // SECTION
  section: { padding: '0 56px 64px' },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  count: { fontSize: '13px', color: '#aaa' },

  // GRID
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    border: '1px solid #eee',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  card: {
    padding: '20px',
    background: '#fff',
    cursor: 'pointer',
    borderRight: '1px solid #eee',
    borderBottom: '1px solid #eee',
    transition: 'background 0.15s',
  },
  cardNum: {
    fontSize: '11px',
    color: '#bbb',
    marginBottom: '8px',
    fontVariantNumeric: 'tabular-nums',
  },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#1a1a1a',
    lineHeight: 1.4,
    marginBottom: '6px',
  },
  cardRegion: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '4px',
  },
  cardCraft: {
    fontSize: '11px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: '12px',
  },
  cardPreview: {
    fontSize: '13px',
    color: '#666',
    lineHeight: 1.6,
    marginBottom: '12px',
  },
  cardLink: {
    fontSize: '12px',
    color: '#1a1a1a',
  },

  // MODAL
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  modal: {
    background: '#fff',
    borderRadius: '14px',
    border: '1px solid #eee',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    position: 'relative',
    maxHeight: '85vh',
    overflowY: 'auto',
  },
  modalClose: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '4px 12px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#888',
    fontFamily: 'inherit',
  },
  modalNum: {
    fontSize: '11px',
    color: '#aaa',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  modalTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#1a1a1a',
    marginBottom: '16px',
    lineHeight: 1.4,
  },
  modalDivider: {
    height: '1px',
    background: '#eee',
    marginBottom: '16px',
  },
  modalTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '20px',
  },
  tag: {
    fontSize: '12px',
    padding: '4px 12px',
    borderRadius: '6px',
    border: '1px solid #eee',
    color: '#666',
    background: '#f9f7f4',
  },
  modalText: {
    fontSize: '0.95rem',
    color: '#555',
    lineHeight: 1.8,
    marginBottom: '24px',
  },
  modalBtn: {
    fontSize: '13px',
    border: '1px solid #ccc',
    background: 'none',
    padding: '8px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#1a1a1a',
    fontFamily: 'inherit',
  },
}