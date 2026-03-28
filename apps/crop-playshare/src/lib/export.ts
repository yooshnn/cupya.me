import type { ImageEntry } from '~/pipeline/types';

function completedEntries(entries: ImageEntry[]) {
  return entries.filter(e => e.status === 'complete' && e.result);
}

export function downloadAll(entries: ImageEntry[]): void {
  completedEntries(entries).forEach((entry) => {
    const url = URL.createObjectURL(entry.result!);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entry.id}.webp`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

export async function share(entries: ImageEntry[]): Promise<void> {
  const done = completedEntries(entries);
  if (done.length === 0)
    return;

  const files = done.map(
    (entry, i) =>
      new File([entry.result!], `result_${i + 1}.webp`, { type: 'image/webp' }),
  );

  if (!navigator.canShare?.({ files })) {
    downloadAll(entries);
    return;
  }

  await navigator.share({ files });
}
