import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const shortcuts = [
  { screen: 'Landing', keys: '↵ Enter', action: 'Start' },
  { screen: 'Accessibility (This page)', keys: 'Esc', action: 'Back to home' },
  { screen: 'Categories', keys: '↑↓←→', action: 'Navigate' },
  { screen: 'Categories', keys: '↵ Enter', action: 'Select' },
  { screen: 'Categories', keys: 'Esc', action: 'Back to home' },
  { screen: 'Mode select', keys: '↑↓', action: 'Navigate' },
  { screen: 'Mode select', keys: '↵ Enter', action: 'Select' },
  { screen: 'Mode select', keys: 'Esc', action: 'Back to categories' },
  { screen: 'Recognition', keys: '1 2 3 4', action: 'Pick answer' },
  { screen: 'Recall · Scenario · Realism · Mastery', keys: '↵ Enter', action: 'Submit answer' },
  { screen: 'Drill', keys: 'Tab', action: 'Skip question' },
  { screen: 'Drill', keys: 'Esc', action: 'Back to modes' },
  { screen: 'Results', keys: '↵ Enter', action: 'Continue' },
  { screen: 'Results', keys: '⌫ Backspace', action: 'Retry' },
  { screen: 'Onwards', keys: '1 2 3 4', action: 'Pick category' },
  { screen: 'Onwards', keys: '↵ Enter', action: 'Start next mode' },
  { screen: 'Onwards', keys: 'Esc', action: 'Back to categories' },
  { screen: 'Library', keys: '↑↓', action: 'Navigate commands' },
  { screen: 'Library', keys: '↵ Enter', action: 'Expand command' },
  { screen: 'Library', keys: '⌫ Backspace', action: 'Collapse command' },
  { screen: 'Library', keys: 'Tab', action: 'Cycle categories forward' },
  { screen: 'Library', keys: 'Shift + Tab', action: 'Cycle categories backward' },
  { screen: 'Library', keys: 'Esc', action: 'Back to home' },
  { screen: 'Progress', keys: '↑↓←→', action: 'Navigate grid' },
  { screen: 'Progress', keys: '↵ Enter', action: 'Go to drill' },
  { screen: 'Progress', keys: 'Esc', action: 'Back' },
  { screen: 'Focus List', keys: '↑↓', action: 'Navigate commands' },
  { screen: 'Focus List', keys: '⌫ Backspace', action: 'Remove item' },
  { screen: 'Focus List', keys: 'Y / N', action: 'Are you sure?' },
  { screen: 'Focus List', keys: '↵ Enter', action: 'Drill focus list' },
  { screen: 'Focus List', keys: 'Esc', action: 'Deselect item or back to home' },
]

function Accessibility() {
  const navigate = useNavigate()

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="accessibility-page">
      <h1>Linux Command Trainer</h1>
      <p className="subtitle">Keyboard Navigation</p>
      <div className="accessibility-table-wrapper">
        <table className="accessibility-table">
          <thead>
            <tr>
              <th>Screen</th>
              <th>Key</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {shortcuts.map((s, i) => (
              <tr key={i}>
                <td className="accessibility-screen">{s.screen}</td>
                <td className="accessibility-keys"><code>{s.keys}</code></td>
                <td className="accessibility-action">{s.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="drill-footer">
        <span className="back-btn" onClick={() => navigate('/')}>
          ← Home <span className="key-hint">Esc</span>
        </span>
      </div>
    </div>
  )
}

export default Accessibility