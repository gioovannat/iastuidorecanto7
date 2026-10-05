import type { SiteConfig } from '../types';

export async function publishSiteConfig(config: SiteConfig): Promise<{ ok: boolean; url?: string }> {
  try {
    const response = await fetch('/api/site-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config }),
    });
    if (!response.ok) return { ok: false };
    return response.json();
  } catch {
    return { ok: false };
  }
}

export async function loadPublishedSiteConfig(): Promise<SiteConfig | null> {
  try {
    const response = await fetch('/api/site-content', { cache: 'no-store' });
    if (!response.ok) return null;
    const data = await response.json();
    return data.config ?? null;
  } catch {
    return null;
  }
}
