import { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Plus, Church, Users, DollarSign, X, Trash2, ChevronDown, ChevronUp,
  Image, Music, Megaphone, BookOpen, UserCheck,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { WorshipPraise } from '../../types';

export function Worship() {
  const { isLeader } = useAuth();
  const { worships, addWorship, deleteWorship } = useData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedWorship, setExpandedWorship] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // 기본 정보
  const [formData, setFormData] = useState({
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

  // 찬양 목록
  const [praises, setPraises] = useState<WorshipPraise[]>([]);
  const [praiseInput, setPraiseInput] = useState({ title: '', artist: '', youtubeUrl: '' });

  // 주보 이미지
  const [bulletinImages, setBulletinImages] = useState<string[]>([]);

  // 광고
  const [announcements, setAnnouncements] = useState<{ id: string; title: string; description: string }[]>([]);
  const [announcementInput, setAnnouncementInput] = useState({ title: '', description: '' });

  const canEdit = isLeader();

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

  const addPraise = () => {
    if (!praiseInput.title.trim()) return;
    setPraises((prev) => [...prev, { id: Date.now().toString(), ...praiseInput }]);
    setPraiseInput({ title: '', artist: '', youtubeUrl: '' });
  };

  const addAnnouncement = () => {
    if (!announcementInput.title.trim()) return;
    setAnnouncements((prev) => [...prev, { id: Date.now().toString(), ...announcementInput }]);
    setAnnouncementInput({ title: '', description: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWorship({
      date: formData.date,
      title: formData.title,
      preacher: formData.preacher,
      worshipLeader: formData.worshipLeader,
      scripture: formData.scripture,
      scriptureText: formData.scriptureText,
      sermonTitle: formData.sermonTitle,
      attendance: parseInt(formData.attendance) || 0,
      offerings: parseFloat(formData.offerings) || 0,
      notes: formData.notes,
      youtubeUrl: formData.youtubeUrl,
      praiseList: [],
      bulletinImages,
      committee: {
        repPrayer: formData.committeeRepPrayer,
        bibleReading: formData.committeeBibleReading,
        offering: formData.committeeOffering,
      },
      announcements,
      inlinePraises: praises,
    });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
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
    setPraises([]);
    setPraiseInput({ title: '', artist: '', youtubeUrl: '' });
    setBulletinImages([]);
    setAnnouncements([]);
    setAnnouncementInput({ title: '', description: '' });
    setIsDrawerOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deleteWorship(id);
    }
  };

  const sortedWorships = [...worships].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
          sortedWorships.map((worship) => (
            <div key={worship.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                        <span>{((worship.offerings || 0) / 10000).toFixed(0)}만원</span>
                      </div>
                    </div>
                    {expandedWorship === worship.id
                      ? <ChevronUp size={16} className="text-gray-400" />
                      : <ChevronDown size={16} className="text-gray-400" />
                    }
                  </div>
                </div>
              </div>

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
                      <p className="text-sm font-medium text-gray-800">{(worship.offerings || 0).toLocaleString()}원</p>
                    </div>
                  </div>

                  {worship.committee && (worship.committee.repPrayer || worship.committee.bibleReading || worship.committee.offering) && (
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">집례진</p>
                      <div className="space-y-1">
                        {worship.committee.repPrayer && <p className="text-xs text-gray-700">대표기도: {worship.committee.repPrayer}</p>}
                        {worship.committee.bibleReading && <p className="text-xs text-gray-700">말씀봉독: {worship.committee.bibleReading}</p>}
                        {worship.committee.offering && <p className="text-xs text-gray-700">봉헌위원: {worship.committee.offering}</p>}
                      </div>
                    </div>
                  )}

                  {worship.inlinePraises && worship.inlinePraises.length > 0 && (
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">찬양 목록</p>
                      <div className="space-y-1">
                        {worship.inlinePraises.map((p, i) => (
                          <p key={p.id} className="text-sm text-gray-700">{i + 1}. {p.title}{p.artist ? ` - ${p.artist}` : ''}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {worship.bulletinImages && worship.bulletinImages.length > 0 && (
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">주보 이미지 ({worship.bulletinImages.length}장)</p>
                      <div className="flex gap-2 overflow-x-auto">
                        {worship.bulletinImages.map((img, i) => (
                          <img key={i} src={img} alt={`주보 ${i + 1}`} className="h-20 w-auto rounded-lg shrink-0 object-cover" />
                        ))}
                      </div>
                    </div>
                  )}

                  {worship.announcements && worship.announcements.length > 0 && (
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">광고</p>
                      <div className="space-y-2">
                        {worship.announcements.map((ann, i) => (
                          <div key={ann.id}>
                            <p className="text-xs font-medium text-gray-800">{i + 1}. {ann.title}</p>
                            {ann.description && <p className="text-xs text-gray-500 mt-0.5">{ann.description}</p>}
                          </div>
                        ))}
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
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
              <h2 className="font-bold text-gray-800">예배 기록 추가</h2>
              <button onClick={resetForm} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* 기본 정보 */}
                <section className="space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">기본 정보</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-sm">날짜 *</Label>
                      <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="rounded-xl" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">예배명 *</Label>
                      <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="주일 2부 예배" required className="rounded-xl" />
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
                      <Input value={formData.preacher} onChange={(e) => setFormData({ ...formData, preacher: e.target.value })} required className="rounded-xl" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">본문</Label>
                      <Input value={formData.scripture} onChange={(e) => setFormData({ ...formData, scripture: e.target.value })} placeholder="요한복음 3:16" className="rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">설교 제목 *</Label>
                    <Input value={formData.sermonTitle} onChange={(e) => setFormData({ ...formData, sermonTitle: e.target.value })} required className="rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">본문 말씀 텍스트</Label>
                    <Textarea value={formData.scriptureText} onChange={(e) => setFormData({ ...formData, scriptureText: e.target.value })} placeholder="말씀 본문을 입력하세요" rows={3} className="rounded-xl text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm flex items-center gap-1.5"><Music size={13} className="text-red-500" /> 예배 영상 URL</Label>
                    <Input value={formData.youtubeUrl} onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })} placeholder="https://youtube.com/..." className="rounded-xl" />
                  </div>
                </section>

                {/* 예배 정보 */}
                <section className="space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">예배 정보</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-sm">인도자 *</Label>
                      <Input value={formData.worshipLeader} onChange={(e) => setFormData({ ...formData, worshipLeader: e.target.value })} required className="rounded-xl" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">출석 인원</Label>
                      <Input type="number" value={formData.attendance} onChange={(e) => setFormData({ ...formData, attendance: e.target.value })} className="rounded-xl" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">헌금 (원)</Label>
                      <Input type="number" value={formData.offerings} onChange={(e) => setFormData({ ...formData, offerings: e.target.value })} className="rounded-xl" />
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
                      <Input value={formData.committeeRepPrayer} onChange={(e) => setFormData({ ...formData, committeeRepPrayer: e.target.value })} className="rounded-xl" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">말씀봉독</Label>
                      <Input value={formData.committeeBibleReading} onChange={(e) => setFormData({ ...formData, committeeBibleReading: e.target.value })} className="rounded-xl" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm">봉헌위원</Label>
                      <Input value={formData.committeeOffering} onChange={(e) => setFormData({ ...formData, committeeOffering: e.target.value })} className="rounded-xl" />
                    </div>
                  </div>
                </section>

                {/* 찬양 */}
                <section className="space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Music size={12} /> 찬양 목록
                  </p>
                  {praises.length > 0 && (
                    <div className="space-y-2">
                      {praises.map((p, i) => (
                        <div key={p.id} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                          <span className="text-xs text-gray-400 w-4 shrink-0">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                            {p.artist && <p className="text-xs text-gray-400 truncate">{p.artist}</p>}
                          </div>
                          <button type="button" onClick={() => setPraises((prev) => prev.filter((x) => x.id !== p.id))} className="text-gray-300 active:text-red-400 transition shrink-0">
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
                      <button type="button" onClick={addPraise} className="px-3 h-9 bg-blue-600 text-white rounded-lg text-sm font-medium shrink-0 active:bg-blue-700 transition">
                        추가
                      </button>
                    </div>
                  </div>
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
                      {announcements.map((ann, i) => (
                        <div key={ann.id} className="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                          <span className="text-xs text-gray-400 w-4 shrink-0 mt-0.5">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800">{ann.title}</p>
                            {ann.description && <p className="text-xs text-gray-400 mt-0.5">{ann.description}</p>}
                          </div>
                          <button type="button" onClick={() => setAnnouncements((prev) => prev.filter((x) => x.id !== ann.id))} className="text-gray-300 active:text-red-400 transition shrink-0 mt-0.5">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
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
                  </div>
                </section>

                {/* 비고 */}
                <section className="space-y-1">
                  <Label className="text-sm">비고</Label>
                  <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} className="rounded-xl" />
                </section>

                <div className="flex gap-3 pt-2 pb-2">
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
