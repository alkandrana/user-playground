import { Router } from 'express';
import { getAllUsers } from "../controllers/users.controller.js";

const userRouter = Router();

userRouter.get('/', getAllUsers);

export default userRouter;