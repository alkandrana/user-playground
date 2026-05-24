import { drizzle } from 'drizzle-orm/libsql';
import {vocab, languages, usersTable} from "../db/schema.js";
import { eq, and } from 'drizzle-orm';
import 'dotenv/config';
import { getCurrentUser } from "../middleware/verifyJWT.js";

const db = drizzle(process.env.DB_FILE_NAME);

export const getAllVocab = async (req, res) => {
    console.log("Fetching vocab:");
    const currentUser = await getCurrentUser(req, res);
    const vocabList = await db.select().from(vocab)
        .where(eq(vocab.userId, currentUser.id));
    return res.json(vocabList);
}

export const getByLanguage = async (req, res) => {
    const languageId = req.params.languageId;
    const currentUser = await getCurrentUser(req, res);
    const vocabList = await db.select().from(vocab)
        .where(and(eq(vocab.languageId, languageId), eq(vocab.userId, currentUser.id)));
    return res.json(vocabList);
}

export const getOne = async (req, res) => {
    const id = req.params.id;
    const [vocabItem] = await db.select().from(vocab).where(eq(vocab.id, id));
    const currentUser = await getCurrentUser(req, res);
    if (vocabItem.userId !== currentUser.id){
        return res.sendStatus(403);
    }
    return res.json(vocabItem);
}

export const create = async (req, res) => {
    console.log("JSON data sent: ", req.body);
    const { lemma, definition, languageId, pos } = req.body;
    if (!lemma || !definition || !languageId || !pos) {
        return res.status(400).send({
            message: "Lemma, definition, languageId and pos are required fields."
        });
    }
    const currentUser = await getCurrentUser(req, res);
    console.log("Retrieved current user: ", currentUser);
    const newVocab = {
        lemma,
        definition,
        languageId,
        pos,
        userId: currentUser.id,
    };
    console.log("Preparing to insert Vocab: ", newVocab);
    const [response] = await db.insert(vocab).values(newVocab);
    console.log(response);
    if (response){
        return res.status(201).send({
            message: "Vocab successfully created",
            data: response
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
    const vocabToUpdate = await db.select().from(vocab).where(eq(vocab.id, id));
    if(vocabToUpdate.userId !== currentUser.id){
        return res.sendStatus(403);
    }
    const response = await db.update(vocab).set(data).where(eq(vocab.id, id));
    if (response.affectedRows > 0){
        return res.status(200).send({
            message: "Vocab successfully updated",
        });
    } else {
        return res.status(500).send({
            error: "Database Error",
            message: "There was a problem updating vocab"
        });
    }
}

export const deleteVocab = async (req, res) => {
    const id = req.params.id;
    const currentUser = await getCurrentUser(req, res);
    const vocabToDelete = await db.select().from(vocab).where(eq(vocab.id, id));
    if (vocabToDelete.userId !== currentUser.id) return res.sendStatus(403);
    const response = await db.delete(vocab).where(eq(vocab.id, id));
    if (response.affectedRows > 0){
        return res.status(200).send({
            message: "Vocab successfully deleted",
        });
    } else {
        return res.status(500).send({
            error: "Database Error",
            message: "There was a problem deleting vocab"
        });
    }
}