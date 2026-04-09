import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { PlatformProvider } from './contexts/PlatformContext';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <PlatformProvider>
          <RouterProvider router={router} />
          <Toaster />
        </PlatformProvider>
      </DataProvider>
    </AuthProvider>
  );
}