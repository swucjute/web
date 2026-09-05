import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { usePlatform } from '../../contexts/PlatformContext';
import { usePlatformDetail } from '../../hooks/usePlatformDetail';
import {
  ArrowLeft, Type, Clock, FileText, Target,
  StickyNote, ImagePlus, X, Send, MapPin,
} from 'lucide-react';

const inputBase =
  'w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none';

interface FieldProps {
  label: string;
  required?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}
function Field({ label, required, icon, children }: FieldProps) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5">
        {icon}
        <span>{label}</span>
        {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

export function PlatformEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const { updatePlatform } = usePlatform();
  const { data: platform, isLoading } = usePlatformDetail(id);

  const [form, setForm] = useState({ title: '', scheduledDate: '', location: '', content: '', purpose: '', other: '' });
  const [posterFile, setPosterFile] = useState<string>('');
  const [posterPreview, setPosterPreview] = useState<string>('');
  const [initialized, setInitialized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 상세 데이터가 도착하면 폼 초기값을 한 번만 채운다.
  useEffect(() => {
    if (platform && !initialized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        title: platform.title,
        scheduledDate: platform.scheduleText ?? '',
        location: platform.location ?? '',
        content: platform.content ?? '',
        purpose: platform.purpose ?? '',
        other: platform.etc ?? '',
      });
      setPosterPreview(platform.posterUrl ?? '');
      setPosterFile(platform.posterUrl ?? '');
      setInitialized(true);
    }
  }, [platform, initialized]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPosterFile(result);
      setPosterPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    await updatePlatform(id, {
      title: form.title,
      scheduleText: form.scheduledDate,
      location: form.location,
      content: form.content,
      purpose: form.purpose,
      etc: form.other,
      posterUrl: posterFile || undefined,
    });
    navigate(`/platform/${id}`);
  };

  if (isLoading || !initialized || !platform) {
    return (
      <div className="flex items-center justify-center min-h-full py-20 text-gray-400 text-sm">
        불러오는 중...
      </div>
    );
  }

  const isOwner = String(platform.ownerMemberId) === currentUser?.id;
  if (!isOwner && !isAdmin()) {
    navigate(-1);
    return null;
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-900 text-base flex-1">플랫폼 수정</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-4 py-5 space-y-5">
        {/* 포스터 */}
        <Field label="모집 포스터" icon={<ImagePlus size={12} />}>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden cursor-pointer active:border-blue-400 transition-colors flex items-center justify-center"
            style={{ aspectRatio: '3/4', maxHeight: 300 }}
          >
            {posterPreview ? (
              <>
                <img src={posterPreview} alt="포스터 미리보기" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPosterPreview(''); setPosterFile(''); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center"
                >
                  <X size={14} className="text-white" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-300 py-10">
                <ImagePlus size={36} strokeWidth={1.2} />
                <p className="text-xs">세로형 포스터를 업로드하세요</p>
                <p className="text-[10px] text-gray-200">3:4 비율 권장</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </Field>

        <div className="space-y-4 bg-white rounded-2xl p-4 shadow-sm">
          <Field label="플랫폼 제목" required icon={<Type size={12} />}>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="플랫폼 이름을 입력하세요" required className={inputBase} />
          </Field>
          <Field label="일시" required icon={<Clock size={12} />}>
            <input type="text" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} placeholder="예) 매주 토요일 오전 10:00" required className={inputBase} />
          </Field>
          <Field label="장소" required icon={<MapPin size={12} />}>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="예) 교회 소그룹실" required className={inputBase} />
          </Field>
        </div>

        <div className="space-y-4 bg-white rounded-2xl p-4 shadow-sm">
          <Field label="내용" required icon={<FileText size={12} />}>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="플랫폼의 활동 내용을 설명해 주세요" required rows={4} className={inputBase} />
          </Field>
          <Field label="목적" required icon={<Target size={12} />}>
            <textarea value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="이 플랫폼을 제안하는 목적을 작성해 주세요" required rows={3} className={inputBase} />
          </Field>
          <Field label="기타" icon={<StickyNote size={12} />}>
            <textarea value={form.other} onChange={(e) => setForm({ ...form, other: e.target.value })} placeholder="기타 전달 사항이 있다면 작성해 주세요 (선택)" rows={2} className={inputBase} />
          </Field>
        </div>

        <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 text-white font-bold text-sm active:bg-blue-700 transition shadow-sm">
          <Send size={16} />
          수정 완료
        </button>

        <div className="h-4" />
      </form>
    </div>
  );
}
