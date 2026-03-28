import { Suspense, use, useState } from 'react';
import { useLang } from '~/hooks/useLang';
import { api } from '~/lib/api';

export function CountDisplay() {
  const [countPromise] = useState(() => api.count.get());

  return (
    <Suspense fallback={<Fallback />}>
      <Count countPromise={countPromise} />
    </Suspense>
  );
}

function Count({ countPromise }: { countPromise: Promise<number | null> }) {
  const count = use(countPromise);
  const { t } = useLang();

  if (count === null)
    return <Fallback />;

  return (
    <div className="flex items-baseline text-label-d text-[11px] h-5">
      <span className="font-mono">{count.toLocaleString()}</span>
      <span>{t('hero.processedLabel')}</span>
    </div>
  );
}

function Fallback() {
  return <div className="h-5" />;
}
