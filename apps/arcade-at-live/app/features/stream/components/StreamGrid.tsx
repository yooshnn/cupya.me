import type { MatchedStream } from '../services/types';
import { Link } from 'react-router';
import { cn } from '~/shared/utils';

interface StreamCardProps {
  stream: MatchedStream;
}

export function StreamGrid({ streams }: { streams: MatchedStream[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(360px,100%),1fr))] gap-4">
      {streams.map(stream => (
        <StreamCard key={`${stream.gameId}-${stream.videoId}`} stream={stream} />
      ))}
    </div>
  );
}

function StreamCard({ stream }: StreamCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-bg-elevated hover:shadow shadow-primary-dim">
      <div className="aspect-video w-full">
        <iframe
          src={stream.embedUrl}
          className="h-full w-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>

      <div className="flex items-center justify-between gap-2 px-3.5 py-3">
        <span className={cn(
          'text-sm font-medium',
          stream.machineLabel ? 'text-label' : 'text-label-assistive',
        )}
        >
          {stream.machineLabel ?? '방송기기'}
        </span>

        <Link
          to={`https://www.youtube.com/watch?v=${stream.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs text-label-assistive hover:underline"
        >
          유튜브에서 보기 ↗
        </Link>
      </div>
    </div>
  );
}
