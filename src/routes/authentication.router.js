import { Router } from 'express';
import {register, authorize, refreshToken, logout } from '../controllers/authentication.controller.js';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/', authorize);
authRouter.get('/refresh', refreshToken);
authRouter.get('/logout', logout);

export default authRouter;