import React from 'react';
import {
  Sparkles,
  History,
  Bookmark,
  Award,
  FolderHeart,
  FileEdit,
} from 'lucide-react';

interface HeaderProps {
  historyCount: number;
  bookmarksCount: number;
  collectionsCount: number;
  onOpenHistory: () => void;
  onOpenShortlist: () => void;
  onOpenEvidence: () => void;
  onOpenCollections: () => void;
  onOpenAIBrief: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  bookmarksCount,
  collectionsCount,
  onOpenHistory,
  onOpenShortlist,
  onOpenEvidence,
  onOpenCollections,
  onOpenAIBrief,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#f8f6f2]/95 backdrop-blur-md px-6 sm:px-10 py-5 sm:py-6 flex items-center justify-between transition-all">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="#2563eb"
          className="shrink-0"
        >
          <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
        </svg>
        <div className="flex items-baseline gap-2">
          <span className="font-newsreader text-2xl sm:text-[1.75rem] font-bold text-[#1a1a1a] tracking-tight">
            Vision.Discovery
          </span>
          <span className="hidden xl:inline-block mono text-[0.62rem] text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded-full border border-[#2563eb]/15">
            Node v2.4 Active
          </span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Saved Videos Button */}
        <button
          onClick={onOpenShortlist}
          className="btn btn-soft text-xs sm:text-sm"
        >
          <Bookmark className="w-3.5 h-3.5 text-[#2563eb]" />
          <span className="mono">Saved</span>
          <span className="font-mono text-xs opacity-80">({bookmarksCount})</span>
        </button>

        {/* History Button */}
        <button
          onClick={onOpenHistory}
          className="btn btn-soft text-xs sm:text-sm hidden sm:inline-flex"
        >
          <History className="w-3.5 h-3.5 text-[#666]" />
          <span className="mono">History</span>
          {historyCount > 0 && (
            <span className="font-mono text-xs opacity-80">({historyCount})</span>
          )}
        </button>

        {/* Boards Button */}
        <button
          onClick={onOpenCollections}
          className="btn btn-soft text-xs sm:text-sm hidden md:inline-flex"
        >
          <FolderHeart className="w-3.5 h-3.5 text-[#666]" />
          <span className="mono">Boards</span>
          {collectionsCount > 0 && (
            <span className="font-mono text-xs opacity-80">({collectionsCount})</span>
          )}
        </button>

        {/* Evidence Benchmark Button */}
        <button
          onClick={onOpenEvidence}
          className="btn btn-soft text-xs sm:text-sm hidden lg:inline-flex"
        >
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span className="mono">Evidence</span>
        </button>

        {/* AI Briefs Primary Button from Variation 3 */}
        <button
          onClick={onOpenAIBrief}
          className="btn btn-primary text-xs sm:text-sm"
        >
          <FileEdit className="w-4 h-4 text-white" />
          <span>AI Briefs</span>
        </button>
      </div>
    </header>
  );
};
