import { Router } from 'express';
import { getAllUsers, getCurrentUser } from "../controllers/users.controller.js";

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.get('/profile', getCurrentUser);

export default userRouter;