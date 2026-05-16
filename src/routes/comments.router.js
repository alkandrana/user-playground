import { Router } from 'express';
import { getCommentsByWork, getOne, create, update, deleteComment }
    from "../controllers/comments.controller.js";

const commentRouter = Router();

commentRouter.get('/code/:code', getCommentsByWork);
commentRouter.get('/:id', getOne);
commentRouter.post('/', create);
commentRouter.patch('/:id', update);
commentRouter.delete('/:id', deleteComment);

export default commentRouter;