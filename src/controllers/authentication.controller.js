import bcrypt from 'bcrypt';
import { drizzle } from 'drizzle-orm/libsql';
import { usersTable } from "../db/schema.js";
import { eq } from 'drizzle-orm';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

const db = drizzle(process.env.DB_FILE_NAME);

export const register = async (req, res) => {
    const user = req.body;
    console.log("Data received: ", user);
    if (!user.username || !user.password) {
        return res.status(400).send({
            message: 'Username and password are required',
        });
    }
    // check for duplicates since this is a register route
    // getByName
    const duplicate = await db.select().from(usersTable)
        .where(eq(usersTable.username, user.username));
    if (duplicate.length > 0){
        return res.sendStatus(409);
    }
    // checkIsEmail()
    let pattern = /[A-Za-z0-9.]+@[A-Za-z]+.[a-z]{3}/;
    if (!user.email && user.username.match(pattern)){
        user.email = user.username;
    }
    try {
        user.password = await bcrypt.hash(user.password, 10);
        const response = await db.insert(usersTable).values(user);
        return res.status(201).json({
            status: `Rows affected: ${response.rowsAffected}`,
            message: "User registered successfully"
        });
    } catch (err){
        return res.status(500).send({
            message: err.message,
        });
    }
}

export const authorize = async (req, res) => {
    const user = req.body;
    console.log("Data received: ", user);
    // validateReq()
    if (!user.username || !user.password) {
        return res.status(400).send({
            message: 'Username and password is required',
        });
    }
    // getMatch()
    const [userMatch] = await db.select().from(usersTable).where(eq(usersTable.username, user.username));
    console.log("Match found: ", userMatch);
    if (!userMatch) {
        return res.sendStatus(401);
    }

    const match = await bcrypt.compare(user.password, userMatch.password);
    if (match){
        // makeToken(username, code, duration)
        const accessToken = await jwt.sign(
            {"username": userMatch.username},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m'}
        );
        const refreshToken = await jwt.sign(
            { "username": userMatch.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        const response = await db.update(usersTable).set({refreshToken: refreshToken})
            .where(eq(usersTable.id, userMatch.id));
        console.log("Attempting to save token: ", response);
        if (response.rowsAffected > 0) {
            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            res.json({accessToken});
        }
    } else {
        res.sendStatus(401);
    }
}

export const refreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    console.log("JWT cookie in request: ", cookies.jwt);
    const refreshToken = cookies.jwt;
    // getMatch
    const [userMatch] = await db.select().from(usersTable)
        .where(eq(usersTable.refreshToken, refreshToken));
    console.log("User from database: ", userMatch);
    if (!userMatch) {
        return res.status(403).json({
            message: "Token not found."
        });
    }
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || userMatch.username !== decoded.username) {
                return res.sendStatus(403);
            }
            const accessToken = makeToken(decoded.username, process.env.ACCESS_TOKEN_SECRET, '5m');
            return res.json({accessToken});
        }
    )
}

export const logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    const [userMatch] = await db.select().from(usersTable)
        .where(eq(usersTable.refreshToken, refreshToken));
    if (!userMatch) {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204);
    }
    const response = await db.update(usersTable).set({refreshToken: ''})
        .where(eq(usersTable.id, userMatch.id));
    if (response.rowsAffected > 0){
        res.clearCookie('jwt', { httpOnly: true });
        res.sendStatus(204);
    }
}

function makeToken(username, code, duration){
    return jwt.sign(
        { "username": username },
        code,
        { expiresIn: duration }
    );
}