const KEY = 'cp:count';

export async function addCount(kv: KVNamespace, count: number): Promise<void> {
  const current = Number(await kv.get(KEY) ?? 0);
  await kv.put(KEY, String(current + count));
}

export async function getCount(kv: KVNamespace): Promise<number> {
  return Number(await kv.get(KEY) ?? 0);
}
