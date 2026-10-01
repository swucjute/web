import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRegisterProfile, useLookupChurchMember } from '../../api/generated/member/member';
import { MemberProfileRegisterRequestDepartment } from '../../api/model';
import { ApiError } from '../../api/httpClient';
import { useAuth } from '../../contexts/AuthContext';

type ResultState =
  | { type: 'idle' }
  | { type: 'found'; name: string; birthDate: string; phone: string; gender: string }
  | { type: 'notfound' };

export function SignupPage() {
  const navigate = useNavigate();
  const { loginWithMember } = useAuth();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [result, setResult] = useState<ResultState>({ type: 'idle' });
  const [errorMessage, setErrorMessage] = useState('');

  const formattedBirthDate = birthDate.length === 8
    ? `${birthDate.slice(0, 4)}-${birthDate.slice(4, 6)}-${birthDate.slice(6, 8)}`
    : '';
  const canSearch = name.trim().length > 0
    && birthDate.length === 8
    && /^010-\d{4}-\d{4}$/.test(phoneNumber);

  const lookupQuery = useLookupChurchMember(
    { name: name.trim(), birthDate: formattedBirthDate, phoneNumber },
    { query: { enabled: false, retry: false } },
  );
  const registerMutation = useRegisterProfile();

  const handleSearch = async () => {
    if (!canSearch) return;
    setErrorMessage('');
    const response = await lookupQuery.refetch();
    const member = response.data?.data;

    if (response.isError || !member?.name || !member.birthDate || !member.phoneNumber || !member.gender) {
      if (response.error instanceof ApiError && response.error.status !== 404) {
        setErrorMessage('교적부 조회 중 오류가 발생했습니다.');
      }
      if (response.error instanceof ApiError && response.error.status === 401) {
        navigate('/login', { replace: true });
      } else {
        setResult({ type: 'notfound' });
      }
      return;
    }

    setResult({
      type: 'found',
      name: member.name,
      birthDate: member.birthDate,
      phone: member.phoneNumber,
      gender: member.gender === 'FEMALE' ? '여' : '남',
    });
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
    setBirthDate(val);
    setResult({ type: 'idle' });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
    const formatted = digits.length <= 3
      ? digits
      : digits.length <= 7
        ? `${digits.slice(0, 3)}-${digits.slice(3)}`
        : `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    setPhoneNumber(formatted);
    setResult({ type: 'idle' });
  };

  const handleConfirm = async () => {
    const member = lookupQuery.data?.data;
    if (!member?.gender || !member.name || !member.birthDate || !member.phoneNumber) return;

    setErrorMessage('');
    try {
      const response = await registerMutation.mutateAsync({
        data: {
          name: member.name,
          gender: member.gender,
          birthDate: member.birthDate,
          phoneNumber: member.phoneNumber,
          department: MemberProfileRegisterRequestDepartment.YOUTH,
        },
      });
      if (!response.data) throw new Error('회원 정보가 없습니다.');

      loginWithMember(response.data);
      navigate(response.data.status === 'ACTIVE' ? '/' : '/pending-approval', { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setErrorMessage('이미 등록되었거나 다른 계정에 연결된 교적 정보입니다.');
      } else {
        setErrorMessage('프로필 등록 중 오류가 발생했습니다.');
      }
    }
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

          <div className="mb-4">
            <input
              type="tel"
              inputMode="numeric"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="휴대폰 번호 (010-0000-0000)"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* 조회하기 버튼 */}
          <button
            type="button"
            onClick={handleSearch}
            disabled={!canSearch || lookupQuery.isFetching}
            className={`w-full py-4 rounded-2xl text-base font-bold transition ${
              canSearch && !lookupQuery.isFetching
                ? 'bg-blue-600 text-white active:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {lookupQuery.isFetching ? '조회 중...' : '조회하기'}
          </button>

          {errorMessage && (
            <p className="mt-3 text-sm text-center text-red-500">{errorMessage}</p>
          )}

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
                  disabled={registerMutation.isPending}
                  className="w-full py-4 rounded-2xl bg-blue-600 text-white text-base font-bold active:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  {registerMutation.isPending ? '등록 중...' : '본인이 맞습니다.'}
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

        </div>
      </div>
    </div>
  );
}
