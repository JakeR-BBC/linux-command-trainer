import { useNavigate } from 'react-router-dom'
import commands from '../commands.json'

function CategorySelect() {
  const navigate = useNavigate()
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
        {categories.map(category => (
          <button
            key={category}
            className="category-btn"
            onClick={() => navigate(`/drill?category=${category}`)}
          >
            {capitalise(category)}
            <span className="count">({getCount(category)})</span>
          </button>
        ))}
        <button
          className="category-btn all"
          onClick={() => navigate('/drill?category=all')}
        >
          All Commands
          <span className="count">({commands.length})</span>
        </button>
      </div>
    </div>
  )
}

export default CategorySelect