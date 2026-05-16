import { Router } from 'express';
import {getInstancesByWork, getOne, create, update, deleteInstance } from "../controllers/instances.controller.js";

const instanceRouter = Router();

instanceRouter.get('/code/:code', getInstancesByWork);
instanceRouter.get('/:id', getOne);
instanceRouter.post('/', create);
instanceRouter.patch('/:id', update);
instanceRouter.delete('/:id', deleteInstance);

export default instanceRouter;