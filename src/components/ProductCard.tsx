import React, { useState } from 'react';
import {
  ExternalLink,
  Palette,
  Layers,
  Scissors,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';
import { ProductData, ProductAttributes } from '../types.ts';

interface ProductCardProps {
  product: ProductData;
  attributes: ProductAttributes;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, attributes }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl bg-[#2563eb] text-white shadow-lg p-7 sm:p-10">
      {/* Decorative radial circles */}
      <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/10 pointer-events-none blur-sm" />
      <div className="absolute -bottom-16 right-1/3 w-64 h-64 rounded-full bg-black/10 pointer-events-none" />

      {/* Main Hero Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Product Image Wrap */}
        <div className="w-56 h-56 sm:w-60 sm:h-60 rounded-2xl overflow-hidden border-4 border-white/20 shrink-0 shadow-md bg-white/5">
          <img
            src={product.mainImage}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Hero Information */}
        <div className="flex-1 min-w-0 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-2 mb-2">
            <span className="mono text-white/80 tracking-widest text-[0.7rem]">
              Primary Identification • {product.brand}
            </span>

            {product.sourceUrl && (
              <a
                href={product.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 mono text-white/80 hover:text-white hover:underline text-[0.68rem]"
              >
                <span>Target Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <h2 className="font-newsreader text-3xl sm:text-4xl font-bold mb-3 leading-tight tracking-tight text-white">
            {product.title}
          </h2>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-6 max-w-2xl">
            {product.description}
          </p>

          {/* Stats Strip from Variation 3 */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 sm:gap-8 border-t border-white/20 pt-5">
            <div className="text-left">
              <span className="font-bold text-xl sm:text-2xl block text-white">
                {product.price}
              </span>
              <span className="mono text-white/70 text-[0.65rem]">Market Price</span>
            </div>

            <div className="text-left">
              <span className="font-bold text-xl sm:text-2xl block text-white truncate max-w-[160px]">
                {attributes.materials[0]?.split(' ')[0] || '280 GSM'}
              </span>
              <span className="mono text-white/70 text-[0.65rem]">Fabric Density</span>
            </div>

            <div className="text-left">
              <span className="font-bold text-xl sm:text-2xl block text-white uppercase">
                {product.category?.split(' ')[0] || 'STREETWEAR'}
              </span>
              <span className="mono text-white/70 text-[0.65rem]">Primary Niche</span>
            </div>

            {/* Expandable specs button */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white mono text-[0.68rem] transition cursor-pointer backdrop-blur-sm"
            >
              <span>{expanded ? 'Hide Specs' : 'Detailed Specs'}</span>
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Specifications Drawer */}
      {expanded && (
        <div className="relative z-10 mt-6 pt-6 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono text-white/95">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
            <div className="flex items-center gap-1.5 mb-2 text-white/70 uppercase text-[0.65rem] font-bold">
              <Palette className="w-3.5 h-3.5 text-white" />
              <span>Palette & Colorways</span>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              {attributes.detectedColorHexes?.map((hex, i) => (
                <span
                  key={i}
                  className="w-4 h-4 rounded-full border border-white/40 shadow-xs"
                  style={{ backgroundColor: hex }}
                  title={attributes.primaryColors[i] || hex}
                />
              ))}
              <span className="text-white text-[0.72rem] ml-1">
                {attributes.primaryColors.join(', ')}
              </span>
            </div>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
            <div className="flex items-center gap-1.5 mb-2 text-white/70 uppercase text-[0.65rem] font-bold">
              <Scissors className="w-3.5 h-3.5 text-white" />
              <span>Cut & Silhouette</span>
            </div>
            <p className="text-white text-[0.72rem] leading-relaxed">
              {attributes.silhouetteShape}
            </p>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
            <div className="flex items-center gap-1.5 mb-2 text-white/70 uppercase text-[0.65rem] font-bold">
              <Layers className="w-3.5 h-3.5 text-white" />
              <span>Prints & Markings</span>
            </div>
            <p className="text-white text-[0.72rem] leading-relaxed">
              {attributes.printsOrGraphics.join(', ')}
            </p>
          </div>

          <div className="sm:col-span-2 lg:col-span-3 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
            <div className="flex items-center gap-1.5 mb-2 text-white/70 uppercase text-[0.65rem] font-bold">
              <Search className="w-3.5 h-3.5 text-white" />
              <span>Generated Scraping & Ad Crawler Queries</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {attributes.searchKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-white/15 rounded-full text-[0.68rem] text-white"
                >
                  {kw}
                </span>
              ))}
              {attributes.instagramHashtags.map((ht, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-white/20 rounded-full text-[0.68rem] text-amber-200"
                >
                  {ht}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
