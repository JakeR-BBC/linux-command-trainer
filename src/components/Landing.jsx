import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function Landing() {
    const navigate = useNavigate()

    useEffect(() => {
        function handleKeyDown(e) {
            if (document.body.classList.contains('nav-focused')) return
            if (e.key === 'Enter') navigate('/category')
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <div className="landing">
            <div className="landing-header">
                <span className="nav-logo-mark">&gt;_</span>
                <h1>Linux Command Trainer</h1>
                <p className="landing-tagline">Learn Linux commands the way you'd actually use them.</p>
            </div>
            <div className="landing-sections">
                <div className="landing-card">
                    <p className="landing-card-title">What is this?</p>
                    <p className="landing-card-body">A progressive drill tool for learning Linux commands — from recognising them on sight to using them confidently in real world situations. No terminal access required.</p>
                </div>
                <div className="landing-card">
                    <p className="landing-card-title">How does it work?</p>
                    <p className="landing-card-body">Commands are grouped into six categories. Work through each one across five modes, starting with Recognition and building up to Mastery. Each mode unlocks when you score 80% or higher in the previous one.</p>
                </div>
                <div className="landing-card">
                    <p className="landing-card-title">The five modes</p>
                    <div className="landing-modes">
                        <div className="landing-mode">
                            <span className="landing-mode-icon">👀</span>
                            <div>
                                <p className="landing-mode-name">Recognition</p>
                                <p className="landing-mode-desc">Pick the correct command from 4 options</p>
                            </div>
                        </div>
                        <div className="landing-mode">
                            <span className="landing-mode-icon">⌨️</span>
                            <div>
                                <p className="landing-mode-name">Recall</p>
                                <p className="landing-mode-desc">Type the command from scratch</p>
                            </div>
                        </div>
                        <div className="landing-mode">
                            <span className="landing-mode-icon">🧠</span>
                            <div>
                                <p className="landing-mode-name">Scenario</p>
                                <p className="landing-mode-desc">Identify the right command for a real world situation</p>
                            </div>
                        </div>
                        <div className="landing-mode">
                            <span className="landing-mode-icon">⚡</span>
                            <div>
                                <p className="landing-mode-name">Realism</p>
                                <p className="landing-mode-desc">Type the full command including flags and arguments</p>
                            </div>
                        </div>
                        <div className="landing-mode">
                            <span className="landing-mode-icon">🎯</span>
                            <div>
                                <p className="landing-mode-name">Mastery</p>
                                <p className="landing-mode-desc">Expert level challenges requiring precise commands</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="landing-card">
                    <p className="landing-card-title">Your progress</p>
                    <p className="landing-card-body">Everything is saved in your browser. Score 80% or more in a mode to unlock the next one for that category. Complete all categories in a mode to unlock the All Commands drill.</p>
                </div>
            </div>
            <button className="landing-cta" onClick={() => navigate('/category')}>
                Start →
            </button>
        </div>
    )
}

export default Landing