import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Mare from '../.mareJS/mare'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Mare />
  </StrictMode>,
)
