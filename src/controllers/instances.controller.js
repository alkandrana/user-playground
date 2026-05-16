import { drizzle } from 'drizzle-orm/libsql';
import {vocabInstances, languages, usersTable} from "../db/schema.js";
import { eq, and, like } from 'drizzle-orm';
import 'dotenv/config';
import { getCurrentUser } from "../middleware/verifyJWT.js";

const db = drizzle(process.env.DB_FILE_NAME);

export const getInstancesByWork = async (req, res) => {
    // http://localhost:3000/instances/code/VERG AEN
    const code = req.params.code;
    const work = await fetch(`http://localhost:3001/code/${code}`);
    const currentUser = await getCurrentUser(req, res);
    console.log("Current user: ", currentUser);
    const instanceList = await db.select().from(vocabInstances)
        .where(and(eq(vocabInstances.userId, currentUser.id), like(vocabInstances.citation, "code%")));
    return res.json(instanceList);
}

export const getOne = async (req, res) => {
    const id = req.params.id;
    const [vocabInstance] = await db.select().from(vocabInstances).where(eq(vocabInstances.id, id));
    const currentUser = await getCurrentUser(req, res);
    if (vocabInstance.userId !== currentUser.id){
        return res.sendStatus(403);
    }
    return res.json(vocabInstance);
}

export const create = async (req, res) => {
    const newInstance = req.body;
    if (!newInstance?.instance || !newInstance.form || !newInstance.citation || !newInstance.vocabId) {
        return res.status(400).send({
            message: "Instance, form, citation and vocabId are required fields."
        });
    }
    const currentUser = await getCurrentUser(req, res);
    newInstance.userId = currentUser.id;
    const response = await db.insert(vocabInstances).values(newInstance);
    if (response?.affectedRows > 0){
        return res.status(201).send({
            message: "Vocab successfully created",
        });
    } else {
        return res.status(500).send({
            error: "Database Error",
            message: "There was a problem creating vocab"
        });
    }
}

export const update = async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const currentUser = await getCurrentUser(req, res);
    const vocabToUpdate = await db.select().from(vocabInstances).where(eq(vocabInstances.id, id));
    if(vocabToUpdate.userId !== currentUser.id){
        return res.sendStatus(403);
    }
    const response = await db.update(vocabInstances).set(data).where(eq(vocabInstances.id, id));
    if (response.affectedRows > 0){
        return res.status(200).send({
            message: "Instance successfully updated",
        });
    } else {
        return res.status(500).send({
            error: "Database Error",
            message: "There was a problem updating instance"
        });
    }
}

export const deleteInstance = async (req, res) => {
    const id = req.params.id;
    const currentUser = await getCurrentUser(req, res);
    const vocabToDelete = await db.select().from(vocabInstances).where(eq(vocabInstances.id, id));
    if (vocabToDelete.userId !== currentUser.id) return res.sendStatus(403);
    const response = await db.delete(vocabInstances).where(eq(vocabInstances.id, id));
    if (response.affectedRows > 0){
        return res.status(200).send({
            message: "Instance successfully deleted",
        });
    } else {
        return res.status(500).send({
            error: "Database Error",
            message: "There was a problem deleting instance"
        });
    }
}