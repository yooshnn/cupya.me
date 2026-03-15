import type { Route } from '.react-router/types/app/routes/+types/home';
import { desc, eq } from 'drizzle-orm';
import { Form } from 'react-router';
import { getDB } from '../server/db/client';
import * as schema from '../server/db/schema';

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDB(context.cloudflare.env.DB);
  const posts = await db.query.posts.findMany({
    orderBy: [desc(schema.posts.id)],
  });
  return { posts };
}

export async function action({ request, context }: Route.ActionArgs) {
  const db = getDB(context.cloudflare.env.DB);
  const formData = await request.formData();
  const intent = formData.get('intent');

  switch (intent) {
    case 'create': {
      const title = String(formData.get('title')).trim();
      await db.insert(schema.posts).values({
        title,
        created_at: new Date().toISOString(),
      });
      break;
    }

    case 'delete': {
      const id = Number(formData.get('id'));
      await db.delete(schema.posts).where(eq(schema.posts.id, id));
      break;
    }
  }

  return null;
}

export default function Home({ loaderData: { posts } }: Route.ComponentProps) {
  return (
    <main className="max-w-xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">
        Sample App
      </h1>

      <p className="text-neutral-500">
        {posts.length}
        {' '}
        post(s) found.
      </p>

      <Form method="post" className="flex gap-2 items-center">
        <input type="hidden" name="intent" value="create" />
        <input name="title" placeholder="New post title" className="border rounded px-2 py-1 flex-1" required />
        <button type="submit" className="bg-black text-white px-4 py-1 rounded">Add</button>
      </Form>

      <ul className="space-y-2">
        {posts.map(post => (
          <li key={post.id} className="flex justify-between items-center border-b pb-2">
            <span>{post.title}</span>
            <Form method="post">
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" name="id" value={post.id} />
              <button type="submit" className="text-red-500 text-sm hover:underline">Delete</button>
            </Form>
          </li>
        ))}
      </ul>
    </main>
  );
}
