import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import commands from '../commands.json'
import { getBestResult } from '../utils/results'
import { isModeUnlocked } from '../utils/unlocks'

const MODES = ['recognition', 'recall', 'scenario', 'realism', 'mastery']
const ALL_THRESHOLD = 90
const CATEGORY_THRESHOLD = 80

function capitalise(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function Onwards() {
  const navigate = useNavigate()
  const params = new URLSearchParams(window.location.search)
  const mode = params.get('mode')
  const category = params.get('category')
  const score = parseInt(params.get('score'))

  const categories = [...new Set(commands.map(c => c.category))]
  const modeIndex = MODES.indexOf(mode)
  const nextMode = MODES[modeIndex + 1]

  const threshold = category === 'all' ? ALL_THRESHOLD : CATEGORY_THRESHOLD
  const scoreQualifies = score >= threshold

  const remainingCategories = categories.filter(cat => {
    if (cat === category) return false
    const result = getBestResult(mode, cat)
    return !result
  })

  const unlockedRemaining = remainingCategories.filter(cat => isModeUnlocked(mode, cat, commands))
  const lockedRemaining = remainingCategories.filter(cat => !isModeUnlocked(mode, cat, commands))
  const nextModeUnlocked = nextMode && isModeUnlocked(nextMode, category, commands)

  useEffect(() => {
    function handleKeyDown(e) {
      // Number keys navigate to unlocked remaining categories
      const index = parseInt(e.key) - 1
      if (index >= 0 && index < unlockedRemaining.length) {
        navigate(`/drill?mode=${mode}&category=${unlockedRemaining[index]}`)
        return
      }
      // Enter navigates to next mode if unlocked
      if (e.key === 'Enter' && nextModeUnlocked) {
        navigate(`/drill?mode=${nextMode}&category=${category}`)
        return
      }
      // Escape goes back to categories
      if (e.key === 'Escape') {
        navigate('/category')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [unlockedRemaining, nextModeUnlocked])

  return (
    <div className="onwards">
      <h1>Linux Command Trainer</h1>
      <p className="onwards-title">Onwards 🚀</p>

      {remainingCategories.length > 0 && (
        <div className="onwards-section">
          <p className="onwards-section-title">
            Keep building your {capitalise(mode)} skills
          </p>
          <p className="onwards-section-body">
            You haven't tried these categories in {capitalise(mode)} yet:
          </p>
          <div className="onwards-grid">
            {unlockedRemaining.map((cat, index) => (
              <button
                key={cat}
                className="onwards-btn"
                onClick={() => navigate(`/drill?mode=${mode}&category=${cat}`)}
              >
                <span className="option-number">{index + 1}</span>
                {capitalise(cat)}
              </button>
            ))}
            {lockedRemaining.map(cat => (
              <div key={cat} className="onwards-btn locked">
                {capitalise(cat)} 🔒
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="onwards-section">
        <p className="onwards-section-title">
          Go deeper with {capitalise(category)}
        </p>
        {nextMode ? (
          nextModeUnlocked ? (
            <>
              <p className="onwards-section-body">
                {scoreQualifies
                  ? `Your score of ${score}% has unlocked ${capitalise(nextMode)} for ${capitalise(category)}.`
                  : `${capitalise(nextMode)} is available for ${capitalise(category)}.`}
              </p>
              <button
                className="onwards-btn primary"
                onClick={() => navigate(`/drill?mode=${nextMode}&category=${category}`)}
              >
                Start {capitalise(nextMode)} → <span className="key-hint">↵ Enter</span>
              </button>
            </>
          ) : (
            <p className="onwards-section-body muted">
              Score {threshold}% or higher in {capitalise(mode)} to unlock {capitalise(nextMode)} for {capitalise(category)}.
              {score < threshold && ` Your current score is ${score}%.`}
            </p>
          )
        ) : (
          <p className="onwards-section-body">
            🎯 You've reached Mastery level for {capitalise(category)}. Impressive.
          </p>
        )}
      </div>

      <div className="onwards-footer">
        <span className="back-btn" onClick={() => navigate('/category')}>
          ← All categories <span className="key-hint">Esc</span>
        </span>
      </div>
    </div>
  )
}

export default Onwards