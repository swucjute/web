import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { usePlatform } from '../../contexts/PlatformContext';
import {
  ArrowLeft, Users, ChevronRight,
  CheckCircle2, XCircle, MapPin, Clock,
} from 'lucide-react';
import type { PlatformOperatingStatus } from '../../types';

const operatingStatusMeta: Record<PlatformOperatingStatus, { label: string; color: string; dot: string }> = {
  RECRUITING: { label: '모집중',   color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  ACTIVE:     { label: '운영중',   color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500'  },
  CLOSED:     { label: '모집종료', color: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400'  },
  FINISHED:   { label: '운영종료', color: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400'  },
  CANCELLED:  { label: '취소됨',   color: 'bg-gray-100 text-gray-400',   dot: 'bg-gray-300'  },
};

const operatingStatusChoices: PlatformOperatingStatus[] = ['RECRUITING', 'ACTIVE', 'FINISHED'];

export function PlatformManagePage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { approvePlatform, rejectPlatform, changeOperatingStatus, platforms } = usePlatform();

  if (!isAdmin()) {
    navigate('/platform');
    return null;
  }

  const pending = platforms.filter((p) => p.approvalStatus === 'PENDING');
  const approved = platforms.filter((p) => p.approvalStatus === 'APPROVED');

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
                      <p className="text-xs text-gray-400 mt-0.5">제안자: {p.ownerName || '알 수 없음'}</p>
                      <div className="flex flex-col gap-0.5 mt-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={11} />
                          <span>{p.scheduleText}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={11} />
                          <span>{p.location}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/platform/${p.id}`)} className="text-xs text-blue-500 font-medium shrink-0">상세보기</button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approvePlatform(p.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-50 text-green-600 text-xs font-semibold active:bg-green-100 transition">
                      <CheckCircle2 size={13} />승인
                    </button>
                    <button onClick={() => rejectPlatform(p.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-semibold active:bg-red-100 transition">
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
            {approved.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{p.title}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${operatingStatusMeta[p.operatingStatus].color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${operatingStatusMeta[p.operatingStatus].dot}`} />
                        {operatingStatusMeta[p.operatingStatus].label}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={11} />
                        <span>{p.scheduleText}</span>
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
                      <Users size={12} />{p.approvedMemberCount}명
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
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
              </div>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
