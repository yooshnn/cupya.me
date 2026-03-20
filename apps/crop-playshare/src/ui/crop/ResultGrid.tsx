import type { ImageEntry } from '~/pipeline/types';
import { useLang } from '~/hooks/useLang';

interface Props {
  entries: ImageEntry[];
  onRemove: (id: string) => void;
  onReset: () => void;
}

export function ResultGrid({ entries, onRemove, onReset }: Props) {
  const { t } = useLang();

  if (entries.length === 0)
    return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 py-1">
          <div className="w-1 h-3 bg-primary rounded-sm" />
          <span className="text-xs text-label">
            {t('result.label')}
          </span>
          <span className="font-mono text-xs text-label font-medium">
            (
            {entries.length}
            )
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

function ResultCard({
  entry,
  onRemove,
}: {
  entry: ImageEntry;
  onRemove: (id: string) => void;
}) {
  const resultUrl = entry.result ? URL.createObjectURL(entry.result) : null;

  return (
    <div className="rounded-xl overflow-hidden border border-line bg-elevated relative">
      {resultUrl
        ? (
            <img src={resultUrl} alt="" className="w-full block" />
          )
        : (
            <div className="aspect-[2/1] flex items-center justify-center">
              {entry.status === 'processing' && (
                <span className="font-mono text-[10px] text-label-a">processing...</span>
              )}
              {entry.status === 'failed' && (
                <span className="font-mono text-[10px] text-danger">failed</span>
              )}
            </div>
          )}
      <div className="absolute top-2 right-2 flex gap-1">
        {resultUrl && (
          <a
            href={resultUrl}
            download={`result_${entry.id}.png`}
            className="w-7 h-7 rounded-md bg-bg/85 border border-line
                       flex items-center justify-center"
          >
            <svg width="13" height="13" fill="none" stroke="#9090a0" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
        )}
        <button
          onClick={() => onRemove(entry.id)}
          className="w-7 h-7 rounded-md bg-bg/85 border border-line
                     flex items-center justify-center"
        >
          <svg width="13" height="13" fill="none" stroke="#f05050" strokeWidth="1.8" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
