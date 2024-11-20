import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { DeChronicleProvider } from './context/DeChronicleContext.tsx'

createRoot(document.getElementById('root')!).render(
  <DeChronicleProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </DeChronicleProvider>,
)
