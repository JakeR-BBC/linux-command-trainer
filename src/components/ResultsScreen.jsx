import { getBestResult } from '../utils/results'

function capitalise(str) {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}

// function ResultsScreen({ mode, category, correct, incorrect, skipped, newBest, onRetry, onBack }) {
//   const total = correct + incorrect + skipped
//   const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
//   const best = getBestResult(mode, category)

function ResultsScreen({ mode, category, correct, incorrect, skipped, newBest, onRetry, onContinue }) {
    console.log('ResultsScreen rendering', { mode, category, correct, incorrect, skipped })
    const total = correct + incorrect + skipped
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
    const best = getBestResult(mode, category)

    return (
        <div className="results-screen">
            <h1>Linux Command Trainer</h1>
            <div className="results-card">
                <p className="results-title">Drill Complete</p>
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
                <div className="results-actions">
                    <button className="results-btn yes" onClick={onRetry}>
                        Retry
                    </button>
                    <button className="results-btn yes" onClick={onContinue}>
                        Continue →
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ResultsScreen