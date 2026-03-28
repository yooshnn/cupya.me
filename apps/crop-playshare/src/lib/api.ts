export const api = {
  count: {
    get: (): Promise<number | null> =>
      fetch('/api/count')
        .then(r => r.json<{ count: number }>())
        .then(d => d.count)
        .catch(() => null),

    increment: (count: number): void => {
      fetch('/api/count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count }),
      }).catch(() => {});
    },
  },
};
