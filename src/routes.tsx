import { createBrowserRouter, Navigate } from 'react-router'
import { Layout } from './components/Layout'

// auth
import { Login } from './pages/auth/Login'

// home
import { Dashboard } from './pages/home/Dashboard'

// members
import { Members } from './pages/members/Members'
import { MemberEditPage } from './pages/members/MemberEditPage'

// finance
import { Finance } from './pages/finance/Finance'

// community
import { Community } from './pages/community/Community'
import { CommunityDetailPage } from './pages/community/CommunityDetailPage'

// calendar
import { CalendarPage } from './pages/calendar/CalendarPage'

// worship
import { WorshipTab } from './pages/worship/WorshipTab'
import { Worship } from './pages/worship/Worship'
import { WorshipDetailPage } from './pages/worship/WorshipDetailPage'
import { Praise } from './pages/worship/Praise'

// survey
import { Survey } from './pages/survey/Survey'

// platform
import { PlatformPage } from './pages/platform/PlatformPage'
import { PlatformProposePage } from './pages/platform/PlatformProposePage'
import { PlatformDetailPage } from './pages/platform/PlatformDetailPage'
import { PlatformManagePage } from './pages/platform/PlatformManagePage'

// more
import { MorePage } from './pages/more/MorePage'
import { MyProfilePage } from './pages/more/MyProfilePage'
import { MyPlatformsPage } from './pages/more/MyPlatformsPage'

// prayer
import { PrayerPage } from './pages/prayer/PrayerPage'

// eslint-disable-next-line react-refresh/only-export-components
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentUser = localStorage.getItem('currentUser')
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,                  element: <Dashboard /> },
      { path: 'members',              element: <Members /> },
      { path: 'members/edit/:id',     element: <MemberEditPage /> },
      { path: 'finance',              element: <Finance /> },
      { path: 'community',            element: <Community /> },
      { path: 'community/:id',        element: <CommunityDetailPage /> },
      { path: 'calendar',             element: <CalendarPage /> },
      { path: 'worship',              element: <WorshipTab /> },
      { path: 'worship/manage',       element: <Worship /> },
      { path: 'worship/:id',          element: <WorshipDetailPage /> },
      { path: 'praise',               element: <Praise /> },
      { path: 'survey',               element: <Survey /> },
      { path: 'more',                 element: <MorePage /> },
      { path: 'more/profile',         element: <MyProfilePage /> },
      { path: 'more/my-platforms',    element: <MyPlatformsPage /> },
      { path: 'prayer',               element: <PrayerPage /> },
      { path: 'platform',             element: <PlatformPage /> },
      { path: 'platform/propose',     element: <PlatformProposePage /> },
      { path: 'platform/manage',      element: <PlatformManagePage /> },
      { path: 'platform/:id',         element: <PlatformDetailPage /> },
    ],
  },
])
