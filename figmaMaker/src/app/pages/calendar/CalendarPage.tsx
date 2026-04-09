import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Calendar as CalendarIcon, Plus, Clock, MapPin, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';
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

export function CalendarPage() {
  const { isLeader } = useAuth();
  const { events, addEvent, deleteEvent } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({ ...formData, createdBy: 'current-user' });
    resetForm();
  };

  const resetForm = () => {
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

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

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
              const dayEvents = getEventsForDate(day);
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
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`h-1.5 rounded-full ${eventTypeColors[event.type] || 'bg-gray-400'}`}
                      />
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-[9px] text-gray-400 text-center">+{dayEvents.length - 2}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <h2 className="font-semibold text-gray-800 text-sm">
                {format(selectedDate, 'M월 d일 (E) 일정', { locale: ko })}
              </h2>
            </div>
            {selectedDateEvents.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-400 text-sm">이 날에는 일정이 없습니다</p>
              </div>
            ) : (
              <div>
                {selectedDateEvents.map((event, idx) => (
                  <div
                    key={event.id}
                    className={`px-4 py-3.5 ${idx < selectedDateEvents.length - 1 ? 'border-b border-gray-50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${eventTypeColors[event.type]}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${eventTypeBgColors[event.type]}`}>
                            {eventTypeLabels[event.type]}
                          </span>
                        </div>
                        <p className="font-medium text-gray-800 text-sm">{event.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={11} />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin size={11} />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        {event.description && (
                          <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                        )}
                      </div>
                      {canEdit && (
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 shrink-0"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">다가오는 일정</h2>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="py-8 text-center">
              <CalendarIcon size={32} className="text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">예정된 일정이 없습니다</p>
            </div>
          ) : (
            <div>
              {upcomingEvents.map((event, idx) => (
                <div
                  key={event.id}
                  className={`flex items-center gap-3 px-4 py-3.5 ${idx < upcomingEvents.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${eventTypeColors[event.type]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{event.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-gray-500">
                        {format(new Date(event.date), 'M월 d일 (E)', { locale: ko })} {event.time}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${eventTypeBgColors[event.type]}`}>
                    {eventTypeLabels[event.type]}
                  </span>
                  {canEdit && (
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
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
              <h2 className="font-bold text-gray-800">일정 추가</h2>
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
                <div className="space-y-1">
                  <Label className="text-sm">유형 *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="worship">예배</SelectItem>
                      <SelectItem value="meeting">모임</SelectItem>
                      <SelectItem value="event">행사</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
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
                    추가
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
