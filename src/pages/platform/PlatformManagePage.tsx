import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { usePlatform } from '../../contexts/PlatformContext';
import {
  ArrowLeft, Users, ChevronRight,
  CheckCircle2, XCircle, MapPin, Clock,
} from 'lucide-react';

const lifecycleMeta = {
  pending: { label: '승인 대기', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  active:  { label: '활성',     color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500'   },
};

const activeStateMeta = {
  recruiting: { label: '모집중',   color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  operating:  { label: '운영중',   color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500'  },
  ended:      { label: '운영종료', color: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400'  },
};

export function PlatformManagePage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { approvePlatform, rejectPlatform, toggleActiveState, platforms } = usePlatform();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  if (!isAdmin()) {
    navigate('/platform');
    return null;
  }

  const pending = platforms.filter((p) => p.lifecycle === 'pending');
  const all = platforms.filter((p) => p.lifecycle !== 'pending');

  const handleReject = () => {
    if (rejectId) {
      rejectPlatform(rejectId, rejectReason);
      setRejectId(null);
      setRejectReason('');
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-900 text-base flex-1">플랫폼 관리</span>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 space-y-5">
        {/* 승인 대기 */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">승인 대기 ({pending.length})</p>
          {pending.length === 0 ? (
            <div className="bg-white rounded-2xl px-4 py-8 text-center text-gray-300 text-sm border border-gray-100">대기 중인 제안이 없습니다</div>
          ) : (
            <div className="space-y-3">
              {pending.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm">{p.title || '제목 없음'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">제안자: {p.proposedByName || '알 수 없음'}</p>
                      <div className="flex flex-col gap-0.5 mt-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={11} />
                          <span>{p.scheduledDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={11} />
                          <span>{p.location}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/platform/${p.id}`)} className="text-xs text-blue-500 font-medium shrink-0">상세보기</button>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{p.content || ''}</p>
                  <div className="flex gap-2">
                    <button onClick={() => approvePlatform(p.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-50 text-green-600 text-xs font-semibold active:bg-green-100 transition">
                      <CheckCircle2 size={13} />승인
                    </button>
                    <button onClick={() => setRejectId(p.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-semibold active:bg-red-100 transition">
                      <XCircle size={13} />반려
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 상태 관리 */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">플랫폼 상태 관리</p>
          <div className="space-y-3">
            {all.map((p) => {
              const activeStates = p.activeStates || [];
              return (
                <div key={p.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm">{p.title}</p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {activeStates.length === 0 ? (
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
                      <div className="flex flex-col gap-0.5 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={11} />
                          <span>{p.scheduledDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={11} />
                          <span>{p.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <button onClick={() => navigate(`/platform/${p.id}`)} className="flex items-center gap-0.5 text-xs text-blue-500 font-semibold">
                        자세히<ChevronRight size={12} />
                      </button>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Users size={12} />{(p.participants || []).length}명
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
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
                </div>
              );
            })}
          </div>
        </div>

        {/* 반려 모달 */}
        {rejectId && (
          <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: 430, margin: '0 auto', left: 0, right: 0 }}>
            <div className="absolute inset-0 bg-black/40" onClick={() => setRejectId(null)} />
            <div className="relative w-full bg-white rounded-t-3xl p-5 z-10">
              <p className="font-bold text-gray-800 mb-3">반려 사유 입력</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="반려 사유를 입력하세요..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              />
              <div className="flex gap-3 mt-3">
                <button onClick={() => setRejectId(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium">취소</button>
                <button onClick={handleReject} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold">반려하기</button>
              </div>
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}
