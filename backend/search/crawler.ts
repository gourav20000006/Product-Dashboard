export async function fetchPageMetadata(url: string): Promise<{ title: string; description: string; image: string; textPreview: string }> {
  const safeUrl = (() => {
    try {
      return new URL(url);
    } catch {
      return null;
    }
  })();

  if (!safeUrl) {
    throw new Error('Invalid URL');
  }

  const response = await fetch(safeUrl.toString(), {
    headers: {
      'User-Agent': 'ProductDiscoveryBot/1.0',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error('Page request failed');
  }

  const html = await response.text();
  const title =
    html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() ||
    html.match(/property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
    'Untitled page';

  const description =
    html.match(/meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
    html.match(/meta[^>]+property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
    'No description available';

  const image =
    html.match(/meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
    html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i)?.[1] ||
    '';

  const textPreview = html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 220)
    .trim();

  return {
    title,
    description,
    image,
    textPreview,
  };
}
