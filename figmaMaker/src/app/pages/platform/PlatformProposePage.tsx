import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { usePlatform } from '../../contexts/PlatformContext';
import {
  ArrowLeft, Type, Clock, FileText, Target,
  StickyNote, ImagePlus, X, Send, CheckCircle2, MapPin,
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

export function PlatformProposePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addPlatform } = usePlatform();

  const [form, setForm] = useState({ title: '', scheduledDate: '', location: '', content: '', purpose: '', other: '' });
  const [posterFile, setPosterFile] = useState<string>('');
  const [posterPreview, setPosterPreview] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isYouthMember = currentUser?.department === '청년부';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    addPlatform({
      title: form.title,
      scheduledDate: form.scheduledDate,
      location: form.location,
      content: form.content,
      purpose: form.purpose,
      other: form.other,
      posterUrl: posterFile,
      proposedBy: currentUser.id,
      proposedByName: currentUser.name,
    });
    setSubmitted(true);
  };

  if (!isYouthMember) {
    return (
      <div className="flex flex-col min-h-full items-center justify-center text-center px-8 gap-4">
        <p className="text-gray-400 text-sm">청년부 소속 회원만 플랫폼을 제안할 수 있습니다.</p>
        <button onClick={() => navigate(-1)} className="text-blue-500 text-sm font-medium">돌아가기</button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col min-h-full items-center justify-center text-center px-8 gap-5">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg mb-1">제안이 접수되었습니다!</p>
          <p className="text-sm text-gray-500">
            관리자 승인 후 모집을 시작할 수 있습니다.
            <br />승인까지 1~3일 정도 소요될 수 있습니다.
          </p>
        </div>
        <button onClick={() => navigate('/platform')} className="mt-2 bg-blue-600 text-white px-8 py-3 rounded-2xl text-sm font-semibold active:bg-blue-700 transition">
          플랫폼 목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-900 text-base flex-1">플랫폼 제안하기</span>
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

        <div className="bg-blue-50 rounded-xl px-4 py-3 text-xs text-blue-600 leading-relaxed">
          💡 제출 후 관리자 검토를 거쳐 승인되면 모집이 시작됩니다. 승인까지 1~3일이 소요될 수 있습니다.
        </div>

        <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 text-white font-bold text-sm active:bg-blue-700 transition shadow-sm">
          <Send size={16} />
          제안 제출하기
        </button>

        <div className="h-4" />
      </form>
    </div>
  );
}
