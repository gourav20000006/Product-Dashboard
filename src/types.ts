export type Platform = 'instagram' | 'meta' | 'tiktok' | 'youtube';

export interface ProductData {
  title: string;
  description: string;
  mainImage: string;
  brand: string;
  price: string;
  isScraped?: boolean;
  sourceUrl?: string;
  category?: string;
}

export interface ProductAttributes {
  productType: string;
  primaryColors: string[];
  materials: string[];
  printsOrGraphics: string[];
  logosOrText: string[];
  silhouetteShape: string;
  targetAudience: string;
  searchKeywords: string[];
  instagramHashtags: string[];
  metaAdQueries: string[];
  aestheticTags?: string[];
  detectedColorHexes?: string[];
}

export interface VideoAuthor {
  name: string;
  handle: string;
  verified: boolean;
  avatarUrl?: string;
}

export interface VideoMetrics {
  views: number;
  likes: number;
  comments: number;
  shares?: number;
}

export interface AdMetadata {
  adId: string;
  advertiserName: string;
  runningStatus: string;
  startedRunningDate: string;
  platformsIncluded: string[];
  callToAction: string;
  daysActive?: number;
  estimatedSpend?: string;
  creativeAngle?: 'UGC Testimonial' | 'Aesthetic Showcase' | 'Problem-Solution' | 'Unboxing / ASMR' | 'Founder Story' | 'Commercial';
}

export interface HookAnalysis {
  hookType: string;
  firstThreeSeconds: string;
  visualHook: string;
  spokenText: string;
}

export interface ScoreBreakdown {
  colorway: number;
  silhouette: number;
  material: number;
  graphicLogo: number;
}

export interface VideoItem {
  id: string;
  platform: Platform;
  title: string;
  caption: string;
  thumbnailUrl: string;
  videoUrl: string;
  sourceUrl: string;
  author: VideoAuthor;
  metrics: VideoMetrics;
  adMetadata?: AdMetadata;
  matchScore: number;
  matchReason: string;
  detectedVisualFeatures: string[];
  isMatch: boolean;
  publishedAt: string;
  contentHash: string;
  hookAnalysis?: HookAnalysis;
  scoreBreakdown?: ScoreBreakdown;
  userNotes?: string;
  userRating?: number;
}

export interface SearchResultPackage {
  id: string;
  query: string;
  product: ProductData;
  attributes: ProductAttributes;
  totalVideos: number;
  instagramCount: number;
  metaCount: number;
  tiktokCount: number;
  youtubeCount: number;
  filteredDuplicatesCount: number;
  results: VideoItem[];
  createdAt: string;
}

export interface BenchmarkEvidence {
  productName: string;
  category: string;
  testQueryOrUrl: string;
  instagramCount: number;
  metaCount: number;
  tiktokCount: number;
  youtubeCount?: number;
  averageScore: number;
  highMatchSample: {
    platform: string;
    score: number;
    reason: string;
  };
  lowMatchSample: {
    platform: string;
    score: number;
    reason: string;
  };
  duplicatesFiltered: number;
  dedupRatio: string;
}

export interface VideoCollection {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  color: string;
  videoIds: string[];
}

export interface PipelineProgressState {
  step: 'idle' | 'resolving' | 'extracting' | 'crawling_ig' | 'querying_meta' | 'scraping_tiktok' | 'hashing_dedup' | 'scoring_gemini' | 'complete';
  progressPercent: number;
  message: string;
  logs?: string[];
}
