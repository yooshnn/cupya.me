export const api = {
  count: {
    get: (): Promise<number | null> =>
      fetch('/api/count')
        .then(r => {
          if (!r.ok)
            throw new Error(`HTTP ${r.status}`);
          return r.json<{ count: number }>();
        })
        .then(d => (typeof d.count === 'number' ? d.count : null))
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
