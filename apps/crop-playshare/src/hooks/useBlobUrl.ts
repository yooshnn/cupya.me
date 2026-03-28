/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
/* Intentional: syncing state with an external resource (Object URL registry) that requires cleanup via revokeObjectURL. */

import { useEffect, useState } from 'react';

export function useBlobUrl(blob: Blob | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!blob) {
      setUrl(null);
      return;
    }
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);

  return url;
}
