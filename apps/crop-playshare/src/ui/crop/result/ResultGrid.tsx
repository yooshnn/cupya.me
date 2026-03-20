import type { ResultGridProps } from './result.types';
import { useLang } from '~/hooks/useLang';
import { ResultCard } from './ResultCard';

export function ResultGrid({ entries, onRemove, onReset }: ResultGridProps) {
  const { t } = useLang();

  return (
    <div className="space-y-3">
      <ResultGridHeader
        count={entries.length}
        onReset={onReset}
        t={t}
      />
      {entries.length === 0
        ? <ResultGridEmpty t={t} />
        : (
            <div className="grid grid-cols-2 gap-3">
              {entries.map(entry => (
                <ResultCard key={entry.id} entry={entry} onRemove={onRemove} />
              ))}
            </div>
          )}
    </div>
  );
}

function ResultGridHeader({
  count,
  onReset,
  t,
}: {
  count: number;
  onReset: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 py-1">
        <div className="w-1 h-3 bg-primary rounded-sm" />
        <span className="text-xs text-label">{t('result.label')}</span>
        {count > 0 && (
          <span className="font-mono text-xs text-label font-medium">
            {`(${count})`}
          </span>
        )}
      </div>
      {count > 0 && (
        <button
          onClick={onReset}
          className="text-xs text-danger font-medium hover:opacity-80 transition-opacity"
        >
          {t('result.reset')}
        </button>
      )}
    </div>
  );
}

function ResultGridEmpty({ t }: { t: (key: string) => string }) {
  return (
    <div className="flex items-center justify-center py-4">
      <span className="text-xs text-label-d text-center leading-relaxed">
        {t('result.empty')}
      </span>
    </div>
  );
}
