import type { ImageEntry, ProcessMode } from '../pipeline/types';
import { useCallback, useState } from 'react';
import { process } from '../pipeline';

function createEntry(file: File): ImageEntry {
  return {
    id: crypto.randomUUID(),
    original: file,
    status: 'pending',
  };
}

export function useImages() {
  const [entries, setEntries] = useState<ImageEntry[]>([]);
  const [option, setOption] = useState<ProcessMode>('full');

  const updateEntry = useCallback(
    (id: string, patch: Partial<ImageEntry>) => {
      setEntries(prev =>
        prev.map(e => (e.id === id ? { ...e, ...patch } : e)),
      );
    },
    [],
  );

  const processEntry = useCallback(
    async (entry: ImageEntry, mode: ProcessMode) => {
      updateEntry(entry.id, { status: 'processing' });
      try {
        const result = await process(entry.original, mode);
        updateEntry(entry.id, { status: 'complete', result });
      }
      catch (e) {
        updateEntry(entry.id, {
          status: 'failed',
          error: e instanceof Error ? e.message : 'unknown error',
        });
      }
    },
    [updateEntry],
  );

  const add = useCallback(
    (files: File[]) => {
      const newEntries = files.map(createEntry);
      setEntries(prev => [...prev, ...newEntries]);
      newEntries.forEach(entry => processEntry(entry, option));
    },
    [option, processEntry],
  );

  const reprocess = useCallback(
    (mode: ProcessMode) => {
      setOption(mode);
      setEntries((prev) => {
        const reset = prev.map(e => ({ ...e, status: 'pending' as const }));
        reset.forEach(e => processEntry(e, mode));
        return reset;
      });
    },
    [processEntry],
  );

  const remove = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const reset = useCallback(() => setEntries([]), []);

  return {
    entries,
    option,
    setOption: reprocess,
    add,
    remove,
    reset,
  } as const;
}
