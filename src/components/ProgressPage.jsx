import { useNavigate } from 'react-router-dom'
import commands from '../commands.json'
import { getBestResult } from '../utils/results'

const modes = ['recognition', 'recall', 'scenario', 'realism', 'mastery']
const categories = [...new Set(commands.map(c => c.category)), 'all']

function capitalise(str) {
    if (!str) return ''
    if (str === 'all') return 'All Commands'
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function ProgressPage() {
    const navigate = useNavigate()

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
        navigate(`/drill?mode=${mode}&category=${category}`)
    }

    return (
        <div className="progress-page">
            <h1>Linux Command Trainer</h1>
            <p className="subtitle">Your best scores</p>
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
                        {categories.map(category => (
                            <tr key={category}>
                                <td className="progress-category">{capitalise(category)}</td>
                                {modes.map(mode => (
                                    <td key={mode}>
                                        <span
                                            className={`progress-cell ${getBestResult(mode, category) ? 'attempted' : 'unattempted'}`}
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