import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PlaygroundPage from './components/PlaygroundPage.jsx'

const isPlayground = window.location.pathname.replace(/\/$/, '') === '/playground'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isPlayground ? <PlaygroundPage /> : <App />}
  </StrictMode>,
)
