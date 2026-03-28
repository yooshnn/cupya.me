import type { ImageEntry } from '~/pipeline/types';

function generateId(): string {
  let result = '';
  while (result.length < 16) {
    result += Math.random().toString(36).substring(2);
  }
  return result.substring(0, 16);
}

export function createEntry(file: File): ImageEntry {
  return {
    id: generateId(),
    original: file,
    status: 'pending',
  };
}
