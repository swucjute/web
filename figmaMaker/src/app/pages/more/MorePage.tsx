import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import {
  ChevronRight, LogOut, BookHeart, ClipboardCheck, FileText,
  LayoutGrid, CreditCard, Users, DollarSign, Calendar,
  Church, Music, ClipboardList, Pencil,
} from 'lucide-react';

const roleLabel = (role: string) =>
  role === 'admin' ? '관리자' : role === 'leader' ? '리더' : '회원';

const roleColor = (role: string) =>
  role === 'admin'
    ? 'bg-red-100 text-red-600'
    : role === 'leader'
    ? 'bg-purple-100 text-purple-600'
    : 'bg-blue-100 text-blue-600';

interface MenuItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  color: string;
  bg: string;
  soon?: boolean;
}

const activityItems: MenuItem[] = [
  { label: '내 기도제목 모아보기', icon: BookHeart, path: '/prayer', color: 'text-rose-500', bg: 'bg-rose-50' },
  { label: '참여한 설문 보기', icon: ClipboardCheck, path: '/survey', color: 'text-violet-500', bg: 'bg-violet-50' },
  { label: '작성한 글 보기', icon: FileText, path: '/community', color: 'text-sky-500', bg: 'bg-sky-50' },
  { label: '참여한 플랫폼 보기', icon: LayoutGrid, path: '/more/my-platforms', color: 'text-teal-500', bg: 'bg-teal-50' },
  { label: '재정 청구', icon: CreditCard, color: 'text-orange-500', bg: 'bg-orange-50', soon: true },
];

const manageItems: MenuItem[] = [
  { label: '교적 및 회원 관리', icon: Users, path: '/members', color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: '재정 관리', icon: DollarSign, path: '/finance', color: 'text-green-500', bg: 'bg-green-50' },
  { label: '플랫폼 관리', icon: LayoutGrid, path: '/more/platform-manage', color: 'text-teal-500', bg: 'bg-teal-50' },
  { label: '일정 관리', icon: Calendar, path: '/calendar', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { label: '예배 관리', icon: Church, path: '/worship/manage', color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: '찬양 관리', icon: Music, path: '/praise', color: 'text-pink-500', bg: 'bg-pink-50' },
  { label: '설문 관리', icon: ClipboardList, path: '/survey', color: 'text-purple-500', bg: 'bg-purple-50' },
];

function MenuRow({ item, onSoon }: { item: MenuItem; onSoon: () => void }) {
  const Icon = item.icon;
  if (item.soon || !item.path) {
    return (
      <button onClick={onSoon} className="flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-gray-50 active:bg-gray-100 transition-colors">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.bg}`}>
          <Icon size={18} className={item.color} />
        </div>
        <span className="flex-1 text-sm font-medium text-gray-700">{item.label}</span>
        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded mr-1">준비중</span>
        <ChevronRight size={15} className="text-gray-300" />
      </button>
    );
  }
  return (
    <Link to={item.path} className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.bg}`}>
        <Icon size={18} className={item.color} />
      </div>
      <span className="flex-1 text-sm font-medium text-gray-700">{item.label}</span>
      <ChevronRight size={15} className="text-gray-300" />
    </Link>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="px-4 pt-4 pb-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
      </div>
      <div className="divide-y divide-gray-50">{children}</div>
    </div>
  );
}

export function MorePage() {
  const { currentUser, logout, isLeader } = useAuth();
  const navigate = useNavigate();
  const [showSoonToast, setShowSoonToast] = useState(false);

  const handleSoonClick = () => {
    setShowSoonToast(true);
    setTimeout(() => setShowSoonToast(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* 내 정보 카드 */}
      <div className="px-4 pt-5 pb-4">
        <Link to="/more/profile" className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-transform block">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
            <span className="text-white text-2xl font-bold">{currentUser.name.charAt(0)}</span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-gray-900 text-base truncate">{currentUser.name}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${roleColor(currentUser.role)}`}>
                {roleLabel(currentUser.role)}
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
            {currentUser.position ? (
              <p className="text-xs text-gray-400 mt-0.5 truncate">{currentUser.department} · {currentUser.position}</p>
            ) : (
              <p className="text-xs text-gray-400 mt-0.5">{currentUser.department}</p>
            )}
          </div>
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Pencil size={14} className="text-blue-500" />
            </div>
            <span className="text-[10px] text-blue-500 font-medium">수정</span>
          </div>
        </Link>
      </div>

      {/* 활동 */}
      <div className="px-4 pb-3">
        <SectionCard title="활동">
          {activityItems.map((item) => (
            <MenuRow key={item.label} item={item} onSoon={handleSoonClick} />
          ))}
        </SectionCard>
      </div>

      {/* 관리 */}
      {isLeader() && (
        <div className="px-4 pb-3">
          <SectionCard title="관리">
            {manageItems.map((item) => (
              <MenuRow key={item.label} item={item} onSoon={handleSoonClick} />
            ))}
          </SectionCard>
        </div>
      )}

      {/* 로그아웃 */}
      <div className="px-4 pb-8">
        <button onClick={handleLogout} className="w-full bg-white rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
            <LogOut size={18} className="text-red-500" />
          </div>
          <span className="flex-1 text-sm font-medium text-left">로그아웃</span>
          <ChevronRight size={15} className="text-red-300" />
        </button>
      </div>

      {/* 준비중 토스트 */}
      {showSoonToast && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg whitespace-nowrap z-50">
          준비 중인 기능입니다 🚧
        </div>
      )}
    </div>
  );
}