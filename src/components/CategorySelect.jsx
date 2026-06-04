import { useNavigate } from 'react-router-dom'
import commands from '../commands.json'
import { getRetiredCount } from '../utils/progress'

function CategorySelect() {
  const navigate = useNavigate()
  const params = new URLSearchParams(window.location.search)
  const mode = params.get('mode')
  const categories = [...new Set(commands.map(c => c.category))]

  function getCount(category) {
    return commands.filter(c => c.category === category).length
  }

  function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

return (
    <div className="category-select">
      <h1>Linux Command Trainer</h1>
      <p className="subtitle">Pick a category to drill</p>
      <div className="category-grid">
        {categories.map(category => {
          const total = getCount(category)
          const retired = getRetiredCount(category, commands.filter(c => c.category === category))
          const active = total - retired

          return (
            <button
              key={category}
              className="category-btn"
              onClick={() => navigate(`/drill?mode=${mode}&category=${category}`)}
            >
              {capitalise(category)}
              <span className="count">{active}/{total}</span>
              {retired > 0 && (
                <span className="nailed">✅ {retired} nailed</span>
              )}
            </button>
          )
        })}
        <button
          className="category-btn all"
          onClick={() => navigate(`/drill?mode=${mode}&category=all`)}
        >
          All Commands
          <span className="count">({commands.length})</span>
        </button>
      </div>
      <div className="drill-footer">
        <span className="back-btn" onClick={() => navigate('/')}>
        ← Back to modes
        </span>
      </div>
    </div>
  )
}

export default CategorySelect