import express from 'express';
import cors from 'cors';
import verifyJWT from './middleware/verifyJWT.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authentication.router.js';
import userRouter from "./routes/users.router.js";
import vocabRouter from "./routes/vocab.router.js";
import instanceRouter from "./routes/instances.router.js";
import commentRouter from "./routes/comments.router.js";
import fileRouter from "./routes/files.router.js";
import fileUpload from "express-fileupload";

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("<h1>Welcome to the user portal.</h1>");
});

app.use('/auth', authRouter);
app.use(fileUpload());
app.use('/files', fileRouter);
app.use(verifyJWT);
app.use('/users', userRouter);
app.use('/vocab', vocabRouter);
app.use('/instances', instanceRouter);
app.use('/comments', commentRouter);





app.listen(3000, () => console.log('Server is running on port 3000'));
