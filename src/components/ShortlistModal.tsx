import React from 'react';
import {
  X,
  Bookmark,
  Trash2,
  Play,
  FileSpreadsheet,
  ExternalLink,
} from 'lucide-react';
import { VideoItem } from '../types.ts';

interface ShortlistModalProps {
  bookmarks: VideoItem[];
  onClose: () => void;
  onSelectVideo: (video: VideoItem) => void;
  onRemoveBookmark: (video: VideoItem) => void;
}

export const ShortlistModal: React.FC<ShortlistModalProps> = ({
  bookmarks,
  onClose,
  onSelectVideo,
  onRemoveBookmark,
}) => {
  const handleExportCSV = () => {
    if (bookmarks.length === 0) return;
    const headers = ['ID', 'Platform', 'Match Score', 'Title', 'Handle', 'Views', 'Source URL'];
    const rows = bookmarks.map((v) => [
      `"${v.id}"`,
      `"${v.platform}"`,
      v.matchScore,
      `"${v.title.replace(/"/g, '""')}"`,
      `"${v.author.handle}"`,
      v.metrics.views,
      `"${v.sourceUrl}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'shortlisted_product_videos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="bg-[#f8f6f2] w-full max-w-3xl rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f5f3ff] flex items-center justify-center text-[#7c3aed]">
              <Bookmark className="w-5 h-5 text-[#7c3aed] fill-current" />
            </div>
            <div>
              <span className="mono text-[#7c3aed] font-bold">Curated Shortlist</span>
              <h2 className="font-newsreader text-2xl font-bold text-[#1a1a1a]">
                Saved Creative Candidates ({bookmarks.length})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bookmarks.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="btn btn-soft text-xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export CSV</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-[#888] hover:text-[#1a1a1a] cursor-pointer rounded-full hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bookmarked list */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 bg-[#faf9f5]">
          {bookmarks.length > 0 ? (
            bookmarks.map((v) => (
              <div
                key={v.id}
                onClick={() => {
                  onSelectVideo(v);
                  onClose();
                }}
                className="p-3 bg-white border border-[rgba(26,26,26,0.08)] hover:border-[#1a1a1a] rounded transition cursor-pointer flex items-center justify-between gap-4 group shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-16 h-20 rounded overflow-hidden bg-black/10 shrink-0">
                    <img
                      src={v.thumbnailUrl}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>

                  <div className="min-w-0 font-mono text-xs">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="px-1.5 py-0.2 bg-black/80 text-white rounded text-[0.6rem] font-bold">
                        {v.matchScore}%
                      </span>
                      <span className="text-[0.65rem] text-[rgba(26,26,26,0.5)]">
                        {v.platform.toUpperCase()} • @{v.author.handle}
                      </span>
                    </div>

                    <div className="font-serif-cormorant text-base font-bold text-[#1a1a1a] truncate group-hover:underline">
                      {v.title}
                    </div>

                    <div className="text-[0.65rem] text-[rgba(26,26,26,0.5)] truncate">
                      {v.metrics.views.toLocaleString()} views • {v.matchReason}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBookmark(v);
                    }}
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-white border border-[rgba(26,26,26,0.08)] rounded">
              <Bookmark className="w-8 h-8 text-[rgba(26,26,26,0.2)] mx-auto mb-2" />
              <p className="font-serif-cormorant text-xl text-[rgba(26,26,26,0.7)] mb-1">
                Your shortlist is empty
              </p>
              <p className="text-xs font-mono text-[rgba(26,26,26,0.4)]">
                Click the bookmark icon on any discovered reel or ad to build your production list.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
