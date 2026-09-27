import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './styles/main.scss'
import { BrowserRouter } from 'react-router-dom'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').catch((error) => {
    console.error('فشل تسجيل Service Worker:', error);
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <BrowserRouter> */}
      <App />
    {/* </BrowserRouter> */}
  </StrictMode>,
)
