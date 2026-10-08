export interface SearchProvider {
  search(query: string): Promise<Array<{ title: string; url: string; source: string; thumbnail?: string }>>;
}

export class SearxngProvider implements SearchProvider {
  constructor(private readonly baseUrl: string) {}

  async search(query: string) {
    const url = `${this.baseUrl.replace(/\/$/, '')}/search?q=${encodeURIComponent(query)}&format=json&language=en`;
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) return [];
    const payload = await response.json();
    const results = Array.isArray(payload.results) ? payload.results : [];
    return results.slice(0, 8).map((item: any) => ({
      title: item.title || 'Search result',
      url: item.url || '#',
      source: item.source || new URL(item.url || 'https://example.com').hostname || 'web',
      thumbnail: item.img_src || item.thumbnail || '',
    }));
  }
}
