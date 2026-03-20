import type { Ref } from 'react';
import type { ImageEntry } from '~/pipeline/types';
import { DownloadIcon, TrashIcon } from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';
import { useLang } from '~/hooks/useLang';

interface Props {
  entries: ImageEntry[];
  onRemove: (id: string) => void;
  onReset: () => void;
}

export function ResultGrid({ entries, onRemove, onReset }: Props) {
  const { t } = useLang();

  if (entries.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 py-1">
            <div className="w-1 h-3 bg-primary rounded-sm" />
            <span className="text-xs text-label">{t('result.label')}</span>
          </div>
        </div>
        <div className="flex items-center justify-center py-4">
          <span className="text-xs text-label-d text-center leading-relaxed">
            {t('result.empty')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 py-1">
          <div className="w-1 h-3 bg-primary rounded-sm" />
          <span className="text-xs text-label">{t('result.label')}</span>
          <span className="font-mono text-xs text-label font-medium">
            {`(${entries.length})`}
          </span>
        </div>
        <button
          onClick={onReset}
          className="text-[11px] text-danger font-medium hover:opacity-80 transition-opacity"
        >
          {t('result.reset')}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {entries.map(entry => (
          <ResultCard key={entry.id} entry={entry} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
}

interface ResultCardProps {
  entry: ImageEntry;
  onRemove: (id: string) => void;
}

function ResultCard({ entry, onRemove }: ResultCardProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!entry.result)
      return;

    const url = URL.createObjectURL(entry.result);

    if (imgRef.current)
      imgRef.current.src = url;
    if (linkRef.current)
      linkRef.current.href = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [entry.result]);

  return (
    <div className="rounded-xl overflow-hidden border border-line bg-elevated relative">
      <ResultPreview entry={entry} imgRef={imgRef} />
      <div className="absolute top-2 right-2 flex gap-1">
        {entry.result && (
          <a
            ref={linkRef}
            download={`${entry.id}.png`}
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

interface ResultPreviewProps {
  entry: ImageEntry;
  imgRef: Ref<HTMLImageElement>;
}

function ResultPreview({ entry, imgRef }: ResultPreviewProps) {
  if (entry.result) {
    return <img ref={imgRef} alt="" className="w-full block" />;
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
