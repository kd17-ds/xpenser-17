import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Welcome from './LandingPage/Welcome/welcome'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Welcome />
  </StrictMode>,
)
