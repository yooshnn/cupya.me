import type { ImageEntry, ProcessMode } from '../pipeline/types';
import { useState } from 'react';

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

  const add = (files: File[]) => {
    setEntries(prev => [...prev, ...files.map(createEntry)]);
  };

  const remove = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const reset = () => setEntries([]);

  return { entries, option, setOption, add, remove, reset } as const;
}
