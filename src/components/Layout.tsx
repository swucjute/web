import { Outlet, Link, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import {
  Home,
  Church,
  MoreHorizontal,
  LayoutGrid,
  Users,
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  soon?: boolean;
}

const mainNavItems: NavItem[] = [
  { path: '/', label: '홈', icon: Home },
  { path: '/worship', label: '예배', icon: Church },
  { path: '/platform', label: '플랫폼', icon: LayoutGrid },
  { path: '/community', label: '커뮤니티', icon: Users },
  { path: '/more', label: '더보기', icon: MoreHorizontal },
];

export function Layout() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [showSoon, setShowSoon] = useState(false);

  const handleSoonClick = () => {
    setShowSoon(true);
    setTimeout(() => setShowSoon(false), 2000);
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-200">
      {/* Phone frame wrapper */}
      <div className="relative w-full max-w-[430px] min-h-screen bg-gray-50 flex flex-col shadow-2xl">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        </header>

        {/* Main Content — pb-16 so content clears the fixed nav */}
        <main className="flex-1 overflow-y-auto pb-16">
          <Outlet />
        </main>

        {/* Bottom Navigation — fixed to viewport bottom, centered within max-width */}
        <nav className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[430px] bg-white border-t border-gray-100 z-40">
          <div className="flex items-center justify-around h-16 px-2">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname === item.path ||
                    location.pathname.startsWith(item.path + '/');

              if (item.soon) {
                return (
                  <button
                    key={item.path}
                    onClick={handleSoonClick}
                    className="flex flex-col items-center gap-1 flex-1 py-2 transition-colors text-gray-400"
                  >
                    <Icon size={22} strokeWidth={1.8} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 flex-1 py-2 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* 준비중 토스트 */}
        {showSoon && (
          <div className="fixed bottom-20 left-0 right-0 mx-auto w-fit max-w-[430px] z-50 flex justify-center pointer-events-none">
            <div className="bg-gray-800 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
              준비 중인 기능입니다 🚧
            </div>
          </div>
        )}
      </div>
    </div>
  );
}