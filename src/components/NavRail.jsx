import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

function NavRail() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState(location.search)

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

  function capitalise(str) {
    if (!str) return null
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <nav className="nav-rail">
      <div className="nav-logo" onClick={() => navigate('/')}>
        <span className="nav-logo-mark">&gt;_</span>
      </div>
      <div className="nav-links">
        <span
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          Home
        </span>
        <span
          className={`nav-link ${location.pathname === '/progress' ? 'active' : ''}`}
          onClick={() => navigate('/progress')}
        >
          Progress
        </span>
        <span
          className={`nav-link ${location.pathname === '/category' ? 'active' : ''}`}
          onClick={() => navigate('/category')}
        >
          Categories
          {category && <span className="nav-meta">{capitalise(category)}</span>}
        </span>
        {category && (
          <span
            className={`nav-link ${location.pathname === '/modes' ? 'active' : ''}`}
            onClick={() => navigate(`/modes?category=${category}`)}
          >
            Mode
            {mode && <span className="nav-meta">{capitalise(mode)}</span>}
          </span>
        )}
        {mode && category && (
          <span className="nav-link active">
            Drill
            {(current && total && location.pathname.includes('/drill')) || location.pathname.includes('/onwards') ? (
              <span className="nav-meta">
                {complete === 'true' || location.pathname.includes('/onwards') ? 'Completed' : `In progress (${current}/${total})`}
              </span>
            ) : null}
          </span>
        )}
        <span
          className={`nav-link ${location.pathname === '/library' ? 'active' : ''}`}
          onClick={() => navigate('/library')}
        >
          Library
        </span>
        <span
          className={`nav-link ${location.pathname === '/accessibility' ? 'active' : ''}`}
          onClick={() => navigate('/accessibility')}
        >
          Accessibility
        </span>
        <span
          className={`nav-link ${location.pathname === '/focus' ? 'active' : ''}`}
          onClick={() => navigate('/focus')}
        >
          Focus List
        </span>
      </div>
    </nav>
  )
}

export default NavRail