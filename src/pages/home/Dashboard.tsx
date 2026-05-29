import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Users, Calendar, Church, ChevronRight, Bell, ClipboardList, BookHeart } from 'lucide-react';
import { format, endOfWeek, endOfMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Link } from 'react-router';

export function Dashboard() {
  const { currentUser, users } = useAuth();
  const { events, worships, surveys, prayers } = useData();

  const activeMembers = users.filter(u => u.isActive).length;

  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(now, { weekStartsOn: 0 }), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');

  const sortedFutureEvents = events
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const thisWeekEvents = sortedFutureEvents.filter(e => e.date <= weekEnd);
  const thisMonthEvents = sortedFutureEvents.filter(e => e.date <= monthEnd);

  const upcomingEvents = thisWeekEvents.length > 0
    ? thisWeekEvents.slice(0, 3)
    : thisMonthEvents.length > 0
    ? thisMonthEvents.slice(0, 3)
    : sortedFutureEvents.slice(0, 3);

  const upcomingLabel = thisWeekEvents.length > 0
    ? '이번 주 일정'
    : thisMonthEvents.length > 0
    ? '이번 달 일정'
    : '다가오는 일정';

  const recentWorships = worships
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  const roleLabel =
    currentUser?.role === 'admin' ? '관리자' :
    currentUser?.role === 'leader' ? '리더' : '회원';

  return (
    <div className="space-y-0">
      {/* Welcome Banner */}
      <div className="bg-linear-to-br from-blue-600 to-blue-700 px-5 pt-5 pb-8">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-blue-200 text-sm">안녕하세요 👋</p>
            <h1 className="text-white text-xl font-bold mt-0.5">{currentUser?.name}님</h1>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-white/20 rounded-full text-white text-xs">{roleLabel}</span>
          </div>
          <button className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <Bell size={18} className="text-white" />
          </button>
        </div>
        <p className="text-blue-100 text-xs mt-3">{format(new Date(), 'yyyy년 M월 d일 (E)', { locale: ko })}</p>
      </div>

      <div className="px-4 -mt-4 space-y-4 pb-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/members" className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 block">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="text-blue-600" size={18} />
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{activeMembers}<span className="text-sm font-normal text-gray-500 ml-1">명</span></p>
            <p className="text-xs text-gray-500 mt-0.5">총 회원</p>
          </Link>

          <Link to="/calendar" className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 block">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                <Calendar className="text-purple-600" size={18} />
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{upcomingEvents.length}<span className="text-sm font-normal text-gray-500 ml-1">개</span></p>
            <p className="text-xs text-gray-500 mt-0.5">예정 일정</p>
          </Link>

          <Link to="/survey" className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 block">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
                <ClipboardList className="text-orange-500" size={18} />
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{surveys.length}<span className="text-sm font-normal text-gray-500 ml-1">개</span></p>
            <p className="text-xs text-gray-500 mt-0.5">진행 중 설문</p>
          </Link>

          <Link to="/prayer" className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 block">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center">
                <BookHeart className="text-rose-500" size={18} />
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{prayers.length}<span className="text-sm font-normal text-gray-500 ml-1">개</span></p>
            <p className="text-xs text-gray-500 mt-0.5">기도제목</p>
          </Link>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">{upcomingLabel}</h2>
            <Link to="/calendar" className="text-xs text-blue-600 font-medium flex items-center gap-0.5">
              전체보기 <ChevronRight size={14} />
            </Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Calendar size={32} className="text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">예정된 일정이 없습니다</p>
            </div>
          ) : (
            <div>
              {upcomingEvents.map((event, idx) => (
                <div key={event.id} className={`flex items-center gap-3 px-4 py-3.5 ${idx < upcomingEvents.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar className="text-blue-600" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{event.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {format(new Date(event.date), 'M월 d일 (E)', { locale: ko })} {event.time}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{event.location}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Worship */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">최근 예배</h2>
            <Link to="/worship" className="text-xs text-blue-600 font-medium flex items-center gap-0.5">
              전체보기 <ChevronRight size={14} />
            </Link>
          </div>
          {recentWorships.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Church size={32} className="text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">예배 기록이 없습니다</p>
            </div>
          ) : (
            <div>
              {recentWorships.map((worship, idx) => (
                <div key={worship.id} className={`flex items-center gap-3 px-4 py-3.5 ${idx < recentWorships.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                    <Church className="text-purple-600" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{worship.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {format(new Date(worship.date), 'M월 d일 (E)', { locale: ko })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-600">{worship.preacher}</p>
                    <p className="text-xs text-gray-400">{worship.attendance}명</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}