import type { ImageEntry } from '~/pipeline/types';
import { DownloadIcon, ShareIcon } from '@phosphor-icons/react';
import { useLang } from '~/hooks/useLang';
import { Button } from '~/ui/common/Button';

interface Props {
  entries: ImageEntry[];
  onDownloadAll: () => void;
  onShare: () => void;
}

export function ActionBar({ entries, onDownloadAll, onShare }: Props) {
  const { t } = useLang();
  const isEmpty = entries.filter(e => e.status === 'complete').length === 0;

  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-bg via-bg/95 to-transparent via-75% pt-11 pb-7 space-y-2 px-4">
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={onShare}
          disabled={isEmpty}
          className="flex-1"
        >
          <ShareIcon />
          {t('actions.share')}
        </Button>
        <Button
          variant="primary"
          onClick={onDownloadAll}
          disabled={isEmpty}
          className="flex-[1.6]"
        >
          <DownloadIcon />
          {t('actions.downloadAll')}
        </Button>
      </div>
    </div>
  );
}
