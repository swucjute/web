import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Plus, Church, Users, DollarSign, BookOpen, X, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function Worship() {
  const { isLeader } = useAuth();
  const { worships, addWorship, deleteWorship, praises } = useData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedWorship, setExpandedWorship] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    title: '',
    preacher: '',
    scripture: '',
    sermonTitle: '',
    attendance: '',
    worshipLeader: '',
    offerings: '',
    notes: '',
  });
  const [selectedPraises, setSelectedPraises] = useState<string[]>([]);

  const canEdit = isLeader();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWorship({
      date: formData.date,
      title: formData.title,
      preacher: formData.preacher,
      scripture: formData.scripture,
      sermonTitle: formData.sermonTitle,
      attendance: parseInt(formData.attendance),
      worshipLeader: formData.worshipLeader,
      praiseList: selectedPraises,
      offerings: parseFloat(formData.offerings),
      notes: formData.notes,
    });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      title: '',
      preacher: '',
      scripture: '',
      sermonTitle: '',
      attendance: '',
      worshipLeader: '',
      offerings: '',
      notes: '',
    });
    setSelectedPraises([]);
    setIsDrawerOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteWorship(id);
    }
  };

  const togglePraise = (praiseId: string) => {
    setSelectedPraises(prev =>
      prev.includes(praiseId) ? prev.filter(id => id !== praiseId) : [...prev, praiseId]
    );
  };

  const sortedWorships = [...worships].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">예배 관리</h1>
            <p className="text-xs text-gray-500">총 {worships.length}회 기록</p>
          </div>
          {canEdit && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-sm font-medium active:bg-blue-700 transition"
            >
              <Plus size={16} />
              기록 추가
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        {sortedWorships.length === 0 ? (
          <div className="py-16 text-center">
            <Church size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">예배 기록이 없습니다</p>
          </div>
        ) : (
          sortedWorships.map(worship => (
            <div key={worship.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Worship Card Header */}
              <div
                className="px-4 py-3.5 cursor-pointer active:bg-gray-50 transition-colors"
                onClick={() => setExpandedWorship(expandedWorship === worship.id ? null : worship.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                    <Church size={18} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">{worship.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {format(new Date(worship.date), 'yyyy년 M월 d일 (E)', { locale: ko })}
                    </p>
                    <p className="text-xs text-gray-500">{worship.preacher} 목사</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-gray-500 justify-end">
                        <Users size={11} />
                        <span>{worship.attendance}명</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 justify-end mt-0.5">
                        <DollarSign size={11} />
                        <span>{(worship.offerings / 10000).toFixed(0)}만원</span>
                      </div>
                    </div>
                    {expandedWorship === worship.id
                      ? <ChevronUp size={16} className="text-gray-400" />
                      : <ChevronDown size={16} className="text-gray-400" />
                    }
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedWorship === worship.id && (
                <div className="border-t border-gray-50 px-4 py-4 space-y-3 bg-gray-50/30">
                  <div className="flex items-start gap-2">
                    <BookOpen size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">설교</p>
                      <p className="text-sm font-medium text-gray-800">{worship.sermonTitle}</p>
                      <p className="text-xs text-gray-500 mt-0.5">본문: {worship.scripture}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">예배 인도자</p>
                      <p className="text-sm font-medium text-gray-800">{worship.worshipLeader}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">헌금</p>
                      <p className="text-sm font-medium text-gray-800">{worship.offerings.toLocaleString()}원</p>
                    </div>
                  </div>

                  {worship.praiseList.length > 0 && (
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">찬양 목록</p>
                      <div className="space-y-1">
                        {worship.praiseList.map(praiseId => {
                          const praise = praises.find(p => p.id === praiseId);
                          return praise ? (
                            <p key={praiseId} className="text-sm text-gray-700">• {praise.title} - {praise.artist}</p>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {worship.notes && (
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">비고</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{worship.notes}</p>
                    </div>
                  )}

                  {canEdit && (
                    <button
                      onClick={() => handleDelete(worship.id)}
                      className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl w-full justify-center active:bg-red-100 transition"
                    >
                      <Trash2 size={14} />
                      삭제
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Worship Bottom Sheet */}
      {isDrawerOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={resetForm} />
          <div className="relative bg-white rounded-t-3xl z-10 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">예배 기록 추가</h2>
              <button onClick={resetForm} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-sm">날짜 *</Label>
                  <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">예배명 *</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="예: 주일 오전 예배" required className="rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm">설교자 *</Label>
                    <Input value={formData.preacher} onChange={(e) => setFormData({ ...formData, preacher: e.target.value })} required className="rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">예배 인도자 *</Label>
                    <Input value={formData.worshipLeader} onChange={(e) => setFormData({ ...formData, worshipLeader: e.target.value })} required className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">본문 *</Label>
                  <Input value={formData.scripture} onChange={(e) => setFormData({ ...formData, scripture: e.target.value })} placeholder="예: 요한복음 3:16" required className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">설교 제목 *</Label>
                  <Input value={formData.sermonTitle} onChange={(e) => setFormData({ ...formData, sermonTitle: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm">출석 인원 *</Label>
                    <Input type="number" value={formData.attendance} onChange={(e) => setFormData({ ...formData, attendance: e.target.value })} required className="rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">헌금 (원) *</Label>
                    <Input type="number" value={formData.offerings} onChange={(e) => setFormData({ ...formData, offerings: e.target.value })} required className="rounded-xl" />
                  </div>
                </div>

                {praises.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm">찬양 곡 선택</Label>
                    <div className="border border-gray-200 rounded-xl p-3 max-h-36 overflow-y-auto space-y-2 bg-gray-50">
                      {praises.map(praise => (
                        <label key={praise.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPraises.includes(praise.id)}
                            onChange={() => togglePraise(praise.id)}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">{praise.title} - {praise.artist}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">선택된 찬양: {selectedPraises.length}곡</p>
                  </div>
                )}

                <div className="space-y-1">
                  <Label className="text-sm">비고</Label>
                  <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="rounded-xl" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={resetForm} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium">취소</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium active:bg-blue-700 transition">추가</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
