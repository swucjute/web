import { useParams, useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { WorshipDetailContent } from '../../components/WorshipDetailContent';

export function WorshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  if (!id) return null;

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
        <WorshipDetailContent worshipId={id} />
      </div>
    </div>
  );
}
