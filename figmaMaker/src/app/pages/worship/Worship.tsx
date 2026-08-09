import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Plus, Church, Users, BookOpen, X, Trash2,
  Youtube, Mic, BookMarked, Gift, Megaphone, ChevronRight, ChevronLeft,
  Music, Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Worship as WorshipType } from '../../types';

type AnnouncementDraft = { id: string; title: string; description: string; surveyId: string };

const emptyForm = () => ({
  date: format(new Date(), 'yyyy-MM-dd'),
  title: '',
  preacher: '',
  scripture: '',
  scriptureText: '',
  sermonTitle: '',
  attendance: '',
  worshipLeader: '',
  notes: '',
  youtubeUrl: '',
  repPrayer: '',
  bibleReading: '',
  offeringCommittee: '',
});

function worshipToForm(w: WorshipType) {
  return {
    date: w.date,
    title: w.title,
    preacher: w.preacher,
    scripture: w.scripture,
    scriptureText: w.scriptureText ?? '',
    sermonTitle: w.sermonTitle,
    attendance: String(w.attendance),
    worshipLeader: w.worshipLeader,
    notes: w.notes,
    youtubeUrl: w.youtubeUrl ?? '',
    repPrayer: w.committee?.repPrayer ?? '',
    bibleReading: w.committee?.bibleReading ?? '',
    offeringCommittee: w.committee?.offering ?? '',
  };
}

function worshipToAnnouncements(w: WorshipType): AnnouncementDraft[] {
  return (w.announcements ?? []).map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    surveyId: a.surveyId ?? '',
  }));
}

// ── 공통 폼 UI ────────────────────────────────────────────────────────────
interface WorshipFormProps {
  title: string;
  formData: ReturnType<typeof emptyForm>;
  setFormData: React.Dispatch<React.SetStateAction<ReturnType<typeof emptyForm>>>;
  linkedPraises: { id: string; title: string; youtubeUrl?: string }[];
  announcements: AnnouncementDraft[];
  setAnnouncements: React.Dispatch<React.SetStateAction<AnnouncementDraft[]>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onDelete?: () => void;
  submitLabel: string;
  surveys: { id: string; title: string; isActive: boolean }[];
}

function WorshipForm({
  title, formData, setFormData, linkedPraises,
  announcements, setAnnouncements, onSubmit, onCancel, onDelete,
  submitLabel, surveys,
}: WorshipFormProps) {
  const fd = (field: keyof ReturnType<typeof emptyForm>, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const addAnn = () =>
    setAnnouncements((prev) => [...prev, { id: Date.now().toString(), title: '', description: '', surveyId: '' }]);
  const removeAnn = (id: string) => setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  const updateAnn = (id: string, field: keyof AnnouncementDraft, value: string) =>
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-t-3xl z-10 max-h-[92vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">{title}</h2>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4">
          <form onSubmit={onSubmit} className="space-y-5">

            {/* 기본 정보 */}
            <section className="space-y-3">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">기본 정보</p>
              <div className="space-y-1">
                <Label className="text-sm">날짜 *</Label>
                <Input type="date" value={formData.date} onChange={(e) => fd('date', e.target.value)} required className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">예배명 *</Label>
                <Input value={formData.title} onChange={(e) => fd('title', e.target.value)} placeholder="예: 주일 오전 예배" required className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">설교자 *</Label>
                <Input value={formData.preacher} onChange={(e) => fd('preacher', e.target.value)} required className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">설교 제목 *</Label>
                <Input value={formData.sermonTitle} onChange={(e) => fd('sermonTitle', e.target.value)} required className="rounded-xl" />
              </div>
              
            </section>

            {/* 본문 말씀 */}
            <section className="space-y-3">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={11} /> 본문 말씀
              </p>
              <div className="space-y-1">
                <Label className="text-sm">말씀 주소 *</Label>
                <Input value={formData.scripture} onChange={(e) => fd('scripture', e.target.value)} placeholder="예: 요한복음 3:16-17" required className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">말씀 본문 텍스트</Label>
                <Textarea
                  value={formData.scriptureText}
                  onChange={(e) => fd('scriptureText', e.target.value)}
                  rows={5}
                  placeholder="클릭 시 팝업으로 보여줄 말씀 본문을 입력하세요"
                  className="rounded-xl text-sm leading-7"
                />
              </div>
            </section>

            {/* 예배 위원 */}
            

            {/* 찬양 */}
            <section className="space-y-2">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Music size={11} /> 찬양 순서
              </p>
              {linkedPraises.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl px-4 py-4 text-center">
                  <Music size={20} className="text-gray-200 mx-auto mb-1.5" />
                  <p className="text-xs text-gray-400">찬양 관리에서 이 예배 날짜로</p>
                  <p className="text-xs text-gray-400">찬양을 등록하면 자동으로 표시됩니다</p>
                </div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm space-y-1.5">
                  {linkedPraises.map((song, idx) => (
                    <div key={song.id} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-purple-50 rounded-md flex items-center justify-center shrink-0">
                        <Music size={11} className="text-purple-400" />
                      </div>
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <span className="text-xs text-gray-400 shrink-0">{idx + 1}.</span>
                        <span className="text-sm text-gray-700 font-medium truncate">{song.title}</span>
                        {song.youtubeUrl && (
                          <Youtube size={11} className="text-red-400 shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar size={10} />
                찬양 관리 메뉴에서 수정할 수 있습니다
              </p>
            </section>

            {/* 광고 */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Megaphone size={11} /> 광고
                </p>
                <button type="button" onClick={addAnn} className="flex items-center gap-1 text-blue-600 text-xs font-semibold">
                  <Plus size={13} /> 추가
                </button>
              </div>
              {announcements.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-2">광고를 추가해보세요</p>
              )}
              {announcements.map((ann, idx) => (
                <div key={ann.id} className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600">광고 {idx + 1}</span>
                    <button type="button" onClick={() => removeAnn(ann.id)} className="text-gray-400 active:text-red-500"><X size={14} /></button>
                  </div>
                  <Input value={ann.title} onChange={(e) => updateAnn(ann.id, 'title', e.target.value)} placeholder="제목" className="rounded-lg text-sm bg-white" />
                  <Textarea value={ann.description} onChange={(e) => updateAnn(ann.id, 'description', e.target.value)} placeholder="설명" rows={2} className="rounded-lg text-sm bg-white" />
                  {surveys.length > 0 && (
                    <select value={ann.surveyId} onChange={(e) => updateAnn(ann.id, 'surveyId', e.target.value)} className="w-full text-xs text-gray-600 bg-white border border-gray-200 rounded-lg px-2 py-1.5">
                      <option value="">설문 연결 (선택사항)</option>
                      {surveys.filter((s) => s.isActive).map((s) => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </section>

            {/* 기타 */}
            <section className="space-y-3">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">기타</p>
              
              <div className="space-y-1">
                <Label className="text-sm flex items-center gap-1.5">
                  <Youtube size={14} className="text-red-500" /> 유튜브 라이브 링크
                </Label>
                <Input value={formData.youtubeUrl} onChange={(e) => fd('youtubeUrl', e.target.value)} placeholder="https://youtube.com/live/..." className="rounded-xl" />
                <p className="text-xs text-gray-400">예배 탭에 라이브 중계 버튼으로 표시됩니다</p>
              </div>
            </section>

            {/* 삭제 버튼 (수정 모드) */}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-xl w-full justify-center active:bg-red-100 transition"
              >
                <Trash2 size={14} />
                이 예배 기록 삭제
              </button>
            )}

            {/* 하단 버튼 */}
            <div className="flex gap-3 pt-1 pb-2">
              <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium">취소</button>
              <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium active:bg-blue-700 transition">{submitLabel}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────
export function Worship() {
  const navigate = useNavigate();
  const { isLeader } = useAuth();
  const { worships, addWorship, updateWorship, deleteWorship, praises, surveys } = useData();

  // 추가 폼
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm());
  const [addAnns, setAddAnns] = useState<AnnouncementDraft[]>([]);

  // 수정 폼
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm());
  const [editAnns, setEditAnns] = useState<AnnouncementDraft[]>([]);

  const canEdit = isLeader();

  const buildPayload = (form: ReturnType<typeof emptyForm>, anns: AnnouncementDraft[]) => ({
    date: form.date,
    title: form.title,
    preacher: form.preacher,
    scripture: form.scripture,
    scriptureText: form.scriptureText || undefined,
    sermonTitle: form.sermonTitle,
    attendance: parseInt(form.attendance) || 0,
    worshipLeader: form.worshipLeader,
    praiseList: [],
    offerings: 0,
    notes: form.notes,
    youtubeUrl: form.youtubeUrl || undefined,
    committee: {
      repPrayer: form.repPrayer || undefined,
      bibleReading: form.bibleReading || undefined,
      offering: form.offeringCommittee || undefined,
    },
    announcements: anns.filter((a) => a.title.trim()).map((a) => ({ ...a, surveyId: a.surveyId || undefined })),
  });

  // 추가
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addWorship(buildPayload(addForm, addAnns));
    setIsAddOpen(false);
    setAddForm(emptyForm());
    setAddAnns([]);
  };

  // 수정 시트 열기
  const openEdit = (id: string) => {
    const w = worships.find((x) => x.id === id);
    if (!w) return;
    setEditForm(worshipToForm(w));
    setEditAnns(worshipToAnnouncements(w));
    setEditingId(id);
  };

  // 수정 저장
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    updateWorship(editingId, buildPayload(editForm, editAnns));
    setEditingId(null);
  };

  // 삭제
  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteWorship(id);
      setEditingId(null);
    }
  };

  const sortedWorships = [...worships].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="flex flex-col">
      {/* 헤더 */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/more')}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition shrink-0"
            >
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">예배 관리</h1>
              <p className="text-xs text-gray-500">총 {worships.length}회 기록</p>
            </div>
          </div>
          {canEdit && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-sm font-medium active:bg-blue-700 transition"
            >
              <Plus size={16} />
              기록 추가
            </button>
          )}
        </div>
      </div>

      {/* 목록 */}
      <div className="px-4 py-3 space-y-3">
        {sortedWorships.length === 0 ? (
          <div className="py-16 text-center">
            <Church size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">예배 기록이 없습니다</p>
          </div>
        ) : (
          sortedWorships.map((worship) => (
            <div
              key={worship.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div
                className={`px-4 py-3.5 transition-colors ${canEdit ? 'cursor-pointer active:bg-gray-50' : ''}`}
                onClick={() => canEdit && openEdit(worship.id)}
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
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users size={11} />
                      <span>{worship.attendance}명</span>
                    </div>
                    {canEdit && <ChevronRight size={16} className="text-gray-300" />}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 추가 Bottom Sheet */}
      {isAddOpen && (
        <WorshipForm
          title="예배 기록 추가"
          formData={addForm}
          setFormData={setAddForm}
          linkedPraises={[]}
          announcements={addAnns}
          setAnnouncements={setAddAnns}
          onSubmit={handleAdd}
          onCancel={() => { setIsAddOpen(false); setAddForm(emptyForm()); setAddAnns([]); }}
          submitLabel="추가"
          surveys={surveys}
        />
      )}

      {/* 수정 Bottom Sheet */}
      {editingId && (
        <WorshipForm
          title="예배 기록 수정"
          formData={editForm}
          setFormData={setEditForm}
          linkedPraises={praises.filter((p) => p.worshipId === editingId)}
          announcements={editAnns}
          setAnnouncements={setEditAnns}
          onSubmit={handleEdit}
          onCancel={() => setEditingId(null)}
          onDelete={() => handleDelete(editingId)}
          submitLabel="저장"
          surveys={surveys}
        />
      )}
    </div>
  );
}