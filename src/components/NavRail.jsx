import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

function NavRail() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState(location.search)
  const navRef = useRef(null)
  const [focusedIndex, setFocusedIndex] = useState(null)

  useEffect(() => {
    if (!location.pathname.includes('/drill')) {
      setSearch(location.search)
    }
    function handleLocationChange() {
      setSearch(window.location.search)
    }
    window.addEventListener('locationchange', handleLocationChange)
    return () => window.removeEventListener('locationchange', handleLocationChange)
  }, [location])

  const params = new URLSearchParams(search)
  const mode = params.get('mode')
  const category = params.get('category')
  const current = params.get('current')
  const total = params.get('total')
  const complete = params.get('complete')
  const showCategory = category && ['/modes', '/drill', '/onwards'].includes(location.pathname)
  const showMode = mode && ['/drill', '/onwards'].includes(location.pathname)

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Progress', path: '/progress' },
    { label: 'Categories', path: '/category' },
    ...(category ? [{ label: 'Mode', path: `/modes?category=${category}` }] : []),
    { label: 'Library', path: '/library' },
    { label: 'Focus List', path: '/focus' },
    { label: 'Keyboard', path: '/accessibility' },
  ]

  function dismissNav() {
    setFocusedIndex(null)
    if (document.activeElement) {
      document.activeElement.blur()
    }
  }

  useEffect(() => {
    function handleGlobalKeyDown(e) {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault()
        if (focusedIndex !== null) {
          dismissNav()
        } else {
          setFocusedIndex(0)
          const firstLink = navRef.current?.querySelector('[data-nav-link]')
          if (firstLink) firstLink.focus()
        }
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [focusedIndex])

  function handleNavKeyDown(e, index) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      e.stopPropagation()
      const next = Math.min(index + 1, navItems.length - 1)
      setFocusedIndex(next)
      const links = navRef.current?.querySelectorAll('[data-nav-link]')
      if (links?.[next]) links[next].focus()
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      e.stopPropagation()
      const prev = Math.max(index - 1, 0)
      setFocusedIndex(prev)
      const links = navRef.current?.querySelectorAll('[data-nav-link]')
      if (links?.[prev]) links[prev].focus()
    }
    if (e.key === 'Enter') {
      e.stopPropagation()
      navigate(navItems[index].path)
      dismissNav()
    }
    if (e.key === 'Escape') {
      e.stopPropagation()
      dismissNav()
    }
  }

  function capitalise(str) {
    if (!str) return null
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <nav className="nav-rail" ref={navRef}>
      <div className="nav-logo" onClick={() => navigate('/')}>
        <span className="nav-logo-mark">&gt;_</span>
      </div>
      <div className="nav-links">
        {navItems.map((item, index) => (
          <span
            key={item.path}
            data-nav-link
            tabIndex={focusedIndex !== null ? 0 : -1}
            className={`nav-link ${location.pathname === item.path.split('?')[0] ? 'active' : ''} ${focusedIndex === index ? 'keyboard-focused' : ''}`}
            onClick={() => navigate(item.path)}
            onKeyDown={(e) => handleNavKeyDown(e, index)}
          >
            {item.label}
            {item.label === 'Categories' && category && ['/modes', '/drill', '/onwards'].includes(location.pathname) && (
              <span className="nav-meta">{capitalise(category)}</span>
            )}
            {item.label === 'Mode' && mode && ['/drill', '/onwards'].includes(location.pathname) && (
              <span className="nav-meta">{capitalise(mode)}</span>
            )}
          </span>
        ))}
        {mode && category && ['/drill', '/onwards'].includes(location.pathname) && (
          <span className="nav-link active">
            Drill
            {(current && total && location.pathname.includes('/drill')) || location.pathname.includes('/onwards') ? (
              <span className="nav-meta">
                {complete === 'true' || location.pathname.includes('/onwards') ? 'Completed' : `In progress (${current}/${total})`}
              </span>
            ) : null}
          </span>
        )}
      </div>
      {focusedIndex !== null
        ? <p className="nav-hint">↑↓ · ↵ · Esc</p>
        : <p className="nav-hint">/ — nav</p>
      }
    </nav>
  )
}

export default NavRail