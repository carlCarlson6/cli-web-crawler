import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider as UiProvider } from './components/ui/provider.tsx'
import { ClerkProvider } from '@clerk/clerk-react'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

export const BE_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
if (!BE_BASE_URL) {
  throw new Error('Add BE_BASE_URL to the .env file')
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <UiProvider>
        <App />
      </UiProvider>
    </ClerkProvider>
  </StrictMode>,
)
