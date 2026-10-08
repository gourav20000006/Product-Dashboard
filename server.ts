import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  generateDiscoveryResults,
  BENCHMARK_EVIDENCE,
} from './src/data/mockData.ts';
import {
  SearchResultPackage,
  VideoItem,
  VideoCollection,
} from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

// In-memory data store for sessions
const historyStore: SearchResultPackage[] = [];
const bookmarkStore: VideoItem[] = [];
let collectionsStore: VideoCollection[] = [
  {
    id: 'col_winners',
    name: 'Scale Winners 🔥',
    description: 'High-performing creatives active for 30+ days with >90% visual match',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    color: '#1a1a1a',
    videoIds: [],
  },
  {
    id: 'col_hooks',
    name: 'Hook Inspirations',
    description: 'Top first 3-second visual and spoken hooks to replicate',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    color: '#8b5cf6',
    videoIds: [],
  },
  {
    id: 'col_ugc',
    name: 'UGC Creator References',
    description: 'Raw handheld unboxings and honest styling try-ons',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    color: '#059669',
    videoIds: [],
  },
];

// Initialize default initial search into history
const initialDefault = generateDiscoveryResults('oversized graphic tee');
historyStore.push(initialDefault);

// Seed initial bookmarks
if (initialDefault.results.length > 0) {
  bookmarkStore.push(initialDefault.results[0]);
  bookmarkStore.push(initialDefault.results[22]); // First Meta Ad
  collectionsStore[0].videoIds.push(initialDefault.results[22].id);
  collectionsStore[1].videoIds.push(initialDefault.results[0].id);
}

// 1. Search pipeline endpoint
app.post('/api/search', async (req, res) => {
  try {
    const {
      query,
      url,
      imageBase64,
      includeTikTok = true,
      includeYouTube = true,
      minMatchThreshold = 60,
    } = req.body;

    const searchTerm = (query || url || 'Streetwear Oversized Tee').trim();

    // Check if we can enhance via Gemini if user provided an image or custom query and API key is present
    let result = generateDiscoveryResults(searchTerm, {
      includeTikTok,
      includeYouTube,
      minMatchThreshold,
    });

    if (process.env.GEMINI_API_KEY && (imageBase64 || url)) {
      try {
        const ai = new GoogleGenAI();
        const prompt = `Analyze this product ${url ? `from URL: ${url}` : 'from the provided image/query: ' + searchTerm}.
Return a strict JSON object with:
{
  "productTitle": "detailed product name",
  "productType": "category name",
  "brand": "brand name or guess",
  "price": "estimated price or from info",
  "primaryColors": ["Color 1", "Color 2"],
  "materials": ["Material 1", "Material 2"],
  "silhouetteShape": "exact cut or shape description",
  "printsOrGraphics": ["Graphic detail 1"],
  "aestheticTags": ["Tag 1", "Tag 2", "Tag 3"]
}`;

        const contents: any[] = [];
        if (imageBase64 && imageBase64.includes(',')) {
          const [prefix, base64Data] = imageBase64.split(',');
          const mimeType = prefix.match(/:(.*?);/)?.[1] || 'image/jpeg';
          contents.push({
            inlineData: {
              data: base64Data,
              mimeType,
            },
          });
        }
        contents.push(prompt);

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (aiResponse.text) {
          const parsed = JSON.parse(aiResponse.text);
          result.product.title = parsed.productTitle || result.product.title;
          result.product.brand = parsed.brand || result.product.brand;
          if (parsed.price) result.product.price = parsed.price;
          if (parsed.primaryColors?.length) result.attributes.primaryColors = parsed.primaryColors;
          if (parsed.materials?.length) result.attributes.materials = parsed.materials;
          if (parsed.silhouetteShape) result.attributes.silhouetteShape = parsed.silhouetteShape;
          if (parsed.printsOrGraphics?.length) result.attributes.printsOrGraphics = parsed.printsOrGraphics;
          if (parsed.aestheticTags?.length) result.attributes.aestheticTags = parsed.aestheticTags;
        }
      } catch (err) {
        console.warn('Gemini enrichment non-fatal fallback:', err);
      }
    }

    // Save to history (keep latest 15)
    historyStore.unshift(result);
    if (historyStore.length > 15) historyStore.pop();

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. History endpoints
app.get('/api/history', (_req, res) => {
  res.json({
    success: true,
    searches: historyStore,
  });
});

app.delete('/api/history', (_req, res) => {
  historyStore.length = 0;
  res.json({
    success: true,
    message: 'Search history cleared',
  });
});

// 3. Bookmarks endpoints
app.get('/api/bookmarks', (_req, res) => {
  res.json({
    success: true,
    bookmarks: bookmarkStore,
  });
});

app.post('/api/bookmark', (req, res) => {
  const { video } = req.body;
  if (!video || !video.id) {
    return res.status(400).json({ success: false, error: 'Video is required' });
  }

  const existingIndex = bookmarkStore.findIndex((b) => b.id === video.id);
  if (existingIndex >= 0) {
    bookmarkStore.splice(existingIndex, 1);
    // Also remove from collections
    collectionsStore.forEach((c) => {
      c.videoIds = c.videoIds.filter((id) => id !== video.id);
    });
    return res.json({ success: true, action: 'removed', bookmarks: bookmarkStore });
  } else {
    bookmarkStore.unshift(video);
    return res.json({ success: true, action: 'added', bookmarks: bookmarkStore });
  }
});

// 4. Test Evidence endpoint
app.get('/api/test-evidence', (_req, res) => {
  res.json({
    success: true,
    evidence: BENCHMARK_EVIDENCE,
  });
});

// 5. Collections / Moodboards endpoints (New Feature!)
app.get('/api/collections', (_req, res) => {
  res.json({
    success: true,
    collections: collectionsStore,
  });
});

app.post('/api/collections', (req, res) => {
  const { action, collection, videoId, collectionId } = req.body;

  if (action === 'create' && collection) {
    const newCol: VideoCollection = {
      id: `col_${Date.now()}`,
      name: collection.name || 'New Collection',
      description: collection.description || '',
      createdAt: new Date().toISOString(),
      color: collection.color || '#1a1a1a',
      videoIds: collection.videoIds || [],
    };
    collectionsStore.push(newCol);
    return res.json({ success: true, collections: collectionsStore });
  }

  if (action === 'toggle-video' && collectionId && videoId) {
    const target = collectionsStore.find((c) => c.id === collectionId);
    if (target) {
      if (target.videoIds.includes(videoId)) {
        target.videoIds = target.videoIds.filter((id) => id !== videoId);
      } else {
        target.videoIds.push(videoId);
      }
    }
    return res.json({ success: true, collections: collectionsStore });
  }

  if (action === 'delete' && collectionId) {
    collectionsStore = collectionsStore.filter((c) => c.id !== collectionId);
    return res.json({ success: true, collections: collectionsStore });
  }

  res.status(400).json({ success: false, error: 'Invalid collection action' });
});

// 6. AI Vision deep inspection endpoint (New Feature!)
app.post('/api/ai-analyze', async (req, res) => {
  try {
    const { videoTitle, productTitle, platform } = req.body;
    let analysis = {
      colorMatchConfidence: '96%',
      silhouetteConfidence: '92%',
      materialConfidence: '94%',
      verdict: 'High Confidence Authentic Visual Match',
      keyDetectedElements: [
        'Identical collar ribbing and drop-shoulder drape profile',
        'Fabric surface wash matches vintage combed charcoal tone',
        'Natural lighting highlights expected weave weight without sheen',
      ],
      creativeTakeaway: 'The creator relies on real tactile ASMR fabric interaction to establish authenticity within the first 2 seconds.',
    };

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI();
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Analyze the visual relationship between product "${productTitle}" and candidate ${platform} video titled "${videoTitle}".
Provide a JSON response with:
{
  "colorMatchConfidence": "e.g. 95%",
  "silhouetteConfidence": "e.g. 91%",
  "materialConfidence": "e.g. 89%",
  "verdict": "short summary sentence",
  "keyDetectedElements": ["observation 1", "observation 2", "observation 3"],
  "creativeTakeaway": "strategic advice on why this video converts or appeals"
}`,
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (response.text) {
          analysis = JSON.parse(response.text);
        }
      } catch (e) {
        console.warn('AI analyze fallback:', e);
      }
    }

    res.json({ success: true, analysis });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. AI UGC Script & Creative Hook Generator (New Feature!)
app.post('/api/generate-brief', async (req, res) => {
  try {
    const { product, winningVideos = [] } = req.body;
    let brief = {
      creativeAngle: 'Viral Value & Tactile Proof (30s UGC)',
      targetPlatform: 'Instagram Reels & TikTok',
      hooks: [
        {
          type: 'Curiosity Gap',
          visual: 'Extreme macro close-up of collar stitching and drop shoulder seam.',
          audioScript: 'I bought the $48 version from Aesthetic Studios to see if all the reviews were lying...',
        },
        {
          type: 'Direct Comparison',
          visual: 'Dropping shirt alongside high-end designer garment on marble counter.',
          audioScript: 'This one shirt cured my addiction to $250 designer tees. Watch this drape test.',
        },
      ],
      bodyScript: [
        { time: '0:03 - 0:10', action: 'Full body mirror turnaround showing relaxed drop shoulders', voiceover: `It's made from 280 GSM combed cotton so the collar never sags and the boxy cut sits exactly right.` },
        { time: '0:10 - 0:20', action: 'Hand stretching cuff and showing reverse vintage wash texture', voiceover: `You can wash this ten times and the distressed typography actually looks better with age.` },
        { time: '0:20 - 0:30', action: 'Stepping outside into natural afternoon light, displaying screen-print details', voiceover: `They just restocked this morning, link is down below before this batch sells out.` },
      ],
      callToAction: 'Shop Limited Restock with 15% First-Order Welcome Code',
    };

    if (process.env.GEMINI_API_KEY && product) {
      try {
        const ai = new GoogleGenAI();
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are an elite DTC Creative Director. Generate a high-performing 30-second UGC video brief for this product:
Product: ${product.title} (${product.brand}, ${product.price})
Description: ${product.description}
Return JSON with:
{
  "creativeAngle": "e.g. Tactile Proof & Aesthetic Unboxing",
  "targetPlatform": "Instagram Reels & TikTok",
  "hooks": [
    {"type": "hook category", "visual": "visual direction", "audioScript": "voiceover line"}
  ],
  "bodyScript": [
    {"time": "0:03 - 0:10", "action": "visual description", "voiceover": "dialogue line"},
    {"time": "0:10 - 0:20", "action": "visual description", "voiceover": "dialogue line"},
    {"time": "0:20 - 0:30", "action": "visual description", "voiceover": "dialogue line"}
  ],
  "callToAction": "strong CTA phrase"
}`,
          config: {
            responseMimeType: 'application/json',
          },
        });
        if (response.text) {
          brief = JSON.parse(response.text);
        }
      } catch (e) {
        console.warn('AI brief fallback:', e);
      }
    }

    res.json({ success: true, brief });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server and setup Vite dev server or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Product Video Discovery Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
