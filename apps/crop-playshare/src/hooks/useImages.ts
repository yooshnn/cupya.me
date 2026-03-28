import type { ImageEntry, ProcessMode } from '../pipeline/types';
import { useCallback, useState } from 'react';
import { api } from '~/lib/api';
import { process } from '../pipeline';

function generateId() {
  let result = '';
  while (result.length < 16) {
    result += Math.random().toString(36).substring(2);
  }
  return result.substring(0, 16);
}

function createEntry(file: File): ImageEntry {
  return {
    id: generateId(),
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
      api.count.increment(files.length);
    },
    [option, processEntry],
  );

  const reprocess = useCallback(
    (mode: ProcessMode) => {
      setOption(mode);
      setEntries((prev) => {
        const reset = prev.map(e => ({ ...e, status: 'processing' as const, result: undefined }));
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

  const downloadAll = useCallback(() => {
    const done = entries.filter(e => e.status === 'complete' && e.result);
    done.forEach((entry) => {
      const url = URL.createObjectURL(entry.result!);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${entry.id}.webp`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, [entries]);

  const share = useCallback(async () => {
    const done = entries.filter(e => e.status === 'complete' && e.result);
    if (done.length === 0)
      return;

    const files = done.map(
      (entry, i) =>
        new File([entry.result!], `result_${i + 1}.webp`, { type: 'image/webp' }),
    );

    if (!navigator.canShare?.({ files })) {
      downloadAll();
      return;
    }

    await navigator.share({ files });
  }, [entries, downloadAll]);

  return {
    entries,
    option,
    setOption: reprocess,
    add,
    remove,
    reset,
    downloadAll,
    share,
  } as const;
}
