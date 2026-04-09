import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { usePlatform } from '../../contexts/PlatformContext';
import { Platform } from '../../types';
import {
  Plus, Users, Clock, CheckCircle2, XCircle,
  LayoutGrid, ChevronRight, Settings2, Sparkles,
} from 'lucide-react';

const statusMeta = {
  pending:    { label: '승인 대기', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  recruiting: { label: '모집중',   color: 'bg-green-100 text-green-700',   dot: 'bg-green-500'  },
  operating:  { label: '운영중',   color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500'   },
  ended:      { label: '운영종료', color: 'bg-gray-100 text-gray-500',     dot: 'bg-gray-400'   },
};

function PlatformCard({ platform, onPress }: { platform: Platform; onPress: () => void }) {
  const meta = statusMeta[platform.status];
  return (
    <button
      onClick={onPress}
      className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform text-left"
    >
      <div className="relative w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
           style={{ aspectRatio: '3/4', maxHeight: 220 }}>
        {platform.posterUrl ? (
          <img src={platform.posterUrl} alt="포스터" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-blue-300">
            <LayoutGrid size={36} strokeWidth={1.2} />
            <span className="text-xs">포스터 없음</span>
          </div>
        )}
        <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${meta.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{platform.title}</p>
        <p className="text-xs text-gray-500 line-clamp-1 mb-2">{platform.scheduledDate}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Users size={12} />
            <span>{platform.participants.length}명 참여</span>
          </div>
          <div className="flex items-center gap-0.5 text-xs text-blue-500 font-medium">
            <span>자세히</span>
            <ChevronRight size={12} />
          </div>
        </div>
      </div>
    </button>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-20 flex flex-col items-center text-gray-300">
      <LayoutGrid size={44} strokeWidth={1} />
      <p className="mt-3 text-sm">{label}</p>
    </div>
  );
}

type TabKey = 'recruiting' | 'operating' | 'ended' | 'manage';

export function PlatformPage() {
  const { currentUser, isAdmin } = useAuth();
  const { platforms } = usePlatform();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('recruiting');

  const isYouthMember = currentUser?.department === '청년부';

  const recruiting = platforms.filter((p) => p.status === 'recruiting');
  const operating  = platforms.filter((p) => p.status === 'operating');
  const ended      = platforms.filter((p) => p.status === 'ended');
  const pending    = platforms.filter((p) => p.status === 'pending');

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'recruiting', label: '모집중',  count: recruiting.length },
    { key: 'operating',  label: '운영중',  count: operating.length  },
    { key: 'ended',      label: '종료',    count: ended.length      },
    ...(isAdmin() ? [{ key: 'manage' as TabKey, label: '관리', count: pending.length }] : []),
  ];

  const renderList = (list: Platform[]) => {
    if (list.length === 0) return <EmptyState label="플랫폼이 없습니다" />;
    return (
      <div className="grid grid-cols-2 gap-3">
        {list.map((p) => (
          <PlatformCard key={p.id} platform={p} onPress={() => navigate(`/platform/${p.id}`)} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">플랫폼</h1>
            <p className="text-xs text-gray-400 mt-0.5">청년부 동아리 & 모임</p>
          </div>
          {isYouthMember && (
            <button
              onClick={() => navigate('/platform/propose')}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold active:bg-blue-700 transition"
            >
              <Plus size={14} />
              제안하기
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((tab) => {
            if (tab.key === 'manage' && !isAdmin()) return null;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'
                }`}
              >
                {tab.key === 'manage' && <Settings2 size={12} />}
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4">
        {activeTab === 'recruiting' && renderList(recruiting)}
        {activeTab === 'operating'  && renderList(operating)}
        {activeTab === 'ended'      && renderList(ended)}
        {activeTab === 'manage' && isAdmin() && <ManageTab pending={pending} />}
      </div>
    </div>
  );
}

/* ── Admin Manage Tab ── */
function ManageTab({ pending }: { pending: Platform[] }) {
  const navigate = useNavigate();
  const { approvePlatform, rejectPlatform, changeStatus, platforms } = usePlatform();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const all = platforms.filter((p) => p.status !== 'pending');

  const handleReject = () => {
    if (rejectId) {
      rejectPlatform(rejectId, rejectReason);
      setRejectId(null);
      setRejectReason('');
    }
  };

  return (
    <div className="space-y-5">
      {/* Pending */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">승인 대기 ({pending.length})</p>
        {pending.length === 0 ? (
          <div className="bg-white rounded-2xl px-4 py-8 text-center text-gray-300 text-sm border border-gray-100">대기 중인 제안이 없습니다</div>
        ) : (
          <div className="space-y-3">
            {pending.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{p.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">제안자: {p.proposedByName}</p>
                  </div>
                  <button onClick={() => navigate(`/platform/${p.id}`)} className="text-xs text-blue-500 font-medium shrink-0">상세보기</button>
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{p.content}</p>
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

      {/* Status control */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">플랫폼 상태 관리</p>
        <div className="space-y-3">
          {all.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-800 text-sm">{p.title}</p>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 ${statusMeta[p.status].color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusMeta[p.status].dot}`} />
                    {statusMeta[p.status].label}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <button onClick={() => navigate(`/platform/${p.id}`)} className="flex items-center gap-0.5 text-xs text-blue-500 font-semibold">
                    자세히<ChevronRight size={12} />
                  </button>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Users size={12} />{p.participants.length}명
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {(['recruiting', 'operating', 'ended'] as const).map((s) => (
                  <button key={s} onClick={() => changeStatus(p.id, s)} className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${p.status === s ? `${statusMeta[s].color} ring-1 ring-inset ring-current` : 'bg-gray-100 text-gray-500'}`}>
                    {statusMeta[s].label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reject modal */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ maxWidth: 430, margin: '0 auto', left: 0, right: 0 }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setRejectId(null)} />
          <div className="relative w-full bg-white rounded-t-3xl p-5 z-10">
            <p className="font-bold text-gray-800 mb-3">반려 사유 입력</p>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="반려 사유를 입력하세요..." rows={3} className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none" />
            <div className="flex gap-3 mt-3">
              <button onClick={() => setRejectId(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium">취소</button>
              <button onClick={handleReject} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold">반려하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
