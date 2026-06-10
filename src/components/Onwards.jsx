import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import commands from '../commands.json'
import { getBestResult } from '../utils/results'
import { isModeUnlocked, isAllUnlocked } from '../utils/unlocks'

const MODES = ['recognition', 'recall', 'scenario', 'realism', 'mastery']
const UNLOCK_THRESHOLD = 80
const TROPHY_THRESHOLD = 90

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
  const [focusedButtonIndex, setFocusedButtonIndex] = useState(null)

  const categories = [...new Set(commands.map(c => c.category))]
  const modeIndex = MODES.indexOf(mode)
  const nextMode = MODES[modeIndex + 1]

  const scoreQualifies = score >= UNLOCK_THRESHOLD

  const remainingCategories = categories.filter(cat => {
    if (cat === category) return false
    const result = getBestResult(mode, cat)
    return !result
  })

  const allCategoriesComplete = category !== 'all' &&
    categories.every(cat => {
      const result = getBestResult(mode, cat)
      return result && result.accuracy >= 80
    })

  const allCommandsMastered = category === 'all' && score >= TROPHY_THRESHOLD
  const allCommandsAttempted = category === 'all' && score < TROPHY_THRESHOLD

  const unlockedRemaining = remainingCategories.filter(cat => isModeUnlocked(mode, cat, commands))
  const lockedRemaining = remainingCategories.filter(cat => !isModeUnlocked(mode, cat, commands))

  const nextModeUnlocked = nextMode && (
    category === 'all'
      ? isAllUnlocked(nextMode, commands)
      : isModeUnlocked(nextMode, category, commands)
  )

  const focusableButtons = [
    allCategoriesComplete && { id: 'achievement', action: () => navigate(`/drill?mode=${mode}&category=all`) },
    allCommandsAttempted && { id: 'retry', action: () => navigate(`/drill?mode=${mode}&category=all`) },
    nextModeUnlocked && category !== 'all' && { id: 'deeper', action: () => navigate(`/drill?mode=${nextMode}&category=${category}`) },
    { id: 'back', action: () => navigate('/category') },
  ].filter(Boolean)

  function isFocused(id) {
    if (focusedButtonIndex === null) return false
    return focusableButtons[focusedButtonIndex]?.id === id
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (document.body.classList.contains('nav-focused')) return

      const index = parseInt(e.key) - 1
      if (index >= 0 && index < unlockedRemaining.length) {
        navigate(`/drill?mode=${mode}&category=${unlockedRemaining[index]}`)
        return
      }

      if (e.key === 'Enter') {
        if (focusedButtonIndex !== null) {
          focusableButtons[focusedButtonIndex].action()
          return
        }
        if (nextModeUnlocked) {
          navigate(`/drill?mode=${nextMode}&category=${category}`)
          return
        }
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedButtonIndex(prev => {
          if (prev === null) return 0
          return Math.min(prev + 1, focusableButtons.length - 1)
        })
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedButtonIndex(prev => {
          if (prev === null || prev === 0) return null
          return prev - 1
        })
        return
      }

      if (e.key === 'Escape') {
        if (focusedButtonIndex !== null) {
          setFocusedButtonIndex(null)
          return
        }
        navigate('/category')
      }
    }

    function handleMouseMove() {
      setFocusedButtonIndex(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [unlockedRemaining, nextModeUnlocked, focusedButtonIndex, focusableButtons])

  return (
    <div className="onwards">
      <h1>Linux Command Trainer</h1>
      <p className="onwards-title">Onwards 🚀</p>

      {allCategoriesComplete && (
        <div className="onwards-achievement">
          <p className="onwards-section-title">🔑 All Commands {capitalise(mode)} unlocked</p>
          <p>You've completed {capitalise(mode)} drills for all the specific categories.</p>
          <p>Beat the All Commands drill in {capitalise(mode)} mode to claim your trophy!</p>
          <button
            className={`onwards-btn primary ${isFocused('achievement') ? 'keyboard-focused' : ''}`}
            onClick={() => navigate(`/drill?mode=${mode}&category=all`)}
          >
            All Commands / {capitalise(mode)} →
          </button>
        </div>
      )}

      {allCommandsMastered && (
        <div className="onwards-achievement mastered">
          <p className="onwards-section-title">You earned the trophy for {capitalise(mode)} mode, congratulations! 🏆</p>
          <p>You've beaten {capitalise(mode)} mode with a score of {score}%.</p>
        </div>
      )}

      {allCommandsAttempted && (
        <div className="onwards-achievement">
          <p className="onwards-section-title">Not quite</p>
          <p>You scored {score}% on All Commands / {capitalise(mode)} mode. Score 90% or higher to claim your trophy.</p>
          <p>The path of champions:</p>
          <button
            className={`onwards-btn primary ${isFocused('retry') ? 'keyboard-focused' : ''}`}
            onClick={() => navigate(`/drill?mode=${mode}&category=all`)}
          >
            Try again →
          </button>
        </div>
      )}

      {remainingCategories.length > 0 && (
        <div className="onwards-section">
          <p className="onwards-section-title">
            Keep building your {capitalise(mode)} skills
          </p>
          <p className="onwards-section-body">
            You haven't tried these categories in {capitalise(mode)} mode yet:
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

      {category !== 'all' && (
        <div className="onwards-section">
          <p className="onwards-section-title">
            Go deeper with {capitalise(category)}
          </p>
          {nextMode ? (
            nextModeUnlocked ? (
              <>
                <p className="onwards-section-body">
                  {scoreQualifies
                    ? `🔑 Your score of ${score}% has unlocked ${capitalise(nextMode)} mode for ${capitalise(category)}.`
                    : `${capitalise(nextMode)} is available for ${capitalise(category)}.`}
                </p>
                <button
                  className={`onwards-btn primary ${isFocused('deeper') ? 'keyboard-focused' : ''}`}
                  onClick={() => navigate(`/drill?mode=${nextMode}&category=${category}`)}
                >
                  Start {capitalise(nextMode)} → <span className="key-hint">↵ Enter</span>
                </button>
              </>
            ) : (
              <p className="onwards-section-body">
                🔒 Score {UNLOCK_THRESHOLD}% or higher in {capitalise(mode)} mode to unlock {capitalise(nextMode)} mode for {capitalise(category)}.
                {score < UNLOCK_THRESHOLD && ` This attempt scored ${score}%.`}
              </p>
            )
          ) : (
            <p className="onwards-section-body">
              🎯 You've reached Mastery level for {capitalise(category)}. Impressive.
            </p>
          )}
        </div>
      )}

      <div className="onwards-footer">
        <span
          className={`back-btn ${isFocused('back') ? 'keyboard-focused' : ''}`}
          onClick={() => navigate('/category')}
        >
          ← All categories <span className="key-hint">Esc</span>
        </span>
      </div>
    </div>
  )
}

export default Onwards