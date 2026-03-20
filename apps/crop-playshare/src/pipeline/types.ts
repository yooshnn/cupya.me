export type ProcessMode = 'full' | 'result-only' | 'privacy';

export type ImageStatus = 'pending' | 'processing' | 'complete' | 'failed';

export interface ImageEntry {
  id: string;
  original: File;
  status: ImageStatus;
  result?: Blob;
  error?: string;
}
