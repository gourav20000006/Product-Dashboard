import React, { useState, useRef } from 'react';
import {
  Search,
  Link as LinkIcon,
  Upload,
  X,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { PRESET_CATALOG, PresetItem } from '../data/mockData.ts';

interface SidebarProps {
  onExecuteSearch: (params: {
    query?: string;
    url?: string;
    imageBase64?: string;
    includeTikTok: boolean;
    includeYouTube: boolean;
    minMatchThreshold: number;
    stepByStepMode?: boolean;
  }) => void;
  isLoading: boolean;
  totalFilteredDuplicates: number;
  currentReelCount: number;
  currentMetaCount: number;
  currentTikTokCount: number;
  currentYouTubeCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onExecuteSearch,
  isLoading,
  totalFilteredDuplicates,
  currentReelCount,
  currentMetaCount,
  currentTikTokCount,
  currentYouTubeCount,
}) => {
  const [activeTab, setActiveTab] = useState<'keyword' | 'url' | 'image'>('keyword');
  const [keywordInput, setKeywordInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Active nodes toggles
  const [includeReels, setIncludeReels] = useState(true);
  const [includeMeta, setIncludeMeta] = useState(true);
  const [includeTikTok, setIncludeTikTok] = useState(true);
  const [includeYouTube, setIncludeYouTube] = useState(true);

  // Match confidence threshold
  const [minMatchThreshold, setMinMatchThreshold] = useState<number>(60);
  const [stepByStepMode, setStepByStepMode] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    if (activeTab === 'keyword' && !keywordInput.trim()) return;
    if (activeTab === 'url' && !urlInput.trim()) return;
    if (activeTab === 'image' && !imagePreview) return;

    onExecuteSearch({
      query: activeTab === 'keyword' ? keywordInput : undefined,
      url: activeTab === 'url' ? urlInput : undefined,
      imageBase64: activeTab === 'image' && imagePreview ? imagePreview : undefined,
      includeTikTok,
      includeYouTube,
      minMatchThreshold,
      stepByStepMode,
    });
  };

  const handlePresetSelect = (preset: PresetItem) => {
    setActiveTab('keyword');
    setKeywordInput(preset.query);
    onExecuteSearch({
      query: preset.query,
      includeTikTok,
      includeYouTube,
      minMatchThreshold,
      stepByStepMode,
    });
  };

  return (
    <aside className="w-full lg:w-[400px] bg-white rounded-3xl p-7 sm:p-8 overflow-y-auto shrink-0 flex flex-col gap-8 shadow-sm border border-[rgba(0,0,0,0.03)]">
      {/* 1. Product Lookup Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="mono">Product Lookup</h4>
          <span className="text-[0.65rem] font-mono text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded-full font-semibold">
            Ready
          </span>
        </div>

        {/* Input Format Switcher */}
        <div className="flex items-center gap-1 bg-[#f8f6f2] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('keyword')}
            className={`flex-1 py-1.5 text-xs font-mono transition-all rounded-lg cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'keyword'
                ? 'bg-white text-[#1a1a1a] shadow-xs font-semibold'
                : 'text-[#666] hover:text-[#1a1a1a]'
            }`}
          >
            <Search className="w-3 h-3 text-[#2563eb]" />
            <span>Keyword</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-1.5 text-xs font-mono transition-all rounded-lg cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'url'
                ? 'bg-white text-[#1a1a1a] shadow-xs font-semibold'
                : 'text-[#666] hover:text-[#1a1a1a]'
            }`}
          >
            <LinkIcon className="w-3 h-3 text-[#2563eb]" />
            <span>Link URL</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-1.5 text-xs font-mono transition-all rounded-lg cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'image'
                ? 'bg-white text-[#1a1a1a] shadow-xs font-semibold'
                : 'text-[#666] hover:text-[#1a1a1a]'
            }`}
          >
            <Upload className="w-3 h-3 text-[#2563eb]" />
            <span>Photo</span>
          </button>
        </div>

        {/* Search Field */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {activeTab === 'keyword' && (
            <div className="relative">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Start your search..."
                className="w-full px-5 py-3.5 rounded-xl border-[1.5px] border-[#eee] font-newsreader text-xl text-[#1a1a1a] outline-none bg-[#f8f6f2] focus:border-[#2563eb] focus:bg-white transition-all shadow-2xs"
              />
              {keywordInput && (
                <button
                  type="button"
                  onClick={() => setKeywordInput('')}
                  className="absolute right-4 top-4 text-[#888] hover:text-[#1a1a1a] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {activeTab === 'url' && (
            <div className="relative">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://brand.com/products/..."
                className="w-full px-5 py-3.5 rounded-xl border-[1.5px] border-[#eee] font-mono text-xs text-[#1a1a1a] outline-none bg-[#f8f6f2] focus:border-[#2563eb] focus:bg-white transition-all shadow-2xs"
              />
              {urlInput && (
                <button
                  type="button"
                  onClick={() => setUrlInput('')}
                  className="absolute right-4 top-4 text-[#888] hover:text-[#1a1a1a] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {activeTab === 'image' && (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageFile}
                accept="image/*"
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative aspect-video rounded-xl border border-[#eee] overflow-hidden bg-black/5">
                  <img
                    src={imagePreview}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[#1a1a1a] shadow cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-7 border-2 border-dashed border-[#ddd] hover:border-[#2563eb] rounded-xl text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer transition bg-[#f8f6f2] hover:bg-white"
                >
                  <Upload className="w-5 h-5 text-[#2563eb]" />
                  <span className="text-xs font-mono text-[#1a1a1a] font-semibold">
                    Upload Product Image
                  </span>
                  <span className="text-[0.62rem] font-mono text-[#888]">
                    Gemini Vision processes color & cut specs
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Primary CTA button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full justify-center py-4 rounded-full text-sm font-semibold tracking-wide cursor-pointer disabled:opacity-50 shadow-md hover:bg-[#2563eb] transition-colors"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Executing Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Initiate Pipeline</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 2. Popular Niches Presets */}
      <div className="space-y-3">
        <h4 className="mono">Popular Niches</h4>
        <div className="grid grid-cols-2 gap-3">
          {PRESET_CATALOG.slice(0, 6).map((preset) => (
            <div
              key={preset.query}
              onClick={() => handlePresetSelect(preset)}
              className="p-3.5 rounded-xl bg-[#f8f6f2] hover:bg-white border border-transparent hover:border-[#2563eb] cursor-pointer transition-all shadow-2xs hover:shadow-sm group"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm group-hover:scale-110 transition-transform">
                  {preset.icon}
                </span>
                <strong className="text-xs text-[#1a1a1a] truncate font-semibold">
                  {preset.label}
                </strong>
              </div>
              <span className="mono text-[0.6rem] text-[#2563eb] group-hover:text-[#2563eb]">
                {preset.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Active Nodes */}
      <div className="space-y-3">
        <h4 className="mono">Active Discovery Nodes</h4>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => setIncludeReels(!includeReels)}
            className="btn btn-soft justify-between w-full text-xs font-mono py-2.5 px-4 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${includeReels ? 'bg-pink-500' : 'bg-gray-300'}`}></span>
              Reels Detection (20+)
            </span>
            <span className={`text-[0.65rem] font-bold ${includeReels ? 'text-[#2563eb]' : 'text-gray-400'}`}>
              {includeReels ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIncludeMeta(!includeMeta)}
            className="btn btn-soft justify-between w-full text-xs font-mono py-2.5 px-4 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${includeMeta ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
              Meta Ads Library (20+)
            </span>
            <span className={`text-[0.65rem] font-bold ${includeMeta ? 'text-[#2563eb]' : 'text-gray-400'}`}>
              {includeMeta ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIncludeTikTok(!includeTikTok)}
            className="btn btn-soft justify-between w-full text-xs font-mono py-2.5 px-4 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${includeTikTok ? 'bg-teal-500' : 'bg-gray-300'}`}></span>
              TikTok Center
            </span>
            <span className={`text-[0.65rem] font-bold ${includeTikTok ? 'text-[#2563eb]' : 'text-gray-400'}`}>
              {includeTikTok ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIncludeYouTube(!includeYouTube)}
            className="btn btn-soft justify-between w-full text-xs font-mono py-2.5 px-4 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${includeYouTube ? 'bg-red-500' : 'bg-gray-300'}`}></span>
              YouTube Shorts
            </span>
            <span className={`text-[0.65rem] font-bold ${includeYouTube ? 'text-[#2563eb]' : 'text-gray-400'}`}>
              {includeYouTube ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* 4. Threshold & Diagnostic toggles */}
      <div className="pt-2 space-y-2 text-xs font-mono">
        <div className="flex items-center justify-between text-[#666]">
          <span className="mono">Min Confidence</span>
          <span className="font-bold text-[#1a1a1a]">{minMatchThreshold}%</span>
        </div>
        <input
          type="range"
          min="40"
          max="90"
          step="5"
          value={minMatchThreshold}
          onChange={(e) => setMinMatchThreshold(Number(e.target.value))}
          className="w-full accent-[#2563eb] cursor-pointer h-1.5 bg-[#e9e6df] rounded-lg"
        />

        <div className="pt-2 flex items-center justify-between">
          <span className="mono">Diagnostic Stepper</span>
          <input
            type="checkbox"
            checked={stepByStepMode}
            onChange={(e) => setStepByStepMode(e.target.checked)}
            className="w-3.5 h-3.5 accent-[#2563eb] cursor-pointer"
          />
        </div>
      </div>

      {/* 5. Quota Banner */}
      <div className="quota-banner mt-auto bg-[#eff6ff] p-5 sm:p-6 rounded-2xl border border-[#2563eb]/10">
        <div className="flex items-center justify-between mb-1">
          <h4 className="mono text-[#2563eb] font-bold">Pipeline Capacity</h4>
          <span className="text-[0.62rem] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full font-bold">
            100%
          </span>
        </div>
        <div className="quota-bar h-1.5 bg-black/5 rounded-full my-2.5 overflow-hidden">
          <div className="quota-progress w-full h-full bg-[#2563eb] rounded-full"></div>
        </div>
        <p className="text-[0.72rem] text-[#666] leading-relaxed">
          100% Compliant quota across all multimodal discovery nodes (20+ Reels, 20+ Ads verified).
        </p>
      </div>
    </aside>
  );
};
