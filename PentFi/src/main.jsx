import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Aplicar tema global
document.documentElement.setAttribute('data-theme', 'winter')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)