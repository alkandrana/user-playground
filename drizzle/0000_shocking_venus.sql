CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text,
	`password` text NOT NULL,
	`created_at` integer DEFAULT (current_timestamp),
	`is_active` integer DEFAULT true,
	`refresh_token` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_username_unique` ON `users_table` (`username`);