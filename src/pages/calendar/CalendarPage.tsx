import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Calendar as CalendarIcon, Plus, Clock, MapPin, ChevronLeft, ChevronRight, X, Trash2, Pencil } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay, startOfWeek, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';

const eventTypeColors: Record<string, string> = {
  worship: 'bg-purple-500',
  meeting: 'bg-blue-500',
  event: 'bg-green-500',
  other: 'bg-gray-400',
};

const eventTypeBgColors: Record<string, string> = {
  worship: 'bg-purple-50 text-purple-700 border-purple-200',
  meeting: 'bg-blue-50 text-blue-700 border-blue-200',
  event: 'bg-green-50 text-green-700 border-green-200',
  other: 'bg-gray-50 text-gray-600 border-gray-200',
};

const eventTypeLabels: Record<string, string> = {
  worship: '예배',
  meeting: '모임',
  event: '행사',
  other: '기타',
};

const categoryDotColors: Record<string, string> = {
  예배: 'bg-purple-400',
  공지: 'bg-blue-400',
  전도: 'bg-green-400',
  행사: 'bg-orange-400',
};

const categoryBadgeColors: Record<string, string> = {
  예배: 'bg-purple-50 text-purple-700 border-purple-200',
  공지: 'bg-blue-50 text-blue-700 border-blue-200',
  전도: 'bg-green-50 text-green-700 border-green-200',
  행사: 'bg-orange-50 text-orange-700 border-orange-200',
};

type CalendarItem =
  | { id: string; title: string; date: string; source: 'event'; type: string; time: string; location: string; description: string }
  | { id: string; title: string; date: string; source: 'post'; category?: string; postId: string };

export function CalendarPage() {
  const navigate = useNavigate();
  const { isLeader } = useAuth();
  const { events, addEvent, updateEvent, deleteEvent, posts } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '10:00',
    location: '',
    type: 'event' as 'worship' | 'meeting' | 'event' | 'other',
  });

  const canEdit = isLeader();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calDays = eachDayOfInterval({ start: calStart, end: calEnd });

  // Posts with a date set
  const postsWithDate = posts.filter(p => p.date && p.date.length > 0);

  const getItemsForDate = (date: Date): CalendarItem[] => {
    const evItems: CalendarItem[] = events
      .filter(e => isSameDay(new Date(e.date), date))
      .map(e => ({ id: e.id, title: e.title, date: e.date, source: 'event', type: e.type, time: e.time, location: e.location, description: e.description }));
    const postItems: CalendarItem[] = postsWithDate
      .filter(p => isSameDay(new Date(p.date!), date))
      .map(p => ({ id: p.id, title: p.title, date: p.date!, source: 'post', category: p.category, postId: p.id }));
    return [...evItems, ...postItems];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateEvent(editingId, formData);
    } else {
      addEvent({ ...formData, createdBy: 'current-user' });
    }
    resetForm();
  };

  const handleEdit = (event: typeof events[0]) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
    });
    setIsDrawerOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '10:00',
      location: '',
      type: 'event',
    });
    setIsDrawerOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteEvent(id);
    }
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const upcomingItems: CalendarItem[] = [
    ...events
      .filter(e => e.date >= today)
      .map(e => ({ id: e.id, title: e.title, date: e.date, source: 'event' as const, type: e.type, time: e.time, location: e.location, description: e.description })),
    ...postsWithDate
      .filter(p => p.date! >= today)
      .map(p => ({ id: p.id, title: p.title, date: p.date!, source: 'post' as const, category: p.category, postId: p.id })),
  ]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const selectedDateItems = selectedDate ? getItemsForDate(selectedDate) : [];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">일정 관리</h1>
            <p className="text-xs text-gray-500">{format(currentDate, 'yyyy년 M월', { locale: ko })}</p>
          </div>
          {canEdit && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-sm font-medium active:bg-blue-700 transition"
            >
              <Plus size={16} />
              추가
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Month Navigation */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center active:bg-gray-100 transition"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">
                {format(currentDate, 'yyyy년 M월', { locale: ko })}
              </span>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"
              >
                오늘
              </button>
            </div>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center active:bg-gray-100 transition"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-gray-50">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
              <div
                key={day}
                className={`text-center text-xs py-2 font-medium ${
                  i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calDays.map((day, i) => {
              const dayItems = getItemsForDate(day);
              const isCurrentDay = isToday(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const dayOfWeek = getDay(day);

              return (
                <div
                  key={day.toString()}
                  onClick={() => setSelectedDate(isSameDay(day, selectedDate || new Date(0)) ? null : day)}
                  className={`relative min-h-[52px] p-1.5 border-b border-r border-gray-50 cursor-pointer transition-colors ${
                    i % 7 === 6 ? 'border-r-0' : ''
                  } ${isSelected ? 'bg-blue-50' : 'active:bg-gray-50'}`}
                >
                  <div className="flex justify-center mb-1">
                    <span
                      className={`text-xs w-6 h-6 flex items-center justify-center rounded-full ${
                        isCurrentDay
                          ? 'bg-blue-600 text-white font-semibold'
                          : isCurrentMonth
                          ? dayOfWeek === 0 ? 'text-red-400' : dayOfWeek === 6 ? 'text-blue-400' : 'text-gray-700'
                          : 'text-gray-300'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {dayItems.slice(0, 2).map(item => (
                      <div
                        key={item.id}
                        className={`h-1.5 rounded-full ${
                          item.source === 'event'
                            ? eventTypeColors[item.type] || 'bg-gray-400'
                            : categoryDotColors[item.category ?? ''] || 'bg-orange-400'
                        }`}
                      />
                    ))}
                    {dayItems.length > 2 && (
                      <p className="text-[9px] text-gray-400 text-center">+{dayItems.length - 2}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Items */}
        {selectedDate && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <h2 className="font-semibold text-gray-800 text-sm">
                {format(selectedDate, 'M월 d일 (E) 일정', { locale: ko })}
              </h2>
            </div>
            {selectedDateItems.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-400 text-sm">이 날에는 일정이 없습니다</p>
              </div>
            ) : (
              <div>
                {selectedDateItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`px-4 py-3.5 ${idx < selectedDateItems.length - 1 ? 'border-b border-gray-50' : ''} ${item.source === 'post' ? 'cursor-pointer active:bg-gray-50' : ''}`}
                    onClick={item.source === 'post' ? () => navigate(`/community/${item.postId}`) : undefined}
                  >
                    {item.source === 'event' ? (
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${eventTypeColors[item.type]}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${eventTypeBgColors[item.type]}`}>
                              {eventTypeLabels[item.type]}
                            </span>
                          </div>
                          <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock size={11} />
                              <span>{item.time}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin size={11} />
                              <span>{item.location}</span>
                            </div>
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                          )}
                        </div>
                        {canEdit && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={(e) => { e.stopPropagation(); const ev = events.find(ev => ev.id === item.id); if (ev) handleEdit(ev); }}
                              className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-400"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                              className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${categoryDotColors[item.category ?? ''] || 'bg-orange-400'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate">{item.title}</p>
                        </div>
                        {item.category && (
                          <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${categoryBadgeColors[item.category] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                            {item.category}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">다가오는 일정</h2>
          </div>
          {upcomingItems.length === 0 ? (
            <div className="py-8 text-center">
              <CalendarIcon size={32} className="text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">예정된 일정이 없습니다</p>
            </div>
          ) : (
            <div>
              {upcomingItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-3.5 ${idx < upcomingItems.length - 1 ? 'border-b border-gray-50' : ''} ${item.source === 'post' ? 'cursor-pointer active:bg-gray-50' : ''}`}
                  onClick={item.source === 'post' ? () => navigate(`/community/${item.postId}`) : undefined}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    item.source === 'event'
                      ? eventTypeColors[item.type]
                      : categoryDotColors[item.category ?? ''] || 'bg-orange-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-gray-500">
                        {format(new Date(item.date), 'M월 d일 (E)', { locale: ko })}
                        {item.source === 'event' && ` ${item.time}`}
                      </p>
                    </div>
                  </div>
                  {item.source === 'event' ? (
                    <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${eventTypeBgColors[item.type]}`}>
                      {eventTypeLabels[item.type]}
                    </span>
                  ) : item.category ? (
                    <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${categoryBadgeColors[item.category] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {item.category}
                    </span>
                  ) : null}
                  {item.source === 'event' && canEdit && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); const ev = events.find(ev => ev.id === item.id); if (ev) handleEdit(ev); }}
                        className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-400"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Event Bottom Sheet */}
      {isDrawerOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={resetForm} />
          <div className="relative bg-white rounded-t-3xl z-10 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editingId ? '일정 수정' : '일정 추가'}</h2>
              <button onClick={resetForm} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-sm">제목 *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">유형 *</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['worship', 'meeting', 'event', 'other'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type })}
                        className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl border-2 transition-all ${
                          formData.type === type
                            ? 'border-gray-700 bg-gray-50'
                            : 'border-gray-100 bg-white'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${eventTypeColors[type]}`} />
                        <span className={`text-xs font-medium ${formData.type === type ? 'text-gray-800' : 'text-gray-400'}`}>
                          {eventTypeLabels[type]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm">날짜 *</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">시간 *</Label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">장소 *</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">설명</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="rounded-xl"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium active:bg-blue-700 transition"
                  >
                    {editingId ? '수정' : '추가'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
