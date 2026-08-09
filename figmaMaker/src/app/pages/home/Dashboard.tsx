import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Users, DollarSign, Calendar, Church, ChevronRight, Bell, ClipboardList, BookHeart } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Link } from 'react-router';

export function Dashboard() {
  const { currentUser, users } = useAuth();
  const { finances, events, worships, surveys, prayers } = useData();

  const activeMembers = users.filter(u => u.isActive).length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyIncome = finances
    .filter(f => f.type === 'income' &&
      new Date(f.date).getMonth() === currentMonth &&
      new Date(f.date).getFullYear() === currentYear)
    .reduce((sum, f) => sum + f.amount, 0);

  const monthlyExpense = finances
    .filter(f => f.type === 'expense' &&
      new Date(f.date).getMonth() === currentMonth &&
      new Date(f.date).getFullYear() === currentYear)
    .reduce((sum, f) => sum + f.amount, 0);

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const recentWorships = worships
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  const roleLabel =
    currentUser?.role === 'admin' ? '관리자' :
    currentUser?.role === 'leader' ? '리더' : '회원';

  return (
    <div className="space-y-0">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-5 pt-5 pb-8">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-blue-200 text-sm">주뜨청년부</p>
            <h1 className="text-white text-xl font-bold mt-0.5">{currentUser?.name}님</h1>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-white/20 rounded-full text-white text-xs">{roleLabel}</span>
          </div>
          <button className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <Bell size={18} className="text-white" />
          </button>
        </div>
        
      </div>

      <div className="px-4 -mt-4 space-y-4 pb-4">
        {/* Stats Cards */}
        

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">이번주 일정</h2>
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
        

        {/* Quick Actions */}
        
      </div>
    </div>
  );
}