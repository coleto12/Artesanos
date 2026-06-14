import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const GOLD = '#d4a017'
const BEIGE = '#c8b99a'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
      setSearchOpen(false)
      setSearchInput('')
      setMenuOpen(false)
    }
  }

  const navLinks = [
    { to: '/',         label: 'Inicio' },
    { to: '/artisans', label: 'Artesanos' },
    { to: '/catalog',  label: 'Productos' },
    { to: '/regions',  label: 'Regiones' },
    { to: '/stories',  label: 'Historias' },
    { to: '/about',    label: 'Sobre nosotros' },
  ]

  return (
    <>
      <nav style={s.nav}>
        {/* Logo */}
        <Link to="/" style={s.brand}>
          <div style={s.logoIcon}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="4" fill="#2d6a4f" opacity="0.1"/>
              <path d="M8 12 L16 8 L24 12 L24 20 L16 24 L8 20 Z" stroke="#2d6a4f" strokeWidth="1.5" fill="none"/>
              <path d="M12 14 L16 12 L20 14 L20 18 L16 20 L12 18 Z" fill="#2d6a4f" opacity="0.4"/>
            </svg>
          </div>
          <div>
            <div style={s.logoName}>Artesanos</div>
            <div style={s.logoSub}>DE COLOMBIA</div>
          </div>
        </Link>

        {/* Links centrales — solo desktop */}
        {!isMobile && (
          <div style={s.links}>
            {navLinks.map(({ to, label }) => {
              const active = location.pathname === to
              return (
                <Link key={to} to={to} style={{ ...s.link, ...(active ? s.linkActive : {}) }}>
                  {label}
                  {active && <div style={s.linkUnderline} />}
                </Link>
              )
            })}
          </div>
        )}

        {/* Acciones derecha */}
        <div style={s.actions}>
          {/* Búsqueda */}
          <div style={{ position: 'relative' }}>
            <button style={s.iconBtn} onClick={() => setSearchOpen(!searchOpen)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            {searchOpen && (
              <form onSubmit={handleSearch} style={{
                ...s.searchDropdown,
                right: isMobile ? '-80px' : '0',
                width: isMobile ? '260px' : '300px',
              }}>
                <input
                  autoFocus
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Buscar..."
                  style={s.searchDropdownInput}
                />
                <button type="submit" style={s.searchDropdownBtn}>→</button>
              </form>
            )}
          </div>

          {/* Favoritos */}
          <Link to="/wishlist" style={s.iconBtn} title="Favoritos">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </Link>

          {/* Carrito */}
          <Link to="/cart" style={s.iconBtn} title="Carrito">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </Link>

          {/* Desktop: usuario */}
          {!isMobile && (
            <>
              {user ? (
                <>
                  <span style={s.username}>Hola, {user.username}</span>
                  <Link to="/profile" style={s.link}>Mi perfil</Link>
                  {user.role === 'artesano' && (
                    <Link to="/my-products" style={s.link}>Mis productos</Link>
                  )}
                  <Link to="/orders" style={s.link}>Mis pedidos</Link>
                  <button onClick={handleLogout} style={s.outlineBtn}>Salir</button>
                </>
              ) : (
                <>
                  <Link to="/login" style={s.link}>Iniciar sesión</Link>
                  <Link to="/register" style={s.registerBtn}>Registrarse</Link>
                </>
              )}
            </>
          )}

          {/* Hamburguesa — solo móvil */}
          {isMobile && (
            <button style={s.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          )}
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      {isMobile && menuOpen && (
        <div style={s.mobileMenu}>
          {navLinks.map(({ to, label }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                style={{ ...s.mobileLink, ...(active ? s.mobileLinkActive : {}) }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            )
          })}

          <div style={s.mobileDivider} />

          {user ? (
            <>
              <span style={s.mobileUser}>Hola, {user.username}</span>
              <Link to="/profile" style={s.mobileLink} onClick={() => setMenuOpen(false)}>Mi perfil</Link>
              {user.role === 'artesano' && (
                <Link to="/my-products" style={s.mobileLink} onClick={() => setMenuOpen(false)}>Mis productos</Link>
              )}
              <Link to="/orders" style={s.mobileLink} onClick={() => setMenuOpen(false)}>Mis pedidos</Link>
              <button onClick={handleLogout} style={s.mobileLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" style={s.mobileLink} onClick={() => setMenuOpen(false)}>Iniciar sesión</Link>
              <Link to="/register" style={{ ...s.mobileLink, color: BEIGE, fontWeight: 600 }} onClick={() => setMenuOpen(false)}>Registrarse</Link>
            </>
          )}
        </div>
      )}
    </>
  )
}

const s = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px', height: '64px', background: '#fff',
    borderBottom: '1px solid #eee', position: 'sticky', top: 0,
    zIndex: 100, boxSizing: 'border-box', width: '100%',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: '10px',
    textDecoration: 'none', color: '#222', flexShrink: 0,
  },
  logoIcon: { flexShrink: 0 },
  logoName: {
    fontSize: '1rem', fontWeight: 700, color: '#222',
    fontFamily: "'Segoe UI', sans-serif", lineHeight: 1,
  },
  logoSub: {
    fontSize: '0.5rem', letterSpacing: '0.15em',
    color: '#888', lineHeight: 1, marginTop: '2px',
  },
  links: { display: 'flex', alignItems: 'center', gap: '28px' },
  link: {
    color: '#333', textDecoration: 'none', fontSize: '0.88rem',
    position: 'relative', paddingBottom: '4px', fontFamily: "'Segoe UI', sans-serif",
  },
  linkActive: { color: '#222', fontWeight: 600 },
  linkUnderline: {
    position: 'absolute', bottom: '-4px', left: 0,
    width: '100%', height: '2px', background: GOLD, borderRadius: '2px',
  },
  actions: { display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 },
  iconBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    textDecoration: 'none', padding: '4px',
  },
  username: { color: '#555', fontSize: '0.85rem' },
  outlineBtn: {
    background: 'transparent', border: '1px solid #ccc',
    color: '#333', padding: '6px 14px', borderRadius: '6px',
    cursor: 'pointer', fontSize: '0.88rem',
  },
  registerBtn: {
    color: '#333', textDecoration: 'none',
    fontSize: '0.88rem', fontFamily: "'Segoe UI', sans-serif",
  },
  hamburger: {
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', padding: '4px',
  },
  searchDropdown: {
    position: 'absolute', top: '40px',
    background: '#fff', border: '1px solid #eee', borderRadius: '8px',
    padding: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    display: 'flex', gap: '6px', zIndex: 200,
  },
  searchDropdownInput: {
    flex: 1, padding: '8px 12px', border: '1px solid #ddd',
    borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
  },
  searchDropdownBtn: {
    padding: '8px 14px', background: BEIGE, color: '#fff',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem',
  },

  // Menú móvil
  mobileMenu: {
    position: 'fixed', top: '64px', left: 0, right: 0,
    background: '#fff', borderBottom: '1px solid #eee',
    zIndex: 99, display: 'flex', flexDirection: 'column',
    padding: '16px 24px 24px', gap: '4px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  mobileLink: {
    color: '#333', textDecoration: 'none', fontSize: '1rem',
    padding: '12px 0', borderBottom: '1px solid #f5f5f5',
    fontFamily: "'Segoe UI', sans-serif",
  },
  mobileLinkActive: {
    color: BEIGE, fontWeight: 600,
  },
  mobileDivider: {
    height: '1px', background: '#eee', margin: '8px 0',
  },
  mobileUser: {
    color: '#888', fontSize: '0.85rem', padding: '8px 0',
  },
  mobileLogout: {
    background: 'none', border: '1px solid #ddd', color: '#555',
    padding: '10px 0', borderRadius: '6px', cursor: 'pointer',
    fontSize: '0.95rem', marginTop: '8px', width: '100%',
    fontFamily: "'Segoe UI', sans-serif",
  },
}