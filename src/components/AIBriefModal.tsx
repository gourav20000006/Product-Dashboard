import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Printer,
  RefreshCw,
  Video,
  Clock,
  PlaySquare,
  MessageSquare,
} from 'lucide-react';
import { ProductData, VideoItem } from '../types.ts';

interface AIBriefModalProps {
  product: ProductData;
  winningVideos: VideoItem[];
  onClose: () => void;
}

export const AIBriefModal: React.FC<AIBriefModalProps> = ({
  product,
  winningVideos,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [brief, setBrief] = useState<any>({
    creativeAngle: 'Tactile Proof & Aesthetic Unboxing (30s UGC)',
    targetPlatform: 'Instagram Reels & TikTok',
    hooks: [
      {
        type: 'Curiosity Gap',
        visual: 'Extreme macro close-up of collar stitching and drop shoulder seam under warm natural light.',
        audioScript: `I ordered the $48 version from ${product.brand} to see if all the reviews were lying...`,
      },
      {
        type: 'Direct Comparison',
        visual: 'Dropping product alongside high-end designer garment on marble counter with audible thud.',
        audioScript: `This single piece cured my addiction to $250 designer brands. Look at this drape test.`,
      },
      {
        type: 'ASMR Unboxing',
        visual: 'Finger sliding open custom frosted dust bag, cutting tape with ceramic blade.',
        audioScript: `Listen to the fabric density on this. You can instantly feel the quality.`,
      },
    ],
    bodyScript: [
      {
        time: '0:03 - 0:10',
        action: 'Full body mirror turnaround showing relaxed drop shoulders and drape profile in motion.',
        voiceover: `It's engineered with premium materials so the silhouette sits structured without feeling stiff.`,
      },
      {
        time: '0:10 - 0:20',
        action: 'Hand stretching cuff and showing reverse vintage wash texture and clean seam bindings.',
        voiceover: `You can wash this ten times and the vintage wash and graphic typography only get better with age.`,
      },
      {
        time: '0:20 - 0:30',
        action: 'Stepping outside into natural afternoon light, displaying screen-print details, smiling to camera.',
        voiceover: `They just restocked this batch this morning. Tap below before your size sells out!`,
      },
    ],
    callToAction: 'Shop Limited Restock with 15% First-Order Welcome Discount',
  });

  const handleGenerateFresh = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          winningVideos: winningVideos.slice(0, 5),
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.brief) {
          setBrief(json.brief);
        }
      }
    } catch (e) {
      console.warn('Brief generation error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const text = [
      `# UGC Video Production Brief: ${product.title}`,
      `Creative Angle: ${brief.creativeAngle}`,
      `Target Platforms: ${brief.targetPlatform}`,
      '',
      `## 1. 0-3s Hook Variations:`,
      ...brief.hooks.map(
        (h: any, i: number) =>
          `Hook ${i + 1} (${h.type}):\nVisual: ${h.visual}\nVoiceover: "${h.audioScript}"\n`
      ),
      `## 2. 30-Second Shot List & Script:`,
      ...brief.bodyScript.map(
        (b: any) =>
          `[${b.time}] Action: ${b.action}\nVoiceover: "${b.voiceover}"\n`
      ),
      `## 3. Call To Action:`,
      brief.callToAction,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="bg-[#f8f6f2] w-full max-w-3xl rounded-3xl border border-[rgba(0,0,0,0.06)] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f5f3ff] flex items-center justify-center text-[#7c3aed]">
              <Sparkles className="w-5 h-5 text-[#7c3aed]" />
            </div>
            <div>
              <span className="mono text-[#7c3aed] font-bold">Gemini Creative Engine</span>
              <h2 className="font-newsreader text-2xl font-bold text-[#1a1a1a]">
                AI UGC Video Script & Hook Brief
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs font-mono">
          {/* Brief Overview Header Card */}
          <div className="p-4 bg-white border border-[rgba(26,26,26,0.08)] rounded flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <div className="text-[0.62rem] text-[rgba(26,26,26,0.5)] uppercase tracking-wider">
                Product Reference
              </div>
              <div className="font-serif-cormorant text-xl font-bold text-[#1a1a1a]">
                {product.title}
              </div>
              <div className="text-[0.7rem] text-[rgba(26,26,26,0.6)]">
                {product.brand} • {product.price}
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-[0.62rem] text-[rgba(26,26,26,0.5)] uppercase tracking-wider">
                Creative Direction
              </div>
              <div className="font-bold text-[#1a1a1a] text-xs">
                {brief.creativeAngle}
              </div>
              <div className="text-emerald-700 text-[0.68rem]">
                Format: 30s Short-Form Vertical 9:16
              </div>
            </div>
          </div>

          {/* Section 1: Winning Hook Matrix */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <PlaySquare className="w-3.5 h-3.5 text-amber-700" />
              <span className="label-mono">0-3s High-Retention Hook Variations</span>
            </div>

            <div className="space-y-3">
              {brief.hooks.map((hook: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 bg-white border border-[rgba(26,26,26,0.08)] rounded hover:border-[#1a1a1a] transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#1a1a1a] text-[0.72rem]">
                      Option #{idx + 1}: {hook.type}
                    </span>
                    <span className="text-[0.6rem] bg-[#f4f2eb] px-2 py-0.5 rounded text-[rgba(26,26,26,0.7)]">
                      0:00 - 0:03s
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[0.7rem]">
                    <div className="p-2.5 bg-[#faf9f5] rounded">
                      <span className="text-[0.6rem] text-[rgba(26,26,26,0.5)] block mb-1">
                        Visual Action:
                      </span>
                      <p className="text-[rgba(26,26,26,0.85)] leading-relaxed">
                        {hook.visual}
                      </p>
                    </div>

                    <div className="p-2.5 bg-[#faf9f5] rounded">
                      <span className="text-[0.6rem] text-[rgba(26,26,26,0.5)] block mb-1">
                        Voiceover Line:
                      </span>
                      <p className="text-[#1a1a1a] italic leading-relaxed font-serif-cormorant text-sm">
                        "{hook.audioScript}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: 30-Second Body Timeline Script */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-3.5 h-3.5 text-sky-700" />
              <span className="label-mono">Full 30-Second Production Timeline</span>
            </div>

            <div className="space-y-2.5">
              {brief.bodyScript.map((shot: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white border border-[rgba(26,26,26,0.08)] rounded flex flex-col sm:flex-row items-start gap-4"
                >
                  <span className="px-2 py-1 bg-[#1a1a1a] text-white rounded text-[0.65rem] font-bold shrink-0">
                    {shot.time}
                  </span>

                  <div className="flex-1 space-y-1">
                    <div className="text-[0.68rem] text-[rgba(26,26,26,0.6)]">
                      <strong className="text-[#1a1a1a]">Action:</strong> {shot.action}
                    </div>
                    <div className="text-xs font-serif-cormorant text-[#1a1a1a] italic">
                      "{shot.voiceover}"
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Call To Action Direction */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200/60 rounded">
            <span className="label-mono text-emerald-800 block mb-1">
              End Screen CTA (0:28 - 0:30)
            </span>
            <div className="font-serif-cormorant text-lg font-bold text-emerald-950">
              "{brief.callToAction}"
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[rgba(26,26,26,0.08)] bg-white flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <button
            onClick={handleGenerateFresh}
            disabled={loading}
            className="px-3 py-1.5 rounded border border-[rgba(26,26,26,0.15)] bg-white hover:bg-[#faf9f5] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Generate Alternate Angle</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded bg-[#1a1a1a] hover:bg-[#333] text-white flex items-center gap-1.5 cursor-pointer transition shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Brief!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Script</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
