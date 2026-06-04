import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Passkey, { isUnlocked } from './components/Passkey.jsx'

function Root() {
  const [unlocked, setUnlocked] = useState(isUnlocked())

  if (!unlocked) {
    return <Passkey onUnlock={() => setUnlocked(true)} />
  }

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)