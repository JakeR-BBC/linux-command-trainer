import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
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
      const index = parseInt(e.key) - 1
      if (index >= 0 && index < ALL_MODES.length) {
        handleClick(ALL_MODES[index].id)
      }
      if (e.key === 'Escape') navigate('/category')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="category-select">
      <h1>Linux Command Trainer</h1>
      <p className="subtitle">Pick a mode to drill</p>
      <div className="category-grid">
        {ALL_MODES.map((mode, index) => (
          <button
            key={mode.id}
            className={`category-btn mode-btn ${!unlocked(mode.id) ? 'locked' : ''}`}
            onClick={() => handleClick(mode.id)}
          >
            <span className="mode-icon">{mode.icon}</span>
            <span className="mode-name">
              <span className="option-number">{index + 1}</span>
              {mode.name}
            </span>
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