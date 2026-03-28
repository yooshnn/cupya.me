import { describe, expect, it } from 'vitest';
import { addCount, getCount, sanitizeCount } from './count';

// --- sanitizeCount ---

describe('sanitizeCount', () => {
  it('returns the value as-is for valid input', () => {
    expect(sanitizeCount(5)).toBe(5);
    expect(sanitizeCount(1)).toBe(1);
  });

  it('clamps to 20 when value exceeds 20', () => {
    expect(sanitizeCount(21)).toBe(20);
    expect(sanitizeCount(9999)).toBe(20);
  });

  it('clamps to 0 for negative values', () => {
    expect(sanitizeCount(-1)).toBe(0);
    expect(sanitizeCount(-9999)).toBe(0);
  });

  it('floors decimal values', () => {
    expect(sanitizeCount(3.9)).toBe(3);
    expect(sanitizeCount(0.1)).toBe(0);
  });

  it('returns null for NaN', () => {
    expect(sanitizeCount(Number.NaN)).toBeNull();
  });

  it('returns null for Infinity', () => {
    expect(sanitizeCount(Infinity)).toBeNull();
    expect(sanitizeCount(-Infinity)).toBeNull();
  });

  it('returns null for strings', () => {
    expect(sanitizeCount('5')).toBeNull();
    expect(sanitizeCount('abc')).toBeNull();
  });

  it('returns null for undefined and null', () => {
    expect(sanitizeCount(undefined)).toBeNull();
    expect(sanitizeCount(null)).toBeNull();
  });

  it('returns null for objects and arrays', () => {
    expect(sanitizeCount({ count: 5 })).toBeNull();
    expect(sanitizeCount([5])).toBeNull();
  });
});

// --- addCount / getCount ---

function mockKV(): KVNamespace {
  const store = new Map<string, string>();
  return {
    get: (key: string) => Promise.resolve(store.get(key) ?? null),
    put: (key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve();
    },
  } as KVNamespace;
}

describe('getCount', () => {
  it('returns 0 when no value is stored', async () => {
    expect(await getCount(mockKV())).toBe(0);
  });

  it('returns the stored value', async () => {
    const kv = mockKV();
    await kv.put('cp:count', '42');
    expect(await getCount(kv)).toBe(42);
  });
});

describe('addCount', () => {
  it('accumulates count across multiple calls', async () => {
    const kv = mockKV();
    await addCount(kv, 3);
    await addCount(kv, 5);
    expect(await getCount(kv)).toBe(8);
  });

  it('starts from 0 when no prior value exists', async () => {
    const kv = mockKV();
    await addCount(kv, 10);
    expect(await getCount(kv)).toBe(10);
  });
});
