import express from 'express';
import cors from 'cors';
import verifyJWT from './middleware/verifyJWT.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authentication.router.js';
import userRouter from "./routes/users.router.js";
import vocabRouter from "./routes/vocab.router.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use(verifyJWT);
app.use('/users', userRouter);
app.use('/vocab', vocabRouter);

app.get('/', (req, res) => {
    res.send("<h1>Welcome to the user portal.</h1>");
});

app.listen(3000, () => console.log('Server is running on port 3000'));
