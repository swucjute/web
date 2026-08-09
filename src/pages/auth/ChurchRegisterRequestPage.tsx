import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

type Gender = '남자' | '여자' | '';

interface FormData {
  name: string;
  gender: Gender;
  phone: string;
  birthDate: string;
}

type PageState = 'form' | 'submitted';

export function ChurchRegisterRequestPage() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('form');
  const [form, setForm] = useState<FormData>({ name: '', gender: '', phone: '', birthDate: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
    let formatted = raw;
    if (raw.length > 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`;
    } else if (raw.length > 3) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    }
    setForm((f) => ({ ...f, phone: formatted }));
    setErrors((er) => ({ ...er, phone: '' }));
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
    setForm((f) => ({ ...f, birthDate: val }));
    setErrors((er) => ({ ...er, birthDate: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) newErrors.name = '이름을 입력해주세요.';
    if (!form.gender) newErrors.gender = '성별을 선택해주세요.';
    if (!form.phone || form.phone.replace(/\D/g, '').length < 10) newErrors.phone = '올바른 전화번호를 입력해주세요.';
    if (!form.birthDate || form.birthDate.length < 8) newErrors.birthDate = '생년월일 8자리를 입력해주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setPageState('submitted');
  };

  const canSubmit =
    form.name.trim().length > 0 &&
    form.gender !== '' &&
    form.phone.replace(/\D/g, '').length >= 10 &&
    form.birthDate.length === 8;

  if (pageState === 'submitted') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-[430px] h-screen bg-white flex flex-col">
          {/* Header */}
          <div className="relative flex items-center justify-center h-14 border-b border-gray-100 shrink-0">
            <button
              onClick={() => navigate('/login')}
              className="absolute left-3 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <span className="font-bold text-gray-900 text-base">교적 등록 요청</span>
          </div>

          {/* Success state */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-5">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
              <CheckCircle2 size={40} className="text-blue-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">요청이 전송되었습니다</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                관리자 승인 후 정식 가입이 완료됩니다.
                <br />
                승인 완료 시 바로 앱 사용이 가능합니다.
              </p>
            </div>

            {/* 제출 정보 요약 */}
            <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-left space-y-2.5 mt-2">
              <Row label="이름" value={form.name} />
              <Row label="성별" value={form.gender} />
              <Row label="전화번호" value={form.phone} />
              <Row label="생년월일" value={form.birthDate} />
            </div>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full py-4 rounded-2xl bg-blue-600 text-white text-base font-bold active:bg-blue-700 transition mt-2"
            >
              로그인 화면으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[430px] h-screen bg-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative flex items-center justify-center h-14 border-b border-gray-100 shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-3 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-900 text-base">교적 등록 요청</span>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-5 pt-6 pb-8">
          {/* 안내 */}
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            청년부 명단에 등록되지 않은 경우,<br />
            아래 정보를 입력하여 관리자에게 등록을 요청할 수 있습니다.
          </p>

          {/* 이름 */}
          <Field label="이름" error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm((f) => ({ ...f, name: e.target.value }));
                setErrors((er) => ({ ...er, name: '' }));
              }}
              placeholder="홍길동"
              className={inputClass(!!errors.name)}
            />
          </Field>

          {/* 성별 */}
          <Field label="성별" error={errors.gender}>
            <div className="grid grid-cols-2 gap-2">
              {(['남자', '여자'] as Gender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, gender: g }));
                    setErrors((er) => ({ ...er, gender: '' }));
                  }}
                  className={`py-3.5 rounded-2xl text-sm font-semibold border-2 transition ${
                    form.gender === g
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 text-gray-500 border-gray-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </Field>

          {/* 전화번호 */}
          <Field label="전화번호" error={errors.phone}>
            <input
              type="tel"
              inputMode="numeric"
              value={form.phone}
              onChange={handlePhoneChange}
              placeholder="010-0000-0000"
              className={inputClass(!!errors.phone)}
            />
          </Field>

          {/* 생년월일 */}
          <Field label="생년월일" error={errors.birthDate}>
            <input
              type="text"
              inputMode="numeric"
              value={form.birthDate}
              onChange={handleBirthDateChange}
              placeholder="YYYYMMDD"
              className={inputClass(!!errors.birthDate)}
            />
          </Field>

          {/* 제출 버튼 */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-4 rounded-2xl text-base font-bold transition mt-2 ${
              canSubmit ? 'bg-blue-600 text-white active:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            등록 요청 보내기
          </button>

          <p className="text-xs text-center text-gray-400 mt-3">관리자 승인 후 정식 가입이 완료됩니다</p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-700">{value}</span>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-4 py-3.5 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
    hasError ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-500'
  }`;
}
