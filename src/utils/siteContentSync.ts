import type { SiteConfig } from '../types';

export async function publishSiteConfig(config: SiteConfig): Promise<{ ok: boolean; url?: string }> {
  try {
    const response = await fetch('/api/site-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ config }),
    });
    if (!response.ok) {
      console.error('[v0] Publicação rejeitada:', response.status);
      return { ok: false };
    }
    return response.json();
  } catch {
    return { ok: false };
  }
}

export async function loadPublishedSiteConfig(): Promise<SiteConfig | null> {
  try {
    const response = await fetch(`/api/site-content? t=${Date.now()}`.replace('? ', '?'), {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.config ?? null;
  } catch {
    return null;
  }
}
