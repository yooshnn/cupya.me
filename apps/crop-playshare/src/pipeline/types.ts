export type ProcessMode = 'full' | 'result-only' | 'privacy';

export type ImageStatus = 'pending' | 'processing' | 'complete' | 'failed';

export interface ImageEntry {
  id: string;
  original: File;
  status: ImageStatus;
  result?: Blob;
  error?: string;
}

export interface DetectResult {
  top: number;
  bottom: number;
  width: number;
}

export const RESULT_RATIO = {
  aspectRatio: 2 / 3,
  userInfoWidth: 0.441,
  cardnameHeight: 0.128,
} as const;
