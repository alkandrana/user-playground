import { int, sqliteTable, text, integer} from "drizzle-orm/sqlite-core";
import { sql } from 'drizzle-orm';

export const usersTable = sqliteTable("users_table", {
    id: int().primaryKey({ autoIncrement: true }),
    username: text().notNull().unique(),
    email: text(),
    password: text().notNull(),
    createdAt: integer('created_at', {mode: 'timestamp'}).default(sql`(current_timestamp)`),
    isActive: integer('is_active', {mode: 'boolean'}).default(true),
    refreshToken: text('refresh_token')
});

export const languages = sqliteTable("languages", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull()
});

export const vocab = sqliteTable("vocab", {
    id: int().primaryKey({ autoIncrement: true }),
    lemma: text().notNull().unique(),
    definition: text().notNull(),
    languageId: int('language_id').notNull().references(() => languages.id),
    pos: text('part_of_speech').notNull()
});

export const vocabInstances = sqliteTable("vocab_instances", {
    id: int().primaryKey({ autoIncrement: true }),
    instance: text().notNull(),
    form: text().notNull(),
    startIndex: int('start_index'),
    endIndex: int('end_index'),
    citation: text().notNull().unique(),
    vocabId: int('vocab_id').notNull().references(() => vocab.id),
});

export const comments = sqliteTable("comments", {
    id: int().primaryKey({ autoIncrement: true }),
    citation: text().notNull().unique(),
    note: text().notNull(),
    startIndex: int('start_index'),
    endIndex: int('end_index')
});