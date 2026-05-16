import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import {usersTable} from "../db/schema.js";
import {eq} from "drizzle-orm";

const db = drizzle(process.env.DB_FILE_NAME);

export default function (req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.sendStatus(401);
    }
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }
        req.username = decoded.username;
        next();
    });
}

export async function getCurrentUser(req, res) {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    const [currentUser] = await db.select().from(usersTable)
        .where(eq(usersTable.refreshToken, refreshToken));
    if (!currentUser) return res.sendStatus(403);
    return currentUser;
}