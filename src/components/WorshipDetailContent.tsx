import { useState } from 'react';
import { Link } from 'react-router';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  BookOpen, Music, Play,
  Megaphone, ClipboardCheck,
  ChevronDown, Users,
  ZoomIn, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

function getYoutubeVideoId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&\n?#]+)/,
    /youtu\.be\/([^?\n#]+)/,
    /youtube\.com\/live\/([^?\n#]+)/,
    /youtube\.com\/embed\/([^?\n#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function BulletinCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const total = images.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <>
      <div className="mt-2">
        <div
          className="relative w-full cursor-pointer overflow-hidden rounded-xl"
          style={{ aspectRatio: '4/3' }}
          onClick={() => setFullscreen(true)}
        >
          <img
            src={images[current]}
            alt={`주보 ${current + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 active:opacity-100 transition-opacity">
            <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center">
              <ZoomIn size={18} className="text-white" />
            </div>
          </div>
        </div>

        {total > 1 && (
          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`rounded-full transition-all duration-200 ${
                    idx === current ? 'w-4 h-2 bg-purple-500' : 'w-2 h-2 bg-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 text-xs text-gray-400 font-medium">
                {current + 1}/{total}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={prev} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center active:bg-gray-200 transition">
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
              <button onClick={next} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center active:bg-gray-200 transition">
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 rounded-full flex items-center justify-center active:bg-white/30 z-10"
            onClick={() => setFullscreen(false)}
          >
            <X size={18} className="text-white" />
          </button>
          {total > 1 && (
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center active:bg-white/30 z-10"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
          )}
          <img
            src={images[current]}
            alt={`주보 ${current + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {total > 1 && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center active:bg-white/30 z-10"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          )}
          {total > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`rounded-full transition-all duration-200 ${
                    idx === current ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

interface Props {
  worshipId: string;
}

function ToggleRow({
  icon,
  label,
  open,
  onToggle,
  isFirst,
  isLast,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  onToggle: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  children: React.ReactNode;
}) {
  const roundedTop = isFirst ? 'rounded-t-2xl' : '';
  const roundedBottom = isLast ? 'rounded-b-2xl' : '';

  return (
    <div className={`bg-white ${roundedTop} ${roundedBottom} overflow-hidden`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-5 active:bg-gray-50 transition-colors ${
          !isLast ? 'border-b border-gray-100' : ''
        }`}
      >
        <span className="shrink-0">{icon}</span>
        <span className="flex-1 text-left text-sm font-semibold text-gray-800">{label}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className={`px-4 pb-4 pt-1 ${!isLast ? 'border-b border-gray-100' : ''}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorshipDetailContent({ worshipId }: Props) {
  const { worships, surveys } = useData();
  const [openScripture, setOpenScripture] = useState(false);
  const [openBulletin, setOpenBulletin] = useState(false);
  const [openPraises, setOpenPraises] = useState(false);
  const [openAnnouncements, setOpenAnnouncements] = useState(false);

  const worship = worships.find((w) => w.id === worshipId);
  if (!worship) return null;

  const displayPraises = worship.inlinePraises ?? [];
  const bulletinImages = worship.bulletinImages ?? [];
  const hasCommittee =
    worship.committee &&
    (worship.committee.repPrayer || worship.committee.bibleReading || worship.committee.offering);
  const hasAnnouncements = worship.announcements && worship.announcements.length > 0;
  const hasBulletin = hasCommittee || bulletinImages.length > 0;
  const hasExtraSection = hasBulletin || displayPraises.length > 0 || hasAnnouncements;

  return (
    <div className="space-y-4 relative">
      {/* 설교 제목 & 날짜 배너 */}
      <div className="bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl px-5 pt-5 pb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-blue-200 text-xs font-medium mb-1.5">
              {format(parseISO(worship.date), 'yyyy년 M월 d일 (E)', { locale: ko })}
              {' · '}
              {worship.title}
            </p>
            <h2 className="text-white font-bold text-xl leading-snug">{worship.sermonTitle}</h2>
            <p className="text-blue-200 text-sm mt-1">{worship.preacher} 목사</p>
          </div>
          {worship.youtubeUrl && (
            <a
              href={worship.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 w-11 h-11 bg-white/20 hover:bg-white/30 active:bg-white/10 rounded-full flex items-center justify-center transition mt-0.5"
            >
              <Play size={20} className="text-white fill-white ml-0.5" />
            </a>
          )}
        </div>
      </div>

      {/* 본문 말씀 */}
      <div className="rounded-2xl shadow-sm overflow-hidden">
        <ToggleRow
          icon={<BookOpen size={17} className="text-blue-500" />}
          label="본문 말씀"
          open={openScripture}
          onToggle={() => setOpenScripture((v) => !v)}
          isFirst
          isLast
        >
          <div className="bg-blue-50 rounded-xl px-4 py-3 mt-2">
            <p className="text-blue-700 font-semibold text-sm mb-2">{worship.scripture}</p>
            {worship.scriptureText ? (
              <p className="text-sm text-blue-900/70 leading-7 whitespace-pre-wrap">
                {worship.scriptureText}
              </p>
            ) : (
              <p className="text-xs text-blue-400">본문 말씀 텍스트가 등록되지 않았습니다.</p>
            )}
          </div>
        </ToggleRow>
      </div>

      {/* 주보 · 찬양 · 광고 */}
      {hasExtraSection && (
        <div className="rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
          {hasBulletin && (
            <ToggleRow
              icon={<Users size={16} className="text-purple-500" />}
              label="주보"
              open={openBulletin}
              onToggle={() => setOpenBulletin((v) => !v)}
              isFirst
              isLast={!displayPraises.length && !hasAnnouncements}
            >
              {hasCommittee && (
                <div className="mt-2 space-y-1.5">
                  {worship.committee?.repPrayer && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-xs text-gray-400 w-16 shrink-0">대표기도</span>
                      <span>{worship.committee.repPrayer}</span>
                    </div>
                  )}
                  {worship.committee?.bibleReading && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-xs text-gray-400 w-16 shrink-0">말씀봉독</span>
                      <span>{worship.committee.bibleReading}</span>
                    </div>
                  )}
                  {worship.committee?.offering && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-xs text-gray-400 w-16 shrink-0">봉헌위원</span>
                      <span>{worship.committee.offering}</span>
                    </div>
                  )}
                </div>
              )}
              {bulletinImages.length > 0 && (
                <BulletinCarousel images={bulletinImages} />
              )}
            </ToggleRow>
          )}

          {displayPraises.length > 0 && (
            <ToggleRow
              icon={<Music size={16} className="text-pink-500" />}
              label="찬양"
              open={openPraises}
              onToggle={() => setOpenPraises((v) => !v)}
              isFirst={!hasBulletin}
              isLast={!hasAnnouncements}
            >
              <div className="space-y-3 mt-2">
                {displayPraises.map((praise, idx) => {
                  const videoId = praise.youtubeUrl ? getYoutubeVideoId(praise.youtubeUrl) : null;
                  const thumbnail = videoId
                    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                    : null;
                  return (
                    <div key={praise.id} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-300 w-4 text-center shrink-0">
                        {idx + 1}
                      </span>
                      {thumbnail ? (
                        <a
                          href={praise.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative w-18 h-10 rounded-lg overflow-hidden shrink-0"
                        >
                          <img src={thumbnail} alt={praise.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-5 h-5 bg-white/90 rounded-full flex items-center justify-center">
                              <Play size={9} className="text-gray-800 fill-gray-800 ml-0.5" />
                            </div>
                          </div>
                        </a>
                      ) : (
                        <div className="w-18 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <Music size={14} className="text-gray-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{praise.title}</p>
                        {praise.artist && <p className="text-xs text-gray-400 truncate">{praise.artist}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ToggleRow>
          )}

          {hasAnnouncements && (
            <ToggleRow
              icon={<Megaphone size={16} className="text-orange-500" />}
              label="광고"
              open={openAnnouncements}
              onToggle={() => setOpenAnnouncements((v) => !v)}
              isFirst={!hasBulletin && !displayPraises.length}
              isLast
            >
              <div className="space-y-4 mt-2">
                {worship.announcements!.map((ann, idx) => {
                  const linkedSurvey = ann.surveyId
                    ? surveys.find((s) => s.id === ann.surveyId)
                    : null;
                  return (
                    <div key={ann.id} className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-white text-[10px] font-bold">{idx + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 leading-snug">{ann.title}</p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed whitespace-pre-wrap">
                          {ann.description}
                        </p>
                        {linkedSurvey && (
                          <Link
                            to="/survey"
                            className="mt-2 inline-flex items-center gap-1.5 bg-violet-50 text-violet-600 text-xs font-semibold px-3 py-1.5 rounded-xl active:bg-violet-100 transition"
                          >
                            <ClipboardCheck size={12} />
                            {linkedSurvey.title} — 설문 참여하기
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ToggleRow>
          )}
        </div>
      )}
    </div>
  );
}
