import { addCount, getCount, sanitizeCount } from '../../src/server/count';

interface Env {
  CACHE: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const count = await getCount(env.CACHE);
  return Response.json({ count });
};

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const body = await request.json<{ count?: unknown }>();
  const safe = sanitizeCount(body?.count);
  if (safe === null)
    return new Response(null, { status: 400 });
  await addCount(env.CACHE, safe);
  return new Response(null, { status: 204 });
};
