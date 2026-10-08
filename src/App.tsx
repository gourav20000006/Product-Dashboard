/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  SearchResultPackage,
  VideoItem,
  BenchmarkEvidence,
  VideoCollection,
  PipelineProgressState,
} from './types.ts';
import {
  generateDiscoveryResults,
  BENCHMARK_EVIDENCE,
} from './data/mockData.ts';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { VideoGrid } from './components/VideoGrid.tsx';
import { PipelineStepper } from './components/PipelineStepper.tsx';
import { VideoDetailModal } from './components/VideoDetailModal.tsx';
import { AIBriefModal } from './components/AIBriefModal.tsx';
import { CollectionsModal } from './components/CollectionsModal.tsx';
import { HistoryModal } from './components/HistoryModal.tsx';
import { ShortlistModal } from './components/ShortlistModal.tsx';
import { EvidenceModal } from './components/EvidenceModal.tsx';

export default function App() {
  // Current search result package (defaults to oversized graphic tee)
  const [currentSearch, setCurrentSearch] = useState<SearchResultPackage>(() =>
    generateDiscoveryResults('oversized graphic tee')
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pipelineProgress, setPipelineProgress] = useState<PipelineProgressState | null>(null);

  // Modals & Panels state
  const [selectedVideoForDetail, setSelectedVideoForDetail] = useState<VideoItem | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isShortlistOpen, setIsShortlistOpen] = useState<boolean>(false);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState<boolean>(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState<boolean>(false);
  const [isAIBriefOpen, setIsAIBriefOpen] = useState<boolean>(false);
  const [isClearingHistory, setIsClearingHistory] = useState<boolean>(false);

  // Persistent storage state
  const [history, setHistory] = useState<SearchResultPackage[]>(() => {
    try {
      const stored = localStorage.getItem('pvd_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [bookmarks, setBookmarks] = useState<VideoItem[]>(() => {
    try {
      const stored = localStorage.getItem('pvd_bookmarks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [collections, setCollections] = useState<VideoCollection[]>([
    {
      id: 'col_winners',
      name: 'Scale Winners 🔥',
      description: 'High-performing creatives active for 30+ days with >90% visual match',
      createdAt: new Date().toISOString(),
      color: '#1a1a1a',
      videoIds: [],
    },
    {
      id: 'col_hooks',
      name: 'Hook Inspirations',
      description: 'Top first 3-second visual and spoken hooks to replicate',
      createdAt: new Date().toISOString(),
      color: '#2563eb',
      videoIds: [],
    },
    {
      id: 'col_ugc',
      name: 'UGC Creator References',
      description: 'Raw handheld unboxings and styling try-on reels',
      createdAt: new Date().toISOString(),
      color: '#059669',
      videoIds: [],
    },
  ]);

  const [evidence, setEvidence] = useState<BenchmarkEvidence[]>(BENCHMARK_EVIDENCE);

  // Initial load from server APIs
  useEffect(() => {
    loadServerData();
  }, []);

  const loadServerData = async () => {
    try {
      // 1. Fetch History
      const hRes = await fetch('/api/history');
      if (hRes.ok) {
        const hJson = await hRes.json();
        if (hJson.success && hJson.searches && hJson.searches.length > 0) {
          setHistory(hJson.searches);
          setCurrentSearch(hJson.searches[0]);
        }
      }

      // 2. Fetch Bookmarks
      const bRes = await fetch('/api/bookmarks');
      if (bRes.ok) {
        const bJson = await bRes.json();
        if (bJson.success && bJson.bookmarks && bJson.bookmarks.length > 0) {
          setBookmarks(bJson.bookmarks);
        }
      }

      // 3. Fetch Collections
      const cRes = await fetch('/api/collections');
      if (cRes.ok) {
        const cJson = await cRes.json();
        if (cJson.success && cJson.collections) {
          setCollections(cJson.collections);
        }
      }

      // 4. Fetch Evidence
      const eRes = await fetch('/api/test-evidence');
      if (eRes.ok) {
        const eJson = await eRes.json();
        if (eJson.success && eJson.evidence) {
          setEvidence(eJson.evidence);
        }
      }
    } catch (err) {
      console.warn('Server fetch non-fatal error:', err);
    }
  };

  // Execute Search Pipeline
  const handleExecuteSearch = async (params: {
    query?: string;
    url?: string;
    imageBase64?: string;
    includeTikTok: boolean;
    includeYouTube: boolean;
    minMatchThreshold: number;
    stepByStepMode?: boolean;
  }) => {
    setIsLoading(true);

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    try {
      if (params.stepByStepMode) {
        setPipelineProgress({
          step: 'resolving',
          progressPercent: 12,
          message: 'Resolving product target and fetching DOM imagery...',
        });
        await delay(500);

        setPipelineProgress({
          step: 'extracting',
          progressPercent: 28,
          message: 'Gemini Multimodal Vision: Analyzing silhouette, Pantone colors, and materials...',
        });
        await delay(600);

        setPipelineProgress({
          step: 'crawling_ig',
          progressPercent: 48,
          message: 'Instagram Graph & Reels Crawler: Fetching 20+ viral lookbook reels...',
        });
        await delay(600);

        setPipelineProgress({
          step: 'querying_meta',
          progressPercent: 68,
          message: 'Meta Ad Library API: Querying active commercial video campaigns (20+ quota)...',
        });
        await delay(600);

        if (params.includeTikTok) {
          setPipelineProgress({
            step: 'scraping_tiktok',
            progressPercent: 80,
            message: 'TikTok Creative Center: Ingesting trending sound try-ons and UGC reviews...',
          });
          await delay(500);
        }

        setPipelineProgress({
          step: 'hashing_dedup',
          progressPercent: 88,
          message: 'Perceptual Hashing: Filtering duplicate creative uploads and clone reels...',
        });
        await delay(500);

        setPipelineProgress({
          step: 'scoring_gemini',
          progressPercent: 96,
          message: `Applying Gemini Vision thresholding (>= ${params.minMatchThreshold}%)...`,
        });
        await delay(400);
      } else {
        setPipelineProgress({
          step: 'resolving',
          progressPercent: 35,
          message: 'Executing full-stack AI discovery pipeline...',
        });
      }

      let searchData: SearchResultPackage | null = null;
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            searchData = json.data;
          }
        }
      } catch (e) {
        console.warn('Falling back to client search engine:', e);
      }

      if (!searchData) {
        searchData = generateDiscoveryResults(params.query || params.url || 'Oversized Tee', {
          includeTikTok: params.includeTikTok,
          includeYouTube: params.includeYouTube,
          minMatchThreshold: params.minMatchThreshold,
        });
      }

      if (params.minMatchThreshold > 0) {
        searchData.results = searchData.results.filter(
          (v) => v.matchScore >= params.minMatchThreshold
        );
      }

      setCurrentSearch(searchData);

      setHistory((prev) => {
        const updated = [searchData!, ...prev.filter((p) => p.id !== searchData!.id)].slice(0, 15);
        try {
          localStorage.setItem('pvd_history', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setPipelineProgress(null);
    } catch (error) {
      console.error('Search pipeline error:', error);
      setPipelineProgress(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBookmark = async (video: VideoItem) => {
    try {
      await fetch('/api/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video }),
      });
    } catch {}

    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === video.id);
      const updated = exists ? prev.filter((b) => b.id !== video.id) : [video, ...prev];
      try {
        localStorage.setItem('pvd_bookmarks', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleCreateCollection = async (name: string, description: string) => {
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          collection: { name, description },
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.collections) {
          setCollections(json.collections);
          return;
        }
      }
    } catch {}

    const newCol: VideoCollection = {
      id: `col_${Date.now()}`,
      name,
      description,
      createdAt: new Date().toISOString(),
      color: '#1a1a1a',
      videoIds: [],
    };
    setCollections((prev) => [...prev, newCol]);
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', collectionId: id }),
      });
    } catch {}
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  const handleToggleVideoInCollection = async (videoId: string, collectionId: string) => {
    try {
      await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle-video',
          collectionId,
          videoId,
        }),
      });
    } catch {}

    setCollections((prev) =>
      prev.map((c) => {
        if (c.id === collectionId) {
          const has = c.videoIds.includes(videoId);
          return {
            ...c,
            videoIds: has ? c.videoIds.filter((id) => id !== videoId) : [...c.videoIds, videoId],
          };
        }
        return c;
      })
    );
  };

  const handleClearHistory = async () => {
    setIsClearingHistory(true);
    try {
      await fetch('/api/history', { method: 'DELETE' });
    } catch {}
    setHistory([]);
    try {
      localStorage.removeItem('pvd_history');
    } catch {}
    setIsClearingHistory(false);
  };

  const handleUpdateNotes = (videoId: string, notes: string, rating: number) => {
    setCurrentSearch((prev) => ({
      ...prev,
      results: prev.results.map((v) =>
        v.id === videoId ? { ...v, userNotes: notes, userRating: rating } : v
      ),
    }));
    setBookmarks((prev) =>
      prev.map((v) =>
        v.id === videoId ? { ...v, userNotes: notes, userRating: rating } : v
      )
    );
    if (selectedVideoForDetail && selectedVideoForDetail.id === videoId) {
      setSelectedVideoForDetail((prev) =>
        prev ? { ...prev, userNotes: notes, userRating: rating } : null
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] text-[#1a1a1a] flex flex-col">
      {/* Top Header */}
      <Header
        historyCount={history.length}
        bookmarksCount={bookmarks.length}
        collectionsCount={collections.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenShortlist={() => setIsShortlistOpen(true)}
        onOpenEvidence={() => setIsEvidenceOpen(true)}
        onOpenCollections={() => setIsCollectionsOpen(true)}
        onOpenAIBrief={() => setIsAIBriefOpen(true)}
      />

      {/* Main Two-Column Layout from Variation 3 */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[400px_1fr] gap-8 sm:gap-10 px-4 sm:px-10 pb-10 overflow-hidden">
        {/* Left Control Sidebar */}
        <Sidebar
          onExecuteSearch={handleExecuteSearch}
          isLoading={isLoading}
          totalFilteredDuplicates={currentSearch.filteredDuplicatesCount}
          currentReelCount={currentSearch.results.filter((v) => v.platform === 'instagram').length}
          currentMetaCount={currentSearch.results.filter((v) => v.platform === 'meta').length}
          currentTikTokCount={currentSearch.results.filter((v) => v.platform === 'tiktok').length}
          currentYouTubeCount={currentSearch.results.filter((v) => v.platform === 'youtube').length}
        />

        {/* Right Dashboard Work Area */}
        <main className="flex-1 overflow-y-auto pr-0 sm:pr-3">
          {/* Real-time Pipeline Stepper */}
          {pipelineProgress && <PipelineStepper progress={pipelineProgress} />}

          {/* Product Hero Card */}
          <ProductCard
            product={currentSearch.product}
            attributes={currentSearch.attributes}
          />

          {/* Video Discovery Grid & Filter Suite */}
          <VideoGrid
            currentSearch={currentSearch}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onOpenDetail={(video) => setSelectedVideoForDetail(video)}
            onOpenAIBrief={() => setIsAIBriefOpen(true)}
            onAddToCollection={(videoId) => setIsCollectionsOpen(true)}
          />
        </main>
      </div>

      {/* Modals */}
      {selectedVideoForDetail && (
        <VideoDetailModal
          video={selectedVideoForDetail}
          product={currentSearch.product}
          isBookmarked={bookmarks.some((b) => b.id === selectedVideoForDetail.id)}
          collections={collections}
          onClose={() => setSelectedVideoForDetail(null)}
          onToggleBookmark={handleToggleBookmark}
          onAddToCollection={handleToggleVideoInCollection}
          onUpdateNotes={handleUpdateNotes}
        />
      )}

      {isAIBriefOpen && (
        <AIBriefModal
          product={currentSearch.product}
          winningVideos={currentSearch.results.filter((v) => v.matchScore >= 80)}
          onClose={() => setIsAIBriefOpen(false)}
        />
      )}

      {isCollectionsOpen && (
        <CollectionsModal
          collections={collections}
          allVideos={currentSearch.results}
          onClose={() => setIsCollectionsOpen(false)}
          onCreateCollection={handleCreateCollection}
          onDeleteCollection={handleDeleteCollection}
          onRemoveVideo={(colId, vidId) => handleToggleVideoInCollection(vidId, colId)}
          onOpenVideo={(v) => {
            setSelectedVideoForDetail(v);
            setIsCollectionsOpen(false);
          }}
        />
      )}

      {isHistoryOpen && (
        <HistoryModal
          searches={history}
          onClose={() => setIsHistoryOpen(false)}
          onSelectSearch={(s) => setCurrentSearch(s)}
          onClearHistory={handleClearHistory}
          isClearing={isClearingHistory}
        />
      )}

      {isShortlistOpen && (
        <ShortlistModal
          bookmarks={bookmarks}
          onClose={() => setIsShortlistOpen(false)}
          onSelectVideo={(v) => setSelectedVideoForDetail(v)}
          onRemoveBookmark={handleToggleBookmark}
        />
      )}

      {isEvidenceOpen && (
        <EvidenceModal
          evidence={evidence}
          onClose={() => setIsEvidenceOpen(false)}
        />
      )}
    </div>
  );
}
