import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1a1a2e',
          color: '#D4AF37',
          border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: '12px',
          fontFamily: '"Inter", sans-serif',
          fontSize: '14px',
        },
      }}
    />
  </StrictMode>,
)
