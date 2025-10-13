import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LanguageProviderWrapper from './components/LanguageProviderWrapper.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProviderWrapper>
      <App />
    </LanguageProviderWrapper>
  </StrictMode>,
)
