import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { isModeUnlocked, isAllUnlocked } from '../utils/unlocks'
import commands from '../commands.json'

const ALL_MODES = [
  { id: 'recognition', name: 'Recognition', desc: 'Given a description, pick the correct command from 4 options', icon: '👀' },
  { id: 'recall', name: 'Recall', desc: 'Given a description, type the command from scratch', icon: '⌨️' },
  { id: 'scenario', name: 'Scenario', desc: 'Given a real world situation, identify the right command to use', icon: '🧠' },
  { id: 'realism', name: 'Realism', desc: 'Type the full command including flags and arguments for a practical situation', icon: '⚡' },
  { id: 'mastery', name: 'Mastery', desc: 'Expert level challenges requiring precise commands in complex situations', icon: '🎯' }
]

function ModeSelect() {
  const navigate = useNavigate()
  const params = new URLSearchParams(window.location.search)
  const category = params.get('category')
  const isAll = category === 'all'
  const [focusedIndex, setFocusedIndex] = useState(null)
  const [keyboardNav, setKeyboardNav] = useState(false)
  const gridRef = useRef(null)

  function unlocked(modeId) {
    if (isAll) return isAllUnlocked(modeId, commands)
    return isModeUnlocked(modeId, category, commands)
  }

  function handleClick(modeId) {
    if (!unlocked(modeId)) return
    navigate(`/drill?mode=${modeId}&category=${category}`)
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (document.body.classList.contains('nav-focused')) return
      if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(e.key)) {
        e.preventDefault()
        setKeyboardNav(true)
        document.body.classList.add('keyboard-nav-active')
      }

      if (e.key === 'ArrowDown') {
        setFocusedIndex(prev => {
          const next = prev === null ? 0 : prev + 1
          return Math.min(next, ALL_MODES.length - 1)
        })
      }
      if (e.key === 'ArrowUp') {
        setFocusedIndex(prev => {
          const next = prev === null ? ALL_MODES.length - 1 : prev - 1
          return Math.max(next, 0)
        })
      }
      if (e.key === 'Enter' && focusedIndex !== null) {
        handleClick(ALL_MODES[focusedIndex].id)
      }
      if (e.key === 'Escape') {
        navigate('/category')
      }
    }

    function handleMouseMove() {
      setFocusedIndex(null)
      setKeyboardNav(false)
      document.body.classList.remove('keyboard-nav-active')
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
      document.body.classList.remove('keyboard-nav-active')
    }
  }, [focusedIndex])

  return (
    <div className={`category-select ${keyboardNav ? 'keyboard-nav' : ''}`}>
      <h1>Linux Command Trainer</h1>
      <p className="subtitle">Pick a mode to drill — <span className="key-hint">↑↓ to navigate, ↵ to select, Esc to go back</span></p>
      <div className="category-grid" ref={gridRef}>
        {ALL_MODES.map((mode, index) => (
          <button
            key={mode.id}
            className={`category-btn mode-btn ${!unlocked(mode.id) ? 'locked' : ''} ${focusedIndex === index ? 'keyboard-focused' : ''}`}
            onClick={() => handleClick(mode.id)}
          >
            <span className="mode-icon">{mode.icon}</span>
            <span className="mode-name">{mode.name}</span>
            <span className="mode-desc">{mode.desc}</span>
            {!unlocked(mode.id) && <span className="mode-lock">🔒</span>}
          </button>
        ))}
      </div>
      <div className="drill-footer">
        <span className="back-btn" onClick={() => navigate('/category')}>
          ← Back to categories <span className="key-hint">Esc</span>
        </span>
      </div>
    </div>
  )
}

export default ModeSelect