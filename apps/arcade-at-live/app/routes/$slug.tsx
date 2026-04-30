import type { Route } from './+types/$slug';
import { ArrowsClockwiseIcon, CactusIcon, CaretLeftIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { data, isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { getArcadeBySlug } from '~/features/arcade/arcade.server';
import { getGamesByArcadeId } from '~/features/game/game.server';
import { getSettings } from '~/features/settings/settings.server';
import { StreamGrid } from '~/features/stream/components/StreamGrid';
import { filterStreamsByGameId, useGameTabs } from '~/features/stream/hooks/useGameTabs';
import { getActiveStreamsByArcadeId } from '~/features/stream/services/stream.server';
import { getDB } from '~/server/db/client';
import { Button } from '~/shared/ui/button';
import { EmptyState } from '~/shared/ui/EmptyState';
import { Tabs } from '~/shared/ui/tabs';

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData?.arcade) {
    return [
      { title: 'ARCADE@LIVE' },
      { name: 'description', content: '오락실 정보를 불러올 수 없습니다.' },
    ];
  }

  return [
    { title: `${loaderData.arcade.name} | ARCADE@LIVE` },
  ];
}

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const { env, ctx } = context.cloudflare;
  const db = getDB(env.DB);
  const { slug } = params;

  const arcade = await getArcadeBySlug(db, env.CACHE, slug);

  const [{ streams, scrapeFailed, timestamp }, games, settings] = await Promise.all([
    getActiveStreamsByArcadeId({ db, kv: env.CACHE, ctx, arcadeId: arcade.id, youtubeApiKey: env.YOUTUBE_API_KEY }),
    getGamesByArcadeId({ db, kv: env.CACHE, arcadeId: arcade.id }),
    getSettings(request),
  ]);

  const filteredGames = settings.selectedGameIds.length > 0
    ? games.filter(g => settings.selectedGameIds.includes(g.id))
    : games;

  return data({ arcade, streams, games: filteredGames, scrapeFailed, timestamp });
}

export function ErrorBoundary() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="min-h-screen bg-bg text-label antialiased">
      <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md">
        <div className="h-16 flex items-center px-6 border-b border-line">
          <Link
            to="/"
            className="flex items-center gap-1.5 py-6 px-2 text-sm text-label-neutral hover:text-white"
          >
            <CaretLeftIcon />
            홈
          </Link>
        </div>
      </header>

      <main className="p-6 pb-12">
        <EmptyState
          icon={is404 ? <CactusIcon /> : <WarningCircleIcon />}
          message={is404 ? '존재하지 않는 오락실입니다.' : '오류가 발생했습니다.'}
          action={<Button render={<Link to="/" />} nativeButton={false}>홈으로</Button>}
        />
      </main>
    </div>
  );
}

export default function ArcadeStreamPage({ loaderData }: Route.ComponentProps) {
  const { arcade, streams, games, scrapeFailed, timestamp } = loaderData;

  const { tabItems, handleSelect, activeGameId } = useGameTabs(games, streams);
  const selectedStreams = filterStreamsByGameId(streams, activeGameId);
  const hasSelectedStreams = selectedStreams.length > 0;

  const updatedAt = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: 'numeric',
    minute: 'numeric',
  }).format(timestamp);

  return (
    <div className="min-h-screen bg-bg text-label antialiased">
      <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md">
        <div className="h-16 flex items-center px-6 border-b border-line">
          <Link
            to="/"
            className="flex items-center gap-1.5 py-6 px-2 text-sm text-label-neutral hover:text-white"
          >
            <CaretLeftIcon />
            홈
          </Link>

          <div className="h-5 w-px shrink-0 bg-line mx-2" />

          <span className="min-w-0 flex-1 truncate text-base font-black tracking-wide px-2">
            {arcade.name}
          </span>

          <div className="flex shrink-0 items-center gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-status-live" />
            <span className="font-mono text-sm text-label-assistive">
              <strong className="text-label">{streams.length}</strong>
            </span>
          </div>
        </div>

        <Tabs items={tabItems} activeKey={activeGameId} onSelect={handleSelect} />
      </header>

      <main className="flex flex-col gap-4 p-6 pb-12">
        <div className="flex justify-end items-center gap-1 text-xs text-label-assistive">
          <ArrowsClockwiseIcon />
          {updatedAt}
        </div>

        {!hasSelectedStreams && (
          <EmptyState
            icon={scrapeFailed ? <WarningCircleIcon /> : <CactusIcon />}
            message={scrapeFailed
              ? '방송 정보를 불러오지 못했습니다.'
              : '현재 방송 중인 스트림이 없습니다.'}
            action={<Button render={<Link to="/" />} nativeButton={false}>돌아가기</Button>}
          />
        )}
        {hasSelectedStreams && (
          <StreamGrid streams={selectedStreams} />
        )}
      </main>
    </div>
  );
}
