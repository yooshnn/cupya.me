import type { Route } from './+types/home';
import { ArrowRightIcon, GearSixIcon } from '@phosphor-icons/react';
import { data, Link } from 'react-router';
import { getArcades } from '~/features/arcade/arcade.server';
import { getSettings } from '~/features/settings/settings.server';
import { getDB } from '~/server/db/client';
import { Button } from '~/shared/ui/button';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'ARCADE@LIVE' },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = context.cloudflare;
  const db = getDB(env.DB);

  const [arcades, settings] = await Promise.all([
    getArcades(db, env.CACHE),
    getSettings(request),
  ]);

  const filteredArcades = settings.selectedArcadeIds.length > 0
    ? arcades.filter(a => settings.selectedArcadeIds.includes(a.id))
    : arcades;

  return data({ arcades: filteredArcades });
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { arcades } = loaderData;

  return (
    <div className="min-h-screen bg-bg text-label antialiased">
      <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md">
        <div className="h-16 flex items-center gap-4 px-6 border-b border-line">
          <span className="min-w-0 flex-1 truncate text-base font-black tracking-wide">
            ARCADE@LIVE
          </span>

          <Button render={<Link to="/settings" />} nativeButton={false} variant="ghost" rounded="full" icon>
            <GearSixIcon />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-8">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-label-assistive">
          오락실
          {' '}
          {arcades.length}
        </p>

        <div className="flex flex-col">
          {arcades.map(arcade => (
            <Link
              key={arcade.id}
              to={`/${arcade.slug}`}
              className="group flex items-center justify-between gap-3 border-b border-line py-3.5 transition-[padding] first:border-t"
            >
              <span className="text-sm font-medium text-label transition-colors group-hover:text-primary">
                {arcade.name}
              </span>
              <span className="shrink-0 text-sm text-label-neutral transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-primary">
                <ArrowRightIcon />
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
