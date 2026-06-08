import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import commands from '../commands.json'

const CATEGORIES = ['all', ...new Set(commands.map(c => c.category))]

function capitalise(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function Library() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [focusedIndex, setFocusedIndex] = useState(null)

  const filtered = selectedCategory === 'all'
    ? commands
    : commands.filter(c => c.category === selectedCategory)

  function toggleExpand(id) {
    setExpanded(prev => prev === id ? null : id)
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus()
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (!['ArrowUp', 'ArrowDown', 'Enter', 'Escape', 'Backspace', 'Tab'].includes(e.key)) return
      e.preventDefault()

      if (e.key === 'ArrowDown') {
        setFocusedIndex(prev => {
          const next = prev === null ? 0 : Math.min(prev + 1, filtered.length - 1)
          return next
        })
      }
      if (e.key === 'ArrowUp') {
        setFocusedIndex(prev => {
          if (prev === null) return 0
          return Math.max(prev - 1, 0)
        })
      }
      if (e.key === 'Enter' && focusedIndex !== null) {
        toggleExpand(filtered[focusedIndex].id)
      }
      if (e.key === 'Escape') {
        if (expanded) {
          setExpanded(null)
        } else {
          navigate('/')
        }
      }
      if (e.key === 'Backspace' && expanded) {
        setExpanded(null)
      }
      if (e.key === 'Tab') {
        const currentIndex = CATEGORIES.indexOf(selectedCategory)
        if (e.shiftKey) {
          const prevIndex = (currentIndex - 1 + CATEGORIES.length) % CATEGORIES.length
          setSelectedCategory(CATEGORIES[prevIndex])
        } else {
          const nextIndex = (currentIndex + 1) % CATEGORIES.length
          setSelectedCategory(CATEGORIES[nextIndex])
        }
        setExpanded(null)
        setFocusedIndex(null)
      }
    }

    let lastMouseX = 0
    let lastMouseY = 0

    function handleMouseMove(e) {
      const dx = Math.abs(e.clientX - lastMouseX)
      const dy = Math.abs(e.clientY - lastMouseY)
      lastMouseX = e.clientX
      lastMouseY = e.clientY
      if (dx > 5 || dy > 5) {
        setFocusedIndex(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [focusedIndex, filtered, expanded])

  useEffect(() => {
    if (focusedIndex === null) return
    const items = document.querySelectorAll('.library-item')
    if (items[focusedIndex]) {
      items[focusedIndex].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [focusedIndex])

  return (
    <div
      className="library"
      ref={containerRef}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      <h1>Linux Command Trainer</h1>
      <p className="subtitle">Command Library — <span className="key-hint">↑↓ navigate · ↵ expand · ⌫ collapse · Tab cycle categories · Esc back</span></p>
      <div className="library-filters">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`library-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(cat)
              setExpanded(null)
              setFocusedIndex(null)
            }}
          >
            {cat === 'all' ? 'All' : capitalise(cat)}
          </button>
        ))}
      </div>
      <div className="library-list">
        {filtered.map((cmd, index) => (
          <div
            key={cmd.id}
            className={`library-item ${expanded === cmd.id ? 'open' : ''} ${focusedIndex === index ? 'keyboard-focused' : ''}`}
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