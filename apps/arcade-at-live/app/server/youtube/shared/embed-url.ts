/**
 * Generates a YouTube embed player URL based on the provided video ID.
 * Includes viewer optimization parameters like autoplay, mute, and hidden controls.
 * @param videoId The YouTube video ID
 * @returns The constructed embed URL string
 */
export function buildEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    controls: '0',
    modestbranding: '1',
    rel: '0',
    iv_load_policy: '3',
    disablekb: '1',
  });
  return `https://www.youtube.com/embed/${videoId}?${params}`;
}
