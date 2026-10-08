import { config } from '../config.js';
import type { SearchInput } from './types.js';

const defaultQueries = (input: SearchInput): string[] => {
  const base = (input.query || input.userPrompt || input.url || 'product').trim();
  if (!base) return ['product discovery'];
  return [
    base,
    `${base} product`,
    `${base} review`,
    `${base} video`,
    `${base} ecommerce`,
    `${base} brand`,
  ];
};

export async function generateSearchPlan(input: SearchInput): Promise<string[]> {
  if (config.llmProvider === 'mock' || config.llmProvider === 'gemini') {
    return defaultQueries(input);
  }

  try {
    const baseUrl = (config.ollamaBaseUrl || 'http://localhost:11434').replace(/\/$/, '');
    const payload = {
      model: config.llmModel || 'llama3.1',
      stream: false,
      format: 'json',
      messages: [
        {
          role: 'system',
          content: 'Return only valid JSON with a single array field named "queries" and 5 search strings.',
        },
        {
          role: 'user',
          content: `Generate 5 search queries for this product discovery request: ${input.query || input.userPrompt || input.url || 'product'}`,
        },
      ],
    };

    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return defaultQueries(input);
    }

    const data = await response.json();
    const parsed = data?.message?.content || '{}';
    const json = typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
    const queries = Array.isArray(json.queries) ? json.queries : defaultQueries(input);
    return queries.slice(0, 6);
  } catch {
    return defaultQueries(input);
  }
}
