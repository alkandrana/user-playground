import { drizzle } from 'drizzle-orm/libsql';
import { vocab, languages } from "../db/schema.js";
import { eq } from 'drizzle-orm';
import 'dotenv/config';

const db = drizzle(process.env.DB_FILE_NAME);

export const getAllVocab = async (req, res) => {
    const vocabList = await db.select().from(vocab);
    return res.json(vocabList);
}

export const getByLanguage = async (req, res) => {
    const languageId = req.params.languageId;
    const vocabList = await db.select().from(vocab)
        .where(eq(vocab.languageId, languageId));
    return res.json(vocabList);
}

export const getOne = async (req, res) => {
    const id = req.params.id;
    const [vocabItem] = await db.select().from(vocab).where(eq(vocab.id, id));
    return res.json(vocabItem);
}

export const create = async (req, res) => {
    const newVocab = req.body;
    if (!newVocab?.lemma || !newVocab.definition || !newVocab.languageId || !newVocab.pos) {
        return res.status(400).send({
            message: "Lemma, definition, languageId and pos are required fields."
        });
    }
    const response = await db.insert(vocab).values(newVocab);
    if (response?.affectedRows > 0){
        return res.status(201).send({
            message: "Vocab successfully created!",
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