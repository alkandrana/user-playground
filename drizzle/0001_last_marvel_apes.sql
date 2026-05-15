CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`citation` text NOT NULL,
	`note` text NOT NULL,
	`start_index` integer,
	`end_index` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `comments_citation_unique` ON `comments` (`citation`);--> statement-breakpoint
CREATE TABLE `languages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vocab` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lemma` text NOT NULL,
	`definition` text NOT NULL,
	`language_id` integer NOT NULL,
	`part_of_speech` text NOT NULL,
	FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vocab_lemma_unique` ON `vocab` (`lemma`);--> statement-breakpoint
CREATE TABLE `vocab_instances` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`instance` text NOT NULL,
	`form` text NOT NULL,
	`start_index` integer,
	`end_index` integer,
	`citation` text NOT NULL,
	`vocab_id` integer NOT NULL,
	FOREIGN KEY (`vocab_id`) REFERENCES `vocab`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vocab_instances_citation_unique` ON `vocab_instances` (`citation`);