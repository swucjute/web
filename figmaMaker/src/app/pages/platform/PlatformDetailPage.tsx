import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { usePlatform } from '../../contexts/PlatformContext';
import {
  ArrowLeft, Users, Clock, FileText, Target, StickyNote,
  UserCheck, UserMinus, LayoutGrid, Pencil,
  CheckCircle2, XCircle, ChevronDown, ChevronUp,
} from 'lucide-react';

const statusMeta = {
  pending:    { label: '승인 대기', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  recruiting: { label: '모집중',   color: 'bg-green-100 text-green-700',   dot: 'bg-green-500'  },
  operating:  { label: '운영중',   color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500'   },
  ended:      { label: '운영종료', color: 'bg-gray-100 text-gray-500',     dot: 'bg-gray-400'   },
};

export function PlatformDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isAdmin, users } = useAuth();
  const { getPlatformById, joinPlatform, leavePlatform, approvePlatform, rejectPlatform } = usePlatform();

  const platform = getPlatformById(id ?? '');
  const [showMembers, setShowMembers] = useState(false);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [joinAnim, setJoinAnim] = useState(false);

  if (!platform) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full py-20 text-gray-400">
        <LayoutGrid size={40} strokeWidth={1} />
        <p className="mt-3 text-sm">플랫폼을 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-500 text-sm font-medium">돌아가기</button>
      </div>
    );
  }

  const meta = statusMeta[platform.status];
  const isYouthMember = currentUser?.department === '청년부';
  const isParticipant = currentUser ? platform.participants.includes(currentUser.id) : false;
  const isProposer = currentUser?.id === platform.proposedBy;
  const canJoin = isYouthMember && platform.status === 'recruiting' && !isParticipant;
  const canLeave = isParticipant && platform.status === 'recruiting';

  const participantUsers = users.filter((u) => platform.participants.includes(u.id));

  const handleJoin = () => {
    if (!currentUser) return;
    joinPlatform(platform.id, currentUser.id);
    setJoinAnim(true);
    setTimeout(() => setJoinAnim(false), 1500);
  };

  const handleLeave = () => {
    if (!currentUser) return;
    leavePlatform(platform.id, currentUser.id);
  };

  const handleReject = () => {
    rejectPlatform(platform.id, rejectReason);
    setRejectMode(false);
    setRejectReason('');
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-900 text-base flex-1 line-clamp-1">{platform.title}</span>
          {(isAdmin() || isProposer) && platform.status === 'pending' && (
            <button onClick={() => navigate(`/platform/edit/${platform.id}`)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition">
              <Pencil size={15} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Poster */}
        <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" style={{ aspectRatio: '3/4', maxHeight: 340 }}>
          {platform.posterUrl ? (
            <img src={platform.posterUrl} alt="모집 포스터" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-blue-200">
              <LayoutGrid size={48} strokeWidth={1} />
              <span className="text-sm">포스터 없음</span>
            </div>
          )}
        </div>

        <div className="px-4 py-5 space-y-5">
          {/* Title + Status */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${meta.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
              {platform.status === 'recruiting' && <span className="text-[11px] text-gray-400">· 지금 모집 중</span>}
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{platform.title}</h2>
            <p className="text-xs text-gray-400 mt-1">
              제안자: {platform.proposedByName} · {new Date(platform.createdAt).toLocaleDateString('ko-KR')}
            </p>
          </div>

          {/* Rejection notice */}
          {platform.rejectedReason && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs text-red-600">
              <p className="font-semibold mb-1">반려 사유</p>
              <p>{platform.rejectedReason}</p>
            </div>
          )}

          {/* Info Cards */}
          <div className="bg-white rounded-2xl divide-y divide-gray-50 shadow-sm">
            <InfoRow icon={<Clock size={14} className="text-blue-400" />} label="일시" value={platform.scheduledDate} />
            <InfoRow icon={<Users size={14} className="text-purple-400" />} label="참여 인원" value={`${platform.participants.length}명`} />
          </div>

          <DetailSection icon={<FileText size={14} className="text-gray-400" />} title="활동 내용">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{platform.content}</p>
          </DetailSection>

          <DetailSection icon={<Target size={14} className="text-gray-400" />} title="목적">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{platform.purpose}</p>
          </DetailSection>

          {platform.other && (
            <DetailSection icon={<StickyNote size={14} className="text-gray-400" />} title="기타">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{platform.other}</p>
            </DetailSection>
          )}

          {/* Participants */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button onClick={() => setShowMembers(!showMembers)} className="w-full flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Users size={15} className="text-blue-400" />
                참여 멤버 ({platform.participants.length})
              </div>
              {showMembers ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            {showMembers && (
              <div className="border-t border-gray-50 px-4 py-3 space-y-2">
                {participantUsers.length === 0 ? (
                  <p className="text-xs text-gray-400 py-2 text-center">참여자가 없습니다</p>
                ) : (
                  participantUsers.map((u) => (
                    <div key={u.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-blue-600 text-xs font-semibold">{u.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{u.name}</p>
                        <p className="text-[11px] text-gray-400">{u.position || u.department}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Join / Leave */}
          {platform.status === 'recruiting' && isYouthMember && (
            <div>
              {isParticipant ? (
                <button onClick={handleLeave} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm active:bg-gray-200 transition">
                  <UserMinus size={16} />참여 취소하기
                </button>
              ) : (
                <button onClick={handleJoin} className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition ${joinAnim ? 'bg-green-500 text-white' : 'bg-blue-600 text-white active:bg-blue-700'}`}>
                  {joinAnim ? <><CheckCircle2 size={16} />참여 완료!</> : <><UserCheck size={16} />참여하기</>}
                </button>
              )}
            </div>
          )}

          {/* Admin approve / reject */}
          {isAdmin() && platform.status === 'pending' && !rejectMode && (
            <div className="flex gap-3">
              <button onClick={() => { approvePlatform(platform.id); navigate(-1); }} className="flex-1 flex items-center justify-center gap-1.5 py-4 rounded-2xl bg-green-500 text-white font-bold text-sm active:bg-green-600 transition">
                <CheckCircle2 size={16} />승인
              </button>
              <button onClick={() => setRejectMode(true)} className="flex-1 flex items-center justify-center gap-1.5 py-4 rounded-2xl bg-red-500 text-white font-bold text-sm active:bg-red-600 transition">
                <XCircle size={16} />반려
              </button>
            </div>
          )}

          {rejectMode && (
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
              <p className="font-semibold text-gray-800 text-sm">반려 사유 입력</p>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="반려 사유를 입력하세요..." rows={3} className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none" />
              <div className="flex gap-3">
                <button onClick={() => setRejectMode(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium">취소</button>
                <button onClick={handleReject} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold">반려하기</button>
              </div>
            </div>
          )}

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {icon}
      <span className="text-xs text-gray-400 w-16 shrink-0">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{value}</span>
    </div>
  );
}

function DetailSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-semibold text-gray-700">{title}</span>
      </div>
      {children}
    </div>
  );
}
