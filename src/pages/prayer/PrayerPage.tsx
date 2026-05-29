import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import {
  BookHeart, Plus, X, Trash2, Check,
  Lock, Globe, ChevronDown, ChevronUp,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

type TabKey = 'my' | 'shared';

export function PrayerPage() {
  const { currentUser } = useAuth();
  const { prayers, addPrayer, updatePrayer, deletePrayer, togglePrayerReaction } = useData();

  const [activeTab, setActiveTab] = useState<TabKey>('my');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const myPrayers = prayers.filter((p) => p.authorId === currentUser?.id);
  const sharedPrayers = prayers.filter((p) => p.isPublic);
  const displayList = activeTab === 'my' ? myPrayers : sharedPrayers;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !content.trim()) return;
    addPrayer({
      content: content.trim(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      isPublic,
      isAnswered: false,
    });
    setContent('');
    setIsPublic(false);
    setIsDrawerOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('기도제목을 삭제하시겠습니까?')) {
      deletePrayer(id);
      if (expandedId === id) setExpandedId(null);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">기도제목</h1>
            <p className="text-xs text-gray-500">내 기도 {myPrayers.length}개 · 공개 {sharedPrayers.length}개</p>
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-1.5 bg-rose-500 text-white px-3.5 py-2 rounded-xl text-sm font-medium active:bg-rose-600 transition"
          >
            <Plus size={16} />
            추가
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-100">
        {([
          { key: 'my', label: '내 기도제목', count: myPrayers.length },
          { key: 'shared', label: '공개 기도제목', count: sharedPrayers.length },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === tab.key
                ? 'text-rose-500 border-b-2 border-rose-500'
                : 'text-gray-400'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab.key ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-4 py-3 space-y-2">
        {displayList.length === 0 ? (
          <div className="py-16 text-center">
            <BookHeart size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {activeTab === 'my' ? '기도제목을 추가해보세요' : '공개된 기도제목이 없습니다'}
            </p>
          </div>
        ) : (
          displayList.map((prayer) => {
            const isOwner = prayer.authorId === currentUser?.id;
            const isExpanded = expandedId === prayer.id;
            const reactions = prayer.reactions ?? [];
            const hasReacted = currentUser ? reactions.includes(currentUser.id) : false;
            const previewText = prayer.content.length > 40
              ? prayer.content.slice(0, 40) + '…'
              : prayer.content;

            return (
              <div
                key={prayer.id}
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-colors ${
                  prayer.isAnswered && isOwner ? 'border-green-200 bg-green-50/30' : 'border-gray-100'
                }`}
              >
                {/* Card Header — always visible */}
                <div
                  className="px-4 py-3.5 cursor-pointer active:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : prayer.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      prayer.isAnswered && isOwner ? 'bg-green-100' : 'bg-rose-50'
                    }`}>
                      {prayer.isAnswered && isOwner
                        ? <Check size={16} className="text-green-600" />
                        : <BookHeart size={16} className="text-rose-400" />
                      }
                    </div>

                    {/* Content preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm font-medium leading-snug ${
                          prayer.isAnswered && isOwner ? 'text-gray-400 line-through' : 'text-gray-800'
                        }`}>
                          {isExpanded ? prayer.content : previewText}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        {activeTab === 'shared' && (
                          <span className="font-medium text-gray-500">{prayer.authorName}</span>
                        )}
                        <span>
                          {formatDistanceToNow(new Date(prayer.createdAt), { addSuffix: true, locale: ko })}
                        </span>
                        {prayer.isPublic
                          ? <Globe size={11} className="text-blue-400" />
                          : <Lock size={11} className="text-gray-300" />
                        }
                        {prayer.isAnswered && isOwner && (
                          <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-xs font-medium">응답됨</span>
                        )}
                      </div>
                    </div>

                    {isExpanded
                      ? <ChevronUp size={16} className="text-gray-300 shrink-0 mt-1" />
                      : <ChevronDown size={16} className="text-gray-300 shrink-0 mt-1" />
                    }
                  </div>
                </div>

                {/* Expanded: action buttons */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-50 pt-3">
                    {isOwner ? (
                      /* ── 내 기도제목: 응답됨 / 공개전환 / 삭제 ── */
                      <div className="flex gap-2">
                        <button
                          onClick={() => updatePrayer(prayer.id, { isAnswered: !prayer.isAnswered })}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition ${
                            prayer.isAnswered
                              ? 'bg-gray-100 text-gray-600 active:bg-gray-200'
                              : 'bg-green-50 text-green-600 active:bg-green-100'
                          }`}
                        >
                          <Check size={14} />
                          {prayer.isAnswered ? '응답 취소' : '응답됨'}
                        </button>
                        <button
                          onClick={() => updatePrayer(prayer.id, { isPublic: !prayer.isPublic })}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium bg-blue-50 text-blue-600 active:bg-blue-100 transition"
                        >
                          {prayer.isPublic ? <Lock size={14} /> : <Globe size={14} />}
                          {prayer.isPublic ? '비공개' : '공개'}
                        </button>
                        <button
                          onClick={() => handleDelete(prayer.id)}
                          className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-400 active:bg-red-100 transition shrink-0"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ) : (
                      /* ── 다른 사람 기도제목: 기도손 반응 ── */
                      <button
                        onClick={() => currentUser && togglePrayerReaction(prayer.id, currentUser.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                          hasReacted
                            ? 'bg-rose-100 text-rose-600 active:bg-rose-200'
                            : 'bg-gray-100 text-gray-500 active:bg-gray-200'
                        }`}
                      >
                        <span className="text-base leading-none">🙏</span>
                        <span>함께 기도해요</span>
                        {reactions.length > 0 && (
                          <span className={`ml-0.5 font-bold ${hasReacted ? 'text-rose-500' : 'text-gray-400'}`}>
                            {reactions.length}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* 접혀있을 때도 반응 수 표시 (다른 사람 기도 & 반응 있을 때) */}
                {!isExpanded && !isOwner && reactions.length > 0 && (
                  <div className="px-4 pb-3 -mt-1">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                      <span>🙏</span>
                      <span>{reactions.length}명이 함께 기도하고 있어요</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Prayer Bottom Sheet */}
      {isDrawerOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative bg-white rounded-t-3xl z-10 max-h-[90vh] flex flex-col">
            {/* Sheet Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">기도제목 추가</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Sheet Body */}
            <div className="overflow-y-auto flex-1 px-5 py-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 내용 */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={6}
                  autoFocus
                  placeholder="기도 내용을 적어주세요..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                />

                {/* 공개 토글 */}
                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-colors ${
                    isPublic ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isPublic ? 'bg-blue-100' : 'bg-gray-200'
                  }`}>
                    {isPublic
                      ? <Globe size={18} className="text-blue-600" />
                      : <Lock size={18} className="text-gray-500" />
                    }
                  </div>
                  <div className="text-left flex-1">
                    <p className={`text-sm font-semibold ${isPublic ? 'text-blue-700' : 'text-gray-700'}`}>
                      {isPublic ? '공개 기도제목' : '나만 보기 (비공개)'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {isPublic ? '청년부 전체와 함께 기도할 수 있어요' : '나만 볼 수 있는 기도제목'}
                    </p>
                  </div>
                  {/* 토글 스위치 */}
                  <div className={`w-11 h-6 rounded-full transition-colors shrink-0 relative ${
                    isPublic ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                      isPublic ? 'left-5' : 'left-0.5'
                    }`} />
                  </div>
                </button>

                {/* 버튼 */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium active:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={!content.trim()}
                    className="flex-1 py-3 rounded-xl bg-rose-500 text-white text-sm font-medium active:bg-rose-600 transition disabled:opacity-40"
                  >
                    추가
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}