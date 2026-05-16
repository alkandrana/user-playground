import { drizzle } from 'drizzle-orm/libsql';
import {comments, languages, usersTable} from "../db/schema.js";
import { eq, and, like } from 'drizzle-orm';
import 'dotenv/config';
import { getCurrentUser } from "../middleware/verifyJWT.js";

const db = drizzle(process.env.DB_FILE_NAME);

export const getCommentsByWork = async (req, res) => {
    // http://localhost:3000/instances/code/VERG AEN
    const code = req.params.code;
    const currentUser = await getCurrentUser(req, res);
    console.log("Current user: ", currentUser);
    const commentList = await db.select().from(comments)
        .where(and(eq(comments.userId, currentUser.id), like(comments.citation, "code%")));
    return res.json(commentList);
}

export const getOne = async (req, res) => {
    const id = req.params.id;
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    const currentUser = await getCurrentUser(req, res);
    if (comment.userId !== currentUser.id){
        return res.sendStatus(403);
    }
    return res.json(comment);
}

export const create = async (req, res) => {
    const comment = req.body;
    if (!comment?.citation || !comment.note) {
        return res.status(400).send({
            message: "Citation and note are required fields."
        });
    }
    const currentUser = await getCurrentUser(req, res);
    comment.userId = currentUser.id;
    const response = await db.insert(comments).values(comment);
    if (response?.affectedRows > 0){
        return res.status(201).send({
            message: "Comment successfully created",
        });
    } else {
        return res.status(500).send({
            error: "Database Error",
            message: "There was a problem creating comment"
        });
    }
}

export const update = async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const currentUser = await getCurrentUser(req, res);
    const commentToUpdate = await db.select().from(comments)
        .where(eq(comments.id, id));
    if(commentToUpdate.userId !== currentUser.id){
        return res.sendStatus(403);
    }
    const response = await db.update(comments).set(data)
        .where(eq(comments.id, id));
    if (response.affectedRows > 0){
        return res.status(200).send({
            message: "Comment successfully updated",
        });
    } else {
        return res.status(500).send({
            error: "Database Error",
            message: "There was a problem updating comment"
        });
    }
}

export const deleteComment = async (req, res) => {
    const id = req.params.id;
    const currentUser = await getCurrentUser(req, res);
    const commentToDelete = await db.select().from(comments)
        .where(eq(comments.id, id));
    if (commentToDelete.userId !== currentUser.id) return res.sendStatus(403);
    const response = await db.delete(comments).where(eq(comments.id, id));
    if (response.affectedRows > 0){
        return res.status(200).send({
            message: "Comment successfully deleted",
        });
    } else {
        return res.status(500).send({
            error: "Database Error",
            message: "There was a problem deleting comment"
        });
    }
}