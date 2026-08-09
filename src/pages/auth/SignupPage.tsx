import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

// 등록된 청년부 회원 목업 데이터
const REGISTERED_MEMBERS = [
  { name: '김지원', birthDate: '19970623', phone: '010-****-4118', gender: '여', id: 'member-1' },
  { name: '이회원', birthDate: '19990315', phone: '010-****-2290', gender: '남', id: 'member-2' },
  { name: '박리더', birthDate: '19950801', phone: '010-****-5530', gender: '남', id: 'member-3' },
  { name: '최관리', birthDate: '19930412', phone: '010-****-7710', gender: '남', id: 'member-4' },
];

type ResultState =
  | { type: 'idle' }
  | { type: 'found'; name: string; birthDate: string; phone: string; gender: string }
  | { type: 'notfound' };

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<ResultState>({ type: 'idle' });
  const [isLoading, setIsLoading] = useState(false);

  const canSearch = name.trim().length > 0 && birthDate.trim().length === 8;

  const handleSearch = () => {
    if (!canSearch) return;
    setIsLoading(true);
    setTimeout(() => {
      const found = REGISTERED_MEMBERS.find(
        (m) => m.name === name.trim() && m.birthDate === birthDate.trim()
      );
      if (found) {
        setResult({ type: 'found', name: found.name, birthDate: found.birthDate, phone: found.phone, gender: found.gender });
      } else {
        setResult({ type: 'notfound' });
      }
      setIsLoading(false);
    }, 600);
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
    setBirthDate(val);
  };

  const handleConfirm = () => {
    // 실제 회원가입 연동 미구현 — 로그인 페이지로 임시 이동
    navigate('/login');
  };

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
          <span className="font-bold text-gray-900 text-base">회원가입</span>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pt-6">
          {/* 안내 섹션 */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">청년부 등록 조회</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              서울여대 대학교회 청년부에 등록한 교인인지 확인합니다.<br />
              카카오 계정의 실명과 동일해야 합니다.
            </p>
          </div>

          {/* 이름 입력 */}
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setResult({ type: 'idle' }); }}
              placeholder="이름"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* 생년월일 입력 */}
          <div className="mb-4">
            <input
              type="text"
              inputMode="numeric"
              value={birthDate}
              onChange={handleBirthDateChange}
              placeholder="생년월일 (YYYYMMDD)"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* 조회하기 버튼 */}
          <button
            type="button"
            onClick={handleSearch}
            disabled={!canSearch || isLoading}
            className={`w-full py-4 rounded-2xl text-base font-bold transition ${
              canSearch && !isLoading
                ? 'bg-blue-600 text-white active:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? '조회 중...' : '조회하기'}
          </button>

          {/* 결과 영역 */}
          <div className="mt-6">
            {result.type === 'idle' && (
              <div className="py-8 flex items-center justify-center">
                <p className="text-sm text-gray-300">조회 결과가 여기에 표시됩니다</p>
              </div>
            )}

            {result.type === 'found' && (
              <div className="space-y-4">
                {/* 조회된 회원 정보 카드 */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-gray-900">{result.name}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${result.gender === '여' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                      {result.gender}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{result.birthDate}</p>
                  <p className="text-sm text-gray-500">{result.phone}</p>
                </div>

                {/* 본인 확인 버튼 */}
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full py-4 rounded-2xl bg-blue-600 text-white text-base font-bold active:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  본인이 맞습니다.
                </button>

                <p className="text-xs text-center text-gray-400 leading-relaxed">
                  본인의 정보와 다를 경우,{'\n'}
                  임원단 또는 셀리더에게 문의바랍니다
                </p>
              </div>
            )}

            {result.type === 'notfound' && (
              <div className="space-y-4">
                {/* 미등록 안내 */}
                <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-500 leading-relaxed">
                    조회 결과가 없습니다.{'\n'}
                    교적 등록을 요청해주세요.
                  </p>
                </div>

                {/* 교적 등록 요청 버튼 */}
                <button
                  type="button"
                  onClick={() => navigate('/church-register-request')}
                  className="w-full py-4 rounded-2xl border-2 border-blue-600 text-blue-600 text-base font-bold active:bg-blue-50 transition"
                >
                  교적 등록 요청하기
                </button>
              </div>
            )}
          </div>

          {/* 개발 편의 임시 버튼 */}
          <div className="mt-10 mb-6 border-t border-dashed border-gray-200 pt-4">
            <p className="text-[10px] text-gray-300 text-center mb-2">[ 테스트용 임시 버튼 ]</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setName('김지원');
                  setBirthDate('19970623');
                  setResult({ type: 'found', name: '김지원', birthDate: '19970623', phone: '010-****-4118', gender: '여' });
                }}
                className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-medium border border-blue-200"
              >
                조회결과 (정상)
              </button>
              <button
                type="button"
                onClick={() => {
                  setName('홍길동');
                  setBirthDate('20000101');
                  setResult({ type: 'notfound' });
                }}
                className="flex-1 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-medium border border-red-200"
              >
                조회결과 (없음)
              </button>
              <button
                type="button"
                onClick={() => {
                  setName('');
                  setBirthDate('');
                  setResult({ type: 'idle' });
                }}
                className="flex-1 py-2 rounded-xl bg-gray-50 text-gray-500 text-xs font-medium border border-gray-200"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
