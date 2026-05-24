import {Router} from "express";
import { addFile } from "../controllers/files.controller.js"

const fileRouter = Router();
fileRouter.post('/', addFile);

export default fileRouter;
