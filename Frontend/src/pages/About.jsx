const GOLD = '#d4a017'
const BEIGE = '#c8b99a'

const values = [
  {
    title: 'Tradición',
    desc: 'Respetamos y preservamos las técnicas artesanales transmitidas de generación en generación.',
  },
  {
    title: 'Comunidad',
    desc: 'Apoyamos a los artesanos y fortalecemos los vínculos entre productores y consumidores.',
  },
  {
    title: 'Sostenibilidad',
    desc: 'Promovemos prácticas responsables que valoran los recursos naturales y culturales.',
  },
  {
    title: 'Calidad',
    desc: 'Reconocemos el esfuerzo y la dedicación presentes en cada creación artesanal.',
  },
]

const team = [
  { name: 'Julián David Camargo Padilla', role: 'Desarrollo y diseño' },
  { name: 'León Alejandro Orrego Bello', role: 'Desarrollo y diseño' },
  { name: 'Dago David Palmera Navarro', role: 'Desarrollo y diseño' },
  { name: 'Samir Joseph Otero Quintero', role: 'Desarrollo y diseño' },
]

export default function About() {
  return (
    <div style={s.page}>

      {/* ── HERO ── */}
      <div style={s.hero}>
        <div style={s.heroContent}>
          <h1 style={s.heroTitle}>Sobre nosotros</h1>
          <div style={s.heroBar} />
          <p style={s.heroSub}>
            Artesanos de Colombia nació con el propósito de conectar el talento de los
            artesanos colombianos con personas que valoran el trabajo hecho a mano.
            Creemos que cada pieza artesanal cuenta una historia y representa la riqueza
            cultural de nuestro país.
          </p>
        </div>
      </div>

      {/* ── MISIÓN Y VISIÓN ── */}
      <div style={s.misionGrid}>
        <div style={s.misionCard}>
          <h2 style={s.misionTitle}>Nuestra misión</h2>
          <div style={s.misionBar} />
          <p style={s.misionText}>
            Promover y visibilizar el trabajo de los artesanos colombianos, ofreciendo
            un espacio donde puedan compartir sus productos, sus tradiciones y sus
            historias con el mundo.
          </p>
        </div>
        <div style={{ ...s.misionCard, background: '#F6F1E7' }}>
          <h2 style={s.misionTitle}>Nuestra visión</h2>
          <div style={s.misionBar} />
          <p style={s.misionText}>
            Convertirnos en una plataforma referente para la difusión y comercialización
            de artesanías colombianas, contribuyendo a la preservación de las técnicas
            tradicionales y al desarrollo económico de las comunidades artesanas.
          </p>
        </div>
      </div>

      {/* ── VALORES ── */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Nuestros valores</h2>
        <div style={s.sectionBar} />
        <div style={s.valuesGrid}>
          {values.map((v, i) => (
            <div key={v.title} style={s.valueCard}>
              <div style={s.valueNum}>{String(i + 1).padStart(2, '0')}</div>
              <h3 style={s.valueTitle}>{v.title}</h3>
              <p style={s.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── POR QUÉ APOYAR ── */}
      <div style={s.whySection}>
        <div style={s.whyContent}>
          <h2 style={s.sectionTitle}>Por qué apoyar la artesanía colombiana</h2>
          <div style={{ ...s.sectionBar, margin: '0 0 24px' }} />
          <p style={s.whyText}>
            Al adquirir una artesanía no solo obtienes un producto único; también
            contribuyes a preservar tradiciones culturales, generar oportunidades
            económicas y fortalecer comunidades en distintas regiones del país.
          </p>
          <div style={s.whyStats}>
            <div style={s.whyStat}>
              <div style={s.whyStatNum}>32</div>
              <div style={s.whyStatLabel}>Departamentos representados</div>
            </div>
            <div style={s.whyStat}>
              <div style={s.whyStatNum}>500+</div>
              <div style={s.whyStatLabel}>Artesanos en la plataforma</div>
            </div>
            <div style={s.whyStat}>
              <div style={s.whyStatNum}>100+</div>
              <div style={s.whyStatLabel}>Técnicas tradicionales</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── EQUIPO ── */}
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Nuestro equipo</h2>
        <div style={s.sectionBar} />
        <p style={s.teamIntro}>
          Somos estudiantes y apasionados por la cultura colombiana que creemos en el
          poder de la tecnología para acercar las tradiciones artesanales a más personas.
        </p>
        <p style={s.teamUniv}>
          Universidad de Cartagena · Ingeniería de Sistemas · Comercio Electrónico
        </p>
        <div style={s.teamGrid}>
          {team.map(member => (
            <div key={member.name} style={s.teamCard}>
              <div style={s.teamAvatar}>
                {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <h3 style={s.teamName}>{member.name}</h3>
              <p style={s.teamRole}>{member.role}</p>
            </div>
          ))}
        </div>
        <div style={s.teamFooter}>
          <p style={s.teamDocente}>Docente: <strong>Heybertt Moreno Díaz</strong></p>
        </div>
      </div>

    </div>
  )
}

const s = {
  page: { fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', background: '#fff' },

  hero: { background: '#F6F1E7', padding: '100px 56px' },
  heroContent: { maxWidth: '680px' },
  heroTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
    fontWeight: 700, margin: '0 0 16px', color: '#222', lineHeight: 1.1 },
  heroBar: { width: '56px', height: '4px', background: GOLD, marginBottom: '24px' },
  heroSub: { fontSize: '1.05rem', color: '#555', lineHeight: 1.8, margin: 0 },

  misionGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr' },
  misionCard: { padding: '64px 56px', background: '#fff' },
  misionTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.5rem',
    fontWeight: 700, margin: '0 0 12px', color: '#222' },
  misionBar: { width: '40px', height: '3px', background: GOLD, marginBottom: '20px' },
  misionText: { fontSize: '1rem', color: '#555', lineHeight: 1.8, margin: 0 },

  section: { padding: '72px 56px', borderTop: '1px solid #eee' },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.8rem',
    fontWeight: 700, margin: '0 0 12px', color: '#222' },
  sectionBar: { width: '40px', height: '3px', background: GOLD, marginBottom: '40px' },

  valuesGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' },
  valueCard: { padding: '32px 24px', background: '#F6F1E7', borderRadius: '12px' },
  valueNum: { fontSize: '2rem', fontWeight: 700, color: '#e8e0d0',
    fontFamily: "'Playfair Display', serif", marginBottom: '12px' },
  valueTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.1rem',
    fontWeight: 700, margin: '0 0 10px', color: '#222' },
  valueDesc: { fontSize: '0.88rem', color: '#666', lineHeight: 1.7, margin: 0 },

  whySection: { padding: '72px 56px', background: '#1a1a1a', borderTop: '1px solid #eee' },
  whyContent: { maxWidth: '800px' },
  whyText: { fontSize: '1.05rem', color: '#aaa', lineHeight: 1.8, margin: '0 0 48px' },
  whyStats: { display: 'flex', gap: '56px' },
  whyStat: {},
  whyStatNum: { fontFamily: "'Playfair Display', serif", fontSize: '2.8rem',
    fontWeight: 700, color: '#fff', lineHeight: 1 },
  whyStatLabel: { fontSize: '0.85rem', color: '#888', marginTop: '6px' },

  teamIntro: { fontSize: '1rem', color: '#555', lineHeight: 1.8, maxWidth: '640px', margin: '0 0 8px' },
  teamUniv: { fontSize: '0.85rem', color: '#aaa', margin: '0 0 40px',
    fontStyle: 'italic' },
  teamGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' },
  teamCard: { textAlign: 'center', padding: '28px 16px', background: '#F6F1E7',
    borderRadius: '12px' },
  teamAvatar: { width: '64px', height: '64px', borderRadius: '50%', background: BEIGE,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.3rem', fontWeight: 700, color: '#fff',
    margin: '0 auto 16px' },
  teamName: { fontFamily: "'Playfair Display', serif", fontSize: '0.95rem',
    fontWeight: 700, margin: '0 0 6px', color: '#222', lineHeight: 1.3 },
  teamRole: { fontSize: '0.78rem', color: '#aaa', margin: 0, textTransform: 'uppercase',
    letterSpacing: '0.05em' },
  teamFooter: { borderTop: '1px solid #eee', paddingTop: '24px' },
  teamDocente: { fontSize: '0.9rem', color: '#888', margin: 0 },
}