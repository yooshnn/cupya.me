import { useLang } from '~/hooks/useLang';
import { cn } from '~/lib/cn';

interface Props {
  onFiles: (files: File[]) => void;
  className?: string;
}

export function Upload({ onFiles, className }: Props) {
  const { t } = useLang();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...e.target.files ?? []];
    if (files.length)
      onFiles(files);
    e.target.value = '';
  };

  return (
    <label
      className={cn(
        'block border border-dashed border-line-em rounded-xl p-8 text-center cursor-pointer',
        'bg-elevated hover:border-primary hover:bg-primary/[0.04] transition-all',
        className,
      )}
    >
      <div className="w-10 h-10 rounded-full bg-surface border border-line
                      flex items-center justify-center mx-auto mb-3"
      >
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
          className="text-primary"
        >
          <polyline points="16 16 12 12 8 16" />
          <line x1="12" y1="12" x2="12" y2="21" />
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>
      </div>
      <p className="text-[14px] font-semibold text-label mb-1">{t('upload.title')}</p>
      <p className="text-[11px] text-label-a">{t('upload.sub')}</p>
      <input type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
    </label>
  );
}
