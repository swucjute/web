import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Plus, Music, Search, Trash2, ExternalLink, X,
  ChevronRight, ChevronLeft, Youtube, Calendar, Minus, Edit2,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Praise as PraiseType } from '../../types';

const MAX_SONGS = 10;

// ── 타입 ──────────────────────────────────────────────────────────────────
type SongDraft = { draftId: string; praiseId: string | null; title: string; youtubeUrl: string };
const blankSong = (): SongDraft => ({
  draftId: Date.now().toString() + Math.random().toString(36).slice(2),
  praiseId: null,
  title: '',
  youtubeUrl: '',
});

// ── 공통 곡 입력 폼 UI ────────────────────────────────────────────────────
interface SongFormSheetProps {
  sheetTitle: string;
  worshipSelectNode: React.ReactNode;   // 날짜 선택 UI (추가=select, 수정=표시용)
  songs: SongDraft[];
  onAddSong: () => void;
  onRemoveSong: (draftId: string) => void;
  onChangeSong: (draftId: string, field: 'title' | 'youtubeUrl', value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onDelete?: () => void;
  submitLabel: string;
  canSubmit?: boolean;
}

function SongFormSheet({
  sheetTitle, worshipSelectNode, songs,
  onAddSong, onRemoveSong, onChangeSong,
  onSubmit, onCancel, onDelete, submitLabel, canSubmit = true,
}: SongFormSheetProps) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-t-3xl z-10 max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">{sheetTitle}</h2>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4">
          <form onSubmit={onSubmit} className="space-y-5">
            {/* 예배 날짜 영역 (부모가 주입) */}
            <section className="space-y-2">
              <Label className="text-sm flex items-center gap-1.5 font-semibold">
                <Calendar size={14} className="text-blue-500" />
                예배 날짜
              </Label>
              {worshipSelectNode}
            </section>

            <div className="border-t border-gray-100" />

            {/* 곡 목록 */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-1.5 font-semibold">
                  <Music size={14} className="text-purple-500" />
                  곡 목록
                  <span className="text-xs text-gray-400 font-normal ml-1">({songs.length}/{MAX_SONGS})</span>
                </Label>
                <button
                  type="button"
                  onClick={onAddSong}
                  disabled={songs.length >= MAX_SONGS}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition ${
                    songs.length >= MAX_SONGS
                      ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                      : 'text-blue-600 bg-blue-50 active:bg-blue-100'
                  }`}
                >
                  <Plus size={13} />
                  곡 추가
                </button>
              </div>

              <div className="space-y-3">
                {songs.map((song, idx) => (
                  <div key={song.draftId} className="bg-gray-50 rounded-2xl p-3.5 space-y-2.5 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-600">곡 {idx + 1}</span>
                      {songs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onRemoveSong(song.draftId)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center active:bg-red-100 transition"
                        >
                          <Minus size={12} className="text-gray-500" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">곡 제목 *</Label>
                      <Input
                        value={song.title}
                        onChange={(e) => onChangeSong(song.draftId, 'title', e.target.value)}
                        placeholder="곡 제목을 입력하세요"
                        required
                        className="rounded-xl bg-white text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600 flex items-center gap-1">
                        <Youtube size={11} className="text-red-500" />
                        유튜브 링크
                      </Label>
                      <Input
                        value={song.youtubeUrl}
                        onChange={(e) => onChangeSong(song.draftId, 'youtubeUrl', e.target.value)}
                        placeholder="https://youtube.com/..."
                        className="rounded-xl bg-white text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {songs.length >= MAX_SONGS && (
                <p className="text-xs text-amber-600 text-center bg-amber-50 rounded-lg py-2">
                  최대 {MAX_SONGS}곡까지 등록할 수 있습니다
                </p>
              )}
            </section>

            {/* 그룹 삭제 버튼 (수정 모드) */}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-xl w-full justify-center active:bg-red-100 transition"
              >
                <Trash2 size={14} />
                이 예배 찬양 목록 전체 삭제
              </button>
            )}

            <div className="flex gap-3 pt-1 pb-2">
              <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium">취소</button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium active:bg-blue-700 transition disabled:opacity-40"
              >
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────
export function Praise() {
  const navigate = useNavigate();
  const { isLeader } = useAuth();
  const { praises, addPraise, updatePraise, deletePraise, worships } = useData();

  const [searchTerm, setSearchTerm] = useState('');

  // 추가 폼
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addWorshipId, setAddWorshipId] = useState('');
  const [addSongs, setAddSongs] = useState<SongDraft[]>([blankSong()]);

  // 수정 폼
  const [editWorshipId, setEditWorshipId] = useState<string | null>(null);
  const [editSongs, setEditSongs] = useState<SongDraft[]>([]);

  const canEdit = isLeader();

  const sortedWorships = [...worships].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // ── 그룹핑: worshipId 기준 ──
  const grouped = sortedWorships
    .map((w) => ({
      worship: w,
      songs: praises.filter((p) => p.worshipId === w.id),
    }))
    .filter((g) => g.songs.length > 0);

  // worshipId 없는 찬양 (레거시)
  const unlinked = praises.filter((p) => !p.worshipId);

  // 검색 필터 (그룹 단위)
  const filteredGroups = searchTerm.trim()
    ? grouped.filter(
        (g) =>
          g.songs.some((s) => s.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          g.worship.title.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : grouped;

  const filteredUnlinked = searchTerm.trim()
    ? unlinked.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : unlinked;

  // ── 추가 핸들러 ──
  const openAdd = () => {
    setAddWorshipId(sortedWorships[0]?.id ?? '');
    setAddSongs([blankSong()]);
    setIsAddOpen(true);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = addSongs.filter((s) => s.title.trim());
    valid.forEach((s) => {
      addPraise({
        title: s.title.trim(),
        youtubeUrl: s.youtubeUrl.trim(),
        artist: '',
        key: '',
        tempo: '',
        category: '찬양',
        worshipId: addWorshipId || undefined,
      });
    });
    setIsAddOpen(false);
  };

  // ── 수정 핸들러 ──
  const openEdit = (worshipId: string, songs: PraiseType[]) => {
    setEditWorshipId(worshipId);
    setEditSongs(
      songs.map((s) => ({
        draftId: s.id,
        praiseId: s.id,
        title: s.title,
        youtubeUrl: s.youtubeUrl ?? '',
      })),
    );
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editWorshipId) return;

    const originalIds = new Set(praises.filter((p) => p.worshipId === editWorshipId).map((p) => p.id));
    const keptIds = new Set(editSongs.filter((s) => s.praiseId).map((s) => s.praiseId!));

    // 삭제된 곡
    originalIds.forEach((id) => { if (!keptIds.has(id)) deletePraise(id); });

    // 수정된 기존 곡
    editSongs.filter((s) => s.praiseId).forEach((s) => {
      updatePraise(s.praiseId!, { title: s.title, youtubeUrl: s.youtubeUrl });
    });

    // 새로 추가된 곡
    editSongs.filter((s) => !s.praiseId && s.title.trim()).forEach((s) => {
      addPraise({
        title: s.title.trim(),
        youtubeUrl: s.youtubeUrl.trim(),
        artist: '',
        key: '',
        tempo: '',
        category: '찬양',
        worshipId: editWorshipId,
      });
    });

    setEditWorshipId(null);
  };

  const handleDeleteGroup = () => {
    if (!editWorshipId) return;
    if (!window.confirm('이 예배의 찬양 목록 전체를 삭제하시겠습니까?')) return;
    praises.filter((p) => p.worshipId === editWorshipId).forEach((p) => deletePraise(p.id));
    setEditWorshipId(null);
  };

  // ── 곡 리스트 헬퍼 ──
  const changeSong = (
    setter: React.Dispatch<React.SetStateAction<SongDraft[]>>,
    draftId: string,
    field: 'title' | 'youtubeUrl',
    value: string,
  ) => setter((prev) => prev.map((s) => (s.draftId === draftId ? { ...s, [field]: value } : s)));

  const removeSong = (
    setter: React.Dispatch<React.SetStateAction<SongDraft[]>>,
    draftId: string,
  ) => setter((prev) => prev.filter((s) => s.draftId !== draftId));

  // ── 렌더 ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col">
      {/* 헤더 */}
      <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/more')}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition shrink-0"
            >
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">찬양 리스트</h1>
              <p className="text-xs text-gray-500">총 {praises.length}곡</p>
            </div>
          </div>
          {canEdit && (
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-sm font-medium active:bg-blue-700 transition"
            >
              <Plus size={16} />
              추가
            </button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="예배명 또는 곡 제목으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 목록 */}
      <div className="px-4 py-3 space-y-3">
        {filteredGroups.length === 0 && filteredUnlinked.length === 0 ? (
          <div className="py-16 text-center">
            <Music size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">등록된 찬양이 없습니다</p>
          </div>
        ) : (
          <>
            {/* 예배별 그룹 카드 */}
            {filteredGroups.map(({ worship, songs }) => (
              <button
                key={worship.id}
                onClick={() => canEdit && openEdit(worship.id, songs)}
                className={`w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-left transition-colors ${canEdit ? 'active:bg-gray-50 cursor-pointer' : 'cursor-default'}`}
              >
                {/* 날짜 헤더 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar size={14} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600">
                        {format(new Date(worship.date), 'yyyy년 M월 d일 (E)', { locale: ko })}
                      </p>
                      <p className="text-xs text-gray-500">{worship.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">{songs.length}곡</span>
                    {canEdit && <ChevronRight size={15} className="text-gray-300" />}
                  </div>
                </div>

                {/* 곡 목록 */}
                <div className="space-y-1.5">
                  {songs.map((song, idx) => (
                    <div key={song.id} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-purple-50 rounded-md flex items-center justify-center shrink-0">
                        <Music size={11} className="text-purple-400" />
                      </div>
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <span className="text-xs text-gray-400 shrink-0">{idx + 1}.</span>
                        <span className="text-sm text-gray-700 font-medium truncate">{song.title}</span>
                        {song.youtubeUrl && (
                          <Youtube size={11} className="text-red-400 shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </button>
            ))}

            {/* 미분류 찬양 (worshipId 없는 레거시) */}
            {filteredUnlinked.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 pt-3 pb-2 border-b border-gray-50">
                  <p className="text-xs font-semibold text-gray-400">기타</p>
                </div>
                <div className="p-3 space-y-1">
                  {filteredUnlinked.map((praise) => (
                    <div
                      key={praise.id}
                      className="flex items-center gap-2 px-1 py-1.5"
                    >
                      <Music size={13} className="text-purple-300 shrink-0" />
                      <span className="text-sm text-gray-700 truncate flex-1">{praise.title}</span>
                      {praise.youtubeUrl && (
                        <a
                          href={praise.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0"
                        >
                          <ExternalLink size={13} className="text-gray-300" />
                        </a>
                      )}
                      {canEdit && (
                        <button
                          onClick={() => {
                            if (window.confirm('삭제하시겠습니까?')) deletePraise(praise.id);
                          }}
                          className="shrink-0"
                        >
                          <Trash2 size={13} className="text-gray-300 active:text-red-400" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── 찬양 추가 Bottom Sheet ── */}
      {isAddOpen && (
        <SongFormSheet
          sheetTitle="찬양 추가"
          worshipSelectNode={
            sortedWorships.length === 0 ? (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700">
                먼저 예배를 등록해주세요.
              </div>
            ) : (
              <select
                value={addWorshipId}
                onChange={(e) => setAddWorshipId(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">예배를 선택하세요</option>
                {sortedWorships.map((w) => (
                  <option key={w.id} value={w.id}>
                    {format(new Date(w.date), 'yyyy년 M월 d일 (E)', { locale: ko })} — {w.title}
                  </option>
                ))}
              </select>
            )
          }
          songs={addSongs}
          onAddSong={() => { if (addSongs.length < MAX_SONGS) setAddSongs((p) => [...p, blankSong()]); }}
          onRemoveSong={(id) => removeSong(setAddSongs, id)}
          onChangeSong={(id, field, val) => changeSong(setAddSongs, id, field, val)}
          onSubmit={handleAdd}
          onCancel={() => setIsAddOpen(false)}
          submitLabel="추가"
          canSubmit={sortedWorships.length > 0 && !!addWorshipId}
        />
      )}

      {/* ── 찬양 수정 Bottom Sheet ── */}
      {editWorshipId && (() => {
        const w = worships.find((x) => x.id === editWorshipId);
        return (
          <SongFormSheet
            sheetTitle="찬양 수정"
            worshipSelectNode={
              w ? (
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2">
                  <Calendar size={14} className="text-blue-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-blue-700">
                      {format(new Date(w.date), 'yyyy년 M월 d일 (E)', { locale: ko })}
                    </p>
                    <p className="text-xs text-blue-500">{w.title}</p>
                  </div>
                </div>
              ) : null
            }
            songs={editSongs}
            onAddSong={() => { if (editSongs.length < MAX_SONGS) setEditSongs((p) => [...p, blankSong()]); }}
            onRemoveSong={(id) => removeSong(setEditSongs, id)}
            onChangeSong={(id, field, val) => changeSong(setEditSongs, id, field, val)}
            onSubmit={handleEdit}
            onCancel={() => setEditWorshipId(null)}
            onDelete={handleDeleteGroup}
            submitLabel="저장"
          />
        );
      })()}
    </div>
  );
}
