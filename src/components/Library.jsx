import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import commands from '../commands.json'

const CATEGORIES = ['all', ...new Set(commands.map(c => c.category))]

function capitalise(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function Library() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const filtered = selectedCategory === 'all'
    ? commands
    : commands.filter(c => c.category === selectedCategory)

  function toggleExpand(id) {
    setExpanded(prev => prev === id ? null : id)
  }

  return (
    <div className="library">
      <h1>Linux Command Trainer</h1>
      <p className="subtitle">Command Library</p>
      <div className="library-filters">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`library-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(cat)
              setExpanded(null)
            }}
          >
            {cat === 'all' ? 'All' : capitalise(cat)}
          </button>
        ))}
      </div>
      <div className="library-list">
        {filtered.map(cmd => (
          <div
            key={cmd.id}
            className={`library-item ${expanded === cmd.id ? 'open' : ''}`}
          >
            <div
              className="library-item-header"
              onClick={() => toggleExpand(cmd.id)}
            >
              <span className="library-cmd">{cmd.command}</span>
              <span className="library-desc">{cmd.short_desc}</span>
              <div className="library-item-meta">
                {!cmd.mac_compatible && <span className="library-mac-badge">⚠️ Linux only</span>}
                <span className="library-difficulty">{cmd.difficulty}</span>
                <span className="library-chevron">{expanded === cmd.id ? '▲' : '▼'}</span>
              </div>
            </div>
            {expanded === cmd.id && (
              <div className="library-item-body">
                <div className="library-section">
                  <p className="library-section-title">Scenario</p>
                  <p className="library-section-body">{cmd.scenario}</p>
                </div>
                <div className="library-section">
                  <p className="library-section-title">Example</p>
                  <code className="library-example">{cmd.example}</code>
                </div>
                {cmd.common_flags.length > 0 && (
                  <div className="library-section">
                    <p className="library-section-title">Common flags</p>
                    <div className="library-flags">
                      {cmd.common_flags.map(f => (
                        <div key={f.flag} className="library-flag">
                          <code className="library-flag-name">{f.flag}</code>
                          <span className="library-flag-desc">{f.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!cmd.mac_compatible && (
                  <div className="library-section">
                    <p className="library-section-title">macOS note</p>
                    <p className="library-section-body">
                      Not natively available on macOS.
                      {cmd.mac_equivalent && <span> Mac equivalent: <code>{cmd.mac_equivalent}</code></span>}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Library