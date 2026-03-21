import type { ProcessMode } from '~/pipeline/types';
import { useLang } from '~/hooks/useLang';
import { cn } from '~/lib/cn';

const OPTIONS: { value: ProcessMode; icon: React.ReactNode }[] = [
  {
    value: 'full',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="1" width="14" height="14" rx="1" />
      </svg>
    ),
  },
  {
    value: 'privacy',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="1" width="5" height="5" rx="1" opacity=".3" />
        <rect x="1" y="8" width="5" height="7" rx="1" />
        <rect x="8" y="1" width="7" height="14" rx="1" />
      </svg>
    ),
  },
  {
    value: 'result-only',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="1" width="5" height="5" rx="1" opacity=".3" />
        <rect x="1" y="8" width="5" height="7" rx="1" opacity=".3" />
        <rect x="8" y="1" width="7" height="14" rx="1" />
      </svg>
    ),
  },
];

interface Props {
  value: ProcessMode;
  onChange: (option: ProcessMode) => void;
}

export function Options({ value, onChange }: Props) {
  const { t } = useLang();

  const labels: Record<ProcessMode, string> = {
    'full': t('options.full'),
    'result-only': t('options.resultOnly'),
    'privacy': t('options.privacy'),
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 py-1">
        <div className="w-1 h-3 bg-primary rounded-sm" />
        <span className="text-xs text-label">
          {t('options.label')}
        </span>
      </div>
      <div className="grid grid-rows-3 gap-2">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex items-center gap-2 px-3 py-3 rounded-lg border border-line transition-all',
              'text-[13px] font-medium',
              opt.value === value
                ? 'bg-primary/10 border-primary/50 text-primary'
                : 'text-label-a hover:text-label',
            )}
          >
            {opt.icon}
            <span>{labels[opt.value]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
