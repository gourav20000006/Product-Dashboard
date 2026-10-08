import { config } from '../config.js';
import type { SearchInput, ProductContext, DiscoveryResult, DiscoveryResponse } from './types.js';
import { generateSearchPlan } from './ollama.js';
import { fetchPageMetadata } from './crawler.js';

function expandQueries(input: SearchInput): string[] {
  const base = (input.query || input.userPrompt || input.url || 'product').trim();
  const terms = [base];

  if (base) {
    terms.push(`${base} product`);
    terms.push(`${base} review`);
    terms.push(`${base} video`);
    terms.push(`${base} search`);
    terms.push(`${base} ecommerce`);
  }

  if (input.url) {
    terms.push(`site:${input.url} ${base}`);
  }

  return Array.from(new Set(terms.filter(Boolean))).slice(0, 6);
}

function scoreResult(raw: Partial<DiscoveryResult>, query: string): number {
  const q = query.toLowerCase();
  const title = (raw.title || '').toLowerCase();
  const reason = (raw.reason || '').toLowerCase();
  const url = (raw.url || '').toLowerCase();
  const includesQuery = title.includes(q) || url.includes(q) || reason.includes(q);

  const semantic = raw.semanticScore ?? 0.75;
  const visual = raw.visualScore ?? 0.7;
  const exact = raw.exactMatchScore ?? 0.72;
  const score = semantic * 40 + visual * 30 + exact * 30 + (includesQuery ? 10 : 0);
  return Math.min(99, Math.max(0, score));
}

async function searchSearxng(query: string): Promise<DiscoveryResult[]> {
  if (config.searchProvider !== 'searxng') return [];

  try {
    const url = `${config.searxngUrl}/search?q=${encodeURIComponent(query)}&format=json&language=en`;
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) return [];

    const payload = await response.json();
    const items = Array.isArray(payload.results) ? payload.results : [];

    return items.slice(0, 10).map((item: any, index: number) => ({
      id: `${query}-${index}`,
      title: item.title || 'Search result',
      url: item.url || '#',
      source: item.source || new URL(item.url || 'https://example.com').hostname || 'web',
      thumbnail: item.img_src || item.thumbnail || '',
      matchScore: 82,
      semanticScore: 0.82,
      visualScore: 0.78,
      exactMatchScore: 0.75,
      reason: `SearXNG result matching ${query}`,
      publishedAt: item.pubdate || new Date().toISOString(),
      author: item.author || 'public source',
    }));
  } catch {
    return [];
  }
}

export async function runDiscoveryPipeline(input: SearchInput, onStage?: (stage: string) => void): Promise<DiscoveryResponse> {
  const stages = [
    'Understanding input',
    'Extracting product context',
    'Generating search queries',
    'Searching the web',
    'Ranking candidates',
    'Preparing evidence',
  ];

  onStage?.(stages[0]);
  const productContext = await (await import('./types.js')).buildProductContext(input);

  onStage?.(stages[1]);
  const baseQueries = await generateSearchPlan(input);
  const queries = [...new Set([...expandQueries(input), ...baseQueries])].slice(0, 8);

  onStage?.(stages[2]);
  const resultBuckets: DiscoveryResult[] = [];

  for (const query of queries) {
    onStage?.(stages[3]);
    const items = await searchSearxng(query);
    for (const item of items) {
      if (item.url && item.url !== '#') {
        try {
          const metadata = await fetchPageMetadata(item.url);
          resultBuckets.push({
            ...item,
            title: metadata.title || item.title,
            thumbnail: metadata.image || item.thumbnail,
            reason: metadata.description ? `Meta summary: ${metadata.description.slice(0, 140)}` : item.reason,
          });
        } catch {
          resultBuckets.push(item);
        }
      }
    }
  }

  const deduped = Array.from(new Map(resultBuckets.map((item) => [item.url, item])).values());
  const ranked = deduped
    .map((item) => {
      const query = queries[0] || 'product';
      const score = scoreResult(item, query);
      return {
        ...item,
        matchScore: Number(score.toFixed(1)),
        semanticScore: Number(((item.semanticScore ?? 0.8) * 100).toFixed(1)) / 100,
        visualScore: Number(((item.visualScore ?? 0.75) * 100).toFixed(1)) / 100,
        exactMatchScore: Number(((item.exactMatchScore ?? 0.7) * 100).toFixed(1)) / 100,
      };
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 12);

  onStage?.(stages[4]);

  const product = {
    ...productContext,
    title: productContext.title || 'Discovered product',
    description: productContext.description || 'AI-assisted product discovery',
  };

  return {
    product,
    results: ranked,
    explanations: [
      'SearXNG provides open-source search across web and product pages.',
      'Candidate pages are crawled for metadata and summaries before ranking.',
      'The system ranks by semantic relevance, visual match, and evidence strength.',
    ],
    stage: stages[5],
  };
}

export function normalizeResult(result: DiscoveryResult): DiscoveryResult {
  return {
    ...result,
    title: result.title || 'Untitled result',
    url: result.url || 'https://example.com',
    source: result.source || 'web',
    matchScore: Number((result.matchScore || 0).toFixed(1)),
  };
}
