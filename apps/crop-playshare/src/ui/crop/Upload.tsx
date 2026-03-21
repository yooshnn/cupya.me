import { CloudArrowUpIcon } from '@phosphor-icons/react';
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
        'bg-elevated hover:border-primary hover:bg-primary/4 transition-all',
        className,
      )}
    >
      <div className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center mx-auto mb-3">
        <CloudArrowUpIcon />
      </div>
      <p className="text-[14px] font-semibold text-label mb-1">{t('upload.title')}</p>
      <p className="text-[11px] text-label-a">{t('upload.sub')}</p>
      <input type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
    </label>
  );
}
