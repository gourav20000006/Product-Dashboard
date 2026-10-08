export type ProviderMode = 'ollama' | 'gemini' | 'mock';

export const config = {
  llmProvider: (process.env.LLM_PROVIDER as ProviderMode) || 'ollama',
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  llmModel: process.env.LLM_MODEL || 'llama3.1',
  visionModel: process.env.VISION_MODEL || 'llava',
  searchProvider: process.env.SEARCH_PROVIDER || 'searxng',
  searxngUrl: process.env.SEARXNG_URL || 'http://localhost:8080',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
};

export function isOllamaConfigured() {
  return Boolean(process.env.OLLAMA_BASE_URL || process.env.LLM_MODEL);
}
