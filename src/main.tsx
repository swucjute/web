import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import { PlatformProvider } from './contexts/PlatformContext'
import './index.css'

const queryClient = new QueryClient()

// MSW 초기화 (development 환경에서만)
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    return worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}

// Service Worker 등록 (기존 sw.js)
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('Service Worker 등록 성공:', registration);
      }).catch((error) => {
        console.log('Service Worker 등록 실패:', error);
      });
    });
  }
}

// MSW를 시작한 후 앱 렌더링
enableMocking().then(() => {
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

  registerServiceWorker()
})
