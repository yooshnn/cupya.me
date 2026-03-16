export function createCache<T>(
  keyFn: (...args: any[]) => string,
  defaultTtl: number,
  prefix: string = 'al',
) {
  const buildKey = (...args: any[]) => `${prefix}:${keyFn(...args)}`;

  return {
    async get(kv: KVNamespace, ...args: Parameters<typeof keyFn>): Promise<T | null> {
      return kv.get<T>(buildKey(...args), 'json');
    },
    async set(kv: KVNamespace, data: T, ...args: Parameters<typeof keyFn>): Promise<void> {
      await kv.put(buildKey(...args), JSON.stringify(data), { expirationTtl: defaultTtl });
    },
    async invalidate(kv: KVNamespace, ...args: Parameters<typeof keyFn>): Promise<void> {
      await kv.delete(buildKey(...args));
    },
  };
}
