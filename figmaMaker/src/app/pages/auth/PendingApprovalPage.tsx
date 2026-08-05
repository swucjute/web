import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { CheckCircle2 } from 'lucide-react';

export function PendingApprovalPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[430px] h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="relative flex items-center justify-center h-14 border-b border-gray-100 shrink-0">
          <span className="font-bold text-gray-900 text-base">교적 등록 요청</span>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-5">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-blue-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">요청이 전송되었습니다</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              관리자 승인 후 정식 가입이 완료됩니다.<br/>
              승인 완료 시 별도의 안내 없이 바로 앱 사용이 가능합니다.
            </p>
          </div>

          {/* 요청 정보 요약 */}
          <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-left space-y-2.5 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">이름</span>
              <span className="text-sm font-medium text-gray-700">{currentUser?.name ?? '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">전화번호</span>
              <span className="text-sm font-medium text-gray-700">{currentUser?.phone ?? '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">상태</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-600">
                승인 대기중
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            문의사항은 임원단 또는 셀리더에게 연락해주세요.
          </p>
        </div>

        {/* 로그아웃 */}
        <div className="px-5 pb-10 pt-4 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3.5 rounded-2xl border border-gray-200 text-gray-500 text-sm font-medium active:bg-gray-50 transition"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
