import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const CONTENT_ID = 'recanto7-public-site';

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'GET') {
    const rows = await sql`SELECT config, updated_at FROM public.site_content WHERE id = ${CONTENT_ID} LIMIT 1`;
    if (!rows[0]) return Response.json({ config: null }, { status: 200 });
    return Response.json({ config: rows[0].config, updatedAt: rows[0].updated_at });
  }

  if (request.method !== 'POST') return new Response('Método não permitido', { status: 405 });

  try {
    const body = await request.json();
    if (!body?.config || typeof body.config !== 'object') {
      return Response.json({ error: 'Configuração inválida.' }, { status: 400 });
    }

    const serialized = JSON.stringify(body.config);
    const blob = await put(`site-content/recanto7-${Date.now()}.json`, serialized, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: true,
    });

    await sql`
      INSERT INTO public.site_content (id, config, version, updated_at)
      VALUES (${CONTENT_ID}, ${body.config}, 1, now())
      ON CONFLICT (id) DO UPDATE SET config = EXCLUDED.config, version = public.site_content.version + 1, updated_at = now()
    `;

    return Response.json({ ok: true, url: blob.url });
  } catch (error) {
    console.error('[recanto7] Falha ao sincronizar conteúdo:', error);
    return Response.json({ error: 'Não foi possível publicar o conteúdo.' }, { status: 500 });
  }
}
