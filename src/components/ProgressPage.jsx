import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import commands from '../commands.json'
import { getBestResult } from '../utils/results'
import { isModeUnlocked, isAllUnlocked } from '../utils/unlocks'

const modes = ['recognition', 'recall', 'scenario', 'realism', 'mastery']
const categories = [...new Set(commands.map(c => c.category)), 'all']

function capitalise(str) {
  if (!str) return ''
  if (str === 'all') return 'All Commands'
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function ProgressPage() {
  const navigate = useNavigate()
  const [focusedRow, setFocusedRow] = useState(null)
  const [focusedCol, setFocusedCol] = useState(null)
  const [confirmDrill, setConfirmDrill] = useState(null)

  function getTotal(mode, category) {
    const base = category === 'all'
      ? commands
      : commands.filter(c => c.category === category)
    if (mode === 'realism' || mode === 'mastery') {
      return base.filter(cmd => cmd.challenges?.some(ch => ch.mode === mode)).length
    }
    return base.length
  }

  function getCellContent(mode, category) {
    const result = getBestResult(mode, category)
    const total = getTotal(mode, category)
    if (!result) return '?'
    return `${result.correct}/${total}`
  }

  function getCellClass(mode, category, rowIndex, colIndex) {
    const unlocked = category === 'all'
      ? isAllUnlocked(mode, commands)
      : isModeUnlocked(mode, category, commands)

    const focused = focusedRow === rowIndex && focusedCol === colIndex ? 'keyboard-focused' : ''

    if (!unlocked) return `progress-cell progress-locked ${focused}`

    const result = getBestResult(mode, category)
    if (!result) return `progress-cell unattempted ${focused}`

    if (category === 'all' && result.accuracy >= 90) return `progress-cell attempted ${focused}`
    if (result.accuracy >= 80) return `progress-cell attempted ${focused}`
    return `progress-cell attempted amber ${focused}`
  }

  function handleCellClick(mode, category) {
    const unlocked = category === 'all'
      ? isAllUnlocked(mode, commands)
      : isModeUnlocked(mode, category, commands)
    if (!unlocked) return
    setConfirmDrill({ mode, category })
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (document.body.classList.contains('nav-focused')) return
      if (confirmDrill) {
        if (e.key === 'y' || e.key === 'Y') {
          navigate(`/drill?mode=${confirmDrill.mode}&category=${confirmDrill.category}`)
          return
        }
        if (e.key === 'n' || e.key === 'N' || e.key === 'Escape') {
          setConfirmDrill(null)
          return
        }
        return
      }

      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].includes(e.key)) return
      e.preventDefault()

      if (focusedRow === null || focusedCol === null) {
        setFocusedRow(0)
        setFocusedCol(0)
        document.body.classList.add('keyboard-nav-active')
        return
      }

      if (e.key === 'ArrowDown') {
        console.log('keyboard-nav-active:', document.body.classList.contains('keyboard-nav-active'))
        setFocusedRow(prev => Math.min(prev + 1, categories.length - 1))
        document.body.classList.add('keyboard-nav-active')
      }
      if (e.key === 'ArrowUp') setFocusedRow(prev => Math.max(prev - 1, 0))
      if (e.key === 'ArrowRight') setFocusedCol(prev => Math.min(prev + 1, modes.length - 1))
      if (e.key === 'ArrowLeft') setFocusedCol(prev => Math.max(prev - 1, 0))

      if (e.key === 'Enter' && focusedRow !== null && focusedCol !== null) {
        handleCellClick(modes[focusedCol], categories[focusedRow])
      }
      if (e.key === 'Escape') navigate('/category')
    }

    function handleMouseMove() {
      setFocusedRow(null)
      setFocusedCol(null)
      document.body.classList.remove('keyboard-nav-active')
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [focusedRow, focusedCol, confirmDrill])

  return (
    <div className="progress-page">
      <h1>Linux Command Trainer</h1>
      <p className="subtitle">Your best scores — <span className="key-hint">arrow keys to navigate, ↵ to drill, Esc to go back</span></p>
      <div className="progress-table-wrapper">
        {confirmDrill && (
          <div className="focus-confirm">
            <p>Run a <span className="highlight">{capitalise(confirmDrill.category)}</span> drill in <span className="highlight">{capitalise(confirmDrill.mode)}</span> mode?</p>
            <div className="focus-confirm-actions">
              <button className="results-btn yes" onClick={() => navigate(`/drill?mode=${confirmDrill.mode}&category=${confirmDrill.category}`)}>
                Yes <span className="key-hint">Y</span>
              </button>
              <button className="results-btn no" onClick={() => setConfirmDrill(null)}>
                No <span className="key-hint">N</span>
              </button>
            </div>
          </div>
        )}
        <table className="progress-table">
          <thead>
            <tr>
              <th></th>
              {modes.map(mode => {
                const allResult = getBestResult(mode, 'all')
                const mastered = allResult && allResult.accuracy >= 90
                return (
                  <th key={mode}>
                    {mastered && <span className="mode-trophy">🏆</span>}
                    {capitalise(mode)}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {categories.map((category, rowIndex) => (
              <tr key={category}>
                <td className="progress-category">{capitalise(category)}</td>
                {modes.map((mode, colIndex) => (
                  <td key={mode}>
                    <span
                      className={getCellClass(mode, category, rowIndex, colIndex)}
                      onClick={() => handleCellClick(mode, category)}
                    >
                      {getCellContent(mode, category)}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProgressPage