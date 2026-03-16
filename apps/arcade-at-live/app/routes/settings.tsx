import type { Route } from './+types/settings';
import type { Settings } from '~/features/settings/settings.types';
import { CaretLeftIcon } from '@phosphor-icons/react';
import { data, Link, useFetcher } from 'react-router';
import { getArcades } from '~/features/arcade/arcade.server';
import { getGames } from '~/features/game/game.server';
import { getSettings, serializeSettings } from '~/features/settings/settings.server';
import { getDB } from '~/server/db/client';

export function meta({}: Route.MetaArgs) {
  return [
    { title: '설정 / ARCADE@LIVE' },
  ];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const { env } = context.cloudflare;
  const db = getDB(env.DB);

  const [arcades, games, settings] = await Promise.all([
    getArcades(db, env.CACHE),
    getGames(db),
    getSettings(request),
  ]);

  return data({ arcades, games, settings });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const selectedArcadeIds = formData.getAll('arcadeId').map(Number);
  const selectedGameIds = formData.getAll('gameId').map(Number);

  const cookie = await serializeSettings({ selectedArcadeIds, selectedGameIds });

  return new Response(null, {
    status: 204,
    headers: { 'Set-Cookie': cookie },
  });
}

interface ToggleListProps {
  title: string;
  hint: string;
  items: { id: number; name: string }[];
  selectedIds: number[];
  fieldName: string;
  allFieldName: string;
  onToggle: (nextSettings: Partial<Settings>) => void;
  settings: Settings;
}

function ToggleList({
  title,
  hint,
  items,
  selectedIds,
  fieldName,
  onToggle,
  allFieldName,
}: ToggleListProps) {
  function handleChange(id: number, checked: boolean) {
    const nextIds = checked
      ? [...selectedIds, id]
      : selectedIds.filter(i => i !== id);

    onToggle({ [allFieldName]: nextIds });
  }

  return (
    <section>
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-label-neutral">
        {title}
      </p>
      <p className="mb-4 text-xs text-label-assistive">
        {hint}
      </p>
      <div className="flex flex-col">
        {items.map((item) => {
          const isChecked = selectedIds.includes(item.id);
          return (
            <label
              key={item.id}
              className="group flex cursor-pointer items-center justify-between gap-3 border-b border-line py-3.5 first:border-t"
            >
              <span className="text-sm font-medium text-label transition-colors group-hover:text-label">
                {item.name}
              </span>
              <input
                type="checkbox"
                name={fieldName}
                value={item.id}
                checked={isChecked}
                onChange={e => handleChange(item.id, e.target.checked)}
                className="accent-primary size-4 shrink-0"
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}

export default function SettingsPage({ loaderData }: Route.ComponentProps) {
  const { arcades, games, settings } = loaderData;
  const fetcher = useFetcher();

  function save(partial: Partial<Settings>) {
    const next: Settings = { ...settings, ...partial };

    const formData = new FormData();
    next.selectedArcadeIds.forEach(id => formData.append('arcadeId', String(id)));
    next.selectedGameIds.forEach(id => formData.append('gameId', String(id)));

    fetcher.submit(formData, { method: 'post' });
  }

  function reset() {
    fetcher.submit(new FormData(), { method: 'post' });
  }

  // optimistic settings
  const optimisticSettings: Settings = fetcher.formData
    ? {
        selectedArcadeIds: fetcher.formData.getAll('arcadeId').map(Number),
        selectedGameIds: fetcher.formData.getAll('gameId').map(Number),
      }
    : settings;

  const isDirty = optimisticSettings.selectedArcadeIds.length > 0
    || optimisticSettings.selectedGameIds.length > 0;

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
            설정
          </span>

          {isDirty && (
            <button
              onClick={reset}
              className="text-xs text-label-assistive transition-colors hover:text-label"
            >
              초기화
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-10 px-6 py-8">
        <ToggleList
          title="표시할 오락실"
          hint="아무것도 선택하지 않으면 전체 오락실을 봅니다."
          items={arcades}
          selectedIds={optimisticSettings.selectedArcadeIds}
          fieldName="arcadeId"
          allFieldName="selectedArcadeIds"
          settings={optimisticSettings}
          onToggle={save}
        />

        <ToggleList
          title="표시할 게임"
          hint="아무것도 선택하지 않으면 전체 게임을 봅니다."
          items={games}
          selectedIds={optimisticSettings.selectedGameIds}
          fieldName="gameId"
          allFieldName="selectedGameIds"
          settings={optimisticSettings}
          onToggle={save}
        />
      </main>
    </div>
  );
}
