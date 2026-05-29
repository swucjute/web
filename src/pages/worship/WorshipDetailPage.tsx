import { useParams, useNavigate } from 'react-router';
import { useData } from '../../contexts/DataContext';
import { ChevronLeft, Church } from 'lucide-react';
import { WorshipDetailContent } from '../../components/WorshipDetailContent';

export function WorshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { worships } = useData();

  const worship = worships.find((w) => w.id === id);

  if (!worship) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
        <Church size={40} className="text-gray-200 mb-3" />
        <p className="text-sm text-gray-400">예배 정보를 찾을 수 없습니다</p>
        <button
          onClick={() => navigate('/worship')}
          className="mt-4 text-blue-500 text-sm font-medium"
        >
          예배 탭으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <h1 className="text-base font-bold text-gray-800 truncate flex-1">예배</h1>
        </div>
      </div>

      <div className="px-4 py-4 pb-8">
        <WorshipDetailContent worshipId={worship.id} />
      </div>
    </div>
  );
}
