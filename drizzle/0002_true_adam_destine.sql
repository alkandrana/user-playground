ALTER TABLE `comments` ADD `user_id` integer REFERENCES users_table(id);--> statement-breakpoint
ALTER TABLE `vocab` ADD `user_id` integer REFERENCES users_table(id);--> statement-breakpoint
ALTER TABLE `vocab_instances` ADD `user_id` integer REFERENCES users_table(id);