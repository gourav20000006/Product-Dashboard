import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { runDiscoveryPipeline, normalizeResult } from './backend/search/discovery.js';
import { buildProductContext, type SearchInput } from './backend/search/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

const searchSessions = new Map<string, any>();

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    provider: process.env.LLM_PROVIDER || 'ollama',
    searchEngine: process.env.SEARCH_PROVIDER || 'searxng',
  });
});

app.post('/api/analyze-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required.' });
    }

    const product = await buildProductContext({ url, query: '' } as SearchInput);
    return res.json({ success: true, product });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'URL analysis failed.' });
  }
});

app.post('/api/analyze-image', async (_req, res) => {
  res.json({
    success: true,
    message: 'Image analysis endpoint ready. Send an image as base64 via /api/search.',
    visualSummary: {
      category: 'unknown',
      colors: [],
      style: 'unknown',
      visibleText: [],
      visualAttributes: [],
    },
  });
});

app.post('/api/search', async (req, res) => {
  try {
    const body = req.body || {};
    const input: SearchInput = {
      query: body.query || '',
      url: body.url || '',
      imageBase64: body.imageBase64 || '',
      imageUrl: body.imageUrl || '',
      userPrompt: body.userPrompt || body.query || '',
    };

    if (!input.query && !input.url && !input.imageBase64 && !input.imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Provide a keyword, URL, or image.',
      });
    }

    const searchId = `search_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

    const result = await runDiscoveryPipeline(input, (stage) => {
      searchSessions.set(searchId, { stage, updatedAt: Date.now() });
    });

    const finalPayload = {
      success: true,
      searchId,
      query: input.query || input.url || 'discovery',
      product: result.product,
      results: result.results.map((r) => normalizeResult(r)),
      explanations: result.explanations,
      stage: result.stage,
    };

    searchSessions.set(searchId, finalPayload);
    return res.json(finalPayload);
  } catch (error: any) {
    console.error('search error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Search pipeline failed.',
    });
  }
});

app.get('/api/search/:id', (req, res) => {
  const item = searchSessions.get(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Search not found.' });
  }
  return res.json({ success: true, data: item });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  app.get('*', async (_req, res, next) => {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      vite.middlewares(req, res, next);
    } catch (error) {
      next(error);
    }
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI discovery server listening on http://localhost:${PORT}`);
});
