import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { usePlatform } from '../../contexts/PlatformContext';
import {
  ArrowLeft, Users, ChevronRight, LayoutGrid, MapPin,
} from 'lucide-react';
import type { Platform } from '../../types';

const lifecycleMeta = {
  pending: { label: '승인 대기', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  active:  { label: '활성',     color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500'   },
};

const activeStateMeta = {
  recruiting: { label: '모집중',   color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  operating:  { label: '운영중',   color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500'  },
  ended:      { label: '운영종료', color: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400'  },
};

export function MyPlatformsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { platforms, toggleActiveState } = usePlatform();

  const myProposed = platforms.filter((p) => p.proposedBy === currentUser?.id);
  const myParticipating = platforms.filter((p) => (p.participants || []).includes(currentUser?.id || ''));

  const renderPlatformCard = (p: Platform, isProposed = false) => {
    const activeStates = p.activeStates || [];

    return (
      <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex gap-3 p-3">
          {/* 포스터 썸네일 */}
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center shrink-0 overflow-hidden">
            {p.posterUrl ? (
              <img src={p.posterUrl} alt="포스터" className="w-full h-full object-cover" />
            ) : (
              <LayoutGrid size={24} strokeWidth={1} className="text-blue-200" />
            )}
          </div>

          {/* 콘텐츠 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-bold text-gray-800 text-sm line-clamp-1">{p.title}</p>
              <button
                onClick={() => navigate(`/platform/${p.id}`)}
                className="flex items-center gap-0.5 text-xs text-blue-500 font-semibold shrink-0"
              >
                자세히<ChevronRight size={12} />
              </button>
            </div>

            {/* 상태 배지 */}
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              {p.lifecycle === 'pending' ? (
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${lifecycleMeta.pending.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${lifecycleMeta.pending.dot}`} />
                  {lifecycleMeta.pending.label}
                </span>
              ) : activeStates.length === 0 ? (
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${lifecycleMeta.active.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${lifecycleMeta.active.dot}`} />
                  {lifecycleMeta.active.label}
                </span>
              ) : (
                activeStates.map((state) => (
                  <span key={state} className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${activeStateMeta[state].color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${activeStateMeta[state].dot}`} />
                    {activeStateMeta[state].label}
                  </span>
                ))
              )}
            </div>

            {/* 정보 */}
            <div className="flex flex-col gap-1 text-xs text-gray-400">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{(p.participants || []).length}명 참여</span>
                </div>
                <span>{p.scheduledDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={11} />
                <span className="line-clamp-1">{p.location}</span>
              </div>
            </div>

            {/* 상태 토글 — 내가 제안한 플랫폼 중 active인 경우 */}
            {isProposed && p.lifecycle === 'active' && (
              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100">
                {(['recruiting', 'operating', 'ended'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleActiveState(p.id, s)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                      activeStates.includes(s)
                        ? `${activeStateMeta[s].color} ring-1 ring-inset ring-current`
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {activeStateMeta[s].label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-900 text-base flex-1">참여한 플랫폼</span>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 space-y-5">
        {/* 내가 제안한 플랫폼 */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            내가 제안한 플랫폼 ({myProposed.length})
          </p>
          {myProposed.length === 0 ? (
            <div className="bg-white rounded-2xl px-4 py-8 text-center text-gray-300 text-sm border border-gray-100">
              제안한 플랫폼이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {myProposed.map((p) => renderPlatformCard(p, true))}
            </div>
          )}
        </div>

        {/* 내가 참여한 플랫폼 */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            내가 참여한 플랫폼 ({myParticipating.length})
          </p>
          {myParticipating.length === 0 ? (
            <div className="bg-white rounded-2xl px-4 py-8 text-center text-gray-300 text-sm border border-gray-100">
              참여한 플랫폼이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {myParticipating.map((p) => renderPlatformCard(p, false))}
            </div>
          )}
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
