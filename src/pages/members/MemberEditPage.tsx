import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import {
  ArrowLeft,
  User,
  Phone,
  Cake,
  Building2,
  Briefcase,
  Mail,
  Shield,
  Landmark,
  CreditCard,
  Check,
  ChevronDown,
  CalendarDays,
  KeyRound,
} from 'lucide-react';

const BANKS = [
  '국민', '우리', '신한', '하나', '우체국',
  '기업', '농협', '외환', '제일', '씨티',
];

const roleLabel = (role: string) =>
  role === 'admin' ? '관리자' : role === 'leader' ? '리더' : '회원';

const roleColor = (role: string) =>
  role === 'admin'
    ? 'bg-red-100 text-red-600'
    : role === 'leader'
    ? 'bg-purple-100 text-purple-600'
    : 'bg-blue-100 text-blue-600';

const inputBase =
  'w-full border rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors';
const inputNormal = `${inputBase} border-gray-200 text-gray-800 bg-white`;

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}
function Field({ label, icon, children }: FieldProps) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1.5">
        {icon}
        <span>{label}</span>
      </label>
      {children}
    </div>
  );
}

const ROLES = [
  { value: 'member', label: '회원' },
  { value: 'leader', label: '리더' },
  { value: 'admin', label: '관리자' },
];

export function MemberEditPage() {
  const { id } = useParams<{ id: string }>();
  const { users, updateUser } = useAuth();
  const navigate = useNavigate();

  const target = users.find((u) => u.id === id);

  const [form, setForm] = useState({
    name: target?.name ?? '',
    email: target?.email ?? '',
    password: target?.password ?? '',
    role: target?.role ?? 'member',
    phone: target?.phone ?? '',
    birthDate: target?.birthDate ?? '',
    joinDate: target?.joinDate ?? '',
    department: target?.department ?? '',
    position: target?.position ?? '',
    bank: target?.bank ?? '',
    accountNumber: target?.accountNumber ?? '',
  });

  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!target) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full py-20 text-gray-400">
        <p>회원을 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/members')} className="mt-4 text-blue-500 text-sm">
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const handleSave = () => {
    updateUser(target.id, form);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate('/members');
    }, 900);
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Page Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-900 text-base flex-1">회원 정보 수정</span>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              saved ? 'bg-green-100 text-green-600' : 'bg-blue-600 text-white active:bg-blue-700'
            }`}
          >
            <Check size={13} />
            {saved ? '저장됨' : '저장'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* 아바타 영역 */}
        <div className="bg-white flex flex-col items-center py-7 border-b border-gray-100">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg mb-3">
            <span className="text-white text-3xl font-bold">{form.name.charAt(0) || '?'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-lg">{form.name || '이름 없음'}</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${roleColor(form.role)}`}>
              {roleLabel(form.role)}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            가입일 {target.joinDate?.replace(/-/g, '.')}
          </p>
        </div>

        <div className="px-4 py-5 space-y-5">
          {/* ── 계정 정보 ── */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">계정 정보</p>
            <div className="bg-white rounded-2xl p-4 space-y-4 shadow-sm">
              <Field label="이메일" icon={<Mail size={12} />}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputNormal}
                />
              </Field>

              <Field label="비밀번호" icon={<KeyRound size={12} />}>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="변경할 비밀번호 입력"
                  className={inputNormal}
                />
              </Field>

              {/* 권한 드롭다운 */}
              <Field label="권한" icon={<Shield size={12} />}>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className={`${inputNormal} flex items-center justify-between text-left`}
                  >
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${roleColor(form.role)}`}>
                      {roleLabel(form.role)}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {showRoleDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowRoleDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                        {ROLES.map((r) => (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => { setForm({ ...form, role: r.value as 'admin' | 'leader' | 'member' }); setShowRoleDropdown(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                              form.role === r.value ? 'bg-blue-50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${roleColor(r.value)}`}>
                              {r.label}
                            </span>
                            {form.role === r.value && <Check size={14} className="ml-auto text-blue-500" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </Field>
            </div>
          </div>

          {/* ── 기본 정보 ── */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">기본 정보</p>
            <div className="bg-white rounded-2xl p-4 space-y-4 shadow-sm">
              <Field label="이름" icon={<User size={12} />}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputNormal}
                />
              </Field>

              <Field label="전화번호" icon={<Phone size={12} />}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="010-0000-0000"
                  className={inputNormal}
                />
              </Field>

              <Field label="생년월일" icon={<Cake size={12} />}>
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                  className={inputNormal}
                />
              </Field>

              <Field label="등록일" icon={<CalendarDays size={12} />}>
                <input
                  type="date"
                  value={form.joinDate}
                  onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
                  className={inputNormal}
                />
              </Field>
            </div>
          </div>

          {/* ── 소속 정보 ── */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">소속 정보</p>
            <div className="bg-white rounded-2xl p-4 space-y-4 shadow-sm">
              <Field label="소속" icon={<Building2 size={12} />}>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="청년부"
                  className={inputNormal}
                />
              </Field>

              <Field label="직분" icon={<Briefcase size={12} />}>
                <input
                  type="text"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="예) 소그룹 리더, 찬양팀"
                  className={inputNormal}
                />
              </Field>
            </div>
          </div>

          {/* ── 계좌 정보 ── */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">계좌 정보</p>
            <div className="bg-white rounded-2xl p-4 space-y-4 shadow-sm">
              <Field label="은행" icon={<Landmark size={12} />}>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowBankDropdown(!showBankDropdown)}
                    className={`${inputNormal} flex items-center justify-between text-left ${
                      !form.bank ? 'text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    <span>{form.bank || '은행 선택'}</span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform ${showBankDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {showBankDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowBankDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                        <div className="grid grid-cols-2">
                          <button
                            type="button"
                            onClick={() => { setForm({ ...form, bank: '' }); setShowBankDropdown(false); }}
                            className="col-span-2 px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-50 text-left border-b border-gray-100"
                          >
                            선택 안함
                          </button>
                          {BANKS.map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              onClick={() => { setForm({ ...form, bank }); setShowBankDropdown(false); }}
                              className={`px-4 py-3 text-sm text-left transition-colors ${
                                form.bank === bank
                                  ? 'bg-blue-50 text-blue-600 font-semibold'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {form.bank === bank && <span className="mr-1">✓</span>}
                              {bank}은행
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Field>

              <Field label="계좌번호" icon={<CreditCard size={12} />}>
                <input
                  type="text"
                  value={form.accountNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d-]/g, '');
                    setForm({ ...form, accountNumber: val });
                  }}
                  placeholder="계좌번호 입력 (숫자만)"
                  inputMode="numeric"
                  className={inputNormal}
                />
              </Field>

              {(form.bank || form.accountNumber) && (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                  <p className="text-[10px] font-medium opacity-75 mb-1">등록 계좌</p>
                  <p className="text-sm font-bold">
                    {form.bank ? `${form.bank}은행` : '은행 미선택'}{' '}
                    <span className="font-normal opacity-90">{form.accountNumber || '계좌번호 미입력'}</span>
                  </p>
                  <p className="text-[11px] opacity-75 mt-1">{form.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* 저장 버튼 */}
          <button
            onClick={handleSave}
            className={`w-full rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
              saved ? 'bg-green-500 text-white' : 'bg-blue-600 text-white active:bg-blue-700'
            }`}
          >
            <Check size={16} />
            {saved ? '저장되었습니다!' : '저장하기'}
          </button>

          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}
