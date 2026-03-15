CREATE TABLE `al_arcades` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`is_closed` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `al_arcades_slug_unique` ON `al_arcades` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_arcades_is_closed` ON `al_arcades` (`is_closed`);--> statement-breakpoint
CREATE INDEX `idx_arcades_slug` ON `al_arcades` (`slug`);--> statement-breakpoint
CREATE TABLE `al_channels` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`arcade_id` integer NOT NULL,
	`youtube_channel_id` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`arcade_id`) REFERENCES `al_arcades`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `al_channels_youtube_channel_id_unique` ON `al_channels` (`youtube_channel_id`);--> statement-breakpoint
CREATE INDEX `idx_channels_arcade_id` ON `al_channels` (`arcade_id`);--> statement-breakpoint
CREATE TABLE `al_games` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`alias` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `al_games_name_unique` ON `al_games` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `al_games_alias_unique` ON `al_games` (`alias`);--> statement-breakpoint
CREATE UNIQUE INDEX `al_games_slug_unique` ON `al_games` (`slug`);--> statement-breakpoint
CREATE TABLE `al_stream_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`arcade_id` integer NOT NULL,
	`game_id` integer NOT NULL,
	`keyword` text NOT NULL,
	`machine_label` text,
	`priority` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`arcade_id`) REFERENCES `al_arcades`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`game_id`) REFERENCES `al_games`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_stream_rules_arcade_id_priority` ON `al_stream_rules` (`arcade_id`,`priority`);--> statement-breakpoint
CREATE INDEX `idx_stream_rules_game_id` ON `al_stream_rules` (`game_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `al_stream_rules_arcade_id_game_id_keyword_unique` ON `al_stream_rules` (`arcade_id`,`game_id`,`keyword`);