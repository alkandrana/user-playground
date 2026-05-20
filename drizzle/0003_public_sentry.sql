PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text,
	`password` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp),
	`is_active` integer DEFAULT true,
	`refresh_token` text
);
--> statement-breakpoint
INSERT INTO `__new_users_table`("id", "username", "email", "password", "created_at", "is_active", "refresh_token") SELECT "id", "username", "email", "password", "created_at", "is_active", "refresh_token" FROM `users_table`;--> statement-breakpoint
DROP TABLE `users_table`;--> statement-breakpoint
ALTER TABLE `__new_users_table` RENAME TO `users_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_username_unique` ON `users_table` (`username`);