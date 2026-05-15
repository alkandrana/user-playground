import { drizzle } from 'drizzle-orm/libsql';
import { usersTable } from "../db/schema.js";
import { eq } from 'drizzle-orm';
import 'dotenv/config';

const db = drizzle(process.env.DB_FILE_NAME);

export const getAllUsers = async (req, res) => {
    const users = await db.select().from(usersTable);
    res.json(users);
}