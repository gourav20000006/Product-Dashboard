import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  ExternalLink,
  Download,
  Bookmark,
  Share2,
  ShieldCheck,
  Flame,
  Sparkles,
  Layers,
  Palette,
  Scissors,
  CheckCircle,
  Star,
  FolderPlus,
  Clock,
  Eye,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { VideoItem, ProductData, VideoCollection } from '../types.ts';

interface VideoDetailModalProps {
  video: VideoItem;
  product: ProductData;
  isBookmarked: boolean;
  collections: VideoCollection[];
  onClose: () => void;
  onToggleBookmark: (video: VideoItem) => void;
  onAddToCollection: (videoId: string, collectionId: string) => void;
  onUpdateNotes?: (videoId: string, notes: string, rating: number) => void;
}

export const VideoDetailModal: React.FC<VideoDetailModalProps> = ({
  video,
  product,
  isBookmarked,
  collections,
  onClose,
  onToggleBookmark,
  onAddToCollection,
  onUpdateNotes,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'vision' | 'hook' | 'ad' | 'notes'>('vision');
  const [userRating, setUserRating] = useState<number>(video.userRating || 0);
  const [userNotes, setUserNotes] = useState<string>(video.userNotes || '');
  const [selectedCol, setSelectedCol] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Fetch live AI vision analysis if available
    const fetchAiDetails = async () => {
      setLoadingAi(true);
      try {
        const res = await fetch('/api/ai-analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoTitle: video.title,
            productTitle: product.title,
            platform: video.platform,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setAiAnalysis(json.analysis);
          }
        }
      } catch (err) {
        console.warn('AI analysis fetch error:', err);
      } finally {
        setLoadingAi(false);
      }
    };

    fetchAiDetails();
  }, [video, product]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSaveNotes = () => {
    if (onUpdateNotes) {
      onUpdateNotes(video.id, userNotes, userRating);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="bg-[#f8f6f2] w-full max-w-5xl rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-2xl flex flex-col md:flex-row max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column: Interactive Video Player & Side-by-Side Reference */}
        <div className="w-full md:w-1/2 bg-black flex flex-col items-center justify-between relative overflow-hidden">
          {/* Top Overlays */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between text-white">
            <span className="px-3 py-1 bg-[#7c3aed] text-white backdrop-blur-md rounded-full text-xs font-mono font-bold shadow-xs">
              {video.matchScore}% Match Confidence
            </span>

            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/90 transition cursor-pointer text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Main Video Element */}
          <div className="relative w-full h-[360px] md:h-full flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              src={video.videoUrl}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              onClick={togglePlay}
              className="w-full h-full object-contain cursor-pointer"
            />

            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center cursor-pointer hover:scale-105 transition"
              >
                <Play className="w-7 h-7 ml-1 fill-current" />
              </button>
            )}

            {/* Split Screen Thumbnail Comparison (Bottom-Right) */}
            <div className="absolute bottom-4 right-4 z-20 w-24 h-24 rounded-xl border-2 border-white shadow-xl overflow-hidden bg-white group cursor-pointer">
              <img
                src={product.mainImage}
                alt="Product Match Reference"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[0.55rem] font-mono text-white text-center p-1 font-semibold">
                Product Image
              </div>
            </div>
          </div>

          {/* Bottom Bar Controls */}
          <div className="w-full p-3 bg-black/90 backdrop-blur-sm border-t border-white/10 flex items-center justify-between text-white text-xs font-mono">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="hover:text-purple-300 transition cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <span className="text-[0.65rem] text-white/70">
                {video.platform.toUpperCase()} • 9:16 Vertical HD
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={video.videoUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="p-1 text-white/70 hover:text-white cursor-pointer"
                title="Download Video File"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
              <a
                href={video.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-white/70 hover:text-white cursor-pointer"
                title="View on Platform"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Deep Vision Analysis & Creative Inspector */}
        <div className="w-full md:w-1/2 flex flex-col justify-between overflow-y-auto p-6 sm:p-8 bg-[#f8f6f2]">
          <div>
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-[rgba(0,0,0,0.06)]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="mono text-[#7c3aed] font-bold">
                    @{video.author.handle}
                  </span>
                  {video.author.verified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  )}
                  {video.adMetadata && (
                    <span className="px-2 py-0.5 bg-[#f5f3ff] text-[#7c3aed] text-[0.6rem] font-mono rounded-full font-bold border border-[#7c3aed]/20">
                      Ad #{video.adMetadata.adId.slice(-4)}
                    </span>
                  )}
                </div>
                <h2 className="font-newsreader text-2xl sm:text-3xl font-bold text-[#1a1a1a] leading-tight">
                  {video.title}
                </h2>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-[#888] hover:text-[#1a1a1a] transition cursor-pointer rounded-full hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#f4f2eb] rounded mb-5 text-center font-mono text-xs">
              <div>
                <div className="text-[0.6rem] text-[rgba(26,26,26,0.5)]">Views</div>
                <div className="font-semibold text-[#1a1a1a]">
                  {video.metrics.views.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[0.6rem] text-[rgba(26,26,26,0.5)]">Likes</div>
                <div className="font-semibold text-[#1a1a1a]">
                  {video.metrics.likes.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[0.6rem] text-[rgba(26,26,26,0.5)]">Comments</div>
                <div className="font-semibold text-[#1a1a1a]">
                  {video.metrics.comments.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Analysis Tabs */}
            <div className="flex items-center gap-2 border-b border-[rgba(0,0,0,0.06)] mb-4 text-xs font-mono">
              <button
                onClick={() => setActiveTab('vision')}
                className={`pb-2.5 transition-all cursor-pointer font-semibold ${
                  activeTab === 'vision'
                    ? 'border-b-2 border-[#7c3aed] text-[#7c3aed]'
                    : 'text-[#666] hover:text-[#1a1a1a]'
                }`}
              >
                Vision Match Radar
              </button>
              <button
                onClick={() => setActiveTab('hook')}
                className={`pb-2.5 transition-all cursor-pointer font-semibold ${
                  activeTab === 'hook'
                    ? 'border-b-2 border-[#7c3aed] text-[#7c3aed]'
                    : 'text-[#666] hover:text-[#1a1a1a]'
                }`}
              >
                0-3s Hook Inspo
              </button>
              {video.adMetadata && (
                <button
                  onClick={() => setActiveTab('ad')}
                  className={`pb-2.5 transition-all cursor-pointer font-semibold ${
                    activeTab === 'ad'
                      ? 'border-b-2 border-[#7c3aed] text-[#7c3aed]'
                      : 'text-[#666] hover:text-[#1a1a1a]'
                  }`}
                >
                  Ad Longevity
                </button>
              )}
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-2.5 transition-all cursor-pointer font-semibold ${
                  activeTab === 'notes'
                    ? 'border-b-2 border-[#7c3aed] text-[#7c3aed]'
                    : 'text-[#666] hover:text-[#1a1a1a]'
                }`}
              >
                Notes & Rating
              </button>
            </div>

            {/* Tab 1: Vision Match Radar */}
            {activeTab === 'vision' && (
              <div className="space-y-4">
                {/* Score Bars */}
                <div className="space-y-2.5 bg-white p-3.5 border border-[rgba(26,26,26,0.08)] rounded">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-[rgba(26,26,26,0.7)]">
                      <Palette className="w-3.5 h-3.5 text-pink-600" />
                      Colorway Consistency
                    </span>
                    <span className="font-bold text-[#1a1a1a]">
                      {video.scoreBreakdown?.colorway || 96}%
                    </span>
                  </div>
                  <div className="w-full bg-[#f4f2eb] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${video.scoreBreakdown?.colorway || 96}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <span className="flex items-center gap-1.5 text-[rgba(26,26,26,0.7)]">
                      <Scissors className="w-3.5 h-3.5 text-blue-600" />
                      Silhouette & Cut Alignment
                    </span>
                    <span className="font-bold text-[#1a1a1a]">
                      {video.scoreBreakdown?.silhouette || 92}%
                    </span>
                  </div>
                  <div className="w-full bg-[#f4f2eb] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-600 h-full rounded-full"
                      style={{ width: `${video.scoreBreakdown?.silhouette || 92}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <span className="flex items-center gap-1.5 text-[rgba(26,26,26,0.7)]">
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                      Material & Fabric Weight
                    </span>
                    <span className="font-bold text-[#1a1a1a]">
                      {video.scoreBreakdown?.material || 88}%
                    </span>
                  </div>
                  <div className="w-full bg-[#f4f2eb] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full"
                      style={{ width: `${video.scoreBreakdown?.material || 88}%` }}
                    />
                  </div>
                </div>

                {/* Gemini AI Match Verdict */}
                <div className="p-3.5 bg-white border border-[rgba(26,26,26,0.08)] rounded">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span className="label-mono">Gemini Multimodal Vision Analysis</span>
                  </div>
                  <p className="text-xs text-[rgba(26,26,26,0.8)] leading-relaxed mb-2.5">
                    {aiAnalysis?.verdict || video.matchReason}
                  </p>
                  <div className="space-y-1">
                    {(aiAnalysis?.keyDetectedElements || video.detectedVisualFeatures).map(
                      (elem: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-mono text-[rgba(26,26,26,0.7)]">
                          <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{elem}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: 0-3s Hook Inspo */}
            {activeTab === 'hook' && (
              <div className="space-y-3.5 bg-white p-4 border border-[rgba(26,26,26,0.08)] rounded text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="label-mono">Hook Classification</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">
                    {video.hookAnalysis?.hookType || 'Dynamic UGC Angle'}
                  </span>
                </div>

                <div>
                  <div className="text-[0.62rem] text-[rgba(26,26,26,0.5)] uppercase tracking-wider mb-1">
                    Visual Hook Direction (0:00 - 0:03)
                  </div>
                  <div className="p-2.5 bg-[#faf9f5] rounded text-[#1a1a1a]">
                    {video.hookAnalysis?.visualHook ||
                      'Creator holds product right at lens then steps back to show full lookbook silhouette.'}
                  </div>
                </div>

                <div>
                  <div className="text-[0.62rem] text-[rgba(26,26,26,0.5)] uppercase tracking-wider mb-1">
                    Spoken Script / Voiceover
                  </div>
                  <div className="p-2.5 bg-[#faf9f5] rounded text-[#1a1a1a] italic">
                    "{video.hookAnalysis?.spokenText || video.caption.slice(0, 100)}..."
                  </div>
                </div>

                <div className="text-[0.62rem] text-[rgba(26,26,26,0.5)] leading-relaxed">
                  💡 High-converting pattern: Pair this visual action with your custom product branding in your next shoot.
                </div>
              </div>
            )}

            {/* Tab 3: Meta Ad Intelligence */}
            {activeTab === 'ad' && video.adMetadata && (
              <div className="space-y-3 bg-white p-4 border border-[rgba(26,26,26,0.08)] rounded text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="label-mono">Ad Scalability Status</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {video.adMetadata.daysActive && video.adMetadata.daysActive > 30
                      ? 'Scale Winner Creative'
                      : 'Testing Phase'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[0.7rem]">
                  <div className="p-2 bg-[#faf9f5] rounded">
                    <div className="text-[rgba(26,26,26,0.5)]">Active Longevity:</div>
                    <div className="font-bold text-[#1a1a1a]">
                      {video.adMetadata.daysActive} Days Running
                    </div>
                  </div>
                  <div className="p-2 bg-[#faf9f5] rounded">
                    <div className="text-[rgba(26,26,26,0.5)]">Estimated Spend:</div>
                    <div className="font-bold text-[#1a1a1a]">
                      {video.adMetadata.estimatedSpend}
                    </div>
                  </div>
                  <div className="p-2 bg-[#faf9f5] rounded">
                    <div className="text-[rgba(26,26,26,0.5)]">Creative Angle:</div>
                    <div className="font-bold text-[#1a1a1a]">
                      {video.adMetadata.creativeAngle}
                    </div>
                  </div>
                  <div className="p-2 bg-[#faf9f5] rounded">
                    <div className="text-[rgba(26,26,26,0.5)]">Call To Action:</div>
                    <div className="font-bold text-[#1a1a1a]">
                      {video.adMetadata.callToAction}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[0.62rem] text-[rgba(26,26,26,0.5)] mb-1">
                    Distribution Platforms:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {video.adMetadata.platformsIncluded.map((p, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-[#f4f2eb] rounded text-[0.65rem] text-[rgba(26,26,26,0.8)]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: User Notes & Rating */}
            {activeTab === 'notes' && (
              <div className="space-y-3 bg-white p-4 border border-[rgba(26,26,26,0.08)] rounded text-xs font-mono">
                <div>
                  <label className="label-mono block mb-1">Internal Creative Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= userRating ? 'fill-amber-400' : 'text-zinc-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-[0.7rem] text-[rgba(26,26,26,0.5)] ml-2">
                      ({userRating}/5 Stars)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="label-mono block mb-1">Production Notes for Creative Team</label>
                  <textarea
                    rows={3}
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="e.g., Replicate the first 2 seconds pacing, order this sample colorway, use similar sound..."
                    className="w-full p-2.5 rounded border border-[rgba(26,26,26,0.15)] bg-[#faf9f5] outline-none text-xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-3 py-1.5 bg-[#1a1a1a] text-white rounded text-xs font-mono uppercase tracking-wider cursor-pointer"
                >
                  Save Notes
                </button>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-[rgba(26,26,26,0.08)] mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            {/* Add to Collection Selector */}
            <div className="flex items-center gap-2">
              <FolderPlus className="w-3.5 h-3.5 text-[rgba(26,26,26,0.6)]" />
              <select
                value={selectedCol}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedCol(val);
                  if (val) onAddToCollection(video.id, val);
                }}
                className="px-2 py-1 rounded border border-[rgba(26,26,26,0.15)] bg-white text-xs outline-none cursor-pointer"
              >
                <option value="">Add to Board...</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name} ({col.videoIds.length})
                  </option>
                ))}
              </select>
            </div>

            {/* Bookmark & Platform Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleBookmark(video)}
                className={`px-3 py-1.5 rounded border text-xs flex items-center gap-1.5 cursor-pointer transition ${
                  isBookmarked
                    ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                    : 'bg-white text-[#1a1a1a] border-[rgba(26,26,26,0.2)] hover:bg-[#faf9f5]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>

              <a
                href={video.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#333] text-white rounded text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Open Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
