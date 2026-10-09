import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PlaygroundPage from './components/PlaygroundPage.jsx'
import Boot from './components/Boot.jsx'

const isPlayground = window.location.pathname.replace(/\/$/, '') === '/playground'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Boot>{isPlayground ? <PlaygroundPage /> : <App />}</Boot>
  </StrictMode>,
)
