import type { ImageEntry } from '~/pipeline/types';

export interface ResultGridProps {
  entries: ImageEntry[];
  onRemove: (id: string) => void;
  onReset: () => void;
}

export interface ResultCardProps {
  entry: ImageEntry;
  onRemove: (id: string) => void;
}
