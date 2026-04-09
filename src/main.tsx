import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import { PlatformProvider } from './contexts/PlatformContext'
import './index.css'

const queryClient = new QueryClient()

// Service Worker 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('Service Worker 등록 성공:', registration);
    }).catch((error) => {
      console.log('Service Worker 등록 실패:', error);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <PlatformProvider>
            <App />
          </PlatformProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
