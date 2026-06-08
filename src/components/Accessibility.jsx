import { useNavigate } from 'react-router-dom'

const shortcuts = [
  { screen: 'Landing', keys: '↵ Enter', action: 'Start' },
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
  { screen: 'Library', keys: 'Tab', action: 'Cycle categories' },
  { screen: 'Library', keys: 'Esc', action: 'Back to home' },
  { screen: 'Progress', keys: '↑↓←→', action: 'Navigate grid' },
  { screen: 'Progress', keys: '↵ Enter', action: 'Go to drill' },
  { screen: 'Progress', keys: 'Esc', action: 'Back' },
]

function Accessibility() {
  const navigate = useNavigate()

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
          ← Home
        </span>
      </div>
    </div>
  )
}

export default Accessibility