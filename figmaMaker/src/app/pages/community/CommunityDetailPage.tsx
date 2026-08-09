import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ArrowLeft, Heart, MessageCircle, Send, ExternalLink, MapPin, Calendar } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';

const categoryColor: Record<string, string> = {
  예배: 'bg-purple-100 text-purple-600',
  공지: 'bg-blue-100 text-blue-600',
  전도: 'bg-green-100 text-green-600',
  행사: 'bg-orange-100 text-orange-600',
};

const typeColor: Record<string, string> = {
  notice: 'bg-gray-100 text-gray-500',
  recruit: 'bg-pink-100 text-pink-600',
};

const typeLabel: Record<string, string> = {
  notice: '공지',
  recruit: '참여모집',
};

export function CommunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { posts, addComment, toggleLike } = useData();
  const [commentInput, setCommentInput] = useState('');

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full text-gray-400 text-sm">
        <p>게시글을 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)} className="mt-3 text-blue-500 text-sm">돌아가기</button>
      </div>
    );
  }

  const handleAddComment = () => {
    if (!currentUser || !commentInput.trim()) return;
    addComment(post.id, commentInput, currentUser.id, currentUser.name);
    setCommentInput('');
  };

  const isLiked = post.likes.includes(currentUser?.id || '');

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-900 text-base flex-1">게시글</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Post Body */}
        <div className="bg-white px-5 pt-5 pb-6 border-b border-gray-100">
          {/* Badges */}
          <div className="flex items-center gap-1.5 mb-3">
            {post.type && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeColor[post.type] ?? 'bg-gray-100 text-gray-500'}`}>
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
          <h1 className="text-lg font-bold text-gray-900 leading-snug mb-2">{post.title}</h1>

          {/* Author & Date */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-600 font-semibold text-xs">{post.authorName.charAt(0)}</span>
            </div>
            <span className="text-sm font-medium text-gray-700">{post.authorName}</span>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
            </span>
          </div>

          {/* Meta info */}
          {(post.date || post.location) && (
            <div className="flex flex-col gap-1.5 mb-4 p-3 bg-gray-50 rounded-xl">
              {post.date && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} className="text-gray-400 shrink-0" />
                  <span>{format(new Date(post.date), 'yyyy년 M월 d일 (EEE)', { locale: ko })}</span>
                </div>
              )}
              {post.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} className="text-gray-400 shrink-0" />
                  <span>{post.location}</span>
                </div>
              )}
              {post.maxParticipants && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MessageCircle size={14} className="text-gray-400 shrink-0" />
                  <span>모집 인원 {post.maxParticipants}명</span>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>

          {/* Chat link button */}
          {post.chatLink && (
            <a
              href={post.chatLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-yellow-400 text-gray-900 text-sm font-bold active:bg-yellow-500 transition"
            >
              <ExternalLink size={15} />
              팀채팅방 참여하기
            </a>
          )}

          {/* Like */}
          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100">
            <button
              onClick={() => currentUser && toggleLike(post.id, currentUser.id)}
              className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              <span className="text-sm">{post.likes.length}</span>
            </button>
            <div className="flex items-center gap-1.5 text-gray-400">
              <MessageCircle size={18} />
              <span className="text-sm">{post.comments.length}</span>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white mt-2">
          <p className="px-5 pt-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            댓글 {post.comments.length}
          </p>

          {post.comments.length > 0 && (
            <div className="px-4 pb-3 space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <span className="text-gray-600 text-xs font-semibold">{comment.authorName.charAt(0)}</span>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
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
          <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-600 text-xs font-semibold">{currentUser?.name.charAt(0)}</span>
            </div>
            <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden pl-3 pr-1 py-1">
              <input
                type="text"
                placeholder="댓글을 입력하세요..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-400 bg-transparent"
              />
              <button
                onClick={handleAddComment}
                disabled={!commentInput.trim()}
                className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white disabled:opacity-40 active:bg-blue-700 transition shrink-0"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
