import { Router } from 'express';
import {getAllVocab, getByLanguage, getOne, create, update, deleteVocab } from "../controllers/vocab.controller.js";

const vocabRouter = Router();

vocabRouter.get('/', getAllVocab);
vocabRouter.get('/language/:languageId', getByLanguage);
vocabRouter.get('/:id', getOne);
vocabRouter.post('/', create);
vocabRouter.patch('/:id', update);
vocabRouter.delete('/:id', deleteVocab);

export default vocabRouter;