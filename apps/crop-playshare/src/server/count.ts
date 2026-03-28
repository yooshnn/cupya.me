const KEY = 'cp:count';

/** Returns clamped integer [0, 20], or null if input is not a finite number. */
export function sanitizeCount(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value))
    return null;
  return Math.min(Math.max(Math.floor(value), 0), 20);
}

export async function addCount(kv: KVNamespace, count: number): Promise<void> {
  const current = Number(await kv.get(KEY) ?? 0);
  await kv.put(KEY, String(current + count));
}

export async function getCount(kv: KVNamespace): Promise<number> {
  return Number(await kv.get(KEY) ?? 0);
}
