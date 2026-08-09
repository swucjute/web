import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { setTokens, getMyProfile } from '../../utils/authClient';
import { Loader2 } from 'lucide-react';

export function KakaoCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithMember } = useAuth();
  const [error, setError] = useState('');
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (!accessToken || !refreshToken) {
      navigate('/login?error=kakao_login_failed', { replace: true });
      return;
    }

    setTokens({ accessToken, refreshToken });

    getMyProfile()
      .then((member) => {
        loginWithMember(member);

        if (!member.profileCompleted) {
          navigate('/signup', { replace: true });
        } else if (member.status === 'ACTIVE') {
          navigate('/', { replace: true });
        } else {
          navigate('/pending-approval', { replace: true });
        }
      })
      .catch(() => {
        setError('로그인 처리 중 오류가 발생했습니다.');
      });
  }, [searchParams, navigate, loginWithMember]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6 text-center gap-3">
        <p className="text-sm text-red-500">{error}</p>
        <button
          type="button"
          onClick={() => navigate('/login', { replace: true })}
          className="text-sm text-blue-600 font-medium"
        >
          로그인 화면으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-3">
      <Loader2 className="animate-spin text-blue-500" size={32} />
      <p className="text-sm text-gray-500">카카오 로그인 처리 중...</p>
    </div>
  );
}
