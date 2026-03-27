import { addCount, getCount } from '../../src/server/count';

interface Env {
  CACHE: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const count = await getCount(env.CACHE);
  return Response.json({ count });
};

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const { count } = await request.json<{ count: number }>();
  await addCount(env.CACHE, count);
  return new Response(null, { status: 204 });
};
