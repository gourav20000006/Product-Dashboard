import React from 'react';
import { Terminal, CheckCircle2 } from 'lucide-react';
import { PipelineProgressState } from '../types.ts';

interface PipelineStepperProps {
  progress: PipelineProgressState;
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({ progress }) => {
  const steps = [
    { key: 'resolving', label: '1. Ingest' },
    { key: 'extracting', label: '2. Gemini Vision' },
    { key: 'crawling_ig', label: '3. Reels (20+)' },
    { key: 'querying_meta', label: '4. Meta Ads (20+)' },
    { key: 'scraping_tiktok', label: '5. TikTok Center' },
    { key: 'hashing_dedup', label: '6. Perceptual De-dup' },
    { key: 'scoring_gemini', label: '7. Multi-Score' },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-[rgba(0,0,0,0.03)] font-mono text-xs animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb] animate-pulse"></div>
          <span className="mono text-[#2563eb] font-bold">Automation Pipeline Active</span>
        </div>
        <div className="text-xs font-bold text-[#1a1a1a]">
          {progress.progressPercent}% Completed
        </div>
      </div>

      {/* Progress Bar in blue */}
      <div className="w-full bg-[#f8f6f2] h-2 rounded-full overflow-hidden mb-4">
        <div
          className="bg-[#2563eb] h-full transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress.progressPercent}%` }}
        />
      </div>

      {/* Steps Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 mb-3">
        {steps.map((st) => (
          <div
            key={st.key}
            className={`p-2 rounded-xl text-[0.62rem] text-center truncate transition-colors ${
              progress.step === st.key
                ? 'bg-[#2563eb] text-white font-bold shadow-xs'
                : 'bg-[#f8f6f2] text-[#666]'
            }`}
          >
            {st.label}
          </div>
        ))}
      </div>

      {/* Live Log Message */}
      <div className="p-3 bg-[#f8f6f2] rounded-xl flex items-center justify-between text-[0.7rem] text-[#555]">
        <div className="flex items-center gap-2 truncate">
          <Terminal className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
          <span className="truncate">{progress.message}</span>
        </div>
        <span className="mono text-[0.6rem] text-[#888] shrink-0 ml-2">
          Live Feed
        </span>
      </div>
    </div>
  );
};
