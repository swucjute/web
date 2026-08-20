import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { usePlatform } from '../../contexts/PlatformContext';
import {
  Users, ChevronRight, LayoutGrid, MapPin, ArrowLeft,
} from 'lucide-react';
import type { Platform, PlatformOperatingStatus } from '../../types';

const approvalStatusMeta = {
  PENDING:  { label: '승인 대기', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  REJECTED: { label: '반려됨',   color: 'bg-red-100 text-red-700',      dot: 'bg-red-400'    },
};

const operatingStatusMeta: Record<PlatformOperatingStatus, { label: string; color: string; dot: string }> = {
  RECRUITING: { label: '모집중',   color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  ACTIVE:     { label: '운영중',   color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500'  },
  CLOSED:     { label: '모집종료', color: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400'  },
  FINISHED:   { label: '운영종료', color: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400'  },
  CANCELLED:  { label: '취소됨',   color: 'bg-gray-100 text-gray-400',   dot: 'bg-gray-300'  },
};

// 운영상태 변경 버튼 3개에 매핑할 값 (백엔드는 5개 값을 갖지만, 이 화면은 자주 쓰는 3개만 노출)
const operatingStatusChoices: PlatformOperatingStatus[] = ['RECRUITING', 'ACTIVE', 'FINISHED'];

export function MyPlatformsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { platforms, changeOperatingStatus } = usePlatform();

  const myProposed = platforms.filter((p) => String(p.ownerMemberId) === currentUser?.id);
  // TODO(백엔드): "내가 참여 중인 플랫폼" 목록 API가 없어서 당장은 채울 수 없다. 가입/승인 연동 시 함께 처리.
  const myParticipating: Platform[] = [];

  const renderPlatformCard = (p: Platform, isOwner = false) => (
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
            {p.approvalStatus === 'PENDING' || p.approvalStatus === 'REJECTED' ? (
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${approvalStatusMeta[p.approvalStatus].color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${approvalStatusMeta[p.approvalStatus].dot}`} />
                {approvalStatusMeta[p.approvalStatus].label}
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${operatingStatusMeta[p.operatingStatus].color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${operatingStatusMeta[p.operatingStatus].dot}`} />
                {operatingStatusMeta[p.operatingStatus].label}
              </span>
            )}
          </div>

          {/* 정보 */}
          <div className="flex flex-col gap-1 text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>{p.approvedMemberCount}명 참여</span>
              </div>
              <span>{p.scheduleText}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={11} />
              <span className="line-clamp-1">{p.location}</span>
            </div>
          </div>

          {/* 상태 변경 — 내가 제안한 플랫폼 중 승인된 경우 */}
          {isOwner && p.approvalStatus === 'APPROVED' && (
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-100">
              {operatingStatusChoices.map((s) => (
                <button
                  key={s}
                  onClick={() => changeOperatingStatus(p.id, s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    p.operatingStatus === s
                      ? `${operatingStatusMeta[s].color} ring-1 ring-inset ring-current`
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {operatingStatusMeta[s].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
          <div className="bg-white rounded-2xl px-4 py-8 text-center text-gray-300 text-sm border border-gray-100">
            준비 중인 기능입니다
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
