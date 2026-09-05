import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { usePlatformDetail } from '../../hooks/usePlatformDetail';
import { platformStatusBadges } from '../../utils/platformStatus';
import {
  ArrowLeft, Users, Clock, FileText, Target, StickyNote,
  LayoutGrid, Pencil,
  Heart, MessageCircle, Image as ImageIcon, Grid3x3, MapPin,
} from 'lucide-react';

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {icon}
      <span className="text-xs text-gray-400 w-16 shrink-0">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{value || '-'}</span>
    </div>
  );
}

const sampleActivities = [
  { id: 1, author: '김민수', date: '2024.05.10', content: '오늘 첫 모임을 가졌습니다! 다들 열정이 넘치시네요 🔥', hasImage: true, likes: 12, comments: 3 },
  { id: 2, author: '이서연', date: '2024.05.08', content: '준비 회의를 진행했어요. 다음 주 활동 계획을 세웠습니다!', hasImage: false, likes: 8, comments: 2 },
  { id: 3, author: '박지훈', date: '2024.05.05', content: '장소 섭외 완료했습니다 👍', hasImage: true, likes: 15, comments: 5 },
  { id: 4, author: '최유진', date: '2024.05.01', content: '플랫폼이 승인되었습니다! 많이 참여해주세요 😊', hasImage: false, likes: 20, comments: 7 },
];

export function PlatformDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const { data: platform, isLoading } = usePlatformDetail(id);

  const [activeTab, setActiveTab] = useState<'info' | 'activity'>('info');
  const [activityView, setActivityView] = useState<'grid' | 'detail'>('grid');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full py-20 text-gray-400 text-sm">
        불러오는 중...
      </div>
    );
  }

  if (!platform) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full py-20 text-gray-400">
        <LayoutGrid size={40} strokeWidth={1} />
        <p className="mt-3 text-sm">플랫폼을 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-500 text-sm font-medium">돌아가기</button>
      </div>
    );
  }

  const badges = platformStatusBadges(platform);

  // 실제 카카오 로그인 사용자는 백엔드에 소속 제한이 없으므로 무조건 허용, 목업 로그인만 소속으로 체크
  const isYouthMember =
    currentUser?.authSource === 'kakao' || currentUser?.department === '청년부';
  const isProposer = currentUser?.id === String(platform.ownerMemberId);
  const isRecruiting = platform.approvalStatus === 'APPROVED' && platform.recruiting;

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-900 text-base flex-1 line-clamp-1">{platform.title}</span>
          {(isAdmin() || isProposer) && (
            <button onClick={() => navigate(`/platform/edit/${id}`)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition">
              <Pencil size={15} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Poster */}
        <div className="w-full bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative" style={{ aspectRatio: '3/4', maxHeight: 340 }}>
          {platform.posterUrl ? (
            <img src={platform.posterUrl} alt="모집 포스터" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-blue-200">
              <LayoutGrid size={48} strokeWidth={1} />
              <span className="text-sm">포스터 없음</span>
            </div>
          )}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            {badges.map((badge) => (
              <span key={badge.label} className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${badge.color} shadow-lg`}>
                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          {/* Title */}
          <div className="px-4 pt-4 pb-3">
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{platform.title}</h2>
            <p className="text-xs text-gray-400 mt-1">
              플짱(제안자): {platform.ownerName ?? '알 수 없음'} · {new Date(platform.createdAt).toLocaleDateString('ko-KR')}
            </p>
          </div>

          {/* Tab Menu */}
          <div className="flex border-b border-gray-200 bg-white sticky top-14 z-10">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-3 text-sm font-semibold transition relative ${
                activeTab === 'info' ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              정보
              {activeTab === 'info' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 py-3 text-sm font-semibold transition relative ${
                activeTab === 'activity' ? 'text-purple-600' : 'text-purple-400'
              }`}
            >
              <span className="flex items-center justify-center gap-1">
                활동
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                  activeTab === 'activity' ? 'bg-purple-100 text-purple-600' : 'bg-purple-50 text-purple-500'
                }`}>{sampleActivities.length}</span>
              </span>
              {activeTab === 'activity' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="px-4 py-3 space-y-3">
            {activeTab === 'info' ? (
              <>
                {/* Info Cards - Combined with Details */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
                  <InfoRow icon={<Clock size={14} className="text-blue-400" />} label="일시" value={platform.scheduleText} />
                  <InfoRow icon={<MapPin size={14} className="text-green-400" />} label="장소" value={platform.location} />
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Users size={14} className="text-purple-400" />
                    <span className="text-xs text-gray-400 w-16 shrink-0">모집 인원</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-800 font-medium">미정</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">현재 {platform.approvedMemberCount}명 참여중</span>
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

                  {platform.etc && (
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <StickyNote size={14} className="text-gray-400" />
                        <h3 className="text-xs font-semibold text-gray-600">기타</h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{platform.etc}</p>
                    </div>
                  )}
                </div>

                {/* 참여 신청 — 가입/승인 기능은 다음 단계에서 실제 API와 연동된다 */}
                {isRecruiting && isYouthMember && (
                  <div className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gray-100 text-gray-400 font-bold text-sm">
                    <Clock size={16} />참여 신청 기능 준비 중
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
