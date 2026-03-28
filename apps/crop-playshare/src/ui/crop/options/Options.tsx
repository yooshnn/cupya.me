import type { ProcessMode } from '~/pipeline/types';
import { useLang } from '~/hooks/useLang';
import { cn } from '~/lib/cn';
import { FullIcon, PrivacyIcon, ResultOnlyIcon } from './OptionIcons';

const OPTIONS: { value: ProcessMode; Icon: React.FC }[] = [
  { value: 'full', Icon: FullIcon },
  { value: 'privacy', Icon: PrivacyIcon },
  { value: 'result-only', Icon: ResultOnlyIcon },
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
        {OPTIONS.map(({ value: optValue, Icon }) => (
          <button
            key={optValue}
            onClick={() => onChange(optValue)}
            className={cn(
              'flex items-center gap-2 px-3 py-3 rounded-lg border border-line transition-all',
              'text-[13px] font-medium',
              optValue === value
                ? 'bg-primary/10 border-primary/50 text-primary'
                : 'text-label-a hover:text-label',
            )}
          >
            <Icon />
            <span>{labels[optValue]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
