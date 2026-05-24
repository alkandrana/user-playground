PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_vocab` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lemma` text NOT NULL,
	`definition` text NOT NULL,
	`languageId` integer NOT NULL,
	`userId` integer,
	`pos` text NOT NULL,
	FOREIGN KEY (`languageId`) REFERENCES `languages`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_vocab`("id", "lemma", "definition", "languageId", "userId", "pos") SELECT "id", "lemma", "definition", "languageId", "userId", "pos" FROM `vocab`;--> statement-breakpoint
DROP TABLE `vocab`;--> statement-breakpoint
ALTER TABLE `__new_vocab` RENAME TO `vocab`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `vocab_lemma_unique` ON `vocab` (`lemma`);