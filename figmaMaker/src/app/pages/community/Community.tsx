import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Textarea } from '../../components/ui/textarea';
import { Heart, MessageCircle, X, PenLine } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const categoryColor: Record<string, string> = {
  예배: 'bg-purple-100 text-purple-600',
  공지: 'bg-blue-100 text-blue-600',
  전도: 'bg-green-100 text-green-600',
  행사: 'bg-orange-100 text-orange-600',
};

const typeLabel: Record<string, string> = {
  notice: '공지',
  recruit: '참여모집',
};

export function Community() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { posts, addPost } = useData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'notice' as 'notice' | 'recruit',
    title: '',
    category: '공지' as '예배' | '공지' | '전도' | '행사',
    content: '',
    date: '',
    location: '',
    chatLink: '',
    maxParticipants: '' as string,
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    addPost({
      title: formData.title,
      content: formData.content,
      author: currentUser.id,
      authorName: currentUser.name,
      type: formData.type,
      category: formData.category,
      date: formData.date,
      location: formData.location,
      chatLink: formData.chatLink,
      maxParticipants: formData.type === 'recruit' ? formData.maxParticipants : '',
    });
    setFormData({ type: 'notice', title: '', category: '공지', content: '', date: '', location: '', chatLink: '', maxParticipants: '' });
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">커뮤니티</h1>
            <p className="text-xs text-gray-500">청년부 공지 및 소통 공간</p>
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-sm font-medium active:bg-blue-700 transition"
          >
            <PenLine size={15} />
            글쓰기
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="px-4 py-3 space-y-3">
        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <MessageCircle size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">아직 게시글이 없습니다</p>
            <p className="text-gray-300 text-xs mt-1">첫 글을 작성해보세요!</p>
          </div>
        ) : (
          posts.map(post => (
            <div
              key={post.id}
              onClick={() => navigate(`/community/${post.id}`)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:bg-gray-50 transition cursor-pointer"
            >
              <div className="px-4 pt-4 pb-3">
                {/* Badges */}
                <div className="flex items-center gap-1.5 mb-2">
                  {post.type && (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${post.type === 'recruit' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500'}`}>
                      {typeLabel[post.type]}
                    </span>
                  )}
                  {post.category && (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${categoryColor[post.category] ?? 'bg-gray-100 text-gray-500'}`}>
                      {post.category}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-800 mb-1">{post.title}</h3>

                {/* Author & Date */}
                <p className="text-xs text-gray-400 mb-2">
                  {post.authorName} · {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
                </p>

                {/* Content preview */}
                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{post.content}</p>
              </div>

              {/* Actions — display only, no click */}
              <div className="flex items-center gap-4 px-4 py-3 border-t border-gray-50">
                <div className={`flex items-center gap-1.5 ${post.likes.includes(currentUser?.id || '') ? 'text-red-400' : 'text-gray-300'}`}>
                  <Heart size={16} fill={post.likes.includes(currentUser?.id || '') ? 'currentColor' : 'none'} />
                  <span className="text-xs">{post.likes.length}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <MessageCircle size={16} />
                  <span className="text-xs">{post.comments.length}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write Post Bottom Sheet */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end items-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-[430px] bg-white rounded-t-3xl z-10 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">새 글 작성</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4">
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* 유형 선택 */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">유형 *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([['notice', '공지형'], ['recruit', '참여모집형']] as const).map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: val })}
                        className={`py-2.5 rounded-xl text-sm font-semibold border transition ${
                          formData.type === val
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 제목 */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">제목 *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="제목을 입력하세요"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 카테고리 */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">카테고리 *</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['예배', '공지', '전도', '행사'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`py-2 rounded-xl text-sm font-semibold border transition ${
                          formData.category === cat
                            ? 'bg-blue-50 text-blue-600 border-blue-300'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 내용 */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">내용 *</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={5}
                    required
                    placeholder="내용을 입력하세요..."
                    className="rounded-xl"
                  />
                </div>

                {/* 일정 */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">일정</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 장소 */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">장소</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="장소를 입력하세요"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 팀채팅방 링크 */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">팀채팅방 링크</label>
                  <input
                    type="url"
                    value={formData.chatLink}
                    onChange={(e) => setFormData({ ...formData, chatLink: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 모집 인원 — 참여모집형일 때만 */}
                {formData.type === 'recruit' && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">모집 인원</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        value={formData.maxParticipants}
                        onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                        placeholder="인원 수"
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, maxParticipants: '' })}
                        className={`px-3 py-3 rounded-xl text-sm font-semibold border transition ${
                          formData.maxParticipants === ''
                            ? 'bg-blue-50 text-blue-600 border-blue-300'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}
                      >
                        제한없음
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium active:bg-blue-700 transition"
                  >
                    게시
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
