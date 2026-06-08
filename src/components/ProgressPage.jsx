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

  function handleCellClick(mode, category) {
    const unlocked = category === 'all'
      ? isAllUnlocked(mode, commands)
      : isModeUnlocked(mode, category, commands)
    if (!unlocked) return
    navigate(`/drill?mode=${mode}&category=${category}`)
  }

  function isUnlocked(mode, category) {
    return category === 'all'
      ? isAllUnlocked(mode, commands)
      : isModeUnlocked(mode, category, commands)
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].includes(e.key)) return
      e.preventDefault()

      if (focusedRow === null || focusedCol === null) {
        setFocusedRow(0)
        setFocusedCol(0)
        return
      }

      if (e.key === 'ArrowDown') setFocusedRow(prev => Math.min(prev + 1, categories.length - 1))
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
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [focusedRow, focusedCol])

  return (
    <div className="progress-page">
      <h1>Linux Command Trainer</h1>
      <p className="subtitle">Your best scores — <span className="key-hint">arrow keys to navigate, ↵ to drill, Esc to go back</span></p>
      <div className="progress-table-wrapper">
        <table className="progress-table">
          <thead>
            <tr>
              <th></th>
              {modes.map(mode => (
                <th key={mode}>{capitalise(mode)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category, rowIndex) => (
              <tr key={category}>
                <td className="progress-category">{capitalise(category)}</td>
                {modes.map((mode, colIndex) => (
                  <td key={mode}>
                    <span
                      className={`progress-cell ${getBestResult(mode, category) ? 'attempted' : 'unattempted'} ${
                        isUnlocked(mode, category) ? '' : 'progress-locked'
                      } ${focusedRow === rowIndex && focusedCol === colIndex ? 'keyboard-focused' : ''}`}
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