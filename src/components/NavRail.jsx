import { useNavigate, useLocation } from 'react-router-dom'

function NavRail() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const mode = params.get('mode')
  const category = params.get('category')

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
          className={`nav-link ${!mode && !category ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          Mode
          {mode && <span className="nav-meta">{capitalise(mode)}</span>}
        </span>
        {mode && (
          <span
            className={`nav-link ${mode && !category ? 'active' : ''}`}
            onClick={() => navigate(`/category?mode=${mode}`)}
          >
            Category
            {category && <span className="nav-meta">{capitalise(category)}</span>}
          </span>
        )}
        {mode && category && (
          <span className="nav-link active">
            Drill
          </span>
        )}
      </div>
    </nav>
  )
}

export default NavRail