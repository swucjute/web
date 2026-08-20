import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { usePlatform } from '../../contexts/PlatformContext';
import type { Platform } from '../../types';
import {
  Plus, Users, LayoutGrid, ChevronRight,
  Image as ImageIcon, FileText, Heart, MessageCircle, Grid3x3, MapPin,
} from 'lucide-react';

function PlatformCard({ platform, onPress }: { platform: Platform; onPress: () => void }) {
  const getStatusDisplay = () => {
    if (platform.lifecycle === 'pending') {
      return { label: '승인 대기', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' };
    }
    const activeStates = platform.activeStates || [];
    if (activeStates.length === 0) {
      return { label: '활성', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' };
    }
    const meta: Record<string, { label: string; color: string; dot: string }> = {
      recruiting: { label: '모집중',   color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
      operating:  { label: '운영중',   color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500'  },
      ended:      { label: '운영종료', color: 'bg-gray-100 text-gray-500',   dot: 'bg-gray-400'  },
    };
    if (activeStates.length === 1) return meta[activeStates[0]];
    const labels = activeStates.map((s) => meta[s].label).join('·');
    return { label: labels, color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' };
  };

  const statusMeta = getStatusDisplay();

  return (
    <button
      onClick={onPress}
      className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform text-left"
    >
      <div
        className="relative w-full bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
        style={{ aspectRatio: '3/4', maxHeight: 220 }}
      >
        {platform.posterUrl ? (
          <img src={platform.posterUrl} alt="포스터" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-blue-300">
            <LayoutGrid size={36} strokeWidth={1.2} />
            <span className="text-xs">포스터 없음</span>
          </div>
        )}
        <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusMeta.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
          {statusMeta.label}
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{platform.title}</p>
        <div className="space-y-0.5 mb-2">
          <p className="text-xs text-gray-500 line-clamp-1">{platform.scheduledDate}</p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={11} />
            <span className="line-clamp-1">{platform.location}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Users size={12} />
            <span>{(platform.participants || []).length + 1}명 참여</span>
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

type TabKey = 'recruiting' | 'operating' | 'ended' | 'activity';

const sampleActivities = [
  { id: 1, platformTitle: '청년 독서 모임', author: '김민수', date: '2024.05.10', content: '오늘 첫 모임을 가졌습니다! 다들 열정이 넘치시네요.', hasImage: true, likes: 12, comments: 3 },
  { id: 2, platformTitle: '청년 독서 모임', author: '이서연', date: '2024.05.08', content: '준비 회의를 진행했어요.', hasImage: false, likes: 8, comments: 2 },
  { id: 3, platformTitle: '청년 배드민턴', author: '박지훈', date: '2024.05.05', content: '장소 섭외 완료했습니다.', hasImage: true, likes: 15, comments: 5 },
  { id: 4, platformTitle: '청년 봉사 모임', author: '최유진', date: '2024.05.01', content: '플랫폼이 승인되었습니다!', hasImage: false, likes: 20, comments: 7 },
];

export function PlatformPage() {
  const { currentUser } = useAuth();
  const { platforms } = usePlatform();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('recruiting');
  const [activityView, setActivityView] = useState<'grid' | 'detail'>('grid');

  // 실제 카카오 로그인 사용자는 백엔드에 소속 제한이 없으므로 무조건 허용, 목업 로그인만 소속으로 체크
  const isYouthMember =
    currentUser?.authSource === 'kakao' || currentUser?.department === '청년부';

  const recruiting = platforms.filter((p) => p.lifecycle === 'active' && (p.activeStates || []).includes('recruiting'));
  const operating  = platforms.filter((p) => p.lifecycle === 'active' && (p.activeStates || []).includes('operating'));
  const ended      = platforms.filter((p) => p.lifecycle === 'active' && (p.activeStates || []).includes('ended'));

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'recruiting', label: '모집중',  count: recruiting.length },
    { key: 'operating',  label: '운영중',  count: operating.length  },
    { key: 'ended',      label: '종료',    count: ended.length      },
    { key: 'activity',   label: '활동',    count: sampleActivities.length },
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
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                tab.key === 'activity'
                  ? activeTab === tab.key ? 'border-purple-600 text-purple-600' : 'border-transparent text-purple-400'
                  : activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  tab.key === 'activity'
                    ? activeTab === tab.key ? 'bg-purple-100 text-purple-600' : 'bg-purple-50 text-purple-500'
                    : activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4">
        {activeTab === 'recruiting' && renderList(recruiting)}
        {activeTab === 'operating'  && renderList(operating)}
        {activeTab === 'ended'      && renderList(ended)}
        {activeTab === 'activity' && (
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
                <button
                  onClick={() => setActivityView('grid')}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  <Grid3x3 size={16} />
                  <span>그리드로 보기</span>
                </button>
                {sampleActivities.map((activity) => (
                  <div key={activity.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-4 py-3">
                      <span className="inline-block text-[11px] text-blue-700 font-semibold bg-blue-100 px-2.5 py-1 rounded-full mb-2">{activity.platformTitle}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <span className="text-blue-600 text-sm font-semibold">{activity.author.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{activity.author}</p>
                          <p className="text-xs text-gray-400">{activity.date}</p>
                        </div>
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
      </div>
    </div>
  );
}
