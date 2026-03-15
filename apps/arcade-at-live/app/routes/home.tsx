// app/routes/db-test.tsx
import type { Route } from './+types/home';
import { getDB } from '../server/db/client';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDB(context.cloudflare.env.DB);
  const [games, arcades, channels, stream_rules] = await Promise.all([
    db.query.games.findMany(),
    db.query.arcades.findMany(),
    db.query.channels.findMany(),
    db.query.stream_rules.findMany(),
  ]);
  return { games, arcades, channels, stream_rules };
}

export default function DbTest({ loaderData }: Route.ComponentProps) {
  const { games, arcades, channels, stream_rules } = loaderData;

  return (
    <main className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">DB Test</h1>
      <section>
        <h2 className="font-semibold mb-2">
          games (
          {games.length}
          )
        </h2>
        <pre className="text-sm bg-gray-100 p-4 rounded">{JSON.stringify(games, null, 2)}</pre>
      </section>
      <section>
        <h2 className="font-semibold mb-2">
          arcades (
          {arcades.length}
          )
        </h2>
        <pre className="text-sm bg-gray-100 p-4 rounded">{JSON.stringify(arcades, null, 2)}</pre>
      </section>
      <section>
        <h2 className="font-semibold mb-2">
          channels (
          {channels.length}
          )
        </h2>
        <pre className="text-sm bg-gray-100 p-4 rounded">{JSON.stringify(channels, null, 2)}</pre>
      </section>
      <section>
        <h2 className="font-semibold mb-2">
          stream_rules (
          {stream_rules.length}
          )
        </h2>
        <pre className="text-sm bg-gray-100 p-4 rounded">{JSON.stringify(stream_rules, null, 2)}</pre>
      </section>
    </main>
  );
}
