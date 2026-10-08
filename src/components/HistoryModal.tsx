import React from 'react';
import { X, History, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import { SearchResultPackage } from '../types.ts';

interface HistoryModalProps {
  searches: SearchResultPackage[];
  onClose: () => void;
  onSelectSearch: (search: SearchResultPackage) => void;
  onClearHistory: () => void;
  isClearing: boolean;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  searches,
  onClose,
  onSelectSearch,
  onClearHistory,
  isClearing,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="bg-[#f8f6f2] w-full max-w-2xl rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f5f3ff] flex items-center justify-center text-[#7c3aed]">
              <History className="w-5 h-5 text-[#7c3aed]" />
            </div>
            <div>
              <span className="mono text-[#7c3aed] font-bold">Discovery Archives</span>
              <h2 className="font-newsreader text-2xl font-bold text-[#1a1a1a]">
                Search Execution History
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#888] hover:text-[#1a1a1a] cursor-pointer rounded-full hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of past searches */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 bg-[#faf9f5]">
          {searches.length > 0 ? (
            searches.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectSearch(item);
                  onClose();
                }}
                className="p-4 bg-white border border-[rgba(26,26,26,0.08)] hover:border-[#1a1a1a] rounded transition cursor-pointer flex items-center justify-between gap-4 group shadow-2xs hover:shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded overflow-hidden bg-black/5 shrink-0 border border-[rgba(26,26,26,0.1)]">
                    <img
                      src={item.product.mainImage}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-mono font-bold text-[#1a1a1a] truncate group-hover:underline">
                      {item.query}
                    </div>
                    <div className="text-[0.68rem] text-[rgba(26,26,26,0.5)] truncate">
                      {item.product.title}
                    </div>
                    <div className="text-[0.62rem] font-mono text-[rgba(26,26,26,0.4)] mt-1 flex items-center gap-2">
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                      <span>•</span>
                      <span>
                        {item.totalVideos} videos ({item.instagramCount} Reels, {item.metaCount} Ads)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-[rgba(26,26,26,0.4)] group-hover:text-[#1a1a1a] transition-transform group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-white border border-[rgba(26,26,26,0.08)] rounded">
              <History className="w-8 h-8 text-[rgba(26,26,26,0.2)] mx-auto mb-2" />
              <p className="font-serif-cormorant text-xl text-[rgba(26,26,26,0.7)] mb-1">
                No past searches recorded
              </p>
              <p className="text-xs font-mono text-[rgba(26,26,26,0.4)]">
                Searches will automatically appear here once pipeline runs.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {searches.length > 0 && (
          <div className="p-4 border-t border-[rgba(26,26,26,0.08)] bg-white flex items-center justify-between font-mono text-xs">
            <span className="text-[0.68rem] text-[rgba(26,26,26,0.5)]">
              {searches.length} past runs in cache
            </span>

            <button
              onClick={onClearHistory}
              disabled={isClearing}
              className="text-rose-700 hover:text-rose-900 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isClearing ? 'Clearing...' : 'Clear All History'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
