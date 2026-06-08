import { useEffect, useState } from 'react'
import { getBestResult } from '../utils/results'
import { addToFocusList } from '../utils/focusList'
import commands from '../commands.json'

function capitalise(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function ResultsScreen({ mode, category, correct, incorrect, skipped, newBest, onRetry, onContinue, incorrectIds }) {
  const total = correct + incorrect + skipped
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
  const best = getBestResult(mode, category)

  const incorrectCommands = commands.filter(c => incorrectIds?.includes(c.id))
  const [added, setAdded] = useState([])

  function handleAddOne(id) {
    addToFocusList([id])
    setAdded(prev => [...prev, id])
  }

  function handleAddAll() {
    const ids = incorrectCommands.map(c => c.id)
    addToFocusList(ids)
    setAdded(ids)
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Enter') onContinue()
      if (e.key === 'Backspace') onRetry()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="results-screen">
      <h1>Linux Command Trainer</h1>
      <div className="results-card">
        <p className="results-title">Session Complete 🎉</p>
        <p className="results-meta">{capitalise(category)} · {capitalise(mode)}</p>
        {newBest && <p className="results-best">🏆 New best score!</p>}
        <div className="results-stats">
          <div className="results-stat">
            <span className="results-stat-icon">✅</span>
            <span className="results-stat-label">Correct</span>
            <span className="results-stat-value">{correct}</span>
          </div>
          <div className="results-stat">
            <span className="results-stat-icon">❌</span>
            <span className="results-stat-label">Incorrect</span>
            <span className="results-stat-value">{incorrect}</span>
          </div>
          <div className="results-stat">
            <span className="results-stat-icon">⏭️</span>
            <span className="results-stat-label">Skipped</span>
            <span className="results-stat-value">{skipped}</span>
          </div>
          <div className="results-stat accuracy">
            <span className="results-stat-icon">📊</span>
            <span className="results-stat-label">Accuracy</span>
            <span className="results-stat-value">{accuracy}%</span>
          </div>
        </div>
        {best && !newBest && (
          <p className="results-previous">Previous best: {best.accuracy}%</p>
        )}

        {incorrectCommands.length > 0 && (
          <div className="results-focus">
            <p className="results-focus-title">Commands to revisit</p>
            <div className="results-focus-list">
              {incorrectCommands.map(cmd => (
                <div key={cmd.id} className="results-focus-item">
                  <span className="results-focus-cmd">{cmd.command}</span>
                  <span className="results-focus-desc">{cmd.short_desc}</span>
                  <button
                    className={`results-focus-btn ${added.includes(cmd.id) ? 'added' : ''}`}
                    onClick={() => handleAddOne(cmd.id)}
                    disabled={added.includes(cmd.id)}
                  >
                    {added.includes(cmd.id) ? '✅ Added' : '+ Focus list'}
                  </button>
                </div>
              ))}
            </div>
            {incorrectCommands.length > 1 && added.length < incorrectCommands.length && (
              <button className="results-focus-all" onClick={handleAddAll}>
                Add all to focus list
              </button>
            )}
          </div>
        )}

        <div className="results-actions">
          <button className="results-btn yes" onClick={onRetry}>
            Retry <span className="key-hint">⌫ Backspace</span>
          </button>
          <button className="results-btn yes" onClick={onContinue}>
            Continue → <span className="key-hint">↵ Enter</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultsScreen