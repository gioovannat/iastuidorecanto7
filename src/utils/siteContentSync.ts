import type { SiteConfig } from '../types';
import { supabase } from '../lib/supabase';
const CONTENT_ID = 'main';

export async function uploadSiteImage(file: File): Promise<{ ok: boolean; url?: string; error?: string }> {
  if (!supabase) return { ok: false, error: 'Supabase ainda não foi configurado.' };
  if (!file.type.match(/^image\/(jpeg|png|webp)$/) || file.size > 5 * 1024 * 1024) return { ok: false, error: 'Use JPG, PNG ou WebP de no máximo 5 MB.' };
  const path = `${crypto.randomUUID()}.${file.type.split('/')[1]}`;
  const { error } = await supabase.storage.from('site-images').upload(path, file, { cacheControl: '31536000', contentType: file.type, upsert: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, url: supabase.storage.from('site-images').getPublicUrl(path).data.publicUrl };
}

export async function publishSiteConfig(config: SiteConfig): Promise<{ ok: boolean; url?: string; error?: string }> {
  if (!supabase) return { ok: false, error: 'Supabase ainda não foi configurado.' };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Sua sessão expirou. Entre novamente.' };
  const { error } = await supabase.from('site_content').upsert({ id: CONTENT_ID, config: { ...config, lastUpdated: new Date().toISOString() }, updated_by: user.id, updated_at: new Date().toISOString() });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function loadPublishedSiteConfig(): Promise<SiteConfig | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('site_content').select('config').eq('id', CONTENT_ID).maybeSingle();
  return error || !data ? null : (data.config as SiteConfig);
}

export function subscribeToSiteConfig(onChange: (config: SiteConfig) => void) {
  if (!supabase) return () => {};
  const client = supabase;
  const channel = client.channel('recanto-site-content').on('postgres_changes', { event: '*', schema: 'public', table: 'site_content', filter: 'id=eq.main' }, (payload) => {
    const config = (payload.new as { config?: SiteConfig }).config;
    if (config) onChange(config);
  }).subscribe();
  return () => { void client.removeChannel(channel); };
}
