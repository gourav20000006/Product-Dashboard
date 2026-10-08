export type SearchInput = {
  query?: string;
  url?: string;
  imageBase64?: string;
  imageUrl?: string;
  userPrompt?: string;
};

export type ProductContext = {
  title: string;
  brand?: string;
  description: string;
  category?: string;
  price?: string;
  image?: string;
  sourceUrl?: string;
  keywords: string[];
  visualAttributes: string[];
};

export type DiscoveryResult = {
  id: string;
  title: string;
  url: string;
  source: string;
  thumbnail?: string;
  matchScore: number;
  semanticScore: number;
  visualScore: number;
  exactMatchScore: number;
  reason: string;
  publishedAt?: string;
  author?: string;
};

export type DiscoveryResponse = {
  product: ProductContext;
  results: DiscoveryResult[];
  explanations: string[];
  stage: string;
};

export function buildProductContext(input: SearchInput): Promise<ProductContext> {
  const keywordText = input.query || input.userPrompt || 'product discovery';
  const title = input.query || 'Discovered Product';

  return Promise.resolve({
    title,
    brand: undefined,
    description: `AI-assisted product discovery for: ${keywordText}`,
    category: 'general product',
    price: undefined,
    image: input.imageUrl || input.imageBase64 || '',
    sourceUrl: input.url || '',
    keywords: keywordText.split(/\s+/).filter(Boolean).slice(0, 12),
    visualAttributes: ['visual similarity', 'semantic alignment', 'product style'],
  });
}
