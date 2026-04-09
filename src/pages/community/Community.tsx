import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Textarea } from '../../components/ui/textarea';
import { Heart, MessageCircle, Send, Plus, X, PenLine } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export function Community() {
  const { currentUser } = useAuth();
  const { posts, addPost, addComment, toggleLike } = useData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    addPost({
      title: formData.title,
      content: formData.content,
      author: currentUser.id,
      authorName: currentUser.name,
    });
    setFormData({ title: '', content: '' });
    setIsDrawerOpen(false);
  };

  const handleAddComment = (postId: string) => {
    if (!currentUser || !commentInputs[postId]?.trim()) return;
    addComment(postId, commentInputs[postId], currentUser.id, currentUser.name);
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const handleLike = (postId: string) => {
    if (!currentUser) return;
    toggleLike(postId, currentUser.id);
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">커뮤니티</h1>
            <p className="text-xs text-gray-500">청년부 소통 공간</p>
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
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Post Header */}
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">{post.authorName.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{post.authorName}</p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
                    </p>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1.5">{post.title}</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{post.content}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 px-4 py-3 border-t border-gray-50">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    post.likes.includes(currentUser?.id || '')
                      ? 'text-red-500'
                      : 'text-gray-400 active:text-red-400'
                  }`}
                >
                  <Heart
                    size={18}
                    fill={post.likes.includes(currentUser?.id || '') ? 'currentColor' : 'none'}
                  />
                  <span className="text-sm">{post.likes.length}</span>
                </button>
                <button
                  onClick={() => setShowComments({ ...showComments, [post.id]: !showComments[post.id] })}
                  className="flex items-center gap-1.5 text-gray-400 active:text-blue-500 transition-colors"
                >
                  <MessageCircle size={18} />
                  <span className="text-sm">{post.comments.length}</span>
                </button>
              </div>

              {/* Comments */}
              {showComments[post.id] && (
                <div className="border-t border-gray-50 bg-gray-50/50">
                  {post.comments.length > 0 && (
                    <div className="px-4 pt-3 space-y-3">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                            <span className="text-gray-600 text-xs font-semibold">{comment.authorName.charAt(0)}</span>
                          </div>
                          <div className="flex-1 bg-white rounded-xl px-3 py-2 border border-gray-100">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-semibold text-gray-800">{comment.authorName}</span>
                              <span className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ko })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input */}
                  <div className="flex items-center gap-2 px-4 py-3">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <span className="text-blue-600 text-xs font-semibold">{currentUser?.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl overflow-hidden pl-3 pr-1 py-1">
                      <input
                        type="text"
                        placeholder="댓글을 입력하세요..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                        className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-400 bg-transparent"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}
                        className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white disabled:opacity-40 active:bg-blue-700 transition shrink-0"
                      >
                        <Send size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Write Post Bottom Sheet */}
      {isDrawerOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative bg-white rounded-t-3xl z-10 max-h-[85vh] flex flex-col">
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
                <div className="space-y-1">
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
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">내용 *</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    required
                    placeholder="내용을 입력하세요..."
                    className="rounded-xl"
                  />
                </div>
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
