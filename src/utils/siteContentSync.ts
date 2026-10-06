import type { SiteConfig } from '../types';

export async function publishSiteConfig(config: SiteConfig): Promise<{ ok: boolean; url?: string; error?: string }> {
  try {
    const response = await fetch('/api/site-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ config }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok !== true) {
      const error = data.error || `A API retornou HTTP ${response.status}.`;
      console.error('[v0] Publicação rejeitada:', error);
      window.dispatchEvent(new CustomEvent('recanto7_publish_failed', { detail: { error } }));
      return { ok: false, error };
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'API indisponível.';
    console.error('[v0] Falha de rede ao publicar:', message);
    window.dispatchEvent(new CustomEvent('recanto7_publish_failed', { detail: { error: message } }));
    return { ok: false, error: message };
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
