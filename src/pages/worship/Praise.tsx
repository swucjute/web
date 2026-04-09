import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Plus, Music, Search, Edit2, Trash2, ExternalLink, X, ChevronRight } from 'lucide-react';

export function Praise() {
  const { isLeader } = useAuth();
  const { praises, addPraise, updatePraise, deletePraise } = useData();
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [editingPraise, setEditingPraise] = useState<any>(null);
  const [selectedPraise, setSelectedPraise] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('전체');
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    key: '',
    tempo: '',
    lyrics: '',
    youtubeUrl: '',
    category: '',
  });

  const canEdit = isLeader();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPraise) {
      updatePraise(editingPraise.id, formData);
    } else {
      addPraise(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', artist: '', key: '', tempo: '', lyrics: '', youtubeUrl: '', category: '' });
    setEditingPraise(null);
    setIsFormDrawerOpen(false);
  };

  const handleEdit = (praise: any) => {
    setEditingPraise(praise);
    setFormData({
      title: praise.title,
      artist: praise.artist,
      key: praise.key,
      tempo: praise.tempo,
      lyrics: praise.lyrics || '',
      youtubeUrl: praise.youtubeUrl || '',
      category: praise.category,
    });
    setIsDetailDrawerOpen(false);
    setIsFormDrawerOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      deletePraise(id);
      setIsDetailDrawerOpen(false);
    }
  };

  const categories = ['전체', ...Array.from(new Set(praises.map(p => p.category))).filter(Boolean)];

  const filteredPraises = praises.filter(praise => {
    const matchesSearch =
      praise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      praise.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === '전체' || praise.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-gray-800">찬양 리스트</h1>
            <p className="text-xs text-gray-500">총 {praises.length}곡</p>
          </div>
          {canEdit && (
            <button
              onClick={() => { setEditingPraise(null); setIsFormDrawerOpen(true); }}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-sm font-medium active:bg-blue-700 transition"
            >
              <Plus size={16} />
              추가
            </button>
          )}
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="제목 또는 아티스트로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="bg-white border-b border-gray-100 px-4 py-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm transition-colors ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Praise List */}
      <div className="px-4 py-3 space-y-2">
        {filteredPraises.length === 0 ? (
          <div className="py-16 text-center">
            <Music size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">찬양이 없습니다</p>
          </div>
        ) : (
          filteredPraises.map(praise => (
            <button
              key={praise.id}
              onClick={() => { setSelectedPraise(praise); setIsDetailDrawerOpen(true); }}
              className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-left active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                  <Music size={18} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-800 text-sm truncate">{praise.title}</p>
                    <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">{praise.category}</span>
                  </div>
                  <p className="text-xs text-gray-500">{praise.artist}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {praise.key && <span className="text-xs text-gray-400">Key: {praise.key}</span>}
                    {praise.tempo && <span className="text-xs text-gray-400">템포: {praise.tempo}</span>}
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 shrink-0" />
              </div>
            </button>
          ))
        )}
      </div>

      {/* Detail Bottom Sheet */}
      {isDetailDrawerOpen && selectedPraise && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsDetailDrawerOpen(false)} />
          <div className="relative bg-white rounded-t-3xl z-10 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Music size={18} className="text-purple-600" />
                <div>
                  <h2 className="font-bold text-gray-800 text-sm leading-tight">{selectedPraise.title}</h2>
                  <p className="text-xs text-gray-500">{selectedPraise.artist}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-200">
                  {selectedPraise.category}
                </span>
                {selectedPraise.key && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    Key: {selectedPraise.key}
                  </span>
                )}
                {selectedPraise.tempo && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    템포: {selectedPraise.tempo}
                  </span>
                )}
              </div>

              {selectedPraise.youtubeUrl && (
                <a
                  href={selectedPraise.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2.5 rounded-xl text-sm font-medium"
                >
                  <ExternalLink size={16} />
                  유튜브에서 보기
                </a>
              )}

              {selectedPraise.lyrics && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">가사</h4>
                  <div className="bg-gray-50 rounded-xl p-4 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed border border-gray-100">
                    {selectedPraise.lyrics}
                  </div>
                </div>
              )}

              {canEdit && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleEdit(selectedPraise)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium"
                  >
                    <Edit2 size={15} />
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(selectedPraise.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-500 text-sm font-medium"
                  >
                    <Trash2 size={15} />
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form Bottom Sheet */}
      {isFormDrawerOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={resetForm} />
          <div className="relative bg-white rounded-t-3xl z-10 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editingPraise ? '찬양 수정' : '찬양 추가'}</h2>
              <button onClick={resetForm} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-sm">제목 *</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">아티스트 *</Label>
                  <Input value={formData.artist} onChange={(e) => setFormData({ ...formData, artist: e.target.value })} required className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">카테고리 *</Label>
                  <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="예: 찬양, 경배, CCM" required className="rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm">조 (Key)</Label>
                    <Input value={formData.key} onChange={(e) => setFormData({ ...formData, key: e.target.value })} placeholder="예: C, G, D" className="rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm">템포</Label>
                    <Input value={formData.tempo} onChange={(e) => setFormData({ ...formData, tempo: e.target.value })} placeholder="예: 느림, 빠름" className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">유튜브 URL</Label>
                  <Input value={formData.youtubeUrl} onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })} placeholder="https://youtube.com/..." className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">가사</Label>
                  <Textarea value={formData.lyrics} onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })} rows={8} placeholder="가사를 입력하세요..." className="rounded-xl" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={resetForm} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium">취소</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium active:bg-blue-700 transition">{editingPraise ? '수정' : '추가'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
