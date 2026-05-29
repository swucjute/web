import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Church, Sparkles, ChevronLeft } from 'lucide-react';
import { WorshipDetailContent } from '../../components/WorshipDetailContent';

export function WorshipTab() {
  const { worships } = useData();
  const [activeTab, setActiveTab] = useState<'thisWeek' | 'archive'>('thisWeek');
  const [selectedArchiveId, setSelectedArchiveId] = useState<string | null>(null);

  const sorted = [...worships].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 0 });

  const thisWeekWorship =
    sorted.find((w) => {
      try {
        return isWithinInterval(parseISO(w.date), { start: weekStart, end: weekEnd });
      } catch {
        return false;
      }
    }) ?? sorted[0] ?? null;

  const pastWorships = sorted.filter((w) => w.id !== thisWeekWorship?.id);

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-800">예배</h1>
        <p className="text-xs text-gray-500">주뜨청년부 예배 안내</p>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setActiveTab('thisWeek')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'thisWeek'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            이번 주
          </button>
          <button
            onClick={() => { setActiveTab('archive'); setSelectedArchiveId(null); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'archive'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            다시보기
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* 이번 주 탭 */}
        {activeTab === 'thisWeek' && thisWeekWorship && (
          <WorshipDetailContent worshipId={thisWeekWorship.id} />
        )}

        {activeTab === 'thisWeek' && !thisWeekWorship && (
          <div className="py-16 text-center">
            <Church size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">이번 주 예배 정보가 없습니다</p>
            <p className="text-xs text-gray-300 mt-1">예배 관리에서 등록해주세요</p>
          </div>
        )}

        {/* 다시보기 탭 */}
        {activeTab === 'archive' && !selectedArchiveId && (
          <>
            {pastWorships.length === 0 ? (
              <div className="py-16 text-center">
                <Church size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">지난 예배가 없습니다</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pastWorships.map((worship) => (
                  <div
                    key={worship.id}
                    className="bg-white rounded-2xl shadow-sm px-4 py-3.5 flex items-center gap-3 cursor-pointer active:bg-gray-50 transition-colors"
                    onClick={() => setSelectedArchiveId(worship.id)}
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <Church size={18} className="text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {worship.sermonTitle}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {format(parseISO(worship.date), 'yyyy.M.d (E)', { locale: ko })}
                        {' · '}
                        {worship.preacher} 목사
                      </p>
                      <p className="text-xs text-gray-400 truncate">{worship.scripture}</p>
                    </div>
                    <button
                      className="w-9 h-9 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-sm shadow-violet-300"
                      title="AI 설교 요약"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Sparkles size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'archive' && selectedArchiveId && (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedArchiveId(null)}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 active:text-gray-700 transition-colors"
            >
              <ChevronLeft size={18} />
              목록으로 돌아가기
            </button>
            <WorshipDetailContent worshipId={selectedArchiveId} />
          </div>
        )}
      </div>
    </div>
  );
}
