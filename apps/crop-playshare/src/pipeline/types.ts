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

/** pop'n music result screen layout constants (ratios relative to width) */
export const POPN_RESULT_RATIO = {
  /** Result area height = width × heightRatio */
  heightRatio: 2 / 3,
  /** result-only mode: ratio of the left panel (character + user info) to strip */
  resultPanelOffset: 0.441,
  /** privacy mode: ratio of the top section (card name row) to mask */
  privacyMaskHeight: 0.128,
} as const;
