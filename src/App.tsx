import React, { useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

const baseUrl = '/api';

type SearchResult = {
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
};

export default function App() {
  const [query, setQuery] = useState('oversized graphic tee');
  const [url, setUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('Ready');
  const [product, setProduct] = useState<any>(null);
  const [results, setResults] = useState<SearchResult[]>([]);

  const onImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setStatus('Understanding input...');

    try {
      const payload = {
        query,
        url: url || undefined,
        imageBase64: imagePreview || undefined,
        userPrompt: query,
      };

      const response = await fetch(`${baseUrl}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Search request failed.');
      }

      setProduct(data.product || null);
      setResults(data.results || []);
      setStatus(data.stage || 'Results ready');
    } catch (error: any) {
      setStatus(error.message || 'Something went wrong');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const summary = useMemo(() => {
    if (!results.length) return 'No results yet';
    return `${results.length} relevant candidate results`;
  }, [results]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 60px', fontFamily: 'Inter, sans-serif', background: '#f5f5f3', minHeight: '100vh', color: '#111' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7 }}>AI search platform</div>
          <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.1 }}>Product Discovery Search</h1>
        </div>
        <div style={{ padding: '8px 12px', background: '#fff', borderRadius: 999, border: '1px solid #ddd', fontSize: 12 }}>{status}</div>
      </header>

      <form onSubmit={onSubmit} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 18, padding: 18, boxShadow: '0 10px 25px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'grid', gap: 14 }}>
          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Keyword / product query</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="oversized graphic tee" style={{ padding: '14px 16px', border: '1px solid #d6d6d6', borderRadius: 12, fontSize: 16 }} />
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Product URL (optional)</span>
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/product" style={{ padding: '14px 16px', border: '1px solid #d6d6d6', borderRadius: 12, fontSize: 16 }} />
          </label>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
              <input type="file" accept="image/*" onChange={onImageSelect} />
              Upload product image
            </label>
            {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 12 }} />}
          </div>

          <button type="submit" disabled={isLoading} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 18px', fontSize: 16, fontWeight: 700, cursor: isLoading ? 'wait' : 'pointer' }}>
            {isLoading ? 'Searching...' : 'Run AI search'}
          </button>
        </div>
      </form>

      <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: 20 }}>
        <aside style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e5e5', padding: 18 }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Product context</div>
          {product ? (
            <div style={{ display: 'grid', gap: 8 }}>
              <div><strong>Title:</strong> {product.title}</div>
              <div><strong>Category:</strong> {product.category || 'Unknown'}</div>
              <div><strong>Brand:</strong> {product.brand || 'Not detected'}</div>
              <div><strong>Price:</strong> {product.price || 'Unknown'}</div>
              <div><strong>Keywords:</strong> {product.keywords?.join(', ') || 'n/a'}</div>
            </div>
          ) : (
            <div style={{ opacity: 0.7 }}>No product context yet. Run a search to populate it.</div>
          )}
        </aside>

        <section style={{ background: '#fff', borderRadius: 18, border: '1px solid #e5e5e5', padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 8, flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0 }}>Search results</h2>
            <span style={{ fontSize: 12, opacity: 0.7 }}>{summary}</span>
          </div>

          {!results.length ? (
            <div style={{ opacity: 0.7 }}>No candidate results yet.</div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {results.map((result) => (
                <article key={result.id} style={{ border: '1px solid #ebebeb', borderRadius: 14, padding: 14, display: 'grid', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'start' }}>
                    {result.thumbnail ? <img src={result.thumbnail} alt={result.title} style={{ width: 86, height: 86, objectFit: 'cover', borderRadius: 12 }} /> : <div style={{ width: 86, height: 86, borderRadius: 12, background: '#f0f0f0', display: 'grid', placeItems: 'center' }}>IMG</div>}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 18 }}>{result.title}</div>
                      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{result.source}</div>
                      <a href={result.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, overflowWrap: 'anywhere', color: '#0a66ff' }}>{result.url}</a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ background: '#111', color: '#fff', borderRadius: 999, padding: '6px 10px', fontSize: 12 }}>Match {result.matchScore}</span>
                    <span style={{ background: '#edf4ff', color: '#1a58d8', borderRadius: 999, padding: '6px 10px', fontSize: 12 }}>Sem {result.semanticScore}</span>
                    <span style={{ background: '#ecfdf5', color: '#067647', borderRadius: 999, padding: '6px 10px', fontSize: 12 }}>Visual {result.visualScore}</span>
                    <span style={{ background: '#fff7ed', color: '#b45309', borderRadius: 999, padding: '6px 10px', fontSize: 12 }}>Exact {result.exactMatchScore}</span>
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.5 }}>{result.reason}</div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
