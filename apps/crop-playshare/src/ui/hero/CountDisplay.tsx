import { Suspense, use } from 'react';
import { useLang } from '~/hooks/useLang';
import { api } from '~/lib/api';

const countPromise = api.count.get();

export function CountDisplay() {
  return (
    <Suspense fallback={<Fallback />}>
      <Count />
    </Suspense>
  );
}

function Count() {
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
