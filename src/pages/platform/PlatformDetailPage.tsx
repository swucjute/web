import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { usePlatform } from '../../contexts/PlatformContext';
import {
  ArrowLeft, Users, Clock, FileText, Target, StickyNote,
  UserCheck, UserMinus, LayoutGrid, Pencil,
  CheckCircle2, XCircle, ChevronDown, ChevronUp,
  Heart, MessageCircle, Image as ImageIcon, Grid3x3, MapPin,
} from 'lucide-react';

const lifecycleMeta = {
  pending: { label: '승인 대기', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  active:  { label: '활성',     color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500'   },
};

const activeStateMeta: Record<string, { label: string; color: string; dot: string }> = {
  recruiting: { label: '모집중',   color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  operating:  { label: '운영중',   color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500'  },
  ended:      { label: '운영종료', color: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400'  },
};

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {icon}
      <span className="text-xs text-gray-400 w-16 shrink-0">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{value}</span>
    </div>
  );
}

export function PlatformDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isAdmin, users } = useAuth();
  const { getPlatformById, joinPlatform, leavePlatform, approvePlatform, rejectPlatform } = usePlatform();

  const platform = getPlatformById(id ?? '');
  const [activeTab, setActiveTab] = useState<'info' | 'activity'>('info');
  const [activityView, setActivityView] = useState<'grid' | 'detail'>('grid');
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

  const getStatusDisplay = () => {
    if (platform.lifecycle === 'pending') return lifecycleMeta.pending;
    const activeStates = platform.activeStates || [];
    if (activeStates.length === 0) return lifecycleMeta.active;
    if (activeStates.length === 1) return activeStateMeta[activeStates[0]];
    const labels = activeStates.map((s) => activeStateMeta[s].label).join('·');
    return { label: labels, color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' };
  };

  const meta = getStatusDisplay();
  const isYouthMember = currentUser?.department === '청년부';
  const participants = platform.participants || [];
  const isParticipant = currentUser ? participants.includes(currentUser.id) : false;
  const isProposer = currentUser?.id === platform.proposedBy;
  const isRecruiting = platform.lifecycle === 'active' && (platform.activeStates || []).includes('recruiting');

  const participantUsers = users.filter((u) => participants.includes(u.id));

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

  const sampleActivities = [
    { id: 1, author: '김민수', date: '2024.05.10', content: '오늘 첫 모임을 가졌습니다! 다들 열정이 넘치시네요 🔥', hasImage: true, likes: 12, comments: 3 },
    { id: 2, author: '이서연', date: '2024.05.08', content: '준비 회의를 진행했어요. 다음 주 활동 계획을 세웠습니다!', hasImage: false, likes: 8, comments: 2 },
    { id: 3, author: '박지훈', date: '2024.05.05', content: '장소 섭외 완료했습니다 👍', hasImage: true, likes: 15, comments: 5 },
    { id: 4, author: '최유진', date: '2024.05.01', content: '플랫폼이 승인되었습니다! 많이 참여해주세요 😊', hasImage: false, likes: 20, comments: 7 },
  ];

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-900 text-base flex-1 line-clamp-1">{platform.title}</span>
          {(isAdmin() || isProposer) && platform.lifecycle === 'pending' && (
            <button onClick={() => navigate(`/platform/edit/${platform.id}`)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition">
              <Pencil size={15} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* 포스터 */}
        <div className="w-full bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative" style={{ aspectRatio: '3/4', maxHeight: 340 }}>
          {platform.posterUrl ? (
            <img src={platform.posterUrl} alt="모집 포스터" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-blue-200">
              <LayoutGrid size={48} strokeWidth={1} />
              <span className="text-sm">포스터 없음</span>
            </div>
          )}
          <span className={`absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${meta.color} shadow-lg`}>
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        </div>

        <div className="flex flex-col">
          {/* 제목 */}
          <div className="px-4 pt-4 pb-3">
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{platform.title}</h2>
            <p className="text-xs text-gray-400 mt-1">
              제안자: {platform.proposedByName} · {new Date(platform.createdAt).toLocaleDateString('ko-KR')}
            </p>
          </div>

          {/* 탭 메뉴 */}
          <div className="flex border-b border-gray-200 bg-white sticky top-14 z-10">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-3 text-sm font-semibold transition relative ${activeTab === 'info' ? 'text-gray-900' : 'text-gray-400'}`}
            >
              정보
              {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />}
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 py-3 text-sm font-semibold transition relative ${activeTab === 'activity' ? 'text-purple-600' : 'text-purple-400'}`}
            >
              <span className="flex items-center justify-center gap-1">
                활동
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${activeTab === 'activity' ? 'bg-purple-100 text-purple-600' : 'bg-purple-50 text-purple-500'}`}>
                  {sampleActivities.length}
                </span>
              </span>
              {activeTab === 'activity' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />}
            </button>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="px-4 py-3 space-y-3">
            {activeTab === 'info' ? (
              <>
                {/* 반려 사유 */}
                {platform.rejectedReason && (
                  <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-xs text-red-600">
                    <p className="font-semibold mb-0.5">반려 사유</p>
                    <p>{platform.rejectedReason}</p>
                  </div>
                )}

                {/* 기본 정보 */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
                  <InfoRow icon={<Clock size={14} className="text-blue-400" />} label="일시" value={platform.scheduledDate} />
                  <InfoRow icon={<MapPin size={14} className="text-green-400" />} label="장소" value={platform.location} />
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Users size={14} className="text-purple-400" />
                    <span className="text-xs text-gray-400 w-16 shrink-0">모집 인원</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-800 font-medium">미정</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        현재 {participants.length}명 참여중
                      </span>
                    </div>
                  </div>

                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={14} className="text-gray-400" />
                      <h3 className="text-xs font-semibold text-gray-600">활동 내용</h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{platform.content}</p>
                  </div>

                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={14} className="text-gray-400" />
                      <h3 className="text-xs font-semibold text-gray-600">목적</h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{platform.purpose}</p>
                  </div>

                  {platform.other && (
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <StickyNote size={14} className="text-gray-400" />
                        <h3 className="text-xs font-semibold text-gray-600">기타</h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{platform.other}</p>
                    </div>
                  )}
                </div>

                {/* 참여 멤버 */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <button onClick={() => setShowMembers(!showMembers)} className="w-full flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Users size={15} className="text-blue-400" />
                      참여 멤버 ({participants.length})
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

                {/* 참여/취소 버튼 */}
                {isRecruiting && isYouthMember && (
                  <div>
                    {isParticipant ? (
                      <button onClick={handleLeave} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm active:bg-gray-200 transition">
                        <UserMinus size={16} />참여 취소하기
                      </button>
                    ) : (
                      <button onClick={handleJoin} className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition ${joinAnim ? 'bg-green-500 text-white' : 'bg-blue-600 text-white active:bg-blue-700'}`}>
                        {joinAnim ? <><CheckCircle2 size={16} />참여 완료!</> : <><UserCheck size={16} />참여하기</>}
                      </button>
                    )}
                  </div>
                )}

                {/* 관리자 승인/반려 */}
                {isAdmin() && platform.lifecycle === 'pending' && !rejectMode && (
                  <div className="flex gap-3">
                    <button onClick={() => { approvePlatform(platform.id); navigate(-1); }} className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-green-500 text-white font-bold text-sm active:bg-green-600 transition">
                      <CheckCircle2 size={16} />승인
                    </button>
                    <button onClick={() => setRejectMode(true)} className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-red-500 text-white font-bold text-sm active:bg-red-600 transition">
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
              </>
            ) : (
              <>
                {activityView === 'grid' ? (
                  <div className="grid grid-cols-3 gap-1">
                    {sampleActivities.map((activity) => (
                      <button
                        key={activity.id}
                        onClick={() => setActivityView('detail')}
                        className="aspect-square bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center hover:opacity-80 transition"
                      >
                        {activity.hasImage ? (
                          <ImageIcon size={32} strokeWidth={1} className="text-blue-200" />
                        ) : (
                          <FileText size={32} strokeWidth={1} className="text-blue-200" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button onClick={() => setActivityView('grid')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition">
                      <Grid3x3 size={16} />
                      <span>그리드로 보기</span>
                    </button>
                    {sampleActivities.map((activity) => (
                      <div key={activity.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="text-blue-600 text-sm font-semibold">{activity.author.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{activity.author}</p>
                            <p className="text-xs text-gray-400">{activity.date}</p>
                          </div>
                        </div>
                        {activity.hasImage && (
                          <div className="w-full aspect-square bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                            <ImageIcon size={48} strokeWidth={1} className="text-blue-200" />
                          </div>
                        )}
                        <div className="px-4 py-3">
                          <p className="text-sm text-gray-700 leading-relaxed">{activity.content}</p>
                        </div>
                        <div className="flex items-center gap-4 px-4 pb-3">
                          <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition">
                            <Heart size={18} />
                            <span className="text-xs font-medium">{activity.likes}</span>
                          </button>
                          <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition">
                            <MessageCircle size={18} />
                            <span className="text-xs font-medium">{activity.comments}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            <div className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
