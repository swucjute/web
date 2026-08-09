import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Church, Eye, EyeOff, ChevronDown, ChevronUp, X } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(email, password)) {
      navigate('/');
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const fillAccount = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setShowTestAccounts(false);
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setError('');
    setShowTestAccounts(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-[430px] min-h-screen bg-gradient-to-b from-blue-600 to-blue-700 flex flex-col">
        {/* Top section */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-6">
            <Church className="text-white" size={40} />
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">주뜨청년부</h1>
          <p className="text-blue-100 text-sm">서울여대 대학교회 청년부 앱</p>
        </div>

        {/* Bottom CTA */}
        <div className="px-6 pb-14 space-y-3">
          {/* 카카오 로그인 버튼 (비활성) */}
          <button
            type="button"
            onClick={() => navigate('/kakao-auth')}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-gray-800 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#F7E600' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1.5C4.86 1.5 1.5 4.19 1.5 7.5c0 2.1 1.29 3.95 3.24 5.04l-.83 3.08a.28.28 0 0 0 .42.3L7.9 13.8c.36.05.72.07 1.1.07 4.14 0 7.5-2.69 7.5-6S13.14 1.5 9 1.5z" fill="#3C1E1E"/>
            </svg>
            카카오 계정으로 로그인
          </button>

          {/* 테스트 로그인 버튼 */}
          <button
            type="button"
            onClick={() => setShowLoginModal(true)}
            className="w-full py-3.5 rounded-xl font-semibold text-sm text-blue-200 border border-blue-400/50 bg-white/10 active:bg-white/20 transition"
          >
            테스트 로그인
          </button>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end items-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative w-full max-w-[430px] bg-white rounded-t-3xl z-10 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">테스트 로그인</h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">이메일</label>
                  <input
                    type="email"
                    placeholder="email@church.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">비밀번호</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold text-sm active:bg-blue-700 transition"
                >
                  로그인
                </button>
              </form>

              {/* Test accounts */}
              <div>
                <button
                  onClick={() => setShowTestAccounts(!showTestAccounts)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-200"
                >
                  <span className="font-medium">테스트 계정 보기</span>
                  {showTestAccounts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {showTestAccounts && (
                  <div className="mt-2 space-y-2">
                    {[
                      { label: '관리자', email: 'admin@church.com', password: 'admin123', color: 'red' },
                      { label: '리더', email: 'leader@church.com', password: 'leader123', color: 'blue' },
                      { label: '회원', email: 'member@church.com', password: 'member123', color: 'green' },
                      { label: '승인대기', email: 'pending@church.com', password: 'pending123', color: 'amber' },
                    ].map((account) => (
                      <button
                        key={account.email}
                        onClick={() => fillAccount(account.email, account.password)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm active:bg-gray-50 transition"
                      >
                        <div className="text-left">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-1 ${
                            account.color === 'red' ? 'bg-red-100 text-red-700' :
                            account.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                            account.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {account.label}
                          </span>
                          <p className="text-gray-600">{account.email}</p>
                        </div>
                        <span className="text-blue-600 text-xs font-medium">선택</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="h-2" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
