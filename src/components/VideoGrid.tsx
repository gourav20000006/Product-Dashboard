import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  FileCode,
  Printer,
  Copy,
  Check,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { VideoItem, Platform, SearchResultPackage } from '../types.ts';
import { VideoCard } from './VideoCard.tsx';

interface VideoGridProps {
  currentSearch: SearchResultPackage;
  bookmarks: VideoItem[];
  onToggleBookmark: (video: VideoItem) => void;
  onOpenDetail: (video: VideoItem) => void;
  onOpenAIBrief: () => void;
  onAddToCollection?: (videoId: string) => void;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  currentSearch,
  bookmarks,
  onToggleBookmark,
  onOpenDetail,
  onOpenAIBrief,
  onAddToCollection,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all' | 'bookmarks'>('all');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'medium'>('all');
  const [angleFilter, setAngleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'views' | 'recent' | 'likes' | 'longevity'>('score');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  const bookmarkIds = useMemo(() => new Set(bookmarks.map((b) => b.id)), [bookmarks]);

  // Filter & Sort video list
  const filteredVideos = useMemo(() => {
    let list = [...currentSearch.results];

    if (selectedPlatform === 'bookmarks') {
      list = list.filter((v) => bookmarkIds.has(v.id));
    } else if (selectedPlatform !== 'all') {
      list = list.filter((v) => v.platform === selectedPlatform);
    }

    if (scoreFilter === 'high') {
      list = list.filter((v) => v.matchScore >= 80);
    } else if (scoreFilter === 'medium') {
      list = list.filter((v) => v.matchScore >= 60 && v.matchScore < 80);
    }

    if (angleFilter !== 'all') {
      list = list.filter(
        (v) =>
          v.adMetadata?.creativeAngle === angleFilter ||
          v.hookAnalysis?.hookType === angleFilter
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.caption.toLowerCase().includes(q) ||
          v.author.handle.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'score') return b.matchScore - a.matchScore;
      if (sortBy === 'views') return b.metrics.views - a.metrics.views;
      if (sortBy === 'likes') return b.metrics.likes - a.metrics.likes;
      if (sortBy === 'recent')
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      if (sortBy === 'longevity')
        return (b.adMetadata?.daysActive || 0) - (a.adMetadata?.daysActive || 0);
      return 0;
    });

    return list;
  }, [
    currentSearch.results,
    selectedPlatform,
    scoreFilter,
    angleFilter,
    sortBy,
    searchQuery,
    bookmarkIds,
  ]);

  const handleExportCSV = () => {
    const headers = [
      'ID', 'Platform', 'Match Score', 'Title', 'Handle', 'Views', 'Likes', 'Comments', 'Source URL'
    ];
    const rows = filteredVideos.map((v) => [
      `"${v.id}"`, `"${v.platform}"`, v.matchScore, `"${v.title.replace(/"/g, '""')}"`,
      `"${v.author.handle}"`, v.metrics.views, v.metrics.likes, v.metrics.comments, `"${v.sourceUrl}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `discovered_videos_${currentSearch.query.replace(/[^a-z0-9]/gi, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyMarkdown = () => {
    const summary = [
      `# Discovered Creatives: ${currentSearch.product.title}`,
      `Total: ${filteredVideos.length} Videos`,
      ...filteredVideos.slice(0, 5).map(
        (v, i) => `${i + 1}. [${v.title}](${v.sourceUrl}) - **${v.matchScore}% Match** (${v.platform.toUpperCase()}) | Views: ${v.metrics.views.toLocaleString()}`
      ),
    ].join('\n');
    navigator.clipboard.writeText(summary);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Strip from Variation 3 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex flex-wrap items-center gap-5 sm:gap-6">
          <h3 className="mono text-sm sm:text-base font-bold text-[#1a1a1a]">
            Discovered Creatives ({filteredVideos.length})
          </h3>

          {/* Platform filters in accent purple */}
          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setSelectedPlatform('all')}
              className={`transition cursor-pointer ${
                selectedPlatform === 'all'
                  ? 'text-[#7c3aed] underline underline-offset-4 font-bold'
                  : 'text-[#666] hover:text-[#1a1a1a]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedPlatform('instagram')}
              className={`transition cursor-pointer ${
                selectedPlatform === 'instagram'
                  ? 'text-[#7c3aed] underline underline-offset-4 font-bold'
                  : 'text-[#666] hover:text-[#1a1a1a]'
              }`}
            >
              Reels ({currentSearch.instagramCount})
            </button>
            <button
              onClick={() => setSelectedPlatform('meta')}
              className={`transition cursor-pointer ${
                selectedPlatform === 'meta'
                  ? 'text-[#7c3aed] underline underline-offset-4 font-bold'
                  : 'text-[#666] hover:text-[#1a1a1a]'
              }`}
            >
              Ads ({currentSearch.metaCount})
            </button>
            <button
              onClick={() => setSelectedPlatform('tiktok')}
              className={`transition cursor-pointer ${
                selectedPlatform === 'tiktok'
                  ? 'text-[#7c3aed] underline underline-offset-4 font-bold'
                  : 'text-[#666] hover:text-[#1a1a1a]'
              }`}
            >
              TikTok ({currentSearch.tiktokCount})
            </button>
            <button
              onClick={() => setSelectedPlatform('youtube')}
              className={`transition cursor-pointer ${
                selectedPlatform === 'youtube'
                  ? 'text-[#7c3aed] underline underline-offset-4 font-bold'
                  : 'text-[#666] hover:text-[#1a1a1a]'
              }`}
            >
              Shorts ({currentSearch.youtubeCount})
            </button>
          </div>
        </div>

        {/* Action Buttons: Filter & Sort, Export */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-soft text-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#7c3aed]" />
            <span>Filter & Sort</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="btn btn-soft text-xs hidden sm:inline-flex"
            title="Export CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="btn btn-soft text-xs hidden sm:inline-flex"
            title="Copy Markdown"
          >
            {copiedMarkdown ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#666]" />
            )}
            <span>{copiedMarkdown ? 'Copied' : 'MD'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Filter & Sorting Drawer */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[rgba(0,0,0,0.04)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono animate-in fade-in duration-200">
          <div>
            <label className="mono block mb-1.5">Filter by Query</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#888] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search caption or handle..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#f8f6f2] border border-[#eee] text-[#1a1a1a] outline-none focus:border-[#7c3aed]"
              />
            </div>
          </div>

          <div>
            <label className="mono block mb-1.5">Match Confidence</label>
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value as any)}
              className="w-full p-2 rounded-xl bg-[#f8f6f2] border border-[#eee] text-[#1a1a1a] outline-none focus:border-[#7c3aed] cursor-pointer"
            >
              <option value="all">All Confidence Scores</option>
              <option value="high">High Match (&gt;80%)</option>
              <option value="medium">Medium Match (60-80%)</option>
            </select>
          </div>

          <div>
            <label className="mono block mb-1.5">Sort Order</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2 rounded-xl bg-[#f8f6f2] border border-[#eee] text-[#1a1a1a] outline-none focus:border-[#7c3aed] cursor-pointer"
            >
              <option value="score">Highest Match Score</option>
              <option value="views">Most Views</option>
              <option value="likes">Most Likes</option>
              <option value="recent">Most Recent</option>
              <option value="longevity">Longest Running Ads</option>
            </select>
          </div>
        </div>
      )}

      {/* Discovery Grid matching Variation 3 (32px gap) */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              isBookmarked={bookmarkIds.has(video.id)}
              onToggleBookmark={onToggleBookmark}
              onOpenDetail={onOpenDetail}
              onAddToCollection={onAddToCollection}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-14 text-center border border-[rgba(0,0,0,0.03)] shadow-xs">
          <p className="font-newsreader text-2xl text-[#1a1a1a] mb-2 font-bold">
            No creatives found matching criteria
          </p>
          <p className="text-xs font-mono text-[#666] mb-4">
            Reset filters to view all 66+ discovered Instagram Reels and Meta Ads.
          </p>
          <button
            onClick={() => {
              setSelectedPlatform('all');
              setScoreFilter('all');
              setSearchQuery('');
            }}
            className="btn btn-primary"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
