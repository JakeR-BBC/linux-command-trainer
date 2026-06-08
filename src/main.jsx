import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './variables.css'
import App from './App.jsx'
import Passkey, { isUnlocked } from './components/Passkey.jsx'

function Root() {
  const [unlocked, setUnlocked] = useState(isUnlocked())

  function handleUnlock() {
    setUnlocked(true)
    window.location.href = '/linux-command-trainer/'
  }

  if (!unlocked) {
    return <Passkey onUnlock={handleUnlock} />
  }

  return (
    <BrowserRouter basename="/linux-command-trainer">
      <App />
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)