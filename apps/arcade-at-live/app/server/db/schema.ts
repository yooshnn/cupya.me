import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';

export const games = sqliteTable('al_games', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  alias: text('alias').notNull().unique(),
  slug: text('slug').notNull().unique(),
});

export const arcades = sqliteTable('al_arcades', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  is_closed: integer('is_closed', { mode: 'boolean' }).notNull().default(false),
  created_at: text('created_at').notNull().default(sql`(datetime('now'))`),
}, t => [
  index('al_idx_arcades_is_closed').on(t.is_closed),
  index('al_idx_arcades_slug').on(t.slug),
]);

export const channels = sqliteTable('al_channels', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  arcade_id: integer('arcade_id').notNull().references(() => arcades.id, { onDelete: 'cascade' }),
  youtube_channel_id: text('youtube_channel_id').notNull().unique(),
  created_at: text('created_at').notNull().default(sql`(datetime('now'))`),
}, t => [
  index('al_idx_channels_arcade_id').on(t.arcade_id),
]);

export const stream_rules = sqliteTable('al_stream_rules', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  arcade_id: integer('arcade_id').notNull().references(() => arcades.id, { onDelete: 'cascade' }),
  game_id: integer('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  keyword: text('keyword').notNull(),
  machine_label: text('machine_label'),
  priority: integer('priority').notNull().default(0),
  created_at: text('created_at').notNull().default(sql`(datetime('now'))`),
}, t => [
  unique().on(t.arcade_id, t.game_id, t.keyword),
  index('al_idx_stream_rules_arcade_id_priority').on(t.arcade_id, t.priority),
  index('al_idx_stream_rules_game_id').on(t.game_id),
]);

export type Game = typeof games.$inferSelect;
export type Arcade = typeof arcades.$inferSelect;
export type Channel = typeof channels.$inferSelect;
export type StreamRule = typeof stream_rules.$inferSelect;
