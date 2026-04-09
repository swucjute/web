import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Church, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showTestAccounts, setShowTestAccounts] = useState(false);
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

        {/* Login form card */}
        <div className="bg-white rounded-t-3xl px-6 pt-8 pb-10 shadow-2xl">
          <h2 className="text-xl font-bold text-gray-800 mb-6">로그인</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">이메일</label>
              <input
                type="email"
                placeholder="email@church.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
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
          <div className="mt-6">
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
                ].map((account) => (
                  <button
                    key={account.email}
                    onClick={() => fillAccount(account.email, account.password)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50 active:bg-gray-100 transition"
                  >
                    <div className="text-left">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-1 ${
                        account.color === 'red' ? 'bg-red-100 text-red-700' :
                        account.color === 'blue' ? 'bg-blue-100 text-blue-700' :
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
        </div>
      </div>
    </div>
  );
}
