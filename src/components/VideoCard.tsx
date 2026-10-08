import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  Maximize2,
  FolderPlus,
} from 'lucide-react';
import { VideoItem } from '../types.ts';

interface VideoCardProps {
  video: VideoItem;
  isBookmarked: boolean;
  onToggleBookmark: (video: VideoItem) => void;
  onOpenDetail: (video: VideoItem) => void;
  onAddToCollection?: (videoId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isBookmarked,
  onToggleBookmark,
  onOpenDetail,
  onAddToCollection,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const getPlatformLabel = () => {
    if (video.platform === 'tiktok') return 'TIKTOK TREND';
    if (video.platform === 'meta') return 'META AD';
    if (video.platform === 'instagram') return 'INSTAGRAM REEL';
    return 'YOUTUBE SHORT';
  };

  return (
    <div
      onClick={() => onOpenDetail(video)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group bg-white rounded-2xl p-3.5 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between cursor-pointer border border-[rgba(0,0,0,0.03)]"
    >
      <div>
        {/* Video Preview from Variation 3 */}
        <div className="relative w-full aspect-16/9 sm:aspect-4/3 rounded-xl bg-[#eee] mb-3.5 overflow-hidden">
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            loop
            muted
            playsInline
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top-Right: Score Pill from Variation 3 */}
          <div
            className={`absolute top-2.5 right-2.5 px-3 py-1 rounded-full mono text-[0.65rem] font-bold shadow-xs ${
              video.adMetadata?.daysActive && video.adMetadata.daysActive > 30
                ? 'bg-emerald-600 text-white'
                : 'bg-[#7c3aed] text-white'
            }`}
          >
            {video.adMetadata?.daysActive && video.adMetadata.daysActive > 30
              ? `ACTIVE ${video.adMetadata.daysActive}D`
              : `${video.matchScore}% Match`}
          </div>

          {/* Bottom-Left: Video Label from Variation 3 */}
          <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[0.65rem] font-bold text-[#1a1a1a] shadow-xs">
            {getPlatformLabel()}
          </div>

          {/* Top-Left: Bookmark & Folder actions */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(video);
              }}
              className={`p-1.5 rounded-full backdrop-blur-md transition cursor-pointer shadow-xs ${
                isBookmarked
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-white/90 text-[#1a1a1a] hover:bg-white'
              }`}
              title={isBookmarked ? 'Remove' : 'Save'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {onAddToCollection && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCollection(video.id);
                }}
                className="p-1.5 rounded-full bg-white/90 text-[#1a1a1a] hover:bg-white transition cursor-pointer shadow-xs"
                title="Add to Board"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Creator Handle & Verified badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <strong className="text-sm font-bold text-[#1a1a1a] truncate">
              @{video.author.handle}
            </strong>
            {video.author.verified && (
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            )}
          </div>

          <span className="mono text-[0.6rem] text-[#888]">
            {video.adMetadata ? `AD #${video.adMetadata.adId.slice(-4)}` : 'ORGANIC'}
          </span>
        </div>

        {/* Caption */}
        <p className="text-[0.8rem] text-[#666] my-2 line-clamp-2 leading-relaxed">
          {video.caption}
        </p>
      </div>

      {/* Bottom Metrics matching Variation 3: Views & Likes */}
      <div className="flex items-center justify-between pt-3 border-t border-[rgba(0,0,0,0.05)] mt-2">
        <span className="mono text-[#666] font-semibold">
          {formatNumber(video.metrics.views)} Views
        </span>
        <span className="mono text-[#666] font-semibold">
          {formatNumber(video.metrics.likes)} Likes
        </span>
      </div>
    </div>
  );
};
