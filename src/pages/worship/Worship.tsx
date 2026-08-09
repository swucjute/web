import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Plus, Church, Users, X, Trash2, ChevronRight, ChevronLeft,
  Image, Music, Megaphone, BookOpen, UserCheck, Play, Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Worship as WorshipType, WorshipPraise } from '../../types';

type AnnouncementDraft = { id: string; title: string; description: string; surveyId: string };

const emptyForm = () => ({
  date: format(new Date(), 'yyyy-MM-dd'),
  title: '',
  preacher: '',
  worshipLeader: '',
  scripture: '',
  scriptureText: '',
  sermonTitle: '',
  attendance: '',
  offerings: '',
  notes: '',
  youtubeUrl: '',
  committeeRepPrayer: '',
  committeeBibleReading: '',
  committeeOffering: '',
});

type FormState = ReturnType<typeof emptyForm>;

function worshipToForm(w: WorshipType): FormState {
  return {
    date: w.date,
    title: w.title,
    preacher: w.preacher,
    worshipLeader: w.worshipLeader,
    scripture: w.scripture,
    scriptureText: w.scriptureText ?? '',
    sermonTitle: w.sermonTitle,
    attendance: String(w.attendance ?? ''),
    offerings: String(w.offerings ?? ''),
    notes: w.notes ?? '',
    youtubeUrl: w.youtubeUrl ?? '',
    committeeRepPrayer: w.committee?.repPrayer ?? '',
    committeeBibleReading: w.committee?.bibleReading ?? '',
    committeeOffering: w.committee?.offering ?? '',
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
  sheetTitle: string;
  formData: FormState;
  setFormData: React.Dispatch<React.SetStateAction<FormState>>;
  inlinePraises: WorshipPraise[];
  setInlinePraises: React.Dispatch<React.SetStateAction<WorshipPraise[]>>;
  linkedPraises: { id: string; title: string; artist: string; youtubeUrl?: string }[];
  bulletinImages: string[];
  setBulletinImages: React.Dispatch<React.SetStateAction<string[]>>;
  announcements: AnnouncementDraft[];
  setAnnouncements: React.Dispatch<React.SetStateAction<AnnouncementDraft[]>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onDelete?: () => void;
  submitLabel: string;
  surveys: { id: string; title: string; isActive: boolean }[];
}

function WorshipForm({
  sheetTitle, formData, setFormData, inlinePraises, setInlinePraises, linkedPraises,
  bulletinImages, setBulletinImages, announcements, setAnnouncements,
  onSubmit, onCancel, onDelete, submitLabel, surveys,
}: WorshipFormProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [praiseInput, setPraiseInput] = useState({ title: '', artist: '', youtubeUrl: '' });
  const [announcementInput, setAnnouncementInput] = useState({ title: '', description: '', surveyId: '' });

  const fd = (field: keyof FormState, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBulletinImages((prev) => [...prev, ev.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const addInlinePraise = () => {
    if (!praiseInput.title.trim()) return;
    setInlinePraises((prev) => [...prev, { id: Date.now().toString(), ...praiseInput }]);
    setPraiseInput({ title: '', artist: '', youtubeUrl: '' });
  };

  const addAnnouncement = () => {
    if (!announcementInput.title.trim()) return;
    setAnnouncements((prev) => [...prev, { id: Date.now().toString(), ...announcementInput }]);
    setAnnouncementInput({ title: '', description: '', surveyId: '' });
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-t-3xl z-10 max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <h2 className="font-bold text-gray-800">{sheetTitle}</h2>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4">
          <form onSubmit={onSubmit} className="space-y-6">

            {/* 기본 정보 */}
            <section className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">기본 정보</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-sm">날짜 *</Label>
                  <Input type="date" value={formData.date} onChange={(e) => fd('date', e.target.value)} required className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">예배명 *</Label>
                  <Input value={formData.title} onChange={(e) => fd('title', e.target.value)} placeholder="주일 2부 예배" required className="rounded-xl" />
                </div>
              </div>
            </section>

            {/* 설교 */}
            <section className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={12} /> 설교
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-sm">설교자 *</Label>
                  <Input value={formData.preacher} onChange={(e) => fd('preacher', e.target.value)} required className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">본문</Label>
                  <Input value={formData.scripture} onChange={(e) => fd('scripture', e.target.value)} placeholder="요한복음 3:16" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-sm">설교 제목 *</Label>
                <Input value={formData.sermonTitle} onChange={(e) => fd('sermonTitle', e.target.value)} required className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">본문 말씀 텍스트</Label>
                <Textarea value={formData.scriptureText} onChange={(e) => fd('scriptureText', e.target.value)} placeholder="말씀 본문을 입력하세요" rows={3} className="rounded-xl text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-sm flex items-center gap-1.5"><Play size={13} className="text-red-500" /> 예배 영상 URL</Label>
                <Input value={formData.youtubeUrl} onChange={(e) => fd('youtubeUrl', e.target.value)} placeholder="https://youtube.com/..." className="rounded-xl" />
              </div>
            </section>

            {/* 예배 정보 */}
            <section className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">예배 정보</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-sm">인도자 *</Label>
                  <Input value={formData.worshipLeader} onChange={(e) => fd('worshipLeader', e.target.value)} required className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">출석 인원</Label>
                  <Input type="number" value={formData.attendance} onChange={(e) => fd('attendance', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">헌금 (원)</Label>
                  <Input type="number" value={formData.offerings} onChange={(e) => fd('offerings', e.target.value)} className="rounded-xl" />
                </div>
              </div>
            </section>

            {/* 집례진 */}
            <section className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck size={12} /> 집례진
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-sm">대표기도</Label>
                  <Input value={formData.committeeRepPrayer} onChange={(e) => fd('committeeRepPrayer', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">말씀봉독</Label>
                  <Input value={formData.committeeBibleReading} onChange={(e) => fd('committeeBibleReading', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">봉헌위원</Label>
                  <Input value={formData.committeeOffering} onChange={(e) => fd('committeeOffering', e.target.value)} className="rounded-xl" />
                </div>
              </div>
            </section>

            {/* 찬양 */}
            <section className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Music size={12} /> 찬양 목록
              </p>

              {/* 찬양 관리(worshipId 연동)에서 등록된 곡 — 읽기 전용 */}
              {linkedPraises.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm space-y-1.5">
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-1">
                    <Calendar size={10} /> 찬양 관리 연동
                  </p>
                  {linkedPraises.map((song, idx) => (
                    <div key={song.id} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-4 shrink-0">{idx + 1}.</span>
                      <span className="text-sm text-gray-700 font-medium truncate flex-1">{song.title}</span>
                      {song.youtubeUrl && <Play size={12} className="text-red-400 shrink-0" />}
                    </div>
                  ))}
                </div>
              )}

              {inlinePraises.length > 0 && (
                <div className="space-y-2">
                  {inlinePraises.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                      <span className="text-xs text-gray-400 w-4 shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                        {p.artist && <p className="text-xs text-gray-400 truncate">{p.artist}</p>}
                      </div>
                      <button type="button" onClick={() => setInlinePraises((prev) => prev.filter((x) => x.id !== p.id))} className="text-gray-300 active:text-red-400 transition shrink-0">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input value={praiseInput.title} onChange={(e) => setPraiseInput({ ...praiseInput, title: e.target.value })} placeholder="곡 제목" className="rounded-lg text-sm h-9" />
                  <Input value={praiseInput.artist} onChange={(e) => setPraiseInput({ ...praiseInput, artist: e.target.value })} placeholder="아티스트" className="rounded-lg text-sm h-9" />
                </div>
                <div className="flex gap-2">
                  <Input value={praiseInput.youtubeUrl} onChange={(e) => setPraiseInput({ ...praiseInput, youtubeUrl: e.target.value })} placeholder="YouTube URL (선택)" className="rounded-lg text-sm h-9 flex-1" />
                  <button type="button" onClick={addInlinePraise} className="px-3 h-9 bg-blue-600 text-white rounded-lg text-sm font-medium shrink-0 active:bg-blue-700 transition">
                    추가
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400">찬양 관리 메뉴에서 이 날짜로 곡을 등록하면 위에 자동 표시됩니다</p>
            </section>

            {/* 주보 이미지 */}
            <section className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Image size={12} /> 주보 이미지
              </p>
              {bulletinImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-1">
                  {bulletinImages.map((img, i) => (
                    <div key={i} className="relative shrink-0">
                      <img src={img} alt={`주보 ${i + 1}`} className="h-24 w-auto rounded-xl object-cover border border-gray-100" />
                      <button type="button" onClick={() => setBulletinImages((prev) => prev.filter((_, idx) => idx !== i))} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
                        <X size={10} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input ref={imageInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              <button type="button" onClick={() => imageInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 active:bg-gray-50 transition">
                <Image size={16} />
                이미지 추가
              </button>
            </section>

            {/* 광고 */}
            <section className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Megaphone size={12} /> 광고
              </p>
              {announcements.length > 0 && (
                <div className="space-y-2">
                  {announcements.map((ann, i) => {
                    const linkedSurvey = ann.surveyId ? surveys.find((s) => s.id === ann.surveyId) : null;
                    return (
                      <div key={ann.id} className="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                        <span className="text-xs text-gray-400 w-4 shrink-0 mt-0.5">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{ann.title}</p>
                          {ann.description && <p className="text-xs text-gray-400 mt-0.5">{ann.description}</p>}
                          {linkedSurvey && (
                            <p className="text-xs text-blue-500 mt-0.5">설문 연결됨: {linkedSurvey.title}</p>
                          )}
                        </div>
                        <button type="button" onClick={() => setAnnouncements((prev) => prev.filter((x) => x.id !== ann.id))} className="text-gray-300 active:text-red-400 transition shrink-0 mt-0.5">
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                <Input value={announcementInput.title} onChange={(e) => setAnnouncementInput({ ...announcementInput, title: e.target.value })} placeholder="광고 제목" className="rounded-lg text-sm h-9" />
                <div className="flex gap-2">
                  <Input value={announcementInput.description} onChange={(e) => setAnnouncementInput({ ...announcementInput, description: e.target.value })} placeholder="내용 (선택)" className="rounded-lg text-sm h-9 flex-1" />
                  <button type="button" onClick={addAnnouncement} className="px-3 h-9 bg-blue-600 text-white rounded-lg text-sm font-medium shrink-0 active:bg-blue-700 transition">
                    추가
                  </button>
                </div>
                {surveys.length > 0 && (
                  <select
                    value={announcementInput.surveyId}
                    onChange={(e) => setAnnouncementInput({ ...announcementInput, surveyId: e.target.value })}
                    className="w-full text-xs text-gray-600 bg-white border border-gray-200 rounded-lg px-2 py-1.5"
                  >
                    <option value="">설문 연결 (선택사항)</option>
                    {surveys.filter((s) => s.isActive).map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                )}
              </div>
            </section>

            {/* 비고 */}
            <section className="space-y-1">
              <Label className="text-sm">비고</Label>
              <Textarea value={formData.notes} onChange={(e) => fd('notes', e.target.value)} rows={2} className="rounded-xl" />
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

            <div className="flex gap-3 pt-2 pb-2">
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
  const [addForm, setAddForm] = useState<FormState>(emptyForm());
  const [addInlinePraises, setAddInlinePraises] = useState<WorshipPraise[]>([]);
  const [addBulletinImages, setAddBulletinImages] = useState<string[]>([]);
  const [addAnns, setAddAnns] = useState<AnnouncementDraft[]>([]);

  // 수정 폼
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm());
  const [editInlinePraises, setEditInlinePraises] = useState<WorshipPraise[]>([]);
  const [editBulletinImages, setEditBulletinImages] = useState<string[]>([]);
  const [editAnns, setEditAnns] = useState<AnnouncementDraft[]>([]);

  const canEdit = isLeader();

  const resetAddState = () => {
    setIsAddOpen(false);
    setAddForm(emptyForm());
    setAddInlinePraises([]);
    setAddBulletinImages([]);
    setAddAnns([]);
  };

  const buildPayload = (
    form: FormState,
    inlinePraises: WorshipPraise[],
    bulletinImages: string[],
    anns: AnnouncementDraft[],
  ) => ({
    date: form.date,
    title: form.title,
    preacher: form.preacher,
    worshipLeader: form.worshipLeader,
    scripture: form.scripture,
    scriptureText: form.scriptureText,
    sermonTitle: form.sermonTitle,
    attendance: parseInt(form.attendance) || 0,
    offerings: parseFloat(form.offerings) || 0,
    notes: form.notes,
    youtubeUrl: form.youtubeUrl,
    praiseList: [],
    bulletinImages,
    committee: {
      repPrayer: form.committeeRepPrayer,
      bibleReading: form.committeeBibleReading,
      offering: form.committeeOffering,
    },
    announcements: anns.filter((a) => a.title.trim()).map((a) => ({ ...a, surveyId: a.surveyId || undefined })),
    inlinePraises,
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addWorship(buildPayload(addForm, addInlinePraises, addBulletinImages, addAnns));
    resetAddState();
  };

  const openEdit = (id: string) => {
    const w = worships.find((x) => x.id === id);
    if (!w) return;
    setEditForm(worshipToForm(w));
    setEditInlinePraises(w.inlinePraises ?? []);
    setEditBulletinImages(w.bulletinImages ?? []);
    setEditAnns(worshipToAnnouncements(w));
    setEditingId(id);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    updateWorship(editingId, buildPayload(editForm, editInlinePraises, editBulletinImages, editAnns));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteWorship(id);
      setEditingId(null);
    }
  };

  const sortedWorships = [...worships].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
            <div key={worship.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
          sheetTitle="예배 기록 추가"
          formData={addForm}
          setFormData={setAddForm}
          inlinePraises={addInlinePraises}
          setInlinePraises={setAddInlinePraises}
          linkedPraises={[]}
          bulletinImages={addBulletinImages}
          setBulletinImages={setAddBulletinImages}
          announcements={addAnns}
          setAnnouncements={setAddAnns}
          onSubmit={handleAdd}
          onCancel={resetAddState}
          submitLabel="추가"
          surveys={surveys}
        />
      )}

      {/* 수정 Bottom Sheet */}
      {editingId && (
        <WorshipForm
          sheetTitle="예배 기록 수정"
          formData={editForm}
          setFormData={setEditForm}
          inlinePraises={editInlinePraises}
          setInlinePraises={setEditInlinePraises}
          linkedPraises={praises.filter((p) => p.worshipId === editingId)}
          bulletinImages={editBulletinImages}
          setBulletinImages={setEditBulletinImages}
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
