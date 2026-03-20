import type { ImageEntry } from '~/pipeline/types';
import { useLang } from '~/hooks/useLang';
import { Button } from '~/ui/common/Button';

interface Props {
  entries: ImageEntry[];
  onDownloadAll: () => void;
  onShare: () => void;
}

export function ActionBar({ entries, onDownloadAll, onShare }: Props) {
  const { t } = useLang();
  const isEmpty = entries.filter(i => i.status === 'complete').length === 0;

  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-bg via-bg/95 to-transparent pt-6 pb-7 space-y-2 px-4">
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={onDownloadAll}
          disabled={isEmpty}
          className="flex-1"
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {t('actions.downloadAll')}
        </Button>
        <Button
          variant="primary"
          onClick={onShare}
          disabled={isEmpty}
          className="flex-[1.6]"
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          {t('actions.share')}
        </Button>
      </div>
    </div>
  );
}
