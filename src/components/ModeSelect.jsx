import { useNavigate } from 'react-router-dom'

const modes = [
  {
    id: 'recognition',
    name: 'Recognition',
    desc: 'Given a description, pick the correct command from 4 options',
    icon: '👀'
  },
  {
    id: 'recall',
    name: 'Recall',
    desc: 'Given a description, type the command from scratch',
    icon: '⌨️'
  },
  {
    id: 'scenario',
    name: 'Scenario',
    desc: 'Given a real world situation, identify the right command to use',
    icon: '🧠'
  }
]

function ModeSelect() {
  const navigate = useNavigate()

  return (
    <div className="category-select">
      <h1>Linux Command Trainer</h1>
      <p className="subtitle">How do you want to drill?</p>
      <div className="category-grid">
        {modes.map(mode => (
          <button
            key={mode.id}
            className="category-btn mode-btn"
            onClick={() => navigate(`/category?mode=${mode.id}`)}
          >
            <span className="mode-icon">{mode.icon}</span>
            <span className="mode-name">{mode.name}</span>
            <span className="mode-desc">{mode.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ModeSelect