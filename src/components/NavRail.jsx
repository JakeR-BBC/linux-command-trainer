import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

function NavRail() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState(location.search)
  const [focusedIndex, setFocusedIndex] = useState(null)
  const navRef = useRef(null)

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

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Progress', path: '/progress' },
    { label: 'Categories', path: '/category' },
    ...(category && ['/modes', '/drill', '/onwards'].includes(location.pathname)
      ? [{ label: 'Mode', path: `/modes?category=${category}` }]
      : []),
    { label: 'Library', path: '/library' },
    { label: 'Accessibility', path: '/accessibility' },
    { label: 'Focus List', path: '/focus' },
  ]

  function activate() {
    setFocusedIndex(0)
    document.body.classList.add('nav-focused')
    navRef.current?.focus()
  }

  function deactivate() {
    setFocusedIndex(null)
    document.body.classList.remove('nav-focused')
  }

  useEffect(() => {
    function handleGlobalKeyDown(e) {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault()
        if (focusedIndex !== null) {
          deactivate()
        } else {
          activate()
        }
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [focusedIndex])

  function handleNavKeyDown(e) {
    if (focusedIndex === null) return
    e.preventDefault()
    e.stopPropagation()

    if (e.key === 'ArrowDown') {
      setFocusedIndex(prev => Math.min(prev + 1, navItems.length - 1))
    }
    if (e.key === 'ArrowUp') {
      setFocusedIndex(prev => Math.max(prev - 1, 0))
    }
    if (e.key === 'Enter') {
      navigate(navItems[focusedIndex].path)
      deactivate()
    }
    if (e.key === 'Escape' || e.key === '/') {
      deactivate()
    }
  }

  function capitalise(str) {
    if (!str) return null
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const showCategory = category && ['/modes', '/drill', '/onwards'].includes(location.pathname)
  const showMode = mode && ['/drill', '/onwards'].includes(location.pathname)

  return (
    <nav
      className="nav-rail"
      ref={navRef}
      tabIndex={-1}
      style={{ outline: 'none' }}
      onKeyDown={handleNavKeyDown}
    >
      <div className="nav-logo" onClick={() => navigate('/')}>
        <span className="nav-logo-mark">&gt;_</span>
      </div>
      <div className="nav-links">
        {navItems.map((item, index) => (
          <span
            key={item.path}
            className={`nav-link ${location.pathname === item.path.split('?')[0] ? 'active' : ''} ${focusedIndex === index ? 'keyboard-focused' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
            {item.label === 'Categories' && showCategory && (
              <span className="nav-meta">{capitalise(category)}</span>
            )}
            {item.label === 'Mode' && showMode && (
              <span className="nav-meta">{capitalise(mode)}</span>
            )}
          </span>
        ))}
        {showMode && category && (
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