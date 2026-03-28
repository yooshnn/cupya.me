import type { ResultCardProps } from './result.types';
import type { ImageEntry } from '~/pipeline/types';
import { DownloadIcon, TrashIcon } from '@phosphor-icons/react';
import { useBlobUrl } from '~/hooks/useBlobUrl';

export function ResultCard({ entry, onRemove }: ResultCardProps) {
  const url = useBlobUrl(entry.result);

  return (
    <div className="rounded-xl overflow-hidden border border-line bg-elevated relative">
      <ResultPreview entry={entry} url={url} />
      <div className="absolute top-2 right-2 flex gap-1">
        {url !== null && (
          <a
            href={url}
            download={`${entry.id}.webp`}
            className="w-7 h-7 rounded-md bg-bg/85 border border-line flex items-center justify-center"
          >
            <DownloadIcon />
          </a>
        )}
        <button
          onClick={() => onRemove(entry.id)}
          className="w-7 h-7 rounded-md bg-bg/85 border border-line flex items-center justify-center"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

function ResultPreview({ entry, url }: { entry: ImageEntry; url: string | null }) {
  if (url !== null) {
    return <img src={url} alt="" className="w-full block" />;
  }

  return (
    <div className="aspect-2/1 flex items-center justify-center">
      {(entry.status === 'processing' || entry.status === 'pending') && (
        <span className="font-mono text-[10px] text-label-a">processing...</span>
      )}
      {entry.status === 'failed' && (
        <span className="font-mono text-[10px] text-danger">failed</span>
      )}
    </div>
  );
}
